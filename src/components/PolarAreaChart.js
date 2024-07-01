import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PolarAreaChart = ({ topLevelDomains }) => {
    const chartRef = useRef(null);
    let chartInstance = useRef(null); // Ref to store chart instance

    useEffect(() => {
        if (chartRef && chartRef.current) {
            // Destroy previous chart instance if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const domainLabels = topLevelDomains.map(domain => domain.domain);
            const domainCounts = topLevelDomains.map(domain => domain.count);

            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'polarArea',
                data: {
                    labels: domainLabels,
                    datasets: [{
                        label: 'Top Level Domains',
                        data: domainCounts,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(153, 102, 255, 0.5)',
                        ],
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                }
            });
        }

        // Cleanup function to destroy chart instance on component unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [topLevelDomains]);

    return <canvas ref={chartRef} id="polarAreaChart" width="400" height="400"></canvas>;
};

export default PolarAreaChart;
