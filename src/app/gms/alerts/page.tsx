"use client";

import Head from 'next/head';
import DashboardLayout from "@/app/gms/components/DashboardLayout";
import { useState, useEffect } from 'react';
import { GenericSensor, AlarmeValue, AlarmeHistory } from '@/database/dataTypes';
import { fetchSensorByDEVEUI, fetchSensors } from '@/database/timeseries';
import { formatDistanceToNow } from 'date-fns';

import { supabase } from '@/database/supabaseClient';
import { ptBR } from 'date-fns/locale';

const Alarmes = () => {
  const SMARTCAMPUSMAUA_SERVER = `${process.env.NEXT_PUBLIC_SMARTCAMPUSMAUA_SERVER_URL}:${process.env.NEXT_PUBLIC_SMARTCAMPUSMAUA_SERVER_PORT}`;

  const [alarmes, setAlarmes] = useState<AlarmeValue[]>([]);
  const [alarmEditPopupOpen, setAlarmEditPopupOpen] = useState(false);
  const [triggerType, setTriggerType] = useState('boardVoltage');
  const [trigger, setTrigger] = useState<string>('0');
  const [triggerAt, setTriggerAt] = useState<string>('higher');
  const [actionSensor, setActionSensor] = useState<string>();
  const [alarmName, setAlarmName] = useState<string>()
  const [sensors, setSensors] = useState<GenericSensor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAlarme, setSelectedAlarme] = useState<AlarmeValue>();
  const [sendingNewAlarm, setSendingNewAlarm] = useState<boolean>(false);
  const [selectedSensor, setSelectedSensor] = useState<GenericSensor | null>(null);

  useEffect(() => {
    async function getSensors() {
      setSensors(await fetchSensors());
      setLoading(false);
    }

    getSensors();
  }, []);
  const SensorDetails = ({ sensor }: { sensor: GenericSensor | null }) => {
    if (!sensor) {
      return <p className="text-center text-gray-500">Nenhum sensor selecionado</p>;
    }

    return (
      <div className="m-4 p-4 border border-gray-400 bg-gray-50 rounded">
        <h2 className="text-2xl font-bold text-center mb-4">{sensor.name || "Nome não disponível"}</h2>
        <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300 text-center">{sensor.type || "Nome não disponível"}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
          Local: {sensor.local}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
          DEVEUI: {sensor.tags[0]}
        </p>
        <ul className="text-sm space-y-2">
          {
            sensor.type === "SmartLight" && sensor.fields[0] !== "Sensor Offline" ? (
              <ul>
                <li>
                  <strong>BatteryVoltage: </strong>{sensor.fields[0]}
                </li>
                <li>
                  <strong>BoardVoltage: </strong>{sensor.fields[1]}
                </li>
                <li>
                  <strong>Humidade: </strong>{sensor.fields[2]}
                </li>
                <li>
                  <strong>Luminosidade: </strong>{sensor.fields[3]}
                </li>
                <li>
                  <strong>Movement: </strong>{sensor.fields[4]}
                </li>
                <li>
                  <strong>Temperatura: </strong>{sensor.fields[5]}
                </li>
              </ul>
            ) : sensor.type === "WaterTankLevel" && sensor.fields[0] !== "Sensor Offline" ? (
              <ul>
                <li>
                  <strong>boardVoltage: </strong>{sensor.fields[0]}
                </li>
                <li>
                  <strong>Distância: </strong>{sensor.fields[1]}
                </li>
              </ul>
            ) : sensor.type === "Hydrometer" && sensor.fields[0] !== "Sensor Offline" ? (
              <ul>
                <li>
                  <strong>boardVoltage: </strong>{sensor.fields[0]}
                </li>
                <li>
                  <strong>Counter: </strong>{sensor.fields[1]}
                </li>
              </ul>
            ) : sensor.type === "EnergyMeter" && sensor.fields[0] !== "Sensor Offline" ? (
              <ul>
                <li>
                  <strong>boardVoltage: </strong>{sensor.fields[0]}
                </li>
                <li>
                  <strong>ForwardEnergy: </strong>{sensor.fields[1]}
                </li>
                <li>
                  <strong>ReverseEnergy: </strong>{sensor.fields[2]}
                </li>
              </ul>
            ) : sensor.type === "WeatherStation" && sensor.fields[0] !== "Sensor Offline" ? (
              <ul>
                <li>
                  <strong>Pressão Atmosférica: </strong>{sensor.fields[0]}
                </li>
                <li>
                  <strong>Velocidade do Vento: </strong>{sensor.fields[1]}
                </li>
                <li>
                  <strong>Velocidade Rajada de Vento: </strong>{sensor.fields[2]}
                </li>
                <li>
                  <strong>Humidade: </strong>{sensor.fields[3]}
                </li>
                <li>
                  <strong>Luminosidade: </strong>{sensor.fields[4]}
                </li>
                <li>
                  <strong>Nivel de Chuva: </strong>{sensor.fields[5]}
                </li>
                <li>
                  <strong>Radiação Solar: </strong>{sensor.fields[6]}
                </li>
                <li>
                  <strong>Temperatura: </strong>{sensor.fields[7]}
                </li>
                <li>
                  <strong>Índice UV: </strong>{sensor.fields[8]}
                </li>
              </ul>
            ) : sensor.fields[0] === "Sensor Offline" ? (
              <ul>
                <li>
                  <strong>Sensor Offline</strong>
                </li>
              </ul>
            ) : (
              <p></p>
            )
          }
          <li><strong>Última atualização:</strong> {formatDistanceToNow(new Date(sensor.timestamp), { locale: ptBR })}</li>
        </ul>
      </div>
    );
  };

  async function deleteAlarme(alarme) {
    const { data, error } = await supabase
      .from("Alarms")
      .delete()
      .eq('id', alarme.id);

    if (error) {
      console.error('Error deleting alarm:', error);
      return { success: false, error };
    }

    setAlarmes(alarmes.filter((item) => item.id !== alarme.id));
  };

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
                  case "solenoid1": {
                    currentValue = sensor.fields[2];
                    break;
                  }
                  case "solenoid2": {
                    currentValue = sensor.fields[3];
                    break;
                  }
                  case "solenoid3": {
                    currentValue = sensor.fields[4];
                    break;
                  }
                  case "soilMoistureDepthLevel1": {
                    currentValue = getNumericValue(sensor.fields[1]);
                    break;
                  }
                  case "soilMoistureDepthLevel2": {
                    currentValue = getNumericValue(sensor.fields[2]);
                    break;
                  }
                  case "soilMoistureDepthLevel3": {
                    currentValue = getNumericValue(sensor.fields[3]);
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
      setSendingNewAlarm(false);
    };

    getAlarmes();
  }, [sensors, sendingNewAlarm]);

  const openEditPopup = (alarme: AlarmeValue) => {
    const sensor = sensors.find((sensor) => sensor.tags.includes(alarme.deveui));
    setSelectedSensor(sensor || null);
    const newSelectedAlarme = new AlarmeValue(
      alarme.id,
      alarme.alarmName,
      alarme.userId,
      alarme.type,
      alarme.local,
      alarme.deveui,
      alarme.trigger,
      alarme.triggerAt,
      alarme.triggerType,
      alarme.alreadyPlayed,
      alarme.currentValue,
      alarme.actionSensor
    );
    setSelectedAlarme(newSelectedAlarme);
    setAlarmName(newSelectedAlarme.alarmName);
    setTrigger(newSelectedAlarme.trigger);
    setTriggerAt(newSelectedAlarme.triggerAt);
    setTriggerType(newSelectedAlarme.triggerType);
    setActionSensor(newSelectedAlarme.actionSensor);
    setAlarmEditPopupOpen(true);
  };

  const handleEditAlarm = async (editedAlarme: AlarmeValue) => {
    const { error } = await supabase
      .from('Alarms')
      .update({
        type: editedAlarme.type,
        alarmName: editedAlarme.alarmName,
        local: editedAlarme.local,
        deveui: editedAlarme.deveui,
        trigger: editedAlarme.trigger,
        triggerAt: editedAlarme.triggerAt,
        triggerType: editedAlarme.triggerType,
        alreadyPlayed: editedAlarme.alreadyPlayed,
        actionSensor: editedAlarme.actionSensor
      })
      .eq('id', editedAlarme.id);
    if (error) {
      console.error('Erro ao atualizar alarme no banco de dados', error);
    }
  };

  const [alarmError, setAlarmError] = useState<boolean>(false);
  function updateAlarm() {
    if (selectedAlarme.triggerType === "") {
      setAlarmError(true);
      return;
    }

    setAlarmError(false);

    const updatedAlarme = new AlarmeValue(
      selectedAlarme.id,
      alarmName,
      selectedAlarme.userId,
      selectedAlarme.type,
      selectedAlarme.local,
      selectedAlarme.deveui,
      trigger,
      triggerAt,
      triggerType,
      selectedAlarme.alreadyPlayed,
      selectedAlarme.currentValue,
      actionSensor,
    );

    handleEditAlarm(updatedAlarme);
    setAlarmEditPopupOpen(false);
    setSendingNewAlarm(true); // Atualiza alarmes, mais fácil fazer o fetch no supabase outra vez do que atualizar os valores pelos sensores
  }

  const [historyPopupOpen, setHistoryPopupOpen] = useState<boolean>(false);
  const [alarmHistory, setAlarmHistory] = useState<AlarmeHistory[]>([])

  async function getAlarmHistory(alarm: AlarmeValue) {
    setHistoryPopupOpen(true)

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
      const { data: userAlarmsHistory, error } = await supabase
        .from('Alarms_History')
        .select('type, local, deveui, trigger, triggerAt, triggerType, currentValue, lastPlayed, actionSensor')
        .eq('id', alarm.id);

      if (error) {
        console.error('Error fetching user alarms history: ', error)
      } else {
        var alarms = []
        userAlarmsHistory.forEach(userAlarmHistory => {
          const timestamp = new Date(userAlarmHistory.lastPlayed);

          const newAlarm = new AlarmeHistory(
            userAlarmHistory.type,
            // userAlarmHistory.alarmName,
            userAlarmHistory.local,
            userAlarmHistory.deveui,
            userAlarmHistory.trigger,
            userAlarmHistory.triggerAt,
            userAlarmHistory.triggerType,
            userAlarmHistory.currentValue,
            timestamp,
            userAlarmHistory.actionSensor,
          )

          alarms.push(newAlarm)
        });
        alarms.reverse()
        setAlarmHistory(alarms)
      }
    }
  }

  return (
    <DashboardLayout>
      <div>
        <Head>
          <title>Alarmes</title>
        </Head>

        {/* Edição de alarme */}
        {loading || sendingNewAlarm ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-2xl text-black">Carregando...</p>
          </div>
        ) : alarmEditPopupOpen && selectedAlarme ? (
          <div className="flex flex-col w-full">
            <div className="m-4">
              <button
                onClick={() => setAlarmEditPopupOpen(!alarmEditPopupOpen)}
                className="m-2 bg-red-500 hover:bg-red-700 text-white text-2xl font-bold py-3 px-6 rounded">
                Voltar
              </button>
            </div>
            <div className="container max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 justify-items-center">
              <div className="m-2 flex justify-center h-fit max-w-[24rem] border border-gray-400 bg-gray-50 rounded">
                <div className="m-2">
                  <p className="font-bold text-3xl text-center">Alarme Selecionado</p>
                  <strong>Nome do alarme:</strong> {selectedAlarme.alarmName || "Sem nome"}
                  <SensorDetails sensor={selectedSensor} />
                  <ul className="text-sm space-y-2 font-medium">
                    <li>
                      <strong>Tipo:</strong> {selectedAlarme.type}
                    </li>
                    <li>
                      <strong>Valor escolhido:</strong> {selectedAlarme.triggerType}
                    </li>
                    <li>
                      <strong>Tocar:</strong> {selectedAlarme.triggerAt === "higher" ? "Acima de " :
                        selectedAlarme.triggerAt === "lower" ? "Abaixo de " : selectedAlarme.triggerAt === "true" ? "Em " : " Em "}
                      {selectedAlarme.triggerAt === "higher" ? selectedAlarme.trigger :
                        selectedAlarme.triggerAt === "lower" ? selectedAlarme.trigger : selectedAlarme.triggerAt === "true" ? selectedAlarme.triggerAt : selectedAlarme.triggerAt}
                    </li>
                    <li>
                      {
                        selectedAlarme.triggerAt === "true" || selectedAlarme.triggerAt === "false" ? (
                          <div></div>
                        ) : (
                          <>
                            <strong>Valor atual:</strong> {selectedAlarme.trigger}
                          </>
                        )
                      }
                    </li>
                    <li>
                      <strong>Ação ao disparar o alarme:</strong> {selectedAlarme.actionSensor}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="m-2 flex flex-col justify-center h-fit max-w-[24rem] border border-gray-400 bg-gray-50 rounded">
                <div className="m-2">
                  <p className="font-bold text-3xl text-center">Editar Alarme</p>
                  <p>
                    Digite um nome para o seu alarme:
                  </p>
                  <input type="text" id="alarmName" className="mx-1 w-100 border border-black rounded p-1 text-lg m-2" placeholder="Nome" value={alarmName} onChange={(event) => setAlarmName(event.target.value)} />

                  <p>
                    Escolha o campo para o alarme
                  </p>
                  {selectedAlarme.type === "SmartLight" ? (
                    <select className="border border-black rounded p-1 text-lg" value={triggerType} onChange={(event) => setTriggerType(event.target.value)}>
                      <option value={"boardVoltage"}> boardVoltage</option>
                      <option value={"batteryVoltage"}> batteryVoltage</option>
                      <option value={"humidity"}> humidity</option>
                      <option value={"luminosity"}> luminosity</option>
                      <option value={"temperature"}> temperature</option>
                      <option value={"movement"}> movement</option>
                    </select>
                  ) : selectedAlarme.type === "WaterTankLevel" ? (
                    <select className="border border-black rounded p-1 text-lg" value={triggerType} onChange={(event) => setTriggerType(event.target.value)}>
                      <option value={"boardVoltage"}> boardVoltage</option>
                      <option value={"distance"}> distance</option>
                    </select>
                  ) : selectedAlarme.type === "Hydrometer" ? (
                    <select className="border border-black rounded p-1 text-lg" value={triggerType} onChange={(event) => setTriggerType(event.target.value)}>
                      <option value={"boardVoltage"}> boardVoltage</option>
                      <option value={"counter"}> counter</option>
                    </select>
                  ) : selectedAlarme.type === "EnergyMeter" ? (
                    <select className="border border-black rounded p-1 text-lg" value={triggerType} onChange={(event) => setTriggerType(event.target.value)}>
                      <option value={"boardVoltage"}> boardVoltage</option>
                      <option value={"forwardEnergy"}> forwardEnergy</option>
                      <option value={"reverseEnergy"}> reverseEnergy</option>
                    </select>
                  ) : selectedAlarme.type === "WeatherStation" ? (
                    <select className="border border-black rounded p-1 text-lg" value={triggerType} onChange={(event) => setTriggerType(event.target.value)}>
                      <option value={"emwAtmPres"}> Pressão Atmosférica</option>
                      <option value={"emwAvgWindSpeed"}> Velocidade do Vento</option>
                      <option value={"emwGustWindSpeed"}> Velocidade Rajada de Vento</option>
                      <option value={"emwHumidity"}> Humidade</option>
                      <option value={"emwLuminosity"}> Luminosidade</option>
                      <option value={"emwRainLevel"}> Nivel de Chuva</option>
                      <option value={"emwSolarRadiation"}> Radiação Solar</option>
                      <option value={"emwTemperature"}> Temperatura</option>
                      <option value={"emwUv"}> Índice UV</option>
                    </select>
                  ) : selectedAlarme.type === "Sprinkler" ? (
                    <select className="border border-black rounded p-1 text-lg" value={triggerType} onChange={(event) => setTriggerType(event.target.value)}>
                      <option value={""}></option>
                      <option value={"boardVoltage"}> boardVoltage</option>
                      <option value={"counter"}> Contador</option>
                      <option value={"solenoid1"}> Solenoide 1</option>
                      <option value={"solenoid2"}> Solenoide 2</option>
                      <option value={"solenoid3"}> Solenoide 3</option>
                    </select>
                  ) : selectedAlarme.type === "SoilMoisture3DepthLevels" ? (
                    <select className="border border-black rounded p-1 text-lg" value={triggerType} onChange={(event) => setTriggerType(event.target.value)}>
                      <option value={""}></option>
                      <option value={"boardVoltage"}> boardVoltage</option>
                      <option value={"soilMoistureDepthLevel1"}> Humidade 10 cm</option>
                      <option value={"soilMoistureDepthLevel2"}> Humidade 30 cm</option>
                      <option value={"soilMoistureDepthLevel3"}> Humidade 70 cm</option>
                    </select>
                  ) : (
                    <p></p>
                  )}
                  <p className="mt-2">Quando tocar</p>
                  <div className="flex">
                    {(triggerType === "solenoid1" || triggerType === "solenoid2" || triggerType === "solenoid3") ? (
                      <div>
                        <select className="border border-black rounded p-1 text-lg" value={triggerAt} onChange={(event) => setTriggerAt(event.target.value)}>
                          <option value={"true"}> True</option>
                          <option value={"false"}> False</option>
                        </select>
                      </div>) : (
                      <div>
                        <select className="border border-black rounded p-1 text-lg" value={triggerAt} onChange={(event) => setTriggerAt(event.target.value)}>
                          <option value={"higher"}> Acima de</option>
                          <option value={"lower"}> Abaixo de</option>
                        </select>
                        <input type="text" id="alarmTrigger" className="mx-1 w-32 border border-black rounded p-1 text-lg" placeholder="Valor" required value={trigger} onChange={(event) => setTrigger(event.target.value)} />
                      </div>
                    )}
                  </div>
                  <p className="mt-2">Ação ao disparar o alarme</p>
                  <div className="flex">
                    <select className="border border-black rounded p-1 text-lg" value={actionSensor} onChange={(event) => setActionSensor(event.target.value)}>
                      <option value={""}></option>
                      <option value={"sprinklersOn"}> Acionar Irrigadores</option>
                      <option value={"sprinklersOff"}> Desligar Irrigadores</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => { updateAlarm() }}
                  className="m-2 bg-blue-500 text-white px-3 py-1 rounded h-8 text-lg font-bold hover:bg-blue-700"
                >Editar alarme</button>
              </div>
            </div>
            <div className="mt-4 text-5xl text-center font-bold">
              {alarmError ? (
                <p className="text-red-500">Insira todos os dados</p>
              ) : (
                <p></p>
              )}
            </div>
          </div>
        ) : historyPopupOpen ? (
          <div>
            <div className="m-4">
              <button
                onClick={() => setHistoryPopupOpen(false)}
                className="m-2 bg-red-500 hover:bg-red-700 text-white text-2xl font-bold py-3 px-6 rounded">
                Voltar
              </button>
            </div>
            <div className="flex-col space-around justify-center items-center p-8">
              <div className="grid w-full gap-10 mx-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {alarmHistory.map((alarme, index) => {
                  return (
                    <div
                      key={index}
                      className={`animate-fade-in relative h-72 w-60 overflow-hidden rounded-xl bg-white dark:bg-neutral-900 dark:text-neutral-700 shadow-md`}
                      style={{ boxShadow: '8px 8px 25px rgba(0,0,0,.2)' }}
                    >
                      <div className="">
                        <svg
                          className="z-10 mx-auto mt-3 fill-current shadow-yellow-300 drop-shadow-2xl"
                          xmlns="http://www.w3.org/2000/svg"
                          width="90"
                          height="90"
                          viewBox="0 0 16 16"
                        >
                          <g fill="currentColor" transform="translate(1.000000, 0.000000)">
                            <path d="M13.654,0.659 C12.342,-0.292 10.604,-0.105 9.664,1.042 C10.615,1.358 11.535,1.827 12.393,2.449 C13.25,3.073 13.983,3.807 14.586,4.622 C15.35,3.347 14.965,1.614 13.654,0.659 Z" />
                            <path d="M2.644,2.427 C3.502,1.811 4.422,1.347 5.374,1.032 C4.433,-0.104 2.694,-0.288 1.383,0.654 C0.072,1.6 -0.314,3.316 0.451,4.579 C1.055,3.773 1.788,3.045 2.644,2.427 Z" />
                            <path d="M13.924,8.633 C13.924,8.435 13.912,8.24 13.896,8.047 C13.624,4.907 11.198,2.401 8.131,2.081 L8.131,2.081 C7.995,2.065 7.858,2.064 7.719,2.059 C7.637,2.055 7.555,2.045 7.471,2.045 L7.469,2.045 L7.467,2.045 C3.899,2.045 1.008,4.994 1.008,8.633 C1.008,8.662 1.012,8.692 1.013,8.721 C1.035,10.574 1.815,12.235 3.041,13.415 C2.633,13.627 2.348,14.056 2.348,14.558 C2.348,15.267 2.912,15.842 3.608,15.842 C4.274,15.842 4.812,15.315 4.858,14.648 C5.547,14.959 6.298,15.155 7.089,15.202 C7.215,15.21 7.34,15.222 7.467,15.222 C7.612,15.222 7.752,15.209 7.897,15.2 C8.698,15.146 9.458,14.939 10.153,14.614 C10.182,15.298 10.729,15.843 11.406,15.843 C12.102,15.843 12.665,15.268 12.665,14.559 C12.665,14.036 12.36,13.589 11.922,13.388 C13.152,12.19 13.924,10.506 13.924,8.633 Z M7.527,13.314 C4.964,13.314 2.88,11.198 2.88,8.598 C2.88,5.998 4.964,3.884 7.527,3.884 C10.089,3.884 12.174,5.998 12.174,8.598 C12.174,11.198 10.089,13.314 7.527,13.314 Z" />
                            <rect x="7" y="5" width="1" height="4" />
                            <rect x="7" y="8" width="3" height="1" />
                          </g>
                        </svg>
                      </div>
                      <div className="absolute left-3">
                        <h1 className="text-sm font-semibold">
                          <p className={`mt-3 mr-2 font-bold text-black }`}>
                            {alarme.local}
                          </p>
                          <p className={`mr-2 font-bold text-black}`}>
                            {alarme.type}
                          </p>
                          <p className={`mr-2 font-bold text-black}`}>
                            {alarme.triggerType}
                          </p>
                          <p className={`mr-2 font-medium text-black}`}>
                            <strong>Tocar:</strong> {selectedAlarme.triggerAt === "higher" ? "Acima de " :
                              alarme.triggerAt === "lower" ? "Abaixo de " : alarme.triggerAt === "true" ? "Em " : " Em "}
                            {alarme.triggerAt === "higher" ? alarme.trigger :
                              alarme.triggerAt === "lower" ? alarme.trigger : alarme.triggerAt === "true" ? alarme.triggerAt : alarme.triggerAt}{
                              alarme.triggerType === "boardVoltage" ? "V" :
                                alarme.triggerType === "batteryVoltage" ? "V" :
                                  alarme.triggerType === "humidity" ? "%" :
                                    alarme.triggerType === "luminosity" ? " lux" :
                                      alarme.triggerType === "temperature" ? "°C" :
                                        alarme.triggerType === "movement" ? " movimentos" :
                                          alarme.triggerType === "distance" ? " m" :
                                            alarme.triggerType === "counter" ? " contagem" :
                                              alarme.triggerType === "forwardEnergy" ? " kWh" :
                                                alarme.triggerType === "reverseEnergy" ? " kWh" :
                                                  alarme.triggerType === "emwAtmPres" ? " atm" :
                                                    alarme.triggerType === "emwAvgWindSpeed" ? " m/s" :
                                                      alarme.triggerType === "emwGustWindSpeed" ? " m/s" :
                                                        alarme.triggerType === "emwRainLevel" ? " mm" :
                                                          alarme.triggerType === "emwSolarRadiation" ? " W/m²" :
                                                            alarme.triggerType === "emwUv" ? " UV" :
                                                              alarme.triggerType === "solenoid1" ? "" :
                                                                alarme.triggerType === "solenoid2" ? "" :
                                                                  alarme.triggerType === "solenoid3" ? "" :
                                                                    alarme.triggerType === "soilMoistureDepthLevel1" ? "%" :
                                                                      alarme.triggerType === "soilMoistureDepthLevel2" ? "%" :
                                                                        alarme.triggerType === "soilMoistureDepthLevel3" ? "%" : ""
                            }
                          </p>
                          <p className={`mr-2 font-medium text-black`}>
                            {
                              alarme.triggerAt === "true" || alarme.triggerAt === "false" ? (
                                <div></div>
                              ) : (
                                <>
                                  <strong>Valor durante:</strong> {String(alarme.currentValue)}{
                                    alarme.triggerType === "boardVoltage" ? "V" :
                                      alarme.triggerType === "batteryVoltage" ? "V" :
                                        alarme.triggerType === "humidity" ? "%" :
                                          alarme.triggerType === "luminosity" ? " lux" :
                                            alarme.triggerType === "temperature" ? "°C" :
                                              alarme.triggerType === "movement" ? "" :
                                                alarme.triggerType === "distance" ? " m" :
                                                  alarme.triggerType === "counter" ? "" :
                                                    alarme.triggerType === "forwardEnergy" ? " kWh" :
                                                      alarme.triggerType === "reverseEnergy" ? " kWh" :
                                                        alarme.triggerType === "emwAtmPres" ? " atm" :
                                                          alarme.triggerType === "windSpeed" ? " m/s" :
                                                            alarme.triggerType === "windGustSpeed" ? " m/s" :
                                                              alarme.triggerType === "rainLevel" ? " mm" :
                                                                alarme.triggerType === "solarRadiation" ? " W/m²" :
                                                                  alarme.triggerType === "uvIndex" ? "" :
                                                                    ""
                                  }
                                </>
                              )
                            }
                          </p>
                          <p className={`mr-2 font-medium text-black`}>
                            <strong>Tocou em:</strong> {alarme.lastPlayed.toLocaleDateString("pt-br", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric"
                            })} às {alarme.lastPlayed.toLocaleTimeString("pt-br", {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                          <p className={`mr-2 font-medium text-black`}>
                            <strong>Ação ao disparar o alarme:</strong> {alarme.actionSensor ? String(alarme.actionSensor) : "Sem ação definida"}
                          </p>
                        </h1>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-col space-around justify-center items-center p-8">
            <div className="grid w-full gap-10 mx-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {alarmes.map((alarme, index) => {
                const isTriggered = alarme.triggerAt == "higher" ? Number(alarme.currentValue) > Number(alarme.trigger) : alarme.triggerAt == "lower" ? Number(alarme.currentValue) < Number(alarme.trigger) :
                  alarme.triggerAt == "true" ? alarme.currentValue === "true" : alarme.currentValue === "false";
                return (
                  <div
                    key={index}
                    className={`animate-fade-in relative h-100 p-4 w-64 overflow-hidden rounded-xl ${isTriggered ? "bg-red-500 text-red-100" : "bg-white dark:bg-neutral-900 dark:text-neutral-700"} shadow-md`}
                    style={{ boxShadow: '8px 8px 25px rgba(0,0,0,.2)' }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => deleteAlarme(alarme)}
                        className={`font-bold flex items-center justify-center w-10 h-10 ${isTriggered ? "ext-white" : "text-black"} hover:bg-opacity-80 transition`}
                      >
                        X
                      </button>
                      <p
                        className={'text-base font-bold text-center px-4 py-2 truncate ${isTriggered ? "text-white" : "text-gray-700 "}'}
                        style={{
                          maxWidth: "200px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                        title={alarme.alarmName}
                      >
                        {alarme.alarmName || "Sem nome"}
                      </p>
                      <button
                        onClick={() => openEditPopup(alarme)}
                        className={`text-sm font-bold flex items-center justify-center w-10 h-10 ${isTriggered ? "text-white" : "text-black"} hover:bg-opacity-80 transition`}
                      >
                        Editar
                      </button>
                    </div>
                    <div className="">
                      <svg
                        className="z-10 mx-auto mt-2 fill-current shadow-yellow-300 drop-shadow-2xl"
                        xmlns="http://www.w3.org/2000/svg"
                        width="90"
                        height="90"
                        viewBox="0 0 16 16"
                      >
                        <g fill="currentColor" transform="translate(1.000000, 0.000000)">
                          <path d="M13.654,0.659 C12.342,-0.292 10.604,-0.105 9.664,1.042 C10.615,1.358 11.535,1.827 12.393,2.449 C13.25,3.073 13.983,3.807 14.586,4.622 C15.35,3.347 14.965,1.614 13.654,0.659 Z" />
                          <path d="M2.644,2.427 C3.502,1.811 4.422,1.347 5.374,1.032 C4.433,-0.104 2.694,-0.288 1.383,0.654 C0.072,1.6 -0.314,3.316 0.451,4.579 C1.055,3.773 1.788,3.045 2.644,2.427 Z" />
                          <path d="M13.924,8.633 C13.924,8.435 13.912,8.24 13.896,8.047 C13.624,4.907 11.198,2.401 8.131,2.081 L8.131,2.081 C7.995,2.065 7.858,2.064 7.719,2.059 C7.637,2.055 7.555,2.045 7.471,2.045 L7.469,2.045 L7.467,2.045 C3.899,2.045 1.008,4.994 1.008,8.633 C1.008,8.662 1.012,8.692 1.013,8.721 C1.035,10.574 1.815,12.235 3.041,13.415 C2.633,13.627 2.348,14.056 2.348,14.558 C2.348,15.267 2.912,15.842 3.608,15.842 C4.274,15.842 4.812,15.315 4.858,14.648 C5.547,14.959 6.298,15.155 7.089,15.202 C7.215,15.21 7.34,15.222 7.467,15.222 C7.612,15.222 7.752,15.209 7.897,15.2 C8.698,15.146 9.458,14.939 10.153,14.614 C10.182,15.298 10.729,15.843 11.406,15.843 C12.102,15.843 12.665,15.268 12.665,14.559 C12.665,14.036 12.36,13.589 11.922,13.388 C13.152,12.19 13.924,10.506 13.924,8.633 Z M7.527,13.314 C4.964,13.314 2.88,11.198 2.88,8.598 C2.88,5.998 4.964,3.884 7.527,3.884 C10.089,3.884 12.174,5.998 12.174,8.598 C12.174,11.198 10.089,13.314 7.527,13.314 Z" />
                          <rect x="7" y="5" width="1" height="4" />
                          <rect x="7" y="8" width="3" height="1" />
                        </g>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h1 className="text-sm font-semibold">
                        <p className={`mt-3 mr-2 font-bold ${isTriggered ? "text-red-100" : "text-black"}`}>
                          {alarme.local}
                        </p>
                        <p className={`mr-2 font-bold ${isTriggered ? "text-red-100" : "text-black"}`}>
                          {alarme.type}
                        </p>
                        <p className={`mr-2 font-bold ${isTriggered ? "text-red-100" : "text-black"}`}>
                          {alarme.triggerType}
                        </p>
                        <p className={`mr-2 font-medium ${isTriggered ? "text-red-100" : "text-black"}`}>
                          <strong>Tocar:</strong> {alarme.triggerAt === "higher" ? "Acima de " :
                            alarme.triggerAt === "lower" ? "Abaixo de " : alarme.triggerAt === "true" ? "Em " : " Em "}
                          {alarme.triggerAt === "higher" ? alarme.trigger :
                            alarme.triggerAt === "lower" ? alarme.trigger : alarme.triggerAt === "true" ? alarme.triggerAt : alarme.triggerAt}{
                            alarme.triggerType === "boardVoltage" ? "V" :
                              alarme.triggerType === "batteryVoltage" ? "V" :
                                alarme.triggerType === "humidity" ? "%" :
                                  alarme.triggerType === "luminosity" ? " lux" :
                                    alarme.triggerType === "temperature" ? "°C" :
                                      alarme.triggerType === "movement" ? " movimentos" :
                                        alarme.triggerType === "distance" ? " m" :
                                          alarme.triggerType === "counter" ? " contagem" :
                                            alarme.triggerType === "forwardEnergy" ? " kWh" :
                                              alarme.triggerType === "reverseEnergy" ? " kWh" :
                                                alarme.triggerType === "emwAtmPres" ? " atm" :
                                                  alarme.triggerType === "emwAvgWindSpeed" ? " m/s" :
                                                    alarme.triggerType === "emwGustWindSpeed" ? " m/s" :
                                                      alarme.triggerType === "emwRainLevel" ? " mm" :
                                                        alarme.triggerType === "emwSolarRadiation" ? " W/m²" :
                                                          alarme.triggerType === "emwUv" ? " UV" :
                                                            alarme.triggerType === "solenoid1" ? "" :
                                                              alarme.triggerType === "solenoid2" ? "" :
                                                                alarme.triggerType === "solenoid3" ? "" :
                                                                  alarme.triggerType === "soilMoistureDepthLevel1" ? "%" :
                                                                    alarme.triggerType === "soilMoistureDepthLevel2" ? "%" :
                                                                      alarme.triggerType === "soilMoistureDepthLevel3" ? "%" : ""
                          }
                        </p>
                        <p className={`mr-2 font-medium ${isTriggered ? "text-red-100" : "text-black"}`}>
                          {
                            alarme.triggerAt === "true" || alarme.triggerAt === "false" ? (
                              <>
                                <strong>Valor atual:</strong> {alarme.currentValue}
                              </>
                            ) : (
                              <>
                                <strong>Valor atual:</strong> {String(alarme.currentValue)}{
                                  alarme.triggerType === "boardVoltage" ? "V" :
                                    alarme.triggerType === "batteryVoltage" ? "V" :
                                      alarme.triggerType === "humidity" ? "%" :
                                        alarme.triggerType === "luminosity" ? " lux" :
                                          alarme.triggerType === "temperature" ? "°C" :
                                            alarme.triggerType === "movement" ? "" :
                                              alarme.triggerType === "distance" ? " m" :
                                                alarme.triggerType === "counter" ? "" :
                                                  alarme.triggerType === "forwardEnergy" ? " kWh" :
                                                    alarme.triggerType === "reverseEnergy" ? " kWh" :
                                                      alarme.triggerType === "emwAtmPres" ? " atm" :
                                                        alarme.triggerType === "windSpeed" ? " m/s" :
                                                          alarme.triggerType === "windGustSpeed" ? " m/s" :
                                                            alarme.triggerType === "rainLevel" ? " mm" :
                                                              alarme.triggerType === "solarRadiation" ? " W/m²" :
                                                                alarme.triggerType === "uvIndex" ? "" :
                                                                  alarme.triggerType === "soilMoistureDepthLevel1" ? "%" :
                                                                    alarme.triggerType === "soilMoistureDepthLevel2" ? "%" :
                                                                      alarme.triggerType === "soilMoistureDepthLevel3" ? "%" : ""
                                }
                              </>
                            )
                          }
                        </p>
                        <p className={`mr-2 font-medium ${isTriggered ? "text-red-100" : "text-black"}`}>
                          <strong>Ação ao disparar o alarme:</strong> {alarme.actionSensor ? String(alarme.actionSensor) : " Sem ação definida"}
                        </p>
                        <button
                          onClick={() => getAlarmHistory(alarme)}
                          className={`rounded-lg text-lg px-2 ${isTriggered ? "text-red-500 bg-white hover:bg-gray-300" : "text-white bg-blue-500 hover:bg-blue-700"} font-bold mt-1`}
                        >
                          Histórico
                        </button>
                      </h1>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>)}
      </div>
    </DashboardLayout>
  );
};

export default Alarmes;
