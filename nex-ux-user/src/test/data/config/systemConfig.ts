import { NexNodeType, NexSystemNode } from "type/NexNode";

const systemConfig: NexSystemNode[] = [
  {
    project: "/emu150cbm", // project path
    name: "collector",
    dispName: "수집서버",
    description: "EMU150-CBM 수집서버",
    type: NexNodeType.SYSTEM,
    address: {
      // api address
      ip: "192.168.0.1",
      port: "8080",
    },
    //향후 storage 별도 분리
    /*
        storage: [ //storage path List
            "/hdfs",
            "/db/oracle",
            "/db/mysql",
            "/db/postgresql"
        ]
        */
    hdfs: {
      ip: "192.168.0.20",
      port: "9000",
      path: "/nex/data",
    },
    db: {
      ip: "192.168.0.30",
      port: "5432",
      user: "nex",
      password: "nex123",
      database: "nex",
    },
  },
  {
    project: "/emu150cbm", // project path
    name: "webserver",
    dispName: "웹서버",
    description: "EMU150-CBM 웹서버",
    type: NexNodeType.SYSTEM,
    address: {
      // api address
      ip: "192.168.0.2",
      port: "8080",
    },
    hdfs: {
      ip: "192.168.0.20",
      port: "9000",
      path: "/nex/data",
    },
    db: {
      ip: "192.168.0.30",
      port: "5432",
      user: "nex",
      password: "nex123",
      database: "nex",
    },
  },
  {
    project: "/admin", // project path
    name: "webserver",
    dispName: "웹서버",
    description: "Admin 웹서버",
    type: NexNodeType.SYSTEM,
    address: {
      // api address
      ip: "192.168.0.2",
      port: "8080",
    },
    hdfs: {
      ip: "192.168.0.20",
      port: "9000",
      path: "/nex/data",
    },
    db: {
      ip: "192.168.0.30",
      port: "5432",
      user: "nex",
      password: "nex123",
      database: "nex",
    },
  },
];
