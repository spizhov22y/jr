export const keywords = [
  "jr custom woodwork",
  "Kelowna custom kitchens",
  "custom kitchens kelowna",
  // "West Kelowna custom furniture",
  "custom woodworking kelowna",
  "Custom kitchen cabinets Kelowna",
  "Custom woodwork Kelowna",
  "Kitchen remodeling Kelowna jr",
  "Custom kitchen designs West Kelowna",
  "Kelowna kitchen renovations jr",
  "Bespoke furniture Kelowna",
  "Custom cabinetry West Kelowna",
  // "Kelowna kitchen contractors",
  // "Custom kitchen islands Kelowna",
  // "Custom kitchen countertops Kelowna",
  "Custom kitchen installation Kelowna jr",
  "High-end kitchen Kelowna",
  "modern design kitchen kelowna",
  // "Rustic kitchen furniture Kelowna",
  // "Kitchen makeover Kelowna",
  // "West Kelowna bespoke kitchens",
  // "kitchen renovation kelowna jr",
  "fireplace kelowna",
  // "kitchen cabinets west kelowna",
  // "kelowna custom cabinets",
  // "kelowna bathroom cabinets",
  // "kelowna modern cabinets",
  // "kelowna kitchen cabinets",
  // "kitchen cabinets kelowna",
  "custom bar cabinets",
];

// Function to get a random keyword from the list
export function getRandomKeyword() {
  const randomIndex = Math.floor(Math.random() * keywords.length);
  return keywords[randomIndex];
}
