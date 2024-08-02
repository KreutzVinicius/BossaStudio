import './styles.scss';

interface ISwitcher {
  checked: boolean;
  onChange: (e?: any) => void;
  name?: string;
}

const Switcher = ({ checked, onChange, name }: ISwitcher) => {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onChange} name={name} id={name} data-testid={name} />
      <span className="slider">
        <span className={`knob ${checked ? `checked` : ``}`} />
      </span>
    </label>
  );
};

export default Switcher;
