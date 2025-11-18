import { caller } from "@/trpc/server";
import Overlay from "./overlay";
import { redirect } from "next/navigation";
const page = async () => {
  const session = await caller.auth.getMe();

  if (session.user) {
    redirect("/");
  }
  return <Overlay />;
};
export default page;
