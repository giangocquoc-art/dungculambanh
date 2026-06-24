// Seed dữ liệu thật cho Wind Baking Tool
// Chạy: bun run db:seed
import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding...");

  // ===== Xóa dữ liệu cũ =====
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.product.deleteMany();
  await db.user.deleteMany();

  // ===== Tài khoản =====
  const adminPass = await bcrypt.hash("admin123", 10);
  const userPass = await bcrypt.hash("user123", 10);

  const admin = await db.user.create({
    data: {
      email: "admin@windbakingtool.com",
      name: "Quản trị viên",
      phone: "0941806169",
      address: "Wind Store, TP. Hồ Chí Minh",
      password: adminPass,
      role: "ADMIN",
    },
  });

  const users = await Promise.all(
    [
      { name: "Nguyễn Thị Mai", email: "mai.nguyen@example.com", phone: "0901234567", address: "123 Lê Lợi, Q.1, TP.HCM" },
      { name: "Trần Văn Hùng", email: "hung.tran@example.com", phone: "0912345678", address: "45 Trần Phú, Hà Đông, Hà Nội" },
      { name: "Lê Thị Hoa", email: "hoa.le@example.com", phone: "0923456789", address: "78 Nguyễn Trãi, Q.5, TP.HCM" },
      { name: "Phạm Quốc Bảo", email: "bao.pham@example.com", phone: "0934567890", address: "12 Cộng Hòa, Tân Bình, TP.HCM" },
      { name: "Vũ Thị Lan", email: "lan.vu@example.com", phone: "0945678901", address: "34 Hai Bà Trưng, Đà Nẵng" },
    ].map((u) => db.user.create({ data: { ...u, password: userPass, role: "USER" } })),
  );

  console.log(`Created admin ${admin.email} and ${users.length} users`);

  // ===== Sản phẩm thật (tên + giá từ windbakingtool.com) =====
  // [name, category, priceMin, priceMax, description, featured]
  const productsRaw: [string, string, number, number, string, boolean][] = [
    ["Khuôn Thỏi Socola, Khuôn Silicone Dạng Thỏi Socola", "KHUÔN SILICONE", 25000, 30000, "Khuôn silicone dạng thỏi socola, dễ демolding, an toàn thực phẩm, dùng làm socola, thạch, kẹo.", true],
    ["Bộ 5 Thìa Đong Nhựa", "DỤNG CỤ ĐO LƯỜNG", 15000, 18000, "Bộ 5 thìa đong nhựa với các dung tích khác nhau, tiện dụng cho việc cân đo nguyên liệu làm bánh.", false],
    ["Dao Chà Láng Mini, Bay Chà Láng Bánh Kem", "DỤNG CỤ TRANG TRÍ BÁNH KEM", 55000, 80000, "Bộ bay mini chà láng trang trí bánh kem, dao chà láng nhỏ gọn cho các chi tiết tinh tế.", true],
    ["VÁ RAY BỘT INOX 304 CÓ TAI GÁC", "DỤNG CỤ CƠ BẢN", 40000, 43000, "Vá ray bột inox 304 có tai gác, chất liệu chống gỉ, bền bỉ, dùng trong nhà bánh chuyên nghiệp.", false],
    ["TẤM NƯỚNG SILICONE", "KHUÔN SILICONE", 80000, 85000, "Tấm nướng silicone chống dính, chịu nhiệt cao, dùng lót khay nướng giúp bánh không dính.", true],
    ["TẤM LÓT NHÀO BỘT SILICONE DÀY 6MM", "DỤNG CỤ CƠ BẢN", 98000, 105000, "Tấm lót nhào bột silicone dày 6mm, bề mặt chống dính, kích thước rộng tiện nhào bột bánh mì.", true],
    ["TẠP DỀ PHONG CÁCH CỔ ĐIỂN", "DỤNG CỤ CƠ BẢN", 55000, 58000, "Tạp dề phong cách cổ điển, chất liệu cotton bền đẹp, bảo vệ trang phục khi làm bánh.", false],
    ["XOÀI SẤY DẺO", "NGUYÊN LIỆU LÀM BÁNH", 10000, 12000, "Xoài sấy dẻo, nguyên liệu trang trí bánh, vị ngọt tự nhiên, mềm dẻo.", false],
    ["Bộ 26 Đui Bắt Cơ Bản", "DỤNG CỤ TRANG TRÍ BÁNH KEM", 65000, 70000, "Bộ 26 đui bắt kem cơ bản, nhiều hình dáng, phù hợp người mới học trang trí bánh kem.", true],
    ["Bộ Khuôn Nhấn Chữ, Khuôn Nhấn Số", "DỤNG CỤ TRANG TRÍ BÁNH KEM", 50000, 53000, "Bộ khuôn nhấn chữ và số, tạo chữ trên bánh kem, cookie sinh nhật.", false],
    ["SET 5 TẤM MICA DẺO CHÀ LÁNG, BO GÓC BÁNH KEM", "DỤNG CỤ TRANG TRÍ BÁNH KEM", 20000, 25000, "Set 5 tấm mica dẻo chà láng và bo góc bánh kem, dẻo dai, dùng nhiều lần.", false],
    ["Cân Điện Tử Mini I2000 Mức Cân 0.1g-3kg", "DỤNG CỤ ĐO LƯỜNG", 115000, 120000, "Cân điện tử mini I2000, mức cân 0.1g - 3kg, độ chính xác cao, không bảo hành.", true],
    ["KHUÔN CẮT TRÒN/ KHUÔN CẮT PATESO 6-7-8CM", "KHUÔN NƯỚNG BÁNH", 28000, 35000, "Khuôn cắt tròn / khuôn cắt pateso cỡ 6-7-8cm, inox sắc bén, cắt bột gọn.", false],
    ["Khuôn Chiên Trứng Tạo Hình, Khuôn Inox 304", "DỤNG CỤ CƠ BẢN", 25000, 28000, "Khuôn chiên trứng tạo hình inox 304, hàng đẹp, dùng chiên trứng tạo hình dễ thương.", false],
    ["Dụng Cụ Dập Tỏi, Dụng Cụ Ép Tỏi", "DỤNG CỤ CƠ BẢN", 35000, 40000, "Dụng cụ dập/ép tỏi inox, bền bỉ, dễ vệ sinh, tiện dụng trong bếp.", false],
    ["Bộ Khuôn Làm Bánh Há Cảo, Khuôn Làm Bánh Xếp", "DỤNG CỤ CƠ BẢN", 80000, 85000, "Bộ khuôn làm bánh há cảo, bánh xếp, tạo hình đẹp, dễ sử dụng.", false],
    ["Vét Trộn Silicone, Vét Trộn Bột Silicone", "DỤNG CỤ CƠ BẢN", 25000, 28000, "Vét trộn bột silicone, phới silicone dẻo, không xước nồi, dễ cạo sạch bột.", false],
    ["Phới Trộn Silicone, Vét Trộn Bột Silicone Loại Trong", "DỤNG CỤ CƠ BẢN", 25000, 30000, "Phới trộn silicone loại trong, dẻo dai, dùng trộn bột và đánh kem.", false],
    ["Rack Hong Bánh, Giá Phơi Bánh 40.5x25.5x1.5cm", "DỤNG CỤ CƠ BẢN", 55000, 58000, "Rack hong bánh, giá phơi bánh kích thước 40.5 x 25.5 x 1.5cm, inox chống rỉ.", false],
    ["Thố Trộn Bột, Đánh Kem, Âu Đánh Kem Inox", "DỤNG CỤ CƠ BẢN", 130000, 145000, "Thố trộn bột, âu đánh kem inox, đáy tròn rộng, dễ vệ sinh, dung tích lớn.", true],
    ["KHUÔN CẮT CHIA TẦNG BÁNH CÓ ĐIỀU CHỈNH", "DỤNG CỤ TRANG TRÍ BÁNH KEM", 58000, 58000, "Khuôn cắt chia tầng bánh có điều chỉnh, chia bánh kem thành các tầng đều nhau.", false],
    ["BÌNH XỊT DẦU THỦY TINH 100ML", "DỤNG CỤ CƠ BẢN", 35000, 38000, "Bình xịt dầu thủy tinh 100ml, vòi phun sương đều, an toàn thực phẩm.", false],
    ["BỘ CUTTER 33 CHI TIẾT, BỘ KHUÔN NHẤN CẮT TRANG TRÍ", "DỤNG CỤ TRANG TRÍ BÁNH KEM", 78000, 80000, "Bộ cutter 33 chi tiết, khuôn nhấn cắt trang trí bánh đa dạng hình dáng.", true],
    ["BỘ KHUÔN CẮT NHỰA, KHUÔN CẮT COOKIE NHỰA", "KHUÔN NƯỚNG BÁNH", 20000, 20000, "Bộ khuôn cắt nhựa, khuôn cắt cookie nhựa, nhiều hình, an toàn cho trẻ em.", false],
    ["ĐUI BƠM NHÂN SU KEM KÈM CỌ RỬA", "DỤNG CỤ TRANG TRÍ BÁNH KEM", 25000, 25000, "Đui bơm nhân su kem kèm cọ rửa, tiện bơm nhân vào su kem, bánh donut.", false],
    ["Bao Tay TPE Dùng Một Lần Hộp 100c", "DỤNG CỤ CƠ BẢN", 29000, 35000, "Bao tay TPE dùng một lần, hộp 100 chiếc, an toàn thực phẩm khi làm bánh.", false],
    ["PHỚI LỒNG ĐÁNH TRỨNG SILICONE", "DỤNG CỤ CƠ BẢN", 20000, 25000, "Phới lồng đánh trứng silicone, lồng dày, đánh bông trứng hiệu quả.", false],
    ["BỘ KHUÔN NHẤN COOKIE/ KHUÔN BẮN COOKIE", "KHUÔN NƯỚNG BÁNH", 115000, 135000, "Bộ khuôn nhấn cookie / khuôn bật cookie, tạo hình cookie nhanh, đều.", true],
    ["THỐ TRỘN BỘT INOX CÓ ĐẾ SILICONE", "DỤNG CỤ CƠ BẢN", 150000, 150000, "Thố trộn bột inox có đế silicone chống trượt, đáy chắc, không trượt khi nhào.", false],
    ["KHUÔN TRÒN GIA CÔNG ĐẾ LIỀN", "KHUÔN NƯỚNG BÁNH", 25000, 25000, "Khuôn tròn gia công đế liền, inox dày, nướng bánh mì, bánh ngọt.", false],
    ["Khuôn Tim Gia Công Đế Rời Size 12-26cm Cao 8cm", "KHUÔN NƯỚNG BÁNH", 36000, 38000, "Khuôn tim gia công đế rời, size 12-26cm, cao 8cm, nướng bánh kem hình tim.", false],
    ["KHAY NƯỚNG CHỐNG DÍNH Sâu 5cm", "KHUÔN NƯỚNG BÁNH", 80000, 80000, "Khay nướng chống dính sâu 5cm, nướng bánh mì gối, bánhpudding.", true],
    ["KHUÔN BÁNH MỲ SANDWICH, KHUÔN BÁNH MỲ GỐI", "KHUÔN NƯỚNG BÁNH", 125000, 135000, "Khuôn bánh mì sandwich / bánh mì gối, chống dính, nướng bánh mì để Slice.", true],
    ["KHUÔN NƯỚNG BÁNH DOUGHNUT", "KHUÔN NƯỚNG BÁNH", 95000, 95000, "Khuôn nướng bánh doughnut, tạo hình vòng đều, chống dính.", false],
    ["KHUÔN BÁNH PIE/ TART, KHUÔN TART ĐẾ RỜI CHỐNG DÍNH", "KHUÔN NƯỚNG BÁNH", 48000, 48000, "Khuôn bánh pie / tart đế rời chống dính, dễ lấy bánh ra nguyên vẹn.", true],
    ["KHUÔN NƯỚNG ĐẾ PIZZA, KHUÔN PIZZA", "KHUÔN NƯỚNG BÁNH", 35000, 38000, "Khuôn nướng đế pizza, inox tròn, chịu nhiệt cao, nướng đế giòn.", false],
    ["KHUÔN BÁNH MỲ, KHUÔN LOAF LÀM BÁNH MỲ", "KHUÔN NƯỚNG BÁNH", 35000, 35000, "Khuôn bánh mì / khuôn loaf làm bánh mì, kích thước tiêu chuẩn, chống dính.", false],
    ["KHUÔN BÁNH VUÔNG CHỐNG DÍNH 21CM x 8CM", "KHUÔN NƯỚNG BÁNH", 95000, 105000, "Khuôn bánh vuông chống dính 21 x 8cm, nướng bánh pound, bánh kem vuông.", false],
    ["KHUÔN TRÒN ĐÚC ĐẾ LIỀN", "KHUÔN NƯỚNG BÁNH", 35000, 38000, "Khuôn tròn đúc đế liền, inox dày, nướng bánh mì, bánh ngọt.", false],
    ["KHUÔN RING VUÔNG NHẬP", "KHUÔN NƯỚNG BÁNH", 55000, 58000, "Khuôn ring vuông nhập, đế rời, làm bánh mousse, bánh lạnh.", false],
    ["Khay Silicone Làm Đá, Khay Nước Silicone", "KHUÔN SILICONE", 42000, 45000, "Khay silicone làm đá / khay nước silicone, nhiều ô, dễ lấy đá.", false],
    ["Khuôn Socola, Khuôn Làm Đá, Khuôn Làm Thạch/Pudding", "KHUÔN SILICONE", 25000, 28000, "Khuôn socola / làm đá / làm thạch pudding, silicone dẻo, nhiều hình.", false],
    ["Khuôn Tim/ Tròn To Nhỏ", "KHUÔN SILICONE", 28000, 35000, "Bộ khuôn tim / tròn to nhỏ, silicone, làm socola, thạch, kẹo.", false],
    ["KHUÔN SILICONE SINH VẬT BIỂN, KHUÔN CÁ NGỰA", "KHUÔN SILICONE", 38000, 40000, "Khuôn silicone sinh vật biển, khuôn cá ngựa, làm socola, thạch đáng yêu.", false],
    ["KHUÔN SILICONE BÁN CẦU 6.3CM", "KHUÔN SILICONE", 20000, 25000, "Khuôn silicone bán cầu 6.3cm, làm bán cầu socola, mousse, kem.", false],
    ["KHUÔN SILICONE VỎ SÒ", "KHUÔN SILICONE", 20000, 25000, "Khuôn silicone vỏ sò, làm socola, thạch, kẹo hình vỏ sò.", false],
    ["KHUÔN ỐC SÒ VUÔNG TRANG TRÍ BÁNH", "KHUÔN SILICONE", 38000, 40000, "Khuôn ốc sò vuông trang trí bánh, silicone, làm phụ kiện trang trí.", false],
    ["KHUÔN TRÒN BÁN CẦU TO NHỎ", "KHUÔN SILICONE", 30000, 35000, "Khuôn tròn bán cầu to nhỏ, làm bóng đá, mousse bán cầu.", false],
    ["KHUÔN SILICONE HOA HỒNG HH012", "KHUÔN SILICONE", 25000, 30000, "Khuôn silicone hoa hồng HH012, làm hoa socola, thạch, fondant.", true],
    ["KHUÔN SILICONE CÀNH MAI", "KHUÔN SILICONE", 20000, 25000, "Khuôn silicone cành mai, làm socola, thạch hình hoa mai ngày Tết.", false],
    ["KHUÔN SILICONE HOA MẪU ĐƠN HM12", "KHUÔN SILICONE", 58000, 65000, "Khuôn silicone hoa mẫu đơn HM12, chi tiết tinh tế, làm hoa trang trí.", false],
    ["Bình Lắc Pha Chế, Bình Shaker Nhựa PP 500ml/700ml", "DỤNG CỤ PHA CHẾ", 80000, 90000, "Bình lắc pha chế / bình shaker nhựa PP 500ml và 700ml, vặn chặt, không rỉ.", false],
  ];

  const slugify = (s: string) =>
    s.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);

  const products = [];
  for (const [name, category, priceMin, priceMax, description, featured] of productsRaw) {
    let slug = slugify(name);
    // đảm bảo unique
    let suffix = 1;
    while (await db.product.findUnique({ where: { slug } })) {
      slug = `${slugify(name)}-${suffix++}`;
    }
    const p = await db.product.create({
      data: {
        name,
        slug,
        description,
        category,
        priceMin,
        priceMax,
        stock: Math.floor(Math.random() * 80) + 20,
        featured,
      },
    });
    products.push(p);
  }
  console.log(`Created ${products.length} products`);

  // ===== Đơn hàng mẫu =====
  const statuses = ["PENDING", "APPROVED", "REJECTED", "COMPLETED"] as const;
  let orderCounter = 1;
  const now = Date.now();
  for (let i = 0; i < 14; i++) {
    const user = users[i % users.length];
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let total = 0;
    for (let j = 0; j < itemCount; j++) {
      const p = products[Math.floor(Math.random() * products.length)];
      const qty = Math.floor(Math.random() * 3) + 1;
      items.push({
        productId: p.id,
        productName: p.name,
        unitPrice: p.priceMin,
        quantity: qty,
      });
      total += p.priceMin * qty;
    }
    const shipFee = 30000;
    const daysAgo = Math.floor(i / 2); // trải đều các ngày gần đây
    const createdAt = new Date(now - daysAgo * 86400000 - Math.floor(Math.random() * 86400000));
    // trạng thái: một nửa COMPLETED/APPROVED (có doanh thu), một nửa PENDING/REJECTED
    const status = i < 6 ? statuses[i % 2 === 0 ? 2 : 3] : (i % 3 === 0 ? "PENDING" : (Math.random() > 0.4 ? "COMPLETED" : "APPROVED"));
    const code = `WIND-${String(orderCounter++).padStart(4, "0")}`;
    await db.order.create({
      data: {
        code,
        userId: user.id,
        customerName: user.name,
        customerPhone: user.phone || "0900000000",
        customerAddress: user.address || "Chưa cập nhật",
        note: i % 4 === 0 ? "Gọi trước khi giao" : null,
        total: total + shipFee,
        shipFee,
        status,
        createdAt,
        updatedAt: createdAt,
        orderItems: { create: items },
      },
    });
  }
  console.log(`Created ${orderCounter - 1} sample orders`);

  console.log("Seed complete!");
  console.log("  Admin login: admin@windbakingtool.com / admin123");
  console.log("  User login:  mai.nguyen@example.com / user123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
