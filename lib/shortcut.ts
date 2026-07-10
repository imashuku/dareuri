// iOS ショートカット用の抽出スクリプト。
// Safari の共有シート →「Webページ上でJavaScriptを実行」で走る。
// 商品ページからでもセラープロフィールページからでも動くよう、
// 両方のセレクタを試す。fetch は使わない（ショートカットのJSは
// 非同期完了を待てないため）。結果は completion() で返す。
//
// 商品ページで実行した場合はセラープロフィールを辿れないので、
// 取れるのは出荷元・販売元まで（モバイルSafariでは商品名要素も
// 出ないことがある）。特商法ブロックまで欲しい場合は、Safari で
// 販売元プロフィールを開いてから実行する。導入ページではその手順を
// 推奨導線として案内している。実ページでの検証済み。

export const SHORTCUT_JS = `const q = (s) => document.querySelector(s);
const t = (e) => (e ? e.innerText.trim() : "");
const p = [];

// 商品ページ側
const title = t(q("#productTitle"));
if (title) p.push("商品名: " + title);
const byline = t(q("#bylineInfo"));
if (byline) p.push("ブランド表記: " + byline);
const ful = t(q("#fulfillerInfoFeature_feature_div"));
if (ful) p.push(ful);
const merch = t(q("#merchantInfoFeature_feature_div"));
if (merch) p.push(merch);
const seller = q("#sellerProfileTriggerId");
if (seller) p.push("販売元: " + seller.textContent.trim());

// 販売元プロフィールページ側（特定商取引法に基づく表記）
const sec =
  q("#page-section-detail-seller-info") || q("#seller-profile-container");
if (sec) p.push(t(sec));

completion(p.join("\\n").slice(0, 9000));`;
