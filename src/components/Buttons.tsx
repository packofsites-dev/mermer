import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline-light';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  className = '',
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-sans font-medium tracking-[0.06em] uppercase transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive rounded-[2px]';

  const sizeClasses = {
    sm: 'px-4 py-2.5 text-xs min-h-[40px]',
    default: 'px-6 py-3.5 text-xs sm:text-[13px] min-h-[44px]',
    lg: 'px-8 py-4 text-[13px] min-h-[48px]',
  }[size];

  const variantClasses = {
    primary:
      'bg-olive text-bone hover:bg-charcoal active:bg-charcoal border border-transparent',
    secondary:
      'bg-transparent text-charcoal border border-charcoal hover:bg-charcoal hover:text-bone active:bg-charcoal active:text-bone',
    'outline-light':
      'bg-transparent text-bone border border-bone/40 hover:border-bone hover:bg-bone hover:text-charcoal',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
