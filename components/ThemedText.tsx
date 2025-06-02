import { useTheme } from '@/context/ThemeContext';
import { Text, TextProps } from 'react-native';

interface ThemedTextProps extends TextProps {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  lightColor?: string;
  darkColor?: string;
}

export function ThemedText({ type = 'default', lightColor, darkColor, style, ...rest }: ThemedTextProps) {
  const { themeColors } = useTheme();
  
  const getTypeStyle = () => {
    switch (type) {
      case 'title':
        return {
          fontSize: 28,
          fontWeight: 'bold' as const,
          lineHeight: 32,
        };
      case 'defaultSemiBold':
        return {
          fontSize: 16,
          fontWeight: '600' as const,
          lineHeight: 24,
        };
      case 'subtitle':
        return {
          fontSize: 20,
          fontWeight: 'bold' as const,
        };
      case 'link':
        return {
          fontSize: 16,
          color: themeColors.primary,
          textDecorationLine: 'underline' as const,
        };
      default:
        return {
          fontSize: 16,
          lineHeight: 24,
        };
    }
  };
  
  return (
    <Text
      style={[
        {
          color: themeColors.text,
        },
        getTypeStyle(),
        style,
      ]}
      {...rest}
    />
  );
}
