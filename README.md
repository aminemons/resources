# Micro & Nano — Learning Library

A structured, independent library for microelectronics, nanoelectronics and adjacent engineering fields.

**Website:** deployed from the repository root on Vercel (index.html + data/resources.json).

## What's in the library

248 initial curated entries (21 October 2026) spanning 14 disciplines: foundations, semiconductor physics, analog and digital ICs, FPGA/computer architecture, silicon layout and PDKs, RF, photonics, MEMS, materials/fabrication, quantum, embedded systems, scientific computing, and research.

Entries include:
- Books by exact title and author (bibliographic searches, no unauthorized hosted PDFs).
- Full courses, tutorials, references, documentation and research databases.
- Open-source and proprietary simulators/design tools with clear access labels.
- Six guided paths from theory to a practical project.

## Data

Edit `data/resources.json`. Every entry has:
`id`, `domain`, `kind`, `title`, `provider`, `access`, `level`, `url`, `description`.

Keep entries accurate and useful. Prefer official vendor, institution or project URLs. Free/open vs paid/institutional access must not be misrepresented. Avoid duplicate titles and stale product pages. Do not add links to pirated textbooks, paywall circumvention or redistributed copyrighted books.

**Important:** A curated URL is not proof of current availability. `data/link-health.json` is an automated health audit, which can be blocked by rate limits or bot protection. A reachable homepage does not verify a specific course enrollment or a license.

## Operations

The site is static: no sign-in, tracking or backend required. Bookmarks stay in the user's browser. Filters and search run locally against the downloaded JSON. Export CSV is available.

GitHub Actions checks non-book links once per week and writes a source audit. This is *not* an autonomous human literature review; newly found resources need curation. Scheduled workflows can be delayed/disabled by GitHub, so check Actions.

## Contributing

PRs are welcome with title, provider, official resource URL, whether it is free, a clear one-sentence learning purpose, and the relevant discipline. No fabricated claims.
