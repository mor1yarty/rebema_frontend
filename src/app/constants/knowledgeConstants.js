/**
 * ナレッジ関連の定数
 */

// メソッド（配信手法）のマッピング
export const METHOD_MAPPING = {
  '1': 'メール',
  '2': 'ウェブ',
  '3': 'SNS',
  '300': 'その他'
};

// ターゲットのマッピング
export const TARGET_MAPPING = {
  '1': '新規ユーザー',
  '2': '既存ユーザー',
  '3': '全ユーザー'
};

// メソッド（配信手法）に応じた背景色
export const getMethodColor = (method) => {
  switch (method) {
    case 'メール':
      return '#DDF4FF';  // 青系
    case 'ウェブ':
      return '#FFE4D6';  // オレンジ系
    case 'SNS':
      return '#D6FFE4';  // 緑系
    default:
      return '#F0F0F0';  // グレー系
  }
};

// ターゲットに応じた背景色
export const getTargetColor = (target) => {
  switch (target) {
    case '新規ユーザー':
      return '#EEF9FF';  // 薄い青系
    case '既存ユーザー':
      return '#EBFFF2';  // 薄い緑系
    case '全ユーザー':
      return '#FFF5E6';  // 薄いオレンジ系
    default:
      return '#F8F8F8';  // 薄いグレー系
  }
};