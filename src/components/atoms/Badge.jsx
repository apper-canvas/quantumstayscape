import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className,
  variant = "default",
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error",
    info: "badge-info",
    primary: "bg-primary-500/10 text-primary-500",
    accent: "bg-accent-500/10 text-accent-500"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "badge",
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