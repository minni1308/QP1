// numberComponent.js
import React from 'react';
import { Table } from 'reactstrap';

const Details = () => {
  return (
    <div>
      <h4 style={{
        color: "#333",
        fontSize: "1.2rem",
        marginBottom: "1rem",
        fontWeight: "600"
      }}>
        Number of Units
      </h4>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          margin: '0 0 2rem 0',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          border: '1px solid #dee2e6'
        }}
      >
        {[1, 2, 3, 4, 5].map((unit) => (
          <div 
            key={unit}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #dee2e6',
              fontWeight: '500'
            }}
          >
            {unit}
          </div>
        ))}
      </div>

      <h4 style={{
        color: "#333",
        fontSize: "1.2rem",
        marginBottom: "1rem",
        fontWeight: "600"
      }}>
        Marks Distribution
      </h4>
      <Table hover bordered style={{
        backgroundColor: 'white',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <thead style={{ backgroundColor: '#f8f9fa' }}>
          <tr>
            <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Difficulty</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Marks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" style={{ padding: '12px' }}>Easy</th>
            <td style={{ padding: '12px' }}>2</td>
          </tr>
          <tr>
            <th scope="row" style={{ padding: '12px' }}>Medium</th>
            <td style={{ padding: '12px' }}>5</td>
          </tr>
          <tr>
            <th scope="row" style={{ padding: '12px' }}>Hard</th>
            <td style={{ padding: '12px' }}>10</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Details;
