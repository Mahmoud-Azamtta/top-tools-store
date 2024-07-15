import React from "react";
import { useRef } from "react";
import "./loaderButton.css";
import { Button, Spinner } from "react-bootstrap";
function LoaderButton({ isLoading, loadingMessage, isDisabled, children }) {
  /**
   * NOTE:
   * isLoading is a boolean variable, when it's true the loader will appear instead of the text
   * isDisabled to deactivate the button (when used with formik it will be equal to
   * !formik.isValid || !formik.dirty)
   * children is button text
   */
  const buttonRef = useRef(null);
  return (
    <Button
      ref={buttonRef}
      type="submit"
      // className={`relative mt-5 flex items-center justify-center rounded-full bg-main-light px-5 py-1 text-lg text-white shadow-md transition ${
      //   !isDisabled ? "hover:scale-105 active:scale-95" : "" // formik.isValid && formik.dirty
      // } disabled:bg-gray-400 `}
      className="loader-btn px-3"
      disabled={isDisabled} // NOTE: !formik.isValid || !formik.dirty
    >
      <>
        {isLoading ? (
          <div className="d-flex gap-2 justify-content-center align-items-center ">
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            <span>{loadingMessage}</span>
          </div>
        ) : (
          <span>{children}</span>
        )}
      </>
    </Button>
  );
}

export default LoaderButton;
