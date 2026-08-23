# themeflip

A lightweight React theme toggle for light, dark, and system themes.

## Requirements

- React 18+

## Install

```bash
npm install themeflip
```

## Usage

```tsx
import { ThemeToggle } from "themeflip";

export default function App() {
  return <ThemeToggle />;
}
```

For Tailwind dark mode:

```tsx
<ThemeToggle addDarkClass />
```

## Styling

`themeflip` is unstyled, so you can use Tailwind, vanilla CSS, CSS Modules, or any other styling system.

```tsx
<ThemeToggle
  className="theme-toggle"
  buttonClassName="theme-toggle-button"
  activeButtonClassName="active"
/>
```

## Data attributes

The component exposes data attributes so you can style it without depending on a specific CSS framework.

```css
[data-theme-toggle] {
  display: flex;
}

[data-theme-option][data-active="true"] {
  font-weight: bold;
}

[data-theme-indicator][data-theme="dark"] {
  transform: translateX(200%);
}
```

Available attributes include:

- `data-theme-toggle` — root element
- `data-theme-indicator` — active-theme indicator
- `data-theme="auto | light | dark"` — current selected theme
- `data-theme-option="auto | light | dark"` — individual theme button
- `data-active="true | false"` — whether a theme button is selected

## Props

- `defaultTheme` — `"light"`, `"dark"`, or `"auto"`
- `storageKey` — localStorage key, defaults to `"theme"`
- `addDarkClass` — adds/removes the `dark` class on `<html>`
- `onThemeChange` — called when the selected theme changes
- `auto`, `light`, `dark` — customize labels and icons
- `className`
- `indicatorClassName`
- `buttonClassName`
- `activeButtonClassName`

## Avoiding theme flicker

To apply the correct theme before React loads, you can optionally add this script near the top of your `<head>`:

```html
<script>
  (function () {
    try {
      var t = localStorage.getItem("theme");
      var d =
        t === "dark" ||
        (t !== "light" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", d);
    } catch (e) {}
  })();
</script>
```

This is useful when using `addDarkClass` and helps avoid a brief light-theme flash while the page loads.

If you use a custom `storageKey`, replace `"theme"` in the script with the same key.

## License

MIT
