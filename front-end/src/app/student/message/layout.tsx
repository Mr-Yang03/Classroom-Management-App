import { LeftMenu } from "@/components/leftMenu"
import AuthGuard from "@/components/AuthGuard";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-50">
        <LeftMenu role="student"/>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
