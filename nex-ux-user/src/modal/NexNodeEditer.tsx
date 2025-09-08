import React, { ChangeEvent } from "react";
import { observer } from "mobx-react-lite";
import Modal from "react-modal";

import {
  NexButton,
  NexDiv,
  NexInput,
  NexLabel,
} from "component/base/NexBaseComponents";
import NexModal from "./NexModal";

enum TmpNodeType {
  SYSTEM = "system",
  FEATURE = "feature",
  COLLECTOR = "collector",
  DATAELEMENT = "dataelement",
}

interface NexNodeEditorProps {
  //editType: NexNodeEditType; // none, add, update, delete
  isOpen: boolean; // true: showing, false: don't showing
  node: any; // node for input
  format: any; // format for input
  type: "add" | "update" | "delete"; // add, update, delete
  onSetValue(key: string, value: any): void;
  onApply(): void;
  onCancel(): void;
}

const NexNodeEditor: React.FC<NexNodeEditorProps> = observer((props) => {
  const { isOpen, node, onSetValue, onApply, onCancel } = props;

  const placeholder = {
    name: "Enter name",
    description: "Enter description",
    sysType: "Select system type",
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onSetValue(name, value);
  };

  const commonHeadFields = (prefix: string) => (
    <NexDiv
      flex="1"
      direction="column"
      align="center"
      gap="0.5rem"
      width="100%"
    >
      <NexDiv flex="1" direction="row" align="center" gap="1rem" width="100%">
        <NexDiv
          flex="1"
          direction="column"
          align="start"
          border="1px solid #666"
        >
          <NexLabel flex="1" htmlFor={prefix + "name"}>
            Name:
          </NexLabel>
          <NexInput
            flex="1"
            id={prefix + "name"}
            type="text"
            name="name"
            placeholder={placeholder?.name}
            value={node.name}
            onChange={handleInputChange}
          />
        </NexDiv>
      </NexDiv>
      <NexDiv flex="1" direction="row" align="center" width="100%">
        <NexDiv flex="5" direction="column" align="start" width="100%">
          <NexLabel htmlFor={prefix + ".description"}>Description:</NexLabel>
          <NexInput
            style={{ width: "100%" }}
            id={prefix + ".description"}
            type="text"
            name="description"
            placeholder={placeholder?.description}
            value={node.description}
            onChange={handleInputChange}
          />
        </NexDiv>
      </NexDiv>
    </NexDiv>
  );

  const commonTailFields = (prefix: string) => (
    <NexDiv
      flex="1"
      display="flex"
      direction="row"
      align="stretch"
      gap="0.5rem"
      width="100%"
    >
      <NexButton flex="1" bgColor="blue" onClick={onApply}>
        Apply
      </NexButton>
      <NexButton flex="1" bgColor="gray" onClick={onCancel}>
        Cancel
      </NexButton>
    </NexDiv>
  );

  const systemFields = (prefix: string) => (
    <NexDiv
      flex="1"
      display="flex"
      direction="row"
      align="stretch"
      gap="0.5rem"
      width="100%"
    >
      <NexDiv flex="1" direction="column" align="center" gap="0.5rem">
        <NexLabel htmlFor={prefix + ".sysType"}>System Type:</NexLabel>
        <select
          id={prefix + ".sysType"}
          name="sysType"
          value={node.sysType}
          onChange={handleInputChange}
        ></select>
      </NexDiv>
      <br />
      <NexDiv flex="1" direction="column" align="center" gap="0.5rem">
        <NexLabel htmlFor={prefix + ".address.ip"}>Address:</NexLabel>
        <NexInput
          id={prefix + ".address.ip"}
          type="url"
          name="address.ip"
          value={node.address?.ip}
          onChange={handleInputChange}
        />
        <NexInput
          id={prefix + ".address.port"}
          type="number"
          name="address.port"
          value={node.address?.port}
          onChange={handleInputChange}
        />
      </NexDiv>
    </NexDiv>
  );

  const featureFields = (prefix: string) => (
    <NexDiv
      flex="1"
      display="flex"
      direction="row"
      align="stretch"
      gap="0.5rem"
      width="100%"
    >
      <NexDiv flex="1" direction="column" align="center" gap="0.5rem">
        <NexLabel htmlFor={prefix + ".featureType"}>Feature Type:</NexLabel>
        <select
          id={prefix + ".featureType"}
          name="feature.type"
          value={node.featureType}
          onChange={handleInputChange}
        ></select>
      </NexDiv>
    </NexDiv>
  );

  const collectorFields = (prefix: string) => (
    <NexDiv
      flex="1"
      display="flex"
      direction="row"
      align="stretch"
      gap="0.5rem"
      width="100%"
    >
      <NexDiv flex="1" direction="column" align="center" gap="0.5rem">
        <NexLabel htmlFor="collector.module.name">Version:</NexLabel>
        <NexInput
          id="collector.module.name"
          type="text"
          name="module.name"
          value={node.version}
          onChange={handleInputChange}
        />
      </NexDiv>
      <NexDiv flex="1" direction="column" align="center" gap="0.5rem">
        <NexLabel htmlFor="collector.module.version">Version:</NexLabel>
        <NexInput
          id="collector.module.version"
          type="text"
          name="module.version"
          value={node.version}
          onChange={handleInputChange}
        />
      </NexDiv>
    </NexDiv>
  );

  const storageFields = (prefix: string) => (
    <NexDiv
      flex="1"
      direction="column"
      align="center"
      gap="0.5rem"
      width="100%"
    >
      <NexLabel htmlFor={prefix + "recore.unit"}>Record Unit</NexLabel>
      <select
        id={prefix + "record.unit"}
        name="record.unit"
        value={node.storage?.record?.unit}
        onChange={handleInputChange}
      ></select>
      <NexDiv style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <NexInput
          id={prefix + "record.allowDuplication"}
          type="checkbox"
          name="allowDuplication"
          checked={node.allowDuplication || false}
          onChange={handleInputChange}
        />
        <NexLabel htmlFor={prefix + "record.allowDuplication"}>
          Allow Duplication
        </NexLabel>
      </NexDiv>
      <NexDiv style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <NexInput
          id={prefix + "record.allowKeepValue"}
          type="checkbox"
          name="allowKeepValue"
          checked={node.allowKeepValue || false}
          onChange={handleInputChange}
        />
        <NexLabel htmlFor={prefix + "record.allowKeepValue"}>
          Allow Keep Value
        </NexLabel>
      </NexDiv>
      <br />
      <NexLabel htmlFor={prefix + "expire.value"}>Expire: </NexLabel>
      <NexInput
        id={prefix + "expire.value"}
        type="text"
        name="expire.value"
        value={node.element?.record?.expire?.value}
        onChange={handleInputChange}
      />
      <select
        id={prefix + "expire.unit"}
        name="expire.unit"
        value={node.element?.record?.expire?.unit}
        onChange={handleInputChange}
      ></select>
    </NexDiv>
  );

  const dataElementFields = (prefix: string) => (
    <NexDiv
      flex="1"
      direction="column"
      align="center"
      gap="0.5rem"
      width="100%"
    >
      <NexLabel htmlFor={prefix + ".element.format.path"}>Format</NexLabel>
      <NexInput
        id={prefix + ".element.format.path"}
        type="text"
        name="element.format.path"
        value={node.element?.format?.path}
        onChange={handleInputChange}
      />
      {""}
      <NexLabel htmlFor={prefix + ".element.collector.path"}>
        Collector Path
      </NexLabel>
      <NexInput
        id={prefix + ".element.collector.path"}
        type="text"
        name="element.collector.path"
        value={node.element?.collector?.path}
        onChange={handleInputChange}
      />

      <NexLabel htmlFor={prefix + ".element.collector.features"}>
        {" "}
        Collector Feature List
      </NexLabel>
      <NexInput
        id={prefix + ".element.collector.features"}
        type="text"
        name="element.collector.features"
        value={node.element?.collector?.features}
        onChange={handleInputChange}
      />
      <br />
      <NexLabel htmlFor={prefix + ".element.collector.interval.value"}>
        Collector Interval
      </NexLabel>
      <NexInput
        id={prefix + ".element.collector.interval.value"}
        type="text"
        name="element.collector.interval.value"
        value={node.element?.collector?.interval?.value || ""}
        onChange={handleInputChange}
      />
      <select
        id={prefix + ".element.collector.interval.unit"}
        name="interval.unit"
        value={node.element?.collector?.interval?.unit}
        onChange={handleInputChange}
      ></select>
      <br />
      <> #### Record </>
      <NexLabel htmlFor={prefix + ".element.storage.path"}>
        Storage Path
      </NexLabel>
      <NexInput
        id={prefix + ".element.storage.path"}
        type="text"
        name="element.storage.path"
        value={node.element?.storage?.path}
        onChange={handleInputChange}
      />
    </NexDiv>
  );

  const webElementFields = (prefix: string) => (
    <NexDiv>
      <NexDiv>
        <NexLabel htmlFor={prefix + ".element.format.path"}>Format</NexLabel>
        <NexInput
          id={prefix + ".element.format.path"}
          type="text"
          name="element.format.path"
          value={node.element?.format.path}
          onChange={handleInputChange}
        />

        <NexLabel htmlFor={prefix + ".element.collector.path"}>Format</NexLabel>
        <NexInput
          id={prefix + ".element.collector.path"}
          type="text"
          name="element.collector.path"
          value={node.element?.collector.path}
          onChange={handleInputChange}
        />
        <br />
        <NexLabel htmlFor={prefix + ".element.collector.features"}>
          Feature List
        </NexLabel>
        <NexInput
          id={prefix + ".element.collector.features"}
          type="text"
          name="element.collector.features"
          value={node.element?.collector.features}
          onChange={handleInputChange}
        />
        <br />
        <NexInput
          id={prefix + ".element.collector.path"}
          type="text"
          name="element.collector.path"
          value={node.element?.collector.path}
          onChange={handleInputChange}
        />

        <br />
        <NexLabel htmlFor={prefix + ".element.collector.interval.value"}>
          Format
        </NexLabel>
        <NexInput
          id={prefix + ".element.collector.interval.value"}
          type="text"
          name="element.collector.interval.value"
          value={node.element?.collector.interval.value}
          onChange={handleInputChange}
        />
        <select
          id={prefix + ".element.collector.interval.unit"}
          name="interval.unit"
          value={node.collector.interval.unit}
          onChange={handleInputChange}
        ></select>
      </NexDiv>
    </NexDiv>
  );

  return (
    <NexModal
      isOpen={isOpen}
      onClose={onCancel}
      label="Edit Node"
      elementId="root"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)", // 배경을 어둡게 설정
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-0%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#333333",
          color: "white",
          border: "1px solid #666",
          borderRadius: "4px",
          padding: "0.5rem",
          display: "flex",
          width: "24rem",
        },
      }}
    >
      <NexDiv direction="column" align="center" gap="0.5rem" width="100%">
        {commonHeadFields("node")}
        {node.type === TmpNodeType.SYSTEM && systemFields("node")}
        {node.type === TmpNodeType.FEATURE && featureFields("node")}
        {node.type === TmpNodeType.COLLECTOR && collectorFields("node")}
        {node.type === TmpNodeType.DATAELEMENT && dataElementFields("node")}

        {commonTailFields("node")}
      </NexDiv>
    </NexModal>
  );
});
export default NexNodeEditor;
