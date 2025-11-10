# UI Design System Options for React (low-ceremony, decent defaults)

Goal: Reduce Tailwind class verbosity and duplication while delivering a decent, accessible design without a dedicated designer.

Evaluation criteria
- Readability and speed: minimal styling ceremony; avoid repeating long class strings
- Look & feel: respectable defaults without heavy customization
- Accessibility: sane a11y out of the box
- Mobile-first: responsive patterns that work well on small screens
- Adoption & docs: widely used, actively maintained
- Bundle/runtime: reasonable size; no excessive runtime cost

Options

1) Chakra UI
- What: Component library with style props, theme tokens, and solid a11y.
- Pros
  - Easy to make consistent UIs quickly; good defaults without a designer
  - Accessible components; responsive style props are straightforward
  - Theming/tokens centralize design decisions (few repeated classes)
- Cons
  - Style props add runtime cost; can lead to prop-heavy JSX
  - "Chakra look" unless themed; smaller ecosystem than MUI
- Fit: Strong. Minimal CSS duplication; readable; good for teams without designers.

2) MUI (Material UI / Joy UI)
- What: Very popular React UI library implementing Material Design (and Joy).
- Pros
  - Huge ecosystem, docs, and community; accessible components
  - Comprehensive component set; good data display and forms
  - Theming system is powerful; unstyled base and Joy UI are options
- Cons
  - Material feel can be strong; customizing to “not Material” takes work
  - Heavier bundle; styling system more complex (emotion/SC) by default
- Fit: Viable and mainstream; expect more configuration to avoid the Material look.

3) Mantine
- What: Modern component library with hooks and good defaults.
- Pros
  - Clean APIs; looks good out of the box; dark mode included
  - Strong form, modal, table, and input components
  - Theming/tokens reduce duplication
- Cons
  - Slightly smaller mindshare than MUI/Chakra (still substantial)
  - Styling approach adds some bundle/runtime cost
- Fit: Very good ergonomics; quick to ship without designers.

4) Ant Design
- What: Enterprise-oriented React component library.
- Pros
  - Mature, widely used; comprehensive components
  - Strong tables, forms, and layout
- Cons
  - Heavier; visual language is distinctive and may feel enterprise-y
  - Customizing spacing/visuals may be verbose
- Fit: Viable, but less aligned to lightweight mobile-first feel.

5) Radix UI + CSS Modules (or Panda CSS)
- What: Unstyled accessible primitives (Radix) + your styling system.
- Pros
  - Excellent a11y primitives; you control the look
  - CSS Modules or Panda (token-based) avoids Tailwind class bloat
- Cons
  - You must define a design token system and component styles
  - More effort than out-of-box libraries if no designer
- Fit: Great for long-term control; heavier lift short-term.

6) DaisyUI (Tailwind plugin)
- What: Tailwind component library with predefined class combos.
- Pros
  - Reduces Tailwind class repetition; quick to prototype
  - Themes included; works with existing Tailwind
- Cons
  - Still Tailwind-based (class strings remain, though shorter)
  - Visuals less polished vs Chakra/MUI
- Fit: Better than raw Tailwind for duplication, but not the cleanest JSX.

Recommendation
- Primary: Chakra UI for fast, readable implementation without a designer.
  - Why: Good defaults, accessible, minimal duplication, and easy theming.
  - Pattern: Create a tiny design system wrapper (`ui/Button`, `ui/Card`, etc.) so features import from a single source.
- Alternative: Mantine (equally strong ergonomics), or MUI if you want the largest ecosystem and can accept a more opinionated look.

Next steps (if adopting Chakra)
- Add ChakraProvider at app root with a light theme.
- Create a small `ui/` layer exporting `Button, Card, Stack, TextInput, Modal` with standardized props.
- Replace Tailwind utility chains in examples with Chakra components.
- Keep Tailwind only for layout helpers if already present, or remove it entirely.
