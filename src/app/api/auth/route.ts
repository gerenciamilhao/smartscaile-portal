import { NextRequest, NextResponse } from "next/server";
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

    return NextResponse.json({ success: true, name: entry.name, clientId: entry.clientId });
  } catch {
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
