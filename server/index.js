import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { randomUUID } from "node:crypto";

import { pool } from "./db.js";
import authRouter, { requireAuth } from "./auth.js";

const app = express();
const PORT = 3001;

app.use(express.json());

if (!process.env.SESSION_SECRET) {
  throw new Error("Missing SESSION_SECRET in server/.env");
}

// Store login sessions in PostgreSQL
const PgSession = connectPgSimple(session);

app.use(
  session({
    name: "jobtrack.sid",
    store: new PgSession({
      pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Authentication routes
app.use("/api/auth", authRouter);

// All application endpoints require login
app.use("/api/applications", requireAuth);

const validStatuses = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET: Retrieve applications owned by the user
app.get("/api/applications", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, company, position, status
       FROM job_applications
       WHERE user_id = $1
       ORDER BY created_at DESC, id DESC`,
      [req.session.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not retrieve applications.",
    });
  }
});

// POST: Add an application
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
    const result = await pool.query(
      `INSERT INTO job_applications
       (id, company, position, status, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, company, position, status`,
      [
        randomUUID(),
        company.trim(),
        position.trim(),
        status,
        req.session.userId,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not add application.",
    });
  }
});

// PATCH: Update an application owned by the user
app.patch("/api/applications/:id", async (req, res) => {
  const { id } = req.params;
  const newStatus = req.body?.status;

  if (!uuidPattern.test(id)) {
    return res.status(400).json({
      error: "Invalid application ID.",
    });
  }

  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({
      error: "Invalid status.",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE job_applications
       SET status = $1
       WHERE id = $2 AND user_id = $3
       RETURNING id, company, position, status`,
      [newStatus, id, req.session.userId]
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
      error: "Could not update application.",
    });
  }
});

// DELETE: Remove an application owned by the user
app.delete("/api/applications/:id", async (req, res) => {
  const { id } = req.params;

  if (!uuidPattern.test(id)) {
    return res.status(400).json({
      error: "Invalid application ID.",
    });
  }

  try {
    const result = await pool.query(
      `DELETE FROM job_applications
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, req.session.userId]
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
      error: "Could not delete application.",
    });
  }
});

// Start the server after checking PostgreSQL
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
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

void startServer();
