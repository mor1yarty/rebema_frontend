'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { KnowledgeList, CreateKnowledgeModal } from '../components/knowledge';
import './mypage.css';

// 次のレベルに必要な経験値を計算する関数
const calculateNextLevelExp = (currentLevel, currentExp) => {
  const baseExp = 1000; // レベル1から2への基準経験値
  const nextLevelTotalExp = Math.floor(baseExp * Math.pow(1.2, currentLevel - 1));
  return nextLevelTotalExp - currentExp;
};

export default function MyPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [knowledgeData, setKnowledgeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = () => {
      try {
        // ローカルストレージからユーザーデータを取得
        const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
          router.push('/login');
          return;
        }

        const data = JSON.parse(storedUserData);
        
        setUserData({
          name: data.name,
          department: data.department || '',
          level: data.level,
          nextLevelExp: calculateNextLevelExp(data.level, data.experiencePoints),
          knowledgeCount: data.activity?.length || 0,
          totalPageViews: data.activity?.reduce((sum, item) => sum + item.views, 0) || 0,
          avatar: data.avatar || '/avatar1.jpg'
        });

        // メソッドとターゲットの数値を文字列に変換する関数
        const getMethodString = (methodId) => {
          switch (methodId) {
            case 1: return 'メール';
            case 2: return 'SNS';
            case 3: return 'My東京ガス';
            default: return '未分類';
          }
        };

        const getTargetString = (targetId) => {
          switch (targetId) {
            case 1: return '新規顧客';
            case 2: return '既存顧客';
            default: return 'その他';
          }
        };

        // 知識データを活動履歴から変換
        const formattedKnowledge = data.activity?.map(item => ({
          id: item.id,
          title: item.title,
          category: getMethodString(Number(item.method)),
          target: getTargetString(Number(item.target)),
          author: item.author,
          views: item.views,
          createdAt: item.createdAt,
          content: item.content,
          comments: item.comments
        })) || [];

        setKnowledgeData(formattedKnowledge);
      } catch (error) {
        console.error('Failed to load user data:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    // APIを呼び出してデータを保存
    try {
      const response = await fetch('/api/knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create knowledge');
      }

      setIsCreateModalOpen(false);
      // 新しいデータを取得するためにページをリロード
      window.location.reload();
    } catch (error) {
      console.error('Error creating knowledge:', error);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

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
