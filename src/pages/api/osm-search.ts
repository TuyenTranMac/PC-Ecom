import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q } = req.query;
  if (!q || typeof q !== "string")
    return res.status(400).json({ error: "Missing query" });

  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(q)}&limit=5`;
  const response = await fetch(url, {
    headers: { "User-Agent": "ecom-multi-vendor/1.0" },
  });
  const data = await response.json();
  res.status(200).json(data);
}
