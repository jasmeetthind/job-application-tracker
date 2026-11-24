import { useState, type SubmitEvent } from "react";
import "./App.css";

type Status = "Applied" | "Interview" | "Offer" | "Rejected";

type JobApplication = {
  id: string;
  company: string;
  position: string;
  status: Status;
};

const startingApplications: JobApplication[] = [
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
];

function App() {
  const [applications, setApplications] =
    useState<JobApplication[]>(startingApplications);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState<Status>("Applied");

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

  function handleAddApplication(event: SubmitEvent<HTMLFormElement>){
    event.preventDefault();

    const newJob: JobApplication = {
      id: crypto.randomUUID(),
      company: company.trim(),
      position: position.trim(),
      status: status,
    };

    if (!newJob.company || !newJob.position) {
      return;
    }

    setApplications([...applications, newJob]);

    setCompany("");
    setPosition("");
    setStatus("Applied");
  }

  function handleDeleteApplication(id: string) {
  setApplications((currentApplications) =>
    currentApplications.filter((job) => job.id !== id)
  );
}

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>JobTrack</h1>
        <p>Manage your job applications in one place.</p>
      </header>

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
              {applications.map((job) => (
                <tr key={job.id}>
                  <td>{job.company}</td>
                  <td>{job.position}</td>
                  <td>
                    <span
                      className={`status status-${job.status.toLowerCase()}`}
                    >
                      {job.status}
                    </span>
                  </td>

<td>
  <button
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

        {applications.length === 0 && (
          <p>No applications yet. Add your first one!</p>
        )}
      </section>
    </main>
  );
}

export default App;