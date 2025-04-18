'use client';

import { useState, useEffect } from 'react';
import { getMethodColor, getTargetColor, METHOD_MAPPING, TARGET_MAPPING } from '../../constants/knowledgeConstants';
import Toast from '../Toast';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    method: '',
    target: '',
    description: '',
    category: ''
  });
  const [toast, setToast] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); // 削除中の状態を管理

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
        
        // 編集用データを初期化
        setEditData({
          title: detailData.title,
          method: detailData.method,
          target: detailData.target,
          description: detailData.description,
          category: detailData.category || ''
        });

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

  // 編集モードの切り替え
  const toggleEditMode = () => {
    if (!isEditing && knowledgeDetail) {
      // 編集モードに入る時、現在の値を編集データにセット
      setEditData({
        title: knowledgeDetail.title,
        method: knowledgeDetail.method,
        target: knowledgeDetail.target,
        description: knowledgeDetail.description,
        category: knowledgeDetail.category || ''
      });
    }
    setIsEditing(!isEditing);
  };

  // 編集データの更新
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ナレッジの更新を保存
  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('認証エラー：再ログインしてください');
        return;
      }

      // URLエンコード形式でデータを準備
      const formData = new URLSearchParams();
      formData.append('title', editData.title);
      formData.append('method', editData.method);
      formData.append('target', editData.target);
      formData.append('description', editData.description);
      if (editData.category) {
        formData.append('category', editData.category);
      }

      // ナレッジを更新
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/knowledge/${content.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      // レスポンスを処理
      if (response.ok) {
        const result = await response.json();
        console.log('更新成功:', result);
        
        // 更新されたデータを取得して表示を更新
        const updatedResponse = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/knowledge/${content.id}`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setKnowledgeDetail(updatedData);
        }
        
        // 編集モードを終了
        setIsEditing(false);
        
        // 成功トーストを表示
        setToast({
          message: 'ナレッジを更新しました',
          type: 'success',
          duration: 3000
        });
      } else {
        // エラーハンドリング
        if (response.status === 403) {
          setToast({
            message: '作成者のみが編集可能です。',
            type: 'error',
            duration: 3000
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.detail || `ナレッジの更新に失敗しました: ${response.status}`);
        }
      }
    } catch (err) {
      console.error('更新エラー:', err);
      setToast({
        message: err.message,
        type: 'error',
        duration: 3000
      });
    }
  };

  // ナレッジ削除処理
  const handleDelete = async () => {
    if (!confirm('このナレッジを削除してもよろしいですか？')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('認証エラー：再ログインしてください');
        return;
      }

      // ナレッジ削除リクエスト
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/knowledge/${content.id}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // レスポンスを処理
      if (response.ok) {
        const result = await response.json();
        console.log('削除成功:', result);
        
        // 成功トーストを表示
        setToast({
          message: 'ナレッジを削除しました',
          type: 'success',
          duration: 3000
        });
        
        // モーダルを閉じる前に少し待つ（トーストを見せるため）
        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        // エラーハンドリング
        if (response.status === 403) {
          setToast({
            message: '作成者のみが削除可能です。',
            type: 'error',
            duration: 3000
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.detail || `ナレッジの削除に失敗しました: ${response.status}`);
        }
      }
    } catch (err) {
      console.error('削除エラー:', err);
      setToast({
        message: err.message,
        type: 'error',
        duration: 3000
      });
    } finally {
      setIsDeleting(false);
    }
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
                toggleEditMode();
              }}
              disabled={isDeleting}
            >
              {isEditing ? 'キャンセル' : '編集'}
            </button>
            <button 
              className="delete-button" 
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting || isEditing}
            >
              {isDeleting ? '削除中...' : '削除'}
            </button>
          </div>

          {isEditing ? (
            <>
              {/* 編集モード */}
              <div className="knowledge-edit-form">
                <div className="form-group">
                  <label htmlFor="title">タイトル</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={editData.title}
                    onChange={handleEditChange}
                    className="form-control"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="method">配信手法</label>
                  <select
                    id="method"
                    name="method"
                    value={editData.method}
                    onChange={handleEditChange}
                    className="form-control"
                  >
                    {Object.entries(METHOD_MAPPING).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="target">ターゲット</label>
                  <select
                    id="target"
                    name="target"
                    value={editData.target}
                    onChange={handleEditChange}
                    className="form-control"
                  >
                    {Object.entries(TARGET_MAPPING).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">内容</label>
                  <textarea
                    id="description"
                    name="description"
                    value={editData.description}
                    onChange={handleEditChange}
                    className="form-control"
                    rows="10"
                  />
                </div>
              </div>
              
              {/* 編集モードのフッター */}
              <div className="modal-footer">
                <button 
                  className="submit-button" 
                  onClick={handleSaveEdit}
                >
                  保存
                </button>
              </div>
            </>
          ) : (
            <>
              {/* 表示モード */}
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
                      <div 
                        className="meta-author-avatar" 
                        style={{ 
                          backgroundImage: displayData.author?.avatarUrl ? 
                            `url(${displayData.author.avatarUrl})` : 
                            `url(avatar1.jpg)`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      ></div>
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
                    <div className="category-badge" style={{ 
                      backgroundColor: getMethodColor(METHOD_MAPPING[knowledgeDetail?.method] || displayData.category) 
                    }}>
                      <span className="meta-tag-text">
                        {knowledgeDetail?.method ? METHOD_MAPPING[knowledgeDetail.method] : displayData.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* ターゲット行 */}
                  <div className="knowledge-meta-row">
                    <span className="meta-label">ターゲット</span>
                    <div className="category-badge" style={{ 
                      backgroundColor: getTargetColor(TARGET_MAPPING[knowledgeDetail?.target] || displayData.target) 
                    }}>
                      <span className="meta-tag-text">
                        {knowledgeDetail?.target ? TARGET_MAPPING[knowledgeDetail.target] : displayData.target}
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
              
              {/* コンテンツ本文 */}
              <div className="knowledge-detail-section">
              <span className="meta-label">内容</span>
                <div className="knowledge-detail-content">
                  {knowledgeDetail?.description || displayData.content}
                </div>
              </div>
              
              {/* コメントセクション */}
              <div className="comment-section">
                {displayComments.map((comment, index) => (
                  <div key={`comment-${comment.id || index}`} className="comment-item">
                    <div className="comment-timestamp">
                      {comment.createdAt || comment.created_at}
                    </div>
                    <div className="comment-content">
                      <div className="comment-user">
                        <div 
                          className="comment-avatar"
                          style={{ 
                            backgroundImage: comment.author?.avatarUrl || comment.avatar_url ? 
                              `url(${comment.author?.avatarUrl || comment.avatar_url})` : 
                              `url(avatar1.jpg)`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        ></div>
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
                {isEditing ? (
                  // 編集モードの場合は保存ボタンのみ表示
                  <button 
                    className="submit-button" 
                    onClick={handleSaveEdit}
                  >
                    保存
                  </button>
                ) : (
                  // 通常モードの場合はキャンセルとコメント送信ボタンを表示
                  <>
                    <button className="cancel-button" onClick={handleClose}>キャンセル</button>
                    <button 
                      className="submit-button" 
                      onClick={handleSubmit}
                      disabled={!comment.trim()}
                    >
                      送信
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* トースト表示 */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
