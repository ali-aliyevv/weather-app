"use client";

import Navbar from "@/components/shared/Navbar/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseISO, format, fromUnixTime } from "date-fns";
import Container from "@/components/Main/Container";
import { convertKelvinToCelsius } from "@/utilits/convertKelvinToCelsius";
import WeatherIcon from "@/components/Main/WeatherIcon";
import { getDayOrNightIcon } from "@/utilits/getDayOrNightIcon";
import ForecastSevenDetails from "@/components/Main/ForecastSevenDetails";
import { MetersToKilometers } from "@/utilits/MetersToKilometersConverter";
import { changewindspeed } from "@/utilits/windspeed";
import ForecastSeven from "@/components/Main/ForecastSeven";
import { useAtom } from "jotai";
import { atomplace, cityresponse } from "./atom";
import React from "react";

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: City;
}

interface WeatherDetail {
  dt: number;
  main: MainWeather;
  weather: WeatherDescription[];
  clouds: { all: number };
  wind: { speed: number; deg: number; gust: number };
  sys: { pod: string };
  visibility: number;
  pop: number;
  dt_txt: string;
}

interface MainWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

interface WeatherDescription {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface City {
  id: number;
  name: string;
  coord: { lat: number; lon: number };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export default function Home() {
  const [place] = useAtom(atomplace);
  const [responsecity] = useAtom(cityresponse);

  const { isLoading, error, data } = useQuery<WeatherData>({
    queryKey: ["forecast", place],
    queryFn: async () => {
      // ✅ API key client-də görünmür
      const res = await axios.get<WeatherData>(
        `/api/forecast?q=${encodeURIComponent(place)}&cnt=56`
      );
      return res.data;
    },
    enabled: Boolean(place),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="w-[400px] h-[200px] m-auto flex items-center justify-center text-center mt-[230px]">
        Loading...
      </div>
    );
  }

  if (error) {
    const msg =
      (error as any)?.response?.data?.error ||
      (error as any)?.message ||
      "Unknown error";
    return (
      <div className="text-center mt-10 text-red-500">
        Weather service error: {msg}
      </div>
    );
  }

  if (!data?.list?.length) {
    return <div className="text-center mt-10">No data</div>;
  }

  const Weekdays = data.list[0];

  const uniqueDates = Array.from(
    new Set(
      data.list.map((entry) =>
        new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  );

  const firstDataForEachDate = uniqueDates
    .map((date) => {
      return data.list.find((entry) => {
        const entryDate = new Date(entry.dt * 1000)
          .toISOString()
          .split("T")[0];
        const entryTime = new Date(entry.dt * 1000).getHours();
        return entryDate === date && entryTime >= 6;
      });
    })
    .filter(Boolean) as WeatherDetail[];

  return (
    <>
      <Navbar location={data.city.name} />

      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {responsecity ? (
          <WeatherSkeleton />
        ) : (
          <>
            <section className="space-y-4">
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl items-end">
                  <p>{format(parseISO(Weekdays.dt_txt ?? ""), "EEEE")}</p>
                  <p className="text-lg">
                    ({format(parseISO(Weekdays.dt_txt ?? ""), "dd.MM.yyyy")})
                  </p>
                </h2>

                <Container className="gap-10 px-6 items-center">
                  <div className="flex flex-col px-4">
                    <span className="text-5xl">
                      {convertKelvinToCelsius(Weekdays?.main.temp ?? 296.6)}°
                    </span>
                    <p className="text-xs space-x-1 whitespace-nowrap">
                      <span>Feels like </span>
                      {convertKelvinToCelsius(Weekdays?.main.feels_like ?? 0)}°
                    </p>
                    <p className="text-xs space-x-1">
                      <span>
                        {convertKelvinToCelsius(Weekdays?.main.temp_min ?? 0)}°
                        ↓{" "}
                      </span>
                      <span>
                        {convertKelvinToCelsius(Weekdays?.main.temp_max ?? 0)}°
                        ↑
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                    {data.list.map((d, i) => (
                      <div
                        key={i}
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                      >
                        <p className="whitespace-nowrap">
                          {format(parseISO(d.dt_txt), "h:mm a")}
                        </p>
                        <WeatherIcon iconName={d.weather[0].icon} />
                        <p>{convertKelvinToCelsius(d?.main.temp ?? 0)}°</p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>

              <div className="flex gap-4">
                <Container className="w-fit justify-center flex-col px-4 items-center">
                  <p className="text-center capitalize">
                    {Weekdays?.weather?.[0]?.description}
                  </p>

                  <WeatherIcon
                    iconName={getDayOrNightIcon(
                      Weekdays?.weather?.[0]?.icon ?? "",
                      Weekdays?.dt_txt ?? ""
                    )}
                  />
                </Container>

                <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
                  <ForecastSevenDetails
                    visibility={MetersToKilometers(Weekdays?.visibility ?? 1000)}
                    airPressure={`${Weekdays?.main?.pressure ?? 0} hPa`}
                    humidity={`${Weekdays?.main?.humidity ?? 0} %`}
                    sunrise={`${format(fromUnixTime(data.city.sunrise ?? 0), "H:mm")} am`}
                    sunset={`${format(fromUnixTime(data.city.sunset ?? 0), "H:mm")} pm`}
                    windSpeed={changewindspeed(Weekdays?.wind?.speed ?? 0)}
                  />
                </Container>
              </div>
            </section>

            <section className="flex w-full flex-col gap-4">
              <p className="text-2xl">Forecast (7 days)</p>

              {firstDataForEachDate.map((d, i) => (
                <ForecastSeven
                  key={i}
                  description={d?.weather?.[0]?.description ?? ""}
                  weatherIcon={d?.weather?.[0]?.icon ?? "01d"}
                  date={d?.dt_txt ? format(parseISO(d.dt_txt), "dd.MM") : ""}
                  day={d?.dt_txt ? format(parseISO(d.dt_txt), "EEEE") : ""}
                  feels_like={d?.main?.feels_like ?? 0}
                  temp={d?.main?.temp ?? 0}
                  temp_max={d?.main?.temp_max ?? 0}
                  temp_min={d?.main?.temp_min ?? 0}
                  visibility={`${MetersToKilometers(d?.visibility ?? 1000)}`}
                  humidity={`${d?.main?.humidity ?? 0}%`}
                  airPressure={`${d?.main?.pressure ?? 0} hPa`}
                  windSpeed={changewindspeed(d?.wind?.speed ?? 0)}
                  sunrise={format(fromUnixTime(data.city.sunrise ?? 0), "H:mm a")}
                  sunset={format(fromUnixTime(data.city.sunset ?? 0), "H:mm")}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </>
  );
}

function WeatherSkeleton() {
  return (
    <section className="space-y-8 ">
      <div className="space-y-2 animate-pulse">
        <div className="flex gap-1 text-2xl items-end ">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 animate-pulse">
        <p className="text-2xl h-8 w-36 bg-gray-300 rounded"></p>

        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
