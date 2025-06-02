// Tipos comunes para la aplicación MediGo

// Tipo para las pruebas de laboratorio
export interface Prueba {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  requierePreparacion: boolean;
  categoria?: string;
  tipoMuestra?: string;
  tiempoResultado?: string;
}

// Tipo para los proveedores médicos
export interface Provider {
  id: string;
  display_name: string;
  provider_type: string;
  organization_name: string;
  avatar_url: string;
  license_number: string;
  bio: string;
  rating: number;
  total_reviews: number;
  specialty: string;
  years_experience: number;
  consultation_fee: number;
  is_available_telemedicine: boolean;
  is_available_office: boolean;
  location: string;
  available_today: boolean;
  next_available_slot: string;
  certifications: string[];
  hospital_affiliations: string[];
}

// Tipo para notificaciones
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'resultado' | 'cita' | 'preparacion' | 'oferta';
  timestamp?: string;
  date?: string;
  read: boolean;
}

// Props extendidas para ThemedText
export interface ThemedTextProps {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  lightColor?: string;
  darkColor?: string;
  style?: any;
  children: any;
}

// Colores extendidos del tema
export interface ExtendedColors {
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  white: string;
  black: string;
  shadowColor: string;
  card: string;  // Propiedad faltante
  gradient: string[];  // Propiedad faltante
} 