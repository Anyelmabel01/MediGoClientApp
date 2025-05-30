export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      allergies: {
        Row: {
          alergeno: string
          created_at: string | null
          doctor_diagnostico: string | null
          fecha_diagnostico: string | null
          id: string
          is_active: boolean | null
          notas: string | null
          severidad: string
          sintomas: string | null
          tipo_alergia: string
          tratamiento_recomendado: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alergeno: string
          created_at?: string | null
          doctor_diagnostico?: string | null
          fecha_diagnostico?: string | null
          id?: string
          is_active?: boolean | null
          notas?: string | null
          severidad: string
          sintomas?: string | null
          tipo_alergia: string
          tratamiento_recomendado?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alergeno?: string
          created_at?: string | null
          doctor_diagnostico?: string | null
          fecha_diagnostico?: string | null
          id?: string
          is_active?: boolean | null
          notas?: string | null
          severidad?: string
          sintomas?: string | null
          tipo_alergia?: string
          tratamiento_recomendado?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "allergies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_type: string
          created_at: string | null
          diagnostico: string | null
          doctor_id: string
          duracion_minutos: number | null
          id: string
          motivo_consulta: string | null
          notas_doctor: string | null
          patient_id: string
          precio: number | null
          receta: string | null
          status: string | null
          tratamiento: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          appointment_type: string
          created_at?: string | null
          diagnostico?: string | null
          doctor_id: string
          duracion_minutos?: number | null
          id?: string
          motivo_consulta?: string | null
          notas_doctor?: string | null
          patient_id: string
          precio?: number | null
          receta?: string | null
          status?: string | null
          tratamiento?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_type?: string
          created_at?: string | null
          diagnostico?: string | null
          doctor_id?: string
          duracion_minutos?: number | null
          id?: string
          motivo_consulta?: string | null
          notas_doctor?: string | null
          patient_id?: string
          precio?: number | null
          receta?: string | null
          status?: string | null
          tratamiento?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          anos_experiencia: number | null
          biografia: string | null
          certificaciones: string[] | null
          created_at: string | null
          disponible_consultorio: boolean | null
          disponible_telemedicina: boolean | null
          id: string
          is_active: boolean | null
          numero_licencia: string
          numero_reviews: number | null
          precio_consulta: number | null
          rating: number | null
          specialty_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          anos_experiencia?: number | null
          biografia?: string | null
          certificaciones?: string[] | null
          created_at?: string | null
          disponible_consultorio?: boolean | null
          disponible_telemedicina?: boolean | null
          id?: string
          is_active?: boolean | null
          numero_licencia: string
          numero_reviews?: number | null
          precio_consulta?: number | null
          rating?: number | null
          specialty_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          anos_experiencia?: number | null
          biografia?: string | null
          certificaciones?: string[] | null
          created_at?: string | null
          disponible_consultorio?: boolean | null
          disponible_telemedicina?: boolean | null
          id?: string
          is_active?: boolean | null
          numero_licencia?: string
          numero_reviews?: number | null
          precio_consulta?: number | null
          rating?: number | null
          specialty_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctors_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "medical_specialties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doctors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          altura: number | null
          apellido: string
          avatar_url: string | null
          created_at: string | null
          email: string
          fecha_nacimiento: string | null
          genero: string | null
          id: string
          is_active: boolean | null
          nombre: string
          peso: number | null
          telefono: string | null
          tipo_sangre: string | null
          updated_at: string | null
        }
        Insert: {
          altura?: number | null
          apellido: string
          avatar_url?: string | null
          created_at?: string | null
          email: string
          fecha_nacimiento?: string | null
          genero?: string | null
          id?: string
          is_active?: boolean | null
          nombre: string
          peso?: number | null
          telefono?: string | null
          tipo_sangre?: string | null
          updated_at?: string | null
        }
        Update: {
          altura?: number | null
          apellido?: string
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          fecha_nacimiento?: string | null
          genero?: string | null
          id?: string
          is_active?: boolean | null
          nombre?: string
          peso?: number | null
          telefono?: string | null
          tipo_sangre?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pharmacies: {
        Row: {
          id: string
          nombre: string
          direccion: string
          latitud: number | null
          longitud: number | null
          telefono: string | null
          email: string | null
          horario_apertura: string | null
          horario_cierre: string | null
          delivery_disponible: boolean | null
          costo_delivery: number | null
          rating: number | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          direccion: string
          latitud?: number | null
          longitud?: number | null
          telefono?: string | null
          email?: string | null
          horario_apertura?: string | null
          horario_cierre?: string | null
          delivery_disponible?: boolean | null
          costo_delivery?: number | null
          rating?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          direccion?: string
          latitud?: number | null
          longitud?: number | null
          telefono?: string | null
          email?: string | null
          horario_apertura?: string | null
          horario_cierre?: string | null
          delivery_disponible?: boolean | null
          costo_delivery?: number | null
          rating?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      medicines: {
        Row: {
          id: string
          nombre: string
          nombre_generico: string | null
          laboratorio: string | null
          presentacion: string | null
          categoria_id: string | null
          concentracion: string | null
          descripcion: string | null
          requiere_receta: boolean | null
          precio_referencia: number | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          nombre_generico?: string | null
          laboratorio?: string | null
          presentacion?: string | null
          categoria_id?: string | null
          concentracion?: string | null
          descripcion?: string | null
          requiere_receta?: boolean | null
          precio_referencia?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          nombre_generico?: string | null
          laboratorio?: string | null
          presentacion?: string | null
          categoria_id?: string | null
          concentracion?: string | null
          descripcion?: string | null
          requiere_receta?: boolean | null
          precio_referencia?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nursing_services: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          categoria: string | null
          precio_base: number
          duracion_estimada: number | null
          requiere_prescripcion: boolean | null
          icono: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          categoria?: string | null
          precio_base: number
          duracion_estimada?: number | null
          requiere_prescripcion?: boolean | null
          icono?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          categoria?: string | null
          precio_base?: number
          duracion_estimada?: number | null
          requiere_prescripcion?: boolean | null
          icono?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lab_tests: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          categoria: string | null
          tipo_muestra: string | null
          precio_referencia: number | null
          codigo_examen: string | null
          tiempo_procesamiento: number | null
          requiere_cita: boolean | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          categoria?: string | null
          tipo_muestra?: string | null
          precio_referencia?: number | null
          codigo_examen?: string | null
          tiempo_procesamiento?: number | null
          requiere_cita?: boolean | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          categoria?: string | null
          tipo_muestra?: string | null
          precio_referencia?: number | null
          codigo_examen?: string | null
          tiempo_procesamiento?: number | null
          requiere_cita?: boolean | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string | null
          appointment_id: string | null
          tipo_registro: string
          fecha_atencion: string
          institucion: string | null
          especialidad: string | null
          motivo_consulta: string | null
          diagnostico_principal: string | null
          tratamiento: string | null
          observaciones: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id?: string | null
          appointment_id?: string | null
          tipo_registro: string
          fecha_atencion: string
          institucion?: string | null
          especialidad?: string | null
          motivo_consulta?: string | null
          diagnostico_principal?: string | null
          tratamiento?: string | null
          observaciones?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string | null
          appointment_id?: string | null
          tipo_registro?: string
          fecha_atencion?: string
          institucion?: string | null
          especialidad?: string | null
          motivo_consulta?: string | null
          diagnostico_principal?: string | null
          tratamiento?: string | null
          observaciones?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pharmacy_orders: {
        Row: {
          id: string
          user_id: string
          pharmacy_id: string
          numero_orden: string
          status: string | null
          tipo_entrega: string
          subtotal: number
          costo_envio: number | null
          total: number
          metodo_pago: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          pharmacy_id: string
          numero_orden: string
          status?: string | null
          tipo_entrega: string
          subtotal: number
          costo_envio?: number | null
          total: number
          metodo_pago?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          pharmacy_id?: string
          numero_orden?: string
          status?: string | null
          tipo_entrega?: string
          subtotal?: number
          costo_envio?: number | null
          total?: number
          metodo_pago?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      doctors_complete: {
        Row: {
          anos_experiencia: number | null
          biografia: string | null
          certificaciones: string[] | null
          created_at: string | null
          disponible_consultorio: boolean | null
          disponible_telemedicina: boolean | null
          doctor_id: string | null
          email: string | null
          especialidad: string | null
          is_active: boolean | null
          nombre_completo: string | null
          numero_licencia: string | null
          numero_reviews: number | null
          precio_consulta: number | null
          rating: number | null
          telefono: string | null
          user_id: string | null
        }
        Relationships: []
      }
      medicines_pharmacy_inventory: {
        Row: {
          categoria: string | null
          concentracion: string | null
          disponible: boolean | null
          farmacia: string | null
          fecha_vencimiento: string | null
          laboratorio: string | null
          medicine_id: string | null
          nombre: string | null
          nombre_generico: string | null
          pharmacy_id: string | null
          precio: number | null
          precio_descuento: number | null
          presentacion: string | null
          requiere_receta: boolean | null
          stock: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      find_nearby_pharmacies: {
        Args: { user_lat: number; user_lng: number; radius_km?: number }
        Returns: {
          id: string
          nombre: string
          direccion: string
          telefono: string
          delivery_disponible: boolean
          costo_delivery: number
          rating: number
          distancia_km: number
        }[]
      }
      find_available_doctors: {
        Args: {
          specialty_name?: string
          appointment_date?: string
          is_telemedicine?: boolean
        }
        Returns: {
          doctor_id: string
          doctor_name: string
          specialty: string
          rating: number
          precio_consulta: number
          anos_experiencia: number
          biografia: string
        }[]
      }
      search_medicines: {
        Args: {
          search_term: string
          category_name?: string
          pharmacy_id?: string
        }
        Returns: {
          medicine_id: string
          nombre: string
          nombre_generico: string
          presentacion: string
          categoria: string
          precio: number
          stock: number
          farmacia: string
          disponible: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Tipos específicos para MediGo
export type User = Tables<'users'>
export type Doctor = Tables<'doctors'>
export type Appointment = Tables<'appointments'>
export type Pharmacy = Tables<'pharmacies'>
export type Medicine = Tables<'medicines'>
export type NursingService = Tables<'nursing_services'>
export type LabTest = Tables<'lab_tests'>
export type MedicalRecord = Tables<'medical_records'>

// Tipos para inserciones
export type UserInsert = TablesInsert<'users'>
export type AppointmentInsert = TablesInsert<'appointments'>
export type PharmacyOrderInsert = TablesInsert<'pharmacy_orders'>

// Tipos para las vistas
export type DoctorComplete = Database['public']['Views']['doctors_complete']['Row']
export type MedicineInventory = Database['public']['Views']['medicines_pharmacy_inventory']['Row'] 