<script>
  import { onMount, afterUpdate } from "svelte";
  import Chart from "chart.js/auto";

  export let data = {};

  let canvas;
  let chart;

  function createChart() {
    const ctx = canvas.getContext("2d");

    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Hours Worked", "Break Minutes", "Focus Level"],
        datasets: [
          {
            label: "Value",
            data: [data.hours_worked, data.break_minutes, data.focus_level],
            backgroundColor: [
              "rgba(79, 70, 229, 0.85)",
              "rgba(6, 182, 212, 0.85)",
              "rgba(16, 185, 129, 0.85)",
            ],
            borderColor: ["#4f46e5", "#06b6d4", "#10b981"],
            borderWidth: 2,
            borderRadius: 12,
            borderSkipped: false,
            barThickness: 50,
            maxBarThickness: 80,
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
              label: (item) => {
                const labels = ["hours", "minutes", "out of 10"];
                const formattedValue =
                  item.dataIndex === 1
                    ? Math.round(item.raw)
                    : item.raw.toFixed(1);
                return `${formattedValue} ${labels[item.dataIndex]}`;
              },
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
              font: {
                size:
                  typeof window !== "undefined" &&
                  window.innerWidth <= 1366 &&
                  window.innerWidth >= 1024
                    ? 12
                    : 13,
                weight: "600",
              },
              padding: 8,
              color: "#1e293b",
              maxRotation: 0,
            },
            border: {
              display: false,
            },
          },
        },
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
    if (data && Object.keys(data).length > 0) {
      createChart();
    }

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
    if (chart && data && Object.keys(data).length > 0) {
      chart.data.datasets[0].data = [
        data.hours_worked,
        data.break_minutes,
        data.focus_level,
      ];
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
