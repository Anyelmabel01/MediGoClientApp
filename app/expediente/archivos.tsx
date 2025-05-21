import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppContainer } from '@/components/AppContainer';
import { CardContainer } from '@/components/CardContainer';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

// Tipos de documentos permitidos
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/heic',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Modelo para los documentos médicos
interface MedicalDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uri: string;
  date: string;
  category: 'report' | 'exam' | 'prescription' | 'other';
}

// Datos de ejemplo
const mockDocuments: MedicalDocument[] = [
  {
    id: '1',
    name: 'Análisis de sangre.pdf',
    type: 'application/pdf',
    size: 1243000,
    uri: '',
    date: '20/10/2023',
    category: 'exam'
  },
  {
    id: '2',
    name: 'Radiografía de tórax.jpg',
    type: 'image/jpeg',
    size: 3540000,
    uri: '',
    date: '05/07/2023',
    category: 'exam'
  },
  {
    id: '3',
    name: 'Receta antibióticos.pdf',
    type: 'application/pdf',
    size: 452000,
    uri: '',
    date: '15/04/2023',
    category: 'prescription'
  },
  {
    id: '4',
    name: 'Informe médico anual.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 843000,
    uri: '',
    date: '10/01/2023',
    category: 'report'
  },
];

export default function MedicalFilesScreen() {
  const { isDarkMode } = useTheme();
  const [documents, setDocuments] = useState<MedicalDocument[]>(mockDocuments);
  const [currentFilter, setCurrentFilter] = useState<string>('all');

  // Función para formatear el tamaño de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Función para elegir el icono según el tipo de archivo
  const getFileIcon = (type: string): string => {
    if (type.includes('pdf')) return 'document-text';
    if (type.includes('image')) return 'image';
    if (type.includes('word')) return 'document';
    return 'document-attach';
  };

  // Función para seleccionar documentos
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ALLOWED_TYPES,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      // Crear un nuevo documento con los datos del archivo seleccionado
      const asset = result.assets[0];
      const newDocument: MedicalDocument = {
        id: Date.now().toString(),
        name: asset.name,
        type: asset.mimeType || 'application/octet-stream',
        size: asset.size || 0,
        uri: asset.uri,
        date: new Date().toLocaleDateString('es-ES'),
        category: 'other', // Por defecto, se puede cambiar después
      };

      // Agregar el nuevo documento a la lista
      setDocuments([newDocument, ...documents]);
    } catch (error) {
      console.error('Error seleccionando el documento:', error);
      Alert.alert('Error', 'No se pudo seleccionar el documento.');
    }
  };

  // Función para compartir un documento
  const shareDocument = async (document: MedicalDocument) => {
    try {
      // Verificar si está disponible la opción de compartir
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'La opción de compartir no está disponible en este dispositivo.');
        return;
      }

      // Compartir el documento
      await Sharing.shareAsync(document.uri);
    } catch (error) {
      console.error('Error compartiendo el documento:', error);
      Alert.alert('Error', 'No se pudo compartir el documento.');
    }
  };

  // Función para eliminar un documento
  const deleteDocument = (id: string) => {
    Alert.alert(
      'Eliminar documento',
      '¿Estás seguro de que deseas eliminar este documento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setDocuments(documents.filter(doc => doc.id !== id));
          },
        },
      ]
    );
  };

  // Filtrar documentos según la categoría seleccionada
  const filteredDocuments = currentFilter === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === currentFilter);

  // Renderizar cada elemento de la lista
  const renderDocumentItem = ({ item }: { item: MedicalDocument }) => (
    <CardContainer
      title={item.name}
      subtitle={`${formatFileSize(item.size)} • ${item.date}`}
      onPress={() => {
        // Aquí iría la lógica para visualizar el documento
        Alert.alert('Ver documento', `Visualizando ${item.name}`);
      }}
      icon={
        <Ionicons 
          name={getFileIcon(item.type) as any} 
          size={22} 
          color={Colors.light.primary}
        />
      }
      rightElement={
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => shareDocument(item)} style={styles.actionButton}>
            <Ionicons 
              name="share-outline" 
              size={20} 
              color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteDocument(item.id)} style={styles.actionButton}>
            <Ionicons 
              name="trash-outline" 
              size={20} 
              color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      }
    >
      <View style={styles.statusBadge}>
        <ThemedText style={styles.statusText}>
          {item.category === 'exam' ? 'Examen' : 
           item.category === 'report' ? 'Informe' : 
           item.category === 'prescription' ? 'Receta' : 'Otro'}
        </ThemedText>
      </View>
    </CardContainer>
  );

  return (
    <AppContainer
      title="Archivos Médicos"
      showBackButton={true}
      scrollable={false}
    >
      {/* Botón para agregar documento */}
      <View style={styles.uploadButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.uploadButton, 
            { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white }
          ]}
          onPress={pickDocument}
        >
          <Ionicons 
            name="cloud-upload" 
            size={24} 
            color={Colors.light.primary} 
          />
          <ThemedText style={styles.uploadButtonText}>
            Subir nuevo documento
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Filtros por categoría */}
      <View style={styles.filterContainer}>
        <ScrollableFilters 
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          isDarkMode={isDarkMode}
        />
      </View>

      {/* Lista de documentos */}
      {filteredDocuments.length > 0 ? (
        <FlatList
          data={filteredDocuments}
          renderItem={renderDocumentItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="document-text" 
            size={64} 
            color={isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} 
          />
          <ThemedText style={styles.emptyText}>
            No tienes documentos en esta categoría
          </ThemedText>
          <TouchableOpacity 
            style={styles.emptyButton} 
            onPress={pickDocument}
          >
            <ThemedText style={styles.emptyButtonText}>
              Subir documento
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </AppContainer>
  );
}

// Componente para los filtros horizontales
function ScrollableFilters({ 
  currentFilter, 
  onFilterChange, 
  isDarkMode 
}: { 
  currentFilter: string, 
  onFilterChange: (filter: string) => void, 
  isDarkMode: boolean 
}) {
  const filters = [
    { id: 'all', label: 'Todos', icon: 'albums' },
    { id: 'report', label: 'Informes', icon: 'clipboard' },
    { id: 'exam', label: 'Exámenes', icon: 'flask' },
    { id: 'prescription', label: 'Recetas', icon: 'medkit' },
    { id: 'other', label: 'Otros', icon: 'document' },
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersRow}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterItem,
            currentFilter === filter.id && styles.activeFilterItem,
            currentFilter === filter.id && { backgroundColor: Colors.light.primary },
            { borderColor: isDarkMode ? Colors.dark.border : Colors.light.border }
          ]}
          onPress={() => onFilterChange(filter.id)}
        >
          <Ionicons
            name={filter.icon as any}
            size={16}
            color={currentFilter === filter.id ? '#fff' : Colors.light.primary}
            style={styles.filterIcon}
          />
          <ThemedText
            style={[
              styles.filterText,
              currentFilter === filter.id && styles.activeFilterText,
              { color: currentFilter === filter.id ? '#fff' : undefined }
            ]}
          >
            {filter.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  uploadButtonContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filtersRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  activeFilterItem: {
    borderWidth: 0,
  },
  filterIcon: {
    marginRight: 4,
  },
  filterText: {
    fontSize: 14,
  },
  activeFilterText: {
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.light.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 