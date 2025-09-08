import Box from "@mui/material/Box";

interface MultiProgressProps {
  values: number[];
  colors: string[];
  max: number;
  height?: number | string;
}

const MultiProgress: React.FC<MultiProgressProps> = ({
  values,
  colors,
  max,
  height = 2,
}) => {
  //console.log("MultiProgress values:", values);
  //console.log("MultiProgress colors:", colors);

  const ratioDataset = values.map((value) => {
    // 각 value를 max로 나눈 후 100을 곱하여 백분율로 변환
    return Math.min((value / max) * 100, 100);
  });

  return (
    <Box
      position="relative"
      width="100%"
      height={height}
      bgcolor="#eee"
      borderRadius={2}
      overflow="hidden"
    >
      {ratioDataset.map((percent, index) => (
        <Box
          key={index}
          position="absolute"
          left={`${ratioDataset.slice(0, index).reduce((acc, val) => acc + val, 0)}%`}
          top={0}
          height="100%"
          width={`${percent}%`}
          bgcolor={colors[index]}
        />
      ))}

      {/* 전체 바 테두리 */}
      <Box
        position="absolute"
        left={0}
        top={0}
        width="100%"
        height="100%"
        border="1px solid #aaa"
        borderRadius={2}
      />
    </Box>
  );
};

export default MultiProgress;
