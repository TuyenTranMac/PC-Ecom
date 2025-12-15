import { api } from "@/server/server";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/modules/auth/ui/profile/ProfileForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePage = async () => {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth");
  }

  const caller = await api();
  const userProfile = await caller.auth.getProfile();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Profile của tôi</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý thông tin cá nhân và cài đặt tài khoản
          </p>
        </div>

        {/* Profile Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={userProfile.image || undefined}
                  alt={userProfile.username}
                />
                <AvatarFallback className="text-2xl">
                  {userProfile.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{userProfile.username}</CardTitle>
                <CardDescription className="mt-1">
                  {userProfile.email}
                </CardDescription>
                <div className="mt-2 flex gap-2">
                  <Badge
                    variant={
                      userProfile.role === "VENDOR" ? "default" : "secondary"
                    }
                  >
                    {userProfile.role}
                  </Badge>
                  {userProfile.emailVerified && (
                    <Badge variant="outline" className="text-green-600">
                      Email đã xác thực
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Subscription Info (if vendor) */}
        {userProfile.Subscription && (
          <Card>
            <CardHeader>
              <CardTitle>Gói đăng ký</CardTitle>
              <CardDescription>Thông tin gói dịch vụ hiện tại</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gói:</span>
                  <Badge>{userProfile.Subscription.plan}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <Badge
                    variant={
                      userProfile.Subscription.status === "ACTIVE"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {userProfile.Subscription.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Store Info (if has store) */}
        {userProfile.Store && (
          <Card>
            <CardHeader>
              <CardTitle>Cửa hàng</CardTitle>
              <CardDescription>Thông tin shop của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tên shop:</span>
                  <span className="font-medium">{userProfile.Store.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Slug:</span>
                  <span className="font-mono text-sm">
                    {userProfile.Store.slug}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Chỉnh sửa profile</CardTitle>
            <CardDescription>
              Cập nhật thông tin cá nhân và đổi mật khẩu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm initialData={userProfile} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
