import React, { useState, useEffect } from 'react';

const AdminHome = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // fetch('/api/departments') ...
  }, []);

  return <div>Admin Home</div>;
};

export default AdminHome;