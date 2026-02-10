<script>
  import { createEventDispatcher } from "svelte";

  export let hoursWorked = 8;
  export let breakMinutes = 60;
  export let focusLevel = 7;

  const dispatch = createEventDispatcher();

  function handleInput() {
    dispatch("update", {
      hours: hoursWorked,
      breaks: breakMinutes,
      focus: focusLevel,
    });
  }

  $: hoursError = hoursWorked < 0 || hoursWorked > 24;
  $: breaksError = breakMinutes < 0 || breakMinutes > 480;
  $: focusError = focusLevel < 1 || focusLevel > 10;

  function adjustHours(delta) {
    hoursWorked = Math.max(0, Math.min(24, hoursWorked + delta));
    handleInput();
  }

  function adjustBreaks(delta) {
    breakMinutes = Math.max(0, Math.min(480, breakMinutes + delta));
    handleInput();
  }

  function adjustFocus(delta) {
    focusLevel = Math.max(1, Math.min(10, focusLevel + delta));
    handleInput();
  }
</script>

<div class="controls-grid">
  <div class="control-group">
    <div class="control-header">
      <label for="hours">Hours Worked</label>
      <span class="value-display">{hoursWorked}h</span>
    </div>
    <div class="input-row">
      <button
        class="adjust-btn"
        on:click={() => adjustHours(-0.5)}
        aria-label="Decrease hours"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path d="M5 12h14" />
        </svg>
      </button>
      <input
        type="range"
        id="hours-slider"
        min="0"
        max="16"
        step="0.5"
        bind:value={hoursWorked}
        on:input={handleInput}
      />
      <button
        class="adjust-btn"
        on:click={() => adjustHours(0.5)}
        aria-label="Increase hours"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path d="M5 12h14M12 5v14" />
        </svg>
      </button>
    </div>
    <input
      type="number"
      id="hours"
      min="0"
      max="24"
      step="0.5"
      bind:value={hoursWorked}
      on:input={handleInput}
      class:error={hoursError}
      placeholder="Hours"
    />
    {#if hoursError}
      <span class="error-message">Must be between 0-24 hours</span>
    {/if}
  </div>

  <div class="control-group">
    <div class="control-header">
      <label for="breaks">Break Minutes</label>
      <span class="value-display">{breakMinutes}m</span>
    </div>
    <div class="input-row">
      <button
        class="adjust-btn"
        on:click={() => adjustBreaks(-5)}
        aria-label="Decrease breaks"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path d="M5 12h14" />
        </svg>
      </button>
      <input
        type="range"
        id="breaks-slider"
        min="0"
        max="240"
        step="5"
        bind:value={breakMinutes}
        on:input={handleInput}
      />
      <button
        class="adjust-btn"
        on:click={() => adjustBreaks(5)}
        aria-label="Increase breaks"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path d="M5 12h14M12 5v14" />
        </svg>
      </button>
    </div>
    <input
      type="number"
      id="breaks"
      min="0"
      max="480"
      step="5"
      bind:value={breakMinutes}
      on:input={handleInput}
      class:error={breaksError}
      placeholder="Minutes"
    />
    {#if breaksError}
      <span class="error-message">Must be between 0-480 minutes</span>
    {/if}
  </div>

  <!-- Focus Level -->
  <div class="control-group">
    <div class="control-header">
      <label for="focus">Focus Level</label>
      <span class="value-display">{focusLevel}/10</span>
    </div>
    <div class="input-row">
      <button
        class="adjust-btn"
        on:click={() => adjustFocus(-1)}
        aria-label="Decrease focus"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path d="M5 12h14" />
        </svg>
      </button>
      <input
        type="range"
        id="focus-slider"
        min="1"
        max="10"
        step="1"
        bind:value={focusLevel}
        on:input={handleInput}
      />
      <button
        class="adjust-btn"
        on:click={() => adjustFocus(1)}
        aria-label="Increase focus"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path d="M5 12h14M12 5v14" />
        </svg>
      </button>
    </div>
    <input
      type="number"
      id="focus"
      min="1"
      max="10"
      step="1"
      bind:value={focusLevel}
      on:input={handleInput}
      class:error={focusError}
      placeholder="1-10"
    />
    {#if focusError}
      <span class="error-message">Must be between 1-10</span>
    {/if}
  </div>
</div>

<style>
  .controls-grid {
    display: grid;
    gap: var(--spacing-xl);
    grid-template-columns: 1fr;
  }

  @media (min-width: 768px) {
    .controls-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
    }
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    background: rgba(248, 250, 252, 0.5);
    padding: var(--spacing-md);
    border-radius: 12px;
    border: 1px solid var(--border);
  }

  .control-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xs);
  }

  label {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 1.05rem;
  }

  .value-display {
    font-weight: 700;
    color: var(--primary);
    font-size: 1.1rem;
    background: rgba(79, 70, 229, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
  }

  .input-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }

  .adjust-btn {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 2px solid var(--border);
    background: white;
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .adjust-btn svg {
    width: 20px;
    height: 20px;
  }

  .adjust-btn:active {
    transform: scale(0.92);
    background: var(--primary);
    border-color: var(--primary);
    color: white;
  }

  .adjust-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  input[type="range"] {
    flex: 1;
    height: 12px;
    -webkit-appearance: none;
    appearance: none;
    background: var(--border);
    border-radius: 6px;
    outline: none;
    cursor: pointer;
    min-width: 0;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 32px;
    height: 32px;
    background: var(--primary);
    border-radius: 50%;
    cursor: pointer;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
    box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
    border: 3px solid white;
  }

  input[type="range"]::-webkit-slider-thumb:active {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  }

  input[type="range"]::-moz-range-thumb {
    width: 32px;
    height: 32px;
    background: var(--primary);
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid white;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
    box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
  }

  input[type="range"]::-moz-range-thumb:active {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  }

  input[type="number"] {
    width: 100%;
    min-height: 48px;
    padding: 0.75rem;
    border: 2px solid var(--border);
    border-radius: 12px;
    font-size: 18px;
    text-align: center;
    transition: all 0.2s;
    font-weight: 600;
    background: white;
  }

  input[type="number"]:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15);
  }

  input[type="number"].error {
    border-color: var(--error);
    background-color: rgba(239, 68, 68, 0.05);
  }

  .error-message {
    color: var(--error);
    font-size: 0.875rem;
    font-weight: 500;
    margin-top: 0.25rem;
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    .controls-grid {
      gap: var(--spacing-md);
    }

    .control-group {
      padding: var(--spacing-md);
    }
  }

  /* Landscape mode on tablets */
  @media (min-width: 1024px) and (max-height: 800px) {
    .controls-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
    }
  }
</style>
