"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface PricingCardProps {
  plan: {
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
  };
  currentPlan?: string;
  isLoading?: boolean;
  onSelect: (planType: string) => void;
}

export const PricingCard = ({
  plan,
  currentPlan,
  isLoading,
  onSelect,
}: PricingCardProps) => {
  const isCurrentPlan = currentPlan === plan.name;
  const isPro = plan.name === "PRO";

  return (
    <Card
      className={cn(
        "relative flex flex-col transition-all hover:shadow-lg",
        isPro && "border-primary shadow-md",
        isCurrentPlan && "ring-2 ring-primary"
      )}
    >
      {isPro && (
        <div className="bg-primary absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1">
          <div className="flex items-center gap-1 text-xs font-semibold text-white">
            <Sparkles className="h-3 w-3" />
            <span>PHỔ BIẾN</span>
          </div>
        </div>
      )}

      <CardHeader className="pb-8 pt-8">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>
          {plan.name === "FREE" ? "Cho người mới bắt đầu" : "Cho doanh nghiệp"}
        </CardDescription>

        <div className="mt-4">
          <span className="text-4xl font-bold">
            {plan.price.toLocaleString("vi-VN")}
          </span>
          <span className="text-muted-foreground ml-2 text-sm">
            {plan.currency}/{plan.interval === "month" ? "tháng" : "mãi mãi"}
          </span>
        </div>

        {isCurrentPlan && (
          <Badge variant="secondary" className="mt-4 w-fit">
            Gói hiện tại
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={isPro ? "default" : "outline"}
          disabled={isCurrentPlan || isLoading}
          onClick={() => onSelect(plan.name)}
        >
          {isCurrentPlan
            ? "Đang sử dụng"
            : plan.name === "FREE"
              ? "Chọn gói FREE"
              : "Nâng cấp PRO"}
        </Button>
      </CardFooter>
    </Card>
  );
};
