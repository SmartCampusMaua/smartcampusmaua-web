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
      client.subscribe("IMT/EVSE/#", (err) => {
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
    
        if (jsonObject.type === "EVSE") {
          const { measurement, connectorId, startMeter, transactionId, startTime, idTag, deviceId, timestamp } = jsonObject;
          
          const evse = new Evse(
            measurement,
            connectorId,
            startMeter,
            transactionId,
            startTime,
            idTag,
            deviceId,
            timestamp
          );
    
          setData((prevData) => [...prevData, evse]);
          console.log("Mensagem recebida e processada com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao processar mensagem MQTT:", error);
      }
    });
    

    return () => {
      client.end();
    };
  }, []);

  const handlePrintTest = async (evse: Evse) => {
    try {
      console.log("Alarme inserido com sucesso:", evse);
    } catch (error) {
      console.error("Erro ao processar o alarme:", error);
    }
  };

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
                key={index}
                className="bg-gray-100 rounded-lg shadow-md p-4 border border-gray-300"
              >
                <h2 className="text-xl font-semibold mb-2">
                  Dispositivo: {evse.deviceId}
                </h2>
                <p><strong>Measurement:</strong> {evse.measurement}</p>
                <p><strong>Connector ID:</strong> {evse.connectorId}</p>
                <p><strong>Start Meter:</strong> {evse.startMeter}</p>
                <p><strong>Transaction ID:</strong> {evse.transactionId}</p>
                <p><strong>Start Time:</strong> {evse.startTime}</p>
                <p><strong>ID Tag:</strong> {evse.idTag}</p>
                <p><strong>Timestamp:</strong> {evse.timestamp}</p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handlePrintTest(evse)}
                >
                  print
                </button>
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