import { describe, it, expect } from "vitest";
import { filterApplications } from "./filterApplications";

const applications = [
  {
    id: "1",
    company: "Apple",
    position: "Software Engineer Intern",
    status: "Applied",
  },
  {
    id: "2",
    company: "Google",
    position: "Software Developer Intern",
    status: "Interview",
  },
  {
    id: "3",
    company: "Amazon",
    position: "Frontend Engineer",
    status: "Applied",
  },
];

describe("Job application filtering", () => {

  it("finds a company regardless of capitalization", () => {
    const result = filterApplications(
      applications,
      "APPLE",
      "All"
    );

    expect(result).toHaveLength(1);
    expect(result[0].company).toBe("Apple");
  });

  it("searches by job position", () => {
    const result = filterApplications(
      applications,
      "frontend",
      "All"
    );

    expect(result).toHaveLength(1);
    expect(result[0].company).toBe("Amazon");
  });

  it("filters applications by status", () => {
    const result = filterApplications(
      applications,
      "",
      "Applied"
    );

    expect(result).toHaveLength(2);
  });

  it("combines search and status filters", () => {
    const result = filterApplications(
      applications,
      "Engineer",
      "Applied"
    );

    expect(result).toHaveLength(2);
    expect(result.map((job) => job.company))
      .toEqual(["Apple", "Amazon"]);
  });

  it("returns an empty array when nothing matches", () => {
    const result = filterApplications(
      applications,
      "Netflix",
      "All"
    );

    expect(result).toEqual([]);
  });

  it("does not modify the original applications", () => {
    const originalLength = applications.length;

    filterApplications(applications, "Apple", "All");

    expect(applications).toHaveLength(originalLength);
  });

});
