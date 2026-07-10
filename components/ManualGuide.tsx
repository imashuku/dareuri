"use client";

import { isAmazonUrl } from "@/lib/categoryGuess";
import type { CategoryRisk } from "@/lib/types";

const STEPS = [
  {
    title: "商品ページの「販売元」を見る",
    detail:
      "購入ボタンの近くに小さく表示されています。「販売元 Amazon.co.jp」ならAmazonの直販で、このツールでのチェックは不要です。ここで確認完了です。",
  },
  {
    title: "「出荷元」も確認する",
    detail:
      "出荷元がAmazonでも、販売しているのは別の事業者のことがあります。2つはセットで見ます。",
  },
  {
    title: "販売元名のリンクをタップ",
    detail: "販売元の名前はリンクになっています。タップすると店舗情報が開きます。",
  },
  {
    title: "販売元プロフィールを開く",
    detail: "店舗の評価や「詳細情報」が表示されるページです。",
  },
  {
    title: "「特定商取引法に基づく表記」を見る",
    detail:
      "事業者の正式名称・運営責任者・住所が載っています。この部分をコピーして、上の欄に貼り付けてください。",
  },
];

const CATEGORY_NOTES: Record<Exclude<CategoryRisk, null>, string> = {
  storage_media:
    "USBメモリ・SDカードは、容量表示と実際の容量が異なる商品の報告が多いカテゴリです。販売元の確認を特におすすめします。",
  charger_battery:
    "充電器・バッテリーは、不具合があったときの影響が大きいカテゴリです。販売元の確認を特におすすめします。",
};

type Props = {
  url: string;
  onUrlChange: (url: string) => void;
  categoryRisk: CategoryRisk;
};

export default function ManualGuide({ url, onUrlChange, categoryRisk }: Props) {
  return (
    <div className="bg-surface-card rounded-xl p-6 sm:p-8 mt-3">
      <p className="text-xs text-muted mb-5">
        Amazonアプリ・ブラウザのどちらでも確認できます。
      </p>
      <ol className="space-y-4 mb-6">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-3">
            <span
              aria-hidden
              className="shrink-0 w-6 h-6 rounded-full bg-primary-active text-on-primary text-xs font-bold flex items-center justify-center mt-0.5"
            >
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-ink">{step.title}</p>
              <p className="text-sm text-body leading-relaxed">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="border-t border-hairline pt-5">
        <label htmlFor="product-url" className="block text-sm font-medium text-ink mb-2">
          商品URL（任意）— 貼ると注意カテゴリをお知らせします
        </label>
        <input
          id="product-url"
          type="text"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://www.amazon.co.jp/..."
          className="w-full h-11 px-4 rounded-lg border border-hairline bg-white text-ink text-base placeholder:text-muted/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <p className="text-xs text-muted/80 mt-2">
          <span className="inline-block">URLはブラウザ内でのみ使い、</span>
          <span className="inline-block">サーバーには送信しません。</span>
        </p>
        {url.trim().length > 0 && !isAmazonUrl(url) && (
          <p className="text-xs text-level-medium-fg mt-1">
            AmazonのURLではないようです。URLがなくても、そのまま確認手順は使えます。
          </p>
        )}
        {categoryRisk && (
          <p className="text-sm leading-relaxed bg-level-medium-bg text-level-medium-fg border border-level-medium-border/40 rounded-lg px-4 py-3 mt-3">
            {CATEGORY_NOTES[categoryRisk]}
          </p>
        )}
      </div>
    </div>
  );
}
