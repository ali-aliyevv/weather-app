"use client";
import React, { useState } from "react";
import { FaSun } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineMyLocation } from "react-icons/md";
import SearchBox from "@/components/Main/SearchBox";
import axios from "axios";
import { atomplace, cityresponse } from "@/app/atom";
import { useAtom } from "jotai";

type Props = { location?: string };

function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [, setplace] = useAtom(atomplace);
  const [, setcityresponse] = useAtom(cityresponse);

  async function handleInputChang(value: string) {
    setCity(value);

    if (value.length >= 3) {
      try {
        const response = await axios.get(`/api/find?q=${encodeURIComponent(value)}`);
        const list = response.data?.list ?? [];
        const suggestions = list.map((item: any) => item.name);

        setSuggestions(suggestions);
        setError("");
        setShowSuggestions(true);
      } catch (err) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setcityresponse(true);

    if (suggestions.length === 0) {
      setError("Location not found");
      setcityresponse(false);
      return;
    }

    setError("");
    setTimeout(() => {
      setcityresponse(false);
      setplace(city);
      setShowSuggestions(false);
    }, 500);
  }

  function findCurrentLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        setcityresponse(true);

        const response = await axios.get(
          `/api/weather?lat=${latitude}&lon=${longitude}`
        );

        setTimeout(() => {
          setcityresponse(false);
          setCity(response.data?.name ?? "");
        }, 500);
      } catch (err) {
        setcityresponse(false);
      }
    });
  }

  return (
    <div className="w-100 bg-[#EAEAEA] h-[90px] items-center flex">
      <div className="w-5/6 h-[50px] flex items-center m-auto justify-between">
        <div className="flex items-center">
          <h3 className="text-2xl">Weather</h3>
          <FaSun className="ml-1 mt-1 size-5 text-[yellow]" />
        </div>

        <div className="flex items-center">
          <MdOutlineMyLocation
            title="Your current Location..."
            onClick={findCurrentLocation}
            className="size-8 cursor-pointer"
          />
          <CiLocationOn className="size-8 ml-3 cursor-pointer" />
          <p className="text-sm">{location}</p>

          <div className="relative">
            <SearchBox
              value={city}
              onSubmit={handleSubmitSearch}
              onChange={(e) => handleInputChang(e.target.value)}
            />

            <SuggestBox
              showSuggestions={showSuggestions}
              suggestions={suggestions}
              handleSuggestionClick={handleSuggestionClick}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SuggestBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {showSuggestions && (
        <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex-col gap-2 py-2 px-2">
          {error && suggestions.length < 1 && (
            <li className="text-red-500 p-1">{error}</li>
          )}

          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item)}
              className="cursor-pointer p-1 rounded hover:bg-gray-200"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default Navbar;
