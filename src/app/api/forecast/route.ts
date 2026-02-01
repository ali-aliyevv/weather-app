import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const cnt = searchParams.get("cnt") ?? "56";

  if (!q) {
    return NextResponse.json({ error: "City (q) is required" }, { status: 400 });
  }

  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "OPENWEATHER_API_KEY is missing in .env.local" },
      { status: 500 }
    );
  }

  const url = new URL("https://api.openweathermap.org/data/2.5/forecast");
  url.searchParams.set("q", q);
  url.searchParams.set("appid", key);
  url.searchParams.set("cnt", cnt);

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: "OpenWeather error", details: text }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
