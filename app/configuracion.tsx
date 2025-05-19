import React from 'react';
import { StyleSheet, View, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BottomNavbar } from '@/components/BottomNavbar';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

interface ConfigOption {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'toggle' | 'action';
  value?: boolean;
  action?: () => void;
}

export default function ConfiguracionScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  
  const [configOptions, setConfigOptions] = useState<ConfigOption[]>([
    {
      id: 'notifications',
      title: 'Notificaciones',
      icon: 'notifications',
      type: 'toggle',
      value: true
    },
    {
      id: 'darkMode',
      title: 'Modo oscuro',
      icon: 'moon',
      type: 'toggle',
      value: false
    },
    {
      id: 'biometric',
      title: 'Autenticación biométrica',
      icon: 'finger-print',
      type: 'toggle',
      value: false
    },
    {
      id: 'language',
      title: 'Idioma',
      icon: 'language',
      type: 'action',
      action: () => console.log('Seleccionar idioma')
    },
    {
      id: 'terms',
      title: 'Términos y condiciones',
      icon: 'document-text',
      type: 'action',
      action: () => console.log('Mostrar términos')
    },
    {
      id: 'privacy',
      title: 'Política de privacidad',
      icon: 'shield',
      type: 'action',
      action: () => console.log('Mostrar política privacidad')
    },
    {
      id: 'help',
      title: 'Ayuda y soporte',
      icon: 'help-circle',
      type: 'action',
      action: () => console.log('Mostrar ayuda')
    },
    {
      id: 'about',
      title: 'Acerca de MediGo',
      icon: 'information-circle',
      type: 'action',
      action: () => console.log('Mostrar información')
    }
  ]);

  const handleToggleChange = (id: string, newValue: boolean) => {
    setConfigOptions(options => 
      options.map(option => 
        option.id === id 
          ? { ...option, value: newValue } 
          : option
      )
    );
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.title}>Configuración</ThemedText>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preferencias</ThemedText>
          
          {configOptions
            .filter(option => ['notifications', 'darkMode', 'biometric', 'language'].includes(option.id))
            .map(option => (
              <View key={option.id} style={styles.optionItem}>
                <View style={styles.optionIcon}>
                  <Ionicons name={option.icon} size={22} color="#2D7FF9" />
                </View>
                <ThemedText style={styles.optionTitle}>{option.title}</ThemedText>
                
                {option.type === 'toggle' ? (
                  <Switch
                    value={option.value}
                    onValueChange={(newValue) => handleToggleChange(option.id, newValue)}
                    trackColor={{ false: '#d1d1d1', true: '#a7d8ff' }}
                    thumbColor={option.value ? '#2D7FF9' : '#f5f5f5'}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={option.action}
                    style={styles.actionButton}
                  >
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Legal y Soporte</ThemedText>
          
          {configOptions
            .filter(option => ['terms', 'privacy', 'help', 'about'].includes(option.id))
            .map(option => (
              <TouchableOpacity 
                key={option.id} 
                style={styles.optionItem}
                onPress={option.action}
              >
                <View style={styles.optionIcon}>
                  <Ionicons name={option.icon} size={22} color="#2D7FF9" />
                </View>
                <ThemedText style={styles.optionTitle}>{option.title}</ThemedText>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={20} color="#FF3B30" />
          <ThemedText style={styles.logoutText}>Cerrar sesión</ThemedText>
        </TouchableOpacity>
        
        <View style={styles.versionInfo}>
          <ThemedText style={styles.versionText}>
            Versión 1.0.0
          </ThemedText>
        </View>
      </ScrollView>
      
      <BottomNavbar />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#777',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTitle: {
    flex: 1,
    fontSize: 16,
  },
  actionButton: {
    padding: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 40,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
}); 