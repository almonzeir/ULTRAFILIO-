'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const messages = [
  'Analyzing your CV...',
  'Extracting experience and skills...',
  'Applying your selected template...',
  'Generating responsive layout...',
  'Almost ready...',
];

export default function AIBuildingPage() {
  const router = useRouter();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    // Simulate AI building message progression
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prevIndex => {
        if (prevIndex < messages.length - 1) {
          return prevIndex + 1;
        }
        return prevIndex;
      });
    }, 1200);

    // Redirect after all messages have been shown
    const redirectTimer = setTimeout(() => {
      router.push('/portfolio'); // Redirect to user’s final site
    }, 6000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white font-inter">
      <div className="animate-spin mb-8 border-4 border-t-transparent border-white rounded-full w-16 h-16"></div>
      <h1 className="text-3xl font-bold mb-6">Building your portfolio...</h1>
      <div className="text-center space-y-2 opacity-80" style={{ height: '120px' }}>
        {messages.map((msg, i) => (
          <p
            key={i}
            className={`text-sm transition-opacity duration-500 ${
              i <= currentMessageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {msg}
          </p>
        ))}
      </div>
    </main>
  );
}
