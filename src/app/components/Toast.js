'use client';

import { useState, useEffect } from 'react';
import './Toast.css';

/**
 * トースト通知コンポーネント
 * @param {Object} props
 * @param {string} props.message - 表示するメッセージ
 * @param {string} props.type - 通知タイプ ('success', 'error', 'info')
 * @param {number} props.duration - 表示時間（ミリ秒）
 * @param {function} props.onClose - 閉じた時のコールバック
 */
export default function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300); // アニメーション時間
  };

  if (!isVisible) return null;

  return (
    <div className={`toast-container ${isClosing ? 'closing' : ''}`}>
      <div className={`toast ${type}`}>
        <div className="toast-content">
          <span className="toast-message">{message}</span>
        </div>
        <button className="toast-close" onClick={handleClose}>×</button>
      </div>
    </div>
  );
}