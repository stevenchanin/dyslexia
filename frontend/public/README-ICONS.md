# PWA Icons Setup

## Quick Setup (Generate Placeholder Icons)

To generate placeholder PWA icons:

1. Open `frontend/scripts/generate-icons.html` in your web browser
2. Click "Generate & Download All Icons"
3. Move the downloaded PNG files to this directory (`frontend/public/`)

The script will generate:
- `pwa-64x64.png` - Small icon
- `pwa-192x192.png` - Standard icon
- `pwa-512x512.png` - Large icon
- `maskable-icon-512x512.png` - Maskable icon for Android
- `apple-touch-icon.png` - iOS home screen icon
- `favicon.ico` - Browser tab icon (32x32 PNG)

## Production Icons (Recommended)

For production, replace these placeholder icons with professionally designed ones:

### Option 1: Use an Icon Generator Tool
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) - CLI tool
- [RealFaviconGenerator](https://realfavicongenerator.net/) - Web-based
- [Favicon.io](https://favicon.io/) - Simple web tool

### Option 2: Design Custom Icons
1. Create a 512x512px icon in your design tool (Figma, Illustrator, etc.)
2. Use the same tool to export required sizes
3. Ensure the maskable icon has appropriate safe zones (see Android guidelines)

### Required Sizes
- **64x64** - Small devices
- **192x192** - Standard Android
- **512x512** - Large displays, splash screens
- **512x512 (maskable)** - Android adaptive icon (keep important content in center 80%)
- **180x180** - Apple Touch Icon
- **32x32** - Favicon

## Icon Design Guidelines

For this dyslexia reading app:
- Use bright, friendly colors
- Include recognizable learning symbols (book, letters, owl mascot)
- Keep it simple - icons are viewed at small sizes
- Ensure good contrast for visibility
- Test on different background colors
- Follow [Android Maskable Icon Guidelines](https://web.dev/maskable-icon/) for the maskable variant
