import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useThemeContext } from '../theme/ThemeProvider';

interface Props {
  data: number[];
  height?: number;
}

export const LineChart: React.FC<Props> = ({ data, height = 160 }) => {
  const { theme } = useThemeContext();
  if (!data.length) return null;
  const width = 280;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1 || 1);
  const points = data
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Svg width={width} height={height}>
      <Path d={`M ${points}`} stroke={theme.colors.primary} strokeWidth={3} fill="none" />
    </Svg>
  );
};
