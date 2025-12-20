"use client";
import { useState } from "react";
import { useTRPC } from "@/app/(app)/trpcHelper/useTRPC";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { OSMAutocomplete } from "@/components/ui/osm-autocomplete";
import { Badge } from "@/components/ui/badge";

// Địa chỉ sẽ lấy từ API

export function AddressManager() {
  const trpc = useTRPC();
  const { data: addresses = [], refetch } = useSuspenseQuery(
    trpc.address.getAll.queryOptions()
  );
  const createMutation = useMutation(
    trpc.address.create.mutationOptions({
      onSuccess: () => refetch(),
    })
  );
  const updateMutation = useMutation(
    trpc.address.update.mutationOptions({
      onSuccess: () => refetch(),
    })
  );
  const deleteMutation = useMutation(
    trpc.address.delete.mutationOptions({
      onSuccess: () => refetch(),
    })
  );
  const setDefaultMutation = useMutation(
    trpc.address.setDefault.mutationOptions({
      onSuccess: () => refetch(),
    })
  );

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({
    fullName: "",
    phone: "",
    addressLine1: "",
  });
  const [editId, setEditId] = useState<string | null>(null);

  const handleOpen = (address?: any) => {
    setOpen(true);
    if (address) {
      setForm({
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || "",
        ward: address.ward || "",
        district: address.historic || "",
        province: address.province || "",
        country: address.country || "VN",
      });
      setEditId(address.id);
    } else {
      setForm({ fullName: "", phone: "", addressLine1: "" });
      setEditId(null);
    }
  };

  const handleSave = () => {
    // Validate các trường bắt buộc
    if (!form.fullName || form.fullName.length < 2) {
      alert("Vui lòng nhập họ tên người nhận (tối thiểu 2 ký tự)");
      return;
    }
    if (!form.phone || form.phone.length < 8) {
      alert("Vui lòng nhập số điện thoại hợp lệ");
      return;
    }
    if (!form.addressLine1 || form.addressLine1.length < 5) {
      alert("Vui lòng nhập địa chỉ chi tiết (tối thiểu 5 ký tự)");
      return;
    }
    // Log dữ liệu gửi lên để debug
    console.log("[DEBUG] Dữ liệu gửi lên:", form);
    if (editId) {
      updateMutation.mutate({ id: editId, ...form });
    } else {
      createMutation.mutate(form);
    }
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };

  const handleSetDefault = (id: string) => {
    setDefaultMutation.mutate({ id });
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Địa chỉ nhận hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {addresses.map((a: any) => (
            <div
              key={a.id}
              className="flex items-center justify-between border rounded-lg p-4"
            >
              <div>
                <div className="font-semibold">
                  {a.fullName} {a.isDefault && <Badge>Địa chỉ mặc định</Badge>}
                </div>
                <div className="text-sm text-muted-foreground">{a.phone}</div>
                <div className="text-sm">{a.addressLine1}</div>
                {a.addressLine2 && (
                  <div className="text-sm">{a.addressLine2}</div>
                )}
                {a.ward && <div className="text-sm">Phường: {a.ward}</div>}
                {a.district && (
                  <div className="text-sm">Quận/Huyện: {a.district}</div>
                )}
                {a.province && (
                  <div className="text-sm">Tỉnh/TP: {a.province}</div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpen(a)}
                >
                  Sửa
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(a.id)}
                >
                  Xoá
                </Button>
                {!a.isDefault && (
                  <Button size="sm" onClick={() => handleSetDefault(a.id)}>
                    Đặt mặc định
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button onClick={() => handleOpen()} className="mt-2">
            Thêm địa chỉ mới
          </Button>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editId ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input
                placeholder="Họ tên người nhận"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
              <Input
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <OSMAutocomplete
                placeholder="Nhập địa chỉ (OpenStreetMap)"
                value={form.addressLine1}
                onChange={(val, place) => {
                  if (place) {
                    console.log("OSM place chọn:", place);
                    setForm({
                      ...form,
                      addressLine1: place.display_name,
                      lat: place.lat,
                      lng: place.lon,
                      ward:
                        place.address.county || // Phường/xã (OSM Việt Nam hay trả về county là phường)
                        place.address.suburb ||
                        place.address.village ||
                        place.address.hamlet ||
                        place.address.neighbourhood ||
                        "",
                      district:
                        place.address.suburb || // Quận/huyện (nhiều khi suburb là quận)
                        place.address.historic ||
                        place.address.historic ||
                        place.address.town ||
                        place.address.city ||
                        place.address.county ||
                        "",
                      province:
                        place.address.state ||
                        place.address.region ||
                        place.address.state_district ||
                        place.address.city ||
                        "",
                      country: place.address.country || "VN",
                      postalCode: place.address.postcode || "",
                    });
                  } else {
                    setForm({ ...form, addressLine1: val });
                  }
                }}
              />
              <Input
                placeholder="Địa chỉ bổ sung (tuỳ chọn)"
                value={form.addressLine2 || ""}
                onChange={(e) =>
                  setForm({ ...form, addressLine2: e.target.value })
                }
              />
              <Input
                placeholder="Phường/Xã (tuỳ chọn)"
                value={form.ward || ""}
                onChange={(e) => setForm({ ...form, ward: e.target.value })}
              />
              <Input
                placeholder="Quận/Huyện (tuỳ chọn)"
                value={form.district || ""}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              />
              <Input
                placeholder="Tỉnh/Thành phố (tuỳ chọn)"
                value={form.province || ""}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
              />
              <Button onClick={handleSave} className="w-full mt-2">
                Lưu
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
