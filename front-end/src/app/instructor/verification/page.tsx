'use client';

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    // Get phone from localStorage
    const storedPhone = localStorage.getItem('instructorPhone');
    if (!storedPhone) {
      router.push('/instructor/login');
      return;
    }
    setPhone(storedPhone);

    // Start countdown for resend button
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleSubmit = async () => {
    if (!verificationCode.trim()) {
      setErrorMessage('Vui lòng nhập mã xác thực');
      return;
    }

    if (verificationCode.length !== 6) {
      setErrorMessage('Mã xác thực phải có 6 chữ số');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/instructor/validate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: phone,
          accessCode: verificationCode 
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store JWT token
        localStorage.setItem('instructorToken', data.token);
        localStorage.setItem('instructorData', JSON.stringify(data.instructor));
        
        // Clear phone from localStorage as it's no longer needed
        localStorage.removeItem('instructorPhone');
        
        // Redirect to dashboard
        router.push('/instructor/manageStudents');
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

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setErrorMessage('');
    setCanResend(false);
    setCountdown(60);

    try {
      const response = await fetch('http://localhost:8000/api/instructor/check-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (data.success) {
        // Start countdown again
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setErrorMessage(data.message);
        setCanResend(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Lỗi kết nối. Vui lòng thử lại sau.');
      setCanResend(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only allow digits, max 6
    setVerificationCode(value);
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
            <h1 className="text-3xl font-bold text-center">
                Phone Verification
            </h1>
            <p className="text-center text-gray-400">Please enter your code that send to your phone</p>
            {phone && (
              <p className="text-center text-gray-500 mt-2 text-sm">
                Sent to: {phone.replace(/(\d{4})\d{3}(\d{3})/, '$1***$2')}
              </p>
            )}
        </div>
        <div>
            <input 
              type="text" 
              placeholder="Enter your code" 
              className={`border p-2 rounded-md w-full text-center text-lg tracking-widest ${
                errorMessage ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={verificationCode}
              onChange={handleCodeChange}
              disabled={isLoading}
              maxLength={6}
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
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Đang xác thực...' : 'Submit'}
            </button>
        </div>
        <div>
            <p className="text-center">
              Code not received?{' '}
              {canResend ? (
                <button 
                  onClick={handleResendCode}
                  className="text-blue-500 hover:text-blue-600 underline"
                  disabled={isLoading}
                >
                  Send again
                </button>
              ) : (
                <span className="text-gray-400">
                  Send again ({countdown}s)
                </span>
              )}
            </p>
        </div>
      </main>
    </div>
  );
}
