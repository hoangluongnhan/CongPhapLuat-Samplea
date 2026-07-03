"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useApp } from "@/context/AppProvider";
import { cx, roleLabel } from "@/lib/format";
import type { UserRole } from "@/lib/types";

const demoAccounts = [
  { role: "government", email: "chinhquyen@phapluat.gov.vn" },
  { role: "business", email: "doanhnghiep@congty.vn" },
  { role: "citizen", email: "nguoidan@gmail.com" },
] as const;

export default function AuthPage() {
  const { login, register, currentUser, logout } = useApp();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [login_, setLogin] = useState({ email: "", password: "" });
  const [reg, setReg] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "citizen" as UserRole,
    organization: "",
  });

  if (currentUser) {
    return (
      <>
        <PageHeader title="Tài khoản" />
        <div className="container py-10">
          <div className="card mx-auto max-w-md p-6 text-center">
            <p className="text-slate-600">
              Bạn đang đăng nhập với vai trò{" "}
              <b>{roleLabel[currentUser.role]}</b>
            </p>
            <p className="mt-1 font-semibold text-slate-800">
              {currentUser.fullName}
            </p>
            <p className="text-sm text-slate-400">{currentUser.email}</p>
            <div className="mt-5 flex justify-center gap-3">
              <Link href="/" className="btn-primary">
                Về trang chủ
              </Link>
              {currentUser.role === "government" && (
                <Link href="/quan-tri" className="btn-outline">
                  Trang quản trị
                </Link>
              )}
              <button onClick={logout} className="btn-ghost">
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(login_.email, login_.password);
    setMsg({ ok: res.ok, text: res.message });
    if (res.ok) router.push("/");
  };

  const onRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const res = register(reg);
    setMsg({ ok: res.ok, text: res.message });
    if (res.ok) router.push("/");
  };

  return (
    <>
      <PageHeader title="Đăng nhập / Đăng ký" />
      <div className="container grid gap-8 py-10 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-5 flex gap-2">
            <button
              onClick={() => setMode("login")}
              className={cx(
                "flex-1 rounded-lg py-2 text-sm font-semibold",
                mode === "login"
                  ? "bg-primary-600 text-white"
                  : "bg-slate-100 text-slate-600"
              )}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setMode("register")}
              className={cx(
                "flex-1 rounded-lg py-2 text-sm font-semibold",
                mode === "register"
                  ? "bg-primary-600 text-white"
                  : "bg-slate-100 text-slate-600"
              )}
            >
              Đăng ký
            </button>
          </div>

          {msg && (
            <div
              className={cx(
                "mb-4 rounded-lg p-3 text-sm",
                msg.ok
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              )}
            >
              {msg.text}
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={onLogin} className="space-y-3">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  required
                  className="input"
                  value={login_.email}
                  onChange={(e) =>
                    setLogin((s) => ({ ...s, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="label">Mật khẩu</label>
                <input
                  type="password"
                  required
                  className="input"
                  value={login_.password}
                  onChange={(e) =>
                    setLogin((s) => ({ ...s, password: e.target.value }))
                  }
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Đăng nhập
              </button>
            </form>
          ) : (
            <form onSubmit={onRegister} className="space-y-3">
              <div>
                <label className="label">Họ và tên</label>
                <input
                  required
                  className="input"
                  value={reg.fullName}
                  onChange={(e) =>
                    setReg((s) => ({ ...s, fullName: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="label">Vai trò</label>
                <select
                  className="input"
                  value={reg.role}
                  onChange={(e) =>
                    setReg((s) => ({ ...s, role: e.target.value as UserRole }))
                  }
                >
                  <option value="citizen">Người dân</option>
                  <option value="business">Doanh nghiệp</option>
                  <option value="government">Chính quyền</option>
                </select>
              </div>
              {(reg.role === "business" || reg.role === "government") && (
                <div>
                  <label className="label">
                    {reg.role === "business" ? "Tên doanh nghiệp" : "Cơ quan"}
                  </label>
                  <input
                    className="input"
                    value={reg.organization}
                    onChange={(e) =>
                      setReg((s) => ({ ...s, organization: e.target.value }))
                    }
                  />
                </div>
              )}
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  required
                  className="input"
                  value={reg.email}
                  onChange={(e) =>
                    setReg((s) => ({ ...s, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="label">Mật khẩu</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="input"
                  value={reg.password}
                  onChange={(e) =>
                    setReg((s) => ({ ...s, password: e.target.value }))
                  }
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Tạo tài khoản
              </button>
            </form>
          )}
        </div>

        {/* Tài khoản demo */}
        <div className="card h-fit p-6">
          <h3 className="mb-1 font-semibold text-slate-800">
            Tài khoản dùng thử
          </h3>
          <p className="mb-4 text-sm text-slate-500">
            Mật khẩu chung: <code className="rounded bg-slate-100 px-1">123456</code>.
            Nhấn để điền nhanh.
          </p>
          <div className="space-y-2">
            {demoAccounts.map((a) => (
              <button
                key={a.email}
                onClick={() => {
                  setMode("login");
                  setLogin({ email: a.email, password: "123456" });
                }}
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-left text-sm hover:bg-slate-50"
              >
                <span className="font-medium text-slate-700">
                  {roleLabel[a.role]}
                </span>
                <span className="text-slate-400">{a.email}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Lưu ý: đây là dự án mẫu, mật khẩu lưu trực tiếp trong localStorage,
            không dùng cho môi trường thật.
          </p>
        </div>
      </div>
    </>
  );
}
