'use client';

import { useState, useEffect } from 'react';
import { getMethodColor, getTargetColor } from '../../constants/knowledgeConstants';

/**
 * ナレッジ詳細モーダルコンポーネント
 * @param {Object} props
 * @param {Object} props.content - 表示するナレッジの初期内容
 * @param {function} props.onClose - モーダルを閉じる際のコールバック
 */
export default function KnowledgeModal({ content, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [comment, setComment] = useState('');
  const [knowledgeDetail, setKnowledgeDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // APIからナレッジ詳細を取得
  useEffect(() => {
    const fetchKnowledgeDetail = async () => {
      setIsLoading(true);
      try {
        // ローカルストレージからトークンを取得
        const token = localStorage.getItem('token');
        if (!token) {
          setError('認証エラー：再ログインしてください');
          return;
        }

        // ナレッジ詳細を取得
        const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/knowledge/${content.id}`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // 401エラーの場合はトークンが無効なのでログインページにリダイレクト
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            setIsClosing(true);
            setTimeout(() => {
              onClose();
              // ログインページにリダイレクト
              window.location.href = '/login';
            }, 300);
            return;
          }
          throw new Error(`ナレッジ詳細の取得に失敗しました: ${response.status}`);
        }

        const detailData = await response.json();
        setKnowledgeDetail(detailData);

        // コメントを取得
        const commentsResponse = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/knowledge/${content.id}/comments/`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!commentsResponse.ok) {
          throw new Error(`コメントの取得に失敗しました: ${commentsResponse.status}`);
        }

        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (err) {
        console.error('データ取得エラー:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKnowledgeDetail();
  }, [content.id]);

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

  // 閉じるアニメーションを制御する関数
  const handleClose = () => {
    setIsClosing(true);
    // アニメーション完了後に実際に閉じる
    setTimeout(() => {
      // もし詳細データが取得できていれば、それを親コンポーネントに渡す
      if (knowledgeDetail) {
        onClose({
          ...content,
          ...knowledgeDetail,
          comments: comments
        });
      } else {
        onClose();
      }
    }, 300); // CSSのアニメーション時間と合わせる
  };

  // コメント送信処理
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('認証エラー：再ログインしてください');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/knowledge/${content.id}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: comment })
      });

      if (!response.ok) {
        // 401エラーの場合はトークンが無効なのでログインページにリダイレクト
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          setIsClosing(true);
          setTimeout(() => {
            onClose();
            // ログインページにリダイレクト
            window.location.href = '/login';
          }, 300);
          return;
        }
        throw new Error(`コメントの送信に失敗しました: ${response.status}`);
      }

      // コメントを再取得
      const commentsResponse = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/knowledge/${content.id}/comments/`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!commentsResponse.ok) {
        throw new Error(`コメントの再取得に失敗しました: ${commentsResponse.status}`);
      }

      const commentsData = await commentsResponse.json();
      setComments(commentsData);
      setComment('');
    } catch (err) {
      console.error('コメント送信エラー:', err);
      setError(err.message);
    }
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

  // データ読み込み中の表示
  if (isLoading && !knowledgeDetail) {
    return (
      <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
        <div 
          className={`modal-content ${isClosing ? 'closing' : ''}`} 
          onClick={e => e.stopPropagation()}
        >
          <button className="close-button" onClick={handleClose}>×</button>
          <div className="knowledge-detail loading-container">
            <p>データを読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  // エラー表示
  if (error) {
    return (
      <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
        <div 
          className={`modal-content ${isClosing ? 'closing' : ''}`} 
          onClick={e => e.stopPropagation()}
        >
          <button className="close-button" onClick={handleClose}>×</button>
          <div className="knowledge-detail error-container">
            <p className="error-message">エラーが発生しました: {error}</p>
            <button className="cancel-button" onClick={handleClose}>閉じる</button>
          </div>
        </div>
      </div>
    );
  }

  // 表示するデータがあれば、それを表示
  const displayData = knowledgeDetail || content;
  const displayComments = comments.length > 0 ? comments : (displayData.comments || []);

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div 
        className={`modal-content ${isClosing ? 'closing' : ''}`} 
        onClick={e => e.stopPropagation()}
      >
        {/* 閉じるボタン（右上に固定） */}
        <button className="close-button" onClick={handleClose}>×</button>
        
        <div className="knowledge-detail">
          {/* 編集・削除ボタン - タイトルの上部左上に配置 */}
          <div className="modal-actions-top">
            <button 
              className="edit-button" 
              onClick={(e) => {
                e.stopPropagation();
                // 編集処理はまだ実装していない
                console.log('Edit clicked for:', displayData.id);
              }}
            >
              編集
            </button>
            <button 
              className="delete-button" 
              onClick={(e) => {
                e.stopPropagation();
                // 削除処理はまだ実装していない
                console.log('Delete clicked for:', displayData.id);
              }}
            >
              削除
            </button>
          </div>

          {/* ヘッダー部分 */}
          <div className="modal-header-container">
            <div className="modal-header">
              <h2 className="modal-title">{displayData.title}</h2>
            </div>
            
            {/* メタデータグリッド */}
            <div className="knowledge-meta-grid">
              {/* 作成者行 */}
              <div className="knowledge-meta-row">
                <span className="meta-label">作成者</span>
                <div className="meta-author-container">
                  <div className="meta-author-avatar"></div>
                  <span className="meta-author-name">
                    {displayData.author?.name || displayData.author}
                  </span>
                </div>
              </div>
              
              {/* 作成日時行 */}
              <div className="knowledge-meta-row">
                <span className="meta-label">作成日時</span>
                <div className="meta-value">
                  <span className="meta-value-text">{displayData.createdAt}</span>
                </div>
              </div>
              
              {/* 配信手法行 */}
              <div className="knowledge-meta-row">
                <span className="meta-label">配信手法</span>
                <div className="meta-tag" style={{ 
                  backgroundColor: getMethodColor(knowledgeDetail?.method || displayData.category) 
                }}>
                  <span className="meta-tag-text">
                    {knowledgeDetail?.method ? (
                      knowledgeDetail.method === "1" ? "メール" :
                      knowledgeDetail.method === "2" ? "ウェブ" :
                      knowledgeDetail.method === "3" ? "アプリ" : "その他"
                    ) : displayData.category}
                  </span>
                </div>
              </div>
              
              {/* ターゲット行 */}
              <div className="knowledge-meta-row">
                <span className="meta-label">ターゲット</span>
                <div className="meta-tag" style={{ 
                  backgroundColor: getTargetColor(knowledgeDetail?.target || displayData.target) 
                }}>
                  <span className="meta-tag-text">
                    {knowledgeDetail?.target ? (
                      knowledgeDetail.target === "1" ? "新規ユーザー" :
                      knowledgeDetail.target === "2" ? "既存ユーザー" :
                      knowledgeDetail.target === "3" ? "休眠ユーザー" : "全ユーザー"
                    ) : displayData.target}
                  </span>
                </div>
              </div>
              
              {/* PV数行 */}
              <div className="knowledge-meta-row">
                <span className="meta-label">PV数</span>
                <div className="meta-value">
                  <span className="meta-value-text">{displayData.views}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 区切り線 */}
          {/* <div className="meta-divider"></div> */}
          
          {/* コンテンツ本文 */}
          <div className="knowledge-detail-section">
          <span className="meta-label">内容</span>
            <div className="knowledge-detail-content">
              {knowledgeDetail?.description || displayData.content}
            </div>
          </div>
          
          {/* 区切り線 */}
          {/* <div className="meta-divider"></div> */}
          
          {/* コメントセクション */}
          <div className="comment-section">
            {displayComments.map((comment, index) => (
              <div key={`comment-${comment.id || index}`} className="comment-item">
                <div className="comment-timestamp">
                  {comment.createdAt || comment.created_at}
                </div>
                <div className="comment-content">
                  <div className="comment-user">
                    <div className="comment-avatar"></div>
                    <div className="comment-username">
                      {comment.author?.name || comment.author_name || comment.author}
                    </div>
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
