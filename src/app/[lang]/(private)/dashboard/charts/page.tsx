import { ChartDiv } from './ui/chartDiv'

export default async function Home() {
  return (
    <main className="h-dvh w-dvw bg-stone-100">
      <div className='flex h-[100%] w-[100%] items-center place-content-center flex-col gap-y-2'>
        <ChartDiv chartType='Hydrometer'/>
        <ChartDiv chartType='WeatherStation'/>
        <ChartDiv chartType='WaterTankLevel'/>
        <ChartDiv chartType='SmartLight'/>
        <ChartDiv chartType='GaugePressure'/>
        <ChartDiv chartType='EnergyMeter'/>
      </div>
    </main>
  );
}
