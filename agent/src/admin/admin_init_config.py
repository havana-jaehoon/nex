NexNodeType = {
    "FOLDER": "folder",
    "FORMAT": "format",
    "FEATURE": "feature",
    "STORE": "store",
    "PROCESSOR": "processor",
    "SYSTEM": "system",
    "ELEMENT": "element",
    "SECTION": "section",
    "APPLET": "applet",
    "CONTENTS": "contents",
    "THEME": "theme",
    "USER": "user",
}

init_nodes = {
    NexNodeType["FOLDER"]: {
        "type": NexNodeType["FOLDER"],
        "name": "NewFolder",
        "dispName": "",
        "description": "",
        "children": [],
    },
    NexNodeType["FORMAT"]: {
        "name": "NewFormat",
        "dispName": "",
        "description": "",
        "type": NexNodeType["FORMAT"],
        "listType": "list",
        "features": [],
    },
    NexNodeType["FEATURE"]: {
        "name": "NewFeature",
        "dispName": "",
        "description": "",
        "type": NexNodeType["FEATURE"],
        "featureType": "NONE",
        "isKey": False,
    },
    NexNodeType["STORE"]: {
        "name": "NewStore",
        "dispName": "",
        "description": "",
        "type": NexNodeType["STORE"],
        "storeType": "MEMORY",
        "record": {
            "storage": "disk",
            "nature": "static",
            "unit": "NONE",
            "block": "NONE",
            "expire": "-1",
            "expireUnit": "NONE",
            "allowDuplication": False,
            "allowKeepValue": False,
        },
    },
    NexNodeType["PROCESSOR"]: {
        "name": "NewProcessor",
        "dispName": "",
        "description": "",
        "type": NexNodeType["PROCESSOR"],
        "module": {
            "version": "",
            "history": "",
        },
    },
    NexNodeType["SYSTEM"]: {
        "name": "NewSystem",
        "dispName": "NewSystem",
        "description": "NewSystem",
        "type": NexNodeType["SYSTEM"],
        "system": {
            "address": {
                "ip": "",
                "port": "",
            },
            "hdfs": {
                "ip": "",
                "port": "",
                "path": "",
            },
            "db": {
                "ip": "",
                "port": "",
                "user": "",
                "password": "",
                "database": "", # databse-name
            },
        },
    },
    NexNodeType["ELEMENT"]: {
        "name": "NewElement",
        "dispName": "",
        "description": "",
        "type": NexNodeType["ELEMENT"],
        "format": "", # format path
        "store": "",  # store path
        "processor": "", # processor path
        "processingInterval": 0,
        "processingUnit" : "SEC",
        "source" : "", # system:path
    },
    NexNodeType["APPLET"]: {
        "name": "NewApplet",
        "dispName": "",
        "description": "",
        "type": NexNodeType["APPLET"],
        "icon": "applet",
        "color": "#33A1FF",
        "applet": "", # applet source path(frontend - react)
    },
    
    NexNodeType["SECTION"]: {
        "name": "NewSection",
        "dispName": "",
        "description": "",
        "type": NexNodeType["SECTION"],
        "size": "1",
        "direction": "row",
        "padding": "0",
        "isRoute": False,
        "route": "",
        "applet": "",
        "contents": [],
    },
    NexNodeType["CONTENTS"]: {
        "name": "NewContents",
        "dispName": "",
        "description": "",
        "type": NexNodeType["CONTENTS"],
        "element": "",
        "condition": [],
        "selection": [],
    },
    NexNodeType["THEME"]: {
        "name": "NewTheme",
        "dispName": "",
        "description": "",
        "type": NexNodeType["THEME"],
        "icon": "theme",
        "color": "#33A1FF",
        "theme": {
            "default": {
                "colors": ["#393c45", "#045bac"],
                "bgColors": ["#e8edf7", "#ffffff"],
                "bdColors": ["#cccccc", "#ccccee"], # 테두리 색상, 여러 색상을 지원하기 위해 배열로 변경
                "activeColors": ["#393c45", "#045bac"],
                "activeBgColors": ["#e8edf7", "#ffffff"], # 활성화 배경색, 여러 색상을 지원하기 위해 배열로 변경
                "hoverColors": ["#393c45", "#045bac"],
                "hoverBgColors": ["#e8edf7", "#ffffff"], # 호버 배경색, 여러 색상을 지원하기 위해 배열로 변경
                "fontFamily": "Arial, sans-serif",
                "borderRadius": "0.5rem", # all | top right bottom left
                "padding": "0rem", # all | top right bottom left
                "gap": "0rem",
                "fontSize": [
                    "0.5rem",
                    "0.6rem",
                    "0.7rem",
                    "0.8rem",
                    "0.9rem",
                    "1rem",
                    "1.25rem",
                    "1.5rem",
                    "1.75rem",
                    "2rem",
                ], # 0~N levels of font size
            }
        }
    },
    
    NexNodeType["USER"]: {
        "name": "NewUser",
        "dispName": "",
        "description": "",
        "type": NexNodeType["USER"],

        "icon": "user",
        "color": "#33A1FF",
        "user" : {
            "id": "user",
            "fontLevel": "5",
            "theme": "default"
        }
    },
    
}
