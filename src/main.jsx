import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google' // Add Routes and Route
import Frontlog from './Frontlog';
import ListStud from './ListStud'; // Import the ListStud component
import CreateStudent from './CreateStudent';
import UpdateStudent from './UpdateStudent';
import Dashboard from './Dashboard';
import Classes from './Classes';





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap everything inside GoogleOAuthProvider and pass the clientId */}
    <GoogleOAuthProvider clientId="824956744352-a4sj5egukjh1csk8galsalp6v4i73gbq.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/Frontlog" element={<Frontlog />} />
          <Route path="/Classes" element={<Classes />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/updateStudent/:id" element={<UpdateStudent />} />
          <Route path="/UpdateStudent" element={<UpdateStudent />} />
          <Route path="/CreateStudent" element={<CreateStudent />} />
          <Route path="/" element={<Frontlog />} />  { }
          <Route path="/ListStud" element={<ListStud />} />  { }
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>

);

