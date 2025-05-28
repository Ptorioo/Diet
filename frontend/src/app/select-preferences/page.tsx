'use client';
import PreferenceSelector from '@/components/preferences/PreferenceSelector';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RESTAURANT_TYPES } from '@/lib/mockData';

export default function SelectPreferencesPage() {
  const [timer, setTimer] = useState(10);
  const [timerActive, setTimerActive] = useState(true);
  const [selectedPreferenceId, setSelectedPreferenceId] = useState<string | null>(null); // <-- lifted state
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!timerActive) return;

    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(intervalRef.current!);
          setTimerActive(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [timerActive]);

  // This effect handles navigation when timer reaches 0
  useEffect(() => {
    if (timer === 0) {
      let preferenceName: string;
      if (selectedPreferenceId) {
        const selectedPreference = RESTAURANT_TYPES.find(p => p.id === selectedPreferenceId);
        preferenceName = selectedPreference ? selectedPreference.name : '';
      } else {
        const randomIndex = Math.floor(Math.random() * RESTAURANT_TYPES.length);
        preferenceName = RESTAURANT_TYPES[randomIndex].name;
      }
      router.push(`/results?preference=${encodeURIComponent(preferenceName.toLowerCase())}`);
    }
  }, [timer, router, selectedPreferenceId]);

  const initialTime = 11;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (timer / initialTime) * circumference;

  return (
    <>
      {timerActive && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
            <circle
              cx={radius} cy={radius} r={radius - 5}
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="10"
            />
            <circle
              cx={radius}
              cy={radius}
              r={radius - 5}
              fill="none"
              stroke="#007bff"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${radius} ${radius})`}
            />
            <text x={radius} y={radius} textAnchor="middle" dominantBaseline="central" fontSize="20" fill="#333">{timer}</text>
          </svg>
        </div>
      )}
      <PreferenceSelector
        selectedPreferenceId={selectedPreferenceId}
        setSelectedPreferenceId={setSelectedPreferenceId}
      />
    </>
  );
}