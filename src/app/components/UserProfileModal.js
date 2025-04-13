import React, { useState, useEffect } from 'react';
import styles from './UserProfileModal.module.css';
import { METHOD_MAPPING, TARGET_MAPPING } from '../constants/knowledgeConstants';

/**
 * ユーザープロファイル情報を表示するためのハーフモーダルコンポーネント
 * @param {Object} props - コンポーネントのプロパティ
 * @param {boolean} props.isOpen - モーダルの表示状態
 * @param {function} props.onClose - モーダルを閉じる関数
 * @param {number} props.userId - 表示するユーザーのID
 */
const UserProfileModal = ({ isOpen, onClose, userId }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

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

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProfile();
      
      // URLの末尾にユーザーIDを追加
      const pathname = window.location.pathname;
      window.history.pushState({}, '', `${pathname}#user=${userId}`);
    }
  }, [isOpen, userId]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      // ローカルストレージからトークンを取得
      const token = localStorage.getItem('token');
      if (!token) {
        setError('認証エラーが発生しました。再度ログインしてください。');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/profile/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('ユーザー情報の取得に失敗しました');
      }

      const data = await response.json();
      
      // ユーザーデータを設定
      setUserData({
        name: data.name,
        email: data.email,
        department: data.department || '',
        level: data.level,
        experiencePoints: data.currentXp,
        nextLevelExp: calculateNextLevelExp(data.level, data.currentXp),
        expBarPercentage: calculateExpBarPercentage(data.currentXp),
        knowledgeCount: data.activity?.length || 0,
        totalPageViews: data.activity?.reduce((sum, item) => sum + item.views, 0) || 0,
        avatar: data.avatar || null,
        activity: data.activity || []
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  // ブラウザの戻るボタンが押された時にモーダルを閉じる
  useEffect(() => {
    const handlePopState = () => {
      handleClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // 閉じるアニメーションを制御する関数
  const handleClose = () => {
    setIsClosing(true);
    
    // URLからユーザーIDを削除
    const pathname = window.location.pathname;
    window.history.pushState({}, '', pathname);
    
    // アニメーション完了後に実際に閉じる
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // CSSのアニメーション時間と合わせる
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`} onClick={handleClose}>
      <div 
        className={`${styles.modalContent} ${isClosing ? styles.closing : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={handleClose}>×</button>
        
        {isLoading ? (
          <div className={styles.loading}>データを読み込み中...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : userData ? (
          <>
            {/* ユーザー情報カード */}
            <div className={styles.userInfoCard}>
              <div className={styles.userAvatarSection}>
                <div className={styles.userAvatar} />
                <div className={styles.userName}>{userData.name}</div>
                <div className={styles.userDepartment}>{userData.department}</div>
              </div>
              
              <div className={styles.levelInfo}>
                <div className={styles.levelNumber}>Lv.{userData.level}</div>
                <div className={styles.expBarContainer}>
                  <div className={styles.expBarBackground}>
                    <div 
                      className={styles.expBarProgress} 
                      style={{ width: `${userData.expBarPercentage}%` }}
                    ></div>
                  </div>
                  <div className={styles.expText}>次のレベルまで　{userData.nextLevelExp} EXP</div>
                </div>
              </div>
              
              <div className={styles.userStats}>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>登録ナレッジ数</div>
                  <div className={styles.statValue}>{userData.knowledgeCount}</div>
                </div>
                <div className={styles.statDivider}></div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>累積PV数</div>
                  <div className={styles.statValue}>{userData.totalPageViews}</div>
                </div>
              </div>
            </div>
            
            {/* ナレッジリスト */}
            <div className={styles.knowledgeList}>
              <h3 className={styles.sectionTitle}>登録したナレッジ</h3>
              {userData.activity.length > 0 ? (
                <div className={styles.knowledgeItems}>
                  {userData.activity.map((item) => (
                    <div key={item.id} className={styles.knowledgeItem}>
                      <div className={styles.knowledgeTitle}>{item.title}</div>
                      <div className={styles.knowledgeInfo}>
                        <span className={styles.knowledgeCategory}>
                          {METHOD_MAPPING[item.method] || '不明'}
                        </span>
                        <span className={styles.knowledgeTarget}>
                          {TARGET_MAPPING[item.target] || '不明'}
                        </span>
                        <span className={styles.knowledgeDate}>{item.createdAt}</span>
                      </div>
                      <div className={styles.knowledgeViews}>
                        <span className={styles.viewsIcon}>👁️</span>{item.views}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noKnowledge}>登録されたナレッジはありません</div>
              )}
            </div>
          </>
        ) : (
          <div className={styles.noData}>データが見つかりません</div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;