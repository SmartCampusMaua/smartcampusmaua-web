class Alarme {
  id: number;
  userId: number;
  type: string; // Smartlight
  local: string;
  deveui: string;
  trigger: string;
  triggerAt: string; // higher / lower than trigger
  triggerType: string; // boardVoltage
  alreadyPlayed: boolean;
  actionSensor: string


  constructor(id: number, userId: number, type: string, local: string, deveui: string, trigger: string, triggerAt: string, triggerType: string, alreadyPlayed: boolean, actionSensor: string) {
    this.id = id;
    this.userId = userId;
    this.deveui = deveui;
    this.trigger = trigger;
    this.triggerAt = triggerAt;
    this.triggerType = triggerType;
    this.local = local;
    this.type = type;
    this.alreadyPlayed = alreadyPlayed;
    this.actionSensor= actionSensor;
  }
}

class AlarmeValue {
  id: number;
  userId: number;
  type: string; // Smartlight
  local: string;
  deveui: string;
  trigger: string;
  triggerAt: string; // higher / lower than trigger
  triggerType: string; // boardVoltage
  alreadyPlayed: boolean;
  currentValue: number;
  actionSensor: string

  constructor(id: number, userId: number, type: string, local: string, deveui: string, trigger: string, triggerAt: string, triggerType: string, alreadyPlayed: boolean, currentValue: number, actionSensor: string) {
    this.id = id;
    this.userId = userId;
    this.deveui = deveui;
    this.trigger = trigger;
    this.triggerAt = triggerAt;
    this.triggerType = triggerType;
    this.local = local;
    this.type = type;
    this.alreadyPlayed = alreadyPlayed;
    this.currentValue = currentValue;
    this.actionSensor= actionSensor;
  }
}

class AlarmeHistory {
  type: string; // Smartlight
  local: string;
  deveui: string;
  trigger: string;
  triggerAt: string; // higher / lower than trigger
  triggerType: string; // boardVoltage
  currentValue: number;
  lastPlayed: Date;
  actionSensor: string

  constructor(type: string, local: string, deveui: string, trigger: string, triggerAt: string, triggerType: string, currentValue: number, lastPlayed: Date, actionSensor: string) {
    this.deveui = deveui;
    this.trigger = trigger;
    this.triggerAt = triggerAt;
    this.triggerType = triggerType;
    this.local = local;
    this.type = type;
    this.currentValue = currentValue;
    this.lastPlayed = lastPlayed;
    this.actionSensor= actionSensor;
  }
}

class GenericSensor {
  constructor(
    public name: string, // DET-20
    public type: string | null, // Smartlight
    public fields: string[],
    public tags: string[],
    public local: string,
    public timestamp?: Date,
  ) { }
}

class Evse {
  measurement: string;
  connectorId: string;
  startMeter: string;
  transactionId: string;
  startTime: string;
  idTag: string;
  deviceId: string;
  timestamp: string;

  constructor(
    measurement: string,
    connectorId: string,
    startMeter: string,
    transactionId: string,
    startTime: string,
    idTag: string,
    deviceId: string,
    timestamp: string,
  ) {
    this.measurement = measurement;
    this.connectorId = connectorId;
    this.startMeter = startMeter;
    this.transactionId = transactionId;
    this.startTime = startTime;
    this.idTag = idTag;
    this.deviceId = deviceId;
    this.timestamp = timestamp;
  }
}

export { Alarme, GenericSensor, AlarmeValue, AlarmeHistory, Evse }