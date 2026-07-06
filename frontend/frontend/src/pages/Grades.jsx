import { useState, useEffect } from 'react';
import api from '../api/axios';

const Grades = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);

    // Modal Visibility
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

    // Form Data Tracking
    const [enrollData, setEnrollData] = useState({
        student_id: '',
        course_id: '',
        semester: 'Fall',
        year: new Date().getFullYear()
    });

    const [gradeData, setGradeData] = useState({
        enrollment_id: '',
        grade_value: '',
        letter_grade: 'A',
        remarks: ''
    });

    useEffect(() => {
        fetchData();
        fetchDropdownContext();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await api.get('/academic/enrollments');
            setEnrollments(data);
        } catch (err) {
            console.error("Failed to fetch enrollments", err);
        }
    };

    const fetchDropdownContext = async () => {
        try {
            const [studentsRes, coursesRes] = await Promise.all([
                api.get('/students'),
                api.get('/courses')
            ]);
            setStudents(studentsRes.data);
            setCourses(coursesRes.data);
        } catch (err) {
            console.error("Failed to fetch dropdown contexts", err);
        }
    };

    // Enroll Submission
    const handleEnrollSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/academic/enroll', enrollData);
            setIsEnrollModalOpen(false);
            setEnrollData({ student_id: '', course_id: '', semester: 'Fall', year: new Date().getFullYear() });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to enroll student");
        }
    };

    // Grade Submission
    const openGradeModal = (enrollment_id) => {
        setGradeData({ enrollment_id, grade_value: '', letter_grade: 'A', remarks: '' });
        setIsGradeModalOpen(true);
    };

    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/academic/grade', gradeData);
            setIsGradeModalOpen(false);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to record grade");
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 sm:gap-0">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Grades & Enrollments</h1>
                <button 
                    className="bg-purple-800 text-white px-4 py-2 rounded-full hover:bg-purple-900 w-full sm:w-auto text-sm sm:text-base font-medium"
                    onClick={() => setIsEnrollModalOpen(true)}
                >
                    Enroll Student
                </button>
            </div>
            
            <div className="bg-white rounded shadow-sm border border-slate-200 p-4 sm:p-6 mb-8 text-sm text-slate-800 w-full overflow-x-auto">
                <p className="text-slate-500 mb-4 text-xs sm:text-sm">View and record student grades per semester.</p>
                <table className="w-full text-left border min-w-[600px]">
                    <thead className="bg-slate-50 font-medium text-slate-500 uppercase border-b text-xs sm:text-sm">
                        <tr>
                            <th className="p-3">Student</th>
                            <th className="p-3">Course</th>
                            <th className="p-3">Semester</th>
                            <th className="p-3">Grade</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs sm:text-sm">
                        {enrollments.map(e => (
                            <tr key={e.enrollment_id} className="hover:bg-slate-50 border-b">
                                <td className="p-3">{e.first_name} {e.last_name} <span className="text-slate-500 hidden sm:inline">({e.student_code})</span></td>
                                <td className="p-3">{e.course_code} <span className="hidden sm:inline">- {e.course_name}</span></td>
                                <td className="p-3">{e.semester} {e.year}</td>
                                <td className="p-3 font-semibold">{e.letter_grade || 'None'}</td>
                                <td className="p-3">
                                    <button 
                                        onClick={() => openGradeModal(e.enrollment_id)}
                                        className="text-blue-500 hover:underline text-xs sm:text-sm"
                                    >
                                        Record Grade
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {enrollments.length === 0 && (
                            <tr><td colSpan="5" className="p-6 text-center text-slate-500">No enrollments yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Enroll Modal */}
            {isEnrollModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5 sm:p-6 my-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg sm:text-xl font-bold">Enroll Student</h2>
                            <button onClick={() => setIsEnrollModalOpen(false)} className="text-slate-500 hover:text-slate-800 text-2xl leading-none">&times;</button>
                        </div>
                        <form onSubmit={handleEnrollSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Student</label>
                                <select 
                                    className="w-full border border-slate-300 rounded p-2 text-sm text-slate-700" 
                                    value={enrollData.student_id} 
                                    onChange={e => setEnrollData({...enrollData, student_id: e.target.value})} 
                                    required
                                >
                                    <option value="" disabled>Choose a student...</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.student_id})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Course</label>
                                <select 
                                    className="w-full border border-slate-300 rounded p-2 text-sm text-slate-700" 
                                    value={enrollData.course_id} 
                                    onChange={e => setEnrollData({...enrollData, course_id: e.target.value})} 
                                    required
                                >
                                    <option value="" disabled>Choose a course...</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>{c.course_code} - {c.course_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
                                    <select 
                                        className="w-full border border-slate-300 rounded p-2 text-sm text-slate-700" 
                                        value={enrollData.semester} 
                                        onChange={e => setEnrollData({...enrollData, semester: e.target.value})}
                                    >
                                        <option value="Fall">Fall</option>
                                        <option value="Spring">Spring</option>
                                        <option value="Summer">Summer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                                    <input 
                                        type="number" 
                                        className="w-full border border-slate-300 rounded p-2 text-sm text-slate-700" 
                                        value={enrollData.year} 
                                        onChange={e => setEnrollData({...enrollData, year: e.target.value})} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsEnrollModalOpen(false)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium w-full sm:w-auto">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium w-full sm:w-auto">Create Enrollment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Record Grade Modal */}
            {isGradeModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5 sm:p-6 my-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg sm:text-xl font-bold">Record Grade</h2>
                            <button onClick={() => setIsGradeModalOpen(false)} className="text-slate-500 hover:text-slate-800 text-2xl leading-none">&times;</button>
                        </div>
                        <form onSubmit={handleGradeSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Final Score (0-100)</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        className="w-full border border-slate-300 rounded p-2 text-sm text-slate-700" 
                                        value={gradeData.grade_value} 
                                        onChange={e => setGradeData({...gradeData, grade_value: e.target.value})} 
                                        placeholder="e.g. 95" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Letter Grade</label>
                                    <select 
                                        className="w-full border border-slate-300 rounded p-2 text-sm" 
                                        value={gradeData.letter_grade} 
                                        onChange={e => setGradeData({...gradeData, letter_grade: e.target.value})} 
                                        required
                                    >
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                        <option value="F">F</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
                                <textarea 
                                    className="w-full border border-slate-300 rounded p-2 text-sm" 
                                    rows="3" 
                                    value={gradeData.remarks} 
                                    onChange={e => setGradeData({...gradeData, remarks: e.target.value})} 
                                    placeholder="Add any comments here..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsGradeModalOpen(false)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded text-sm">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded text-sm">Save Grade</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Grades;