type SearchableApplication = {
  company: string;
  position: string;
  status: string;
};

export function filterApplications<
  T extends SearchableApplication
>(
  applications: T[],
  searchTerm: string,
  statusFilter: string
): T[] {
  const query = searchTerm.trim().toLowerCase();

  return applications.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(query) ||
      job.position.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" ||
      job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}
