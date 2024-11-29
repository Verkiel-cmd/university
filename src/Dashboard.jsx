import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Webstyles/DES_side.css';
function Dashboard() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalClass, setTotalClass] = useState(0);
  const [setError] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => localStorage.getItem("sidebarState") === "expanded");
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(() => localStorage.getItem("authDropdownState") === "expanded");
  const [isMultiDropdownOpen, setIsMultiDropdownOpen] = useState(() => localStorage.getItem("multiDropdownState") === "expanded");


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

  useEffect(() => {
    const fetchTotalStudents = async () => {
      try {
        console.log('Fetching total students...');
        const response = await fetch('http://localhost:3001/total-students');
        console.log('Response status:', response.status); // Log response status

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTotalStudents(data.total);
      } catch (err) {
        setError('Error fetching total students: ' + err.message);
        console.error(err);
      }
    };

    fetchTotalStudents();
  }, []);


  useEffect(() => {
    const fetchTotalClasses = async () => {
      try {
        console.log('Fetching total students...');
        const response = await fetch('http://localhost:5000/class-students');
        console.log('Response status:', response.status); // Log response status

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTotalClass(data.total);
      } catch (err) {
        setError('Error fetching total students: ' + err.message);
        console.error(err);
      }
    };

    fetchTotalClasses();
  }, []);






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


            <div className="parent-container" style={{ marginInlineStart: '8rem' }}>

              <div className="total_enrolled ">
                <h1>Colleagues {totalStudents}</h1>
              </div>

              <div className="total_enrolled">
                <h1>Added Classes {totalClass}</h1>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div >




















  );

}

export default Dashboard;
