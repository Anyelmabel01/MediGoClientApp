import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, StatusBar as RNStatusBar, ScrollView, StyleSheet, View } from 'react-native';
import { AppHeader } from './AppHeader';
import { ThemedView } from './ThemedView';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Paleta de colores para el contenedor
const COLORS = {
  primary: '#00A0B0',
  primaryLight: '#33b5c2',
  primaryDark: '#006070',
  accent: '#70D0E0',
  background: '#FFFFFF',
  backgroundGradient: ['#F8F9FA', '#EDF3F5'],
  backgroundGradientAlt: ['#FFFFFF', '#F0F9FA'],
};

interface AppContainerProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  showLogoutButton?: boolean;
  onBackPress?: () => void;
  rightHeaderComponent?: ReactNode;
  scrollable?: boolean;
  avoidKeyboard?: boolean;
  padded?: boolean;
  transparentHeader?: boolean;
  decorative?: boolean;
}

export function AppContainer({
  children,
  title,
  showBackButton = true,
  showLogoutButton = false,
  onBackPress,
  rightHeaderComponent,
  scrollable = true,
  avoidKeyboard = true,
  padded = true,
  transparentHeader = false,
  decorative = true,
}: AppContainerProps) {
  const Content = () => (
    <>
      {title && (
        <AppHeader
          title={title}
          showBackButton={showBackButton}
          showLogoutButton={showLogoutButton}
          onBackPress={onBackPress}
          rightComponent={rightHeaderComponent}
          transparent={transparentHeader}
        />
      )}
      <View style={[styles.contentContainer, padded && styles.paddedContent]}>
        {children}
      </View>
    </>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      <RNStatusBar backgroundColor="transparent" translucent />
      
      {decorative && (
        <View style={styles.backgroundCircles}>
          <LinearGradient
            colors={[COLORS.accent, COLORS.primary]}
            style={[styles.circle, styles.circle1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            opacity={0.08}
          />
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={[styles.circle, styles.circle2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            opacity={0.06}
          />
          <LinearGradient
            colors={[COLORS.accent, COLORS.primary]}
            style={[styles.circle, styles.circle3]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            opacity={0.07}
          />
        </View>
      )}
      
      <LinearGradient 
        colors={COLORS.backgroundGradient} 
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {avoidKeyboard ? (
        <KeyboardAvoidingView
          style={styles.keyboardAvoidContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
        >
          {scrollable ? (
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <Content />
            </ScrollView>
          ) : (
            <Content />
          )}
        </KeyboardAvoidingView>
      ) : (
        <>
          {scrollable ? (
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <Content />
            </ScrollView>
          ) : (
            <Content />
          )}
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
  },
  paddedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backgroundCircles: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    overflow: 'hidden',
    zIndex: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000, // Valor grande para asegurar que sea un círculo
    overflow: 'hidden',
  },
  circle1: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9,
    top: -SCREEN_WIDTH * 0.2,
    right: -SCREEN_WIDTH * 0.1,
  },
  circle2: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    bottom: SCREEN_HEIGHT * 0.25,
    left: -SCREEN_WIDTH * 0.3,
  },
  circle3: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    bottom: -SCREEN_WIDTH * 0.2,
    right: -SCREEN_WIDTH * 0.2,
  },
}); 