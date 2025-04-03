'use client';

import { useState } from 'react';
import './login.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // ログイン処理を実装（APIリクエストなど）
    console.log('ログイン処理:', { email, password });
  };

  return (
    <div className="login-container">
      {/* メインコンテンツ */}
      <div className="main-content">
        <div className="form-container">
          {/* ロゴとタイトル */}
          <div className="logo-section">
            <div className="logo-icon">
              <div style={{ color: 'white', fontSize: '24px' }}>🔥</div>
            </div>
            <h1 className="logo-text">Rebema</h1>
          </div>

          {/* ログインフォーム */}
          <form onSubmit={handleLogin}>
            {/* メールアドレス入力 */}
            <div className="form-group">
              <div className="input-label">
                <label className="label-text">メールアドレス</label>
                <span className="required-mark">※必須</span>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                placeholder="example@mail.com"
                className={isEmailFocused ? 'input-field input-field-focused' : 'input-field'}
                style={isEmailFocused ? { border: '4px solid #1F47F7' } : {}}
                required
              />
            </div>

            {/* パスワード入力 */}
            <div className="form-group">
              <div className="input-label">
                <label className="label-text">パスワード</label>
                <span className="required-mark">※必須</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                placeholder="パスワードを入力"
                className={isPasswordFocused ? 'input-field input-field-focused' : 'input-field'}
                style={isPasswordFocused ? { border: '4px solid #1F47F7' } : {}}
                required
              />
            </div>

            {/* ログインボタン */}
            <button
              type="submit"
              className="login-button"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
