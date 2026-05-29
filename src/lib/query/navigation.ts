export interface AdminSubItem {
  name: string;
  href: string;
}

export interface AdminNavItem {
  name: string;
  href?: string;
  Icon: React.ComponentType<{ className?: string }>;
  subItems?: AdminSubItem[];
}