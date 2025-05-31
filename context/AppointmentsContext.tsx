import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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
        can_join: false,
        created_at: new Date().toISOString(),
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

  const addTelemedicineAppointment = (appointmentData: Omit<TelemedicineAppointment, 'id' | 'created_at'>) => {
    const newAppointment: TelemedicineAppointment = {
      ...appointmentData,
      id: `tele_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointmentStatus = (id: string, status: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === id ? { ...apt, status: status as any } : apt
      )
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
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