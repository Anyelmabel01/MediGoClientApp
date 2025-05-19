import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';

// Paleta de colores para el header
const COLORS = {
  primary: '#00A0B0',
  primaryLight: '#33b5c2',
  primaryDark: '#006070',
  accent: '#70D0E0',
  text: '#212529',
  textSecondary: '#6C757D',
  white: '#FFFFFF',
  shadow: 'rgba(0, 154, 176, 0.15)',
  gradientStart: '#FFFFFF',
  gradientEnd: '#F8F9FA',
};

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  showLogoutButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
}

export function AppHeader({
  title,
  showBackButton = true,
  showLogoutButton = false,
  onBackPress,
  rightComponent,
  transparent = false,
}: AppHeaderProps) {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    signOut();
  };

  return (
    <View style={[styles.headerContainer, transparent && styles.transparentHeader]}>
      {!transparent && (
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      )}
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          <ThemedText style={styles.title}>{title}</ThemedText>
        </View>

        <View style={styles.rightSection}>
          {rightComponent}
          
          {showLogoutButton && (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="log-out-outline" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    paddingTop: 48, // Para dispositivos con notch
    paddingBottom: 10,
    position: 'relative',
    zIndex: 10,
  },
  transparentHeader: {
    backgroundColor: 'transparent',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    marginRight: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 160, 176, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 160, 176, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 