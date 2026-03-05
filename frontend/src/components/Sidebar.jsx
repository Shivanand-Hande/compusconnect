import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    Users,
    Calendar,
    Bell,
    Settings,
    LogOut,
    PlusCircle,
    LayoutDashboard,
    ShieldCheck,
    Megaphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const { isDarkMode } = useTheme();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
        { name: 'Clubs', icon: Users, path: '/app/clubs' },
        { name: 'Events', icon: Calendar, path: '/app/events' },
        { name: 'Announcements', icon: Megaphone, path: '/app/announcements' },
        { name: 'Notifications', icon: Bell, path: '/app/notifications' },
        { name: 'Scan Attendance', icon: ShieldCheck, path: '/app/scan' },
    ];

    if (user?.role === 'Super Admin') {
        menuItems.push({ name: 'Admin Panel', icon: ShieldCheck, path: '/app/admin' });
    }

    if (user?.role === 'Club Admin' || (user?.role === 'Super Admin' && user?.club)) {
        menuItems.push({ name: 'My Club', icon: PlusCircle, path: '/app/my-club' });
    }

    menuItems.push({ name: 'My Profile', icon: Settings, path: '/app/profile' });

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-100 dark:border-gray-800/50 transition-all duration-300 z-50">
            <div className="flex flex-col h-full p-4">
                <div className="flex items-center gap-2 px-2 mb-8">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">C</span>
                    </div>
                    <h1 className="text-xl font-bold dark:text-white">CampusConnect</h1>
                </div>

                <nav className="flex-1 space-y-1">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group
                ${isActive
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 -translate-y-0.5'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:text-primary-600 dark:hover:text-primary-400'}
              `}
                        >
                            <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="font-bold tracking-tight">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 px-3 py-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <Users className="text-gray-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate dark:text-white">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-medium"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
