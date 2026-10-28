import { Outlet } from "react-router";
import { Header } from "~/views/header/header";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="bg-muted">
        <Outlet />
      </main>    </div>
  );
}