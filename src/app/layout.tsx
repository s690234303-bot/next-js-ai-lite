import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระบบรายงานสถานการณ์ Real-time",
  description: "แอปพลิเคชันแจ้งเหตุและรายงานสถานการณ์แบบ Real-time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}