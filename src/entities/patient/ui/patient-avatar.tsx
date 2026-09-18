import * as React from "react";
import { cn } from "@/shared/lib/utils";

interface PatientAvatarProps {
  name: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PatientAvatar({ name, gender, className, size = "md" }: PatientAvatarProps) {
  const initials = name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const sizeClasses = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-12 h-12 text-sm",
  };

  const bgClass =
    gender === "FEMALE"
      ? "bg-gradient-to-tr from-pink-500 to-rose-400 text-white"
      : "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white";

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-black shadow-sm shrink-0 select-none",
        sizeClasses[size],
        bgClass,
        className
      )}
    >
      {initials}
    </div>
  );
}
