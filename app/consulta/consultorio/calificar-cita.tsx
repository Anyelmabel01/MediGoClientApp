import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Paleta de colores oficial MediGo
const COLORS = {
  primary: '#00A0B0',
  primaryLight: '#33b5c2',
  primaryDark: '#006070',
  accent: '#70D0E0',
  background: '#FFFFFF',
  textPrimary: '#212529',
  textSecondary: '#6C757D',
  white: '#FFFFFF',
  success: '#28a745',
  error: '#dc3545',
  warning: '#ffc107',
  border: '#E9ECEF',
  cardBg: '#f8f9fa',
};

type RatingCategory = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  rating: number;
};

type ExperienceHighlight = {
  id: string;
  label: string;
  selected: boolean;
};

type Provider = {
  id: string;
  display_name: string;
  provider_type: string;
  organization_name?: string;
  avatar_url?: string;
};

// Mock provider data
const mockProviders: Record<string, Provider> = {
  '1': {
    id: '1',
    display_name: 'Dr. María González',
    provider_type: 'Cardióloga',
    organization_name: 'Centro Médico Integral',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
  },
  '2': {
    id: '2',
    display_name: 'Dr. Carlos Ramírez',
    provider_type: 'Médico General',
    organization_name: 'Clínica San Miguel',
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
  }
};

export default function CalificarCitaScreen() {
  const router = useRouter();
  const { appointmentId, providerId } = useLocalSearchParams();
  
  const [overallRating, setOverallRating] = useState(0);
  const [comments, setComments] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [ratingCategories, setRatingCategories] = useState<RatingCategory[]>([
    {
      id: 'punctuality',
      title: 'Puntualidad',
      subtitle: 'El doctor llegó a tiempo',
      icon: 'time-outline',
      rating: 0
    },
    {
      id: 'communication',
      title: 'Comunicación',
      subtitle: 'Explicó claramente el diagnóstico',
      icon: 'chatbubble-outline',
      rating: 0
    },
    {
      id: 'professionalism',
      title: 'Profesionalismo',
      subtitle: 'Trato profesional y cortés',
      icon: 'medical-outline',
      rating: 0
    },
    {
      id: 'facilities',
      title: 'Instalaciones',
      subtitle: 'Limpieza y comodidad del consultorio',
      icon: 'business-outline',
      rating: 0
    },
    {
      id: 'satisfaction',
      title: 'Satisfacción general',
      subtitle: 'Qué tan satisfecho estás con la consulta',
      icon: 'happy-outline',
      rating: 0
    }
  ]);

  const [experienceHighlights, setExperienceHighlights] = useState<ExperienceHighlight[]>([
    { id: 'empático', label: 'Empático', selected: false },
    { id: 'conocedor', label: 'Conocedor', selected: false },
    { id: 'paciente', label: 'Paciente', selected: false },
    { id: 'claro', label: 'Explicaciones claras', selected: false },
    { id: 'rápido', label: 'Consulta eficiente', selected: false },
    { id: 'atento', label: 'Muy atento', selected: false },
    { id: 'resolutivo', label: 'Resolutivo', selected: false },
    { id: 'confiable', label: 'Confiable', selected: false }
  ]);

  const provider = mockProviders[providerId as string];

  if (!provider) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>Calificar Consulta</ThemedText>
          </View>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={[styles.emptyTitle, { color: COLORS.error }]}>
            Consulta no encontrada
          </Text>
        </View>
      </View>
    );
  }

  const handleCategoryRating = (categoryId: string, rating: number) => {
    setRatingCategories(categories =>
      categories.map(category =>
        category.id === categoryId ? { ...category, rating } : category
      )
    );
  };

  const toggleExperienceHighlight = (highlightId: string) => {
    setExperienceHighlights(highlights =>
      highlights.map(highlight =>
        highlight.id === highlightId
          ? { ...highlight, selected: !highlight.selected }
          : highlight
      )
    );
  };

  const renderStarRating = (
    rating: number, 
    onPress: (rating: number) => void, 
    size: number = 24,
    readonly: boolean = false
  ) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => !readonly && onPress(i)}
          disabled={readonly}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={size}
            color={i <= rating ? '#fbbf24' : '#d1d5db'}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const calculateAverageRating = () => {
    const ratings = ratingCategories.map(category => category.rating);
    const validRatings = ratings.filter(rating => rating > 0);
    if (validRatings.length === 0) return 0;
    return validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length;
  };

  const validateForm = () => {
    if (overallRating === 0) {
      Alert.alert('Calificación requerida', 'Por favor califica tu experiencia general.');
      return false;
    }
    return true;
  };

  const handleSubmitRating = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    const selectedHighlights = experienceHighlights
      .filter(highlight => highlight.selected)
      .map(highlight => highlight.label);

    const averageDetailedRating = calculateAverageRating();

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Calificación enviada',
        'Gracias por tu retroalimentación. Tu calificación nos ayuda a mejorar el servicio.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    }, 2000);
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header simplificado */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Calificar Consulta</ThemedText>
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => {
              Alert.alert(
                'Omitir calificación',
                '¿Estás seguro de que quieres ir al inicio sin calificar la consulta?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { 
                    text: 'Sí, omitir', 
                    onPress: () => router.replace('/')
                  }
                ]
              );
            }}
          >
            <ThemedText style={styles.skipButtonText}>Omitir</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Provider Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Cómo fue tu consulta?</Text>
          
          <View style={styles.providerInfo}>
            <Image 
              source={{ uri: provider.avatar_url || 'https://via.placeholder.com/80' }}
              style={styles.providerAvatar}
            />
            <View style={styles.providerDetails}>
              <Text style={styles.providerName}>{provider.display_name}</Text>
              <Text style={styles.providerType}>{provider.provider_type}</Text>
              {provider.organization_name && (
                <Text style={styles.organizationName}>
                  {provider.organization_name}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Overall Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calificación general</Text>
          <Text style={styles.sectionSubtitle}>
            ¿Cómo calificarías tu experiencia general?
          </Text>
          
          <View style={styles.overallRatingContainer}>
            <View style={styles.starsContainer}>
              {renderStarRating(overallRating, setOverallRating, 32)}
            </View>
            {overallRating > 0 && (
              <Text style={styles.ratingLabel}>
                {overallRating === 1 && 'Muy malo'}
                {overallRating === 2 && 'Malo'}
                {overallRating === 3 && 'Regular'}
                {overallRating === 4 && 'Bueno'}
                {overallRating === 5 && 'Excelente'}
              </Text>
            )}
          </View>
        </View>

        {/* Detailed Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calificación detallada</Text>
          <Text style={styles.sectionSubtitle}>
            Ayúdanos a mejorar calificando aspectos específicos
          </Text>
          
          {ratingCategories.map((category) => (
            <View key={category.id} style={styles.categoryContainer}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <Ionicons 
                    name={category.icon as any} 
                    size={20} 
                      color={Colors.light.primary} 
                  />
                  <View style={styles.categoryText}>
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                    <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.categoryRating}>
                {renderStarRating(
                  category.rating, 
                  (rating) => handleCategoryRating(category.id, rating),
                  20
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Experience Highlights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aspectos destacados</Text>
          <Text style={styles.sectionSubtitle}>
            Selecciona lo que más te gustó de la consulta
          </Text>
          
          <View style={styles.highlightsContainer}>
            {experienceHighlights.map((highlight) => (
              <TouchableOpacity
                key={highlight.id}
                style={[
                  styles.highlightChip,
                  highlight.selected && styles.selectedHighlightChip
                ]}
                onPress={() => toggleExperienceHighlight(highlight.id)}
              >
                <Text style={[
                  styles.highlightText,
                    { color: highlight.selected ? Colors.light.white : Colors.light.primary }
                ]}>
                  {highlight.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recommendation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recomendación</Text>
          <Text style={styles.sectionSubtitle}>
            ¿Recomendarías este doctor a otros pacientes?
          </Text>
          
          <View style={styles.recommendationContainer}>
            <TouchableOpacity
              style={[
                styles.recommendButton,
                wouldRecommend === true && styles.selectedRecommendButton
              ]}
              onPress={() => setWouldRecommend(true)}
            >
              <Ionicons 
                name="thumbs-up" 
                size={24} 
                  color={wouldRecommend === true ? Colors.light.white : COLORS.success} 
              />
              <Text style={[
                styles.recommendText,
                  { color: wouldRecommend === true ? Colors.light.white : COLORS.success }
              ]}>
                Sí, lo recomiendo
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.recommendButton,
                wouldRecommend === false && styles.selectedNotRecommendButton
              ]}
              onPress={() => setWouldRecommend(false)}
            >
              <Ionicons 
                name="thumbs-down" 
                size={24} 
                  color={wouldRecommend === false ? Colors.light.white : COLORS.error} 
              />
              <Text style={[
                styles.recommendText,
                  { color: wouldRecommend === false ? Colors.light.white : COLORS.error }
              ]}>
                No lo recomiendo
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comentarios adicionales</Text>
          <Text style={styles.sectionSubtitle}>
            Comparte más detalles sobre tu experiencia (opcional)
          </Text>
          
          <TextInput
            style={styles.commentsInput}
            placeholder="Escribe tus comentarios aquí..."
              placeholderTextColor={Colors.light.textSecondary}
            value={comments}
            onChangeText={setComments}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            />
          </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity 
          style={[
            styles.submitButton,
              { backgroundColor: overallRating > 0 ? Colors.light.primary : Colors.light.textSecondary }
          ]}
          onPress={handleSubmitRating}
            disabled={isSubmitting || overallRating === 0}
        >
              <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Enviando...' : 'Enviar calificación'}
              </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingBottom: Platform.OS === 'ios' ? 80 : 60,
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: 45,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.light.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.light.text,
  },
  providerType: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  organizationName: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  overallRatingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  categoryContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  categoryHeader: {
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryText: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    color: Colors.light.text,
  },
  categorySubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  categoryRating: {
    flexDirection: 'row',
    gap: 4,
  },
  highlightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  highlightChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.white,
  },
  selectedHighlightChip: {
    backgroundColor: Colors.light.primary,
  },
  highlightText: {
    fontSize: 14,
    fontWeight: '500',
  },
  recommendationContainer: {
    gap: 12,
  },
  recommendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.white,
  },
  selectedRecommendButton: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  selectedNotRecommendButton: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
  recommendText: {
    fontSize: 16,
    fontWeight: '600',
  },
  commentsInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.light.text,
    backgroundColor: Colors.light.white,
    minHeight: 100,
    marginBottom: 8,
  },
  submitContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.light.white,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  skipButton: {
    padding: 6,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
}); 