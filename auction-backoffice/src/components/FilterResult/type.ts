export type FilterResultItem = {
  key: string
  title: string
  exceptKey?: string
  onClear: () => void
  exceptRole?: string
}
