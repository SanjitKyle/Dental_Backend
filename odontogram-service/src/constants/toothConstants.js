// Standard FDI Tooth Numbering Constants and Dental Specifications

export const PERMANENT_TEETH = [
    // Upper Right (Quadrant 1)
    18, 17, 16, 15, 14, 13, 12, 11,
    // Upper Left (Quadrant 2)
    21, 22, 23, 24, 25, 26, 27, 28,
    // Lower Left (Quadrant 3)
    38, 37, 36, 35, 34, 33, 32, 31,
    // Lower Right (Quadrant 4)
    41, 42, 43, 44, 45, 46, 47, 48
];

export const DECIDUOUS_TEETH = [
    // Upper Right (Quadrant 5)
    55, 54, 53, 52, 51,
    // Upper Left (Quadrant 6)
    61, 62, 63, 64, 65,
    // Lower Left (Quadrant 7)
    75, 74, 73, 72, 71,
    // Lower Right (Quadrant 8)
    81, 82, 83, 84, 85
];

export const TOOTH_SURFACES = [
    'mesial',       // M
    'distal',       // D
    'occlusal',     // O (for molars/premolars)
    'incisal',      // I (for incisors/canines)
    'buccal',       // B (vestibular/facial)
    'lingual',      // L (lower jaw inner)
    'palatal',      // P (upper jaw inner)
    'cervical',     // Gingival margin
    'root'          // Apex/root area
];

export const TOOTH_CONDITIONS = [
    'sound',                 // Healthy tooth
    'caries',                // Active decay/cavity
    'filled',                // Restored with filling
    'missing',               // Missing / un-erupted
    'impacted',              // Impacted tooth
    'crown',                 // Artificial crown placed
    'bridge_abutment',       // Support for dental bridge
    'bridge_pontic',         // Artificial tooth in bridge
    'implant',               // Dental implant
    'root_canal',            // Endodontic treatment
    'extracted',             // Extracted tooth
    'veneer',                // Dental veneer
    'fracture',              // Fractured/broken tooth
    'denture',               // Part of removable denture
    'orthodontic_bracket',   // Braces attached
    'retained_root',         // Retained root tip
    'sealant',               // Pit and fissure sealant
    'other'                  // Custom or other condition
];

export const RESTORATION_MATERIALS = [
    'composite',
    'amalgam',
    'glass_ionomer',
    'ceramic',
    'porcelain_fused_to_metal',
    'gold',
    'zirconia',
    'acrylic',
    'temporary',
    'other'
];

export const TREATMENT_STATUSES = [
    'existing',              // Present before current treatment plan
    'diagnosed',             // Needs treatment
    'in_progress',           // Treatment currently ongoing
    'completed'              // Treatment finished
];

export const DENTITION_TYPES = ['permanent', 'deciduous', 'mixed'];
