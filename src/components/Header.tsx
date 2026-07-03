"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppProvider";
import { cx, roleBadgeClass, roleLabel } from "@/lib/format";

interface NavItem {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

const navItems: NavItem[] = [
  { href: "/", label: "Trang chủ" },
  {
    href: "/gioi-thieu",
    label: "Giới thiệu",
    children: [
      { href: "/gioi-thieu", label: "Giới thiệu chung" },
      { href: "/tam-nhin", label: "Tầm nhìn & định hướng" },
      { href: "/thu-ngo", label: "Thư ngỏ" },
    ],
  },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/van-ban-phap-luat", label: "Văn bản pháp luật" },
  { href: "/du-thao", label: "Dự thảo VBQPPL" },
  { href: "/phan-anh-chinh-sach", label: "Phản ánh chính sách" },
  { href: "/ho-tro", label: "Trợ giúp pháp lý" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useApp();
  const [open, setOpen] = useState(false);
  const [clock, setClock] = useState<string>("");

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleString("vi-VN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Thanh trên cùng */}
      <div className="bg-primary-700 text-white">
        <div className="container flex flex-wrap items-center justify-between gap-2 py-2">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-red text-lg">
              ★
            </span>
            <span className="text-base font-bold tracking-wide sm:text-lg">
              CỔNG PHÁP LUẬT QUỐC GIA
            </span>
          </Link>
          <div className="flex items-center gap-4 text-xs sm:text-sm">
            <span className="hidden md:inline">{clock}</span>
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span
                  className={cx(
                    "badge",
                    roleBadgeClass[currentUser.role]
                  )}
                >
                  {roleLabel[currentUser.role]}
                </span>
                <span className="hidden sm:inline">
                  {currentUser.fullName}
                </span>
                {currentUser.role === "government" && (
                  <Link
                    href="/quan-tri"
                    className="rounded bg-white/15 px-2 py-1 hover:bg-white/25"
                  >
                    Quản trị
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="rounded bg-white/15 px-2 py-1 hover:bg-white/25"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link
                href="/dang-nhap"
                className="rounded bg-white/15 px-3 py-1 font-medium hover:bg-white/25"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Thanh điều hướng */}
      <nav className="bg-primary-900 text-white">
        <div className="container flex items-center justify-between">
          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href) ||
                    item.children?.some((c) => pathname.startsWith(c.href));

              if (item.children) {
                return (
                  <li key={item.href} className="group relative">
                    <Link
                      href={item.href}
                      className={cx(
                        "flex items-center gap-1 px-3 py-3 text-sm font-medium transition",
                        active
                          ? "bg-primary-600 text-white"
                          : "text-primary-100 hover:bg-primary-800"
                      )}
                    >
                      {item.label}
                      <span className="text-xs">▾</span>
                    </Link>
                    {/* Menu con hiện khi hover */}
                    <ul className="invisible absolute left-0 top-full z-50 min-w-[16rem] rounded-b-lg bg-white py-1 text-slate-700 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            className="block px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-700"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cx(
                      "block px-3 py-3 text-sm font-medium transition",
                      active
                        ? "bg-primary-600 text-white"
                        : "text-primary-100 hover:bg-primary-800"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <button
            className="py-3 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Mở menu"
          >
            ☰ Menu
          </button>
        </div>

        {/* Menu mobile */}
        {open && (
          <ul className="flex flex-col gap-1 pb-3 lg:hidden">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm hover:bg-primary-800"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="ml-4 border-l border-primary-800">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className="block px-4 py-2 text-sm text-primary-200 hover:bg-primary-800"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
