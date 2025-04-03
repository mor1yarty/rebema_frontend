'use client';

import { useState } from 'react';
import './mypage.css';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for knowledge entries
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
  level: 34,
  nextLevelExp: 4500,
  knowledgeCount: 43,
  totalPageViews: 343,
  avatar: '/avatar1.jpg'
};

export default function MyPage() {
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // Function to open modal with content
  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className="mypage-container">
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
          <Link href="/mypage" className="tab active">
            <span style={{ fontSize: '20px' }}>👤</span>
            マイページ
          </Link>
          <Link href="/knowledge" className="tab">
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
        {/* ユーザー情報カード */}
        <div className="user-info-card">
          <div className="user-avatar-section">
            <div className="user-avatar" />
            <div className="user-name">{userData.name}</div>
          </div>
          
          <div className="level-info">
            <div className="level-number">Lv.{userData.level}</div>
            <div className="exp-bar-container">
              <div className="exp-bar-background">
                <div className="exp-bar-progress"></div>
              </div>
              <div className="exp-text">次のレベルまで　{userData.nextLevelExp} EXP</div>
            </div>
          </div>
          
          <div className="user-stats">
            <div className="stat-item">
              <div className="stat-label">登録ナレッジ数</div>
              <div className="stat-value">{userData.knowledgeCount}</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-label">累積PV数</div>
              <div className="stat-value">{userData.totalPageViews}</div>
            </div>
          </div>
        </div>
        
        {/* ナレッジリスト */}
        <div className="knowledge-list-container">
          <div className="knowledge-header">
            <h2 className="knowledge-title">登録したナレッジ</h2>
            <button className="create-button" onClick={() => openModal('create')}>
              <span>+</span>
              新規作成
            </button>
          </div>
          
          <div className="knowledge-items">
            {knowledgeData.map(item => (
              <div key={item.id} className="knowledge-item" onClick={() => openModal(item)}>
                <div className="knowledge-icon" style={{ backgroundColor: item.iconBgColor }}>
                  <span>{item.icon}</span>
                </div>
                
                <div className="knowledge-content">
                  <div className="knowledge-title-text">{item.title}</div>
                  <div className="knowledge-category">
                    <span className="category-label">配信手法</span>
                    <span className="category-badge">
                      <span className="category-icon">✉️</span>
                      {item.category}
                    </span>
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
      
      {/* モーダル */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {modalContent === 'create' ? (
              <div className="create-knowledge-form">
                <div className="modal-header">
                  <h2>新規ナレッジ作成</h2>
                  <button className="close-button" onClick={closeModal}>×</button>
                </div>
                <div className="form-group">
                  <label>タイトル</label>
                  <input type="text" placeholder="ナレッジのタイトルを入力" />
                </div>
                <div className="form-group">
                  <label>カテゴリー</label>
                  <select>
                    <option value="email">メール</option>
                    <option value="web">ウェブ</option>
                    <option value="app">アプリ</option>
                    <option value="other">その他</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>内容</label>
                  <textarea rows="5" placeholder="ナレッジの内容を入力"></textarea>
                </div>
                <div className="form-buttons">
                  <button className="cancel-button" onClick={closeModal}>キャンセル</button>
                  <button className="submit-button">作成</button>
                </div>
              </div>
            ) : (
              <div className="knowledge-detail">
                <div className="modal-header">
                  <h2>{modalContent?.title}</h2>
                  <button className="close-button" onClick={closeModal}>×</button>
                </div>
                <div className="knowledge-detail-meta">
                  <div className="detail-category">
                    <span className="category-label">配信手法</span>
                    <span className="category-badge">
                      <span className="category-icon">✉️</span>
                      {modalContent?.category}
                    </span>
                  </div>
                  <div className="detail-author">
                    <div className="author-avatar"></div>
                    <span className="author-name">{modalContent?.author}</span>
                  </div>
                </div>
                <div className="knowledge-detail-content">
                  <p>このナレッジには詳細な内容が含まれています。ここには実際にはマーケティング戦略やノウハウが記載されますが、このデモでは省略しています。</p>
                  <p>下記のような詳細も含まれます：</p>
                  <ul>
                    <li>ターゲットオーディエンス</li>
                    <li>成功事例・効果</li>
                    <li>実施手順</li>
                    <li>注意点</li>
                  </ul>
                </div>
                <div className="knowledge-detail-stats">
                  <div className="stats-item">
                    <span className="stats-icon">👁️</span>
                    <span className="stats-value">{modalContent?.views} 閲覧</span>
                  </div>
                  <div className="stats-item">
                    <span className="stats-icon">📅</span>
                    <span className="stats-value">2025年2月15日作成</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
