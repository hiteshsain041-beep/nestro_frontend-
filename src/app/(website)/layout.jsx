import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import { getProfile } from "@/utils/api.server";

export default async function WebsiteLayout({ children }) {
  // Fetch the logged-in user server-side from the JWT cookie.
  // getProfile is wrapped in React.cache() — one fetch per request, no duplicates.
  // Returns { data: null } gracefully if the cookie is absent or expired.
  const { data: user } = await getProfile();

  return (
    <>
      <Header user={user} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
