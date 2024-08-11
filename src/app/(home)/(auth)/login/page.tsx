import LoginForm from "@/components/LoginForm";
import React from "react";

const Page = () => {
  return (
    <div className="bg-white p-3 shadow-md w-[450px] sm:rounded-lg mx-5">
      <div>
        <h1 className="text-center text-2xl font-semibold pt-5">
          Sign in to your account
        </h1>
      </div>
      {/* login form  */}
      <LoginForm />
    </div>
  );
};

export default Page;
