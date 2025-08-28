'use client';

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNext = async () => {
    if (!phone.trim()) {
      setErrorMessage('Vui lòng nhập số điện thoại');
      return;
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(phone)) {
      setErrorMessage('Số điện thoại không hợp lệ');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/instructor/check-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('instructorPhone', phone);
        router.push('/instructor/verification');
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Lỗi kết nối. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 bg-gray-100">
      <main className="flex flex-col gap-[20px] row-start-2 bg-white p-10 rounded-lg shadow-lg w-100">
        <button onClick={() => router.back()} className="cursor-pointer hover:text-blue-500 self-start flex items-center">
          <span className=""><FontAwesomeIcon icon={faArrowLeft} /></span>
          <span className="ml-2">Back</span>
        </button>
        <div>
            <h1 className="text-4xl font-bold text-center">
                Sign In
            </h1>
            <p className="text-center text-gray-400">Please enter your phone to sign in</p>
        </div>
        <div>
            <input 
              type="text" 
              placeholder="Your Phone number" 
              className={`border p-2 rounded-md w-full ${
                errorMessage ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={phone}
              onChange={handlePhoneChange}
              disabled={isLoading}
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
        </div>
        <div>
            <button 
              className={`py-2 px-4 rounded-lg w-full text-white ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? 'Đang kiểm tra...' : 'Next'}
            </button>
            <p className="text-center text-gray-500 mt-5">Passwordless authentication method</p>
        </div>
        <div>
            <p>Don't have an account? <a href="#" className="text-blue-500">Sign up</a></p>
        </div>
      </main>
    </div>
  );
}
