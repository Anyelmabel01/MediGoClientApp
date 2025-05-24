import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

const filtros = [
  { nombre: 'Todos', value: 'todos' },
  { nombre: 'Normal', value: 'normal' },
  { nombre: 'Anormal', value: 'anormal' },
  { nombre: 'Requiere Revisión', value: 'revision' },
];

const resultados = [
  { id: '1', prueba: 'Biometría Hemática', fecha: '2024-06-01', laboratorio: 'Lab Salud', estado: 'normal' },
  { id: '2', prueba: 'Perfil Lipídico', fecha: '2024-05-20', laboratorio: 'BioLab Express', estado: 'anormal' },
  { id: '3', prueba: 'Examen General de Orina', fecha: '2024-05-10', laboratorio: 'Lab Salud', estado: 'revision' },
] as const;

const estadoColor: Record<'normal' | 'anormal' | 'revision', string> = {
  normal: '#43A047',
  anormal: '#E53935',
  revision: '#FFA000',
};

export default function ResultadosScreen() {
  const [filtro, setFiltro] = useState('todos');
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <ThemedText style={styles.titulo}>Resultados de Laboratorio</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtros}>
        {filtros.map((f) => (
          <TouchableOpacity key={f.value} style={[styles.filtro, filtro === f.value && styles.filtroActivo]} onPress={() => setFiltro(f.value)}>
            <ThemedText style={[styles.filtroTexto, filtro === f.value && styles.filtroTextoActivo]}>{f.nombre}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.listaResultados}>
        {resultados.filter(r => filtro === 'todos' || r.estado === filtro).map((res) => (
          <TouchableOpacity
            key={res.id}
            style={styles.cardResultado}
            onPress={() => router.push(`../../laboratorio/resultados/${res.id}` as any)}
          >
            <View style={styles.cardHeader}>
              <ThemedText style={styles.pruebaNombre}>{res.prueba}</ThemedText>
              <View style={[styles.estado, { backgroundColor: estadoColor[res.estado as keyof typeof estadoColor] }]}>
                <ThemedText style={styles.estadoTexto}>{res.estado.charAt(0).toUpperCase() + res.estado.slice(1)}</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.fecha}>{res.fecha}</ThemedText>
            <ThemedText style={styles.laboratorio}>{res.laboratorio}</ThemedText>
            <TouchableOpacity style={styles.botonVer} onPress={() => router.push(`../../laboratorio/resultados/${res.id}` as any)}>
              <ThemedText style={styles.botonVerTexto}>Ver Detalles</ThemedText>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  filtros: { flexDirection: 'row', marginBottom: 16 },
  filtro: { backgroundColor: '#F3F3F3', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6, marginRight: 10 },
  filtroActivo: { backgroundColor: '#5E35B1' },
  filtroTexto: { color: '#5E35B1', fontWeight: 'bold' },
  filtroTextoActivo: { color: '#fff' },
  listaResultados: {},
  cardResultado: { backgroundColor: '#F8F6FD', borderRadius: 12, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, justifyContent: 'space-between' },
  pruebaNombre: { fontSize: 16, fontWeight: 'bold' },
  estado: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  estadoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  fecha: { fontSize: 13, color: '#555', marginBottom: 4 },
  laboratorio: { fontSize: 13, color: '#4527A0', marginBottom: 8 },
  botonVer: { backgroundColor: '#5E35B1', borderRadius: 8, paddingVertical: 6, alignItems: 'center' },
  botonVerTexto: { color: '#fff', fontWeight: 'bold' },
}); 