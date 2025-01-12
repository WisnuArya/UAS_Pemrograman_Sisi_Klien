import React from "react";

export const Button = ({ text, onClick, variant, className }) => {
  let colorClasses;
  switch (variant) {
    case "success":
      colorClasses = "bg-green-500 hover:bg-green-700 focus:ring-green-400";
      break;
    case "warning":
      colorClasses = "bg-yellow-500 hover:bg-yellow-700 focus:ring-yellow-400";
      break;
    case "danger":
      colorClasses = "bg-red-500 hover:bg-red-700 focus:ring-red-400";
      break;
    case "primary":
      colorClasses = "bg-blue-500 hover:bg-blue-700 focus:ring-blue-400";
      break;
    case "logout":
      colorClasses = "bg-gray-100 hover:bg-gray-400";
      break;
    case "outline":
      colorClasses =
        "bg-white text-black border border-black hover:bg-gray-100 focus:ring-gray-400";
      break;
    default:
      colorClasses = "bg-gray-500 hover:bg-gray-700 focus:ring-gray-400";
  }

  return (
    <button
      onClick={onClick}
      className={`py-2 px-5 ${colorClasses} text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-opacity-75 ${className}`}
    >
      {text}
    </button>
  );
};
