from strenum import StrEnum


class TimeUnit(StrEnum):
    DAY = 'DAY'
    HOUR = 'HOUR'
    MINUTE = 'MIN'
    SECOND = 'SEC'

FOLDER_TYPE = 'FOLDER'
ELEMENT_TYPE = 'ELEMENT'
FORMAT_TYPE = 'FORMAT'
STORE_TYPE = 'STORE'

CONFIG_PROJECT_NAME = 'Admin'
CONFIG_SYSTEM_NAME = 'CfgServer'
CONFIG_SYSTEM_AUTH_ID = '/Auth/FirstStepAuth'
