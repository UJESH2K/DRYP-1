"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ShimmerButtonProps {
  text: string;
  href?: string;
  small?: boolean;
  onClick?: () => void;
}

const ShimmerButton: React.FC<ShimmerButtonProps> = ({ text, href, small = false, onClick }) => (
  <Link 
    href={href || "#"} 
    onClick={onClick}
    className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#0A0A0A] font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl
    ${small ? 'h-10 px-6 text-sm' : 'h-14 md:h-16 px-10 md:px-12 text-lg md:text-xl'}
    `}
  >
    <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
      <div className="relative h-full w-8 bg-white/20" />
    </div>
    <span className="flex items-center gap-2">
      {text} 
      {href && !small && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1"/>}
    </span>
  </Link>
);

export default ShimmerButton;