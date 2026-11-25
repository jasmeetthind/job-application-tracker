import { useEffect, useState, type SubmitEvent } from "react";
import "./App.css";

type Status = "Applied" | "Interview" | "Offer" | "Rejected";

type JobApplication = {
  id: string;
  company: string;
  position: string;
  status: Status;
};

function App() {
    const [applications, setApplications] =
  useState<JobApplication[]>([]);

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");


  
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState<Status>("Applied");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<Status | "All">("All");

  // Fetch applications from the Express backend
  useEffect(() => {
    async function loadApplications() {
      try {
        const response = await fetch("/api/applications");

        if (!response.ok) {
          throw new Error("Failed to load applications");
        }

        const data: JobApplication[] = await response.json();

        setApplications(data);
        setError("");
      } catch {
        setError("Unable to connect to the backend.");
      } finally {
        setLoading(false);
      }
    }

    void loadApplications();
  }, []);

  // Dashboard statistics
  const total = applications.length;

  const applied = applications.filter(
    (job) => job.status === "Applied"
  ).length;

  const interviews = applications.filter(
    (job) => job.status === "Interview"
  ).length;

  const offers = applications.filter(
    (job) => job.status === "Offer"
  ).length;

async function handleAddApplication(
  event: SubmitEvent<HTMLFormElement>
) {
  event.preventDefault();

  const newJob = {
    company: company.trim(),
    position: position.trim(),
    status: status,
  };

  if (!newJob.company || !newJob.position) {
    return;
  }

  try {
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newJob),
    });

    if (!response.ok) {
      throw new Error("Failed to add application");
    }

    const savedJob: JobApplication = await response.json();

    setApplications((current) => [...current, savedJob]);

    setCompany("");
    setPosition("");
    setStatus("Applied");
    setError("");
  } catch {
    setError("Unable to add application.");
  }
}

async function handleDeleteApplication(id: string) {
  try {
    const response = await fetch(
      `/api/applications/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete application");
    }

    setApplications((current) =>
      current.filter((job) => job.id !== id)
    );

    setError("");
  } catch {
    setError("Unable to delete application.");
  }
}

async function handleStatusChange(
  id: string,
  newStatus: Status
) {
  try {
    const response = await fetch(
      `/api/applications/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    const updatedJob: JobApplication =
      await response.json();

    setApplications((current) =>
      current.map((job) =>
        job.id === id ? updatedJob : job
      )
    );

    setError("");
  } catch {
    setError("Unable to update application status.");
  }
}

const filteredApplications = applications.filter((job) => {
  const query = searchTerm.trim().toLowerCase();

  const matchesSearch =
    job.company.toLowerCase().includes(query) ||
    job.position.toLowerCase().includes(query);

  const matchesStatus =
    statusFilter === "All" ||
    job.status === statusFilter;

  return matchesSearch && matchesStatus;
});

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>JobTrack</h1>
        <p>Manage your job applications in one place.</p>
      </header>


{loading && <p>Loading applications...</p>}

{error && (
  <p className="error-message" role="alert">
    {error}
  </p>
)}


      <section className="stats">
        <div className="stat-card">
          <h3>Total Applications</h3>
          <p>{total}</p>
        </div>

        <div className="stat-card">
          <h3>Applied</h3>
          <p>{applied}</p>
        </div>

        <div className="stat-card">
          <h3>Interviews</h3>
          <p>{interviews}</p>
        </div>

        <div className="stat-card">
          <h3>Offers</h3>
          <p>{offers}</p>
        </div>
      </section>

      <section className="panel">
        <h2>Add New Application</h2>


<div className="filters">

  <div className="form-group">
    <label htmlFor="search">Search Applications</label>

    <input
      id="search"
      type="text"
      placeholder="Search by company or position..."
      value={searchTerm}
      onChange={(event) =>
        setSearchTerm(event.target.value)
      }
    />
  </div>

  <div className="form-group">
    <label htmlFor="filter">Filter by Status</label>

    <select
      id="filter"
      value={statusFilter}
      onChange={(event) =>
        setStatusFilter(
          event.target.value as Status | "All"
        )
      }
    >
      <option value="All">All Statuses</option>
      <option value="Applied">Applied</option>
      <option value="Interview">Interview</option>
      <option value="Offer">Offer</option>
      <option value="Rejected">Rejected</option>
    </select>
  </div>

  <button
    type="button"
    className="clear-button"
    onClick={() => {
      setSearchTerm("");
      setStatusFilter("All");
    }}
  >
    Clear Filters
  </button>

</div>

        <form onSubmit={handleAddApplication}>
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              placeholder="e.g. Microsoft"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Position</label>
            <input
              id="position"
              type="text"
              placeholder="e.g. Software Engineer"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as Status)
              }
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <button type="submit">Add Application</button>
        </form>
      </section>

      <section className="panel">
        <h2>My Applications</h2>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            
<tbody>
  {filteredApplications.map((job) => (
    <tr key={job.id}>
      <td>{job.company}</td>
      <td>{job.position}</td>

      <td>
        <select
          className={`status status-${job.status.toLowerCase()}`}
          aria-label={`Status for ${job.company}`}
          value={job.status}
          onChange={(event) =>
            handleStatusChange(
              job.id,
              event.target.value as Status
            )
          }
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </td>

      <td>
        <button
          type="button"
          className="delete-button"
          onClick={() => handleDeleteApplication(job.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>    

{!loading && !error && filteredApplications.length === 0 && (
  <p>
    {applications.length === 0
      ? "No applications yet. Add your first one!"
      : "No applications match your search or filter."}
  </p>
)}

      </section>
    </main>
  );
}

export default App;