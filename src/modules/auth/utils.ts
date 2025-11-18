import { cookies as getCookies } from "next/headers";


interface Props{
    prefix: string,
    value: string,
}export const generateAuthCookies = async ( {prefix,value} : Props) =>  {
      const cookies = await getCookies();
            cookies.set({
                name: `${prefix}-token`, //default cookies prefix by Payload
                value: value,
                httpOnly: true,
                path: "/",
                // sameSite: "none",
                // domain:""
            })
}