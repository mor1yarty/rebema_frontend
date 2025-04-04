export default function Logo({ size = 'medium' }) {
  // サイズバリエーション
  const sizes = {
    small: {
      container: '36px',
      badge: '36px',
      fontSize: '20px',
      textSize: '24px'
    },
    medium: {
      container: '53px',
      badge: '53px',
      fontSize: '24px',
      textSize: '54px'
    },
    large: {
      container: '80px',
      badge: '80px',
      fontSize: '36px',
      textSize: '72px'
    }
  };
  
  const currentSize = sizes[size] || sizes.medium;
  
  return (
    <div className="flex items-center gap-3">
      <div 
        className="rounded-[12px] border-2 border-white/50 flex items-center justify-center"
        style={{ 
          backgroundColor: '#1F47F7',
          width: currentSize.container, 
          height: currentSize.badge 
        }}
      >
        <div style={{ color: 'white', fontSize: currentSize.fontSize }}>🔥</div>
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