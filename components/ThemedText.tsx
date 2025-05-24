import { useTheme } from '@/context/ThemeContext';
import { Text, TextProps } from 'react-native';

export function ThemedText(props: TextProps) {
  const { themeColors } = useTheme();
  
  return (
    <Text
      {...props}
      style={[
        {
          color: themeColors.text,
        },
        props.style,
      ]}
    />
  );
}
