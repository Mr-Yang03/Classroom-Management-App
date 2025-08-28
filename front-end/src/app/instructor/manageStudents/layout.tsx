import { LeftMenu } from "@/components/leftMenu"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-gray-50">
      <LeftMenu />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
