"use client";
import React, { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      router.push("/admin");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className=" h-[300px] w-full grid grid-cols-1 place-content-center gap-4"
    >
      <p className="text-red-400 text-center">{error}</p>
      <Input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-[80%] rounded-none mx-auto focus:!ring-2 focus:!ring-blue-500/[0.5] focus:!outline-none "
      />
      <Input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-[80%] rounded-none mx-auto focus:!ring-2 focus:!ring-blue-500/[0.5] focus:!outline-none "
      />
      <Button
        type="submit"
        className="w-[80%] rounded-none mx-auto bg-[#746bde] hover:bg-[#746bde]/[0.9] h-[50px]"
        size={"lg"}
      >
        SIGN IN
      </Button>
      <span className="text-center text-sm text-gray-500 cursor-pointer">
        forgot your password?
      </span>
    </form>
  );
};

export default LoginForm;
