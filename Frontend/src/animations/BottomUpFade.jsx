import { motion } from "framer-motion";
import React from "react";

function BottomUpFade({ children, ...props }) {
  return (
    <motion.div
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 20,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default BottomUpFade;
