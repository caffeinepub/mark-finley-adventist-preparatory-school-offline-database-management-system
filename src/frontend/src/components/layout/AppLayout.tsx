import { ReactNode } from 'react';
import { SidebarNav } from './SidebarNav';
import { Header } from './Header';
import { Footer } from './Footer';
import { OfflineStatusBanner } from '../offline/OfflineStatusBanner';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <OfflineStatusBanner />
      <div className="flex-1 flex">
        <SidebarNav />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
