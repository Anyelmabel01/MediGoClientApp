import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Modal as RNModal, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  transparent?: boolean;
  animationType?: 'slide' | 'fade' | 'none';
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  statusBarStyle?: 'light' | 'dark' | 'auto';
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  transparent = true,
  animationType = 'slide',
  size = 'medium',
  statusBarStyle = 'light'
}: ModalProps) {
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { width: '80%', maxHeight: '60%' };
      case 'medium':
        return { width: '90%', maxHeight: '80%' };
      case 'large':
        return { width: '95%', maxHeight: '90%' };
      case 'fullscreen':
        return { width: '100%', height: '100%', margin: 0, borderRadius: 0 };
      default:
        return { width: '90%', maxHeight: '80%' };
    }
  };

  return (
    <RNModal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <StatusBar style={statusBarStyle} translucent />
      <View style={styles.overlay}>
        <ThemedView style={[styles.container, getSizeStyles()]}>
          {title && (
            <View style={styles.header}>
              <ThemedText style={styles.title}>{title}</ThemedText>
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.content}>
            {children}
          </View>
        </ThemedView>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  content: {
    flex: 1,
  },
}); 