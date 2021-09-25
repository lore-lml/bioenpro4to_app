export class Packet{
  msgId: string;
  timestamp: number;
  pPayload: string;
  mPayload: string;

  private constructor() {}

  static fromStreamsResponse(msgId: string, pPayload: any, mPayload: any): Packet{
    const packet = new Packet();
    packet.msgId = msgId;
    packet.timestamp = -1;

    const decoder = new TextDecoder();
    const p = decoder.decode(pPayload);
    try {
      const r = JSON.parse(p);
      packet.pPayload = JSON.stringify(r, null, 2);
      packet.timestamp = Packet.getTimestamp(packet.pPayload);
    }catch (_){
      packet.pPayload = p;
    }

    const m = decoder.decode(mPayload);
    try {
      const r = JSON.parse(m);
      packet.mPayload = JSON.stringify(r, null, 2);
      packet.timestamp = Packet.getTimestamp(packet.mPayload);
    }catch (_){
      packet.mPayload = m;
    }
    return packet;
  }
  static fromHttp(pPayload: any, mPayload: any): Packet{
    const packet = new Packet();
    packet.pPayload = JSON.stringify(pPayload);
    packet.mPayload = JSON.stringify(mPayload);
    packet.msgId = '';
    const timestamp = this.getTimestamp(packet.pPayload);
    packet.timestamp = timestamp !== -1 ? timestamp : this.getTimestamp(packet.mPayload);
    return packet;
  }

  private static getTimestamp(json: string){
    const a = json.match(/"timestamp":\s*?[0-9]+/);
    if (a === null){
      return -1;
    }
    return parseInt(a[0].split(':')[1].trim(), 10);
  }

  toJson(): Array<any>{
    const jsons = [];
    try{
      jsons.push(JSON.parse(this.pPayload));
    }catch(_){
      jsons.push(undefined);
    }

    try{
      jsons.push(JSON.parse(this.mPayload));
    }catch(_){
      jsons.push(undefined);
    }

    return jsons;
  }
}
