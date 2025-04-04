'use client';

import { useState } from 'react';
import './knowledge.css';
import Link from 'next/link';

// Mock data for knowledge entries (using the data from the design)
const knowledgeData = [
  { 
    id: 1, 
    title: '電気・ガスのセット契約の促進', 
    category: 'メール',
    icon: '💡',
    iconBgColor: '#FFFBD6',
    author: '佐伯 えり',
    views: 46
  },
  { 
    id: 2, 
    title: 'サブスク型の家電レンタル訴求', 
    category: 'メール',
    icon: '🏡️',
    iconBgColor: '#F1FFCA',
    author: '佐伯 えり',
    views: 46
  },
  { 
    id: 3, 
    title: '点検・保守サービスのリマインド', 
    category: 'メール',
    icon: '👷',
    iconBgColor: '#E0D6FF',
    author: '佐伯 えり',
    views: 46
  },
];

// Mock user data
const userData = {
  name: '中村千佳',
  department: 'デジタルマーケティング部',
  level: 34
};

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter knowledge items based on search query
  const filteredKnowledge = searchQuery
    ? knowledgeData.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : knowledgeData;
  
  return (
    <div className="knowledge-container">
      {/* サイドバー */}
      <div className="sidebar">
        {/* ロゴ */}
        <div className="sidebar-logo">
          <div className="logo-badge">
            <span className="logo-icon">🔥</span>
          </div>
          <span className="logo-text">Rebema</span>
        </div>
        
        {/* タブメニュー */}
        <div className="tabs">
          <Link href="/mypage" className="tab">
            <span style={{ fontSize: '20px' }}>👤</span>
            マイページ
          </Link>
          <Link href="/knowledge" className="tab active">
            <span style={{ fontSize: '20px' }}>📚</span>
            ナレッジ一覧
          </Link>
          <Link href="/ranking" className="tab">
            <span style={{ fontSize: '20px' }}>📊</span>
            リーダーボード
          </Link>
        </div>
        
        {/* プロフィール情報 */}
        <div className="profile-section">
          <div className="profile-card">
            <div className="profile-avatar" />
            <div className="profile-info">
              <div className="profile-name-section">
                <span className="profile-name">{userData.name}</span>
                <span className="level-badge">Lv.{userData.level}</span>
              </div>
              <span className="profile-department">{userData.department}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="main-content">
        {/* 検索バー */}
        <div className="search-section">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="ナレッジを検索" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* ナレッジセクション */}
        <div className="knowledge-section">
          <div className="knowledge-header">
            <h2 className="knowledge-title">PV数が高いナレッジ 👏</h2>
          </div>
          
          <div className="knowledge-list">
            <div className="knowledge-items">
              {filteredKnowledge.map((item) => (
                <div key={item.id} className="knowledge-item">
                  <div className="knowledge-icon" style={{ backgroundColor: item.iconBgColor }}>
                    <span>{item.icon}</span>
                  </div>
                  
                  <div className="knowledge-content">
                    <div className="knowledge-title-text">{item.title}</div>
                    <div className="knowledge-category">
                      <span className="category-label">配信手法</span>
                      <div className="category-badge">
                        <span className="category-icon">✉️</span>
                        <span>{item.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="knowledge-meta">
                    <div className="knowledge-author">
                      <div className="author-avatar"></div>
                      <span className="author-name">{item.author}</span>
                    </div>
                    <div className="knowledge-views">
                      <span className="views-icon">👁️</span>
                      <span className="views-count">{item.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
