'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TinderCard from 'react-tinder-card';

export default function SelectPreferencesDemoPage() {
  const router = useRouter();
  const childRef = useRef<React.RefObject<any>>(React.createRef());
  const [hasSwiped, setHasSwiped] = useState(false);

  const handleSwipe = (direction: string) => {
    if (hasSwiped) return;

    setHasSwiped(true);
    setTimeout(() => {
      router.push('/select-preferences');
    }, 500); // short delay for swipe animation
  };

  const swipe = async (dir: 'left' | 'right') => {
    if (!childRef.current?.current) return;
    await childRef.current.current.swipe(dir);
  };

  return (
    <div className="overflow-hidden">
      <h1 className="text-3xl font-bold text-center mb-8 text-foreground sm:text-4xl">
        🍽️ 怎麼選餐廳？
      </h1>

      <div className="flex justify-center">
        <ul className="text-base sm:text-lg text-foreground mb-6 space-y-2 list-none max-w-md mx-auto">
          <li className="text-left">
            ☝️ 滑動卡片，向右滑表示想吃，向左則表示不要
          </li>
          <li className="text-left">
            🔘 也可以使用下方按鈕進行操作
          </li>
          <li className="text-left">
            ⏰ 必須在<b className="text-primary font-semibold">三秒內</b>決定，來不及則會<b className="text-primary font-semibold">自動左滑</b>
          </li>
          <li className="text-left">
            🚩 滑動下方卡片，開始選餐廳！
          </li>
        </ul>
      </div>

      <div
        style={{
          position: 'relative',
          width: '300px',
          height: '200px',
          margin: '0 auto',
        }}
      >
        <TinderCard
          ref={childRef.current}
          onSwipe={handleSwipe}
          preventSwipe={['up', 'down']}
          swipeRequirementType="velocity"
          swipeThreshold={0.4}
        >
          <div
            style={{
              position: 'absolute',
              width: '300px',
              height: '200px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 8px 17px rgba(0,0,0,0.2)',
            }}
          >
            範例餐廳種類
          </div>
        </TinderCard>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
        <button
          onClick={() => swipe('left')}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
          }}
        >
          ㄜ 不要 😑
        </button>
        <button
          onClick={() => swipe('right')}
          style={{
            backgroundColor: '#4caf50',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
          }}
        >
          吃 都吃 😋
        </button>
      </div>
    </div>
  );
}
