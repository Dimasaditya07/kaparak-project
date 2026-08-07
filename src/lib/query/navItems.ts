import { AdminNavItem } from "@/lib/query/navigation";

import DashboardIcon from "@/components/icons/DashboardIcon";
import InventoryIcon from "@/components/icons/InventoryIcon";
import ReservationIcon from "@/components/icons/ReservationIcon";
import { UserIcon } from "@/components/icons/UserIcon";
import ReportsIcon from "@/components/icons/ReportsIcon";

export const adminNavItems: AdminNavItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    Icon: DashboardIcon,
  },
  {
    name: "Kelola",
    Icon: InventoryIcon,
    subItems: [
      {
        name: "Paket",
        href: "/admin/inventory/package",
      },
      {
        name: "Kategori",
        href: "/admin/inventory/category",
      },
      {
        name: "Peralatan",
        href: "/admin/inventory/product",
      },
    ],
  },
  {
    name: "Pesanan",
    Icon: ReservationIcon,
    subItems: [
      {
        name: "Reservasi",
        href: "/admin/orders/reservations",
      },
      {
        name: "Pembayaran",
        href: "/admin/orders/payments",
      }
    ]
  },
  {
    name: "Akun Customer",
    href: "/admin/users",
    Icon: UserIcon,
  },
  {
    name: "Laporan",
    href: "/admin/reports",
    Icon: ReportsIcon,
  },
];