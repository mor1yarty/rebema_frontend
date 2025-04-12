'use client';

import { useState } from 'react';

/**
 * ナレッジ検索バーコンポーネント
 * @param {Object} props
 * @param {string} props.searchQuery - 検索クエリ
 * @param {function} props.onSearchChange - 検索クエリ変更時のコールバック
 */
export default function SearchBar({ searchQuery, onSearchChange }) {
  const [inputValue, setInputValue] = useState(searchQuery || '');

  // 検索実行処理
  const executeSearch = () => {
    onSearchChange(inputValue);
  };

  // Enterキー押下時の処理
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  return (
    <div className="search-section">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          className="search-input" 
          placeholder="ナレッジを検索" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button 
          className="search-button"
          onClick={executeSearch}
          aria-label="検索"
        >
          検索
        </button>
      </div>
    </div>
  );
}
