'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { KnowledgeList, CreateKnowledgeModal } from '../components/knowledge';
import './mypage.css';

// Mock data for knowledge entries - 詳細なコンテンツを追加
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
  level: 34,
  nextLevelExp: 4500,
  knowledgeCount: 43,
  totalPageViews: 343,
  avatar: '/avatar1.jpg'
};

export default function MyPage() {
  // 新規作成モーダルの状態管理
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Function to handle create button click
  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  // Function to handle form submission
  const handleSubmit = (formData) => {
    // 実際のアプリケーションではAPIを呼び出してデータを保存します
    console.log('Form submitted:', formData);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="page-container">
      {/* サイドバー */}
      <Sidebar userData={userData} />
      
      {/* モバイル用ヘッダー */}
      <Header />
      
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
        <KnowledgeList 
          knowledgeData={knowledgeData}
          title="登録したナレッジ"
          showCreateButton={true}
          onCreateClick={handleCreateClick}
        />
      </div>
      
      {/* 新規作成モーダル */}
      {isCreateModalOpen && (
        <CreateKnowledgeModal 
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
