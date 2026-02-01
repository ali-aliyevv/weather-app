import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & { iconName: string };

function WeatherIcon({ iconName, className, ...rest }: Props) {
  return (
    <div {...rest} className={cn("relative h-20 w-20", className)}>
      <Image
        width={100}
        height={100}
        alt="weather picture"
        className="absolute h-full w-full"
        src={`https://openweathermap.org/img/wn/${iconName}@4x.png`}
      />
    </div>
  );
}

export default WeatherIcon;
