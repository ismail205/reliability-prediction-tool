# 10-Year Reliability Survival Simulator

A simple educational tool that shows how **annual failure rate** affects **reliability** and the **expected number of failed assets** over time.

## Purpose

This simulator helps reliability engineers, asset managers, business owners, and financial decision makers understand one key idea:

> Reliability improvement is not only a technical issue — it is a business performance conversation.

The tool is intended for explanation, learning, and stakeholder communication.

## What the Tool Shows

- Reliability over the selected period
- Expected surviving assets
- Expected failed assets
- Annual failure rate per asset
- Equivalent MTBF
- Year-by-year results
- A chart showing reliability decreasing and failed assets increasing over time

## Inputs

| Input | Meaning |
|---|---|
| Asset population | Number of similar assets being analysed |
| Annual failure rate per asset | Failures per asset per year |
| Mission / analysis period | Number of years to model |

Example:

```text
Annual failure rate = 0.10 failures / asset / year
```

This means approximately:

```text
10 failures per 100 assets per year
```

## Model Used

```text
R(t) = e^(-λt)
```

Where:

```text
R(t) = reliability at time t
λ = annual failure rate per asset
t = time in years
```

Expected failed assets:

```text
Failed assets = N × (1 - R(t))
```

Where:

```text
N = asset population
```

## Key Assumptions

This simulator assumes:

- Exponential failure distribution
- Random failures
- Constant failure rate
- Similar assets operating in a similar context
- Independent failures

The model does not include ageing, wear-out, infant mortality, maintenance actions, replacements, renewals, repair cycles, or common-cause failures.

## Disclaimer

This tool is for **educational and conceptual use only**.

It should not be used as a formal engineering, safety, financial, maintenance, asset-management, or investment decision-making tool.

## Files

```text
index.html
styles.css
app.js
README.md
```

## How to Use

Open `index.html` in a browser, or publish the files using GitHub Pages.

