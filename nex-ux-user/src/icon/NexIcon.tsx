import {
  //add node
  MdNoteAdd,
  MdNewLabel,
  MdLabel,
  MdPostAdd,
  MdAssignmentAdd,
  MdFormatListBulletedAdd,

  //add group
  MdCreateNewFolder,
  MdOutlineCreateNewFolder,
  MdPlaylistAdd,
  MdOutlinePlaylistAdd,
  MdPlaylistAddCircle,

  //edit node
  MdEdit,
  MdPlaylistAddCheck,
  MdPlaylistAddCheckCircle,
  MdDeleteForever,
  MdOutlinePlaylistRemove,
  MdPlaylistRemove,

  // toggle open
  MdFolderOpen,
  MdOutlineOpenInFull,
  MdFolder,
  MdCloseFullscreen,
  MdOutlineCloseFullscreen,
  MdOutlineImportantDevices,
  MdImportantDevices,
  MdFactCheck,
  MdInsertLink,
  MdStorage,
  MdOutlineAddLink,
  MdAddLink,
  MdAddChart,
  MdOutlineAddchart,
  MdOutlineAddChart,
  MdBookmarkAdd,
  MdGroupAdd,
  MdOutlineGroupAdd,
  MdLibraryAdd,
  MdPersonAdd,
  MdOutlineAddBox,
  MdOutlineAddAPhoto,
  MdOutlineAddPhotoAlternate,
  MdCancelPresentation,
  MdNote,
  MdLocalLibrary,
  MdFormatListBulleted,
  MdOutlineOutbox,
  MdOutlinePhoto,
  MdOutlineFeaturedPlayList,
  MdPerson,
  MdBookmark,
  MdDatasetLinked,
  MdSdStorage,
} from "react-icons/md";
import { NexNodeType } from "type/NexNode";

export const nexAddNodeIcon = (type: NexNodeType, size: string) => {
  let icon = <MdNoteAdd style={{ fontSize: size }} />;
  switch (type) {
    case NexNodeType.FOLDER:
      icon = <MdCreateNewFolder style={{ fontSize: size }} />;
      break;
    case NexNodeType.FORMAT:
      icon = <MdLibraryAdd style={{ fontSize: size }} />;
      break;
    case NexNodeType.FEATURE:
      icon = <MdFormatListBulletedAdd style={{ fontSize: size }} />;
      break;

    case NexNodeType.PROCESSOR:
      icon = <MdAddLink style={{ fontSize: size }} />;
      break;
    case NexNodeType.STORE:
      icon = <MdStorage style={{ fontSize: size }} />;
      break;

    case NexNodeType.SYSTEM:
      icon = <MdImportantDevices style={{ fontSize: size }} />;
      break;

    case NexNodeType.ELEMENT:
      icon = <MdNewLabel style={{ fontSize: size }} />;
      break;

    case NexNodeType.APPLET:
      icon = <MdAddChart style={{ fontSize: size }} />;
      break;

    case NexNodeType.SECTION:
      icon = <MdOutlineAddBox style={{ fontSize: size }} />;
      break;

    case NexNodeType.THEME:
      icon = <MdPlaylistAddCircle style={{ fontSize: size }} />;
      break;
    case NexNodeType.USER:
      icon = <MdPersonAdd style={{ fontSize: size }} />;
      break;

    default:
      icon = <MdNoteAdd style={{ fontSize: size }} />;
      break;
  }
  return icon;
};

export const nexNodeIcon = (type: NexNodeType, size: string) => {
  let icon = <MdNote style={{ fontSize: size }} />;
  switch (type) {
    case NexNodeType.FOLDER:
      icon = <MdFolder style={{ fontSize: size }} />;
      break;
    case NexNodeType.FORMAT:
      icon = <MdLocalLibrary style={{ fontSize: size }} />;
      break;
    case NexNodeType.FEATURE:
      icon = <MdFormatListBulleted style={{ fontSize: size }} />;
      break;
    case NexNodeType.PROCESSOR:
      icon = <MdDatasetLinked style={{ fontSize: size }} />;
      break;
    case NexNodeType.STORE:
      icon = <MdSdStorage style={{ fontSize: size }} />;
      break;

    case NexNodeType.SYSTEM:
      icon = <MdImportantDevices style={{ fontSize: size }} />;
      break;
    case NexNodeType.ELEMENT:
      icon = <MdLabel style={{ fontSize: size }} />;
      break;
    default:
      icon = <MdNote style={{ fontSize: size }} />;
      break;

    case NexNodeType.APPLET:
      icon = <MdAddChart style={{ fontSize: size }} />;
      break;

    case NexNodeType.SECTION:
      icon = <MdOutlineOutbox style={{ fontSize: size }} />;
      break;

    case NexNodeType.THEME:
      icon = <MdOutlineFeaturedPlayList style={{ fontSize: size }} />;
      break;
    case NexNodeType.USER:
      icon = <MdPerson style={{ fontSize: size }} />;
      break;
  }

  return icon;
};

const nexIconMap: { [key: string]: any } = {
  folder: MdFolder,
  format: MdLocalLibrary,
  feature: MdFormatListBulleted,
  processor: MdDatasetLinked,
  store: MdSdStorage,
  system: MdImportantDevices,
  element: MdLabel,
  applet: MdAddChart,
  section: MdOutlineOutbox,
  theme: MdOutlineFeaturedPlayList,
  user: MdPerson,
};

export const nexIcon = (iconName: string | null | undefined, size?: string) => {
  if (!iconName) return null;
  const IconComponent = nexIconMap[iconName as keyof typeof nexIconMap];
  return IconComponent ? <IconComponent style={{ fontSize: size }} /> : null;
};
