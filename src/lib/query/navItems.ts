import { AdminNavItem } from "@/lib/query/navigation";

import DashboardIcon from "@/components/icons/DashboardIcon";
import InventoryIcon from "@/components/icons/InventoryIcon";
import ReservationIcon from "@/components/icons/ReservationIcon";
import { UserIcon } from "@/components/icons/UserIcon";
import ReportsIcon from "@/components/icons/ReportsIcon";
import SettingsIcon from "@/components/icons/SettingsIcon";

export const adminNavItems: AdminNavItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    Icon: DashboardIcon,
  },
  {
    name: "Inventory",
    Icon: InventoryIcon,
    subItems: [
      {
        name: "Category",
        href: "/admin/inventory/category",
      },
      {
        name: "Product",
        href: "/admin/inventory/product",
      },
      {
        name: "Paket",
        href: "/admin/inventory/bundling",
      },
    ],
  },
  {
    name: "Reservations",
    href: "/admin/reservations",
    Icon: ReservationIcon,
  },
  {
    name: "Users",
    href: "/admin/users",
    Icon: UserIcon,
  },
  {
    name: "Reports",
    href: "/admin/reports",
    Icon: ReportsIcon,
  },
];