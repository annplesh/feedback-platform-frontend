import { useState, useRef, useEffect } from "react";

// Navbar — shared top bar for all public pages.
// Props:
//   page        {string}   current active page id
//   setPage     {function} navigate to a page
//   user        {object}   current user or null
//   isAdmin     {boolean}  whether current user is admin
//   userName    {string}   name from first review submission
//   onSignOut   {function} sign out handler
//   onAdminPage {function} navigate to admin page

export default function Navbar({
  page,
  setPage,
  user,
  isAdmin,
  userName,
  onSignOut,
  onAdminPage,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const links = [
    { id: "submit", label: "Leave a Review" },
    { id: "wall", label: "All Reviews" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-paper border-b border-cream sticky top-0 z-50">
      <nav className="max-w-5xl mx-auto px-3 xs:px-2 py-2 xs:py-2 flex items-center justify-between">
        {/* Brand mark */}
        <button
          onClick={() => setPage("wall")}
          className="flex items-center gap-1.5 xs:gap-1 focus:outline-none focus:ring-0"
          aria-label="Go to home"
        >
          <div className="w-7 h-7 xs:w-6 xs:h-6 bg-ink rounded flex items-center justify-center">
            <span className="text-paper text-[11px] xs:text-[10px] font-semibold tracking-tight">
              FB
            </span>
          </div>
          <span className="font-display text-base xs:text-sm text-ink font-semibold leading-none">
            FeedbackHub
          </span>
        </button>

        {/* Nav links + auth */}
        <div className="flex items-center gap-1 xs:gap-0.5">
          <ul className="flex items-center gap-1 xs:gap-0.5">
            {links.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => setPage(link.id)}
                  className={[
                    "px-3 py-1.5 xs:px-2 xs:py-0.5 rounded-md text-xs xs:text-[10px] font-medium transition-colors focus:outline-none focus:ring-0",
                    page === link.id
                      ? "bg-ink text-paper"
                      : "text-muted hover:text-ink hover:bg-cream",
                  ].join(" ")}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Auth buttons — guest */}
          {!user ? (
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => setPage("login")}
                className={[
                  "px-3 py-1.5 xs:px-2 xs:py-0.5 rounded-md text-xs font-medium transition-colors focus:outline-none focus:ring-0",
                  page === "login"
                    ? "bg-ink text-paper"
                    : "text-muted hover:text-ink hover:bg-cream",
                ].join(" ")}
              >
                Sign In
              </button>
            </div>
          ) : (
            /* Avatar dropdown — authenticated */
            <div ref={dropdownRef} className="relative ml-2">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-1.5 px-3 py-1.5 xs:px-2 xs:py-0.5 rounded-md text-xs font-medium text-muted hover:text-ink hover:bg-cream transition-colors focus:outline-none focus:ring-0"
              >
                <div className="w-5 h-5 rounded-full bg-ink flex items-center justify-center">
                  <span className="text-paper text-[9px] font-semibold">
                    {userName
                      ? userName[0].toUpperCase()
                      : user.email[0].toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:block">
                  {userName ? `Hi, ${userName.split(" ")[0]}!` : "Account"}
                </span>
                <span
                  className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                >
                  ‹
                </span>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-cream rounded-lg shadow-sm overflow-hidden z-50">
                  {isAdmin && (
                    <button
                      onClick={() => {
                        onAdminPage();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-ink hover:bg-cream transition-colors focus:outline-none focus:ring-0"
                    >
                      Admin Panel
                    </button>
                  )}
                  {/* Divider */}
                  {isAdmin && <div className="border-t border-cream" />}
                  <button
                    onClick={() => {
                      onSignOut();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-muted hover:bg-cream transition-colors focus:outline-none focus:ring-0 flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
