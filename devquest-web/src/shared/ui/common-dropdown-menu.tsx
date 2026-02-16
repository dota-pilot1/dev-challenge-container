import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { Link } from "@tanstack/react-router";

interface DropdownItem {
  to: string;
  label: string;
}

interface CommonDropdownMenuProps {
  label: string;
  items: readonly DropdownItem[];
  isActive?: boolean;
}

export function CommonDropdownMenu({
  label,
  items,
  isActive,
}: CommonDropdownMenuProps) {
  return (
    <Menu as="div" className="relative">
      <MenuButton
        className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-secondary text-secondary-foreground"
            : "text-zinc-300 hover:text-white hover:bg-zinc-800"
        }`}
      >
        {label} ▾
      </MenuButton>

      <MenuItems className="absolute left-0 z-50 mt-1 min-w-[140px] rounded-md border border-zinc-700 bg-zinc-800 py-1 shadow-lg focus:outline-none">
        {items.map((item) => (
          <MenuItem key={item.to}>
            {({ focus }) => (
              <Link
                to={item.to}
                className={`block px-4 py-2 text-sm ${
                  focus
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-300"
                }`}
              >
                {item.label}
              </Link>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
