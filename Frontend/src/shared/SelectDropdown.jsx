import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

function Select({ selected, open, setOpen, children }) {
  const buttonRef = useRef();
  const optionsRef = useRef();
  const [optionsWidth, setOptionsWidth] = useState(0);
  const controls = useAnimationControls();

  const options = {
    close: {
      opacity: 0,
      scale: 0,
    },
    open: {
      opacity: 1,
      scale: 1,
    },
  };

  const button = {
    close: {
      rotate: 0,
    },
    open: {
      rotate: 180,
    },
  };

  const handleClick = () => {
    if (open) {
      controls.start("close");
    } else {
      controls.start("open");
    }

    setOpen(!open);
  };

  const handleClickOutside = (event) => {
    if (
      open &&
      !optionsRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
      controls.start("close");
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (optionsRef.current) setOptionsWidth(optionsRef.current.offsetWidth);
  }, [optionsRef.current]);

  useEffect(() => {
    controls.start(open ? "open" : "close");
  }, [open, controls]);

  return (
    <React.Fragment>
      <div className="relative">
        <button
          style={{
            width: `${optionsWidth + 25}px`,
          }}
          ref={buttonRef}
          className="selected text-left flex items-center justify-between rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 "
          onClick={handleClick}
        >
          <span>{selected}</span>
          <motion.svg
            initial="close"
            animate={controls}
            variants={button}
            width="20px"
            height="20px"
            className="rounded-full "
            viewBox="-8.5 0 32 32"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>angle-down</title>
            <path d="M7.28 20.040c-0.24 0-0.44-0.080-0.6-0.24l-6.44-6.44c-0.32-0.32-0.32-0.84 0-1.2 0.32-0.32 0.84-0.32 1.2 0l5.84 5.84 5.84-5.84c0.32-0.32 0.84-0.32 1.2 0 0.32 0.32 0.32 0.84 0 1.2l-6.44 6.44c-0.16 0.16-0.4 0.24-0.6 0.24z"></path>
          </motion.svg>
        </button>
        <motion.div
          ref={optionsRef}
          initial="close"
          animate={controls}
          variants={options}
          style={{ transformOrigin: "top left" }}
          className="absolute mt-2 rounded-lg border p-1 overflow-hidden border-gray-300 bg-gray-100"
        >
          {children}
        </motion.div>
      </div>
    </React.Fragment>
  );
}

export default Select;
