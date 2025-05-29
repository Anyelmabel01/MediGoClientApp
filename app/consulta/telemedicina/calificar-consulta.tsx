import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';

// Login color palette
const PRIMARY_COLOR = '#00A0B0';
const PRIMARY_LIGHT = '#33b5c2';
const PRIMARY_DARK = '#006070';
const ACCENT_COLOR = '#70D0E0';

type RatingCategory = {
  id: string;
  title: string;
  subtitle: string;
  rating: number;
  icon: string;
};

export default function CalificarConsultaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { specialistId } = useLocalSearchParams();
  
  const [overallRating, setOverallRating] = useState(0);
  const [categories, setCategories] = useState<RatingCategory[]>([
    {
      id: 'communication',
      title: 'Comunicación',
      subtitle: 'Claridad y calidad de la explicación',
      rating: 0,
      icon: 'chatbubble'
    },
    {
      id: 'professionalism',
      title: 'Profesionalismo',
      subtitle: 'Puntualidad y conducta profesional',
      rating: 0,
      icon: 'shield-checkmark'
    },
    {
      id: 'satisfaction',
      title: 'Satisfacción',
      subtitle: 'Satisfacción general con la consulta',
      rating: 0,
      icon: 'heart'
    },
    {
      id: 'recommendation',
      title: 'Recomendación',
      subtitle: '¿Recomendarías este especialista?',
      rating: 0,
      icon: 'thumbs-up'
    }
  ]);
  
  const [feedback, setFeedback] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock doctor data
  const doctorInfo = {
    name: 'Dr. Carlos Mendoza',
    specialty: 'Cardiología',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face'
  };

  const updateCategoryRating = (categoryId: string, rating: number) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, rating } : cat
    ));
  };

  const renderStars = (rating: number, onPress?: (rating: number) => void, size: number = 24) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => onPress && onPress(i)}
          disabled={!onPress}
          style={styles.starButton}
        >
          <Ionicons 
            name={i <= rating ? "star" : "star-outline"} 
            size={size} 
            color="#fbbf24" 
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const canSubmit = () => {
    return overallRating > 0 && categories.every(cat => cat.rating > 0) && wouldRecommend !== null;
  };

  const handleSubmit = async () => {
    if (!canSubmit()) {
      Alert.alert(
        'Información incompleta',
        'Por favor completa todas las calificaciones antes de enviar.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        '¡Gracias por tu calificación!',
        'Tu opinión nos ayuda a mejorar la calidad de nuestros servicios.',
        [
          {
            text: 'Ir al Inicio',
            onPress: () => {
              router.replace('/');
            }
          },
          {
            text: 'Ver Consultas',
            onPress: () => {
              router.replace('/consulta');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la calificación. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = categories.reduce((sum, cat) => sum + cat.rating, 0) / categories.length;

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
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

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Doctor Info */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <View style={styles.doctorHeader}>
            <Image 
              source={{ uri: doctorInfo.avatar }}
              style={styles.doctorAvatar}
            />
            <View style={styles.doctorInfo}>
              <ThemedText style={styles.doctorName}>{doctorInfo.name}</ThemedText>
              <ThemedText style={[styles.doctorSpecialty, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                {doctorInfo.specialty}
              </ThemedText>
              <View style={styles.consultationStatus}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <ThemedText style={[styles.statusText, { color: '#10b981' }]}>
                  Consulta completada
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Overall Rating */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Calificación General</ThemedText>
          <ThemedText style={[styles.sectionDescription, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            ¿Cómo calificarías esta consulta en general?
          </ThemedText>
          
          <View style={styles.overallRatingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(overallRating, setOverallRating, 36)}
            </View>
            <ThemedText style={[styles.ratingText, { color: PRIMARY_COLOR }]}>
              {overallRating > 0 ? `${overallRating} de 5 estrellas` : 'Selecciona una calificación'}
            </ThemedText>
          </View>
        </View>

        {/* Category Ratings */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Calificación Detallada</ThemedText>
          <ThemedText style={[styles.sectionDescription, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            Califica diferentes aspectos de la consulta
          </ThemedText>

          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <View key={category.id} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryIconContainer}>
                    <Ionicons 
                      name={category.icon as any} 
                      size={20} 
                      color={PRIMARY_COLOR} 
                    />
                  </View>
                  <View style={styles.categoryInfo}>
                    <ThemedText style={styles.categoryTitle}>{category.title}</ThemedText>
                    <ThemedText style={[styles.categorySubtitle, {
                      color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                    }]}>
                      {category.subtitle}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.categoryRating}>
                  {renderStars(category.rating, (rating) => updateCategoryRating(category.id, rating), 20)}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recommendation */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Recomendación</ThemedText>
          <ThemedText style={[styles.sectionDescription, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            ¿Recomendarías este especialista a otros pacientes?
          </ThemedText>

          <View style={styles.recommendationContainer}>
            <TouchableOpacity
              style={[
                styles.recommendationButton,
                {
                  backgroundColor: wouldRecommend === true ? '#10b981' : 'transparent',
                  borderColor: '#10b981'
                }
              ]}
              onPress={() => setWouldRecommend(true)}
            >
              <Ionicons 
                name="thumbs-up" 
                size={20} 
                color={wouldRecommend === true ? 'white' : '#10b981'} 
              />
              <ThemedText style={[
                styles.recommendationText,
                { color: wouldRecommend === true ? 'white' : '#10b981' }
              ]}>
                Sí, lo recomiendo
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.recommendationButton,
                {
                  backgroundColor: wouldRecommend === false ? '#ef4444' : 'transparent',
                  borderColor: '#ef4444'
                }
              ]}
              onPress={() => setWouldRecommend(false)}
            >
              <Ionicons 
                name="thumbs-down" 
                size={20} 
                color={wouldRecommend === false ? 'white' : '#ef4444'} 
              />
              <ThemedText style={[
                styles.recommendationText,
                { color: wouldRecommend === false ? 'white' : '#ef4444' }
              ]}>
                No lo recomiendo
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Feedback */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Comentarios Adicionales</ThemedText>
          <ThemedText style={[styles.sectionDescription, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            Comparte tu experiencia o sugerencias (opcional)
          </ThemedText>

          <TextInput
            style={[styles.feedbackInput, {
              backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
              borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
              color: isDarkMode ? Colors.dark.text : Colors.light.text
            }]}
            placeholder="Escribe tus comentarios aquí..."
            placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <ThemedText style={[styles.characterCount, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            {feedback.length}/500 caracteres
          </ThemedText>
        </View>

        {/* Rating Summary */}
        {averageRating > 0 && (
          <View style={[styles.section, {
            backgroundColor: PRIMARY_COLOR + '10',
            borderColor: PRIMARY_COLOR + '30',
          }]}>
            <View style={styles.summaryHeader}>
              <Ionicons name="analytics" size={24} color={PRIMARY_COLOR} />
              <ThemedText style={[styles.summaryTitle, { color: PRIMARY_COLOR }]}>
                Resumen de Calificación
              </ThemedText>
            </View>
            <View style={styles.summaryContent}>
              <ThemedText style={styles.averageRating}>
                Promedio: {averageRating.toFixed(1)} estrellas
              </ThemedText>
              {renderStars(Math.round(averageRating), undefined, 16)}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Submit Button */}
      <View style={[styles.submitContainer, {
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderTopColor: isDarkMode ? Colors.dark.border : Colors.light.border,
      }]}>
        <TouchableOpacity 
          style={[
            styles.submitButton,
            { 
              backgroundColor: canSubmit() ? PRIMARY_COLOR : Colors.light.textSecondary,
              opacity: canSubmit() ? 1 : 0.6
            }
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit() || isSubmitting}
        >
          {isSubmitting ? (
            <ThemedText style={styles.submitButtonText}>Enviando...</ThemedText>
          ) : (
            <>
              <Ionicons name="send" size={20} color="white" />
              <ThemedText style={styles.submitButtonText}>Enviar Calificación</ThemedText>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
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
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.white,
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    marginBottom: 8,
  },
  consultationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
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
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesContainer: {
    gap: 16,
  },
  categoryItem: {
    gap: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_COLOR + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 12,
  },
  categoryRating: {
    flexDirection: 'row',
    gap: 4,
    paddingLeft: 52,
  },
  recommendationContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  recommendationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  recommendationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  feedbackInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 14,
    lineHeight: 20,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  averageRating: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
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
  },
  skipButton: {
    padding: 6,
  },
  skipButtonText: {
    color: Colors.light.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 