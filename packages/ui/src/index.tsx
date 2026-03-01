// =============================================================================
// SPIKE AI - Shared UI Component Library
// =============================================================================
import * as React from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2, X, Check, AlertCircle, Info, CheckCircle } from 'lucide-react';

// --------------------------------
// Utility
// --------------------------------
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --------------------------------
// Button
// --------------------------------
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-neon-blue text-background hover:bg-neon-blue/90 shadow-neon-blue hover:shadow-neon-blue-lg',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
        outline:
          'border border-border bg-transparent text-text-primary hover:bg-background-tertiary hover:border-neon-blue',
        ghost:
          'text-text-secondary hover:text-text-primary hover:bg-background-tertiary',
        link: 'text-neon-blue underline-offset-4 hover:underline',
        gradient:
          'bg-gradient-neon text-white shadow-neon-blue hover:opacity-90',
        secondary:
          'bg-background-tertiary text-text-primary border border-border hover:border-neon-purple',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-md px-8 text-base',
        xl: 'h-14 rounded-lg px-10 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          leftIcon
        ) : null}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  },
);
Button.displayName = 'Button';

// --------------------------------
// Card
// --------------------------------
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'outline' | 'gradient';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-background-secondary border border-border rounded-xl p-6',
      glass: 'backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 shadow-glass',
      outline: 'bg-transparent border border-border rounded-xl p-6 hover:border-neon-blue transition-colors',
      gradient:
        'bg-background-secondary border border-border rounded-xl p-6 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10',
    };
    return (
      <div ref={ref} className={cn(variants[variant], className)} {...props} />
    );
  },
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-xl font-semibold text-text-primary', className)} {...props} />
  ),
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-text-secondary', className)} {...props} />
  ),
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-4', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';

// --------------------------------
// Badge
// --------------------------------
const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30',
        secondary: 'bg-background-tertiary text-text-secondary border border-border',
        destructive: 'bg-red-500/20 text-red-400 border border-red-500/30',
        success: 'bg-green-500/20 text-green-400 border border-green-500/30',
        warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
        purple: 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30',
        outline: 'bg-transparent border border-border text-text-secondary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// --------------------------------
// Input
// --------------------------------
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftAddon, rightAddon, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftAddon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            {leftAddon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border border-border bg-background-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200',
            error && 'border-red-500 focus:ring-red-500/50',
            leftAddon && 'pl-10',
            rightAddon && 'pr-10',
            className,
          )}
          {...props}
        />
        {rightAddon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
            {rightAddon}
          </div>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

// --------------------------------
// Label
// --------------------------------
export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('text-sm font-medium text-text-secondary mb-1.5 block', className)}
    {...props}
  />
));
Label.displayName = 'Label';

// --------------------------------
// Textarea
// --------------------------------
export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }
>(({ className, error, ...props }, ref) => (
  <div className="w-full">
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-border bg-background-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted',
        'focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue',
        'disabled:cursor-not-allowed disabled:opacity-50 resize-none',
        'transition-all duration-200',
        error && 'border-red-500',
        className,
      )}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
));
Textarea.displayName = 'Textarea';

// --------------------------------
// Select
// --------------------------------
export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }
>(({ className, error, children, ...props }, ref) => (
  <div className="w-full">
    <select
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border border-border bg-background-secondary px-3 py-2 text-sm text-text-primary',
        'focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'transition-all duration-200 cursor-pointer',
        error && 'border-red-500',
        className,
      )}
      {...props}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
));
Select.displayName = 'Select';

// --------------------------------
// Skeleton
// --------------------------------
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-background-tertiary',
        className,
      )}
      {...props}
    />
  );
}

// --------------------------------
// Spinner
// --------------------------------
export function Spinner({ className, size = 'default' }: { className?: string; size?: 'sm' | 'default' | 'lg' }) {
  const sizes = { sm: 'h-4 w-4', default: 'h-6 w-6', lg: 'h-8 w-8' };
  return <Loader2 className={cn('animate-spin text-neon-blue', sizes[size], className)} />;
}

// --------------------------------
// Dialog (simple modal)
// --------------------------------
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, title, description, children, className }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-lg rounded-xl bg-background-secondary border border-border p-6 shadow-glass animate-fade-in',
          className,
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        {title && (
          <h2 className="text-xl font-semibold text-text-primary mb-1">{title}</h2>
        )}
        {description && (
          <p className="text-sm text-text-secondary mb-4">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}

// --------------------------------
// Toast
// --------------------------------
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  type?: ToastType;
  title: string;
  message?: string;
  onClose?: () => void;
}

export function Toast({ type = 'info', title, message, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    error: <AlertCircle className="h-5 w-5 text-red-400" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-400" />,
    info: <Info className="h-5 w-5 text-neon-blue" />,
  };
  const styles = {
    success: 'border-green-500/30 bg-green-500/10',
    error: 'border-red-500/30 bg-red-500/10',
    warning: 'border-yellow-500/30 bg-yellow-500/10',
    info: 'border-neon-blue/30 bg-neon-blue/10',
  };
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-glass min-w-[300px] animate-slide-up',
        styles[type],
      )}
    >
      {icons[type]}
      <div className="flex-1">
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        {message && <p className="text-xs text-text-secondary mt-0.5">{message}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="text-text-muted hover:text-text-primary">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// --------------------------------
// Progress
// --------------------------------
export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  color?: 'blue' | 'purple' | 'gradient';
}

export function Progress({ value, max = 100, className, showLabel, color = 'blue' }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = {
    blue: 'bg-neon-blue',
    purple: 'bg-neon-purple',
    gradient: 'bg-gradient-neon',
  };
  return (
    <div className={cn('w-full', className)}>
      <div className="w-full h-2 bg-background-tertiary rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-text-secondary mt-1 text-right">{percentage.toFixed(0)}%</p>
      )}
    </div>
  );
}

// --------------------------------
// Divider
// --------------------------------
export function Divider({ className, label }: { className?: string; label?: string }) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-muted">{label}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    );
  }
  return <div className={cn('h-px bg-border', className)} />;
}

// --------------------------------
// Avatar
// --------------------------------
export function Avatar({
  src,
  alt,
  fallback,
  size = 'default',
  className,
}: {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}) {
  const sizes = { sm: 'h-8 w-8 text-xs', default: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg' };
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-gradient-neon font-semibold text-white overflow-hidden',
        sizes[size],
        className,
      )}
    >
      {src ? (
        <img src={src} alt={alt ?? ''} className="h-full w-full object-cover" />
      ) : (
        <span>{fallback ?? (alt ? alt[0].toUpperCase() : '?')}</span>
      )}
    </div>
  );
}

// --------------------------------
// Stat Card
// --------------------------------
export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, change, icon, className }: StatCardProps) {
  return (
    <Card className={cn('flex items-start justify-between', className)}>
      <div>
        <p className="text-sm text-text-secondary">{title}</p>
        <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
        {change !== undefined && (
          <p className={cn('text-xs mt-1', change >= 0 ? 'text-green-400' : 'text-red-400')}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </p>
        )}
      </div>
      {icon && (
        <div className="p-2.5 rounded-lg bg-neon-blue/10 text-neon-blue">{icon}</div>
      )}
    </Card>
  );
}

// --------------------------------
// Exports
// --------------------------------
export { buttonVariants, badgeVariants };
export type { VariantProps };
