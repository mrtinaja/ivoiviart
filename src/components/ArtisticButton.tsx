import { motion } from "framer-motion";


interface ArtisticButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const ArtisticButton: React.FC<ArtisticButtonProps> = ({
  onClick,
  children,
  className = "",
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative overflow-hidden px-6 py-3 text-lg font-semibold text-white rounded-md 
                  bg-gradient-to-r from-[#90442a] via-[#005e63] to-[#90442a] shadow-lg 
                  transition-all duration-300 hover:from-[#005e63] hover:via-[#90442a] hover:to-[#005e63] 
                  active:scale-95 focus:outline-none ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{
        scale: 0.85,
        boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.6)",
      }}
      transition={{ duration: 0.3 }}
    >
      <span className="absolute inset-0 bg-white opacity-10 blur-lg"></span>
      {children}
    </motion.button>
  );
};

export default ArtisticButton;
