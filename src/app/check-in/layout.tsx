import * as React from "react";

export default function CheckInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {children}
    </div>
  );
}
