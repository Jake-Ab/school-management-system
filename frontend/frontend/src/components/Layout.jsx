import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, BookOpen, GraduationCap, LayoutDashboard, LogOut } from 'lucide-react';

const Sidebar = () => {
    const { logout, user } = useAuth();
    
    return (
        <div className="w-16 md:w-64 bg-slate-900 text-white min-h-screen flex flex-col transition-all duration-300 shrink-0">
            <div className="p-4 border-b border-slate-700 flex flex-col items-center md:items-start md:block">
                <h1 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
                    <GraduationCap className="min-w-6" /> <span className="hidden md:block whitespace-nowrap">SMS Admin</span>
                </h1>
                <p className="text-sm text-slate-400 mt-2 hidden md:block whitespace-nowrap">Logged in as: {user?.username}</p>
            </div>
            
            <nav className="flex flex-col p-2 space-y-2 flex-1 items-center md:items-stretch overflow-y-auto overflow-x-hidden">
                <Link to="/" className="flex items-center justify-center md:justify-start gap-3 p-3 md:p-2 hover:bg-slate-800 rounded w-full" title="Dashboard">
                    <LayoutDashboard size={20} className="shrink-0" /> <span className="hidden md:inline whitespace-nowrap">Dashboard</span>
                </Link>
                <Link to="/students" className="flex items-center justify-center md:justify-start gap-3 p-3 md:p-2 hover:bg-slate-800 rounded w-full" title="Students">
                    <Users size={20} className="shrink-0" /> <span className="hidden md:inline whitespace-nowrap">Students</span>
                </Link>
                <Link to="/courses" className="flex items-center justify-center md:justify-start gap-3 p-3 md:p-2 hover:bg-slate-800 rounded w-full" title="Courses">
                    <BookOpen size={20} className="shrink-0" /> <span className="hidden md:inline whitespace-nowrap">Courses</span>
                </Link>
                <Link to="/grades" className="flex items-center justify-center md:justify-start gap-3 p-3 md:p-2 hover:bg-slate-800 rounded w-full" title="Grades & Reports">
                    <GraduationCap size={20} className="shrink-0" /> <span className="hidden md:inline whitespace-nowrap">Grades & Reports</span>
                </Link>
            </nav>

            <div className="p-2 border-t border-slate-700">
                <button onClick={logout} className="flex items-center justify-center md:justify-start gap-3 w-full p-3 md:p-2 text-red-400 hover:bg-slate-800 rounded" title="Logout">
                    <LogOut size={20} className="shrink-0" /> <span className="hidden md:inline whitespace-nowrap">Logout</span>
                </button>
            </div>
        </div>
    );
}

const Layout = () => {
    const { user } = useAuth();
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            <Sidebar />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;