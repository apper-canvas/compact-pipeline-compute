import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import QuickActions from "@/components/molecules/QuickActions";
import { format } from "date-fns";
import { toast } from "react-toastify";

const LeadCard = ({ lead, onUpdateStatus, onEdit, onDelete }) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "new": return "primary";
      case "qualified": return "success";
      case "contacted": return "warning";
      case "lost": return "danger";
      default: return "secondary";
    }
  };

  const getSourceIcon = (source) => {
    switch (source?.toLowerCase()) {
      case "website": return "Globe";
      case "email": return "Mail";
      case "phone": return "Phone";
      case "referral": return "Users";
      case "social": return "Share2";
      default: return "User";
    }
  };

  const handleQuickCall = () => {
    toast.success(`Calling ${lead.firstName} ${lead.lastName}...`);
  };

  const handleQuickEmail = () => {
    toast.success(`Email drafted to ${lead.email}`);
  };

  const handleScheduleFollowUp = () => {
    toast.success("Follow-up scheduled for tomorrow");
  };

  const quickActions = [
    {
      label: "Call",
      icon: "Phone",
      onClick: handleQuickCall,
      variant: "primary"
    },
    {
      label: "Email",
      icon: "Mail",
      onClick: handleQuickEmail,
      variant: "secondary"
    },
    {
      label: "Follow Up",
      icon: "Calendar",
      onClick: handleScheduleFollowUp,
      variant: "outline"
    }
  ];

  return (
    <Card className="h-full">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-900">
                {lead.firstName} {lead.lastName}
              </h3>
              <Badge variant={getStatusVariant(lead.status)}>
                {lead.status}
              </Badge>
            </div>
<p className="text-slate-600 font-medium">{lead.company}</p>
          </div>
          {lead.productName && (
            <div className="flex items-center gap-2">
              <ApperIcon name="Building" size={16} className="text-slate-400" />
              <p className="text-slate-600 text-sm">
                <span className="font-medium">Product:</span> {lead.productName}
              </p>
            </div>
          )}
          {lead.rri && (
            <div className="flex items-center gap-2">
              <ApperIcon name="TrendingUp" size={16} className="text-slate-400" />
              <p className="text-slate-600 text-sm">
                <span className="font-medium">RRI:</span> {lead.rri}
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(lead)}
            >
              <ApperIcon name="Edit2" className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(lead.Id)}
              className="text-red-500 hover:text-red-600"
            >
              <ApperIcon name="Trash2" className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="Mail" className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600">{lead.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="Phone" className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600">{lead.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name={getSourceIcon(lead.source)} className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600">Source: {lead.source}</span>
</div>
        </div>

        {/* Dates */}
        <div className="space-y-2 mb-4 text-xs text-slate-500">
          <div>Created: {format(new Date(lead.createdAt), "MMM d, yyyy")}</div>
          {lead.lastContact && (
            <div>Last Contact: {format(new Date(lead.lastContact), "MMM d, yyyy")}</div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto">
          <QuickActions actions={quickActions} />
        </div>
      </div>
    </Card>
  );
};

export default LeadCard;