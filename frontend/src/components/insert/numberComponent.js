// numberComponent.js
import React from 'react';
import { Table } from 'reactstrap';

const Details = () => {
  return (
    <div>
      <h4>Number of Units</h4>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          margin: '2px',
        }}
      >
        {[1, 2, 3, 4, 5].map((unit) => (
          <div key={unit}>{unit}</div>
        ))}
      </div>

      <h4>Marks distribution for each difficulty level</h4>
      <Table hover bordered size="sm" className="tables">
        <thead>
          <tr>
            <th>Difficulty</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Easy</th>
            <td>2</td>
          </tr>
          <tr>
            <th scope="row">Medium</th>
            <td>5</td>
          </tr>
          <tr>
            <th scope="row">Hard</th>
            <td>10</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Details;
