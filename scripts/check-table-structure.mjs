import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://kavwytklydmgkleejoxn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthdnd5dGtseWRtZ2tsZWVqb3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTY2MzUsImV4cCI6MjA2NDE5MjYzNX0.VzkW0w7pDDefwuQspdrqzyTgAdjX8wHNjMsIveJjYzM'
)

async function checkTableStructures() {
  console.log('🔍 Verificando estructura de tablas...')
  
  const allTables = [
    'users', 'appointments', 'medical_records', 'pharmacy_orders', 
    'pharmacy_order_items', 'lab_orders', 'lab_order_tests',
    'nursing_appointments', 'allergies', 'chronic_conditions',
    'emergency_contacts', 'user_locations', 'reviews', 
    'payments', 'notifications', 'doctors', 'pharmacies',
    'medicines', 'nursing_services', 'lab_tests'
  ]
  
  const existingTables = []
  const missingTables = []
  
  for (const table of allTables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(0)
      
      if (error) {
        if (error.code === 'PGRST116') {
          missingTables.push(table)
          console.log(`❌ ${table}: NO EXISTE`)
        } else {
          existingTables.push(table)
          console.log(`✅ ${table}: EXISTE`)
        }
      } else {
        existingTables.push(table)
        console.log(`✅ ${table}: EXISTE`)
      }
    } catch (err) {
      missingTables.push(table)
      console.log(`❌ ${table}: ERROR - ${err.message}`)
    }
  }
  
  console.log('\n📊 RESUMEN:')
  console.log(`✅ Tablas existentes: ${existingTables.length}`)
  console.log(`❌ Tablas faltantes: ${missingTables.length}`)
  
  if (missingTables.length > 0) {
    console.log('\n🚨 TABLAS QUE NO EXISTEN:')
    missingTables.forEach(table => console.log(`   - ${table}`))
  }
  
  console.log('\n📋 TABLAS EXISTENTES:')
  existingTables.forEach(table => console.log(`   ✅ ${table}`))
}

checkTableStructures()   