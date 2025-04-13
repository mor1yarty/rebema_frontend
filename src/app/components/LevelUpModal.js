import React from 'react';
import styles from './LevelUpModal.module.css';

/**
 * レベルアップ情報とXP獲得を表示するためのモーダルコンポーネント
 * @param {Object} props - コンポーネントのプロパティ
 * @param {boolean} props.isOpen - モーダルの表示状態
 * @param {function} props.onClose - モーダルを閉じる関数
 * @param {Object} props.experience - 経験値情報オブジェクト
 * @param {boolean} props.experience.level_up - レベルアップしたかどうか
 * @param {number} props.experience.before_level - 以前のレベル
 * @param {number} props.experience.after_level - 現在のレベル
 * @param {number} props.experience.before_xp - 以前の経験値
 * @param {number} props.experience.after_xp - 現在の経験値
 * @param {number} props.experience.required_xp - 次のレベルに必要な経験値
 */
const LevelUpModal = ({ isOpen, onClose, experience }) => {
  if (!isOpen || !experience) return null;

  const levelUp = experience.level_up;
  const currentLevel = experience.after_level;
  const nextLevelExp = experience.required_xp - experience.after_xp;
  const progressPercent = (experience.after_xp / experience.required_xp) * 100;

  // オーバーレイのクリックを処理する関数
  const handleOverlayClick = (e) => {
    // クリックがオーバーレイ自体に対して行われた場合にのみ閉じる
    // (モーダル内部のクリックは閉じない）
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        {levelUp ? (
          // レベルアップの場合
          <>
            <h2 className={styles.title}>レベルアップ！</h2>
            <div className={styles.levelSection}>
              <div className={styles.levelDisplay}>Lv.{currentLevel}</div>
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className={styles.expText}>
                  次のレベルまで {nextLevelExp} EXP
                </div>
              </div>
            </div>
          </>
        ) : (
          // 経験値獲得のみの場合
          <>
            <h2 className={styles.title}>経験値を獲得！</h2>
            <div className={styles.levelSection}>
              <div className={styles.levelDisplay}>Lv.{currentLevel}</div>
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className={styles.expText}>
                  次のレベルまで {nextLevelExp} EXP
                </div>
              </div>
            </div>
            <div className={styles.expGained}>
              +{experience.after_xp - experience.before_xp} EXP獲得！
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LevelUpModal;