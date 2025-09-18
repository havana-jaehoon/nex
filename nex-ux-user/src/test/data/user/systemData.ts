// CSV-like array: [type, path, name, dispName, description, icon, color, address_ip, address_port, hdfs_ip, hdfs_port, hdfs_path, db_ip, db_port, db_id, db_passwd, db_name]

import { NexNodeType } from "type/NexNode";

export const systemData = [
  [
    "/config",
    {
      name: "config",
      dispName: "설정서버",
      description: "설정 서버",
      type: NexNodeType.SYSTEM,
      address: {
        // api address
        ip: "192.168.0.1",
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
  ],
  [
    "/webserver",
    {
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
  ],
  [
    "/collector",
    {
      name: "collector",
      dispName: "수집서버",
      description: "EMU150-CBM 수집서버",
      type: NexNodeType.SYSTEM,
      address: {
        ip: "192.168.0.3",
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
  ],
];
