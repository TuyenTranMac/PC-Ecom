import type { CollectionConfig } from 'payload'
import { string } from 'zod'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: "username",
      type: "text",
      required: true,
      unique: true,
    }
    // Email added by default
    // Add more fields as needed
  ],
}
