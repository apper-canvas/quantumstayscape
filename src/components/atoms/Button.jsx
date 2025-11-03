import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = React.forwardRef(({ 
  className,
  variant = "primary",
  size = "default",
  children,
  loading = false,
  icon,
  iconPosition = "left",
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm hover:shadow-md",
    secondary: "bg-white text-primary-500 border border-primary-500 hover:bg-primary-50 focus:ring-primary-500",
    accent: "bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500 shadow-sm hover:shadow-md",
    outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-error text-white hover:bg-red-600 focus:ring-error shadow-sm hover:shadow-md"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm min-h-[36px]",
    default: "px-6 py-3 text-base min-h-[44px]",
    lg: "px-8 py-4 text-lg min-h-[52px]"
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <ApperIcon name={icon} className="w-4 h-4 mr-2" />
          )}
          {children}
          {icon && iconPosition === "right" && (
            <ApperIcon name={icon} className="w-4 h-4 ml-2" />
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;