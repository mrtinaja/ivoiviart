import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface AddToCartModalProps {
  show: boolean;
  onClose: () => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ show, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="modal"
          className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl shadow-lg w-full max-w-xs p-6 text-center"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Producto agregado al carrito 🛒
            </h3>
            <div className="flex flex-col gap-3 mt-4">
              <Link
                to="/carrito"
                onClick={onClose}
                className="bg-[#005e63] text-white py-2 rounded-lg font-semibold hover:bg-[#007b81] transition-colors"
              >
                Ver carrito
              </Link>
              <button
                onClick={onClose}
                className="border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Seguir comprando
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddToCartModal;
