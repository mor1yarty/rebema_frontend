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
    views: 46,
    createdAt: '2025年2月15日',
    content: `
      # 電気・ガスのセット契約の促進
      
      ## 概要
      電気とガスの両方を契約している顧客に対して、セット割引を提案するキャンペーンを展開します。
      
      ## ターゲット
      - 電気のみ契約中のお客様
      - ガスのみ契約中のお客様
      - 転居予定のお客様
      
      ## 成功事例・効果
      昨年度のキャンペーンでは、メール配信から2週間で約15%の顧客がセット契約に移行しました。満足度調査では92%の顧客が「とても満足」または「満足」と回答しています。
      
      ## 実施手順
      1. 対象顧客のセグメンテーション
      2. パーソナライズされたメールの作成
      3. フォローアップコールの準備
      4. メール配信とレスポンス測定
      5. 効果測定とレポート作成
      
      ## 注意点
      - 料金体系の説明は簡潔で分かりやすく
      - 問い合わせ先の情報を明確に
      - 解約条件も必ず記載する
    `
  },
  { 
    id: 2, 
    title: 'サブスク型の家電レンタル訴求', 
    category: 'メール',
    icon: '🏡️',
    iconBgColor: '#F1FFCA',
    author: '佐伯 えり',
    views: 46,
    createdAt: '2025年3月2日',
    content: `
      # サブスク型の家電レンタル訴求
      
      ## 概要
      月額制で最新家電が使える新サービス「家電サブスク」の訴求キャンペーンです。
      
      ## ターゲット
      - 単身世帯
      - 新生活開始顧客
      - 賃貸物件入居者
      
      ## 成功事例・効果
      パイロット版では初月で目標の130%の申し込みがありました。特に20代〜30代の単身世帯からの反応が良好でした。
      
      ## 実施手順
      1. 対象セグメントの抽出
      2. 主要プランと特典の整理
      3. メールテンプレート作成
      4. A/Bテスト実施
      5. 反応分析と改善
      
      ## 注意点
      - 解約条件の説明を明確に
      - 初期費用がかからない点を強調
      - 最新家電のラインナップをビジュアルで訴求
    `
  },
  { 
    id: 3, 
    title: '点検・保守サービスのリマインド', 
    category: 'メール',
    icon: '👷',
    iconBgColor: '#E0D6FF',
    author: '佐伯 えり',
    views: 46,
    createdAt: '2025年1月22日',
    content: `
      # 点検・保守サービスのリマインド
      
      ## 概要
      設備の定期点検時期が近づいている顧客へのリマインドメールとアポイント取得キャンペーンです。
      
      ## ターゲット
      - 前回点検から10ヶ月以上経過した顧客
      - 新規設置から1年経過する顧客
      - 前回の点検でメンテナンスが推奨された顧客
      
      ## 成功事例・効果
      リマインドメール導入後、点検実施率が前年比23%向上。顧客満足度も15%向上しました。
      
      ## 実施手順
      1. 点検対象顧客リストの作成
      2. リマインドメールの段階的配信設計
      3. Web予約システムとの連携確認
      4. フォローアップコール体制の準備
      5. 効果測定と改善
      
      ## 注意点
      - 予約のしやすさを強調
      - 点検実施のメリットを具体的に示す
      - 緊急時の対応方法も含める
    `
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  
  // Filter knowledge items based on search query
  const filteredKnowledge = searchQuery
    ? knowledgeData.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : knowledgeData;
  
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
                <div 
                  key={item.id} 
                  className="knowledge-item" 
                  onClick={() => openModal(item)}
                >
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
      
      {/* モーダル */}
      {isModalOpen && modalContent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="knowledge-detail">
              <div className="modal-header">
                <div className="modal-title-container">
                  <div 
                    className="modal-icon" 
                    style={{ backgroundColor: modalContent.iconBgColor }}
                  >
                    <span>{modalContent.icon}</span>
                  </div>
                  <h2 className="modal-title">{modalContent.title}</h2>
                </div>
                <button className="close-button" onClick={closeModal}>×</button>
              </div>
              
              <div className="knowledge-detail-meta">
                <div className="detail-category">
                  <span className="category-label">配信手法</span>
                  <span className="category-badge">
                    <span className="category-icon">✉️</span>
                    {modalContent.category}
                  </span>
                </div>
                <div className="detail-author">
                  <div className="author-avatar"></div>
                  <span className="author-name">{modalContent.author}</span>
                </div>
              </div>
              
              <div className="knowledge-detail-content">
                {modalContent.content.split('\n').map((paragraph, idx) => {
                  // h1見出し (# ではじまる)
                  if (paragraph.trim().startsWith('# ')) {
                    return <h1 key={idx} className="content-h1">{paragraph.trim().substring(2)}</h1>;
                  }
                  // h2見出し (## ではじまる)
                  else if (paragraph.trim().startsWith('## ')) {
                    return <h2 key={idx} className="content-h2">{paragraph.trim().substring(3)}</h2>;
                  }
                  // リスト項目 (- ではじまる)
                  else if (paragraph.trim().startsWith('- ')) {
                    return <li key={idx} className="content-list-item">{paragraph.trim().substring(2)}</li>;
                  }
                  // 数字リスト項目 (1. ではじまる)
                  else if (/^\d+\.\s/.test(paragraph.trim())) {
                    return <li key={idx} className="content-list-item numbered">{paragraph.trim().replace(/^\d+\.\s/, '')}</li>;
                  }
                  // 空行
                  else if (paragraph.trim() === '') {
                    return <br key={idx} />;
                  }
                  // 通常段落
                  else {
                    return <p key={idx} className="content-paragraph">{paragraph}</p>;
                  }
                })}
              </div>
              
              <div className="knowledge-detail-stats">
                <div className="stats-item">
                  <span className="stats-icon">👁️</span>
                  <span className="stats-value">{modalContent.views} 閲覧</span>
                </div>
                <div className="stats-item">
                  <span className="stats-icon">📅</span>
                  <span className="stats-value">{modalContent.createdAt} 作成</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
