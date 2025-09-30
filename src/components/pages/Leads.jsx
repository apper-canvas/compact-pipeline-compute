import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import LeadCard from "@/components/organisms/LeadCard";
import LeadModal from "@/components/organisms/LeadModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import { leadService } from "@/services/api/leadService";
import { toast } from "react-toastify";

const Leads = () => {
  const { toggleMobileSidebar } = useOutletContext();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await leadService.getAll();
      setLeads(data);
    } catch (err) {
      setError(err.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  // Filter leads based on search and filters
  useEffect(() => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.productName && lead.productName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (sourceFilter !== "all") {
      filtered = filtered.filter(lead => lead.source === sourceFilter);
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddLead = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleSaveLead = async (leadData) => {
    try {
      if (editingLead) {
        await leadService.update(editingLead.Id, leadData);
        toast.success("Lead updated successfully!");
      } else {
        await leadService.create(leadData);
        toast.success("Lead created successfully!");
      }
      loadLeads();
    } catch (err) {
      toast.error(err.message || "Failed to save lead");
    }
  };

  const handleDeleteLead = async (id) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    
    try {
      await leadService.delete(id);
      toast.success("Lead deleted successfully!");
      loadLeads();
    } catch (err) {
      toast.error(err.message || "Failed to delete lead");
    }
  };

  const handleUpdateStatus = async (lead, newStatus) => {
    try {
      await leadService.update(lead.Id, { ...lead, status: newStatus });
      toast.success(`Lead status updated to ${newStatus}`);
      loadLeads();
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const headerActions = [
    {
      label: "Add Lead",
      icon: "Plus",
      onClick: handleAddLead,
      variant: "primary"
    }
  ];

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadLeads} />;

  return (
    <div className="space-y-6">
      <Header 
        title="Leads"
        onMobileMenuToggle={toggleMobileSidebar}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        actions={headerActions}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Status:</label>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[120px]"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="qualified">Qualified</option>
            <option value="contacted">Contacted</option>
            <option value="lost">Lost</option>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Source:</label>
          <Select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="min-w-[120px]"
          >
            <option value="all">All Sources</option>
            <option value="website">Website</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="referral">Referral</option>
            <option value="social">Social Media</option>
          </Select>
        </div>

        <div className="text-sm text-slate-500 ml-auto">
          Showing {filteredLeads.length} of {leads.length} leads
        </div>
      </div>

      {/* Leads Grid */}
      {filteredLeads.length === 0 ? (
        <Empty
          title="No leads found"
          description={leads.length === 0 
            ? "Start building your sales pipeline by adding your first lead"
            : "No leads match your current filters. Try adjusting your search or filters."
          }
          actionLabel="Add First Lead"
          onAction={handleAddLead}
          icon="Users"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.Id}
              lead={lead}
              onUpdateStatus={(newStatus) => handleUpdateStatus(lead, newStatus)}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
            />
          ))}
        </div>
      )}

      {/* Lead Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLead}
        lead={editingLead}
      />
    </div>
  );
};

export default Leads;