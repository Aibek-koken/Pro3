import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "My Health Shield" },
  { to: "/radar", label: "Global Radar" },
];

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        d="M12 2.75c2.13 1.72 4.76 2.64 7.5 2.63v5.08c0 4.67-2.91 8.86-7.31 10.53L12 21.25l-.19-.06C7.41 19.32 4.5 15.13 4.5 10.46V5.38c2.74.01 5.37-.91 7.5-2.63Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.25 12.25h5.5M12 9.5v5.5" strokeLinecap="round" />
    </svg>
  );
}

export function NavBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="inline-flex min-h-10 items-center gap-3 rounded-full px-2 py-1 text-sm font-semibold tracking-[0.16em] text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldIcon />
          </span>
          <span>BioSecurity</span>
        </NavLink>

        <nav className="flex items-center gap-2" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isActive
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-card hover:text-foreground"
                }`
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
