'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

export default function Sidebar({ userData }) {
  const pathname = usePathname();
  
  // Default user data if none provided
  const user = userData || {
    name: '中村千佳',
    department: 'デジタルマーケティング部',
    level: 34
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
        <div className="profile-card">
          <div className="profile-avatar" />
          <div className="profile-info">
            <div className="profile-name-section">
              <span className="profile-name">{user.name}</span>
              <span className="level-badge">Lv.{user.level}</span>
            </div>
            <span className="profile-department">{user.department}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
