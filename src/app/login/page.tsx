"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FimexLogo from "@/components/ui/FimexLogo";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error de autenticación");
      localStorage.setItem("fimex_token", data.token);
      router.replace("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-panel-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-navy/5" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-fimex-red/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-navy/5" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-navy/10 border border-panel-border overflow-hidden">
          {/* Header */}
          <div className="bg-navy px-8 py-8 text-center relative">
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-fimex-red via-fimex-red-light to-fimex-red" />
            <div className="flex justify-center mb-3">
              <FimexLogo height={52} />
            </div>
            <p className="text-white/40 text-xs tracking-widest uppercase">Panel Administrativo</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="px-8 py-8 space-y-5">
            <div>
              <label className="block text-xs font-bold text-navy/60 uppercase tracking-wider mb-1.5">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-panel-bg border border-panel-border rounded-lg text-navy font-medium text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy placeholder:text-navy/25"
                placeholder="Ingresa tu usuario"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy/60 uppercase tracking-wider mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-panel-bg border border-panel-border rounded-lg text-navy font-medium text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy placeholder:text-navy/25 pr-12"
                  placeholder="Ingresa tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {showPwd ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-fimex-red/10 border border-fimex-red/20 rounded-lg px-4 py-2.5 text-fimex-red text-sm font-semibold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-fimex-red hover:bg-fimex-red-dark text-white font-bold text-sm uppercase tracking-wider rounded-lg shadow-lg shadow-fimex-red/30 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-fimex-red/50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verificando...
                </span>
              ) : "Iniciar Sesión"}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <p className="text-[10px] text-navy/25">FIMEX CAPITAL — SOFOM E.N.R. — Sistema interno</p>
          </div>
        </div>
      </div>
    </div>
  );
}
