"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import WhiteLogo from "../img/logo-white.png";
import BlackLogo from "../img/logo-black.png";

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

    // Check login state on mount
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);

    // Navbar scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isMounted) {
    return null;
  }

  const isHomePage = pathname === "/";
  const textClass = isHomePage ? "text-home-page" : "text-other-pages";
  const buttonClass = isHomePage ? "btn-home-page" : "btn-other-pages";
  const logoSrc = isHomePage ? WhiteLogo : BlackLogo;
  const navbarClass = isHomePage ? "fixed-navbar" : "";

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="container">
      <div className="heros">
        <div className={`navbar ${navbarClass} ${scrolled ? "scrolled" : ""}`}>
          <nav className="nav">
            <div className="logo">
              <Image className="navlogo" src={logoSrc} alt="Logo" height={75} />
            </div>

            <div className="hamburger" onClick={toggleMenu}>
              <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
              <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
              <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
            </div>

            <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
              <Link className="link" href="/">
                <li className={textClass}>Home</li>
              </Link>
              <Link className="link" href="/components/About">
                <li className={textClass}>About</li>
              </Link>
              <Link className="link" href="/components/Notes">
                <li className={textClass}>Notes</li>
              </Link>
              <Link className="link" href="/college">
                <li className={textClass}>Colleges</li>
              </Link>
              {!isLoggedIn ? (
                <button className={` ${buttonClass}`}>
                  <Link href="/components/Login">Get Started</Link>
                </button>
              ) : (
                <button className={` ${buttonClass}`} onClick={handleLogout}>
                  Logout
                </button>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}