import { action, makeObservable, observable } from "mobx";

export class NexSelector {
  modifiedCount = 0;
  map: Record<string, any> = {};
  lastSelectedKey: string | null = null;
  constructor() {
    makeObservable(this, {
      modifiedCount: observable,
      map: observable,
      get: action,
      set: action,
      remove: action,
      reset: action,
    });

    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.remove = this.remove.bind(this);
    this.reset = this.reset.bind(this);
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
      this.modifiedCount++;
      this.lastSelectedKey = key; // 마지막으로 선택된 키 업데이트
    }
  }

  remove(key: string): void {
    delete this.map[key];
    this.modifiedCount++;
  }
  reset(): void {
    this.map = {};
    this.modifiedCount = 0;
  }
}

export default NexSelector;
