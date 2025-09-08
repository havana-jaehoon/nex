//import TrainIcon from "@/assets/icon-train.svg?react";
import { ReactComponent as TrainIcon } from "../../../assets/icon-train.svg";
import { observer } from "mobx-react-lite";
import NexApplet, { NexAppProps } from "../../NexApplet";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import {
  MdArrowDownward,
  MdArrowDropDown,
  MdCircle,
  MdExpandMore,
  MdOutlineArrowDropDown,
} from "react-icons/md";
import NexTableApp from "../../table/NexTableApp";
import { NexDiv } from "../../../component/base/NexBaseComponents";
import { getValuesByCondition } from "utils/util";
import { NexStoreContext } from "provider/NexStoreProvider";
import { useContext } from "react";
import { contrastColor } from "type/NexTheme";

const EMU150TrainAccordion: React.FC<NexAppProps> = observer((props) => {
  //const { store, theme, applet, onSelect } = props;
  const { contents, onSelect } = props;

  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크
  const errorMsg = () => {
    // check isTree, volatility, features.length ...
    if (contents.length === 0)
      return "EMU150TrainAccordion requires at least one store element.";
    return null;
  };
  // 1.2 Apllet 에서 사용할 contents 의 폰트 사이즈를 theme 로 부터 가져오기
  // 1.3 Freatures 에서 feature 별 Icon, color 정보 등을 가져오기
  // 1.4 data store 에서 출력할 데이터를 Applet 에서 사용할 수 있는 형태로 변환.
  const lossPerLineStore = contents[0].store;
  const trainPerLineStore = contents[1].store;
  const carPerTrainStore = contents[2].store;

  const selectLine = (line: string) => {
    // Handle line selection
  };

  const selectTrain = (line: string, train: string) => {
    // Handle line selection
  };

  const selectCar = (line: string, train: string, car: string) => {};

  return (
    <NexApplet {...props} error={errorMsg()}>
      <NexDiv direction="column" width="100%" height="100%">
        <Stack spacing={0.5} direction="column" width="100%">
          {lossPerLineStore &&
            lossPerLineStore.odata.map((item: any, index: number) => (
              <Accordion
                key={index}
                sx={{ width: "100%" }}
                slotProps={{ heading: { component: "h4" } }}
              >
                <Button
                  sx={{ width: "100%" }}
                  onClick={() => selectLine(item[0])}
                >
                  <AccordionSummary
                    component="div"
                    expandIcon={<MdExpandMore />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <Typography
                      component="span"
                      sx={{ width: "80%", flexShrink: 0 }}
                    >
                      {item[0]}
                    </Typography>

                    <Typography
                      component="span"
                      sx={{ width: "8%", flexShrink: 0 }}
                    >
                      <NexDiv
                        key={index}
                        flex="12"
                        width="100%"
                        justify="center"
                        align="center"
                        bgColor={
                          lossPerLineStore.format.features[1]?.color ||
                          "#888888"
                        }
                        color={contrastColor(
                          lossPerLineStore.format.features[1].color
                        )}
                        borderRadius="1rem"
                      >
                        {`${lossPerLineStore.format.features[1].dispName} : ${item[1]}`}
                      </NexDiv>
                    </Typography>
                    <Typography
                      component="span"
                      sx={{ width: "2%", flexShrink: 0 }}
                    />
                    <Typography
                      component="span"
                      sx={{ width: "8%", flexShrink: 0 }}
                    >
                      <NexDiv
                        key={index}
                        flex="12"
                        width="100%"
                        justify="center"
                        align="center"
                        bgColor={
                          lossPerLineStore.format.features[2]?.color ||
                          "#888888"
                        }
                        color={contrastColor(
                          lossPerLineStore.format.features[2].color
                        )}
                        borderRadius="1rem"
                      >
                        {`${lossPerLineStore.format.features[2].dispName} : ${item[2]}`}
                      </NexDiv>
                    </Typography>
                    <Typography
                      component="span"
                      sx={{ width: "2%", flexShrink: 0 }}
                    />
                  </AccordionSummary>
                </Button>
                <AccordionDetails>
                  <Stack spacing={0.5} direction="column" paddingLeft={4}>
                    {trainPerLineStore
                      ?.getValuesByCondition([
                        {
                          feature: lossPerLineStore.format.features[0].name,

                          value: item[0],
                          method: "match",
                        },
                      ])
                      .csv?.map((trainItem: any, trainIndex: number) => (
                        <ButtonGroup key={trainIndex} variant="outlined">
                          <Button
                            startIcon={<TrainIcon />}
                            onClick={() => selectTrain(item[0], trainItem[1])}
                          >
                            {trainItem[1]}
                          </Button>
                          {carPerTrainStore
                            ?.getValuesByCondition([
                              {
                                feature:
                                  trainPerLineStore.format.features[0].name,
                                value: trainItem[1],
                                method: "match",
                              },
                            ])
                            .csv?.map((carItem: any, carIndex: number) => (
                              <Button
                                key={carIndex}
                                onClick={() =>
                                  selectCar(item[0], trainItem[1], carItem[1])
                                }
                              >
                                {carItem[1]}
                              </Button>
                            ))}
                        </ButtonGroup>
                      ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
        </Stack>
      </NexDiv>
    </NexApplet>
  );
});

export default EMU150TrainAccordion;
