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
  const [comment, setComment] = useState('');

  // 配信手法に応じた背景色を返す関数
  const getMethodColor = (method) => {
    switch (method) {
      case 'メール':
        return '#DDF4FF';  // 青系
      case 'SNS':
        return '#D6FFE4';  // 緑系
      case 'My東京ガス':
        return '#FFE4D6';  // オレンジ系
      default:
        return '#F0F0F0';  // グレー系
    }
  };

  // ターゲットに応じた背景色を返す関数（配信手法の色を薄くする）
  const getTargetColor = (method) => {
    switch (method) {
      case '新規顧客':
        return '#EEF9FF';  // 薄い青系
      case '既存顧客':
        return '#EBFFF2';  // 薄い緑系
      default:
        return '#F0F0F0';  // 薄いグレー系
    }
  };

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

  // ダミーのコメントデータ
  const comments = [
    {
      id: 1,
      username: 'Sato kaori',
      timestamp: '2025/03/28/16:00:00',
      text: 'この件について教えてください！'
    }
  ];

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
                <div className="meta-tag" style={{ backgroundColor: getTargetColor(content.category) }}>
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
              {content.content ? content.content : `目的
メールを活用してターゲットユーザーとのエンゲージメントを高め、コンバージョン率やブランドロイヤルティを向上させる。
仮説
パーソナライズされたコンテンツを送ることで開封率・クリック率が向上する。
セグメント別に最適化された配信タイミングを設定することで反応率が高まる。
定期的な情報提供と限定オファーにより購買意欲を刺激できる。
期待効果
メールの開封率・クリック率の向上
リードナーチャリングによる長期的な顧客育成
顧客ロイヤルティの強化によるLTV（顧客生涯価値）の向上`}
            </div>
          </div>
          
          {/* 区切り線 */}
          <div className="meta-divider"></div>
          
          {/* コメントセクション */}
          <div className="comment-section">
            {comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-timestamp">{comment.timestamp}</div>
                <div className="comment-content">
                  <div className="comment-user">
                    <div className="comment-avatar"></div>
                    <div className="comment-username">{comment.username}</div>
                  </div>
                  <div className="comment-bubble">{comment.text}</div>
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
