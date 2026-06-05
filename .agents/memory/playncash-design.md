---
name: PlayNCash Design System
description: Cyber-gaming color palette, neon glow patterns, and AAA UI conventions for PlayNCash
---

# PlayNCash Design System

## Color System (`constants/colors.ts`)
- `Colors.bg` = `#05050D` (deep space black — root background)
- `Colors.surface` = `#0C0D1E`, `Colors.surfaceAlt` = `#10112A`
- Neon: `neonPurple` #8B5CF6, `neonCyan` #06B6D4, `neonGold` #F59E0B, `neonPink` #EC4899, `neonGreen` #10B981
- All gradients are `as const` tuples exported from colors.ts

## Neon Glow Pattern
Always gate with `Platform.OS === 'web'` and cast to `any`:
```ts
Platform.OS === 'web' ? { boxShadow: '0 0 20px #8B5CF644' } as any : { shadowColor, shadowRadius, ... }
```

## Route Map
- Tabs: `(tabs)/index`, `(tabs)/games`, `(tabs)/leaderboard`, `(tabs)/wallet`, `(tabs)/profile`
- Games: `/games/coin-flip`, `/games/lucky-spin`, `/games/quiz`
- Special: `/vip`, `/admin` (admin layout at `app/admin/_layout.tsx`)
- Admin accessible via Profile → Admin Panel setting item

## Key Conventions
- Top padding: `Platform.OS === 'web' ? 56 : insets.top + N`
- All screens use `LinearGradient` from `expo-linear-gradient`
- `NeonCard`, `GlowButton`, `FloatingParticles`, `GlassCard`, `AnimatedNumber` in `components/`
- `useNativeDriver: true` for opacity/transform; `false` for color/width (web compatible)

**Why:** React Native Web doesn't support native animated driver, so JS-based fallbacks are needed. The `as any` cast for web-only CSS is required since RN StyleSheet doesn't include web properties in its types.
