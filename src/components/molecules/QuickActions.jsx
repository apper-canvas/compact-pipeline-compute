import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const QuickActions = ({ actions, className }) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || "outline"}
          size="sm"
          onClick={action.onClick}
          className="flex items-center gap-2"
        >
          {action.icon && (
            <ApperIcon name={action.icon} className="h-4 w-4" />
          )}
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;