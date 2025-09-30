import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 border border-slate-200",
    primary: "bg-gradient-to-r from-primary/10 to-blue-600/10 text-primary border border-primary/20",
    success: "bg-gradient-to-r from-accent/10 to-emerald-600/10 text-accent border border-accent/20",
    warning: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200",
    danger: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200",
    secondary: "bg-gradient-to-r from-secondary/10 to-slate-600/10 text-secondary border border-secondary/20"
  };
  
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;