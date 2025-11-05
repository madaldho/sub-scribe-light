import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme before React hydration to prevent flash
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.classList.remove('dark', 'light');
document.documentElement.classList.add(savedTheme as string);

createRoot(document.getElementById("root")!).render(<App />);
