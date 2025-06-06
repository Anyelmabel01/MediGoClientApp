-- Script RLS Mínimo para MediGo
-- Solo para las tablas principales que sabemos que funcionan

-- HABILITAR RLS EN TABLAS PRINCIPALES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA USERS (ya debería estar habilitado)
-- Si no existe, crear la política básica
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'users' 
        AND policyname = 'Users can view own profile'
    ) THEN
        CREATE POLICY "Users can view own profile" ON users
            FOR SELECT USING (auth.uid() = id::uuid);
        
        CREATE POLICY "Users can update own profile" ON users
            FOR UPDATE USING (auth.uid() = id::uuid);
    END IF;
END $$;

-- POLÍTICAS PARA APPOINTMENTS (usa patient_id)
CREATE POLICY "Users can view their appointments" ON appointments
    FOR SELECT USING (auth.uid() = patient_id::uuid);

CREATE POLICY "Users can create appointments" ON appointments
    FOR INSERT WITH CHECK (auth.uid() = patient_id::uuid);

CREATE POLICY "Users can update their appointments" ON appointments
    FOR UPDATE USING (auth.uid() = patient_id::uuid);

-- POLÍTICAS PARA PHARMACY_ORDERS (usa user_id)
CREATE POLICY "Users can view their pharmacy orders" ON pharmacy_orders
    FOR SELECT USING (auth.uid() = user_id::uuid);

CREATE POLICY "Users can create pharmacy orders" ON pharmacy_orders
    FOR INSERT WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "Users can update their pharmacy orders" ON pharmacy_orders
    FOR UPDATE USING (auth.uid() = user_id::uuid);

-- POLÍTICAS PARA ALLERGIES (usa user_id)
CREATE POLICY "Users can view their allergies" ON allergies
    FOR SELECT USING (auth.uid() = user_id::uuid);

CREATE POLICY "Users can create allergies" ON allergies
    FOR INSERT WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "Users can update their allergies" ON allergies
    FOR UPDATE USING (auth.uid() = user_id::uuid);

-- POLÍTICAS PARA MEDICAL_RECORDS (usa patient_id)
CREATE POLICY "Users can view their medical records" ON medical_records
    FOR SELECT USING (auth.uid() = patient_id::uuid);

CREATE POLICY "Users can create medical records" ON medical_records
    FOR INSERT WITH CHECK (auth.uid() = patient_id::uuid);

-- HABILITAR REAL-TIME EN TABLAS PRINCIPALES
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE pharmacy_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE allergies;
ALTER PUBLICATION supabase_realtime ADD TABLE medical_records; 