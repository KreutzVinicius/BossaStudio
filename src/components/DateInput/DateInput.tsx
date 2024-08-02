import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './styles.scss';
import dayjs from 'dayjs';

interface IDateInput {
  setFieldValue: (name: string, date: any) => void;
  minDate?: any;
  name: string;
  error?: any;
  disableFuture?: boolean;
  value: any;
  label?: string;
  shouldDisableDate?: (date: any) => boolean;
  defaultCalendarMonth?: any;
}

const DateInput = ({
  value,
  label,
  error,
  name,
  setFieldValue,
  minDate,
  disableFuture,
  shouldDisableDate,
  defaultCalendarMonth,
}: IDateInput) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <div className="input-main" style={{ marginBottom: `4px` }}>
          <label className={`${error && `input-error-label`}`}>{label}</label>
        </div>

        <DatePicker
          disableFuture={disableFuture}
          minDate={minDate}
          value={value ? dayjs(value) : null}
          {...({ fullWidth: true } as any)}
          className={`mui-date-picker-icon ${error && `date-input-error`}`}
          format="YYYY-MM-DD"
          name={name}
          onChange={(date) => {
            setFieldValue(name, date);
          }}
          slotProps={{
            openPickerButton: {
              color: `primary`,
            },
            inputAdornment: {
              position: `start`,
            },
            field: { fullWidth: true },
          }}
          shouldDisableDate={shouldDisableDate}
          defaultCalendarMonth={defaultCalendarMonth}
        />
        {error && <span className="input-error-msg">{error?.toString()}</span>}
      </div>
    </LocalizationProvider>
  );
};

export default DateInput;
