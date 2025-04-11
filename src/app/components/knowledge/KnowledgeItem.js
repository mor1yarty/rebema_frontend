'use client';

/**
 * ナレッジアイテムコンポーネント
 * @param {Object} props
 * @param {Object} props.item - ナレッジアイテムのデータ
 * @param {function} props.onClick - アイテムクリック時のコールバック
 */
export default function KnowledgeItem({ item, onClick }) {
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

  return (
    <div className="knowledge-item" onClick={onClick}>
      <div className="knowledge-content">
        <div className="knowledge-title-text">{item.title}</div>
        <div className="knowledge-category">
          <span className="category-label">配信手法</span>
          <div className="category-badge" style={{ backgroundColor: getMethodColor(item.category) }}>
            <span>{item.category}</span>
          </div>
        </div>
        <div className="knowledge-category">
          <span className="category-label">ターゲット</span>
          <div className="category-badge" style={{ backgroundColor: getTargetColor(item.category) }}>
            <span>{item.target}</span>
          </div>
        </div>
      </div>
      
      <div className="knowledge-meta">
        <div className="knowledge-date">
          <span className="date-value">{item.createdAt}</span>
        </div>
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
