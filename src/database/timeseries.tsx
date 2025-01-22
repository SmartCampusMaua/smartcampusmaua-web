import { GenericSensor } from '@/database/dataTypes';
import { useState } from 'react';
import { supabase } from '@/database/supabaseClient';
const apiUrlSmartLight = "https://smartcampus-k8s.maua.br/api/timeseries/v0.3/IMT/LNS/SmartLight/all?interval=30";
const apiUrlWaterTankLevel = "https://smartcampus-k8s.maua.br/api/timeseries/v0.3/IMT/LNS/WaterTankLevel/all?interval=30";
const apiUrlHydrometer = "https://smartcampus-k8s.maua.br/api/timeseries/v0.3/IMT/LNS/Hydrometer/all?interval=30";
const apiUrlEnergyMeter = "https://smartcampus-k8s.maua.br/api/timeseries/v0.3/IMT/LNS/EnergyMeter/all?interval=30";
const apiUrlWeatherStation = "https://smartcampus-k8s.maua.br/api/timeseries/v0.3/IMT/LNS/WeatherStation/all?interval=30";
const apiUrlSprinkler = "https://smartcampus-k8s.maua.br/api/timeseries/v0.3/IMT/LNS/Sprinkler/all?interval=30";
const apiUrlSoilMoisture3DepthLevels = "https://smartcampus-k8s.maua.br/api/timeseries/v0.3/IMT/LNS/SoilMoisture3DepthLevels/all?interval=30";
const apiUrlEvseStatusNotification = "https://smartcampus-k8s.maua.br/api/timeseries/v0.3/IMT/EVSE/StatusNotification/all?interval=30000";
// const apiUrlEvseStartTransaction = "https://smartcampus-k8s.maua.br/api/timeseries/v0.3/IMT/EVSE/StartTransaction/all?interval=30";
// const apiUrlEvseStopTransaction = "https://smartcampus-k8s.maua.br/api/timeseries/v0.3/IMT/EVSE/StTransaction/all?interval=30000";

async function fetchEvseStatusNotification(deviceId) {
  try {
    const response = await fetch(apiUrlEvseStatusNotification);
    const text = await response.text();

    if (!response.ok || !text) throw new Error('Invalid or empty response (StatusNotification)');

    const data = JSON.parse(text);

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("Response is not an array or is empty");
      return null; 
    }

    const deviceData = data.find(item => item?.tags?.deviceId === deviceId);
    return deviceData?.tags?.status ?? "Sem informações";
  } catch (error) {
    console.error('Error fetching status:', error);
    return null; 
  }
}

async function fetchSmartLight() {
  const response = await fetch(apiUrlSmartLight);

  const data = await response.json();

  return data;
}
async function fetchWaterTankLevel() {
  const response = await fetch(apiUrlWaterTankLevel);

  const data = await response.json();

  return data;
}
async function fetchHydrometer() {
  const response = await fetch(apiUrlHydrometer);

  const data = await response.json();

  return data;
}
async function fetchEnergyMeter() {
  const response = await fetch(apiUrlEnergyMeter);

  const data = await response.json();

  return data;
}
async function fetchWeatherStation() {
  const response = await fetch(apiUrlWeatherStation);

  const data = await response.json();

  return data;
}
async function fetchSprinkler() {
  const response = await fetch(apiUrlSprinkler);

  const data = await response.json();

  return data;
}
async function fetchSoilMoisture3DepthLevels() {
  const response = await fetch(apiUrlSoilMoisture3DepthLevels);

  const data = await response.json();

  return data;
}

async function fetchAllSensors() {
  const luzes = await fetchSmartLight();
  const waterTanklevel = await fetchWaterTankLevel();
  const hydrometer = await fetchHydrometer();
  const energyMeter = await fetchEnergyMeter();
  const weatherStation = await fetchWeatherStation();
  const sprinkler = await fetchSprinkler();
  const soilMoisture = await fetchSoilMoisture3DepthLevels();

  return [...luzes,
  ...waterTanklevel,
  ...hydrometer,
  ...energyMeter,
  ...weatherStation,
  ...sprinkler,
  ...soilMoisture];
};

const sanitize = (value: any) => (value === "" || value === null ? "Indisponível" : value);

const fetchSensors = async () => {
  const { data: sensorsInfo, error } = await supabase
    .from('Sensors')
    .select("Nome, DEVEUI, Local, Tipo");

  if (error) {
    console.error('Error fetching sensors data: ', error);
    return;
  }

  const sensorsData = await fetchAllSensors();
  var updatedSensores = [];
  sensorsData.forEach(sensorData => {
    const isDuplicate = updatedSensores.some(
      sensor => sanitize(sensor.tags[0]) === sanitize(sensorData.tags.deviceId)
    );
    var sensorAlreadyExists = false;

    if (!isDuplicate) {
      let newSensor;
      if (sensorData.name === "SmartLight" && !sensorAlreadyExists) {
        sensorsInfo.forEach(sensorInfo => {
          if (sensorInfo.DEVEUI == sensorData.tags.deviceId) {
            newSensor = new GenericSensor(
              sanitize(sensorInfo.Nome),
              sensorData.name,
              [
                sanitize(sensorData.fields.boardVoltage) + " V",
                sanitize((Number(sensorData.fields.batteryVoltage) / 1000).toFixed(1)) + " V",
                sanitize(sensorData.fields.humidity) + " %",
                sanitize((Math.pow(Number(sensorData.fields.luminosity), -3.746) * 140000000000000).toFixed(1)) + " lux",
                sanitize(sensorData.fields.movement),
                sanitize(sensorData.fields.temperature) + " °C"
              ],
              [sanitize(sensorData.tags.deviceId)],
              sanitize(sensorInfo.Local),
              new Date(Number(sensorData.timestamp) / 1e6)
            );
            sensorAlreadyExists = true;
          }
        });
        if (!sensorAlreadyExists) {
          newSensor = new GenericSensor(
            "Indisponível",
            sensorData.name,
            [
              sanitize(sensorData.fields.boardVoltage) + " V",
              sanitize((Number(sensorData.fields.batteryVoltage) / 1000).toFixed(1)) + " V",
              sanitize(sensorData.fields.humidity) + " %",
              sanitize((Math.pow(Number(sensorData.fields.luminosity), -3.746) * 140000000000000).toFixed(1)) + " lux",
              sanitize(sensorData.fields.movement),
              sanitize(sensorData.fields.temperature) + " °C"
            ],
            [sanitize(sensorData.tags.deviceId)],
            "Indisponível",
            new Date(Number(sensorData.timestamp) / 1e6)
          );
        }
      } else if (sensorData.name === "WaterTankLevel") {
        sensorsInfo.forEach(sensorInfo => {
          if (sensorInfo.DEVEUI == sensorData.tags.deviceId) {
            newSensor = new GenericSensor(
              sanitize(sensorInfo.Nome),
              sensorData.name,
              [
                sanitize((sensorData.fields.boardVoltage).toFixed(1)) + " V",
                sanitize((Number(sensorData.fields.distance) / 1000).toFixed(1)) + " metros"
              ],
              [sanitize(sensorData.tags.deviceId)],
              sanitize(sensorInfo.Local),
              new Date(Number(sensorData.timestamp) / 1e6)
            );
            sensorAlreadyExists = true;
          }
        });
        if (!sensorAlreadyExists) {
          newSensor = new GenericSensor(
            "Indisponível",
            sensorData.name,
            [
              sanitize((sensorData.fields.boardVoltage).toFixed(1)) + " V",
              sanitize((Number(sensorData.fields.distance) / 1000).toFixed(1)) + " metros"
            ],
            [sanitize(sensorData.tags.deviceId)],
            "Indisponível",
            new Date(Number(sensorData.timestamp) / 1e6)
          );
        }
      } else if (sensorData.name === "Hydrometer") {
        sensorsInfo.forEach(sensorInfo => {
          if (sensorInfo.DEVEUI == sensorData.tags.deviceId) {
            newSensor = new GenericSensor(
              sanitize(sensorInfo.Nome),
              sensorData.name,
              [
                sanitize(sensorData.fields.boardVoltage).toFixed(1) + " V",
                sanitize(sensorData.fields.counter)
              ],
              [sanitize(sensorData.tags.deviceId)],
              sanitize(sensorInfo.Local),
              new Date(Number(sensorData.timestamp) / 1e6)
            );
            sensorAlreadyExists = true;
          }
        });
        if (!sensorAlreadyExists) {
          newSensor = new GenericSensor(
            "Indisponível",
            sensorData.name,
            [
              sanitize(sensorData.fields.boardVoltage).toFixed(1) + " V",
              sanitize(sensorData.fields.counter)
            ],
            [sanitize(sensorData.tags.deviceId)],
            "Indisponível",
            new Date(Number(sensorData.timestamp) / 1e6)
          );
        }
      } else if (sensorData.name === "EnergyMeter") {
        sensorsInfo.forEach(sensorInfo => {
          if (sensorInfo.DEVEUI == sensorData.tags.deviceId) {
            newSensor = new GenericSensor(
              sanitize(sensorInfo.Nome),
              sensorData.name,
              [
                sanitize(sensorData.fields.boardVoltage).toFixed(1) + " V",
                sanitize(sensorData.fields.forwardEnergy).toFixed(1) + " kWh",
                sanitize(sensorData.fields.reverseEnergy).toFixed(1) + " kWh"
              ],
              [sanitize(sensorData.tags.deviceId)],
              sanitize(sensorInfo.Local),
              new Date(Number(sensorData.timestamp) / 1e6)
            );
            sensorAlreadyExists = true;
          }
        });
        if (!sensorAlreadyExists) {
          newSensor = new GenericSensor(
            "Indisponível",
            sensorData.name,
            [
              sanitize(sensorData.fields.boardVoltage).toFixed(1) + " V",
              sanitize(sensorData.fields.forwardEnergy).toFixed(1) + " kWh",
              sanitize(sensorData.fields.reverseEnergy).toFixed(1) + " kWh"
            ],
            [sanitize(sensorData.tags.deviceId)],
            "Indisponível",
            new Date(Number(sensorData.timestamp) / 1e6)
          );
        }
      } else if (sensorData.name === "WeatherStation") {
        sensorsInfo.forEach(sensorInfo => {
          if (sensorInfo.DEVEUI == sensorData.tags.deviceId) {
            newSensor = new GenericSensor(
              sanitize(sensorInfo.Nome),
              sensorData.name,
              [
                sanitize(sensorData.fields.emwAtmPres) + " atm",
                sanitize(sensorData.fields.emwAvgWindSpeed) + " m/s",
                sanitize(sensorData.fields.emwGustWindSpeed) + " m/s",
                sanitize(sensorData.fields.emwHumidity) + " %",
                sanitize(sensorData.fields.emwLuminosity) + " lux",
                sanitize(sensorData.fields.emwRainLevel) + " mm",
                sanitize(sensorData.fields.emwSolarRadiation) + " W/m²",
                sanitize(sensorData.fields.emwTemperature) + " °C",
                sanitize(sensorData.fields.emwUv) + " UV index",
              ],
              [sanitize(sensorData.tags.deviceId)],
              sanitize(sensorInfo.Local),
              new Date(Number(sensorData.timestamp) / 1e6)
            );
            sensorAlreadyExists = true;
          }
        });
        if (!sensorAlreadyExists) {
          newSensor = new GenericSensor(
            "Indisponível",
            sensorData.name,
            [
              sanitize(sensorData.fields.emwAtmPres) + " atm",
              sanitize(sensorData.fields.emwAvgWindSpeed) + " m/s",
              sanitize(sensorData.fields.emwGustWindSpeed) + " m/s",
              sanitize(sensorData.fields.emwHumidity) + " %",
              sanitize(sensorData.fields.emwLuminosity) + " lux",
              sanitize(sensorData.fields.emwRainLevel) + " mm",
              sanitize(sensorData.fields.emwSolarRadiation) + " W/m²",
              sanitize(sensorData.fields.emwTemperature) + " °C",
              sanitize(sensorData.fields.emwUv) + " UV index",
            ],
            [sanitize(sensorData.tags.deviceId)],
            "Indisponível",
            new Date(Number(sensorData.timestamp) / 1e6)
          );
        }
      } else if (sensorData.name === "Sprinkler") {
        sensorsInfo.forEach(sensorInfo => {
          if (sensorInfo.DEVEUI == sensorData.tags.deviceId) {
            newSensor = new GenericSensor(
              sanitize(sensorInfo.Nome),
              sensorData.name,
              [
                sanitize(sensorData.fields.boardVoltage) + " V",
                sanitize(sensorData.fields.counter),
                sanitize((sensorData.fields.solenoid1).toString()),
                sanitize((sensorData.fields.solenoid2).toString()),
                sanitize((sensorData.fields.solenoid3).toString()),
              ],
              [sanitize(sensorData.tags.deviceId)],
              sanitize(sensorInfo.Local),
              new Date(Number(sensorData.timestamp) / 1e6)
            );
            sensorAlreadyExists = true;
          }
        });
        if (!sensorAlreadyExists) {
          newSensor = new GenericSensor(
            "Indisponível",
            sensorData.name,
            [
              sanitize(sensorData.fields.boardVoltage) + " V",
              sanitize(sensorData.fields.counter),
              sanitize((sensorData.fields.solenoid1).toString()),
              sanitize((sensorData.fields.solenoid2).toString()),
              sanitize((sensorData.fields.solenoid3).toString()),
            ],
            [sanitize(sensorData.tags.deviceId)],
            "Indisponível",
            new Date(Number(sensorData.timestamp) / 1e6)
          );
        }
      } else if (sensorData.name === "SoilMoisture3DepthLevels") {
        sensorsInfo.forEach(sensorInfo => {
          if (sensorInfo.DEVEUI == sensorData.tags.deviceId) {
            newSensor = new GenericSensor(
              sanitize(sensorInfo.Nome),
              sensorData.name,
              [
                sanitize(sensorData.fields.boardVoltage) + " V",
                sanitize((Number(sensorData.fields.soilMoistureDepthLevel1) / 100).toFixed(0)) + " %",
                sanitize((Number(sensorData.fields.soilMoistureDepthLevel2) / 100).toFixed(0)) + " %",
                sanitize((Number(sensorData.fields.soilMoistureDepthLevel3) / 100).toFixed(0)) + " %",
              ],
              [sanitize(sensorData.tags.deviceId)],
              sanitize(sensorInfo.Local),
              new Date(Number(sensorData.timestamp) / 1e6)
            );
            sensorAlreadyExists = true;
          }
        });
        if (!sensorAlreadyExists) {
          newSensor = new GenericSensor(
            "Indisponível",
            sensorData.name,
            [
              sanitize(sensorData.fields.boardVoltage) + " V",
              sanitize((Number(sensorData.fields.soilMoistureDepthLevel1) / 100).toFixed(0)) + " %",
              sanitize((Number(sensorData.fields.soilMoistureDepthLevel2) / 100).toFixed(0)) + " %",
              sanitize((Number(sensorData.fields.soilMoistureDepthLevel3) / 100).toFixed(0)) + " %",
            ],
            [sanitize(sensorData.tags.deviceId)],
            "Indisponível",
            new Date(Number(sensorData.timestamp) / 1e6)
          );
        }
      }

      if (newSensor) {
        updatedSensores.push(newSensor);
      }
    }
  });
  sensorsInfo.forEach(sensorInfo => {
    const isMissingInSensorsData = !sensorsData.some(sensorData =>
      sanitize(sensorData.tags.deviceId) === sanitize(sensorInfo.DEVEUI)
    );
    if (isMissingInSensorsData) {
      const alreadyExists = updatedSensores.some(sensor =>
        sanitize(sensor.tags[0]) === sanitize(sensorInfo.DEVEUI)
      );
      if (!alreadyExists) {
        updatedSensores.push(
          new GenericSensor(
            sanitize(sensorInfo.Nome),
            sanitize(sensorInfo.Tipo),
            ["Sensor Offline"],
            [sanitize(sensorInfo.DEVEUI)],
            sanitize(sensorInfo.Local)
          )
        );
      }
    }
  });
  return updatedSensores;
};

async function fetchSensorByDEVEUI(deveui: string) {
  const allSensors = await fetchAllSensors();

  const matchingSensor = allSensors.find(
    sensorData => sanitize(sensorData.tags.deviceId) === sanitize(deveui)
  );

  if (!matchingSensor) {
    console.error(`Sensor com DEVEUI ${deveui} não encontrado.`);
    return null;
  }

  const { data: sensorsInfo, error } = await supabase
    .from('Sensors')
    .select("Nome, DEVEUI, Local, Tipo")
    .eq("DEVEUI", deveui);

  if (error || !sensorsInfo || sensorsInfo.length === 0) {
    console.error(`Erro ao buscar informações do sensor no banco: `, error);
    return null;
  }

  const sensorInfo = sensorsInfo[0];
  const sensor = new GenericSensor(
    sanitize(sensorInfo.Nome),
    matchingSensor.name,
    [
      sanitize(matchingSensor.fields.boardVoltage) + " V",
      sanitize((Number(matchingSensor.fields.batteryVoltage) / 1000).toFixed(1)) + " V",
      sanitize(matchingSensor.fields.humidity) + " %",
      sanitize(matchingSensor.fields.temperature) + " °C"
    ],
    [sanitize(matchingSensor.tags.deviceId)],
    sanitize(sensorInfo.Local),
    new Date(Number(matchingSensor.timestamp) / 1e6)
  );

  return sensor;
}


export { fetchSmartLight, fetchAllSensors, fetchSensors, fetchSensorByDEVEUI, fetchEvseStatusNotification }
