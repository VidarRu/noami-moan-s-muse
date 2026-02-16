import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className="flex-1 lg:ml-16">
        <Outlet />
      </main>
    </div>
  );
}
