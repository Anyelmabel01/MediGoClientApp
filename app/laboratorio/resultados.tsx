import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

import { useMemo, useState } from 'react';
import {
  Animated,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

type Result = {
  id: string;
  testName: string;
  date: string;
  status: 'Normal' | 'Anormal' | 'Revisión Necesaria' | 'Pendiente' | 'En Proceso';
  labName: string;
  category: string;
  downloadable: boolean;
  reportUrl?: string;
  orderingPhysician?: string;
  criticalValues?: string[];
  resultType: 'lab' | 'imaging' | 'pathology';
  priority: 'routine' | 'urgent' | 'critical';
};

const results: Result[] = [
  {
    id: '1',
    testName: 'Examen General de Orina',
    date: '2024-12-20',
    status: 'Normal',
    labName: 'Laboratorio Central Plaza',
    category: 'Análisis de Orina',
    downloadable: true,
    reportUrl: 'https://example.com/report1.pdf',
    orderingPhysician: 'Dr. María González',
    resultType: 'lab',
    priority: 'routine'
  },
  {
    id: '2',
    testName: 'Química Sanguínea 6 elementos',
    date: '2024-12-18',
    status: 'Revisión Necesaria',
    labName: 'Clínica Norte Especializada',
    category: 'Análisis de Sangre',
    downloadable: true,
    reportUrl: 'https://example.com/report2.pdf',
    orderingPhysician: 'Dr. Carlos Mendoza',
    criticalValues: ['Glucosa: 180 mg/dL (Alto)', 'Creatinina: 1.8 mg/dL (Elevada)'],
    resultType: 'lab',
    priority: 'urgent'
  },
  {
    id: '3',
    testName: 'Biometría Hemática Completa',
    date: '2024-12-15',
    status: 'Normal',
    labName: 'Centro Médico Sur',
    category: 'Análisis de Sangre',
    downloadable: true,
    reportUrl: 'https://example.com/report3.pdf',
    orderingPhysician: 'Dr. Ana Rodríguez',
    resultType: 'lab',
    priority: 'routine'
  },
  {
    id: '4',
    testName: 'Radiografía de Tórax PA y Lateral',
    date: '2024-12-12',
    status: 'Normal',
    labName: 'Centro de Diagnóstico por Imagen',
    category: 'Estudios de Imagen',
    downloadable: true,
    reportUrl: 'https://example.com/report4.pdf',
    orderingPhysician: 'Dr. Roberto Silva',
    resultType: 'imaging',
    priority: 'routine'
  },
  {
    id: '5',
    testName: 'Perfil Lipídico Completo',
    date: '2024-12-10',
    status: 'Anormal',
    labName: 'Laboratorio Central Plaza',
    category: 'Análisis de Sangre',
    downloadable: true,
    reportUrl: 'https://example.com/report5.pdf',
    orderingPhysician: 'Dr. Patricia López',
    criticalValues: ['Colesterol Total: 240 mg/dL (Alto)', 'LDL: 160 mg/dL (Alto)'],
    resultType: 'lab',
    priority: 'urgent'
  },
  {
    id: '6',
    testName: 'Función Tiroidea (TSH, T3, T4)',
    date: '2024-12-08',
    status: 'En Proceso',
    labName: 'Laboratorio Especializado',
    category: 'Análisis de Sangre',
    downloadable: false,
    orderingPhysician: 'Dr. Miguel Torres',
    resultType: 'lab',
    priority: 'routine'
  },
  {
    id: '7',
    testName: 'Ultrasonido Abdominal',
    date: '2024-12-05',
    status: 'Normal',
    labName: 'Centro de Ultrasonido',
    category: 'Estudios de Imagen',
    downloadable: true,
    reportUrl: 'https://example.com/report7.pdf',
    orderingPhysician: 'Dr. Laura Jiménez',
    resultType: 'imaging',
    priority: 'routine'
  },
  {
    id: '8',
    testName: 'Antígeno Prostático (PSA)',
    date: '2024-12-01',
    status: 'Pendiente',
    labName: 'Laboratorio Central Plaza',
    category: 'Marcadores Tumorales',
    downloadable: false,
    orderingPhysician: 'Dr. Fernando Morales',
    resultType: 'lab',
    priority: 'routine'
  }
];

const statusFilters = [
  { key: 'all', label: 'Todos', count: 0 },
  { key: 'Normal', label: 'Normal', count: 0 },
  { key: 'Anormal', label: 'Anormal', count: 0 },
  { key: 'Revisión Necesaria', label: 'Revisión', count: 0 },
  { key: 'En Proceso', label: 'En Proceso', count: 0 },
  { key: 'Pendiente', label: 'Pendiente', count: 0 }
];

export default function ResultadosScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month' | 'quarter'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para modales elegantes
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [modalAnimation] = useState(new Animated.Value(0));

  // Actualizar conteos de filtros
  useMemo(() => {
    statusFilters[0].count = results.length;
    statusFilters[1].count = results.filter(r => r.status === 'Normal').length;
    statusFilters[2].count = results.filter(r => r.status === 'Anormal').length;
    statusFilters[3].count = results.filter(r => r.status === 'Revisión Necesaria').length;
    statusFilters[4].count = results.filter(r => r.status === 'En Proceso').length;
    statusFilters[5].count = results.filter(r => r.status === 'Pendiente').length;
  }, []);

  const filteredResults = useMemo(() => {
    let filtered = results.filter(result => {
      // Filtro por búsqueda
      const matchesSearch = searchQuery === '' || 
        result.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.labName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por estado
      const matchesStatus = selectedStatus === 'all' || result.status === selectedStatus;

      // Filtro por fecha
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const resultDate = new Date(result.date);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - resultDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (dateFilter) {
          case 'week':
            matchesDate = diffInDays <= 7;
            break;
          case 'month':
            matchesDate = diffInDays <= 30;
            break;
          case 'quarter':
            matchesDate = diffInDays <= 90;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });

    // Ordenar por fecha (más recientes primero) y prioridad
    filtered.sort((a, b) => {
      const priorityOrder = { critical: 3, urgent: 2, routine: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return filtered;
  }, [searchQuery, selectedStatus, dateFilter]);

  const handleResultPress = (result: Result) => {
    router.push({
      pathname: '/laboratorio/detallesResultado',
      params: { resultId: result.id }
    });
  };

  const handleDownload = (result: Result) => {
    if (!result.downloadable) {
      setSelectedResult(result);
      setShowDownloadModal(true);
      return;
    }
    
    setSelectedResult(result);
    setShowDownloadModal(true);
  };

  const confirmDownload = () => {
    setShowDownloadModal(false);
    // Simular descarga
    setTimeout(() => {
      setShowSuccessModal(true);
      animateModal();
    }, 300);
  };

  const handleShare = (result: Result) => {
    setSelectedResult(result);
    setShowShareModal(true);
  };

  const animateModal = () => {
    Animated.spring(modalAnimation, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    modalAnimation.setValue(0);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    const colors = isDarkMode ? Colors.dark : Colors.light;
    switch (status) {
      case 'Normal':
        return colors.success;
      case 'Anormal':
      case 'Revisión Necesaria':
        return colors.error;
      case 'En Proceso':
        return '#ffc107';
      case 'Pendiente':
        return colors.textSecondary;
      default:
        return colors.border;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Normal':
        return 'checkmark-circle-outline';
      case 'Anormal':
      case 'Revisión Necesaria':
        return 'alert-circle-outline';
      case 'En Proceso':
        return 'time-outline';
      case 'Pendiente':
        return 'hourglass-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return { color: '#dc3545', text: 'CRÍTICO' };
      case 'urgent':
        return { color: '#ffc107', text: 'URGENTE' };
      default:
        return null;
    }
  };

  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
            </TouchableOpacity>
            
            <View style={styles.greetingContainer}>
              <ThemedText style={styles.greeting}>
                Mis Resultados
              </ThemedText>
              <View style={styles.editProfileIndicator}>
                <Ionicons name="document-text" size={14} color={Colors.light.primary} />
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Ionicons name="filter" size={20} color={Colors.light.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Barra de búsqueda */}
        <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.searchBar, { 
            backgroundColor: isDarkMode ? Colors.dark.border : '#F8F9FA',
            borderColor: colors.border 
          }]}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput 
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Buscar resultados..." 
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filtros */}
        {showFilters && (
          <View style={[styles.filtersContainer, { 
            backgroundColor: colors.background,
            borderColor: colors.border 
          }]}>
            <View style={styles.filterSection}>
              <ThemedText style={styles.filterLabel}>Estado:</ThemedText>
              <View style={styles.statusFilters}>
                {statusFilters.map(filter => (
                  <TouchableOpacity
                    key={filter.key}
                    style={[
                      styles.statusFilter,
                      { 
                        backgroundColor: selectedStatus === filter.key ? colors.primary : 'transparent',
                        borderColor: colors.border 
                      }
                    ]}
                    onPress={() => setSelectedStatus(filter.key)}
                  >
                    <ThemedText style={[
                      styles.statusFilterText,
                      { color: selectedStatus === filter.key ? '#fff' : colors.text }
                    ]}>
                      {filter.label} ({filter.count})
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <ThemedText style={styles.filterLabel}>Período:</ThemedText>
              <View style={styles.dateFilters}>
                {[
                  { key: 'all', label: 'Todos' },
                  { key: 'week', label: 'Última semana' },
                  { key: 'month', label: 'Último mes' },
                  { key: 'quarter', label: 'Últimos 3 meses' }
                ].map(filter => (
                  <TouchableOpacity
                    key={filter.key}
                    style={[
                      styles.dateFilter,
                      { 
                        backgroundColor: dateFilter === filter.key ? colors.primary : 'transparent',
                        borderColor: colors.border 
                      }
                    ]}
                    onPress={() => setDateFilter(filter.key as any)}
                  >
                    <ThemedText style={[
                      styles.dateFilterText,
                      { color: dateFilter === filter.key ? '#fff' : colors.text }
                    ]}>
                      {filter.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Estadísticas rápidas */}
        <View style={[styles.statsContainer, { backgroundColor: colors.background }]}>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statNumber, { color: colors.success }]}>
              {results.filter(r => r.status === 'Normal').length}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
              Normales
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statNumber, { color: colors.error }]}>
              {results.filter(r => r.status === 'Anormal' || r.status === 'Revisión Necesaria').length}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
              Requieren atención
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statNumber, { color: '#ffc107' }]}>
              {results.filter(r => r.status === 'En Proceso' || r.status === 'Pendiente').length}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
              Pendientes
            </ThemedText>
          </View>
        </View>

        {/* Resultados */}
        <View style={styles.resultsHeader}>
          <ThemedText style={[styles.resultsCount, { color: colors.textSecondary }]}>
            {filteredResults.length} resultado{filteredResults.length !== 1 ? 's' : ''} encontrado{filteredResults.length !== 1 ? 's' : ''}
          </ThemedText>
        </View>

        <FlatList
          data={filteredResults}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.resultCard, { 
                backgroundColor: colors.background,
                borderColor: colors.border 
              }]}
              onPress={() => handleResultPress(item)}
            >
              <View style={styles.resultHeader}>
                <View style={styles.resultIcon}>
                  <Ionicons 
                    name={item.resultType === 'imaging' ? 'image-outline' : 'document-text-outline'} 
                    size={24} 
                    color={colors.primary} 
                  />
                </View>
                <View style={styles.resultInfo}>
                  <View style={styles.resultTitleRow}>
                    <ThemedText style={styles.resultName} numberOfLines={2}>
                      {item.testName}
                    </ThemedText>
                    {getPriorityBadge(item.priority) && (
                      <View style={[styles.priorityBadge, { 
                        backgroundColor: getPriorityBadge(item.priority)!.color 
                      }]}>
                        <ThemedText style={styles.priorityText}>
                          {getPriorityBadge(item.priority)!.text}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  <ThemedText style={[styles.resultLab, { color: colors.textSecondary }]}>
                    {item.labName}
                  </ThemedText>
                  <ThemedText style={[styles.resultDate, { color: colors.textSecondary }]}>
                    {new Date(item.date).toLocaleDateString('es-VE', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </ThemedText>
                  {item.orderingPhysician && (
                    <ThemedText style={[styles.physician, { color: colors.textSecondary }]}>
                      Solicitado por: {item.orderingPhysician}
                    </ThemedText>
                  )}
                </View>
              </View>

              <View style={styles.resultFooter}>
                <View style={styles.statusContainer}>
                  <Ionicons 
                    name={getStatusIcon(item.status) as any} 
                    size={16} 
                    color={getStatusColor(item.status)} 
                  />
                  <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status}
                  </ThemedText>
                </View>

                <View style={styles.actions}>
                  {item.downloadable && (
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDownload(item)}
                    >
                      <Ionicons name="download-outline" size={18} color={colors.primary} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleShare(item)}
                  >
                    <Ionicons name="share-social-outline" size={18} color={colors.primary} />
                  </TouchableOpacity>
                  <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                </View>
              </View>

              {item.criticalValues && item.criticalValues.length > 0 && (
                <View style={[styles.criticalAlert, { backgroundColor: '#fef2f2', borderColor: colors.error }]}>
                  <Ionicons name="warning" size={16} color={colors.error} />
                  <View style={styles.criticalContent}>
                    <ThemedText style={[styles.criticalTitle, { color: colors.error }]}>
                      Valores que requieren atención:
                    </ThemedText>
                    {item.criticalValues.map((value, index) => (
                      <ThemedText key={index} style={[styles.criticalValue, { color: colors.error }]}>
                        • {value}
                      </ThemedText>
                    ))}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          )}
          style={styles.resultsList}
          contentContainerStyle={{ 
            paddingHorizontal: 16, 
            paddingBottom: insets.bottom + 20 
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={64} color={colors.textSecondary} />
              <ThemedText style={[styles.emptyStateTitle, { color: colors.text }]}>
                No se encontraron resultados
              </ThemedText>
              <ThemedText style={[styles.emptyStateMessage, { color: colors.textSecondary }]}>
                Ajusta tus filtros de búsqueda o verifica que tengas resultados disponibles
              </ThemedText>
            </View>
          )}
        />

        {/* Modal de Descarga */}
        <Modal
          visible={showDownloadModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowDownloadModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white }]}>
              <View style={styles.modalHeader}>
                <Ionicons name="cloud-download" size={48} color={Colors.light.primary} />
                <ThemedText style={[styles.modalTitle, { color: isDarkMode ? Colors.dark.text : Colors.light.textPrimary }]}>
                  {selectedResult?.downloadable ? 'Descargar Resultado' : 'Resultado no disponible'}
                </ThemedText>
              </View>
              
              <ThemedText style={[styles.modalMessage, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                {selectedResult?.downloadable 
                  ? `¿Deseas descargar el reporte de "${selectedResult?.testName}"?`
                  : 'Este resultado aún no está listo para descarga.'
                }
              </ThemedText>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowDownloadModal(false)}
                >
                  <ThemedText style={[styles.cancelButtonText, { color: Colors.light.textSecondary }]}>
                    Cancelar
                  </ThemedText>
                </TouchableOpacity>
                
                {selectedResult?.downloadable && (
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.confirmButton, { backgroundColor: Colors.light.primary }]}
                    onPress={confirmDownload}
                  >
                    <Ionicons name="download" size={16} color={Colors.light.white} />
                    <ThemedText style={[styles.confirmButtonText, { color: Colors.light.white }]}>
                      Descargar
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de Compartir */}
        <Modal
          visible={showShareModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowShareModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white }]}>
              <View style={styles.modalHeader}>
                <Ionicons name="share-social" size={48} color={Colors.light.primary} />
                <ThemedText style={[styles.modalTitle, { color: isDarkMode ? Colors.dark.text : Colors.light.textPrimary }]}>
                  Compartir Resultado
                </ThemedText>
              </View>
              
              <ThemedText style={[styles.modalMessage, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                ¿Cómo deseas compartir este resultado?
              </ThemedText>
              
              <View style={styles.shareOptions}>
                <TouchableOpacity 
                  style={[styles.shareOption, { borderColor: Colors.light.border }]}
                  onPress={() => {
                    setShowShareModal(false);
                    // Lógica de compartir con médico
                  }}
                >
                  <Ionicons name="medical" size={24} color={Colors.light.primary} />
                  <ThemedText style={[styles.shareOptionText, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
                    Con mi médico
                  </ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.shareOption, { borderColor: Colors.light.border }]}
                  onPress={() => {
                    setShowShareModal(false);
                    // Lógica de compartir por email
                  }}
                >
                  <Ionicons name="mail" size={24} color={Colors.light.primary} />
                  <ThemedText style={[styles.shareOptionText, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
                    Por email
                  </ThemedText>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowShareModal(false)}
              >
                <ThemedText style={[styles.cancelButtonText, { color: Colors.light.textSecondary }]}>
                  Cancelar
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal de Éxito */}
        <Modal
          visible={showSuccessModal}
          animationType="fade"
          transparent={true}
          onRequestClose={closeSuccessModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View 
              style={[
                styles.successModalContainer,
                { 
                  backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
                  transform: [{ scale: modalAnimation }],
                  opacity: modalAnimation,
                }
              ]}
            >
              <View style={styles.successIconContainer}>
                <Ionicons name="checkmark-circle" size={64} color={Colors.light.success} />
              </View>
              
              <ThemedText style={[styles.successTitle, { color: isDarkMode ? Colors.dark.text : Colors.light.textPrimary }]}>
                ¡Descarga exitosa!
              </ThemedText>
              
              <ThemedText style={[styles.successMessage, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                El resultado se ha descargado correctamente en tu dispositivo.
              </ThemedText>
              
              <TouchableOpacity 
                style={[styles.successButton, { backgroundColor: Colors.light.primary }]}
                onPress={closeSuccessModal}
              >
                <ThemedText style={[styles.successButtonText, { color: Colors.light.white }]}>
                  Entendido
                </ThemedText>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexWrap: 'nowrap',
  },
  greeting: {
    fontSize: 19,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  editProfileIndicator: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 4,
    marginLeft: 8,
  },
  filterButton: {
    padding: 8,
    marginLeft: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filtersContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusFilterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  dateFilterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultsList: {
    flex: 1,
  },
  resultCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  resultIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultLab: {
    fontSize: 14,
    marginBottom: 2,
  },
  resultDate: {
    fontSize: 13,
    marginBottom: 2,
  },
  physician: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  criticalAlert: {
    flexDirection: 'row',
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  criticalContent: {
    flex: 1,
    marginLeft: 8,
  },
  criticalTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  criticalValue: {
    fontSize: 12,
    marginBottom: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    margin: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    minWidth: 300,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  confirmButton: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  shareOptions: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  shareOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  successModalContainer: {
    margin: 20,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  successButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 