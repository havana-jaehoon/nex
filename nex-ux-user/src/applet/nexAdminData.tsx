export function format2Json(format: any): any {
  const features = format.features || [];
  let result: any = {};
  for (const feature of features) {
    if (
      feature.featureType === "attributes" &&
      Array.isArray(feature.attributes)
    ) {
      // 복합 속성 객체
      let groupObj: any = {};
      for (const attr of feature.attributes) {
        groupObj[attr.name] = "";
      }
      result[feature.name] = groupObj;
    } else if (feature.featureType === "literals") {
      // select box 입력 필드 (literal.value)
      if (
        Array.isArray(feature.literals)
        // && feature.literals.find((lit: any) => lit.value === literalRow)
      ) {
        result[feature.name] = "";
      } else {
        console.warn(
          `Literal value not found in feature feature=${JSON.stringify(features, null, 2)}`
        );
      }
    } else if (
      feature.featureType === "records" &&
      Array.isArray(feature.records)
    ) {
      result[feature.name] = [];
    } else {
      // 일반 속성
      result[feature.name] = "";
    }
  }
  return result;
}
