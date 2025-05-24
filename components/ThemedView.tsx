import { useTheme } from '@/context/ThemeContext';
import { View, ViewProps } from 'react-native';

export function ThemedView(props: ViewProps) {
  const { isDarkMode, themeColors } = useTheme();
  
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: themeColors.background,
        },
        props.style,
      ]}
    />
  );
}
