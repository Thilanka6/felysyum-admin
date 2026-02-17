"use client";

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        // Determine if mobile or desktop based on window width
        if (window.innerWidth < 768) {
            setSidebarOpen(!isSidebarOpen);
        } else {
            setSidebarCollapsed(!isSidebarCollapsed);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                isOpen={isSidebarOpen}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setSidebarCollapsed}
                onCloseMobile={() => setSidebarOpen(false)}
            />

            <div className="flex flex-1 flex-col overflow-hidden">
                <Header onToggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
