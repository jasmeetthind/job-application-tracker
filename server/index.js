import express from "express";
import { randomUUID } from "node:crypto";

const app = express();
const PORT = 3001;

// Allow Express to read incoming JSON data.
app.use(express.json());

// Temporary application data.
let applications = [
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

const validStatuses = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

// GET: Retrieve all applications.
app.get("/api/applications", (req, res) => {
  res.json(applications);
});

// POST: Add a new application.
app.post("/api/applications", (req, res) => {
  const { company, position, status } = req.body ?? {};

  if (
    typeof company !== "string" ||
    !company.trim() ||
    typeof position !== "string" ||
    !position.trim() ||
    !validStatuses.includes(status)
  ) {
    return res.status(400).json({
      error: "Please provide valid application details.",
    });
  }

  const newJob = {
    id: randomUUID(),
    company: company.trim(),
    position: position.trim(),
    status,
  };

  applications.push(newJob);

  res.status(201).json(newJob);
});

// PATCH: Update an application's status.
app.patch("/api/applications/:id", (req, res) => {
  const job = applications.find(
    (item) => item.id === req.params.id
  );

  if (!job) {
    return res.status(404).json({
      error: "Application not found.",
    });
  }

  const newStatus = req.body?.status;

  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({
      error: "Invalid application status.",
    });
  }

  job.status = newStatus;

  res.json(job);
});

// DELETE: Remove an application.
app.delete("/api/applications/:id", (req, res) => {
  const index = applications.findIndex(
    (job) => job.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      error: "Application not found.",
    });
  }

  applications.splice(index, 1);

  res.status(204).send();
});

// Start the backend server.
app.listen(PORT, () => {
  console.log(
    `JobTrack backend running at http://localhost:${PORT}`
  );
});