import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Trends = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item._id),
    datasets: [
      {
        label: "Total Alerts",
        data: data.map((item) => item.total),
        borderColor: "#3498db",
        tension: 0.3,
      },
      {
        label: "Escalations",
        data: data.map((item) => item.escalated),
        borderColor: "#e74c3c",
        tension: 0.3,
      },
      {
        label: "Auto Closed",
        data: data.map((item) => item.autoClosed),
        borderColor: "#2ecc71",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="card">
      <h3>Alert Trends</h3>
      <Line data={chartData} />
    </div>
  );
};

export default Trends;