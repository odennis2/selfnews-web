import { Button } from "components/ui/button";
import { RiShining2Fill } from "@remixicon/react";
import { Link, NavLink, Router } from "react-router";

function ContentNav() {}

export function Header() {
  return (
    <div>
      {/* Header */}
      <header className="w-full border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <NavLink to="/">
            <a className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full">
                <RiShining2Fill className="size-4" />
              </div>
              <span className="text-lg font-semibold">SelfNews</span>
            </a>
          </NavLink>

          <nav className="hidden items-center gap-1 sm:flex">
            <Button variant="ghost" size="sm">
              <Link to="/">Home</Link>
            </Button>
            <Button variant="ghost" size="sm">
              <Link to="/content">Content</Link>
            </Button>
            <Button variant="ghost" size="sm">
              About
            </Button>
          </nav>

          <Button variant="outline">Sign In</Button>
        </div>
      </header>
    </div>
  );
}
