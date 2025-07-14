import React from "react";

interface BodyButtonProps {
  onResetTheCamera: () => void;


}

const ResetCameraButton: React.FC<BodyButtonProps> = ({
  onResetTheCamera,


}) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "30px",
        left: "30px",
        direction: "rtl",
      }}
    >
      <div className="body-buttons flex flex-row-reverse overflow-show bg-gray-900 border divide-x rounded-lg rtl:flex-row-reverse dark:bg-gray-900 dark:border-gray-700 dark:divide-gray-700">
        {/* First Button */}
        <div className="relative group">
          <button
            className="px-4 py-2 font-medium text-gray-600  transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
            onClick={onResetTheCamera}
          >

            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z" /></svg>


          </button>
          <div className="absolute caption-tag left-full top-2 ml-2 hidden mb-2 px-3 py-1 text-sm text-white bg-gray-900 rounded-md shadow-lg group-hover:block">
            بازگشت
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResetCameraButton;
