import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = 'https://kavwytklydmgkleejoxn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthdnd5dGtseWRtZ2tsZWVqb3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTY2MzUsImV4cCI6MjA2NDE5MjYzNX0.VzkW0w7pDDefwuQspdrqzyTgAdjX8wHNjMsIveJjYzM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkDatabaseConnection() {
  try {
    console.log('🔍 Verificando conexión a la base de datos...')
    
    // Verificar conexión básica
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Error de conexión:', error.message)
      return false
    }
    
    console.log('✅ Conexión a base de datos exitosa')
    return true
    
  } catch (error) {
    console.error('❌ Error general:', error.message)
    return false
  }
}

async function checkRealtimeStatus() {
  try {
    console.log('🔍 Verificando estado de realtime...')
    
    // Crear un canal de prueba para verificar realtime
    const channel = supabase
      .channel('test-channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users'
      }, (payload) => {
        console.log('📡 Realtime funcionando:', payload)
      })
    
    const subscriptionStatus = await new Promise((resolve) => {
      channel.subscribe((status) => {
        console.log(`📊 Estado de suscripción: ${status}`)
        resolve(status)
      })
      
      // Timeout después de 5 segundos
      setTimeout(() => {
        resolve('TIMEOUT')
      }, 5000)
    })
    
    // Cleanup
    supabase.removeChannel(channel)
    
    return subscriptionStatus === 'SUBSCRIBED'
    
  } catch (error) {
    console.error('❌ Error verificando realtime:', error.message)
    return false
  }
}

async function checkTableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1)
    
    if (error && error.code === 'PGRST116') {
      return false // Tabla no existe
    }
    
    return !error
  } catch (error) {
    return false
  }
}

async function analyzeDatabase() {
  console.log('🚀 Iniciando análisis de la base de datos MediGo...')
  console.log('=' * 50)
  
  // 1. Verificar conexión
  const connectionOk = await checkDatabaseConnection()
  if (!connectionOk) {
    console.log('❌ No se pudo conectar a la base de datos')
    return
  }
  
  // 2. Verificar tablas principales
  console.log('\n📋 Verificando estructura de tablas...')
  const tablesToCheck = [
    'users', 'doctors', 'appointments', 'pharmacies', 
    'medicines', 'pharmacy_orders', 'medical_records',
    'nursing_appointments', 'lab_orders', 'allergies'
  ]
  
  const tableStatus = {}
  for (const table of tablesToCheck) {
    const exists = await checkTableExists(table)
    tableStatus[table] = exists
    console.log(`${exists ? '✅' : '❌'} Tabla ${table}: ${exists ? 'EXISTS' : 'MISSING'}`)
  }
  
  // 3. Verificar realtime
  console.log('\n📡 Verificando realtime...')
  const realtimeOk = await checkRealtimeStatus()
  console.log(`${realtimeOk ? '✅' : '❌'} Realtime: ${realtimeOk ? 'ENABLED' : 'DISABLED'}`)
  
  // 4. Resumen
  console.log('\n📊 RESUMEN DEL ANÁLISIS:')
  console.log('=' * 30)
  
  const tablesExisting = Object.values(tableStatus).filter(Boolean).length
  const totalTables = tablesToCheck.length
  
  console.log(`📋 Tablas: ${tablesExisting}/${totalTables} configuradas`)
  console.log(`📡 Realtime: ${realtimeOk ? 'HABILITADO' : 'NECESITA CONFIGURACIÓN'}`)
  console.log(`🔐 RLS: NECESITA VERIFICACIÓN MANUAL`)
  
  if (tablesExisting === totalTables && realtimeOk) {
    console.log('\n🎉 ¡Base de datos completamente configurada!')
  } else {
    console.log('\n⚠️  Base de datos necesita configuración adicional')
    console.log('\n📝 ACCIONES REQUERIDAS:')
    
    if (!realtimeOk) {
      console.log('1. Habilitar realtime en Supabase Dashboard')
      console.log('   - Ir a Settings > API > Realtime')
      console.log('   - Habilitar realtime para las tablas necesarias')
    }
    
    if (tablesExisting < totalTables) {
      console.log('2. Crear tablas faltantes')
      console.log('   - Ejecutar script de creación de tablas')
    }
    
    console.log('3. Configurar RLS policies')
    console.log('   - Ejecutar sql/complete_rls_setup.sql en Supabase Dashboard')
  }
}

// Ejecutar el análisis
analyzeDatabase() 