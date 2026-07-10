"use client";

import { useState } from "react";
import Link from "next/link";
import { SHORTCUT_JS } from "@/lib/shortcut";

const STEPS = [
  {
    title: "「ショートカット」アプリで新規ショートカットを作る",
    detail: "右上の＋を押して、新しいショートカットを作成します。",
  },
  {
    title: "共有シートに表示する設定にする",
    detail:
      "情報（ⓘ）ボタン →「共有シートに表示」をオン。「受け取るデータの種類」は「Safari Webページ」だけを残します。",
  },
  {
    title: "「Webページの内容を取得」を追加",
    detail: "アクションを検索して追加します。入力は「ショートカットの入力」です。",
  },
  {
    title: "「Webページ上でJavaScriptを実行」を追加",
    detail:
      "下のコードをコピーして貼り付けます。（Safariの共有シートから実行するときだけ使えるアクションです）",
  },
  {
    title: "「URLを開く」を追加",
    detail:
      "URL欄に下のテキストを貼り付け、末尾の変数部分に「JavaScriptの実行結果」を差し込みます（URLエンコードして渡してください）。",
  },
  {
    title: "名前を「ポチマエでチェック」にして保存",
    detail:
      "Safariで販売元プロフィールを開き、共有 →「ポチマエでチェック」で判定結果が開きます。",
  },
];

export default function ShortcutPage() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 w-full px-5 py-12">
        <div className="max-w-xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] text-primary-active mb-3">
            POCHIMAE FOR IPHONE
          </p>
          <h1 className="font-bold text-2xl text-ink mb-3">
            <span className="inline-block">Safariの共有シートから、</span>
            <span className="inline-block">販売元チェック。</span>
          </h1>
          <p className="text-sm text-body leading-relaxed mb-8">
            <span className="inline-block">iPhoneのSafariでAmazonの販売元プロフィールを開き、</span>
            <span className="inline-block">共有ボタンから「ポチマエでチェック」を選ぶだけ。</span>
            <span className="inline-block">貼り付け作業は不要です。</span>
          </p>

          <div className="bg-level-medium-bg text-level-medium-fg border border-level-medium-border/40 rounded-xl px-5 py-4 mb-8">
            <p className="text-sm leading-relaxed">
              <strong>おすすめの使いどころ</strong>
              <br />
              商品ページではなく、<strong>販売元プロフィール</strong>（「特定商取引法に基づく表記」が載っているページ）を開いた状態で実行してください。所在地・運営責任者まで読み取れます。
            </p>
          </div>

          <div className="bg-surface-card rounded-xl p-6 sm:p-8 mb-6">
            <h2 className="font-bold text-lg text-ink mb-5">作り方</h2>
            <ol className="space-y-4">
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
                    <p className="text-sm text-body leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="border border-hairline rounded-xl p-6 mb-6">
            <h3 className="text-sm font-medium text-ink mb-2">
              手順4に貼り付けるコード
            </h3>
            <button
              type="button"
              onClick={() => copy(SHORTCUT_JS, "js")}
              className="h-11 px-6 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-primary-active transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-active"
            >
              {copied === "js" ? "コピーしました ✓" : "コードをコピー"}
            </button>
            <textarea
              readOnly
              value={SHORTCUT_JS}
              rows={6}
              aria-label="ショートカットに貼り付けるJavaScript"
              onFocus={(e) => e.target.select()}
              className="w-full mt-4 rounded-lg border border-hairline bg-white text-muted text-xs p-3 font-mono"
            />
          </div>

          <div className="border border-hairline rounded-xl p-6 mb-8">
            <h3 className="text-sm font-medium text-ink mb-2">
              手順5に貼り付けるURL
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-3">
              下のURLを貼り付けたあと、末尾に「JavaScriptの実行結果」の変数を差し込みます。
            </p>
            <button
              type="button"
              onClick={() => copy("https://pochimae.vercel.app/#s=", "url")}
              className="h-11 px-6 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-primary-active transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-active"
            >
              {copied === "url" ? "コピーしました ✓" : "URLをコピー"}
            </button>
            <p className="mt-3 text-xs font-mono text-muted break-all">
              https://pochimae.vercel.app/#s=［JavaScriptの実行結果］
            </p>
          </div>

          <div className="border border-hairline rounded-xl p-5 mb-8">
            <h2 className="text-sm font-medium text-ink mb-2">プライバシー</h2>
            <p className="text-xs text-muted leading-relaxed">
              読み取った販売元情報はURLの「#」以降に載せて渡します。「#」以降はブラウザの仕様上サーバーへ送信されないため、販売元情報や商品URLがポチマエのサーバーログに残ることはありません。電話番号らしき文字列は、チェック前にブラウザ内で自動的にマスクされます。
            </p>
          </div>

          <Link
            href="/"
            className="text-sm text-primary-active hover:text-ink transition-colors"
          >
            ← ポチマエに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
