export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipoSangre: string;
  peso: number; // en kg
  altura: number; // en cm
  fechaNacimiento: string;
  genero: 'masculino' | 'femenino' | 'otro' | 'noEspecificar';
  avatar?: string;
}

export interface UserLocation {
  id: string;
  userId: string;
  nombre: string; // "Casa", "Trabajo", "Favorito", etc.
  direccion: string;
  latitud: number;
  longitud: number;
  esPrincipal: boolean;
}

// Usuario de prueba para desarrollo
export const mockUser: User = {
  id: '1',
  nombre: 'José',
  apellido: 'Daniel',
  email: 'jose.daniel@ejemplo.com',
  telefono: '+507 6123-4567',
  tipoSangre: 'O+',
  peso: 75,
  altura: 178,
  fechaNacimiento: '1988-04-12',
  genero: 'masculino',
  avatar: ''
};

// Ubicaciones de prueba
export const mockLocations: UserLocation[] = [
  {
    id: '1',
    userId: '1',
    nombre: 'Casa',
    direccion: 'Avenida 4a D Sur 55, Panamá',
    latitud: 8.9673,
    longitud: -79.5314,
    esPrincipal: true
  },
  {
    id: '2',
    userId: '1',
    nombre: 'Trabajo',
    direccion: 'Calle 50, Torre Global Bank, Panamá',
    latitud: 8.9825,
    longitud: -79.5243,
    esPrincipal: false
  }
]; 