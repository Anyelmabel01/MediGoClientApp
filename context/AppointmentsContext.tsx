import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { zoomService } from '../utils/zoomService';

// Tipos para citas de consultorio
export type ConsultorioAppointment = {
  id: string;
  date: string;
  time: string;
  provider_name: string;
  provider_type: string;
  organization_name?: string;
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  location: string;
  consultation_fee: number;
  type: 'consultorio';
  reason?: string;
  address?: string;
  provider_id?: string;
  created_at?: string;
};

// Tipos para citas de telemedicina
export type TelemedicineAppointment = {
  id: string;
  date: string;
  time: string;
  specialist_name: string;
  specialty: string;
  avatar_url?: string;
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'IN_PROGRESS';
  consultation_fee: number;
  type: 'telemedicine';
  can_join?: boolean;
  prescription_count?: number;
  notes?: string;
  specialist_id?: string;
  created_at?: string;
  // Campos de Zoom
  zoom_meeting_id?: string;
  zoom_join_url?: string;
  zoom_start_url?: string;
  zoom_password?: string;
  zoom_meeting_created?: boolean;
};

export type Appointment = ConsultorioAppointment | TelemedicineAppointment;

interface AppointmentsContextType {
  appointments: Appointment[];
  consultorioAppointments: ConsultorioAppointment[];
  telemedicineAppointments: TelemedicineAppointment[];
  addConsultorioAppointment: (appointment: Omit<ConsultorioAppointment, 'id' | 'created_at'>) => void;
  addTelemedicineAppointment: (appointment: Omit<TelemedicineAppointment, 'id' | 'created_at'>) => void;
  updateAppointmentStatus: (id: string, status: string) => void;
  deleteAppointment: (id: string) => void;
  getUpcomingAppointments: () => Appointment[];
  getPastAppointments: () => Appointment[];
  createZoomMeeting: (appointmentId: string) => Promise<void>;
  loading: boolean;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Inicializar con datos de ejemplo
  useEffect(() => {
    // Datos de ejemplo inicial
    const initialData: Appointment[] = [
      {
        id: 'cons_1',
        date: '2024-12-28',
        time: '10:00 AM',
        provider_name: 'Dr. María González',
        provider_type: 'Cardióloga',
        organization_name: 'Centro Médico Integral',
        status: 'CONFIRMED',
        location: 'Altamira, Caracas',
        consultation_fee: 120,
        type: 'consultorio',
        created_at: new Date().toISOString(),
      },
      {
        id: 'tele_1',
        date: '2024-12-29',
        time: '2:00 PM',
        specialist_name: 'Dr. Carlos Mendoza',
        specialty: 'Cardiología',
        avatar_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
        status: 'CONFIRMED',
        consultation_fee: 750,
        type: 'telemedicine',
        can_join: true,
        created_at: new Date().toISOString(),
        zoom_meeting_created: true,
        zoom_meeting_id: '789123456',
        zoom_join_url: 'https://zoom.us/test',
        zoom_start_url: 'https://zoom.us/test',
        zoom_password: 'MediGo2024',
      }
    ];
    setAppointments(initialData);
    setLoading(false);
  }, []);

  const addConsultorioAppointment = (appointmentData: Omit<ConsultorioAppointment, 'id' | 'created_at'>) => {
    const newAppointment: ConsultorioAppointment = {
      ...appointmentData,
      id: `cons_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    
    setAppointments(prev => [...prev, newAppointment]);
  };

  const addTelemedicineAppointment = async (appointmentData: Omit<TelemedicineAppointment, 'id' | 'created_at'>) => {
    const newAppointment: TelemedicineAppointment = {
      ...appointmentData,
      id: `tele_${Date.now()}`,
      created_at: new Date().toISOString(),
      zoom_meeting_created: false,
    };
    
    // Agregar la cita al estado
    setAppointments(prev => [...prev, newAppointment]);

    // Crear automáticamente la reunión de Zoom usando la cita recién creada
    try {
      // Usar setTimeout para asegurar que el estado se actualice antes de crear la reunión
      setTimeout(async () => {
        await createZoomMeetingForAppointment(newAppointment);
      }, 100);
    } catch (error) {
      console.error('Error creando reunión de Zoom automáticamente:', error);
    }
  };

  const createZoomMeetingForAppointment = async (appointment: TelemedicineAppointment): Promise<void> => {
    try {
      // Formatear fecha para Zoom (ISO format)
      const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
      const isoDateTime = appointmentDateTime.toISOString();

      // Crear reunión de Zoom
      const zoomMeeting = await zoomService.createTelemedicineMeeting(
        appointment.specialist_name,
        'Paciente', // Aquí podrías obtener el nombre del paciente del contexto de auth
        isoDateTime
      );

      // Actualizar la cita con información de Zoom
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointment.id ? {
            ...apt,
            zoom_meeting_id: zoomMeeting.id.toString(),
            zoom_join_url: zoomMeeting.join_url,
            zoom_start_url: zoomMeeting.start_url,
            zoom_password: zoomMeeting.password,
            zoom_meeting_created: true
          } : apt
        )
      );

      console.log('Reunión de Zoom creada exitosamente:', zoomMeeting.id);
    } catch (error) {
      console.error('Error creando reunión de Zoom:', error);
      throw error;
    }
  };

  const createZoomMeeting = async (appointmentId: string): Promise<void> => {
    try {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      if (!appointment || appointment.type !== 'telemedicine') {
        throw new Error('Cita no encontrada o no es de telemedicina');
      }

      await createZoomMeetingForAppointment(appointment);
    } catch (error) {
      console.error('Error creando reunión de Zoom:', error);
      throw error;
    }
  };

  const updateAppointmentStatus = (id: string, status: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === id ? { ...apt, status: status as any } : apt
      )
    );
  };

  const deleteAppointment = async (id: string) => {
    try {
      const appointment = appointments.find(apt => apt.id === id);
      
      // Si es una cita de telemedicina con reunión de Zoom, eliminar la reunión
      if (appointment && 
          appointment.type === 'telemedicine' && 
          appointment.zoom_meeting_id && 
          appointment.zoom_meeting_created) {
        try {
          await zoomService.deleteMeeting(appointment.zoom_meeting_id);
          console.log('Reunión de Zoom eliminada exitosamente');
        } catch (error) {
          console.error('Error eliminando reunión de Zoom:', error);
          // Continuar con la eliminación de la cita aunque falle la eliminación de Zoom
        }
      }

      setAppointments(prev => prev.filter(apt => apt.id !== id));
    } catch (error) {
      console.error('Error eliminando cita:', error);
      throw error;
    }
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments.filter(apt => {
      const appointmentDate = new Date(apt.date);
      return appointmentDate >= now && (apt.status === 'CONFIRMED' || apt.status === 'PENDING');
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getPastAppointments = () => {
    const now = new Date();
    return appointments.filter(apt => {
      const appointmentDate = new Date(apt.date);
      return appointmentDate < now || apt.status === 'COMPLETED' || apt.status === 'CANCELLED';
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Filtros por tipo
  const consultorioAppointments = appointments.filter(apt => apt.type === 'consultorio') as ConsultorioAppointment[];
  const telemedicineAppointments = appointments.filter(apt => apt.type === 'telemedicine') as TelemedicineAppointment[];

  const value: AppointmentsContextType = {
    appointments,
    consultorioAppointments,
    telemedicineAppointments,
    addConsultorioAppointment,
    addTelemedicineAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    getUpcomingAppointments,
    getPastAppointments,
    createZoomMeeting,
    loading,
  };

  return (
    <AppointmentsContext.Provider value={value}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentsProvider');
  }
  return context;
} 