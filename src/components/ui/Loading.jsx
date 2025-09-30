import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ type = "default" }) => {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="glass rounded-xl p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-2">
                <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-32"></div>
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-24"></div>
              </div>
              <div className="h-6 w-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-full"></div>
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4"></div>
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2"></div>
            </div>
            <div className="flex gap-2 mt-4">
              <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded flex-1"></div>
              <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="glass rounded-xl p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/3"></div>
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2"></div>
                <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/4"></div>
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-20"></div>
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "pipeline") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="space-y-4">
            <div className="glass rounded-lg p-4 animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-20"></div>
                <div className="h-6 w-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
              </div>
              <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-16"></div>
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, cardIndex) => (
                <div key={cardIndex} className="glass rounded-xl p-4 animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-full"></div>
                    <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-20"></div>
                    <div className="h-2 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-full"></div>
                    <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] glass rounded-xl">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
        <ApperIcon 
          name="Loader" 
          className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" 
        />
      </div>
      <p className="mt-4 text-slate-600 font-medium">Loading your CRM data...</p>
      <p className="text-sm text-slate-500">Please wait while we fetch the latest information</p>
    </div>
  );
};

export default Loading;