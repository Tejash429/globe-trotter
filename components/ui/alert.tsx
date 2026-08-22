import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 flex items-start gap-3 text-sm font-sans",
  {
    variants: {
      variant: {
        default:
          "bg-paper border-border-muted text-ink [&_svg]:text-teal-primary",
        info: "bg-teal-primary/10 border-teal-primary/30 text-teal-primary [&_svg]:text-teal-primary",
        warning:
          "bg-amber-accent/10 border-amber-accent/30 text-amber-accent [&_svg]:text-amber-accent",
        danger:
          "bg-brick-danger/10 border-brick-danger/30 text-brick-danger [&_svg]:text-brick-danger",
        success:
          "bg-teal-primary/15 border-teal-primary/40 text-teal-primary [&_svg]:text-teal-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  badgeText?: string;
}

export function Alert({
  className,
  variant,
  title,
  badgeText,
  children,
  ...props
}: AlertProps) {
  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />;
      case "info":
      default:
        return <Info className="w-5 h-5 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className={cn(alertVariants({ variant, className }))} {...props}>
      {getIcon()}
      <div className="flex-1 space-y-1">
        {title && (
          <div className="flex items-center gap-2">
            <h5 className="font-semibold leading-none tracking-tight">{title}</h5>
            {badgeText && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-current/15 font-bold uppercase">
                {badgeText}
              </span>
            )}
          </div>
        )}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
}
