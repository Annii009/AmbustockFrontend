/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // Añade más variables aquí si necesitas
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
