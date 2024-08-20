import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { TiPlus } from "react-icons/ti";
import { Separator } from "./ui/separator";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";

const Modal = ({ title, children, icon }: any) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <button className="cursor-pointer">{icon}</button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p className="lowercase">{title}</p>
          </TooltipContent>
        </Tooltip>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-2">{title}</DialogTitle>
            <Separator />
            <DialogDescription>{children}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default Modal;
