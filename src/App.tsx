// App.tsx (փոփոխված հատված)
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import TownhousesPage from "./pages/Townhouses";
import Footer from "./components/Footer";
import SkyBubblesBg from "./components/SkyBubblesBg";
import ApartmentsPage from "./pages/Apartments";
import DecisionsPage from "./pages/Decisions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { initCsrf } from "./lib/api";
export default function App() {
    const { i18n } = useTranslation();
    useEffect(() => {
        initCsrf(); // preload cookie
    }, []);
    return (
        <HelmetProvider>
            <BrowserRouter>
                <div className="min-h-screen overflow-x-hidden flex flex-col">
                    <SkyBubblesBg palette="slate" global />
                    <Header />
                    <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
                        <Routes key={i18n.language}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/townhouses" element={<TownhousesPage />} />
                            <Route path="/apartments" element={<ApartmentsPage />} />
                            <Route path="/voroshumner" element={<DecisionsPage />} />
                        </Routes>
                    </main>
                    <Footer />
                    <ToastContainer position="top-right" autoClose={3000} />
                </div>
            </BrowserRouter>
        </HelmetProvider>
    );
}
