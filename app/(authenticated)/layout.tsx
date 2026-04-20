import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { toSafeUser } from '@/models/user';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  if (!user) {
    redirect('/');
  }

  const safeUser = toSafeUser(user);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar user={{ username: safeUser.username, avatarUrl: safeUser.avatarUrl }} />
      <main className="flex-1 pt-24 pb-12 px-4 md:px-6 max-w-6xl mx-auto w-full relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
