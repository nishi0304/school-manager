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
    <div className="min-h-screen flex items-center justify-center bg-gy-ink px-4 relative overflow-hidden">
      {/* subtle gold glow accents */}
      <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-gy-gold/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-gy-teal/10 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="brand-mark w-14 h-14 rounded-full flex items-center justify-center font-display text-2xl font-semibold mx-auto mb-4">
            ग
          </div>
          <p className="font-display text-3xl font-semibold text-white tracking-tight">
            Gyanam <span className="text-gy-goldLight">Classes</span>
          </p>
          <p className="text-sm text-white/50 italic mt-1">a place of complete learning</p>
        </div>

        <form onSubmit={handleSubmit} className="badge-card p-8">
          <p className="text-sm text-gy-ink/60 mb-6">Sign in to your account</p>

          {error && (
            <p className="text-sm text-gy-coral bg-gy-coral/10 rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )}

          <label className="block text-xs font-mono uppercase text-gy-ink/50 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gy-line rounded-lg px-3 py-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-gy-gold/50 focus:border-gy-gold"
          />

          <label className="block text-xs font-mono uppercase text-gy-ink/50 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gy-line rounded-lg px-3 py-2.5 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-gy-gold/50 focus:border-gy-gold"
          />

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-gy-ink text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gy-inkDeep transition-colors disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
