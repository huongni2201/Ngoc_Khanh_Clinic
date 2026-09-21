import * as React from "react";
import { AdultHealthCheckPrintData } from "@/entities/health-check/model/health-check.types";
import { HealthCheckFormPage1 } from "./health-check-form-page-1";
import { HealthCheckFormPage2 } from "./health-check-form-page-2";
import { HealthCheckFormPage3 } from "./health-check-form-page-3";
import { HealthCheckFormPage4 } from "./health-check-form-page-4";
import { HealthCheckFormPage5 } from "./health-check-form-page-5";
import "./health-check-print.css";

interface SingleFormPrintProps {
  data: AdultHealthCheckPrintData;
  className?: string;
}

export function SingleHealthCheckFormPrint({ data, className = "" }: SingleFormPrintProps) {
  return (
    <div className={`health-check-single-record ${className}`}>
      <HealthCheckFormPage1 data={data} />
      <HealthCheckFormPage2 data={data} />
      <HealthCheckFormPage3 data={data} />
      <HealthCheckFormPage4 data={data} />
      <HealthCheckFormPage5 data={data} />
    </div>
  );
}

interface BatchFormPrintProps {
  records: AdultHealthCheckPrintData[];
  className?: string;
}

export function BatchHealthCheckFormPrint({ records, className = "" }: BatchFormPrintProps) {
  if (records.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 italic">
        Không có hồ sơ nhân sự nào được chọn để in.
      </div>
    );
  }

  return (
    <div className={`health-check-batch-print ${className}`}>
      {records.map((record, index) => (
        <div key={record.identityNumber || index} className="employee-print-bundle">
          <SingleHealthCheckFormPrint data={record} />
        </div>
      ))}
    </div>
  );
}
