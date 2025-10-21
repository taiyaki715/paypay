# Task Completion Checklist

When completing any coding task, ensure the following:

## Required Checks (Must Pass)
1. **Linting**: Run `npm run lint` and fix all Biome errors
2. **Type Checking**: TypeScript compilation must succeed (run `npm run build`)
3. **Formatting**: Code must follow Biome formatting rules (run `npm run format`)

## Code Quality
- Follow 2-space indentation (enforced by Biome)
- Use TypeScript strict mode
- Organize imports (Biome assist does this automatically)
- Use path alias `@/` for src imports

## Testing (When Applicable)
- Currently no test framework configured
- Manual testing required for UI changes
- Test against local Supabase instance

## Database Changes
- If schema changed: Run `npm run db:types` to update TypeScript types
- Apply migrations: `npm run db:push`
- Consider data migration needs

## Before Merge
- All linter errors must be fixed
- Build must succeed without warnings
- Manual testing completed
- Git commit message follows conventions
