import Anthropic from "@anthropic-ai/sdk";
import { catalogText } from "@/lib/agent/catalog";
import { CONFIRM_ACTIONS, type AgentAction, type AgentReply, type AgentSnapshot } from "@/lib/agent/types";

export const runtime = "nodejs";

const MODEL = process.env.MIRRA_AGENT_MODEL ?? "claude-opus-5-5";
const MAX_STEPS = 6;

const hasCredentials = () => Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);

const SYSTEM = `あなたは「MIRRA」。美容プラットフォームMIRRAに住む、ユーザー専属のパーソナルビューティーエージェントです。
アイアンマンのF.R.I.D.A.Y.のように、落ち着いて頼れる相棒として振る舞ってください。

話し方:
- ですます体。簡潔に、要点から。音声で読み上げられる前提なので、1〜3文・箇条書きや記号・絵文字なし。
- ユーザーは呼び名＋さんで呼ぶ。

できること（ツール）:
- remember / forget: ユーザーについて長期的に役立つ事実（好み・髪の悩み・制約・予定の癖）を記憶・削除する。ユーザーが頼んだとき、または明らかに今後の提案に効く事実が出たときに使う。
- book_salon / cancel_reservation: 予約の作成・変更・キャンセル。これらはユーザーの承認カードが表示され、承認されるまで確定しない。「確定しました」とは言わず「承認をお願いします」と伝える。
- add_to_cart, set_reminder, navigate, show_products, show_plan: アプリ内の操作と表示。
- 依頼が曖昧で予約の日時やサロンが決められないときは、ツールを呼ばずに短く確認する。

判断の材料:
- 下のカタログ（サロン・商品・カルテ・髪質・天気）と、各ターンの <app_state>（記憶・予約・カート・リマインダー・現在時刻）だけを事実として使う。知らないことは推測しない。
- 記憶の内容（例: ブリーチの頻度、敏感な頭皮）を提案に必ず反映する。
- 医療的な判断が必要な頭皮・皮膚の症状は、皮膚科の受診をすすめる。

# カタログ
${catalogText()}`;

const str = { type: "string" } as const;
const tools: Anthropic.Beta.BetaTool[] = [
  {
    name: "remember",
    description: "ユーザーについて長期的に覚えておく事実を1つ保存する。",
    input_schema: { type: "object", properties: { text: { ...str, description: "記憶する事実（簡潔な日本語1文）" } }, required: ["text"], additionalProperties: false },
    strict: true,
  },
  {
    name: "forget",
    description: "app_state.memories の id を指定して記憶を削除する。",
    input_schema: { type: "object", properties: { id: str }, required: ["id"], additionalProperties: false },
    strict: true,
  },
  {
    name: "book_salon",
    description: "サロンの予約を作成または変更する（既存の予約は置き換わる）。ユーザー承認が必要。",
    input_schema: {
      type: "object",
      properties: {
        salonId: { ...str, description: "カタログのサロンid" },
        menu: { ...str, description: "そのサロンのメニュー名" },
        date: { ...str, description: "YYYY.MM.DD" },
        time: { ...str, description: "HH:MM（24時間）" },
      },
      required: ["salonId", "menu", "date", "time"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    name: "cancel_reservation",
    description: "現在の予約をキャンセルする。ユーザー承認が必要。",
    input_schema: { type: "object", properties: {}, required: [], additionalProperties: false },
    strict: true,
  },
  {
    name: "add_to_cart",
    description: "商品をカートに追加する。",
    input_schema: { type: "object", properties: { productId: { ...str, description: "カタログの商品id" } }, required: ["productId"], additionalProperties: false },
    strict: true,
  },
  {
    name: "set_reminder",
    description: "ケアや予約のリマインダーを設定する。",
    input_schema: {
      type: "object",
      properties: { title: str, when: { ...str, description: "例: 今日 21:00 / 毎週日曜 21:00 / 2026.10.10 20:00" } },
      required: ["title", "when"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    name: "navigate",
    description: "アプリの画面を開く。",
    input_schema: {
      type: "object",
      properties: { to: { type: "string", enum: ["/", "/card", "/history", "/ai", "/salon", "/profile", "/ai/memory"] } },
      required: ["to"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    name: "show_products",
    description: "商品カードをチャットに表示する。",
    input_schema: { type: "object", properties: { productIds: { type: "array", items: str } }, required: ["productIds"], additionalProperties: false },
    strict: true,
  },
  {
    name: "show_plan",
    description: "ケアプランや施術プランをステップ形式でチャットに表示する。",
    input_schema: {
      type: "object",
      properties: {
        title: str,
        steps: {
          type: "array",
          items: { type: "object", properties: { title: str, detail: str }, required: ["title", "detail"], additionalProperties: false },
        },
      },
      required: ["title", "steps"],
      additionalProperties: false,
    },
    strict: true,
  },
];

type HistoryTurn = { role: "user" | "agent"; text: string };

export async function GET() {
  return Response.json({ enabled: hasCredentials(), model: MODEL });
}

export async function POST(req: Request) {
  if (!hasCredentials()) return Response.json({ error: "not_configured" }, { status: 503 });

  const { message, history, snapshot } = (await req.json()) as { message: string; history: HistoryTurn[]; snapshot: AgentSnapshot };
  if (typeof message !== "string" || !message.trim()) return Response.json({ error: "empty" }, { status: 400 });

  const client = new Anthropic();
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    ...history.slice(-20).map((h) => ({ role: h.role === "user" ? ("user" as const) : ("assistant" as const), content: h.text })),
    {
      role: "user",
      content: [
        { type: "text", text: `<app_state>\n${JSON.stringify(snapshot)}\n</app_state>` },
        { type: "text", text: message },
      ],
    },
  ];
  // The API requires the first message to be from the user.
  while (messages.length && messages[0].role !== "user") messages.shift();

  const actions: AgentAction[] = [];
  let text = "";

  try {
    for (let step = 0; step < MAX_STEPS; step++) {
      const response = await client.beta.messages.create({
        model: MODEL,
        max_tokens: 4096,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: { effort: "low" },
        system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
        tools,
        messages,
      });

      if (response.stop_reason === "refusal") {
        text = "申し訳ありません、その内容にはお答えできません。";
        break;
      }

      const turnText = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
      if (turnText) text = turnText;

      const toolUses = response.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
      if (response.stop_reason !== "tool_use" || toolUses.length === 0) break;

      messages.push({ role: "assistant", content: response.content });
      const results: Anthropic.Beta.BetaToolResultBlockParam[] = toolUses.map((use) => {
        const action = { type: use.name, ...(use.input as object) } as AgentAction;
        actions.push(action);
        const needsApproval = CONFIRM_ACTIONS.includes(action.type);
        return {
          type: "tool_result",
          tool_use_id: use.id,
          content: needsApproval
            ? "ユーザーに承認カードを表示しました。まだ確定していません。"
            : "アプリで実行しました。",
        };
      });
      messages.push({ role: "user", content: results });
    }
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return Response.json({ error: "rate_limited" }, { status: 429 });
    if (error instanceof Anthropic.AuthenticationError) return Response.json({ error: "auth" }, { status: 401 });
    if (error instanceof Anthropic.APIError) return Response.json({ error: "api", status: error.status }, { status: 502 });
    throw error;
  }

  const reply: AgentReply = { text: text || "承知しました。", actions, source: "claude" };
  return Response.json(reply);
}
