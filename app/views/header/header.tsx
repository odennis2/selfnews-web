import { buttonVariants } from "components/ui/button";
import { RiShining2Fill } from "@remixicon/react";
import { Link, NavLink } from "react-router";
import { cn } from "lib/utils";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/content", label: "Content" },
];

export function Header() {
  return (
    <header className="bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full">
            <RiShining2Fill className="size-4" />
          </div>
          <span className="text-lg font-semibold">SelfNews</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-[13px]",
                  isActive && "bg-accent text-accent-foreground",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
