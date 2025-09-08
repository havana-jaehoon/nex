import { makeObservable, observable, runInAction } from "mobx";

import { NexNode } from "type/NexNode";

import { formatConfig } from "test/data/config/formatConfig";
import { processorConfig } from "test/data/config/processorConfig";
import { webPageConfig } from "test/data/config/webPageConfig";
import { themeConfig } from "test/data/config/themeConfig";
import { themeUserConfig } from "test/data/config/themeUserConfig";
import { elementConfig } from "test/data/config/elementConfig";
import { storeConfig } from "test/data/config/storeConfig";
import { projectConfig } from "test/data/config/projectConfig";
import {
  defaultTheme,
  defaultThemeUser,
  NexTheme,
  NexThemeUser,
} from "type/NexTheme";
import { appletConfig } from "test/data/config/appletConfig";
import { contentsConfig } from "test/data/config/contentsConfig";

class NexConfigStore {
  url: string = ""; // URL 정보
  projectName: string = ""; // 프로젝트 이름
  systemPath: string = "/webui"; // 시스템 경로

  // web 서버로 부터 설정 정보를 수신하여 초기화 해야할 데이터
  //current User Store 필요 => 향후 사용자별 theme 및 page layout 정보 를 관리
  projects: NexNode[] = []; // 프로젝트 정보

  categories: NexNode[] = []; // 카테고리 정보

  formats: NexNode[] = []; // format 정보
  stores: NexNode[] = []; //  저장 정책 정보
  processors: NexNode[] = []; // processor 정보

  // 사용할 element 정보
  systems: NexNode[] = [];
  elements: NexNode[] = []; // element 정보

  contents: any[] = []; // contents 정보

  // web UI 관련 정보
  applets: NexNode[] = []; // 가용한 applets path List
  websections: any[] = []; // webpages 정보

  webThemes: NexTheme[] = [defaultTheme]; // webthemes 정보
  webThemeUsers: NexThemeUser[] = [defaultThemeUser]; // 사용자 정보

  constructor(url: string, project: string, systemPath: string) {
    this.url = url;
    this.projectName = project; // 프로젝트 이름 설정
    this.systemPath = systemPath || "/";

    makeObservable(this, {
      url: observable,
      projects: observable,

      formats: observable,
      stores: observable,
      processors: observable,

      systems: observable,
      elements: observable,

      contents: observable,

      websections: observable,

      webThemes: observable,
      applets: observable,
      webThemeUsers: observable,
    });

    this.fetch();
  }

  async fetch() {
    // this.element.process
    try {
      runInAction(() => {
        this.projects = projectConfig;
        this.formats = formatConfig;
        this.stores = storeConfig;
        this.processors = processorConfig;
        this.elements = elementConfig;
        this.contents = contentsConfig;
        this.applets = appletConfig;
        this.websections = webPageConfig;
        this.webThemes = themeConfig;
        this.webThemeUsers = themeUserConfig;
      });
      //console.log("this.loffset", this.store.loffset);
    } catch (error) {
      console.error(
        `Failed to fetch from url: ${this.url}, project: ${this.projectName}, system: ${this.systemPath} : ${error})`
      );
    }
  }

  getNode(type: string, path: string) {
    if (!path || path === null) return null;
    const pathList = path.split("/").filter(Boolean);

    if (pathList.length === 0) return null;

    let list = null;
    let node = null;
    switch (type) {
      /* only 1 project
      case "project":
        list = this.projects;
        break;
      */
      case "format":
        list = this.formats;
        break;
      case "store":
        list = this.stores;
        break;
      case "processor":
        list = this.processors;
        break;
      case "system":
        list = this.systems;
        break;
      case "element":
        list = this.elements;
        break;
      case "content":
        list = this.contents;
        break;
      case "applet":
        list = this.applets;
        break;
      case "websection":
        list = this.websections;
        break;
      case "theme":
        list = this.webThemes;
        break;
      case "themeUser":
        list = this.webThemeUsers;
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
export default NexConfigStore;
