# Project Rules

This project uses `agent-skills` to enforce high-quality engineering practices. As an AI agent working in this repository, you must follow the skill-driven execution model.

## Core Rules

- Always check for and use skills first before attempting to implement a task directly.
- The global skills are located in `C:\Users\amaan\.gemini\config\skills`. 
- Follow the skill instructions exactly as written.

## Intent → Skill Mapping

When you receive a user request, map it to the corresponding skill:

- **New feature / functionality**: `spec-driven-development` → `incremental-implementation` → `test-driven-development`
- **Planning / breakdown**: `planning-and-task-breakdown`
- **Bug / failure / unexpected behavior**: `debugging-and-error-recovery`
- **Code review**: `code-review-and-quality`
- **Refactoring / simplification**: `code-simplification`
- **API or interface design**: `api-and-interface-design`
- **UI work**: `frontend-ui-engineering`
- **Deployment / Launch**: `shipping-and-launch`

## Brownfield Project Guidelines

This is an established codebase. 
1. **Context First**: Always understand the existing code before changing it. Use `context-engineering`.
2. **Review First**: Run `code-review-and-quality` on new PRs.
3. **Guard Changes**: For legacy code, implement characterization tests using `test-driven-development` before refactoring. 
4. **Simplification**: Use `code-simplification` to reduce complexity safely (Chesterton's Fence rule).
5. **No Big Bangs**: Adopt small, atomic commits (`git-workflow-and-versioning`).

Do not skip verification steps or write code without understanding the existing conventions.

## Tech Stack
- **Framework**: Next.js 16.2.12 (App Router), React 19
- **Deployment**: Cloudflare Workers using OpenNext (`@opennextjs/cloudflare`)
- **Styling**: Tailwind CSS v4, shadcn/ui, Radix UI
- **Database**: Drizzle ORM, Neon Serverless (PostgreSQL)
- **Auth**: NextAuth v5 beta (configured in edge middleware) & Clerk
- **Payments**: Cashfree Payments
- **Editor**: TipTap (Rich Text)

## Commands
- **Dev**: `npm run dev`
- **Cloudflare Build**: `npm run cf:build`
- **Cloudflare Preview**: `npm run cf:preview`
- **Cloudflare Deploy**: `npm run cf:deploy`
- **Database**: `npx drizzle-kit push` (or similar for schema updates)

## Code Conventions
- Cloudflare Edge compatibility is required for middleware and edge routes.
- Follow Next.js App Router patterns (Route Handlers, React Server Components).
- Colocate DB schema in `db/` and keep edge-compatible configs separate (e.g. `auth.config.ts` vs `auth.ts`).

## Boundaries
- Do not introduce Node.js built-ins in Edge-compatible files (like middleware).
- Never commit `.env.local` or `.dev.vars` secrets.
