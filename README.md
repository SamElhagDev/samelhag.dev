# Sam Elhag - Personal Portfolio Website

<div align="center">

![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![Blazor](https://img.shields.io/badge/Blazor-Server-512BD4?style=for-the-badge&logo=blazor&logoColor=white)
![MudBlazor](https://img.shields.io/badge/MudBlazor-8.0-7B68EE?style=for-the-badge)
![Azure](https://img.shields.io/badge/Azure-Ready-0089D6?style=for-the-badge&logo=microsoftazure&logoColor=white)

**A modern, performant personal portfolio website built with cutting-edge .NET technologies**

</div>

---

## ✨ Features

### 🎨 Interactive Animated Background
- **Procedurally generated maze** with animated particles
- **Real-time signal pulses** traveling through corridors
- **Floating mathematical symbols** (∇, ×, ·, ∂, ∫, etc.)
- **Rotating basis vectors** and coordinate axes visualization
- **Optimized rendering** at 30fps for smooth performance

### 🔬 Heat Transfer Simulation
- **NACA 0012 Airfoil** transient heat analysis
- **Finite difference method** visualization
- **Interactive parameters**: thermal diffusivity, airspeed, temperature
- **Real-time statistics**: Reynolds, Prandtl, Nusselt numbers
- **KaTeX** rendered mathematical equations

### 💼 Portfolio Sections
- **About Me** - Professional background and skills
- **Projects** - Showcase of work with tech stacks
- **Blog** - Technical articles and insights
- **Contact** - Get in touch form

### ⚡ Performance Optimized
- **Response compression** (Brotli & Gzip)
- **Static file caching** with 1-year headers
- **Lazy-loaded images** and async decoding
- **Navigation lock system** for smooth transitions
- **Throttled animations** for lower CPU usage

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | .NET 10, Blazor Server |
| **UI Components** | MudBlazor 8.0 |
| **Styling** | Custom CSS, Glass Morphism |
| **Fonts** | Inter, Space Grotesk, JetBrains Mono |
| **Math Rendering** | KaTeX |
| **Hosting** | .NET Aspire, Azure Ready |
| **Architecture** | Component-based, SSR with Interactivity |

---

## 🚀 Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Visual Studio 2022/2026](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)

## 📁 Project Structure

```
SamElhagPersonalSite/
├── Components/
│   ├── Layout/
│   │   ├── MainLayout.razor       # Main application layout
│   │   ├── NavMenu.razor          # Navigation component
│   │   └── ReconnectModal.razor   # SignalR reconnection UI
│   ├── Pages/
│   │   ├── Home.razor             # Landing page
│   │   ├── About.razor            # About me section
│   │   ├── Projects.razor         # Portfolio projects
│   │   ├── Blog.razor             # Blog articles
│   │   ├── Contact.razor          # Contact form
│   │   └── HeatTransferMudBlazor.razor  # Heat simulation
│   └── Shared/
│       ├── OptimizedImage.razor   # Lazy-loaded images
│       └── PerformanceMonitor.razor # Dev performance stats
├── wwwroot/
│   ├── css/
│   │   └── app.css                # Global styles
│   ├── js/
│   │   ├── maze-background.js     # Animated background
│   │   └── heatSimulation.js      # Heat transfer sim
│   └── images/                    # Static images
├── Program.cs                     # Application entry point
└── App.razor                      # Root component
```

---

## 🎯 Key Components

### Animated Maze Background
The background features a procedurally generated maze with:
- Particles navigating through corridors
- Signal pulses with trail effects
- Floating mathematical symbols
- Smooth 30fps animation loop

### Heat Transfer Simulation
Interactive CFD-lite visualization demonstrating:
- Transient heat conduction equation
- Forced convection energy equation
- Finite difference discretization
- NACA 0012 airfoil geometry

---

## 📊 Performance

See [PERFORMANCE.md](PERFORMANCE.md) for detailed optimization documentation.

**Key Metrics:**
- ⚡ First Contentful Paint: ~0.8s
- 🚀 Time to Interactive: ~1.2s
- 💾 CPU Usage (idle): ~10%
- 📦 Compressed bundle: <1MB

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**Sam Elhag**

- 🌐 Website: [samelhag.dev](https://samelhag.dev)
- 📧 Email: sami.eltaj.elhag@gmail.com
- 💼 LinkedIn: [Sam Elhag](https://linkedin.com/in/samelhag)
- 🐙 GitHub: [@SamElhagDev](https://github.com/SamElhagDev)

---

<div align="center">
</div>
