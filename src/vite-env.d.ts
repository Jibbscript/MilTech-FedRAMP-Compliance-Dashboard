/// <reference types="vite/client" />

declare module '@fontsource-variable/dm-sans'
declare module '@fontsource-variable/jetbrains-mono'

declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}
