import { action, makeObservable, observable, runInAction } from "mobx";
import pxConfig from "config/px-config.json";

import {
  NexNode,
  NexWebSectionNode,
  NexWebThemeNode,
  NexWebThemeUserNode,
} from "type/NexNode";

import { formatConfig } from "test/data/config/formatConfig";
import { processorConfig } from "test/data/config/processorConfig";
import { webPageConfig } from "test/data/config/webPageConfig";
import { themeConfig } from "test/data/config/themeConfig";
import { themeUserConfig } from "test/data/config/themeUserConfig";
import { elementConfig } from "test/data/config/elementConfig";
import { storeConfig } from "test/data/config/storeConfig";

import { appletConfig } from "test/data/config/appletConfig";
import { contentsConfig } from "test/data/config/contentsConfig";
import { systemConfig } from "test/data/config/systemConfig";
import axios from "axios";

//const URL_CONFIG = "http://localhost:9080/admin-api";

export const buildAdminConfig = (datas: any[]) => {
  //console.log("buildAdminConfig datas:", JSON.stringify(datas, null, 2));

  const root: any = {};
  const pathMap: Record<string, any> = { "/": root };

  datas.forEach((item) => {
    const [index, path, project, system, object] = item;
    const parts = path.split("/").filter(Boolean);
    const nodeName = parts.pop() || "";
    const parentPath = "/" + parts.join("/");

    //console.log(`Processing item: item = ${JSON.stringify(item, null, 2)}`);
    const keys = Object.keys(object);
    if (keys.length !== 1) {
      // must have only one key
      console.warn(
        `[buildAdminConfig] Expected 1 key in object, but found keys:${JSON.stringify(object, null, 2)}.`
      );
      // continue or return based on how you want to handle this error
    }
    const seq = Number(keys[0]);
    const node = object[keys[0]];
    const newNode = { ...node, _seq: seq, _record: item, _index: index };

    const parentNode = pathMap[parentPath];
    //console.log(`Parent Node(${path}): ${JSON.stringify(parentNode, null, 2)}`);
    if (!parentNode.children) {
      parentNode.children = [];
    }
    // seq 순서에 맞게 삽입
    parentNode.children.push(newNode);

    pathMap[path] = newNode;
  });

  for (const parentPath in pathMap) {
    const parentNode = pathMap[parentPath];
    if (parentNode.children) {
      // seq 순서로 정렬
      parentNode.children.sort((a: any, b: any) => a._seq - b._seq);
      // 임시 _seq 속성 제거
      parentNode.children.forEach((child: any) => delete child._seq);
    }
  }
  //console.log("buildAdminConfig root:", JSON.stringify(root, null, 2));
  return root.children || [];
};

interface NexConfig {
  menu: NexNode[]; // 메뉴 정보
  storage: NexNode[]; // 스토리지 정보
  formats: NexNode[]; // 포맷 정보
  stores: NexNode[]; // 스토어 정보
  processors: NexNode[]; // 프로세서 정보
  systems: NexNode[]; // 시스템 정보
  elements: NexNode[]; // 엘리먼트 정보
  contents: NexNode[]; // 컨텐츠 정보
  applets: NexNode[]; // applet 정보
  websections: NexWebSectionNode[]; // 웹페이지 정보
  webThemes: NexWebThemeNode[]; // 웹테마 정보
  webThemeUsers: NexWebThemeUserNode[]; // 웹테마 사용자 정보
}

class NexConfigStore {
  url: string = ""; // URL 정보
  projectName: string = ""; // 프로젝트 이름
  systemName: string = ""; // "/webui"; // 시스템 경로

  isReady: boolean = false;
  config: NexConfig = {
    menu: [],
    storage: [],
    formats: [],
    stores: [],
    processors: [],
    systems: [],
    elements: [],
    contents: [],
    applets: [],
    websections: [],
    webThemes: [],
    webThemeUsers: [],
  };

  // web 서버로 부터 설정 정보를 수신하여 초기화 해야할 데이터
  //current User Store 필요 => 향후 사용자별 theme 및 page layout 정보 를 관리

  // web UI 관련 정보
  //applets: NexNode[] = []; // 가용한 applets path List
  //websections: any[] = []; // webpages 정보

  //webThemes: NexTheme[] = [defaultTheme]; // webthemes 정보
  //webThemeUsers: NexThemeUser[] = [defaultThemeUser]; // 사용자 정보

  constructor(url: string, projectName: string, systemName: string) {
    this.url = url; //url;
    this.projectName = projectName; // 프로젝트 이름 설정
    this.systemName = systemName;

    makeObservable(this, {
      url: observable,
      isReady: observable,
      config: observable.deep,

      getNode: action,
    });

    this.getNode = this.getNode.bind(this);

    // 테스트 데이터로 초기화
    const isLocalConfig = false;
    if (isLocalConfig) {
      this.fetchInternal();
    } else {
      this.fetch();
    }
    //this.uploadConfig();
  }

  async fetchInternal() {
    // this.element.process
    try {
      runInAction(() => {
        this.config.menu = []; // 메뉴 정보
        this.config.storage = []; // 스토리지 정보
        this.config.formats = formatConfig;
        this.config.stores = storeConfig;
        this.config.processors = processorConfig;
        this.config.systems = systemConfig;
        this.config.elements = elementConfig;
        this.config.contents = contentsConfig;
        this.config.applets = appletConfig;
        this.config.websections = webPageConfig;
        this.config.webThemes = themeConfig;
        this.config.webThemeUsers = themeUserConfig;
      });

      //console.log("this.loffset", this.store.loffset);
    } catch (error) {
      console.error(
        `Failed to fetch from url: ${this.url}, project: ${this.projectName}, system: ${this.systemName} : ${error})`
      );
    }
    this.isReady = true;
  }

  async fetch() {
    try {
      const response = await axios.get(this.url, {
        params: {
          project: this.projectName,
          system: this.systemName,
        },
      });

      //const datas = JSON.parse(JSON.stringify(response.data, null, 2));

      if (response.status < 200 || response.status >= 300) {
        console.error("Failed to fetch uploadConfig:", response);
        return;
      }
      runInAction(() => {
        const cfgMap = response.data;

        this.config.menu = buildAdminConfig(cfgMap["menu"]);
        this.config.storage = buildAdminConfig(cfgMap["storage"]);
        this.config.formats = buildAdminConfig(cfgMap["format"]);

        this.config.stores = buildAdminConfig(cfgMap["store"]);

        this.config.processors = buildAdminConfig(cfgMap["processor"]);

        this.config.systems = buildAdminConfig(cfgMap["system"]);

        this.config.elements = buildAdminConfig(cfgMap["element"]);

        this.config.contents = buildAdminConfig(cfgMap["contents"]);

        this.config.applets = buildAdminConfig(cfgMap["applet"]);

        this.config.websections = buildAdminConfig(cfgMap["section"]);

        this.config.webThemes = buildAdminConfig(cfgMap["theme"]);

        this.config.webThemeUsers = buildAdminConfig(cfgMap["user"]);

        this.isReady = true;
      });
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  }

  async uploadConfig() {
    try {
      const url = this.url + "/admin/set";
      const path = "";
      const data = {
        ...this.config,
      };

      const response = await axios.post(url, {
        path: path,
        data: data,
      });

      console.log("response", JSON.stringify(response, null, 2));
      if (response.status < 200 || response.status >= 300) {
        console.error("Failed to fetch uploadConfig:", response);
        return;
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  }

  getNode(type: string, path: string) {
    if (!path || path === null) return null;
    const pathList = path.split("/").filter(Boolean);

    if (pathList.length === 0) return null;

    let list: any = null;
    let node = null;
    switch (type) {
      /* only 1 project
      case "project":
        list = this.projects;
        break;
      */
      case "format":
        list = this.config.formats;
        break;
      case "store":
        list = this.config.stores;
        break;
      case "processor":
        list = this.config.processors;
        break;
      case "system":
        list = this.config.systems;
        break;
      case "element":
        list = this.config.elements;
        break;
      case "content":
        list = this.config.contents;
        break;
      case "applet":
        list = this.config.applets;
        break;
      case "websection":
        list = this.config.websections;
        break;
      case "theme":
        list = this.config.webThemes;
        break;
      case "themeUser":
        list = this.config.webThemeUsers;
        break;
    }

    if (!list || list.length === 0) return null;

    for (let i = 0; i < pathList.length; i++) {
      if (!list) return null;
      node = list.find(
        (child: any) => child.name === pathList[i] || child.id === pathList[i]
      );
      if (!node) return null;
      //console.log("createDataStore node:", node);
      list = (node.children as any[]) || [];
    }

    if (!node || node.type !== type) return null;
    return node;
  }
}

//const nexConfig = new NexConfigStore("", "test", "/webui");
//export default nexConfig;

export const configStore = new NexConfigStore(
  pxConfig["config-url"],
  pxConfig["project"],
  pxConfig["system"]
);
export default NexConfigStore;
