import { Router } from "express";
import { randomUUID } from "node:crypto";
import argon2 from "argon2";
import { pool } from "./db.js";

const router = Router();

// Create a session after registration or login
function startSession(req, res, user, statusCode = 200) {
  req.session.regenerate((error) => {
    if (error) {
      return res.status(500).json({
        error: "Could not start session.",
      });
    }

    req.session.userId = user.id;

    req.session.save((error) => {
      if (error) {
        return res.status(500).json({
          error: "Could not save session.",
        });
      }

      res.status(statusCode).json({
        user: {
          id: user.id,
          email: user.email,
        },
      });
    });
  });
}

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    email.trim().length > 254 ||
    typeof password !== "string" ||
    password.length < 12 ||
    password.length > 128
  ) {
    return res.status(400).json({
      error: "Enter a valid email and a password of 12-128 characters.",
    });
  }

  try {
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    const result = await pool.query(
      `INSERT INTO users (id, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email`,
      [
        randomUUID(),
        email.trim().toLowerCase(),
        passwordHash,
      ]
    );

    startSession(req, res, result.rows[0], 201);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "An account with this email already exists.",
      });
    }

    console.error(error);
    res.status(500).json({
      error: "Could not create account.",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.length > 254 ||
    password.length > 128
  ) {
    return res.status(400).json({
      error: "Valid email and password are required.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT id, email, password_hash
       FROM users
       WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    const user = result.rows[0];

    const validPassword = user
      ? await argon2.verify(user.password_hash, password)
      : false;

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    startSession(req, res, user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not log in.",
    });
  }
});

// CHECK CURRENT ACCOUNT
router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      error: "Not logged in.",
    });
  }

  try {
    const result = await pool.query(
      "SELECT id, email FROM users WHERE id = $1",
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Not logged in.",
      });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not check account.",
    });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        error: "Could not log out.",
      });
    }

    res.clearCookie("jobtrack.sid", { path: "/" });
    res.status(204).send();
  });
});

// Protect endpoints that require login
export function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      error: "Please log in.",
    });
  }

  next();
}

export default router;
