"use client";

import { useState } from "react";
import Image from "next/image";

interface Activity {
  title: string;
  description: string;
  time: string[];
  location: string[];
  categories: string[];
}

const activities: Activity[] = [
  {
    title: "근처 공원에서 피크닉",
    description: "날씨가 좋은 날, 가까운 공원에서 도시락을 즐겨보세요.",
    time: ["오전", "오후"],
    location: ["실외"],
    categories: ["자연/힐링", "맛집탐방"]
  },
  {
    title: "지역 미술관 방문",
    description: "현재 진행 중인 특별전시를 관람하며 문화생활을 즐겨보세요.",
    time: ["오전", "오후", "저녁"],
    location: ["실내"],
    categories: ["문화/예술"]
  },
  {
    title: "요가 클래스",
    description: "전문 강사와 함께하는 요가로 심신의 안정을 찾아보세요.",
    time: ["오전", "저녁"],
    location: ["실내"],
    categories: ["운동", "자연/힐링"]
  },
  {
    title: "쇼핑몰 나들이",
    description: "최신 트렌드를 구경하고 원하는 아이템을 찾아보세요.",
    time: ["오후", "저녁"],
    location: ["실내"],
    categories: ["쇼핑"]
  }
];

export default function Home() {
  const [time, setTime] = useState<string>("오후");
  const [location, setLocation] = useState<string>("상관없음");
  const [categories, setCategories] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Activity[]>([]);

  const handleCategoryChange = (category: string) => {
    setCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getRecommendations = () => {
    const filtered = activities.filter(activity => {
      const timeMatch = activity.time.includes(time);
      const locationMatch = location === "상관없음" || activity.location.includes(location);
      const categoryMatch = categories.length === 0 || 
        categories.some(cat => activity.categories.includes(cat));
      
      return timeMatch && locationMatch && categoryMatch;
    });

    setRecommendations(filtered);
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
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              onClick={getRecommendations}
            >
              활동 추천받기
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            추천 활동
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.length > 0 ? (
              recommendations.map((activity, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2">{activity.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 col-span-2 text-center">
                선호도를 선택하고 추천받기 버튼을 눌러주세요!
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
