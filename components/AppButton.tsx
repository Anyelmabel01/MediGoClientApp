import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, View, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';

// Paleta de colores para los botones
const COLORS = {
  primary: '#00A0B0',
  primaryDark: '#006070',
  primaryLight: '#33b5c2',
  accent: '#70D0E0',
  secondary: '#6C757D',
  secondaryDark: '#495057',
  danger: '#dc3545',
  dangerDark: '#bd2130',
  success: '#28a745',
  successDark: '#1e7e34',
  warning: '#ffc107',
  warningDark: '#d39e00',
  info: '#17a2b8',
  infoDark: '#138496',
  light: '#f8f9fa',
  lightDark: '#e2e6ea',
  dark: '#343a40',
  darkDark: '#23272b',
  white: '#FFFFFF',
  transparent: 'transparent',
  shadow: 'rgba(0, 154, 176, 0.2)',
};

interface ButtonIconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
}

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: ButtonIconProps;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: ReactNode;
  gradient?: boolean;
  rounded?: boolean;
  elevated?: boolean;
  noPadding?: boolean;
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  children,
  gradient = true,
  rounded = false,
  elevated = true,
  noPadding = false,
}: AppButtonProps) {
  // Animación para efecto de pulsación
  const scale = useSharedValue(1);
  
  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 100, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    
    // Retroalimentación háptica
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 200, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  // Colores según la variante
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return {
          background: COLORS.primary,
          text: COLORS.white,
          gradient: [COLORS.primary, COLORS.primaryDark],
          border: 'transparent',
        };
      case 'secondary':
        return {
          background: COLORS.secondary,
          text: COLORS.white,
          gradient: [COLORS.secondary, COLORS.secondaryDark],
          border: 'transparent',
        };
      case 'danger':
        return {
          background: COLORS.danger,
          text: COLORS.white,
          gradient: [COLORS.danger, COLORS.dangerDark],
          border: 'transparent',
        };
      case 'success':
        return {
          background: COLORS.success,
          text: COLORS.white,
          gradient: [COLORS.success, COLORS.successDark],
          border: 'transparent',
        };
      case 'warning':
        return {
          background: COLORS.warning,
          text: COLORS.dark,
          gradient: [COLORS.warning, COLORS.warningDark],
          border: 'transparent',
        };
      case 'info':
        return {
          background: COLORS.info,
          text: COLORS.white,
          gradient: [COLORS.info, COLORS.infoDark],
          border: 'transparent',
        };
      case 'light':
        return {
          background: COLORS.light,
          text: COLORS.dark,
          gradient: [COLORS.light, COLORS.lightDark],
          border: 'transparent',
        };
      case 'dark':
        return {
          background: COLORS.dark,
          text: COLORS.white,
          gradient: [COLORS.dark, COLORS.darkDark],
          border: 'transparent',
        };
      case 'link':
        return {
          background: 'transparent',
          text: COLORS.primary,
          gradient: ['transparent', 'transparent'],
          border: 'transparent',
        };
      case 'outline':
        return {
          background: 'transparent',
          text: COLORS.primary,
          gradient: ['transparent', 'transparent'],
          border: COLORS.primary,
        };
      default:
        return {
          background: COLORS.primary,
          text: COLORS.white,
          gradient: [COLORS.primary, COLORS.primaryDark],
          border: 'transparent',
        };
    }
  };
  
  const colors = getColors();
  
  // Tamaño del botón
  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return styles.buttonSmall;
      case 'large':
        return styles.buttonLarge;
      default:
        return styles.buttonMedium;
    }
  };
  
  // Tamaño del texto
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return styles.textSmall;
      case 'large':
        return styles.textLarge;
      default:
        return styles.textMedium;
    }
  };
  
  // Contenido del botón
  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={colors.text} 
        />
      );
    }
    
    const iconComponent = icon ? (
      <Ionicons 
        name={icon.name} 
        size={icon.size || getIconSize()} 
        color={icon.color || colors.text} 
        style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight} 
      />
    ) : null;
    
    return (
      <>
        {iconPosition === 'left' && iconComponent}
        <ThemedText style={[styles.text, getTextSize(), { color: colors.text }, textStyle]}>
          {title}
        </ThemedText>
        {iconPosition === 'right' && iconComponent}
      </>
    );
  };
  
  // Tamaño del icono
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };
  
  const buttonStyles = [
    styles.button,
    getButtonSize(),
    {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: variant === 'outline' ? 1 : 0,
    },
    fullWidth && styles.fullWidth,
    rounded && styles.rounded,
    elevated && variant !== 'link' && variant !== 'outline' && styles.elevated,
    noPadding && styles.noPadding,
    disabled && styles.disabled,
    style,
  ];
  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={disabled || loading ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      <Animated.View style={[buttonStyles, animatedStyle]}>
        {gradient && variant !== 'link' && variant !== 'outline' ? (
          <LinearGradient
            colors={colors.gradient}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.contentContainer}>
              {renderContent()}
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.contentContainer}>
            {renderContent()}
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonSmall: {
    height: 36,
  },
  buttonMedium: {
    height: 44,
  },
  buttonLarge: {
    height: 52,
  },
  textSmall: {
    fontSize: 14,
  },
  textMedium: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 18,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  elevated: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  rounded: {
    borderRadius: 25,
  },
  noPadding: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
}); 