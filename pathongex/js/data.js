// PathonGex dataset
// type: "mold" | "bacteria" | "virus"

const PATHONGEX = [
  {
    slug: "stachybotrys-chartarum",
    name: "Stachybotrys chartarum",
    type: "mold",
    blurb: "Often found on chronically wet cellulose (e.g., drywall). Produces slimy dark growth and heavy fragments.",
    aka: ["Stachy", "Black mold (colloquial)"],
    size_um: "3–12 µm (spores); hyphae vary",
    habitats: ["Water-damaged drywall", "Paper-faced materials", "Ceilings/attics with chronic leaks"],
    notes: [
      "Requires sustained moisture; not typically found in short-lived leaks.",
      "Air tests may show low spores while fragments/debris are significant.",
      "Focus on source removal, dust control, HEPA cleaning, and clearance."
    ]
  },
  {
    slug: "aspergillus-fumigatus",
    name: "Aspergillus fumigatus",
    type: "mold",
    blurb: "Common indoor contaminant; tiny spores (≈2–3 µm) readily aerosolize and penetrate deep into airways.",
    aka: ["Aspergillus (group)"],
    size_um: "~2–3 µm (conidia)",
    habitats: ["Dust", "HVAC", "Framing surfaces after wetting", "Insulation"],
    notes: [
      "Pay attention to dust load and fine particles in post-remediation verification.",
      "Source + dust removal beats fog-only approaches.",
      "Watch for amplification in high-humidity zones."
    ]
  },
  {
    slug: "serratia-marcescens",
    name: "Serratia marcescens",
    type: "bacteria",
    blurb: "The 'pink stuff' in showers and toilets—actually a bacterium, not a mold. Loves moisture + soap residues.",
    aka: ["Pink biofilm"],
    size_um: "~0.5–0.8 × 0.9–2.0 µm (rod)",
    habitats: ["Showers", "Toilets", "Sinks", "Humid bathrooms"],
    notes: [
      "Forms biofilms—needs physical scrub + disinfectant, not just a spray-and-pray.",
      "Reduce nutrients (soap scum), fix humidity/ventilation, and clean regularly.",
      "Can stain surfaces; treat early to prevent recurring colonies."
    ]
  },
  {
    slug: "pseudomonas-aeruginosa",
    name: "Pseudomonas aeruginosa",
    type: "bacteria",
    blurb: "Hardy, gram-negative biofilm builder found in damp areas and stagnant water; resilient to many cleaners.",
    aka: ["P. aeruginosa"],
    size_um: "~0.5–0.8 × 1.5–3.0 µm (rod)",
    habitats: ["Condensate pans", "Humidifiers", "Drains", "Standing water"],
    notes: [
      "Biofilm shields cells—use mechanical agitation + EPA-registered disinfectant.",
      "Keep drains and pans clean; maintain flow and dry-down.",
      "Chlorine-based or quaternary solutions may be used per label directions."
    ]
  },
  {
    slug: "sars-cov-2",
    name: "SARS-CoV-2",
    type: "virus",
    blurb: "Respiratory virus behind COVID-19; spreads via aerosols and droplets—ventilation and filtration matter.",
    aka: ["Coronavirus (COVID-19)"],
    size_um: "~0.08–0.12 µm (virion)",
    habitats: ["Air in occupied spaces", "High-touch surfaces (fomites)"],
    notes: [
      "Mitigation leans on ventilation, filtration (MERV/HEPA), hygiene, and policies.",
      "Surface survival varies—routine cleaning still helpful as part of a layered approach.",
      "Follow current public health guidance for workplaces and homes."
    ]
  }
];