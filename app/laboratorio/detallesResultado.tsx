import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function DetallesResultadoScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const params = useLocalSearchParams();
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  
  // Ensure we handle all types of param values properly
  const resultId = typeof params.resultId === 'string' ? params.resultId : Array.isArray(params.resultId) ? params.resultId[0] : '';
  const resultName = typeof params.resultName === 'string' ? params.resultName : Array.isArray(params.resultName) ? params.resultName[0] : 'Análisis Clínico';
  
  const [loading, setLoading] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Determine if screen is small based on dimensions
  useEffect(() => {
    const updateScreenSize = () => {
      setIsSmallScreen(screenWidth < 360);
    };
    
    updateScreenSize();
  }, [screenWidth]);
  
  // Información del resultado (simulada)
  const resultData = {
    patientName: "Juan Pérez González",
    testName: resultName || "Análisis Clínico",
    date: "15/06/2024",
    doctor: "Dr. Luis Ramírez",
    laboratory: "Laboratorio MediGo",
    labAddress: "Av. Principal #123, Ciudad",
    labPhone: "(555) 123-4567",
    values: [
      { name: "Glucosa", value: "120 mg/dL", normalRange: "70-110 mg/dL", status: "Alto" },
      { name: "Colesterol", value: "185 mg/dL", normalRange: "140-200 mg/dL", status: "Normal" },
      { name: "Triglicéridos", value: "155 mg/dL", normalRange: "10-150 mg/dL", status: "Alto" },
      { name: "HDL", value: "45 mg/dL", normalRange: "40-60 mg/dL", status: "Normal" },
      { name: "LDL", value: "110 mg/dL", normalRange: "<100 mg/dL", status: "Alto" },
    ]
  };

  const handleBackPress = () => {
    router.back();
  };

  // Crear HTML para el PDF
  const createPdfHtml = () => {
    // Crear filas de la tabla para los valores
    const valuesRows = resultData.values.map(value => {
      const colorStyle = value.status === "Normal" ? "color: #28a745;" : "color: #dc3545;";
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${value.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; ${colorStyle} font-weight: bold;">${value.value}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #6c757d;">${value.normalRange}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; ${colorStyle} font-weight: bold;">${value.status}</td>
        </tr>
      `;
    }).join('');

    // Template HTML completo
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body {
            font-family: 'Helvetica', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #00A0B0;
            padding-bottom: 10px;
          }
          .logo {
            color: #00A0B0;
            font-size: 24px;
            font-weight: bold;
          }
          h1 {
            color: #00A0B0;
            font-size: 20px;
            margin: 10px 0;
          }
          .info-section {
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            margin-bottom: 8px;
          }
          .info-label {
            font-weight: bold;
            width: 150px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #00A0B0;
            color: white;
            text-align: left;
            padding: 10px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          @media screen and (max-width: 600px) {
            .info-row {
              flex-direction: column;
            }
            .info-label {
              width: 100%;
              margin-bottom: 4px;
            }
            th, td {
              padding: 6px;
              font-size: 14px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">MediGo</div>
          <p>Resultados de Laboratorio</p>
        </div>
        
        <h1>${resultData.testName}</h1>
        
        <div class="info-section">
          <div class="info-row">
            <span class="info-label">Paciente:</span>
            <span>${resultData.patientName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Fecha:</span>
            <span>${resultData.date}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Médico:</span>
            <span>${resultData.doctor}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Laboratorio:</span>
            <span>${resultData.laboratory}</span>
          </div>
        </div>
        
        <h1>Resultados</h1>
        
        <table>
          <thead>
            <tr>
              <th>Parámetro</th>
              <th>Resultado</th>
              <th>Valores de Referencia</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${valuesRows}
          </tbody>
        </table>
        
        <div class="footer">
          <p>${resultData.laboratory} - ${resultData.labAddress}</p>
          <p>Tel: ${resultData.labPhone}</p>
          <p>Este documento es informativo y no sustituye el informe original de laboratorio.</p>
          <p>Generado por MediGo App - Fecha de impresión: ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
    </html>
    `;
  };

  // Función para generar y descargar el PDF
  const handleGeneratePdf = async () => {
    try {
      setLoading(true);
      
      // Generar el PDF a partir del HTML
      const { uri } = await Print.printToFileAsync({
        html: createPdfHtml(),
        base64: false,
      });
      
      // Obtener nombre de archivo con fecha
      const fileName = `Resultado_${String(resultData.testName).replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      
      // Si es necesario mover el archivo a otra ubicación
      const destinationUri = FileSystem.documentDirectory + fileName;
      await FileSystem.moveAsync({
        from: uri,
        to: destinationUri,
      });
      
      // Compartir el archivo PDF
      await Sharing.shareAsync(destinationUri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: `Resultado de ${resultData.testName}`,
      });
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
            </TouchableOpacity>
            
            <View style={styles.userInfoContainer}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <ThemedText style={styles.avatarText}>
                    {user?.nombre?.charAt(0) || 'U'}{user?.apellido?.charAt(0) || 'S'}
                  </ThemedText>
                </View>
              </View>
              
              <View style={styles.greetingContainer}>
                <ThemedText style={styles.greeting}>
                  {resultData.testName}
                </ThemedText>
                <View style={styles.editProfileIndicator}>
                  <Ionicons name="document-text" size={14} color={Colors.light.primary} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.resultContainer, { marginBottom: insets.bottom || 20 }]}>
            <View style={styles.resultCard}>
              <ThemedText style={styles.resultTitle}>{resultData.testName}</ThemedText>
              
              <View style={styles.resultSection}>
                <ThemedText style={styles.sectionTitle}>Información General</ThemedText>
                {/* Row layout adapts to screen width */}
                <View style={[styles.resultRow, isSmallScreen && styles.resultRowSmall]}>
                  <ThemedText style={[styles.resultLabel, isSmallScreen && styles.resultLabelSmall]}>Paciente:</ThemedText>
                  <ThemedText style={styles.resultValue}>{resultData.patientName}</ThemedText>
                </View>
                <View style={[styles.resultRow, isSmallScreen && styles.resultRowSmall]}>
                  <ThemedText style={[styles.resultLabel, isSmallScreen && styles.resultLabelSmall]}>Fecha:</ThemedText>
                  <ThemedText style={styles.resultValue}>{resultData.date}</ThemedText>
                </View>
                <View style={[styles.resultRow, isSmallScreen && styles.resultRowSmall]}>
                  <ThemedText style={[styles.resultLabel, isSmallScreen && styles.resultLabelSmall]}>Médico:</ThemedText>
                  <ThemedText style={styles.resultValue}>{resultData.doctor}</ThemedText>
                </View>
              </View>
              
              <View style={styles.resultSection}>
                <ThemedText style={styles.sectionTitle}>Valores</ThemedText>
                {resultData.values.map((item, index) => (
                  <View key={index} style={[styles.resultRow, isSmallScreen && styles.resultRowSmall]}>
                    <ThemedText style={[styles.resultLabel, isSmallScreen && styles.resultLabelSmall]}>{item.name}:</ThemedText>
                    <ThemedText 
                      style={[
                        styles.resultValue, 
                        item.status === "Normal" ? styles.normalValue : styles.abnormalValue
                      ]}
                    >
                      {item.value}
                    </ThemedText>
                    <ThemedText style={[styles.normalRange, isSmallScreen && styles.normalRangeSmall]}>({item.normalRange})</ThemedText>
                  </View>
                ))}
              </View>
              
              <View style={styles.labInfo}>
                <ThemedText style={styles.labName}>{resultData.laboratory}</ThemedText>
                <ThemedText style={styles.labAddress}>{resultData.labAddress}</ThemedText>
                <ThemedText style={styles.labPhone}>Tel: {resultData.labPhone}</ThemedText>
              </View>
            </View>
          </View>

          <View style={[styles.buttonContainer, { paddingBottom: insets.bottom > 0 ? 0 : 20 }]}>
            <TouchableOpacity 
              style={[styles.downloadButton, { backgroundColor: Colors.light.primary }]}
              onPress={handleGeneratePdf}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="cloud-download-outline" size={20} color="white" />
              )}
              <ThemedText style={styles.buttonText}>
                {loading ? 'Generando PDF...' : 'Descargar PDF'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    color: Colors.light.primary,
    fontSize: 17,
    fontWeight: 'bold',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  content: {
    flex: 1,
  },
  resultContainer: {
    padding: 16,
  },
  resultCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#00A0B0',
  },
  resultSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#495057',
  },
  resultRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  resultRowSmall: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 100,
  },
  resultLabelSmall: {
    width: '100%',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 14,
    flex: 1,
  },
  normalValue: {
    color: '#28a745',
  },
  abnormalValue: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  normalRange: {
    fontSize: 12,
    color: '#6C757D',
    marginLeft: 10,
  },
  normalRangeSmall: {
    marginLeft: 0,
    marginTop: 2,
  },
  labInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  labName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  labAddress: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
  },
  labPhone: {
    fontSize: 12,
    color: '#6C757D',
  },
  buttonContainer: {
    marginBottom: 0,
    width: '96%',
    alignSelf: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 