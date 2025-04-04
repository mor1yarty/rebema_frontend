'use client';

/**
 * ナレッジ検索バーコンポーネント
 * @param {Object} props
 * @param {string} props.searchQuery - 検索クエリ
 * @param {function} props.onSearchChange - 検索クエリ変更時のコールバック
 */
export default function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="search-section">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          className="search-input" 
          placeholder="ナレッジを検索" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
