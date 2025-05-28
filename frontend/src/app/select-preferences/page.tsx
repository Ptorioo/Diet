'use client';
import PreferenceSelector from '@/components/preferences/PreferenceSelector';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { mockDietaryRestrictions } from '@/lib/mockData'; // Assuming mockDietaryRestrictions is used here



export default function SelectPreferencesPage() {
  const initialTime = 10;
  const [timer, setTimer] = useState(initialTime); // Start the timer at 30 seconds
  const [timerActive, setTimerActive] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
  if (!timerActive) return;
  
  intervalRef.current = setInterval(() => {
    setTimer((prevTimer) => {
      if (prevTimer <= 1) {
        clearInterval(intervalRef.current!);
        setTimerActive(false);
        // Randomly select a preference and navigate
        const randomIndex = Math.floor(Math.random() * mockDietaryRestrictions.length);
        const randomPreference = mockDietaryRestrictions[randomIndex].value;
 
        router.push(`/results?preference=${randomPreference}`);
        return 0;
      }
      return prevTimer - 1;
    });
  }, 1000);
    
  return () => clearInterval(intervalRef.current!);
  }, [timerActive, router]); // Added router to dependency array

  const radius = 50; // Radius of the circle
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (timer / initialTime) * circumference;
  return (<>{timerActive && ( // Only show timer if active
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <circle
          cx={radius} cy={radius} r={radius - 5} // Slightly smaller radius for the stroke
          fill="none"
          stroke="#e0e0e0" // Background circle color
          strokeWidth="10">
        </circle>
        <circle
          cx={radius}
          cy={radius}
          r={radius - 5} // Match the background circle radius
          fill="none"
          stroke="#007bff" // Progress circle color
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius} ${radius})`}>
          </circle>
        <text x={radius} y={radius} textAnchor="middle" dominantBaseline="central" fontSize="20" fill="#333">{timer}</text>
      </svg>
    </div>
  )}
  <PreferenceSelector /></>
  );
}
