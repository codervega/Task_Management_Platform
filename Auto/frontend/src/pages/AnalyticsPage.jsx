import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "../style/main.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage = () => {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();

  const [overviewData, setOverviewData] = useState([]);
  const [performanceData, setPerformanceData] = useState({});
  const [trendsData, setTrendsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Overview
      const overviewRes = await fetch("http://localhost:5000/api/analytics/overview", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const overviewJson = await overviewRes.json();
      setOverviewData(overviewJson.statusCounts);

      // User performance
      const performanceRes = await fetch("http://localhost:5000/api/analytics/user-performance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const performanceJson = await performanceRes.json();
      setPerformanceData(performanceJson);

      // Task trends
      const trendsRes = await fetch("http://localhost:5000/api/analytics/task-trends", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const trendsJson = await trendsRes.json();
      setTrendsData(trendsJson.trends);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  
 // Export tasks as CSV function
const exportTasksAsCSV = async () => {
  try {
    setExportLoading(true);
    const token = localStorage.getItem("token");
    
    console.log('Starting export...'); // Debug log
    
    const response = await fetch("http://localhost:5000/api/analytics/export-tasks", {
      headers: { 
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Response status:', response.status); // Debug log
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Export failed with status:', response.status, 'Error:', errorText);
      throw new Error(`Export failed: ${response.status} ${errorText}`);
    }

    // Check if response is CSV
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType); // Debug log
    
    if (contentType && contentType.includes('text/csv')) {
      // Create blob from response and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'tasks.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      console.log('Export successful!'); // Debug log
    } else {
      // If not CSV, try to parse as JSON to see error message
      const errorData = await response.json();
      throw new Error(errorData.message || 'Invalid response format');
    }
    
  } catch (error) {
    console.error('Export error:', error);
    alert(`Failed to export tasks: ${error.message}`);
  } finally {
    setExportLoading(false);
  }
};

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Chart options with responsive settings
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const doughnutOptions = {
    ...chartOptions,
    cutout: '60%', // Makes the doughnut chart thinner
  };

  if (!user) {
    return <p>Please login to view analytics.</p>;
  }

  if (loading) return <p>Loading analytics...</p>;

  // Prepare chart data
  const statusLabels = overviewData.map((item) => item._id);
  const statusCounts = overviewData.map((item) => item.count);

  const trendLabels = trendsData.map((item) => item.date);
  const trendTotal = trendsData.map((item) => item.totalTasks);
  const trendCompleted = trendsData.map((item) => item.completedTasks);

  return (
    <div className="analytics-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Analytics Dashboard</h1>
        <button 
          onClick={exportTasksAsCSV}
          disabled={exportLoading}
          className="export-btn"
          style={{
            padding: '10px 20px',
            backgroundColor: '#36A2EB',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {exportLoading ? 'Exporting...' : 'Export Tasks as CSV'}
        </button>
      </div>

      <section className="analytics-section">
        <h2>Task Status Overview</h2>
        <div className="chart-container" style={{ height: '300px', width: '300px', margin: '0 auto' }}>
          <Doughnut
            data={{
              labels: statusLabels,
              datasets: [
                {
                  label: "Tasks",
                  data: statusCounts,
                  backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
                },
              ],
            }}
            options={doughnutOptions}
          />
        </div>
      </section>

      <section className="analytics-section">
        <h2>User Performance</h2>
        <ul>
          <li>Total Tasks: {performanceData.totalTasks}</li>
          <li>Completed Tasks: {performanceData.completedTasks}</li>
          <li>Overdue Tasks: {performanceData.overdueTasks}</li>
          <li>Completion Rate: {performanceData.completionRate}</li>
          <li>Average Completion Time: {performanceData.avgCompletionTime}</li>
        </ul>
      </section>

      <section className="analytics-section">
        <h2>Task Trends Over Time</h2>
        <div className="chart-container" style={{ height: '300px', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <Line
            data={{
              labels: trendLabels,
              datasets: [
                {
                  label: "Total Tasks",
                  data: trendTotal,
                  borderColor: "#36A2EB",
                  backgroundColor: "rgba(54, 162, 235, 0.1)",
                  fill: true,
                },
                {
                  label: "Completed Tasks",
                  data: trendCompleted,
                  borderColor: "#FF6384",
                  backgroundColor: "rgba(255, 99, 132, 0.1)",
                  fill: true,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>
      </section>
    </div>
  );
};

export default AnalyticsPage;