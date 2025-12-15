"use client";
import { useState } from "react";
import { useTRPC } from "@/server/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";

export default function VendorTableClient({
  initialVendors,
}: {
  initialVendors: any[];
}) {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<null | {
    id: string;
    username: string;
  }>(null);
  const [vendors, setVendors] = useState(initialVendors);
  const revokeMutation = useMutation(
    trpc.admin.revokeVendor.mutationOptions({
      onSuccess: (_, { userId }) => {
        setOpen(false);
        setSelected(null);
        setVendors((prev) => prev.filter((v) => v.id !== userId));
      },
    })
  );

  return (
    <div className="rounded-lg border bg-card p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Username</th>
            <th className="py-2 text-left">Email</th>
            <th className="py-2 text-left">Ngày tạo</th>
            <th className="py-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((v) => (
            <tr key={v.id} className="border-b">
              <td>{v.username}</td>
              <td>{v.email}</td>
              <td>{new Date(v.createdAt).toLocaleString()}</td>
              <td>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelected({ id: v.id, username: v.username });
                    setOpen(true);
                  }}
                >
                  Xóa quyền
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {vendors.length === 0 && (
        <div className="text-center py-4">Không có vendor nào</div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Xác nhận xóa quyền vendor</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn xóa quyền vendor của <b>{selected?.username}</b>{" "}
            không?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              disabled={revokeMutation.isPending}
              onClick={() =>
                selected && revokeMutation.mutate({ userId: selected.id })
              }
            >
              {revokeMutation.isPending ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
