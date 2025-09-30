import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item", 
  actionLabel = "Add Item", 
  onAction,
  icon = "Database"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] glass rounded-xl">
      <div className="p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mb-6">
        <ApperIcon name={icon} className="h-16 w-16 text-slate-400" />
      </div>
      
      <h3 className="text-2xl font-bold gradient-text mb-3">{title}</h3>
      
      <p className="text-slate-600 text-center max-w-md mb-8">
        {description}
      </p>
      
      {onAction && (
        <Button onClick={onAction} variant="primary" size="lg">
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          {actionLabel}
        </Button>
      )}
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
        <div className="text-center p-4">
          <div className="p-2 bg-primary/10 rounded-lg w-fit mx-auto mb-2">
            <ApperIcon name="Users" className="h-6 w-6 text-primary" />
          </div>
          <h4 className="font-medium text-slate-900">Manage Leads</h4>
          <p className="text-sm text-slate-500">Track potential customers</p>
        </div>
        <div className="text-center p-4">
          <div className="p-2 bg-accent/10 rounded-lg w-fit mx-auto mb-2">
            <ApperIcon name="Calendar" className="h-6 w-6 text-accent" />
          </div>
          <h4 className="font-medium text-slate-900">Schedule Activities</h4>
          <p className="text-sm text-slate-500">Never miss a follow-up</p>
        </div>
        <div className="text-center p-4">
          <div className="p-2 bg-amber-500/10 rounded-lg w-fit mx-auto mb-2">
            <ApperIcon name="Target" className="h-6 w-6 text-amber-600" />
          </div>
          <h4 className="font-medium text-slate-900">Close Deals</h4>
          <p className="text-sm text-slate-500">Convert leads to revenue</p>
        </div>
      </div>
    </div>
  );
};

export default Empty;