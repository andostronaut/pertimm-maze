# Pertimm Maze

## Overview

Pertimm maze for playing basic functionality of maze games

## Prerequisites

- **Node.js**: Ensure you have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
- **pnpm**: This project uses `pnpm` as the package manager. If you don't have it installed, you can install it globally using npm:

```bash
npm install -g pnpm
```

## Technologies Used

- **svelte**: A modern JavaScript framework for building user interfaces.
- **sveltekit**: A framework for building Svelte applications with server-side rendering and routing.
- **tailwindcss**: A utility-first CSS framework for styling.
- **pnpm**: A fast, disk space-efficient package manager.

## Getting Started

To get started with the Pertimm maze, you'll need to clone the repository and install the necessary dependencies. Follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/andostronaut/pertimm-maze.git
cd pertimm-maze
```

2. Install dependencies:

```bash
pnpm install
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.
