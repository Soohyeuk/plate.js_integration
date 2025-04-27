'use client';

import SharedEditor from '@/components/shared/SharedEditor';

export default function HappyPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-yellow-300 via-amber-200 via-orange-200 to-yellow-400 animate-gradient-xy">
            <div className="container mx-auto px-4 py-24">
                <SharedEditor 
                    storageKey="happyContent"
                    placeholder="Type your happy thoughts here..."
                />
            </div>
        </main>
    );
} 