import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

type Appointment = {
  id: string;
  fecha: string;
  hora: string;
  nombreProveedor: string;
  tipoProveedor: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
};

// Datos de ejemplo
const proximasCitas: Appointment[] = [
  {
    id: '1',
    fecha: '12 Nov 2023',
    hora: '10:00 AM',
    nombreProveedor: 'Dr. Juan Pérez',
    tipoProveedor: 'Médico General',
    estado: 'confirmada',
  },
  {
    id: '2',
    fecha: '15 Nov 2023',
    hora: '3:30 PM',
    nombreProveedor: 'Dra. María Rodríguez',
    tipoProveedor: 'Cardióloga',
    estado: 'pendiente',
  },
];

export default function ConsultorioScreen() {
  const router = useRouter();

  const handleNuevaCita = () => {
    // Corregido para usar una ruta de navegación válida
    router.push('/consulta');
    // En una implementación real, aquí navegaríamos a la pantalla de nueva cita
  };

  const handleMisCitas = () => {
    // Corregido para usar una ruta de navegación válida
    router.push('/consulta');
    // En una implementación real, aquí navegaríamos a la pantalla de mis citas
  };

  const handleDetallesCita = (id: string) => {
    // Corregido para usar una ruta de navegación válida
    router.push('/consulta');
    // En una implementación real, aquí navegaríamos a los detalles de la cita
  };

  const getColorEstado = (estado: Appointment['estado']) => {
    switch (estado) {
      case 'confirmada':
        return '#4CAF50';
      case 'pendiente':
        return '#FFC107';
      case 'cancelada':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getTextoEstado = (estado: Appointment['estado']) => {
    switch (estado) {
      case 'confirmada':
        return 'Confirmada';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelada':
        return 'Cancelada';
      default:
        return '';
    }
  };

  const renderItemCita = ({ item }: { item: Appointment }) => (
    <TouchableOpacity 
      style={styles.itemCita}
      onPress={() => handleDetallesCita(item.id)}
    >
      <View style={styles.fechaCita}>
        <ThemedText style={styles.diaFecha}>{item.fecha}</ThemedText>
        <ThemedText style={styles.horaCita}>{item.hora}</ThemedText>
      </View>
      <View style={styles.infoCita}>
        <ThemedText style={styles.nombreDoctor}>{item.nombreProveedor}</ThemedText>
        <ThemedText style={styles.especialidadDoctor}>{item.tipoProveedor}</ThemedText>
        <View style={[styles.badgeEstado, { backgroundColor: getColorEstado(item.estado) }]}>
          <ThemedText style={styles.textoEstado}>{getTextoEstado(item.estado)}</ThemedText>
        </View>
      </View>
      <View style={styles.contenedorFlecha}>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.contenedor}>
      <StatusBar style="auto" />
      
      <View style={styles.cabecera}>
        <TouchableOpacity 
          style={styles.botonRegresar}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#2D7FF9" />
        </TouchableOpacity>
        <ThemedText style={styles.titulo}>Consultorio</ThemedText>
      </View>
      
      <View style={styles.contenedorBotones}>
        <TouchableOpacity 
          style={styles.botonAccion}
          onPress={handleNuevaCita}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <ThemedText style={styles.textoBoton}>Nueva Cita</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.botonAccion, styles.botonSecundario]}
          onPress={handleMisCitas}
        >
          <Ionicons name="calendar" size={24} color="white" />
          <ThemedText style={styles.textoBoton}>Mis Citas</ThemedText>
        </TouchableOpacity>
      </View>
      
      <View style={styles.seccionProximas}>
        <ThemedText style={styles.tituloSeccion}>Próximas Citas</ThemedText>
        
        {proximasCitas.length > 0 ? (
          <FlatList
            data={proximasCitas}
            renderItem={renderItemCita}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listaCitas}
          />
        ) : (
          <ThemedView style={styles.estadoVacio}>
            <Ionicons name="calendar-outline" size={50} color="#ccc" />
            <ThemedText style={styles.textoVacio}>No tienes citas programadas</ThemedText>
          </ThemedView>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 16,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  botonRegresar: {
    padding: 5,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  contenedorBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  botonAccion: {
    backgroundColor: '#2D7FF9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 12,
    flex: 0.48,
  },
  botonSecundario: {
    backgroundColor: '#5C6BC0',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  seccionProximas: {
    flex: 1,
  },
  tituloSeccion: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  listaCitas: {
    paddingBottom: 20,
  },
  itemCita: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'center',
  },
  fechaCita: {
    marginRight: 16,
    alignItems: 'center',
    minWidth: 70,
  },
  diaFecha: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  horaCita: {
    fontSize: 13,
    color: '#777',
  },
  infoCita: {
    flex: 1,
  },
  nombreDoctor: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  especialidadDoctor: {
    fontSize: 13,
    color: '#777',
    marginBottom: 6,
  },
  badgeEstado: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  textoEstado: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  contenedorFlecha: {
    marginLeft: 8,
  },
  estadoVacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  textoVacio: {
    marginTop: 16,
    color: '#777',
    fontSize: 16,
  },
}); 