-- Script completo de RLS para MediGo
-- Ejecutar en Supabase SQL Editor

-- Habilitar RLS en todas las tablas principales
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_order_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE nursing_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE chronic_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA APPOINTMENTS
-- Los pacientes ven sus propias citas, los doctores ven las suyas
CREATE POLICY "Users can view their own appointments" ON appointments
  FOR SELECT USING (
    auth.uid() = patient_id OR 
    auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id)
  );

CREATE POLICY "Users can create their own appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Doctors can update appointments" ON appointments
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id)
  );

-- POLÍTICAS PARA MEDICAL_RECORDS
-- Solo el paciente y sus doctores pueden ver los expedientes
CREATE POLICY "Patients can view their medical records" ON medical_records
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view patient records" ON medical_records
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id)
  );

CREATE POLICY "Doctors can create medical records" ON medical_records
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id)
  );

-- POLÍTICAS PARA PHARMACY_ORDERS
-- Los usuarios solo ven sus propias órdenes
CREATE POLICY "Users can view their pharmacy orders" ON pharmacy_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create pharmacy orders" ON pharmacy_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their pharmacy orders" ON pharmacy_orders
  FOR UPDATE USING (auth.uid() = user_id);

-- POLÍTICAS PARA PHARMACY_ORDER_ITEMS
-- Los usuarios solo ven items de sus órdenes
CREATE POLICY "Users can view their order items" ON pharmacy_order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM pharmacy_orders WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create order items" ON pharmacy_order_items
  FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM pharmacy_orders WHERE user_id = auth.uid())
  );

-- POLÍTICAS PARA LAB_ORDERS
-- Similar a pharmacy orders
CREATE POLICY "Users can view their lab orders" ON lab_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create lab orders" ON lab_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- POLÍTICAS PARA NURSING_APPOINTMENTS
-- Los usuarios ven sus propias citas de enfermería
CREATE POLICY "Users can view their nursing appointments" ON nursing_appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create nursing appointments" ON nursing_appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- POLÍTICAS PARA DATOS MÉDICOS PERSONALES
-- Alergias
CREATE POLICY "Users can manage their allergies" ON allergies
  FOR ALL USING (auth.uid() = user_id);

-- Condiciones crónicas
CREATE POLICY "Users can manage their chronic conditions" ON chronic_conditions
  FOR ALL USING (auth.uid() = user_id);

-- Contactos de emergencia
CREATE POLICY "Users can manage their emergency contacts" ON emergency_contacts
  FOR ALL USING (auth.uid() = user_id);

-- Ubicaciones del usuario
CREATE POLICY "Users can manage their locations" ON user_locations
  FOR ALL USING (auth.uid() = user_id);

-- POLÍTICAS PARA REVIEWS
-- Los usuarios pueden crear reseñas y ver todas las reseñas públicas
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- POLÍTICAS PARA PAYMENTS
-- Los usuarios solo ven sus propios pagos
CREATE POLICY "Users can view their payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- POLÍTICAS PARA NOTIFICATIONS
-- Los usuarios solo ven sus propias notificaciones
CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Otorgar permisos necesarios
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Habilitar Real-time en todas las tablas
-- Función helper
CREATE OR REPLACE FUNCTION execute_schema_tables(_schema text, _query text)
RETURNS text AS $$
DECLARE row record;
BEGIN
    FOR row IN SELECT tablename FROM pg_tables AS t WHERE t.schemaname = _schema LOOP
        EXECUTE format(_query, row.tablename);
    END LOOP;
    RETURN 'success';
END;
$$ LANGUAGE 'plpgsql';

-- Habilitar realtime
SELECT execute_schema_tables('public', 'ALTER PUBLICATION supabase_realtime ADD TABLE %I;'); 