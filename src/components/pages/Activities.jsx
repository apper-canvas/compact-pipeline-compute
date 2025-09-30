import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import ActivityList from "@/components/organisms/ActivityList";
import ActivityModal from "@/components/organisms/ActivityModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import { activityService } from "@/services/api/activityService";
import { leadService } from "@/services/api/leadService";
import { dealService } from "@/services/api/dealService";
import { toast } from "react-toastify";

// Initialize ApperClient for Edge function calls
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const Activities = () => {
  const { toggleMobileSidebar } = useOutletContext();
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [activitiesData, leadsData, dealsData] = await Promise.all([
        activityService.getAll(),
        leadService.getAll(),
        dealService.getAll()
      ]);
      setActivities(activitiesData);
      setLeads(leadsData);
      setDeals(dealsData);
    } catch (err) {
      setError(err.message || "Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter activities based on search and filters
  useEffect(() => {
    let filtered = activities;

    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(activity => activity.type === typeFilter);
    }

    if (statusFilter === "completed") {
      filtered = filtered.filter(activity => activity.completed);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter(activity => !activity.completed);
    }

    // Sort by due date
    filtered.sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    setFilteredActivities(filtered);
  }, [activities, searchTerm, typeFilter, statusFilter]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddActivity = () => {
    setEditingActivity(null);
    setIsModalOpen(true);
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleSaveActivity = async (activityData) => {
    try {
      if (editingActivity) {
        await activityService.update(editingActivity.Id, activityData);
        toast.success("Activity updated successfully!");
      } else {
        await activityService.create(activityData);
        toast.success("Activity created successfully!");
      }
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to save activity");
    }
  };

  const handleDeleteActivity = async (id) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    
    try {
      await activityService.delete(id);
      toast.success("Activity deleted successfully!");
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to delete activity");
    }
  };

const handleMarkComplete = async (id) => {
    try {
      const result = await activityService.markComplete(id);
      
      // If this was a Phone Call activity with notes, call Edge function for follow-up creation
      if (result.triggerFollowUp && result.notes && result.dealId) {
        try {
          const edgeResult = await apperClient.functions.invoke(import.meta.env.VITE_PROCESS_CALL_COMPLETION, {
            body: JSON.stringify({
              activityId: result.Id,
              notes: result.notes,
              dealId: result.dealId
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (edgeResult.success) {
            toast.success(`Activity marked complete. ${edgeResult.data.message}`);
          } else {
            console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_PROCESS_CALL_COMPLETION}. The response body is: ${JSON.stringify(edgeResult)}.`);
            toast.success("Activity marked as complete");
            toast.warning("Follow-up creation failed - please create manually if needed");
          }
        } catch (edgeError) {
          console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_PROCESS_CALL_COMPLETION}. The error is: ${edgeError.message}`);
          toast.success("Activity marked as complete");
          toast.warning("Follow-up creation failed - please create manually if needed");
        }
      } else {
        toast.success("Activity marked as complete");
      }
      
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to mark activity as complete");
    }
  };

  const headerActions = [
    {
      label: "Add Activity",
      icon: "Plus",
      onClick: handleAddActivity,
      variant: "primary"
    }
  ];

  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <Header 
        title="Activities"
        onMobileMenuToggle={toggleMobileSidebar}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        actions={headerActions}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Type:</label>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="min-w-[120px]"
          >
            <option value="all">All Types</option>
            <option value="call">Phone Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
            <option value="task">Task</option>
            <option value="note">Note</option>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Status:</label>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[120px]"
          >
            <option value="all">All Activities</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Select>
        </div>

        <div className="text-sm text-slate-500 ml-auto">
          Showing {filteredActivities.length} of {activities.length} activities
        </div>
      </div>

      {/* Activities List */}
      {filteredActivities.length === 0 ? (
        <Empty
          title="No activities found"
          description={activities.length === 0 
            ? "Stay organized by scheduling your first follow-up activity"
            : "No activities match your current filters. Try adjusting your search or filters."
          }
          actionLabel="Schedule Activity"
          onAction={handleAddActivity}
          icon="Calendar"
        />
      ) : (
        <ActivityList
          activities={filteredActivities}
          onMarkComplete={handleMarkComplete}
          onEdit={handleEditActivity}
          onDelete={handleDeleteActivity}
        />
      )}

      {/* Activity Modal */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveActivity}
        activity={editingActivity}
        leads={leads}
        deals={deals}
      />
    </div>
  );
};

export default Activities;