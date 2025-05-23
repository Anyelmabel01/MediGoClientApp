import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const categorias = [
  { nombre: 'Pruebas de Sangre', icon: 'water' },
  { nombre: 'Pruebas de Orina', icon: 'flask' },
  { nombre: 'Estudios de Imagen', icon: 'images' },
  { nombre: 'Pruebas Especiales', icon: 'star' },
  { nombre: 'Paquetes de Salud', icon: 'medkit' },
];

const pruebas = [
  { id: '1', nombre: 'Biometría Hemática', descripcion: 'Conteo y análisis de células sanguíneas', precio: '$250', requierePreparacion: true },
  { id: '2', nombre: 'Examen General de Orina', descripcion: 'Análisis de orina para detección de enfermedades', precio: '$180', requierePreparacion: false },
  { id: '3', nombre: 'Perfil Lipídico', descripcion: 'Medición de colesterol y triglicéridos', precio: '$320', requierePreparacion: true },
];

export default function PruebasScreen() {
  const [busqueda, setBusqueda] = useState('');
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Catálogo de Pruebas</Text>
      <View style={styles.barraBusqueda}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          style={styles.inputBusqueda}
          placeholder="Buscar prueba..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorias}>
        {categorias.map((cat) => (
          <View key={cat.nombre} style={styles.categoria}>
            <Ionicons name={cat.icon as any} size={24} color="#5E35B1" />
            <Text style={styles.categoriaTexto}>{cat.nombre}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.listaPruebas}>
        {pruebas.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase())).map((prueba) => (
          <TouchableOpacity
            key={prueba.id}
            style={styles.cardPrueba}
            onPress={() => router.push(`../../laboratorio/detalle/${prueba.id}` as any)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.pruebaNombre}>{prueba.nombre}</Text>
              {prueba.requierePreparacion && (
                <Ionicons name="alert-circle" size={18} color="#FFA000" style={{ marginLeft: 6 }} />
              )}
            </View>
            <Text style={styles.pruebaDescripcion}>{prueba.descripcion}</Text>
            <Text style={styles.pruebaPrecio}>{prueba.precio}</Text>
            <TouchableOpacity style={styles.botonReservar} onPress={() => router.push(`../../laboratorio/reservar/${prueba.id}` as any)}>
              <Text style={styles.botonReservarTexto}>Reservar</Text>
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
  barraBusqueda: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F3F3', borderRadius: 8, paddingHorizontal: 10, marginBottom: 16 },
  inputBusqueda: { flex: 1, marginLeft: 8, height: 40 },
  categorias: { flexDirection: 'row', marginBottom: 16 },
  categoria: { alignItems: 'center', marginRight: 18 },
  categoriaTexto: { fontSize: 12, marginTop: 4, color: '#5E35B1' },
  listaPruebas: {},
  cardPrueba: { backgroundColor: '#F8F6FD', borderRadius: 12, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  pruebaNombre: { fontSize: 16, fontWeight: 'bold' },
  pruebaDescripcion: { fontSize: 13, color: '#555', marginBottom: 8 },
  pruebaPrecio: { fontSize: 14, color: '#4527A0', fontWeight: 'bold', marginBottom: 8 },
  botonReservar: { backgroundColor: '#5E35B1', borderRadius: 8, paddingVertical: 6, alignItems: 'center' },
  botonReservarTexto: { color: '#fff', fontWeight: 'bold' },
}); 