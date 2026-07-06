## ADDED Requirements

### Requirement: Initialize shadcn/ui with Tailwind CSS v4
The project SHALL initialize shadcn/ui using the `npx shadcn@latest init` command with the following configuration:
- Style: `default` (new-york style)
- Base color: Zinc (to match current gray tones)
- CSS variables: enabled
- React framework
- Tailwind CSS v4 compatible
- Paths configured to place components in `src/components/ui/` and utilities in `src/lib/utils.ts`
- `tailwindcss-animate` plugin shall be added

#### Scenario: Successful initialization
- **WHEN** `npx shadcn@latest init` runs with the specified config
- **THEN** `src/components/ui/` directory exists with proper structure
- **THEN** `src/lib/utils.ts` is updated (or created) with `cn()` helper
- **THEN** CSS variables are added to the global stylesheet via `@layer base`
- **THEN** `tailwindcss-animate` is installed and configured

### Requirement: Replace custom UI components with shadcn equivalents
Each hand-crafted UI component in `src/components/ui/` SHALL be replaced by running `npx shadcn@latest add <component>` for the following:
- button, card, badge, dialog, table, dropdown-menu, input, label, progress, select, separator, tabs, tooltip

The replacement SHALL:
- Preserve the same public API exports and prop interfaces
- Use shadcn's variant system with CVA
- Not break any existing page or component that imports from `src/components/ui/`

#### Scenario: Replace button component
- **WHEN** `npx shadcn@latest add button` is executed
- **THEN** `src/components/ui/button.tsx` contains the shadcn button with cva variants
- **THEN** All imports from `../../components/ui/button` across the project continue to work

#### Scenario: Replace card component
- **WHEN** `npx shadcn@latest add card` is executed
- **THEN** `src/components/ui/card.tsx` contains Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **THEN** All pages using Card components render without errors

#### Scenario: Replace badge component
- **WHEN** `npx shadcn@latest add badge` is executed
- **THEN** `src/components/ui/badge.tsx` contains Badge with cva variants
- **THEN** Badge variants used in the codebase (default, secondary, outline) behave identically

#### Scenario: Replace dialog component
- **WHEN** `npx shadcn@latest add dialog` is executed
- **THEN** `src/components/ui/dialog.tsx` contains Dialog components with Radix-based shadcn implementation
- **THEN** DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription exports are preserved

#### Scenario: Replace table component
- **WHEN** `npx shadcn@latest add table` is executed
- **THEN** `src/components/ui/table.tsx` contains Table, TableHeader, TableBody, TableRow, TableHead, TableCell
- **THEN** All tables in the application render with consistent styling

#### Scenario: Replace dropdown-menu component
- **WHEN** `npx shadcn@latest add dropdown-menu` is executed
- **THEN** `src/components/ui/dropdown-menu.tsx` is replaced with shadcn's implementation
- **THEN** Existing dropdown usage in models page continues to function

### Requirement: Map existing design tokens to shadcn CSS variables
The project's current color palette, typography, and spacing SHALL be preserved by mapping them into shadcn's CSS variable system in the global stylesheet:
- Primary colors SHALL map to the current `primary` / `primary-foreground` values
- Background/surface colors SHALL map to `background`, `foreground`, `card`, `card-foreground`
- Muted/text colors SHALL map to `muted`, `muted-foreground`
- Accent colors SHALL map to `accent`, `accent-foreground`
- Destructive colors SHALL map to `destructive`, `destructive-foreground`
- Border/input colors SHALL map to `border`, `input`
- Ring color SHALL be set to primary
- Border radius SHALL use the current `rounded-xl` / `rounded-lg` values mapped to `radius` variable

#### Scenario: CSS variables match existing palette
- **WHEN** inspecting the `:root` block in the global stylesheet
- **THEN** CSS variable values match the current Tailwind theme colors used in the project
- **THEN** Components render with colors visually identical to pre-migration

### Requirement: Remove redundant Radix UI peer dependencies
`@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-label`, `@radix-ui/react-progress`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-slot`, `@radix-ui/react-tabs`, and `@radix-ui/react-tooltip` SHALL be removed from `package.json` dependencies as shadcn/ui manages them.

#### Scenario: Remove direct Radix dependencies
- **WHEN** inspecting `apps/web/package.json` after migration
- **THEN** No `@radix-ui/*` packages appear as direct dependencies
- **THEN** The application builds and runs without missing module errors

### Requirement: Preserve existing component behavior and interfaces
Every component replacement SHALL maintain backward compatibility:
- All exported component names SHALL remain identical
- All props (className, variant, size, children, etc.) SHALL be supported
- Existing `cn()` utility usage SHALL continue to work
- No changes to page-level imports SHALL be required

#### Scenario: No breaking import changes
- **WHEN** running `npx tsc --noEmit` after migration
- **THEN** No type errors are reported
- **WHEN** running the dev server
- **THEN** All pages render without console errors or visual regressions
