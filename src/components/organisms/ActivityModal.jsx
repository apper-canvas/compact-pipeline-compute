import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const ActivityModal = ({ isOpen, onClose, onSave, activity = null, leads = [], deals = [] }) => {
  const [formData, setFormData] = useState({
    leadId: "",
    dealId: "",
    type: "call",
    subject: "",
    notes: "",
    dueDate: "",
    completed: false
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        leadId: activity.leadId || "",
        dealId: activity.dealId || "",
        type: activity.type || "call",
        subject: activity.subject || "",
        notes: activity.notes || "",
        dueDate: activity.dueDate ? format(new Date(activity.dueDate), "yyyy-MM-dd'T'HH:mm") : "",
        completed: activity.completed || false
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);

      setFormData({
        leadId: "",
        dealId: "",
        type: "call",
        subject: "",
        notes: "",
        dueDate: format(tomorrow, "yyyy-MM-dd'T'HH:mm"),
        completed: false
      });
    }
  }, [activity, isOpen]);

  const typeOptions = [
    { value: "call", label: "Phone Call" },
    { value: "email", label: "Email" },
    { value: "meeting", label: "Meeting" },
    { value: "task", label: "Task" },
    { value: "note", label: "Note" }
  ];

  const leadOptions = leads.map(lead => ({
    value: lead.Id.toString(),
    label: `${lead.firstName} ${lead.lastName} - ${lead.company}`
  }));

  const dealOptions = deals.map(deal => ({
    value: deal.Id.toString(),
    label: deal.title
  }));

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
              {activity ? "Edit Activity" : "Add New Activity"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Type"
                type="select"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={typeOptions}
              />
              <FormField
                label="Due Date"
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            <FormField
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief description of the activity"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Related Lead"
                type="select"
                name="leadId"
                value={formData.leadId}
                onChange={handleChange}
                options={leadOptions}
              />
              <FormField
                label="Related Deal"
                type="select"
                name="dealId"
                value={formData.dealId}
                onChange={handleChange}
                options={dealOptions}
              />
            </div>

            <FormField
              label="Notes"
              type="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional details about the activity"
            />

            {activity && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="completed"
                  name="completed"
                  checked={formData.completed}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor="completed" className="text-sm font-medium text-slate-700">
                  Mark as completed
                </label>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-6">
              <Button type="submit" className="flex-1">
                <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                {activity ? "Update Activity" : "Create Activity"}
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

export default ActivityModal;