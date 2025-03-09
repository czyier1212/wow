"use client";

import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 설정
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Activity {
  id: string;
  title: string;
  description: string;
  time: string[];
  location: string[];
  categories: string[];
}

export default function Home() {
  const [time, setTime] = useState<string>("오후");
  const [location, setLocation] = useState<string>("상관없음");
  const [categories, setCategories] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategoryChange = (category: string) => {
    setCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let query = supabase
        .from('activities')
        .select('*');

      // 시간 필터
      query = query.contains('time', [time]);

      // 장소 필터
      if (location !== "상관없음") {
        query = query.contains('location', [location]);
      }

      // 카테고리 필터
      if (categories.length > 0) {
        query = query.overlaps('categories', categories);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setRecommendations(data || []);
    } catch (err) {
      setError('활동을 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">
          오늘 뭐하지? 🎉
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            나의 선호도 선택하기
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                시간대
              </label>
              <select 
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option>오전</option>
                <option>오후</option>
                <option>저녁</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                장소
              </label>
              <select 
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option>실내</option>
                <option>실외</option>
                <option>상관없음</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                취미 유형
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {["운동", "문화/예술", "맛집탐방", "자연/힐링", "쇼핑"].map((category) => (
                  <label key={category} className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      className="rounded"
                      checked={categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              onClick={getRecommendations}
              disabled={isLoading}
            >
              {isLoading ? '검색 중...' : '활동 추천받기'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            추천 활동
          </h2>
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendations.length > 0 ? (
                recommendations.map((activity) => (
                  <div key={activity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold mb-2">{activity.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400 col-span-2 text-center">
                  {isLoading ? '검색 중...' : '선호도를 선택하고 추천받기 버튼을 눌러주세요!'}
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
