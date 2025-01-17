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
  forwardEnergy: string;
  connectorId: string;
  deviceId: string;
  timestamp: number;
  

  constructor(
    forwardEnergy: string,
    connectorId: string,
    deviceId: string,
    timestamp: number,

  ) {
    this.forwardEnergy = forwardEnergy;
    this.connectorId = connectorId;
    this.deviceId = deviceId;
    this.timestamp = timestamp;

  }
}

export { Alarme, GenericSensor, AlarmeValue, AlarmeHistory, Evse }