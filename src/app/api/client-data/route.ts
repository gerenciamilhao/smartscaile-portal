import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getClientData } from "@/lib/clients";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const data = getClientData(session.clientId);

  if (!data) {
    return NextResponse.json({ error: "Dados não encontrados" }, { status: 404 });
  }

  return NextResponse.json(data);
}
