"use client";
import { Button } from "@/components/ui/button";
import { useQRCode } from "next-qrcode";
import QRScanner from "@/components/QrCode";
import { useEffect, useState } from "react";

export default function Home() {
  const { Canvas } = useQRCode();
  const [quizId, setQuizId] = useState(null);

  const QrCodeData = async () => {
    try {
      const req = await fetch("/api/user/", { cache: "no-store" });
      const data = await req.json();

      setQuizId(data[0]?._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    QrCodeData();
  }, [quizId]);
  return (
    <div className="bg-white p-3 shadow-md w-full md:w-[90%] lg:w-[70%] max-w-4xl sm:rounded-lg mx-5 ">
      <h1 className="text-2xl lg:text-4xl font-bold text-primary tracking-wider uppercase text-center py-2">
        Welcome to Quiz App
      </h1>
      <div className="shrink-0 bg-border h-[1px] w-full"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 p-2 md:px-6 py-3 gap-4 place-items-center min-h-[200px]">
        {quizId ? (
          <Canvas
            text={quizId}
            options={{
              errorCorrectionLevel: "M",
              margin: 3,
              scale: 4,
              width: 250,
            }}
          />
        ) : (
          <span className="text-2xl font-bold text-blue-500">
            no quizz available
          </span>
        )}

        <div className="flex flex-row gap-2 items-center justify-center">
          <Button
            className="bg-[hsl(262.1,83.3%,57.8%)] hover:bg-[hsl(262.1,83.3%,57.8%)]/80"
            onClick={() => window.location.reload()}
          >
            generate
          </Button>
          <div>
            <QRScanner />
          </div>
        </div>
      </div>
    </div>
  );
}
