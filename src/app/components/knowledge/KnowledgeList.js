'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
 * @param {function} props.onModalClose - モーダルが閉じられた時のコールバック
 */
export default function KnowledgeList({ 
  knowledgeData, 
  title, 
  showCreateButton = false, 
  onCreateClick,
  isFiltered = false,
  onModalClose
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  
  // URLからナレッジIDを取得してモーダルを表示する
  useEffect(() => {
    // URLに含まれるハッシュ部分を取得
    const hash = window.location.hash;
    if (hash && hash.startsWith('#')) {
      const knowledgeIdFromHash = hash.substring(1); // '#'を除去してIDを取得
      
      // 該当するナレッジを探す - 型変換を考慮する
      const knowledge = knowledgeData.find(item => {
        // 両方を文字列に変換して比較
        return String(item.id) === String(knowledgeIdFromHash);
      });
      
      if (knowledge) {
        // 見つかった場合はモーダルを開く
        setModalContent(knowledge);
        setIsModalOpen(true);
      }
    }
  }, [knowledgeData]);
  
  // Function to open modal with content
  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
    
    // URLの末尾にナレッジIDを追加
    window.history.pushState({}, '', `${pathname}#${content.id}`);
  };

  // Function to close modal
  const closeModal = (updatedContent) => {
    setIsModalOpen(false);
    
    // URLからナレッジIDを削除
    window.history.pushState({}, '', pathname);
    
    // 更新されたコンテンツがある場合は親コンポーネントに通知
    if (updatedContent && onModalClose) {
      onModalClose(updatedContent);
    }
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
