export type MemberStatus = "Active" | "Expiring" | "Frozen" | "Cancelled" | "Blacklisted";

export const members: {
  id: string;
  name: string;
  plan: string;
  status: MemberStatus;
  ends: string;
  trainer: string;
  tags: string[];
  last: string;
}[] = [
  { id: "RH-0142", name: "Aarav Mehta", plan: "Gold", status: "Active", ends: "14 Dec 2026", trainer: "Rohit", tags: ["MorningBatch", "WeightLoss"], last: "Today" },
  { id: "RH-0143", name: "Priya Nair", plan: "VIP", status: "Active", ends: "02 Mar 2027", trainer: "Sneha", tags: ["Yoga"], last: "Today" },
  { id: "RH-0144", name: "Karan Singh", plan: "Basic", status: "Expiring", ends: "01 Nov 2026", trainer: "Rohit", tags: ["HighRisk"], last: "2 days ago" },
  { id: "RH-0145", name: "Ishita Rao", plan: "Personal Training", status: "Active", ends: "20 Jan 2027", trainer: "Sneha", tags: ["Powerlifting"], last: "Yesterday" },
  { id: "RH-0146", name: "Vikram Joshi", plan: "Gold", status: "Frozen", ends: "30 Nov 2026", trainer: "Amit", tags: ["Travel"], last: "3 weeks ago" },
  { id: "RH-0147", name: "Neha Kulkarni", plan: "Basic", status: "Expiring", ends: "29 Oct 2026", trainer: "Amit", tags: ["EveningBatch"], last: "Today" },
  { id: "RH-0148", name: "Rahul Verma", plan: "Gold", status: "Cancelled", ends: "05 Sep 2026", trainer: "Rohit", tags: [], last: "7 weeks ago" },
  { id: "RH-0149", name: "Sana Sheikh", plan: "VIP", status: "Active", ends: "18 Feb 2027", trainer: "Sneha", tags: ["CrossFit"], last: "Today" },
  { id: "RH-0150", name: "Dev Patel", plan: "Basic", status: "Blacklisted", ends: "—", trainer: "—", tags: ["Dues"], last: "3 months ago" },
  { id: "RH-0151", name: "Meera Iyer", plan: "Gold", status: "Active", ends: "09 Jan 2027", trainer: "Amit", tags: ["WeightLoss"], last: "Yesterday" },
];

export const invoices = [
  { no: "INV-2041", member: "Aarav Mehta", amount: 4500, method: "UPI", status: "Paid", date: "26 Oct" },
  { no: "INV-2040", member: "Priya Nair", amount: 12000, method: "Card", status: "Paid", date: "26 Oct" },
  { no: "INV-2039", member: "Karan Singh", amount: 2500, method: "—", status: "Overdue", date: "22 Oct" },
  { no: "INV-2038", member: "Ishita Rao", amount: 9000, method: "Cash", status: "Partial", date: "21 Oct" },
  { no: "INV-2037", member: "Neha Kulkarni", amount: 2500, method: "—", status: "Pending", date: "20 Oct" },
  { no: "INV-2036", member: "Sana Sheikh", amount: 12000, method: "UPI", status: "Paid", date: "19 Oct" },
];

export const checkinFeed: { name: string; t: string; ok: boolean; why?: string }[] = [
  { name: "Aarav Mehta", t: "6:02 am", ok: true },
  { name: "Sana Sheikh", t: "6:11 am", ok: true },
  { name: "Karan Singh", t: "6:15 am", ok: false, why: "Plan expired 3 days ago" },
  { name: "Priya Nair", t: "6:24 am", ok: true },
  { name: "Neha Kulkarni", t: "6:31 am", ok: true },
  { name: "Vikram Joshi", t: "6:40 am", ok: false, why: "Membership frozen" },
  { name: "Meera Iyer", t: "6:48 am", ok: true },
];

export const heat: number[][] = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 17 }, (_, h) => {
    const hour = h + 6;
    const morning = Math.exp(-Math.pow(hour - 7, 2) / 3);
    const evening = Math.exp(-Math.pow(hour - 18.5, 2) / 4);
    const weekend = d >= 5 ? 0.75 : 1;
    return Math.min(1, (morning * 0.85 + evening) * weekend);
  }),
);

export const exercises = [
  { name: "Barbell back squat", muscle: "Legs", equip: "Rack, barbell" },
  { name: "Bench press", muscle: "Chest", equip: "Bench, barbell" },
  { name: "Deadlift", muscle: "Back", equip: "Barbell" },
  { name: "Overhead press", muscle: "Shoulders", equip: "Barbell" },
  { name: "Pull-up", muscle: "Back", equip: "Bar" },
  { name: "Romanian deadlift", muscle: "Hamstrings", equip: "Barbell" },
  { name: "Cable row", muscle: "Back", equip: "Cable stack" },
  { name: "Plank", muscle: "Core", equip: "None" },
];

export const inventory = [
  { sku: "WP-001", name: "Whey protein 1 kg", cat: "Supplements", stock: 14, low: 5, cost: 1800, price: 2499 },
  { sku: "PW-014", name: "Pre-workout 300 g", cat: "Supplements", stock: 3, low: 5, cost: 900, price: 1399 },
  { sku: "BR-220", name: "Protein bar (box of 12)", cat: "Snacks", stock: 22, low: 6, cost: 600, price: 960 },
  { sku: "SH-007", name: "Shaker bottle", cat: "Accessories", stock: 2, low: 8, cost: 120, price: 299 },
  { sku: "TW-031", name: "Gym towel", cat: "Apparel", stock: 40, low: 10, cost: 90, price: 249 },
  { sku: "EL-009", name: "Electrolyte drink", cat: "Drinks", stock: 31, low: 12, cost: 35, price: 80 },
];

export const staff = [
  { name: "Rohit Sharma", role: "Head trainer", clients: 18, limit: 20, rating: 4.8 },
  { name: "Sneha Pillai", role: "Trainer", clients: 14, limit: 20, rating: 4.9 },
  { name: "Amit Desai", role: "Trainer", clients: 9, limit: 15, rating: 4.6 },
  { name: "Pooja Rane", role: "Front desk", clients: 0, limit: 0, rating: 4.7 },
  { name: "Suresh Kale", role: "Accountant", clients: 0, limit: 0, rating: 0 },
];
