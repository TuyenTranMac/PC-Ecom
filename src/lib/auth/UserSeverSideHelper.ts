import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { headers } from 'next/headers';

export const getUserInfoSeverSide =  async () =>{
    const headerList = await headers()
    const payload = await getPayload({config: configPromise})
    const { user } = await payload.auth({headers: headerList})
    return user;
}