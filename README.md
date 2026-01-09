# ✨ Interactive Modern Resume

> A visually stunning, high-performance personal portfolio website built with modern web technologies.

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.x-0055FF?logo=framer&logoColor=white)

---

## 🎨 Overview

This project is a sophisticated, reactive resume/portfolio website designed to showcase professional experience and projects with style. It moves beyond static PDFs, offering an immersive user experience with smooth scrolling, fluid animations, and a responsive design that looks great on any device.

### 🌟 Key Features

- **🚀 Smooth Experience:** Integrated **Lenis** for buttery smooth scroll mechanics.
- **✨ Dynamic Animations:** Powered by **Framer Motion** for elegant entry, exit, and interaction animations.
- **🎭 Custom Interactions:** Features a custom cursor and interactive UI elements to engage visitors.
- **📱 Fully Responsive:** Built with **Tailwind CSS** to ensure perfect rendering from mobile to desktop.
- **🌗 Dark/Light Mode:** (Architecture ready) Themed palettes for optimal viewing in any lighting condition.
- **⚡ Blazing Fast:** Optimized build pipeline using **Vite** for instant HMR and quick production builds.

---

## 🛠️ Tech Stack

- **Core:** [React](https://reactjs.org/) (Hooks, Custom Components)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + PostCSS
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Scrolling:** [Lenis](https://github.com/studio-freight/lenis)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** GitHub Pages

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/resume-web.git
    cd resume-web
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

---

## 📜 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with HMR. |
| `npm run build` | Builds the app for production to the `dist` folder. |
| `npm run preview` | Locally preview the production build. |
| `npm run lint` | Runs ESLint to check for code quality issues. |
| `npm run deploy` | Deploys the `dist` folder to GitHub Pages. |

---

## 🎨 Customization

### Updating Content
Navigate to `src/App.jsx` (or respective component files) to update the text, project details, and experience data. The data is structured in constants for easy modification.

### Changing the Theme
The color palette is defined in the configuration section of `src/App.jsx` or `tailwind.config.js`. Modify the `PALETTE` and `DARK_PALETTE` objects to match your personal brand colors.

```javascript
const PALETTE = {
  blue: '#AEE2FF', // Your primary color
  pink: '#FFB7D5', // Your accent color
  // ...
};
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/resume-web/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


<div align="center">

### Made with ❤️ by Kutraleeswaran

[![GitHub](https://img.shields.io/badge/GitHub-Profile-black?style=for-the-badge&logo=github)](https://github.com/kutraleeswaran)
