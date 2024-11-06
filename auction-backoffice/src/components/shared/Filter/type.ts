export type FilterItemType = {
  key: string
  label: string
  allOptions: FilterOptionType[]
  value: string
}

export type FilterOptionType = {
  key: string
  title: string
}

export type FilterItemKeyValue = {
  [key: string]: string
}