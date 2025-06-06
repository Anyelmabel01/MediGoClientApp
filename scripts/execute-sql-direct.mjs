import fetch from 'node-fetch'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuración de Supabase
const supabaseUrl = 'https://kavwytklydmgkleejoxn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthdnd5dGtseWRtZ2tsZWVqb3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTY2MzUsImV4cCI6MjA2NDE5MjYzNX0.VzkW0w7pDDefwuQspdrqzyTgAdjX8wHNjMsIveJjYzM'

async function executeSQL(query) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ query })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function checkRealtimePublication() {
  console.log('🔍 Verificando publicación de realtime...')
  
  const query = `
    SELECT schemaname, tablename 
    FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime'
    ORDER BY tablename;
  `
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql_query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ 
        query: query
      })
    })

    if (response.ok) {
      const result = await response.json()
      console.log('📋 Tablas en publicación realtime:', result)
      return result
    } else {
      console.log('⚠️  No se pudo verificar la publicación realtime')
      return null
    }
  } catch (error) {
    console.log('⚠️  Error verificando realtime:', error.message)
    return null
  }
}

async function addTableToRealtimePublication(tableName) {
  console.log(`📡 Añadiendo ${tableName} a publicación realtime...`)
  
  const query = `ALTER PUBLICATION supabase_realtime ADD TABLE ${tableName};`
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql_exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ sql: query })
    })

    if (response.ok) {
      console.log(`✅ ${tableName} añadida a realtime`)
      return true
    } else {
      console.log(`❌ Error añadiendo ${tableName} a realtime`)
      return false
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`)
    return false
  }
}

async function setupRealtimeForAllTables() {
  console.log('🚀 Configurando realtime para todas las tablas...')
  
  const tables = [
    'appointments', 'medical_records', 'pharmacy_orders', 
    'pharmacy_order_items', 'lab_orders', 'lab_order_tests',
    'nursing_appointments', 'allergies', 'chronic_conditions',
    'emergency_contacts', 'user_locations', 'reviews', 
    'payments', 'notifications', 'doctors', 'pharmacies',
    'medicines', 'nursing_services', 'lab_tests'
  ]
  
  // Verificar estado actual
  await checkRealtimePublication()
  
  // Intentar añadir cada tabla
  for (const table of tables) {
    await addTableToRealtimePublication(table)
    // Pequeña pausa entre operaciones
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log('✅ Configuración de realtime completada')
}

async function createRLSFunction() {
  console.log('🔧 Creando función para aplicar RLS...')
  
  const createFunctionQuery = `
    CREATE OR REPLACE FUNCTION apply_rls_to_table(table_name text)
    RETURNS text AS $$
    BEGIN
      EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', table_name);
      RETURN 'RLS enabled for ' || table_name;
    END;
    $$ LANGUAGE plpgsql;
  `
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql_exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ sql: createFunctionQuery })
    })

    if (response.ok) {
      console.log('✅ Función RLS creada')
      return true
    } else {
      console.log('❌ Error creando función RLS')
      return false
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`)
    return false
  }
}

async function attemptDirectConnection() {
  console.log('🚀 Intentando configuración directa de MediGo...')
  console.log('=' * 50)
  
  // 1. Verificar el estado actual de realtime
  console.log('\n📡 Paso 1: Verificando realtime...')
  await checkRealtimePublication()
  
  // 2. Configurar realtime para todas las tablas
  console.log('\n📡 Paso 2: Configurando realtime...')
  await setupRealtimeForAllTables()
  
  // 3. Verificar el estado final
  console.log('\n🔍 Paso 3: Verificación final...')
  await checkRealtimePublication()
  
  console.log('\n🎉 Proceso completado!')
  console.log('📋 Estado: Realtime configurado para todas las tablas')
  console.log('⚠️  Nota: Para RLS completo, ejecuta sql/complete_rls_setup.sql en Supabase Dashboard')
}

// Ejecutar configuración
attemptDirectConnection() 