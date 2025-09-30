import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const DealModal = ({ isOpen, onClose, onSave, deal = null, leads = [] }) => {
  const [formData, setFormData] = useState({
    leadId: "",
    title: "",
    value: "",
    stage: "prospecting",
    probability: "50",
    expectedClose: ""
  });

  useEffect(() => {
    if (deal) {
      setFormData({
        leadId: deal.leadId?.toString() || "",
        title: deal.title || "",
        value: deal.value?.toString() || "",
        stage: deal.stage || "prospecting",
        probability: deal.probability?.toString() || "50",
        expectedClose: deal.expectedClose ? format(new Date(deal.expectedClose), "yyyy-MM-dd") : ""
      });
    } else {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      setFormData({
        leadId: "",
        title: "",
        value: "",
        stage: "prospecting",
        probability: "50",
        expectedClose: format(nextMonth, "yyyy-MM-dd")
      });
    }
  }, [deal, isOpen]);

  const stageOptions = [
    { value: "prospecting", label: "Prospecting" },
    { value: "proposal", label: "Proposal" },
    { value: "negotiation", label: "Negotiation" },
    { value: "closed-won", label: "Closed Won" },
    { value: "closed-lost", label: "Closed Lost" }
  ];

  const leadOptions = leads.map(lead => ({
    value: lead.Id.toString(),
    label: `${lead.firstName} ${lead.lastName} - ${lead.company}`
  }));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      value: parseFloat(formData.value) || 0,
      probability: parseInt(formData.probability) || 0
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold gradient-text">
              {deal ? "Edit Deal" : "Add New Deal"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Deal Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Software License - Acme Corp"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Deal Value ($)"
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="10000"
                min="0"
                step="0.01"
                required
              />
              <FormField
                label="Probability (%)"
                type="number"
                name="probability"
                value={formData.probability}
                onChange={handleChange}
                min="0"
                max="100"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Stage"
                type="select"
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                options={stageOptions}
              />
              <FormField
                label="Expected Close Date"
                type="date"
                name="expectedClose"
                value={formData.expectedClose}
                onChange={handleChange}
                required
              />
            </div>

            <FormField
              label="Related Lead"
              type="select"
              name="leadId"
              value={formData.leadId}
              onChange={handleChange}
              options={leadOptions}
            />

            {/* Actions */}
            <div className="flex items-center gap-3 pt-6">
              <Button type="submit" className="flex-1">
                <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                {deal ? "Update Deal" : "Create Deal"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DealModal;