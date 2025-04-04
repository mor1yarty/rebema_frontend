'use client';

import { useState } from 'react';
import KnowledgeItem from './KnowledgeItem';
import KnowledgeModal from './KnowledgeModal';
import './KnowledgeList.css';

/**
 * ナレッジリストコンポーネント
 * @param {Object} props
 * @param {Array} props.knowledgeData - ナレッジデータの配列
 * @param {string} props.title - セクションのタイトル
 * @param {boolean} props.showCreateButton - 作成ボタンを表示するかどうか
 * @param {function} props.onCreateClick - 作成ボタンクリック時のコールバック
 * @param {boolean} props.isFiltered - 検索フィルターが適用されているかどうか
 */
export default function KnowledgeList({ 
  knowledgeData, 
  title, 
  showCreateButton = false, 
  onCreateClick,
  isFiltered = false
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  
  // Function to open modal with content
  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className="knowledge-list-container">
      <div className="knowledge-header">
        <h2 className="knowledge-title">{title}</h2>
        {showCreateButton && (
          <button className="create-button" onClick={onCreateClick}>
            <span>+</span>
            新規作成
          </button>
        )}
      </div>
      
      <div className="knowledge-items">
        {knowledgeData.length > 0 ? (
          knowledgeData.map(item => (
            <KnowledgeItem 
              key={item.id} 
              item={item} 
              onClick={() => openModal(item)} 
            />
          ))
        ) : (
          <div className="no-knowledge-message">
            {isFiltered 
              ? "検索条件に一致するナレッジはありません。" 
              : "ナレッジはまだありません。"}
          </div>
        )}
      </div>

      {/* ナレッジ詳細モーダル */}
      {isModalOpen && modalContent && (
        <KnowledgeModal 
          content={modalContent} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
}
