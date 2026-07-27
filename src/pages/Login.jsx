import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Couldn't sign in. Check your email and password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ledger-navy px-4">
      <form onSubmit={handleSubmit} className="badge-card w-full max-w-sm p-8 ml-2">
        <p className="font-display text-2xl font-semibold text-ledger-navy">
          School<span className="text-ledger-marigold">Register</span>
        </p>
        <p className="text-sm text-ledger-navy/60 mt-1 mb-6">Sign in to your account</p>

        {error && (
          <p className="text-sm text-ledger-brick bg-ledger-brick/10 rounded px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <label className="block text-xs font-mono uppercase text-ledger-navy/60 mb-1">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-ledger-line rounded px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-ledger-marigold"
        />

        <label className="block text-xs font-mono uppercase text-ledger-navy/60 mb-1">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-ledger-line rounded px-3 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-ledger-marigold"
        />

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-ledger-navy text-white rounded py-2.5 text-sm font-medium hover:bg-ledger-navyDeep transition-colors disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
