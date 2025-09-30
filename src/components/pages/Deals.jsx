import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import DealPipeline from "@/components/organisms/DealPipeline";
import DealModal from "@/components/organisms/DealModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import { dealService } from "@/services/api/dealService";
import { leadService } from "@/services/api/leadService";
import { toast } from "react-toastify";

const Deals = () => {
  const { toggleMobileSidebar } = useOutletContext();
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
const [leads, setLeads] = useState([]);
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [dealsData, leadsData] = await Promise.all([
        dealService.getAll(),
        leadService.getAll()
      ]);
      setDeals(dealsData);
      setLeads(leadsData);
    } catch (err) {
      setError(err.message || "Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter deals based on search and filters
useEffect(() => {
    let filtered = deals;

    if (searchTerm) {
      filtered = filtered.filter(deal =>
        deal.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (stageFilter !== "all") {
      filtered = filtered.filter(deal => deal.stage === stageFilter);
    }

    if (assigneeFilter !== "all") {
      filtered = filtered.filter(deal => deal.assigneeId === parseInt(assigneeFilter));
    }

    setFilteredDeals(filtered);
  }, [deals, searchTerm, stageFilter, assigneeFilter]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddDeal = () => {
    setEditingDeal(null);
    setIsModalOpen(true);
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };

  const handleSaveDeal = async (dealData) => {
    try {
      if (editingDeal) {
        await dealService.update(editingDeal.Id, dealData);
        toast.success("Deal updated successfully!");
      } else {
        await dealService.create(dealData);
        toast.success("Deal created successfully!");
      }
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to save deal");
    }
  };

  const handleDeleteDeal = async (id) => {
    if (!confirm("Are you sure you want to delete this deal?")) return;
    
    try {
      await dealService.delete(id);
      toast.success("Deal deleted successfully!");
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to delete deal");
    }
  };

  const handleMoveStage = async (dealId, newStage) => {
    try {
      await dealService.moveStage(dealId, newStage);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to move deal");
    }
  };

  const headerActions = [
    {
      label: "Add Deal",
      icon: "Plus",
      onClick: handleAddDeal,
      variant: "primary"
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const pipelineValue = filteredDeals
    .filter(deal => !["closed-won", "closed-lost"].includes(deal.stage))
    .reduce((sum, deal) => sum + deal.value, 0);

  if (loading) return <Loading type="pipeline" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <Header 
        title="Deals Pipeline"
        onMobileMenuToggle={toggleMobileSidebar}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        actions={headerActions}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="text-sm text-slate-600 mb-1">Total Deals</div>
          <div className="text-2xl font-bold gradient-text">{filteredDeals.length}</div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="text-sm text-slate-600 mb-1">Total Value</div>
          <div className="text-2xl font-bold gradient-text">{formatCurrency(totalValue)}</div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="text-sm text-slate-600 mb-1">Pipeline Value</div>
          <div className="text-2xl font-bold gradient-text">{formatCurrency(pipelineValue)}</div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="text-sm text-slate-600 mb-1">Win Rate</div>
          <div className="text-2xl font-bold gradient-text">
            {deals.length > 0 ? Math.round((deals.filter(d => d.stage === "closed-won").length / deals.length) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Filters */}
<div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Stage:</label>
          <Select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="min-w-[140px]"
          >
            <option value="all">All Stages</option>
            <option value="prospecting">Prospecting</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed-won">Closed Won</option>
            <option value="closed-lost">Closed Lost</option>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Assignee:</label>
          <Select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="min-w-[140px]"
          >
            <option value="all">All Assignees</option>
            {[...new Set(deals.filter(deal => deal.assigneeId && deal.assigneeName).map(deal => ({ id: deal.assigneeId, name: deal.assigneeName })))].reduce((unique, assignee) => {
              if (!unique.find(u => u.id === assignee.id)) {
                unique.push(assignee);
              }
              return unique;
            }, []).map(assignee => (
              <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
            ))}
          </Select>
        </div>

        <div className="text-sm text-slate-500 ml-auto">
          Showing {filteredDeals.length} of {deals.length} deals
        </div>
      </div>

      {/* Pipeline */}
      {filteredDeals.length === 0 ? (
        <Empty
          title="No deals found"
          description={deals.length === 0 
            ? "Start tracking opportunities by creating your first deal"
            : "No deals match your current filters. Try adjusting your search or filters."
          }
          actionLabel="Create Deal"
          onAction={handleAddDeal}
          icon="Target"
        />
      ) : (
        <DealPipeline
          deals={filteredDeals}
          onMoveStage={handleMoveStage}
          onEdit={handleEditDeal}
          onDelete={handleDeleteDeal}
        />
      )}

      {/* Deal Modal */}
      <DealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDeal}
        deal={editingDeal}
        leads={leads}
      />
    </div>
  );
};

export default Deals;