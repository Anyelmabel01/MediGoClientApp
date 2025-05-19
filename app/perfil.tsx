import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BottomNavbar } from '@/components/BottomNavbar';
import { UserProfile } from '@/components/UserProfile';
import { LocationSelector } from '@/components/LocationSelector';
import { mockUser, mockLocations } from '@/constants/UserModel';

export default function PerfilScreen() {
  const [user] = useState(mockUser);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  
  const [currentLocation] = useState(mockLocations.find(loc => loc.esPrincipal) || mockLocations[0]);

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.title}>Mi Perfil</ThemedText>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={styles.profileHeader}
            onPress={() => setShowUserProfile(true)}
          >
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <ThemedText style={styles.avatarText}>
                    {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                  </ThemedText>
                </View>
              )}
            </View>
            
            <View style={styles.profileInfo}>
              <ThemedText style={styles.userName}>
                {user.nombre} {user.apellido}
              </ThemedText>
              <ThemedText style={styles.userEmail}>
                {user.email}
              </ThemedText>
              <View style={styles.editProfileButton}>
                <ThemedText style={styles.editProfileText}>
                  Editar perfil
                </ThemedText>
                <Ionicons name="pencil" size={14} color="#2D7FF9" />
              </View>
            </View>
          </TouchableOpacity>
          
          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <Ionicons name="water" size={24} color="#2D7FF9" />
              <ThemedText style={styles.infoCardTitle}>Tipo de sangre</ThemedText>
              <ThemedText style={styles.infoCardValue}>{user.tipoSangre}</ThemedText>
            </View>
            
            <View style={styles.infoCard}>
              <Ionicons name="fitness" size={24} color="#2D7FF9" />
              <ThemedText style={styles.infoCardTitle}>Peso</ThemedText>
              <ThemedText style={styles.infoCardValue}>{user.peso} kg</ThemedText>
            </View>
            
            <View style={styles.infoCard}>
              <Ionicons name="resize" size={24} color="#2D7FF9" />
              <ThemedText style={styles.infoCardTitle}>Altura</ThemedText>
              <ThemedText style={styles.infoCardValue}>{user.altura} cm</ThemedText>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Mi ubicación</ThemedText>
          
          <TouchableOpacity 
            style={styles.locationCard}
            onPress={() => setShowLocationSelector(true)}
          >
            <View style={styles.locationIconContainer}>
              <Ionicons name="location" size={24} color="#2D7FF9" />
            </View>
            
            <View style={styles.locationInfo}>
              <ThemedText style={styles.locationName}>
                {currentLocation.nombre}
              </ThemedText>
              <ThemedText style={styles.locationAddress}>
                {currentLocation.direccion}
              </ThemedText>
            </View>
            
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Accesos rápidos</ThemedText>
          
          <View style={styles.quickLinks}>
            <TouchableOpacity style={styles.quickLinkItem}>
              <View style={styles.quickLinkIcon}>
                <Ionicons name="medkit" size={20} color="#2D7FF9" />
              </View>
              <ThemedText style={styles.quickLinkText}>Mis citas</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickLinkItem}>
              <View style={styles.quickLinkIcon}>
                <Ionicons name="document-text" size={20} color="#2D7FF9" />
              </View>
              <ThemedText style={styles.quickLinkText}>Expediente</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickLinkItem}>
              <View style={styles.quickLinkIcon}>
                <Ionicons name="wallet" size={20} color="#2D7FF9" />
              </View>
              <ThemedText style={styles.quickLinkText}>Pagos</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickLinkItem}>
              <View style={styles.quickLinkIcon}>
                <Ionicons name="heart" size={20} color="#2D7FF9" />
              </View>
              <ThemedText style={styles.quickLinkText}>Favoritos</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      <BottomNavbar />
      
      <UserProfile 
        isVisible={showUserProfile} 
        onClose={() => setShowUserProfile(false)}
      />
      
      <LocationSelector 
        isVisible={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
      />
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
  profileSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2D7FF9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProfileText: {
    color: '#2D7FF9',
    marginRight: 4,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  infoCardTitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 8,
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
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
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#777',
  },
  quickLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    backgroundColor: '#fff',
  },
  quickLinkItem: {
    width: '50%',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickLinkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickLinkText: {
    fontSize: 14,
  },
}); 