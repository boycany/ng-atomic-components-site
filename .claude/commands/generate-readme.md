# Role

You are a senior expert software engineer and technical writer with extensive experience in maintaining high-quality open-source and enterprise repositories. You excel at creating README.md files that are not only informative but also act as a powerful "landing page" for developers.

# Task

1. **Codebase Analysis**: Review the entire project workspace, focusing on `package.json`, project structure, and core logic (e.g., Angular 21 signals, @ngrx/signals).
2. **Document Creation**: Generate a comprehensive `README.md` including:
   - **🚀 Project Title & Badges**: Clear title with badges for tech stack (ex: Angular, TypeScript, Vitest), build status, and license.
   - **🎯 What the project does**: A high-level description. Highlight the performance or architectural improvements (e.g., "Migrated to Signal-based state management").
   - **✨ Key Features**: Bullet points of technical highlights and functional benefits.
   - **🛠️ Tech Stack**: A concise list of core technologies used.
   - **📦 Getting Started**:
     - Prerequisites (Node version from `engines`).
     - Installation steps.
     - Usage examples or a "Quick Start" code snippet.
   - **📜 Available Scripts**: Map essential commands from `package.json` (build, test, lint, serve).
   - **📂 Project Structure**: A brief overview of the directory organization to help navigation.
   - **🤝 Contributing & Support**: Links to documentation, contributing guidelines, and maintainer info.

# References & Inspiration

Take inspiration from these high-quality README structures:

- https://raw.githubusercontent.com/Azure-Samples/serverless-chat-langchainjs/refs/heads/main/README.md
- https://raw.githubusercontent.com/Azure-Samples/serverless-recipes-javascript/refs/heads/main/README.md
- https://raw.githubusercontent.com/sinedied/run-on-output/refs/heads/main/README.md

# Guidelines

### Content and Structure

- **Scannability**: Use clear headings, emojis for visual cues, and consistent spacing.
- **Accuracy**: Ensure the "Getting Started" section perfectly matches the actual `package.json` scripts and dependencies.
- **Conciseness**: Focus on developer productivity. Keep the total content under 500 KiB.
- **Visuals**: Use code blocks with proper syntax highlighting.
- **Examples**: Include relevant code examples and usage snippets.

### Technical Requirements

- Use **GitHub Flavored Markdown**.
- Use **Relative Links** (e.g., `docs/CONTRIBUTING.md`) for internal repository files to ensure they work in clones/forks.
- Use proper heading levels to ensure GitHub's auto-generated Table of Contents is accurate.

### What NOT to include

- **NO** detailed API full-reference (link to `/docs` or external Wiki instead).
- **NO** exhaustive troubleshooting logs (use GitHub Issues or a separate FAQ).
- **NO** full license text (reference the `LICENSE` file).
- **NO** verbose contribution rules (reference `CONTRIBUTING.md`).

# Execution Note

- Please analyze the project's state management (e.g., @ngrx/signals) and component patterns to make the description technically precise.
- If the project is in a "Refactoring" phase, briefly mention the current progress or architectural goals.
