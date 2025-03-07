"use client";
import { useState, useEffect } from "react";
import Navbar from "../Navbar/page";
import Footer from "../Footer/page";

// Define TypeScript interface for notes
type Note = {
    name: string;
    path: string;
    year: string;
    branch: string;
    semester: string;
};

export default function NotesPage() {
    // Define state with proper types
    const [years, setYears] = useState<string[]>([]);
    const [branches, setBranches] = useState<string[]>([]);
    const [semesters, setSemesters] = useState<string[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);

    const [year, setYear] = useState<string>("");
    const [branch, setBranch] = useState<string>("");
    const [semester, setSemester] = useState<string>("");

    // Fetch Data from API
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/notes");
                if (!res.ok) throw new Error("Failed to fetch notes");

                const data = await res.json();

                // Ensure data is set properly, avoiding undefined values
                setYears(data.years || []);
                setBranches(data.branches || []);
                setSemesters(data.semesters || []);
                setNotes(data.notes || []);
            } catch (error) {
                console.error("Error fetching notes:", error);
            }
        }
        fetchData();
    }, []);

    // Filter notes based on selection
    const filteredNotes = notes.filter(
        (note) => note.year === year && note.branch === branch && note.semester === semester
    );

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="card">
                    <h1>Engineering Notes</h1>
                    <div className="filters">
                        <select value={year} onChange={(e) => setYear(e.target.value)}>
                            <option value="">Select Year</option>
                            {years.map((y, index) => (
                                <option key={index} value={y}>{y}</option>
                            ))}
                        </select>

                        <select value={branch} onChange={(e) => setBranch(e.target.value)}>
                            <option value="">Select Branch</option>
                            {branches.map((b, index) => (
                                <option key={index} value={b}>{b}</option>
                            ))}
                        </select>

                        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
                            <option value="">Select Semester</option>
                            {semesters.map((s, index) => (
                                <option key={index} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <ul className="notes-list">
                        {filteredNotes.length > 0 ? (
                            filteredNotes.map((note, index) => (
                                <li key={index}>
                                    <a href={note.path} download={note.name} className="download-link">📄 {note.name}</a>
                                </li>
                            ))
                        ) : (
                            <p>No notes available</p>
                        )}
                    </ul>
                </div>
            </div>
            <Footer />

            {/* Styling */}
            <style jsx>{`
                .container {
                    background: linear-gradient(to right, #141e30, #243b55);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    min-height: 100vh;
                    text-align: center;
                    user-select: none;
                    padding: 20px;
                }
                .card {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 3rem;
                    border-radius: 20px;
                    box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.4);
                    width: 100%;
                    max-width: 500px;
                    text-align: center;
                    backdrop-filter: blur(25px);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    animation: fadeIn 1.2s ease-in-out;
                    transition: transform 0.3s ease-in-out;
                }
                .card:hover {
                    transform: scale(1.05);
                }
                h1 {
                    color: white;
                    margin-bottom: 12px;
                }
                .filters {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 10px;
                    border-radius: 12px;
                    flex-wrap: wrap;
                }
                .filters select {
                    padding: 12px;
                    border: none;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    font-size: 16px;
                    outline: none;
                }
                .notes-list {
                    list-style: none;
                    padding: 0;
                }
                .notes-list li {
                    padding: 12px;
                    border-radius: 8px;
                    margin: 8px;
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                }
                .download-link {
                    text-decoration: none;
                    color: white;
                }
                .download-link:hover {
                    text-decoration: underline;
                }
                option {
                    color: black;
                }
            `}</style>
        </>
    );
}
