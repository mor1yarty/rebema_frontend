'use client';

import { useState, useEffect } from 'react';
import './ranking.css';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for rankings
const rankingData = [
  { 
    id: 1, 
    position: '1st', 
    name: '中村千佳', 
    department: 'デジマ', 
    level: 34, 
    avatar: '/avatar1.jpg' 
  },
  { 
    id: 2, 
    position: '2nd', 
    name: '山口悠真', 
    department: 'マーケティング', 
    level: 31, 
    avatar: '/avatar2.jpg' 
  },
  { 
    id: 3, 
    position: '3rd', 
    name: '川谷陸', 
    department: 'エンジニア', 
    level: 27, 
    avatar: '/avatar3.jpg' 
  },
  { 
    id: 4, 
    position: '4th', 
    name: '田中一郎', 
    department: 'デザイン', 
    level: 24, 
    avatar: '/avatar4.jpg' 
  },
  { 
    id: 5, 
    position: '5th', 
    name: '佐藤健太', 
    department: 'マーケティング', 
    level: 23, 
    avatar: '/avatar5.jpg' 
  },
];

export default function Ranking() {
  // Get the top ranking user (1st position)
  const topUser = rankingData[0];
  
  // Get the remaining users (2nd position and below)
  const otherUsers = rankingData.slice(1);

  return (
    <div className="ranking-container">
      {/* サイドバー */}
      <div className="sidebar">
        {/* ロゴ */}
        <div className="sidebar-logo">
          <div className="logo-badge">
            <span style={{ color: 'white', fontSize: '20px' }}>🔥</span>
          </div>
          <span className="logo-text">Rebema</span>
        </div>
        
        {/* タブメニュー */}
        <div className="tabs">
          <Link href="/mypage" className="tab">
            <span style={{ fontSize: '20px' }}>👤</span>
            マイページ
          </Link>
          <Link href="/knowledge" className="tab">
            <span style={{ fontSize: '20px' }}>📚</span>
            ナレッジ一覧
          </Link>
          <Link href="/ranking" className="tab active">
            <span style={{ fontSize: '20px', color: '#1F47F7' }}>📊</span>
            リーダーボード
          </Link>
        </div>
        
        {/* プロフィール情報 */}
        <div className="profile-section">
          <div className="profile-card">
            <div className="profile-avatar" />
            <div className="profile-info">
              <div className="profile-name-section">
                <span className="profile-name">中村千佳</span>
                <span className="level-badge">Lv.34</span>
              </div>
              <span className="profile-department">デジタルマーケティング部</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="main-content">
        <div className="rankings-list">
          {/* 1位のユーザー(特別デザイン) */}
          <div className="top-ranking-card">
            <div className="ranking-position">{topUser.position}</div>
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
          {otherUsers.map(user => (
            <div key={user.id} className="ranking-item">
              <div className="ranking-position">{user.position}</div>
              <div className="ranking-avatar-container">
                <div className="ranking-avatar" style={{ backgroundColor: user.id === 2 ? '#f0f0f0' : user.id === 3 ? '#e0e0e0' : '#d9d9d9' }} />
              </div>
              <div className="ranking-user-name">{user.name}</div>
              <div className="top-user-department">{user.department}</div>
              <div className="ranking-user-level">Lv.{user.level}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
