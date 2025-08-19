import { cn } from '@/lib/utils';

interface NeonTextProps {
  children: React.ReactNode;
  color?: 'pink' | 'blue' | 'purple' | 'white' | 'green' | 'yellow';
  className?: string;
  animated?: boolean;
}

const NeonText = ({ 
  children, 
  color = 'pink', 
  className, 
  animated = false 
}: NeonTextProps) => {
  const colorClasses = {
    pink: 'neon-text',
    blue: 'neon-text-blue',
    purple: 'neon-text-purple',
    white: 'neon-text-white',
    green: 'text-neon-green',
    yellow: 'text-neon-yellow',
  };

  return (
    <span 
      className={cn(
        colorClasses[color],
        animated && 'animate-neon-pulse',
        className
      )}
    >
      {children}
    </span>
  );
};

export default NeonText;