"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import PageHeader from "@/components/PageHeader";
import { useApp } from "@/context/AppProvider";
import type { StaffMember } from "@/lib/types";

// Danh sách cán bộ (công khai) - thuộc mục Giới thiệu
export default function StaffPage() {
  const { db } = useApp();
  const staff = db.siteContent?.staff ?? [];

  return (
    <>
      <PageHeader
        title="Danh sách cán bộ"
        subtitle="Thông tin đội ngũ cán bộ, công chức phụ trách vận hành Cổng Pháp luật Quốc gia."
      />
      <div className="container py-8">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Giới thiệu", href: "/gioi-thieu" },
              { label: "Danh sách cán bộ" },
            ]}
          />
        </div>

        {staff.length === 0 ? (
          <div className="card p-10 text-center text-slate-400">
            Đang cập nhật nội dung.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {staff.map((s) => (
              <StaffCard key={s.id} member={s} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function StaffCard({ member }: { member: StaffMember }) {
  const [failed, setFailed] = useState(false);
  const initial = member.fullName?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="card flex flex-col items-center p-6 text-center transition hover:shadow-md">
      {member.photoUrl && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.photoUrl}
          alt={member.fullName}
          className="h-24 w-24 rounded-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-3xl font-bold text-primary-700">
          {initial}
        </div>
      )}

      <h3 className="mt-4 text-lg font-semibold text-slate-800">
        {member.fullName}
      </h3>
      <p className="mt-1 font-medium text-primary-700">{member.position}</p>
      <p className="mt-1 text-sm text-slate-500">{member.department}</p>

      <div className="mt-3 space-y-1 text-sm text-slate-500">
        {member.email && (
          <p>
            ✉️{" "}
            <a href={`mailto:${member.email}`} className="hover:text-primary-700">
              {member.email}
            </a>
          </p>
        )}
        {member.phone && <p>📞 {member.phone}</p>}
      </div>
    </div>
  );
}