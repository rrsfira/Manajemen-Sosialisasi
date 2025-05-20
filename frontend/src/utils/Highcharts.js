import Highcharts from 'highcharts';
import drilldown from 'highcharts/modules/drilldown';

// Pastikan modul drilldown hanya diimpor sekali
if (!Highcharts.Chart.prototype.addSeriesAsDrilldown) {
  drilldown(Highcharts);
}

export default Highcharts;
