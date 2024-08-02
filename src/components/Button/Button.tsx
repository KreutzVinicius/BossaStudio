import './styles.scss';

export type TButtonVariant = `disabled` | `default` | `destructive` | `secondary` | `transparent`;

interface IButtonProps {
  variant: TButtonVariant;
  children?: any;
  onClick: () => void;
  id: string;
  backgroundColor?: string;
  color?: string;
  className?: string | null;
}

/**
 * Possible variants for the button: disabled, default, destructive, secondary, transparent
 */
const Button = ({ variant, onClick, id, children, backgroundColor, color, className = null }: IButtonProps) => {
  const handleClick = () => {
    if (variant == `disabled`) return;
    onClick();
  };

  return (
    <div className="buttons-variants-wrapper">
      <button
        data-testid={id}
        id={id}
        onClick={handleClick}
        style={{ backgroundColor: backgroundColor, color: color }}
        className={`${variant}-button ${className}`}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
