import React from "react";
import Modal from "../Modal";

const BreadCrump = ({ title, children }: any) => {
  return (
    <div className="h-[100px] mb-[2rem] w-full flex items-center justify-center bg-[#e9ecef] gap-2">
      <span className="text-2xl font-semibold capitalize">{title}</span>
      {children}
    </div>
  );
};

export default BreadCrump;
