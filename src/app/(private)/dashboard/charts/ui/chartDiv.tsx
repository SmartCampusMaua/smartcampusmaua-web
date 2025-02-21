"use client"
import { useEffect, useState } from "react";
import { chartConfigs, ChartProps } from "../lib/chartConfigs";
// import { LineChart } from "./lineChart";



export function ChartDiv({
  className,
  chartType
}: {
  className?: string
  chartType: ChartProps["chartType"]
}
) {
  const [state, setState] = useState(false);
  const { apiUrl, devicesId } = chartConfigs[chartType];

  const [deviceId, setDeviceId] = useState<string>();
  const [fetchApiUrl, setFetchApiUrl] = useState<string>("");

  useEffect(() => {
    if (deviceId) {
      let fetchUrl = apiUrl;
      fetchUrl += `deviceId/${deviceId}?interval=1440`;
      setFetchApiUrl(fetchUrl);
    }
  }, [apiUrl, deviceId]);

  return (
    <>
      <section className={className}>
        <button
          onClick={() => setState(true)}
          className="bg-white text-black border rounded-md w-48 h-16"
        >Open {chartType}</button>
      </section>
      
      {/* creating modals */}
      <dialog className="w-[92%] h-[90%] z-10 open:fixed open:flex open:flex-col open:items-center open:justify-items-center open:rounded-3xl open:overflow-auto" open={state}>
        <button className="self-start m-3" onClick={() => setState(false)}>X</button>
        <div className="flex flex-row gap-2">
          <p>Choose {chartType} device</p>
          <select name="deviceSelect" defaultValue="" onChange={(e) => setDeviceId(e.target.value)} className="rounded-md px-3">
            <option value={""}></option>
            {devicesId.map((e, i) => {
              return (
                <option value={e} key={i}>{e}</option>
              )
            })}
          </select>
        </div>
        {/* {deviceId && <LineChart fetchUrl={fetchApiUrl} chartConfigs={chartConfigs[chartType]}
           />} */}
      </dialog>
    </>
  )

}