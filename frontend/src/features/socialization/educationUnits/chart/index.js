import React, { useEffect, useState } from 'react';
import Highcharts from '../../../../utils/Highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';


const EducationUnitsChart = () => {
  const [chartOptions, setChartOptions] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Deteksi perubahan class `dark` di <html>
  useEffect(() => {
    const checkDarkMode = () =>
      document.documentElement.classList.contains('dark');

    setIsDarkMode(checkDarkMode());

    const observer = new MutationObserver(() => {
      setIsDarkMode(checkDarkMode());
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect(); // perbaikan return
  }, []);

  // Buat chartOptions saat darkMode berubah
  useEffect(() => {
    axios
      .get('http://localhost:5000/chart/education_units')
      .then((res) => {
        const { series, drilldownSeries } = res.data;

        const backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';
        const textColor = isDarkMode ? '#e5e7eb' : '#111827';

        setChartOptions({
          chart: {
            type: 'pie',
            backgroundColor: backgroundColor,
          },
          title: {
            text: 'Sosialisasi Satuan Pendidikan Berdasarkan Wilayah',
            style: {
              color: textColor,
            },
          },
          subtitle: {
            text: 'Klik untuk lihat detail per kecamatan',
            style: {
              color: textColor,
            },
          },
          accessibility: {
            announceNewData: {
              enabled: true,
            },
            point: {
              valueSuffix: '%',
            },
          },
          plotOptions: {
            series: {
              dataLabels: {
                enabled: true,
                format: '{point.name}: {point.y} satuan pendidikan',
                style: {
                  color: textColor,
                },
              },
            },
          },
          tooltip: {
            backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
            style: {
              color: textColor,
            },
            headerFormat:
              '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat:
              '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> satuan pendidikan<br/>',
          },
          series: [
            {
              name: 'Wilayah',
              colorByPoint: true,
              data: series,
            },
          ],
          drilldown: {
            series: drilldownSeries,
          },
        });
      })
      .catch((err) => {
        console.error('Failed to fetch chart data:', err);
      });
  }, [isDarkMode]); // useEffect dijalankan ulang ketika mode gelap berubah

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
      <HighchartsReact
  highcharts={Highcharts}
  options={chartOptions}
  key={isDarkMode ? 'dark' : 'light'}
/>
    </div>
  );
};

export default EducationUnitsChart;
