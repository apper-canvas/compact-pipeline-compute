import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] glass rounded-xl">
      <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-6">
        <ApperIcon name="AlertTriangle" className="h-12 w-12 text-red-600" />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h3>
      
      <p className="text-slate-600 text-center max-w-md mb-6">
        {message || "We encountered an error while loading your CRM data. Please try again or contact support if the problem persists."}
      </p>
      
      {onRetry && (
        <div className="flex items-center gap-3">
          <Button onClick={onRetry} variant="primary">
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-slate-50 rounded-lg max-w-md">
        <p className="text-xs text-slate-500 text-center">
          <strong>Need help?</strong> Contact our support team for assistance with your CRM data.
        </p>
      </div>
    </div>
  );
};

export default Error;