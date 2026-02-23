import { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1";

const RecentClosed = ({ data }) => {
  const [selected, setSelected] = useState(null);

  const fetchDetails = async (alertId) => {
    const res = await axios.get(`${BASE_URL}/alerts/${alertId}`);
    setSelected(res.data.data);
  };

  return (
    <div className="card">
      <h3>Recent Auto Closed Alerts</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Alert ID</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {data.map((alert) => (
            <tr
              key={alert._id}
              onClick={() => fetchDetails(alert.alertId)}
              style={{ cursor: "pointer" }}
            >
              <td>{alert.alertId}</td>
              <td>{alert.sourceType}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="drilldown">
          <h4>Alert Details</h4>
          <p><strong>Status:</strong> {selected.status}</p>
          <p><strong>Severity:</strong> {selected.severity}</p>
          <p><strong>Driver:</strong> {selected.driverId}</p>

          <h5>History</h5>
          <ul>
            {selected.history.map((h, idx) => (
              <li key={idx}>
                {h.fromState} → {h.toState} ({h.reason})
              </li>
            ))}
          </ul>

          <h5>Metadata</h5>
          <pre>{JSON.stringify(selected.metadata, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RecentClosed;