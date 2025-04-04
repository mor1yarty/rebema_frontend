'use client';

import Link from 'next/link';
import Logo from './Logo';
import { usePathname } from 'next/navigation';

export default function Header({ showBackButton = false }) {
  const pathname = usePathname();
  
  // ページタイトルを取得
  const getPageTitle = () => {
    switch (pathname) {
      case '/mypage':
        return 'マイページ';
      case '/knowledge':
        return 'ナレッジ一覧';
      case '/ranking':
        return 'リーダーボード';
      case '/login':
        return 'ログイン';
      default:
        return '';
    }
  };
  
  return (
    <header className="header">
      <div className="header-content">
        {showBackButton && (
          <Link href="/" className="back-button">
            <span>←</span> 戻る
          </Link>
        )}
        
        <div className="page-title">{getPageTitle()}</div>
        
        <div className="header-logo-container">
          <Link href="/">
            <Logo size="small" />
          </Link>
        </div>
      </div>
    </header>
  );
}