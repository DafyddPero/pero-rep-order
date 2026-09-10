import { useState, useMemo, useCallback, useRef } from "react";

// ── PRODUCT DATA ──
const GF = [
["Chicken & Sweet Potato","chicken","SR0198","SR0354","SR0198V","SR0354V","SR0053","SR0356","SR0053V","SR0356V",6.99,34.09],
["Chicken & Sweet Potato (Large Breed)","chicken","","SR0271","","SR0271V","","SR0270","","SR0270V",6.99,34.09],
["Chicken & Sweet Potato (Small Bite)","chicken","SR0225","SR0361","SR0225V","SR0361V","SR0125","SR0357","SR0125V","SR0357V",6.99,34.09],
["Chicken & Sweet Potato (Puppy)","chicken","SR0223","SR0383","SR0223V","SR0383V","SR0131","SR0382","SR0131V","SR0382V",6.99,34.09],
["Chicken, Turkey & Salmon (Puppy)","chicken","","SR0261","","SR0261V","","SR0260","","SR0260V",7.46,38.23],
["Salmon & Sweet Potato","salmon","SR0214","SR0375","SR0214V","SR0375V","SR0059","SR0360","SR0059V","SR0360V",6.79,31.92],
["Salmon, Trout & SP with Asparagus","salmon","","SR0257","","SR0257V","","SR0256","","SR0256V",7.10,33.99],
["Salmon, Trout & SP with Asparagus (Senior)","salmon","","SR0259","","SR0259V","","SR0258","","SR0258V",7.25,36.04],
["Sensitive Salmon & Potato","salmon","","SR0479","","SR0479V","","SR0478","","SR0478V",5.91,32.94],
["Duck & Sweet Potato","duck","SR0200","SR0373","SR0200V","SR0373V","SR0055","SR0358","SR0055V","SR0358V",7.32,36.31],
["Duck & Sweet Potato with Orange","duck","","SR0255","","SR0255V","","SR0254","","SR0254V",7.75,38.71],
["Duck & Potato","duck","SR0199","SR0366","SR0199V","SR0366V","SR0147","SR0365","SR0147V","SR0365V",6.43,32.72],
["Turkey & Vegetables","turkey","","SR0453","","SR0453V","","SR0454","","SR0454V",5.30,29.86],
["Lamb & Sweet Potato","lamb","SR0206","SR0374","SR0206V","SR0374V","SR0057","SR0359","SR0057V","SR0359V",7.30,36.14],
["Lamb & Sweet Potato with Mint","lamb","","SR0263","","SR0263V","","SR0262","","SR0262V",7.79,39.48],
["Pork & Sweet Potato with Apple","pork","SR0160","SR0402","SR0160V","SR0402V","SR0161","SR0401","SR0161V","SR0401V",6.72,31.79],
["High Energy Beef","beef","","SR0265","","SR0265V","","SR0264","","SR0264V",6.39,31.89],
["Super 75 Meat and Fish","mixed","","SR0443","","SR0443V","","SR0442","","SR0442V",7.16,41.49],
["Super 75 Fish","mixed","","SR0445","","SR0445V","","SR0444","","SR0444V",8.27,45.20]
];

const WGF = [
["Chicken & Rice","chicken","SR0197","SR0368","SR0197V","SR0368V","SR0041","SR0286","SR0041V","SR0286V",5.74,23.27],
["Chicken & Rice (Senior/Light)","chicken","SR0228","SR0372","SR0228V","SR0372V","SR0045","SR0287","SR0045V","SR0287V",6.61,25.79],
["Chicken & Rice (Large Breed)","chicken","SR0252","SR0369","SR0252V","SR0369V","SR0123","SR0355","SR0123V","SR0355V",7.02,28.90],
["Chicken, Rice & Vegetables","chicken","","","","","","SR0457","","SR0457V",0,20.06],
["Chicken & Beef (Senior/Light)","chicken","","","","","","SR0455","","SR0455V",0,20.89],
["Salmon & Rice","salmon","SR0224","SR0385","SR0224V","SR0385V","SR0047","SR0384","SR0047V","SR0384V",6.55,27.52],
["Salmon & Potato","salmon","SR0212","SR0371","SR0212V","SR0371V","SR0097","SR0370","SR0097V","SR0370V",5.58,27.31],
["Salmon & Potato (Small Bite)","salmon","SR0226","SR0378","SR0226V","SR0378V","SR0143","SR0377","SR0143V","SR0377V",6.05,29.97],
["Salmon & Potato (Large Breed Puppy)","salmon","SR0221","SR0380","SR0221V","SR0380V","SR0145","SR0379","SR0145V","SR0379V",6.05,29.97],
["Turkey & Rice","turkey","SR0227","SR0376","SR0227V","SR0376V","SR0141","SR0362","SR0141V","SR0362V",5.80,27.46],
["Lamb & Rice","lamb","SR0250","SR0364","SR0250V","SR0364V","SR0043","SR0289","SR0043V","SR0289V",6.55,26.88],
["Lamb & Rice Performance","lamb","","SR0267","","SR0267V","","SR0266","","SR0266V",5.58,27.08],
["Premium Puppy Complete","chicken","SR0210","SR0363","SR0210V","SR0363V","SR0050","SR0288","SR0050V","SR0288V",5.78,25.50]
];

const CP = [
// 80/20 recipes
["80/20 Beef","beef","CP028","CP029","CP030",7.30,18.25,43.80],
["80/20 Chicken","chicken","CP034","CP035","CP036",7.20,17.90,42.50],
["80/20 Duck","duck","CP037","CP038","CP039",7.25,16.90,43.00],
["80/20 Fish","salmon","CP040","CP041","CP042",9.70,24.90,56.75],
// With grain
["Chicken with Grain","chicken","CP001","CP002","CP003",3.01,6.84,16.12],
["Beef with Grain","beef","CP004","CP005","CP006",3.01,6.84,16.12],
// Other
["Turkey Slim Down","turkey","CP007","CP008","CP009",5.86,14.63,35.12],
["Chicken & Sweet Potato","chicken","CP010","CP011","CP012",5.91,14.78,36.29],
["Calm Down Dog","mixed","CP013","CP014","CP015",5.91,14.78,36.29],
["Beef & Sweet Potato","beef","CP016","CP017","CP018",5.91,14.78,36.29],
["Lamb & Sweet Potato","lamb","CP019","CP020","CP021",6.38,15.94,38.26],
["Turkey Gastro","turkey","CP022","CP023","CP024",6.45,16.12,38.70],
["Salmon & Sweet Potato","salmon","CP025","CP026","CP027",6.86,17.16,41.17],
["Immunity Booster","mixed","CP031","CP032","CP033",6.86,17.16,41.17]
];

// Working Dog.
//  Regular : {name, wd, vat, price, size, pallet}   pallet = bags/cases per pallet
//  Pero    : {name, pero:true, wd(small sku), vat(big sku), priceSmall, priceBig, sizeSmall, sizeBig, pallet}
const WD = [
{name:"Rich in Chicken", wd:"SR0351", vat:"", price:18.01, size:"15kg", pallet:65},
{name:"Rich in Chicken (Hardworking)", wd:"SR0399", vat:"SR0399V", price:19.04, size:"15kg", pallet:65},
{name:"Economy Chicken & Rice", wd:"SR0397", vat:"SR0397V", price:18.03, size:"15kg", pallet:65},
{name:"Economy Lamb & Rice", wd:"SR0353", vat:"SR0353V", price:19.35, size:"15kg", pallet:65},
{name:"Resting/Senior with Chicken", wd:"SR0398", vat:"SR0398V", price:19.56, size:"15kg", pallet:65},
{name:"Puppy with Chicken", wd:"SR0352", vat:"SR0352V", price:18.01, size:"15kg", pallet:65},
{name:"Meaty Mix", wd:"SR0118", vat:"SR0118V", price:19.40, size:"15kg", pallet:65},
{name:"Muesli Mix", wd:"SR0109", vat:"SR0109V", price:17.91, size:"15kg", pallet:65},
{name:"Celt 22 (Plain Label)", wd:"SR0450", vat:"SR0450V", price:13.95, size:"15kg", pallet:65},
{name:"Celt 22 (Private Label)", wd:"SR0451", vat:"SR0451V", price:12.74, size:"15kg", pallet:65},
{name:"Celt Canned Wet (Dogs)", wd:"C0004", vat:"", price:0, size:"case", pallet:192, caseWeight:3.95},
{name:"Pero Premiwm", pero:true, wd:"", vat:"P0014", priceSmall:0, priceBig:20.25, sizeSmall:"", sizeBig:"15kg", pallet:65},
{name:"Pero Active", pero:true, wd:"", vat:"P0020", priceSmall:0, priceBig:20.03, sizeSmall:"", sizeBig:"15kg", pallet:65},
{name:"Pero Maintenance", pero:true, wd:"", vat:"P0021", priceSmall:0, priceBig:18.28, sizeSmall:"", sizeBig:"15kg", pallet:65}
];

const GL = [
["Chicken, Rice & Vegetables","GD004",25.08,"pallet"],
["Rich in Chicken with Vegetables","GD002",22.65,"pallet"],
["Rich in Chicken with Rice","GD013",22.55,"pallet"],
["Rich in Chicken (Wheat GF)","GD014",20.38,"pallet"],
["Salmon, Rice, Oats & Vegetables","GD003",29.35,"pallet"],
["Salmon & Potato","GD007",31.51,"pallet"],
["Lamb & Rice","GD006",27.28,"pallet"],
["Chicken & Beef (Senior/Light)","GD008",26.11,"pallet"],
["High in Beef","GD010",18.01,"pallet"],
["Adult Tripe","GD009",28.94,"pallet"],
["Economy","GD001",16.98,"pallet"],
["Whole Meal Mixer","GD011",15.81,"pallet"],
["Economy Puppy","GD005",19.25,"pallet"],
["Premium Puppy/Junior","GD012",28.79,"pallet"]
];

const WT = [
["Chicken & Brown Rice with Veg","chicken","SR0061",11.90],
["Chicken & Sweet Potato with Veg","chicken","SR0079",13.90],
["Chicken & Duck with Brown Rice","chicken","SR0481",15.05],
["Chicken & Tripe with Brown Rice","chicken","SR0482",14.41],
["Chicken & Brown Rice (Puppy)","chicken","SR0081",11.90],
["Salmon & Ocean Fish with SP","salmon","SR0080",14.72],
["Salmon & Sweet Potato with Veg","salmon","SR0484",14.62],
["Ocean Fish & Brown Rice with Veg","salmon","SR0483",13.65],
["Duck & Brown Rice with Veg","duck","SR0347",14.92],
["Turkey & Sweet Potato with Veg","turkey","SR0349",14.92],
["Turkey & Brown Rice with Veg","turkey","SR0345",12.95],
["Lamb & Sweet Potato with Veg","lamb","SR0485",15.04],
["Lamb & Brown Rice with Veg","lamb","SR0062",14.83]
];

const SPWT = [
["Chicken with Exotic Superfoods","SR0489V",9.39],
["Beef with Exotic Superfoods","SR0490V",10.22],
["Wild Boar with Superfoods","SR0491V",10.24],
["Venison with Superfoods","SR0492V",12.46],
["Chicken & Rabbit with Superfoods","SR0493V",9.58]
];

const PERO = [
["High Meat Chicken & Rice","P0072","P0071",5.54,27.56,"2kg","12kg","vat"],
["High Meat Lamb & Rice","P0074","P0073",5.74,32.70,"2kg","12kg","vat"],
["High Meat Turkey & Sweet Potato","P0038","P0037",6.56,37.47,"2kg","12kg","vat"],
["High Meat Pork & Sweet Potato","P0040","P0039",7.38,35.13,"2kg","12kg","vat"],
["High Meat SBT Chicken","P0019","P0018",5.61,27.30,"2kg","12kg","vat"],
["Super Sensitive Ocean Fish","P0078","P0077",6.54,36.12,"2kg","12kg","vat"],
["Low Calorie Salmon & Brown Rice","P0076","P0075",5.92,31.97,"2kg","12kg","vat"],
["Super Start Puppy","P0080","P0079",6.25,23.27,"2kg","8kg","vat"],
["Fussy Eater Gold with Pasta","P0082","P0081",3.82,18.07,"2kg","12kg","vat"],
["Truline Meat & Fish","TRU002|TRU002WD","TRU001|TRU001WD",7.16,41.50,"2kg","12kg","both"],
["Truline Fish","TRU005|TRU005WD","TRU004|TRU004WD",8.27,45.20,"2kg","12kg","both"]
];

const MT = [
["Salmon Meal Topper","SR0486X7","7x160g"],
["Beef Meal Topper","SR0494X7","7x160g"],
["Turkey Meal Topper","SR0495X7","7x160g"],
["Duck Meal Topper","SR0496X7","7x160g"],
["Herring Meal Topper","SR0497X7","7x160g"],
["Rabbit Meal Topper","SR0498X7","7x160g"]
];

const CAT_PRODS = [
["Cat Complete (Big)","SR0164","10kg","vat"],
["Cat Complete (Small)","SR0216","2kg","vat"]
];


// ── TREATS DATA ──
// [groupName, [[sku, size], ...]]
const TREATS_RETAIL = [
["Beef Bites",[["TRT025","200g"]]],
["Beef Gullet",[["TRT058","200g"]]],
["Beef Strips",[["TRT073","200g"]]],
["Beef Trachea",[["TRT061","200g"]]],
["Chicken Bites",[["TRT022","200g"]]],
["Chicken Breasts",[["TRT034","200g"]]],
["Chicken Feet",[["TRT013","200g"]]],
["Chicken Sticks",[["SR0466","210g"]]],
["Chicken Strips",[["TRT076","200g"]]],
["Cod Skin Braids",[["TRT055","200g"]]],
["Cod Skin Flatties",[["TRT019","200g"]]],
["Cod Skin Rings",[["TRT052","200g"]]],
["Cod Skin Twists",[["TRT049","200g"]]],
["Duck Bites",[["TRT040","200g"]]],
["Duck Strips",[["TRT082","200g"]]],
["Fish Skin Bites",[["TRT067","200g"]]],
["Fish Skin Cubes",[["SR0277","70g"]]],
["Himalayan Cheese (Small)",[["TRT113","10pcs"]]],
["Himalayan Cheese (Medium)",[["TRT114","5pcs"]]],
["Himalayan Cheese Turmeric (Med)",[["TRT115","5pcs"]]],
["Himalayan Cheese (Large)",[["TRT116","5pcs"]]],
["Lamb Bites",[["TRT031","200g"]]],
["Lamb Strips",[["TRT010","200g"]]],
["Pig Ear Strips",[["TRT064","200g"]]],
["Pig Ears (Medium)",[["TRT094","5pcs"]]],
["Pig Ears (Large)",[["TRT097","5pcs"]]],
["Pig Inner Ears",[["TRT088","200g"]]],
["Rabbit Bites",[["TRT046","200g"]]],
["Rabbit Ears with Fur",[["TRT001","200g"]]],
["Rabbit Feet",[["TRT070","200g"]]],
["Rabbit Strips",[["TRT085","200g"]]],
["Beef Pizzles (Small)",[["TRT103","25pcs"]]],
["Beef Pizzles (Medium)",[["TRT100","5pcs"],["TRT101","25pcs"]]],
["Beef Pizzles (Large)",[["TRT105","25pcs"]]],
["Dried Sprats",[["TRT004","200g"]]],
["Turkey Bites",[["TRT037","200g"]]],
["Turkey Strips",[["TRT079","200g"]]],
["Venison Sausages",[["TRT091","200g"]]],
["Venison Strips",[["TRT007","200g"]]],
["Wild Boar Bites",[["TRT043","200g"]]],
["Wild Boar Sticks",[["SR0469","210g"]]],
["Wild Boar Strips",[["TRT016","200g"]]],
["Rolled Hide Chew (Small)",[["TRT107","50pcs"],["TRT108","100pcs"]]],
["Rolled Hide Chew (Medium)",[["sr0543","50pcs"],["TRT110","100pcs"]]],
["Rolled Hide Chew (Large)",[["TRT111","50pcs"],["TRT112","100pcs"]]]
];

const TREATS_BULK = [
["Beef Bites",[["TRT026","1kg"],["TRT027","20kg"]]],
["Beef Gullet",[["TRT059","1kg"]]],
["Beef Strips",[["TRT074","1kg"],["TRT075","10kg"]]],
["Beef Trachea",[["TRT062","1kg"]]],
["Chicken Bites",[["TRT023","1kg"],["TRT024","20kg"]]],
["Chicken Breasts",[["TRT035","1kg"]]],
["Chicken Feet",[["TRT014","1kg"],["TRT015","20kg"]]],
["Chicken Sticks",[["SR0467","1kg"],["SR0468","8kg"]]],
["Chicken Strips",[["TRT077","1kg"],["TRT078","10kg"]]],
["Cod Skin Braids",[["TRT056","1kg"],["TRT057","15kg"]]],
["Cod Skin Flatties",[["TRT020","1kg"],["TRT021","5kg"]]],
["Cod Skin Rings",[["TRT053","1kg"],["TRT054","15kg"]]],
["Duck Bites",[["TRT041","1kg"],["TRT042","20kg"]]],
["Duck Strips",[["TRT083","1kg"],["TRT084","10kg"]]],
["Dried Sprats",[["TRT005","1kg"],["TRT006","15kg"]]],
["Lamb Bites",[["TRT032","1kg"],["TRT033","20kg"]]],
["Lamb Strips",[["TRT011","1kg"],["TRT012","10kg"]]],
["Pig Ear Strips",[["TRT065","1kg"]]],
["Pig Ears (Medium)",[["TRT095","50pcs"],["TRT096","100pcs"]]],
["Pig Ears (Large)",[["TRT098","50pcs"],["TRT099","100pcs"]]],
["Pig Inner Ears",[["TRT089","5kg"],["TRT090","10kg"]]],
["Pig Shoulder Bone",[["TRT117","50pcs"]]],
["Beef Ears with Hair",[["TRT118","60pcs"]]],
["Beef Leg Bone",[["TRT119","25pcs"]]],
["Beef Pizzles (Small)",[["SR0552","100pcs"]]],
["Beef Pizzles (Medium)",[["SR0554","100pcs"]]],
["Beef Pizzles (Large)",[["SR0556","100pcs"]]],
["Rabbit Bites",[["TRT048","10kg"]]],
["Rabbit Ears with Fur",[["TRT002","1kg"],["TRT003","10kg"]]],
["Rabbit Feet",[["TRT071","1kg"],["TRT072","20kg"]]],
["Rabbit Strips",[["TRT086","1kg"],["TRT087","10kg"]]],
["Salmon Skin Twister",[["SR0473","1kg"],["SR0474","10kg"]]],
["Turkey Bites",[["TRT038","1kg"],["TRT039","20kg"]]],
["Turkey Strips",[["TRT080","1kg"],["TRT081","10kg"]]],
["Venison Sausages",[["TRT092","2.5kg"],["TRT093","10kg"]]],
["Venison Strips",[["TRT008","1kg"],["TRT009","10kg"]]],
["Wild Boar Bites",[["TRT044","1kg"],["TRT045","20kg"]]],
["Wild Boar Sticks",[["SR0470","1kg"],["SR0471","8kg"]]],
["Wild Boar Strips",[["TRT017","1kg"],["TRT018","10kg"]]]
];


// ── SKU RESOLUTION ──
function getMatrixSku(row, pkg, vat, size) {
  // row: [name, protein, sig2, pp2, sig2v, pp2v, sig12, pp12, sig12v, pp12v, price2, price12]
  const isSmall = size === "small";
  let idx;
  if (pkg === "coloured" && vat === "wd") idx = isSmall ? 2 : 6;
  else if (pkg === "paper" && vat === "wd") idx = isSmall ? 3 : 7;
  else if (pkg === "coloured" && vat === "vat") idx = isSmall ? 4 : 8;
  else idx = isSmall ? 5 : 9;
  
  let sku = row[idx];
  // Fallback: if preferred pkg empty, try the other
  if (!sku) {
    if (pkg === "coloured") {
      idx = vat === "wd" ? (isSmall ? 3 : 7) : (isSmall ? 5 : 9);
    } else {
      idx = vat === "wd" ? (isSmall ? 2 : 6) : (isSmall ? 4 : 8);
    }
    sku = row[idx];
  }
  if (!sku) return null;
  const price = isSmall ? row[10] : row[11];
  return { sku, price };
}

function getMatrixSizes(row) {
  const hasSmall = row[2] || row[3] || row[4] || row[5];
  const hasBig = row[6] || row[7] || row[8] || row[9];
  const sizes = [];
  if (hasSmall && row[10] > 0) sizes.push("small");
  if (hasBig) sizes.push("big");
  return sizes;
}

function getMatrixSizeLabel(row, size, cat) {
  if (size === "small") {
    if (row[2]) {
      const m = row[2].match(/SR0(197|228|252|224|212|226|221|227|250|210)/);
      if (m) return "2.5kg";
    }
    return "2kg";
  }
  return "12kg";
}

// Determine small bag label from WGF data
function getWGFSmallLabel(row) {
  const checkSkus = [row[2], row[3], row[4], row[5]].filter(Boolean);
  const has25 = checkSkus.some(s => 
    ["SR0197","SR0228","SR0252","SR0224","SR0212","SR0226","SR0221","SR0227","SR0250","SR0210",
     "SR0368","SR0372","SR0369","SR0385","SR0371","SR0378","SR0380","SR0376","SR0364","SR0363",
     "SR0197V","SR0228V","SR0252V","SR0224V","SR0212V","SR0226V","SR0221V","SR0227V","SR0250V","SR0210V",
     "SR0368V","SR0372V","SR0369V","SR0385V","SR0371V","SR0378V","SR0380V","SR0376V","SR0364V","SR0363V"
    ].includes(s)
  );
  return has25 ? "2.5kg" : "2kg";
}

function weightOf(size) {
  if (!size) return 0;
  let m = size.match(/([0-9.]+)\s*kg/);
  if (m) return parseFloat(m[1]);
  if (/10\s*x\s*395/i.test(size)) return 3.95;
  if (/10\s*x\s*380/i.test(size)) return 3.8;
  if (/9\s*x\s*300/i.test(size)) return 2.7;
  if (/7\s*x\s*160/i.test(size)) return 1.12;
  m = size.match(/([0-9.]+)\s*g/);
  if (m) return parseFloat(m[1]) / 1000;
  return 0;
}

function carriageCalc(weight, value) {
  if (value >= 1750) return { sku: "FREE", desc: "Free carriage (order over £1,750 net)", cost: 0 };
  const boxes = Math.ceil(weight / 25);
  if (boxes <= 0) return { sku: "", desc: "", cost: 0 };
  if (boxes <= 5) {
    const costs = [0, 9.50, 15.50, 21.50, 27.50, 33.50];
    return { sku: "DPD" + boxes, desc: `Box delivery (${boxes} box${boxes > 1 ? "es" : ""})`, cost: costs[boxes] };
  }
  if (weight <= 450) return { sku: "PS1-Half", desc: "Half pallet", cost: 31.50 };
  const pallets = Math.ceil(weight / 1000);
  return { sku: "PS1", desc: `Full pallet x${pallets}`, cost: 63 * pallets, qty: pallets };
}

// ── DYSLEXIA-FRIENDLY FONT IMPORT ──
const fontStyle = document.createElement('style');
fontStyle.textContent = `@import url('https://fonts.googleapis.com/css2?family=OpenDyslexic:wght@400;700&display=swap');`;
if (typeof document !== 'undefined' && !document.querySelector('style[data-dyslexic]')) {
  fontStyle.setAttribute('data-dyslexic', 'true');
  document.head.appendChild(fontStyle);
}

// ── STYLES ──
const colors = {
  bg: "#f7f7f5",
  card: "#ffffff",
  primary: "#1a6847",
  primaryLight: "#e8f5ee",
  accent: "#d4a843",
  text: "#1a1a1a",
  textMid: "#555",
  textLight: "#888",
  border: "#e2e2e0",
  danger: "#c0392b",
  dangerLight: "#fdf0ef",
  // Protein highlights — light tint (row/line background)
  chicken: "#fef9f0",
  beef: "#fdf3f1",
  salmon: "#eef6fc",
  duck: "#f4f1fb",
  turkey: "#fdf5ec",
  lamb: "#eef5ef",
  pork: "#fdf0f6",
  mixed: "#eef1f2",
};

// Darker accent per protein — used for the category line's left bar + text
const proteinAccent = {
  chicken: "#c08a1e",
  beef: "#a6402f",
  salmon: "#2f6d99",
  duck: "#6a4fa3",
  turkey: "#b5732e",
  lamb: "#2f6b3c",   // dark green
  pork: "#b0517e",
  mixed: "#5a6b73",
};

const fontFamily = "'OpenDyslexic', 'Verdana', -apple-system, BlinkMacSystemFont, sans-serif";

// Helper to get subtle protein color
const getProteinColor = (protein) => {
  if (!protein) return "#fff";
  const p = protein.toLowerCase();
  if (p === "chicken") return colors.chicken;
  if (p === "beef") return colors.beef;
  if (p === "salmon") return colors.salmon;
  if (p === "duck") return colors.duck;
  if (p === "turkey") return colors.turkey;
  if (p === "lamb") return colors.lamb;
  if (p === "pork") return colors.pork;
  if (p === "mixed") return colors.mixed;
  return "#fff";
};

const getProteinAccent = (protein) => {
  if (!protein) return colors.primary;
  return proteinAccent[protein.toLowerCase()] || colors.primary;
};

const s = {
  page: { fontFamily, background: colors.bg, color: colors.text, minHeight: "100vh", paddingBottom: 90, fontSize: 16, letterSpacing: 0.3, lineHeight: 1.6 },
  header: { background: colors.primary, color: "#fff", padding: "24px 16px 20px", position: "sticky", top: 0, zIndex: 100 },
  headerTitle: { fontSize: 24, fontWeight: 700, letterSpacing: 0.2, margin: 0, fontFamily },
  headerSub: { fontSize: 14, opacity: 0.8, marginTop: 4, fontFamily },
  section: { padding: "0 12px", marginTop: 16 },
  input: { width: "100%", padding: "12px 12px", border: `2px solid ${colors.border}`, borderRadius: 8, fontSize: 16, boxSizing: "border-box", background: "#fff", outline: "none", fontFamily, letterSpacing: 0.2, lineHeight: 1.6 },
  textarea: { width: "100%", padding: "12px 12px", border: `2px solid ${colors.border}`, borderRadius: 8, fontSize: 16, boxSizing: "border-box", background: "#fff", resize: "vertical", minHeight: 60, outline: "none", fontFamily, letterSpacing: 0.2, lineHeight: 1.6 },
  label: { fontSize: 14, fontWeight: 700, color: colors.text, display: "block", marginBottom: 6, fontFamily, letterSpacing: 0.1 },
  toggleRow: { display: "flex", gap: 8, marginTop: 12 },
  toggleBtn: (active) => ({ flex: 1, padding: "12px 8px", border: `3px solid ${active ? colors.primary : colors.border}`, borderRadius: 12, background: active ? colors.primaryLight : "#fff", color: active ? colors.primary : colors.textMid, fontWeight: 700, fontSize: 15, cursor: "pointer", textAlign: "center", transition: "all 0.15s", fontFamily, letterSpacing: 0.1 }),
  catHeader: (open) => ({ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px", background: "#fff", borderRadius: open ? "10px 10px 0 0" : 10, border: `2px solid ${colors.border}`, borderBottom: open ? `2px solid ${colors.border}` : `2px solid ${colors.border}`, cursor: "pointer", userSelect: "none", marginTop: 12 }),
  catTitle: { fontWeight: 700, fontSize: 16, fontFamily, letterSpacing: 0.1 },
  catBadge: (n) => ({ fontSize: 11, fontWeight: 700, background: n > 0 ? colors.primary : colors.border, color: n > 0 ? "#fff" : colors.textMid, borderRadius: 20, padding: "2px 8px", minWidth: 20, textAlign: "center" }),
  catBody: { background: "#fff", borderRadius: "0 0 10px 10px", border: `1px solid ${colors.border}`, borderTop: "none", padding: "4px 0" },
  groupLine: (accent, bg) => ({ fontSize: 12, fontWeight: 700, color: accent, padding: "10px 16px 10px 12px", letterSpacing: 0.4, fontFamily, textTransform: "none", background: bg, borderLeft: `4px solid ${accent}`, borderBottom: `1px solid ${colors.border}` }),
  productRow: (bg) => ({ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", gap: 8, borderBottom: `1px solid ${colors.bg}`, background: bg || "#fff" }),
  productName: { fontSize: 15, fontWeight: 600, flex: 1, lineHeight: 1.4, fontFamily, letterSpacing: 0.1 },
  sizeGroup: { display: "flex", gap: 8, alignItems: "center", flexShrink: 0 },
  sizeBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  sizeLabel: (isPallet) => ({ fontSize: 11, color: isPallet ? colors.accent : colors.textMid, fontWeight: 700, fontFamily, letterSpacing: 0.1 }),
  qtyControl: { display: "flex", alignItems: "center", gap: 0, borderRadius: 8, overflow: "hidden", border: `1px solid ${colors.border}` },
  qtyBtn: { width: 38, height: 38, border: "none", background: colors.bg, color: colors.text, fontSize: 20, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily },
  qtyVal: (v) => ({ width: 36, textAlign: "center", fontSize: 16, fontWeight: 700, color: v > 0 ? colors.primary : colors.textLight, background: v > 0 ? colors.primaryLight : "#fff", height: 38, lineHeight: "38px", borderLeft: `1px solid ${colors.border}`, borderRight: `1px solid ${colors.border}`, fontFamily }),
  bottomBar: { position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: `3px solid ${colors.primary}`, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 200, boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" },
  reviewBtn: { background: colors.primary, color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily, letterSpacing: 0.1 },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" },
  modalContent: { background: "#fff", borderRadius: "16px 16px 0 0", width: "100%", maxWidth: 500, maxHeight: "90vh", overflow: "auto", padding: "24px 16px 30px", fontFamily },
  modalTitle: { fontSize: 20, fontWeight: 700, marginBottom: 16, fontFamily, letterSpacing: 0.1 },
  orderTable: { width: "100%", fontSize: 12, borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "6px 4px", borderBottom: `2px solid ${colors.text}`, fontWeight: 700, fontSize: 11 },
  td: { padding: "5px 4px", borderBottom: `1px solid ${colors.border}`, fontSize: 12, verticalAlign: "top" },
  copyBtn: { width: "100%", padding: "14px", background: colors.primary, color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 16 },
  copied: { width: "100%", padding: "14px", background: colors.accent, color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 16 },
  treatRow: { padding: "8px 16px", borderBottom: `1px solid ${colors.bg}` },
  treatName: { fontSize: 14, fontWeight: 500, marginBottom: 6 },
  treatSizes: { display: "flex", gap: 8, flexWrap: "wrap" },
  catFooterCollapse: { textAlign: "center", padding: "12px", marginTop: 4, color: colors.textMid, fontSize: 13, fontWeight: 700, cursor: "pointer", background: colors.bg, borderTop: `1px solid ${colors.border}`, fontFamily, letterSpacing: 0.2 },
};


// ── COMPONENTS ──
function QtyControl({ value, onChange, step = 1 }) {
  return (
    <div style={s.qtyControl}>
      <button style={s.qtyBtn} onClick={() => onChange(Math.max(0, value - step))}>−</button>
      <div style={s.qtyVal(value)}>{value}</div>
      <button style={s.qtyBtn} onClick={() => onChange(value + step)}>+</button>
    </div>
  );
}

function CategorySection({ title, count, open, onToggle, children }) {
  const headerRef = useRef(null);
  const collapse = () => {
    onToggle();
    if (headerRef.current) headerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div>
      <div ref={headerRef} style={s.catHeader(open)} onClick={onToggle}>
        <span style={s.catTitle}>{title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {count > 0 && <span style={s.catBadge(count)}>{count}</span>}
          <span style={{ fontSize: 18, color: colors.textMid, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
        </div>
      </div>
      {open && (
        <div style={s.catBody}>
          {children}
          <div onClick={collapse} style={s.catFooterCollapse}>
            ▲ Collapse {title}
          </div>
        </div>
      )}
    </div>
  );
}

function ProteinGroup({ label, protein, accent, bg, children }) {
  const a = accent || getProteinAccent(protein);
  const b = bg || getProteinColor(protein);
  return (
    <>
      <div style={s.groupLine(a, b)}>{label}</div>
      {children}
    </>
  );
}

function MatrixProduct({ row, pkg, vat, quantities, setQty, cat }) {
  const sizes = getMatrixSizes(row);
  if (sizes.length === 0) return null;
  const name = row[0];
  const protein = row[1];
  
  return (
    <div style={s.productRow(null)}>
      <div style={s.productName}>{name}</div>
      <div style={s.sizeGroup}>
        {sizes.map(sz => {
          const res = getMatrixSku(row, pkg, vat, sz);
          if (!res) return null;
          const sizeLabel = cat === "wgf" 
            ? (sz === "small" ? getWGFSmallLabel(row) : "12kg")
            : (sz === "small" ? "2kg" : "12kg");
          const key = res.sku;
          return (
            <div key={sz} style={s.sizeBox}>
              <span style={s.sizeLabel(false)}>{sizeLabel}</span>
              <QtyControl value={quantities[key] || 0} onChange={v => setQty(key, v, res.price, name + " " + sizeLabel, weightOf(sizeLabel))} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CPProduct({ row, vat, quantities, setQty }) {
  const name = row[0];
  const protein = row[1];
  const sizes = [
    { label: "2kg", skuBase: row[2], price: row[5] },
    { label: "5kg", skuBase: row[3], price: row[6] },
    { label: "12kg", skuBase: row[4], price: row[7] },
  ];
  
  return (
    <div style={s.productRow(null)}>
      <div style={s.productName}>{name}</div>
      <div style={s.sizeGroup}>
        {sizes.map(({ label, skuBase, price }) => {
          const sku = vat === "vat" ? skuBase + "V" : skuBase;
          return (
            <div key={label} style={s.sizeBox}>
              <span style={s.sizeLabel(false)}>{label}</span>
              <QtyControl value={quantities[sku] || 0} onChange={v => setQty(sku, v, price, "CP " + name + " " + label, weightOf(label))} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SimpleProduct({ name, sku, price, size, quantities, setQty }) {
  if (!sku) return null;
  return (
    <div style={s.productRow(null)}>
      <div style={s.productName}>{name}</div>
      <div style={s.sizeGroup}>
        <div style={s.sizeBox}>
          <span style={s.sizeLabel(false)}>{size}</span>
          <QtyControl value={quantities[sku] || 0} onChange={v => setQty(sku, v, price, name + " " + size, weightOf(size))} />
        </div>
      </div>
    </div>
  );
}

// Shared renderer. Each "cell" is one tappable size/pallet control on a product row.
// cell: { key, label, price, weight, step, desc, isPallet, palletQty }
// For a pallet, step = bags/cases per pallet, and the displayed number IS the bag count
// (65, 130, ...), so total = qty × unit price multiplies correctly.
function ProductRow({ name, protein = null, cells, quantities, setQty }) {
  const visible = cells.filter(Boolean);
  if (visible.length === 0) return null;
  return (
    <div style={s.productRow(null)}>
      <div style={s.productName}>{name}</div>
      <div style={s.sizeGroup}>
        {visible.map(c => (
          <div key={c.key} style={s.sizeBox}>
            <span style={s.sizeLabel(c.isPallet)}>
              {c.isPallet ? `Pallet ×${c.palletQty}` : c.label}
            </span>
            <QtyControl
              value={quantities[c.key] || 0}
              step={c.step || 1}
              onChange={v => setQty(c.key, v, c.price, c.desc, c.weight)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function GLProduct({ name, sku, price, quantities, setQty }) {
  if (!sku) return null;
  const cells = [
    { key: sku, label: "15kg", price, weight: 15, step: 1, desc: `${name} 15kg` },
    { key: sku + "-PLT", label: "Pallet", price, weight: 15, step: 65, palletQty: 65, isPallet: true, desc: `${name} 15kg (Pallet)` },
  ];
  return <ProductRow name={name} cells={cells} quantities={quantities} setQty={setQty} />;
}

function WDProduct({ row, vat, quantities, setQty }) {
  // Pero dual-size items
  if (row.pero) {
    const bigSku = row.vat || row.wd;
    const bigWeight = weightOf(row.sizeBig || "15kg");
    const cells = [
      (row.wd && row.priceSmall > 0)
        ? { key: row.wd, label: row.sizeSmall, price: row.priceSmall, weight: weightOf(row.sizeSmall), step: 1, desc: `${row.name} ${row.sizeSmall}` }
        : null,
      (row.vat && row.priceBig > 0)
        ? { key: row.vat, label: row.sizeBig, price: row.priceBig, weight: bigWeight, step: 1, desc: `${row.name} ${row.sizeBig}` }
        : null,
      row.pallet
        ? { key: bigSku + "-PLT", label: "Pallet", price: row.priceBig || row.priceSmall, weight: bigWeight, step: row.pallet, palletQty: row.pallet, isPallet: true, desc: `${row.name} ${row.sizeBig || row.sizeSmall} (Pallet)` }
        : null,
    ];
    return <ProductRow name={row.name} cells={cells} quantities={quantities} setQty={setQty} />;
  }

  // Regular WD item (15kg bag or case)
  const sku = vat === "vat" ? (row.vat || row.wd) : row.wd;
  if (!sku) return null;
  const isCase = row.size === "case";
  const unitWeight = isCase ? (row.caseWeight || 3.95) : weightOf(row.size);
  const cells = [
    { key: sku, label: row.size, price: row.price, weight: unitWeight, step: 1, desc: `${row.name} ${row.size}` },
    row.pallet
      ? { key: sku + "-PLT", label: "Pallet", price: row.price, weight: unitWeight, step: row.pallet, palletQty: row.pallet, isPallet: true, desc: `${row.name} ${row.size} (Pallet${isCase ? ", cases" : ""})` }
      : null,
  ];
  return <ProductRow name={row.name} cells={cells} quantities={quantities} setQty={setQty} />;
}

function PeroProduct({ row, vat, quantities, setQty }) {
  const [name, skuSmall, skuBig, priceSmall, priceBig, sizeSmall, sizeBig, vatType] = row;
  
  const resolvesku = (skuField, isVat) => {
    if (!skuField) return null;
    if (skuField.includes("|")) {
      const [vatSku, wdSku] = skuField.split("|");
      return isVat ? vatSku : wdSku;
    }
    return skuField;
  };
  
  const isVat = vat === "vat";
  // For fixed-vat products, override
  const effectiveVat = vatType === "both" ? isVat : vatType === "vat";
  
  const smallSku = resolvesku(skuSmall, effectiveVat);
  const bigSku = resolvesku(skuBig, effectiveVat);
  
  const items = [];
  if (smallSku && sizeSmall && priceSmall > 0) items.push({ sku: smallSku, size: sizeSmall, price: priceSmall });
  if (bigSku && sizeBig) items.push({ sku: bigSku, size: sizeBig, price: priceBig });
  
  if (items.length === 0) return null;
  
  return (
    <div style={s.productRow(null)}>
      <div style={s.productName}>{name}</div>
      <div style={s.sizeGroup}>
        {items.map(({ sku, size, price }) => (
          <div key={sku} style={s.sizeBox}>
            <span style={s.sizeLabel(false)}>{size}</span>
            <QtyControl value={quantities[sku] || 0} onChange={v => setQty(sku, v, price, name + " " + size, weightOf(size))} />
          </div>
        ))}
      </div>
    </div>
  );
}

function WTProduct({ row, vat, quantities, setQty }) {
  const [name, , sku, price] = row;
  const finalSku = vat === "vat" ? sku + "V" : sku;
  return <SimpleProduct name={name} sku={finalSku} price={price} size="10x395g" quantities={quantities} setQty={setQty} />;
}

function TreatGroup({ group, quantities, setQty }) {
  const [name, items] = group;
  return (
    <div style={s.treatRow}>
      <div style={s.treatName}>{name}</div>
      <div style={s.treatSizes}>
        {items.map(([sku, size]) => (
          <div key={sku} style={s.sizeBox}>
            <span style={s.sizeLabel(false)}>{size || "pack"}</span>
            <QtyControl value={quantities[sku] || 0} onChange={v => setQty(sku, v, 0, name + " " + (size || "pack"), weightOf(size))} />
          </div>
        ))}
      </div>
    </div>
  );
}


// ── GROUP PRODUCTS BY PROTEIN ──
function groupByProtein(products) {
  const order = ["chicken", "salmon", "duck", "turkey", "lamb", "pork", "beef", "mixed"];
  const labels = { chicken: "Chicken", salmon: "Salmon & Fish", duck: "Duck", turkey: "Turkey", lamb: "Lamb", pork: "Pork", beef: "Beef", mixed: "Mixed / Other" };
  const groups = {};
  products.forEach(p => {
    const prot = p[1];
    if (!groups[prot]) groups[prot] = [];
    groups[prot].push(p);
  });
  return order.filter(k => groups[k]).map(k => ({ key: k, label: labels[k], items: groups[k] }));
}

function groupWTByProtein(products) {
  const order = ["chicken", "salmon", "duck", "turkey", "lamb"];
  const labels = { chicken: "Chicken", salmon: "Salmon & Fish", duck: "Duck", turkey: "Turkey", lamb: "Lamb" };
  const groups = {};
  products.forEach(p => {
    const prot = p[1];
    if (!groups[prot]) groups[prot] = [];
    groups[prot].push(p);
  });
  return order.filter(k => groups[k]).map(k => ({ key: k, label: labels[k], items: groups[k] }));
}

// ── MAIN APP ──
export default function App() {
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [packaging, setPackaging] = useState("coloured");
  const [vat, setVat] = useState("wd");
  const [orderItems, setOrderItems] = useState({});
  const [openCats, setOpenCats] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [copied, setCopied] = useState(false);

  const setQty = useCallback((sku, qty, price, desc, weight) => {
    setOrderItems(prev => {
      const next = { ...prev };
      if (qty <= 0) {
        delete next[sku];
      } else {
        next[sku] = { qty, price, desc, weight, sku };
      }
      return next;
    });
  }, []);

  const quantities = useMemo(() => {
    const q = {};
    Object.entries(orderItems).forEach(([sku, item]) => {
      q[sku] = item.qty;
    });
    return q;
  }, [orderItems]);

  const toggleCat = useCallback((cat) => {
    setOpenCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  }, []);

  const orderList = useMemo(() => Object.values(orderItems).filter(i => i.qty > 0), [orderItems]);
  
  const totalNet = useMemo(() => orderList.reduce((sum, i) => sum + (i.price * i.qty), 0), [orderList]);
  const totalWeight = useMemo(() => orderList.reduce((sum, i) => sum + (i.weight * i.qty), 0), [orderList]);
  const totalItems = useMemo(() => orderList.reduce((sum, i) => sum + i.qty, 0), [orderList]);
  const carriage = useMemo(() => carriageCalc(totalWeight, totalNet), [totalWeight, totalNet]);

  const countForCat = useCallback((skuPrefixes) => {
    return orderList.filter(i => skuPrefixes.some(p => i.sku.startsWith(p) || i.sku.toUpperCase().startsWith(p))).reduce((s, i) => s + i.qty, 0);
  }, [orderList]);

  // Count items per category
  const catCounts = useMemo(() => {
    const c = {};
    const gfSkus = GF.flatMap(r => [r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9]]).filter(Boolean);
    const wgfSkus = WGF.flatMap(r => [r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9]]).filter(Boolean);
    c.gf = orderList.filter(i => gfSkus.includes(i.sku.split('-')[0])).reduce((s,i) => s + i.qty, 0);
    c.wgf = orderList.filter(i => wgfSkus.includes(i.sku.split('-')[0])).reduce((s,i) => s + i.qty, 0);
    c.cp = orderList.filter(i => i.sku.startsWith("CP")).reduce((s,i) => s + i.qty, 0);
    const wdSKUs = ["SR0351","SR0399","SR0397","SR0353","SR0398","SR0352","SR0118","SR0109","SR0450","SR0451","C0004","P0015","P0014","P0020","P0021"];
    c.wd = orderList.filter(i => wdSKUs.some(p => i.sku.startsWith(p) || i.sku === p)).reduce((s,i) => s + i.qty, 0);
    c.gl = orderList.filter(i => i.sku.startsWith("GD")).reduce((s,i) => s + i.qty, 0);
    c.wt = orderList.filter(i => i.desc && i.desc.includes("x395")).reduce((s,i) => s + i.qty, 0);
    c.spwt = orderList.filter(i => ["SR0489","SR0490","SR0491","SR0492","SR0493"].some(p => i.sku.startsWith(p))).reduce((s,i) => s + i.qty, 0);
    c.tr = orderList.filter(i => i.sku.startsWith("TRT") || ["SR0466","SR0467","SR0468","SR0469","SR0470","SR0471","SR0473","SR0474","SR0277","sr0543"].some(p => i.sku === p)).reduce((s,i) => s + i.qty, 0);
    c.tb = orderList.filter(i => i.sku.startsWith("TRT") || i.sku.startsWith("SR04") || i.sku.startsWith("SR05")).reduce((s,i) => s + i.qty, 0);
    c.mt = orderList.filter(i => i.sku.includes("X7")).reduce((s,i) => s + i.qty, 0);
    c.pero = orderList.filter(i => /^P00(38|39|40|37|18|19|71|72|73|74|75|76|77|78|79|80|81|82)/.test(i.sku) || i.sku.startsWith("TRU")).reduce((s,i) => s + i.qty, 0);
    c.cat = orderList.filter(i => i.sku === "SR0164" || i.sku === "SR0216").reduce((s,i) => s + i.qty, 0);
    return c;
  }, [orderList]);

  const gfGroups = useMemo(() => groupByProtein(GF), []);
  const wgfGroups = useMemo(() => groupByProtein(WGF), []);
  const cpGroups = useMemo(() => ([
    { key: "8020", label: "80/20 Recipes", accent: "#1a6847", bg: "#e8f5ee",
      items: CP.filter(r => r[0].startsWith("80/20")) },
    { key: "grain", label: "With Grain", accent: "#b5732e", bg: "#fbf3e8",
      items: CP.filter(r => /with Grain/i.test(r[0])) },
    { key: "other", label: "Other Recipes", accent: "#5a6b73", bg: "#eef1f2",
      items: CP.filter(r => !r[0].startsWith("80/20") && !/with Grain/i.test(r[0])) },
  ]), []);
  const wtGroups = useMemo(() => groupWTByProtein(WT), []);

  const buildOrderText = useCallback(() => {
    // Build as HTML table for better paste formatting
    let html = `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse; font-family:Arial, sans-serif; width:100%;">`;
    html += `<tr style="background-color:#1a6847; color:white;"><th>PERO TRADE ORDER</th></tr>`;
    html += `<tr><td><b>Customer:</b> ${customerName || "(not set)"}</td></tr>`;
    html += `<tr><td><b>Packaging:</b> ${packaging === "coloured" ? "Coloured Bags" : "Paper Bags"}</td></tr>`;
    html += `<tr><td><b>VAT Status:</b> ${vat === "vat" ? "VAT Registered" : "Working Dog (Zero Rated)"}</td></tr>`;
    if (notes) html += `<tr><td><b>Notes:</b> ${notes}</td></tr>`;
    html += `</table><br><br>`;
    
    html += `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse; font-family:Arial, sans-serif; width:100%;">`;
    html += `<thead><tr style="background-color:#f7f7f5;"><th>SKU</th><th>Qty</th><th>Description</th><th>Price</th><th>Total</th></tr></thead>`;
    html += `<tbody>`;
    orderList.forEach(i => {
      const unitP = i.price > 0 ? `£${i.price.toFixed(2)}` : "TBC";
      const totalP = i.price > 0 ? `£${(i.price * i.qty).toFixed(2)}` : "TBC";
      const displaySku = i.sku.replace(/-PLT$/, "");
      html += `<tr><td>${displaySku}</td><td>${i.qty}</td><td>${i.desc}</td><td>${unitP}</td><td>${totalP}</td></tr>`;
    });
    if (carriage.sku) {
      html += `<tr style="background-color:#e8f5ee;"><td>${carriage.sku}</td><td>${carriage.qty || 1}</td><td>${carriage.desc}</td><td>£${carriage.cost.toFixed(2)}</td><td>£${((carriage.qty || 1) * carriage.cost).toFixed(2)}</td></tr>`;
    }
    html += `</tbody></table><br><br>`;
    
    const pricedTotal = totalNet + (carriage.cost * (carriage.qty || 1));
    html += `<b>Net Total:</b> £${pricedTotal.toFixed(2)} (excl. unpriced items)<br>`;
    html += `<b>Total Weight:</b> ${totalWeight.toFixed(1)}kg<br>`;
    html += `<b>Items:</b> ${totalItems}`;
    return html;
  }, [customerName, packaging, vat, notes, orderList, carriage, totalNet, totalWeight, totalItems]);

  const handleCopy = useCallback(() => {
    const html = buildOrderText();
    // Try to copy as HTML for table formatting
    const blob = new Blob([html], { type: 'text/html' });
    const data = [new ClipboardItem({ 'text/html': blob, 'text/plain': new Blob([html], { type: 'text/plain' }) })];
    
    navigator.clipboard.write(data).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      // Fallback: just copy as plain text
      const ta = document.createElement("textarea");
      ta.value = html;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [buildOrderText]);

  const clearOrder = useCallback(() => {
    const confirmed = window.confirm("Are you sure? This will clear the entire order.");
    if (confirmed) {
      setOrderItems({});
    }
  }, []);

  const freeCarriageGap = 1750 - totalNet;

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <h1 style={s.headerTitle}>Pero Trade Order</h1>
        <div style={s.headerSub}>Rep ordering system</div>
      </div>

      {/* ORDER SETTINGS */}
      <div style={s.section}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: `1px solid ${colors.border}` }}>
          <label style={s.label}>Customer Name</label>
          <input style={s.input} placeholder="Enter customer name..." value={customerName} onChange={e => setCustomerName(e.target.value)} />
          
          <label style={{ ...s.label, marginTop: 12 }}>Notes</label>
          <textarea style={s.textarea} placeholder="Brief notes for this order..." value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
          
          <label style={{ ...s.label, marginTop: 12 }}>Packaging</label>
          <div style={s.toggleRow}>
            <button style={s.toggleBtn(packaging === "coloured")} onClick={() => setPackaging("coloured")}>
              Coloured Bags
            </button>
            <button style={s.toggleBtn(packaging === "paper")} onClick={() => setPackaging("paper")}>
              Paper Bags
            </button>
          </div>
          
          <label style={{ ...s.label, marginTop: 12 }}>VAT Status</label>
          <div style={s.toggleRow}>
            <button style={s.toggleBtn(vat === "wd")} onClick={() => setVat("wd")}>
              WD (Zero Rated)
            </button>
            <button style={s.toggleBtn(vat === "vat")} onClick={() => setVat("vat")}>
              VAT (Standard)
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={s.section}>
        
        {/* GRAIN FREE */}
        <CategorySection title="Grain Free" count={catCounts.gf} open={openCats.gf} onToggle={() => toggleCat("gf")}>
          {gfGroups.map(g => (
            <ProteinGroup key={g.key} label={g.label} protein={g.key}>
              {g.items.map((row, i) => (
                <MatrixProduct key={i} row={row} pkg={packaging} vat={vat} quantities={quantities} setQty={setQty} cat="gf" />
              ))}
            </ProteinGroup>
          ))}
        </CategorySection>

        {/* GLUTEN FREE */}
        <CategorySection title="Gluten Free" count={catCounts.wgf} open={openCats.wgf} onToggle={() => toggleCat("wgf")}>
          {wgfGroups.map(g => (
            <ProteinGroup key={g.key} label={g.label} protein={g.key}>
              {g.items.map((row, i) => (
                <MatrixProduct key={i} row={row} pkg={packaging} vat={vat} quantities={quantities} setQty={setQty} cat="wgf" />
              ))}
            </ProteinGroup>
          ))}
        </CategorySection>

        {/* WORKING DOG */}
        <CategorySection title="Working Dog" count={catCounts.wd} open={openCats.wd} onToggle={() => toggleCat("wd")}>
          {WD.map((row, i) => (
            <WDProduct key={i} row={row} vat={vat} quantities={quantities} setQty={setQty} />
          ))}
        </CategorySection>

        {/* GOLDLINE */}
        <CategorySection title="Goldline" count={catCounts.gl} open={openCats.gl} onToggle={() => toggleCat("gl")}>
          {GL.map((row, i) => (
            <GLProduct key={i} name={row[0]} sku={row[1]} price={row[2]} quantities={quantities} setQty={setQty} />
          ))}
        </CategorySection>

        {/* COLD PRESSED */}
        <CategorySection title="Cold Pressed" count={catCounts.cp} open={openCats.cp} onToggle={() => toggleCat("cp")}>
          {cpGroups.map(g => (
            <ProteinGroup key={g.key} label={g.label} accent={g.accent} bg={g.bg}>
              {g.items.map((row, i) => (
                <CPProduct key={i} row={row} vat={vat} quantities={quantities} setQty={setQty} />
              ))}
            </ProteinGroup>
          ))}
        </CategorySection>

        {/* WET TRAYS */}
        <CategorySection title="Wet Trays" count={catCounts.wt} open={openCats.wt} onToggle={() => toggleCat("wt")}>
          {wtGroups.map(g => (
            <ProteinGroup key={g.key} label={g.label} protein={g.key}>
              {g.items.map((row, i) => (
                <WTProduct key={i} row={row} vat={vat} quantities={quantities} setQty={setQty} />
              ))}
            </ProteinGroup>
          ))}
        </CategorySection>

        {/* SUPER PREMIUM WET TRAYS */}
        <CategorySection title="Super Premium Wet Trays" count={catCounts.spwt} open={openCats.spwt} onToggle={() => toggleCat("spwt")}>
          <div style={{ padding: "4px 16px 2px", fontSize: 11, color: colors.textMid }}>VAT only — 9x300g trays</div>
          {SPWT.map((row, i) => (
            <SimpleProduct key={i} name={row[0]} sku={row[1]} price={row[2]} size="9x300g" quantities={quantities} setQty={setQty} />
          ))}
        </CategorySection>

        {/* TREATS - RETAIL */}
        <CategorySection title="Treats — Retail Packs" count={0} open={openCats.tr} onToggle={() => toggleCat("tr")}>
          {TREATS_RETAIL.map((group, i) => (
            <TreatGroup key={i} group={group} quantities={quantities} setQty={setQty} />
          ))}
        </CategorySection>

        {/* TREATS - BULK */}
        <CategorySection title="Treats — Bulk Packs" count={0} open={openCats.tb} onToggle={() => toggleCat("tb")}>
          {TREATS_BULK.map((group, i) => (
            <TreatGroup key={i} group={group} quantities={quantities} setQty={setQty} />
          ))}
        </CategorySection>

        {/* PERO / TRULINE (Premium — High Meat range + Truline).
            Premiwm/Active/Maintenance live in Working Dog above. */}
        <CategorySection title="Pero / Truline (Premium)" count={catCounts.pero} open={openCats.pero} onToggle={() => toggleCat("pero")}>
          {PERO.map((row, i) => (
            <PeroProduct key={i} row={row} vat={vat} quantities={quantities} setQty={setQty} />
          ))}
        </CategorySection>

        {/* MEAL TOPPERS */}
        <CategorySection title="Meal Toppers" count={catCounts.mt} open={openCats.mt} onToggle={() => toggleCat("mt")}>
          {MT.map((row, i) => (
            <SimpleProduct key={i} name={row[0]} sku={row[1]} price={0} size={row[2]} quantities={quantities} setQty={setQty} />
          ))}
        </CategorySection>

        {/* CAT */}
        <CategorySection title="Cat" count={catCounts.cat} open={openCats.cat} onToggle={() => toggleCat("cat")}>
          {CAT_PRODS.map((row, i) => (
            <SimpleProduct key={i} name={row[0]} sku={row[1]} price={0} size={row[2]} quantities={quantities} setQty={setQty} />
          ))}
        </CategorySection>

        {/* COLLAPSE/EXPAND ALL */}
        <div style={{ display: "flex", gap: 8, padding: "16px 12px" }}>
          <button onClick={() => {
            const allCats = ['gf', 'wgf', 'wd', 'gl', 'cp', 'wt', 'spwt', 'tr', 'tb', 'pero', 'mt', 'cat'];
            setOpenCats(allCats.reduce((acc, cat) => ({ ...acc, [cat]: true }), {}));
          }} style={{ flex: 1, ...s.reviewBtn }}>
            Expand All
          </button>
          <button onClick={() => setOpenCats({})} style={{ flex: 1, ...s.reviewBtn, background: colors.textMid }}>
            Collapse All
          </button>
        </div>

      </div>

      {/* STICKY BOTTOM BAR */}
      <div style={s.bottomBar}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: colors.primary }}>
            £{totalNet.toFixed(2)}
          </div>
          <div style={{ fontSize: 11, color: freeCarriageGap > 0 ? colors.textMid : colors.primary }}>
            {freeCarriageGap > 0 ? `£${freeCarriageGap.toFixed(0)} to free carriage` : "✓ Free carriage"}
            {totalItems > 0 && ` · ${totalItems} items`}
          </div>
          {carriage.sku && carriage.cost > 0 && (
            <div style={{ fontSize: 10, color: colors.textLight }}>
              Est. carriage: {carriage.desc} — £{(carriage.cost * (carriage.qty || 1)).toFixed(2)}+VAT
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {totalItems > 0 && (
            <button onClick={clearOrder} style={{ ...s.reviewBtn, background: colors.dangerLight, color: colors.danger, padding: "12px 14px" }}>✕</button>
          )}
          <button style={{ ...s.reviewBtn, opacity: totalItems === 0 ? 0.4 : 1 }} disabled={totalItems === 0} onClick={() => { setShowReview(true); setCopied(false); }}>
            Review Order
          </button>
        </div>
      </div>

      {/* REVIEW MODAL */}
      {showReview && (
        <div style={s.modal} onClick={() => setShowReview(false)}>
          <div style={s.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={s.modalTitle}>Order Review</h2>
              <button onClick={() => setShowReview(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: colors.textMid }}>✕</button>
            </div>
            
            <div style={{ fontSize: 13, marginBottom: 12, padding: 12, background: colors.bg, borderRadius: 8 }}>
              <div><strong>Customer:</strong> {customerName || "—"}</div>
              <div><strong>Packaging:</strong> {packaging === "coloured" ? "Coloured Bags" : "Paper Bags"}</div>
              <div><strong>VAT:</strong> {vat === "vat" ? "VAT Registered" : "Working Dog (Zero Rated)"}</div>
              {notes && <div><strong>Notes:</strong> {notes}</div>}
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={s.orderTable}>
                <thead>
                  <tr>
                    <th style={s.th}>SKU</th>
                    <th style={s.th}>Qty</th>
                    <th style={s.th}>Description</th>
                    <th style={s.th}>Price</th>
                    <th style={s.th}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderList.map(i => (
                    <tr key={i.sku}>
                      <td style={{ ...s.td, fontFamily: "monospace", fontSize: 11 }}>{i.sku.replace(/-PLT$/, "")}</td>
                      <td style={s.td}>{i.qty}</td>
                      <td style={s.td}>{i.desc}</td>
                      <td style={s.td}>{i.price > 0 ? `£${i.price.toFixed(2)}` : "TBC"}</td>
                      <td style={{ ...s.td, fontWeight: 600 }}>{i.price > 0 ? `£${(i.price * i.qty).toFixed(2)}` : "TBC"}</td>
                    </tr>
                  ))}
                  {carriage.sku && (
                    <tr style={{ background: colors.bg }}>
                      <td style={{ ...s.td, fontFamily: "monospace", fontSize: 11 }}>{carriage.sku}</td>
                      <td style={s.td}>{carriage.qty || 1}</td>
                      <td style={s.td}>{carriage.desc}</td>
                      <td style={s.td}>£{carriage.cost.toFixed(2)}</td>
                      <td style={{ ...s.td, fontWeight: 600 }}>£{((carriage.qty || 1) * carriage.cost).toFixed(2)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 16, padding: 12, background: colors.primaryLight, borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 12, color: colors.textMid }}>Net Total</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: colors.primary }}>
                  £{(totalNet + (carriage.cost * (carriage.qty || 1))).toFixed(2)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: colors.textMid }}>Weight</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{totalWeight.toFixed(1)}kg</div>
              </div>
            </div>

            <button style={copied ? s.copied : s.copyBtn} onClick={handleCopy}>
              {copied ? "✓ Copied to clipboard!" : "Copy Order to Clipboard"}
            </button>
            <div style={{ fontSize: 11, color: colors.textMid, textAlign: "center", marginTop: 8 }}>
              Paste into an email to send to customer services
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
