'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '../components/Logo';
import Header from '../components/Header';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    // ダミー認証処理 - 実際のAPIができるまでの仮実装
    console.log('ログイン処理:', { email, password });
    
    // ダミー認証の例 - 何か入力されていればログイン成功とする
    if (email && password) {
      // 成功時の処理 - マイページへリダイレクト
      setTimeout(() => {
        setIsLoading(false);
        router.push('/mypage');
      }, 1000); // 1秒の遅延を追加してローディング表示のデモ
    } else {
      // 失敗時の処理
      setTimeout(() => {
        setIsLoading(false);
        setLoginError('メールアドレスとパスワードを入力してください');
      }, 1000);
    }
  };

  return (
    <div className="page-container bg-login">
      {/* モバイル用ヘッダー */}
      <Header showBackButton={true} />
      
      {/* メインコンテンツ */}
      <div className="main-content flex items-center justify-center">
        <div className="form-container card">
          {/* ロゴとタイトル */}
          <div className="logo-section flex justify-center mb-12">
            <Logo size="medium" />
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

            {/* エラーメッセージ表示 */}
            {loginError && <div className="error-message">{loginError}</div>}

            {/* ログインボタン - テキストをContinueに変更 */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'ログイン中...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
