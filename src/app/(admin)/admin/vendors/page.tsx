import VendorTableClient from "./VendorTableClient";
import { api } from "@/server/server";

export default async function VendorsPage() {
  const caller = await api();
  const data = await caller.admin.getVendors({ limit: 100 });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Vendors</h1>
        <p className="text-muted-foreground">
          Tổng số vendor: <b>{data?.vendors.length ?? 0}</b>
        </p>
      </div>
      <VendorTableClient initialVendors={data?.vendors ?? []} />
    </div>
  );
}
