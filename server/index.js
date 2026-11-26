import express from "express";
import { randomUUID } from "node:crypto";
import { pool } from "./db.js";

const app = express();
const PORT = 3001;

app.use(express.json());

const validStatuses = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

// GET: Retrieve all job applications
app.get("/api/applications", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, company, position, status
       FROM job_applications
       ORDER BY created_at DESC, id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to retrieve applications.",
    });
  }
});

// POST: Add a job application
app.post("/api/applications", async (req, res) => {
  const { company, position, status } = req.body ?? {};

  if (
    typeof company !== "string" ||
    !company.trim() ||
    company.trim().length > 100 ||
    typeof position !== "string" ||
    !position.trim() ||
    position.trim().length > 150 ||
    !validStatuses.includes(status)
  ) {
    return res.status(400).json({
      error: "Invalid application details.",
    });
  }

  try {
    const id = randomUUID();

    const result = await pool.query(
      `INSERT INTO job_applications
       (id, company, position, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, company, position, status`,
      [id, company.trim(), position.trim(), status]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to add application.",
    });
  }
});

// PATCH: Update application status
app.patch("/api/applications/:id", async (req, res) => {
  const { id } = req.params;
  const newStatus = req.body?.status;

  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({
      error: "Invalid application status.",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE job_applications
       SET status = $1
       WHERE id = $2
       RETURNING id, company, position, status`,
      [newStatus, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Application not found.",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to update application.",
    });
  }
});

// DELETE: Remove an application
app.delete("/api/applications/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM job_applications
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Application not found.",
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to delete application.",
    });
  }
});

// Verify database connection before starting the server
async function startServer() {
  try {
    await pool.query("SELECT 1");

    app.listen(PORT, () => {
      console.log(
        `JobTrack backend running at http://localhost:${PORT}`
      );
      console.log("PostgreSQL connected successfully!");
    });
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error);
    process.exit(1);
  }
}

void startServer();
