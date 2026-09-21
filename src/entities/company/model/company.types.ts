export type CompanyStatus = "ACTIVE" | "INACTIVE";

export interface Company {
  id: string;
  code: string;
  name: string;
  taxCode?: string;
  address?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  defaultPayerSource?: string;
  contractCode?: string;
  status: CompanyStatus;
  employeeCount?: number;
  printedCount?: number;
  completedCount?: number;
  latestBatchName?: string;
  createdAt?: string;
  updatedAt?: string;
}
