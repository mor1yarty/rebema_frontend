'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { KnowledgeList, CreateKnowledgeModal } from '../components/knowledge';
import Toast from '../components/Toast';
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
  const [toast, setToast] = useState(null);

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

  useEffect(() => {
    loadUserData();
  }, [router]);

  // モーダルが閉じられた後にデータを更新する処理
  const handleModalClose = (updatedContent) => {
    if (updatedContent) {
      // 更新されたデータでリストを更新
      setKnowledgeData(prevData => {
        return prevData.map(item => {
          if (item.id === updatedContent.id) {
            // 更新されたコンテンツを反映
            return {
              ...item,
              views: updatedContent.views,
              comments: updatedContent.comments || item.comments
            };
          }
          return item;
        });
      });
      
      // ローカルストレージからユーザーデータを取得して閲覧数を更新
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const data = JSON.parse(storedUserData);
        if (data && data.activity) {
          // 更新するナレッジのインデックスを取得
          const activityIndex = data.activity.findIndex(item => item.id === updatedContent.id);
          if (activityIndex !== -1) {
            // 閲覧数を更新
            data.activity[activityIndex].views = updatedContent.views;
            
            // 更新したデータをローカルストレージに保存
            localStorage.setItem('userData', JSON.stringify(data));
            
            // ユーザーデータのトータルPV数を更新
            setUserData(prev => ({
              ...prev,
              totalPageViews: data.activity.reduce((sum, item) => sum + item.views, 0) || 0
            }));
          }
        }
      }
    }
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  // トースト表示を閉じる処理
  const handleToastClose = () => {
    setToast(null);
  };

  const handleSubmit = async (formData) => {
    try {
      // ローカルストレージからトークンを取得
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      // APIを呼び出してデータを保存
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'http://localhost:8000'}/knowledge/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData // FormDataオブジェクトをそのまま送信
      });
      
      if (!response.ok) {
        throw new Error(`ナレッジの作成に失敗しました: ${response.status}`);
      }
      
      // レスポンスデータを取得
      const responseData = await response.json();
      
      // モーダルを閉じる
      setIsCreateModalOpen(false);
      
      // 成功トーストを表示
      setToast({
        message: 'ナレッジを作成しました',
        type: 'success'
      });
      
      // ナレッジリストを更新するためにデータを再取得
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('ナレッジ作成エラー:', error);
      
      // エラートーストを表示
      setToast({
        message: error.message,
        type: 'error'
      });
    }
  };

  if (isLoading) {
    return <div className="loading">データを読み込み中...</div>;
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
          onModalClose={handleModalClose}
        />
      </div>
      
      {/* 新規作成モーダル */}
      {isCreateModalOpen && (
        <CreateKnowledgeModal 
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
      
      {/* トースト通知 */}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
        />
      )}
    </div>
  );
}
