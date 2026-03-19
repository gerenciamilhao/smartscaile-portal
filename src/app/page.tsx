import { getSession } from "@/lib/auth";
import { getClientData, type ClientData } from "@/lib/clients";
import CinematicExperience from "@/components/cinematic/CinematicExperience";

export default async function Home() {
  let initialData: ClientData | null = null;

  const session = await getSession();
  if (session) {
    initialData = getClientData(session.clientId);
  }

  return <CinematicExperience initialData={initialData} />;
}
