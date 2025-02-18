export type ChartProps = {
  chartType: "EnergyMeter" | "GaugePressure" | "Hydrometer" | "SmartLight" | "WaterTankLevel" | "WeatherStation"
}

export interface DataSet{
  label: string;
  fill: boolean;
  backgroundColor: string;
  borderColor: string;
  data: number[];
  yAxisID?: string;
}


export interface ChartConfig {
  devicesId: Array<string>,
  apiUrl: string,
  datasets: Array<Array<DataSet>>,
  scalesConfig:{
    x: {
      display: boolean;
      title: {
          display: boolean;
          text: string;
      };
  },
  y: {
      display: boolean;
      title: {
          display: boolean;
          text: string;
      };
      type: "linear";
      position: "left" | "right";
      min? : number;
      max? : number;
  },
  y1?: {
      display: boolean;
      title: {
          display: boolean;
          text: string;
      };
      type: "linear";
      position: "left" | "right";
      min? : number;
      max? : number;
      grid: {
        drawOnChartArea: boolean,
      };
  }}[],
  fields : Array<string>
}

export const chartConfigs : {
  Hydrometer : ChartConfig,
  GaugePressure : ChartConfig,
  WaterTankLevel : ChartConfig,
  WeatherStation : ChartConfig,
  EnergyMeter : ChartConfig,
  SmartLight : ChartConfig
} = {
  Hydrometer: {
    devicesId: [
      "0004a30b00e986c1",
      "0004a30b00e932c4"
    ],
    apiUrl: `${process.env.NEXT_PUBLIC_SMARTCAMPUS_TIMESERIES_API}/Hydrometer/`,
    fields: [
      "counter", "boardVoltage"
    ],
    datasets: [[
      {
        label: 'Counter',
        fill: false,
        backgroundColor: 'red',
        borderColor: 'red',
        data: [],
        yAxisID: 'y',
      }, {
        label: 'BoardVoltage',
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'blue',
        data: [],
        yAxisID: 'y1',
      }]
    ],
    scalesConfig: [{
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Counter',
        },
        type: 'linear',
        position: 'left',
      },
      y1: {
        display: true,
        title: {
          display: true,
          text: 'BoardVoltage',
        },
        type: 'linear',
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        min : 2.5,
        max : 4.5
      }
    }]
  },
  GaugePressure: {
    devicesId: [
      "0004a30b00e9bed7"
    ],
    apiUrl: `${process.env.NEXT_PUBLIC_SMARTCAMPUS_TIMESERIES_API}/GaugePressure/`,
    fields: [
      "inletPressure", "outletPressure", "boardVoltage"
    ],
    datasets: [[
      {
        label: 'InletPressure',
        fill: false,
        backgroundColor: 'red',
        borderColor: 'red',
        data: [],
        yAxisID : 'y'
      }, {
        label: 'OutletPressure',
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'blue',
        data: [],
        yAxisID : 'y1'
      }],
      [
        {
          label: 'BoardVoltage',
          fill: false,
          backgroundColor: 'red',
          borderColor: 'red',
          data: [],
        }
      ]
    ],
    scalesConfig : [
      {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Time'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'InletPressure',
          },
          type: 'linear',
          position: 'left',
        },
        y1: {
          display: true,
          title: {
            display: true,
            text: 'OutletPressure',
          },
          type: 'linear',
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
        }
      },
      {
        x : {
          display: true,
          title: {
            display: true,
            text: 'Time'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'BoardVoltage',
          },
          type: 'linear',
          position: 'left',
          min : 2.5,
          max : 4.5
        }
      }
    ]
    
  },
  WaterTankLevel: {
    devicesId: [
      "0004a30b00e93221",
      "0004a30b00e9e9d6",
      "0004a30b00e95a6b",
      "0004a30b00e9d86b",
      "0004a30b00e97b33",
      "0004a30b00e9d3b3",
      "0004a30b00e942f9",
      "0004a30b00e999b5"
    ],
    apiUrl: `${process.env.NEXT_PUBLIC_SMARTCAMPUS_TIMESERIES_API}/WaterTankLevel/`,
    fields: [
      "distance", "boardVoltage"
    ],
    datasets: [[
      {
        label: 'Distance',
        fill: false,
        backgroundColor: 'red',
        borderColor: 'red',
        data: [],
        yAxisID : 'y'
      }, {
        label: 'BoardVoltage',
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'blue',
        data: [],
        yAxisID : 'y1'
      }]
    ],
    scalesConfig : [
    {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Distance',
        },
        type: 'linear',
        position: 'left',
      },
      y1: {
        display: true,
        title: {
          display: true,
          text: 'BoardVoltage',
        },
        type: 'linear',
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        min : 2.5,
        max : 4.5
      }
    }
  ]
  },
  EnergyMeter: {
    devicesId: [
      "0004a30b00e99979",
      "0004a30b00e9307b",
      "0004a30b00e96514",
      "0004a30b00e964ee",
      "0004a30b00e9a19c"
    ],
    apiUrl: `${process.env.NEXT_PUBLIC_SMARTCAMPUS_TIMESERIES_API}/EnergyMeter/`,
    fields: [
      "forwardEnergy", "reverseEnergy", "boardVoltage"
    ],
    datasets: [
      [
        {
          label: 'ForwardEnergy',
          fill: false,
          backgroundColor: 'red',
          borderColor: 'red',
          data: [],
          yAxisID : 'y'
        }, {
          label: 'ReverseEnergy',
          fill: false,
          backgroundColor: 'blue',
          borderColor: 'blue',
          data: [],
          yAxisID : 'y1'
        }
      ],
      [
        {
          label: 'BoardVoltage',
          fill: false,
          backgroundColor: 'red',
          borderColor: 'red',
          data: [],
        }
      ]
    ],
    scalesConfig : [
      {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Time'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'ForwardEnergy',
          },
          type: 'linear',
          position: 'left',
        },
        y1: {
          display: true,
          title: {
            display: true,
            text: 'ReverseEnergy',
          },
          type: 'linear',
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
        }
      },
      {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Time'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'BoardVoltage',
          },
          type: 'linear',
          position: 'left',
          min : 2.5,
          max : 4.5
        }
      }
    ]
  },
  WeatherStation: {
    devicesId: [
      "f803320100028a5f",
      "f803320100030977"
    ],
    apiUrl: `${process.env.NEXT_PUBLIC_SMARTCAMPUS_TIMESERIES_API}/WeatherStation/`,
    fields: [

    ],
    datasets: [[
      {
        label: '',
        fill: false,
        backgroundColor: 'red',
        borderColor: 'red',
        data: [],
        yAxisID : 'y'
      }, {
        label: '',
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'blue',
        data: [],
        yAxisID : 'y1'
      }]
    ],
    scalesConfig : [
      {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Time'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: '',
          },
          type: 'linear',
          position: 'left',
        },
        y1: {
          display: true,
          title: {
            display: true,
            text: '',
          },
          type: 'linear',
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
        }
      }
    ]
  },
  SmartLight: {
    devicesId: [
      "0004a30b00e94314",
      "0004a30b00e942f2",
      "0004a30b00e9b7ce",
      "0004a30b00e9305d",
      "0004a30b00e9e9ce",
      "0004a30b00e94a99",
      "0004a30b00e94314",
      "0004a30b00e96768",
      "0004a30b00e95a73"

    ],
    apiUrl: `${process.env.NEXT_PUBLIC_SMARTCAMPUS_TIMESERIES_API}/SmartLight/`,
    fields: [
      "temperature", "humidity", "movement", "luminosity", "batteryVoltage", "boardVoltage"
    ],
    datasets: [
      [
        {
          label: 'Temperature',
          fill: false,
          backgroundColor: 'red',
          borderColor: 'red',
          data: [],
          yAxisID : 'y'
        }, {
          label: 'Humidity',
          fill: false,
          backgroundColor: 'blue',
          borderColor: 'blue',
          data: [],
          yAxisID : 'y1',
        }
      ],
      [{
        label: 'Movement',
        fill: false,
        backgroundColor: 'red',
        borderColor: 'red',
        data: [],
        yAxisID : 'y'
      }, {
        label: 'Luminosity',
        fill: false,
        backgroundColor: 'yellow',
        borderColor: 'yellow',
        data: [],
        yAxisID : 'y1'
      }],
      [{
        label: 'BatteryVoltage',
        fill: false,
        backgroundColor: 'red',
        borderColor: 'red',
        data: [],
        yAxisID : 'y'
      }, {
        label: 'BoardVoltage',
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'blue',
        data: [],
        yAxisID : 'y1'
      }]
    ],
    scalesConfig: [{
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Temperature',
        },
        type: 'linear',
        position: 'left',
      },
      y1: {
        display: true,
        title: {
          display: true,
          text: 'Humidity',
        },
        type: 'linear',
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      }
    },
    {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Movement',
        },
        type: 'linear',
        position: 'left',
      },
      y1: {
        display: true,
        title: {
          display: true,
          text: 'Luminosity',
        },
        type: 'linear',
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      }
    },
    {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'BatteryVoltage',
        },
        type: 'linear',
        position: 'left',
      },
      y1: {
        display: true,
        title: {
          display: true,
          text: 'BoardVoltage',
        },
        type: 'linear',
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        min : 2.5,
        max : 4.5
      }
    }]
  }
}

// async function getDevicesId() {
//   const keys = Object.keys(chartConfigs);
//   const fetchDevices : Map<string,Promise<Response>> = new Map();
//   for (const item of keys) {
//     fetchDevices.set(item,fetch(`${chartConfigs[item].apiUrl}all?interval=30`,
//       {
//         method: "GET",
//         mode : "no-cors"
//       }
//     )
//   )
    
//   }
//   Promise.all(fetchDevices.values()).then((values)=>
//     values.map(async (e) =>{
//       await e.json();
//     })
//   );
//   return fetchDevices;
// }
// const devicesId = getDevicesId();
