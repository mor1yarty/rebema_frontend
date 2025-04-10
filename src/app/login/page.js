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

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    try {
      // フォームデータをURLエンコードされた形式に変換
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('password', password);

      // auth/loginエンドポイントにリクエストを送信
      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/auth/login`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!loginResponse.ok) {
        throw new Error('ログインに失敗しました');
      }

      const { jwt_token: token } = await loginResponse.json();

      // auth/meエンドポイントでユーザー情報を取得
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/auth/me`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('ユーザー情報の取得に失敗しました');
      }

      const userData = await userResponse.json();
      
      // トークンとユーザー情報をローカルストレージに保存
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));

      // マイページへ遷移
      router.push('/mypage');
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    } finally {
      setIsLoading(false);
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
