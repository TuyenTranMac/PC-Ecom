"use client";

import type { Address } from "@prisma/client";
import { Card } from "@/components/ui/card";

interface AddressSelectProps {
  addresses: Address[];
  value?: string;
  onChange: (address: Address) => void;
  className?: string;
}

export function AddressSelect({
  addresses,
  value,
  onChange,
  className,
}: AddressSelectProps) {
  return (
    <Card className={`p-4 ${className}`}>
      <div className="mb-2 font-semibold">Chọn địa chỉ nhận hàng</div>
      <div className="space-y-3">
        {addresses.length === 0 && (
          <div className="text-muted-foreground text-sm">
            Bạn chưa có địa chỉ nào được lưu.
          </div>
        )}
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`cursor-pointer rounded border p-3 transition-colors ${
              value === address.id
                ? "border-primary bg-primary/10"
                : "hover:border-primary/80"
            }`}
            onClick={() => onChange(address)}
          >
            <div className="font-medium">
              {address.fullName}{" "}
              {address.isDefault && (
                <span className="ml-2 text-xs font-normal text-primary">
                  (Mặc định)
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">{address.phone}</div>
            <p className="text-sm">
              {`${address.addressLine1}, ${address.ward}, ${address.district}, ${address.province}`}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
