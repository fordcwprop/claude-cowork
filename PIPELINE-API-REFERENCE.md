# CW Properties Pipeline API Reference

Use this document to push deals into the CW Properties deal pipeline at pipeline.cwprop.com.

## Base URL

```
https://pipeline-backend.office-a21.workers.dev
```

## Authentication

Pass the user's email via header to identify who is creating/updating deals:

```
Cf-Access-Authenticated-User-Email: macminicp@gmail.com
```

Admin emails (full write access): jmiddleton@cwprop.com, jackm@cwprop.com, johnthomasva@gmail.com, ford@cwprop.com, macminicp@gmail.com. Any @cwprop.com email also gets admin.

---

## Create a Deal

```
POST /api/deals
Content-Type: application/json
Cf-Access-Authenticated-User-Email: macminicp@gmail.com
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Deal name (also used to generate the URL-safe `id` if `id` not provided) |

### Optional Fields — Property Info

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | URL-safe slug (auto-generated from name if omitted) |
| `address` | string | Street address |
| `city` | string | City |
| `state` | string | State (2-letter code, e.g. "VA") |
| `submarket` | string | Submarket name |
| `units` | integer | Number of units |
| `total_sf` | integer | Total square footage |
| `year_built` | integer | Year built |
| `property_type` | string | "multifamily", "btr", "mixed-use", etc. |
| `deal_type` | string | "acquisition", "development", "value-add", etc. |
| `status` | string | "new", "reviewing", "underwriting", "loi", "due-diligence", "closed", "dead" |
| `starred` | integer | 1 = starred, 0 = not |

### Optional Fields — Financials (Acquisition)

| Field | Type | Description |
|-------|------|-------------|
| `purchase_price` | number | Total purchase price ($) |
| `closing_costs` | number | Estimated closing costs ($) |
| `capex_budget` | number | Planned capital expenditure ($) |

### Optional Fields — Revenue

| Field | Type | Description |
|-------|------|-------------|
| `gross_potential_rent` | number | Annual gross potential rent ($) |
| `vacancy_rate` | number | Decimal (0.05 = 5%) |
| `other_income_per_unit` | number | Annual other income per unit ($) |
| `concessions_per_unit` | number | Annual concessions per unit ($) |

### Optional Fields — Expenses

| Field | Type | Description |
|-------|------|-------------|
| `taxes` | number | Annual property taxes ($) |
| `insurance` | number | Annual insurance ($) |
| `utilities` | number | Annual utilities ($) |
| `repairs_maintenance` | number | Annual R&M ($) |
| `management_fee_pct` | number | Decimal (0.03 = 3%) |
| `admin` | number | Annual admin costs ($) |
| `payroll` | number | Annual payroll ($) |
| `marketing` | number | Annual marketing ($) |
| `capex_reserve_per_unit` | number | Annual capex reserve per unit (default: $250) |
| `total_expenses_override` | number | If set, overrides all individual expense fields |

### Optional Fields — Financing

| Field | Type | Description |
|-------|------|-------------|
| `ltv` | number | Loan-to-value decimal (0.65 = 65%) |
| `interest_rate` | number | Decimal (0.065 = 6.5%) |
| `amortization_years` | integer | Amortization period (default: 30) |
| `io_period_months` | integer | Interest-only period in months |
| `loan_term_years` | integer | Loan term in years |

### Optional Fields — Exit Assumptions

| Field | Type | Description |
|-------|------|-------------|
| `exit_cap_rate` | number | Decimal (0.055 = 5.5%) |
| `sale_costs_pct` | number | Decimal (0.02 = 2%) |
| `hold_period_years` | integer | Hold period (default: 5) |

### Optional Fields — Broker

| Field | Type | Description |
|-------|------|-------------|
| `broker_name` | string | Broker name |
| `broker_company` | string | Brokerage |
| `broker_email` | string | Broker email |
| `broker_phone` | string | Broker phone |

### Optional Fields — Notes & Analysis

| Field | Type | Description |
|-------|------|-------------|
| `notes` | string | General notes |
| `summary` | string | Deal summary |
| `risk_factors` | string | Identified risks |
| `investment_thesis` | string | Investment thesis |

### Optional Fields — Key Dates

| Field | Type | Description |
|-------|------|-------------|
| `date_listed` | string | ISO date |
| `date_cfo` | string | Call for offers date |
| `date_best_final` | string | Best & final date |
| `date_loi_submitted` | string | LOI submitted date |
| `date_loi_accepted` | string | LOI accepted date |
| `date_dd_start` | string | Due diligence start |
| `date_dd_end` | string | Due diligence end |
| `date_closing` | string | Closing date |

### Optional Fields — Unit Mix

| Field | Type | Description |
|-------|------|-------------|
| `unit_mix` | array | Array of objects: `[{"type": "1BR/1BA", "count": 48, "sf": 750, "rent": 1250}, ...]` |

### Example Request

```bash
curl -X POST https://pipeline-backend.office-a21.workers.dev/api/deals \
  -H "Content-Type: application/json" \
  -H "Cf-Access-Authenticated-User-Email: macminicp@gmail.com" \
  -d '{
    "name": "Willow Creek Apartments",
    "address": "1234 Elm Street",
    "city": "Richmond",
    "state": "VA",
    "submarket": "West End",
    "units": 120,
    "total_sf": 96000,
    "year_built": 1998,
    "property_type": "multifamily",
    "deal_type": "acquisition",
    "status": "reviewing",
    "purchase_price": 15000000,
    "closing_costs": 225000,
    "capex_budget": 1200000,
    "gross_potential_rent": 1728000,
    "vacancy_rate": 0.06,
    "taxes": 180000,
    "insurance": 72000,
    "utilities": 48000,
    "repairs_maintenance": 60000,
    "management_fee_pct": 0.03,
    "ltv": 0.65,
    "interest_rate": 0.065,
    "amortization_years": 30,
    "exit_cap_rate": 0.055,
    "hold_period_years": 5,
    "notes": "Strong suburban location. Value-add potential with unit renovations.",
    "investment_thesis": "Below-market rents with $150/unit upside after renovation."
  }'
```

### Response (201 Created)

Returns the full deal object with auto-calculated metrics:

```json
{
  "id": "willow-creek-apartments",
  "name": "Willow Creek Apartments",
  "metrics": {
    "noi": 1098960,
    "going_in_cap_rate": 0.0733,
    "dscr": 1.42,
    "price_per_unit": 125000,
    "cash_on_cash": 0.0812,
    "levered_irr": 0.1634,
    "equity_multiple": 2.01
  },
  "risk": {
    "score": 8,
    "level": "low",
    "factors": [...]
  }
}
```

---

## Update a Deal

```
PATCH /api/deals/{deal_id}
Content-Type: application/json
Cf-Access-Authenticated-User-Email: macminicp@gmail.com
```

Send only the fields you want to change. Same field names as create.

```bash
curl -X PATCH https://pipeline-backend.office-a21.workers.dev/api/deals/willow-creek-apartments \
  -H "Content-Type: application/json" \
  -H "Cf-Access-Authenticated-User-Email: macminicp@gmail.com" \
  -d '{"status": "underwriting", "notes": "Updated after site visit."}'
```

---

## Other Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/deals` | List all deals (supports `?status=`, `?state=`, `?search=`, `?starred=1`, `?sort=`, `?dir=`) |
| GET | `/api/deals/{id}` | Get single deal with metrics and activity |
| DELETE | `/api/deals/{id}` | Delete a deal |
| GET | `/api/stats` | Pipeline stats (totals, avg cap rate, avg DSCR) |
| GET | `/api/activity` | Recent activity log (`?limit=`, `?deal_id=`) |
| GET | `/api/deals/compare?ids=a,b,c` | Compare up to 5 deals side-by-side |
| GET | `/api/deals/{id}/stress` | Rate and vacancy stress test scenarios |
| GET | `/api/deals/export/csv` | Export full pipeline as CSV |
| GET | `/api/me` | Check authenticated user email and role |
| GET | `/api/status` | Health check |

---

## Auto-Calculated Metrics

The API automatically calculates and returns these metrics on every deal response — you do NOT need to compute them:

- **NOI** — Net Operating Income
- **Going-in Cap Rate** — NOI / Purchase Price
- **DSCR** — Debt Service Coverage Ratio
- **Price per Unit** and **Price per SF**
- **Cash-on-Cash Return** — Year 1 cash flow / equity
- **Levered IRR** — Internal rate of return (Newton's method)
- **Equity Multiple** — Net proceeds / equity
- **Yield on Cost** — NOI / total basis
- **Risk Score** — 1-10 scale with low/medium/high level and factor breakdown

## Status Values

Use these exact strings for the `status` field:
`new`, `reviewing`, `underwriting`, `loi`, `due-diligence`, `closed`, `dead`
