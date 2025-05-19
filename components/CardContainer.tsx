import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from './ThemedText';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Paleta de colores para las tarjetas
const COLORS = {
  primary: '#00A0B0',
  primaryLight: '#33b5c2',
  primaryDark: '#006070',
  accent: '#70D0E0',
  white: '#FFFFFF',
  surface: '#FFFFFF',
  textPrimary: '#212529',
  textSecondary: '#6C757D',
  shadow: 'rgba(0, 154, 176, 0.15)',
  highlight: '#70D0E0',
  gradientStart: '#FFFFFF',
  gradientEnd: '#F8FCFD',
  borderColor: 'rgba(0, 154, 176, 0.1)',
};

interface CardContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  disabled?: boolean;
  elevated?: boolean;
  gradient?: boolean;
  transparent?: boolean;
  blurred?: boolean;
  highlighted?: boolean;
  compact?: boolean;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

export function CardContainer({
  children,
  title,
  subtitle,
  onPress,
  style,
  titleStyle,
  subtitleStyle,
  disabled = false,
  elevated = true,
  gradient = false,
  transparent = false,
  blurred = false,
  highlighted = false,
  compact = false,
  icon,
  rightElement,
}: CardContainerProps) {
  const cardContent = (
    <>
      {gradient && !transparent && (
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      )}
      
      {highlighted && (
        <View style={styles.highlightIndicator} />
      )}
      
      {(title || subtitle) && (
        <View style={[styles.headerContainer, compact ? styles.compactHeader : null]}>
          <View style={styles.titleContainer}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            
            <View style={styles.textContainer}>
              {title && (
                <ThemedText style={[styles.title, compact ? styles.compactTitle : null, titleStyle]}>
                  {title}
                </ThemedText>
              )}
              
              {subtitle && (
                <ThemedText style={[styles.subtitle, compact ? styles.compactSubtitle : null, subtitleStyle]}>
                  {subtitle}
                </ThemedText>
              )}
            </View>
          </View>
          
          {rightElement && (
            <View style={styles.rightElement}>
              {rightElement}
            </View>
          )}
        </View>
      )}
      
      <View style={[styles.contentContainer, (title || subtitle) && !compact ? styles.contentWithHeader : null]}>
        {children}
      </View>
    </>
  );

  const cardStyles = [
    styles.card,
    transparent ? styles.transparentCard : null,
    highlighted ? styles.highlightedCard : null,
    elevated ? styles.elevatedCard : null,
    compact ? styles.compactCard : null,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={disabled}
      >
        {blurred && !transparent ? (
          <BlurView intensity={50} tint="light" style={styles.blurContainer}>
            {cardContent}
          </BlurView>
        ) : (
          cardContent
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles}>
      {blurred && !transparent ? (
        <BlurView intensity={50} tint="light" style={styles.blurContainer}>
          {cardContent}
        </BlurView>
      ) : (
        cardContent
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  transparentCard: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  elevatedCard: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  highlightedCard: {
    borderColor: COLORS.highlight,
    borderWidth: 1,
  },
  compactCard: {
    padding: 12,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 154, 176, 0.05)',
  },
  compactHeader: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 8,
    borderBottomWidth: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  compactTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  compactSubtitle: {
    fontSize: 12,
  },
  rightElement: {
    marginLeft: 8,
  },
  contentContainer: {
    padding: 16,
  },
  contentWithHeader: {
    paddingTop: 12,
  },
  highlightIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    backgroundColor: COLORS.highlight,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
}); 