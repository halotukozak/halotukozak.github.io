export const loadShikiTheme = async () => ({ settings: [], colors: {} })
export type BundledShikiTheme = string
export type ExpressiveCodeTheme = {
  settings: Array<{ scope?: string[]; settings: { foreground?: string } }>
  colors: Record<string, string>
}
