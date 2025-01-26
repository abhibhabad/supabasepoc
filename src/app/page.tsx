"use client";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const redirectToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-sans px-4">
      <header className="sticky top-0 inset-x-0 bg-black text-white p-4 w-full flex justify-between items-center shadow-md">
        <img src="/logo.svg" alt="Logo" className="h-8" />
        <h1 className="text-xl font-bold">Developer Hub</h1>
      </header>
      <main className="mt-8 space-y-8">
        <h1 className="text-3xl font-extrabold mb-4">Welcome to Developer Hub</h1>
        <p className="text-lg font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce auctor diam vitae ligula efficitur, vel tincidunt nisi consectetur.</p>
        <p className="text-lg font-light">Aenean vestibulum lectus vitae sapien placerat fermentum. Duis efficitur, mauris nec vulputate varius, ex odio scelerisque lorem, vel dignissim erat odio ut ligula.</p>
        <button
          onClick={redirectToLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Go to Login
        </button>
      </main>
    </div>
  );
}