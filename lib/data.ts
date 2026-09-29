import type { BottleKind } from "@/components/ui/product-visual";

export const user = {
  name: "Suzuki Yodai",
  nameJa: "鈴木 陽大",
  firstNameJa: "陽大",
  memberId: "0001 2345 67",
  tier: "Premium",
  since: "2024",
  avatar: "/images/look-face.webp",
  plan: { name: "プレミアムプラン（年額）", expires: "2027/05/12" },
  stats: { visits: 12, records: 24, points: 3280 },
};

export const weather = {
  city: "東京",
  temp: 22,
  humidity: 78,
  uv: 3,
  condition: "晴れ時々くもり",
};

export const hairScore = {
  score: 89,
  delta: +4,
  damage: { label: "Low", value: 18 },
  dryness: { label: "Medium", value: 52 },
  hairType: "やや乾燥・普通毛",
  lastVisit: "2026.06.12",
  lastMenu: "カラー",
};

export const aiAdvice = {
  headline: "湿度が高いため軽めのオイルがおすすめです",
  body: "今日は湿度78%。重めのバームはうねりの原因に。毛先中心に軽いオイルを1〜2滴、ドライヤーは120℃以下で仕上げましょう。",
};

export type Product = {
  id: string;
  name: string;
  nameEn: string;
  brand: string;
  price: number;
  kind: BottleKind;
  tag?: string;
  match: number;
};

export const products: Product[] = [
  { id: "p1", name: "ライトヘアオイル", nameEn: "Light Hair Oil", brand: "MIRRA LAB", price: 3960, kind: "oil", tag: "今日のおすすめ", match: 98 },
  { id: "p2", name: "リペアトリートメント", nameEn: "Repair Treatment", brand: "MIRRA LAB", price: 4180, kind: "treatment", match: 94 },
  { id: "p3", name: "モイスチャーシャンプー", nameEn: "Moisture Shampoo", brand: "MIRRA LAB", price: 3520, kind: "shampoo", match: 91 },
  { id: "p4", name: "ヘアミルク", nameEn: "Hair Milk", brand: "Aube", price: 2800, kind: "milk", match: 88 },
  { id: "p5", name: "スカルプセラム", nameEn: "Scalp Serum", brand: "Aube", price: 4620, kind: "serum", match: 84 },
];

export const nextReservation = {
  salon: "Luce Hair 渋谷",
  stylist: "山田 美咲",
  date: "2026.10.12",
  weekday: "Mon",
  time: "14:00",
  menu: "カット + ケアカラー",
  duration: "約2時間",
  daysLeft: 13,
  image: "/images/salon-1.webp",
};

export type HistoryEntry = {
  id: string;
  date: string;
  weekday: string;
  menu: string;
  menuEn: string;
  salon: string;
  stylist: string;
  photos: string[];
  recipe: { label: string; value: string }[];
  memo: string;
  tags: string[];
  liked?: boolean;
};

export const history: HistoryEntry[] = [
  {
    id: "h1",
    date: "2026.06.12",
    weekday: "金",
    menu: "カラー",
    menuEn: "Color",
    salon: "Luce Hair 渋谷",
    stylist: "山田",
    photos: ["/images/look-face.webp", "/images/look-profile.webp", "/images/look-flow.webp"],
    recipe: [
      { label: "A剤", value: "20g" },
      { label: "B剤", value: "10g" },
      { label: "オキシ", value: "6%" },
      { label: "放置", value: "25分" },
    ],
    memo: "前回のブリーチ部分に赤みが出やすいため、アッシュを1トーン強めに。次回は根元リタッチ推奨。",
    tags: ["ミルクティーベージュ", "透明感"],
    liked: true,
  },
  {
    id: "h2",
    date: "2026.04.20",
    weekday: "月",
    menu: "ブリーチ",
    menuEn: "Bleach",
    salon: "Luce Hair 渋谷",
    stylist: "山田",
    photos: ["/images/look-cool.webp", "/images/look-mono.webp"],
    recipe: [
      { label: "種類", value: "ケアブリーチ" },
      { label: "回数", value: "2回" },
      { label: "オキシ", value: "3%" },
      { label: "放置", value: "45分" },
    ],
    memo: "ダメージ抑制のため低オキシで2回に分けて施術。毛先は保護剤を使用。",
    tags: ["ハイトーン", "ダメージケア"],
  },
  {
    id: "h3",
    date: "2026.02.12",
    weekday: "木",
    menu: "カット + トリートメント",
    menuEn: "Cut & Treatment",
    salon: "NEUTRAL 表参道",
    stylist: "佐藤",
    photos: ["/images/look-warm.webp", "/images/look-breeze.webp"],
    recipe: [
      { label: "カット", value: "レイヤー" },
      { label: "TR", value: "TOKIO" },
      { label: "工程", value: "4ステップ" },
      { label: "時間", value: "90分" },
    ],
    memo: "毛先3cmカット。顔まわりにレイヤーを入れて軽さを出しました。",
    tags: ["レイヤーカット", "艶髪"],
  },
  {
    id: "h4",
    date: "2025.12.05",
    weekday: "金",
    menu: "縮毛矯正",
    menuEn: "Straightening",
    salon: "NEUTRAL 表参道",
    stylist: "佐藤",
    photos: ["/images/look-breeze.webp"],
    recipe: [
      { label: "薬剤", value: "GMT" },
      { label: "アイロン", value: "160℃" },
      { label: "放置", value: "15分" },
      { label: "範囲", value: "前髪のみ" },
    ],
    memo: "前髪のうねりを自然に補正。根元の立ち上がりを残す設計。",
    tags: ["ナチュラルストレート"],
  },
];

export const hairTrend = [
  { month: "11月", score: 71 },
  { month: "12月", score: 74 },
  { month: "1月", score: 73 },
  { month: "2月", score: 79 },
  { month: "3月", score: 81 },
  { month: "4月", score: 76 },
  { month: "5月", score: 84 },
  { month: "6月", score: 85 },
  { month: "7月", score: 87 },
  { month: "8月", score: 86 },
  { month: "9月", score: 89 },
];

export const hairMetrics = [
  { label: "水分量", value: 64, note: "やや低め" },
  { label: "ツヤ", value: 82, note: "良好" },
  { label: "弾力", value: 76, note: "標準" },
  { label: "頭皮環境", value: 88, note: "良好" },
];

export type Salon = {
  id: string;
  name: string;
  area: string;
  rating: number;
  reviews: number;
  distance: string;
  image: string;
  specialties: string[];
  match: number;
  price: string;
  hours: string;
  description: string;
  stylists: { name: string; role: string; image: string }[];
  menus: { name: string; price: number; time: string }[];
};

export const salons: Salon[] = [
  {
    id: "luce",
    name: "Luce Hair",
    area: "渋谷",
    rating: 4.8,
    reviews: 324,
    distance: "1.2 km",
    image: "/images/look-profile.webp",
    specialties: ["ハイトーン", "縮毛矯正", "メンズパーマ"],
    match: 96,
    price: "¥¥",
    hours: "10:00 – 20:00",
    description: "光を纏う透明感カラーが得意なサロン。あなたのカルテから、前回のブリーチ履歴を踏まえた最適な提案が可能です。",
    stylists: [
      { name: "山田 美咲", role: "Top Stylist", image: "/images/salon-1.webp" },
      { name: "中村 蓮", role: "Color Specialist", image: "/images/history-3.webp" },
    ],
    menus: [
      { name: "カット", price: 6600, time: "60分" },
      { name: "ケアカラー", price: 8800, time: "90分" },
      { name: "ケアブリーチ", price: 12100, time: "120分" },
      { name: "縮毛矯正", price: 18700, time: "180分" },
    ],
  },
  {
    id: "neutral",
    name: "NEUTRAL",
    area: "表参道",
    rating: 4.7,
    reviews: 298,
    distance: "2.4 km",
    image: "/images/look-mono.webp",
    specialties: ["くせ毛", "カット", "トリートメント"],
    match: 92,
    price: "¥¥¥",
    hours: "11:00 – 21:00",
    description: "骨格と髪の癖を読み解くカット技術に定評。乾かすだけで決まるスタイルを提案します。",
    stylists: [
      { name: "佐藤 葵", role: "Director", image: "/images/salon-2.webp" },
      { name: "高橋 湊", role: "Stylist", image: "/images/history-4.webp" },
    ],
    menus: [
      { name: "カット", price: 7700, time: "60分" },
      { name: "髪質改善トリートメント", price: 11000, time: "90分" },
      { name: "縮毛矯正", price: 20900, time: "180分" },
    ],
  },
  {
    id: "aube",
    name: "Aube",
    area: "銀座",
    rating: 4.9,
    reviews: 186,
    distance: "3.8 km",
    image: "/images/look-warm.webp",
    specialties: ["髪質改善", "カラー", "ヘッドスパ"],
    match: 89,
    price: "¥¥¥",
    hours: "10:00 – 19:00",
    description: "完全個室のプライベートサロン。ヘッドスパと髪質改善で、素髪の美しさを引き出します。",
    stylists: [{ name: "伊藤 凛", role: "Owner", image: "/images/history-2.webp" }],
    menus: [
      { name: "髪質改善", price: 13200, time: "120分" },
      { name: "ヘッドスパ", price: 8800, time: "60分" },
      { name: "カラー", price: 9900, time: "90分" },
    ],
  },
  {
    id: "sora",
    name: "SORA",
    area: "代官山",
    rating: 4.6,
    reviews: 142,
    distance: "4.1 km",
    image: "/images/look-cool.webp",
    specialties: ["メンズパーマ", "カット", "ハイトーン"],
    match: 84,
    price: "¥¥",
    hours: "12:00 – 22:00",
    description: "ストリートとモードを行き来するスタイル提案。メンズパーマの指名率No.1。",
    stylists: [{ name: "渡辺 陸", role: "Stylist", image: "/images/history-4.webp" }],
    menus: [
      { name: "カット", price: 5500, time: "60分" },
      { name: "メンズパーマ", price: 9900, time: "90分" },
    ],
  },
];

export const salonFilters = ["すべて", "ハイトーン", "縮毛矯正", "メンズパーマ", "髪質改善", "カット"];
