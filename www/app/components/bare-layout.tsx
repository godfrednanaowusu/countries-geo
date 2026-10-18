// components/bare-layout.js
export default function BareLayout({ children }: { children: React.ReactNode }) {
    return (
      <div style={{ background:'red', width:'100%' }}>
        {children}
      </div>
    );
  }
  