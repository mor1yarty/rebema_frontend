'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { KnowledgeList, SearchBar, CreateKnowledgeModal } from '../components/knowledge';
import Toast from '../components/Toast';
import { METHOD_MAPPING, TARGET_MAPPING } from '../constants/knowledgeConstants';
import './knowledge.css';

export default function KnowledgePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [knowledgeData, setKnowledgeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [toast, setToast] = useState(null);
  
  // APIからナレッジデータを取得する
  useEffect(() => {
    const fetchKnowledgeData = async () => {
      setIsLoading(true);
      try {
        // ローカルストレージからトークンを取得
        const token = localStorage.getItem('token');
        
        // トークンがない場合はログインページにリダイレクト（URLハッシュを保持）
        if (!token) {
          // 現在のURLハッシュを取得
          const hash = window.location.hash;
          // hashがある場合はそれを付けてリダイレクト、ない場合は通常のリダイレクト
          if (hash) {
            router.push(`/login${hash}`);
          } else {
            router.push('/login');
          }
          return;
        }
        
        // ユーザー情報をローカルストレージから取得
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          setUserInfo(JSON.parse(storedUserData));
        }
        
        // APIからナレッジデータを取得
        const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/knowledge/?limit=20&offset=0`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          // 401エラーの場合はトークンが無効なのでログインページにリダイレクト
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            // 現在のURLハッシュを取得
            const hash = window.location.hash;
            // hashがある場合はそれを付けてリダイレクト
            if (hash) {
              router.push(`/login${hash}`);
            } else {
              router.push('/login');
            }
            return;
          }
          throw new Error(`APIリクエストが失敗しました: ${response.status}`);
        }
        
        const data = await response.json();
        
        // APIから取得したデータを変換
        const formattedData = data.map(item => ({
          id: item.id,
          title: item.title,
          // APIのmethodフィールドをcategoryとして使用
          category: METHOD_MAPPING[item.method] || '不明',
          target: TARGET_MAPPING[item.target] || '不明',
          author: item.author.name,
          views: item.views,
          createdAt: item.createdAt,
          // KnowledgeModal用のコメントなどのダミーデータを追加
          comments: [
            {
              author: '田中太郎',
              content: 'このナレッジは非常に参考になりました。',
              createdAt: '2025年4月10日 14:30'
            }
          ],
          content: `
            # ${item.title}
            
            ## 概要
            ${item.title}に関する詳細情報です。
            
            ## ターゲット
            ${TARGET_MAPPING[item.target] || '不明'}
            
            ## メソッド
            ${METHOD_MAPPING[item.method] || '不明'}
            
            ## 備考
            詳細情報はAPI実装後に追加されます。
          `
        }));
        
        setKnowledgeData(formattedData);
      } catch (err) {
        console.error('ナレッジデータの取得に失敗しました:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchKnowledgeData();
  }, [router]);
  
  // モーダルが閉じられた後にデータを更新する処理
  const handleModalClose = (updatedContent) => {
    if (updatedContent) {
      // 更新されたデータでリストを更新
      setKnowledgeData(prevData => {
        return prevData.map(item => {
          if (item.id === updatedContent.id) {
            // APIから取得した新しいデータと既存データを統合
            return {
              ...item,
              views: updatedContent.views, // 閲覧数を更新
              comments: updatedContent.comments || item.comments
            };
          }
          return item;
        });
      });
    }
  };

  // Filter knowledge items based on search query
  const filteredKnowledge = searchQuery
    ? knowledgeData.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : knowledgeData;
  
  // Function to handle search query change
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Function to handle create button click
  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  // トースト表示を閉じる処理
  const handleToastClose = () => {
    setToast(null);
  };

  // Function to handle form submission
  const handleSubmit = async (formData) => {
    try {
      // ローカルストレージからトークンを取得
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      // APIを呼び出してデータを保存
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/knowledge/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData // FormDataオブジェクトをそのまま送信
      });
      
      if (!response.ok) {
        // 401エラーの場合はトークンが無効なのでログインページにリダイレクト
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          // モーダルを閉じる
          setIsCreateModalOpen(false);
          // ログインページにリダイレクト
          router.push('/login');
          return;
        }
        throw new Error(`ナレッジの作成に失敗しました: ${response.status}`);
      }
      
      // レスポンスデータを取得
      const responseData = await response.json();
      
      // モーダルを閉じる
      setIsCreateModalOpen(false);
      
      // 成功トーストを表示
      setToast({
        message: 'ナレッジを作成しました',
        type: 'success'
      });
      
      // ナレッジリストを更新するためにデータを再取得
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('ナレッジ作成エラー:', error);
      
      // エラートーストを表示
      setToast({
        message: error.message,
        type: 'error'
      });
    }
  };
  
  return (
    <div className="page-container">
      {/* サイドバー */}
      <Sidebar userData={userInfo} />
      
      {/* モバイル用ヘッダー */}
      <Header />
      
      {/* メインコンテンツ */}
      <div className="main-content">
        {/* 検索バー */}
        <SearchBar 
          searchQuery={searchQuery} 
          onSearchChange={handleSearchChange} 
        />
        
        {/* ローディング状態と読み込みエラーの表示 */}
        {isLoading && <div className="loading-message">データを読み込み中...</div>}
        {error && <div className="error-message">エラーが発生しました: {error}</div>}
        
        {/* ナレッジリスト */}
        {!isLoading && !error && (
          <KnowledgeList 
            knowledgeData={filteredKnowledge}
            title="PV数が高いナレッジ 👏"
            showCreateButton={true}
            onCreateClick={handleCreateClick}
            isFiltered={searchQuery !== ''}
            onModalClose={handleModalClose}
          />
        )}
      </div>
      
      {/* 新規作成モーダル */}
      {isCreateModalOpen && (
        <CreateKnowledgeModal 
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
      
      {/* トースト通知 */}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
        />
      )}
    </div>
  );
}
