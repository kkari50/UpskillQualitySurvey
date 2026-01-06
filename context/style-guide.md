# [Project Name] Style Guide

## Brand Colors

### Primary Palette

| Name | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| Primary | `#3B82F6` | `bg-blue-500` | CTAs, links, accents |
| Primary Dark | `#2563EB` | `bg-blue-600` | Hover states |
| Primary Light | `#60A5FA` | `bg-blue-400` | Backgrounds |

### Neutral Palette

| Name | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| Background | `#FFFFFF` | `bg-white` | Page background |
| Surface | `#F9FAFB` | `bg-gray-50` | Cards, sections |
| Border | `#E5E7EB` | `border-gray-200` | Dividers, borders |
| Text Primary | `#111827` | `text-gray-900` | Headings |
| Text Secondary | `#6B7280` | `text-gray-500` | Body text |

### Semantic Colors

| Name | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| Success | `#22C55E` | `bg-green-500` | Success states |
| Warning | `#F59E0B` | `bg-amber-500` | Warnings |
| Error | `#EF4444` | `bg-red-500` | Errors |
| Info | `#3B82F6` | `bg-blue-500` | Information |

## Typography

### Font Family

- **Primary:** Inter (sans-serif)
- **Monospace:** JetBrains Mono (for code)

### Type Scale

| Name | Size | Weight | Tailwind Classes |
|------|------|--------|------------------|
| H1 | 36px | Bold | `text-4xl font-bold` |
| H2 | 30px | Semibold | `text-3xl font-semibold` |
| H3 | 24px | Semibold | `text-2xl font-semibold` |
| H4 | 20px | Medium | `text-xl font-medium` |
| Body | 16px | Normal | `text-base` |
| Small | 14px | Normal | `text-sm` |
| Caption | 12px | Normal | `text-xs` |

## Spacing

Use Tailwind's spacing scale consistently:

| Token | Value | Usage |
|-------|-------|-------|
| `p-4` | 16px | Standard padding |
| `gap-4` | 16px | Grid/flex gaps |
| `space-y-4` | 16px | Vertical spacing |
| `my-8` | 32px | Section margins |

## Components

### Buttons

```jsx
// Primary Button
<button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
  Button Text
</button>

// Secondary Button
<button className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors">
  Button Text
</button>

// Outline Button
<button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
  Button Text
</button>
```

### Cards

```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  {/* Card content */}
</div>
```

### Inputs

```jsx
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
  placeholder="Enter text..."
/>
```

## Icons

Use [Lucide React](https://lucide.dev/) for icons:

```jsx
import { Home, Settings, User } from 'lucide-react';

<Home className="w-5 h-5" />
```

## Responsive Breakpoints

| Breakpoint | Min Width | Tailwind Prefix |
|------------|-----------|-----------------|
| Mobile | 0px | (default) |
| Tablet | 768px | `md:` |
| Desktop | 1024px | `lg:` |
| Large Desktop | 1280px | `xl:` |

## Animations

Use subtle, purposeful animations:

```jsx
// Hover transitions
className="transition-colors duration-200"

// Scale on hover
className="transition-transform hover:scale-105"

// Fade in
className="animate-fade-in"
```
