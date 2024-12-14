import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const SpendingGraph = ({ transactions }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (transactions.length === 0) return;

    // Group transactions by type and calculate total amounts
    const spendingByType = transactions.reduce((acc, transaction) => {
      const amount = Math.abs(parseFloat(transaction.amount));
      if (parseFloat(transaction.amount) < 0) { // Only consider spending (negative amounts)
        acc[transaction.type] = (acc[transaction.type] || 0) + amount;
      }
      return acc;
    }, {});

    // Check if there's any spending
    const totalSpending = Object.values(spendingByType).reduce((sum, amount) => sum + amount, 0);

    let chartConfig;
    
    if (totalSpending === 0) {
      // Show a line chart with "No spending data" when there's no spending
      chartConfig = {
        type: 'line',
        data: {
          labels: ['No spending data'],
          datasets: [{
            data: [0],
            borderColor: '#ddd',
            borderDash: [5, 5],
            fill: false
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'No Spending Data Available'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              display: false
            }
          }
        }
      };
    } else {
      // Show the regular doughnut chart when there's spending data
      chartConfig = {
        type: 'doughnut',
        data: {
          labels: Object.keys(spendingByType),
          datasets: [{
            data: Object.values(spendingByType),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF'
            ],
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: 'Spending Distribution'
            }
          }
        }
      };
    }

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, chartConfig);

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [transactions]);

  return (
    <div style={styles.graphContainer}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

const styles = {
  graphContainer: {
    width: '100%',
    height: '100%',
    position: 'relative'
  }
};

export default SpendingGraph; 