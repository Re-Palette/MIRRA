import { products, type Product } from "./data";

export type AiReply = {
  text: string;
  plan?: { title: string; detail: string }[];
  products?: Product[];
  diagnosis?: { label: string; value: string; level: number }[];
};

export const suggestions = [
  { id: "diagnosis", title: "髪のダメージ診断", sub: "カルテから今の状態を分析", prompt: "今の髪のダメージを診断してください" },
  { id: "care", title: "今日のケア提案", sub: "天気と髪質から最適化", prompt: "今日の天気に合うケア方法を教えて" },
  { id: "products", title: "おすすめ商品", sub: "あなたの髪質にマッチ", prompt: "私に合うおすすめ商品は？" },
  { id: "next", title: "次回施術相談", sub: "履歴から最適なメニューを", prompt: "次回の施術は何がいいですか？" },
] as const;

export const topics = ["髪の悩み相談", "商品提案", "ホームケア提案", "スタイリング相談", "カラー相談"];

export function replyFor(prompt: string): AiReply {
  const p = prompt;
  if (/ダメージ|診断|悩み|傷/.test(p)) {
    return {
      text: "カルテと直近の髪質データを確認しました。4月のケアブリーチ以降、毛先に軽度のダメージが残っていますが、6月のカラー後は順調に回復しています。現在の課題は「乾燥」です。水分量がやや低めなので、内側からの補修を意識しましょう。",
      diagnosis: [
        { label: "ダメージ", value: "Low", level: 18 },
        { label: "乾燥度", value: "Medium", level: 52 },
        { label: "ツヤ", value: "Good", level: 82 },
      ],
    };
  }
  if (/商品|おすすめ|シャンプー|オイル|買/.test(p)) {
    return {
      text: "あなたの髪質（やや乾燥・普通毛）とブリーチ履歴から、相性の良いアイテムを選びました。特にライトヘアオイルは湿度の高い日でも重くならず、うねりを抑えてくれます。",
      products: products.slice(0, 3),
    };
  }
  if (/次回|施術|予約|メニュー/.test(p)) {
    return {
      text: "前回のカラーから約3ヶ月半が経過し、根元が2cmほど伸びている頃です。次回は「根元リタッチ＋髪質改善トリートメント」がおすすめ。10/12のLuce Hair渋谷のご予約に、このメニュー変更を提案しておきましょうか？",
      plan: [
        { title: "根元リタッチ", detail: "ミルクティーベージュ 8トーン" },
        { title: "髪質改善トリートメント", detail: "ブリーチ部分の内部補修" },
        { title: "毛先カット 1cm", detail: "乾燥した毛先を整える" },
      ],
    };
  }
  if (/カラー|色/.test(p)) {
    return {
      text: "ブリーチ履歴があるので、透明感のある寒色系がきれいに発色します。秋冬なら「ラベンダーグレージュ」や「スモーキーベージュ」がおすすめ。赤みが出やすい髪質なので、アッシュを少し強めにするのがポイントです。",
      plan: [
        { title: "ラベンダーグレージュ", detail: "柔らかく上品な透明感" },
        { title: "スモーキーベージュ", detail: "赤みを抑えた落ち着いた色" },
      ],
    };
  }
  if (/スタイリング|アレンジ|セット|うねり|広が/.test(p)) {
    return {
      text: "湿気の多い日は、乾かす前の準備が仕上がりを左右します。根元から風を当て、最後に冷風でキューティクルを閉じるのがコツ。毛先は軽いオイルでまとまりを出しましょう。",
      plan: [
        { title: "タオルドライ後にミルク", detail: "中間〜毛先に1プッシュ" },
        { title: "根元から乾かす", detail: "ドライヤーは120℃以下" },
        { title: "冷風で仕上げ", detail: "ツヤとキープ力がアップ" },
      ],
    };
  }
  return {
    text: "今日の東京は湿度78%。あなたの髪は現在、乾燥と軽度のダメージが見られます。今の季節は湿度も高くなるため、保湿と熱ダメージ対策を意識しましょう。",
    plan: [
      { title: "洗い流さないトリートメント", detail: "保湿・熱保護" },
      { title: "週1回の集中マスク", detail: "内部補修" },
      { title: "ドライヤーは低温で", detail: "120℃以下を推奨" },
    ],
  };
}
