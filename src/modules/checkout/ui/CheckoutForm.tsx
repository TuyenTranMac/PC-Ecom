"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/server/client";
import {
  checkoutSchema,
  type CheckoutInput,
} from "@/lib/schemas/checkout.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, Package, Store, CreditCard, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PaymentQRDialog } from "./PaymentQRDialog";
import type { PaymentQRData } from "@/lib/payment/sepay-webhooks.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
type CartItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  quantity: number;
  stock: number;
  storeId: string;
  storeName?: string;
};

export const CheckoutForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // QR Payment state
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentQRData | null>(null);
  const [currentOrderCode, setCurrentOrderCode] = useState<string>("");

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema) as any,
    mode: "onSubmit", // Chỉ validate khi submit, tránh validate khi đang load
    defaultValues: {
      cartItems: [],
      shippingAddress: {
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        ward: "",
        district: "",
        province: "",
        country: "VN",
      },
      paymentMethod: "COD" as const, // Default là COD
      note: "",
      useExistingAddress: false,
    },
  });
  const router = useRouter();
  const trpc = useTRPC();
  // ... các state cũ giữ nguyên

  // 1. Lấy danh sách địa chỉ từ Backend
  const { data: addresses, isLoading: isLoadingAddresses } = useQuery(
    trpc.address.getAll.queryOptions()
  );
  const fillAddressToForm = (address: any) => {
    form.setValue("shippingAddress.fullName", address.fullName);
    form.setValue("shippingAddress.phone", address.phone);
    form.setValue("shippingAddress.addressLine1", address.addressLine1);
    form.setValue("shippingAddress.addressLine2", address.addressLine2 || "");
    form.setValue("shippingAddress.ward", address.ward || "");
    form.setValue("shippingAddress.district", address.district || "");
    form.setValue("shippingAddress.province", address.province || "");
    // Trigger validate lại để xóa lỗi nếu có
    form.trigger("shippingAddress");
    toast.success("Đã áp dụng địa chỉ giao hàng");
  };
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      // Tìm địa chỉ mặc định, nếu không có thì lấy cái đầu tiên
      const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

      // Chỉ điền nếu form đang trống (tránh ghi đè nếu user đang nhập dở)
      const currentName = form.getValues("shippingAddress.fullName");
      if (!currentName) {
        fillAddressToForm(defaultAddress);
      }
    }
  }, [addresses]);
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      const items = JSON.parse(stored);

      const validItems = items.filter((item: any) => {
        if (!item.storeId) {
          console.warn("Item thiếu storeId, bỏ qua:", item);
          return false;
        }
        return true;
      });

      if (validItems.length !== items.length) {
        localStorage.setItem("cart", JSON.stringify(validItems));
        toast.error(
          "Một số sản phẩm trong giỏ hàng không hợp lệ đã được xóa. Vui lòng thêm lại."
        );
      }

      setCartItems(validItems);
      form.setValue("cartItems", validItems);
    }
  }, []);

  // Tính toán từ localStorage
  const cartData = useMemo(() => {
    if (cartItems.length === 0) return null;

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingFee = 30000;

    return {
      items: cartItems,
      subtotal: total,
      shippingFee,
      total: total + shippingFee,
    };
  }, [cartItems]);

  // Mutation tạo đơn hàng
  const createOrderMutation = useMutation(
    trpc.order.createOrder.mutationOptions({
      onSuccess: async (data) => {
        console.log("🎉 onSuccess triggered!");
        console.log("Response data:", data);

        const createdOrder = data.orders[0];
        if (!createdOrder) {
          console.error("❌ No order found in response");
          toast.error("Không tìm thấy đơn hàng");
          setIsSubmitting(false);
          return;
        }

        console.log("📦 Created order:", createdOrder);

        const paymentMethod = form.getValues("paymentMethod");
        console.log("💳 Payment method:", paymentMethod);

        if (paymentMethod === "SEPAY") {
          // Generate QR code và hiển thị dialog
          try {
            const response = await fetch("/api/sepay/generate-qr", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderCode: createdOrder.code,
                amount: createdOrder.total,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to generate QR code");
            }

            const qrData = await response.json();
            setPaymentData(qrData);
            setCurrentOrderCode(createdOrder.code);
            setShowPaymentQR(true);
            setIsSubmitting(false);
          } catch (error: any) {
            console.error("Generate QR error:", error);
            toast.error("Lỗi tạo mã QR: " + error.message);
            setIsSubmitting(false);
          }
        } else {
          console.log("🟢 COD flow");
          // COD - redirect về orders
          toast.success(data.message);
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("cart-updated"));
          router.push("/orders");
          router.refresh();
        }
      },
      onError: (error: any) => {
        toast.error(error.message || "Có lỗi xảy ra khi đặt hàng");
        setIsSubmitting(false);
      },
    })
  );

  const onSubmit = (data: CheckoutInput) => {
    console.log("=== CHECKOUT DEBUG ===");
    console.log("Cart items from state:", cartItems);
    console.log("Cart items from form:", data.cartItems);
    console.log("Form data:", data);

    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    // Validate storeId in cartItems
    console.log("Checking storeId for each item:");
    cartItems.forEach((item, idx) => {
      console.log(`Item ${idx}:`, {
        id: item.id,
        name: item.name,
        storeId: item.storeId,
        hasStoreId: !!item.storeId,
      });
    });

    const missingStore = cartItems.find((item) => !item.storeId);
    if (missingStore) {
      toast.error(`Sản phẩm ${missingStore.name} thiếu thông tin cửa hàng`);
      console.error("Missing storeId:", missingStore);
      return;
    }

    setIsSubmitting(true);
    // Gửi cart items cùng với form data
    const payload = {
      ...data,
      cartItems, // Thêm cart từ localStorage
    };
    console.log("Mutation payload:", payload);

    createOrderMutation.mutate(payload);
  };

  if (!cartData || cartItems.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Package className="text-muted-foreground h-16 w-16" />
        <h2 className="mt-4 text-xl font-semibold">Giỏ hàng trống</h2>
        <p className="text-muted-foreground mt-2">
          Vui lòng thêm sản phẩm vào giỏ hàng
        </p>
        <Button className="mt-4" onClick={() => router.push("/")}>
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }

  // Debug form state
  console.log("Form errors:", form.formState.errors);
  console.log("Form is valid:", form.formState.isValid);
  console.log("Cart items count:", cartItems.length);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.error("=== FORM VALIDATION FAILED ===");
            console.error("Errors:", errors);
            console.error("Form values:", form.getValues());
            toast.error("Vui lòng kiểm tra lại thông tin");
          })}
          className="space-y-6"
        >
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Form nhập thông tin */}
            <div className="space-y-6 lg:col-span-2">
              {/* Thông tin giao hàng */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">
                      Thông tin giao hàng
                    </h2>
                  </div>

                  {/* UI Chọn địa chỉ nhanh */}
                  {!isLoadingAddresses && addresses && addresses.length > 0 && (
                    <div className="w-[200px]">
                      <Select
                        onValueChange={(value) => {
                          const selected = addresses.find(
                            (a) => a.id === value
                          );
                          if (selected) fillAddressToForm(selected);
                        }}
                      >
                        <SelectTrigger className="h-9">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <SelectValue placeholder="Chọn địa chỉ có sẵn" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {addresses.map((addr) => (
                            <SelectItem key={addr.id} value={addr.id}>
                              <span className="font-medium">
                                {addr.fullName}
                              </span>{" "}
                              - {addr.addressLine1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Các FormField bên dưới giữ nguyên, chúng sẽ tự động nhận giá trị từ fillAddressToForm */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* ... FormField fullName ... */}
                  {/* ... FormField phone ... */}
                  {/* ... Các trường khác ... */}
                </div>
              </Card>

              {/* Phương thức thanh toán */}
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">
                    Phương thức thanh toán
                  </h2>
                </div>

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-3 rounded-lg border p-4">
                            <RadioGroupItem value="COD" id="cod" />
                            <label
                              htmlFor="cod"
                              className="flex flex-1 cursor-pointer items-center gap-3"
                            >
                              <div>
                                <div className="font-medium">
                                  Thanh toán khi nhận hàng (COD)
                                </div>
                                <div className="text-muted-foreground text-sm">
                                  Thanh toán bằng tiền mặt khi nhận hàng
                                </div>
                              </div>
                            </label>
                          </div>

                          <div className="flex items-center space-x-3 rounded-lg border p-4">
                            <RadioGroupItem value="SEPAY" id="sepay" />
                            <label
                              htmlFor="sepay"
                              className="flex flex-1 cursor-pointer items-center gap-3"
                            >
                              <div>
                                <div className="font-medium">
                                  Chuyển khoản ngân hàng (SePay)
                                </div>
                                <div className="text-muted-foreground text-sm">
                                  Quét mã QR để thanh toán nhanh chóng
                                </div>
                              </div>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Card>

              {/* Ghi chú */}
              <Card className="p-6">
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú đơn hàng (tùy chọn)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ghi chú về đơn hàng, ví dụ: thời gian giao hàng mong muốn..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Card>
            </div>

            {/* Right: Order summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 p-6">
                <h2 className="mb-4 text-lg font-semibold">Đơn hàng của bạn</h2>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className="bg-muted h-12 w-12 shrink-0 rounded">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full rounded object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="line-clamp-2">{item.name}</p>
                        <p className="text-muted-foreground text-xs">
                          x{item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span>{cartData.subtotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển:</span>
                    <span>{cartData.shippingFee.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">
                      {cartData.total.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="mt-6 w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Đặt hàng"
                  )}
                </Button>

                {createOrderMutation.error && (
                  <p className="mt-2 text-center text-sm text-destructive">
                    {(createOrderMutation.error as any).message ||
                      "Có lỗi xảy ra"}
                  </p>
                )}

                <p className="text-muted-foreground mt-3 text-center text-xs">
                  Bằng cách đặt hàng, bạn đồng ý với{" "}
                  <a href="/terms" className="underline">
                    Điều khoản dịch vụ
                  </a>
                </p>
              </Card>
            </div>
          </div>
        </form>
      </Form>

      {/* Payment QR Dialog */}
      {showPaymentQR && paymentData && (
        <PaymentQRDialog
          open={showPaymentQR}
          onClose={() => {
            setShowPaymentQR(false);
            setPaymentData(null);
          }}
          paymentData={paymentData}
          orderCode={currentOrderCode}
          onPaymentSuccess={() => {
            localStorage.removeItem("cart");
            window.dispatchEvent(new Event("cart-updated"));
            router.push("/orders");
            router.refresh();
          }}
        />
      )}
    </>
  );
};
