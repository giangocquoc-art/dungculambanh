"use client";

import { hashHref, useRouter } from "@/lib/router";

/** Logo Wind Baking Tool — dùng ảnh logo thật từ windbakingtool.com */
export function Logo({ onClick }: { onClick?: () => void }) {
  const { push } = useRouter();
  return (
    <a
      {...hashHref("/")}
      onClick={(e) => {
        e.preventDefault();
        push("/");
        onClick?.();
      }}
      className="flex items-center gap-2.5 select-none"
    >
      <img
        src="/images/wind-logo-full.jpg"
        alt="Wind Baking Tool"
        className="h-11 w-11 rounded-xl object-cover ring-1 ring-border shadow-sm"
      />
      <span className="flex flex-col leading-none">
        <span className="text-base font-extrabold tracking-tight text-foreground">
          WIND BAKING TOOL
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">
          Dụng cụ làm bánh — Yêu từ tâm
        </span>
      </span>
    </a>
  );
}
