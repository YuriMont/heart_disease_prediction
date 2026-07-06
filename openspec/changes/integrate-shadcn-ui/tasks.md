## 1. Setup & Initialization

- [x] 1.1 Install tailwindcss-animate package via npm
- [x] 1.2 Run `npx shadcn@latest init` with Nova preset, Radix base, CSS variables enabled
- [x] 1.3 Map current project colors (primary, muted, accent, destructive, border, ring, background, foreground, card) into shadcn CSS variables in `src/index.css` via `@layer base`
- [x] 1.4 Verify `src/lib/utils.ts` has `cn()` function from shadcn init
- [x] 1.5 Verify `npx tsc --noEmit` passes after initialization

## 2. Component Replacement

- [x] 2.1 Run `npx shadcn@latest add button` and verify all existing button usages render correctly
- [x] 2.2 Run `npx shadcn@latest add card` and verify Card, CardHeader, CardContent, CardTitle, CardFooter are exported
- [x] 2.3 Run `npx shadcn@latest add badge` and verify Badge with variant prop works (default, secondary, outline)
- [x] 2.4 Run `npx shadcn@latest add dialog` and verify DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription exports match current imports
- [x] 2.5 Run `npx shadcn@latest add table` and verify Table, TableHeader, TableBody, TableRow, TableHead, TableCell exports
- [x] 2.6 Run `npx shadcn@latest add dropdown-menu` and verify DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem exports
- [x] 2.7 Run `npx shadcn@latest add input` and verify Input component
- [x] 2.8 Run `npx shadcn@latest add label` and verify Label component
- [x] 2.9 Run `npx shadcn@latest add progress` and verify Progress component
- [x] 2.10 Run `npx shadcn@latest add select` and verify Select components
- [x] 2.11 Run `npx shadcn@latest add separator` and verify Separator component
- [x] 2.12 Run `npx shadcn@latest add tabs` and verify Tabs components
- [x] 2.13 Run `npx shadcn@latest add tooltip` and verify Tooltip components

## 3. Cleanup & Verification

- [x] 3.1 Keep `@radix-ui/*` dependencies in package.json — shadcn v4 components import them directly as copy-paste components
- [x] 3.2 Remove custom `components/ui/segmented.tsx` and `components/ui/stat-card.tsx` — both were unused
- [x] 3.3 Run `npx tsc --noEmit` and fix any type errors
- [x] 3.4 Run `npm run build` and verify production build succeeds
- [x] 3.5 Verify built CSS contains all expected shadcn component styles and animation utilities
