export interface ItineraryItem {
  id: string
  time: string
  location: string
  notes: string
  cost: number
}

export interface Day {
  id: string
  dayNumber: number
  date: string
  items: ItineraryItem[]
}

export type ThemeColor = 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal'

export interface Tentative {
  id: string
  title: string
  dateRange: string
  themeColor: ThemeColor
  days: Day[]
  createdAt: Date
}

export const THEME_COLORS: { value: ThemeColor; label: string; class: string; bg: string }[] = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500', bg: 'bg-blue-500/10' },
  { value: 'green', label: 'Green', class: 'bg-green-500', bg: 'bg-green-500/10' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500', bg: 'bg-purple-500/10' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500', bg: 'bg-orange-500/10' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500', bg: 'bg-pink-500/10' },
  { value: 'teal', label: 'Teal', class: 'bg-teal-500', bg: 'bg-teal-500/10' },
]
