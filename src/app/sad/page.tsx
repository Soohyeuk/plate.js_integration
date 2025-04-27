'use client';

import SharedEditor from '@/components/shared/SharedEditor';

export default function SadPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-200 via-indigo-200 to-blue-400 animate-gradient-xy">
            <div className="container mx-auto px-4 py-24">
                <SharedEditor 
                    storageKey="sadContent"
                    placeholder="Type your sad thoughts here..."
                />
            </div>
        </main>
    );
} 