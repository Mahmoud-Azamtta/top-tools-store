import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useField, useFormikContext } from "formik";

function DatePickerField({ ...props }) {
  const { setFieldValue } = useFormikContext;
  const [field] = useField(props);

  return (
    <div>
      <label htmlFor={props.id}>{props.title}</label>
      <DatePicker
        {...field}
        {...props}
        selected={field.value}
        onChange={(val) => setFieldValue(field.name, val)}
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
}

export default DatePickerField;
