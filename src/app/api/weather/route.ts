import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });

  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return NextResponse.json({ error: "Missing API key" }, { status: 500 });

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("appid", key);

  const res = await fetch(url.toString());
  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
