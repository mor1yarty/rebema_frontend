'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import UserProfileModal from '../components/UserProfileModal';
import './ranking.css';

export default function Ranking() {
  const [rankingData, setRankingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    // API からランキングデータを取得する
    const fetchRankingData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/ranking/ranking/level?limit=20`);
        
        if (!response.ok) {
          throw new Error('ランキングデータの取得に失敗しました');
        }
        
        const data = await response.json();
        setRankingData(data);
        setIsLoading(false);
        
        // ランキングデータ取得後にURLからユーザーIDを確認
        checkUrlForUserProfile();
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        console.error('ランキングデータ取得エラー:', err);
      }
    };

    fetchRankingData();
  }, []);
  
  // URLからユーザーIDを取得してモーダルを表示
  const checkUrlForUserProfile = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#user=')) {
        const userId = hash.substring(6); // '#user='の長さは6
        if (userId && !isNaN(userId)) {
          handleUserClick(parseInt(userId, 10));
        }
      }
    }
  };

  // 順位に応じたCSSクラスを取得する関数
  const getRankingClass = (index) => {
    if (index === 0) return 'first';
    if (index === 1) return 'second';
    if (index === 2) return 'third';
    return '';
  };

  // ユーザーがクリックされた時の処理
  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    setIsProfileModalOpen(true);
  };

  // プロファイルモーダルを閉じる処理
  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const userData = {
    name: '中村千佳',
    department: 'デジタルマーケティング部',
    level: 34
  };
  
  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="page-container">
        <Sidebar userData={userData} />
        <Header />
        <div className="main-content">
          <div className="loading">ランキングデータを読み込み中...</div>
        </div>
      </div>
    );
  }

  // エラー時の表示
  if (error) {
    return (
      <div className="page-container">
        <Sidebar userData={userData} />
        <Header />
        <div className="main-content">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  // データが空の場合の表示
  if (rankingData.length === 0) {
    return (
      <div className="page-container">
        <Sidebar userData={userData} />
        <Header />
        <div className="main-content">
          <div className="no-data">ランキングデータがありません</div>
        </div>
      </div>
    );
  }

  // Get the top ranking user (1st position)
  const topUser = rankingData[0];
  
  // Get the remaining users (2nd position and below)
  const otherUsers = rankingData.slice(1);
    
  return (
    <div className="page-container">
      {/* サイドバー */}
      <Sidebar userData={userData} />
      
      {/* モバイル用ヘッダー */}
      <Header />
      
      {/* メインコンテンツ */}
      <div className="main-content">
        <div className="rankings-list">
          {/* 1位のユーザー(特別デザイン) */}
          <div 
            className="top-ranking-card"
            onClick={() => handleUserClick(topUser.id)}
          >
            <div className={`ranking-position ${getRankingClass(0)}`}>{topUser.position}</div>
            
            <div className="ranking-avatar-container">
              <div className="ranking-avatar" />
            </div>
            
            <div className="top-user-info">
              <div className="top-user-name">{topUser.name}</div>
              <div className="top-user-department">{topUser.department}</div>
            </div>
            
            <div className="top-user-level">Lv.{topUser.level}</div>
          </div>
          
          {/* 2位以下のユーザー */}
          {otherUsers.map((user, index) => (
            <div 
              key={user.id} 
              className="ranking-item"
              onClick={() => handleUserClick(user.id)}
            >
              <div className={`ranking-position ${getRankingClass(index + 1)}`}>{user.position}</div>
              
              <div className="ranking-avatar-container">
                <div className="ranking-avatar" />
              </div>
              
              <div className="ranking-user-info">
                <div className="ranking-user-name">{user.name}</div>
                <div className="ranking-user-department">{user.department}</div>
              </div>
              
              <div className="ranking-user-level">Lv.{user.level}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ユーザープロファイルモーダル */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
        userId={selectedUserId}
      />
    </div>
  );
}
