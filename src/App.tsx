import { useEffect, useState, type SubmitEvent } from "react";
import AuthPage, { type AuthUser } from "./AuthPage";
import "./App.css";

type Status = "Applied" | "Interview" | "Offer" | "Rejected";

type JobApplication = {
  id: string;
  company: string;
  position: string;
  status: Status;
};

function App() {
  // Authentication state
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Application state
  const [applications, setApplications] =
    useState<JobApplication[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState<Status>("Applied");

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<Status | "All">("All");

  // Load applications from Express
  async function loadApplications() {
    setLoading(true);

    try {
      const response = await fetch("/api/applications");

      if (!response.ok) {
        throw new Error("Failed to load applications");
      }

      const data: JobApplication[] = await response.json();

      setApplications(data);
      setError("");
    } catch {
      setError("Unable to load applications.");
    } finally {
      setLoading(false);
    }
  }

  // Restore a previous login session
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/auth/me");

        if (response.status === 401) {
          return;
        }

        if (!response.ok) {
          throw new Error("Session check failed");
        }

        const data: { user: AuthUser } =
          await response.json();

        setUser(data.user);
        await loadApplications();
      } catch {
        setError("Unable to connect to the backend.");
      } finally {
        setCheckingAuth(false);
      }
    }

    void checkSession();
  }, []);

  // Handle successful registration or login
  async function handleLoginSuccess(nextUser: AuthUser) {
    setApplications([]);
    setUser(nextUser);
    await loadApplications();
  }

  // Log out
  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      setApplications([]);
      setSearchTerm("");
      setStatusFilter("All");
      setError("");
    } catch {
      setError("Unable to log out.");
    }
  }

  // Add a new application
  async function handleAddApplication(
    event: SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const newJob = {
      company: company.trim(),
      position: position.trim(),
      status,
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
        throw new Error("Unable to add application");
      }

      const savedJob: JobApplication =
        await response.json();

      setApplications((current) => [
        savedJob,
        ...current,
      ]);

      setCompany("");
      setPosition("");
      setStatus("Applied");
      setError("");
    } catch {
      setError("Unable to add application.");
    }
  }

  // Delete an application
  async function handleDeleteApplication(id: string) {
    try {
      const response = await fetch(
        `/api/applications/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to delete");
      }

      setApplications((current) =>
        current.filter((job) => job.id !== id)
      );

      setError("");
    } catch {
      setError("Unable to delete application.");
    }
  }

  // Update an application's status
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
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to update");
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

  // Search and filter applications
  const filteredApplications = applications.filter(
    (job) => {
      const query = searchTerm.trim().toLowerCase();

      const matchesSearch =
        job.company.toLowerCase().includes(query) ||
        job.position.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        job.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  // Display a loading screen during session check
  if (checkingAuth) {
    return (
      <main className="dashboard">
        <p>Checking your account...</p>
      </main>
    );
  }

  // Display login/registration when logged out
  if (!user) {
    return (
      <AuthPage
        onSuccess={(nextUser) => {
          void handleLoginSuccess(nextUser);
        }}
      />
    );
  }

  // Logged-in dashboard
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>JobTrack</h1>
        <p>Manage your job applications in one place.</p>

        <p>Signed in as: {user.email}</p>

        <button
          type="button"
          onClick={() => void handleLogout()}
        >
          Log Out
        </button>
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

        <form onSubmit={handleAddApplication}>
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(event) =>
                setCompany(event.target.value)
              }
              placeholder="e.g. Microsoft"
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Position</label>
            <input
              id="position"
              type="text"
              value={position}
              onChange={(event) =>
                setPosition(event.target.value)
              }
              placeholder="e.g. Software Engineer"
              maxLength={150}
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

          <button type="submit" disabled={loading}>
            Add Application
          </button>
        </form>
      </section>

      <section className="panel">
        <h2>My Applications</h2>

        <div className="filters">
          <div className="form-group">
            <label htmlFor="search">
              Search Applications
            </label>
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
            <label htmlFor="filter">
              Filter by Status
            </label>
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
                        void handleStatusChange(
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
                      onClick={() =>
                        void handleDeleteApplication(job.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading &&
          !error &&
          filteredApplications.length === 0 && (
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
