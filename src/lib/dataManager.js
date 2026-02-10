export async function loadData() {
  const response = await fetch(
    `${import.meta.env.BASE_URL}assets/productivity_metrics.csv`,
  );
  const csvText = await response.text();

  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const row = {};
    headers.forEach((header, index) => {
      const value = values[index];
      if (header.trim() === "productivity_score") {
        const parsedValue = value.split("\r")[0];
        row[header.trim()] = parsedValue;
      } else {
        row[header.trim()] = value;
      }
    });
    return row;
  });
}

export function calculateProductivity(hours, focus, breaks) {
  return hours * 10 + focus * 5 - breaks * 0.5;
}
