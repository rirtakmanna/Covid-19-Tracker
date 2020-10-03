import React from "react";
import { Card } from "react-bootstrap";
import "./Info-Box.style.css";

const InfoBox = ({ title, cases, isRed, active, total, ...props }) => (
  <Card
    onClick={props.onClick}
    className={`myCard ${active && "myCard--selected"} ${
      isRed && "myCard--red"
    }`}>
    <Card.Body>
      <Card.Title className='myCard__tittle'>{title}</Card.Title>
      <h2 className={`myCard__cases ${!isRed && "myCard__cases--green"}`}>
        {cases}
      </h2>
      <Card.Text className='myCard__total'>{total} Total</Card.Text>
    </Card.Body>
  </Card>
);

export default InfoBox;
