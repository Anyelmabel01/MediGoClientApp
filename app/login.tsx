import * as React from 'react';
import { useState, useEffect } from '../hooks/react';
import { StyleSheet, TextInput, View, TouchableOpacity, ImageBackground, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useAuth } from '../hooks/useAuth';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, interpolateColor, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Paleta de colores principal
const COLORS = {
  primary: '#00A0B0',
  primaryLight: '#33b5c2',
  primaryDark: '#006070',
  accent: '#70D0E0',
  background: '#FFFFFF',
  textPrimary: '#212529',
  textSecondary: '#6C757D',
  white: '#FFFFFF',
  error: '#dc3545',
  success: '#28a745',
  inputBg: 'rgba(255, 255, 255, 0.9)',
  border: '#E9ECEF',
  buttonBlue: '#0099CC',
  buttonBlueDark: '#007BA3',
  buttonGradient: ['#0099CC', '#00B5E2'],
  shadowColor: '#1A88B8',
  placeholder: '#A0A0A0',
  backgroundGradient: ['#F8F9FA', '#EDF3F5'],
  inputShadow: 'rgba(0, 154, 176, 0.1)',
};

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Animaciones para botones e interacciones
  const buttonScale = useSharedValue(1);
  const buttonBgOpacity = useSharedValue(0);
  const forgotPasswordOpacity = useSharedValue(1);
  const registerOpacity = useSharedValue(1);
  
  // Animaciones con Reanimated para la entrada
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const logoScale = useSharedValue(0.8);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });
  
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
    };
  });
  
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
      backgroundColor: interpolateColor(
        buttonBgOpacity.value,
        [0, 1],
        [COLORS.buttonBlue, COLORS.buttonBlueDark]
      ),
    };
  });
  
  const animatedForgotPasswordStyle = useAnimatedStyle(() => {
    return {
      opacity: forgotPasswordOpacity.value,
    };
  });
  
  const animatedRegisterStyle = useAnimatedStyle(() => {
    return {
      opacity: registerOpacity.value,
    };
  });

  useEffect(() => {
    // Secuencia de animación de entrada
    setTimeout(() => {
      logoScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.back(2)) });
    }, 100);
    
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: 800 });
      translateY.value = withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) });
    }, 300);
  }, []);

  const handleButtonPress = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 });
    buttonBgOpacity.value = withTiming(1, { duration: 100 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleButtonRelease = async () => {
    buttonScale.value = withTiming(1, { duration: 200 });
    buttonBgOpacity.value = withTiming(0, { duration: 200 });
    
    setIsLoading(true);
    try {
      // Simulamos una petición
      await new Promise(resolve => setTimeout(resolve, 1000));
      signIn(email, password);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    forgotPasswordOpacity.value = withTiming(0.6, { duration: 100 });
    setTimeout(() => {
      forgotPasswordOpacity.value = withTiming(1, { duration: 200 });
    }, 100);
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Lógica para recuperar contraseña
  };

  const handleRegister = () => {
    registerOpacity.value = withTiming(0.6, { duration: 100 });
    setTimeout(() => {
      registerOpacity.value = withTiming(1, { duration: 200 });
    }, 100);
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/register');
  };

  return (
    <LinearGradient 
      colors={COLORS.backgroundGradient} 
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style="dark" />
      
      {/* Círculos decorativos con gradientes */}
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
      
      <Animated.View style={[styles.contentContainer, animatedStyle]}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image
            source={require('../assets/images/logo (1).png')}
            style={styles.logo}
            contentFit="contain"
          />
          <ThemedText style={styles.title}>Bienvenido a MediGo</ThemedText>
          <ThemedText style={styles.subtitle}>Tu servicio de salud a domicilio</ThemedText>
        </Animated.View>

        <View style={styles.formContainer}>
          {/* Input de correo electrónico con efecto elevado */}
          <View style={styles.inputWrapper}>
            <BlurView intensity={60} tint="light" style={styles.inputBlur}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Correo electrónico"
                  onChangeText={setEmail}
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={COLORS.placeholder}
                />
              </View>
            </BlurView>
          </View>

          {/* Input de contraseña con efecto elevado */}
          <View style={styles.inputWrapper}>
            <BlurView intensity={60} tint="light" style={styles.inputBlur}>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  onChangeText={setPassword}
                  value={password}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={COLORS.placeholder}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={COLORS.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>

          {/* Enlace olvidaste contraseña con animación */}
          <Animated.View style={animatedForgotPasswordStyle}>
            <TouchableOpacity 
              style={styles.forgotPassword} 
              onPress={handleForgotPassword}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</ThemedText>
            </TouchableOpacity>
          </Animated.View>

          {/* Botón de inicio de sesión con gradiente y animación */}
          <TouchableOpacity 
            onPressIn={handleButtonPress}
            onPressOut={handleButtonRelease}
            activeOpacity={1}
            disabled={isLoading}
          >
            <Animated.View style={[styles.buttonBase, animatedButtonStyle]}>
              <LinearGradient
                colors={COLORS.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                {isLoading ? (
                  <Animated.View style={styles.loadingContainer}>
                    <Ionicons name="sync" size={24} color={COLORS.white} style={styles.loadingIcon} />
                  </Animated.View>
                ) : (
                  <ThemedText style={styles.buttonText}>Iniciar sesión</ThemedText>
                )}
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>

          {/* Divisor con mejor estilo */}
          <View style={styles.orDivider}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.orText}>o</ThemedText>
            <View style={styles.dividerLine} />
          </View>

          {/* Enlace de registro con animación */}
          <Animated.View style={[styles.registerContainer, animatedRegisterStyle]}>
            <ThemedText style={styles.registerText}>¿No tienes una cuenta? </ThemedText>
            <TouchableOpacity 
              onPress={handleRegister}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ThemedText style={styles.registerLink}>Regístrate</ThemedText>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundCircles: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    overflow: 'hidden',
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingTop: SCREEN_HEIGHT * 0.05,
    paddingBottom: SCREEN_HEIGHT * 0.05,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  formContainer: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    marginTop: 20,
  },
  inputWrapper: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.inputShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  inputBlur: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 16,
    height: 55,
    borderRadius: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 55,
    color: COLORS.textPrimary,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  eyeIcon: {
    padding: 6,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: 4,
    paddingVertical: 4, // Para hacerlo más fácil de tocar
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  buttonBase: {
    height: 55,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIcon: {
    transform: [{ rotate: '0deg' }],
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  orText: {
    marginHorizontal: 16,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8, // Para hacerlo más fácil de tocar
  },
  registerText: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 15,
  },
}); 