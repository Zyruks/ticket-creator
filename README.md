# Ticket Creator

AI-powered ticket generator for ClickUp using OpenAI. Transform natural language descriptions into well-structured development tickets.

## Features

- **AI-Powered Generation**: Uses OpenAI's latest models (GPT-5.2, o3, etc.) to generate structured tickets
- **Few-Shot Learning**: Teach the AI your ticket style with training examples
- **Repository Context**: Import your codebase structure for context-aware tickets
- **Markdown Output**: Edit and copy generated tickets in markdown format
- **Local Storage**: All data stored locally in your browser

## Getting Started

### Prerequisites

- Node.js 24.x (LTS)
- pnpm 10.x
- OpenAI API key

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Configuration

1. Navigate to **Settings** and enter your OpenAI API key
2. (Optional) Add training examples in **Training Examples**
3. (Optional) Import your repository context in **Repository Context**
4. Start creating tickets in **Create Ticket**

## Repository Context

To import your target repository's structure:

```bash
# From this project directory, run:
node scripts/index-repo.mjs /path/to/your/repo ./repo-context.json

# Then import the JSON in the app's Repository Context page
```

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** for bundling
- **Tailwind CSS 4** for styling
- **shadcn/ui** for UI components
- **Zustand** for state management
- **React Router** for navigation
- **Biome** for linting/formatting

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run Biome linter
pnpm lint:fix     # Fix lint issues
pnpm format       # Format code
pnpm index-repo   # Index a repository structure
```

## Project Structure

```
src/
├── common/hooks/     # Shared React hooks
├── components/       # UI components
│   ├── Layout/       # App layout components
│   └── ui/           # shadcn components
├── domain/           # Business logic
│   ├── openai/       # OpenAI service & types
│   ├── repository/   # Repository context types
│   ├── stores/       # Zustand stores
│   ├── ticket/       # Ticket templates & types
│   └── training/     # Training examples types
├── lib/              # Utilities
└── pages/            # Page components
```

## License

MIT
