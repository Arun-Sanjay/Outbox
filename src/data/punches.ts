import type { PunchCode, PunchInfo, DefenseCode, FootworkCode } from "../types";

// ─────────────────────────────────────────────
// PUNCHES — 10 punches with real boxing instruction
// ─────────────────────────────────────────────

export const PUNCHES: Record<PunchCode, PunchInfo> = {
  "1": {
    code: "1",
    name: "Jab",
    orthodoxHand: "left",
    southpawHand: "right",
    target: "head",
    type: "speed",
    formCues: [
      "Start from guard position, chin tucked behind lead shoulder",
      "Extend lead hand straight forward, rotating fist palm-down at full extension",
      "Keep rear hand glued to your chin for protection",
      "Snap the punch back to guard as fast as you throw it",
      "Step slightly forward with lead foot to add range",
    ],
    commonMistakes: [
      "Dropping the rear hand while jabbing, leaving chin exposed",
      "Winding up or pulling the hand back before throwing",
      "Flaring the elbow out instead of keeping it tight",
      "Leaning forward past your center of balance",
    ],
  },
  "2": {
    code: "2",
    name: "Cross",
    orthodoxHand: "right",
    southpawHand: "left",
    target: "head",
    type: "power",
    formCues: [
      "Rotate rear hip and shoulder forward as you throw",
      "Drive power from the rear foot, pivoting on the ball of the foot",
      "Extend rear hand straight down the center line, rotating fist palm-down",
      "Keep lead hand up protecting the chin throughout",
      "Return to guard immediately — do not admire the punch",
    ],
    commonMistakes: [
      "Reaching with the punch instead of rotating the body",
      "Dropping the lead hand while throwing the cross",
      "Telegraphing by pulling the hand back first",
      "Not rotating the rear foot, losing power from the legs",
    ],
  },
  "3": {
    code: "3",
    name: "Lead Hook",
    orthodoxHand: "left",
    southpawHand: "right",
    target: "head",
    type: "power",
    formCues: [
      "Pivot on lead foot, rotating hips and shoulders as a unit",
      "Keep the elbow at a 90-degree angle, arm parallel to the ground",
      "Aim to land with the first two knuckles on the side of the target",
      "Drive the punch with your legs and core, not the arm alone",
      "Keep rear hand tight to chin as a shield",
    ],
    commonMistakes: [
      "Winding up by pulling the arm back before throwing",
      "Dropping the arm below shoulder level, making it a looping swing",
      "Not rotating the hips — arm punching with no power",
      "Reaching too far, overextending and losing balance",
    ],
  },
  "4": {
    code: "4",
    name: "Rear Hook",
    orthodoxHand: "right",
    southpawHand: "left",
    target: "head",
    type: "power",
    formCues: [
      "Start by rotating the rear hip forward aggressively",
      "Bring the rear elbow up to shoulder height at 90 degrees",
      "Pivot on rear foot, driving the rotation through the core",
      "Land with a tight compact arc — shorter range than the cross",
      "Immediately return to guard after landing",
    ],
    commonMistakes: [
      "Throwing from too far away — the rear hook is a close-range weapon",
      "Winding up and telegraphing the punch",
      "Not keeping the lead hand up for protection",
      "Overrotating and ending up off-balance",
    ],
  },
  "5": {
    code: "5",
    name: "Lead Uppercut",
    orthodoxHand: "left",
    southpawHand: "right",
    target: "head",
    type: "power",
    formCues: [
      "Dip slightly at the knees, loading the lead leg",
      "Drive upward from the legs, rotating the lead hip forward",
      "Keep the fist palm-facing-you, punching in a vertical arc",
      "Aim for the chin or solar plexus — short, compact motion",
      "Maintain rear hand guard throughout the punch",
    ],
    commonMistakes: [
      "Dropping the hand to the waist before throwing — telegraphs the punch",
      "Leaning back instead of driving upward from the legs",
      "Throwing wide and looping instead of tight and compact",
      "Squaring up to the opponent, losing your angle",
    ],
  },
  "6": {
    code: "6",
    name: "Rear Uppercut",
    orthodoxHand: "right",
    southpawHand: "left",
    target: "head",
    type: "power",
    formCues: [
      "Slight knee bend to load the rear leg",
      "Rotate the rear hip upward and forward explosively",
      "Keep the fist palm-toward-you, driving upward through the center",
      "Power comes from legs through core — not the arm",
      "Snap back to guard immediately after landing",
    ],
    commonMistakes: [
      "Leaning too far forward and losing balance on the punch",
      "Winding up by dropping the hand to hip level",
      "Throwing at the chest instead of upward to the chin",
      "Not bending the knees — throwing with arm strength only",
    ],
  },
  "1b": {
    code: "1b",
    name: "Body Jab",
    orthodoxHand: "left",
    southpawHand: "right",
    target: "body",
    type: "speed",
    formCues: [
      "Bend at the knees to lower your level — do not bend at the waist",
      "Extend the lead hand to the opponent's midsection",
      "Keep your chin behind your lead shoulder for protection",
      "Aim for the floating ribs or solar plexus",
      "Return to upright guard position immediately",
    ],
    commonMistakes: [
      "Bending at the waist instead of the knees, exposing the chin",
      "Not changing levels — just aiming the punch downward",
      "Dropping the rear hand while attacking the body",
      "Staying low too long after the punch",
    ],
  },
  "2b": {
    code: "2b",
    name: "Body Cross",
    orthodoxHand: "right",
    southpawHand: "left",
    target: "body",
    type: "power",
    formCues: [
      "Drop your level by bending both knees slightly",
      "Rotate the rear hip forward while staying low",
      "Drive the rear hand straight to the opponent's liver or ribs",
      "Keep lead hand protecting your face at all times",
      "Rise back to stance after throwing",
    ],
    commonMistakes: [
      "Standing upright while trying to punch low — no power or range",
      "Telegraphing by looking at the body before throwing",
      "Leaving the head exposed by dropping the lead hand",
      "Not committing to the level change",
    ],
  },
  "3b": {
    code: "3b",
    name: "Lead Body Hook",
    orthodoxHand: "left",
    southpawHand: "right",
    target: "body",
    type: "power",
    formCues: [
      "Drop level by bending the knees — lower your entire frame",
      "Pivot on lead foot, rotating hips into the punch",
      "Keep elbow tight at roughly 90 degrees, arm slightly below horizontal",
      "Target the liver (right side) or floating ribs",
      "Explode back upright into guard after landing",
    ],
    commonMistakes: [
      "Not bending the knees enough — punch lacks power and accuracy",
      "Winding up by pulling the arm way back",
      "Punching with arm only and no hip rotation",
      "Staying crouched too long, vulnerable to uppercuts",
    ],
  },
  "4b": {
    code: "4b",
    name: "Rear Body Hook",
    orthodoxHand: "right",
    southpawHand: "left",
    target: "body",
    type: "power",
    formCues: [
      "Dip at the knees and shift weight to the rear side",
      "Rotate the rear hip and shoulder into a short, tight arc",
      "Target the opponent's front body — ribs and solar plexus",
      "Keep lead hand high and tight to protect the chin",
      "Recover stance and guard position quickly",
    ],
    commonMistakes: [
      "Throwing from too far away — body hooks are inside punches",
      "Dropping the lead hand to generate more swing",
      "Not rotating the hips — relying on arm strength",
      "Overcommitting and getting stuck at close range",
    ],
  },
};

// ─────────────────────────────────────────────
// DEFENSES — 5 defensive movements
// ─────────────────────────────────────────────

export type DefenseInfo = {
  code: DefenseCode;
  name: string;
  description: string;
  defendsAgainst: string[];
  formCues: string[];
  counterOpportunities: string[];
};

export const DEFENSES: Record<DefenseCode, DefenseInfo> = {
  slip: {
    code: "slip",
    name: "Slip",
    description: "Rotate the torso to move the head off the center line, letting the punch pass by your ear",
    defendsAgainst: ["Jab", "Cross", "Straight punches"],
    formCues: [
      "Bend slightly at the knees and rotate the torso",
      "Move the head just enough to clear the punch — 4-6 inches",
      "Keep your eyes on the opponent throughout the slip",
      "Hands stay in guard position — do not reach down",
      "Slip to the outside of the punch for a better counter angle",
    ],
    counterOpportunities: [
      "Slip outside the jab and counter with a rear cross",
      "Slip inside the cross and counter with a lead hook",
      "Slip and counter with body shots from the low position",
    ],
  },
  roll: {
    code: "roll",
    name: "Roll",
    description: "Bend at the knees and roll under a hook punch in a U-shaped motion",
    defendsAgainst: ["Lead Hook", "Rear Hook", "Overhand punches"],
    formCues: [
      "Bend the knees to lower your center — do not bend at the waist",
      "Roll in the direction of the incoming hook (under it)",
      "Keep your eyes on the opponent as you roll",
      "Come up on the opposite side in your guard position",
      "Use the momentum of the roll to load a counter punch",
    ],
    counterOpportunities: [
      "Roll under the hook and come up with a rear uppercut",
      "Roll and counter with a lead hook to the body on the way up",
      "Use the roll momentum to throw a loaded cross",
    ],
  },
  pull: {
    code: "pull",
    name: "Pull",
    description: "Shift weight to the rear foot, pulling the head back and out of range",
    defendsAgainst: ["Jab", "Cross", "Lead Hook at range"],
    formCues: [
      "Shift weight onto the rear foot by leaning back slightly",
      "Keep hands up in guard position",
      "Do not lean back excessively — maintain balance",
      "Use the pull to create counter-punching distance",
      "Immediately return to fighting stance after pulling",
    ],
    counterOpportunities: [
      "Pull back and counter with a jab as they fall short",
      "Pull and immediately counter with a straight right",
      "Use the pull to bait overcommitment, then counter",
    ],
  },
  step_back: {
    code: "step_back",
    name: "Step Back",
    description: "Move the rear foot back first, then the lead foot, creating distance",
    defendsAgainst: ["Any combination", "Pressure fighting", "Close-range attacks"],
    formCues: [
      "Push off the lead foot, stepping the rear foot back first",
      "Follow immediately with the lead foot to maintain stance width",
      "Keep hands in guard position throughout the movement",
      "Stay on the balls of your feet — do not go flat-footed",
      "Maintain balance and be ready to counter or move laterally",
    ],
    counterOpportunities: [
      "Step back and counter with a jab as they step in",
      "Create space then fire a combination as they close distance",
      "Step back and pivot to an angle for better positioning",
    ],
  },
  block: {
    code: "block",
    name: "Block",
    description: "Absorb or deflect punches using the gloves, forearms, and shoulders",
    defendsAgainst: ["All punches", "Hooks", "Uppercuts", "Body shots"],
    formCues: [
      "Keep hands tight to the face — gloves touching temples and cheeks",
      "For hooks: tighten the guard and absorb with the glove and forearm",
      "For body shots: drop the elbow to cover the ribs",
      "Keep shoulders raised to protect the chin",
      "Stay compact and ready to fire back immediately",
    ],
    counterOpportunities: [
      "Block and immediately counter with a jab or cross",
      "Catch the jab with the rear hand and fire back with the lead",
      "Block the body shot and counter with a hook upstairs",
    ],
  },
};

// ─────────────────────────────────────────────
// FOOTWORK — 8 movement patterns
// ─────────────────────────────────────────────

export type FootworkInfo = {
  code: FootworkCode;
  name: string;
  description: string;
  formCues: string[];
};

export const FOOTWORK: Record<FootworkCode, FootworkInfo> = {
  pivot_left: {
    code: "pivot_left",
    name: "Pivot Left",
    description: "Rotate on the lead foot to change angle to the left",
    formCues: [
      "Plant the ball of the lead foot as the pivot point",
      "Swing the rear foot in an arc to the left",
      "Maintain your fighting stance width throughout",
      "Keep hands in guard and eyes on the opponent",
    ],
  },
  pivot_right: {
    code: "pivot_right",
    name: "Pivot Right",
    description: "Rotate on the lead foot to change angle to the right",
    formCues: [
      "Plant the ball of the lead foot as the pivot point",
      "Swing the rear foot in an arc to the right",
      "Stay balanced with knees slightly bent",
      "This moves you away from the opponent's rear hand (orthodox vs orthodox)",
    ],
  },
  angle_left: {
    code: "angle_left",
    name: "Angle Left",
    description: "Step the lead foot to the left at 45 degrees, creating an angle",
    formCues: [
      "Step the lead foot diagonally to the left at 45 degrees",
      "Follow with the rear foot to maintain stance width",
      "Creates an angle that takes you off the opponent's center line",
      "Excellent for setting up lead hooks and body shots",
    ],
  },
  angle_right: {
    code: "angle_right",
    name: "Angle Right",
    description: "Step the lead foot to the right at 45 degrees, creating an angle",
    formCues: [
      "Step the lead foot diagonally to the right at 45 degrees",
      "Follow with the rear foot to maintain stance width",
      "Takes you to the opponent's outside — safer angle",
      "Great for setting up the cross and rear uppercut",
    ],
  },
  circle_left: {
    code: "circle_left",
    name: "Circle Left",
    description: "Move laterally to the left using small shuffling steps",
    formCues: [
      "Lead foot steps left first, rear foot follows",
      "Keep steps small and quick — do not cross your feet",
      "Stay on the balls of your feet throughout",
      "Maintain your guard and fighting distance",
    ],
  },
  circle_right: {
    code: "circle_right",
    name: "Circle Right",
    description: "Move laterally to the right using small shuffling steps",
    formCues: [
      "Rear foot steps right first, lead foot follows",
      "Keep steps small and quick — do not cross your feet",
      "Stay on the balls of your feet throughout",
      "Circling right moves you away from an orthodox fighter's power hand",
    ],
  },
  step_in: {
    code: "step_in",
    name: "Step In",
    description: "Close distance by stepping forward with the lead foot",
    formCues: [
      "Push off the rear foot, stepping the lead foot forward",
      "Follow with the rear foot to maintain stance width",
      "Keep hands up and chin down as you enter range",
      "Time the step to coincide with your punch for maximum effect",
    ],
  },
  step_out: {
    code: "step_out",
    name: "Step Out",
    description: "Create distance by stepping backward with the rear foot",
    formCues: [
      "Push off the lead foot, stepping the rear foot back",
      "Follow with the lead foot to maintain stance width",
      "Keep guard tight during the retreat",
      "Use this to reset distance and avoid pressure",
    ],
  },
};
