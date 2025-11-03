import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className,
  type = "text",
  label,
  error,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          "input",
          error && "border-error focus:border-error focus:ring-error",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;