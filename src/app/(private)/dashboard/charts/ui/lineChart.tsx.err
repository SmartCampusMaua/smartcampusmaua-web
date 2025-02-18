'use client'

import { useCallback, useEffect, useRef, useState} from 'react';
import { ChartData, Chart, controllers, scales, elements, plugins, ChartConfiguration } from 'chart.js';
import { getData } from '../actions/getData';
import { ChartConfig } from '../lib/chartConfigs';


export function LineChart({
  chartConfigs,
  fetchUrl
}: {
  chartConfigs: ChartConfig,
  fetchUrl : string
}
) {
  const { datasets, scalesConfig, fields} = chartConfigs;
  const chartRef = useRef<Array<Chart>>(Array.from({ length: scalesConfig.length }));
  const chartRefArray = chartRef.current;
  const [loading, setLoading] = useState(true);
  // const [data, setData] = useState<Array<number>>([]);
  // const [label, setLabel] = useState<Array<number>>([]);
  const canvasRef = useRef<Map<number, HTMLCanvasElement>>();

  //map responsible for managing the canvasrefs 
  
  function getMap() : Map<number, HTMLCanvasElement> {
    if (!canvasRef.current) {
      // Initialize the Map on first usage.
      canvasRef.current = new Map();
    }
    return canvasRef.current;
  }

  useEffect(() => {
    Chart.register(controllers, scales, elements, plugins);
    //adding initial configs and data to the charts 
    const labels: Array<number> = [];
    for (let i = 0; i < chartRefArray.length; i++) {
      const newDataset =  datasets[i] 
      const dataChart: ChartData<"line"> = {
        labels: labels,
        datasets: newDataset 
      }
      const config : ChartConfiguration = {
        type : "line",
        data: dataChart,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: false,
              text: ''
            },
          },
          interaction: {
            mode: 'index',
            intersect: false,
          },
          scales : scalesConfig[i]
        },
      };
      let context;
      const map = getMap();
      
      if (canvasRef && canvasRef.current && map) {
        if(map.has(i)){
          context = map.get(i)!.getContext('2d');
          if (context) {
            chartRef.current[i] = new Chart(context, config);
          }
        }
      }
    }
    return () => {
      for (const item of chartRefArray) {
        item.destroy();
      }
    }
  }, [datasets, scalesConfig, chartRefArray])


  // const getRealtimeData = useCallback((fetchedData: {
  //   data: number,
  //   timestamp: number
  // }) => {
  //   if (canvas.current && canvas.current.data.labels) {
  //     if (canvas.current.data.datasets[0].data.length >= 100) {
  //       for(const dataset of canvas.current.data.datasets){
  //         dataset.data.shift();
  //       }
  //       canvas.current.data.labels.shift();
  //     }
  //     for(const dataset of canvas.current.data.datasets){
  //       dataset.data.push(fetchedData.data);
  //     }
  //     canvas.current.data.labels.push(fetchedData.timestamp);
  //     canvas.current.update('none');
  //   }
  // }, [])

  // //using SSE connection 
  // useEffect(() => {
  //   const API_URL = process.env.NEXT_PUBLIC_API_URL;
  //   const sse = new EventSource(`${API_URL}/message/sse`, { withCredentials: false });
  //   sse.onmessage = e => getRealtimeData(JSON.parse(e.data));
  //   sse.onerror = () => {
  //     sse.close();
  //   }
  //   return () => {
  //     sse.close();
  //   };
  // }, [apiUrl, getRealtimeData])

  const updateCharts = useCallback((timestamp : Array<string>, fieldsData : Map<string,Array<number>>)=>{
    for (let i = 0; i < chartRefArray.length; i++){
      chartRef.current[i].data.labels = timestamp;
      for(const dataset of chartRef.current[i].data.datasets){
        if(dataset.label){
          const newData = fieldsData.get(`${dataset.label[0].toLowerCase()}${dataset.label.substring(1)}`);
          if(newData){
            dataset.data = newData;
          }
        }
      }
      chartRef.current[i].update();
    }
  }, [chartRef, chartRefArray]);
  //using REST API
  useEffect(() => {
    setLoading(true);
    const timestamp : Array<string> = []; 
    const fieldsData = new Map<string, Array<number>>();
    if(fetchUrl){
      getData(fetchUrl).then((json : []) => {
        json.reverse();
        for(const data of json){
          for(const field of fields){
            if(!fieldsData.has(field)){
              fieldsData.set(field, [])
            }
            fieldsData.get(field)?.push(data["fields"][field]);
          }
          //converting data["timestamp"] to ms
          const date = new Date(Number(data["timestamp"]) / 1000000);
          timestamp.push(`${date.getDate()}/${date.getMonth() + 1} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`);
        }
        updateCharts(timestamp,fieldsData);
        setLoading(false);
      }).catch((e) => console.log(e));
    }
  }, [updateCharts,fetchUrl,fields])

  //creating Canvas to the Charts
  return (
    <>
    {loading && <div className='my-10'>Loading...</div>}
      {
        scalesConfig.length > 1 ?
          datasets.map((e, i) => {
            return (
              <canvas className='my-10' ref={(node) => {
                const map = getMap();
                if (node) {
                  map.set(i, node);
                } else {
                  map.delete(i);
                }
              }} key={i} id={`${i}`} />)
          }) : (<canvas className='my-10' ref={(node) => {
            const map = getMap();
            if (node) {
              map.set(0, node);
            } else {
              map.delete(0);
            }
          }}></canvas>)
      }
    </>
  )
}