## Why

The frontend UI components are hand-crafted wrappers around Radix UI primitives with duplicated styling logic. This is maintainable but lacks the polish, accessibility guarantees, and developer experience of shadcn/ui — the de facto standard for React + Tailwind projects. Adopting shadcn/ui reduces boilerplate, ensures consistent component variants, and aligns the project with an ecosystem that has broad community support and tooling.

## What Changes

- Initialize shadcn/ui in `apps/web` with Tailwind CSS v4 compatibility
- Replace all existing custom `components/ui/*` components with their shadcn/ui equivalents (button, card, badge, dialog, table, dropdown-menu, input, label, progress, select, separator, tabs, tooltip)
- Remove hand-crafted variants and styling from `components/ui/`, letting shadcn's `cva`-based system + `tailwind.config` theme tokens handle it
- Preserve the project's color palette, typography, and spacing by mapping them into shadcn's `@layer base` CSS variables
- Remove unused Radix UI peer dependencies now managed by shadcn/ui

## Capabilities

### New Capabilities
- `shadcn-ui-migration`: Initialize and configure shadcn/ui, replace all hand-crafted UI components with shadcn equivalents, map existing design tokens into shadcn's CSS variable system

### Modified Capabilities
- *(none — no capability specs exist yet)*

## Impact

- **`apps/web/package.json`**: Add `@radix-ui/react-icons` (if needed), remove direct Radix deps managed by shadcn
- **`apps/web/src/components/ui/`**: All 14 components rewritten as shadcn/ui components
- **`apps/web/src/index.css`** or new `apps/web/src/styles/globals.css`: Add shadcn CSS variables for theming
- **`apps/web/tailwind.config.ts`** (if created) or inline Tailwind config: Add shadcn's `tailwindcss-animate` plugin
- No changes to business logic, routing, state management, API layer, or page layouts beyond component imports
