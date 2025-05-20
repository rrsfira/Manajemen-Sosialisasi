import React, { useEffect, useState } from 'react';
import Highcharts from '../../../../utils/Highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

const EducationUnitsChart = () => {
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/chart/education_units')
      .then(res => {
        const { series, drilldownSeries } = res.data;

        setChartOptions({
          chart: {
            type: 'pie',
          },
          title: {
            text: 'Sosialisasi Satuan Pendidikan Berdasarkan Wilayah',
          },
          subtitle: {
            text: 'Klik untuk lihat detail per kecamatan',
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
              },
            },
          },
          tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
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
      .catch(err => {
        console.error('Failed to fetch chart data:', err);
      });
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default EducationUnitsChart;
