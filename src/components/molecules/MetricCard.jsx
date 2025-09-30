import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon, 
  className,
  gradient = false 
}) => {
  const changeColors = {
    positive: "text-accent",
    negative: "text-red-500",
    neutral: "text-slate-500"
  };

  return (
    <Card className={cn(
      "relative overflow-hidden",
      gradient && "bg-gradient-to-br from-white to-slate-50",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
          <p className="text-3xl font-bold gradient-text mb-2">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              <ApperIcon 
                name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"}
                className={cn("h-4 w-4", changeColors[changeType])}
              />
              <span className={cn("text-sm font-medium", changeColors[changeType])}>
                {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-lg">
            <ApperIcon 
              name={icon} 
              className="h-6 w-6 text-primary"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;