"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const router = useRouter();

  const handleSendOtp = () => {
    console.log(`Simulating OTP send for phone number: ${phone}`);
    alert('OTP sent! Use code 12345 for verification.');
    setIsOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otp === '12345') {
      alert('OTP verified successfully!');
      router.push('/dashboard');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-sans px-4">
      <header className="sticky top-0 inset-x-0 bg-black text-white p-4 w-full flex justify-between items-center shadow-md">
        <img src="/logo.svg" alt="Logo" className="h-8" />
        <h1 className="text-xl font-bold">Login</h1>
      </header>
      {!isOtpSent ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring bg-black text-white font-light"
          />
          <button
            onClick={handleSendOtp}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send OTP
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring bg-black text-white font-light"
          />
          <button
            onClick={handleVerifyOtp}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Verify OTP
          </button>
        </div>
      )}
    </div>
  );
}