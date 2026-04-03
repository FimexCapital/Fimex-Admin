import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

// In production, use a database. For now, env-based credentials.
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "FimexCapital2026!";

// Pre-hash on first load
let hashedPassword: string | null = null;
async function getHash() {
  if (!hashedPassword) {
    hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  }
  return hashedPassword;
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Credenciales requeridas" }, { status: 400 });
    }

    if (username !== ADMIN_USER) {
      return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
    }

    // Compare directly for simplicity (env-based auth)
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
    }

    const token = signToken({ user: username, role: "admin" });

    return NextResponse.json({ token, user: { name: "Administrador", role: "admin" } });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
