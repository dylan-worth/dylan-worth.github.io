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
  slug: "norovirus",
  name: "Norovirus",
  type: "virus",
  blurb: "Ultra-contagious GI virus; spreads via tiny fecal–oral particles. Surfaces need real cleaning, not vibes.",
  aka: ["Stomach bug", "Norwalk-like virus"],
  size_um: "~0.027–0.040 µm (virion)",
  habitats: ["Bathrooms", "Kitchens", "High-touch surfaces", "Food service areas"],
  notes: [
    "Explosive spread: a few particles can infect; hand hygiene and isolation matter.",
    "Resistant to many common cleaners—use EPA-registered products with norovirus claims; follow label dwell times.",
    "Clean first (remove soils), then disinfect; focus on restrooms, kitchen touchpoints, and shared equipment."
  ]
},
{
  slug: "chaetomium",
  name: "Chaetomium (general)",
  type: "mold",
  blurb: "Cellulose-loving mold with tough fruiting bodies; often follows chronic wet drywall, paper, insulation facers.",
  aka: ["Chaetomium spp."],
  size_um: "Ascospores ~6–12 µm (varies by species)",
  habitats: ["Wet drywall/paper", "Insulation facers", "Subfloor near chronic leaks"],
  notes: [
    "Signals longer-term moisture, like Stachy—think leaks, wicking, or hidden wet layers.",
    "Ascospores/heavy fragments lodge in dust—thorough source removal + HEPA cleaning is key.",
    "Expect low air counts but meaningful debris on tape lifts/PRV dust sampling if not cleaned well."
  ]
},
{
  slug: "escherichia-coli",
  name: "Escherichia coli (E. coli)",
  type: "bacteria",
  blurb: "Indicator of fecal contamination; some strains are benign, others pathogenic—treat sewage losses seriously.",
  aka: ["E. coli"],
  size_um: "~0.5–0.7 × 1.0–2.0 µm (rod)",
  habitats: ["Sewage-impacted materials", "Toilets/drains", "Flooded areas with wastewater"],
  notes: [
    "Category 3 (grossly contaminated) water rules apply—remove porous materials that contacted sewage.",
    "PPE + engineering controls; clean to remove soils first, then disinfect per label directions.",
    "Validate with appropriate sampling protocols when required by scope/regulation/insurer."
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