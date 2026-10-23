# Holocalc

A Star Wars inspired calculator built with React, TypeScript, and Vite. Features arithmetic with operator precedence, parentheses, percentages, keyboard input, session history, copy, optional sound, and Balance / Jedi / Sith themes.

## UI architecture

- Tailwind CSS v4 handles calculator layout, spacing, typography, responsive sizing,
  and interaction styles through the Vite plugin.
- shadcn/ui components live in `src/components/ui`: Button, Dialog, Select, and
  Tooltip. The Radix primitives manage keyboard navigation, dialog focus, and
  menu behavior. `components.json` configures future component additions.
- `src/components` contains the calculator display, keypad, panel, history,
  theme selector, keyboard help, and shared icon button.
- `src/hooks/use-calculator.ts` owns calculator state, history, keyboard input,
  and optional audio. Expression evaluation stays in `src/calculator.ts`.
- `src/styles.css` defines semantic Tailwind color tokens and the Balance, Jedi,
  and Sith theme variables, alongside the original page shell and CSS space artwork.
  The selected theme also applies to portaled menus, dialogs, and tooltips.

Calculator shortcuts pause while help or the theme menu is open. The help dialog
supports Tab navigation, Escape to close, and focus return to its trigger.

To add another shadcn component, run `npx shadcn@latest add <component>` and review
its generated imports and theme styles before use. The shared `cn` helper lives
in `src/lib/utils.ts`.

## Run

```sh
npm install
npm run dev
```

`npm run build` creates the production build. `npm test` checks the expression parser. History is kept in memory for the current session. Fonts use Google Fonts with local fallbacks; all artwork is CSS.

## Code formatting

Use `npm run format` to format the source, styles, markup, and configuration.
Run `npm run format:check` to check formatting without changing files.
Prettier uses two-space indentation, single quotes in JavaScript and TypeScript,
and an 80-column print width. Build output remains optimized for production.
