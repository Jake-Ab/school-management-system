import { useState, useEffect } from 'react';
import api from '../api/axios';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        student_id: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: 'Male',
        email: '',
        phone: '',
        address: ''
    });
    
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/students');
            setStudents(data);
        } catch (err) {
            console.error("Failed to fetch", err);
        }
    };

    const handleDownloadReport = async (studentId, studentName) => {
        try {
            const response = await api.get(`/academic/report/${studentId}/pdf`, {
                responseType: 'blob' // Important for handling binary data
            });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a'); // Anchor link for downloading
            link.href = url;
            link.setAttribute('download', `Report_${studentName.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the report', error);
            alert('Failed to download report. Please try again.');
        }
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/students', formData);
            setIsModalOpen(false);
            setFormData({
                student_id: '', first_name: '', last_name: '', date_of_birth: '', gender: 'Male', email: '', phone: '', address: ''
            });
            fetchStudents(); // Refresh the list
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add student");
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 sm:gap-0">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Students Directory</h1>
                <button 
                    className="bg-purple-800 text-white px-4 py-2 rounded-full hover:bg-purple-900 w-full sm:w-auto" 
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Student
                </button>
            </div>
            
            <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-slate-50 text-xs sm:text-sm font-medium text-slate-500 uppercase">
                        <tr>
                            <th className="p-3 sm:p-4 border-b">ID</th>
                            <th className="p-3 sm:p-4 border-b">Name</th>
                            <th className="p-3 sm:p-4 border-b">Email</th>
                            <th className="p-3 sm:p-4 border-b hidden md:table-cell">Phone</th>
                            <th className="p-3 sm:p-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {students.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50">
                                <td className="p-3 sm:p-4 border-b">{s.student_id}</td>
                                <td className="p-3 sm:p-4 border-b font-medium sm:font-normal">{s.first_name} {s.last_name}</td>
                                <td className="p-3 sm:p-4 border-b text-slate-600 truncate max-w-[120px] sm:max-w-none">{s.email}</td>
                                <td className="p-3 sm:p-4 border-b text-slate-600 hidden md:table-cell">{s.phone}</td>
                                <td className="p-3 sm:p-4 border-b flex flex-col sm:flex-row gap-2 sm:gap-3">
                                    <button className="text-blue-500 hover:underline text-left text-xs sm:text-sm">Edit</button>
                                    <button 
                                        className="text-emerald-600 hover:underline text-left text-xs sm:text-sm font-medium whitespace-nowrap"
                                        onClick={() => handleDownloadReport(s.id, `${s.first_name} ${s.last_name}`)}
                                    >
                                        📄 Report
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {students.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-6 sm:p-8 text-center text-slate-500">No students found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Student Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-5 sm:p-6 my-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg sm:text-xl font-bold">Add New Student</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-800 text-2xl leading-none">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Student ID</label>
                                    <input type="text" name="student_id" value={formData.student_id} onChange={handleChange} required className="w-full border border-slate-300 rounded p-2 text-sm" />
                                </div>
                               
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-slate-300 rounded p-2 text-sm">
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full border border-slate-300 rounded p-2 text-sm" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full border border-slate-300 rounded p-2 text-sm" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                                    <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required className="w-full border border-slate-300 rounded p-2 text-sm" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-slate-300 rounded p-2 text-sm" />
                                </div>
                                <div className="col-span-1 sm:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-slate-300 rounded p-2 text-sm" />
                                </div>
                                <div className="col-span-1 sm:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                    <textarea name="address" value={formData.address} onChange={handleChange} className="w-full border border-slate-300 rounded p-2 text-sm" rows="3"></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium w-full sm:w-auto">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium w-full sm:w-auto">Save Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;