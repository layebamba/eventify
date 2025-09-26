import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({
                                   children,
                                   user = null,
                                   // Props pour la recherche
                                   events = [],
                                   setFilteredEvents,
                                   onSearchReset,
                                   showSearch = false
                               }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header
                user={user}
                showSearch={showSearch}
                events={events}
                setFilteredEvents={setFilteredEvents}
                onSearchReset={onSearchReset}
            />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}