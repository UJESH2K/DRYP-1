"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import ShimmerButton from "./ShimmerButton";






export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        setScrolled(currentScrollY > 50);

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-500 transform ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
          scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm' : 'bg-transparent'
      }`}
    >
        {/* Logo - Left */}
        <Link href="/" className="pointer-events-auto group">
          <span className={`font-josefin-sans text-3xl md:text-4xl font-bold tracking-tighter text-black mix-blend-difference group-hover:opacity-80 transition-opacity`}>
            DRYP
          </span>
        </Link>

        {/* Auth Buttons - Right */}
        <div className="transition-opacity duration-300">
           {isAuthenticated ? (
             <ShimmerButton text="Logout" onClick={logout} small={true} />
           ) : (
             <ShimmerButton text="Get Started" href="/signup" small={true} />
           )}
        </div>
    </nav>
  );
}