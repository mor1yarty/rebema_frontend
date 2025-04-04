import { redirect } from 'next/navigation';
import Link from 'next/link';

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
            <div className="flex items-center gap-3">
              <div className="w-[53px] h-[53px] bg-[#1F47F7] rounded-[12px] border-2 border-white/50 flex items-center justify-center">
                <div style={{ color: 'white', fontSize: '24px' }}>🔥</div>
              </div>
              <h1 className="text-[#1F47F7] text-[54px] font-bold font-['Noto_Sans']">Rebema</h1>
            </div>
          </div>
        </div>
        
        {/* ログインボタン */}
        <Link 
          href="/login"
          className="bg-[#1F47F7] text-white font-bold py-2 px-4 rounded-[8px] text-center w-[209px] h-[40px] flex items-center justify-center hover:bg-[#0035E0] transition-colors font-['Noto_Sans_JP'] text-sm"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}
