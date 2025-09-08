export const clamp = (num: number, min: number, max: number): number => {
  return Math.max(min, Math.min(num, max));
};


// 타입 정의
type Row = string[];
type CountMap = Record<string, any>;

/**
 * 1. 전처리 함수: 중첩 해시맵 생성
 */
export function buildNestedCountMap(data: Row[], keys: string[]): CountMap {
  const map: CountMap = {};

  for (const row of data) {
    let cursor = map;

    for (let i = 0; i < keys.length - 1; i++) {
      const keyVal = row[i];
      if (!cursor[keyVal]) cursor[keyVal] = {};
      cursor = cursor[keyVal];
    }

    const level = row[keys.length - 1];
    if (!cursor[level]) cursor[level] = 0;
    cursor[level]++;
  }

  return map;
}

/**
 * 2. 부분 조건 기반 level 카운팅 (전처리된 맵 사용)
 */
export function getLevelCountByPartialFromMap(
  map: CountMap,
  indexes: number[], // 필터를 적용할 key들의 인덱스
  values: string[], // 각 인덱스에 해당하는 값
  countKeyIndex: number // level이 위치한 인덱스 번호
): Record<string, number> {
  if (indexes.length !== values.length) {
    throw new Error("indexes and values must be same length");
  }

  const condition: Record<number, string> = {};
  indexes.forEach((idx, i) => {
    condition[idx] = values[i];
  });

  function recursiveCollect(
    node: any,
    depth: number,
    acc: Record<string, number>
  ) {
    if (depth === countKeyIndex) {
      if (typeof node === "object") {
        for (const [level, count] of Object.entries(node)) {
          acc[level] = (acc[level] || 0) + (count as number);
        }
      }
      return;
    }

    if (condition[depth] !== undefined) {
      const keyVal = condition[depth];
      if (node[keyVal]) {
        recursiveCollect(node[keyVal], depth + 1, acc);
      }
    } else {
      for (const subKey in node) {
        recursiveCollect(node[subKey], depth + 1, acc);
      }
    }
  }

  const result: Record<string, number> = {};
  recursiveCollect(map, 0, result);
  return result;
}

export function countByPartialCondition(
  data: Row[],
  conditionIndexes: number[],
  conditionValues: string[],
  countKeyIndex: number
): Record<string, number> {
  if (conditionIndexes.length !== conditionValues.length) {
    throw new Error(
      "conditionIndexes and conditionValues must be the same length"
    );
  }

  return data.reduce(
    (acc, row) => {
      const match = conditionIndexes.every(
        (idx, i) => row[idx] === conditionValues[i]
      );

      if (match) {
        const key = row[countKeyIndex];
        acc[key] = (acc[key] || 0) + 1;
      }

      return acc;
    },
    {} as Record<string, number>
  );
}

/**
 * 3. 단일 key 기준 전체 level 집계 (전처리된 맵 사용)
 */
export function getLevelCountBySingleKeyFromMap(
  map: CountMap,
  keys: string[],
  targetKey: string,
  countKey: string
): Record<string, Record<string, number>> {
  const targetIndex = keys.indexOf(targetKey);

  function recursiveScan(
    node: any,
    depth: number,
    path: string[],
    acc: Record<string, Record<string, number>>
  ) {
    if (depth === keys.length - 1) {
      for (const [level, count] of Object.entries(node)) {
        const keyVal = path[targetIndex];
        if (!acc[keyVal]) acc[keyVal] = {};
        acc[keyVal][level] = (acc[keyVal][level] || 0) + (count as number);
      }
      return;
    }

    for (const k in node) {
      recursiveScan(node[k], depth + 1, [...path, k], acc);
    }
  }

  const result: Record<string, Record<string, number>> = {};
  recursiveScan(map, 0, [], result);
  return result;
}

export function getValuesByCondition(
  data: Row[],
  conditionIndexes: number[] | null, // 없거나 null 일 경우 모든 행 선택
  conditionValues: string[] | null,
  targetIndexes: number[]
): any[] {
  const result: any[] = [];

  for (const row of data) {
    let match = true;

    if (conditionIndexes && conditionValues) {
      match = conditionIndexes.every(
        (idx, i) => row[idx] === conditionValues[i]
      );
    }

    if (match) {
      const selected = targetIndexes.map((idx) => row[idx]);
      result.push(selected);
    }
  }

  return result;
}

export function getUniqueValuesByCondition(
  data: Row[],
  conditionIndexes: number[] | null, // 없거나 null 일 경우 모든 행 선택
  conditionValues: string[] | null,
  targetIndex: number
): string[] {
  const uniqueValues = new Set<string>();

  for (const row of data) {
    let match = true;

    if (conditionIndexes && conditionValues) {
      match = conditionIndexes.every(
        (idx, i) => row[idx] === conditionValues[i]
      );
    }

    if (match) {
      uniqueValues.add(row[targetIndex]);
    }
  }

  return Array.from(uniqueValues);
}
