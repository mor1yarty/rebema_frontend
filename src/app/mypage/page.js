'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { KnowledgeList, CreateKnowledgeModal } from '../components/knowledge';
import Toast from '../components/Toast';
import LevelUpModal from '../components/LevelUpModal';
import { METHOD_MAPPING, TARGET_MAPPING } from '../constants/knowledgeConstants';
import './mypage.css';

// 次のレベルに必要な経験値を計算する関数
const calculateNextLevelExp = (currentLevel, totalExp) => {
  const expPerLevel = 100; // 各レベルアップに必要な経験値量は100
  // 次のレベルに必要な残りの経験値 = 100 - (総経験値 % 100)
  const remainingExp = expPerLevel - (totalExp % expPerLevel);
  return remainingExp;
};

// 経験値バーの進捗率（%）を計算する関数
const calculateExpBarPercentage = (totalExp) => {
  const expPerLevel = 100; // 各レベルアップに必要な経験値量は100
  // 現在のレベル内での進捗率 = (総経験値 % 100) / 100 * 100%
  const percentage = (totalExp % expPerLevel) / expPerLevel * 100;
  return percentage;
};

export default function MyPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [knowledgeData, setKnowledgeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [experienceData, setExperienceData] = useState(null);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

  useEffect(() => {
    // URLにハッシュが含まれている場合は、ナレッジページにリダイレクト
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#')) {
        router.push(`/knowledge${hash}`);
        return;
      }
    }
    
    loadUserData();
  }, [router]);

  const loadUserData = async () => {
    try {
      // ローカルストレージからトークンを取得
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      setIsLoading(true);
      
      // トークンを使用してユーザー情報をAPIから取得
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!userResponse.ok) {
        // 401エラーの場合はトークンが無効（期限切れなど）のためログインページにリダイレクト
        if (userResponse.status === 401) {
          // トークンを削除
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          // ログインページにリダイレクト
          router.push('/login');
          return;
        }
        throw new Error('ユーザー情報の取得に失敗しました');
      }
      
      const data = await userResponse.json();
      
      // ユーザーデータをローカルストレージに保存（他の場所で使用されることを考慮）
      localStorage.setItem('userData', JSON.stringify(data));
      
      setUserData({
        name: data.name,
        department: data.department || '',
        level: data.level,
        experiencePoints: data.currentXp, // APIレスポンスの変更に対応（experiencePointsからcurrentXpに変更）
        nextLevelExp: calculateNextLevelExp(data.level, data.currentXp),
        expBarPercentage: calculateExpBarPercentage(data.currentXp), // 経験値バーの進捗率を計算
        knowledgeCount: data.activity?.length || 0,
        totalPageViews: data.activity?.reduce((sum, item) => sum + item.views, 0) || 0,
        avatar: data.avatar || '/avatar1.jpg'
      });

      // 知識データを活動履歴から変換
      const formattedKnowledge = data.activity?.map(item => ({
        id: item.id,
        title: item.title,
        category: METHOD_MAPPING[item.method] || '不明',
        target: TARGET_MAPPING[item.target] || '不明',
        author: item.author?.name || data.name, // 著者情報の構造が変更されているため対応
        views: item.views,
        createdAt: item.createdAt,
        // モーダル表示の仕様変更により、以下のフィールドは削除
        // content: item.content,
        // comments: item.comments
      })) || [];

      setKnowledgeData(formattedKnowledge);
    } catch (error) {
      console.error('Failed to load user data:', error);
      // トークンが無効の場合はログイン画面に戻す
      localStorage.removeItem('token');
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

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

  // レベルアップモーダルを閉じる処理
  const handleLevelUpModalClose = () => {
    setIsLevelUpModalOpen(false);
    
    // ユーザーデータを再取得してレベルや経験値の表示を更新する
    loadUserData();
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/knowledge/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData // FormDataオブジェクトをそのまま送信
      });
      
      if (!response.ok) {
        // 401エラーの場合はトークンが無効なのでログインページにリダイレクト
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          // ログインページにリダイレクト
          router.push('/login');
          return;
        }
        throw new Error(`ナレッジの作成に失敗しました: ${response.status}`);
      }
      
      // レスポンスデータを取得
      const responseData = await response.json();
      
      // モーダルを閉じる
      setIsCreateModalOpen(false);
      
      // 経験値情報がレスポンスに含まれている場合はレベルアップモーダルを表示
      if (responseData.experience) {
        setExperienceData(responseData.experience);
        setIsLevelUpModalOpen(true);
      } else {
        // 経験値情報がない場合は従来通りトーストを表示
        setToast({
          message: 'ナレッジを作成しました',
          type: 'success'
        });
        
        // ナレッジリストを更新するためにデータを再取得
        setTimeout(() => {
          loadUserData();
        }, 1000);
      }
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
            <div className="user-department">{userData.department}</div>
          </div>
          
          <div className="level-info">
            <div className="level-number">Lv.{userData.level}</div>
            <div className="exp-bar-container">
              <div className="exp-bar-background">
                <div className="exp-bar-progress" style={{ width: `${userData.expBarPercentage}%` }}></div>
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
      
      {/* レベルアップモーダル */}
      <LevelUpModal 
        isOpen={isLevelUpModalOpen}
        onClose={handleLevelUpModalClose}
        experience={experienceData}
      />
      
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
