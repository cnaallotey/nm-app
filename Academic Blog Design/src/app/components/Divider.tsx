interface DividerProps {
  variant?: 'light' | 'medium' | 'heavy';
  className?: string;
}

export function Divider({ variant = 'light', className = '' }: DividerProps) {
  const heights = {
    light: 'h-[1px]',
    medium: 'h-[2px]',
    heavy: 'h-[3px]',
  };

  const opacities = {
    light: 'opacity-15',
    medium: 'opacity-25',
    heavy: 'opacity-40',
  };

  return (
    <div
      className={`bg-rule-color ${heights[variant]} ${opacities[variant]} ${className}`}
    ></div>
  );
}
