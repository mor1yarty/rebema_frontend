'use client';

import { useState, useEffect } from 'react';

/**
 * ナレッジ作成モーダルコンポーネント
 * @param {Object} props
 * @param {function} props.onClose - モーダルを閉じる際のコールバック
 * @param {function} props.onSubmit - フォーム送信時のコールバック
 */
export default function CreateKnowledgeModal({ onClose, onSubmit }) {
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'メール',
    target: '既存ユーザー',
    dashboardUrl: '',
    content: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 閉じるアニメーションを制御する関数
  const handleClose = () => {
    setIsClosing(true);
    // アニメーション完了後に実際に閉じる
    setTimeout(() => {
      onClose();
    }, 300); // CSSのアニメーション時間と合わせる
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

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

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div 
        className={`modal-content ${isClosing ? 'closing' : ''}`} 
        onClick={e => e.stopPropagation()}
      >
        {/* 閉じるボタン（右上に固定） */}
        <button className="close-button" onClick={handleClose}>×</button>
        
        <div className="knowledge-detail">
          {/* ヘッダー部分 */}
          <div className="modal-header-container">
            <div className="modal-header">
              <h2 className="modal-title">新規ナレッジ作成</h2>
            </div>
          </div>
          
          {/* フォーム */}
          <form onSubmit={handleSubmit}>
            {/* タイトル */}
            <div className="knowledge-detail-section">
              <div className="knowledge-detail-label">タイトル</div>
              <input 
                type="text" 
                className="knowledge-detail-content"
                style={{ minHeight: 'auto' }}
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="ナレッジのタイトルを入力"
              />
            </div>
            
            {/* 配信手法 */}
            <div className="knowledge-detail-section">
              <div className="knowledge-detail-label">配信手法</div>
              <select 
                className="knowledge-detail-content"
                style={{ minHeight: 'auto' }}
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="メール">メール</option>
                <option value="ウェブ">ウェブ</option>
                <option value="アプリ">アプリ</option>
                <option value="その他">その他</option>
              </select>
            </div>
            
            {/* ターゲット */}
            <div className="knowledge-detail-section">
              <div className="knowledge-detail-label">ターゲット</div>
              <select 
                className="knowledge-detail-content"
                style={{ minHeight: 'auto' }}
                name="target"
                value={formData.target}
                onChange={handleChange}
              >
                <option value="既存ユーザー">既存ユーザー</option>
                <option value="新規ユーザー">新規ユーザー</option>
                <option value="休眠ユーザー">休眠ユーザー</option>
                <option value="全ユーザー">全ユーザー</option>
              </select>
            </div>
            
            {/* 施策ダッシュボードURL */}
            <div className="knowledge-detail-section">
              <div className="knowledge-detail-label">施策ダッシュボードURL（任意）</div>
              <input 
                type="text" 
                className="knowledge-detail-content"
                style={{ minHeight: 'auto' }}
                name="dashboardUrl"
                value={formData.dashboardUrl}
                onChange={handleChange}
                placeholder="https://example.com/dashboard"
              />
            </div>
            
            {/* コンテンツ本文 */}
            <div className="knowledge-detail-section">
              <div className="knowledge-detail-label">内容</div>
              <textarea 
                className="knowledge-detail-content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="ナレッジの内容を記入してください。目的、仮説、期待効果などを含めると良いでしょう。"
                rows="8"
              />
            </div>
            
            {/* フッターアクション */}
            <div className="modal-footer">
              <button type="button" className="cancel-button" onClick={handleClose}>キャンセル</button>
              <button type="submit" className="submit-button">作成</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
