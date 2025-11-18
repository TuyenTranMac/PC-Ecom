import { cookies } from "next/headers";

export async function getPayloadUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("payload-token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/me`, {
      method: "GET",
      headers: {
        Authorization: `JWT ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.user ?? null;
  } catch (err) {
    console.error("Payload auth error:", err);
    return null;
  }
}
