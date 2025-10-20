import { action, makeObservable, observable, runInAction } from "mobx";
import { getTestElement } from "test/data/config/elementConfig";
import { getTestFormat } from "test/data/config/formatConfig";
import { getTestData } from "test/data/user/testData";
import { NexCondition, NexFeatureType } from "type/NexNode";
import { makeSampleJsonAndCsv, parseCsv2Json } from "type/nexNodeConv";
import axios from "axios";

const URL_DATA = "http://127.0.0.1:9070/data-api";

export interface NexData {
  csv: any[]; // conditions 가 반영된 CSV data
  format: any; // format 정보
}

type Row = any[];

function filterValidNodes(nodes: any[]): any[] {
  if (nodes.length > 1) return nodes;
  return nodes.flatMap((node) => {
    if (node.type === undefined) {
      // 실제 데이터 노드면 그대로 반환(자식들도 필터링해서)
      if (node.children) {
        if (node.children.length === 1) return filterValidNodes(node.children);
        return node.children;
      }
    } // 완전 빈 노드는 제거
    return [node];
  });
}

function buildTreeData(odata: any[], format: any): any {
  let result: any = null;

  if (format.type === "format") {
    result = odata.map((row) => {
      return parseCsv2Json(row, format.features);
    });
  } else if (format.type === "folder" && format.children) {
    const formatMap: Record<string, any> = {};
    format.children.forEach((child: any) => (formatMap[child.name] = child));
    const typeIndex = format.children[0].features.findIndex(
      (f: any) => f.name === "type"
    );
    if (typeIndex < 0) {
      console.warn(
        `NexDataStore: No "type" feature found in format: ${JSON.stringify(format, null, 2)}`
      );
      return [];
    }
    const nodes = odata.map((row) => {
      const type = row[typeIndex];
      const childFormat = format.children.find((fmt: any) => fmt.name === type);
      if (!childFormat) {
        console.warn(
          `NexDataStore: Unknown type "${type}" in row: ${JSON.stringify(row)}`
        );
        return null; // 해당 타입이 없으면 null 반환
      }
      return parseCsv2Json(row, childFormat.features);
    });

    const virtualRoot: any = { children: [] };
    for (const node of nodes) {
      // path를 "/"와 "." 모두 고려하여 분리
      // path를 "/"와 "." 모두 고려하여 분리
      // 예: "foo/bar.baz/qux" -> [{value: "foo", type: "segment"}, {value: "bar", type: "segment"}, {value: "baz", type: "attribute"}, {value: "qux", type: "segment"}]
      // path를 "/"와 "." 기준으로 분리하여 parentSegments 배열 생성
      const parentSegments: any[] = [];
      if (node.path && node.path.length > 0) {
        node.path
          .split("/")
          .filter(Boolean)
          .forEach((part: any) => {
            part
              .split(".")
              .filter(Boolean)
              .forEach((seg: string, idx: number) => {
                parentSegments.push({
                  name: seg,
                  delimiter: idx === 0 ? "/" : ".",
                });
              });
          });
      } else {
        console.log(
          `buildTreeData() path가 없음! node=${JSON.stringify(node, null, 2)}`
        );
        continue;
      }

      //console.log(`parentSegments: ${JSON.stringify(parentSegments, null, 2)}`);
      const name = node.name;

      const lastSeg =
        parentSegments.length > 0
          ? parentSegments[parentSegments.length - 1]
          : { name: "", delimiter: "" };
      // lastSeg에 점이 있으면 마지막 점 이후의 값을 추출, 없으면 그대로 사용

      if (lastSeg.name !== name) {
        console.warn(
          `buildTreeData() path와 name 불일치! path="${node.path}", name="${name}"`
        );
        continue; // 트리에 추가하지 않음
      }

      //const config = this.keyFieldMap[node.type] || {};
      const format = formatMap[node.type] || {};

      //const childKey = hasDot ? "attributes" : "children"; // 기본 children 키

      let cursor = virtualRoot;
      const childKey = lastSeg.delimiter === "." ? "attributes" : "children";
      for (const seg of parentSegments.slice(0, -1)) {
        const children =
          seg.delimiter === "." ? cursor.attributes : cursor.children;
        let next = children.find((n: any) => n.name === seg.name);
        if (!next) {
          next = { name: seg.name, children: [] };
          children.push(next);
        }
        cursor = next;
      }

      cursor[childKey] = cursor[childKey] || [];
      cursor[childKey].push(node);
    }

    result = filterValidNodes(virtualRoot.children);
  }
  return result;
}

const makePeriodMSec = (
  intervalStr: string,
  unit: "MSEC" | "SEC" | "MIN" | "HOUR" | "DAY" | "MONTH" | "YEAR"
) => {
  const interval = Number(intervalStr);
  let periodMSec = 0;
  switch (unit) {
    case "MSEC":
      periodMSec = interval;
      break;
    case "SEC":
      periodMSec = interval * 1000;
      break;
    case "MIN":
      periodMSec = interval * 60 * 1000;
      break;
    case "HOUR":
      periodMSec = interval * 60 * 60 * 1000;
      break;
    case "DAY":
      periodMSec = interval * 24 * 60 * 60 * 1000;
      break;
    case "MONTH":
      periodMSec = interval * 30 * 24 * 60 * 60 * 1000;
      break;
    case "YEAR":
      periodMSec = interval * 365 * 24 * 60 * 60 * 1000;
      break;
    default:
      periodMSec = interval;
  }
  return periodMSec;
};

export class NexDataStore {
  fetchIntervalId: NodeJS.Timeout | null = null; // fetch 주기를 관리하는 타이머 ID

  name: string = ""; // label name
  url: string = ""; // 데이터 소스 URL
  //path: string = "/"; // 데이터 소스 경로
  elementPath: string = ""; // element 경로

  element: any = null; // element 정보
  format: any = null; // format 정보
  // 아래 는 제거
  //name: string = ""; // label name
  //dispName: string = ""; // display name
  //isTree: boolean = false; // tree type or not
  //volatility: "static" | "mutable" | "immutable" = "immutable"; // static, mutable, immutable
  //  데이터 변화 속성 유형(Volatility) : format 내에 포함함
  //   - static(값,양 모두 변하지 않는)
  //   - mutable(값만변하는 fixed size mutable)
  //   - immutable(양만변하는 append-only)
  //volatility : 'immutable' | 'mutable' | 'static' = 'immutable' ;
  //isTree : boolean = false; // tree type or not

  // 데이터
  //features: any[] = []; // feature list

  // 데이터를 빠르게 찾기 위한 key & 데이터 관리
  curRowIndex: number = -1;
  keyIndex: number = 0; // key indexes
  lastKeyIndex: number = 0; // last key index(max)
  keyMap: Record<number, number> = {};

  idata: any[] = []; // input data
  odata: any[] = []; // 출력 데이터(conditions 에 맞는)

  ioffset: number = 0; // input data offset
  foffset: number = 0; // data offset 0: 끝까지
  loffset: number = 0; // data offset 0: last-offset 마지막 수신한 데이터의 offset

  isTree: boolean = false; // tree type or not
  //keyFieldMap: KeyFieldsMap = {};

  constructor(
    url: string,
    path: string,
    elementPath: string,
    element?: any,
    format?: any,
    data?: any[]
  ) {
    this.url = url;
    if (elementPath === "") {
      this.format = format || {};
      this.element = {};
      this.odata = data || [];
    } else {
      this.elementPath = elementPath;

      this.name = this.element?.name || "";
      this.element = element || {}; //getTestElement(elementPath);
      this.odata = []; //getTestData(this.element?.name);
      this.format = format || {}; //getTestFormat(this.element?.format);

      //console.log(
      //  `NexDataStore: element=${elementPath} format=${this.element?.format}`
      //);

      if (!this.format || !this.element) {
        console.error(
          "NexDataStore require element:",
          JSON.stringify(this.element, null, 2)
        );

        //return;
      }
    }

    this.name = this.element?.dispName || this.format?.dispName || "";

    this.ioffset = 0;
    this.foffset = 0;

    const features = this.format?.features || [];
    this.keyIndex = features.findIndex(
      (feature: any) => feature.featureType === NexFeatureType.INDEX
    );

    // keyMap: 각 row의 keyindexes 조합을 문자열로 만들어 row를 빠르게 찾기 위한 맵

    // 모든 row를 keyMap에 등록
    if (this.keyIndex !== -1) {
      this.odata.forEach((row: any, index: number) => {
        const key = Number(row[this.keyIndex]);
        if (this.keyMap[key]) {
          console.warn(
            `NexDataStore: Duplicate key found for row at index ${index}: ${key}`
          );
          // 중복된 키가 있으면 기존 값을 덮어쓰지 않음
        } else {
          this.lastKeyIndex = Math.max(this.lastKeyIndex, key);
          this.keyMap[key] = index; // odata 의 row index 저장
        }
      });
    }

    makeObservable(this, {
      name: observable,
      url: observable,
      element: observable,
      format: observable,
      idata: observable,
      curRowIndex: observable,
      odata: observable,
      ioffset: observable,
      foffset: observable,
      loffset: observable,
      fetch: action,
      startFetchInterval: action,
      stopFetchInterval: action,

      select: action,
      add: action,
      remove: action,
      update: action,

      upload: action,

      getData: action,
      getValuesByCondition: action,
      getCountByCondition: action,
      //buildTreeData: action,
    });

    this.fetch = this.fetch.bind(this);
    this.startFetchInterval = this.startFetchInterval.bind(this);
    this.stopFetchInterval = this.stopFetchInterval.bind(this);

    this.select = this.select.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.update = this.update.bind(this);

    this.upload = this.upload.bind(this);

    this.getData = this.getData.bind(this);
    this.getCountByCondition = this.getCountByCondition.bind(this);
    this.getValuesByCondition = this.getValuesByCondition.bind(this);
    //this.buildTreeData = this.buildTreeData.bind(this);

    const interval = makePeriodMSec(
      this.element?.processingInterval,
      this.element?.processingUnit
    );

    //this.upload();
    this.fetch();
    //if (this.element) this.startFetchInterval(interval);
  }

  async fetch() {
    // this.element.process
    try {
      const url = URL_DATA;
      //const url = this.url;
      const response = await axios.get(url, {
        params: {
          path: this.elementPath,
          project: "", //this.projectName,
          system: "webserver", // this.systemName,
        },
      });

      //const datas = JSON.parse(JSON.stringify(response.data, null, 2));

      if (response.status < 200 || response.status >= 300) {
        console.error("Failed to fetch Data:", response);
        return;
      }
      runInAction(() => {
        //console.log(
        //  "NexDataStore: fetch data:",
        //  JSON.stringify(response.data, null, 2)
        //);
        this.odata = response.data || [];
        this.loffset = this.odata.length;
      });
      //console.log("this.loffset", this.store.loffset);
    } catch (error) {
      console.error(
        `Failed to fetch from path: ${this.element.sources[0]}, (error, : ${error})`
      );
    }
  }

  // 10초마다 fetch() 호출
  startFetchInterval(time: number) {
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

  select(row: any): void {
    if (!row) {
      this.curRowIndex = -1;
      return;
    }
    this.curRowIndex = Number(row[this.keyIndex]);
    console.log(
      `# select row=${JSON.stringify(row)}, index=${this.curRowIndex}`
    );
  }

  add(curRow: any, newRow: any): boolean {
    // curRow 는 현재 선택된 위치를 나타냄
    // 기존에 데이터가 있는지 확인하고 있으면 에러 출력

    // 현재 추가할 위치가 없으면 마지막에 추가
    const newKeyIndex = this.lastKeyIndex++;

    const updatedRow = [...newRow];
    updatedRow[this.keyIndex] = newKeyIndex;

    const curKeyIndex = curRow ? Number(curRow[this.keyIndex]) : -1;
    if (curKeyIndex === -1) {
      // 맨 마지막에 추가
      this.keyMap[newKeyIndex] = this.odata.length;
      this.odata = [...this.odata, updatedRow];
      this.curRowIndex = this.odata.length - 1;

      return true;
    }
    // curRow 의 위치 다음에 newRow를 삽입
    const insertIndex = this.keyMap[curKeyIndex] + 1;

    // 배열에 삽입
    this.odata.splice(insertIndex, 0, updatedRow);

    // 삽입 지점부터 끝까지의 keyMap만 갱신 (tail만 업데이트)
    for (let i = insertIndex; i < this.odata.length; i++) {
      const k = Number(this.odata[i][this.keyIndex]);
      this.keyMap[k] = i;
    }
    this.curRowIndex = insertIndex;
    return true;
  }

  remove(row: any): boolean {
    const curKeyIndex = row ? Number(row[this.keyIndex]) : -1;
    if (curKeyIndex === -1) {
      console.warn("NexDataStore: remove() row not found or invalid");
      return false;
    }
    const removeIndex = this.keyMap[curKeyIndex];
    if (removeIndex === undefined) {
      console.warn("NexDataStore: remove() key not found in keyMap");
      return false;
    }
    if (this.format.isTree) {
      // tree 인경우 하위 노드들도 삭제
      const pathIndex = this.format.features.findIndex(
        (f: any) => f.name === "path"
      );
      if (pathIndex !== -1) {
        const delPath = this.odata[removeIndex][pathIndex];
        const delPathPrefix = delPath + "/";

        // 하위 노드들도 삭제
        this.odata = this.odata.filter((row) => {
          const rowPath = row[pathIndex];
          return !rowPath.startsWith(delPathPrefix);
        });
      }
    }
    this.odata.splice(removeIndex, 1);
    delete this.keyMap[curKeyIndex];

    // shift keyMap indices for the tail
    for (let i = removeIndex; i < this.odata.length; i++) {
      const k = Number(this.odata[i][this.keyIndex]);
      this.keyMap[k] = i;
    }
    this.curRowIndex = this.odata.length > removeIndex ? removeIndex : -1;
    return true;
  }

  update(row: any): boolean {
    // 단일 row를 업데이트: curRow를 지우고 그 자리에 newRow를 삽입
    if (!row) {
      console.warn("NexDataStore: update() row is empty");
      return false;
    }
    // this.odata 에서 row의 keyIndex 가 동일한 값을 찾아서 교체
    const rowKey = Number(row[this.keyIndex]);
    const rowIndex = this.odata.findIndex(
      (r) => Number(r[this.keyIndex]) === rowKey
    );

    if (rowIndex === -1) {
      console.warn("NexDataStore: update() invalid index(key) value");
      return false;
    }

    // Prefer splice for observable arrays so MobX emits a proper change

    if (this.format.isTree) {
      // tree 인경우 feature 중 path 가 변경되었으면 하위 노드들도 경로를 변경

      const oldRow = this.odata[rowIndex];

      // path feature의 인덱스를 찾음
      const pathIndex = this.format.features.findIndex(
        (f: any) => f.name === "path"
      );

      if (pathIndex !== -1) {
        const oldPath = oldRow[pathIndex];
        const newPath = row[pathIndex];

        if (oldPath !== newPath) {
          // newPath 와 동일한 경로가 있는지 확인하고 있으면 false 반환
          const duplicate = this.odata.find((r, i) => {
            if (i === rowIndex) return false; // 현재 행은 제외
            return r[pathIndex] === newPath;
          });
          if (duplicate) {
            console.warn(
              `NexDataStore: update() - Duplicate path "${newPath}" found. Update aborted.`
            );
            return false; // 중복 경로가 있으면 업데이트 중단
          }

          console.log(
            "NexDataStore: update() isTree - update child paths if needed"
          );
          const oldPathPrefix = oldPath + "/";
          const newPathPrefix = newPath + "/";

          this.odata.forEach((r, i) => {
            if (i === rowIndex) return; // Skip the row we just updated
            const currentPath = r[pathIndex];
            if (currentPath.startsWith(oldPathPrefix)) {
              const updatedPath =
                newPathPrefix + currentPath.substring(oldPathPrefix.length);
              r[pathIndex] = updatedPath;

              console.log({
                message: `NexDataStore: update() - Updated child path from "${currentPath}" to "${updatedPath}"`,
              });
            }
          });
        }
      }
    }
    this.odata.splice(rowIndex, 1, row);

    this.curRowIndex = rowIndex;
    return true;
  }

  async upload() {
    // 서버로 데이터 업로드
    return false;
    try {
      const url = URL_DATA + "/upload";

      const response = await axios.post(url, {
        path: this.elementPath,
        project: "",
        system: "webserver",
        data: this.odata,
      });

      console.log("response", JSON.stringify(response, null, 2));
      if (response.status < 200 || response.status >= 300) {
        console.error("Failed to Upload Data:", response);
        return;
      }
    } catch (error) {
      console.error("Failed to Upload Data:", error);
    }
    return true;
  }

  getData(): NexData {
    //console.log(`NexDataStore: getData() odata=${JSON.stringify(this.odata, null, 2)}`);
    return {
      csv: this.odata,
      format: this.format,
    };
  }

  getValuesByCondition(
    conditions: any[],
    tFeatures?: string[] // 출력 할 행의 feature 이름들
  ): NexData {
    //const newDataStore = new NexDataStore("", "", "");
    const data: any[] = [];

    // format 그룹 즉 tree 구조일 경우를 고려 필요함.
    const features =
      this.format.features || this.format.children[0].features || [];
    const conds = conditions.map((condition) => ({
      index: features.findIndex(
        (feature: any) => feature.name === condition.feature
      ),
      value: condition.value,
      method: condition.method,
    }));

    // tFeatures가 없거나 빈 배열이면 전체 컬럼 인덱스 사용

    //console.log(`conds: ${JSON.stringify(conds, null, 2)}`);
    // 조건에 맞는 행 추출
    const filteredRows =
      !conditions || conditions.length === 0
        ? (this.odata ?? [])
        : (this.odata ?? []).filter((row: any) =>
            conds.every((condition) => {
              const cell = row[condition.index];
              const value = condition.value;
              switch (condition.method) {
                case "starts-with":
                  return typeof cell === "string" && cell.startsWith(value);
                case "ends-with":
                  return typeof cell === "string" && cell.endsWith(value);
                case "contains":
                  return typeof cell === "string" && cell.includes(value);
                case "path-match":
                  return (
                    cell === value ||
                    (typeof cell === "string" && cell.startsWith(value + "."))
                  );
                case "greater-than":
                  return Number(cell) > Number(value);
                case "less-than":
                  return Number(cell) < Number(value);
                case "match":
                default:
                  return cell === value;
              }
            })
          );

    // tFeatures 있으면 에 해당하는 컬럼만 추출, 없으면 모두
    let tIndexes: number[] = [];
    if (tFeatures && tFeatures.length > 0) {
      tIndexes = tFeatures.map((feature) =>
        features.findIndex((f: any) => f.name === feature)
      );
      filteredRows.forEach((row: any) => {
        data.push(tIndexes.map((idx) => row[idx]));
      });
    } else {
      filteredRows.forEach((row: any) => {
        data.push([...row]); // 전체 행을 복사
      });
    }

    // format & features 설정
    let format: any = {};
    //let features: any[] = [];
    if (this.isTree || tIndexes.length === 0) {
      format = { ...this.format };
    } else {
      format = {
        ...this.format,
        features: tIndexes.map((idx) => this.format.features[idx]),
      };
    }

    return { csv: data, format: format };
  }

  getIndexesByCondition(conditions: any[]): number[] {
    const matchingIndexes: number[] = [];

    if (!conditions || conditions.length === 0) {
      // 조건이 없으면 모든 인덱스를 반환
      return this.odata.map((_, index) => index);
    }

    // format 그룹 즉 tree 구조일 경우를 고려 필요함.
    const features =
      this.format.features || this.format.children[0].features || [];
    const conds = conditions.map((condition) => ({
      index: features.findIndex(
        (feature: any) => feature.name === condition.feature
      ),
      value: condition.value,
      method: condition.method,
    }));

    // 조건에 맞는 행의 인덱스 추출
    (this.odata ?? []).forEach((row: any, index: number) => {
      const isMatch = conds.every((condition) => {
        if (condition.index === -1) return false; // 조건에 해당하는 feature가 없으면 false
        const cell = row[condition.index];
        const value = condition.value;
        switch (condition.method) {
          case "starts-with":
            return typeof cell === "string" && cell.startsWith(value);
          case "ends-with":
            return typeof cell === "string" && cell.endsWith(value);
          case "contains":
            return typeof cell === "string" && cell.includes(value);
          case "path-match":
            return (
              cell === value ||
              (typeof cell === "string" && cell.startsWith(value + "."))
            );
          case "greater-than":
            return Number(cell) > Number(value);
          case "less-than":
            return Number(cell) < Number(value);
          case "match":
          default:
            return cell === value;
        }
      });

      if (isMatch) {
        matchingIndexes.push(index);
      }
    });

    return matchingIndexes;
  }

  getCountByCondition(
    conditions: any[], // 조건에 해당하는 행의 고유한(Target) 값을 반환
    cFeature: string, // 카운팅할 원본데이터의 freature 이름
    cValues: string[], // 해당 인덱스 의 값 중 카운팅할 값 들 향후 fearture 에 추가
    tFeatures: string[] // 그룹화 / 출력할 데이터의 feature 이름들
  ): NexDataStore {
    //const newDataStore = new NexDataStore("", "", "");

    const data: any[] = [];
    const conds = conditions.map((condition) => ({
      index: this.format.features.findIndex(
        (feature: any) => feature.name === condition.feature
      ),
      value: condition.value,
      method: condition.method,
    }));

    const cIndex = this.format.features.findIndex(
      (feature: any) => feature.name === cFeature
    );

    // tFeatures가 없거나 빈 배열이면 전체 컬럼 인덱스 사용
    const tIndexes: number[] =
      !tFeatures || tFeatures.length === 0
        ? this.format.features.map((_: any, index: number) => index)
        : tFeatures.map((feature) =>
            this.format.features.findIndex((f: any) => f.name === feature)
          );

    // 조건에 맞는 행 추출
    const filteredRows =
      !conditions || conditions.length === 0
        ? (this.odata ?? [])
        : (this.odata ?? []).filter((row: any) =>
            conds.every((condition) => {
              const cell = row[condition.index];
              const value = condition.value;
              switch (condition.method) {
                case "starts-with":
                  return typeof cell === "string" && cell.startsWith(value);
                case "ends-with":
                  return typeof cell === "string" && cell.endsWith(value);
                case "contains":
                  return typeof cell === "string" && cell.includes(value);
                case "path-match":
                  return (
                    cell === value ||
                    (typeof cell === "string" && cell.startsWith(value))
                  );
                case "match":
                default:
                  return cell === value;
              }
            })
          );

    // 카운트할 값이 있는 행만 필터링
    const countMap: Record<string, number> = {};
    cValues.forEach((value) => {
      countMap[value] = 0; // 카운트 초기화
    });

    filteredRows.forEach((row: any) => {
      const key = row[cIndex];
      if (cValues.includes(key)) {
        countMap[key] = (countMap[key] || 0) + 1;
      }
    });

    // 결과 데이터 구성
    // tIndexes에 해당하는 컬럼 값 + cValues 각각의 count를 한 row에 추가
    const newRow: Row = tIndexes.map((idx) => {
      // 조건에 맞는 첫 번째 row의 값을 사용 (없으면 undefined)
      return filteredRows.length > 0 ? filteredRows[0][idx] : undefined;
    });

    cValues.forEach((key) => {
      newRow.push(countMap[key]?.toString() ?? "0");
    });

    data.push(newRow);
    //newDataStore.odata.push(newRow);

    //console.log(`Row Data: ${JSON.stringify(newDataStore.odata)}`);
    // features 설정

    // format & features 설정
    let format: any = {};
    //let features: any[] = [];
    if (this.isTree || !tFeatures) {
      format = { ...this.format };
    } else {
      format = {
        ...this.format,
        features: tIndexes.map((idx) => this.format.features[idx]),
      };
    }

    // 마지막에 cValues 와 일치하는 count 값들을 위한  feature 추가
    cValues.forEach((value) => {
      format.features.push({
        name: `${value}`,
        dispName: `${value}`,
        description: `Count of rows matching ${value}`,
        type: "feature",
        isKey: false,
        color: `${value === "정상" ? "green" : value === "경고" ? "red" : value === "주의" ? "orange" : ""}`,
        featureType: "UINT32",
      });
    });

    return new NexDataStore("", "", "", format, data);
  }

  buildTreeData3() {
    if (!this.isTree) {
      console.error(
        `NexDataStore(${this.name}): buildTreeData() requires folder type with children.`
      );
      return [];
    }

    const formats = this.format.children;
    const typeIndex = formats[0].features.findIndex(
      (f: any) => f.name === "type"
    );

    const nodes = this.odata
      .map((row) => {
        const type = row[typeIndex];
        const fmt = formats.find((f: any) => f.name === type);
        if (!fmt) {
          console.warn(
            `NexDataStore(${this.name}): Unknown type "${type}" in row: ${JSON.stringify(row)}`
          );
          return null;
        }
        return parseCsv2Json(row, fmt.features);
      })
      .filter(Boolean);

    const normalizePath = (p?: string) => {
      if (!p || p === "/") return "";
      return p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p;
    };

    // children/attributes에서 name으로 찾아오거나 생성하는 헬퍼
    const getOrCreateByName = (arr: any[], name: string, isAttr: boolean) => {
      const key = "name";
      let found = arr.find((n: any) => n && n[key] === name);
      if (!found) {
        found = isAttr ? { name, attributes: [] } : { name, children: [] };
        arr.push(found);
      }
      return found;
    };

    const virtualRoot: any = { children: [] };

    for (const node of nodes) {
      const path = normalizePath(node.path);
      const name = node.name ?? "";

      const slashSteps = path.split("/").filter(Boolean);

      let cursor = virtualRoot;
      let endedInAttributes = false;

      for (const step of slashSteps) {
        // 한 슬래시 단계: "a.b.c"
        const dotSteps = step.split(".").filter(Boolean);
        if (dotSteps.length === 0) continue;

        // 1) 첫 토큰은 children으로 이동/생성
        cursor.children = cursor.children || [];
        cursor = getOrCreateByName(
          cursor.children,
          dotSteps[0],
          /*isAttr*/ false
        );
        endedInAttributes = false;

        // 2) 이후 토큰들은 attributes 배열로 이동/생성
        for (let i = 1; i < dotSteps.length; i++) {
          const attrKey = dotSteps[i];
          cursor.attributes = cursor.attributes || [];
          cursor = getOrCreateByName(
            cursor.attributes,
            attrKey,
            /*isAttr*/ true
          );
          endedInAttributes = true;
        }
      }

      if (endedInAttributes) {
        // 마지막이 '.' 경로: attributes 배열에 노드 추가
        cursor.attributes = cursor.attributes || [];
        // node가 name을 이미 갖고 있으므로 그대로 push
        cursor.attributes.push(node);
      } else {
        // 마지막이 '/' 경로 또는 path가 빈문자: children에 추가
        if (path) {
          // (선택) 이름 검증: 마지막 슬래시 세그먼트의 첫 토큰과 node.name 일치 확인
          const lastSeg = slashSteps[slashSteps.length - 1] || "";
          const lastChild = lastSeg.split(".")[0] || "";
          if (lastChild && lastChild !== name) {
            console.warn(
              `[NexDataStore][${this.name}] path/name mismatch: path="${node.path}", expected last="${name}" but got "${lastChild}"`
            );
            continue;
          }
        }
        cursor.children = cursor.children || [];
        cursor.children.push(node);
      }
    }

    return filterValidNodes(virtualRoot.children);
  }

  buildCSVData(treeData: any) {
    // CSV 형태로 변환
    if (!this.isTree) {
      console.error(
        `NexDataStore(${this.name}): buildCSVData() requires folder type with children.`
      );
      return null;
    }
    return [];
  }
}

export default NexDataStore;
