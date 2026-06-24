"use client";

import { hashHref, useRouter } from "@/lib/router";

/** Logo Wind Baking Tool — chữ W trong ô vàng + wordmark, không dùng icon */
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
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary font-extrabold text-primary-foreground text-lg shadow-sm">
        W
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-base font-extrabold tracking-tight text-foreground">
          WIND BAKING TOOL
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">
          Cửa hàng dụng cụ làm bánh
        </span>
      </span>
    </a>
  );
}
