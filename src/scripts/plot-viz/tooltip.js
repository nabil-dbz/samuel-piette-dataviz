export function getContents (player, baseSalary, marketValue, currentValue ) {
  var toolTipCurrency = currentValue == "Market Value 1,000,000€" ? "€" : "$";
  var xAxisTooltipLabel =
    currentValue == "Market Value 1,000,000€"
      ? 'Market Value'
      : 'Guaranteed Compensation';

  return `
    <div>
      <div>
          <label class="legend-title">Player :</label>
          <label class="tooltip-value">${player}</label>
      </div>
      <div>
          <label class="legend-title">Base Salary :</label>
          <label class="tooltip-value">${baseSalary}$ </label>
      </div>
      <div>
          <label class="legend-title">${xAxisTooltipLabel}  :</label>
          <label class="tooltip-value">${marketValue} ${toolTipCurrency}</label>
      </div>
    </div>
  `
}