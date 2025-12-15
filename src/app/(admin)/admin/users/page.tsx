import { api } from "@/server/server";

export default async function UsersPage() {
  const caller = await api();
  const data = await caller.admin.getUsers({ limit: 100, role: "USER" });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Users</h1>
        <p className="text-muted-foreground">
          Tổng số user: <b>{data?.users.length ?? 0}</b>
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Username</th>
              <th className="py-2 text-left">Email</th>
              <th className="py-2 text-left">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {data?.users.map((u) => (
              <tr key={u.id} className="border-b">
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data?.users.length === 0 && (
          <div className="text-center py-4">Không có user nào</div>
        )}
      </div>
    </div>
  );
}
