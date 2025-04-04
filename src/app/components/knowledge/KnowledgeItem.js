'use client';

/**
 * ナレッジアイテムコンポーネント
 * @param {Object} props
 * @param {Object} props.item - ナレッジアイテムのデータ
 * @param {function} props.onClick - アイテムクリック時のコールバック
 */
export default function KnowledgeItem({ item, onClick }) {
  return (
    <div className="knowledge-item" onClick={onClick}>
      <div className="knowledge-icon" style={{ backgroundColor: item.iconBgColor }}>
        <span>{item.icon}</span>
      </div>
      
      <div className="knowledge-content">
        <div className="knowledge-title-text">{item.title}</div>
        <div className="knowledge-category">
          <span className="category-label">配信手法</span>
          <div className="category-badge">
            <span className="category-icon">✉️</span>
            <span>{item.category}</span>
          </div>
        </div>
      </div>
      
      <div className="knowledge-meta">
        <div className="knowledge-author">
          <div className="author-avatar"></div>
          <span className="author-name">{item.author}</span>
        </div>
        <div className="knowledge-views">
          <span className="views-icon">👁️</span>
          <span className="views-count">{item.views}</span>
        </div>
      </div>
    </div>
  );
}
