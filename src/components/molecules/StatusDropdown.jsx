import React from "react";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatusDropdown = ({ 
  value, 
  onChange, 
  options, 
  className,
  showBadge = true,
  ...props 
}) => {
  const getStatusVariant = (status) => {
    const lowerStatus = status?.toLowerCase();
    if (lowerStatus?.includes("new") || lowerStatus?.includes("prospecting")) return "primary";
    if (lowerStatus?.includes("qualified") || lowerStatus?.includes("proposal")) return "warning";
    if (lowerStatus?.includes("contacted") || lowerStatus?.includes("negotiation")) return "secondary";
    if (lowerStatus?.includes("won") || lowerStatus?.includes("closed-won")) return "success";
    if (lowerStatus?.includes("lost") || lowerStatus?.includes("closed-lost")) return "danger";
    return "default";
  };

  const currentOption = options.find(opt => opt.value === value);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showBadge && currentOption && (
        <Badge variant={getStatusVariant(currentOption.value)}>
          {currentOption.label}
        </Badge>
      )}
      <Select
        value={value}
        onChange={onChange}
        className="min-w-[140px]"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default StatusDropdown;