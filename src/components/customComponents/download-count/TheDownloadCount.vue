<template>
  <v-card flat class="stat-wrapper">
    <v-card-text class="pa-5 success d-flex flex-column justify-space-between">
      <div class="d-flex align-center">
        <div class="align-self-center">
          <h1 class="white--text display-1">
            <v-icon class="white--text">{{ icon }}</v-icon>
          </h1>
        </div>
        <div class="mx-4">
          <h3 class="card-title white--text title font-weight-regular">
            {{ title }}
          </h3>
          <h6
            class="card-subtitle white--text op-5 subtitle-2 font-weight-regular"
          >
            {{ subtitle }}
          </h6>
        </div>
      </div>
      <v-row class="mt-2" style="max-height: 100px;">
        <v-col cols="4" class="d-flex align-center">
          <h2 class="font-weight-light white--text text-nowrap">{{ value }}</h2>
        </v-col>
        <v-col cols="8">
          <div class="float-right" v-show="elementVisible">
            <vue-apex-charts
              type="bar"
              height="70px"
              width="150px"
              :options="DownloadChart.chartOptions"
              :series="DownloadChart.series"
            ></vue-apex-charts>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "TheDownloadCount",
  props: {
    title: String,
    subtitle: String,
    value: {
      type: [String, Number]
    },
    periodDays: Array,
    icon: String,
    color: String
  },
  data: () => ({
    elementVisible: false,
    DownloadChart: {
      series: [
        {
          name: "",
          data: []
        }
      ],
      chartOptions: {
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "20%"
          }
        },
        grid: {
          show: false,
          padding: {
            left: 0,
            right: 0
          }
        },
        colors: "rgba(255, 255, 255, 0.5)",
        chart: {
          toolbar: {
            show: false
          },
          sparkline: {
            enabled: true
          }
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          theme: "dark"
        }
      }
    },
  }),
  watch: {
    periodDays: {
      handler: function(val) {
        this.elementVisible = false;
        let data = Object.assign({}, this.DownloadChart);
        data.series[0].data = this.periodDays;
        this.DownloadChart = JSON.parse(JSON.stringify(data));
        this.elementVisible = true;
      },
      deep: true
    }
  },
  created() {
    setTimeout(() => (this.elementVisible = true), 10);
  },
  components: {
    VueApexCharts,
  },
};
</script>

<style lang="scss" scoped>
.stat-wrapper {
  height: 100%;
  .v-card__text {
    height: 100%;
  }
}
</style>