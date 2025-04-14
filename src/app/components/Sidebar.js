'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Logo from './Logo';

export default function Sidebar({ userData }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  
  // Default user data if none provided
  const user = userData || {
    name: '中村千佳',
    department: 'デジタルマーケティング部',
    level: 34,
    avatar_url: '/default-avatar.png' // デフォルトのアバター画像パスを追加
  };
  
  const handleLogout = () => {
    // ここで実際のログアウト処理を行います
    // 例: localStorage からトークンを削除するなど
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    // ログインページにリダイレクト
    router.push('/login');
  };
  
  return (
    <div className="sidebar">
      {/* ロゴ */}
      <div className="sidebar-logo">
        <Logo size="small" />
      </div>
      
      {/* タブメニュー */}
      <div className="tabs">
        <Link href="/mypage" className={`tab ${pathname === '/mypage' ? 'active' : ''}`}>
          <span style={{ fontSize: '20px' }}>👤</span>
          マイページ
        </Link>
        <Link href="/knowledge" className={`tab ${pathname === '/knowledge' ? 'active' : ''}`}>
          <span style={{ fontSize: '20px' }}>📚</span>
          ナレッジ一覧
        </Link>
        <Link href="/ranking" className={`tab ${pathname === '/ranking' ? 'active' : ''}`}>
          <span style={{ fontSize: '20px' }}>📊</span>
          リーダーボード
        </Link>
      </div>
      
      {/* プロフィール情報 */}
      <div className="profile-section">
        <div 
          className="profile-card"
          onClick={() => setShowLogoutMenu(!showLogoutMenu)}
          style={{ cursor: 'pointer' }}
        >
          <div 
            className="profile-avatar" 
            style={{ 
              backgroundImage: `url(${user.avatar || '/default-avatar.png'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} 
          />
          <div className="profile-info">
            <div className="profile-name-section">
              <span className="profile-name">
                {user.name}
              </span>
              <span className="level-badge">Lv.{user.level}</span>
            </div>
            <span className="profile-department">{user.department}</span>
          </div>
        </div>
        
        {/* ログアウトメニュー */}
        {showLogoutMenu && (
          <div className="logout-menu">
            <button onClick={handleLogout}>ログアウト</button>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .logout-menu {
          position: absolute;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          padding: 8px;
          z-index: 100;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          min-width: 120px;
        }
        
        .logout-menu button {
          background: none;
          border: none;
          color: #333;
          cursor: pointer;
          padding: 5px 10px;
          text-align: center;
          width: 100%;
          font-size: 14px;
        }
        
        .logout-menu button:hover {
          background: #f5f5f5;
        }
        
        .profile-section {
          position: relative;
        }
      `}</style>
    </div>
  );
}
