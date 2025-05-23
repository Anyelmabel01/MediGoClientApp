import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

const groupedHistory = [
  { date: '2024-06', tests: [
    { id: '1', name: 'Glucosa en Ayunas', status: 'Normal' },
    { id: '2', name: 'Colesterol Total', status: 'Anormal' },
  ]},
  { date: '2024-05', tests: [
    { id: '3', name: 'Hemoglobina', status: 'Normal' },
  ]},
];

export default function HistorialScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Historial de Pruebas</ThemedText>
      <TouchableOpacity style={styles.exportBtn}>
        <Ionicons name="download-outline" size={20} color="#00A0B0" />
        <ThemedText style={styles.exportLabel}>Exportar historial</ThemedText>
      </TouchableOpacity>
      <ScrollView style={{marginTop:10}}>
        {groupedHistory.map(group => (
          <View key={group.date} style={styles.groupBlock}>
            <ThemedText style={styles.groupDate}>{group.date}</ThemedText>
            {group.tests.map(test => (
              <View key={test.id} style={styles.testCard}>
                <Ionicons name="flask-outline" size={22} color="#00A0B0" style={{marginRight:10}} />
                <ThemedText style={styles.testName}>{test.name}</ThemedText>
                <ThemedText style={[styles.statusBadge, {backgroundColor: test.status==='Normal'?'#28a745':'#dc3545'}]}>{test.status}</ThemedText>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20 },
  title: { fontSize:22, fontWeight:'bold', marginBottom:20, textAlign:'center' },
  exportBtn: { flexDirection:'row', alignItems:'center', alignSelf:'flex-end', backgroundColor:'#E9ECEF', borderRadius:8, paddingHorizontal:12, paddingVertical:6 },
  exportLabel: { marginLeft:6, color:'#00A0B0', fontWeight:'600' },
  groupBlock: { marginBottom:18 },
  groupDate: { fontWeight:'bold', color:'#6C757D', marginBottom:6 },
  testCard: { flexDirection:'row', alignItems:'center', backgroundColor:'#fff', borderRadius:10, padding:10, marginBottom:6, borderWidth:1, borderColor:'#E9ECEF' },
  testName: { flex:1, fontSize:15 },
  statusBadge: { paddingHorizontal:8, paddingVertical:2, borderRadius:10, color:'#fff', fontWeight:'bold', marginLeft:8, fontSize:12 },
}); 