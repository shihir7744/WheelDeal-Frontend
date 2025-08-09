# DriveFlex Design System

A modern, professional, and creative design system for the DriveFlex car rental application.

## 🎨 Design Principles

- **Modern & Professional**: Clean, sophisticated design with premium aesthetics
- **Creative & Engaging**: Interactive elements with smooth animations
- **Accessible**: WCAG compliant with proper contrast and focus states
- **Responsive**: Mobile-first approach with adaptive layouts
- **Consistent**: Unified design language across all components

## 🎯 Color Palette

### Primary Colors
- **Primary Blue**: `#3b82f6` - Main brand color
- **Primary Dark**: `#1d4ed8` - Darker shade for gradients
- **Accent Purple**: `#667eea` - Secondary brand color
- **Accent Dark**: `#764ba2` - Darker accent for gradients

### Semantic Colors
- **Success**: `#22c55e` - Positive actions and states
- **Warning**: `#f59e0b` - Caution and alerts
- **Danger**: `#ef4444` - Errors and destructive actions
- **Info**: `#3b82f6` - Information and neutral states

### Neutral Colors
- **Gray 50**: `#f9fafb` - Lightest background
- **Gray 100**: `#f3f4f6` - Light background
- **Gray 500**: `#6b7280` - Medium text
- **Gray 900**: `#111827` - Darkest text

## 🧩 Components

### Modern Button Component
```typescript
<app-modern-button
  text="Click Me"
  icon="fas fa-car"
  variant="primary"
  size="lg"
  [loading]="isLoading"
  (onClick)="handleClick()"
></app-modern-button>
```

**Variants**: `primary`, `secondary`, `success`, `danger`, `outline`
**Sizes**: `sm`, `md`, `lg`

### Modern Card Component
```typescript
<app-modern-card
  title="Card Title"
  subtitle="Card subtitle"
  variant="primary"
  [hoverable]="true"
  [elevated]="true"
>
  Card content goes here
</app-modern-card>
```

**Variants**: `default`, `primary`, `success`, `warning`, `danger`, `glass`
**Sizes**: `sm`, `md`, `lg`

### Modern Input Component
```typescript
<app-modern-input
  label="Email Address"
  placeholder="Enter your email"
  icon="fas fa-envelope"
  type="email"
  [formControl]="emailControl"
></app-modern-input>
```

**Types**: `text`, `email`, `password`, `number`, `tel`
**Variants**: `default`, `outline`

### Modern Loading Component
```typescript
<app-modern-loading
  text="Loading..."
  subtext="Please wait"
  spinnerType="ring"
  variant="primary"
  [overlay]="true"
></app-modern-loading>
```

**Spinner Types**: `ring`, `dots`, `pulse`, `bars`
**Variants**: `primary`, `success`, `warning`, `danger`

## 🎭 Animations

### Micro-interactions
- **Hover Effects**: Subtle lift and shadow changes
- **Focus States**: Smooth transitions with color changes
- **Loading States**: Elegant spinners and progress indicators
- **Transitions**: 0.3s cubic-bezier(0.4, 0, 0.2, 1) for consistency

### Keyframe Animations
- **Fade In**: `fadeIn` - Opacity and translateY
- **Slide In**: `slideInLeft`, `slideInRight` - Horizontal movement
- **Scale In**: `scaleIn` - Transform scale
- **Float**: `float` - Continuous vertical movement
- **Pulse**: `pulse` - Opacity changes

## 📱 Responsive Breakpoints

- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

## 🎨 Typography

### Font Families
- **Primary**: `Inter` - Clean, modern sans-serif
- **Display**: `Poppins` - Bold, attention-grabbing headings

### Font Sizes
- **XS**: `0.75rem` (12px)
- **SM**: `0.875rem` (14px)
- **Base**: `1rem` (16px)
- **LG**: `1.125rem` (18px)
- **XL**: `1.25rem` (20px)
- **2XL**: `1.5rem` (24px)
- **3XL**: `1.875rem` (30px)
- **4XL**: `2.25rem` (36px)
- **5XL**: `3rem` (48px)

### Font Weights
- **Light**: `300`
- **Normal**: `400`
- **Medium**: `500`
- **Semibold**: `600`
- **Bold**: `700`
- **Extrabold**: `800`

## 🎯 Spacing System

- **1**: `0.25rem` (4px)
- **2**: `0.5rem` (8px)
- **3**: `0.75rem` (12px)
- **4**: `1rem` (16px)
- **5**: `1.25rem` (20px)
- **6**: `1.5rem` (24px)
- **8**: `2rem` (32px)
- **10**: `2.5rem` (40px)
- **12**: `3rem` (48px)
- **16**: `4rem` (64px)
- **20**: `5rem` (80px)
- **24**: `6rem` (96px)

## 🎨 Border Radius

- **SM**: `0.375rem` (6px)
- **MD**: `0.5rem` (8px)
- **LG**: `0.75rem` (12px)
- **XL**: `1rem` (16px)
- **2XL**: `1.5rem` (24px)
- **3XL**: `2rem` (32px)
- **Full**: `9999px` (circular)

## 🎭 Shadows

- **SM**: `0 1px 3px 0 rgba(0, 0, 0, 0.1)`
- **MD**: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- **LG**: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`
- **XL**: `0 20px 25px -5px rgba(0, 0, 0, 0.1)`
- **2XL**: `0 25px 50px -12px rgba(0, 0, 0, 0.25)`

## 🎨 Glassmorphism

### Glass Effect
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

### Dark Glass
```css
background: rgba(0, 0, 0, 0.25);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

## 🎯 Usage Guidelines

### Do's
- ✅ Use consistent spacing and typography
- ✅ Implement proper hover and focus states
- ✅ Ensure accessibility with proper contrast
- ✅ Test on multiple screen sizes
- ✅ Use semantic color variants

### Don'ts
- ❌ Mix different design patterns
- ❌ Use hardcoded colors instead of variables
- ❌ Skip loading states for async operations
- ❌ Ignore mobile responsiveness
- ❌ Use inconsistent animations

## 🔧 Development

### Adding New Components
1. Create component in `shared/` directory
2. Follow naming convention: `modern-{component-name}.component.ts`
3. Implement proper TypeScript interfaces
4. Add comprehensive CSS with variants
5. Include responsive design
6. Document in this README

### Styling Guidelines
- Use CSS custom properties for theming
- Implement proper focus states
- Include hover animations
- Ensure mobile-first approach
- Test with different color schemes

### Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicator visibility

## 🎨 Brand Guidelines

### Logo Usage
- Minimum size: 24px height
- Maintain aspect ratio
- Use on light or dark backgrounds
- Ensure proper contrast

### Color Usage
- Primary blue for main actions
- Accent purple for secondary elements
- Semantic colors for specific states
- Neutral grays for text and backgrounds

### Typography Hierarchy
- Display font for hero sections
- Primary font for body text
- Consistent sizing scale
- Proper line heights for readability

This design system ensures a cohesive, professional, and modern user experience across the DriveFlex application. 