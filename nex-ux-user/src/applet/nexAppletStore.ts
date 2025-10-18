import { action, makeObservable, observable, runInAction } from "mobx";
import axios from "axios";

export interface NexFeature {
  name: string;
  dispName?: string;
  description?: string;
  type: string;
  isKey?: boolean;
  icon?: string; // icon name for legend
  color?: string; // color for line chart
  featureType: string; // NONE, TIME_SEC, UINT8, UINT16, UINT32, UINT64, INT8, INT16, INT32, INT64, FLOAT32, FLOAT64
}

export class NexAppletStore {
  url: string = "";
  path: string = "/";
  label: string = ""; // label name
  volatility: "static" | "mutable" | "immutable" = "static"; // static, mutable, immutable
  isTree: boolean = false; // tree type or not
  features: NexFeature[] = []; // feature list

  fetchIntervalId: NodeJS.Timeout | null = null; // fetch 주기를 관리하는 타이머 ID

  //  데이터 변화 속성 유형(Volatility) : format 내에 포함함
  //   - static(값,양 모두 변하지 않는)
  //   - mutable(값만변하는)
  //   - immutable(양만변하는)
  //volatility : 'immutable' | 'mutable' | 'static' = 'immutable' ;
  //isTree : boolean = false; // tree type or not

  ioffset: number = 0; // data offset 0: 처으부터
  foffset: number = 0; // data offset 0: 끝까지
  loffset: number = 0; // data offset 0: last-offset 마지막 수신한 데이터의 offset

  idata: any[] = [];
  odata: any[] = [];

  constructor(url: string, path: string, element: any) {
    this.url = url;
    this.path = path;

    this.ioffset = 0;
    this.foffset = 0;

    this.label = element.dispName;
    this.isTree = element.format.isTree === "true" ? true : false; // format 내에 포함된 isTree
    this.volatility = element.format.volatility; // format 내에 포함된 volatility
    this.features = element.format.children.map((feature: any) => feature);

    makeObservable(this, {
      url: observable,

      path: observable,

      volatility: observable, // format 내에 포함된 volatility
      isTree: observable, // format 내에 포함된 isTree
      features: observable, // feature name(key) list

      idata: observable,
      odata: observable,
      ioffset: observable,
      foffset: observable,
    });

    this.startFetchInterval(10000); // 10초 후에 fetch() 호출
    //this.fetch();
  }

  async fetch() {
    try {
      const response = await axios.get(this.url, {
        params: {
          path: this.path,
          ioffset: this.ioffset,
          foffset: this.foffset,
        },
      });

      console.log("response", JSON.stringify(response, null, 2));
      if (response.status < 200 || response.status >= 300) {
        console.error(
          "Failed to fetch from path:",
          this.path,
          "(",
          response,
          ")"
        );
        return;
      }

      const data = response.data;
      runInAction(() => {
        this.odata = data.values;
        this.loffset = data.offset;
      });
    } catch (error) {
      console.error("Failed to fetch from path:", this.path, "(", error, ")");
    }
  }

  setOffset(ioffset: number, foffset: number) {
    this.ioffset = ioffset;
    this.foffset = foffset;
    this.fetch();
  }

  // 10초마다 fetch() 호출
  startFetchInterval(time: number = 10000) {
    this.stopFetchInterval(); // 기존 타이머 중지

    if (time === 0) {
      // time이 0이면 fetch()를 한 번만 호출
      this.fetch();
      return;
    }
    this.fetchIntervalId = setInterval(() => {
      this.fetch();
    }, time); // 10초 (10000ms)
  }

  // fetch 주기 중지
  stopFetchInterval() {
    if (this.fetchIntervalId) {
      clearInterval(this.fetchIntervalId);
      this.fetchIntervalId = null;
    }
  }
}

const elements: any[] = [];

const nexDataStore = (path: string): NexAppletStore | null => {
  if (!path || path === null) return null;
  const pathList = path.split("/").filter(Boolean);

  if (pathList.length === 0) return null;

  console.log("createDataStore path:", path);

  let list = elements;
  let node = null;

  for (let i = 0; i < pathList.length; i++) {
    if (!list) return null;
    node = list.find(
      (child: any) => child.name === pathList[i] || child.id === pathList[i]
    );
    if (!node) return null;
    list = (node.children as any[]) || [];
  }

  if (!node || node.type !== "webcontents" || !("dataStore" in node))
    return null;

  return new NexAppletStore("", path, "");
};

export default nexDataStore;
//const store = new NexAppletStore("http://", "path", {});
