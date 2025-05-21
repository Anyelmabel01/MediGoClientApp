import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

type ConsultaVirtual = {
  id: string;
  fecha: string;
  hora: string;
  nombreDoctor: string;
  especialidad: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  horaInicio?: Date;
};

// Función para verificar si la consulta está por comenzar en menos de 10 minutos
const estaProximaAIniciar = (consulta: ConsultaVirtual): boolean => {
  if (!consulta.horaInicio) return false;
  
  const ahora = new Date();
  const diferenciaTiempo = consulta.horaInicio.getTime() - ahora.getTime();
  const diferenciaMinutos = diferenciaTiempo / (1000 * 60);
  
  return diferenciaMinutos <= 10 && diferenciaMinutos > 0;
};

// Datos de ejemplo
const proximasConsultas: ConsultaVirtual[] = [
  {
    id: '1',
    fecha: '10 Nov 2023',
    hora: '9:00 AM',
    nombreDoctor: 'Dr. Pedro López',
    especialidad: 'Dermatología',
    estado: 'confirmada',
    horaInicio: new Date(new Date().getTime() + 5 * 60000), // 5 minutos desde ahora
  },
  {
    id: '2',
    fecha: '15 Nov 2023',
    hora: '11:30 AM',
    nombreDoctor: 'Dra. Ana Sánchez',
    especialidad: 'Psicología',
    estado: 'pendiente',
    horaInicio: new Date(new Date().getTime() + 24 * 60 * 60000), // 1 día desde ahora
  },
];

export default function TelemedicineScreen() {
  const router = useRouter();

  const handleNuevaConsulta = () => {
    // Ruta corregida compatible con el enrutador
    router.push('/consulta');
    // En una implementación real, aquí navegaríamos a la búsqueda de especialistas
  };

  const handleDetallesConsulta = (id: string) => {
    // Ruta corregida compatible con el enrutador
    router.push('/consulta');
    // En una implementación real, aquí navegaríamos a los detalles de consulta
  };

  const handleUnirseALlamada = (id: string) => {
    // Ruta corregida compatible con el enrutador
    router.push('/consulta');
    // En una implementación real, aquí navegaríamos a la sala de espera
  };

  const handleMisConsultas = () => {
    // Ruta corregida compatible con el enrutador
    router.push('/consulta');
    // En una implementación real, aquí navegaríamos a mis consultas
  };

  const handleInfoMedicamentos = () => {
    // Ruta corregida compatible con el enrutador
    router.push('/consulta');
    // En una implementación real, aquí navegaríamos a la información de medicamentos
  };

  const getColorEstado = (estado: ConsultaVirtual['estado']) => {
    switch (estado) {
      case 'confirmada':
        return '#4CAF50';
      case 'pendiente':
        return '#FFC107';
      case 'completada':
        return '#2196F3';
      case 'cancelada':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getTextoEstado = (estado: ConsultaVirtual['estado']) => {
    switch (estado) {
      case 'confirmada':
        return 'Confirmada';
      case 'pendiente':
        return 'Pendiente';
      case 'completada':
        return 'Completada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return '';
    }
  };

  const renderItemConsulta = ({ item }: { item: ConsultaVirtual }) => (
    <TouchableOpacity 
      style={styles.itemConsulta}
      onPress={() => handleDetallesConsulta(item.id)}
    >
      <View style={styles.fechaConsulta}>
        <ThemedText style={styles.diaConsulta}>{item.fecha}</ThemedText>
        <ThemedText style={styles.horaConsulta}>{item.hora}</ThemedText>
      </View>
      <View style={styles.infoConsulta}>
        <ThemedText style={styles.nombreDoctor}>{item.nombreDoctor}</ThemedText>
        <ThemedText style={styles.especialidad}>{item.especialidad}</ThemedText>
        <View style={[styles.badgeEstado, { backgroundColor: getColorEstado(item.estado) }]}>
          <ThemedText style={styles.textoEstado}>{getTextoEstado(item.estado)}</ThemedText>
        </View>
      </View>
      <View style={styles.accionesContainer}>
        {estaProximaAIniciar(item) && (
          <TouchableOpacity 
            style={styles.botonUnirse}
            onPress={() => handleUnirseALlamada(item.id)}
          >
            <Ionicons name="videocam" size={16} color="white" />
            <ThemedText style={styles.textoBotonUnirse}>Unirse</ThemedText>
          </TouchableOpacity>
        )}
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
        <ThemedText style={styles.titulo}>Telemedicina</ThemedText>
      </View>
      
      <View style={styles.banner}>
        <View style={styles.contenidoBanner}>
          <ThemedText style={styles.tituloBanner}>Consulta médica virtual</ThemedText>
          <ThemedText style={styles.textoBanner}>
            Conecta con especialistas desde la comodidad de tu hogar
          </ThemedText>
          <TouchableOpacity 
            style={styles.botonBanner}
            onPress={handleNuevaConsulta}
          >
            <ThemedText style={styles.textoBotonBanner}>Nueva Consulta</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.iconoBanner}>
          <Ionicons name="videocam" size={50} color="#3949AB" />
        </View>
      </View>
      
      <View style={styles.botonesAcceso}>
        <TouchableOpacity 
          style={styles.botonAccesoRapido}
          onPress={handleMisConsultas}
        >
          <Ionicons name="calendar" size={24} color="#5C6BC0" />
          <ThemedText style={styles.textoAccesoRapido}>Mis Consultas</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.botonAccesoRapido}
          onPress={handleInfoMedicamentos}
        >
          <Ionicons name="medkit" size={24} color="#5C6BC0" />
          <ThemedText style={styles.textoAccesoRapido}>Medicamentos</ThemedText>
        </TouchableOpacity>
      </View>
      
      <View style={styles.seccionProximas}>
        <ThemedText style={styles.tituloSeccion}>Próximas Consultas</ThemedText>
        
        {proximasConsultas.length > 0 ? (
          <FlatList
            data={proximasConsultas}
            renderItem={renderItemConsulta}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listaConsultas}
          />
        ) : (
          <ThemedView style={styles.estadoVacio}>
            <Ionicons name="videocam-outline" size={50} color="#ccc" />
            <ThemedText style={styles.textoVacio}>No tienes consultas programadas</ThemedText>
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
  banner: {
    backgroundColor: '#E8EAF6',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
  },
  contenidoBanner: {
    flex: 1,
  },
  tituloBanner: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#283593',
    marginBottom: 8,
  },
  textoBanner: {
    fontSize: 14,
    color: '#3949AB',
    marginBottom: 16,
  },
  botonBanner: {
    backgroundColor: '#3949AB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  textoBotonBanner: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  iconoBanner: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  botonesAcceso: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  botonAccesoRapido: {
    flex: 1,
    backgroundColor: '#F5F7FF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  textoAccesoRapido: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    color: '#3949AB',
  },
  seccionProximas: {
    flex: 1,
  },
  tituloSeccion: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  listaConsultas: {
    paddingBottom: 20,
  },
  itemConsulta: {
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
  fechaConsulta: {
    marginRight: 16,
    alignItems: 'center',
    minWidth: 70,
  },
  diaConsulta: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  horaConsulta: {
    fontSize: 13,
    color: '#777',
  },
  infoConsulta: {
    flex: 1,
  },
  nombreDoctor: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  especialidad: {
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
  accionesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  botonUnirse: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  textoBotonUnirse: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
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