import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Text, TextProps } from 'react-native';

export function ThemedText(props: TextProps) {
  const { isDarkMode } = useTheme();
  
  return (
    <Text
      {...props}
      style={[
        {
          color: isDarkMode ? Colors.dark.text : Colors.light.text,
        },
        props.style,
      ]}
    />
  );
}
