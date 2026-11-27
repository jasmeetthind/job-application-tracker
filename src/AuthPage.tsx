import { useState, type SubmitEvent } from "react";

export type AuthUser = {
  id: string;
  email: string;
};

type AuthPageProps = {
  onSuccess: (user: AuthUser) => void;
};

function AuthPage({ onSuccess }: AuthPageProps) {
  const [mode, setMode] =
    useState<"register" | "login">("register");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Authentication failed.");
        return;
      }

      setPassword("");
      onSuccess(data.user);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="dashboard auth-page">
      <section className="panel">
        <h1>JobTrack</h1>

        <h2>
          {mode === "register"
            ? "Create an Account"
            : "Welcome Back"}
        </h2>

        <p>
          {mode === "register"
            ? "Create an account to track your applications."
            : "Log in to manage your job applications."}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              minLength={mode === "register" ? 12 : undefined}
              required
            />
          </div>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting}>
            {submitting
              ? "Please wait..."
              : mode === "register"
              ? "Create Account"
              : "Log In"}
          </button>
        </form>

        <p>
          {mode === "register"
            ? "Already have an account?"
            : "Don't have an account?"}
        </p>

        <button
          type="button"
          className="clear-button"
          onClick={() => {
            setMode(
              mode === "register" ? "login" : "register"
            );
            setError("");
          }}
        >
          {mode === "register"
            ? "Go to Login"
            : "Create an Account"}
        </button>
      </section>
    </main>
  );
}

export default AuthPage;
