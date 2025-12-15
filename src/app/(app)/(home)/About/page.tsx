import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, Users, Shield, TrendingUp, Package, Zap } from "lucide-react";

export const metadata = {
  title: "Về chúng tôi | Gear Marketplace",
  description:
    "Tìm hiểu về Gear - Nền tảng thương mại điện tử đa nhà cung cấp hàng đầu Việt Nam",
};

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <Badge className="mb-4" variant="outline">
          Về Gear Marketplace
        </Badge>
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          Nền tảng kết nối người mua và người bán
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Gear là marketplace đa nhà cung cấp, giúp các cửa hàng dễ dàng tiếp
          cận khách hàng và khách hàng tìm thấy sản phẩm chất lượng từ nhiều
          vendor uy tín.
        </p>
      </div>

      {/* Stats Section */}
      <div className="mb-16 grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Store className="mx-auto mb-3 h-10 w-10 text-primary" />
            <div className="mb-1 text-3xl font-bold">1000+</div>
            <p className="text-sm text-muted-foreground">Cửa hàng</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-primary" />
            <div className="mb-1 text-3xl font-bold">50K+</div>
            <p className="text-sm text-muted-foreground">Người dùng</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-primary" />
            <div className="mb-1 text-3xl font-bold">100K+</div>
            <p className="text-sm text-muted-foreground">Sản phẩm</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="mx-auto mb-3 h-10 w-10 text-primary" />
            <div className="mb-1 text-3xl font-bold">99%</div>
            <p className="text-sm text-muted-foreground">Hài lòng</p>
          </CardContent>
        </Card>
      </div>

      {/* Mission Section */}
      <div className="mb-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Sứ mệnh của chúng tôi</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Xây dựng một nền tảng thương mại điện tử minh bạch, an toàn và dễ sử
            dụng, nơi mọi người đều có thể kinh doanh và mua sắm một cách hiệu
            quả nhất.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <Shield className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-bold">Bảo mật & Tin cậy</h3>
              <p className="text-muted-foreground">
                Hệ thống xác thực và bảo vệ giao dịch đảm bảo an toàn cho cả
                người mua và người bán.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Zap className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-bold">Dễ dàng & Nhanh chóng</h3>
              <p className="text-muted-foreground">
                Giao diện thân thiện, quy trình đơn giản giúp bạn bắt đầu kinh
                doanh chỉ trong vài phút.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Store className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-bold">Đa dạng & Chất lượng</h3>
              <p className="text-muted-foreground">
                Hàng nghìn cửa hàng với đủ mọi loại sản phẩm, được kiểm duyệt kỹ
                lưỡng về chất lượng.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Story Section */}
      <div className="mb-16">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="mb-4 text-3xl font-bold">
              Câu chuyện của chúng tôi
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Gear Marketplace ra đời từ ý tưởng tạo ra một nền tảng công
                bằng, nơi các cửa hàng nhỏ có thể cạnh tranh bình đẳng với những
                thương hiệu lớn.
              </p>
              <p>
                Chúng tôi tin rằng mọi người đều xứng đáng có cơ hội tiếp cận
                thị trường rộng lớn mà không bị giới hạn bởi nguồn lực hay kinh
                nghiệm.
              </p>
              <p>
                Với công nghệ hiện đại và đội ngũ hỗ trợ tận tâm, Gear cam kết
                đồng hành cùng sự phát triển của mỗi vendor trên nền tảng.
              </p>
            </div>
          </div>
          <Card className="bg-muted/50">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">
                    2023
                  </div>
                  <h3 className="text-lg font-bold">Thành lập</h3>
                  <p className="text-sm text-muted-foreground">
                    Ra mắt platform beta với 50 vendors
                  </p>
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">
                    2024
                  </div>
                  <h3 className="text-lg font-bold">Mở rộng</h3>
                  <p className="text-sm text-muted-foreground">
                    Đạt 1000+ vendors và 50K người dùng
                  </p>
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">
                    2025
                  </div>
                  <h3 className="text-lg font-bold">Hiện tại</h3>
                  <p className="text-sm text-muted-foreground">
                    Nền tảng marketplace hàng đầu VN
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="py-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Sẵn sàng bắt đầu?</h2>
          <p className="mb-6 text-lg opacity-90">
            Tham gia cùng hàng nghìn vendor đang kinh doanh thành công trên Gear
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/subscription"
              className="rounded-md bg-background px-6 py-3 font-medium text-foreground hover:bg-background/90"
            >
              Trở thành Vendor
            </a>
            <a
              href="/MarketPlace"
              className="rounded-md border-2 border-background px-6 py-3 font-medium hover:bg-background/10"
            >
              Khám phá sản phẩm
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
