import React, { HTMLInputTypeAttribute } from 'react';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import './styless.scss';

interface InputProps {
  label?: string;
  placeholder?: string;
  name: string;
  value: string | number;
  type?: HTMLInputTypeAttribute;
  className?: string;
  width?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  testId?: string;
  pattern?: string;
  isRequired?: boolean;
  legend?: string | React.ReactNode;
  tooltip?: React.ReactNode;
  children?: any;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  name,
  value,
  type,
  className,
  width,
  onChange,
  onBlur,
  error,
  testId,
  pattern,
  legend,
  tooltip,
  isRequired = false,
  disabled,
  children,
}) => {
  return (
    <div className="d-flex flex-column input-main" style={{ width: width ?? `100%` }}>
      <div className="label-tooltip-container">
        <label className={error ? `input-error-label` : ``} htmlFor={name}>
          {label} {isRequired && <span className="required-field">*</span>}
        </label>
        {tooltip}
      </div>
      <div className={error ? `input-error-container` : ``}>
        <input
          placeholder={placeholder}
          pattern={pattern}
          type={type}
          name={name}
          id={name}
          className={error ? `input-error` : (className ?? ``)}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          data-testid={testId}
          disabled={disabled}
          onWheel={(e: any) => e.currentTarget.blur()}
        />
        {error && (
          <>
            <ErrorOutlinedIcon className="input-error-icon" />
            <span className="input-error-msg">{error}</span>
          </>
        )}
        {legend && !error ? (
          typeof legend !== `string` ? (
            legend
          ) : (
            <span className="input-legend">{legend}</span>
          )
        ) : children?.legend && !error ? (
          <>{children.legend}</>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Input;
