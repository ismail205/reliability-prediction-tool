/*
10-Year Reliability Survival Simulator

Educational model:
R(t) = e^(-lambda * t)

Where:
lambda = annual failure rate per asset
t = time in years

Surviving assets = asset population * R(t)
Failed assets = asset population * (1 - R(t))

Assumption:
Exponential distribution with random failures and constant failure rate.
*/

const $ = (id) => document.getElementById(id);

const inputs = {
  assetPopulation: $("assetPopulation"),
  failureRateSlider: $("failureRateSlider"),
  missionYears: $("missionYears")
};

const outputs = {
  failureRateDisplay: $("failureRateDisplay"),
  failureRateHelper: $("failureRateHelper"),
  finalReliability: $("finalReliability"),
  finalReliabilityText: $("finalReliabilityText"),
  survivingAssets: $("survivingAssets"),
  failedAssets: $("failedAssets"),
  lambdaPerYear: $("lambdaPerYear"),
  mtbf: $("mtbf"),
  chart: $("reliabilityChart"),
  chartTooltip: $("chartTooltip"),
  yearTableBody: $("yearTableBody"),
  downloadChartBtn: $("downloadChartBtn")
};

let latestResult = null;

function getNumber(element, fallback = 0) {
  const value = Number(element.value);
  return Number.isFinite(value) ? value : fallback;
}

function formatPercent(value, decimals = 2) {
  if (!Number.isFinite(value)) return "—";
  return `${(value * 100).toFixed(decimals)}%`;
}

function formatNumber(value, decimals = 0) {
  if (!Number.isFinite(value)) return "—";

  return value.toLocaleString("en-AU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function reliability(annualFailureRate, years) {
  return Math.exp(-annualFailureRate * years);
}

function calculate() {
  const assetPopulation = Math.max(getNumber(inputs.assetPopulation, 1000), 1);

  const annualFailureRate = Math.max(
    getNumber(inputs.failureRateSlider, 0.10),
    0
  );

  const missionYears = Math.max(getNumber(inputs.missionYears, 10), 1);

  const finalReliability = reliability(annualFailureRate, missionYears);
  const expectedSurvivors = assetPopulation * finalReliability;
  const expectedFailed = assetPopulation - expectedSurvivors;

  const mtbfYears = annualFailureRate > 0 ? 1 / annualFailureRate : Infinity;

  const yearlyData = [];

  for (let year = 0; year <= missionYears; year++) {
    const r = reliability(annualFailureRate, year);
    const survivors = assetPopulation * r;
    const failed = assetPopulation - survivors;

    yearlyData.push({
      year,
      reliability: r,
      survivors,
      failed
    });
  }

  return {
    assetPopulation,
    annualFailureRate,
    missionYears,
    finalReliability,
    expectedSurvivors,
    expectedFailed,
    mtbfYears,
    yearlyData
  };
}

function updateOutputs() {
  const result = calculate();
  latestResult = result;

  outputs.failureRateDisplay.textContent =
    `${result.annualFailureRate.toFixed(3)} failures / asset / year`;

  outputs.failureRateHelper.textContent =
    `${result.annualFailureRate.toFixed(3)} failures per asset per year is approximately ${formatNumber(result.annualFailureRate * 100, 1)} failures per 100 assets per year.`;

  outputs.finalReliability.textContent =
    formatPercent(result.finalReliability, 2);

  outputs.finalReliabilityText.textContent =
    `After ${formatNumber(result.missionYears, 0)} years`;

  outputs.survivingAssets.textContent =
    `${formatNumber(result.expectedSurvivors, 0)} of ${formatNumber(result.assetPopulation, 0)}`;

  outputs.failedAssets.textContent =
    formatNumber(result.expectedFailed, 0);

  outputs.lambdaPerYear.textContent =
    `${result.annualFailureRate.toFixed(3)} failures / asset / year`;

  outputs.mtbf.textContent =
    Number.isFinite(result.mtbfYears)
      ? `${formatNumber(result.mtbfYears, 2)} years`
      : "Infinite";

  drawChart(result);
  renderTable(result);
}

function drawChart(result) {
  const svg = outputs.chart;
  const width = 900;
  const height = 420;

  const margin = {
    top: 34,
    right: 78,
    bottom: 52,
    left: 64
  };

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  svg.innerHTML = "";

  const createSvgElement = (name, attributes = {}) => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", name);

    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });

    return element;
  };

  function xScale(year) {
    return margin.left + (year / result.missionYears) * chartWidth;
  }

  function yLeftScale(reliabilityValue) {
    return margin.top + (1 - reliabilityValue) * chartHeight;
  }

  function yRightScale(failedAssets) {
    return margin.top + (1 - failedAssets / result.assetPopulation) * chartHeight;
  }

  function addText(text, attrs) {
    const label = createSvgElement("text", attrs);
    label.textContent = text;
    svg.appendChild(label);
    return label;
  }

  svg.appendChild(
    createSvgElement("rect", {
      x: 0,
      y: 0,
      width,
      height,
      fill: "#f8fafc"
    })
  );

  const bands = [
    {
      label: "High reliability zone",
      from: 1.0,
      to: 0.8,
      fill: "#ecfdf3"
    },
    {
      label: "Moderate reliability zone",
      from: 0.8,
      to: 0.5,
      fill: "#fff7ed"
    },
    {
      label: "Low reliability zone",
      from: 0.5,
      to: 0.0,
      fill: "#fef3f2"
    }
  ];

  bands.forEach((band) => {
    const yTop = yLeftScale(band.from);
    const yBottom = yLeftScale(band.to);

    svg.appendChild(
      createSvgElement("rect", {
        x: margin.left,
        y: yTop,
        width: chartWidth,
        height: yBottom - yTop,
        fill: band.fill
      })
    );

    addText(band.label, {
      x: margin.left + 10,
      y: yTop + 18,
      "font-size": 11,
      fill: "#667085"
    });
  });

  for (let i = 0; i <= 5; i++) {
    const percent = i / 5;
    const y = yLeftScale(percent);

    svg.appendChild(
      createSvgElement("line", {
        x1: margin.left,
        y1: y,
        x2: width - margin.right,
        y2: y,
        stroke: "#d9e0ea",
        "stroke-width": 1
      })
    );

    addText(`${Math.round(percent * 100)}%`, {
      x: margin.left - 12,
      y: y + 4,
      "text-anchor": "end",
      "font-size": 12,
      fill: "#667085"
    });

    const failedValue = Math.round(percent * result.assetPopulation);

    addText(`${formatNumber(failedValue, 0)}`, {
      x: width - margin.right + 12,
      y: y + 4,
      "text-anchor": "start",
      "font-size": 12,
      fill: "#667085"
    });
  }

  const yearStep = Math.max(1, Math.ceil(result.missionYears / 10));

  for (let year = 0; year <= result.missionYears; year++) {
    const x = xScale(year);

    if (year % yearStep === 0 || year === result.missionYears) {
      svg.appendChild(
        createSvgElement("line", {
          x1: x,
          y1: margin.top,
          x2: x,
          y2: height - margin.bottom,
          stroke: "#edf0f5",
          "stroke-width": 1
        })
      );

      addText(year, {
        x,
        y: height - 20,
        "text-anchor": "middle",
        "font-size": 12,
        fill: "#667085"
      });
    }
  }

  svg.appendChild(
    createSvgElement("line", {
      x1: margin.left,
      y1: margin.top,
      x2: margin.left,
      y2: height - margin.bottom,
      stroke: "#98a2b3",
      "stroke-width": 1.5
    })
  );

  svg.appendChild(
    createSvgElement("line", {
      x1: margin.left,
      y1: height - margin.bottom,
      x2: width - margin.right,
      y2: height - margin.bottom,
      stroke: "#98a2b3",
      "stroke-width": 1.5
    })
  );

  svg.appendChild(
    createSvgElement("line", {
      x1: width - margin.right,
      y1: margin.top,
      x2: width - margin.right,
      y2: height - margin.bottom,
      stroke: "#98a2b3",
      "stroke-width": 1.5
    })
  );

  addText("Reliability (%)", {
    x: 18,
    y: height / 2,
    "text-anchor": "middle",
    "font-size": 13,
    fill: "#344054",
    transform: `rotate(-90 18 ${height / 2})`
  });

  addText("Failed assets", {
    x: width - 16,
    y: height / 2,
    "text-anchor": "middle",
    "font-size": 13,
    fill: "#344054",
    transform: `rotate(90 ${width - 16} ${height / 2})`
  });

  addText("Years", {
    x: width / 2,
    y: height - 4,
    "text-anchor": "middle",
    "font-size": 13,
    fill: "#344054"
  });

  const reliabilityPath = result.yearlyData
    .map((point, index) => {
      const x = xScale(point.year);
      const y = yLeftScale(point.reliability);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  svg.appendChild(
    createSvgElement("path", {
      d: reliabilityPath,
      fill: "none",
      stroke: "#1f5fbf",
      "stroke-width": 4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    })
  );

  const failedPath = result.yearlyData
    .map((point, index) => {
      const x = xScale(point.year);
      const y = yRightScale(point.failed);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  svg.appendChild(
    createSvgElement("path", {
      d: failedPath,
      fill: "none",
      stroke: "#f04438",
      "stroke-width": 3,
      "stroke-dasharray": "8 6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    })
  );

  const finalPoint = result.yearlyData[result.yearlyData.length - 1];
  const finalX = xScale(finalPoint.year);
  const finalReliabilityY = yLeftScale(finalPoint.reliability);
  const finalFailedY = yRightScale(finalPoint.failed);

  svg.appendChild(
    createSvgElement("circle", {
      cx: finalX,
      cy: finalReliabilityY,
      r: 7,
      fill: "#1f5fbf",
      stroke: "white",
      "stroke-width": 3
    })
  );

  svg.appendChild(
    createSvgElement("circle", {
      cx: finalX,
      cy: finalFailedY,
      r: 6,
      fill: "#f04438",
      stroke: "white",
      "stroke-width": 3
    })
  );

  addText(`R = ${formatPercent(finalPoint.reliability, 1)}`, {
    x: finalX - 8,
    y: finalReliabilityY - 14,
    "text-anchor": "end",
    "font-size": 13,
    "font-weight": 700,
    fill: "#172033"
  });

  addText(`Failed = ${formatNumber(finalPoint.failed, 0)}`, {
    x: finalX - 8,
    y: finalFailedY + 20,
    "text-anchor": "end",
    "font-size": 13,
    "font-weight": 700,
    fill: "#172033"
  });

  const hoverGroup = createSvgElement("g", {
    opacity: 0,
    id: "hoverGroup"
  });

  const hoverLine = createSvgElement("line", {
    y1: margin.top,
    y2: height - margin.bottom,
    stroke: "#344054",
    "stroke-width": 1,
    "stroke-dasharray": "4 4"
  });

  const hoverReliabilityCircle = createSvgElement("circle", {
    r: 6,
    fill: "#1f5fbf",
    stroke: "white",
    "stroke-width": 2
  });

  const hoverFailedCircle = createSvgElement("circle", {
    r: 6,
    fill: "#f04438",
    stroke: "white",
    "stroke-width": 2
  });

  hoverGroup.appendChild(hoverLine);
  hoverGroup.appendChild(hoverReliabilityCircle);
  hoverGroup.appendChild(hoverFailedCircle);
  svg.appendChild(hoverGroup);

  function handlePointerMove(event) {
    const rect = svg.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    const svgX = ((clientX - rect.left) / rect.width) * width;

    const yearFloat =
      ((svgX - margin.left) / chartWidth) * result.missionYears;

    const nearestYear = Math.max(
      0,
      Math.min(result.missionYears, Math.round(yearFloat))
    );

    const point = result.yearlyData.find((item) => item.year === nearestYear);
    if (!point) return;

    const x = xScale(point.year);
    const reliabilityY = yLeftScale(point.reliability);
    const failedY = yRightScale(point.failed);

    hoverGroup.setAttribute("opacity", "1");
    hoverLine.setAttribute("x1", x);
    hoverLine.setAttribute("x2", x);

    hoverReliabilityCircle.setAttribute("cx", x);
    hoverReliabilityCircle.setAttribute("cy", reliabilityY);

    hoverFailedCircle.setAttribute("cx", x);
    hoverFailedCircle.setAttribute("cy", failedY);

    showTooltip(clientX, clientY, point);
  }

  svg.onmousemove = handlePointerMove;

  svg.ontouchmove = (event) => {
    event.preventDefault();
    handlePointerMove(event);
  };

  svg.onmouseleave = () => {
    hoverGroup.setAttribute("opacity", "0");
    hideTooltip();
  };

  svg.ontouchend = () => {
    hoverGroup.setAttribute("opacity", "0");
    hideTooltip();
  };
}

function showTooltip(clientX, clientY, point) {
  const tooltip = outputs.chartTooltip;
  if (!tooltip) return;

  const shell = tooltip.parentElement;
  const shellRect = shell.getBoundingClientRect();

  tooltip.hidden = false;

  tooltip.innerHTML = `
    <strong>Year ${point.year}</strong>
    <span>Reliability: ${formatPercent(point.reliability, 2)}</span>
    <span>Surviving assets: ${formatNumber(point.survivors, 0)}</span>
    <span>Failed assets: ${formatNumber(point.failed, 0)}</span>
    <span>Time period: ${point.year} year${point.year === 1 ? "" : "s"}</span>
  `;

  const left = clientX - shellRect.left;
  const top = clientY - shellRect.top;

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function hideTooltip() {
  const tooltip = outputs.chartTooltip;
  if (!tooltip) return;
  tooltip.hidden = true;
}

function renderTable(result) {
  outputs.yearTableBody.innerHTML = "";

  result.yearlyData.forEach((point) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${point.year}</td>
      <td>${point.year} year${point.year === 1 ? "" : "s"}</td>
      <td>${formatPercent(point.reliability, 2)}</td>
      <td>${formatNumber(point.survivors, 0)}</td>
      <td>${formatNumber(point.failed, 0)}</td>
    `;

    outputs.yearTableBody.appendChild(row);
  });
}

function downloadChartAsPng() {
  const svg = outputs.chart;
  if (!svg || !latestResult) return;

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);

  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8"
  });

  const url = URL.createObjectURL(svgBlob);
  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1800;
    canvas.height = 840;

    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    URL.revokeObjectURL(url);

    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "reliability-failed-assets-chart.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  image.src = url;
}

function resetExample() {
  inputs.assetPopulation.value = 1000;
  inputs.failureRateSlider.value = 0.10;
  inputs.missionYears.value = 10;
  updateOutputs();
}

function attachEvents() {
  Object.values(inputs).forEach((input) => {
    input.addEventListener("input", updateOutputs);
    input.addEventListener("change", updateOutputs);
  });

  $("resetBtn").addEventListener("click", resetExample);

  if (outputs.downloadChartBtn) {
    outputs.downloadChartBtn.addEventListener("click", downloadChartAsPng);
  }
}

attachEvents();
updateOutputs();
