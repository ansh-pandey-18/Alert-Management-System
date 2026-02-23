import { useEffect, useState } from "react";
import axios from "axios";
import Summary from "./components/Summary.js";
import TopDrivers from "./components/TopDrivers.js";
import Trends from "./components/Trends.js";
import RecentClosed from "./components/RecentClosed.js";
import RuleConfig from "./components/RuleConfiguration.js";

const BASE_URL = "http://localhost:5000/api/v1";

function App() {
  const [summaryData, setSummaryData] = useState([]);
  const [driverStats, setDriverStats] = useState([]);
  const [closedAlerts, setClosedAlerts] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ruleConfig, setRuleConfig] = useState({});

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const summary = await axios.get(`${BASE_URL}/dashboard/summary`);
      const drivers = await axios.get(`${BASE_URL}/dashboard/top-drivers`);
      const closed = await axios.get(
        `${BASE_URL}/dashboard/recent-auto-closed`
      );
      const trends = await axios.get(`${BASE_URL}/dashboard/trends`);
      const rules = await axios.get(`${BASE_URL}/dashboard/rules`);

      setSummaryData(summary.data.data);
      setDriverStats(drivers.data.data);
      setClosedAlerts(closed.data.data);
      setTrendData(trends.data.data);
      setRuleConfig(rules.data.data);
    } catch (err) {
      setError("Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="title">Intelligent Alert Dashboard</div>

      <Summary data={summaryData} />
      <TopDrivers data={driverStats} />
      <Trends data={trendData} />
      <RecentClosed data={closedAlerts} />
      <RuleConfig rules={ruleConfig} />
    </div>
  );
}

export default App;