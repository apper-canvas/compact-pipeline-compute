import React from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ title, onMobileMenuToggle, searchValue, onSearchChange, actions, className }) => {
  return (
    <div className={cn("glass rounded-xl p-6 mb-6", className)}>
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Title and Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold gradient-text">{title}</h1>
            <p className="text-sm text-slate-500">Manage your sales pipeline efficiently</p>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:justify-end">
          {onSearchChange && (
            <SearchBar
              placeholder="Search leads, deals, activities..."
              value={searchValue}
              onChange={onSearchChange}
              className="flex-1 sm:max-w-md"
            />
          )}
          {actions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "primary"}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;