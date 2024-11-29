import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

function DeleteStudent() {
  const { id } = useParams(); // Retrieve the student ID from URL parameters
  const history = useHistory(); // To navigate after deletion

  useEffect(() => {
    if (id) {
      // Make the DELETE request when the component is mounted
      deleteStudent(id);
    }
  }, [id]);

  const deleteStudent = async () => {
    try {
      const response = await fetch(`http://localhost:3001/students/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      // Redirect to list after successful deletion
      history.push('/ListStud');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      <h2>Deleting student...</h2>
    </div>
  );
}

export default DeleteStudent;