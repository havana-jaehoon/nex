/*
export class NexAppletStoreTest {
  url: string = "";
  path: string = "/";
  store: NexDataStore; // store data

  element: any = null; // element 정보

  fetchIntervalId: NodeJS.Timeout | null = null; // fetch 주기를 관리하는 타이머 ID

  //constructor(url: string, path: string, element: any) {
  constructor(url: string, path: string, element: any, attribute?: any) {
    this.url = url;
    this.path = path;
    this.element = element; // testMenuElement; // testElement로 대체

    this.store = new NexDataStore(); // Initialize store

    const elementName = element?.name || "";
    this.store.odata = getTestData(elementName);

    this.store.ioffset = 0;
    this.store.foffset = 0;

    this.store.name = this.element.name;
    this.store.dispName = this.element.dispName;

    const format: any = getTestFormat(this.element.format);

    if (!format) {
      console.error(
        "NexAppletStoreTest element:",
        JSON.stringify(this.element, null, 2)
      );
      console.error("NexAppletStoreTest: No format found in element");
      return;
    }

    this.store.isTree = format.isTree === "true" ? true : false; // format 내에 포함된 isTree

    this.store.volatility = format.volatility as
      | "static"
      | "mutable"
      | "immutable"; // format 내에 포함된 volatility

    this.store.features = format.features.map((feature: any) => feature);
    console.log("NexAppletStoreTest formatPath:", this.element.format);
    console.log("NexAppletStoreTest format:", format);


    makeObservable(this, {
      url: observable,
      path: observable,
      element: observable,

      store: observable, // format 내에 포함된 volatility

      getRowData: action,
      getColumnData: action,
      setOffset: action,
    });

    this.startFetchInterval(0); // 10초 후에 fetch() 호출
    this.getRowData = this.getRowData.bind(this);
    this.getColumnData = this.getColumnData.bind(this);
    //this.fetch();
  }

  async fetch() {
    try {
      runInAction(() => {
        this.store.loffset = this.store.odata.length;
      });
      //console.log("this.loffset", this.store.loffset);
    } catch (error) {
      console.error("Failed to fetch from path:", this.path, "(", error, ")");
    }
  }

  setOffset(ioffset: number, foffset: number) {
    this.store.ioffset = ioffset;
    this.store.foffset = foffset;
    this.fetch();
  }

  // 10초마다 fetch() 호출
  startFetchInterval(time: number = 100000) {
    this.stopFetchInterval(); // 기존 타이머 중지

    if (time === 0) {
      // time이 0이면 fetch()를 한 번만 호출
      //console.log("Fetch called immediately");
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

  getRowData(row: number) {
    if (this.store.odata.length === 0) {
      console.error("No data available");
      return null;
    }
    if (row < 0 || row >= this.store.odata.length) {
      console.error("Index out of bounds");
      return null;
    }
    return this.store.odata[row];
  }

  getColumnData(row: number, column: number) {
    if (this.store.odata.length === 0) {
      console.error("No data available");
      return null;
    }
    if (row < 0 || row >= this.store.odata.length) {
      console.error("Index out of bounds");
      return null;
    }
    const data = this.store.odata[row];
    if (column < 0 || column >= data.length) {
      console.error("Column index out of bounds");
      return null;
    }
    return data[column];
  }
}

//path : element path
const nexTestDataStore2 = (
  paths: string[],
  attribute?: any
): NexDataStore[] => {
  //console.log("nexTestDataStore: paths=", paths);

  if (!paths || paths.length === 0) {
    return [new NexDataStore()]; // 빈 NexDataStore 반환
  }

  const stores = paths.map((path) => {
    const element = getTestElement(path);
    if (element) {
      const store = new NexAppletStoreTest("", path, element, attribute);
      return store.store;
    }
    console.error("nexTestDataStore path :", path);
    return new NexDataStore(); // element가 없으면 빈 NexDataStore 반환
  });

  if (stores.length === 0) {
    return [new NexDataStore()]; // 빈 배열이면 빈 NexDataStore 반환
  }
  return stores;
};

const nexTestDataStore = (paths: string[]): NexDataStore[] => {
  //console.log("nexTestDataStore: paths=", paths);

  if (!paths || paths.length === 0) {
    return [new NexDataStore()]; // 빈 NexDataStore 반환
  }

  const stores = paths.map((elementPath) => {
    return new NexDataStore("", "", elementPath);
  });

  return stores;
};

export default nexTestDataStore;
*/
