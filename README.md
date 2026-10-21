# Learning Library · Micro & Nano

**Live site:** https://micro-nano-resources.vercel.app/

An independent, student-oriented learning portal for micro/nanoelectronics and **Sensors & Smart Systems**. It is not the official ENSNN curriculum or a replacement for academic instruction.

## How to study

1. Choose a specialization: **Micro & Nanoelectronics** or **Sensors & Smart Systems**.
2. Open one of the 14 guided paths. Each contains prerequisites or concepts, specific resources, and practical assignments that result in a real artifact.
3. Mark steps complete only after doing the exercise. Progress is local to your current browser.
4. Use the wider catalogue to find supplementary tutorials, tools, books, technical documentation, lab guides and research sources.

The starting collection includes **428 distinct entries, 14 paths and 68 study stages** (catalogue state of 21 October 2026). The catalogue is expected to grow; these counts are not guaranteed to remain fixed.

### Sensors & Smart Systems

The learning paths cover an end-to-end sensing workflow:
- sensor specifications and transduction,
- micro/nanosensor device modeling,
- **Silvaco ATLAS/ATHENA/Victory, DeckBuild and TCAD** plus freely available alternatives,
- fabrication, cleanroom processes and thin-film synthesis,
- MEMS and multiphysics models,
- instrumentation, calibration, measurement uncertainty,
- embedded firmware, IoT protocols, wireless networks and TinyML,
- biosensors and lab-on-chip research.

### Micro & Nanoelectronics

Separate paths cover analog and mixed-signal IC design, digital ASIC RTL-to-GDS, FPGA, semiconductor TCAD, RF, photonic sensors and research reporting. Shared foundations bridge both specializations.

**Naming note:** The site uses the student-provided label “Sensors & Smart Systems.” The official ENSNN website was access-protected during curation. Public 2025–2026 program documentation also uses “Micro-NanoSensors and Instrumentation for Nanotechnology.” Do not treat the website's navigation label as verified formal degree nomenclature.

## Catalogue data

- `data/resources.json`: Resource records: name, type, subject, provider, student tracks, acquisition/licensing, difficulty, learning/practice/reference intent, description and source URL.
- `data/paths.json`: Structured pathways, each with ordered stages, learning outcomes, exercises and resource IDs.
- `data/link-health.json`: Automatic HTTP availability audit, **not** a guarantee of pedagogical quality or complete free access.

The interface uses Outfit at accessible body sizes, restrained typography, a left sidebar, specialization-aware browsing, a limited number of useful filters and detailed resource views. Filter state is local; bookmarks and stage completion use browser localStorage, without cloud sync.

### Integrity rules

Only list credible, useful resources. Prefer the source author's official site, directly inspect repository names, and label full courses separately from mere programme/syllabus descriptions. Never claim that a community repo or academic software license has been academically validated by automatic URL checks.

Textbooks are provided as **titles and bibliography search links**, including commercial books. The site does not host copyrighted PDFs or link to unauthorized downloads. Students should use publishers, library services and authorized lending where possible.

Commercial packages such as Silvaco TCAD, Cadence, Ansys and COMSOL are not assumed to be licensed by ENSNN. Practical examples are conceptual unless verified in a real licensed environment.

## Automated maintenance

`.github/workflows/resource-audit.yml` runs a weekly URL audit and rechecks when catalogue or audit scripts change; it saves results to `data/link-health.json`. HTTP 403 or a timeout can indicate an automated-access restriction, **not a broken resource**. Do not automatically remove a resource or change its access claims solely on an HTTP response.

Vercel builds production from the GitHub main branch. Review `https://github.com/aminemons/resources/actions` for audit history and `https://vercel.com/aminemons-projects/micro-nano-resources` for deployments.

## Contributing

Propose resources with the exact title, producer, learning purpose, suitable specialization, type, relevant difficulty, access conditions and the best official URL. Avoid generic SEO collections, redundant homepages, inaccurate paid/free flags, and non-working GitHub links.
