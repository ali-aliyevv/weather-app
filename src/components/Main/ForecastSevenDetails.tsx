import React from "react";
import { FiDroplet } from "react-icons/fi";
import { LuEye } from "react-icons/lu";

export interface ForecastDetailProps {
  visibility: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
}
function ForecastSevenDetails(props:ForecastDetailProps) {
  const{
    visibility="25km",
    humidity="61%",
    windSpeed="7 km/h",
    airPressure="1012hPa",
    sunrise="6.20",
    sunset="18:48"
  }=props
  return(
    <>
     <SimpleDetails 
     icon={<LuEye />}
      information="Visibility" 
      value={props.visibility}
       />

     <SimpleDetails 
     icon={<FiDroplet />} 
     information="Humidty"
      value={props.humidity} />

     <SimpleDetails 
     icon={<LuEye />} 
     information="Wind Speed"
      value={props.windSpeed} />

     <SimpleDetails
      icon={<LuEye />} 
      information="Air Pressure"
       value={props.airPressure} />

       
     <SimpleDetails
      icon={<LuEye />} 
      information="Sunrise"
       value={props.sunrise} />
       
     <SimpleDetails
      icon={<LuEye />} 
      information="Sunset"
       value={props.sunset} />
       </>
    )
}

export interface SimpleDetailsProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}
function SimpleDetails(props: SimpleDetailsProps) {
  return (
    <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black">
      <p className="whitespace-nowrap">{props.information}</p>
      <div className="text-3xl">{props.icon}</div>
      <p>{props.value}</p>
    </div>
  );
}
export default ForecastSevenDetails;
