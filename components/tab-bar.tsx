"use client";

import { HomeIcon as SolidHomeIcon } from "@heroicons/react/24/solid";
import { HomeIcon as OutlineHomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 w-full mx-auto max-w-screen-md grid grid-cols-5 border-neutral-600 border-t px-5 py-3">
      <Link href="/check" className="flex flex-col items-center gap-px">
        {pathname === "/check" ? (
          <SolidHomeIcon className="w-7 h-7" />
        ) : (
          <OutlineHomeIcon className="w-7 h-7" />
        )}
        <span>Home</span>
      </Link>
      <Link href="/life" className="flex flex-col items-center gap-px">
        {pathname === "/life" ? (
          <SolidHomeIcon className="w-7 h-7" />
        ) : (
          <OutlineHomeIcon className="w-7 h-7" />
        )}
        <span>Life</span>
      </Link>
      <Link href="/chat" className="flex flex-col items-center gap-px">
        {pathname === "/chat" ? (
          <SolidHomeIcon className="w-7 h-7" />
        ) : (
          <OutlineHomeIcon className="w-7 h-7" />
        )}
        <span>Chat</span>
      </Link>
      <Link href="/live" className="flex flex-col items-center gap-px">
        {pathname === "/live" ? (
          <SolidHomeIcon className="w-7 h-7" />
        ) : (
          <OutlineHomeIcon className="w-7 h-7" />
        )}
        <span>Live</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-px">
        {pathname === "/profile" ? (
          <SolidHomeIcon className="w-7 h-7" />
        ) : (
          <OutlineHomeIcon className="w-7 h-7" />
        )}
        <span>Profile</span>
      </Link>
    </div>
  );
}
