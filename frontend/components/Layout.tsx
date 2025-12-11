// 'use client';

// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/auth-context';
// import { 
//   LayoutDashboard, MessageSquare, FileText, Presentation, 
//   Globe, Smartphone, Settings, LogOut, CreditCard, Users, Video, Mail, Linkedin
// } from 'lucide-react';

// interface LayoutProps {
//   children: React.ReactNode;
// }

// export default function Layout({ children }: LayoutProps) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { user, logout } = useAuth();

//   const navigation = [
//     { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
//     { name: 'AI Chat', href: '/chat', icon: MessageSquare },
//     { name: 'Documents', href: '/documents', icon: FileText },
//     { name: 'Media', href: '/media', icon: Video },
//     { name: 'Presentations', href: '/presentations', icon: Presentation },
//     { name: 'Websites', href: '/websites', icon: Globe },
//     { name: 'Mobile Apps', href: '/mobile-apps', icon: Smartphone },
//     { name: 'LinkedIn', href: '/linkedin', icon: Linkedin },
//     { name: 'Social Media', href: '/social-media', icon: Globe },
//     { name: 'Email', href: '/email', icon: Mail },
//   ];

//   const handleLogout = () => {
//     logout();
//     router.push('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
//         <div className="p-6 border-b border-gray-200 flex-shrink-0">
//           <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
//             AI SaaS Platform
//           </h1>
//         </div>

//         <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//           {navigation.map((item) => {
//             const Icon = item.icon;
//             const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
//             return (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
//                   isActive
//                     ? 'bg-red-50 text-red-500 font-semibold'
//                     : 'text-gray-700 hover:bg-gray-50'
//                 }`}
//               >
//                 <Icon className="w-5 h-5" />
//                 {item.name}
//               </Link>
//             );
//           })}
//         </nav>

//         <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0">
//           <Link
//             href="/pricing"
//             className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition"
//           >
//             <CreditCard className="w-5 h-5" />
//             Pricing
//           </Link>
//           {user?.role === 'ADMIN' && (
//             <Link
//               href="/admin"
//               className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition"
//             >
//               <Users className="w-5 h-5" />
//               Admin
//             </Link>
//           )}
//           <Link
//             href="/settings"
//             className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition"
//           >
//             <Settings className="w-5 h-5" />
//             Settings
//           </Link>
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
//           >
//             <LogOut className="w-5 h-5" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="ml-64">
//         {/* Top Bar */}
//         <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             {navigation.find(nav => pathname === nav.href || pathname?.startsWith(nav.href + '/'))?.name || 'Dashboard'}
//           </h2>
//           <div className="flex items-center gap-4">
//             <div className="text-right">
//               <p className="text-sm text-gray-600">{user?.name || user?.email}</p>
//               <p className="text-xs text-gray-500">
//                 {user?.subscriptionPlan} Plan • {user?.credits} credits
//               </p>
//             </div>
//             {user?.avatar ? (
//               <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
//             ) : (
//               <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold">
//                 {user?.name?.[0] || user?.email[0].toUpperCase()}
//               </div>
//             )}
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="p-8">{children}</main>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/auth-context';
// import { 
//   LayoutDashboard, MessageSquare, FileText, Presentation, 
//   Globe, Smartphone, Settings, LogOut, CreditCard, Users, Video, Mail, Linkedin, Menu
// } from 'lucide-react';
// import { useState } from 'react';

// interface LayoutProps {
//   children: React.ReactNode;
// }

// export default function Layout({ children }: LayoutProps) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { user, logout } = useAuth();
//   const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar toggle state

//   const navigation = [
//     { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
//     { name: 'AI Chat', href: '/chat', icon: MessageSquare },
//     { name: 'Documents', href: '/documents', icon: FileText },
//     { name: 'Media', href: '/media', icon: Video },
//     { name: 'Presentations', href: '/presentations', icon: Presentation },
//     { name: 'Websites', href: '/websites', icon: Globe },
//     { name: 'Mobile Apps', href: '/mobile-apps', icon: Smartphone },
//     { name: 'LinkedIn', href: '/linkedin', icon: Linkedin },
//     { name: 'Social Media', href: '/social-media', icon: Globe },
//     { name: 'Email', href: '/email', icon: Mail },
//   ];

//   const handleLogout = () => {
//     logout();
//     router.push('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${
//           sidebarOpen ? 'w-64' : 'w-16'
//         }`}
//       >
//         <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//           {sidebarOpen && (
//             <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
//               AI SaaS Platform
//             </h1>
//           )}
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-2 rounded hover:bg-gray-100"
//           >
//             <Menu className="w-5 h-5 text-gray-700" />
//           </button>
//         </div>

//         <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
//           {navigation.map((item) => {
//             const Icon = item.icon;
//             const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
//             return (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
//                   isActive
//                     ? 'bg-red-50 text-red-500 font-semibold'
//                     : 'text-gray-700 hover:bg-gray-50'
//                 }`}
//               >
//                 <Icon className="w-5 h-5" />
//                 {sidebarOpen && item.name}
//               </Link>
//             );
//           })}
//         </nav>

//         <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0">
//           <Link
//             href="/pricing"
//             className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition"
//           >
//             <CreditCard className="w-5 h-5" />
//             {sidebarOpen && 'Pricing'}
//           </Link>
//           {user?.role === 'ADMIN' && (
//             <Link
//               href="/admin"
//               className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition"
//             >
//               <Users className="w-5 h-5" />
//               {sidebarOpen && 'Admin'}
//             </Link>
//           )}
//           <Link
//             href="/settings"
//             className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition"
//           >
//             <Settings className="w-5 h-5" />
//             {sidebarOpen && 'Settings'}
//           </Link>
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
//           >
//             <LogOut className="w-5 h-5" />
//             {sidebarOpen && 'Logout'}
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
//         {/* Top Bar */}
//         <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             {navigation.find(nav => pathname === nav.href || pathname?.startsWith(nav.href + '/'))?.name || 'Dashboard'}
//           </h2>
//           <div className="flex items-center gap-4">
//             <div className="text-right">
//               <p className="text-sm text-gray-600">{user?.name || user?.email}</p>
//               <p className="text-xs text-gray-500">
//                 {user?.subscriptionPlan} Plan • {user?.credits} credits
//               </p>
//             </div>
//             {user?.avatar ? (
//               <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
//             ) : (
//               <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold">
//                 {user?.name?.[0] || user?.email[0].toUpperCase()}
//               </div>
//             )}
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="p-8">{children}</main>
//       </div>
//     </div>
//   );
// }

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Presentation,
  Globe,
  Smartphone,
  Settings,
  LogOut,
  CreditCard,
  Users,
  Video,
  Mail,
  Linkedin,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true); // Desktop sidebar state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // Mobile sidebar state
  const [userMenuOpen, setUserMenuOpen] = useState(false); // User menu dropdown

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Chat', href: '/chat', icon: MessageSquare },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Media', href: '/media', icon: Video },
    { name: 'Presentations', href: '/presentations', icon: Presentation },
    { name: 'Websites', href: '/websites', icon: Globe },
    { name: 'Mobile Apps', href: '/mobile-apps', icon: Smartphone },
    { name: 'LinkedIn', href: '/linkedin', icon: Linkedin },
    { name: 'Social Media', href: '/social-media', icon: Globe },
    { name: 'Email', href: '/email', icon: Mail },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const NavLinks = ({ mobile = false, onItemClick = () => {} }) => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-red-50 text-red-500 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {(!mobile || sidebarOpen) && <span className="truncate">{item.name}</span>}
          </Link>
        );
      })}
    </>
  );

  const BottomLinks = ({ mobile = false, onItemClick = () => {} }) => (
    <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0">
      <Link
        href="/pricing"
        onClick={onItemClick}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <CreditCard className="w-5 h-5 flex-shrink-0" />
        {(!mobile || sidebarOpen) && <span className="truncate">Pricing</span>}
      </Link>

      {user?.role === 'ADMIN' && (
        <Link
          href="/admin"
          onClick={onItemClick}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Users className="w-5 h-5 flex-shrink-0" />
          {(!mobile || sidebarOpen) && <span className="truncate">Admin</span>}
        </Link>
      )}

      <Link
        href="/settings"
        onClick={onItemClick}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <Settings className="w-5 h-5 flex-shrink-0" />
        {(!mobile || sidebarOpen) && <span className="truncate">Settings</span>}
      </Link>

      <button
        onClick={() => {
          handleLogout();
          onItemClick();
        }}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-5 h-5 flex-shrink-0" />
        {(!mobile || sidebarOpen) && <span className="truncate">Logout</span>}
      </button>
    </div>
  );

  const currentPageName = navigation.find(
    (nav) => pathname === nav.href || pathname?.startsWith(nav.href + '/')
  )?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex-col overflow-hidden transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo Section */}
        <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          {sidebarOpen && (
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              AI SaaS
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          <NavLinks />
        </nav>

        {/* Bottom Links */}
        <BottomLinks />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-64 h-full bg-white shadow-2xl flex flex-col z-50">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h1 className="text-lg font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                AI SaaS
              </h1>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
              <NavLinks mobile={true} onItemClick={() => setMobileSidebarOpen(false)} />
            </nav>

            <BottomLinks mobile={true} onItemClick={() => setMobileSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content Wrapper */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 md:px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 truncate">
                {currentPageName}
              </h2>
            </div>

            {/* Right Section - User Profile */}
            <div className="relative flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* User Info - Hidden on mobile */}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                  {user?.name || user?.email || 'Guest'}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-xs">
                  {user?.subscriptionPlan} • {user?.credits} credits
                </p>
              </div>

              {/* Avatar with Dropdown */}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex-shrink-0 relative"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-9 sm:w-10 h-9 sm:h-10 rounded-full object-cover border-2 border-gray-200 hover:border-red-500 transition-colors"
                  />
                ) : (
                  <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.[0]?.toUpperCase() || user?.email[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-40">
                  {/* Mobile User Info */}
                  <div className="sm:hidden px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-700">{user?.name || user?.email}</p>
                    <p className="text-xs text-gray-500">
                      {user?.subscriptionPlan} • {user?.credits} credits
                    </p>
                  </div>

                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>

                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  <Link
                    href="/pricing"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pricing</span>
                  </Link>

                  <hr className="my-2" />

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>

      {/* Close user menu when clicking outside */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </div>
  );
}
