// Middleware (middleware.js) already guarantees that only authenticated users
// with role=admin or role=superAdmin can reach any /admin route.
// No server-side auth check is needed here — removing it eliminates the
// getProfile() network call that was causing the continuous GET /admin loop.

import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function AdminLayout({ children }) {
  return (
    <div className="w-full flex h-full min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 bg-[#f6f8fc]">{children}</div>
      </div>
    </div>
  );
}
