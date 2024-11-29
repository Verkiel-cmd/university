import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Webstyles/createstyle.css';
import './Webstyles/bootstrapError_style.css';

function CreateStudent() {

  const [isError, setIsError] = useState(false);
  const [touched, setTouched] = useState(false);


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  // Function to handle closing the alerts and clearing error messages
  const handleCloseError = (errorType) => {
    if (errorType === 'name') {
      setNameError('');
    } else if (errorType === 'email') {
      setEmailError('');
    } else if (errorType === 'phone') {
      setPhoneError('');
    } else if (errorType === 'address') {
      setAddressError('');
    }
  };

  const handleOperationError = (message) => {
    setErrorMessage(message);
    // Optional: Auto-clear message after a few seconds
    setTimeout(() => setErrorMessage(''), 1000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let isValid = true;
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setAddressError('');

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Phone validation regex (assuming 10-digit phone number)
    const phoneRegex = /^\d{10}$/;

    // Validate input fields
    if (name.trim() === '') {
      setNameError('Name is required');
      isValid = false;
    }

    if (email.trim() === '') {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Invalid email format');
      isValid = false;
    }

    if (phone.trim() === '') {
      setPhoneError('Phone is required');
      isValid = false;
    } else if (!phoneRegex.test(phone.trim())) {
      setPhoneError('Phone number must be 10 digits');
      isValid = false;
    }

    if (address.trim() === '') {
      setAddressError('Address is required');
      isValid = false;
    }

    if (isValid) {
      try {
        console.log('Sending data to API:', { name, email, phone, address }); // Log the data being sent
        const response = await fetch('http://localhost:3001/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, phone, address }),
        });

        console.log('Response:', response); // Log the response

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response:', errorData); // Log error response
          if (response.status === 409) {
            handleOperationError('The data already exists'); // Display duplicate error
          } else {
            setErrorMessage(errorData.error || 'Failed to create student');
          }
        } else {
          const data = await response.json();
          setSuccessMessage(data.message);

          setTimeout(() => {
            setSuccessMessage('');
          }, 1000);

          setName('');
          setEmail('');
          setPhone('');
          setAddress('');
        }
      } catch (error) {
        console.error('Fetch error:', error); // Log fetch error
        setErrorMessage('Error: ' + error.message);
      }
    }
  };

  return (



    <div className="container_listud my-5 bg-color">
      {successMessage && (
        <div className="row mb-3">
          <div className="col-sm-6">
            <div className="alert alert-success alert-dismissible fade show " role="alert">
              <strong>{successMessage}</strong>
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          </div>
        </div>
      )}





      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}





      <h2 className='fw-bold'>New Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3 fw-medium">
          <label className="col-sm-0 col-form-label">Name</label>
          <div className="col-sm-6">
            <input
              type="text"
              className={`form-control ${isError ? 'is-invalid' : ''}`} // Dynamically add 'is-invalid'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsError(false); // Clear error when typing
                if (e.target.value.trim()) {
                  setTouched(false); // Reset touched only if input is not empty
                }
              }}
              onBlur={() => {
                if (!name.trim()) {
                  setTouched(true); // Mark as touched on blur
                  setIsError(true); // Trigger error for empty input
                }
              }}
            />
            {/* Display error message if the field is empty and touched */}
            {touched && !name.trim() && (
              <div className="invalid-feedback">Name cannot be empty</div>
            )}
          </div>
        </div>





        {nameError && (
          <div className="alert alert-danger alert-dismissible fade show p-1 small " role="alert">
            <strong>{nameError}</strong>
            <button type="button" className="btn-close p-2 small" data-bs-dismiss="alert" aria-label="Close " onClick={() => handleCloseError('name')}></button>
          </div>
        )}





        <div className="row mb-3 fw-medium">
          <label className="col-sm-0 col-form-label">Email</label>
          <div className="col-sm-6">
            <input
              type="email"
              className={`form-control ${isError ? 'is-invalid' : ''}`} // Add 'is-invalid' dynamically
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsError(false); // Clear error while typing
                if (e.target.value.trim()) {
                  setTouched(false); // Reset touched only if input is not empty
                }
              }}
              onBlur={() => {
                if (!email.trim()) {
                  setTouched(true); // Mark as touched
                  setIsError(true); // Trigger error for invalid or empty input
                }
              }}
            />
            {/* Display error message for empty or invalid email */}
            {touched && !email.trim() && (
              <div className="invalid-feedback">Email cannot be empty</div>
            )}

          </div>
        </div>





        {emailError && (
          <div className="alert alert-danger alert-dismissible fade show  p-1 small" role="alert">
            <strong>{emailError}</strong>
            <button type="button" className="btn-close p-2 small" data-bs-dismiss="alert" aria-label="Close" onClick={() => handleCloseError('email')}></button>
          </div>
        )}





        <div className="row mb-3 fw-medium">
          <label className="col-sm-0 col-form-label">Phone</label>
          <div className="col-sm-6">
            <input
              type="text"
              className={`form-control ${isError ? 'is-invalid' : ''}`} // Add 'is-invalid' dynamically
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setIsError(false); // Clear error while typing
                if (e.target.value.trim()) {
                  setTouched(false); // Reset touched only if input is not empty
                }
              }}
              onBlur={() => {
                if (!phone.trim()) {
                  setTouched(true); // Mark as touched
                  setIsError(true); // Trigger error for invalid or empty input
                }
              }}
            />
            {/* Display error message for empty or invalid email */}
            {touched && !phone.trim() && (
              <div className="invalid-feedback">Phone cannot be empty</div>
            )}
          </div>
        </div>





        {phoneError && (
          <div className="alert alert-danger alert-dismissible fade show  p-1 small" role="alert">
            <strong>{phoneError}</strong>
            <button type="button" className="btn-close p-2 small" data-bs-dismiss="alert" aria-label="Close" onClick={() => handleCloseError('phone')}></button>
          </div>
        )}





        <div className="row mb-3 fw-medium">
          <label className="col-sm-0 col-form-label">Address</label>
          <div className="col-sm-6">
            <input
              type="text"
              className={`form-control ${isError ? 'is-invalid' : ''}`} // Add 'is-invalid' dynamically
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setIsError(false); // Clear error while typing
                if (e.target.value.trim()) {
                  setTouched(false); // Reset touched only if input is not empty
                }
              }}
              onBlur={() => {
                if (!address.trim()) {
                  setTouched(true); // Mark as touched
                  setIsError(true); // Trigger error for invalid or empty input
                }
              }}
            />
            {/* Display error message for empty or invalid email */}
            {touched && !address.trim() && (
              <div className="invalid-feedback">Address cannot be empty</div>
            )}
          </div>
        </div>





        {addressError && (
          <div className="alert alert-danger alert-dismissible fade show  p-1 small" role="alert">
            <strong>{addressError}</strong>
            <button type="button" className="btn-close p-2 small" data-bs-dismiss="alert" aria-label="Close" onClick={() => handleCloseError('address')}></button>
          </div>
        )}





        <div className="col-auto">
          <button type="submit" className="btn btn-primary mb-3">
            Submit
          </button>
        </div>
        <div className="col-auto">
          <button
            type="button"
            className="btn btn-secondary d-flex justify-content-center align-items-center"
            onClick={() => navigate('/ListStud')}
          >
            Back
          </button>
        </div>

      </form>
    </div>
  );
}

export default CreateStudent;
