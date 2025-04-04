'use client';

import { useState, useEffect } from 'react';

/**
 * ナレッジ詳細モーダルコンポーネント
 * @param {Object} props
 * @param {Object} props.content - 表示するナレッジの内容
 * @param {function} props.onClose - モーダルを閉じる際のコールバック
 */
export default function KnowledgeModal({ content, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  // 閉じるアニメーションを制御する関数
  const handleClose = () => {
    setIsClosing(true);
    // アニメーション完了後に実際に閉じる
    setTimeout(() => {
      onClose();
    }, 300); // CSSのアニメーション時間と合わせる
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

  // Markdown形式のコンテンツを変換してレンダリングする関数
  const renderContent = () => {
    if (!content.content) {
      return (
        <div className="knowledge-detail-content">
          <p>このナレッジには詳細な内容が含まれています。ここには実際にはマーケティング戦略やノウハウが記載されますが、このデモでは省略しています。</p>
          <p>下記のような詳細も含まれます：</p>
          <ul>
            <li>ターゲットオーディエンス</li>
            <li>成功事例・効果</li>
            <li>実施手順</li>
            <li>注意点</li>
          </ul>
        </div>
      );
    }

    return (
      <div className="knowledge-detail-content">
        {content.content.split('\n').map((paragraph, idx) => {
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
    );
  };

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`modal-content ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="knowledge-detail">
          <div className="modal-header">
            <div className="modal-title-container">
              <div 
                className="modal-icon" 
                style={{ backgroundColor: content.iconBgColor }}
              >
                <span>{content.icon}</span>
              </div>
              <h2 className="modal-title">{content.title}</h2>
            </div>
            <button className="close-button" onClick={handleClose}>×</button>
          </div>
          
          <div className="knowledge-detail-meta">
            <div className="detail-category">
              <span className="category-label">配信手法</span>
              <span className="category-badge">
                <span className="category-icon">✉️</span>
                {content.category}
              </span>
            </div>
            <div className="detail-author">
              <div className="author-avatar"></div>
              <span className="author-name">{content.author}</span>
            </div>
          </div>
          
          {renderContent()}
          
          <div className="knowledge-detail-stats">
            <div className="stats-item">
              <span className="stats-icon">👁️</span>
              <span className="stats-value">{content.views} 閲覧</span>
            </div>
            <div className="stats-item">
              <span className="stats-icon">📅</span>
              <span className="stats-value">
                {content.createdAt || '2025年2月15日'} 作成
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
