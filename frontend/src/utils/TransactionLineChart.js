import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const TransactionLineChart = ({ transactions }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (transactions.length === 0) return;

    // Group transactions by date
    const dailyTotals = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      const amount = parseFloat(transaction.amount);
      acc[date] = (acc[date] || 0) + amount;
      return acc;
    }, {});

    const chartConfig = {
      type: 'line',
      data: {
        labels: Object.keys(dailyTotals),
        datasets: [{
          label: 'Daily Transaction Total',
          data: Object.values(dailyTotals),
          borderColor: '#36A2EB',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 10,
              padding: 5,
              font: {
                size: 11
              }
            }
          },
          title: {
            display: true,
            text: 'Transaction History',
            font: {
              size: 12
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 10
              }
            }
          },
          x: {
            ticks: {
              font: {
                size: 10
              }
            }
          }
        }
      }
    };

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, chartConfig);

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

export default TransactionLineChart; 