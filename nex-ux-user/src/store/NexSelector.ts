import { action, makeObservable, observable } from "mobx";

export class NexSelector {
  map: Record<string, any> = {};
  lastSelectedKey: string | null = null;
  constructor() {
    makeObservable(this, {
      map: observable,
      get: action,
      set: action,
      remove: action,
      reset: action,
    });

    this.get = this.get.bind(this);
  }

  get(key: string): any {
    return this.map[key];
  }

  set(key: string, value: any): void {
    if (this.map[key] !== value) {
      // 객체면 얕은 복사, 배열도 복사
      if (typeof value === "object" && value !== null) {
        this.map[key] = Array.isArray(value) ? [...value] : { ...value };
      } else {
        this.map[key] = value;
      }
      this.lastSelectedKey = key; // 마지막으로 선택된 키 업데이트
    }
  }

  remove(key: string): void {
    delete this.map[key];
  }
  reset(): void {
    this.map = {};
  }
}

export default NexSelector;
