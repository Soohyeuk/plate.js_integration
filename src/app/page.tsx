import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8 text-center">How are you feeling today?</h1>
      <div className="flex gap-4">
        <Link 
          href="/happy" 
          className="btn-yellow"
        >
          Happy 😊
        </Link>
        <Link 
          href="/sad" 
          className="btn-blue"
        >
          Sad 😢
        </Link>
      </div>
    </main>
  );
}
