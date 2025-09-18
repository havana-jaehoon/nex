


// CSV-like array: [type, path(/project/category), name, dispName, description, icon, color, address_ip, address_port, hdfs_ip, hdfs_port, hdfs_path, db_ip, db_port, db_id, db_passwd, db_name]
export const systemPerProject = [
  [
    "system",
    "/sample/system", // 프로젝트
    "collector", // 시스템명
    "수집서버", // 출력이름
    "수집 서버", // 설명
    "", // icon
    "", // color
    "", // address.ip
    "0", // address.port
    "", // hdfs.ip
    "", // hdfs.port
    "", // hdfs.path
    "", // db.ip
    "", // db.port
    "", // db.id
    "", // db.passwd
    "", // db.name
  ],
  [
    "system",
    "/sample/system", // 프로젝트
    "analysis",
    "분석서버",
    "분석 서버",
    "", // icon
    "", // color
    "",
    "0",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  [
    "system",
    "/sample/system", // 프로젝트
    "web",
    "관리 서버",
    "웹 서버",
    "", // icon
    "", // color
    "",
    "0",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  [
    "system",
    "/sample/system", // 프로젝트
    "ui",
    "WEB UI",
    "WEB UI",
    "", // icon
    "", // color
    "",
    "0",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
];

// CSV-like array: [type, path(project/category/system/...), name, dispName, description, icon, color, format path, processor path, processing interval, store path]
const elementPerSystem = [
  [
    "folder",
    "/sample/system/collector", // /project/category/system of folder
    "common", // name
    "", // dispName
    "", // description
    "", // icon
    "", // color
    "", // format path
    "", // processor path
    "", // processing interval in msec
    "", // store path
  ],
  [
     "folder",
    "/sample/system/collector/common", // /project/category/system/folder
    "cpu", // name
    "CPU 사용량", // dispName
    "CPU 사용량", // description
    "", // icon
    "", // color
    "/system/cpu", // format path
    "", // processor path
    "1000", // processing interval in msec
    "/memory/1day", // store path
  ],
  [
    "folder",
    "/sample/system/collector/common", // /project/category/system/folder
    "memory",
    "메모리 사용량",
    "메모리 사용량",
    "",
    "",
    "/system/memory",
    "",
    "1000",
    "/memory/1day",
  ],
  [
     "folder",
    "/sample/system/collector/common", // /project/category/system/folder

    "disk",
    "디스크 사용량",
    "디스크 사용량",
    "",
    "",
    "/system/disk",
    "",
    "1000",
    "/memory/1day",
  ],
  [
     "folder",
    "/sample/system/collector/common", // /project/category/system/folder
    "network",
    "네트워크 사용량",
    "네트워크 사용량",
    "",
    "",
    "/system/network",
    "",
    "1000",
    "/memory/1day",
  ],
];

//console.log(fieldPaths);
