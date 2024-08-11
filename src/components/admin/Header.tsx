import { DialogTrigger } from "@radix-ui/react-dialog";
import Link from "next/link";
import React from "react";
import { TiPlus } from "react-icons/ti";
import Modal from "../Modal";

// import Breadcrumb from "../BreadCrump

const Header = () => {
  return (
    <>
      <nav className="bg-[#343a40] w-full  h-[60px] flex justify-around items-center px-5">
        <div>
          <h1 className="text-xl text-white">Quizz App</h1>
        </div>
        <div className="font-[1rem] text-[#ffffff80] flex flex-row gap-5">
          <span className="cursor-pointer">
            <Link href={"/admin"}>Dashboard</Link>
          </span>
          <span className="cursor-pointer">
            <Link href="/admin/students">students</Link>
          </span>
          <span className="cursor-pointer">
            <Link href={"/admin/quiz"}>quizz</Link>
          </span>
          <Link href={"/admin/generate"}>
            <span className="cursor-pointer">generate </span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Header;
