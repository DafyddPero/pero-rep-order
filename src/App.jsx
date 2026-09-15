import { useState, useMemo, useCallback, useRef, useEffect, memo } from "react";

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
["Turkey Calming","mixed","CP013","CP014","CP015",5.91,14.78,36.29],
["Beef & Sweet Potato","beef","CP016","CP017","CP018",5.91,14.78,36.29],
["Lamb & Sweet Potato","lamb","CP019","CP020","CP021",6.38,15.94,38.26],
["Turkey Gastro","turkey","CP022","CP023","CP024",6.45,16.12,38.70],
["Salmon & Sweet Potato","salmon","CP025","CP026","CP027",6.86,17.16,41.17],
["Turkey Support","mixed","CP031","CP032","CP033",6.86,17.16,41.17],
["Rabbit & Sweet Potato","rabbit","CP043","CP044","CP045",10.27,25.68,61.63],
["Insect Protein & Sweet Potato","insect","CP046","CP047","CP048",5.91,15.78,36.29]
];

// Working Dog.
//  Regular : {name, wd, vat, price, size, pallet}   pallet = bags/cases per pallet
//  Pero    : {name, pero:true, wd(small sku), vat(big sku), priceSmall, priceBig, sizeSmall, sizeBig, pallet}
const WD = [
{name:"Meaty Mix", wd:"SR0118", vat:"", price:19.40, size:"15kg", pallet:65},
{name:"Muesli Mix", wd:"SR0109", vat:"", price:17.91, size:"15kg", pallet:65},
{name:"Celt 22 (Celt Label)", wd:"SR0450", vat:"", price:13.95, size:"15kg", pallet:60},
{name:"Celt 22 (Own Label)", wd:"SR0451", vat:"", price:12.74, size:"15kg", pallet:60},
{name:"Rich in Chicken", wd:"SR0351", vat:"", price:18.01, size:"15kg", pallet:65},
{name:"Rich in Chicken (Hardworking)", wd:"SR0399", vat:"SR0399V", price:19.04, size:"15kg", pallet:65},
{name:"Economy Chicken & Rice", wd:"SR0397", vat:"SR0397V", price:18.03, size:"15kg", pallet:65},
{name:"Economy Lamb & Rice", wd:"SR0353", vat:"SR0353V", price:19.35, size:"15kg", pallet:65},
{name:"Resting/Senior with Chicken", wd:"SR0398", vat:"SR0398V", price:19.56, size:"15kg", pallet:65},
{name:"Puppy with Chicken", wd:"SR0352", vat:"SR0352V", price:18.01, size:"15kg", pallet:65},
{name:"Celt Canned Wet (Dogs)", wd:"C0004", vat:"", price:6.49, size:"case", pallet:192, caseWeight:3.95},
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
["Beef Meal Topper","SR0494X7","7x160g",19.19],
["Turkey Meal Topper","SR0495X7","7x160g",20.36],
["Duck Meal Topper","SR0496X7","7x160g",23.28],
["Salmon Meal Topper","SR0486X7","7x160g",23.28],
["Herring Meal Topper","SR0497X7","7x160g",25.03],
["Rabbit Meal Topper","SR0498X7","7x160g",34.94]
];

// Cat dry: [name, sku_small, size_small, price_small, sku_big, size_big, price_big]
const CAT_DRY = [
["Cat Complete","SR0215","2kg",4.37,"SR0164","10kg",17.32]
];
// Cat cans (price break + pallet handled like dog cans)
const CAT_CAN = {name:"Celt Canned Wet (Cats)", sku:"C0005", price:6.70, pallet:192, caseWeight:3.95};

// ── DEALS (weekly promotions) ──
// Each deal resolves to the same SKU as the normal product, but is stored under a
// "<sku>-DEAL" key at the promo price so it never collides with a full-price line.
// kind "matrix" = GF/GLUTEN item (respects packaging + VAT); "cp" = adds V on VAT; "gl" = fixed.
const DEALS_INFO = { title: "This week's deals", dates: "14 Sep – 23 Oct" };
const DEALS = [
  { name:"Chicken & Rice (Large Breed)", size:"12kg", was:28.90, now:24.57, pct:15, kind:"matrix", coloured:"SR0123", paper:"SR0355" },
  { name:"Chicken & Rice (Senior/Light)", size:"12kg", was:25.79, now:21.92, pct:15, kind:"matrix", coloured:"SR0045", paper:"SR0287" },
  { name:"Puppy Complete", size:"10kg", was:25.50, now:21.68, pct:15, kind:"matrix", coloured:"SR0050", paper:"SR0288" },
  { name:"Salmon & Potato (Sensitive)", size:"12kg", was:32.94, now:29.65, pct:10, kind:"matrix", coloured:"", paper:"SR0478" },
  { name:"Super 75 (Meat & Fish)", size:"12kg", was:41.49, now:35.27, pct:15, kind:"matrix", coloured:"", paper:"SR0442" },
  { name:"Super 75 (Fish)", size:"12kg", was:45.20, now:38.42, pct:15, kind:"matrix", coloured:"", paper:"SR0444" },
  { name:"Turkey Support (Cold Pressed)", size:"12kg", was:41.17, now:37.06, pct:10, kind:"cp", base:"CP033" },
  { name:"Turkey Slim Down (Cold Pressed)", size:"12kg", was:35.12, now:31.61, pct:10, kind:"cp", base:"CP009" },
  { name:"Turkey Calming (Cold Pressed)", size:"12kg", was:36.29, now:32.66, pct:10, kind:"cp", base:"CP015" },
  { name:"Wholemeal Mixer", size:"15kg", was:15.81, now:11.86, pct:25, kind:"gl", sku:"GD011" },
  { name:"Salmon, Rice, Oats & Vegetables", size:"15kg", was:30.23, now:27.21, pct:10, kind:"gl", sku:"GD003" },
  { name:"Adult Tripe (Wheat Gluten Free)", size:"15kg", was:28.94, now:26.05, pct:10, kind:"gl", sku:"GD009" },
];

// Resolve a deal to its real base SKU given current packaging/VAT toggles.
function resolveDealSku(deal, packaging, vat) {
  let sku;
  if (deal.kind === "matrix") {
    sku = packaging === "coloured" ? (deal.coloured || deal.paper) : (deal.paper || deal.coloured);
    if (sku && vat === "vat") sku += "V";
  } else if (deal.kind === "cp") {
    sku = deal.base;
    if (vat === "vat") sku += "V";
  } else {
    sku = deal.sku; // gl — no V variant in app
  }
  return sku;
}

const stripKey = (sku) => sku.replace(/-PLT$/, "").replace(/-DEAL$/, "");


// ── TREATS DATA (unified) ──
// [name, [[sku, sizeLabel, price], ... up to 3 order sizes]]
// Sizes run small→large: Retail Pack (200g/5pcs) · Bulk Bag (1kg/50pcs) · Bulk Box (multi-kg/100pcs)
const TREATS = [
["Rabbit Ears with Fur",[["TRT001","200g",4.50],["TRT002","1kg",11.00],["TRT003","10kg",100.00]]],
["Dried Sprats",[["TRT004","200g",4.50],["TRT005","1kg",14.89],["TRT006","15kg",200.00]]],
["Venison Strips",[["TRT007","200g",5.00],["TRT008","1kg",14.00],["TRT009","10kg",130.00]]],
["Lamb Strips",[["TRT010","200g",4.50],["TRT011","1kg",14.00],["TRT012","10kg",130.00]]],
["Chicken Feet",[["TRT013","200g",2.50],["TRT014","1kg",5.00],["TRT015","20kg",90.00]]],
["Wild Boar Strips",[["TRT016","200g",4.50],["TRT017","1kg",14.00],["TRT018","10kg",130.00]]],
["Cod Skin Flatties",[["TRT019","200g",5.00],["TRT020","1kg",18.50],["TRT021","5kg",85.00]]],
["Chicken Bites",[["TRT022","200g",4.50],["TRT023","1kg",15.00],["TRT024","20kg",280.00]]],
["Beef Bites",[["TRT025","200g",4.50],["TRT026","1kg",15.00],["TRT027","20kg",280.00]]],
["Venison Bites",[["TRT028","200g",5.00],["TRT029","1kg",17.00],["TRT030","20kg",320.00]]],
["Lamb Bites",[["TRT031","200g",5.00],["TRT032","1kg",17.00],["TRT033","20kg",320.00]]],
["Chicken Breasts",[["TRT034","200g",5.00],["TRT035","1kg",17.00],["TRT036","12kg",190.00]]],
["Turkey Bites",[["TRT037","200g",4.50],["TRT038","1kg",15.00],["TRT039","20kg",280.00]]],
["Duck Bites",[["TRT040","200g",5.00],["TRT041","1kg",15.00],["TRT042","20kg",280.00]]],
["Wild Boar Bites",[["TRT043","200g",4.50],["TRT044","1kg",17.00],["TRT045","20kg",320.00]]],
["Rabbit Bites",[["TRT046","200g",5.00],["TRT047","1kg",16.00],["TRT048","10kg",150.00]]],
["Cod Skin Twists",[["TRT049","200g",5.00],["TRT050","1kg",19.00],["TRT051","5kg",90.00]]],
["Cod Skin Rings",[["TRT052","200g",5.00],["TRT053","1kg",19.00],["TRT054","15kg",270.00]]],
["Cod Skin Braids",[["TRT055","200g",5.00],["TRT056","1kg",18.00],["TRT057","15kg",255.00]]],
["Beef Gullet",[["TRT058","200g",6.00],["TRT059","1kg",17.00]]],
["Beef Trachea",[["TRT061","200g",3.75],["TRT062","1kg",7.50],["TRT063","12kg",80.00]]],
["Pig Ear Strips",[["TRT064","200g",5.00],["TRT065","1kg",18.00],["TRT066","13kg",210.00]]],
["Fish Skin Bites",[["TRT067","200g",5.25],["TRT068","1kg",20.00]]],
["Rabbit Feet",[["TRT070","200g",4.00],["TRT071","1kg",10.15],["TRT072","20kg",180.00]]],
["Beef Strips",[["TRT073","200g",4.50],["TRT074","1kg",14.00],["TRT075","10kg",130.00]]],
["Chicken Strips",[["TRT076","200g",4.50],["TRT077","1kg",14.00],["TRT078","10kg",130.00]]],
["Turkey Strips",[["TRT079","200g",4.50],["TRT080","1kg",14.00],["TRT081","10kg",130.00]]],
["Duck Strips",[["TRT082","200g",5.00],["TRT083","1kg",14.00],["TRT084","10kg",130.00]]],
["Rabbit Strips",[["TRT085","200g",5.00],["TRT086","1kg",14.00],["TRT087","10kg",130.00]]],
["Pig Inner Ears",[["TRT088","200g",2.75],["TRT089","5kg",14.00],["TRT090","10kg",40.00]]],
["Venison Sausages",[["TRT091","200g",4.50],["TRT092","2.5kg",35.00],["TRT093","10kg",120.00]]],
["Pig Ears (Medium)",[["TRT094","5pcs",5.50],["TRT095","50pcs",29.00],["TRT096","100pcs",57.00]]],
["Pig Ears (Large)",[["TRT097","5pcs",6.50],["TRT098","50pcs",33.50],["TRT099","100pcs",66.00]]],
["Bully Pizzles (Medium)",[["TRT100","5pcs",6.75],["TRT101","25pcs",30.00],["TRT102","50pcs",55.00]]],
["Yak Milk Chews (Small)",[["TRT113","pack",9.00]]],
["Yak Milk Chews (Medium)",[["TRT114","pack",9.00]]],
["Yak Milk Chews w/Turmeric (Med)",[["TRT115","pack",11.00]]],
["Yak Milk Chews (Large)",[["TRT116","pack",12.00]]],
["Rolled Hide Chew (Small)",[["TRT107","50pcs",17.50],["TRT108","100pcs",32.00]]],
["Rolled Hide Chew (Medium)",[["TRT109","50pcs",38.00],["TRT110","100pcs",65.00]]],
["Rolled Hide Chew (Large)",[["TRT111","50pcs",65.00],["TRT112","100pcs",115.00]]],
["Pig Shoulder Bone",[["TRT117","50pcs",24.00]]],
["Beef Ears with Hair",[["TRT118","60pcs",42.00]]],
["Beef Leg Bone",[["TRT119","25pcs",38.00]]]
];

// SKU → category label, built from a data set, for grouping the emailed order.
function buildSkuCategory(d) {
  const map = {};
  const add = (sku, cat) => { if (sku) map[sku] = cat; };
  d.GF.forEach(r => [2,3,4,5,6,7,8,9].forEach(i => add(r[i], "Grain Free")));
  d.WGF.forEach(r => [2,3,4,5,6,7,8,9].forEach(i => add(r[i], "Gluten Free")));
  d.CP.forEach(r => [2,3,4].forEach(i => { add(r[i], "Cold Pressed"); add(r[i] + "V", "Cold Pressed"); }));
  d.WD.forEach(r => { add(r.wd, "Working Dog"); add(r.vat, "Working Dog"); });
  d.GL.forEach(r => add(r[1], "Goldline"));
  d.WT.forEach(r => { add(r[2], "Wet Trays"); add(r[2] + "V", "Wet Trays"); });
  d.SPWT.forEach(r => add(r[1], "Super Premium Wet Trays"));
  d.TREATS.forEach(g => g[1].forEach(([sku]) => add(sku, "Treats")));
  d.PERO.forEach(r => [1,2].forEach(i => String(r[i]).split("|").forEach(sk => add(sk, "Pero / Truline"))));
  d.MT.forEach(r => add(r[1], "Meal Toppers"));
  d.CAT_DRY.forEach(r => { add(r[1], "Cat"); add(r[4], "Cat"); });
  add(d.CAT_CAN.sku, "Cat");
  return map;
}

function categoryOf(map, sku) {
  if (sku.endsWith("-DEAL")) return "Deals";
  const k = stripKey(sku);
  return map[k] || map[k.replace(/V$/, "")] || "Other";
}

// Order categories appear in the emailed order.
const CATEGORY_ORDER = ["Deals", "Grain Free", "Gluten Free", "Working Dog", "Goldline", "Cold Pressed", "Wet Trays", "Super Premium Wet Trays", "Treats", "Pero / Truline", "Meal Toppers", "Cat", "Other"];

// ── DATA SET (defaults + admin overrides) ──
// The built-in arrays above are the defaults. The app then layers on, in order:
//   1. /products.json  — published data (export from Admin, commit to /public). Reaches all reps.
//   2. localStorage    — the admin's own in-progress edits on this device (preview before publishing).
const DEFAULT_DATA = { GF, WGF, CP, WD, GL, WT, SPWT, PERO, MT, CAT_DRY, CAT_CAN, TREATS, DEALS, DEALS_INFO };
const DATA_KEYS = Object.keys(DEFAULT_DATA);
const LS_KEY = "pero_admin_data_v1";
const ADMIN_PIN = "2026"; // change me — stops reps wandering into the editor by accident

function mergeData(base, patch) {
  if (!patch || typeof patch !== "object") return base;
  const out = { ...base };
  DATA_KEYS.forEach(k => { if (patch[k] !== undefined) out[k] = patch[k]; });
  return out;
}
function loadLocalData() {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}


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

// ── QUANTITY PRICE BREAKS (unit price drops at higher quantities) ──
// Keyed by base SKU. Tiers: [minQtyForThisPrice, unitPrice] in ascending order.
const PRICE_BREAKS = {
  SR0118: { base: 19.40, tiers: [[130, 18.40], [195, 15.50]] }, // Meaty Mix 15kg
  SR0109: { base: 17.91, tiers: [[130, 16.88], [195, 14.94]] }, // Muesli Mix 15kg
  SR0450: { base: 13.95, tiers: [[60, 12.49], [180, 11.95]] },  // Celt 22 (Celt label)
  SR0451: { base: 12.74, tiers: [[180, 12.20]] },               // Celt 22 (own label, min 60)
  C0004:  { base: 6.49,  tiers: [[192, 6.28]] },                // Celt tins (dogs)
  C0005:  { base: 6.70,  tiers: [[192, 6.49]] },                // Celt tins (cats)
};

const baseSkuOf = (sku) => sku.replace(/-PLT$/, "");

function tierPrice(baseSku, totalQty) {
  const pb = PRICE_BREAKS[baseSku];
  if (!pb) return null;
  let price = pb.base;
  for (const [threshold, p] of pb.tiers) {
    if (totalQty >= threshold) price = p;
  }
  return price;
}

const money = (n) => `£${n.toFixed(2)}`;

// Live unit-price label for a cell. For price-break SKUs the shown price reflects the
// current quantity tier (bags loose + pallets combined), so it drops as more is added.
// baseTotals is the live per-base-SKU quantity map (may be undefined for non-break rows).
function unitLabel(sku, basePrice, { baseTotals, atLeast } = {}) {
  if (basePrice <= 0) return "TBC";
  const b = baseSkuOf(sku);
  if (PRICE_BREAKS[b]) {
    const live = (baseTotals && baseTotals[b]) || 0;
    const qty = Math.max(live, atLeast || 1);
    return money(tierPrice(b, qty));
  }
  return money(basePrice);
}

// Per-kg (or per-piece) value line — shows the saving on bigger packs.
function perUnitLabel(size, price) {
  if (price <= 0 || !size) return null;
  const w = weightOf(size);
  if (w > 0) return `${money(price / w)}/kg`;
  const m = size.match(/(\d+)\s*pcs/i);
  if (m) return `${money(price / parseFloat(m[1]))}/pc`;
  return null;
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

// ── GLOBAL iOS FEEL (press feedback, focus rings) — inline styles can't do :active/:focus ──
if (typeof document !== "undefined" && !document.querySelector("style[data-pero-global]")) {
  const st = document.createElement("style");
  st.setAttribute("data-pero-global", "true");
  st.textContent = `
    * { -webkit-tap-highlight-color: transparent; }
    button { transition: opacity .12s ease, transform .12s ease; }
    button:active { opacity: .72; transform: scale(.97); }
    input:focus, textarea:focus, select:focus { outline: none; box-shadow: 0 0 0 3px rgba(26,104,71,.18); }
    ::selection { background: rgba(26,104,71,.18); }
  `;
  document.head.appendChild(st);
}

// ── STYLES ──
const colors = {
  bg: "#F3F5F1",          // soft warm off-white with a hint of sage — easier on the eye than cool grey
  card: "#FFFFFF",
  primary: "#1A6847",     // Pero green (app tint)
  primaryLight: "#E7F2EC",
  accent: "#B8860B",      // muted gold — pallet accents
  text: "#1C1C1E",        // iOS label
  textMid: "#8E8E93",     // iOS secondary label
  textLight: "#C7C7CC",   // iOS tertiary label
  border: "#E5E5EA",      // iOS hairline separator
  danger: "#FF3B30",      // iOS red
  dangerLight: "#FFECEB",
  segBg: "#E9E9EB",       // iOS segmented-control track
  // Protein highlights — soft tints
  chicken: "#FEF7EC",
  beef: "#FCF1EF",
  salmon: "#EAF3FB",
  duck: "#F2EFFA",
  turkey: "#FCF3E8",
  lamb: "#EBF4EE",
  pork: "#FBEEF4",
  mixed: "#EEF0F2",
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

// Apple system font (SF Pro on iOS).
const fontFamily = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

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
  page: { fontFamily, background: colors.bg, color: colors.text, minHeight: "100vh", paddingBottom: 96, fontSize: 16, lineHeight: 1.4, WebkitFontSmoothing: "antialiased" },
  header: { background: "linear-gradient(180deg, #1F7A54 0%, #1A6847 100%)", color: "#fff", padding: "calc(20px + env(safe-area-inset-top)) 16px 16px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 0 rgba(0,0,0,0.06)" },
  headerTitle: { fontSize: 26, fontWeight: 700, letterSpacing: -0.5, margin: 0, fontFamily },
  headerSub: { fontSize: 13, opacity: 0.85, marginTop: 2, fontFamily },
  section: { padding: "0 16px", marginTop: 18 },
  card: { background: colors.card, borderRadius: 14, padding: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" },
  input: { width: "100%", padding: "11px 12px", border: "none", borderRadius: 10, fontSize: 16, boxSizing: "border-box", background: colors.bg, outline: "none", fontFamily, lineHeight: 1.4 },
  textarea: { width: "100%", padding: "11px 12px", border: "none", borderRadius: 10, fontSize: 16, boxSizing: "border-box", background: colors.bg, resize: "vertical", minHeight: 54, outline: "none", fontFamily, lineHeight: 1.4 },
  label: { fontSize: 13, fontWeight: 600, color: colors.textMid, display: "block", marginBottom: 6, fontFamily, letterSpacing: 0.1 },
  // iOS segmented control
  segWrap: { display: "flex", gap: 2, background: colors.segBg, borderRadius: 9, padding: 2, marginTop: 10 },
  segBtn: (active) => ({ flex: 1, padding: "8px 8px", border: "none", borderRadius: 7, background: active ? "#fff" : "transparent", color: active ? colors.primary : colors.text, fontWeight: 600, fontSize: 14, cursor: "pointer", textAlign: "center", transition: "background 0.15s", fontFamily, boxShadow: active ? "0 1px 3px rgba(0,0,0,0.12), 0 1px 1px rgba(0,0,0,0.04)" : "none" }),
  catHeader: (open) => ({ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#fff", borderRadius: open ? "14px 14px 0 0" : 14, cursor: "pointer", userSelect: "none", marginTop: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }),
  catTitle: { fontWeight: 600, fontSize: 17, fontFamily, letterSpacing: -0.2 },
  catBadge: (n) => ({ fontSize: 12, fontWeight: 600, background: n > 0 ? colors.primary : colors.segBg, color: n > 0 ? "#fff" : colors.textMid, borderRadius: 20, padding: "2px 9px", minWidth: 20, textAlign: "center", fontFamily }),
  catBody: { background: "#fff", borderRadius: "0 0 14px 14px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)", padding: "2px 0 0", overflow: "hidden" },
  groupLine: (accent, bg) => ({ fontSize: 12, fontWeight: 700, color: accent, padding: "9px 16px 9px 12px", letterSpacing: 0.3, fontFamily, textTransform: "none", background: bg, borderLeft: `3px solid ${accent}` }),
  productRow: (bg) => ({ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 16px", gap: 8, borderBottom: `0.5px solid ${colors.border}`, background: bg || "#fff" }),
  productName: { fontSize: 15, fontWeight: 500, flex: 1, lineHeight: 1.3, fontFamily, letterSpacing: -0.1 },
  sizeGroup: { display: "flex", gap: 8, alignItems: "flex-start", flexShrink: 0 },
  sizeBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  sizeLabel: (isPallet) => ({ fontSize: 11, color: isPallet ? colors.accent : colors.textMid, fontWeight: 600, fontFamily }),
  qtyControl: { display: "flex", alignItems: "center", gap: 0, borderRadius: 10, overflow: "hidden", border: `1px solid ${colors.border}`, background: "#fff" },
  qtyBtn: { width: 40, height: 38, border: "none", background: "transparent", color: colors.primary, fontSize: 22, fontWeight: 400, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily, WebkitTapHighlightColor: "transparent" },
  qtyBtnSm: { width: 34, height: 36, border: "none", background: "transparent", color: colors.primary, fontSize: 20, fontWeight: 400, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily, WebkitTapHighlightColor: "transparent" },
  qtyVal: (v) => ({ minWidth: 34, textAlign: "center", fontSize: 16, fontWeight: 600, color: v > 0 ? colors.primary : colors.textLight, background: v > 0 ? colors.primaryLight : "#fff", height: 38, lineHeight: "38px", borderLeft: `1px solid ${colors.border}`, borderRight: `1px solid ${colors.border}`, fontFamily, padding: "0 4px" }),
  qtyValSm: (v) => ({ minWidth: 28, textAlign: "center", fontSize: 15, fontWeight: 600, color: v > 0 ? colors.primary : colors.textLight, background: v > 0 ? colors.primaryLight : "#fff", height: 36, lineHeight: "36px", borderLeft: `1px solid ${colors.border}`, borderRight: `1px solid ${colors.border}`, fontFamily, padding: "0 3px" }),
  stepperWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3 },
  stepperPrice: { fontSize: 11, color: colors.text, fontWeight: 600, fontFamily },
  stepperSub: { fontSize: 9.5, color: colors.textMid, fontWeight: 500, fontFamily, marginTop: -2 },
  // Stacked layout: product name on its own line, size counters wrap below within the frame
  stackedRow: { padding: "9px 16px", borderBottom: `0.5px solid ${colors.border}` },
  stackedSizes: { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6, justifyContent: "flex-start" },
  bottomBar: { position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.94)", backdropFilter: "saturate(180%) blur(20px)", WebkitBackdropFilter: "saturate(180%) blur(20px)", borderTop: `0.5px solid ${colors.border}`, padding: "10px 16px calc(10px + env(safe-area-inset-bottom))", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 200 },
  reviewBtn: { background: colors.primary, color: "#fff", border: "none", borderRadius: 12, padding: "13px 20px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily, letterSpacing: -0.2, WebkitTapHighlightColor: "transparent" },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" },
  modalContent: { background: "#fff", borderRadius: "16px 16px 0 0", width: "100%", maxWidth: 500, maxHeight: "92vh", overflow: "auto", padding: "10px 16px calc(30px + env(safe-area-inset-bottom))", fontFamily },
  grabber: { width: 36, height: 5, borderRadius: 3, background: "#D1D1D6", margin: "0 auto 10px" },
  modalTitle: { fontSize: 22, fontWeight: 700, marginBottom: 14, fontFamily, letterSpacing: -0.4 },
  orderTable: { width: "100%", fontSize: 12, borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "6px 4px", borderBottom: `1.5px solid ${colors.text}`, fontWeight: 600, fontSize: 11 },
  td: { padding: "5px 4px", borderBottom: `0.5px solid ${colors.border}`, fontSize: 12, verticalAlign: "top" },
  copyBtn: { width: "100%", padding: "14px", background: colors.primary, color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", marginTop: 16, fontFamily },
  copied: { width: "100%", padding: "14px", background: colors.accent, color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", marginTop: 16, fontFamily },
  treatName: { fontSize: 15, fontWeight: 500, marginBottom: 2, letterSpacing: -0.1 },
  dealBadge: { fontSize: 10, fontWeight: 800, color: "#fff", background: colors.primary, borderRadius: 6, padding: "2px 7px", letterSpacing: 0.2, whiteSpace: "nowrap" },
  catFooterCollapse: { textAlign: "center", padding: "12px", color: colors.primary, fontSize: 14, fontWeight: 500, cursor: "pointer", background: "#fff", borderTop: `0.5px solid ${colors.border}`, borderRadius: "0 0 14px 14px", fontFamily },
};


// ── COMPONENTS ──
// Memoised stepper: re-renders only when its own quantity changes, not on every
// keystroke elsewhere. onSet must be stable (the app's setQty is useCallback []).
const Stepper = memo(function Stepper({ sku, qtyValue, price, desc, weight, step = 1, onSet, priceLabel, subLabel, compact }) {
  const btn = compact ? s.qtyBtnSm : s.qtyBtn;
  const val = compact ? s.qtyValSm(qtyValue) : s.qtyVal(qtyValue);
  return (
    <div style={s.stepperWrap}>
      <div style={s.qtyControl}>
        <button style={btn} onClick={() => onSet(sku, Math.max(0, qtyValue - step), price, desc, weight)}>−</button>
        <div style={val}>{qtyValue}</div>
        <button style={btn} onClick={() => onSet(sku, qtyValue + step, price, desc, weight)}>+</button>
      </div>
      {priceLabel ? <span style={s.stepperPrice}>{priceLabel}</span> : null}
      {subLabel ? <span style={s.stepperSub}>{subLabel}</span> : null}
    </div>
  );
});

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
              <Stepper sku={key} qtyValue={quantities[key] || 0} price={res.price} desc={name + " " + sizeLabel} weight={weightOf(sizeLabel)} onSet={setQty} priceLabel={res.price > 0 ? `£${res.price.toFixed(2)}` : "TBC"} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CPProduct({ row, vat, quantities, setQty }) {
  const name = row[0];
  const sizes = [
    { label: "2kg", skuBase: row[2], price: row[5] },
    { label: "5kg", skuBase: row[3], price: row[6] },
    { label: "12kg", skuBase: row[4], price: row[7] },
  ];

  return (
    <div style={s.stackedRow}>
      <div style={s.productName}>{name}</div>
      <div style={s.stackedSizes}>
        {sizes.map(({ label, skuBase, price }) => {
          const sku = vat === "vat" ? skuBase + "V" : skuBase;
          return (
            <div key={label} style={s.sizeBox}>
              <span style={s.sizeLabel(false)}>{label}</span>
              <Stepper compact sku={sku} qtyValue={quantities[sku] || 0} price={price} desc={"CP " + name + " " + label} weight={weightOf(label)} onSet={setQty} priceLabel={price > 0 ? `£${price.toFixed(2)}` : "TBC"} />
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
          <Stepper sku={sku} qtyValue={quantities[sku] || 0} price={price} desc={name + " " + size} weight={weightOf(size)} onSet={setQty} priceLabel={price > 0 ? `£${price.toFixed(2)}` : "TBC"} />
        </div>
      </div>
    </div>
  );
}

// Shared renderer. Each "cell" is one tappable size/pallet control on a product row.
// cell: { key, label, price, weight, step, desc, isPallet, palletQty }
// For a pallet, step = bags/cases per pallet, and the displayed number IS the bag count
// (65, 130, ...), so total = qty × unit price multiplies correctly.
function ProductRow({ name, protein = null, cells, quantities, setQty, baseTotals }) {
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
            <Stepper
              sku={c.key}
              qtyValue={quantities[c.key] || 0}
              step={c.step || 1}
              price={c.price}
              desc={c.desc}
              weight={c.weight}
              onSet={setQty}
              priceLabel={unitLabel(c.key, c.price, { baseTotals, atLeast: c.isPallet ? c.palletQty : 1 })}
              subLabel={c.subLabel}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function GLProduct({ name, sku, price, quantities, setQty, baseTotals }) {
  if (!sku) return null;
  const cells = [
    { key: sku, label: "15kg", price, weight: 15, step: 1, desc: `${name} 15kg` },
    { key: sku + "-PLT", label: "Pallet", price, weight: 15, step: 65, palletQty: 65, isPallet: true, desc: `${name} 15kg (Pallet)` },
  ];
  return <ProductRow name={name} cells={cells} quantities={quantities} setQty={setQty} baseTotals={baseTotals} />;
}

function WDProduct({ row, vat, quantities, setQty, baseTotals }) {
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
    return <ProductRow name={row.name} cells={cells} quantities={quantities} setQty={setQty} baseTotals={baseTotals} />;
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
  return <ProductRow name={row.name} cells={cells} quantities={quantities} setQty={setQty} baseTotals={baseTotals} />;
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
            <Stepper sku={sku} qtyValue={quantities[sku] || 0} price={price} desc={name + " " + size} weight={weightOf(size)} onSet={setQty} priceLabel={price > 0 ? `£${price.toFixed(2)}` : "TBC"} />
          </div>
        ))}
      </div>
    </div>
  );
}

function WTProduct({ row, quantities, setQty }) {
  const [name, , sku, price] = row;
  const cells = [
    { key: sku, label: "Non-VAT", price, desc: `${name} 10x395g (Non-VAT)` },
    { key: sku + "V", label: "VAT", price, desc: `${name} 10x395g (VAT)` },
  ];
  return (
    <div style={s.productRow(null)}>
      <div style={s.productName}>{name}</div>
      <div style={s.sizeGroup}>
        {cells.map(c => (
          <div key={c.key} style={s.sizeBox}>
            <span style={s.sizeLabel(false)}>{c.label}</span>
            <Stepper sku={c.key} qtyValue={quantities[c.key] || 0} price={c.price} desc={c.desc} weight={3.95} onSet={setQty} priceLabel={`£${c.price.toFixed(2)}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TreatGroup({ group, quantities, setQty }) {
  const [name, items] = group;
  return (
    <div style={s.stackedRow}>
      <div style={s.treatName}>{name}</div>
      <div style={s.stackedSizes}>
        {items.map(([sku, size, price]) => (
          <div key={sku} style={s.sizeBox}>
            <span style={s.sizeLabel(false)}>{size || "pack"}</span>
            <Stepper compact sku={sku} qtyValue={quantities[sku] || 0} price={price || 0} desc={name + " " + (size || "pack")} weight={weightOf(size)} onSet={setQty} priceLabel={price > 0 ? money(price) : "TBC"} subLabel={perUnitLabel(size, price)} />
          </div>
        ))}
      </div>
    </div>
  );
}


function DealProduct({ deal, packaging, vat, quantities, setQty }) {
  const realSku = resolveDealSku(deal, packaging, vat);
  if (!realSku) return null;
  const key = realSku + "-DEAL";
  return (
    <div style={s.productRow(null)}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: -0.1 }}>{deal.name}</span>
          <span style={s.dealBadge}>{deal.pct}% OFF</span>
        </div>
        <div style={{ fontSize: 12, color: colors.textMid, marginTop: 3 }}>
          {deal.size} · <span style={{ textDecoration: "line-through" }}>£{deal.was.toFixed(2)}</span>{" "}
          <span style={{ color: colors.primary, fontWeight: 700 }}>£{deal.now.toFixed(2)}</span>
        </div>
      </div>
      <Stepper
        sku={key}
        qtyValue={quantities[key] || 0}
        price={deal.now}
        desc={`${deal.name} ${deal.size} (${deal.pct}% deal)`}
        weight={weightOf(deal.size)}
        onSet={setQty}
        priceLabel={`£${deal.now.toFixed(2)}`}
      />
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

// ── ADMIN EDITOR ──
// Schema-driven: each category lists its editable fields with get/set accessors, so one
// generic table component edits every data shape (positional arrays, objects, nested treats).
const A = (i, l, t = "text", w = 110) => ({ l, t, w, get: r => r[i], set: (r, v) => { const n = [...r]; n[i] = v; return n; } });
const O = (k, l, t = "text", w = 110) => ({ l, t, w, get: r => r[k], set: (r, v) => ({ ...r, [k]: v }) });
const TS = (n, part, l, t = "text", w = 90) => ({ l, t, w,
  get: r => (r[1][n] ? r[1][n][part] : (part === 2 ? 0 : "")),
  set: (r, v) => { const sizes = r[1].map(x => [...x]); while (sizes.length <= n) sizes.push(["", "", 0]); sizes[n][part] = v; return [r[0], sizes]; },
});
const PROTEINS = ["chicken","beef","salmon","duck","turkey","lamb","pork","mixed","rabbit","insect"];
const ADMIN_SCHEMA = [
  { key:"deals", label:"Deals", dataKey:"DEALS", blank:() => ({ name:"", size:"12kg", was:0, now:0, pct:0, kind:"matrix", coloured:"", paper:"", base:"", sku:"" }),
    fields:[ O("name","Name","text",220), O("size","Size","text",70), O("was","Was £","num",80), O("now","Now £","num",80), O("pct","% off","num",60),
      { ...O("kind","Kind","select",90), opts:["matrix","cp","gl"] }, O("coloured","Coloured SKU","text",110), O("paper","Paper SKU","text",110), O("base","CP base SKU","text",100), O("sku","GL SKU","text",90) ] },
  { key:"gf", label:"Grain Free", dataKey:"GF", blank:() => ["","chicken","","","","","","","","",0,0],
    fields:[ A(0,"Name","text",230), { ...A(1,"Protein","select",90), opts:PROTEINS }, A(10,"2kg £","num",75), A(11,"12kg £","num",75),
      A(2,"Col 2kg","text",85), A(3,"Paper 2kg","text",85), A(4,"Col 2kg V","text",85), A(5,"Paper 2kg V","text",85),
      A(6,"Col 12kg","text",85), A(7,"Paper 12kg","text",85), A(8,"Col 12kg V","text",85), A(9,"Paper 12kg V","text",85) ] },
  { key:"wgf", label:"Gluten Free", dataKey:"WGF", blank:() => ["","chicken","","","","","","","","",0,0],
    fields:[ A(0,"Name","text",230), { ...A(1,"Protein","select",90), opts:PROTEINS }, A(10,"Small £","num",75), A(11,"12kg £","num",75),
      A(2,"Col small","text",85), A(3,"Paper small","text",85), A(4,"Col small V","text",85), A(5,"Paper small V","text",85),
      A(6,"Col 12kg","text",85), A(7,"Paper 12kg","text",85), A(8,"Col 12kg V","text",85), A(9,"Paper 12kg V","text",85) ] },
  { key:"wd", label:"Working Dog", dataKey:"WD", blank:() => ({ name:"", wd:"", vat:"", price:0, size:"15kg", pallet:65 }),
    fields:[ O("name","Name","text",220), O("wd","WD SKU","text",90), O("vat","VAT SKU","text",90), O("price","Price £","num",80), O("size","Size","text",70), O("pallet","Bags/pallet","num",80), O("caseWeight","Case kg","num",70),
      O("priceBig","Pero big £","num",80), O("sizeBig","Pero big size","text",80) ] },
  { key:"gl", label:"Goldline", dataKey:"GL", blank:() => ["","",0,"pallet"], fields:[ A(0,"Name","text",260), A(1,"SKU","text",100), A(2,"15kg £","num",80) ] },
  { key:"cp", label:"Cold Pressed", dataKey:"CP", blank:() => ["","mixed","","","",0,0,0],
    fields:[ A(0,"Name","text",230), { ...A(1,"Protein","select",90), opts:PROTEINS }, A(2,"2kg SKU","text",85), A(5,"2kg £","num",75), A(3,"5kg SKU","text",85), A(6,"5kg £","num",75), A(4,"12kg SKU","text",85), A(7,"12kg £","num",75) ] },
  { key:"wt", label:"Wet Trays", dataKey:"WT", blank:() => ["","chicken","",0],
    fields:[ A(0,"Name","text",260), { ...A(1,"Protein","select",90), opts:["chicken","salmon","duck","turkey","lamb"] }, A(2,"SKU","text",100), A(3,"Case £","num",80) ] },
  { key:"spwt", label:"Super Premium Wet", dataKey:"SPWT", blank:() => ["","",0], fields:[ A(0,"Name","text",260), A(1,"SKU","text",100), A(2,"Case £","num",80) ] },
  { key:"treats", label:"Treats", dataKey:"TREATS", blank:() => ["",[["","",0]]],
    fields:[ A(0,"Name","text",220), TS(0,0,"Size 1 SKU"), TS(0,1,"Size 1","text",70), TS(0,2,"£","num",70), TS(1,0,"Size 2 SKU"), TS(1,1,"Size 2","text",70), TS(1,2,"£","num",70), TS(2,0,"Size 3 SKU"), TS(2,1,"Size 3","text",70), TS(2,2,"£","num",70) ] },
  { key:"pero", label:"Pero / Truline", dataKey:"PERO", blank:() => ["","","",0,0,"2kg","12kg","vat"],
    fields:[ A(0,"Name","text",230), A(1,"Small SKU","text",120), A(3,"Small £","num",75), A(5,"Small size","text",70), A(2,"Big SKU","text",120), A(4,"Big £","num",75), A(6,"Big size","text",70), { ...A(7,"VAT type","select",80), opts:["vat","both","wd"] } ] },
  { key:"mt", label:"Meal Toppers", dataKey:"MT", blank:() => ["","","7x160g",0], fields:[ A(0,"Name","text",240), A(1,"SKU","text",110), A(2,"Size","text",80), A(3,"£","num",80) ] },
  { key:"cat", label:"Cat", dataKey:"CAT_DRY", blank:() => ["","","2kg",0,"","10kg",0],
    fields:[ A(0,"Name","text",200), A(1,"Small SKU","text",90), A(2,"Small size","text",70), A(3,"Small £","num",75), A(4,"Big SKU","text",90), A(5,"Big size","text",70), A(6,"Big £","num",75) ],
    extra:{ dataKey:"CAT_CAN", label:"Cat cans", fields:[ O("name","Name","text",220), O("sku","SKU","text",90), O("price","Case £","num",80), O("pallet","Cases/pallet","num",90), O("caseWeight","Case kg","num",70) ] } },
];

// Drop fully-empty treat size slots created while editing.
function normalizeData(d) {
  return { ...d, TREATS: d.TREATS.map(([n, sizes]) => [n, sizes.filter(s => s[0] || s[1] || (s[2] && s[2] > 0))]) };
}

const ad = {
  overlay: { position: "fixed", inset: 0, background: "#F3F4F1", zIndex: 500, overflow: "auto", fontFamily, color: colors.text },
  top: { position: "sticky", top: 0, zIndex: 2, background: "#fff", borderBottom: `1px solid ${colors.border}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 },
  btn: (kind) => ({ padding: "8px 14px", borderRadius: 9, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily,
    background: kind === "primary" ? colors.primary : kind === "danger" ? colors.dangerLight : colors.segBg,
    color: kind === "primary" ? "#fff" : kind === "danger" ? colors.danger : colors.text }),
  body: { display: "flex", gap: 20, padding: 20, alignItems: "flex-start" },
  nav: { width: 200, flexShrink: 0, background: "#fff", borderRadius: 12, padding: 6, boxShadow: "0 1px 2px rgba(0,0,0,0.04)", position: "sticky", top: 70 },
  navItem: (active) => ({ padding: "9px 12px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: active ? 600 : 500, background: active ? colors.primaryLight : "transparent", color: active ? colors.primary : colors.text }),
  main: { flex: 1, minWidth: 0 },
  card: { background: "#fff", borderRadius: 12, boxShadow: "0 1px 2px rgba(0,0,0,0.04)", overflow: "auto", marginBottom: 16 },
  table: { borderCollapse: "collapse", fontSize: 13, minWidth: "100%" },
  th: { textAlign: "left", padding: "10px 8px", fontSize: 11, fontWeight: 700, color: colors.textMid, textTransform: "uppercase", letterSpacing: 0.4, borderBottom: `1px solid ${colors.border}`, whiteSpace: "nowrap", background: "#FAFAF8", position: "sticky", top: 0 },
  td: { padding: "4px 6px", borderBottom: `1px solid ${colors.bg}`, verticalAlign: "middle" },
  input: (w) => ({ width: w, padding: "7px 8px", border: `1px solid ${colors.border}`, borderRadius: 7, fontSize: 13, fontFamily, background: "#fff", boxSizing: "border-box" }),
  pill: (ok) => ({ fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: ok ? colors.primaryLight : "#FFF4E5", color: ok ? colors.primary : "#B25E00" }),
};

// Uncontrolled input that commits on blur / Enter — smooth typing, no caret fights.
function Cell({ field, row, onCommit }) {
  const val = field.get(row);
  if (field.t === "select") {
    return (
      <select style={ad.input(field.w)} value={val ?? ""} onChange={e => onCommit(field.set(row, e.target.value))}>
        {field.opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  const commit = (e) => {
    const raw = e.target.value;
    if (field.t === "num") {
      const n = parseFloat(raw);
      const next = isNaN(n) ? 0 : n;
      if (next !== (val ?? 0)) onCommit(field.set(row, next));
    } else if (raw !== (val ?? "")) {
      onCommit(field.set(row, raw));
    }
  };
  return (
    <input
      style={ad.input(field.w)}
      defaultValue={val ?? ""}
      type={field.t === "num" ? "number" : "text"}
      step={field.t === "num" ? "0.01" : undefined}
      onBlur={commit}
      onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
    />
  );
}

function AdminTable({ title, fields, rows, single, onChange, version, onAdd, onRemove }) {
  return (
    <div style={ad.card}>
      <div style={{ padding: "12px 14px 4px", fontWeight: 700, fontSize: 15 }}>{title} <span style={{ color: colors.textMid, fontWeight: 500, fontSize: 12 }}>· {rows.length} {single ? "" : "rows"}</span></div>
      <table style={ad.table}>
        <thead><tr>{fields.map((f, i) => <th key={i} style={ad.th}>{f.l}</th>)}{!single && <th style={ad.th}></th>}</tr></thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={`${version}-${ri}`}>
              {fields.map((f, fi) => <td key={fi} style={ad.td}><Cell field={f} row={row} onCommit={next => onChange(ri, next)} /></td>)}
              {!single && <td style={ad.td}><button onClick={() => onRemove(ri)} title="Remove" style={{ ...ad.btn("danger"), padding: "5px 9px" }}>✕</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
      {!single && <div style={{ padding: 12 }}><button onClick={onAdd} style={ad.btn("primary")}>+ Add row</button></div>}
    </div>
  );
}

function AdminPanel({ data, commit, published, hasLocalEdits, onClose, adminCat, setAdminCat, discardLocal }) {
  const [version, setVersion] = useState(0);
  const schema = ADMIN_SCHEMA.find(s => s.key === adminCat);
  const rows = data[schema.dataKey];

  const setList = (key, list) => commit({ ...data, [key]: list });
  const onChange = (i, next) => setList(schema.dataKey, rows.map((r, ri) => (ri === i ? next : r)));
  const onAdd = () => { setList(schema.dataKey, [...rows, schema.blank()]); setVersion(v => v + 1); };
  const onRemove = (i) => { if (window.confirm("Remove this row?")) { setList(schema.dataKey, rows.filter((_, ri) => ri !== i)); setVersion(v => v + 1); } };

  const exportJson = () => {
    const out = {};
    DATA_KEYS.forEach(k => { out[k] = data[k]; });
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "products.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  return (
    <div style={ad.overlay}>
      <div style={ad.top}>
        <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: -0.3 }}>Pero Admin</div>
        <span style={ad.pill(!hasLocalEdits)}>{hasLocalEdits ? "Unpublished local edits" : (published ? "In sync with published" : "Using built-in defaults")}</span>
        <div style={{ flex: 1 }} />
        <button onClick={exportJson} style={ad.btn("primary")}>Export products.json</button>
        {hasLocalEdits && <button onClick={() => { if (window.confirm("Discard all local edits and reload the published data?")) { discardLocal(); setVersion(v => v + 1); } }} style={ad.btn("danger")}>Discard local edits</button>}
        <button onClick={onClose} style={ad.btn()}>Close</button>
      </div>

      <div style={{ padding: "12px 20px 0", fontSize: 13, color: colors.textMid, maxWidth: 900 }}>
        Edits save automatically on this device. To push them to the reps: <b>Export products.json</b>, upload it to the <code>public/</code> folder in GitHub and commit — the app loads it on next refresh.
      </div>

      <div style={ad.body}>
        <div style={ad.nav}>
          {ADMIN_SCHEMA.map(s => <div key={s.key} style={ad.navItem(s.key === adminCat)} onClick={() => { setAdminCat(s.key); setVersion(v => v + 1); }}>{s.label}</div>)}
        </div>
        <div style={ad.main}>
          {schema.key === "deals" && (
            <AdminTable title="Deals banner" single fields={[O("title","Title","text",240), O("dates","Dates","text",200)]} rows={[data.DEALS_INFO]} version={version}
              onChange={(_, next) => commit({ ...data, DEALS_INFO: next })} />
          )}
          <AdminTable title={schema.label} fields={schema.fields} rows={rows} version={version} onChange={onChange} onAdd={onAdd} onRemove={onRemove} />
          {schema.extra && (
            <AdminTable title={schema.extra.label} single fields={schema.extra.fields} rows={[data[schema.extra.dataKey]]} version={version}
              onChange={(_, next) => commit({ ...data, [schema.extra.dataKey]: next })} />
          )}
        </div>
      </div>
    </div>
  );
}

function AdminGate({ onOk, onCancel }) {
  const [pin, setPin] = useState("");
  const [bad, setBad] = useState(false);
  const submit = () => { if (pin === ADMIN_PIN) onOk(); else setBad(true); };
  return (
    <div style={{ ...ad.overlay, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 14, padding: 24, width: 320, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Admin access</div>
        <div style={{ fontSize: 13, color: colors.textMid, marginBottom: 14 }}>Enter the admin PIN to edit products and pricing.</div>
        <input autoFocus type="password" inputMode="numeric" value={pin} onChange={e => { setPin(e.target.value); setBad(false); }} onKeyDown={e => e.key === "Enter" && submit()} placeholder="PIN" style={{ ...ad.input("100%"), fontSize: 16, padding: 10 }} />
        {bad && <div style={{ color: colors.danger, fontSize: 12, marginTop: 6 }}>Incorrect PIN</div>}
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={onCancel} style={{ ...ad.btn(), flex: 1 }}>Cancel</button>
          <button onClick={submit} style={{ ...ad.btn("primary"), flex: 1 }}>Open</button>
        </div>
      </div>
    </div>
  );
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

  // Product data: defaults → published /products.json → local admin edits.
  const [data, setData] = useState(() => mergeData(DEFAULT_DATA, loadLocalData()));
  const [published, setPublished] = useState(null);      // what /products.json currently holds
  const [hasLocalEdits, setHasLocalEdits] = useState(() => !!loadLocalData());
  useEffect(() => {
    let alive = true;
    fetch("/products.json", { cache: "no-store" })
      .then(r => (r.ok ? r.json() : null))
      .then(json => {
        if (!alive || !json) return;
        setPublished(json);
        // Local admin edits win on this device; otherwise show the published set.
        if (!loadLocalData()) setData(mergeData(DEFAULT_DATA, json));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  // Admin editor
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminCat, setAdminCat] = useState("deals");
  const { GF, WGF, CP, WD, GL, WT, SPWT, PERO, MT, CAT_DRY, CAT_CAN, TREATS, DEALS, DEALS_INFO } = data;
  const skuCategory = useMemo(() => buildSkuCategory(data), [data]);

  const commitData = useCallback((next) => {
    const clean = normalizeData(next);
    setData(clean);
    setHasLocalEdits(true);
    try { window.localStorage.setItem(LS_KEY, JSON.stringify(clean)); } catch {}
  }, []);
  const discardLocal = useCallback(() => {
    try { window.localStorage.removeItem(LS_KEY); } catch {}
    setData(mergeData(DEFAULT_DATA, published));
    setHasLocalEdits(false);
  }, [published]);

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

  // Total quantity per base SKU (individual bags + pallet bags combined) for price breaks
  const baseTotals = useMemo(() => {
    const t = {};
    Object.values(orderItems).forEach(i => {
      if (i.qty > 0) {
        const b = baseSkuOf(i.sku);
        t[b] = (t[b] || 0) + i.qty;
      }
    });
    return t;
  }, [orderItems]);

  const orderList = useMemo(() => Object.values(orderItems).filter(i => i.qty > 0).map(i => {
    const b = baseSkuOf(i.sku);
    const tp = tierPrice(b, baseTotals[b] || i.qty);
    return tp != null ? { ...i, price: tp } : i;
  }), [orderItems, baseTotals]);
  
  const totalNet = useMemo(() => orderList.reduce((sum, i) => sum + (i.price * i.qty), 0), [orderList]);
  const totalWeight = useMemo(() => orderList.reduce((sum, i) => sum + (i.weight * i.qty), 0), [orderList]);
  const totalItems = useMemo(() => orderList.reduce((sum, i) => sum + i.qty, 0), [orderList]);
  const carriage = useMemo(() => carriageCalc(totalWeight, totalNet), [totalWeight, totalNet]);

  // Count items per category
  const catCounts = useMemo(() => {
    const c = {};
    c.deals = orderList.filter(i => i.sku.endsWith("-DEAL")).reduce((s,i) => s + i.qty, 0);
    const base = orderList.filter(i => !i.sku.endsWith("-DEAL"));
    const gfSkus = GF.flatMap(r => [r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9]]).filter(Boolean);
    const wgfSkus = WGF.flatMap(r => [r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9]]).filter(Boolean);
    c.gf = base.filter(i => gfSkus.includes(i.sku.split('-')[0])).reduce((s,i) => s + i.qty, 0);
    c.wgf = base.filter(i => wgfSkus.includes(i.sku.split('-')[0])).reduce((s,i) => s + i.qty, 0);
    c.cp = base.filter(i => i.sku.startsWith("CP")).reduce((s,i) => s + i.qty, 0);
    const wdSKUs = ["SR0351","SR0399","SR0397","SR0353","SR0398","SR0352","SR0118","SR0109","SR0450","SR0451","C0004","P0015","P0014","P0020","P0021"];
    c.wd = base.filter(i => wdSKUs.some(p => i.sku.startsWith(p) || i.sku === p)).reduce((s,i) => s + i.qty, 0);
    c.gl = base.filter(i => i.sku.startsWith("GD")).reduce((s,i) => s + i.qty, 0);
    c.wt = base.filter(i => WT.some(r => i.sku === r[2] || i.sku === r[2] + "V")).reduce((s,i) => s + i.qty, 0);
    c.spwt = base.filter(i => ["SR0489","SR0490","SR0491","SR0492","SR0493"].some(p => i.sku.startsWith(p))).reduce((s,i) => s + i.qty, 0);
    c.treats = base.filter(i => i.sku.startsWith("TRT")).reduce((s,i) => s + i.qty, 0);
    c.mt = base.filter(i => i.sku.includes("X7")).reduce((s,i) => s + i.qty, 0);
    c.pero = base.filter(i => /^P00(38|39|40|37|18|19|71|72|73|74|75|76|77|78|79|80|81|82)/.test(i.sku) || i.sku.startsWith("TRU")).reduce((s,i) => s + i.qty, 0);
    c.cat = base.filter(i => ["SR0215","SR0164","C0005"].some(p => i.sku.startsWith(p))).reduce((s,i) => s + i.qty, 0);
    return c;
  }, [orderList, GF, WGF, WT]);

  const gfGroups = useMemo(() => groupByProtein(GF), [GF]);
  const wgfGroups = useMemo(() => groupByProtein(WGF), [WGF]);
  const cpGroups = useMemo(() => ([
    { key: "8020", label: "80/20 Recipes", accent: "#1a6847", bg: "#e8f5ee",
      items: CP.filter(r => r[0].startsWith("80/20")) },
    { key: "grain", label: "With Grain", accent: "#b5732e", bg: "#fbf3e8",
      items: CP.filter(r => /with Grain/i.test(r[0])) },
    { key: "other", label: "Other Recipes", accent: "#5a6b73", bg: "#eef1f2",
      items: CP.filter(r => !r[0].startsWith("80/20") && !/with Grain/i.test(r[0])) },
  ]), [CP]);
  const wtGroups = useMemo(() => groupWTByProtein(WT), [WT]);

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
      const displaySku = stripKey(i.sku);
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

  const buildMailtoLink = useCallback(() => {
    const subject = `Pero Trade Order${customerName ? ` - ${customerName}` : ""}`;
    const rule = "----------------------------------------";
    const L = [];
    L.push("PERO TRADE ORDER");
    L.push(rule);
    L.push(`Customer:   ${customerName || "(not set)"}`);
    L.push(`Packaging:  ${packaging === "coloured" ? "Coloured Bags" : "Paper Bags"}`);
    L.push(`VAT status: ${vat === "vat" ? "VAT Registered" : "Working Dog (Zero Rated)"}`);
    if (notes) L.push(`Notes:      ${notes}`);
    L.push("");
    L.push("ORDER");
    L.push(rule);
    // Group the order lines by category, in a fixed order, with a gap between each.
    const groups = {};
    orderList.forEach(i => {
      const cat = categoryOf(skuCategory, i.sku);
      (groups[cat] = groups[cat] || []).push(i);
    });
    CATEGORY_ORDER.filter(cat => groups[cat]).forEach((cat, gi) => {
      if (gi > 0) L.push("");
      L.push(`[ ${cat.toUpperCase()} ]`);
      groups[cat].forEach(i => {
        const sku = stripKey(i.sku);
        const total = i.price > 0 ? ` = £${(i.price * i.qty).toFixed(2)}` : " = price TBC";
        L.push(`${i.qty} x ${sku} ${i.desc}${total}`);
      });
    });
    L.push(rule);
    if (carriage.sku) {
      const cCost = (carriage.cost * (carriage.qty || 1));
      L.push(carriage.sku === "FREE"
        ? "Carriage:  FREE (order over £1,750 net)"
        : `Carriage:  ${carriage.desc} - £${cCost.toFixed(2)} +VAT`);
    }
    L.push("");
    L.push(`GOODS NET:  £${totalNet.toFixed(2)}`);
    L.push(`WEIGHT:     ${totalWeight.toFixed(1)} kg`);
    L.push(`ITEMS:      ${totalItems}`);

    const recipients = "info@pero-petfood.co.uk,dafydd@pero-petfood.co.uk";
    return `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(L.join("\n"))}`;
  }, [customerName, packaging, vat, notes, orderList, carriage, totalNet, totalWeight, totalItems, skuCategory]);

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
    const confirmed = window.confirm("Clear the whole form? This resets the order, customer name, notes, packaging and VAT status.");
    if (confirmed) {
      setOrderItems({});
      setCustomerName("");
      setNotes("");
      setPackaging("coloured");
      setVat("wd");
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
        <div style={s.card}>
          <label style={s.label}>Customer Name</label>
          <input style={s.input} placeholder="Enter customer name..." value={customerName} onChange={e => setCustomerName(e.target.value)} />
          
          <label style={{ ...s.label, marginTop: 14 }}>Notes</label>
          <textarea style={s.textarea} placeholder="Brief notes for this order..." value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
          
          <label style={{ ...s.label, marginTop: 14 }}>Packaging</label>
          <div style={s.segWrap}>
            <button style={s.segBtn(packaging === "coloured")} onClick={() => setPackaging("coloured")}>Coloured Bags</button>
            <button style={s.segBtn(packaging === "paper")} onClick={() => setPackaging("paper")}>Paper Bags</button>
          </div>
          
          <label style={{ ...s.label, marginTop: 14 }}>VAT Status</label>
          <div style={s.segWrap}>
            <button style={s.segBtn(vat === "wd")} onClick={() => setVat("wd")}>WD (Zero Rated)</button>
            <button style={s.segBtn(vat === "vat")} onClick={() => setVat("vat")}>VAT (Standard)</button>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={s.section}>

        {/* DEALS */}
        <CategorySection title="🏷 Deals" count={catCounts.deals} open={openCats.deals} onToggle={() => toggleCat("deals")}>
          <div style={{ padding: "8px 16px 4px", fontSize: 12, color: colors.textMid }}>{DEALS_INFO.title} · {DEALS_INFO.dates}</div>
          {DEALS.map((deal, i) => (
            <DealProduct key={i} deal={deal} packaging={packaging} vat={vat} quantities={quantities} setQty={setQty} />
          ))}
        </CategorySection>

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
            <WDProduct key={i} row={row} vat={vat} quantities={quantities} setQty={setQty} baseTotals={baseTotals} />
          ))}
        </CategorySection>

        {/* GOLDLINE */}
        <CategorySection title="Goldline" count={catCounts.gl} open={openCats.gl} onToggle={() => toggleCat("gl")}>
          {GL.map((row, i) => (
            <GLProduct key={i} name={row[0]} sku={row[1]} price={row[2]} quantities={quantities} setQty={setQty} baseTotals={baseTotals} />
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
                <WTProduct key={i} row={row} quantities={quantities} setQty={setQty} />
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

        {/* TREATS (combined — retail, bulk bag, bulk box side by side) */}
        <CategorySection title="Treats" count={catCounts.treats} open={openCats.treats} onToggle={() => toggleCat("treats")}>
          {TREATS.map((group, i) => (
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
            <SimpleProduct key={i} name={row[0]} sku={row[1]} price={row[3]} size={row[2]} quantities={quantities} setQty={setQty} />
          ))}
        </CategorySection>

        {/* CAT */}
        <CategorySection title="Cat" count={catCounts.cat} open={openCats.cat} onToggle={() => toggleCat("cat")}>
          {CAT_DRY.map((row, i) => (
            <ProductRow
              key={i}
              name={row[0]}
              cells={[
                { key: row[1], label: row[2], price: row[3], weight: weightOf(row[2]), step: 1, desc: `${row[0]} ${row[2]}` },
                { key: row[4], label: row[5], price: row[6], weight: weightOf(row[5]), step: 1, desc: `${row[0]} ${row[5]}` },
              ]}
              quantities={quantities}
              setQty={setQty}
              baseTotals={baseTotals}
            />
          ))}
          <ProductRow
            name={CAT_CAN.name}
            cells={[
              { key: CAT_CAN.sku, label: "case", price: CAT_CAN.price, weight: CAT_CAN.caseWeight, step: 1, desc: `${CAT_CAN.name} case` },
              { key: CAT_CAN.sku + "-PLT", label: "Pallet", price: CAT_CAN.price, weight: CAT_CAN.caseWeight, step: CAT_CAN.pallet, palletQty: CAT_CAN.pallet, isPallet: true, desc: `${CAT_CAN.name} (Pallet, cases)` },
            ]}
            quantities={quantities}
            setQty={setQty}
            baseTotals={baseTotals}
          />
        </CategorySection>

        {/* COLLAPSE/EXPAND ALL */}
        <div style={{ display: "flex", gap: 8, padding: "16px 12px" }}>
          <button onClick={() => {
            const allCats = ['deals', 'gf', 'wgf', 'wd', 'gl', 'cp', 'wt', 'spwt', 'treats', 'pero', 'mt', 'cat'];
            setOpenCats(allCats.reduce((acc, cat) => ({ ...acc, [cat]: true }), {}));
          }} style={{ flex: 1, ...s.reviewBtn }}>
            Expand All
          </button>
          <button onClick={() => setOpenCats({})} style={{ flex: 1, ...s.reviewBtn, background: colors.textMid }}>
            Collapse All
          </button>
        </div>

        <div style={{ textAlign: "center", padding: "4px 0 12px" }}>
          <button onClick={() => setAdminOpen(true)} style={{ background: "none", border: "none", color: colors.textLight, fontSize: 12, cursor: "pointer", fontFamily, padding: 8 }}>
            Admin{hasLocalEdits ? " · unpublished edits" : ""}
          </button>
        </div>

      </div>

      {/* STICKY BOTTOM BAR */}
      <div style={s.bottomBar}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: colors.primary }}>
            £{totalNet.toFixed(2)}
            <span style={{ fontSize: 13, fontWeight: 700, color: colors.text }}> · {totalWeight.toFixed(1)}kg</span>
          </div>
          <div style={{ fontSize: 11, color: freeCarriageGap > 0 ? colors.textMid : colors.primary }}>
            {freeCarriageGap > 0 ? `£${freeCarriageGap.toFixed(0)} to free carriage` : "✓ Free carriage"}
            {totalItems > 0 && ` · ${totalItems} items`}
          </div>
          {carriage.sku && (
            <div style={{ fontSize: 10, color: colors.textLight }}>
              {carriage.sku === "FREE"
                ? carriage.desc
                : `Carriage: ${carriage.desc} — £${(carriage.cost * (carriage.qty || 1)).toFixed(2)}+VAT`}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {totalItems > 0 && (
            <button onClick={clearOrder} style={{ ...s.reviewBtn, background: colors.dangerLight, color: colors.danger, padding: 0, width: 46, borderRadius: 12 }}>✕</button>
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
            <div style={s.grabber} />
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
                      <td style={{ ...s.td, fontFamily: "monospace", fontSize: 11 }}>{stripKey(i.sku)}</td>
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

            <div style={{ marginTop: 16, padding: 14, background: colors.primaryLight, borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
                <span style={{ color: colors.textMid }}>Goods (net)</span>
                <span style={{ fontWeight: 600 }}>£{totalNet.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: colors.textMid }}>Carriage {carriage.sku === "FREE" ? "" : "(est. +VAT)"}</span>
                <span style={{ fontWeight: 600 }}>{carriage.sku === "FREE" ? "FREE" : `£${(carriage.cost * (carriage.qty || 1)).toFixed(2)}`}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: `1px solid ${colors.border}`, paddingTop: 8 }}>
                <div>
                  <div style={{ fontSize: 12, color: colors.textMid }}>Order Total</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: colors.primary, letterSpacing: -0.5 }}>
                    £{(totalNet + (carriage.cost * (carriage.qty || 1))).toFixed(2)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: colors.textMid }}>{totalWeight.toFixed(1)} kg · {totalItems} items</div>
                </div>
              </div>
            </div>

            <a href={buildMailtoLink()} style={{ ...s.copyBtn, textDecoration: "none", display: "block", textAlign: "center", boxSizing: "border-box" }}>
              Email Order
            </a>
            <div style={{ fontSize: 11, color: colors.textMid, textAlign: "center", marginTop: 8 }}>
              Opens your email app with the order ready to send
            </div>
            <button onClick={handleCopy} style={{ width: "100%", padding: "12px", marginTop: 10, background: "transparent", color: copied ? colors.primary : colors.textMid, border: `1px solid ${colors.border}`, borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily }}>
              {copied ? "✓ Copied — paste into an email" : "Copy as formatted table"}
            </button>
          </div>
        </div>
      )}

      {/* ADMIN */}
      {adminOpen && !adminAuthed && (
        <AdminGate onOk={() => setAdminAuthed(true)} onCancel={() => setAdminOpen(false)} />
      )}
      {adminOpen && adminAuthed && (
        <AdminPanel
          data={data}
          commit={commitData}
          published={published}
          hasLocalEdits={hasLocalEdits}
          onClose={() => setAdminOpen(false)}
          adminCat={adminCat}
          setAdminCat={setAdminCat}
          discardLocal={discardLocal}
        />
      )}
    </div>
  );
}
