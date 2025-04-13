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
    method: '1',
    target: '1',
    description: '',
    category: '',
    files: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ファイル選択の処理
  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      files: e.target.files
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
    
    // FormDataオブジェクトを作成してマルチパートフォームデータとして送信
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('title', formData.title);
    formDataToSubmit.append('method', formData.method);
    formDataToSubmit.append('target', formData.target);
    formDataToSubmit.append('description', formData.description);
    
    if (formData.category) {
      formDataToSubmit.append('category', formData.category);
    } else {
      formDataToSubmit.append('category', '');
    }
    
    // ファイルが選択されている場合は追加
    if (formData.files.length > 0) {
      for (let i = 0; i < formData.files.length; i++) {
        formDataToSubmit.append('files', formData.files[i]);
      }
    } else {
      formDataToSubmit.append('files', '');
    }
    
    onSubmit(formDataToSubmit);
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

  // メソッドとターゲットの選択肢
  const methodOptions = [
    { value: '1', label: 'メール' },
    { value: '2', label: 'ウェブ' },
    { value: '3', label: 'アプリ' }
  ];
  
  const targetOptions = [
    { value: '1', label: '新規ユーザー' },
    { value: '2', label: '既存ユーザー' },
    { value: '3', label: '休眠ユーザー' }
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
                name="method"
                value={formData.method}
                onChange={handleChange}
              >
                {methodOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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
                {targetOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* コンテンツ本文 */}
            <div className="knowledge-detail-section">
              <div className="knowledge-detail-label">内容</div>
              <textarea 
                className="knowledge-detail-content"
                name="description"
                value={formData.description}
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
