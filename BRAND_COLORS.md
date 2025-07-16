# SoCal Wellness Brand Color Package

## Primary Colors

### Navy Blue (Primary Brand Color)
- **Hex:** #001E40
- **RGB:** rgb(0, 30, 64)
- **Usage:** Headers, footers, primary buttons, brand identity
- **CSS Variable:** --color-primary

### Dark Navy (Darker Variant)
- **Hex:** #012650
- **RGB:** rgb(1, 38, 80)
- **Usage:** Hover states, active states, emphasis
- **CSS Variable:** --color-primary-dark

### Light Blue/Teal (Accent)
- **Hex:** #5B8FA8
- **RGB:** rgb(91, 143, 168)
- **Usage:** Links, secondary buttons, highlights
- **CSS Variable:** --color-accent

## Neutral Colors

### Pure White
- **Hex:** #FFFFFF
- **RGB:** rgb(255, 255, 255)
- **Usage:** Main background, card backgrounds
- **CSS Variable:** --color-white

### Off-White
- **Hex:** #F9FAFA
- **RGB:** rgb(249, 250, 250)
- **Usage:** Subtle backgrounds, alternating sections
- **CSS Variable:** --color-off-white

### Light Gray
- **Hex:** #F0F0F0
- **RGB:** rgb(240, 240, 240)
- **Usage:** Borders, dividers, disabled states
- **CSS Variable:** --color-gray-100

### Medium Gray
- **Hex:** #AFB9C7
- **RGB:** rgb(175, 185, 199)
- **Usage:** Secondary text, placeholders
- **CSS Variable:** --color-gray-400

### Slate Blue-Gray
- **Hex:** #6B7A8C
- **RGB:** rgb(107, 122, 140)
- **Usage:** Body text on dark backgrounds
- **CSS Variable:** --color-gray-500

### Dark Gray
- **Hex:** #2C3440
- **RGB:** rgb(44, 52, 64)
- **Usage:** Primary text, headings
- **CSS Variable:** --color-gray-800

### Near Black
- **Hex:** #0C0C0C
- **RGB:** rgb(12, 12, 12)
- **Usage:** High contrast text
- **CSS Variable:** --color-gray-900

## Supporting Colors

### Success Green
- **Hex:** #4CAF50
- **RGB:** rgb(76, 175, 80)
- **Usage:** Success messages, positive feedback
- **CSS Variable:** --color-success

### Warning Orange
- **Hex:** #FF9800
- **RGB:** rgb(255, 152, 0)
- **Usage:** Warning messages, attention
- **CSS Variable:** --color-warning

### Error Red
- **Hex:** #F44336
- **RGB:** rgb(244, 67, 54)
- **Usage:** Error messages, required fields
- **CSS Variable:** --color-error

## Gradient Overlays

### Primary Gradient
- **Start:** #012650 (Dark Navy)
- **End:** #5B8FA8 (Light Blue)
- **Usage:** Hero sections, feature cards
- **CSS:** linear-gradient(135deg, #012650 0%, #5B8FA8 100%)

### Dark Overlay
- **Color:** rgba(1, 38, 80, 0.75)
- **Usage:** Image overlays for text readability

## Implementation Example

```css
:root {
  /* Primary Colors */
  --color-primary: #001E40;
  --color-primary-dark: #012650;
  --color-accent: #5B8FA8;
  
  /* Neutral Colors */
  --color-white: #FFFFFF;
  --color-off-white: #F9FAFA;
  --color-gray-100: #F0F0F0;
  --color-gray-400: #AFB9C7;
  --color-gray-500: #6B7A8C;
  --color-gray-800: #2C3440;
  --color-gray-900: #0C0C0C;
  
  /* Supporting Colors */
  --color-success: #4CAF50;
  --color-warning: #FF9800;
  --color-error: #F44336;
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #012650 0%, #5B8FA8 100%);
  --gradient-dark-overlay: rgba(1, 38, 80, 0.75);
}
```

## Typography Colors

- **Primary Headings:** #0C0C0C (Near Black)
- **Secondary Headings:** #2C3440 (Dark Gray)
- **Body Text:** #2C3440 (Dark Gray)
- **Light Text (on dark bg):** #FFFFFF (White)
- **Muted Text:** #AFB9C7 (Medium Gray)

## Button Styles

### Primary Button
- Background: #001E40
- Text: #FFFFFF
- Hover: #012650
- Border-radius: 8px

### Secondary Button
- Background: transparent
- Text: #001E40
- Border: 2px solid #001E40
- Hover: #001E40 (bg), #FFFFFF (text)

### Accent Button
- Background: #5B8FA8
- Text: #FFFFFF
- Hover: darken(#5B8FA8, 10%)

## Usage Guidelines

1. **Contrast Ratios:** Ensure all text meets WCAG AA standards
   - Dark text on light bg: minimum 4.5:1
   - Light text on dark bg: minimum 4.5:1

2. **Color Application:**
   - Use primary navy for main branding elements
   - Use accent blue sparingly for CTAs and highlights
   - Maintain white space with proper use of white/off-white
   - Use grays for hierarchy and organization

3. **Accessibility:**
   - Never use color alone to convey information
   - Provide sufficient contrast for all interactive elements
   - Test with color blindness simulators