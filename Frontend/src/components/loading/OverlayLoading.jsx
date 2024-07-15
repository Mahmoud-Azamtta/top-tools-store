import "./overlayLoading.css";
import { motion } from "framer-motion";

function OverlayLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="overlay-loader position-absolute d-flex justify-content-center align-itemc-center rounded"
    >
      <div className=" d-flex justify-content-center align-items-center">
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </motion.div>
  );
}
export default OverlayLoading;
