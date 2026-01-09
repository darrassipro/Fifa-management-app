# Tailwind CSS Integration Guide

## 🎨 Overview

FIFA Manager now uses **Tailwind CSS** for modern, utility-first styling. This provides:
- ✅ Faster development with utility classes
- ✅ Consistent design system
- ✅ Smaller CSS bundle (tree-shaking)
- ✅ Responsive design out of the box
- ✅ Easy customization

## 📦 Installation

Tailwind CSS is already configured! Just run:

```bash
npm install
```

This will install:
- `tailwindcss` - Core framework
- `postcss` - CSS processor
- `autoprefixer` - Browser compatibility

## ⚙️ Configuration

### tailwind.config.js

```javascript
module.exports = {
  content: [
    "./src/**/*.{html,ts}",  // Scan all HTML and TS files
  ],
  theme: {
    extend: {
      colors: {
        primary: { /* Custom primary colors */ },
        success: { /* Success states */ },
        warning: { /* Warning states */ },
        danger: { /* Danger states */ },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
    },
  },
}
```

### Custom Color Palette

We've extended Tailwind with football-themed colors:

| Color | Usage | Classes |
|-------|-------|---------|
| `primary` | Main actions, links | `bg-primary-500`, `text-primary-600` |
| `success` | Wins, positive stats | `bg-success-500`, `text-success-600` |
| `warning` | Draws, cautions | `bg-warning-500`, `text-warning-600` |
| `danger` | Losses, errors | `bg-danger-500`, `text-danger-600` |

## 🎯 Custom Components

We've created reusable Tailwind component classes in `styles.scss`:

### Buttons

```html
<!-- Primary Button -->
<button class="btn-primary">Create Team</button>

<!-- Secondary Button -->
<button class="btn-secondary">Cancel</button>

<!-- Danger Button -->
<button class="btn-danger">Delete</button>

<!-- Success Button -->
<button class="btn-success">Confirm</button>
```

### Cards

```html
<!-- Standard Card -->
<div class="card">
  <h2>Card Title</h2>
  <p>Card content...</p>
</div>

<!-- Stat Card -->
<div class="stat-card">
  <h3>Team Rating</h3>
  <p>85</p>
</div>
```

### Form Inputs

```html
<!-- Input Field -->
<input type="text" class="input-field" placeholder="Team name">

<!-- Select -->
<select class="input-field">
  <option>Option 1</option>
</select>
```

### Badges

```html
<span class="badge bg-blue-500 text-white">Position</span>
<span class="badge bg-green-500 text-white">Active</span>
```

## 📱 Responsive Design

Tailwind uses mobile-first breakpoints:

```html
<!-- Example: Responsive Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Stacks on mobile, 2 cols on tablet, 3 on desktop -->
</div>
```

### Breakpoints

| Prefix | Min Width | Usage |
|--------|-----------|-------|
| `sm:` | 640px | Small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large screens |

### Common Patterns

```html
<!-- Hide on mobile, show on desktop -->
<div class="hidden md:block">Desktop only</div>

<!-- Different padding on different screens -->
<div class="p-4 md:p-6 lg:p-8">Responsive padding</div>

<!-- Responsive text size -->
<h1 class="text-2xl md:text-3xl lg:text-4xl">Heading</h1>
```

## 🎨 Design Tokens

### Spacing Scale
```
p-1  = 0.25rem (4px)
p-2  = 0.5rem  (8px)
p-4  = 1rem    (16px)
p-6  = 1.5rem  (24px)
p-8  = 2rem    (32px)
p-12 = 3rem    (48px)
```

### Color Intensity
```
gray-50  = Lightest
gray-100
gray-200
...
gray-800
gray-900 = Darkest
```

### Border Radius
```
rounded-sm   = 2px
rounded      = 4px
rounded-md   = 6px
rounded-lg   = 8px
rounded-xl   = 12px
rounded-2xl  = 16px
rounded-full = 9999px (circle)
```

## ⚡ Common Utility Classes

### Layout
```html
<div class="flex items-center justify-between">
  <!-- Flexbox with alignment -->
</div>

<div class="grid grid-cols-3 gap-4">
  <!-- Grid with 3 columns and gaps -->
</div>

<div class="max-w-7xl mx-auto px-4">
  <!-- Centered container with max width -->
</div>
```

### Typography
```html
<h1 class="text-4xl font-bold text-gray-800">
  Large bold heading
</h1>

<p class="text-sm text-gray-600">
  Small gray text
</p>
```

### Spacing
```html
<div class="mt-4 mb-6 px-4 py-2">
  <!-- margin-top: 1rem
       margin-bottom: 1.5rem
       padding-left/right: 1rem
       padding-top/bottom: 0.5rem -->
</div>
```

### Colors
```html
<div class="bg-blue-500 text-white">
  Blue background, white text
</div>

<div class="bg-gradient-to-r from-purple-600 to-purple-800">
  Gradient background
</div>
```

### Shadows & Effects
```html
<div class="shadow-md hover:shadow-lg">
  Card with shadow that grows on hover
</div>

<div class="rounded-lg overflow-hidden">
  Rounded corners with overflow hidden
</div>
```

### Transitions
```html
<button class="transition-all duration-200 hover:scale-105">
  Animated button
</button>

<div class="transform hover:-translate-y-1 transition-transform">
  Lift on hover
</div>
```

## 🎭 Component Examples

### Stat Card
```html
<div class="stat-card group cursor-pointer">
  <div class="flex items-center gap-4">
    <div class="text-5xl">⚽</div>
    <div class="flex-1">
      <h3 class="text-sm font-medium text-gray-600 mb-1">Goals</h3>
      <p class="text-3xl font-bold text-orange-600">24</p>
    </div>
  </div>
</div>
```

### Progress Bar
```html
<div class="flex items-center gap-4">
  <span class="w-20 text-sm font-medium text-gray-700">Wins</span>
  <div class="flex-1 h-8 bg-gray-200 rounded-full overflow-hidden">
    <div class="h-full bg-gradient-to-r from-green-500 to-green-600"
         style="width: 75%"></div>
  </div>
  <span class="w-12 text-right font-bold text-gray-800">15</span>
</div>
```

### Modal Overlay
```html
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-2xl p-6 max-w-2xl w-full">
    <!-- Modal content -->
  </div>
</div>
```

### Player Card
```html
<div class="bg-white rounded-xl p-4 shadow-md hover:shadow-xl 
            transition-all duration-200 hover:-translate-y-1">
  <img src="..." class="w-20 h-20 rounded-full mx-auto mb-3">
  <h3 class="text-lg font-semibold text-center">Player Name</h3>
  <div class="flex justify-center gap-2 mt-2">
    <span class="badge bg-blue-500 text-white">ST</span>
    <span class="badge bg-green-500 text-white">85</span>
  </div>
</div>
```

## 🔄 Migration from SCSS

The project uses a hybrid approach:
- **Tailwind** for utilities and layout
- **SCSS** for complex animations and component-specific styles

### Before (Pure SCSS)
```scss
.stat-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-5px);
  }
}
```

### After (Tailwind)
```html
<div class="bg-white rounded-xl p-6 shadow-md hover:shadow-xl 
            hover:-translate-y-1 transition-all duration-200">
  <!-- Content -->
</div>
```

## 🎨 Customization

### Adding Custom Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      'team-blue': '#0066cc',
      'team-red': '#cc0000',
    }
  }
}
```

Use in HTML:
```html
<div class="bg-team-blue text-white">Custom color</div>
```

### Adding Custom Animations

```javascript
theme: {
  extend: {
    animation: {
      'bounce-slow': 'bounce 3s infinite',
    }
  }
}
```

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind Play (Live Editor)](https://play.tailwindcss.com/)
- [Tailwind UI Components](https://tailwindui.com/)
- [Tailwind Color Reference](https://tailwindcss.com/docs/customizing-colors)

## 🚀 Best Practices

1. **Use Tailwind utilities first** - Before writing custom CSS
2. **Extract repeated patterns** - Create component classes in styles.scss
3. **Mobile-first** - Start with mobile, add larger breakpoints
4. **Consistent spacing** - Use the spacing scale (4, 8, 16, 24...)
5. **Limit custom CSS** - Leverage Tailwind's design system
6. **Use @apply sparingly** - Prefer composition over extraction

## 🔍 Debugging

### Check if Tailwind is working:
```html
<div class="bg-red-500 text-white p-4">
  If this is red with white text, Tailwind is working!
</div>
```

### Common Issues:

**Classes not applying?**
- Check `tailwind.config.js` content paths
- Restart dev server after config changes
- Clear browser cache

**Styles purged in production?**
- Ensure classes are in template files, not constructed dynamically
- Use safelist in config if needed

## 💡 Tips

1. **Use Tailwind IntelliSense** (VS Code extension) for autocomplete
2. **Group related utilities** for readability
3. **Use `@layer components`** for custom component classes
4. **Leverage `group` and `peer`** for parent/sibling hover states
5. **Use JIT mode** (enabled by default) for on-demand class generation

---

**Happy styling with Tailwind CSS! 🎨**
