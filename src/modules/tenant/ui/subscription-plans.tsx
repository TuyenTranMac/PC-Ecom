"use client";

import { useState } from "react";
import { PricingCard } from "./pricing-card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/server/client";
import { useMutation } from "@tanstack/react-query";

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  maxProducts: number;
  maxImages: number;
  customDomain: boolean;
  prioritySupport: boolean;
}

interface Subscription {
  plan: string;
  status: string;
  endDate?: Date | null;
}

interface SubscriptionPlansProps {
  plans: Plan[];
  currentSubscription: Subscription | null;
  isVendor: boolean;
}

export const SubscriptionPlans = ({
  plans,
  currentSubscription,
  isVendor,
}: SubscriptionPlansProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const trpc = useTRPC();

  // Sử dụng tRPC mutation từ Client Component (cho tương tác)
  const subscribeMutation = useMutation(
    trpc.subscription.subscribeToPlan.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message);

        // Reload trang để cập nhật session với role VENDOR mới
        setTimeout(() => {
          window.location.href = "/"; // Redirect về trang chủ với role mới
        }, 1500);
      },
      onError: (error: any) => {
        toast.error(error.message || "Có lỗi xảy ra");
      },
      onSettled: () => {
        setSelectedPlan(null);
      },
    })
  );

  const handleSelectPlan = (planName: string) => {
    // Nếu đã là vendor và đang chọn gói hiện tại, không làm gì
    if (isVendor && currentSubscription?.plan === planName) {
      toast.info("Bạn đang sử dụng gói này");
      return;
    }

    setSelectedPlan(planName);
    subscribeMutation.mutate({
      plan: planName as "FREE" | "PRO",
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {plans.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          currentPlan={currentSubscription?.plan}
          isLoading={subscribeMutation.isPending && selectedPlan === plan.name}
          onSelect={handleSelectPlan}
        />
      ))}
    </div>
  );
};
