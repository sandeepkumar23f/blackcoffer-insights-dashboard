# Dataset analysis

Source file: `jsondata.json` (copied to `data/jsondata.json`).

## Overview

| Item | Value |
|------|--------|
| Total records | **1000** |
| Root type | JSON array of objects |
| Distinct field names | 17 |

## Fields present in every record

| Field | Non-empty | Empty string | Types when populated | Notes |
|-------|-----------|--------------|----------------------|--------|
| `added` | 1000 | 0 | string | Timestamp-like text, e.g. `January, 20 2017 03:51:25` |
| `country` | 350 | 650 | string | 56 unique countries |
| `end_year` | 258 | 742 | integer | Min **2016**, max **2200** (outliers 2126, 2200) |
| `impact` | 34 | 966 | integer | Min 2, max 4 — mostly missing |
| `insight` | 1000 | 0 | string | Report / article name |
| `intensity` | 962 | 38 | integer | Min 1, max 96 |
| `likelihood` | 962 | 38 | integer | Min 1, max 4 |
| `pestle` | 907 | 93 | string | 9 unique values (not a classic 6-letter PESTLE set) |
| `published` | 926 | 74 | string | Timestamp-like text |
| `region` | 547 | 453 | string | 23 labels including both `World` and `world` |
| `relevance` | 999 | 1 | integer | Min 1, max 7 |
| `sector` | 771 | 229 | string | 18 unique sectors |
| `source` | 999 | 1 | string | 403 unique sources |
| `start_year` | 310 | 690 | integer | Min **2016**, max **2050** |
| `title` | 1000 | 0 | string | |
| `topic` | 907 | 93 | string | 97 unique topics |
| `url` | 1000 | 0 | string | |

Empty strings are treated as missing (`null`) on import. Missing numerics are **not** stored or averaged as `0`.

## Assignment fields that do **not** exist

| Field | Status |
|-------|--------|
| **city** | Not present on any record. No city visualization data. Filter/chart show “unavailable”. |
| **SWOT** | Not present on any record. Not inferred from PESTLE or other fields. Filter/chart show “unavailable”. |

No other extra keys (no `city`, `swot`, `City`, `SWOT`) appear in the file.

## Categorical uniques (populated only)

**Sectors (18):** Aerospace & defence, Automotive, Construction, Energy, Environment, Financial services, Food & agriculture, Government, Healthcare, Information Technology, Manufacturing, Media & entertainment, Retail, Security, Support services, Tourism & hospitality, Transport, Water.

Top: Energy (525), Manufacturing (49), Financial services (39), Retail (38).

**Topics (97):** Top oil (403), gas (89), growth (51), energy (43), export (38), production (35).

**Regions (23 raw labels):** Northern America (132), World (131), Western Asia (44), Southern Asia (40), Eastern Asia (34), Eastern Europe (32), plus Africa / Asia / Europe subregions, Oceania, and a lowercase `world` (normalized to `World` on import).

**Countries (56):** Top United States of America (112), Russia (25), China (24), India (19), Iran (19), Saudi Arabia (18). 650 records have no country.

**PESTLE (`pestle`, 9):** Industries (344), Economic (329), Political (99), Environmental (72), Social (26), Technological (20), Organization (11), Lifestyles (4), Healthcare (2). These are the actual labels; the dashboard does not invent missing PESTLE letters.

**Sources (403):** Long-tail. Top OPEC (43), Bloomberg Business (36), DOE EIA 2013 Energy Conference (35). Charts use top-N.

## Years

- **start_year values:** 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2025, 2028, 2030, 2035, 2040, 2050
- **end_year values:** 2016–2022, 2024–2028, 2030, 2034–2036, 2040, 2041, 2046, 2050, 2051, 2055, 2060, **2126**, **2200**

Year charts use years that exist after filtering (coalesce `end_year` then `start_year`). Ranges are not hard-coded.

## Numeric quality

- Averages for intensity, likelihood, relevance, and impact ignore nulls.
- Impact is only populated on 34/1000 records, so average impact may be null or based on a small sample.
- Intensity 96 is valid in the file (not coerced).

## Import implications

- Unique fingerprint: `url` + `title` + `added` (replace-on-reimport).
- Indexes: `end_year`, `start_year`, `country`, `topic`, `sector`, `region`, `pestle`, `source` (no city/swot indexes).
