import React from "react";

type TrashButtonProps = {
  onClick: () => void;
};

const TrashButton: React.FC<TrashButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden px-3 py-2 text-base font-semibold text-white rounded-md 
        bg-gradient-to-r from-[#f79647] via-[#e00e03] to-[#90442a] shadow-lg 
        transition-all duration-300 hover:from-[#e00e03] hover:via-[#90442a] hover:to-[#e00e03] 
        active:scale-95 focus:outline-none"
    >
      🗑️
    </button>
  );
};

export default TrashButton;
