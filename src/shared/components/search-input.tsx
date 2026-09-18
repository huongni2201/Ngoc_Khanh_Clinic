"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export function SearchInput({ value, onChange, onClear, className, placeholder = "Tìm kiếm...", ...props }: SearchInputProps) {
  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-9 pr-8"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Xóa nội dung tìm kiếm"
          title="Xóa nội dung tìm kiếm"
          className="absolute right-2 p-1 w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
