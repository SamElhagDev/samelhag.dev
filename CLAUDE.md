# SamElhagPersonalSite Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-20

## Active Technologies
- JavaScript (ES2020+) + C# / .NET 10 (Blazor Server) + Browser Canvas API (`CanvasRenderingContext2D`, `ImageData`, (001-cfd-simulation-performance)
- N/A — all state is in-memory JavaScript arrays within the simulation loop (001-cfd-simulation-performance)
- C# 13 / .NET 10 — Blazor Server (Interactive Server render mode) + MudBlazor 8.x — `MudPaper`, `MudText`, `MudChip`, `MudChipSet`, `MudIcon`; Bootstrap 5.x grid utilities for responsive wrapper (002-about-conveyor)
- N/A — all milestone data is static, code-managed in `About.razor @code` block (002-about-conveyor)

- [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION] + [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION] (001-cfd-simulation-performance)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

cd src; pytest; ruff check .

## Code Style

[e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]: Follow standard conventions

## Recent Changes
- 002-about-conveyor: Added C# 13 / .NET 10 — Blazor Server (Interactive Server render mode) + MudBlazor 8.x — `MudPaper`, `MudText`, `MudChip`, `MudChipSet`, `MudIcon`; Bootstrap 5.x grid utilities for responsive wrapper
- 001-cfd-simulation-performance: Added JavaScript (ES2020+) + C# / .NET 10 (Blazor Server) + Browser Canvas API (`CanvasRenderingContext2D`, `ImageData`,

- 001-cfd-simulation-performance: Added [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION] + [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
