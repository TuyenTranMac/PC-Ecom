import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TableBody } from "@/components/ui/table";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
   <div>
      <Label>HELLO WELCOME PAGE</Label>
      <Button className="">LICK ME</Button>
      <TableBody>
        <li>A</li>
        <li>A</li>
        <li>A</li>
      </TableBody>
   </div>
  );
}
