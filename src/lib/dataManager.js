export async function loadData() {
  const response = await fetch(
    `${import.meta.env.BASE_URL}assets/productivity_metrics.csv`,
  );
  const csvText = await response.text();

  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");

  return lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const values = line.split(",");
      const row = {};
      headers.forEach((header, index) => {
        const value = values[index];
        const trimmedHeader = header.trim();
        if (trimmedHeader === "date") {
          row[trimmedHeader] = value.trim();
        } else {
          row[trimmedHeader] = parseFloat(value);
        }
      });
      return row;
    });
}

export function calculateProductivity(hours, focus, breaks) {
  return hours * 10 + focus * 5 - breaks * 0.5;
}
