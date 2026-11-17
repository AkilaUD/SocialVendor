import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLkr(amount: number) {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  if (digits.length === 11 && digits.startsWith('94')) {
    return `+94 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
  }
  return phone
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}
