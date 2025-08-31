'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 bg-gray-100">
      <main className="flex flex-col gap-[32px] row-start-2 items-center bg-white p-10 rounded-lg shadow-lg w-130">
        <h1 className="text-3xl font-bold text-center">
          Welcome to the Classroom Management App!
        </h1>
        <p>
          Please choose your role to continue:
        </p>
        <div className="flex flex-col gap-4">
          <button 
            className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg w-100 hover:bg-blue-600"
            onClick={() => router.push('/instructor/login')}
          >
            Instructor
          </button>
          <button 
            className="cursor-pointer bg-green-500 text-white py-2 px-4 rounded-lg w-100 hover:bg-green-600"
            onClick={() => router.push('/student/login')}
          >
            Student
          </button>
        </div>
      </main>
    </div>
  );
}
