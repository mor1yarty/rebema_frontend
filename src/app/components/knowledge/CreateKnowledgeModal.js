'use client';

import { useState } from 'react';

/**
 * ナレッジ作成モーダルコンポーネント
 * @param {Object} props
 * @param {function} props.onClose - モーダルを閉じる際のコールバック
 * @param {function} props.onSubmit - フォーム送信時のコールバック
 */
export default function CreateKnowledgeModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'メール',
    content: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="create-knowledge-form">
          <div className="modal-header">
            <h2>新規ナレッジ作成</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">タイトル</label>
              <input 
                type="text" 
                id="title"
                name="title"
                placeholder="ナレッジのタイトルを入力" 
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">カテゴリー</label>
              <select 
                id="category"
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
            <div className="form-group">
              <label htmlFor="content">内容</label>
              <textarea 
                id="content"
                name="content"
                rows="5" 
                placeholder="ナレッジの内容を入力"
                value={formData.content}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="form-buttons">
              <button type="button" className="cancel-button" onClick={onClose}>キャンセル</button>
              <button type="submit" className="submit-button">作成</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
