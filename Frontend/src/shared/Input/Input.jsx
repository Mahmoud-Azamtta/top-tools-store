import "./input.css";
import { Form, InputGroup } from "react-bootstrap";

function Input(props) {
  const {
    id,
    title,
    icon,
    errorMessage,
    onChange,
    onBlur,
    isTouched,
    ...otherProps
  } = props;

  return (
    <div className="input-wraper mb-2">
      <Form.Label htmlFor={id} className="mb-1 text-gray">
        {title}
      </Form.Label>
      <InputGroup>
        {icon && (
          <InputGroup.Text className="rounded-0 rounded-end-3 border-start-0">
            {icon}
          </InputGroup.Text>
        )}
        <Form.Control
          id={id}
          onChange={onChange}
          onBlur={onBlur}
          className={`input-field ${icon ? "rounded-0 rounded-start-3" : "rounded-3"} ${errorMessage && isTouched && "error-style"}`}
          {...otherProps}
        />
      </InputGroup>
      {errorMessage && isTouched && (
        <Form.Text className="text-danger d-block mt-0">
          {errorMessage}
        </Form.Text>
      )}
    </div>
  );
}

export default Input;
