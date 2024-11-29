export type SidebarItem = {
  key: string
  title: string
  icon?: string
  path?: string
  group?: boolean | false
  index?: boolean | false
  children?: SidebarItem[]
  roles?: string[]
}
