import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { View, ViewProps } from 'react-native';

export function ThemedView(props: ViewProps) {
  const { isDarkMode } = useTheme();
  
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        },
        props.style,
      ]}
    />
  );
}
