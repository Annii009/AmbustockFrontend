<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  getAmbulanciaSeleccionada,
  getAmbulanciaById,
  getRevisionAmbulancia,
  getNombreResponsable,
  getServicioSeleccionado,
  getServicios,
  type RevisionData
} from '@core/services/api'
import AmbuStockLogo from '@ui/shared/components/AmbustockLogo.vue'

const route = useRoute()
const router = useRouter()

const step = ref<'progreso' | 'responsable' | 'tipo' | 'ambulancia'>('progreso')

// Datos EXACTOS del móvil
const ambulanciaId = ref<number | null>(null)
const ambulanciaNombre = ref('')
const ambulanciaMatricula = ref('')
const nombreResponsableLocal = ref('')
const tipoServicio = ref('')
const revisionData = ref<RevisionData | null>(null)
const isLoading = ref(true)

// Navegación pasos EXACTA orden imágenes
const nextStep = () => {
  const order: Record<string, any> = {
    progreso: 'responsable',
    responsable: 'tipo', 
    tipo: 'ambulancia',
    ambulancia: 'progreso'
  }
  step.value = order[step.value]
}

const goStep = (s: typeof step.value) => step.value = s

// Carga EXACTA como móvil
const cargarRevision = async () => {
  try {
    isLoading.value = true
    
    // EXACTO móvil
    ambulanciaId.value = getAmbulanciaSeleccionada()
    if (!ambulanciaId.value) {
      router.push('/seleccion-ambulancia')
      return
    }
    
    const ambulancia = await getAmbulanciaById(ambulanciaId.value)
    ambulanciaNombre.value = ambulancia?.nombre || ''
    ambulanciaMatricula.value = ambulancia?.matricula || ''
    
    nombreResponsableLocal.value = getNombreResponsable() || ''
    
    // Buscar servicio seleccionado
    const servicioId = getServicioSeleccionado()
    const servicios = await getServicios()
    const servicioSel = servicios.find(s => s.idServicio === servicioId)
    tipoServicio.value = servicioSel?.nombreServicio || ''
    
    // EXACTO endpoint móvil
    revisionData.value = await getRevisionAmbulancia(ambulanciaId.value)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}

// Progreso EXACTO tu código original
const progresoZona = (zona: any) => {
  const total = zona.materiales?.length ?? 0
  const revisados = zona.materiales?.filter((m: any) => m.revisado).length ?? 0
  const porcentaje = total === 0 ? 0 : Math.round((revisados / total) * 100)
  return { total, revisados, porcentaje }
}

const progresoTotal = computed(() => {
  if (!revisionData.value?.zonas) return { total: 0, revisados: 0, porcentaje: 0 }
  
  let total = 0, revisados = 0
  revisionData.value.zonas.forEach(zona => {
    total += zona.materiales?.length ?? 0
    revisados += zona.materiales?.filter((m: any) => m.revisado).length ?? 0
  })
  
  const porcentaje = total === 0 ? 0 : Math.round((revisados / total) * 100)
  return { total, revisados, porcentaje }
})

// Abrir zona EXACTO móvil
const abrirZona = (zona: any) => {
  router.push({
    name: 'RevisionZonaDesktop',
    params: { 
      id: ambulanciaId.value!.toString(),
      zonaId: zona.id.toString()
    }
  })
}

onMounted(cargarRevision)
</script>

<template>
  <div class="revision-ambu-exact">
    <!-- HEADER EXACTO imagenes -->
    <header class="header">
      <AmbuStockLogo />
      <div class="header-main">
        <h1>AMB-{{ ambulanciaMatricula.slice(-3) || '005' }}</h1>
        <div class="prog-total">{{ progresoTotal.porcentaje }}%</div>
      </div>
      <button class="btn-salir">
        <svg viewBox="0 0 24 24" fill="none" stroke="#991B1B" stroke-width="2">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </header>

    <!-- SIDEBAR NAV EXACTO imagen 1 -->
    <aside class="sidebar-nav">
      <nav class="steps">
        <button class="step" :class="{ active: step === 'progreso' }" @click="goStep('progreso')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11H7v7a2 2 0 002 2h10a2 2 0 002-2v-7h-2v7H9z"/>
            <path d="M21 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v4"/>
            <circle cx="12" cy="4" r="2"/>
          </svg>
          <span>Revisión</span>
        </button>
        
        <button class="step" :class="{ active: step === 'responsable' }" @click="goStep('responsable')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Responsable</span>
        </button>
        
        <button class="step" :class="{ active: step === 'tipo' }" @click="goStep('tipo')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="10" x2="9" y2="16"/>
            <line x1="15" y1="10" x2="15" y2="16"/>
            <line x1="12" y1="6" x2="12" y2="8"/>
          </svg>
          <span>Tipo servicio</span>
        </button>
        
        <button class="step" :class="{ active: step === 'ambulancia' }" @click="goStep('ambulancia')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>Ambulancia</span>
        </button>
      </nav>
      
      <button class="btn-finalizar" @click="$router.push('/materiales-faltantes')">
        Finalizar revisión
      </button>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      
      <!-- PASO 1: PROGRESO - IMAGEN 1 EXACTA -->
      <div v-if="step === 'progreso'" class="step-progress">
        <div class="title-bar">
          <h1>Revisión de ambulancia</h1>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progresoTotal.porcentaje + '%' }"></div>
          </div>
        </div>
        
        <div v-if="isLoading" class="loading">Cargando...</div>
        <div v-else class="zones-grid">
          <div 
            v-for="zona in revisionData?.zonas" 
            :key="zona.nombreZona"
            class="zone-card"
            :class="{ complete: progresoZona(zona).porcentaje === 100 }"
            @click="abrirZona(zona)"
          >
            <div class="zone-top">
              <h3>{{ zona.nombreZona }}</h3>
              <span>{{ progresoZona(zona).porcentaje }}%</span>
            </div>
            <div class="zone-progress">
              <div class="zone-fill" :style="{ width: progresoZona(zona).porcentaje + '%' }"></div>
            </div>
            <div class="zone-bottom">
              {{ progresoZona(zona).revisados }} / {{ progresoZona(zona).total }}
            </div>
          </div>
        </div>
      </div>

      <!-- PASO 2: RESPONSABLE - IMAGEN 2 EXACTA -->
      <div v-if="step === 'responsable'" class="step-form">
        <div class="form-title">RESPONSABLE DEL SERVICIO</div>
        <div class="form-field">
          <label>Número de responsable</label>
          <input v-model="nombreResponsableLocal" readonly />
        </div>
        <button class="btn-continuar" @click="nextStep">Continuar</button>
      </div>

      <!-- PASO 3: TIPO SERVICIO - IMAGEN 3 EXACTA -->
      <div v-if="step === 'tipo'" class="step-form">
        <div class="form-title">TIPO DE SERVICIO</div>
        <div class="form-field">
          <label>Tipo de servicio con ambulancia</label>
          <input v-model="tipoServicio" readonly />
        </div>
        <button class="btn-continuar" @click="nextStep">Continuar</button>
      </div>

      <!-- PASO 4: AMBULANCIA - IMAGEN 4 EXACTA -->
      <div v-if="step === 'ambulancia'" class="step-form">
        <div class="form-title">SELECCIÓN AMBULANCIA</div>
        <div class="form-field">
          <label>Ambulancia</label>
          <input :value="ambulanciaNombre || `AMB-${ambulanciaMatricula.slice(-3)}`" readonly />
        </div>
        <button class="btn-continuar" @click="nextStep">Continuar</button>
      </div>
      
    </main>
  </div>
</template>

<style scoped lang="scss">
.revision-ambu-exact {
  display: flex;
  height: 100vh;
  background: #F8FAFC;
  font-family: Inter, sans-serif;
}

// HEADER EXACTO
.header {
  height: 80px;
  background: white;
  display: flex;
  align-items: center;
  padding: 0 40px;
  gap: 24px;
  border-bottom: 1px solid #E2E8F0;
  
  :deep(.logo) { height: 48px; }
  
  .header-main {
    flex: 1;
    h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: #991B1B;
    }
  }
  
  .prog-total {
    background: #FEF2F2;
    color: #991B1B;
    padding: 8px 20px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 18px;
  }
  
  .btn-salir {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    border: 1px solid #E5E7EB;
    background: white;
    cursor: pointer;
    svg { width: 20px; height: 20px; }
  }
}

// SIDEBAR EXACTO IMAGEN 1
.sidebar-nav {
  width: 320px;
  background: #111827;
  color: white;
  display: flex;
  flex-direction: column;
}

.steps {
  flex: 1;
  padding: 40px 0;
}

.step {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 32px;
  color: rgba(255,255,255,0.7);
  border-left: 4px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover { background: rgba(255,255,255,0.1); }
  
  &.active {
    background: rgba(255,255,255,0.15);
    color: white;
    border-left-color: #EF4444;
  }
  
  svg {
    width: 24px;
    height: 24px;
    stroke: currentColor;
  }
}

.btn-finalizar {
  margin: 40px 32px 32px;
  padding: 16px;
  background: #EF4444;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover { background: #DC2626; }
}

// MAIN
.main-content { flex: 1; padding: 60px; overflow: auto; }

.step-progress, .step-form {
  max-width: 1000px;
  margin: 0 auto;
}

// PASO 1 PROGRESO - IMAGEN 1 EXACTA
.step-progress {
  .title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 48px;
    
    h1 {
      font-size: 32px;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }
  }
  
  .progress-bar {
    width: 400px;
    height: 12px;
    background: #E5E7EB;
    border-radius: 6px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: #EF4444;
    transition: width 0.3s ease;
  }
}

.zones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
}

.zone-card {
  background: white;
  border: 2px solid #F3F4F6;
  border-radius: 20px;
  padding: 36px;
  cursor: pointer;
  transition: all 0.3s;
  height: 200px;
  position: relative;
  
  &:hover {
    border-color: #F87171;
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  }
  
  &.complete {
    border-color: #22C55E;
  }
}

.zone-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  
  h3 { 
    font-size: 22px; 
    font-weight: 600; 
    color: #111827; 
    margin: 0; 
  }
  
  span { 
    font-size: 26px; 
    font-weight: 700; 
    color: #EF4444; 
  }
}

.zone-progress {
  height: 10px;
  background: #E5E7EB;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 20px;
}

.zone-fill {
  height: 100%;
  background: #EF4444;
  transition: width 0.3s ease;
}

.zone-bottom {
  font-size: 15px;
  color: #6B7280;
  font-weight: 500;
}

// PASOS 2-4 FORMULARIOS - IMAGENES 2,3,4 EXACTAS
.step-form {
  background: white;
  padding: 80px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
  
  .form-title {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 48px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.form-field {
  margin-bottom: 60px;
  
  label {
    display: block;
    font-size: 18px;
    color: #374151;
    margin-bottom: 16px;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 24px;
    border: 2px solid #E5E7EB;
    border-radius: 16px;
    font-size: 20px;
    text-align: center;
    background: #FAFBFC;
    color: #6B7280;
  }
}

.btn-continuar {
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  color: white;
  border: none;
  padding: 20px 48px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  max-width: 320px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(239,68,68,0.3);
  }
}

.loading {
  text-align: center;
  font-size: 20px;
  color: #6B7280;
  padding: 100px 0;
}
</style>
