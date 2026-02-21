/**
 * Charts Module - Handles all Chart.js visualizations
 * Requires Chart.js library to be loaded
 */

const Charts = {
  chartInstances: {},

  /**
   * Destroy existing chart if it exists
   */
  destroyChart(chartId) {
    if (this.chartInstances[chartId]) {
      this.chartInstances[chartId].destroy();
      delete this.chartInstances[chartId];
    }
  },

  /**
   * Monthly Spending Comparison Bar Chart
   */
  createMonthlySpendingChart() {
    this.destroyChart('monthlySpendingChart');

    const monthlyData = Storage.getMonthlySpending();
    const months = Object.keys(monthlyData).sort();
    const amounts = months.map(month => monthlyData[month]);

    const ctx = document.getElementById('monthlySpendingChart');
    if (!ctx) return;

    this.chartInstances['monthlySpendingChart'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months.map(m => {
          const [year, month] = m.split('-');
          return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }),
        datasets: [{
          label: 'Monthly Spending',
          data: amounts,
          backgroundColor: 'rgba(52, 152, 219, 0.7)',
          borderColor: 'rgba(52, 152, 219, 1)',
          borderWidth: 2,
          borderRadius: 8,
          hoverBackgroundColor: 'rgba(41, 128, 185, 0.9)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Monthly Spending Comparison',
            font: { size: 14, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '₹' + value.toFixed(0);
              }
            }
          }
        }
      }
    });
  },

  /**
   * Spending Trend Line Chart
   */
  createSpendingTrendChart() {
    this.destroyChart('spendingTrendChart');

    const dailyData = Storage.getDailySpending();
    const dates = Object.keys(dailyData).sort();
    const amounts = dates.map(date => dailyData[date]);

    const ctx = document.getElementById('spendingTrendChart');
    if (!ctx) return;

    this.chartInstances['spendingTrendChart'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [{
          label: 'Daily Spending',
          data: amounts,
          borderColor: 'rgba(46, 204, 113, 1)',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(46, 204, 113, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Spending Trend',
            font: { size: 14, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '₹' + value.toFixed(0);
              }
            }
          }
        }
      }
    });
  },

  /**
   * Category-wise Spending Pie Chart
   */
  createCategoryWiseChart() {
    this.destroyChart('categoryWiseChart');

    const categoryData = Storage.getCategoryWiseSpending();
    const categories = Object.keys(categoryData);
    const amounts = categories.map(cat => categoryData[cat]);

    const ctx = document.getElementById('categoryWiseChart');
    if (!ctx) return;

    const colors = [
      'rgba(231, 76, 60, 0.7)',
      'rgba(230, 126, 34, 0.7)',
      'rgba(241, 196, 15, 0.7)',
      'rgba(46, 204, 113, 0.7)',
      'rgba(52, 152, 219, 0.7)',
      'rgba(155, 89, 182, 0.7)',
      'rgba(52, 73, 94, 0.7)',
      'rgba(26, 188, 156, 0.7)'
    ];

    this.chartInstances['categoryWiseChart'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [{
          data: amounts,
          backgroundColor: colors.slice(0, categories.length),
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          },
          title: {
            display: true,
            text: 'Category-wise Spending Distribution',
            font: { size: 14, weight: 'bold' }
          }
        }
      }
    });
  },

  /**
   * Credit vs Debit Chart
   */
  createCreditVsDebitChart() {
    this.destroyChart('creditVsDebitChart');

    const analytics = Storage.getSpendingAnalytics();

    const ctx = document.getElementById('creditVsDebitChart');
    if (!ctx) return;

    this.chartInstances['creditVsDebitChart'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
          label: 'Amount (₹)',
          data: [analytics.totalCredit, analytics.totalDebit],
          backgroundColor: [
            'rgba(46, 204, 113, 0.7)',
            'rgba(231, 76, 60, 0.7)'
          ],
          borderColor: [
            'rgba(46, 204, 113, 1)',
            'rgba(231, 76, 60, 1)'
          ],
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Income vs Expenses',
            font: { size: 14, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '₹' + value.toFixed(0);
              }
            }
          }
        }
      }
    });
  },

  /**
   * Quarterly Spending Chart
   */
  createQuarterlySpendingChart() {
    this.destroyChart('quarterlySpendingChart');

    const quarterlyData = Storage.getQuarterlySpending();
    const quarters = Object.keys(quarterlyData).sort();
    const amounts = quarters.map(q => quarterlyData[q]);

    const ctx = document.getElementById('quarterlySpendingChart');
    if (!ctx) return;

    this.chartInstances['quarterlySpendingChart'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: quarters,
        datasets: [{
          label: 'Quarterly Spending',
          data: amounts,
          borderColor: 'rgba(155, 89, 182, 1)',
          backgroundColor: 'rgba(155, 89, 182, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(155, 89, 182, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Quarterly Spending',
            font: { size: 14, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '₹' + value.toFixed(0);
              }
            }
          }
        }
      }
    });
  },

  /**
   * Refresh all charts
   */
  refreshAllCharts() {
    setTimeout(() => {
      this.createMonthlySpendingChart();
      this.createSpendingTrendChart();
      this.createCategoryWiseChart();
      this.createCreditVsDebitChart();
      this.createQuarterlySpendingChart();
    }, 100);
  }
};
