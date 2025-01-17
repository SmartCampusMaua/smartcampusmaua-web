"use client";

import Head from 'next/head';
import DashboardLayout from "@/app/gms/components/DashboardLayout";
import { useState, useEffect } from 'react';
import { AlarmeValue, GenericSensor } from '@/database/dataTypes';
import { supabase } from '@/database/supabaseClient';



const Actuator = () => {
  const SMARTCAMPUSMAUA_SERVER = `${process.env.NEXT_PUBLIC_SMARTCAMPUSMAUA_SERVER_URL}:${process.env.NEXT_PUBLIC_SMARTCAMPUSMAUA_SERVER_PORT}`;

  const [alarmes, setAlarmes] = useState<AlarmeValue[]>([]);
  const [actionSensor, setActionSensor] = useState<string>("");
  const [actuatorAlarm, setActuatorAlarm] = useState<string>("");
  const [showInfo, setShowInfo] = useState(false); // for info button
  const [sensors] = useState<GenericSensor[]>([]);


  useEffect(() => {
    const getAlarmes = async () => {
      const response = await fetch(`${SMARTCAMPUSMAUA_SERVER}/api/auth/email`);
      const userEmailResponse = await response.json();
      const userEmail = userEmailResponse.displayName;

      const { data: userData, error } = await supabase
        .from('User')
        .select('id')
        .eq('email', userEmail);

      if (error) {
        console.error('Error fetching user data: ', error);
      } else {
        const { data: alarmsData, error } = await supabase
          .from('Alarms')
          .select('id, alarmName, userId, type, local, deveui, trigger, triggerAt, triggerType, alreadyPlayed, actionSensor')
          .eq('userId', userData[0].id);

        if (error) {
          console.error('Error fetching user alarms: ', error);
        }
        else {
          var newAlarmes = [];

          alarmsData.forEach(alarmData => {
            var currentValue;
            sensors.forEach(sensor => {
              if (sensor.tags[0] === alarmData.deveui) {
                function getNumericValue(value) {
                  value += ""; // Fix caso value não seja string
                  return parseFloat(value.split(' ')[0]);
                }
                switch (alarmData.triggerType) {
                  case "boardVoltage": {
                    currentValue = getNumericValue(sensor.fields[0]).toFixed(1);
                    break;
                  }
                  case "batteryVoltage": {
                    currentValue = getNumericValue(sensor.fields[1]).toFixed(1);
                    break;
                  }
                  case "humidity": {
                    currentValue = getNumericValue(sensor.fields[2]).toFixed(1);
                    break;
                  }
                  case "luminosity": {
                    currentValue = getNumericValue(sensor.fields[3]).toFixed(1);
                    break;
                  }
                  case "movement": {
                    currentValue = getNumericValue(sensor.fields[4]).toFixed(1);
                    break;
                  }
                  case "temperature": {
                    currentValue = getNumericValue(sensor.fields[5]).toFixed(1);
                    break;
                  }
                  case "distance": {
                    currentValue = getNumericValue(sensor.fields[1]).toFixed(1);
                    break;
                  }
                  case "counter": {
                    currentValue = getNumericValue(sensor.fields[1]).toFixed(1);
                    break;
                  }
                  case "forwardEnergy": {
                    currentValue = getNumericValue(sensor.fields[1]).toFixed(1);
                    break;
                  }
                  case "reverseEnergy": {
                    currentValue = getNumericValue(sensor.fields[2]).toFixed(1);
                    break;
                  }
                  case "emwAtmPres": {
                    currentValue = getNumericValue(sensor.fields[0]).toFixed(1);
                    break;
                  }
                  case "emwAvgWindSpeed": {
                    currentValue = getNumericValue(sensor.fields[1]).toFixed(1);
                    break;
                  }
                  case "emwGustWindSpeed": {
                    currentValue = getNumericValue(sensor.fields[2]).toFixed(1);
                    break;
                  }
                  case "emwHumidity": {
                    currentValue = getNumericValue(sensor.fields[3]).toFixed(1);
                    break;
                  }
                  case "emwLuminosity": {
                    currentValue = getNumericValue(sensor.fields[4]).toFixed(1);
                    break;
                  }
                  case "emwRainLevel": {
                    currentValue = getNumericValue(sensor.fields[5]).toFixed(1);
                    break;
                  }
                  case "emwSolarRadiation": {
                    currentValue = getNumericValue(sensor.fields[6]).toFixed(1);
                    break;
                  }
                  case "emwTemperature": {
                    currentValue = getNumericValue(sensor.fields[7]).toFixed(1);
                    break;
                  }
                  case "emwUv": {
                    currentValue = getNumericValue(sensor.fields[8]).toFixed(1);
                    break;
                  }
                }

              }
            });
            newAlarmes.push(new AlarmeValue(
              alarmData.id,
              alarmData.alarmName,
              alarmData.userId,
              alarmData.type,
              alarmData.local,
              alarmData.deveui,
              alarmData.trigger,
              alarmData.triggerAt,
              alarmData.triggerType,
              alarmData.alreadyPlayed,
              currentValue,
              alarmData.actionSensor
            ));
          });
          setAlarmes(newAlarmes);
        }
      }
    };

    getAlarmes();
  }, []);


  const handleSprinklersPost = async (actuatorAlarm) => {
    if (actionSensor === "") {
      alert("Selecione uma ação a ser realizada!");
      return;
    }

    if (actuatorAlarm === "") {
      try {
        const action = (actionSensor === "sprinklersOn") ? "AFQ=" : (actionSensor === "sprinklersOff") ? "AKg=" : '';
        console.log(actionSensor)
        const url = `https://smartcampus-k8s.maua.br/api/ingestion/v0.1/IMT/LNS/Command/all`;
        const payload = 
        {
          "application": "SmartLight", // Application Name registered in the corresponding NetworkServer
          "etc": "imt", // NetworkServer to be queued
          "reference": "test-node-red",
          "deviceId": "0004a30b00e94314",
          "confirmed": false,
          "fPort": 100, // lora downlink fPort
          "data": action, // downlink data
          "timestamp": Date.now() * 1000000 // nanoseconds
        };

        console.log(JSON.stringify(payload)); // Print the JSON payload

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Response:", data);
          alert("Post OK!");
        } else {
          console.error("HTTP Error:", response.status);
          alert(`An error occurred: ${response.status}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while making the POST request.");
      }
      return;
    }

    if (actuatorAlarm != "") {
      try {
        handleEditAlarm(actuatorAlarm);
        alert("Post OK!");
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while making the POST request.");
      }
      return;
    }
  };



  const handleEditAlarm = async (actuatorAlarm) => {
    console.log(actuatorAlarm);
    const { error } = await supabase
      .from('Alarms')
      .update({
        actionSensor: actionSensor
      })
      .eq('alarmName', actuatorAlarm);
    if (error) {
      console.error('Erro ao atualizar alarme no banco de dados', error);
    }
  };


  return (
    <DashboardLayout>
      <Head>
        <title>Atuadores</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="grid place-items-center gap-6 p-6"> {/*this is the part that builds the grid if some day we get more cards => "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4" */}
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <div className=" left-0 text-black-400 px-2 text-sm font-semibold">
              Irrigador
            </div>
            <div className="flex items-center justify-center mb-2">
              <svg fill="#000000" width="80px" height="80px" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" >

                <g id="Expanded">
                  <path d="M23,6.083c-2.836,0.477 -5,2.946 -5,5.917c0,2.971 2.164,5.44 5,5.917l-0,0.083c0,1.657 1.343,3 3,3l2,-0l-0,7l-0,0c-0.796,0 -1.559,0.316 -2.121,0.879c-0.563,0.562 -0.879,1.325 -0.879,2.121c0,1.986 0,5.014 0,7c-0,0.796 0.316,1.559 0.879,2.121c0.562,0.563 1.325,0.879 2.121,0.879l-0,0l-0,18l-6.832,0c1.42,-0.746 2.859,-1.829 3.751,-3.375c2.278,-3.946 0.167,-9.467 0.167,-9.467c-0.171,-0.434 -0.619,-0.693 -1.081,-0.623c0,-0 -3.019,0.461 -5.543,2.185c-1.359,-2.395 -3.338,-4.002 -3.338,-4.002c-0.365,-0.291 -0.883,-0.291 -1.248,0c0,0 -1.979,1.607 -3.338,4.001c-2.522,-1.724 -5.543,-2.184 -5.543,-2.184c-0.462,-0.07 -0.91,0.189 -1.081,0.623c0,0 -2.111,5.521 0.167,9.467c0.892,1.546 2.331,2.629 3.751,3.375l-0.582,0c-0.552,-0 -1,0.448 -1,1c-0,0.552 0.448,1 1,1l49.5,0c0.552,-0 1,-0.448 1,-1c-0,-0.552 -0.448,-1 -1,-1l-0.582,0c1.42,-0.746 2.859,-1.829 3.751,-3.375c2.278,-3.946 0.167,-9.467 0.167,-9.467c-0.171,-0.434 -0.619,-0.693 -1.081,-0.623c0,-0 -3.021,0.46 -5.543,2.184c-1.359,-2.394 -3.338,-4.001 -3.338,-4.001c-0.365,-0.291 -0.883,-0.291 -1.248,0c0,0 -1.979,1.607 -3.338,4.002c-2.525,-1.723 -5.543,-2.185 -5.543,-2.185c-0.462,-0.07 -0.91,0.189 -1.081,0.623c0,0 -2.111,5.521 0.167,9.467c0.892,1.546 2.331,2.629 3.751,3.375l-6.832,0l0,-18l0,-0c0.796,-0 1.559,-0.316 2.121,-0.879c0.563,-0.562 0.879,-1.325 0.879,-2.121l-0,-7c0,-0.796 -0.316,-1.559 -0.879,-2.121c-0.562,-0.563 -1.325,-0.879 -2.121,-0.879l0,-0l0,-7l2,0c1.657,-0 3,-1.343 3,-3l-0,-0.083c2.836,-0.477 5,-2.946 5,-5.917c0,-2.971 -2.164,-5.44 -5,-5.917l-0,-0.083c-0,-1.657 -1.343,-3 -3,-3l-12,0c-1.657,0 -3,1.343 -3,3l0,0.083Zm11,34.917l-4,0l0,18c0,0 4,-0 4,-0l0,-18Zm17.944,17.44c0.637,-0.139 1.883,-0.466 3.158,-1.113c1.16,-0.589 2.358,-1.443 3.085,-2.702c0.727,-1.259 0.867,-2.723 0.797,-4.022c-0.063,-1.182 -0.307,-2.238 -0.502,-2.918c-0.998,0.247 -2.73,0.8 -4.182,1.892c0.256,0.767 0.413,1.581 0.413,2.423c-0,2.594 -1.488,4.918 -2.769,6.44Zm-35,0c0.637,-0.139 1.883,-0.466 3.158,-1.113c1.16,-0.589 2.358,-1.443 3.085,-2.702c0.727,-1.259 0.867,-2.723 0.797,-4.022c-0.063,-1.183 -0.307,-2.238 -0.502,-2.919c-0.999,0.247 -2.731,0.799 -4.182,1.893c0.256,0.767 0.413,1.581 0.413,2.423c-0,2.594 -1.488,4.918 -2.769,6.44Zm27.756,-8.863c-1.45,-1.094 -3.183,-1.646 -4.182,-1.893c-0.195,0.681 -0.439,1.736 -0.502,2.919c-0.07,1.299 0.07,2.763 0.797,4.022c0.727,1.259 1.925,2.113 3.085,2.702c1.275,0.647 2.521,0.974 3.158,1.113c-1.281,-1.522 -2.769,-3.846 -2.769,-6.44c0,-0.842 0.157,-1.656 0.413,-2.423Zm-35,0c-1.452,-1.092 -3.184,-1.645 -4.182,-1.892c-0.195,0.68 -0.439,1.736 -0.502,2.918c-0.07,1.299 0.07,2.763 0.797,4.022c0.727,1.259 1.925,2.113 3.085,2.702c1.275,0.647 2.521,0.974 3.158,1.113c-1.281,-1.522 -2.769,-3.846 -2.769,-6.44c0,-0.842 0.157,-1.656 0.413,-2.423Zm39.8,-3.734c0.509,0.493 1.247,1.284 1.892,2.275c0.71,1.09 1.321,2.428 1.321,3.882c-0,1.454 -0.611,2.792 -1.321,3.882c-0.645,0.991 -1.383,1.782 -1.892,2.275c-0.509,-0.493 -1.247,-1.284 -1.892,-2.275c-0.71,-1.09 -1.321,-2.428 -1.321,-3.882c0,-1.454 0.611,-2.792 1.321,-3.882c0.645,-0.991 1.383,-1.782 1.892,-2.275l0,0Zm-35,0c0.509,0.493 1.247,1.284 1.892,2.275c0.71,1.09 1.321,2.428 1.321,3.882c-0,1.454 -0.611,2.792 -1.321,3.882c-0.645,0.991 -1.383,1.782 -1.892,2.275c-0.509,-0.493 -1.247,-1.284 -1.892,-2.275c-0.71,-1.09 -1.321,-2.428 -1.321,-3.882c0,-1.454 0.611,-2.792 1.321,-3.882c0.645,-0.991 1.383,-1.782 1.892,-2.275l0,0Zm22.5,-14.843l-0,7c0,0.265 -0.105,0.52 -0.293,0.707c-0.187,0.188 -0.442,0.293 -0.707,0.293c-0,0 -8,0 -8,0c-0.265,-0 -0.52,-0.105 -0.707,-0.293c-0.188,-0.187 -0.293,-0.442 -0.293,-0.707l0,-7c-0,-0.265 0.105,-0.52 0.293,-0.707c0.187,-0.188 0.442,-0.293 0.707,-0.293c0,0 8,-0 8,-0c0.265,0 0.52,0.105 0.707,0.293c0.188,0.187 0.293,0.442 0.293,0.707Zm-23.491,-3.093c-0.045,1.247 0.009,2.647 0.202,4.215c0.067,0.548 0.566,0.938 1.114,0.871c0.548,-0.068 0.938,-0.567 0.871,-1.115c-0.178,-1.45 -0.23,-2.745 -0.189,-3.899c0.02,-0.552 -0.411,-1.016 -0.963,-1.036c-0.551,-0.02 -1.015,0.412 -1.035,0.964Zm34.984,0.072c0.041,1.154 -0.011,2.449 -0.189,3.899c-0.067,0.548 0.323,1.047 0.871,1.115c0.548,0.067 1.047,-0.323 1.114,-0.871c0.193,-1.568 0.247,-2.968 0.202,-4.215c-0.02,-0.552 -0.484,-0.984 -1.035,-0.964c-0.552,0.02 -0.983,0.484 -0.963,1.036Zm10.507,-0.902c-0.002,1.192 -0.065,2.465 -0.198,3.825c-0.054,0.55 0.348,1.039 0.897,1.093c0.55,0.054 1.039,-0.348 1.093,-0.897c0.14,-1.429 0.206,-2.766 0.208,-4.017c0.001,-0.552 -0.446,-1.001 -0.998,-1.002c-0.552,-0.001 -1.001,0.446 -1.002,0.998Zm-56,0.004c0.002,1.251 0.068,2.588 0.208,4.017c0.054,0.549 0.543,0.951 1.093,0.897c0.549,-0.054 0.951,-0.543 0.897,-1.093c-0.133,-1.36 -0.196,-2.633 -0.198,-3.825c-0.001,-0.552 -0.45,-0.999 -1.002,-0.998c-0.552,0.001 -0.999,0.45 -0.998,1.002Zm50.537,-4.266c0.318,1.587 0.485,3.483 0.414,5.743c-0.017,0.552 0.417,1.014 0.969,1.031c0.551,0.018 1.013,-0.416 1.03,-0.968c0.077,-2.439 -0.109,-4.485 -0.452,-6.199c-0.108,-0.541 -0.635,-0.892 -1.176,-0.784c-0.542,0.108 -0.893,0.635 -0.785,1.177Zm-45.035,-0.393c-0.343,1.714 -0.529,3.76 -0.452,6.199c0.017,0.552 0.479,0.986 1.03,0.968c0.552,-0.017 0.986,-0.479 0.969,-1.031c-0.071,-2.26 0.096,-4.156 0.414,-5.743c0.108,-0.542 -0.243,-1.069 -0.785,-1.177c-0.541,-0.108 -1.068,0.243 -1.176,0.784Zm25.498,5.578l-0,-7c-0,-0 -4,-0 -4,0l0,7l4,-0Zm-16.307,-9.86c0,-0 -2.392,1.344 -3.571,5.586c-0.148,0.532 0.164,1.083 0.695,1.231c0.532,0.148 1.084,-0.164 1.232,-0.695c0.915,-3.292 2.664,-4.402 2.664,-4.402c0.475,-0.281 0.632,-0.895 0.35,-1.37c-0.281,-0.475 -0.895,-0.632 -1.37,-0.35Zm27.594,1.72c-0,0 1.749,1.11 2.664,4.402c0.148,0.531 0.7,0.843 1.232,0.695c0.531,-0.148 0.843,-0.699 0.695,-1.231c-1.179,-4.242 -3.571,-5.586 -3.571,-5.586c-0.475,-0.282 -1.089,-0.125 -1.37,0.35c-0.282,0.475 -0.125,1.089 0.35,1.37Zm12.081,-2.187c0.627,1.518 1.132,3.346 1.406,5.539c0.069,0.548 0.569,0.937 1.117,0.869c0.547,-0.069 0.936,-0.569 0.868,-1.117c-0.3,-2.398 -0.857,-4.395 -1.543,-6.055c-0.21,-0.51 -0.796,-0.753 -1.306,-0.542c-0.51,0.21 -0.753,0.796 -0.542,1.306Zm-52.584,-0.764c-0.686,1.66 -1.243,3.657 -1.543,6.055c-0.068,0.548 0.321,1.048 0.868,1.117c0.548,0.068 1.048,-0.321 1.117,-0.869c0.274,-2.193 0.779,-4.021 1.406,-5.539c0.211,-0.51 -0.032,-1.096 -0.542,-1.306c-0.51,-0.211 -1.096,0.032 -1.306,0.542Zm44.17,-1.47c0,0 1.972,0.784 3.431,3.818c0.239,0.497 0.837,0.707 1.334,0.468c0.498,-0.239 0.707,-0.837 0.468,-1.335c-1.885,-3.921 -4.547,-4.829 -4.547,-4.829c-0.519,-0.19 -1.093,0.078 -1.283,0.596c-0.189,0.519 0.079,1.093 0.597,1.282Zm-34.594,-1.878c0,-0 -2.662,0.908 -4.547,4.829c-0.239,0.498 -0.03,1.096 0.468,1.335c0.497,0.239 1.095,0.029 1.334,-0.468c1.459,-3.034 3.431,-3.818 3.431,-3.818c0.518,-0.189 0.786,-0.763 0.597,-1.282c-0.19,-0.518 -0.764,-0.786 -1.283,-0.596Zm24.64,-7.561l0,12c-0,0.552 -0.448,1 -1,1c-0,0 -12,0 -12,0c-0.552,-0 -1,-0.448 -1,-1c-0,-0 -0,-12 -0,-12c0,-0.552 0.448,-1 1,-1c0,0 12,-0 12,-0c0.552,0 1,0.448 1,1Zm-5.536,8.728c0.109,-0.122 0.085,-0.313 -0.05,-0.404c-0.407,-0.274 -0.894,-0.452 -1.418,-0.452c-0.522,0 -1.008,0.178 -1.415,0.45c-0.136,0.091 -0.159,0.282 -0.05,0.404l1.269,1.414c0.105,0.117 0.288,0.117 0.393,0l1.271,-1.412Zm7.536,-6.602l-0,7.748c1.724,-0.445 3,-2.012 3,-3.874c-0,-1.862 -1.276,-3.429 -3,-3.874Zm-18,0c-1.724,0.445 -3,2.012 -3,3.874c0,1.862 1.276,3.429 3,3.874l0,-7.748Zm28.458,2.815c-0,-0 2.109,0.792 4.084,3.462c0.328,0.443 0.955,0.537 1.398,0.209c0.444,-0.329 0.538,-0.955 0.209,-1.399c-2.402,-3.246 -5.013,-4.154 -5.013,-4.154c-0.52,-0.187 -1.093,0.083 -1.28,0.602c-0.187,0.519 0.083,1.093 0.602,1.28Zm-39.594,-1.882c0,0 -2.611,0.908 -5.013,4.154c-0.329,0.444 -0.235,1.07 0.209,1.399c0.443,0.328 1.07,0.234 1.398,-0.209c1.975,-2.67 4.084,-3.462 4.084,-3.462c0.519,-0.187 0.789,-0.761 0.602,-1.28c-0.187,-0.519 -0.76,-0.789 -1.28,-0.602Zm20.133,3.637c0.855,0 1.644,0.283 2.279,0.759c0.112,0.083 0.267,0.074 0.36,-0.03l0.454,-0.505c0.103,-0.114 0.092,-0.294 -0.029,-0.388c-0.848,-0.659 -1.909,-1.079 -3.064,-1.079c-1.153,0 -2.213,0.419 -3.06,1.076c-0.121,0.093 -0.132,0.274 -0.03,0.388l0.453,0.505c0.094,0.105 0.248,0.114 0.36,0.03c0.635,-0.474 1.423,-0.756 2.277,-0.756Zm-0,-2.453c1.485,0 2.846,0.52 3.92,1.381c0.11,0.089 0.268,0.079 0.363,-0.026l0.409,-0.455c0.101,-0.112 0.091,-0.291 -0.026,-0.387c-1.275,-1.042 -2.896,-1.756 -4.666,-1.756c-1.768,-0 -3.387,0.711 -4.659,1.751c-0.118,0.096 -0.128,0.274 -0.027,0.387l0.408,0.455c0.095,0.105 0.253,0.115 0.363,0.026c1.073,-0.858 2.431,-1.376 3.915,-1.376Z" id="Wifi" />
                </g>

              </svg>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Selecione um alarme para ativar o irrigador: <span className="text-gray-500 text-xs"> (Opcional)</span> 
              </label>
              <div className="flex items-center mt-2">
                <select
                  id="actuatorAlarm"
                  name="actuatorAlarm"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={actuatorAlarm} onChange={(event) => setActuatorAlarm(event.target.value)}
                >
                  <option value=""></option>
                  {alarmes
                  .filter((alarme) => alarme.alarmName) // Filters out alarms with empty alarmName
                  .map((alarme) => (
                    <option key={alarme.alarmName} value={alarme.alarmName}>
                      {alarme.alarmName}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-info-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm0 3a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V7a1 1 0 0 0-1-1z" />
                  </svg>
                </button>
              </div>
                {/* Tooltip/Info Balloon */}
                {showInfo && (
                  <div className=" w-56 mt-2 p-3 bg-white border border-gray-300 rounded-md shadow-lg text-sm text-gray-700">
                    <p>Neste campo, serão exibidos apenas os alarmes que você nomeou anteriormente.</p>
                  </div>
                )}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Selecione a ação que deseja fazer: <span className="text-red-500 text-xs"> *</span>
              </label>
              <div className="flex items-center mt-2">
                <select
                  id="actionSensor"
                  name="actionSensor"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={actionSensor} onChange={(event) => setActionSensor(event.target.value)}
                >
                  <option value=""></option>
                  <option value={"sprinklersOn"}> Ligar</option>
                  <option value={"sprinklersOff"}> Desligar</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => handleSprinklersPost(actuatorAlarm)}
              className="w-full mt-2 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 focus:outline-none"
            >
              {actuatorAlarm === "" ? "Realizar Ação" : "Salvar atuador"}
            </button>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Actuator;
