"use client";

import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import DashboardLayout from "../components/DashboardLayout";
import Head from "next/head";
import { GenericSensor } from "@/database/dataTypes";
import { supabase } from "@/database/supabaseClient";
import { fetchSensors } from "@/database/timeseries";

export default function Home() {
  const [sensors, setSensors] = useState<GenericSensor[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [interval, setInterval] = useState(30); // Estado para armazenar o intervalo de dias na exportação (.csv) de um sensor
  const [exportInfoPopupOpen, setExportInfoPopupOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<GenericSensor>();

  const broker = "wss://mqtt.maua.br:8084";
  const options = {
    username: "PUBLIC",
    password: "public",
  };

  useEffect(() => {
    const client = mqtt.connect(broker, options);

    client.on("connect", () => {
      client.subscribe("IMT/EVSE/MeterValues/+/up/imt", (err) => {
        if (err) {
          console.error(`Erro na conexão: ${broker} --> ${err}`);
        } else {
          console.log(`Conectado ao broker: ${broker}`);
        }
      });
    });

    client.on("message", async (topic, message) => {
      try {
        const jsonObject = JSON.parse(message.toString());
    
        if (jsonObject.name === "MeterValues" && jsonObject.tags.deviceType === "EVSE") {
          const { forwardEnergy } = jsonObject.fields;
          const { chargePointId, connectorId, deviceId } = jsonObject.tags;
          const timestamp = new Date(jsonObject.timestamp);
    
          const evse = new GenericSensor(
            chargePointId, // Name
            "EVSE", // Type
            [forwardEnergy], // Fields
            [chargePointId, connectorId, deviceId], // Tags
            connectorId.replace(/"/g, "").trim() === "1" ? "Bloco B" : (connectorId.replace(/"/g, "").trim() === "2" ? "Centro Acadêmico" : 'IMT'), // Local
            timestamp
          );
    
          setSensors((prevData) => {
            const existingEvse = prevData.find((item) => item.tags.includes(evse.tags[2])); // Match by deviceId
            if (existingEvse) {
              return prevData.map((item) =>
                item.tags.includes(evse.tags[2]) ? { ...item, fields: evse.fields, timestamp: evse.timestamp } : item
              );
            } else {
              return [...prevData, evse];
            }
          });
        }
      } catch (error) {
        console.error("Erro ao processar mensagem MQTT:", error);
      }
    });

  return () => {
    client.end();
  };
}, []);


  const getMaxDate = () => {
    const today = new Date();
    today.setDate(today.getDate() - 30);
    return today.toISOString().split("T")[0];
  };

  const calculateMinutesInterval = (date: string) => {
    const selectedDate = new Date(date);
    const today = new Date();
    const diffTime = today.getTime() - selectedDate.getTime();
    return Math.ceil(diffTime / (1000 * 60));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    const interval = calculateMinutesInterval(selected);

    if (interval > 43200 || interval <= 0 || Number.isNaN(interval)) {
      alert("Por favor, selecione uma data dentro dos últimos 30 dias ou no máximo 43200 minutos.");
      setSelectedDate("");
      setInterval(30);
    } else {
      setSelectedDate(selected);
      setInterval(interval);
    }
  };

  const handleExportSensor = async (id, interval) => { // by now we are only exporting MeterValue data!! because there isn't any data on the others 
    try {
      const urls = [
        `https://smartcampus-k8s.maua.br/api/timeseries/v0.3/IMT/EVSE/MeterValues/deviceId/${id}?interval=${interval}`,
        `https://smartcampus-k8s.maua.br/api/timeseries/v0.3/IMT/EVSE/StatusNotification/deviceId/${id}?interval=${interval}`,
        `https://smartcampus-k8s.maua.br/api/timeseries/v0.3/IMT/EVSE/StartTransaction/deviceId/${id}?interval=${interval}`,
        `https://smartcampus-k8s.maua.br/api/timeseries/v0.3/IMT/EVSE/StopTransaction/deviceId/${id}?interval=${interval}`,
      ];

      const fetchData = async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            console.warn(`No data for URL: ${url}`);
            return null;
          }
          return await response.json();
        } catch (error) {
          console.warn(`Error fetching URL: ${url} - ${error.message}`);
          return null;
        }
      };

      const allDataResponses = await Promise.all(urls.map((url) => fetchData(url)));

      const validData = allDataResponses.filter((data) => data !== null);

      const emptyUrls = urls.filter((_, index) => allDataResponses[index] === null);
      if (emptyUrls.length > 0) {
        console.log(`No data available for the following URLs:`, emptyUrls);
      }

      const combinedData = validData.flat();

      if (combinedData.length === 0) {
        console.warn("No valid data to process.");
        return;
      }

      const jsonToCsv = (json) => {
        if (!Array.isArray(json) || json.length === 0) {
          throw new Error("Invalid or empty JSON data");
        }

        const extractKeys = (obj, prefix = "") =>
          Object.keys(obj).reduce((keys, key) => {
            const value = obj[key];
            if (typeof value === "object" && value !== null) {
              return keys.concat(extractKeys(value, `${prefix}${key}.`));
            }
            return keys.concat(`${prefix}${key}`);
          }, []);

        const headers = [...new Set(json.flatMap((item) => extractKeys(item)))];

        const rows = json
          .map((row) =>
            headers
              .map((header) => {
                const keys = header.split(".");
                let value = row;

                for (const key of keys) {
                  value = value?.[key] ?? "";
                }
                return typeof value === "object" ? "" : value;
              })
              .join(",")
          )
          .join("\n");

        return `${headers.join(",")}\n${rows}`;
      };

      const csvData = jsonToCsv(combinedData);

      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

      const link = document.createElement("a");

      const urlBlob = URL.createObjectURL(blob);

      link.href = urlBlob;
      link.download = `EVSE-${id}-${interval}_minutes.csv`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("Error processing data:", error);
    }
  };

  const [alarmInsertAttempt, setAlarmInsertAttempt] = useState<boolean>(false);
  const SMARTCAMPUSMAUA_SERVER = `${process.env.NEXT_PUBLIC_SMARTCAMPUSMAUA_SERVER_URL}:${process.env.NEXT_PUBLIC_SMARTCAMPUSMAUA_SERVER_PORT}`;
  const [triggerType, setTriggerType] = useState('');
  const [triggerAt, setTriggerAt] = useState<string>();
  const [alarmName, setAlarmName] = useState<string>('');
  const [alarmSensor, setAlarmSensor] = useState<GenericSensor>();
  const [trigger, setTrigger] = useState<string>();
  const [alarmPopupOpen, setAlarmPopupOpen] = useState(false);

  const handleNewAlarm = async () => {
    setAlarmInsertAttempt(true);
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
      if (triggerType !== "" && triggerAt !== "") {
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
          var alarmAlreadyExists = false

          if (alarmName && alarmName.trim() !== "") {
            const { data: existingAlarms, error } = await supabase
              .from('Alarms')
              .select('alarmName')
              .eq('userId', userData[0].id)

            existingAlarms.forEach(existingAlarm => {
              if (existingAlarm.alarmName === alarmName) {
                alarmAlreadyExists = true
                alert("Você já possuí um alarme com o nome escolhido")
              }
            });
          }
          if (!alarmAlreadyExists) {
            if (triggerType === "status") {
              const { error } = await supabase
                .from('Alarms')
                .insert({
                  userId: userData[0].id,
                  type: "Evse",
                  local: alarmSensor.local,
                  deveui: alarmSensor.tags[2],
                  trigger: '',
                  triggerAt: '',
                  triggerType: triggerType,
                  alreadyPlayed: false,
                  // actionSensor: actionSensor, // acho que não precisa de ação por enquanto.
                  alarmName: alarmName
                })
              if (error) {
                console.error('Erro ao atualizar alarme no banco de dados', error);
              } else {
                setAlarmInsertAttempt(false);
                setAlarmPopupOpen(false);
              }
            } else {
              const { error } = await supabase
                .from('Alarms')
                .insert({
                  userId: userData[0].id,
                  type: "Evse",
                  local: alarmSensor.local,
                  deveui: alarmSensor.tags[2],
                  trigger: trigger,
                  triggerAt: triggerAt,
                  triggerType: triggerType,
                  alreadyPlayed: false,
                  // actionSensor: actionSensor, // acho que não precisa de ação por enquanto.
                  alarmName: alarmName
                })
              if (error) {
                console.error('Erro ao atualizar alarme no banco de dados', error);
              } else {
                setAlarmInsertAttempt(false);
                setAlarmPopupOpen(false);
              }
            }
          }
        }
      };
    }
  }

  return (
    <DashboardLayout>
      {exportInfoPopupOpen ? (
        <div className="flex flex-col w-full">
          <div className="m-4">
            <button
              onClick={() => setExportInfoPopupOpen(!exportInfoPopupOpen)}
              className="m-2 bg-red-500 hover:bg-red-700 text-white text-2xl font-bold py-3 px-6 rounded">
              Voltar
            </button>
          </div>
          <div className="container max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 justify-items-center">
            <div className="m-2 flex justify-center h-fit max-w-[24rem] border border-gray-400 bg-gray-50 rounded">
              <div className="m-2">
                <p className="font-bold text-3xl text-center">Sensor Selecionado</p>
                <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300 text-center">
                  {selectedSensor.tags[1].replace(/"/g, "").trim() === "0" ? "Charging Station" : "Charging Point"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                  Local: {selectedSensor.local}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                  DeviceID: {selectedSensor.tags[2]}
                </p>
                <ul className="text-sm space-y-2">
                  {
                    <ul>
                      <li>
                        <strong>ForwardEnergy: </strong>{selectedSensor.fields[0]}
                      </li>
                    </ul>
                  }
                  {selectedSensor.timestamp && (
                    <li>
                      <strong>Atualizado por último:</strong> {new Date(Number(selectedSensor.timestamp) * 1000).toLocaleString()}
                    </li>
                  )}
                </ul>
              </div>
            </div>
            {/* Field to define the time interval */}
            <div className="m-2 flex justify-center h-fit max-w-[24rem] bg-grey-500 rounded">

              <div className="m-2">
                <label htmlFor="dateInput" className="text-black font-bold">
                  Selecione uma data (máximo: últimos 30 dias):
                </label>
                <input
                  type="date"
                  id="dateInput"
                  value={selectedDate}
                  onChange={handleDateChange}
                  max={new Date().toISOString().split("T")[0]}
                  min={getMaxDate()}
                  className="py-2 px-4 rounded border"
                />
                <label htmlFor="minutesInput" className="text-black font-bold mt-4 block">
                  Escolha um intervalo de tempo em minutos:
                </label>
                <input
                  type="number"
                  id="minutesInput"
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  min={1}
                  max={43200}
                  className="py-2 px-4 rounded border w-full"
                  placeholder="Digite o período em minutos"
                />
                {interval !== null && (
                  <p className="text-sm text-gray-600 mt-2">
                    Você selecionou um período de {interval} minutos.<br />Aproximadamente {Math.round(interval / 1440)} dias.
                  </p>
                )}
              </div>

              <div className="m-2">
                <button
                  onClick={() => {
                    setExportInfoPopupOpen(false);
                    handleExportSensor(selectedSensor.tags[2], interval);
                  }}
                  className="bg-left text-white font-bold py-2 px-4 rounded border border-green-400 bg-green-400 hover:bg-green-700 "
                >
                  Exportar .csv
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {alarmPopupOpen ? (
        <div className="flex flex-col w-full">
          <div className="m-4">
            <button
              onClick={() => setAlarmPopupOpen(!alarmPopupOpen)}
              className="m-2 bg-red-500 hover:bg-red-700 text-white text-2xl font-bold py-3 px-6 rounded">
              Voltar
            </button>
          </div>
          <div className="container max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 justify-items-center">
            <div className="m-2 flex justify-center h-fit max-w-[24rem] border border-gray-400 bg-gray-50 rounded">
              <div className="m-2">
                <p className="font-bold text-3xl text-center">Sensor Selecionado</p>
                <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300 text-center">
                  {alarmSensor.tags[1].replace(/"/g, "").trim() === "0" ? "Charging Station" : "Charging Point"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                  Local: {alarmSensor.local}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                  DEVICEID: {alarmSensor.tags[2]}
                </p>
                <ul className="text-sm space-y-2">
                  {
                    (
                      <ul>
                        <li>
                          <strong>ForwardEnergy: </strong>{alarmSensor.fields[0]}
                        </li>
                        <li>
                          <strong>Type: </strong>{alarmSensor.tags[1].replace(/"/g, "").trim() === "0" ? "Charging Station" : "Charging Point"}
                        </li>
                      </ul>
                    )
                  }
                  {alarmSensor.timestamp && (
                    <li>
                      <strong>Atualizado por último:</strong> {new Date(Number(alarmSensor.timestamp) * 1000).toLocaleString()}
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className="m-2 flex flex-col justify-center h-fit max-w-[24rem] border border-gray-400 bg-gray-50 rounded">
              <div className="m-2">
                <p className="font-bold text-3xl text-center m-2">Criar Alarme</p>
                <p>
                  Digite um nome para o seu alarme:
                </p>
                <input type="text" id="alarmName" className="mx-1 w-32 border border-black rounded p-1 text-lg m-2" placeholder="Nome" value={alarmName} onChange={(event) => setAlarmName(event.target.value)} />
                <p>
                  Escolha o campo para o alarme
                </p>
                {
                  <select className="border border-black rounded p-1 text-lg m-2" value={triggerType} onChange={(event) => setTriggerType(event.target.value)}>
                    <option value={""}></option>
                    {/* <option value={"forwardEnergy"}> forwardEnergy</option> */}
                    <option value={"status"}> status</option>
                  </select>
                }

                {(triggerType === "status" || triggerType === "") ? (
                  triggerType === "status" ?

                    <div className="bg-blue-50 text-gray-800 p-2 rounded-lg text-sm">
                      <p>Tocar quando o carregador parar de ser utilizado</p>
                    </div> : <div></div>
                ) : (
                  <div>
                    <p className="mt-2">Quando tocar</p>
                    <select className="border border-black rounded p-1 text-lg" value={triggerAt} onChange={(event) => setTriggerAt(event.target.value)}>
                      <option value={""}></option>
                      <option value={"higher"}> Acima de</option>
                      <option value={"lower"}> Abaixo de</option>
                    </select>
                    <input type="text" id="alarmTrigger" className="mx-1 w-32 border border-black rounded p-1 text-lg" placeholder="Valor" required value={trigger} onChange={(event) => setTrigger(event.target.value)} />
                  </div>
                )}
                {/* <p className="mt-2">Ação a realizar ao tocar o alarme</p>
                <div className="flex">
                  <select className="border border-black rounded p-1 text-lg" value={actionSensor} onChange={(event) => setActionSensor(event.target.value)}>
                    <option value={""}></option>
                    <option value={"sprinklersOn"}> Acionar Irrigadores</option>
                    <option value={"sprinklersOff"}> Desligar Irrigadores</option>
                  </select>
                </div> */}
              </div>
              <button
                onClick={handleNewAlarm}
                className="m-2 bg-blue-500 text-white px-3 py-1 rounded h-8 text-lg font-bold hover:bg-blue-700"
              >Criar alarme</button>
            </div>
          </div>
          <div className="mt-4 text-5xl text-center font-bold">
            {triggerType == "" && alarmInsertAttempt ? (
              <p className="text-red-500">Insira todos os dados</p>
            ) : (
              <p></p>
            )
            }
          </div>
        </div>
      ) : null}

      {!exportInfoPopupOpen && !alarmPopupOpen && (
        <div>
          <Head>
            <title>Carregadores EVSE</title>
          </Head>
          <main className="p-4 bg-white">
            <h1 className="text-3xl font-bold text-center mb-8">
              Dados dos Carregadores EVSE
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sensors.length > 0 ? (
                sensors.map((evse, index) => (
                  <div
                    key={evse.tags[2]}
                    className="bg-gray-100 rounded-lg shadow-md p-4 border border-gray-300"
                  >
                    <h2 className="text-xl font-semibold mb-2">
                      Dispositivo: {evse.tags[2]}
                    </h2>
                    <p><strong>Forward Energy:</strong> {parseFloat(evse.fields[0]).toFixed(4)} KWh</p>
                    <p><strong>Local: </strong> {evse.local}</p>
                    <p><strong>Type:</strong>{evse.tags[1].replace(/"/g, "").trim() === "0" ? " Charging Station" : " Charging Point"}</p>

                    <p><strong>Atualizado por último:</strong> {new Date(Number(evse.timestamp) * 1000).toLocaleString()}</p>
                    <div className="flex mt-2 space-x-2">
                      <button
                        onClick={() => {
                          setExportInfoPopupOpen(true);
                          setSelectedSensor(evse);
                        }}
                        className="bg-blue-500 text-white font-bold py-3 px-6 rounded hover:bg-blue-600"
                      >
                        Exportar .csv
                      </button>
                      {evse.local !== "IMT" && (
                        <button
                          onClick={() => {
                            setAlarmPopupOpen(!alarmPopupOpen);
                            setAlarmSensor(evse);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Adicionar Alarme
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 rounded-lg shadow-md p-4 border border-gray-300 animate-pulse"
                    >
                      <div className="h-6  rounded w-3/4 mb-4 font-bold">Carregando...</div>
                      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </main>
        </div>
      )}
    </DashboardLayout>
  );
}