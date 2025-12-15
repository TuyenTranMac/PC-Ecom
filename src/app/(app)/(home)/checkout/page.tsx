import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { CheckoutForm } from "@/modules/checkout/ui/CheckoutForm";

const CheckoutPage = async () => {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Thanh toán</h1>
        <p className="text-muted-foreground mt-2">
          Hoàn tất thông tin để đặt hàng
        </p>
      </div>

      <CheckoutForm />
    </div>
  );
};

export default CheckoutPage;
