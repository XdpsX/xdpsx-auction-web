export const statusOptions = [
  { name: 'Upcoming', uid: 'upcoming' },
  { name: 'Live', uid: 'live' },
  { name: 'Ending soon', uid: 'endingSoon' },
  { name: 'Ended', uid: 'ended' },
] as const

export type StatusOptions = (typeof statusOptions)[number]['name']

export const statusColorMap: Record<StatusOptions, string> = {
  Upcoming: 'currentColor',
  Live: '#17C964',
  'Ending soon': '#F5A524',
  Ended: '#F31260',
}
