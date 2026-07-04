10-Year Reliability Survival Simulator

An educational reliability engineering simulator that shows how an annual failure rate affects asset reliability and the expected number of failed assets over time.
The tool is designed to help reliability engineers, asset managers, business owners, and financial decision makers understand the relationship between:
annual failure rate
asset population
reliability over time
expected surviving assets
expected failed assets
business-facing reliability communication
---
Purpose of the Tool
The purpose of this simulator is purely educational.
It helps explain that reliability improvement is not only a technical maintenance topic. It is also a business performance conversation because failures affect asset availability, service delivery, cost exposure, customer outcomes, and operational risk.
The tool is intended to support conversations such as:
> If the failure rate changes, what happens to reliability and expected failed assets over a 10-year period?
It is not intended to approve projects, justify investments, or replace formal engineering, safety, maintenance, or financial analysis.
---
What the Simulator Shows
The simulator displays:
Reliability over the selected period
Expected surviving assets
Expected failed assets
Annual failure rate per asset
Equivalent MTBF
A dual-line chart showing:
Reliability percentage
Expected failed assets
Year-by-year reliability and asset failure results
Model assumptions and educational disclaimer
---
Inputs
1. Asset Population
The total number of similar assets in the population.
Example:
```text
Asset population = 1,000
```
This means the model is estimating the expected number of surviving and failed assets from a population of 1,000 similar assets.
---
2. Annual Failure Rate per Asset
The failure rate is entered as:
```text
Failures per asset per year
```
Example:
```text
0.10 failures / asset / year
```
This means approximately:
```text
10 failures per 100 assets per year
```
The failure-rate slider allows the user to increase or decrease the annual failure rate and immediately see the impact on reliability and expected failed assets.
---
3. Mission Period / Analysis Period
The number of years over which reliability is calculated.
Default value:
```text
10 years
```
The user can adjust the period if required.
---
Formula Used
Reliability
```text
R(t) = e^(-λt)
```
Where:
```text
R(t) = reliability at time t
λ = annual failure rate per asset
t = time in years
```
Reliability represents the probability that one asset survives to time `t` without failure.
---
Expected Surviving Assets
```text
Surviving assets = N × R(t)
```
Where:
```text
N = asset population
R(t) = reliability at time t
```
---
Expected Failed Assets
```text
Failed assets = N × (1 - R(t))
```
This represents the expected number of assets that experience at least one failure during the period.
---
Equivalent MTBF
```text
MTBF = 1 / λ
```
Where:
```text
λ = annual failure rate per asset
```
If the annual failure rate is `0.10`, the equivalent MTBF is:
```text
1 / 0.10 = 10 years
```
---
Example Calculation
Assume:
```text
Asset population = 1,000
Annual failure rate = 0.10 failures / asset / year
Mission period = 10 years
```
Reliability after 10 years:
```text
R(10) = e^(-0.10 × 10)
R(10) = e^(-1)
R(10) = 36.79%
```
Expected surviving assets:
```text
1,000 × 36.79% = 368 assets
```
Expected failed assets:
```text
1,000 - 368 = 632 assets
```
So, under the model assumptions, the tool will show approximately:
```text
Reliability after 10 years = 36.79%
Expected surviving assets = 368
Expected failed assets = 632
MTBF = 10 years
```
---
Chart Explanation
The simulator includes a dual-line chart.
Blue Line
The blue line shows reliability percentage over time.
Reliability starts at 100% in Year 0 and decreases over time as the probability of failure accumulates.
Red Dashed Line
The red dashed line shows the expected number of failed assets over time.
Failed assets start at 0 in Year 0 and increase over time.
Reliability Zones
The chart includes background reliability zones:
Green: high reliability zone
Amber: moderate reliability zone
Red: low reliability zone
These zones are included for educational visualisation only and should not be treated as formal risk acceptance criteria.
---
Model Assumptions
This simulator uses a simplified reliability model with the following assumptions:
The model assumes an exponential failure distribution.
Failures are assumed to be random.
The failure rate is assumed to be constant over the full analysis period.
The annual failure rate is assumed to remain unchanged.
All assets are assumed to have the same failure rate.
All assets are assumed to operate in a similar operating context.
Failures are assumed to be statistically independent.
Common-cause failures are not included.
Systemic failures are not included.
Infant mortality is not included.
Ageing and wear-out are not included.
Maintenance interventions are not included.
Condition monitoring effects are not included.
Replacement and renewal effects are not included.
Repair strategy changes are not included.
Failed assets means the expected number of assets that experience at least one failure during the period.
For repairable assets, failed assets is not the same as total repeat failure events after repair.
Results are expected values for education and communication only.
---
Important Disclaimer
This simulator is for educational and conceptual explanation only.
It assumes random failures with a constant failure rate using an exponential distribution.
It does not model:
ageing
wear-out
infant mortality
repair cycles
replacements
renewals
preventive maintenance
condition-based maintenance
operating context changes
common-cause failures
systemic failures
safety risk
financial risk
investment returns
The simulator should not be used as a formal engineering, safety, financial, maintenance, asset-management, or investment decision-making tool.
Users should seek appropriate professional analysis before making engineering, safety, commercial, or investment decisions.
---
Intended Users
This simulator may be useful for:
Reliability engineers
Maintenance engineers
Asset managers
Engineering managers
Business owners
Financial decision makers
Students learning reliability concepts
Teams needing a simple visual explanation of reliability over time
---
How Reliability Engineers Can Use It
Reliability engineers can use this simulator as a communication aid.
Instead of only saying:
> We need to improve reliability.
The simulator helps explain:
> If the annual failure rate changes, this is how reliability and expected failed assets may change over time.
This helps connect reliability engineering work to business-facing outcomes.
---
Files Required
The simulator uses three main files:
```text
index.html
styles.css
app.js
```
Optional file:
```text
README.md
```
---
How to Run Locally
Create a folder for the simulator.
Add the following files:
`index.html`
`styles.css`
`app.js`
`README.md`
Open `index.html` in a web browser.
No server is required for basic local use.
---
How to Publish on GitHub Pages
Create a new GitHub repository.
Upload the following files:
`index.html`
`styles.css`
`app.js`
`README.md`
Go to the repository settings.
Open Pages.
Select the main branch as the publishing source.
Save the settings.
GitHub will create a live website link.
The final link will usually look like:
```text
https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY-NAME/
```
---
Suggested LinkedIn Description
Reliability improvement is not only a maintenance topic. It is a business value conversation.
This educational simulator shows how annual failure rate affects reliability and expected failed assets over a 10-year period.
It is designed to help reliability engineers and asset managers explain the business impact of reliability improvement in a simple, visual way.
---
Version
```text
Version: 1.0
Purpose: Educational reliability modelling and communication
Model: Exponential distribution with constant annual failure rate
```
