import { getSession } from "@/lib/auth";
import { getClientData, type ClientData } from "@/lib/clients";
import CinematicExperience from "@/components/cinematic/CinematicExperience";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ cliente: string }>;
}

export default async function ClientePage({ params }: Props) {
  const { cliente } = await params;

  // Verify client exists
  const clientExists = getClientData(cliente);
  if (!clientExists) {
    notFound();
  }

  let initialData: ClientData | null = null;

  const session = await getSession();
  if (session && session.clientId === cliente) {
    initialData = clientExists;
  }

  return <CinematicExperience initialData={initialData} clienteSlug={cliente} />;
}
