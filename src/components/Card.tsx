import { type HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ glass = true, hover = false, className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-2xl ${glass ? 'glass' : 'card-gradient border border-navy-600/20'} shadow-card ${hover ? 'transition-all duration-300 hover:border-brand-500/30 hover:shadow-glow-blue hover:-translate-y-0.5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';
export default Card;
