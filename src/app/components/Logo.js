import Image from 'next/image';

export default function Logo({ size = 'medium' }) {
  // サイズバリエーション
  const sizes = {
    small: {
      container: '36px',
      iconSize: 36,
      textSize: '24px'
    },
    medium: {
      container: '53px',
      iconSize: 53,
      textSize: '54px'
    },
    large: {
      container: '80px',
      iconSize: 80,
      textSize: '72px'
    }
  };
  
  const currentSize = sizes[size] || sizes.medium;
  
  return (
    <div className="flex items-center gap-3">
      <div 
        className="rounded-[12px] flex items-center justify-center overflow-hidden"
        style={{ 
          width: currentSize.container, 
          height: currentSize.container 
        }}
      >
        <Image 
          src="/rebema_logo.svg" 
          alt="Rebema Icon" 
          width={currentSize.iconSize} 
          height={currentSize.iconSize}
          priority // 優先的に読み込み
        />
      </div>
      <h1 
        style={{ 
          color: '#1F47F7',
          fontSize: currentSize.textSize,
          fontWeight: 700,
          fontFamily: 'Noto Sans, sans-serif'
        }}
      >
        Rebema
      </h1>
    </div>
  );
}
