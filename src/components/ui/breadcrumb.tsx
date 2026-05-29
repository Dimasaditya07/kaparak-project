// ui/breadcrumb.tsx
"use client";

import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-xs font-mono font-medium text-gray-400 mb-4 uppercase tracking-wider">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {isLast ? (
              <span className="text-green-700 font-bold">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href} 
                className="hover:text-green-600 transition-colors duration-200"
              >
                {item.label}
              </Link>
            )}
            
            {/* Tampilkan separator jika bukan item terakhir */}
            {!isLast && <span className="text-gray-300">/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}