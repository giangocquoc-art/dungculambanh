/** Định dạng số tiền theo VNĐ */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Định dạng ngày giờ theo vi-VN */
export function formatDateTime(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Định dạng ngày */
export function formatDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/** Nhãn trạng thái đơn hàng */
export const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Đã từ chối",
  COMPLETED: "Hoàn thành",
};

export const CATEGORIES = [
  "NGUYÊN LIỆU LÀM BÁNH",
  "DỤNG CỤ PHA CHẾ",
  "KHUÔN SILICONE",
  "KHUÔN NƯỚNG BÁNH",
  "DỤNG CỤ CƠ BẢN",
  "DỤNG CỤ ĐO LƯỜNG",
  "BAO BÌ ĐÓNG GÓI",
  "DỤNG CỤ TRANG TRÍ BÁNH KEM",
];
