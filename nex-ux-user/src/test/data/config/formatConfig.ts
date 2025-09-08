import { features } from "process";
import { NexFormat, NexNode } from "type/NexNode";

// 0, common folder format
// CSV-like array: [type, path, name, dispName, description, icon, color]
const adminFolderFormat = {
  name: "folder",
  dispName: "폴더",
  description: "프로젝트 데이터 포맷",
  type: "format",
  features: [
    {
      name: "type",
      dispName: "타입",
      icon: null,
      color: null,
      type: "feature",
      isKey: false,
      featureType: "STRING",
    },
    {
      name: "project",
      dispName: "프로젝트",
      icon: null,
      color: null,
      type: "feature",
      isKey: false,
      featureType: "STRING",
    },
    {
      name: "system",
      dispName: "시스템",
      icon: null,
      color: null,
      type: "feature",
      isKey: false,
      featureType: "STRING",
    },
    {
      name: "path",
      dispName: "경로",
      icon: null,
      color: null,
      type: "feature",
      isKey: false,
      featureType: "STRING",
    },
    {
      name: "name",
      dispName: "이름",
      icon: null,
      color: null,
      type: "feature",
      isKey: false,
      featureType: "STRING",
    },
    {
      name: "dispName",
      dispName: "시스템 출력 이름",
      icon: null,
      color: null,
      type: "feature",
      isKey: false,
      featureType: "STRING",
    },
    {
      name: "description",
      dispName: "설명",
      icon: null,
      color: null,
      type: "feature",
      isKey: false,
      featureType: "STRING",
    },
    {
      name: "icon",
      dispName: "아이콘",
      icon: null,
      color: null,
      type: "feature",
      isKey: false,
      featureType: "STRING",
    },
    {
      name: "color",
      dispName: "컬러 코드",
      icon: null,
      color: null,
      type: "feature",
      isKey: false,
      featureType: "STRING",
    },
  ],
};
// format Group for admin
// 1. project : folder, project format
const adminProjectFormat = {
  name: "projectGroup",
  dispName: "프로젝트 포맷 그룹",
  description: "프로젝트 포맷 그룹 정보",
  type: "folder",
  children: [
    // 폴더 데이터
    adminFolderFormat,

    // 프로젝트 데이터
    // CSV-like array: [type, path, name, dispName, description, icon, color]
    {
      name: "project",
      dispName: "프로젝트",
      description: "프로젝트 데이터 포맷",
      type: "format",
      features: [
        {
          name: "type",
          dispName: "타입",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "project",
          dispName: "프로젝트",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "system",
          dispName: "시스템",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "path",
          dispName: "경로",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "name",
          dispName: "프로젝트 명",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "dispName",
          dispName: "시스템 출력 이름",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "description",
          dispName: "설명",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "icon",
          dispName: "아이콘",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "color",
          dispName: "컬러 코드",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
      ],
    },
  ],
};

// 2. format : folder, project, feature
const adminFormatFormat = {
  name: "formatGroup",
  dispName: "포맷 설정 그룹",
  description: "포맷 포맷 그룹 정보",
  type: "folder",
  children: [
    adminFolderFormat,
    // Format 데이터
    // CSV-like array: [type, path, name, dispName, description, icon, color, features]
    {
      name: "format",
      dispName: "데이터 유형",
      description: "데이터 유형 정보",
      type: "format",
      features: [
        {
          name: "type",
          dispName: "타입",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "project",
          dispName: "프로젝트",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        {
          name: "system",
          dispName: "시스템",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        {
          name: "path",
          dispName: "경로",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        {
          name: "name",
          dispName: "데이터 유형 이름",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING", // 데이터 유형 이름은 문자열로 처리
        },
        {
          name: "dispName",
          dispName: "데이터 유형 출력 이름",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "description",
          dispName: "설명",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
      ],
    },
    // feature 데이터
    // CSV-like array: [type, path, project, name, dispName, description, type, featureType, icon, color, ]
    {
      name: "feature",
      dispName: "데이터 속성",
      description: "데이터 속성 정보",
      type: "format",
      features: [
        {
          name: "type",
          dispName: "타입",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "project",
          dispName: "프로젝트",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        {
          name: "system",
          dispName: "시스템",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        {
          name: "path", // format Path :  /project/format(category)/folder/formatName
          dispName: "경로",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        // feature의 기본 속성들
        // feature의 이름, 출력 이름, 설명, 유형, 데이터 유형, 아이콘, 컬러 코드
        {
          name: "name",
          dispName: "속성 이름",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING", // 속성 이름은 문자열로 처리
        },
        {
          name: "dispName",
          dispName: "속성 출력 이름",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "description",
          dispName: "설명",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "icon",
          dispName: "아이콘",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 아이콘은 문자열로 처리
        },
        {
          name: "color",
          dispName: "컬러 코드",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 컬러 코드는 문자열로 처리
        },
        {
          name: "isKey",
          dispName: "키 여부",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "literals", // 컬러 코드는 문자열로 처리
          literals: [
            { value: false, description: "일반 속성", icon: "", color: "" },
            { value: true, description: "키 속성", icon: "", color: "" },
          ],
        },
        {
          name: "featureType",
          dispName: "속성 데이터 유형",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "string", // 속성 데이터 유형은 문자열로 처리 (예: "STRING", "UINT32")
        },
        {
          name: "literals",
          dispName: "리터럴 값",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "records", //
          records: ["value", "description", "icon", "color"],
        },
      ],
    },
  ],
};

// 3. store : folder, store
const adminStoreFormat = {
  name: "storeGroup",
  dispName: "저장 정책 포맷 그룹",
  description: "저장 정책 포맷 그룹 정보",
  type: "folder",
  children: [
    adminFolderFormat,
    // CSV-like array: [project, path, name, dispName, description, rec_type, rec_unit, rec_block_unit, rec_expire, rec_allowDuplication, rec_allowKeepValue, icon, color, ]
    {
      name: "store",
      dispName: "저장 정책",
      description: "저장 정책 정보",
      type: "format",
      features: [
        {
          name: "type",
          dispName: "타입",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "project",
          dispName: "프로젝트",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        {
          name: "system",
          dispName: "시스템",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        {
          name: "path", // format Path :  /project/store(category)/folder/storeName
          dispName: "경로",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        {
          name: "name",
          dispName: "저장 정책 이름",
          description: "저장 정책 이름",
          type: "feature",
          featureType: "STRING",
          isKey: true,
          icon: null,
          color: null,
        },
        {
          name: "dispName",
          dispName: "저장 정책 출력 이름",
          description: "저장 정책 출력 이름",
          type: "feature",
          featureType: "STRING",
          isKey: false,
          icon: null,
          color: null,
        },
        {
          name: "description",
          dispName: "설명",
          description: "저장 정책 설명",
          type: "feature",
          featureType: "STRING",
          isKey: false,
          icon: null,
          color: null,
        },
        {
          name: "icon",
          dispName: "아이콘",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "color",
          dispName: "컬러 코드",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "record",
          dispName: "저장 속성",
          description: "저장 정책에 세부 속성들 그룹",
          type: "feature",
          featureType: "attributes",
          attributes: [
            {
              name: "storage", // 기록 유형
              dispName: "저장 매체",
              description: "저장 매체", // memory, disk, hdfs
              type: "feature",
              featureType: "literals", // 기록 유형은 문자열로 처리
              literals: [
                {
                  value: "memory",
                  description: "메모리",
                  icon: "/system/memory",
                  color: "",
                },
                {
                  value: "disk",
                  description: "디스크",
                  icon: "/system/disk",
                  color: "",
                },
                {
                  value: "hdfs",
                  description: "HDFS",
                  icon: "/system/hdfs",
                  color: "",
                },
              ],
              isKey: false,
              icon: null,
              color: null,
            },
            {
              name: "nature", // 기록 유형
              dispName: "데이터 성격",
              description: "데이터 성격", // "'static': 정적 데이터, 'temporary': 시간 데이터 "
              type: "feature",
              featureType: "literals", // 기록 유형은 문자열로 처리
              literals: [
                {
                  value: "static",
                  description: "정적데이터",
                  icon: "",
                  color: "",
                },
                {
                  value: "temporary",
                  description: "시간데이터",
                  icon: "",
                  color: "",
                },
              ],
              isKey: false,
              icon: null,
              color: null,
            },
            {
              name: "unit", // 기록 단위
              dispName: "데이터 단위",
              description: "데이터 단위",
              type: "feature",
              featureType: "literals", // 기록 단위는 문자열로 처리
              // 일반적인 비주기 데이터 : "NONE"
              // 주기 데이터 "MSEC" | "SEC" | "MIN" | "HOUR" | "DAY" | "MONTH" | "YEAR"
              literals: [
                { value: "NONE", description: "미지정", icon: "", color: "" },
                {
                  value: "MSEC",
                  description: "Milli-Second",
                  icon: "",
                  color: "",
                },
                { value: "SEC", description: "Second", icon: "", color: "" },
                { value: "MIN", description: "Minute", icon: "", color: "" },
                { value: "HOUR", description: "Hour", icon: "", color: "" },
                { value: "DAY", description: "Day", icon: "", color: "" },
                { value: "MONTH", description: "Month", icon: "", color: "" },
                { value: "YEAR", description: "Year", icon: "", color: "" },
              ],
              isKey: false,
              icon: null,
              color: null,
            },
            {
              name: "block", // 블록 단위
              dispName: "저장 단위",
              description: "저장 단위",
              type: "feature",
              featureType: "literals", // 블록 단위는 문자열로 처리
              literals: [
                { value: "NONE", description: "None", icon: "", color: "" }, // 1파일에 저장 (unit 이 "NONE" 인경우)
                { value: "1M", description: "1MB", icon: "", color: "" }, // 1MB 단위로 저장 (unit 이 "NONE" 인경우)
                { value: "100M", description: "100MB", icon: "", color: "" }, //(unit 이 "NONE" 인경우)
                { value: "500M", description: "500MB", icon: "", color: "" }, //(unit 이 "NONE" 인경우)
                { value: "1G", description: "1GB", icon: "", color: "" }, //(unit 이 "NONE" 인경우)
                { value: "MIN", description: "MIN", icon: "", color: "" }, // "MIN" 단위로 저장 (unit 이 "SEC" 이하이 경우)
                { value: "HOUR", description: "HOUR", icon: "", color: "" },
                { value: "DAY", description: "DAY", icon: "", color: "" },
                { value: "MONTH", description: "MONTH", icon: "", color: "" },
                { value: "YEAR", description: "YEAR", icon: "", color: "" },
              ],
              isKey: false,
              icon: null,
              color: null,
            },
            {
              name: "expire", // 기록 만료 시간(초 단위)
              dispName: "만료시간",
              description: "데이터 만료 시간(초)",
              type: "feature",
              featureType: "INT64", //   0: 임시 저장(최신값만 저장), -1: 영구 저장(전체 보관),
              isKey: false,
              icon: null,
              color: null,
            },
            {
              name: "expireUnit", // 기록 단위
              dispName: "만료시간단위",
              description: "만료시간단위",
              type: "feature",
              featureType: "literals",
              literals: [
                { value: "NONE", description: "미지정", icon: "", color: "" },
                { value: "SEC", description: "Second", icon: "", color: "" },
                { value: "MIN", description: "Minute", icon: "", color: "" },
                { value: "HOUR", description: "Hour", icon: "", color: "" },
                { value: "DAY", description: "Day", icon: "", color: "" },
                { value: "MONTH", description: "Month", icon: "", color: "" },
                { value: "YEAR", description: "Year", icon: "", color: "" },
              ],
              isKey: false,
              icon: null,
              color: null,
            },
            {
              name: "allowDuplication", // 중복 허용 여부
              dispName: "중복 허용 여부",
              description: "중복 데이터를 허용하는지 여부 (true/false)",
              type: "feature",
              featureType: "BOOLEAN", // 중복 허용 여부는 불리언으로 처리
              isKey: false,
              icon: null,
              color: null,
            },
            {
              name: "allowKeepValue", // 값 유지 여부
              dispName: "값 유지 여부",
              description: "마지막 값을 유지할지 여부",
              type: "feature",
              featureType: "BOOLEAN",
              isKey: false,
              icon: null,
              color: null,
            },
          ],
        },
      ],
    },
  ],
};

// 4. processor : folder, processor
const adminProcessorFormat = {
  name: "processorGroup",
  dispName: "프로세서 포맷 그룹",
  description: "프로세서 포맷 그룹 정보",
  type: "folder",
  children: [
    adminFolderFormat,
    // Processor 데이터
    // CSV-like array: [project, path, name, dispName, description, module_version, module_history, icon, color]
    {
      name: "processor",
      dispName: "데이터 수집 및 처리 모듈",
      description: "데이터 수집 및 처리 모듈 정보",
      type: "format",
      features: [
        {
          name: "type",
          dispName: "타입",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "project",
          dispName: "프로젝트",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        {
          name: "system",
          dispName: "시스템",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        {
          name: "path", // format Path :  /project/format(category)/folder/formatName
          dispName: "경로",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        {
          name: "name",
          dispName: "모듈 이름",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING", // 모듈 이름은 문자열로 처리
        },
        {
          name: "dispName",
          dispName: "모듈 출력 이름",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "description",
          dispName: "설명",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "icon",
          dispName: "아이콘",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "color",
          dispName: "컬러 코드",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "module",
          dispName: "모듈 정보",
          description: "모듈 정보",
          type: "feature",
          isKey: false,
          featureType: "attributes",
          attributes: [
            {
              name: "version", // 모듈 버전
              dispName: "모듈 버전",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "STRING", // 모듈 버전은 문자열로 처리
            },
            {
              name: "history", // 모듈 히스토리
              dispName: "모듈 히스토리",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "STRING", // 모듈 히스토리는 문자열로 처리
            },
          ],
        },
      ],
    },
  ],
};
// 폴더 데이터

// 5. system : system format
// System 데이터
// CSV-like array: [type, path, name, dispName, description, icon, color, address_ip, address_port, hdfs_ip, hdfs_port, hdfs_path, db_ip, db_port, db_id, db_passwd, db_name]
const adminSystemFormat = {
  name: "systemGroup",
  dispName: "시스템 포맷 그룹",
  description: "시스템 포맷 그룹 정보",
  type: "folder",
  children: [
    adminFolderFormat,
    // System 데이터
    {
      name: "system",
      dispName: "시스템",
      description: "시스템 데이터 포맷",
      type: "format",
      features: [
        {
          name: "type",
          dispName: "타입",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "project",
          dispName: "프로젝트",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "system",
          dispName: "시스템",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "path",
          dispName: "경로",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "name",
          dispName: "시스템명",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "dispName",
          dispName: "시스템 출력 이름",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "description",
          dispName: "설명",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "icon",
          dispName: "아이콘",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "color",
          dispName: "컬러 코드",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "address",
          dispName: "주소",
          icon: null,
          color: null,
          type: "feature",
          featureType: "attributes",
          attributes: [
            {
              name: "ip",
              dispName: "IP 주소",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "STRING", // IP 주소는 문자열로 처리
            },
            {
              name: "port",
              dispName: "포트 번호",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "UINT32",
            },
          ],
        },
        {
          name: "hdfs",
          dispName: "HDFS",
          icon: null,
          color: null,
          type: "feature",
          featureType: "attributes",
          attributes: [
            {
              name: "ip",
              dispName: "HDFS IP 주소",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "STRING", // HDFS IP 주소는 문자열로 처리
            },
            {
              name: "port",
              dispName: "HDFS 포트 번호",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "UINT32",
            },
            {
              name: "path",
              dispName: "HDFS 경로",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "STRING", // HDFS 경로는 문자열로 처리
            },
          ],
        },
        {
          name: "db",
          dispName: "DB",
          icon: null,
          color: null,
          type: "feature",
          featureType: "attributes",
          attributes: [
            {
              name: "ip",
              dispName: "DB IP 주소",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "STRING", // DB IP 주소는 문자열로 처리
            },
            {
              name: "port",
              dispName: "DB 포트 번호",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "UINT32",
            },
            {
              name: "id",
              dispName: "DB 사용자 ID",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "STRING", // DB 사용자 ID는 문자열로 처리
            },
            {
              name: "passwd",
              dispName: "DB 비밀번호",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "STRING", // DB 비밀번호는 문자열로 처리
            },
            {
              name: "name",
              dispName: "DB 이름",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "STRING", // DB 이름은 문자열로 처리
            },
          ],
        },
      ],
    },
  ],
};

const adminElementsFormat = {
  name: "elementsGroup",
  dispName: "엘리먼트 포맷 그룹",
  description: "엘리먼트 데이터 포맷 그룹 정보",
  type: "folder",
  children: [
    adminFolderFormat,
    // Element 데이터
    // CSV-like array: [type, path, name, dispName, description, icon, color, format, store, processor, processingInterval, processorUnit, source]
    {
      name: "element",
      dispName: "엘리먼트",
      description: "엘리먼트 데이터 포맷",
      type: "format",
      features: [
        // 엘리먼트의 기본 속성들
        {
          name: "type",
          dispName: "타입",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "project",
          dispName: "프로젝트",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        {
          name: "system",
          dispName: "시스템",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        {
          name: "path",
          dispName: "경로",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        {
          name: "name",
          dispName: "엘리먼트 이름",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        {
          name: "dispName",
          dispName: "엘리먼트 출력 이름",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "description",
          dispName: "설명",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "icon",
          dispName: "아이콘",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "color",
          dispName: "컬러 코드",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "format",
          dispName: "데이터 포맷 경로",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 데이터 포맷 경로는 문자열로 처리
        },
        {
          name: "store",
          dispName: "보관 정책 경로",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 보관 정책 경로는 문자열로 처리
        },
        {
          name: "processor",
          dispName: "데이터 수집 및 처리 모듈 경로",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 데이터 수집 및 처리 모듈 경로는 문자열로 처리
        },
        {
          name: "processingInterval", // 데이터 수집 주기
          dispName: "수집 주기(초)",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "UINT32",
        },
        {
          name: "processingUnit", // 데이터 수집 주기 단위
          dispName: "수집 주기 단위",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 수집 주기 단위는 문자열로 처리 (예: "SEC", "MIN", "HOUR")
        },
        {
          name: "source",
          dispName: "데이터 소스 경로",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 데이터 소스 경로는 문자열로 처리
        },
      ],
    },
  ],
};

// websection : folder, websection, contents, selector, conditioner
const adminWebsectionFormat = {
  name: "websectionGroup",
  dispName: "웹 섹션 포맷 그룹",
  description: "웹 섹션 포맷 그룹 정보",
  type: "folder",
  children: [
    {
      name: "folder",
      dispName: "폴더",
      description: "프로젝트 데이터 포맷",
      type: "format",
      features: [
        {
          name: "type",
          dispName: "타입",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "project",
          dispName: "프로젝트",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "system",
          dispName: "시스템",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "path",
          dispName: "경로",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "name",
          dispName: "이름",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "dispName",
          dispName: "시스템 출력 이름",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "description",
          dispName: "설명",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "icon",
          dispName: "아이콘",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "color",
          dispName: "컬러 코드",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
      ],
    },
    {
      name: "websection",
      dispName: "웹 섹션",
      description: "웹 섹션 데이터 포맷",
      type: "format",
      features: [
        {
          name: "type",
          dispName: "타입",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 웹 섹션 타입은 문자열로 처리
        },
        {
          name: "project",
          dispName: "프로젝트",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        {
          name: "system",
          dispName: "시스템",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING",
        },
        {
          name: "path",
          dispName: "경로",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING", // 웹 섹션 경로는 문자열로 처리
        },
        {
          name: "name",
          dispName: "웹 섹션 이름",
          icon: null,
          color: null,
          type: "feature",
          isKey: true,
          featureType: "STRING", // 웹 섹션 이름은 문자열로 처리
        },
        {
          name: "dispName",
          dispName: "웹 섹션 출력 이름",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 웹 섹션 출력 이름은 문자열로 처리
        },
        {
          name: "description",
          dispName: "설명",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 웹 섹션 설명은 문자열로 처리
        },
        {
          name: "icon",
          dispName: "아이콘",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 아이콘은 문자열로 처리
        },
        {
          name: "color",
          dispName: "컬러 코드",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 컬러 코드는 문자열로 처리
        },
        {
          name: "isRoute", // 경로
          dispName: '경로 (예시 : "/home" 또는 "/dashboard")',
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "BOOLEAN", // 경로는 문자열로 처리
        },
        {
          name: "route", // 경로
          dispName: '경로 (예시 : "/home" 또는 "/dashboard")',
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 경로는 문자열로 처리
        },

        {
          name: "direction", // 방향
          dispName: "방향 (예시 : 'column' 또는 'row')",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 방향은 문자열로 처리
        },
        {
          name: "size", // 크기
          dispName: "크기 (예시 : '1rem', '1px')",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 크기는 문자열로 처리
        },
        {
          name: "padding",
          dispName: "패딩",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", //문자열로 처리
        },
        {
          name: "applet", // applet 경로
          dispName: "Applet Path",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", //
        },
      ],
    },
    {
      name: "contents",
      dispName: "웹 데이터 컨텐츠",
      description: "웹 데이터 컨텐츠 포맷",
      type: "format",
      isProperty: true, // property 모드 여부
      features: [
        {
          name: "type",
          dispName: "타입",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 웹 섹션 타입은 문자열로 처리
        },
        {
          name: "project",
          dispName: "프로젝트",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "system",
          dispName: "시스템",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING",
        },
        {
          name: "path",
          dispName: "경로",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 웹 섹션 경로는 문자열로 처리
        },
        {
          name: "name",
          dispName: "이름",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 웹 섹션 경로는 문자열로 처리
        },
        {
          name: "dispName",
          dispName: "출력이름",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 웹 섹션 경로는 문자열로 처리
        },
        {
          name: "element", // 경로
          dispName: '경로 (예시 : "/home" 또는 "/dashboard")',
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "STRING", // 경로는 문자열로 처리
        },
        {
          name: "conditons",
          dispName: "데이터 출력조건",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "records",
          records: ["key", "feature", "method"],
        },
        {
          name: "selections",
          dispName: "데이터 출력조건",
          icon: null,
          color: null,
          type: "feature",
          isKey: false,
          featureType: "selections",
          records: ["key", "feature"],
        },
      ],
    },
  ],
};

const emu150FormatData = {
  name: "emu150cbm",
  dispName: "emu150cbm 설정 데이터",
  description: "emu150cbm 설정 데이터 엘리먼트 폴더",
  type: "folder",

  children: [
    {
      name: "config",
      dispName: "설정 데이터",
      description: "설정 데이터 엘리먼트 폴더",
      type: "folder",
      children: [
        {
          name: "Line",
          dispName: "호선",
          description: "호선 데이터 포맷",
          type: "format",
          features: [
            {
              name: "name",
              dispName: "호선명",
              icon: null,
              color: null,
              type: "feature",
              isKey: true,
              featureType: "literals", // 호선명은 문자열로 처리
              literals: [
                {
                  value: "경부선",
                  description: "경부선",
                  icon: "",
                  color: "#003da5",
                }, // blue
                {
                  value: "호남선",
                  description: "호남선",
                  icon: "",
                  color: "#d50032",
                }, // red
                {
                  value: "전라선",
                  description: "전라선",
                  icon: "",
                  color: "#73c42d",
                }, // green
                {
                  value: "동해선",
                  description: "동해선",
                  icon: "",
                  color: "#d96b80",
                }, // pink
                {
                  value: "태백선",
                  description: "태백선",
                  icon: "",
                  color: "#7ba05b",
                }, // orange
                {
                  value: "미배치",
                  description: "미배치",
                  icon: "",
                  color: "#adb81d",
                }, // yellow
              ],
            },
          ],
        },
        {
          name: "TrainPerLine",
          dispName: "노선별편성정보",
          description: "노선별편성정보 데이터 포맷",
          type: "format",
          features: [
            {
              name: "name",
              dispName: "호선명",
              icon: null,
              color: null,
              type: "feature",
              isKey: true,
              featureType: "STRING", // 호선명은 문자열로 처리
            },
            {
              name: "train",
              dispName: "편성번호",
              icon: null,
              color: null,
              type: "feature",
              isKey: true,
              featureType: "STRING", // 호선명은 문자열로 처리
            },
          ],
        },
        {
          name: "CarPerTrain",
          dispName: "편성별차량정보",
          description: "편성별차량정보 데이터 포맷",
          type: "format",
          features: [
            {
              name: "name",
              dispName: "호선명",
              icon: null,
              color: null,
              type: "feature",
              isKey: true,
              featureType: "STRING", // 호선명은 문자열로 처리
            },
            {
              name: "train",
              dispName: "편성번호",
              icon: null,
              color: null,
              type: "feature",
              isKey: true,
              featureType: "STRING", // 호선명은 문자열로 처리
            },
            {
              name: "car",
              dispName: "차량번호",
              icon: null,
              color: null,
              type: "feature",
              isKey: true,
              featureType: "STRING", // 차량번호는 문자열로 처리
            },
          ],
        },
        {
          name: "DevicePerCar",
          dispName: "차량별장치정보",
          description: "차량별장치정보 데이터 포맷",
          type: "format",
          features: [
            {
              name: "name",
              dispName: "호선명",
              icon: null,
              color: null,
              type: "feature",
              isKey: true,
              featureType: "STRING", // 호선명은 문자열로 처리
            },
            {
              name: "train",
              dispName: "편성번호",
              icon: null,
              color: null,
              type: "feature",
              isKey: true,
              featureType: "STRING", // 호선명은 문자열로 처리
            },
            {
              name: "car",
              dispName: "차량번호",
              icon: null,
              color: null,
              type: "feature",
              isKey: true,
              featureType: "STRING", // 차량번호는 문자열로 처리
            },
            {
              name: "device",
              dispName: "장치번호",
              icon: null,
              color: null,
              type: "feature",
              isKey: true,
              featureType: "STRING", // 장치번호는 문자열로 처리
            },
          ],
        },
      ],
    },
    {
      name: "status",
      dispName: "상태 데이터",
      description: "상태 데이터 엘리먼트 폴더",
      type: "folder",
      children: [
        {
          name: "alert-warning",
          dispName: "주의 경고 건수",
          type: "format",
          features: [
            {
              name: "label",
              icon: null,
              color: null,
              type: "feature",
              isKey: true,
              featureType: "STRING",
            },
            {
              name: "alert",
              dispName: "경고",
              icon: null,
              color: "#f0142f",
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "warning",
              dispName: "주의",
              icon: null,
              color: "#feb200", // 찐 노랑색 #
              type: "feature",
              isKey: false,
              featureType: "UINT32",
            },
          ],
        },
        {
          name: "counting",
          dispName: "건수",
          type: "format",
          features: [
            {
              name: "label",
              dispName: "라벨",
              icon: null,
              color: null,
              type: "feature",
              isKey: true,
              featureType: "STRING",
            },
            {
              name: "count",
              dispName: "건수",
              icon: null,
              color: "#f0142f",
              type: "feature",
              isKey: false,
              featureType: "UINT32",
            },
          ],
        },
        {
          name: "TrainCountPerLine",
          dispName: "건수",
          type: "format",
          features: [
            {
              name: "line1",
              dispName: "경부선",
              icon: null,
              color: "#003da5", //blue
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line2",
              dispName: "호남선",
              icon: null,
              color: "#d50032",
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line3",
              dispName: "동해선",
              icon: null,
              color: "#d96b80",
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line4",
              dispName: "전라선",
              icon: null,
              color: "#73c42d",
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line5",
              dispName: "태백선",
              icon: null,
              color: "#7ba05b",
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line6",
              dispName: "미배치",
              icon: null,
              color: "#adb81d",
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
          ],
        },
      ],
    },
    {
      name: "event",
      dispName: "이벤트 데이터",
      description: "이벤트 데이터 엘리먼트 폴더",
      type: "folder",
      children: [
        {
          name: "RTMaintenanceInfo",
          dispName: "실시간 유지보수 정보",
          type: "format",
          features: [
            {
              name: "date",
              dispName: "날짜",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "DATE",
            },

            {
              name: "train",
              dispName: "편성번호",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "STRING",
            },
            {
              name: "car",
              dispName: "차량",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "STRING",
            },
            {
              name: "device",
              dispName: "장치",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "STRING",
            },
            {
              name: "recommendation",
              dispName: "권장조치",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "STRING",
            },
          ],
        },
        {
          name: "SystemEventInfo",
          dispName: "시스템 이벤트 정보",
          type: "format",
          features: [
            {
              name: "date",
              dispName: "날짜",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "DATE_SEC",
            },
            {
              name: "system",
              dispName: "시스템",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "STRING",
            },
            {
              name: "event",
              dispName: "이벤트명",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "STRING",
            },
            {
              name: "log",
              dispName: "시스템로그",
              icon: null,
              color: null,
              type: "feature",
              isKey: false,
              featureType: "STRING",
            },
          ],
        },
      ],
    },
    {
      name: "history",
      dispName: "이력 데이터",
      description: "이력 데이터 엘리먼트 폴더",
      type: "folder",
      children: [
        {
          name: "LossHistoryPerLine",
          dispName: "호선별 손실 이력",
          type: "format",
          features: [
            {
              name: "date",
              dispName: "날짜",
              icon: null,
              color: null,
              type: "feature",
              isKey: true,
              featureType: "DATE",
            },
            {
              name: "line1",
              dispName: "경부선",
              icon: null,
              color: "#0000FF",
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line2",
              dispName: "호남선",
              icon: null,
              color: "#FF0000", //red
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line3",
              dispName: "전라선",
              icon: null,
              color: "#FF00FF", //pink
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line4",
              dispName: "동해선",
              icon: null,
              color: "#00FF00",
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line5",
              dispName: "태백선",
              icon: null,
              color: "#FFA500", //orange
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line6",
              dispName: "미배치",
              icon: null,
              color: "#6A5ACD", //보라색
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
          ],
        },
        {
          name: "LossHistoryPerDevice",
          dispName: "장치별 열화 이력",
          type: "format",
          features: [
            {
              name: "date",
              dispName: "날짜",
              icon: null,
              color: null,
              type: "feature",
              isKey: true,
              featureType: "DATE",
            },
            {
              name: "main-transformer",
              dispName: "주변압기",
              icon: null,
              color: "#FF0000",
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "main-air-compressor",
              dispName: "주공기압축기",
              icon: null,
              color: "#00BFFF", //skyblue
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "aux-air-compressor",
              dispName: "보조공기압축기",
              icon: null,
              color: "#6A5ACD", //보라색 orange
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "door",
              dispName: "승강문",
              icon: null,
              color: "#FF00FF",
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "hvac",
              dispName: "HAVC",
              icon: null,
              color: "#00FF00",
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "traction-motor",
              dispName: "견인전동기",
              icon: null,
              color: "#FFA500",
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "fire-detector",
              dispName: "화제감지기",
              icon: null,
              color: "#FF1493", //deep pink
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "axle-bearing",
              dispName: "차축베어링",
              icon: null,
              color: "#0000FF", //blue
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "broadcast-device",
              dispName: "방송장치",
              icon: null,
              color: "#FF4500", //orange red
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
          ],
        },
        {
          name: "MaintenanceHistoryPerLine",
          dispName: "노선별 유지보수 이",
          type: "format",
          features: [
            {
              name: "date",
              icon: null,
              color: null,
              type: "feature",
              isKey: true,
              featureType: "STRING",
            },
            {
              name: "line1",
              dispName: "경부선",
              icon: null,
              color: "#0000FF",
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line2",
              dispName: "호남선",
              icon: null,
              color: "#FF0000", //red
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line3",
              dispName: "전라선",
              icon: null,
              color: "#FF00FF", //pink
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line4",
              dispName: "동해선",
              icon: null,
              color: "#00FF00",
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line5",
              dispName: "태백선",
              icon: null,
              color: "#FFA500", //orange
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line6",
              dispName: "미배치",
              icon: null,
              color: "#6A5ACD", //보라색
              type: "feature",
              isKey: false,
              featureType: "UINT16",
            },
          ],
        },
        {
          name: "DetailLossLevelHistory",
          dispName: "상세 열화등급 이력",
          type: "format",
          features: [
            {
              name: "date",
              dispName: "날짜",
              icon: null,
              color: null,
              type: "feature",
              isKey: true,
              featureType: "DATE",
            },
            {
              name: "line",
              dispName: "노선",
              icon: null,
              color: "#FF0000",
              type: "feature",
              isKey: true,
              featureType: "literals",
              literals: [
                {
                  value: "경부선",
                  description: "경부선",
                  icon: "",
                  color: "#003da5",
                }, // blue
                {
                  value: "호남선",
                  description: "호남선",
                  icon: "",
                  color: "#d50032",
                }, // red
                {
                  value: "전라선",
                  description: "전라선",
                  icon: "",
                  color: "#73c42d",
                }, // green
                {
                  value: "동해선",
                  description: "동해선",
                  icon: "",
                  color: "#d96b80",
                }, // pink
                {
                  value: "태백선",
                  description: "태백선",
                  icon: "",
                  color: "#7ba05b",
                }, // orange
                {
                  value: "미배치",
                  description: "미배치",
                  icon: "",
                  color: "#adb81d",
                }, // yellow
              ],
            },
            {
              name: "train",
              dispName: "편성",
              icon: null,
              color: "#00BFFF", //skyblue
              type: "feature",
              isKey: true,
              featureType: "STRING",
            },
            {
              name: "car",
              dispName: "차량",
              icon: null,
              color: "#6A5ACD", //보라색 orange
              type: "feature",
              isKey: true,
              featureType: "STRING",
              categorys: ["TC1", "M1", "M2", "TC2"],
            },
            {
              name: "device",
              dispName: "장치",
              icon: null,
              color: "#FF00FF",
              type: "feature",
              isKey: true,
              featureType: "STRING",
              categorys: [
                "승강문",
                "주변압기",
                "주공기압축기",
                "보조공기압축기",
                "HAVC",
                "화제감지기",
                "차축베어링",
                "방송장치",
              ],
            },
            {
              name: "loss-level",
              dispName: "등급",
              icon: null,
              color: "#00FF00",
              type: "feature",
              isKey: false,
              featureType: "STRING",
              categorys: ["정상", "주의", "경고"],
            },
          ],
        },
      ],
    },
  ],
};

export const adminFormatConfig = [
  // project Group
  adminProjectFormat,
  adminFormatFormat,
  adminStoreFormat,
  adminProcessorFormat,
  // system format
  adminSystemFormat,

  adminElementsFormat,

  adminWebsectionFormat,

  // Theme 데이터
  // CSV-like array: [ name, dispName, description, icon, color]
  {
    name: "theme",
    dispName: "테마",
    description: "테마 데이터 포맷",
    type: "format",
    features: [
      {
        name: "type",
        dispName: "타입",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING",
      },
      {
        name: "project",
        dispName: "프로젝트",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING",
      },
      {
        name: "system",
        dispName: "시스템",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING",
      },
      {
        name: "name",
        dispName: "테마 이름",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING", // 테마 이름은 문자열로 처리
      },
      {
        name: "dispName",
        dispName: "테마 출력 이름",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING",
      },
      {
        name: "description",
        dispName: "설명",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING",
      },
      {
        name: "icon",
        dispName: "아이콘",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING",
      },
      {
        name: "color",
        dispName: "컬러 코드",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING", // 컬러 코드는 문자열로 처리
      },
    ],
  },
  // Theme Category 데이터
  // CSV-like array: [ themeName, name, dispName, description, icon, color ]
  {
    name: "themeCategory",
    dispName: "테마 카테고리",
    description: "테마 카테고리 데이터 포맷",
    type: "format",
    features: [
      {
        name: "type",
        dispName: "타입",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING",
      },
      {
        name: "project",
        dispName: "프로젝트",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING",
      },
      {
        name: "system",
        dispName: "시스템",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING",
      },
      {
        name: "themeName",
        dispName: "테마 이름",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING", // 테마 이름은 문자열로 처리
      },
      {
        name: "name",
        dispName: "카테고리 이름",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING", // 카테고리 이름은 문자열로 처리
      },
      {
        name: "dispName",
        dispName: "카테고리 출력 이름",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING",
      },
      {
        name: "description",
        dispName: "설명",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING",
      },
      {
        name: "icon",
        dispName: "아이콘",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING", // 아이콘은 문자열로 처리
      },
      {
        name: "color",
        dispName: "컬러 코드",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING", // 컬러 코드는 문자열로 처리
      },
    ],
  },

  // Theme Attribute 데이터
  // name 이    NexThemeStyle 의 key 값이 됨.
  // CSV-like array: [ themeName, themeCategory, name, dispName, description, value ]
  {
    name: "themeAttribute",
    dispName: "테마 속성",
    description: "테마 속성 데이터 포맷",
    type: "format",
    features: [
      {
        name: "type",
        dispName: "타입",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING",
      },
      {
        name: "project",
        dispName: "프로젝트",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING",
      },
      {
        name: "system",
        dispName: "시스템",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING",
      },
      {
        name: "theme",
        dispName: "테마",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING", // 테마 이름은 문자열로 처리
      },
      {
        name: "category",
        dispName: "카테고리",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING", // 테마 이름은 문자열로 처리
      },
      {
        name: "name",
        dispName: "속성 이름",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING", // 속성 이름은 문자열로 처리
      },
      {
        name: "dispName",
        dispName: "속성 출력 이름",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING",
      },
      {
        name: "description",
        dispName: "설명",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING",
      },
      {
        name: "value",
        dispName: "값",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING", // 값은 문자열로 처리
      },
    ],
  },

  // Theme User 데이터
  // CSV-like array: [ themeName, userId, dispName, description, fontLevel, icon, color ]
  {
    name: "themeUser",
    dispName: "테마 사용자",
    description: "테마 사용자 데이터 포맷",
    type: "format",
    features: [
      {
        name: "type",
        dispName: "타입",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING",
      },
      {
        name: "project",
        dispName: "프로젝트",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING",
      },
      {
        name: "system",
        dispName: "시스템",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING",
      },
      {
        name: "themeName",
        dispName: "테마 이름",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING", // 테마 이름은 문자열로 처리
      },
      {
        name: "userId",
        dispName: "사용자 ID",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING", // 사용자 ID는 문자열로 처리
      },
      {
        name: "dispName",
        dispName: "사용자 출력 이름",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING",
      },
      {
        name: "description",
        dispName: "설명",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING",
      },
      {
        name: "fontLevel",
        dispName: "글꼴 크기 레벨",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "UINT32", // 글꼴 크기 레벨은 정수로 처리
      },
      {
        name: "icon",
        dispName: "아이콘",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING", // 아이콘은 문자열로 처리
      },
      {
        name: "color",
        dispName: "컬러 코드",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING", // 컬러 코드는 문자열로 처리
      },
    ],
  },

  // Applet 데이터
  // CSV-like array: [ type, path, name, dispName, description, icon, color, attributes ]
  {
    name: "applet",
    dispName: "애플릿",
    description: "애플릿 데이터 포맷",
    type: "format",
    features: [
      {
        name: "type",
        dispName: "타입",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING", // 애플릿 타입은 문자열로 처리
      },
      {
        name: "project",
        dispName: "프로젝트",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING",
      },
      {
        name: "system",
        dispName: "시스템",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING",
      },
      {
        name: "path",
        dispName: "경로",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING", // 애플릿 경로는 문자열로 처리
      },
      {
        name: "name",
        dispName: "애플릿 이름",
        icon: null,
        color: null,
        type: "feature",
        isKey: true,
        featureType: "STRING", // 애플릿 이름은 문자열로 처리
      },
      {
        name: "dispName",
        dispName: "애플릿 출력 이름",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING", // 애플릿 출력 이름은 문자열로 처리
      },
      {
        name: "description",
        dispName: "설명",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING", // 애플릿 설명은 문자열로 처리
      },
      {
        name: "icon",
        dispName: "아이콘",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING", // 아이콘은 문자열로 처리
      },
      {
        name: "color",
        dispName: "컬러 코드",
        icon: null,
        color: null,
        type: "feature",
        isKey: false,
        featureType: "STRING", // 컬러 코드는 문자열로 처리
      },
    ],
  },

  //...emu150FormatData,
];

export const formatConfig: NexNode[] = [
  {
    name: "web",
    dispName: "web 데이터 포맷",
    description: "WEB UI 용 데이터 유형 폴더",
    type: "folder",
    children: [
      {
        name: "menu",
        dispName: "메뉴리스트",
        description: "메뉴리스트",
        type: "format",
        features: [
          {
            name: "type",
            dispName: "Type",
            icon: null,
            color: null,
            type: "feature",
            isKey: false,
            featureType: "STRING",
          },
          {
            name: "path",
            dispName: "Path",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "STRING",
          },
          {
            name: "name",
            dispName: "이름",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "STRING",
          },
          {
            name: "dispName",
            dispName: "표시 이름",
            icon: null,
            color: null,
            type: "feature",
            isKey: false,
            featureType: "STRING",
          },
          {
            name: "description",
            dispName: "설명",
            icon: null,
            color: null,
            type: "feature",
            isKey: false,
            featureType: "STRING",
          },
          {
            name: "icon",
            dispName: "아이콘",
            icon: null,
            color: null,
            type: "feature",
            isKey: false,
            featureType: "STRING",
          },
          {
            name: "color",
            dispName: "컬러 코드",
            icon: null,
            color: null,
            type: "feature",
            isKey: false,
            featureType: "STRING",
          },
          {
            name: "route",
            dispName: "라우트",
            icon: null,
            color: null,
            type: "feature",
            isKey: false,
            featureType: "STRING",
          },
        ],
      },
    ],
  },
  {
    name: "admin",
    dispName: "관리자용 데이터",
    description: "관리자용 데이터 엘리먼트 폴더",
    type: "folder",
    children: [
      ...adminFormatConfig, // 관리자용 데이터 포맷 설정
    ],
  },

  {
    name: "config",
    dispName: "설정 데이터",
    description: "설정 데이터 엘리먼트 폴더",
    type: "folder",
    children: [
      {
        name: "Line",
        dispName: "호선",
        description: "호선 데이터 포맷",
        type: "format",
        features: [
          {
            name: "name",
            dispName: "호선명",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "literals", // 호선명은 문자열로 처리
            literals: [
              {
                value: "경부선",
                description: "경부선",
                icon: "",
                color: "#003da5",
              }, // blue
              {
                value: "호남선",
                description: "호남선",
                icon: "",
                color: "#d50032",
              }, // red
              {
                value: "전라선",
                description: "전라선",
                icon: "",
                color: "#73c42d",
              }, // green
              {
                value: "동해선",
                description: "동해선",
                icon: "",
                color: "#d96b80",
              }, // pink
              {
                value: "태백선",
                description: "태백선",
                icon: "",
                color: "#7ba05b",
              }, // orange
              {
                value: "미배치",
                description: "미배치",
                icon: "",
                color: "#adb81d",
              }, // yellow
            ],
          },
        ],
      },
      {
        name: "TrainPerLine",
        dispName: "노선별편성정보",
        description: "노선별편성정보 데이터 포맷",
        type: "format",
        features: [
          {
            name: "name",
            dispName: "호선명",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "STRING", // 호선명은 문자열로 처리
          },
          {
            name: "train",
            dispName: "편성번호",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "STRING", // 호선명은 문자열로 처리
          },
        ],
      },
      {
        name: "CarPerTrain",
        dispName: "편성별차량정보",
        description: "편성별차량정보 데이터 포맷",
        type: "format",
        features: [
          {
            name: "name",
            dispName: "호선명",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "STRING", // 호선명은 문자열로 처리
          },
          {
            name: "train",
            dispName: "편성번호",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "STRING", // 호선명은 문자열로 처리
          },
          {
            name: "car",
            dispName: "차량번호",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "STRING", // 차량번호는 문자열로 처리
          },
        ],
      },
      {
        name: "DevicePerCar",
        dispName: "차량별장치정보",
        description: "차량별장치정보 데이터 포맷",
        type: "format",
        features: [
          {
            name: "name",
            dispName: "호선명",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "STRING", // 호선명은 문자열로 처리
          },
          {
            name: "train",
            dispName: "편성번호",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "STRING", // 호선명은 문자열로 처리
          },
          {
            name: "car",
            dispName: "차량번호",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "STRING", // 차량번호는 문자열로 처리
          },
          {
            name: "device",
            dispName: "장치번호",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "STRING", // 장치번호는 문자열로 처리
          },
        ],
      },
    ],
  },
  {
    name: "status",
    dispName: "상태 데이터",
    description: "상태 데이터 엘리먼트 폴더",
    type: "folder",
    children: [
      {
        name: "alert-warning",
        dispName: "주의 경고 건수",
        type: "format",
        features: [
          {
            name: "label",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "STRING",
          },
          {
            name: "alert",
            dispName: "경고",
            icon: null,
            color: "#f0142f",
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "warning",
            dispName: "주의",
            icon: null,
            color: "#feb200", // 찐 노랑색 #
            type: "feature",
            isKey: false,
            featureType: "UINT32",
          },
        ],
      },
      {
        name: "counting",
        dispName: "건수",
        type: "format",
        features: [
          {
            name: "label",
            dispName: "라벨",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "STRING",
          },
          {
            name: "count",
            dispName: "건수",
            icon: null,
            color: "#f0142f",
            type: "feature",
            isKey: false,
            featureType: "UINT32",
          },
        ],
      },
      {
        name: "TrainCountPerLine",
        dispName: "건수",
        type: "format",
        features: [
          {
            name: "line1",
            dispName: "경부선",
            icon: null,
            color: "#003da5", //blue
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "line2",
            dispName: "호남선",
            icon: null,
            color: "#d50032",
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "line3",
            dispName: "동해선",
            icon: null,
            color: "#d96b80",
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "line4",
            dispName: "전라선",
            icon: null,
            color: "#73c42d",
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "line5",
            dispName: "태백선",
            icon: null,
            color: "#7ba05b",
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "line6",
            dispName: "미배치",
            icon: null,
            color: "#adb81d",
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
        ],
      },
    ],
  },
  {
    name: "event",
    dispName: "이벤트 데이터",
    description: "이벤트 데이터 엘리먼트 폴더",
    type: "folder",
    children: [
      {
        name: "RTMaintenanceInfo",
        dispName: "실시간 유지보수 정보",
        type: "format",
        features: [
          {
            name: "date",
            dispName: "날짜",
            icon: null,
            color: null,
            type: "feature",
            isKey: false,
            featureType: "DATE",
          },

          {
            name: "train",
            dispName: "편성번호",
            icon: null,
            color: null,
            type: "feature",
            isKey: false,
            featureType: "STRING",
          },
          {
            name: "car",
            dispName: "차량",
            icon: null,
            color: null,
            type: "feature",
            isKey: false,
            featureType: "STRING",
          },
          {
            name: "device",
            dispName: "장치",
            icon: null,
            color: null,
            type: "feature",
            isKey: false,
            featureType: "STRING",
          },
          {
            name: "recommendation",
            dispName: "권장조치",
            icon: null,
            color: null,
            type: "feature",
            isKey: false,
            featureType: "STRING",
          },
        ],
      },
      {
        name: "SystemEventInfo",
        dispName: "시스템 이벤트 정보",
        type: "format",
        features: [
          {
            name: "date",
            dispName: "날짜",
            icon: null,
            color: null,
            type: "feature",
            isKey: false,
            featureType: "DATE_SEC",
          },
          {
            name: "system",
            dispName: "시스템",
            icon: null,
            color: null,
            type: "feature",
            isKey: false,
            featureType: "STRING",
          },
          {
            name: "event",
            dispName: "이벤트명",
            icon: null,
            color: null,
            type: "feature",
            isKey: false,
            featureType: "STRING",
          },
          {
            name: "log",
            dispName: "시스템로그",
            icon: null,
            color: null,
            type: "feature",
            isKey: false,
            featureType: "STRING",
          },
        ],
      },
    ],
  },
  {
    name: "history",
    dispName: "이력 데이터",
    description: "이력 데이터 엘리먼트 폴더",
    type: "folder",
    children: [
      {
        name: "LossHistoryPerLine",
        dispName: "호선별 손실 이력",
        type: "format",
        features: [
          {
            name: "date",
            dispName: "날짜",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "DATE",
          },
          {
            name: "line1",
            dispName: "경부선",
            icon: null,
            color: "#0000FF",
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "line2",
            dispName: "호남선",
            icon: null,
            color: "#FF0000", //red
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "line3",
            dispName: "전라선",
            icon: null,
            color: "#FF00FF", //pink
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "line4",
            dispName: "동해선",
            icon: null,
            color: "#00FF00",
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "line5",
            dispName: "태백선",
            icon: null,
            color: "#FFA500", //orange
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "line6",
            dispName: "미배치",
            icon: null,
            color: "#6A5ACD", //보라색
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
        ],
      },
      {
        name: "LossHistoryPerDevice",
        dispName: "장치별 열화 이력",
        type: "format",
        features: [
          {
            name: "date",
            dispName: "날짜",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "DATE",
          },
          {
            name: "main-transformer",
            dispName: "주변압기",
            icon: null,
            color: "#FF0000",
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "main-air-compressor",
            dispName: "주공기압축기",
            icon: null,
            color: "#00BFFF", //skyblue
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "aux-air-compressor",
            dispName: "보조공기압축기",
            icon: null,
            color: "#6A5ACD", //보라색 orange
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "door",
            dispName: "승강문",
            icon: null,
            color: "#FF00FF",
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "hvac",
            dispName: "HAVC",
            icon: null,
            color: "#00FF00",
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "traction-motor",
            dispName: "견인전동기",
            icon: null,
            color: "#FFA500",
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "fire-detector",
            dispName: "화제감지기",
            icon: null,
            color: "#FF1493", //deep pink
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "axle-bearing",
            dispName: "차축베어링",
            icon: null,
            color: "#0000FF", //blue
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "broadcast-device",
            dispName: "방송장치",
            icon: null,
            color: "#FF4500", //orange red
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
        ],
      },
      {
        name: "MaintenanceHistoryPerLine",
        dispName: "노선별 유지보수 이력",
        type: "format",
        features: [
          {
            name: "date",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "STRING",
          },
          {
            name: "line1",
            dispName: "경부선",
            icon: null,
            color: "#0000FF",
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "line2",
            dispName: "호남선",
            icon: null,
            color: "#FF0000", //red
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "line3",
            dispName: "전라선",
            icon: null,
            color: "#FF00FF", //pink
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "line4",
            dispName: "동해선",
            icon: null,
            color: "#00FF00",
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "line5",
            dispName: "태백선",
            icon: null,
            color: "#FFA500", //orange
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
          {
            name: "line6",
            dispName: "미배치",
            icon: null,
            color: "#6A5ACD", //보라색
            type: "feature",
            isKey: false,
            featureType: "UINT16",
          },
        ],
      },
      {
        name: "DetailLossLevelHistory",
        dispName: "상세 열화등급 이력",
        type: "format",
        features: [
          {
            name: "date",
            dispName: "날짜",
            icon: null,
            color: null,
            type: "feature",
            isKey: true,
            featureType: "DATE",
          },
          {
            name: "line",
            dispName: "노선",
            icon: null,
            color: "#FF0000",
            type: "feature",
            isKey: true,
            featureType: "literals",
            literals: [
              {
                value: "경부선",
                description: "경부선",
                icon: "",
                color: "#003da5",
              }, // blue
              {
                value: "호남선",
                description: "호남선",
                icon: "",
                color: "#d50032",
              }, // red
              {
                value: "전라선",
                description: "전라선",
                icon: "",
                color: "#73c42d",
              }, // green
              {
                value: "동해선",
                description: "동해선",
                icon: "",
                color: "#d96b80",
              }, // pink
              {
                value: "태백선",
                description: "태백선",
                icon: "",
                color: "#7ba05b",
              }, // orange
              {
                value: "미배치",
                description: "미배치",
                icon: "",
                color: "#adb81d",
              }, // yellow
            ],
          },
          {
            name: "train",
            dispName: "편성",
            icon: null,
            color: "#00BFFF", //skyblue
            type: "feature",
            isKey: true,
            featureType: "STRING",
          },
          {
            name: "car",
            dispName: "차량",
            icon: null,
            color: "#6A5ACD", //보라색 orange
            type: "feature",
            isKey: true,
            featureType: "literals",
            literals: [
              { value: "TC1", description: "TC1", icon: "", color: "#FF0000" },
              { value: "M1", description: "M1", icon: "", color: "#00BFFF" },
              { value: "M2", description: "M2", icon: "", color: "#6A5ACD" },
              { value: "TC2", description: "TC2", icon: "", color: "#FF00FF" },
            ],
          },
          {
            name: "device",
            dispName: "장치",
            icon: null,
            color: "#FF00FF",
            type: "feature",
            isKey: true,
            featureType: "literals",
            literals: [
              {
                value: "승강문",
                description: "승강문",
                icon: "",
                color: "#FF0000",
              },
              {
                value: "주변압기",
                description: "주변압기",
                icon: "",
                color: "#00BFFF",
              },
              {
                value: "주공기압축기",
                description: "주공기압축기",
                icon: "",
                color: "#6A5ACD",
              },
              {
                value: "보조공기압축기",
                description: "보조공기압축기",
                icon: "",
                color: "#FF00FF",
              },
              {
                value: "HAVC",
                description: "HAVC",
                icon: "",
                color: "#00FF00",
              },
              {
                value: "화제감지기",
                description: "화제감지기",
                icon: "",
                color: "#FF1493",
              }, //deep pink
              {
                value: "차축베어링",
                description: "차축베어링",
                icon: "",
                color: "#0000FF",
              }, //blue
              {
                value: "방송장치",
                description: "방송장치",
                icon: "",
                color: "#FF4500",
              }, //orange red
            ],
          },
          {
            name: "loss-level",
            dispName: "등급",
            icon: null,
            color: "#00FF00",
            type: "feature",
            isKey: false,
            featureType: "literals",
            literals: [
              {
                value: "정상",
                description: "정상",
                icon: "",
                color: "#00FF00",
              }, // green
              {
                value: "주의",
                description: "주의",
                icon: "",
                color: "#FEB200",
              }, // yellow
              {
                value: "경고",
                description: "경고",
                icon: "",
                color: "#F0142F",
              }, // red
            ],
          },
        ],
      },
    ],
  },
];

export const getTestFormat = (path: string) => {
  if (!path || path === null) return null;
  const pathList = path.split("/").filter(Boolean);

  if (pathList.length === 0) return null;

  //console.log("createDataStore path:", pathList);
  //return new NexAppletStoreTest("", path, testMenuElement);

  let list = formatConfig;
  let node = null;

  for (let i = 0; i < pathList.length; i++) {
    if (!list) return null;
    node = list.find(
      (child: any) => child.name === pathList[i] || child.id === pathList[i]
    );
    if (!node) return null;
    //console.log("createDataStore node:", node);
    list = (node.children as any[]) || [];
  }

  if (!node || !(node.type === "format" || node.type === "folder")) {
    console.error("Invalid format node:", node);
    return null;
  }
  return node;
};

//const testData = testDataList["menu"];
