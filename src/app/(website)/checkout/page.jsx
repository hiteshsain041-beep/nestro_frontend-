import Checkout from "@/components/website/Checkout";
import { getProfile } from "@/utils/api.server";

export default async function Page() {
  // Fetch the logged-in user server-side so Checkout has real user data
  const { data: user } = await getProfile();
  return <Checkout user={user} />;
}
