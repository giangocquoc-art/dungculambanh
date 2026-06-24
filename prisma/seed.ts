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
  // Mô tả viết thân thiện, đúng tâm lý người làm bánh tại nhà / tiệm nhỏ.
  // [name, category, priceMin, priceMax, description, featured, image]
  const productsRaw: [string, string, number, number, string, boolean, string | null][] = [
    ["Khuôn Silicone Thỏi Socola", "KHUÔN SILICONE", 25000, 30000, "Bạn đam mê tự làm socola tặng người thân? Khuôn silicone thỏi socola mềm dẻo, chỉ cần búng nhẹ là socola ra khuôn nguyên vẹn, không dính, không nứt. An toàn với thực phẩm, dùng được cho socola, thạch, kẹo dẻo.", true, "/images/products/p09.png"],
    ["Bộ 5 Thìa Đong Nhựa", "DỤNG CỤ ĐO LƯỜNG", 15000, 18000, "Làm bánh chuẩn bị công thức thìa đong là trợ thủ không thể thiếu. Bộ 5 thìa với nhiều dung tích giúp bạn đong nguyên liệu chính xác ngay lần đầu, bánh nào cũng thành công.", false, "/images/products/p19.jpg"],
    ["Dao Chà Láng Mini Trang Trí Bánh Kem", "DỤNG CỤ TRANG TRÍ BÁNH KEM", 55000, 80000, "Muốn bánh kem láng mịn như ngoài tiệm? Bộ dao chà láng mini giúp bạn bo góc, láng mặt bánh kem chuyên nghiệp ngay tại nhà. Nhỏ gọn, dễ cầm, người mới cũng dùng được.", true, "/images/products/p13.jpg"],
    ["Vá Ray Bột Inox 304 Có Tai Gác", "DỤNG CỤ CƠ BẢN", 40000, 43000, "Vá ray bột inox 304 chống gỉ, có tai gác tiện gác lên âu trộn. Dành cho ai làm bánh thường xuyên, đồ bền dùng được nhiều năm.", false, "/images/products/p02.jpg"],
    ["Tấm Nướng Silicone Chống Dính", "KHUÔN SILICONE", 80000, 85000, "Say goodbye bánh dính khay! Tấm nướng silicone chịu nhiệt cao, lót khay là bánh trút ra nguyên vẹn, sạch sẽ. Tiết kiệm thời gian dọn dẹp, dùng được hàng ngàn lần.", true, "/images/products/p06.jpg"],
    ["Tấm Lót Nhào Bột Silicone Dày 6mm", "DỤNG CỤ CƠ BẢN", 98000, 105000, "Nhào bột mà dính đầy bàn thì mệt lắm. Tấm lót silicone dày 6mm, bề mặt chống dính đỉnh, nhào bột bánh mì thoải mái không dính, không trơn trượt.", true, "/images/products/p10.jpg"],
    ["Tạp Dề Phong Cách Cổ Điển", "DỤNG CỤ CƠ BẢN", 55000, 58000, "Làm bánh cũng cần đẹp. Tạp dề cotton phong cách cổ điển vừa bảo vệ áo, vừa cho bạn cảm hứng thợ bánh thực thụ. Quà tặng tuyệt vời cho người yêu bếp.", false, "/images/products/p16.jpg"],
    ["Xoài Sấy Dẻo", "NGUYÊN LIỆU LÀM BÁNH", 10000, 12000, "Xoài sấy dẻo vị ngọt tự nhiên, mềm dẻo — nguyên liệu trang trí bánh, làm bánh trái cây hay ăn vặt đều ngon. Mua nhỏ gói dùng dần.", false, "/images/products/p20.jpg"],
    ["Bộ 26 Đui Bắt Kem Cơ Bản", "DỤNG CỤ TRANG TRÍ BÁNH KEM", 65000, 70000, "Bộ 26 đui bắt kem với đủ hình ngôi sao, lá, tròn... mới bắt đầu học trang trí bánh kem là bộ này đủ dùng cho mọi kiểu hoa. Kèm hộp đựng gọn gàng.", true, "/images/products/p14.jpg"],
    ["Bộ Khuôn Nhấn Chữ & Số", "DỤNG CỤ TRANG TRÍ BÁNH KEM", 50000, 53000, "Bánh sinh nhật thiếu chữ 'Happy Birthday' thì thiếu thiệt. Bộ khuôn nhấn chữ và số giúp bạn viết lời chúc lên bánh kem, cookie thật đẹp chỉ trong vài giây.", false, "/images/products/p17.jpg"],
    ["Set 5 Tấm Mica Chà Láng Bo Góc Bánh Kem", "DỤNG CỤ TRANG TRÍ BÁNH KEM", 20000, 25000, "5 tấm mica dẻo đa năng: chà láng mặt bánh, bo góc, vẽ họa tiết. Dẻo dai, dễ rửa, dùng nhiều lần. Đồ rẻ mà 'đắt' công năng.", false, "/images/products/p05.jpg"],
    ["Cân Điện Tử Mini I2000 (0.1g - 3kg)", "DỤNG CỤ ĐO LƯỜNG", 115000, 120000, "Công thức làm bánh cần chính xác đến từng gram. Cân I2000 đo từ 0.1g đến 3kg, màn hình sáng rõ, nhỏ gọn cất gọn ngăn kéo. Đầu tư một lần dùng mãi.", true, "/images/products/p18.jpg"],
    ["Khuôn Cắt Tròn / Pateso 6-7-8cm", "KHUÔN NƯỚNG BÁNH", 28000, 35000, "Làm tart, pateso, bánh xếp cần cắt bột tròn đều? Bộ 3 khuôn cắt cỡ 6-7-8cm inox sắc bén, cắt một đường là rời, bột không xước.", false, "/images/products/p03.jpg"],
    ["Khuôn Chiên Trứng Tạo Hình Inox 304", "DỤNG CỤ CƠ BẢN", 25000, 28000, "Bữa sáng trứng chiên hình trái tim, hình bông hoa cho bé yêu thích mê. Khuôn inox 304, đặt chảo là được, dễ rửa.", false, "/images/products/p12.jpg"],
    ["Dụng Cụ Dập Tỏi Ép Tỏi", "DỤNG CỤ CƠ BẢN", 35000, 40000, "Tỏi băm nhỏ nháy, không cay mắt. Dụng cụ dập tỏi inox, chỉ cần ấn là tỏi nhuyễn, dễ tháo rửa. Tiện cho cả bếp mặn và bếp bánh.", false, "/images/products/p04.jpg"],
    ["Bộ Khuôn Làm Bánh Há Cảo / Bánh Xếp", "DỤNG CỤ CƠ BẢN", 80000, 85000, "Thích làm dimsum, há cảo tại nhà? Bộ khuôn tạo hình đẹp, gấp mép đều tay, nhân không bị trào. Cả nhà sẽ tủm tỉm ăn cùng.", false, "/images/products/p11.jpg"],
    ["Vét Trộn Silicone (Phới Dẻo)", "DỤNG CỤ CƠ BẢN", 25000, 28000, "Vét silicone dẻo cạo sạch từng chút bột, từng chút kem — không lãng phí. Không xước nồi, dễ rửa. Đồ nhỏ mà dùng mỗi ngày.", false, "/images/products/p07.jpg"],
    ["Phới Trộn Silicone Loại Trong", "DỤNG CỤ CƠ BẢN", 25000, 30000, "Phới trộn silicone trong suốt, dẻo dai, dùng trộn bột và đánh kem đều tay. Sạch đẹp, không ố màu.", false, "/images/products/p01.jpg"],
    ["Rack Hong Bánh 40.5 x 25.5cm", "DỤNG CỤ CƠ BẢN", 55000, 58000, "Bánh vừa ra lò cần hong nguội để không bị ỉ. Rack hong bánh inox chống rỉ, kích thước vừa vặn, xếp được nhiều khay.", false, "/images/products/p15.jpg"],
    ["Thố Trộn Bột / Âu Đánh Kem Inox", "DỤNG CỤ CƠ BẢN", 130000, 145000, "Thố trộn inox đáy tròn rộng, nhào bột hay đánh kem đều thuận tay. Dung tích lớn, đánh kem cả lít vẫn thoải mái. Đồ dùng một đời.", true, "/images/products/p08.jpg"],
    ["Khuôn Cắt Chia Tầng Bánh Có Điều Chỉnh", "DỤNG CỤ TRANG TRÍ BÁNH KEM", 58000, 58000, "Cắt bánh kem 2 tầng, 3 tầng đều tăm tắp — đỡ lo cắt lệch. Có thể điều chỉnh độ cao, người mới cũng cắt bánh đẹp như thợ.", false, "/images/products/p09.png"],
    ["Bình Xịt Dầu Thủy Tinh 100ml", "DỤNG CỤ CƠ BẢN", 35000, 38000, "Phết dầu đều, không excess. Bình xịt dầu thủy tinh 100ml, vòi phun sương mịn, vừa đủ dầu chống dính mà không ngấy bánh.", false, "/images/products/p06.jpg"],
    ["Bộ Cutter 33 Chi Tiết Trang Trí Bánh", "DỤNG CỤ TRANG TRÍ BÁNH KEM", 78000, 80000, "33 khuôn nhấn cắt đa hình: hoa, lá, con vật, chữ... Muốn trang trí bánh theo chủ đề nào cũng có. Bộ này mua một lần chơi mãi.", true, "/images/products/p10.jpg"],
    ["Bộ Khuôn Cắt Cookie Nhựa Đa Hình", "KHUÔN NƯỚNG BÁNH", 20000, 20000, "Cắt cookie hình sao, hoa, con vật cho bé thích mê. Nhựa an toàn, không sắc cạnh, cả bé cùng làm được. Giá siêu rẻ cho một buổi cuối tuần vui vẻ.", false, "/images/products/p13.jpg"],
    ["Đui Bơm Nhân Su Kem Kèm Cọ Rửa", "DỤNG CỤ TRANG TRÍ BÁNH KEM", 25000, 25000, "Làm su kem, donut nhân phô mai, kem tuyết — chỉ cần đui bơm này. Kèm cọ rửa tiện vệ sinh. Đồ nhỏ giá rẻ mà xịn.", false, "/images/products/p17.jpg"],
    ["Bao Tay TPE Dùng Một Lần (Hộp 100c)", "DỤNG CỤ CƠ BẢN", 29000, 35000, "Vệ sinh tay khi làm bánh, trang trí kem, đóng gói — bao tay TPE an toàn thực phẩm, hộp 100 chiếc dùng cả tháng. Đừng để tay trần chạm thực phẩm.", false, "/images/products/p14.jpg"],
    ["Phới Lồng Đánh Trứng Silicone", "DỤNG CỤ CƠ BẢN", 20000, 25000, "Đánh trứng bông mà không xước nồi — phới lồng silicone bọc lớp dẻo, lồng dày đánh nhanh bông. Cân cả đánh kem lẫn đánh sốt.", false, "/images/products/p11.jpg"],
    ["Bộ Khuôn Nhấn Cookie / Bật Cookie", "KHUÔN NƯỚNG BÁNH", 115000, 135000, "Muốn cookie đều đẹp như ngoài tiệm? Bộ khuôn nhấn / bật cookie tạo hình nhanh, đều, không dính bột. Đầu tư xứng đáng cho ai nghiện làm cookie.", true, "/images/products/p12.jpg"],
    ["Thố Trộn Bột Inox Có Đế Silicone", "DỤNG CỤ CƠ BẢN", 150000, 150000, "Đế silicone chống trượt, nhào bột thố không chạy lung tung. Đáy chắc, không trượt, không ồn. Cho ai làm bánh mì tay thường xuyên.", false, "/images/products/p04.jpg"],
    ["Khuôn Tròn Gia Công Đế Liền", "KHUÔN NƯỚNG BÁNH", 25000, 25000, "Khuôn tròn đế liền inox dày, nướng bánh mì, bánh ngọt tiêu chuẩn. Bền, không móp, dùng được mãi.", false, "/images/products/p05.jpg"],
    ["Khuôn Tim Đế Rời 12-26cm (Cao 8cm)", "KHUÔN NƯỚNG BÁNH", 36000, 38000, "Bánh kem hình tim cho ngày kỷ niệm, Valentine. Khuôn đế rời dễ lấy bánh ra nguyên vẹn, có nhiều size từ 12-26cm cho từng lớp bánh.", false, "/images/products/p18.jpg"],
    ["Khay Nướng Chống Dính Sâu 5cm", "KHUÔN NƯỚNG BÁNH", 80000, 80000, "Làm bánh mì gối, bánh pudding, bánh cấp đông... khay sâu 5cm chứa được nhiều. Chống dính, trút bánh ra nguyên khối.", true, "/images/products/p19.jpg"],
    ["Khuôn Bánh Mỳ Sandwich / Bánh Mỳ Gối", "KHUÔN NƯỚNG BÁNH", 125000, 135000, "Mơ làm bánh mì sandwich để thái slice ăn sáng? Khuôn chống dính, nướng ra bánh đều đẹp, vỏ giòn ruột xốp. Chất lượng nhà bánh.", true, "/images/products/p20.jpg"],
    ["Khuôn Nướng Bánh Doughnut", "KHUÔN NƯỚNG BÁNH", 95000, 95000, "Bé thích doughnut, mẹ tự làm tại nhà cho an toàn. Khuôn tạo hình vòng đều, chống dính, nướng doughnut ít dầu hơn chiên nhiều.", false, "/images/products/p16.jpg"],
    ["Khuôn Bánh Pie / Tart Đế Rời Chống Dính", "KHUÔN NƯỚNG BÁNH", 48000, 48000, "Làm tart trái cây, pie táo — khuôn đế rời chống dính giúp lấy bánh ra nguyên vẹn, không vỡ. Mẹo nhỏ: lót giấy nướng là dễ rửa hơn.", true, "/images/products/p07.jpg"],
    ["Khuôn Nướng Đế Pizza", "KHUÔN NƯỚNG BÁNH", 35000, 38000, "Pizza tại nhà ngon hơn ngoài tiệm khi bạn kiểm soát được nguyên liệu. Khuôn inox tròn chịu nhiệt cao, nướng đế giòn tan.", false, "/images/products/p01.jpg"],
    ["Khuôn Bánh Mỳ / Khuôn Loaf", "KHUÔN NƯỚNG BÁNH", 35000, 35000, "Khuôn loaf tiêu chuẩn làm bánh mì gối, bánh mì thịt. Kích thước chuẩn, chống dính, bánh ra khuôn dễ dàng.", false, "/images/products/p02.jpg"],
    ["Khuôn Bánh Vuông Chống Dính 21 x 8cm", "KHUÔN NƯỚNG BÁNH", 95000, 105000, "Làm bánh pound, bánh kem vuông, brownie... khuôn vuông 21x8cm chống dính, cạnh vuông vức, bánh ra đẹp.", false, "/images/products/p03.jpg"],
    ["Khuôn Tròn Đúc Đế Liền", "KHUÔN NƯỚNG BÁNH", 35000, 38000, "Khuôn tròn đúc đế liền inox dày, nướng bánh mì, bánh ngọt. Chất liệu bền, truyền nhiệt đều, bánh chín vàng đều.", false, "/images/products/p08.jpg"],
    ["Khuôn Ring Vuông Nhập (Đế Rời)", "KHUÔN NƯỚNG BÁNH", 55000, 58000, "Làm bánh mousse, bánh lạnh, entremet cần khuôn ring đế rời. Khuôn vuông nhập, cạnh sắc, bánh ra đẹp.", false, "/images/products/p15.jpg"],
    ["Khay Silicone Làm Đá / Khay Nước", "KHUÔN SILICONE", 42000, 45000, "Làm đá viên, đá nước cốt dừa, đá trái cây — khay silicone nhiều ô, búng nhẹ là đá rời. Dễ dùng, dễ rửa.", false, "/images/products/p09.png"],
    ["Khuôn Socola / Làm Đá / Làm Thạch Pudding", "KHUÔN SILICONE", 25000, 28000, "Đa năng: làm socola, đá, thạch pudding, kẹo dẻo. Silicone dẻo, nhiều hình dễ thương, một khuôn chơi được nhiều món.", false, "/images/products/p14.jpg"],
    ["Bộ Khuôn Tim / Tròn To Nhỏ", "KHUÔN SILICONE", 28000, 35000, "Bộ khuôn silicone nhiều size tim và tròn, làm socola, thạch, kẹo tặng người yêu, tặng bạn bè. Đáng yêu, dễ dùng.", false, "/images/products/p17.jpg"],
    ["Khuôn Silicone Sinh Vật Biển / Cá Ngựa", "KHUÔN SILICONE", 38000, 40000, "Làm socola, thạch hình sinh vật biển — cá ngựa, sò, sao biển cho tiệc sinh nhật theme biển. Bé thích mê.", false, "/images/products/p11.jpg"],
    ["Khuôn Silicone Bán Cầu 6.3cm", "KHUÔN SILICONE", 20000, 25000, "Làm bánh mousse bán cầu, kem trượt, socola bán cầu — khuôn 6.3cm size chuẩn, ra bánh tròn đều đẹp. Siêu rẻ.", false, "/images/products/p12.jpg"],
    ["Khuôn Silicone Vỏ Sò", "KHUÔN SILICONE", 20000, 25000, "Làm socola, thạch, kẹo hình vỏ sò dễ thương. Silicone mềm, dễ lấy khuôn. Phù hợp làm quà tặng nhỏ.", false, "/images/products/p13.jpg"],
    ["Khuôn Ốc Sò Vuông Trang Trí Bánh", "KHUÔN SILICONE", 38000, 40000, "Làm phụ kiện trang trí bánh từ socola, fondant, isomalt. Chi tiết ốc sò vuông sang trọng, nâng tầm chiếc bánh.", false, "/images/products/p10.jpg"],
    ["Khuôn Tròn Bán Cầu To Nhỏ", "KHUÔN SILICONE", 30000, 35000, "Làm bóng đá, mousse bán cầu, kem tròn — bộ khuôn nhiều size to nhỏ linh hoạt. Silicone dẻo, lấy bánh dễ.", false, "/images/products/p06.jpg"],
    ["Khuôn Silicone Hoa Hồng HH012", "KHUÔN SILICONE", 25000, 30000, "Tự làm hoa socola, hoa fondant, thạch hoa hồng — chi tiết cánh rõ, đẹp như thật. Tuyệt vời cho bánh cưới, bánh kỷ niệm.", true, "/images/products/p09.png"],
    ["Khuôn Silicone Cành Mai", "KHUÔN SILICONE", 20000, 25000, "Hoa mai cho bánh Tết, socola ngày xuân. Khuôn silicone chi tiết cành mai, làm quà Tết mang tết cả nhà.", false, "/images/products/p05.jpg"],
    ["Khuôn Silicone Hoa Mẫu Đơn HM12", "KHUÔN SILICONE", 58000, 65000, "Hoa mẫu đơn sang trọng, cánh多层 — khuôn chi tiết tinh tế cho bánh cưới, bánh cao cấp. Đầu tư cho tiệm bánh.", false, "/images/products/p08.jpg"],
    ["Bình Lắc Pha Chế / Shaker PP 500ml-700ml", "DỤNG CỤ PHA CHẾ", 80000, 90000, "Pha trà sữa, sinh tố, cocktail tại nhà — bình shaker PP vặn chặt, không rỉ, có 2 size 500ml và 700ml. Tiện cho cả gia đình.", false, "/images/products/p04.jpg"],
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
  for (const [name, category, priceMin, priceMax, description, featured, image] of productsRaw) {
    let slug = slugify(name);
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
        image,
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
