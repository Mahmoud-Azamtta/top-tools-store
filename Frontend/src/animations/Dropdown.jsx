import { motion, AnimatePresence } from "framer-motion";

const dropdownVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
  },
  visible: {
    height: "auto",
    opacity: 1,
    overflow: "hidden",
    transition: {
      duration: 0.3,
    },
  },
};

// NOTE: The children element here must have a small padding or else there will be a small overflow
// that is hidden under the motion div
function Dropdown({ children, condition }) {
  return (
    <AnimatePresence>
      {condition && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={dropdownVariants}
          className=""
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Dropdown;
