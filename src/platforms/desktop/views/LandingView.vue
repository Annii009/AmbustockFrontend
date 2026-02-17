<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AmbuStockLogo from '@ui/shared/components/AmbustockLogo.vue'

const router = useRouter()
const mobileMenuOpen = ref(false)
const activeSection = ref('inicio')

const scrollToSection = (id: string) => {
  activeSection.value = id
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  mobileMenuOpen.value = false
}

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="landing-page">
    <!-- Header Navigation -->
    <header class="header">
      <div class="header-container">
        <div class="header-content">
          <button @click="scrollToSection('inicio')" class="logo-btn">
            <AmbuStockLogo class="logo-small" />
          </button>
          
          <!-- Desktop Navigation -->
          <nav class="desktop-nav">
            <button 
              @click="scrollToSection('inicio')"
              :class="['nav-link', { active: activeSection === 'inicio' }]"
            >
              Inicio
            </button>
            <button 
              @click="scrollToSection('caracteristicas')"
              :class="['nav-link', { active: activeSection === 'caracteristicas' }]"
            >
              Características
            </button>
            <button 
              @click="scrollToSection('como-funciona')"
              :class="['nav-link', { active: activeSection === 'como-funciona' }]"
            >
              Cómo Funciona
            </button>
            <button 
              @click="scrollToSection('secciones')"
              :class="['nav-link', { active: activeSection === 'secciones' }]"
            >
              Secciones
            </button>
            <button 
              @click="scrollToSection('testimonios')"
              :class="['nav-link', { active: activeSection === 'testimonios' }]"
            >
              Testimonios
            </button>
            <button @click="goToLogin" class="btn-access">
              Acceder
            </button>
          </nav>

          <!-- Mobile menu button -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="mobile-menu-btn"
          >
            <span v-if="!mobileMenuOpen">☰</span>
            <span v-else>✕</span>
          </button>
        </div>

        <!-- Mobile Navigation -->
        <nav v-if="mobileMenuOpen" class="mobile-nav">
          <button @click="scrollToSection('inicio')" class="mobile-nav-link">Inicio</button>
          <button @click="scrollToSection('caracteristicas')" class="mobile-nav-link">Características</button>
          <button @click="scrollToSection('como-funciona')" class="mobile-nav-link">Cómo Funciona</button>
          <button @click="scrollToSection('secciones')" class="mobile-nav-link">Secciones</button>
          <button @click="scrollToSection('testimonios')" class="mobile-nav-link">Testimonios</button>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section id="inicio" class="hero-section">
      <div class="hero-bg">
        <img src="/ambulancia-por-dentro.png" alt="" class="hero-img" />
      </div>
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">AMBUSTOCK</h1>
          <p class="hero-subtitle">Sistema Integral de Inspección de Ambulancias</p>
          <p class="hero-description">
            Optimiza la gestión de tu flota de emergencias con un sistema profesional que garantiza el cumplimiento normativo, seguridad operacional y trazabilidad completa de todas tus inspecciones.
          </p>
          <div class="hero-buttons">
            <button @click="goToLogin" class="btn-primary">
              Iniciar Sesión
              <span class="arrow">→</span>
            </button>
            <button @click="scrollToSection('contacto')" class="btn-secondary">
              Contactar
            </button>
          </div>
          
          <!-- Stats -->
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">98%</div>
              <div class="stat-label">Cumplimiento Normativo</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">500+</div>
              <div class="stat-label">Ambulancias Gestionadas</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">24/7</div>
              <div class="stat-label">Disponibilidad del Sistema</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Características -->
    <section id="caracteristicas" class="section-white">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Características Principales</h2>
          <p class="section-description">
            Un sistema completo diseñado específicamente para las necesidades de gestión de flotas de emergencias médicas
          </p>
        </div>

        <div class="features-grid">
  <div class="feature-card">
    <div class="feature-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    </div>
    <h3 class="feature-title">Cumplimiento Garantizado</h3>
    <p class="feature-text">
      Asegura el cumplimiento de todas las normativas sanitarias y de seguridad vehicular con checklists personalizables y actualizados.
    </p>
  </div>

  <div class="feature-card">
    <div class="feature-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    </div>
    <h3 class="feature-title">Trazabilidad Total</h3>
    <p class="feature-text">
      Historial completo de todas las inspecciones realizadas, con fecha, hora, inspector y estado detallado de cada verificación.
    </p>
  </div>

  <div class="feature-card">
    <div class="feature-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    </div>
    <h3 class="feature-title">Documentación Visual</h3>
    <p class="feature-text">
      Captura y almacena evidencia fotográfica de cada inspección para respaldo legal y seguimiento de mantenimiento.
    </p>
  </div>

  <div class="feature-card">
    <div class="feature-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    </div>
    <h3 class="feature-title">Reportes Analíticos</h3>
    <p class="feature-text">
      Genera reportes automáticos con métricas de cumplimiento, tendencias y alertas de mantenimiento preventivo.
    </p>
  </div>

  <div class="feature-card">
    <div class="feature-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    </div>
    <h3 class="feature-title">Multi-usuario</h3>
    <p class="feature-text">
      Gestión de diferentes roles: inspectores, supervisores, gerentes con permisos personalizados para cada nivel.
    </p>
  </div>

  <div class="feature-card">
    <div class="feature-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    </div>
    <h3 class="feature-title">Ahorro de Tiempo</h3>
    <p class="feature-text">
      Reduce el tiempo de inspección hasta un 60% con formularios digitales intuitivos y flujos de trabajo optimizados.
    </p>
  </div>
</div>

      </div>
    </section>

    <!-- Cómo Funciona -->
    <section id="como-funciona" class="section-gray">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Cómo Funciona</h2>
          <p class="section-description">Un proceso simple y eficiente en 4 pasos</p>
        </div>

        <div class="steps-grid">
          <div class="step-item">
            <div class="step-number">1</div>
            <h3 class="step-title">Selecciona</h3>
            <p class="step-text">Elige la ambulancia de tu flota que deseas inspeccionar</p>
          </div>

          <div class="step-item">
            <div class="step-number">2</div>
            <h3 class="step-title">Inspecciona</h3>
            <p class="step-text">Completa los checklists de las 5 secciones principales</p>
          </div>

          <div class="step-item">
            <div class="step-number">3</div>
            <h3 class="step-title">Documenta</h3>
            <p class="step-text">Captura fotografías y añade observaciones relevantes</p>
          </div>

          <div class="step-item">
            <div class="step-number">4</div>
            <h3 class="step-title">Genera Reporte</h3>
            <p class="step-text">Obtén un informe completo y profesional instantáneamente</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonios -->
    <section id="testimonios" class="section-gray">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Lo Que Dicen Nuestros Clientes</h2>
          <p class="section-description">Empresas de emergencias médicas que ya confían en AmbuStock</p>
        </div>

        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">
              "AmbuStock ha revolucionado nuestra gestión de flota. Antes tardábamos 45 minutos en cada inspección, ahora solo 15. El ahorro de tiempo y la trazabilidad son impresionantes."
            </p>
            <div class="testimonial-author">
              <div class="author-avatar">MG</div>
              <div class="author-info">
                <div class="author-name">María García</div>
                <div class="author-role">Jefa de Flota, SAMU Madrid</div>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">
              "La documentación fotográfica nos ha salvado en varias auditorías. Poder demostrar el estado de cada ambulancia en cada turno es invaluable para nuestro departamento legal."
            </p>
            <div class="testimonial-author">
              <div class="author-avatar">CR</div>
              <div class="author-info">
                <div class="author-name">Carlos Rodríguez</div>
                <div class="author-role">Director Operaciones, Cruz Roja</div>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">
              "Los reportes automáticos son increíbles. Nuestro equipo directivo ahora tiene visibilidad total del estado de la flota sin necesidad de reuniones interminables."
            </p>
            <div class="testimonial-author">
              <div class="author-avatar">AL</div>
              <div class="author-info">
                <div class="author-name">Ana López</div>
                <div class="author-role">Gerente, Emergencias 061</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contacto / CTA -->
    <section id="contacto" class="section-cta">
      <div class="cta-container">
        <h2 class="cta-title">¿Listo para optimizar tu flota?</h2>
        <p class="cta-description">
          Solicita una demostración gratuita y descubre cómo AmbuStock puede transformar la gestión de tus ambulancias
        </p>
        <div class="cta-buttons">
          <button @click="goToRegister" class="btn-primary-large">
            Crear Cuenta Gratuita
          </button>
          <button @click="goToLogin" class="btn-secondary-large">
            Ya tengo cuenta
          </button>
        </div>
        
        <div class="cta-contact">
          <p>
            ¿Tienes preguntas? Escríbenos a <strong>info@ambustock.es</strong> o llama al <strong>+34 900 123 456</strong>
          </p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-grid">
          <div class="footer-col">
            <AmbuStockLogo class="footer-logo" />
            <p class="footer-text">Sistema profesional de gestión e inspección de ambulancias</p>
          </div>
          <div class="footer-col">
            <h3 class="footer-heading">Producto</h3>
            <ul class="footer-links">
              <li><a href="#">Características</a></li>
              <li><a href="#">Precios</a></li>
              <li><a href="#">Demo</a></li>
              <li><a href="#">Actualizaciones</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3 class="footer-heading">Empresa</h3>
            <ul class="footer-links">
              <li><a href="#">Sobre Nosotros</a></li>
              <li><a href="#">Clientes</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3 class="footer-heading">Legal</h3>
            <ul class="footer-links">
              <li><a href="#">Privacidad</a></li>
              <li><a href="#">Términos</a></li>
              <li><a href="#">Cookies</a></li>
              <li><a href="#">Normativa</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 AmbuStock. Todos los derechos reservados. | Sistema profesional de inspección de ambulancias</p>
        </div>
      </div>
    </footer>
  </div>
</template>


<style scoped lang="scss">
@import '@ui/assets/styles/variables';

// Fuentes
$font-display: 'Bebas Neue';
$font-body: 'Source Sans Pro', sans-serif;

// Colores
$primary-red: #891d1a;
$primary-red-hover: #6b1515;
$dark-red: #5e1412;
$text-dark: #210706;
$text-gray: #210706cc;
$bg-gray: #f8f6f6;
$border-gray: #00050033;

.landing-page {
  min-height: 100vh;
  background: $bg-gray;
}

// Header
.header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.logo-small {
  transform: scale(0.7);
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
}

.nav-link {
  font-family: $font-body;
  font-size: 15px;
  font-weight: 500;
  color: $text-dark;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover,
  &.active {
    color: $primary-red;
  }
}

.btn-access {
  padding: 0.625rem 1.5rem;
  background: $primary-red;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: $font-body;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: $primary-red-hover;
  }
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
}

.mobile-nav {
  display: none;
  margin-top: 1rem;
  padding-bottom: 1rem;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 768px) {
    display: flex;
  }
}

.mobile-nav-link {
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  font-family: $font-body;
  font-size: 15px;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }
}

// Hero Section
.hero-section {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, $primary-red 0%, $dark-red 100%);
  color: white;
}

.hero-bg {
  position: absolute;
  inset: 0;
  opacity: 0.1;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-container {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 8rem 2rem;
}

.hero-content {
  max-width: 768px;
}

.hero-title {
  font-family: $font-display;
  font-size: 96px;
  line-height: 0.9;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 64px;
  }
}

.hero-subtitle {
  font-family: $font-display;
  font-size: 48px;
  line-height: 0.95;
  margin-bottom: 1.5rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 32px;
  }
}

.hero-description {
  font-family: $font-body;
  font-size: 22px;
  line-height: 1.6;
  margin-bottom: 3rem;
  opacity: 0.9;
  max-width: 672px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.btn-primary {
  padding: 1rem 2.5rem;
  background: white;
  color: $primary-red;
  border: none;
  border-radius: 12px;
  font-family: $font-body;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;

  &:hover {
    background: #f3f4f6;
  }

  .arrow {
    font-size: 20px;
  }
}

.btn-secondary {
  padding: 1rem 2.5rem;
  background: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 12px;
  font-family: $font-body;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: white;
    color: $primary-red;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 5rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.stat-item {
  .stat-number {
    font-family: $font-display;
    font-size: 56px;
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    font-family: $font-body;
    font-size: 16px;
    opacity: 0.8;
  }
}

// Sections
.section-white {
  padding: 6rem 0;
  background: white;
}

.section-gray {
  padding: 6rem 0;
  background: $bg-gray;
}

.section-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-family: $font-display;
  color: $text-dark;
  font-size: 64px;
  line-height: 1;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 48px;
  }
}

.section-description {
  font-family: $font-body;
  color: $text-gray;
  font-size: 20px;
  max-width: 768px;
  margin: 0 auto;
}

// Features
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  background: $bg-gray;
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid $border-gray;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
}

.feature-icon {
  width: 64px;
  height: 64px;
  background: rgba($primary-red, 0.05);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 1.5rem;
}

.feature-title {
  font-family: $font-display;
  color: $text-dark;
  font-size: 32px;
  line-height: 1;
  margin-bottom: 1rem;
}

.feature-text {
  font-family: $font-body;
  color: $text-dark;
  font-size: 16px;
  opacity: 0.8;
  line-height: 1.6;
}

// Steps
.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.step-item {
  text-align: center;
}

.step-number {
  width: 96px;
  height: 96px;
  background: $primary-red;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-family: $font-display;
  color: white;
  font-size: 48px;
}

.step-title {
  font-family: $font-display;
  color: $text-dark;
  font-size: 28px;
  line-height: 1;
  margin-bottom: 0.75rem;
}

.step-text {
  font-family: $font-body;
  color: $text-dark;
  font-size: 15px;
  opacity: 0.8;
}


// Testimonials
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.testimonial-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid $border-gray;
}

.testimonial-stars {
  color: $primary-red;
  font-size: 20px;
  margin-bottom: 1rem;
}

.testimonial-text {
  font-family: $font-body;
  color: $text-dark;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 48px;
  height: 48px;
  background: $primary-red;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: $font-display;
  color: white;
  font-size: 20px;
}

.author-name {
  font-family: $font-body;
  color: $text-dark;
  font-size: 15px;
  font-weight: 600;
}

.author-role {
  font-family: $font-body;
  color: $text-dark;
  font-size: 13px;
  opacity: 0.6;
}

// CTA Section
.section-cta {
  padding: 6rem 0;
  background: linear-gradient(135deg, $primary-red 0%, $dark-red 100%);
  color: white;
}

.cta-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.cta-title {
  font-family: $font-display;
  font-size: 72px;
  line-height: 1;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 48px;
  }
}

.cta-description {
  font-family: $font-body;
  font-size: 22px;
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
}

.btn-primary-large {
  padding: 1.25rem 3rem;
  background: white;
  color: $primary-red;
  border: none;
  border-radius: 12px;
  font-family: $font-body;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
  }
}

.btn-secondary-large {
  padding: 1.25rem 3rem;
  background: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 12px;
  font-family: $font-body;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: white;
    color: $primary-red;
  }
}

.cta-contact {
  padding-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);

  p {
    font-family: $font-body;
    font-size: 16px;
    opacity: 0.75;
  }

  strong {
    font-weight: 600;
  }
}

.feature-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  color: black;
  
  svg {
    width: 100%;
    height: 100%;
  }
}


// Footer
.footer {
  background: #f8f6f6;
  color: $text-dark;
  padding: 3rem 0;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.footer-logo {
  margin-bottom: 1.5rem;
}

.footer-text {
  font-family: $font-body;
  font-size: 14px;
  line-height: 1.6;
}

.footer-heading {
  font-family: $font-display;
  font-size: 24px;
  margin-bottom: 1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 0.5rem;

    a {
      font-family: $font-body;
      font-size: 14px;
      color: $text-dark;
      opacity: 0.75;
      text-decoration: none;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }
  }
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;

  p {
    font-family: $font-body;
    font-size: 14px;
    opacity: 0.6;
  }
}

</style>
