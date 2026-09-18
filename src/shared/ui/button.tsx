import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clinic-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default: "bg-clinic-blue text-white shadow hover:bg-clinic-blue-hover active:scale-[0.98]",
        secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-[0.98]",
        outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:scale-[0.98]",
        ghost: "hover:bg-slate-100 text-slate-700 active:scale-[0.98]",
        success: "bg-emerald-700 text-white shadow hover:bg-emerald-800 active:scale-[0.98]",
        danger: "bg-clinic-danger text-white shadow hover:bg-red-700 active:scale-[0.98]",
        link: "text-clinic-blue underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
