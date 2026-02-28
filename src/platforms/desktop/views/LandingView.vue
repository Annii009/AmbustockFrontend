<template>
  <div class="landing">

    <!-- NAV -->
    <header class="nav" :class="{ 'nav--scrolled': scrolled }">
      <div class="nav__inner">
        <button class="nav__logo" @click="scrollTo('inicio')">
          <img src="/logo1Rojo.png" alt="AmbuStock" />
        </button>
        <nav class="nav__links">
          <button v-for="s in sections" :key="s.id" class="nav__link"
            :class="{ 'nav__link--active': activeSection === s.id }" @click="scrollTo(s.id)">{{ s.label }}</button>
        </nav>
        <div class="nav__actions">
          <button class="btn-ghost" @click="router.push('/login')">Iniciar sesión</button>
          <button class="btn-cta" @click="router.push('/register')">Comenzar gratis</button>
        </div>
        <button class="nav__hamburger" @click="mobileOpen = !mobileOpen">
          <span /><span />
        </button>
      </div>
      <div class="nav__mobile" :class="{ show: mobileOpen }">
        <button v-for="s in sections" :key="s.id" class="nav__mobile-link" @click="scrollTo(s.id)">{{ s.label
          }}</button>
        <div class="nav__mobile-sep" />
        <button class="btn-ghost" @click="router.push('/login')">Iniciar sesión</button>
        <button class="btn-cta" @click="router.push('/register')">Comenzar</button>
      </div>
    </header>

    <section id="inicio" class="ambulance-section">
      <div class="ambulance-sticky">

        <div class="scene-bg">
          <div class="scene-bg__grad" />
          <div class="scene-bg__grid" />
          <div class="scene-bg__floor" />
        </div>

        <!-- ═══ CARDS FLOTANTES ALREDEDOR ═══ -->

        <!-- Arriba izquierda — Nueva Revisión -->
        <div class="scene-card scene-card--top-left"
          :style="{ opacity: dashOpacity, transform: `translateY(${dashY * 0.6}px)` }">
          <button class="scene-btn scene-btn--red" @click="router.push('/reposicion/nueva')">
            <div class="scene-btn__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <div class="scene-btn__label">NUEVA REVISIÓN</div>
              <div class="scene-btn__sub">Iniciar revisión de ambulancia</div>
            </div>
          </button>
        </div>

        <!-- Arriba derecha — revisión -->
        <div class="scene-card scene-card--top-right"
          :style="{ opacity: dashOpacity, transform: `translateY(${dashY * 0.6}px)` }">
          <button class="scene-btn scene-btn--slate" @click="router.push('/reposicion')">
            <div class="scene-btn__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <div>
              <div class="scene-btn__label">REVISIÓN</div>
              <div class="scene-btn__sub">Gestionar material gastado</div>
            </div>
          </button>
        </div>

        <!-- Abajo izquierda — alerta -->
        <div class="scene-card scene-card--bot-left" :style="{ opacity: dashOpacity }">
          <div class="float-card">
            <div class="fc-icon fc-icon--orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <div class="fc-title">3 materiales faltantes</div>
              <div class="fc-sub">Ambulancia AMB-07</div>
            </div>
          </div>
        </div>

        <!-- Abajo derecha — ok + Historial -->
        <div class="scene-card scene-card--bot-right" :style="{ opacity: dashOpacity }">
          <div class="float-card">
            <div class="fc-icon fc-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <div class="fc-title">Revisión completada</div>
              <div class="fc-sub">Hace 2 minutos</div>
            </div>
          </div>
          <button class="scene-btn scene-btn--green" style="margin-top: 8px" @click="router.push('/historial')">
            <div class="scene-btn__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v5h5" />
                <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
              </svg>
            </div>
            <div>
              <div class="scene-btn__label">HISTORIAL</div>
              <div class="scene-btn__sub">Ver reposiciones anteriores</div>
            </div>
          </button>
        </div>

        <!-- KPIs pills arriba centrado -->
        <div class="scene-kpis" :style="{ opacity: dashOpacity, transform: `translateY(${dashY * 0.4}px)` }">
          <div class="kpi-pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="#71B48D" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span class="kpi-pill__val">0</span>
            <span class="kpi-pill__lbl">Reposiciones</span>
          </div>
          <div class="kpi-pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="#71B48D" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span class="kpi-pill__val">0</span>
            <span class="kpi-pill__lbl">Aprobadas</span>
          </div>
          <div class="kpi-pill kpi-pill--alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="#891D1A" stroke-width="2">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
            </svg>
            <span class="kpi-pill__val">0</span>
            <span class="kpi-pill__lbl">Alertas</span>
          </div>
          <div class="kpi-pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="#5E657B" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span class="kpi-pill__val">18 min</span>
            <span class="kpi-pill__lbl">Promedio</span>
          </div>
        </div>

        <!-- ═══ AMBULANCIA ═══ -->
        <div class="ambulance"
          :style="{ opacity: truckOpacity, transform: `scale(${truckScale}) translateY(${truckY}px)` }">

          <!-- Techo -->
          <div class="amb__roof">
            <div class="amb__roof-stripe" />
            <div class="amb__beacon amb__beacon--l" :class="{ blink: doorsOpen > 0.3 }" />
            <div class="amb__beacon amb__beacon--r" :class="{ blink: doorsOpen > 0.3 }" />
            <div class="amb__text">AMBULANCIA</div>
          </div>

          <!-- Marco puertas -->
          <div class="amb__frame">

            <!-- Interior -->
            <div class="amb__interior" :style="{ opacity: interiorOpacity }">
              <div class="amb__interior-light" />

              <!-- Dashboard -->
              <div class="amb__dashboard"
                :style="{ opacity: dashOpacity, transform: `translateY(${dashY}px) scale(${dashScale})` }">
                <div class="dash-real">
                  <div class="dash-real__bar">
                    <span class="dm-dot dm-dot--r" /><span class="dm-dot dm-dot--y" /><span class="dm-dot dm-dot--g" />
                    <span class="dm-title">AmbuStock · Panel de control</span>
                  </div>
                  <div class="dash-real__body">
                    <!-- Sidebar -->
                    <aside class="dash-real__sidebar">
                      <div class="drs-logo">
                        <svg viewBox="0 0 32 32" fill="none">
                          <rect width="32" height="32" rx="6" fill="#891D1A" />
                          <text x="4" y="23" font-family="serif" font-size="18" font-weight="900" fill="white">A</text>
                          <text x="15" y="23" font-family="serif" font-size="14" font-weight="700"
                            fill="rgba(255,255,255,0.7)">S</text>
                        </svg>
                      </div>
                      <nav class="drs-nav">
                        <div class="drs-nav__item drs-nav__item--active">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                          </svg>
                          <span>Dashboard</span>
                        </div>
                        <div class="drs-nav__item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                            <rect x="9" y="3" width="6" height="4" rx="1" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                          <span>Revisión</span>
                        </div>
                        <div class="drs-nav__item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                          </svg>
                          <span>Material</span>
                        </div>
                        <div class="drs-nav__item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 3v5h5" />
                            <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
                          </svg>
                          <span>Historial</span>
                        </div>
                      </nav>
                    </aside>

                    <!-- Contenido: tabla actividad -->
                    <main class="dash-real__content">
                      <p class="drc-page-title">Panel de control de AmbuStock</p>
                      <div class="drc-list">
                        <div class="drc-list__head">
                          <span>Ambulancia</span><span>Última revisión</span><span>Estado</span>
                        </div>
                        <div v-for="row in ambulanceRows" :key="row.id" class="drc-list__row">
                          <span class="drc-list__name">{{ row.name }}</span>
                          <span class="drc-list__date">{{ row.date }}</span>
                          <span class="drc-list__badge" :class="`drc-list__badge--${row.status}`">{{ row.label }}</span>
                        </div>
                      </div>
                    </main>
                  </div>
                </div>
              </div>

              <div class="amb__cross">
                <div class="amb__cross-h" />
                <div class="amb__cross-v" />
              </div>
            </div>

            <!-- PUERTA IZQUIERDA -->
            <div class="door door--left" :style="doorLeftStyle">
              <div class="door__panel">
                <div class="door__window" />
                <div class="door__stripe" />
                <div class="door__handle" />
                <div class="door__badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
              </div>
              <div class="door__edge door__edge--left" />
            </div>

            <!-- PUERTA DERECHA -->
            <div class="door door--right" :style="doorRightStyle">
              <div class="door__panel">
                <div class="door__window" />
                <div class="door__stripe" />
                <div class="door__handle" />
                <div class="door__badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path
                      d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                  </svg>
                </div>
              </div>
              <div class="door__edge door__edge--right" />
            </div>

          </div>

          <!-- Bumper -->
          <div class="amb__bottom">
            <div class="amb__bumper" />
          </div>

          <!-- RUEDAS simples -->
          <div class="amb__wheels">
            <div class="amb__wheel" />
            <div class="amb__wheel" />
          </div>

        </div>
        <!-- fin .ambulance -->

        <!-- Scroll hint -->
        <div class="scroll-hint" :style="{ opacity: scrollHintOpacity }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          <span>Desplázate para abrir</span>
        </div>

      </div>
    </section>

    <!-- FEATURES -->
    <section id="caracteristicas" class="features">
      <div class="section__inner">
        <div class="features__head">
          <div>
            <p class="section__tag">Características</p>
            <h2 class="section__title">TODO LO QUE<br>NECESITAS</h2>
          </div>
          <p class="features__intro">
            Diseñado para equipos de emergencias que necesitan control total sobre su material,
            con trazabilidad completa y alertas automáticas.
          </p>
        </div>
        <div class="features__grid">
          <div v-for="(f, i) in features" :key="f.title" class="feature-card">
            <div class="feature-card__num">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="feature-card__icon" :style="{ background: f.color + '14', color: f.color }">
              <span v-html="f.icon" />
            </div>
            <h3 class="feature-card__title">{{ f.title }}</h3>
            <p class="feature-card__text">{{ f.text }}</p>
            <div class="feature-card__line" :style="{ background: f.color }" />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="contacto" class="cta-section">
      <div class="cta-section__inner">
        <p class="section__tag section__tag--white">Empieza ya</p>
        <h2 class="cta-section__title">EMPIEZA HOY</h2>
        <p class="cta-section__sub">Regístrate gratis y empieza a gestionar tus ambulancias de forma profesional.</p>
        <div class="cta-section__actions">
          <button class="btn-cta-white" @click="router.push('/register')">Crear cuenta gratis</button>
          <button class="btn-cta-ghost" @click="router.push('/login')">Iniciar sesión</button>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer__inner">
        <img src="/logo1Rojo.png" alt="AmbuStock" class="footer__logo" />
        <p class="footer__copy">© {{ new Date().getFullYear() }} AmbuStock. Todos los derechos reservados.</p>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mobileOpen = ref(false)
const activeSection = ref('inicio')
const scrolled = ref(false)
const progress = ref(0)

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
const remap = (v: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  outMin + ((clamp(v, inMin, inMax) - inMin) / (inMax - inMin)) * (outMax - outMin)

const doorsOpen = computed(() => remap(progress.value, 0, 0.4, 0, 1))
const interiorOpacity = computed(() => remap(progress.value, 0.05, 0.3, 0, 1))
const dashOpacity = computed(() => remap(progress.value, 0.2, 0.45, 0, 1))
const dashY = computed(() => remap(progress.value, 0.2, 0.45, 24, 0))
const dashScale = computed(() => remap(progress.value, 0.2, 0.45, 0.94, 1))
const truckY = computed(() => remap(progress.value, 0, 0.5, 0, -30))
const truckScale = computed(() => remap(progress.value, 0, 0.3, 0.92, 1))
const truckOpacity = computed(() => remap(progress.value, 0, 0.1, 0.6, 1))
const scrollHintOpacity = computed(() => remap(progress.value, 0, 0.06, 1, 0))

const doorLeftStyle = computed(() => ({
  transform: `perspective(1200px) rotateY(${doorsOpen.value * -130}deg)`,
  transformOrigin: 'left center'
}))
const doorRightStyle = computed(() => ({
  transform: `perspective(1200px) rotateY(${doorsOpen.value * 130}deg)`,
  transformOrigin: 'right center'
}))

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
  const section = document.getElementById('inicio')
  if (section) {
    const scrollRange = window.innerHeight * 0.5
    progress.value = clamp((window.scrollY - section.offsetTop) / scrollRange, 0, 1)
  }
  const ids = ['inicio', 'caracteristicas', 'contacto']
  for (const id of [...ids].reverse()) {
    const el = document.getElementById(id)
    if (el && window.scrollY >= el.offsetTop - 140) { activeSection.value = id; break }
  }
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const sections = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'caracteristicas', label: 'Características' },
  { id: 'contacto', label: 'Contacto' }
]

const scrollTo = (id: string) => {
  activeSection.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  mobileOpen.value = false
}

const ambulanceRows = [
  { id: 1, name: 'AMB-01', date: 'Hoy, 08:30', status: 'ok', label: 'OK' },
  { id: 2, name: 'AMB-03', date: 'Hoy, 09:12', status: 'alert', label: 'Alerta' },
  { id: 3, name: 'AMB-07', date: 'Ayer, 17:45', status: 'missing', label: 'Faltante' },
  { id: 4, name: 'AMB-11', date: 'Hoy, 07:00', status: 'ok', label: 'OK' },
]

const features = [
  {
    title: 'Nueva revisión',
    text: 'Inicia una revisión completa de ambulancia por zonas y cajones en pocos pasos.',
    color: '#891D1A',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:22px;height:22px"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 12 2 2 4-4"/></svg>`
  },
  {
    title: 'Revisión de material',
    text: 'Wizard guiado: selecciona ambulancia, tipo de servicio y responsable en 3 pasos.',
    color: '#5E657B',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:22px;height:22px"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/></svg>`
  },
  {
    title: 'Material gastado',
    text: 'Registra el material consumido por servicio con búsqueda y cantidades exactas.',
    color: '#71B48D',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:22px;height:22px"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`
  },
  {
    title: 'Historial trazable',
    text: 'Consulta todas las reposiciones anteriores con fecha, responsable y estado.',
    color: '#891D1A',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:22px;height:22px"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/></svg>`
  },
  {
    title: 'Dos perfiles de usuario',
    text: 'Rol supervisor para el día a día, administrador para la gestión y aprobación total.',
    color: '#5E657B',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:22px;height:22px"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>`
  },
  {
    title: 'Alertas automáticas',
    text: 'Detecta alertas pendientes y material por debajo del nivel mínimo al instante.',
    color: '#71B48D',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:22px;height:22px"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`
  }
]
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

$cream: #F8F6F3;
$line: #E5E1DB;

* {
  box-sizing: border-box;
}

.landing {
  background: $cream;
  overflow-x: hidden;
}

// ═══════════════════════════════════
// NAV
// ═══════════════════════════════════
.nav {
  position: sticky;
  top: 0;
  z-index: 200;
  background: rgba($cream, 0.9);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s;

  &--scrolled {
    border-color: $line;
  }
}

.nav__inner {
  max-width: 1260px;
  margin: 0 auto;
  padding: 0.875rem 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav__logo {
  background: none;
  border: none;
  cursor: pointer;
  flex-shrink: 0;

  img {
    height: 34px;
    width: auto;
  }
}

.nav__links {
  display: flex;
  gap: 0.125rem;
  flex: 1;

  @media (max-width: 768px) {
    display: none;
  }
}

.nav__link {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem 0.875rem;
  border-radius: 7px;
  font-family: $font-primary;
  font-size: 13.5px;
  font-weight: 600;
  color: #888;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: $text-dark;
  }

  &--active {
    color: $text-dark;
  }
}

.nav__actions {
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    display: none;
  }
}

.btn-ghost {
  padding: 0.42rem 1rem;
  background: transparent;
  border: 1.5px solid $line;
  border-radius: 8px;
  font-family: $font-primary;
  font-size: 13.5px;
  font-weight: 600;
  color: $text-dark;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;

  &:hover {
    border-color: $primary-red;
    color: $primary-red;
  }
}

.btn-cta {
  padding: 0.42rem 1rem;
  background: $primary-red;
  border: none;
  border-radius: 8px;
  font-family: $font-primary;
  font-size: 13.5px;
  font-weight: 600;
  color: $white;
  cursor: pointer;
  transition: filter 0.15s;

  &:hover {
    filter: brightness(0.88);
  }
}

.nav__hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;

  span {
    display: block;
    width: 20px;
    height: 2px;
    background: $text-dark;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
}

.nav__mobile {
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 1rem 2rem 1.25rem;
  background: $cream;
  border-top: 1px solid $line;

  &.show {
    display: flex;
  }
}

.nav__mobile-link {
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  padding: 0.6rem 0.5rem;
  font-family: $font-primary;
  font-size: 14px;
  font-weight: 600;
  color: $text-dark;
  border-radius: 7px;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}

.nav__mobile-sep {
  height: 1px;
  background: $line;
  margin: 0.5rem 0;
}

// ═══════════════════════════════════
// STICKY SCENE
// ═══════════════════════════════════
.ambulance-section {
  position: relative;
}

.ambulance-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.scene-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.scene-bg__grad {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 90% 70% at 50% 40%, #FFFFFF 0%, $cream 60%, darken($cream, 4%) 100%);
}

.scene-bg__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba($primary-red, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba($primary-red, 0.04) 1px, transparent 1px);
  background-size: 52px 52px;
}

.scene-bg__floor {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 35%;
  background: linear-gradient(to top, rgba(darken($cream, 6%), 0.5), transparent);
  clip-path: polygon(0% 100%, 100% 100%, 80% 0%, 20% 0%);
}

// ═══════════════════════════════════
// CARDS / BOTONES FLOTANTES ALREDEDOR
// ═══════════════════════════════════
.scene-card {
  position: absolute;
  z-index: 30;
  will-change: opacity, transform;

  &--top-left {
    top: 14%;
    left: 4%;
    animation: floatA 4.5s ease-in-out infinite;
  }

  &--top-right {
    top: 14%;
    right: 4%;
    animation: floatB 5s ease-in-out infinite;
  }

  &--bot-left {
    bottom: 12%;
    left: 4%;
    animation: floatA 5.5s ease-in-out infinite;
  }

  &--bot-right {
    bottom: 12%;
    right: 4%;
    animation: floatB 4s ease-in-out infinite;
  }
}

@keyframes floatA {

  0%,
  100% {
    transform: translateY(0)
  }

  50% {
    transform: translateY(-7px)
  }
}

@keyframes floatB {

  0%,
  100% {
    transform: translateY(0)
  }

  50% {
    transform: translateY(-9px)
  }
}

.scene-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  min-width: 190px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: filter 0.15s, transform 0.15s;

  &:hover {
    filter: brightness(0.88);
    transform: translateY(-2px) scale(1.02);
  }

  &:active {
    transform: translateY(0);
  }

  &--red {
    background: linear-gradient(140deg, #891D1A 0%, #6b1515 100%);
  }

  &--slate {
    background: linear-gradient(140deg, #5E657B 0%, #474e61 100%);
  }

  &--green {
    background: linear-gradient(140deg, #71B48D 0%, #559970 100%);
  }
}

.scene-btn__icon {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 8px;
  background: rgba($white, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
    color: $white;
  }
}

.scene-btn__label {
  font-family: $font-display;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: $white;
  line-height: 1.1;
}

.scene-btn__sub {
  font-family: $font-primary;
  font-size: 9.5px;
  color: rgba($white, 0.72);
  margin-top: 1px;
}

.float-card {
  background: $white;
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.07);
  min-width: 190px;
}

.fc-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 15px;
    height: 15px;
  }

  &--orange {
    background: rgba(#F59E0B, 0.12);
    color: #D97706;
  }

  &--green {
    background: rgba($green-accent, 0.12);
    color: darken($green-accent, 8%);
  }
}

.fc-title {
  font-family: $font-primary;
  font-size: 11.5px;
  font-weight: 700;
  color: $text-dark;
}

.fc-sub {
  font-family: $font-primary;
  font-size: 10px;
  color: #999;
}

// KPIs pills
.scene-kpis {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 30;
  will-change: opacity, transform;
}

.kpi-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: $white;
  border: 1px solid $line;
  border-radius: 20px;
  padding: 5px 12px 5px 8px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);

  svg {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
  }

  &--alert {
    border-color: rgba($primary-red, 0.2);
  }
}

.kpi-pill__val {
  font-family: $font-display;
  font-size: 13px;
  color: $text-dark;
  line-height: 1;
}

.kpi-pill__lbl {
  font-family: $font-primary;
  font-size: 9.5px;
  color: #999;
  margin-left: 2px;
}

// ═══════════════════════════════════
// AMBULANCIA
// ═══════════════════════════════════
.ambulance {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  will-change: transform, opacity;
}

.amb__roof {
  width: 640px;
  height: 60px;
  background: linear-gradient(180deg, #EDEDED 0%, #D8D8D8 100%);
  border-radius: 16px 16px 0 0;
  position: relative;
  border: 2px solid #C8C8C8;
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.amb__roof-stripe {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: repeating-linear-gradient(90deg, $primary-red 0, $primary-red 30px, #5E657B 30px, #5E657B 60px);
}

.amb__text {
  font-family: $font-display;
  font-size: 22px;
  letter-spacing: 0.25em;
  color: $primary-red;
  opacity: 0.4;
  margin-top: 4px;
}

.amb__beacon {
  position: absolute;
  top: 12px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #888;
  box-shadow: 0 0 0 3px #ccc;

  &--l {
    left: 20px;
  }

  &--r {
    right: 20px;
  }

  &.blink {
    background: $primary-red;
    box-shadow: 0 0 0 3px rgba($primary-red, 0.3), 0 0 12px rgba($primary-red, 0.6);
    animation: blink 0.6s ease-in-out infinite alternate;
  }
}

@keyframes blink {
  from {
    opacity: 1;
    box-shadow: 0 0 0 3px rgba($primary-red, 0.3), 0 0 12px rgba($primary-red, 0.6);
  }

  to {
    opacity: 0.5;
    box-shadow: 0 0 0 2px rgba($primary-red, 0.1), 0 0 4px rgba($primary-red, 0.2);
  }
}

.amb__frame {
  width: 640px;
  height: 420px;
  position: relative;
  background: #1a1a1a;
  border: 2px solid #C8C8C8;
  border-top: none;
  border-bottom: none;
  overflow: visible;
  display: flex;
}

.amb__interior {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #1E2832 0%, #141B22 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  will-change: opacity;
}

.amb__interior-light {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 30px 8px rgba(255, 255, 255, 0.15);
}

.amb__cross {
  position: absolute;
  top: 16px;
  right: 20px;
  width: 28px;
  height: 28px;
  opacity: 0.08;
}

.amb__cross-h {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 8px;
  background: $white;
  transform: translateY(-50%);
  border-radius: 2px;
}

.amb__cross-v {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 8px;
  background: $white;
  transform: translateX(-50%);
  border-radius: 2px;
}

// Dashboard interior
.amb__dashboard {
  position: relative;
  width: 540px;
  will-change: transform, opacity;
}

.dash-real {
  background: #F5F3F0;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.06);
}

.dash-real__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  background: rgba(0, 0, 0, 0.04);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.dm-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &--r {
    background: #FF5F57;
  }

  &--y {
    background: #FEBC2E;
  }

  &--g {
    background: #28C840;
  }
}

.dm-title {
  font-family: $font-primary;
  font-size: 9px;
  color: rgba(0, 0, 0, 0.35);
  margin-left: 4px;
  letter-spacing: 0.04em;
}

.dash-real__body {
  display: flex;
  height: 220px;
}

.dash-real__sidebar {
  width: 72px;
  flex-shrink: 0;
  background: $white;
  border-right: 1px solid $line;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.drs-logo {
  width: 32px;
  height: 32px;
  margin: 0 auto 10px;

  svg {
    width: 32px;
    height: 32px;
  }
}

.drs-nav {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.drs-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 5px 4px;
  border-radius: 6px;
  cursor: pointer;
  color: #999;

  svg {
    width: 12px;
    height: 12px;
  }

  span {
    font-family: $font-primary;
    font-size: 6px;
  }

  &--active {
    background: $primary-red;
    color: $white;
  }
}

.dash-real__content {
  flex: 1;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  background: #F5F3F0;
}

.drc-page-title {
  font-family: $font-primary;
  font-size: 8px;
  color: rgba(0, 0, 0, 0.45);
}

.drc-list {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.drc-list__head {
  display: grid;
  grid-template-columns: 1fr 1.4fr 0.8fr;
  padding: 4px 8px;
  font-family: $font-primary;
  font-size: 6px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 1px solid $line;
}

.drc-list__row {
  display: grid;
  grid-template-columns: 1fr 1.4fr 0.8fr;
  padding: 6px 8px;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  transition: background 0.1s;

  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }
}

.drc-list__name {
  font-family: $font-primary;
  font-size: 8px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.75);
}

.drc-list__date {
  font-family: $font-primary;
  font-size: 7px;
  color: #999;
}

.drc-list__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  border-radius: 10px;
  font-family: $font-primary;
  font-size: 6.5px;
  font-weight: 700;

  &--ok {
    background: rgba(#71B48D, 0.15);
    color: #4a9068;
  }

  &--alert {
    background: rgba(#F59E0B, 0.15);
    color: #b47d10;
  }

  &--missing {
    background: rgba($primary-red, 0.12);
    color: $primary-red;
  }
}

// Puertas
.door {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  transform-style: preserve-3d;
  will-change: transform;

  &--left {
    left: 0;
    transform-origin: left center;
  }

  &--right {
    right: 0;
    transform-origin: right center;
  }
}

.door__panel {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #E8E8E8 0%, #D0D0D0 100%);
  border: 2px solid #B8B8B8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 24px 20px;
  box-shadow: inset 0 1px 0 rgba($white, 0.5), inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

.door__window {
  width: 80%;
  height: 110px;
  background: linear-gradient(135deg, rgba(#A8C8E8, 0.6), rgba(#7AAAC8, 0.4));
  border: 2px solid #A0A0A0;
  border-radius: 6px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
}

.door__stripe {
  width: 100%;
  height: 12px;
  background: repeating-linear-gradient(90deg,
      $primary-red 0, $primary-red 22px, $white 22px, $white 30px,
      #5E657B 30px, #5E657B 52px, $white 52px, $white 60px);
  opacity: 0.9;
}

.door__handle {
  width: 32px;
  height: 10px;
  background: linear-gradient(180deg, #C8C8C8, #A0A0A0);
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  align-self: flex-end;
  margin-right: 12px;
}

.door__badge {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba($primary-red, 0.1);
  border: 1.5px solid rgba($primary-red, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 18px;
    height: 18px;
    color: $primary-red;
    opacity: 0.7;
  }
}

.door__edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 18px;
  transform-style: preserve-3d;

  &--left {
    right: -18px;
    transform: rotateY(90deg);
    transform-origin: left center;
    background: linear-gradient(90deg, #B0B0B0, #909090);
  }

  &--right {
    left: -18px;
    transform: rotateY(-90deg);
    transform-origin: right center;
    background: linear-gradient(90deg, #909090, #B0B0B0);
  }
}

.amb__bottom {
  width: 640px;
  height: 28px;
  background: linear-gradient(180deg, #D0D0D0 0%, #B8B8B8 100%);
  border: 2px solid #C0C0C0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.amb__bumper {
  width: 88%;
  height: 8px;
  background: linear-gradient(180deg, #A0A0A0, #888);
  border-radius: 4px;
}

// ── RUEDAS — rectángulos simples redondeados ──
.amb__wheels {
  width: 640px;
  display: flex;
  justify-content: space-between;
  padding: 0 52px;
  margin-top: -8px;
}

.amb__wheel {
  width: 40px;
  height: 84px;
  background: linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 100%);
  border-radius: 8px;
  border: 1.5px solid #111;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 rgba(0, 0, 0, 0.4);
}

// Scroll hint
.scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  color: #aaa;
  pointer-events: none;
  animation: bounce 2s ease-in-out infinite;

  svg {
    width: 20px;
    height: 20px;
  }

  span {
    font-family: $font-primary;
    font-size: 11.5px;
    letter-spacing: 0.06em;
  }
}

@keyframes bounce {

  0%,
  100% {
    transform: translateX(-50%) translateY(0)
  }

  50% {
    transform: translateX(-50%) translateY(6px)
  }
}

// ═══════════════════════════════════
// FEATURES
// ═══════════════════════════════════
.features {
  background: $white;
  padding: 6rem 0;
  border-top: 1px solid $line;
}

.section__inner {
  max-width: 1260px;
  margin: 0 auto;
  padding: 0 2rem;
}

.features__head {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: end;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.section__tag {
  font-family: $font-primary;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: $primary-red;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  display: block;

  &--white {
    color: rgba($white, 0.7);
  }
}

.section__title {
  font-family: $font-display;
  font-size: clamp(36px, 5vw, 56px);
  letter-spacing: $font-display-spacing;
  color: $text-dark;
  line-height: 0.92;
}

.features__intro {
  font-family: $font-primary;
  font-size: 15px;
  color: #777;
  line-height: 1.7;
  max-width: 380px;
  align-self: end;
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: $line;
  border: 1px solid $line;
  border-radius: 16px;
  overflow: hidden;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  position: relative;
  background: $white;
  padding: 2rem 1.75rem 1.75rem;
  overflow: hidden;
  transition: background 0.2s;

  &:hover {
    background: #FEFCFA;

    .feature-card__line {
      transform: scaleX(1);
    }
  }
}

.feature-card__num {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  font-family: $font-display;
  font-size: 38px;
  color: $line;
  letter-spacing: -0.02em;
  line-height: 1;
  user-select: none;
}

.feature-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;

  :deep(svg) {
    width: 22px;
    height: 22px;
  }
}

.feature-card__title {
  font-family: $font-primary;
  font-size: 14.5px;
  font-weight: 700;
  color: $text-dark;
  margin-bottom: 0.375rem;
}

.feature-card__text {
  font-family: $font-primary;
  font-size: 13px;
  color: #888;
  line-height: 1.6;
}

.feature-card__line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

// ═══════════════════════════════════
// CTA
// ═══════════════════════════════════
.cta-section {
  background: $primary-red;
  padding: 6rem 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba($white, 0.07) 1px, transparent 1px);
    background-size: 22px 22px;
  }
}

.cta-section__inner {
  position: relative;
  z-index: 1;
  max-width: 680px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.cta-section__title {
  font-family: $font-display;
  font-size: clamp(48px, 7vw, 78px);
  letter-spacing: $font-display-spacing;
  color: $white;
  line-height: 0.9;
}

.cta-section__sub {
  font-family: $font-primary;
  font-size: 15px;
  color: rgba($white, 0.75);
  line-height: 1.6;
  max-width: 440px;
}

.cta-section__actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
}

.btn-cta-white {
  padding: 0.875rem 2rem;
  background: $white;
  color: $primary-red;
  border: none;
  border-radius: 11px;
  font-family: $font-primary;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14);
  transition: transform 0.15s, box-shadow 0.15s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  }
}

.btn-cta-ghost {
  padding: 0.875rem 2rem;
  background: transparent;
  border: 1.5px solid rgba($white, 0.35);
  border-radius: 11px;
  font-family: $font-primary;
  font-size: 15px;
  font-weight: 600;
  color: $white;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: $white;
    background: rgba($white, 0.08);
  }
}

// ═══════════════════════════════════
// FOOTER
// ═══════════════════════════════════
.footer {
  background: $cream;
  border-top: 1px solid $line;
  padding: 1.75rem 0;
}

.footer__inner {
  max-width: 1260px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer__logo {
  height: 28px;
  opacity: 0.65;
}

.footer__copy {
  font-family: $font-primary;
  font-size: 12.5px;
  color: #aaa;
}
</style>
