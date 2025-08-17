"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { useLogout } from "@/hooks/useLogout";

const Navbar = ({ isDashboard = true }: { isDashboard?: boolean }) => {
  const rootNavItems = [
    { id: 1, navigateTo: "#features", text: "Features" },
    { id: 2, navigateTo: "#services", text: "Services" },
    { id: 3, navigateTo: "#about", text: "About" },
    { id: 4, navigateTo: "#contact", text: "Contact" },
  ];

  const { user, setUser } = useSession();
  const router = useRouter();

  const { setLoading: setLogoutLoading } = useLogout();

  const handleLogout = () => {
    setUser(null);
    setLogoutLoading(true);
    setTimeout(() => {
      setLogoutLoading(false);
    }, 2000);
    router.replace("/");
  };

  const handleHomeNavigate = () => {
    if (user) router.replace("/dashboard");
    else router.replace("/");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div
              role="button"
              tabIndex={0}
              onClick={handleHomeNavigate}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleHomeNavigate();
                }
              }}
              className="cursor-pointer"
            >
              <h1 className="text-2xl font-bold text-amber-700">Amrutam</h1>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isDashboard ? (
                <div></div>
              ) : (
                rootNavItems.map((item) => (
                  <a
                    href={item.navigateTo}
                    key={item.id}
                    className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.text}
                  </a>
                ))
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <button onClick={handleLogout} className="button-class px-4 py-2">
                {user?.name}
              </button>
            ) : (
              <>
                <Link href="/auth" className="button-outline-class px-4 py-1.5">
                  Sign In
                </Link>
                <Link href="/auth" className="button-class px-4 py-2">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
