import React from "react";

interface CarBodyStatProps {
  carBodyStat: {
    bodyPart: string;
    status: string;
  }[];
}

const Car‌BodyStatBox: React.FC<CarBodyStatProps> = ({ carBodyStat }) => {
  return (
    <>
      <div className=" px-4 py-2 text-white bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-2">وضعیت بدنه خودرو</h2>
        <ul>
          {carBodyStat.map((stat, index) => (

            <li key={index} className="w-full flex justify-between px-4 py-2 b-btn">
              <p className="text-gray-300 text-sm ">{stat.bodyPart}</p> <p>{stat.status}</p>
            </li>
          ))}
        </ul>
      </div>
      <br />
    </>
  );
};

export default Car‌BodyStatBox;
