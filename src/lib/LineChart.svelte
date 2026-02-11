<script>
  import { onMount, afterUpdate } from "svelte";
  import Chart from "chart.js/auto";

  export let data = [];
  export let highlightDay = "";

  let canvas;
  let chart;

  function createChart() {
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(79, 70, 229, 0.4)");
    gradient.addColorStop(1, "rgba(79, 70, 229, 0.05)");

    const pointColors = data.map((d) =>
      d.date === highlightDay ? "#ef4444" : "#4f46e5",
    );

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((d) => {
          const date = new Date(d.date);
          return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
        }),
        datasets: [
          {
            label: "Productivity Score",
            data: data.map((d) => d.productivity_score),
            borderColor: "#4f46e5",
            backgroundColor: gradient,
            borderWidth: 3,
            pointBackgroundColor: pointColors,
            pointBorderColor: "#ffffff",
            pointBorderWidth: 3,
            pointRadius: 8,
            pointHoverRadius: 14,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 5,
            right: 15,
            top: 10,
            bottom: 5,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            backgroundColor: "rgba(30, 41, 59, 0.95)",
            padding: 16,
            cornerRadius: 12,
            displayColors: false,
            titleFont: {
              size: 16,
              weight: "600",
            },
            bodyFont: {
              size: 15,
              weight: "500",
            },
            callbacks: {
              title: (items) => items[0].label,
              label: (item) => `Productivity: ${item.raw.toFixed(1)}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(226, 232, 240, 0.8)",
              drawBorder: false,
            },
            ticks: {
              font: {
                size: 13,
                weight: "500",
              },
              padding: 10,
              color: "#64748b",
            },
            border: {
              display: false,
            },
          },
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              maxTicksLimit: 6,
              font: {
                size:
                  typeof window !== "undefined" &&
                  window.innerWidth <= 1366 &&
                  window.innerWidth >= 1024
                    ? 11
                    : 12,
                weight: "500",
              },
              padding: 8,
              color: "#64748b",
              maxRotation: 45,
              minRotation: 0,
            },
            border: {
              display: false,
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        // Better touch handling
        onHover: (event, chartElement) => {
          event.native.target.style.cursor = chartElement[0]
            ? "pointer"
            : "default";
        },
      },
    });
  }

  function handleResize() {
    if (chart) {
      chart.resize();
    }
  }

  onMount(() => {
    if (data.length > 0) {
      createChart();
    }

    // Debounced resize handler for responsive charts
    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    window.addEventListener("orientationchange", () => {
      setTimeout(handleResize, 300);
    });

    return () => {
      if (chart) chart.destroy();
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("orientationchange", debouncedResize);
      clearTimeout(resizeTimeout);
    };
  });

  afterUpdate(() => {
    if (chart && data.length > 0) {
      const pointColors = data.map((d) =>
        d.date === highlightDay ? "#ef4444" : "#4f46e5",
      );

      chart.data.datasets[0].data = data.map((d) => d.productivity_score);
      chart.data.datasets[0].pointBackgroundColor = pointColors;
      chart.update("none");
    }
  });
</script>

<div class="chart-wrapper">
  <div class="chart-canvas-container">
    <canvas bind:this={canvas}></canvas>
  </div>
</div>

<style>
  .chart-wrapper {
    position: relative;
    width: 100%;
    height: 350px;
    min-height: 250px;
    max-height: 450px;
    touch-action: pan-y pinch-zoom;
    overflow: hidden;
  }

  .chart-canvas-container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 0;
  }

  .chart-canvas-container canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }

  /* iPad Landscape */
  @media (min-width: 1024px) and (max-width: 1366px) {
    .chart-wrapper {
      height: 320px;
      min-height: 280px;
    }
  }

  /* iPad Portrait */
  @media (min-width: 768px) and (max-width: 1023px) {
    .chart-wrapper {
      height: 340px;
      min-height: 280px;
    }
  }
</style>
