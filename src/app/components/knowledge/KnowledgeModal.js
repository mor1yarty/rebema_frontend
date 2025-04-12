'use client';

import { useState, useEffect } from 'react';
import { getMethodColor, getTargetColor } from '../../constants/knowledgeConstants';

/**
 * ナレッジ詳細モーダルコンポーネント
 * @param {Object} props
 * @param {Object} props.content - 表示するナレッジの内容
 * @param {function} props.onClose - モーダルを閉じる際のコールバック
 */
export default function KnowledgeModal({ content, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [comment, setComment] = useState('');

  // 閉じるアニメーションを制御する関数
  const handleClose = () => {
    setIsClosing(true);
    // アニメーション完了後に実際に閉じる
    setTimeout(() => {
      onClose();
    }, 300); // CSSのアニメーション時間と合わせる
  };

  // コメント送信処理
  const handleSubmit = () => {
    // 実装時はAPIを呼び出してコメントを保存
    console.log('送信されたコメント:', comment);
    setComment('');
    // 送信後にモーダルを閉じる
    handleClose();
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
              <h2 className="modal-title">{content.title}</h2>
            </div>
            
            {/* メタデータグリッド */}
            <div className="knowledge-meta-grid">
              {/* 作成者行 */}
              <div className="knowledge-meta-row">
                <span className="meta-label">作成者</span>
                <div className="meta-author-container">
                  <div className="meta-author-avatar"></div>
                  <span className="meta-author-name">{content.author}</span>
                </div>
              </div>
              
              {/* 作成日時行 */}
              <div className="knowledge-meta-row">
                <span className="meta-label">作成日時</span>
                <div className="meta-value">
                  <span className="meta-value-text">{content.createdAt || '2025/03/27'}</span>
                </div>
              </div>
              
              {/* 配信手法行 */}
              <div className="knowledge-meta-row">
                <span className="meta-label">配信手法</span>
                <div className="meta-tag" style={{ backgroundColor: getMethodColor(content.category) }}>
                  <span className="meta-tag-text">{content.category}</span>
                </div>
              </div>
              
              {/* ターゲット行 */}
              <div className="knowledge-meta-row">
                <span className="meta-label">ターゲット</span>
                <div className="meta-tag" style={{ backgroundColor: getTargetColor(content.target) }}>
                  <span className="meta-tag-text">{content.target}</span>
                </div>
              </div>
              
              {/* PV数行 */}
              <div className="knowledge-meta-row">
                <span className="meta-label">PV数</span>
                <div className="meta-value">
                  <span className="meta-value-text">{content.views}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 区切り線 */}
          <div className="meta-divider"></div>
          
          {/* コンテンツ本文 */}
          <div className="knowledge-detail-section">
            <div className="knowledge-detail-label">内容</div>
            <div className="knowledge-detail-content">
              {content.content}
            </div>
          </div>
          
          {/* 区切り線 */}
          <div className="meta-divider"></div>
          
          {/* コメントセクション */}
          <div className="comment-section">
            {content.comments && content.comments.map((comment, index) => (
              <div key={`comment-${index}`} className="comment-item">
                <div className="comment-timestamp">{comment.createdAt}</div>
                <div className="comment-content">
                  <div className="comment-user">
                    <div className="comment-avatar"></div>
                    <div className="comment-username">{comment.author}</div>
                  </div>
                  <div className="comment-bubble">{comment.content}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* コメント入力フォーム */}
          <div className="knowledge-detail-section">
            <div className="knowledge-detail-label">コメントを送信</div>
            <textarea 
              className="comment-input-field" 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="コメントを入力してください"
            />
          </div>
          
          {/* フッターアクション */}
          <div className="modal-footer">
            <button className="cancel-button" onClick={handleClose}>キャンセル</button>
            <button 
              className="submit-button" 
              onClick={handleSubmit}
              disabled={!comment.trim()}
            >
              送信
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
