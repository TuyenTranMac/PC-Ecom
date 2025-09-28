import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TableBody } from "@/components/ui/table";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  return (
   <div className=" flex flex-col gap-y-4">
      <Label>HELLO WELCOME PAGE</Label>
      <Input placeholder="enter" ></Input>
      <Textarea placeholder={"I am here"}></Textarea>
      <Button variant={"elevated"} >LICK ME</Button>
      <Checkbox value={"checked"}></Checkbox>
      <Progress value={50}></Progress>
      <div>
        <Button variant={"elevated"}>Lick</Button>  
      </div>   
   </div>
   
  );
}
