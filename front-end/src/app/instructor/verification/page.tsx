'use client';

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 bg-gray-100">
      <main className="flex flex-col gap-[20px] row-start-2 bg-white p-10 rounded-lg shadow-lg w-100">
        <div onClick={() => router.back()}>
          <span className="m-auto p-auto"><FontAwesomeIcon icon={faArrowLeft} /></span>
          <span className="ml-2">Back</span>
        </div>
        <div>
            <h1 className="text-3xl font-bold text-center">
                Phone Verification
            </h1>
            <p className="text-center text-gray-400">Please enter your code that send to your phone</p>
        </div>
        <div>
            <input type="text" placeholder="Enter your code" className="border border-gray-300 p-2 rounded-md w-full" />
        </div>
        <div>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600">Submit</button>
        </div>
        <div>
            <p>Code not received? <a href="#" className="text-blue-500">Send again</a></p>
        </div>
      </main>
    </div>
  );
}
