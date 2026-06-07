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
    ],
  },
  {
    name: "Orders",
    Icon: ReservationIcon,
    subItems: [
      {
        name: "Reservations",
        href: "/admin/orders/reservations",
      },
      {
        name: "Payments",
        href: "/admin/orders/payments",
      }
    ]
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