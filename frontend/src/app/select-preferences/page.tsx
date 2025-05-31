'use client';

import React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import TinderCard from 'react-tinder-card';
import type { RestaurantPreference } from '@/lib/types';

export default function SelectPreferencesPage() {
  const [labels, setLabels] = useState<RestaurantPreference[]>([]);
  const [timer, setTimer] = useState(3);
  const [timerActive, setTimerActive] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(-1); // starts at -1 until data loaded
  const [swipeInProgress, setSwipeInProgress] = useState(false);
  const selectedPreferencesRef = useRef<string[]>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const currentIndexRef = useRef(currentIndex);
  const childRefs = useRef<React.RefObject<any>[]>([]);

  // Fetch labels
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
        const res = await fetch(`${apiUrl}/api/labels`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch labels');
        const data = await res.json();

        // shuffle data
        for (let i = data.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [data[i], data[j]] = [data[j], data[i]];
        }

        setLabels(data);
        setCurrentIndex(data.length - 1);
        currentIndexRef.current = data.length - 1;
        childRefs.current = Array(data.length).fill(0).map(() => React.createRef());
      } catch (err) {
        console.error('Error fetching labels:', err);
        setLabels([]);
      }
    };
    fetchLabels();
  }, []);

  // Timer logic
  useEffect(() => {
    if (!timerActive || currentIndex < 0) return;

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [timerActive, currentIndex]);

  useEffect(() => {
    if (timer === 0 && timerActive === false && currentIndex >= 0) {
      handleTimeoutSwipe();
    }
  }, [timer, timerActive, currentIndex]);

  const handleTimeoutSwipe = async () => {
    if (!swipeInProgress && currentIndex >= 0) {
      setSwipeInProgress(true);
      await childRefs.current[currentIndex]?.current?.swipe('left');
    }
  };

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const handleSwipe = (direction: string, index: number) => {
    if (direction === 'right') {
      const selected = labels[index];
      selectedPreferencesRef.current.push(selected.id);
      console.log(selectedPreferencesRef.current.join(','));
    }

    const newIndex = index - 1;
    if (newIndex >= 0) {
      updateCurrentIndex(newIndex);
      resetTimer();
    } else {
      // No more cards
      if (selectedPreferencesRef.current.length === 0) {
        // Pick a random preference if none were selected
        const randomIndex = Math.floor(Math.random() * labels.length);
        const randomPreference = labels[randomIndex];
        router.push(`/results?preference=${encodeURIComponent(randomPreference.id)}`);
      } else {
        // Navigate with selected preferences
        const query = selectedPreferencesRef.current.join(',');
        router.push(`/results?preference=${encodeURIComponent(query)}`);
      }
    }

    setSwipeInProgress(false);
  };

  const resetTimer = () => {
    setTimer(3);
    setTimerActive(true);
  };

  const swipe = async (dir: 'left' | 'right') => {
    if (swipeInProgress || currentIndex < 0 || !childRefs.current[currentIndex]) return;
    setSwipeInProgress(true);
    await childRefs.current[currentIndex].current.swipe(dir);
  };

  const canSwipe = currentIndex >= 0;

  const memoizedCards = useMemo(() => {
    return labels.map((label, index) => (
      <TinderCard
        key={label.id}
        ref={childRefs.current[index]}
        onSwipe={(dir) => handleSwipe(dir, index)}
        preventSwipe={['up', 'down']}
        swipeRequirementType={"velocity"}
        swipeThreshold={0.4}
      >
        <div
          style={{
            position: 'absolute',
            width: '300px',
            height: '200px',
            backgroundColor: '#f7f7f7',
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 17px rgba(0,0,0,0.2)',
            top: 0,
            left: 0,
            zIndex: labels.length - index,
            cursor: 'grab',
          }}
        >
          {label.label_name}
        </div>
      </TinderCard>
    ));
  }, [labels]);

  const initialTime = 3.4;
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

      <div
        className="cardContainer"
        style={{
          position: 'relative',
          width: '300px',
          height: '220px',
          margin: '30px auto',
        }}
      >
        {memoizedCards}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
        <button
          onClick={() => swipe('left')}
          disabled={!canSwipe || swipeInProgress}
          style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 20px', borderRadius: '5px' }}
        >
          ㄜ 不要 😑
        </button>
        <button
          onClick={() => swipe('right')}
          disabled={!canSwipe || swipeInProgress}
          style={{ backgroundColor: '#4caf50', color: 'white', padding: '10px 20px', borderRadius: '5px' }}
        >
          吃 都吃 😋
        </button>
      </div>
    </>
  );
}
