import React from "react";

export default function MountainIcon({
  className = "w-6 h-6", // Ukuran default
  strokeWidth = 2,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor" // Akan mengikuti warna text (misal: text-white, text-green-500)
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Bentuk Gunung */}
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

// Opsi 2: Jika Anda ingin gunung yang ada salju/puncak terpisahnya
export function MountainSnowIcon({
  className = "w-6 h-6",
  strokeWidth = 2,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      <path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19" />
    </svg>
  );
}