# Codebase Structure

## Root Directory
```
/
├── .claude/         # Claude Code configuration
├── .git/            # Git repository
├── .next/           # Next.js build output
├── .serena/         # Serena MCP configuration
├── node_modules/    # Dependencies
├── src/             # Source code
├── supabase/        # Supabase configuration and migrations
├── biome.json       # Biome linter/formatter config
├── components.json  # UI component configuration
├── next.config.ts   # Next.js configuration
├── package.json     # Project dependencies and scripts
└── tsconfig.json    # TypeScript configuration
```

## Source Structure (`src/`)
```
src/
├── app/                      # Next.js App Router
│   ├── actions/             # Server actions
│   │   ├── categories.ts    # Category CRUD and budget tracking
│   │   └── transactions.ts  # Transaction management
│   ├── categories/          # Categories page
│   │   └── page.tsx
│   ├── transactions/        # Transactions page
│   │   ├── columns.tsx      # Table column definitions
│   │   └── page.tsx
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (currently empty)
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Radix UI primitives (Card, Progress, etc.)
│   ├── app-header.tsx       # Application header
│   ├── category-manager.tsx # Category management component
│   ├── csv-upload.tsx       # CSV import component
│   ├── data-table.tsx       # Generic data table
│   ├── table-cells.tsx      # Table cell components
│   └── transactions-table.tsx # Transaction table
├── lib/                     # Utilities
└── types/
    └── database.types.ts    # Generated Supabase types
```

## Key Files
- **Home**: `src/app/page.tsx` - Main landing page (to be populated)
- **Categories API**: `src/app/actions/categories.ts` - Server actions for category operations
- **Transactions API**: `src/app/actions/transactions.ts` - Server actions for transaction operations
- **Database Types**: `src/types/database.types.ts` - Auto-generated from Supabase schema
