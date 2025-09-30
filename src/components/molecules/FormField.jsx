import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  options = [], 
  error, 
  className,
  ...props 
}) => {
  const renderInput = () => {
    if (type === "select") {
      return (
        <Select error={error} {...props}>
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    }
    
    if (type === "textarea") {
      return (
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
            error && "border-red-500 focus:ring-red-500"
          )}
          {...props}
        />
      );
    }
    
    return <Input type={type} error={error} {...props} />;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      {renderInput()}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;