export enum SidebarItemType {
  Nest = 'nest'
}

export type SidebarItem = {
  key: string
  title: string
  icon?: string
  href?: string
  type?: SidebarItemType.Nest
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  items?: SidebarItem[]
  className?: string
}
