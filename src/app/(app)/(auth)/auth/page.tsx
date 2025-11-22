import { caller, trpc } from "@/trpc/server";
import Overlay from "./overlay";
import { redirect } from "next/navigation";
import { getUserInfoSeverSide } from "@/lib/auth/UserSeverSideHelper";
const page = async () => {
  const user = await getUserInfoSeverSide();

  if (user) {
    redirect("/");
  }
  return <Overlay />;
};
export default page;
