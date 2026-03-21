import { getClientData } from "@/lib/clients";
import CinematicExperience from "@/components/cinematic/CinematicExperience";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ cliente: string }>;
}

export default async function ClientePage({ params }: Props) {
  const { cliente } = await params;

  const clientExists = getClientData(cliente);
  if (!clientExists) {
    notFound();
  }

  return <CinematicExperience clienteSlug={cliente} />;
}
