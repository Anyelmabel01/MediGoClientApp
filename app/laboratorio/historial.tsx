import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

// Datos de ejemplo simplificados
const groupedHistory = [
  { date: 'Junio 2024', tests: [
    { id: '1', name: 'Glucosa en Ayunas', status: 'Normal' },
    { id: '2', name: 'Colesterol Total', status: 'Anormal' },
  ]},
  { date: 'Mayo 2024', tests: [
    { id: '3', name: 'Hemoglobina', status: 'Normal' },
  ]},
];

export default function HistorialScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Junio 2024': true, 
    'Mayo 2024': true,
    'Abril 2024': true
  });

  const colors = isDarkMode ? Colors.dark : Colors.light;

  const handleBackPress = () => {
    router.push('/laboratorio');
  };

  const toggleGroup = (date: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  // Función para navegar al detalle
  const handleTestPress = (testId: string, testName: string) => {
    console.log("Navegando a detalles:", testId, testName);
    router.push({
      pathname: '/laboratorio/detallesResultado',
      params: { resultId: testId, resultName: testName }
    });
  }

  const handleExportHistory = async () => {
    try {
      // Format history data for sharing
      const historyText = groupedHistory
        .map(group => {
          return `📅 ${group.date}\n${group.tests
            .map(test => `- ${test.name}: ${test.status}`)
            .join('\n')}`;
        })
        .join('\n\n');

      const result = await Share.share({
        message: `Mi Historial de Pruebas MediGo\n\n${historyText}`,
        title: 'Historial de Pruebas MediGo'
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared via ${result.activityType}`);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el historial');
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#00A0B0', '#0081B0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Historial de Pruebas</ThemedText>
          <TouchableOpacity 
            style={styles.exportButton}
            onPress={handleExportHistory}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          >
            <Ionicons name="download-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={{marginTop:10}}>
        {groupedHistory.map(group => (
          <View key={group.date} style={styles.groupBlock}>
            <ThemedText style={styles.groupDate}>{group.date}</ThemedText>
            {group.tests.map(test => (
              <TouchableOpacity 
                key={test.id} 
                style={styles.testCard}
                onPress={() => handleTestPress(test.id, test.name)}
              >
                <Ionicons name="flask-outline" size={22} color="#00A0B0" style={{marginRight:10}} />
                <ThemedText style={styles.testName}>{test.name}</ThemedText>
                <ThemedText style={[styles.statusBadge, {backgroundColor: test.status==='Normal'?'#28a745':'#dc3545'}]}>{test.status}</ThemedText>
                <Ionicons name="chevron-forward" size={18} color="#6C757D" style={{marginLeft:10}} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20 },
  headerGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  exportButton: {
    padding: 8,
  },
  groupBlock: { marginBottom:18 },
  groupDate: { fontWeight:'bold', color:'#6C757D', marginBottom:6 },
  testCard: { flexDirection:'row', alignItems:'center', backgroundColor:'#fff', borderRadius:10, padding:10, marginBottom:6, borderWidth:1, borderColor:'#E9ECEF' },
  testName: { flex:1, fontSize:15 },
  statusBadge: { paddingHorizontal:8, paddingVertical:2, borderRadius:10, color:'#fff', fontWeight:'bold', marginLeft:8, fontSize:12 },
  exportBtn: { flexDirection:'row', alignItems:'center', alignSelf:'flex-end', backgroundColor:'#E9ECEF', borderRadius:8, paddingHorizontal:12, paddingVertical:6 },
  exportLabel: { marginLeft:6, color:'#00A0B0', fontWeight:'600' },
}); 