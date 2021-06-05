export class Packet{
  msgId: string;
  timestamp: number;
  pPayload: string;
  mPayload: string;

  constructor(msgId: string, pPayload: any, mPayload: any) {
    this.msgId = msgId;
    this.timestamp = -1;

    const decoder = new TextDecoder();
    const p = decoder.decode(pPayload);
    try {
      const r = JSON.parse(p);
      this.pPayload = JSON.stringify(r, null, 2);
      this.timestamp = Packet.getTimestamp(this.pPayload);
    }catch (_){
      this.pPayload = p;
    }

    const m = decoder.decode(mPayload);
    try {
      const r = JSON.parse(m);
      this.mPayload = JSON.stringify(r, null, 2);
      this.timestamp = Packet.getTimestamp(this.mPayload);
    }catch (_){
      this.mPayload = m;
    }
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
