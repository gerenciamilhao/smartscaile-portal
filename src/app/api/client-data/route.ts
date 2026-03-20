import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getClientData } from "@/lib/clients";

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const clienteSlug = request.nextUrl.searchParams.get("cliente") || session.clientId;
  const data = getClientData(clienteSlug);

  if (!data) {
    return NextResponse.json({ error: "Dados não encontrados" }, { status: 404 });
  }

  return NextResponse.json(data);
}
