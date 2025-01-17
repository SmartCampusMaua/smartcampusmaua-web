"use client";

import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import DashboardLayout from "../components/DashboardLayout";
import Head from "next/head";
import { Evse } from "@/database/dataTypes";

export default function Home() {
  const [data, setData] = useState<Evse[]>([]);

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

    client.on("message", (topic, message) => {
      try {
        const jsonObject = JSON.parse(message.toString());

        if (jsonObject.name === "MeterValues" && jsonObject.tags.deviceType === "EVSE") {
          const { forwardEnergy } = jsonObject.fields;  
          const { connectorId, deviceId } = jsonObject.tags; 
          const timestamp = jsonObject.timestamp; 

          const evse = new Evse(
            forwardEnergy,     
            connectorId,       
            deviceId,          
            timestamp          
          );

          setData((prevData) => {
            const existingEvse = prevData.find((item) => item.deviceId === evse.deviceId);
            if (existingEvse) {
              return prevData.map((item) =>
                item.deviceId === evse.deviceId ? { ...item, ...evse } : item
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

  return (
    <DashboardLayout>
      <Head>
        <title>Carregadores EVSE</title>
      </Head>
      <main className="p-4 bg-white">
        <h1 className="text-3xl font-bold text-center mb-8">
          Dados dos Carregadores EVSE
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.length > 0 ? (
            data.map((evse, index) => (
              <div
                key={evse.deviceId} 
                className="bg-gray-100 rounded-lg shadow-md p-4 border border-gray-300"
              >
                <h2 className="text-xl font-semibold mb-2">
                  Dispositivo: {evse.deviceId}
                </h2>
                <p><strong>Foward Energy:</strong> {evse.forwardEnergy} KWh</p>
                <p>
                <strong>Type:</strong>{evse.connectorId.replace(/"/g, "").trim() === "0" ? " Charging Station" : " Charging Point"}</p>
                <p><strong>Atualizado por último:</strong> {new Date(evse.timestamp * 1000).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <>
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-lg shadow-md p-4 border border-gray-300 animate-pulse"
                >
                  <div className="h-6  rounded w-3/4 mb-4 font-bold">Nenhum dado encontrado</div>
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
    </DashboardLayout>
  );
}