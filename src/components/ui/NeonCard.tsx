import { cn } from '@/lib/utils';

interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

const NeonCard = ({ 
  children, 
  className, 
  hover = true,
  glow = false 
}: NeonCardProps) => {
  return (
    <div 
      className={cn(
        'neon-card',
        hover && 'transition-all duration-300 hover:scale-105',
        glow && 'neon-glow',
        className
      )}
    >
      {children}
    </div>
  );
};

export default NeonCard;