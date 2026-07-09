## Context

The frontend in `apps/web` uses React 19, Vite 8, Tailwind CSS v4, and Radix UI primitives. All UI components (`button.tsx`, `card.tsx`, `badge.tsx`, `dialog.tsx`, `table.tsx`, `dropdown-menu.tsx`, `input.tsx`, `label.tsx`, `progress.tsx`, `select.tsx`, `separator.tsx`, `tabs.tsx`, `tooltip.tsx`) are hand-crafted wrappers around Radix primitives with duplicated `cva`/`cn` boilerplate. There is no centralized component system — each component manages its own variants, styling, and class merging.

shadcn/ui is the de facto standard for React + Tailwind UI. It provides:
- Copy-paste components built on Radix UI primitives
- Centralized CSS variable theming via `@layer base`
- Consistent CVA variant patterns across all components
- Built-in `tailwindcss-animate` for animations

Tailwind CSS v4 is already installed. shadcn/ui officially supports Tailwind v4 since February 2025.

## Goals / Non-Goals

**Goals:**
- Initialize shadcn/ui with Tailwind CSS v4 compatible configuration
- Replace all 13 custom `components/ui/` components with shadcn equivalents
- Map the project's existing color palette into shadcn CSS variables to preserve visual identity
- Remove redundant Radix UI direct dependencies from `package.json`
- Ensure zero visual regressions — every page renders identically

**Non-Goals:**
- Changing page layout, business logic, routing, state management, or data fetching
- Introducing new components not currently in the codebase
- Refactoring components outside `components/ui/` unless import paths change
- Changing styling outside the shadcn theme variables (no redesign)

## Decisions

### Decision 1: shadcn init with `--style default --yes` flags
shadcn/ui offers `default` and `new-york` styles. Default style is simpler and closer to the current Radix wrappers. Using `--yes` skips interactive prompts by reading a pre-seeded config.

**Alternatives considered:**
- *Manual setup*: Error-prone, harder to upgrade
- *new-york style*: Adds opinionated spacing that differs from current layout

### Decision 2: Use Zinc as the base color palette
The current project uses gray tones (`bg-gray-200`, `text-muted-foreground`, etc.). Zinc is the closest shadcn base color to the existing palette, minimizing the delta in generated CSS variables.

**Alternatives considered:**
- *Slate*: Slightly blue-tinted, would shift visual appearance
- *Neutral*: Warmer than current grays
- *Custom variable mapping*: We map existing colors into shadcn vars anyway, so base palette is just a starting point

### Decision 3: Preserve existing Tailwind theme colors outside shadcn
The current project uses custom named colors (`risk-low`, `accent`, etc.) in `tailwindcss` v4's `@theme` directive. These SHALL remain untouched. Only `components/ui/*` swap to shadcn variants; page-level custom colors keep working.

### Decision 4: One-shot component replacement
Replace all components in a single pass rather than incrementally. Rationale:
- shadcn components are drop-in replacements with identical export names
- Intermediate state with mixed hand-crafted + shadcn components would be confusing
- Can verify at once with `npx tsc --noEmit` and visual diff

## Risks / Trade-offs

- **[Risk] CSS variable naming loses visual fidelity** → Mitigation: snapshot screenshot key pages before migration, compare after
- **[Risk] `tailwindcss-animate` conflicts with existing transitions** → Mitigation: runs independently via CSS `@keyframes`, no expected overlap
- **[Risk] shadcn's `Select` component API differs from custom `Select`** → Mitigation: verify `selected.tsx` exports match what pages import; adjust imports if needed
- **[Risk] Build breaks if Radix peers are removed too early** → Mitigation: remove `@radix-ui/*` deps only after all components are replaced and `tsc --noEmit` passes
- **[Trade-off] More generated code in `components/ui/`** → shadcn components are more verbose but standardized and documented

## Open Questions

- Does the project use `Select` from `components/ui/select.tsx` anywhere? (Unclear — grep showed no usages yet)
- Is `tailwindcss-animate` already included via `@tailwindcss/vite` or needs separate install?
