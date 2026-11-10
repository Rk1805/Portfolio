// Copy and links come from plan/story.md. Do not add facts here that are not in that file.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
export const EMAIL = 'rishipatel1112005@gmail.com'

export const LINKS = {
  GitHub: 'https://github.com/Rk1805',
  LinkedIn: 'https://www.linkedin.com/in/rishi-kaneria-981b33280/',
  Instagram: 'https://www.instagram.com/rishi_kaneria/',
  LeetCode: 'https://leetcode.com/u/rishipatel1112005/',
  Codeforces: 'https://codeforces.com/profile/Rishi_kaneria',
} as const

export const SOCIAL = ['GitHub', 'LinkedIn', 'Instagram'] as const

export const ALSO_BUILT: { name: string; text: string; meta?: string; repo: string }[] = [
  { name: 'RideWise', text: 'Ride booking and car-pooling app with live ride tracking.', meta: 'React Native · Expo · Firebase · Google Maps · 2025', repo: 'https://github.com/Rk1805/RideWise' },
  { name: 'Attention Ledger', text: "Built at Insomniac Hackathon '26.", meta: 'JavaScript', repo: 'https://github.com/Rk1805/Attention_Ledger' },
  { name: 'Price List', text: 'A centralised price list app.', meta: 'TypeScript', repo: 'https://github.com/Rk1805/Price_List' },
  { name: 'Snake', text: 'Terminal Snake in C, with maps and high scores. Playable in the playground.', repo: 'https://github.com/Rk1805/Snake_Game' },
]
