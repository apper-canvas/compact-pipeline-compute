import React, { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const LeadModal = ({ isOpen, onClose, onSave, lead = null }) => {
const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    productName: "",
    rri: "",
    status: "new",
    source: "website"
  });

  useEffect(() => {
    if (lead) {
      setFormData({
firstName: lead.firstName || "",
        lastName: lead.lastName || "",
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        productName: lead.productName || "",
        rri: lead.rri || "",
        status: lead.status || "new",
        source: lead.source || "website"
      });
    } else {
      setFormData({
        firstName: "",
lastName: "",
        email: "",
        phone: "",
        company: "",
        productName: "",
        rri: "",
        status: "new",
        source: "website"
      });
    }
  }, [lead, isOpen]);

  const statusOptions = [
    { value: "new", label: "New" },
    { value: "qualified", label: "Qualified" },
    { value: "contacted", label: "Contacted" },
    { value: "lost", label: "Lost" }
  ];

  const sourceOptions = [
    { value: "website", label: "Website" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "referral", label: "Referral" },
    { value: "social", label: "Social Media" }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div
        className="glass rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold gradient-text">
                    {lead ? "Edit Lead" : "Add New Lead"}
                </h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    <ApperIcon name="X" className="h-5 w-5" />
                </Button>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required />
                    <FormField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required />
                    <FormField
                        label="Phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange} />
                </div>
                <FormField
                    label="Company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange} />
                <FormField label="Product Name" htmlFor="productName">
                    <input
                        type="text"
                        id="productName"
                        name="productName"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter product name"
                        value={formData.productName}
                        onChange={handleChange} />
                </FormField>
                <FormField label="RRI" htmlFor="rri">
                    <input
                        type="text"
                        id="rri"
                        name="rri"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter RRI"
                        value={formData.rri}
                        onChange={handleChange} />
                </FormField>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        label="Status"
                        type="select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        options={statusOptions} />
                    <FormField
                        label="Source"
                        type="select"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        options={sourceOptions} />
                </div>
                {/* Actions */}
                <div className="flex items-center gap-3 pt-6">
                    <Button type="submit" className="flex-1">
                        <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                        {lead ? "Update Lead" : "Create Lead"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel
                                      </Button>
                </div>
            </form>
        </div>
    </div>
</div>
  );
};

export default LeadModal;