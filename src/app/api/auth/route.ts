import { NextRequest, NextResponse } from "next/server";
import { createToken, COOKIE_NAME } from "@/lib/auth";
import tokenMap from "@/data/token-map.json";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Token é obrigatório" },
        { status: 400 }
      );
    }

    const trimmed = token.trim();
    const entry = (tokenMap as Record<string, { clientId: string; name: string }>)[trimmed];

    if (!entry) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    const jwt = await createToken({
      clientId: entry.clientId,
      name: entry.name,
    });

    const response = NextResponse.json({ success: true, name: entry.name, clientId: entry.clientId });

    response.cookies.set(COOKIE_NAME, jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
