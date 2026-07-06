import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { GraduationCap } from 'lucide-react';

const Login = () => {
    const { user, login } = useAuth();
    const [username, setUsername] = useState('');
    const [ isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (user) {
        return <Navigate to="/" replace />;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await axios.post('http://localhost:8081/api/auth/login', { username, password });

            setTimeout( () =>{
            login(res.data.user, res.data.token);
            }, 6000)
            setIsLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <GraduationCap size={48} className="mx-auto text-blue-600" />
                    <h2 className="mt-4 text-2xl font-bold text-slate-900">Student Management System</h2>
                    <p className="text-slate-500 mt-2">Sign in to your staff account</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 w-full rounded border-slate-300 p-2 border focus:border-blue-500 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full rounded border-slate-300 p-2 border focus:border-blue-500 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-800 text-white rounded-full px-2 py-4 hover:bg-purple-900 font-medium transition"
                    >
                       {isLoading ? (
                        <>signing in...</>
                        ) : (<>sign in</>)}
                    </button>
                    <p className="text-sm text-center text-slate-500 mt-4">
                        contact your developer for account access
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;