import React from "react";
import { Table as BootStrapTable } from "react-bootstrap";
import numeral from "numeral";
import "./Table.style.css";

const Table = ({ countries, currentDetail }) => (
  <div className='myTable'>
    <BootStrapTable striped bordered hover responsive>
      <thead>
        <tr>
          <th>{currentDetail === "india" ? "States" : "Countries"}</th>
          <th>Cases</th>
        </tr>
      </thead>
      <tbody>
        {countries.map((country) => (
          <tr key={country.country}>
            <td>
              {currentDetail === "india" ? country.name : country.country}
            </td>
            <td> {numeral(country.cases).format("0,0")} </td>
          </tr>
        ))}
      </tbody>
    </BootStrapTable>
  </div>
);

export default Table;
