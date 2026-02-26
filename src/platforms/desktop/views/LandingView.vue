<template>
  <div class="landing">

    <!-- NAV -->
    <header class="nav">
      <div class="nav__inner">
        <button class="nav__logo" @click="scrollTo('inicio')">
          <img src="/logo1Rojo.png" alt="AmbuStock" />
        </button>
        <nav class="nav__links">
          <button v-for="s in sections" :key="s.id"
            class="nav__link" :class="{ 'nav__link--active': activeSection === s.id }"
            @click="scrollTo(s.id)">
            {{ s.label }}
          </button>
        </nav>
        <div class="nav__actions">
          <button class="btn-ghost" @click="router.push('/login')">Iniciar sesión</button>
          <button class="btn-cta"   @click="router.push('/register')">Comenzar gratis</button>
        </div>
        <button class="nav__mobile-btn" @click="mobileOpen = !mobileOpen">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
      <!-- Mobile menu -->
      <div v-if="mobileOpen" class="nav__mobile">
        <button v-for="s in sections" :key="s.id" class="nav__mobile-link" @click="scrollTo(s.id)">{{ s.label }}</button>
        <div class="nav__mobile-sep" />
        <button class="btn-ghost nav__mobile-action" @click="router.push('/login')">Iniciar sesión</button>
        <button class="btn-cta nav__mobile-action" @click="router.push('/register')">Comenzar</button>
      </div>
    </header>

    <!-- HERO -->
    <section id="inicio" class="hero">
      <div class="hero__inner">
        <div class="hero__badge">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          Gestión de ambulancias certificada
        </div>
        <h1 class="hero__title">AMBUSTOCK</h1>
        <p class="hero__subtitle">La plataforma profesional para la gestión de inspecciones y material de ambulancias.</p>
        <div class="hero__actions">
          <button class="btn-hero-primary" @click="router.push('/register')">
            Empezar ahora
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <button class="btn-hero-ghost" @click="router.push('/login')">Ya tengo cuenta</button>
        </div>
        <div class="hero__stats">
          <div class="hero__stat">
            <span class="hero__stat-value">100%</span>
            <span class="hero__stat-label">Trazabilidad</span>
          </div>
          <div class="hero__stat">
            <span class="hero__stat-value">2 roles</span>
            <span class="hero__stat-label">Inspector / Admin</span>
          </div>
          <div class="hero__stat">
            <span class="hero__stat-value">Web + App</span>
            <span class="hero__stat-label">Multiplataforma</span>
          </div>
        </div>
      </div>

      <!-- Mockup dashboard -->
      <div class="hero__visual">
        <div class="mockup">
          <div class="mockup__bar">
            <span /><span /><span />
          </div>
          <div class="mockup__sidebar">
            <div class="mockup__logo" />
            <div class="mockup__nav-item mockup__nav-item--active" />
            <div class="mockup__nav-item" />
            <div class="mockup__nav-item" />
            <div class="mockup__nav-item" />
          </div>
          <div class="mockup__content">
            <div class="mockup__cards">
              <div class="mockup__card mockup__card--red" />
              <div class="mockup__card mockup__card--blue" />
              <div class="mockup__card mockup__card--green" />
            </div>
            <div class="mockup__stats">
              <div class="mockup__stat" /><div class="mockup__stat" />
              <div class="mockup__stat" /><div class="mockup__stat" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section id="caracteristicas" class="features">
      <div class="section__inner">
        <p class="section__tag">Características</p>
        <h2 class="section__title">TODO LO QUE NECESITAS</h2>
        <div class="features__grid">
          <div v-for="f in features" :key="f.title" class="feature-card">
            <div class="feature-card__icon" :style="{ background: f.color + '18' }">
              <span v-html="f.icon" :style="{ color: f.color }" />
            </div>
            <h3 class="feature-card__title">{{ f.title }}</h3>
            <p class="feature-card__text">{{ f.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="contacto" class="cta-section">
      <div class="section__inner cta-section__inner">
        <h2 class="cta-section__title">EMPIEZA HOY</h2>
        <p class="cta-section__sub">Regístrate gratis y empieza a gestionar tus ambulancias de forma profesional.</p>
        <div class="cta-section__actions">
          <button class="btn-hero-primary" @click="router.push('/register')">Crear cuenta gratis</button>
          <button class="btn-hero-ghost btn-hero-ghost--light" @click="router.push('/login')">Iniciar sesión</button>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="section__inner footer__inner">
        <img src="/logo1Rojo.png" alt="AmbuStock" class="footer__logo" />
        <p class="footer__copy">© {{ new Date().getFullYear() }} AmbuStock. Todos los derechos reservados.</p>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router       = useRouter()
const mobileOpen   = ref(false)
const activeSection = ref('inicio')

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

const features = [
  {
    title: 'Inspecciones completas',
    text: 'Registra cada zona y cajón de tus ambulancias con control total del material.',
    color: '#891D1A',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:22px;height:22px"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 12 2 2 4-4"/></svg>`
  },
  {
    title: 'Reposición de material',
    text: 'Controla el stock faltante y gestiona los pedidos de reposición desde la app.',
    color: '#5E657B',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:22px;height:22px"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/></svg>`
  },
  {
    title: 'Historial trazable',
    text: 'Cada revisión queda registrada con fecha, responsable y estado de los materiales.',
    color: '#71B48D',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:22px;height:22px"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/></svg>`
  },
  {
    title: 'Dos perfiles de usuario',
    text: 'Rol inspector para el trabajo diario, rol administrador para la gestión total.',
    color: '#891D1A',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:22px;height:22px"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>`
  },
  {
    title: 'Multiplataforma',
    text: 'Disponible en web de escritorio y app móvil con las mismas rutas y datos.',
    color: '#5E657B',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:22px;height:22px"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`
  },
  {
    title: 'Alertas y pendientes',
    text: 'Detecta automáticamente materiales por debajo del nivel mínimo requerido.',
    color: '#71B48D',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:22px;height:22px"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`
  }
]
</script>

<style scoped lang="scss">
@import '@ui/assets/styles/variables';
@import '@ui/assets/styles/mixins';

// NAV
.nav {
  position: sticky; top: 0; z-index: 50;
  background: rgba($white, 0.95); backdrop-filter: blur(12px);
  border-bottom: 1px solid $border-color;
}

.nav__inner {
  max-width: 1200px; margin: 0 auto; padding: 0.875rem 2rem;
  display: flex; align-items: center; gap: 2rem;
}

.nav__logo {
  background: none; border: none; cursor: pointer; flex-shrink: 0;
  img { height: 36px; width: auto; }
}

.nav__links {
  display: flex; gap: 0.25rem; flex: 1;
  @media (max-width: 768px) { display: none; }
}

.nav__link {
  background: none; border: none; cursor: pointer; padding: 0.4375rem 0.875rem;
  border-radius: 8px; font-family: $font-primary; font-size: 14px; font-weight: $font-semibold;
  color: $text-gray; transition: background 0.15s, color 0.15s;
  &:hover { background: $bg-page; color: $text-dark; }
  &--active { color: $text-dark; background: $bg-page; }
}

.nav__actions {
  display: flex; gap: 0.5rem;
  @media (max-width: 768px) { display: none; }
}

.nav__mobile-btn {
  display: none; background: none; border: 1px solid $border-color; border-radius: 8px;
  padding: 6px; cursor: pointer; margin-left: auto;
  svg { width: 18px; height: 18px; display: block; }
  @media (max-width: 768px) { display: flex; align-items: center; justify-content: center; }
}

.nav__mobile {
  padding: 1rem 2rem 1.25rem; background: $white; border-top: 1px solid $border-color;
  display: flex; flex-direction: column; gap: 0.25rem;
}

.nav__mobile-link {
  background: none; border: none; cursor: pointer; text-align: left;
  padding: 0.625rem 0.5rem; font-family: $font-primary; font-size: 14px; font-weight: $font-semibold; color: $text-dark;
  border-radius: 8px; transition: background 0.15s;
  &:hover { background: $bg-page; }
}

.nav__mobile-sep { height: 1px; background: $border-color; margin: 0.5rem 0; }
.nav__mobile-action { width: 100%; justify-content: center; }

// Buttons
.btn-ghost {
  padding: 0.4375rem 1rem; background: transparent; border: 1.5px solid $border-color;
  border-radius: 8px; font-family: $font-primary; font-size: 13.5px; font-weight: $font-semibold;
  color: $text-dark; cursor: pointer; transition: border-color 0.15s;
  &:hover { border-color: $primary-red; color: $primary-red; }
}

.btn-cta {
  padding: 0.4375rem 1rem; background: $primary-red; border: none;
  border-radius: 8px; font-family: $font-primary; font-size: 13.5px; font-weight: $font-semibold;
  color: $white; cursor: pointer; transition: filter 0.15s;
  &:hover { filter: brightness(0.9); }
}

// HERO
.hero {
  display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;
  max-width: 1200px; margin: 0 auto; padding: 4rem 2rem 5rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
}

.hero__inner { display: flex; flex-direction: column; gap: 1.5rem; }

.hero__badge {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.35rem 0.875rem; background: rgba($green-accent, 0.1);
  border: 1px solid rgba($green-accent, 0.25); border-radius: $border-radius-pill;
  font-family: $font-primary; font-size: 13px; font-weight: $font-semibold; color: $green-accent;
  width: fit-content;
  svg { width: 14px; height: 14px; }
}

.hero__title {
  font-family: $font-display; font-size: clamp(52px, 8vw, 82px);
  letter-spacing: $font-display-spacing; color: $text-dark; line-height: 0.9;
}

.hero__subtitle {
  font-family: $font-primary; font-size: 17px; color: $text-gray; line-height: 1.6; max-width: 480px;
}

.hero__actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

.btn-hero-primary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.8125rem 1.75rem; background: $primary-red; color: $white;
  border: none; border-radius: 11px; font-family: $font-primary; font-size: 15px;
  font-weight: $font-semibold; cursor: pointer; transition: filter 0.15s;
  svg { width: 16px; height: 16px; }
  &:hover { filter: brightness(0.9); }
}

.btn-hero-ghost {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.8125rem 1.75rem; background: transparent; color: $text-dark;
  border: 1.5px solid $border-color; border-radius: 11px; font-family: $font-primary;
  font-size: 15px; font-weight: $font-semibold; cursor: pointer; transition: border-color 0.15s, color 0.15s;
  &:hover { border-color: $text-dark; }
  &--light { color: $white; border-color: rgba($white, 0.4); &:hover { border-color: $white; } }
}

.hero__stats {
  display: flex; gap: 1.5rem; padding-top: 0.5rem;
  border-top: 1px solid $border-color;
}

.hero__stat { display: flex; flex-direction: column; gap: 2px; }
.hero__stat-value { font-family: $font-display; font-size: 22px; letter-spacing: 0.02em; color: $text-dark; }
.hero__stat-label { font-family: $font-primary; font-size: 12px; color: $text-gray; }

// MOCKUP
.hero__visual {
  display: flex; justify-content: center; align-items: center;
  @media (max-width: 900px) { display: none; }
}

.mockup {
  width: 460px; background: $white; border: 1px solid $border-color;
  border-radius: 14px; box-shadow: $shadow-card; overflow: hidden;
  display: flex; flex-direction: column;
}

.mockup__bar {
  display: flex; gap: 6px; padding: 12px 14px; background: $bg-page;
  border-bottom: 1px solid $border-color;
  span { width: 10px; height: 10px; border-radius: 50%; background: $border-color; }
  span:nth-child(1) { background: #FF5F57; }
  span:nth-child(2) { background: #FEBC2E; }
  span:nth-child(3) { background: #28C840; }
}

.mockup__sidebar {
  position: absolute; left: 0; top: 0; width: 48px; height: 100%; background: $white;
  border-right: 1px solid $border-color; padding: 10px 8px; display: flex; flex-direction: column; gap: 6px;
}

.mockup__logo { width: 100%; height: 14px; background: $primary-red; border-radius: 4px; margin-bottom: 6px; }

.mockup__nav-item {
  width: 100%; height: 8px; background: $border-color; border-radius: 4px;
  &--active { background: $primary-red; }
}

.mockup__content { display: flex; flex-direction: column; gap: 10px; padding: 14px; }

.mockup__cards { display: flex; gap: 8px; }

.mockup__card {
  flex: 1; height: 60px; border-radius: 8px;
  &--red   { background: linear-gradient(140deg, #891D1A, #6b1515); }
  &--blue  { background: linear-gradient(140deg, #5E657B, #474e61); }
  &--green { background: linear-gradient(140deg, #71B48D, #559970); }
}

.mockup__stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
.mockup__stat  { height: 44px; background: $bg-page; border-radius: 6px; border: 1px solid $border-color; }

// FEATURES
.features { background: $bg-page; padding: 5rem 0; }
.section__inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
.section__tag { font-family: $font-primary; font-size: 12px; font-weight: $font-bold; letter-spacing: 0.1em; color: $primary-red; text-transform: uppercase; margin-bottom: 0.5rem; }

.section__title {
  font-family: $font-display; font-size: clamp(32px, 5vw, 52px);
  letter-spacing: $font-display-spacing; color: $text-dark; line-height: 1;
  margin-bottom: 2.5rem;
}

.features__grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
}

.feature-card {
  background: $white; border: 1px solid $border-color; border-radius: 14px; padding: 1.5rem;
  transition: box-shadow 0.15s;
  &:hover { box-shadow: $shadow-card; }
}

.feature-card__icon {
  width: 44px; height: 44px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;
  :deep(svg) { width: 22px; height: 22px; }
}

.feature-card__title { font-family: $font-primary; font-size: 15px; font-weight: $font-bold; color: $text-dark; margin-bottom: 0.375rem; }
.feature-card__text  { font-family: $font-primary; font-size: 13.5px; color: $text-gray; line-height: 1.55; }

// CTA
.cta-section { background: $primary-red; padding: 5rem 0; }
.cta-section__inner { text-align: center; }
.cta-section__title { font-family: $font-display; font-size: clamp(36px, 5vw, 58px); letter-spacing: $font-display-spacing; color: $white; line-height: 1; margin-bottom: 1rem; }
.cta-section__sub { font-family: $font-primary; font-size: 16px; color: rgba($white, 0.8); margin-bottom: 2rem; }
.cta-section__actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }

// FOOTER
.footer { background: $white; border-top: 1px solid $border-color; padding: 2rem 0; }
.footer__inner { @include flex-between; flex-wrap: wrap; gap: 1rem; }
.footer__logo  { height: 32px; }
.footer__copy  { font-family: $font-primary; font-size: 13px; color: $text-gray; }
</style>