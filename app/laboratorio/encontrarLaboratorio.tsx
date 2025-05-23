import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

const labs = [
  { id: '1', name: 'Laboratorio Central', distance: '1.2 km', rating: 4.7, tests: 120 },
  { id: '2', name: 'Clínica Norte', distance: '2.5 km', rating: 4.5, tests: 80 },
];

export default function EncontrarLaboratorioScreen() {
  const router = useRouter();

  const handleNavigateToDetails = (labId: string) => {
    router.push('/laboratorio/detallesLaboratorio');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Encontrar Laboratorio</ThemedText>
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map" size={48} color="#00A0B0" />
        <ThemedText style={{color:'#6C757D', marginTop:8}}>Aquí irá el mapa interactivo</ThemedText>
      </View>
      <ThemedText style={styles.sectionTitle}>Laboratorios Cercanos</ThemedText>
      <ScrollView style={{marginTop:8}}>
        {labs.map(lab => (
          <TouchableOpacity 
            key={lab.id} 
            style={styles.labCard}
            onPress={() => handleNavigateToDetails(lab.id)}
          >
            <View style={{flex:1}}>
              <ThemedText style={styles.labName}>{lab.name}</ThemedText>
              <ThemedText style={styles.labInfo}>{lab.distance} • {lab.rating}★ • {lab.tests} pruebas</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#00A0B0" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20 },
  title: { fontSize:22, fontWeight:'bold', marginBottom:20, textAlign:'center' },
  mapPlaceholder: { height:120, backgroundColor:'#E9ECEF', borderRadius:12, alignItems:'center', justifyContent:'center', marginBottom:18 },
  sectionTitle: { fontSize:16, fontWeight:'bold', marginBottom:8 },
  labCard: { flexDirection:'row', alignItems:'center', backgroundColor:'#fff', borderRadius:12, padding:14, marginBottom:12, borderWidth:1, borderColor:'#E9ECEF' },
  labName: { fontSize:15, fontWeight:'bold' },
  labInfo: { fontSize:13, color:'#6C757D', marginTop:2 },
}); 