import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
    const [studentCount, setStudentCount] = useState(0);
    const [courseCount, setCourseCount] = useState(0);
    const { user } = useAuth();

    const fetchStudentCount = async () => {
        try {
            const { data } = await api.get('/students');
            const count = data.length;
            setStudentCount(count);
            console.log('Student count:', count);
        } catch (error) {
            console.error('Error fetching student count:', error);
        }
    }

    const fetchCourseCount = async () => {
        try {
            const { data } = await api.get('/courses');
            const count = data.length;
            setCourseCount(count);
            console.log('Course count:', count);
        } catch (error) {
            console.error('Error fetching course count:', error);
        }
    }


    useEffect(() => {
        fetchStudentCount();
        fetchCourseCount();
    }, []);

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 md:mb-8">Dashboard</h1>
            <div className="bg-white p-4 md:p-6 rounded-lg">
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Welcome back, {user?.username}!</h2>
                <p className="text-sm md:text-base text-slate-600">
                    Use the navigation to manage student records, course lists, or manage grades and reporting.
                </p>
                <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <div className="p-4 bg-blue-50 text-blue-800 rounded-md border-[0.5px] border-blue-100 flex flex-col justify-center">
                        <p className="font-medium text-lg">Total Students</p>
                        <p className="text-3xl font-bold mt-2">{studentCount}</p>
                    </div>
                    <div className="p-4 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-100 ">
                        <p className="font-medium text-lg">Active Courses</p>
                        <p className="text-3xl font-bold mt-2">{courseCount}</p>
                    </div>
                    <div className="p-4 bg-indigo-50 text-indigo-800 rounded-md border border-indigo-100">
                        <p className="font-medium text-lg">System Role</p>
                        <p className="text-2xl font-bold mt-2 capitalize">{user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;