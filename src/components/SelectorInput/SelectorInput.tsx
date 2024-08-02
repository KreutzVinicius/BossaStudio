import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import './styles.scss';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface SelectorInputProps {
  value: string;
  options: Options[];
  placeholder: string;
  onChange: (value: SelectChangeEvent<string>) => void;
  label: string;
  name: string;
  error?: string;
  isRequired?: boolean;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
}

interface Options {
  value: string;
  label: string;
  disabled?: boolean;
}

const SelectorInput = ({
  value,
  label,
  placeholder,
  onChange,
  options,
  name,
  error,
  disabled,
  isRequired = false,
  className,
  containerClassName,
}: SelectorInputProps) => {
  return (
    <div className={`${containerClassName ? containerClassName : ``}`}>
      {label && (
        <span className="input-selector-label">
          {label} {isRequired && <span className="required-field">*</span>}
        </span>
      )}
      <Select
        className={className ? className : ``}
        name={name}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event)}
        disabled={disabled !== undefined ? disabled : false}
        sx={{
          borderRadius: `1rem`,
          border: `1px solid #DDE1EE`,
          background: `#FFF`,
          display: `flex`,
          height: `48px`,
          justifyContent: `center`,
          alignItems: `center`,
          gap: `10px`,
          width: `100%`,
          color: `#232A43`,

          '& .MuiOutlinedInput-notchedOutline': {
            border: `none`,
          },
          '&:hover > .MuiOutlinedInput-notchedOutline': {
            border: `none`,
          },
        }}
        IconComponent={ExpandMoreIcon}
        error={error ? true : false}
        displayEmpty={placeholder ? true : false}
      >
        {placeholder && (
          <MenuItem value={``} disabled style={{ display: `none` }}>
            <span className="selector-placeholder">{placeholder}</span>
          </MenuItem>
        )}
        {options.map((option, index) => {
          return (
            <MenuItem value={option.value} key={index} disabled={option.disabled ?? false}>
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
      {error && (
        <>
          <span className="input-error-msg">{error}</span>
        </>
      )}
    </div>
  );
};

export default SelectorInput;
