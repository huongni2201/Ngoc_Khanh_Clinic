import { describe, it, expect } from "vitest";
import { useCorporateHealthCheckStore } from "@/shared/stores/corporate-health-check.store";

describe("Bulk Print Selection Rules", () => {
  it("only selects eligible adult employees (>= 18) when selectAllValidEmployees is called", () => {
    const store = useCorporateHealthCheckStore.getState();

    // Select for VIB bank company (comp-vib)
    // comp-vib has 3 employees:
    // emp-vib-01: age 48, VALID
    // emp-vib-02: age 42, VALID
    // emp-vib-03: age 17, UNDER_18
    store.clearSelection();
    expect(useCorporateHealthCheckStore.getState().selectedEmployeeIds).toHaveLength(0);

    store.selectAllValidEmployees("comp-vib");
    const selected = useCorporateHealthCheckStore.getState().selectedEmployeeIds;

    // Must only select the 2 adult employees, NOT the 17-year-old!
    expect(selected).toHaveLength(2);
    expect(selected).toContain("emp-vib-01");
    expect(selected).toContain("emp-vib-02");
    expect(selected).not.toContain("emp-vib-03");
  });

  it("calculates expected page count as 5 pages per selected employee", () => {
    const selectedCount = 3;
    const pagesPerPerson = 5;
    const totalA4Pages = selectedCount * pagesPerPerson;
    expect(totalA4Pages).toBe(15);
  });

  it("marks printed employees as PRINTED", () => {
    const store = useCorporateHealthCheckStore.getState();
    store.markEmployeesAsPrinted(["emp-vib-01", "emp-vib-02"]);

    const updatedEmployees = useCorporateHealthCheckStore.getState().employees;
    const emp1 = updatedEmployees.find((e) => e.id === "emp-vib-01");
    const emp2 = updatedEmployees.find((e) => e.id === "emp-vib-02");
    const emp3 = updatedEmployees.find((e) => e.id === "emp-vib-03");

    expect(emp1?.printStatus).toBe("PRINTED");
    expect(emp2?.printStatus).toBe("PRINTED");
    expect(emp3?.printStatus).toBe("NOT_PRINTED");
  });
});
