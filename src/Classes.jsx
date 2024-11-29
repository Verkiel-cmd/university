import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import React, { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Webstyles/DES_side.css';
import './Webstyles/bootstrapError_style.css';



function Classes() {
    const [classes, setClasses] = useState([]);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => localStorage.getItem("sidebarState") === "expanded");
    const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(() => localStorage.getItem("authDropdownState") === "expanded");
    const [isMultiDropdownOpen, setIsMultiDropdownOpen] = useState(() => localStorage.getItem("multiDropdownState") === "expanded");
    const [editingId, setEditingId] = useState(null);
    const [] = useState(null);

    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogout = () => {
        // Clear session storage
        sessionStorage.clear();
        // Redirect to login page
        navigate('/Frontlog');
    };
    const toggleSidebar = () => {
        setIsSidebarExpanded((prev) => {
            const newState = !prev;
            localStorage.setItem("sidebarState", newState ? "expanded" : "collapsed");
            return newState;
        });
    };

    const handleAuthDropdownClick = () => {
        setIsAuthDropdownOpen(prev => {
            const newState = !prev;
            localStorage.setItem("authDropdownState", newState ? "expanded" : "collapsed");

            // Close Multi dropdown if it's open
            if (isMultiDropdownOpen) {
                setIsMultiDropdownOpen(false);
                localStorage.setItem("multiDropdownState", "collapsed");
            }

            return newState;
        });
    };

    // Function to handle opening the Multi dropdown
    const handleMultiDropdownClick = () => {
        setIsMultiDropdownOpen(prev => {
            const newState = !prev;
            localStorage.setItem("multiDropdownState", newState ? "expanded" : "collapsed");

            // Close Auth dropdown if it's open
            if (isAuthDropdownOpen) {
                setIsAuthDropdownOpen(false);
                localStorage.setItem("authDropdownState", "collapsed");
            }

            return newState;
        });
    };


    //Class function
    const [classname, setClassname] = useState('');
    const [touched, setTouched] = useState(false);
    const [isError, setIsError] = useState(false);

    const [classteacher, setClassteacher] = useState('');
    const [studentlimit, setStudentlimit] = useState('');

    const [classnameError, setClassnameError] = useState('');
    const [classteacherError, setClassteacherError] = useState('');
    const [studentlimitError, setStudentlimitError] = useState('');

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [currentDeletingId, setCurrentDeletingId] = useState(null);

    const resetForm = () => {
        setClassname('');
        setClassteacher('');
        setStudentlimit('');
        setClassnameError('');
        setClassteacherError('');
        setStudentlimitError('');
    };

    const handleCloseError = (errorType) => {
        if (errorType === 'classname') {
            setClassnameError('');
        } else if (errorType === 'classteacher') {
            setClassteacherError('');
        } else if (errorType === 'studentlimit') {
            setStudentlimitError('');
        }
    };




    const fetchClasses = async () => {
        try {
            console.log('Fetching classes...');
            const response = await fetch('http://localhost:5000/get-classes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to fetch classes');
            }

            const data = await response.json();
            console.log('Fetched classes:', data);
            setClasses(data);
        } catch (error) {
            console.error('Error in fetchClasses:', error);
            setErrorMessage('Error fetching classes: ' + error.message);
        }
    };


    useEffect(() => {
        console.log('Component mounted, fetching classes...');
        fetchClasses();
    }, []);


    const handleOperationSuccess = (message) => {
        setSuccessMessage(message);
        // Optional: Auto-clear message after a few seconds
        setTimeout(() => setSuccessMessage(''), 1000);
    };

    const handleOperationError = (message) => {
        setErrorMessage(message);
        // Optional: Auto-clear message after a few seconds
        setTimeout(() => setErrorMessage(''), 1000);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();



        let isValid = true;
        setClassnameError('');
        setClassteacherError('');
        setStudentlimitError('');

        if (classname.trim() === '') {
            setClassnameError('Class name is required');
            isValid = false;
        }
        if (classteacher.trim() === '') {
            setClassteacherError('Class teacher is required');
            isValid = false;
        }
        if (studentlimit.trim() === '') {
            setStudentlimitError('Student limit is required');
            isValid = false;

        } else {
            // Check if student limit is a number
            const parsedStudentLimit = Number(studentlimit);
            if (isNaN(parsedStudentLimit)) {
                setStudentlimitError('Student limit must be a number');
                isValid = false;
            } else if (parsedStudentLimit < 1 || parsedStudentLimit > 1000) {
                setStudentlimitError('Student limit must be a number between 1 and 1000');
                isValid = false;
            }
        }

        if (isValid) {
            const classData = {
                classname,
                classteacher,
                studentlimit: Number(studentlimit),
            };



            try {
                // Determine the URL and method based on whether it's an add or edit operation
                const url = editingId
                    ? `http://localhost:5000/edit-class/${editingId}`
                    : `http://localhost:5000/add-class`;
                const method = editingId ? 'PUT' : 'POST';

                console.log('Sending class data:', classData);

                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(classData),
                });

                if (!response.ok) {
                    const errorData = await response.json(); // Parse error response
                    console.error('Error response:', errorData);

                    if (response.status === 409) {
                        handleOperationError('The data already exists'); // Display duplicate error
                    } else {
                        setErrorMessage(errorData.error || 'Failed to save class'); // General error
                    }

                    return; // Exit function to prevent further execution
                }
                const data = await response.json();
                console.log('Success response:', data);

                // Update frontend state with the backend response
                if (editingId) {
                    setClasses((prevClasses) =>
                        prevClasses.map((cls) =>
                            cls.classid === editingId ? { ...cls, ...data.updatedClass } : cls
                        )
                    );
                    handleOperationSuccess('Class updated successfully!');
                } else {
                    setClasses((prevClasses) => [
                        ...prevClasses,
                        {
                            classid: data.updatedClass.id,
                            classname: data.updatedClass.classname,
                            classteacher: data.updatedClass.classteacher,
                            studentlimit: data.updatedClass.studentlimit,
                        },
                    ]);
                    handleOperationSuccess('Class created successfully!');
                }

                resetForm();
                setEditingId(null);
            } catch (error) {
                console.error('Error in handleSubmit:', error);
                setErrorMessage('Error: ' + error.message);
            }
        }
    };







    const handleEdit = (id) => {
        try {
            const classToEdit = classes.find(c => c?.classid === id);

            if (!classToEdit) {
                throw new Error('Class not found');
            }

            // Populate the form with the class data
            setClassname(classToEdit?.classname || '');
            setClassteacher(classToEdit?.classteacher || '');
            setStudentlimit((classToEdit?.studentlimit || 0).toString());

            // Set the ID for editing
            setEditingId(id);
            setErrorMessage('');
        } catch (error) {
            console.error('Error in handleEdit:', error);
            setErrorMessage('Error preparing to edit class: ' + error.message);
        }
    };







    const handleDelete = async (id) => {
        // Store the ID in a state or ref that can be accessed by the confirmation modal
        setCurrentDeletingId(id);

        // Show the bootstrap modal
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();
    };

    // Add a new function to handle the actual deletion when confirmed
    const confirmDelete = async () => {
        const id = currentDeletingId; // Use the ID stored from handleDelete

        if (!id) {
            console.error('Invalid class ID');
            setErrorMessage('Invalid class ID');
            return;
        }

        try {
            console.log('Deleting class:', id);
            const response = await fetch(`http://localhost:5000/delete-class/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete class');
            }

            const data = await response.json();
            console.log('Delete success response:', data);

            // Update frontend state directly
            setClasses((prevClasses) =>
                prevClasses.filter((cls) => cls.classid !== id)
            );


            // Close the modal
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
        } catch (error) {
            console.error('Error in handleDelete:', error);
            setErrorMessage('Error while deleting class: ' + error.message);
        }
    };


    return (
        <div className="wrapper">
            <aside id="sidebar" className={isSidebarExpanded ? "expand" : ""}>
                <div className="d-flex">
                    <button id="toggle-btn" type="button" onClick={toggleSidebar}>
                        <i className="lni lni-grid-alt"></i>
                    </button>
                    <div className="sidebar-logo">
                        <a href="#">Veracity</a>
                    </div>
                </div>
                <ul className="sidebar-nav">

                    <li className="sidebar-item" data-tooltip={!isSidebarExpanded ? "Dashboard" : ""} >
                        <Link to="/Dashboard" className="sidebar-link">
                            <i className="lni lni-users"></i>
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    <li className="sidebar-item" data-tooltip={!isSidebarExpanded ? "Classes" : ""}>
                        <Link to="/Classes" className="sidebar-link">
                            <i class='bx bxs-school'></i>
                            <span>Classes</span>
                        </Link>
                    </li>


                    <li className="sidebar-item" data-tooltip={!isSidebarExpanded ? "Lists" : ""}>
                        <Link to="/ListStud" className="sidebar-link">
                            <i className="lni lni-agenda"></i>
                            <span>Lists</span>
                        </Link>
                    </li>

                    <li className="sidebar-item" data-tooltip={!isSidebarExpanded ? "Auth" : ""}>
                        <a href="#" className="sidebar-link has-dropdown" onClick={handleAuthDropdownClick}>
                            <i className="lni lni-protection"></i>
                            <span>Auth</span>
                            {isSidebarExpanded && (
                                <i className={`lni lni-chevron-${isAuthDropdownOpen ? 'up' : 'down'}`} style={{ fontSize: '0.75rem', marginLeft: '-3rem' }}></i>
                            )}
                        </a>
                        <ul className={`sidebar-dropdown list-unstyled ${isAuthDropdownOpen ? 'show' : ''}`}>
                            <li className="sidebar-item">
                                <a href="#" className="sidebar-link">Login</a>
                            </li>
                            <li className="sidebar-item">
                                <a href="#" className="sidebar-link">Register</a>
                            </li>
                        </ul>
                    </li>

                    <li className="sidebar-item" data-tooltip={!isSidebarExpanded ? "Multi" : ""}>
                        <a href="#" className="sidebar-link has-dropdown" onClick={handleMultiDropdownClick}>
                            <i className="lni lni-layout"></i>
                            <span>Multi</span>
                            {isSidebarExpanded && (
                                <i className={`lni lni-chevron-${isMultiDropdownOpen ? 'up' : 'down'}`} style={{ fontSize: '0.75rem', marginLeft: '-3rem' }}></i>
                            )}
                        </a>
                        <ul className={`sidebar-dropdown list-unstyled ${isMultiDropdownOpen ? 'show' : ''}`}>
                            <li className="sidebar-item">
                                <a href="#" className="sidebar-link">Link 1</a>
                            </li>
                            <li className="sidebar-item">
                                <a href="#" className="sidebar-link">Link 2</a>
                            </li>
                        </ul>
                    </li>


                    <li className="sidebar-item" data-tooltip={!isSidebarExpanded ? "Notification" : ""}>
                        <a href="#" className="sidebar-link">
                            <i className="lni lni-popup"></i>
                            <span>Notification</span>
                        </a>
                    </li>

                    <li className="sidebar-item" data-tooltip={!isSidebarExpanded ? "Settings" : ""}>
                        <a href="#" className="sidebar-link">
                            <i className="lni lni-cog"></i>
                            <span>Settings</span>
                        </a>
                    </li>
                </ul>

                <div className="sidebar-item" data-tooltip={!isSidebarExpanded ? "Logout" : ""}>
                    <a href="/" className="sidebar-link" onClick={handleLogout}>
                        <i className="lni lni-exit"></i>
                        <span>Logout</span>
                    </a>
                </div>
            </aside>

            <div className="TOP">
                <div className="text-center">
                    <div className="top-bar">
                        <h1 className="title">UNIVERSITY VERACITY</h1>

                    </div>



                    <div className="container_class" style={{ marginTop: '6rem' }}>
                        {/* Success Message */}
                        {successMessage && (
                            <div className="row mb-3">
                                <div className="col-sm-6">
                                    <div className="alert alert-success alert-dismissible fade show text-start" role="alert">
                                        <strong>{successMessage}</strong>
                                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Error Message */}
                        {errorMessage && (
                            <div className="alert alert-danger text-start" role="alert">
                                {errorMessage}
                            </div>
                        )}





                        <h2 className="fw-bold text-start mb-4">Add Class</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3 fw-medium">
                                <label className="col-sm-0 col-form-label text-start">Class Name</label>
                                <div className="col-sm-0">
                                    <input
                                        type="text"
                                        className={`form-control ${isError ? 'is-invalid' : ''}`}
                                        value={classname}
                                        onChange={(e) => {
                                            setClassname(e.target.value);
                                            setIsError(false); // Clear error when user starts typing
                                            // Only reset touched if input is not empty
                                            if (e.target.value.trim()) {
                                                setTouched(false);
                                            }
                                        }}
                                        onBlur={() => {
                                            // Mark as touched when input loses focus
                                            if (!classname.trim()) {
                                                setTouched(true);
                                                setIsError(true);
                                            }
                                        }}
                                    />
                                    {touched && !classname.trim() && (
                                        <div className="invalid-feedback">
                                            Class name cannot be empty
                                        </div>
                                    )}

                                </div>
                            </div>





                            {classnameError && (
                                <div className="alert alert-danger alert-dismissible fade show text-start  p-1 small" role="alert">
                                    <strong>{classnameError}</strong>
                                    <button
                                        type="button"
                                        className="btn-close p-2 small"
                                        data-bs-dismiss="alert"
                                        aria-label="Close"
                                        onClick={() => handleCloseError('classname')}
                                    ></button>
                                </div>
                            )}





                            <div className="row mb-3 fw-medium">
                                <label className="col-sm-0 col-form-label text-start">Class Teacher</label>
                                <div className="col-sm-0">
                                    <input
                                        type="text"
                                        className={`form-control ${isError ? 'is-invalid' : ''}`} // Dynamically add 'is-invalid'
                                        value={classteacher}
                                        onChange={(e) => {
                                            setClassteacher(e.target.value);
                                            setIsError(false); // Clear error when typing
                                            if (e.target.value.trim()) {
                                                setTouched(false); // Reset touched only if input is not empty
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!classteacher.trim()) {
                                                setTouched(true); // Mark as touched on blur
                                                setIsError(true); // Trigger error for empty input
                                            }
                                        }}
                                    />
                                    {/* Show the error message if field is empty and touched */}
                                    {touched && !classteacher.trim() && (
                                        <div className="invalid-feedback">Class Teacher cannot be empty</div>
                                    )}
                                </div>
                            </div>





                            {classteacherError && (
                                <div className="alert alert-danger alert-dismissible fade show text-start  p-1 small" role="alert">
                                    <strong>{classteacherError}</strong>
                                    <button
                                        type="button"
                                        className="btn-close p-2 small"
                                        data-bs-dismiss="alert"
                                        aria-label="Close"
                                        onClick={() => handleCloseError('classteacher')}
                                    ></button>
                                </div>
                            )}





                            <div className="row mb-3 fw-medium">
                                <label className="col-sm-0 col-form-label text-start">Student Limit</label>
                                <div className="col-sm-0">
                                    <input
                                        type="text"
                                        className={`form-control ${isError ? 'is-invalid' : ''}`} // Dynamically add 'is-invalid'
                                        value={studentlimit}
                                        onChange={(e) => {
                                            setStudentlimit(e.target.value);
                                            setIsError(false); // Clear error when typing
                                            if (e.target.value.trim()) {
                                                setTouched(false); // Reset touched only if input is not empty
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!studentlimit.trim()) {
                                                setTouched(true); // Mark as touched on blur
                                                setIsError(true); // Trigger error for empty input
                                            }
                                        }}
                                    />
                                    {/* Show the error message if field is empty and touched */}
                                    {touched && !studentlimit.trim() && (
                                        <div className="invalid-feedback">Student Limit cannot be empty</div>
                                    )}
                                </div>
                            </div>





                            {studentlimitError && (
                                <div className="alert alert-danger alert-dismissible fade show text-start  p-1 small" role="alert">
                                    <strong>{studentlimitError}</strong>
                                    <button
                                        type="button"
                                        className="btn-close p-2 small"
                                        data-bs-dismiss="alert"
                                        aria-label="Close"
                                        onClick={() => handleCloseError('studentlimit')}
                                    ></button>
                                </div>
                            )}

                            <div className="d-flex ">
                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>

                            </div>
                        </form>
                    </div>
                </div>

                {/* Class List Table */}
                <h2 className="fw-bold text-start mb-4 mt-5" style={{ marginInlineStart: '8rem' }}>Class List</h2>
                <div className="table-responsive" style={{ marginInline: '8rem', maxHeight: '400px', overflowY: 'auto', }}>
                    <table className="table" style={{ width: '100%', }}>

                        <thead>
                            <tr>
                                <th style={{ width: '10%' }}>Class ID</th>
                                <th style={{ width: '25%' }}>Class Name</th>
                                <th style={{ width: '25%' }}>Class Teacher</th>
                                <th style={{ width: '20%' }}>Student Limit</th>
                                <th style={{ width: '20%' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.length > 0 ? (
                                classes.map((cls) => (
                                    <tr key={cls.classid}>
                                        <td>{cls.classid}</td>
                                        <td>{cls.classname}</td>
                                        <td>{cls.classteacher}</td>
                                        <td>{cls.studentlimit}</td>
                                        <td style={{ display: 'flex', gap: '10px' }}>
                                            <button className="btn btn-primary btn-sm" onClick={() => handleEdit(cls.classid)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cls.classid)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">No classes available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="doggy">
                    <h1>scroll_test</h1>
                </div>

            </div>

            {/* Bootstrap Delete Modal - Add this at the end of your return */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this class?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Cancel</button>

                        </div>
                    </div>
                </div>
            </div>


        </div >



    );

}









export default Classes;