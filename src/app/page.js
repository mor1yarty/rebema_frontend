import { redirect } from 'next/navigation';
import Link from 'next/link';
import Logo from './components/Logo';

export default function Home() {
  // サーバーサイドリダイレクトはコメントアウトしています
  // 即時リダイレクトを有効にしたい場合はコメントを外してください
  // redirect('/login');
  
  return (
    <div className="min-h-screen bg-[#F5F6FB] flex flex-col items-center justify-center p-4 sm:p-8 md:p-16 lg:p-[64px_160px_120px]">
      <div className="flex flex-col items-center w-full max-w-4xl">
        {/* Figmaデザインの構造に合わせて配置 */}
        
        <div className="flex flex-col items-center mb-20 w-full">
          {/* キャッチコピーをロゴの上に配置し、幅を固定して左揃え */}
          <div className="w-[292px] mb-10">
            <h2 className="text-5xl font-bold text-[#333333] leading-[1.5em] text-left">カク、</h2>
            <h2 className="text-5xl font-bold text-[#333333] leading-[1.5em] text-left">ヨム、</h2>
            <h2 className="text-5xl font-bold text-[#333333] leading-[1.5em] text-left">ツナガル。</h2>
          </div>
          
          {/* ロゴを中央に配置 */}
          <div className="flex justify-center w-full">
            <Logo size="medium" />
          </div>
        </div>
        
        {/* ログインボタン - キャッチコピーと同じ縦の大きさにする */}
        <div className="py-[98px] flex flex-col justify-center" style={{ height: '216px' }}>
          <Link 
            href="/login"
            className="btn btn-primary w-[209px]"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
