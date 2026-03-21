import { NextRequest, NextResponse } from "next/server";
import { getClientData } from "@/lib/clients";

export async function GET(request: NextRequest) {
  const clienteSlug = request.nextUrl.searchParams.get("cliente");

  if (!clienteSlug) {
    return NextResponse.json({ error: "Cliente não especificado" }, { status: 400 });
  }

  const data = getClientData(clienteSlug);

  if (!data) {
    return NextResponse.json({ error: "Dados não encontrados" }, { status: 404 });
  }

  return NextResponse.json(data);
}
