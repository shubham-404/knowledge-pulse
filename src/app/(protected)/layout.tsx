import { requireUser } from "@/lib/auth";
import { Navbar } from "@/components/navbar/Navbar";
import { ChatSessionProvider } from "@/components/chat/ChatSessionProvider";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-screen flex flex-col bg-md-background text-md-on-background">
      <Navbar user={user} />
      <ChatSessionProvider>
        <main className="flex-1 flex flex-col">{children}</main>
      </ChatSessionProvider>
    </div>
  );
}
