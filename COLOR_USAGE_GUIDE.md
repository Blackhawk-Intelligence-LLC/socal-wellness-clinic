# SoCal Wellness Brand Colors - Quick Reference

## How to Use in Your Project

### 1. Import the CSS file in your main stylesheet or component:
```css
@import './styles/brand-colors.css';
```

### 2. Using with Tailwind CSS

The brand colors are now available as Tailwind utilities with the `socal-` prefix:

#### Backgrounds
- `bg-socal-primary` - Navy blue background
- `bg-socal-primary-dark` - Darker navy background
- `bg-socal-accent` - Light blue accent background
- `bg-socal-gray-100` to `bg-socal-gray-900` - Gray scale backgrounds

#### Text Colors
- `text-socal-primary` - Navy blue text
- `text-socal-accent` - Light blue text  
- `text-socal-gray-600` - Standard body text
- `text-socal-gray-400` - Muted text

#### Borders
- `border-socal-primary` - Navy blue border
- `border-socal-accent` - Light blue border
- `border-socal-gray-200` - Light gray border

#### Hover States
- `hover:bg-socal-primary-dark` - Darker navy on hover
- `hover:text-socal-accent-dark` - Darker accent on hover

### 3. Using CSS Variables

You can also use the CSS custom properties directly:

```css
.custom-element {
  background-color: var(--socal-primary);
  color: var(--socal-white);
  box-shadow: var(--socal-shadow-md);
}
```

### 4. Common Patterns

#### Primary Button
```jsx
<button className="bg-socal-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-socal-primary-dark transition-colors">
  Request Appointment
</button>
```

#### Service Card
```jsx
<div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
  <h3 className="text-xl font-bold text-socal-gray-900">Service Name</h3>
  <p className="text-socal-gray-600">Description</p>
</div>
```

#### Section with Primary Background
```jsx
<section className="bg-socal-primary text-white py-16">
  <h2 className="text-3xl font-bold">Welcome to SoCal Wellness</h2>
</section>
```

#### Gradient Background
```jsx
<div className="bg-gradient-to-br from-socal-primary to-socal-accent">
  <!-- Content -->
</div>
```

### 5. Color Values Reference

| Color Name | Hex Code | Tailwind Class |
|------------|----------|----------------|
| Primary Navy | #001E40 | `socal-primary` |
| Primary Dark | #012650 | `socal-primary-dark` |
| Accent Blue | #5B8FA8 | `socal-accent` |
| White | #FFFFFF | `white` |
| Off-White | #F9FAFA | `socal-gray-50` |
| Body Text | #2C3440 | `socal-gray-800` |
| Muted Text | #AFB9C7 | `socal-gray-400` |
| Success | #4CAF50 | `socal-success` |
| Warning | #FF9800 | `socal-warning` |
| Error | #F44336 | `socal-error` |

### 6. Accessibility Notes

- Always ensure text has sufficient contrast against backgrounds
- Primary navy (#001E40) on white provides excellent contrast
- Use `socal-gray-800` for body text on white backgrounds
- White text on `socal-primary` or `socal-accent` backgrounds meets WCAG AA standards

### 7. Example Implementation

Check out `src/components/BrandColorShowcase.jsx` for live examples of all color combinations and component patterns.