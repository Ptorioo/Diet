'use client';
import PreferenceSelector from '@/components/preferences/PreferenceSelector';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export interface RestaurantPreference {
  id: string;
  label_name: string;
}

export default function SelectPreferencesPage() {
  const [timer, setTimer] = useState(10);
  const [timerActive, setTimerActive] = useState(true);
  const [selectedPreferenceId, setSelectedPreferenceId] = useState<string | null>(null);
  const [labels, setLabels] = useState<RestaurantPreference[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Fetch labels from API
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
        const res = await fetch(`${apiUrl}/api/labels`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch labels');
        const data = await res.json();
        setLabels(data);
      } catch (error) {
        console.error('Error fetching labels:', error);
        setLabels([]); // fallback to empty array
      }
    };
    fetchLabels();
  }, []);

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
    if (timer === 0 && labels.length > 0) {
      let preferenceName: string;
      if (selectedPreferenceId) {
        const selectedPreference = labels.find(p => p.id === selectedPreferenceId);
        preferenceName = selectedPreference ? selectedPreference.label_name : '';
      } else {
        const randomIndex = Math.floor(Math.random() * labels.length);
        preferenceName = labels[randomIndex].label_name;
      }
      router.push(`/results?preference=${encodeURIComponent(preferenceName.toLowerCase())}`);
    }
  }, [timer, router, selectedPreferenceId, labels]);

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
              style={{ transition: 'stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1)' }}
            />
            <text x={radius} y={radius} textAnchor="middle" dominantBaseline="central" fontSize="20" fill="#333">{timer}</text>
          </svg>
        </div>
      )}
      <PreferenceSelector
        selectedPreferenceId={selectedPreferenceId}
        setSelectedPreferenceId={setSelectedPreferenceId}
        labels={labels}
      />
    </>
  );
}