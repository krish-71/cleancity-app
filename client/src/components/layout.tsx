import { Link, useLocation } from "wouter";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Leaf, LogOut, Menu, User, MapPin, BarChart3, BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useApp();
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const NavLink = ({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon: any }) => (
    <Link href={href} onClick={() => setIsOpen(false)}>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors cursor-pointer ${
        location === href 
          ? "bg-primary/10 text-primary font-medium" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}>
        <Icon className="w-4 h-4" />
        {children}
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold font-heading tracking-tight text-foreground">
                Clean<span className="text-primary">City</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/" icon={Leaf}>Home</NavLink>
            <NavLink href="/education" icon={BookOpen}>Education</NavLink>
            {user && (
              <>
                {user.role === "admin" ? (
                  <NavLink href="/admin" icon={BarChart3}>Admin Dashboard</NavLink>
                ) : (
                  <>
                    <NavLink href="/dashboard" icon={User}>My Complaints</NavLink>
                    <NavLink href="/new-complaint" icon={MapPin}>Report Issue</NavLink>
                  </>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-1 ring-border">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.username}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link href="/auth">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  <NavLink href="/" icon={Leaf}>Home</NavLink>
                  <NavLink href="/education" icon={BookOpen}>Education</NavLink>
                  {user ? (
                    <>
                      {user.role === "admin" ? (
                        <NavLink href="/admin" icon={BarChart3}>Admin Dashboard</NavLink>
                      ) : (
                        <>
                          <NavLink href="/dashboard" icon={User}>My Complaints</NavLink>
                          <NavLink href="/new-complaint" icon={MapPin}>Report Issue</NavLink>
                        </>
                      )}
                      <Button variant="destructive" className="w-full mt-4" onClick={() => logout()}>
                        Log out
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 mt-4">
                      <Link href="/auth" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">Log in</Button>
                      </Link>
                      <Link href="/auth?tab=register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full">Get Started</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">CleanCity Portal</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 CleanCity Initiative. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
