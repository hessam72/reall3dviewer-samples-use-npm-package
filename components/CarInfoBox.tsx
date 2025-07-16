import React, { useState } from "react";
import { FiInfo, FiChevronDown, FiChevronUp } from "react-icons/fi";



interface CarInfoProps {
  carDetails: {
    manufacturer: string;
    model: string;
    price: string;
    year: string;
    color: string;
    fuelType: string;
    mileage: string;
    engineCondition: string;
    chassisCondition: string;
    bodyCondition: string;
    insuranceValidity: string;
    gearbox: string;
  };
}

const CarInfoBox: React.FC<CarInfoProps> = ({ carDetails }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`carinfo-wrapper fixed bottom-5 right-4 ${isOpen ? 'open_modal' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`ios-glass-theme info-btn flex items-center justify-between px-6 py-4 text-white bg-blue-950 rounded-lg shadow-lg hover:bg-blue-900 ${isOpen ? 'w-full' : 'w-4/5'}`}
      >
        <span className="flex items-center gap-2">
          <FiInfo /> اطلاعات خودرو
        </span>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      <div
        className={` ios-glass-theme mt-2 bg-gray-900 shadow-lg rounded-lg p-8 border border-gray-50 transition-all duration-300 ease-in-out transform ${isOpen ? 'max-h-screen opacity-100 scale-100 relative' : 'max-h-0 opacity-0 scale-95 absolute'}`}
        style={{ direction: "rtl", overflow: "hidden" }}
      >
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-4 text-white" >
            {carDetails.manufacturer} {carDetails.model}
          </h2>
          <p className="text-gray-300 text-xs">۲۳ ساعت پیش در تهران، نارمک جنوبی
          </p>

        </div>
        <br />
        <ul className="space-y-2 text-white">

          <div className="flex justify-center gap-8">
            <div className="flex flex-col justify-center text-center gap-2 b-l">
              <p className="text-gray-50 text-sm">  <span className="font-semibold">مدل (سال تولید)</span> </p>
              <h4>{carDetails.year}</h4>
            </div>
            <div className="flex flex-col justify-center text-center gap-2 b-l">
              <p className="text-gray-50 text-sm">  <span className="font-semibold">کارکرد</span> </p>
              <h4>{carDetails.mileage}</h4>
            </div>
            <div className="flex flex-col justify-center text-center gap-2">
              <p className="text-gray-50 text-sm">  <span className="font-semibold">رنگ</span> </p>
              <h4>{carDetails.color}</h4>
            </div>
          </div>
          <br />
          <br />


          <li className="w-full flex justify-between px-4 py-2 b-btn ">
            <p className="text-gray-50 text-sm ">نوع سوخت:</p> <p>{carDetails.fuelType}</p>
          </li>
          <li className="w-full flex justify-between px-4 py-2 b-btn">
            <p className="text-gray-50 text-sm ">وضعیت موتور:</p><p> {carDetails.engineCondition}</p>
          </li>
          <li className="w-full flex justify-between px-4 py-2 b-btn">
            <p className="text-gray-50 text-sm ">وضعیت شاسی‌ها:</p><p> {carDetails.chassisCondition}</p>
          </li>
          <li className="w-full flex justify-between px-4 py-2 b-btn">
            <p className="text-gray-50 text-sm ">وضعیت بدنه:</p><p> {carDetails.bodyCondition}</p>
          </li>
          <li className="w-full flex justify-between px-4 py-2 b-btn">
            <p className="text-gray-50 text-sm ">مهلت بیمهٔ شخص ثالث:</p><p> {carDetails.insuranceValidity}</p>
          </li>
          <li className="w-full flex justify-between px-4 py-2 b-btn">
            <p className="text-gray-50 text-sm ">گیربکس:</p><p> {carDetails.gearbox}</p>
          </li>
          <li className="w-full flex justify-between px-4 py-2">
            <p className="text-gray-50 text-sm ">قیمت پایه:</p><p> {carDetails.price}</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CarInfoBox;
