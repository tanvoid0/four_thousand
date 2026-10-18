/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROFILE?: string;
  readonly VITE_BIRTHDATE?: string;
  readonly VITE_NAME?: string;
  readonly VITE_LIFESPAN?: string;
  readonly VITE_EVENTS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
