import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white p-3 shadow-md w-full md:w-[90%] lg:w-[70%] max-w-4xl sm:rounded-lg mx-5 ">
      <h1 className="text-2xl lg:text-4xl font-bold text-primary tracking-wider uppercase text-center py-2">
        Welcome to Quiz App
      </h1>
      <div className="shrink-0 bg-border h-[1px] w-full"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 p-2 md:px-6 py-3 gap-4 place-items-center">
        <Image
          src={
            "https://www.pikpng.com/pngl/b/31-314454_qr-code-transparent-background-vector-qr-code-png.png"
          }
          alt="qr-code"
          priority
          width={350}
          height={350}
          className="object-cover object-center"
        />

        <div className="flex flex-row gap-2 items-center justify-center">
          <Button className="bg-[hsl(262.1,83.3%,57.8%)] hover:bg-[hsl(262.1,83.3%,57.8%)]/80">
            generate
          </Button>
          <Button className="bg-[hsl(262.1,83.3%,57.8%)] hover:bg-[hsl(262.1,83.3%,57.8%)]/80">
            scan
          </Button>
        </div>
      </div>
    </div>
  );
}
