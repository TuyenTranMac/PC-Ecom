import { getSession } from "@/lib/auth/session";
import Overlay from "./overlay";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await getSession();

  if (user) {
    redirect("/");
  }
  return <Overlay />;
};
export default page;
