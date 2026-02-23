import React from "react";

const Summary = ({ data }) => {
  return (
    <div className="card">
      <h3>Severity Summary</h3>
      <div className="summary-grid">
        {data.map((item, index) => (
          <div key={index} className={`summary-item ${item._id}`}>
            <div>{item._id}</div>
            <div style={{ fontSize: "22px", marginTop: "5px" }}>
              {item.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;