export type Memory = { id: string; text: string; date: string; source: "user" | "agent" };
export type Reminder = { id: string; title: string; when: string; done: boolean };
export type CartItem = { productId: string; qty: number };
export type Reservation = {
  salonId: string;
  salon: string;
  stylist: string;
  date: string; // YYYY.MM.DD
  time: string; // HH:MM
  menu: string;
};

/** Things the agent can do inside the app. `book_salon` and `cancel_reservation` require the user's approval. */
export type AgentAction =
  | { type: "remember"; text: string }
  | { type: "forget"; id: string }
  | { type: "add_to_cart"; productId: string }
  | { type: "set_reminder"; title: string; when: string }
  | { type: "book_salon"; salonId: string; menu: string; date: string; time: string }
  | { type: "cancel_reservation" }
  | { type: "navigate"; to: string }
  | { type: "show_products"; productIds: string[] }
  | { type: "show_plan"; title: string; steps: { title: string; detail: string }[] };

export const CONFIRM_ACTIONS: AgentAction["type"][] = ["book_salon", "cancel_reservation"];

export type ActionStatus = "done" | "pending" | "declined";

export type AgentMessage = {
  id: string;
  role: "user" | "agent";
  text: string;
  ts: number;
  voice?: boolean;
  actions?: { action: AgentAction; status: ActionStatus }[];
  source?: "claude" | "demo";
};

export type AgentSettings = { nickname: string; voiceReply: boolean };

export type AgentState = {
  memories: Memory[];
  reminders: Reminder[];
  cart: CartItem[];
  reservation: Reservation | null;
  messages: AgentMessage[];
  settings: AgentSettings;
};

/** Snapshot sent to the model each turn so it can reason about the user's current state. */
export type AgentSnapshot = {
  now: string;
  nickname: string;
  memories: Memory[];
  reminders: Reminder[];
  cart: CartItem[];
  reservation: Reservation | null;
};

export type AgentReply = { text: string; actions: AgentAction[]; source: "claude" | "demo" };
