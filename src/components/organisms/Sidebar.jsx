import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ className }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Leads", href: "/leads", icon: "Users" },
    { name: "Activities", href: "/activities", icon: "Calendar" },
    { name: "Deals", href: "/deals", icon: "Target" },
    { name: "Reports", href: "/reports", icon: "BarChart3" }
  ];

  return (
    <div className={cn("glass rounded-xl p-6 h-fit", className)}>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gradient-to-br from-primary to-blue-600 rounded-lg">
          <ApperIcon name="Zap" className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold gradient-text">Pipeline Pro</h1>
          <p className="text-xs text-slate-500">CRM Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg"
                  : "text-slate-600 hover:text-primary hover:bg-slate-100"
              )
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon 
                  name={item.icon} 
                  className={cn(
                    "h-5 w-5 transition-all duration-200",
                    isActive 
                      ? "text-white" 
                      : "text-slate-400 group-hover:text-primary"
                  )} 
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <h3 className="text-sm font-medium text-slate-600 mb-4">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Active Leads</span>
            <span className="text-sm font-semibold text-primary">24</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Due Today</span>
            <span className="text-sm font-semibold text-amber-600">8</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">This Month</span>
            <span className="text-sm font-semibold text-accent">$45.2K</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;