import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { toast } from "react-toastify";

const DealPipeline = ({ deals, onMoveStage, onEdit, onDelete }) => {
  const stages = [
    { id: "prospecting", name: "Prospecting", color: "primary" },
    { id: "proposal", name: "Proposal", color: "warning" },
    { id: "negotiation", name: "Negotiation", color: "secondary" },
    { id: "closed-won", name: "Closed Won", color: "success" },
    { id: "closed-lost", name: "Closed Lost", color: "danger" }
  ];

  const getDealsByStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const getStageTotal = (stageId) => {
    return getDealsByStage(stageId).reduce((total, deal) => total + deal.value, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleMoveStage = (dealId, newStage) => {
    onMoveStage(dealId, newStage);
    toast.success(`Deal moved to ${stages.find(s => s.id === newStage)?.name}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {stages.map((stage) => {
        const stageDeals = getDealsByStage(stage.id);
        const stageTotal = getStageTotal(stage.id);

        return (
          <div key={stage.id} className="space-y-4">
            {/* Stage Header */}
            <div className="glass rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-900">{stage.name}</h3>
                <Badge variant={stage.color}>{stageDeals.length}</Badge>
              </div>
              <div className="text-lg font-bold gradient-text">
                {formatCurrency(stageTotal)}
              </div>
            </div>

            {/* Deals */}
            <div className="space-y-3 min-h-[400px]">
              {stageDeals.map((deal) => (
                <Card key={deal.Id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-slate-900 text-sm leading-tight">
                        {deal.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(deal)}
                        >
                          <ApperIcon name="Edit2" className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(deal.Id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <ApperIcon name="Trash2" className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Value and Probability */}
                    <div className="space-y-2">
                      <div className="text-lg font-bold text-primary">
                        {formatCurrency(deal.value)}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          {deal.probability}%
                        </span>
                      </div>
                    </div>

                    {/* Expected Close */}
                    <div className="text-xs text-slate-500">
                      Expected: {format(new Date(deal.expectedClose), "MMM d")}
                    </div>

                    {/* Stage Movement */}
                    {stage.id !== "closed-won" && stage.id !== "closed-lost" && (
                      <div className="flex gap-1 pt-2">
                        {stage.id === "prospecting" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveStage(deal.Id, "proposal")}
                            className="text-xs flex-1"
                          >
                            <ApperIcon name="ArrowRight" className="h-3 w-3 mr-1" />
                            Proposal
                          </Button>
                        )}
                        {stage.id === "proposal" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMoveStage(deal.Id, "negotiation")}
                              className="text-xs flex-1"
                            >
                              <ApperIcon name="ArrowRight" className="h-3 w-3 mr-1" />
                              Negotiate
                            </Button>
                          </>
                        )}
                        {stage.id === "negotiation" && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleMoveStage(deal.Id, "closed-won")}
                              className="text-xs flex-1"
                            >
                              <ApperIcon name="Check" className="h-3 w-3 mr-1" />
                              Won
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleMoveStage(deal.Id, "closed-lost")}
                              className="text-xs flex-1"
                            >
                              <ApperIcon name="X" className="h-3 w-3 mr-1" />
                              Lost
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DealPipeline;