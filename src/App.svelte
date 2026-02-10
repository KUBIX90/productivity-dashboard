<script>
  import { onMount } from "svelte";
  import LineChart from "./lib/LineChart.svelte";
  import BarChart from "./lib/BarChart.svelte";
  import Controls from "./lib/Controls.svelte";
  import { loadData, calculateProductivity } from "./lib/dataManager.js";
  import "./app.css";

  let data = [];
  let selectedDay = 1;
  let loading = true;
  let error = null;

  let hoursWorked = 8;
  let breakMinutes = 60;
  let focusLevel = 7;

  onMount(async () => {
    try {
      data = await loadData();
      loading = false;
      updateFormValues(1);
    } catch (err) {
      error = "Failed to load data. Please try again.";
      loading = false;
    }
  });

  function updateFormValues(day) {
    const dayData = data.find((d) => d.date === day);
    if (dayData) {
      hoursWorked = dayData.hours_worked;
      breakMinutes = dayData.break_minutes;
      focusLevel = dayData.focus_level;
    }
  }

  function handleDaySelect(event) {
    selectedDay = parseInt(event.target.value);
    updateFormValues(selectedDay);
  }

  function handleUpdate(event) {
    const { hours, breaks, focus } = event.detail;

    // Update the data array
    data = data.map((day) => {
      if (day.date === selectedDay) {
        return {
          ...day,
          hours_worked: hours,
          break_minutes: breaks,
          focus_level: focus,
          productivity_score: calculateProductivity(hours, focus, breaks),
        };
      }
      return day;
    });
  }

  $: selectedDayData = data.find((d) => d.date === selectedDay);
</script>

<main class="dashboard">
  <header class="header">
    <div class="container header-content">
      <div class="logo">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span>ProdDashboard Inc.</span>
      </div>
      <h1>Productivity Dashboard</h1>
    </div>
  </header>

  <div class="container main-content">
    {#if loading}
      <div class="loading">
        <div class="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    {:else if error}
      <div class="error">
        <p>{error}</p>
        <button
          class="btn btn-primary"
          on:click={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    {:else}
      <div class="day-selector card">
        <label for="day-select">Select Day to Edit:</label>
        <select
          id="day-select"
          bind:value={selectedDay}
          on:change={handleDaySelect}
        >
          {#each data as day}
            <option value={day.date}>Day {day.date}</option>
          {/each}
        </select>
      </div>

      <div class="charts-grid">
        <div class="chart-container card">
          <h2>Productivity Over Time</h2>
          <LineChart {data} highlightDay={selectedDay} />
        </div>

        <div class="chart-container card">
          <h2>Selected Day Metrics</h2>
          {#if selectedDayData}
            <BarChart data={selectedDayData} />
          {/if}
        </div>
      </div>

      <div class="controls-section card">
        <h2>Adjust Parameters</h2>
        <p class="controls-description">
          Modify the values below to see how they affect productivity. Formula:
          (Hours × 10) + (Focus × 5) − (Breaks × 0.5)
        </p>
        <Controls
          bind:hoursWorked
          bind:breakMinutes
          bind:focusLevel
          on:update={handleUpdate}
        />

        {#if selectedDayData}
          <div class="productivity-display">
            <span class="label">Calculated Productivity Score:</span>
            <span class="score"
              >{selectedDayData.productivity_score.toFixed(1)}</span
            >
          </div>
        {/if}
      </div>

      <!-- Stats Summary -->
      <div class="stats-grid">
        <div class="stat-card card">
          <h3>Average Productivity</h3>
          <p class="stat-value">
            {(
              data.reduce((sum, d) => sum + d.productivity_score, 0) /
              data.length
            ).toFixed(1)}
          </p>
        </div>
        <div class="stat-card card">
          <h3>Best Day</h3>
          <p class="stat-value">
            Day {data.reduce((max, d) =>
              d.productivity_score > max.productivity_score ? d : max,
            ).date}
          </p>
        </div>
        <div class="stat-card card">
          <h3>Total Hours</h3>
          <p class="stat-value">
            {data.reduce((sum, d) => sum + d.hours_worked, 0)}
          </p>
        </div>
      </div>
    {/if}
  </div>
</main>

<style>
  .dashboard {
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--background);
  }

  .header {
    background: linear-gradient(
      135deg,
      var(--primary) 0%,
      var(--secondary) 100%
    );
    color: white;
    padding: var(--spacing-xl) 0;
    box-shadow: var(--shadow-lg);
    /* Safe area for iOS notch */
    padding-top: max(var(--spacing-xl), env(safe-area-inset-top));
  }

  .header-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 1.125rem;
    font-weight: 600;
  }

  .logo svg {
    width: 36px;
    height: 36px;
    stroke: white;
  }

  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.2;
  }

  .main-content {
    padding: var(--spacing-lg) var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    /* Safe area for iOS home indicator */
    padding-bottom: max(var(--spacing-lg), env(safe-area-inset-bottom));
  }

  .day-selector {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .day-selector label {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 1.1rem;
  }

  .day-selector select {
    width: 100%;
    max-width: 300px;
  }

  .charts-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
    width: 100%;
    min-width: 0;
  }

  .chart-container {
    min-width: 0;
    overflow: hidden;
  }

  .chart-container h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
  }

  .controls-section h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
    color: var(--text-primary);
  }

  .controls-description {
    color: var(--text-secondary);
    font-size: 1rem;
    margin-bottom: var(--spacing-lg);
    line-height: 1.5;
  }

  .productivity-display {
    margin-top: var(--spacing-lg);
    padding: var(--spacing-md) var(--spacing-lg);
    background: linear-gradient(
      135deg,
      var(--primary) 0%,
      var(--secondary) 100%
    );
    border-radius: 16px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .productivity-display .label {
    font-weight: 600;
    font-size: 1.1rem;
  }

  .productivity-display .score {
    font-size: 2.5rem;
    font-weight: 700;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
  }

  .stat-card {
    text-align: center;
    padding: var(--spacing-md);
  }

  .stat-card h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--primary);
  }

  .loading,
  .error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem var(--spacing-md);
    gap: var(--spacing-md);
    text-align: center;
  }

  .spinner {
    width: 56px;
    height: 56px;
    border: 4px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error {
    color: var(--error);
  }

  /* iPad Landscape */
  @media (min-width: 1024px) and (max-width: 1366px) {
    .header {
      padding: var(--spacing-xl) 0;
    }

    h1 {
      font-size: 1.75rem;
    }

    .main-content {
      padding: var(--spacing-lg);
      gap: var(--spacing-lg);
    }

    .charts-grid {
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
      min-width: 0;
    }

    .chart-container {
      min-width: 0;
      padding: var(--spacing-md);
    }

    .chart-container h2 {
      font-size: 1.25rem;
      margin-bottom: var(--spacing-sm);
    }

    .stats-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .stat-card {
      padding: var(--spacing-md);
    }

    .stat-value {
      font-size: 1.75rem;
    }
  }

  /* iPad Portrait  */
  @media (min-width: 768px) and (max-width: 1023px) {
    .header {
      padding: var(--spacing-lg) 0;
    }

    h1 {
      font-size: 1.875rem;
    }

    .main-content {
      padding: var(--spacing-lg);
      gap: var(--spacing-xl);
    }

    .day-selector {
      flex-direction: row;
      align-items: center;
      gap: var(--spacing-md);
    }

    .charts-grid {
      grid-template-columns: 1fr;
      gap: var(--spacing-xl);
    }

    .stats-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-md);
    }
  }
</style>
