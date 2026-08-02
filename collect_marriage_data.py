# -*- coding: utf-8 -*-
"""
浮気・不倫・離婚・結婚適性度の統計分析用データ収集スクリプト
Wikipedia APIを使用して、以下の3グループを収集する:
- affair_cases: 不倫・浮気報道があった芸能人
- divorce_cases: 離婚歴がある芸能人
- controls: 報道なし・安定結婚・未婚で問題なし

出力: marriage_dataset.json (batch_calculate_marriage.js の入力)
"""

import json
import os
import re
import time
import urllib.request
import urllib.parse
from collections import defaultdict

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "marriage_dataset.json")
REQUEST_INTERVAL = 3.0
USER_AGENT = "SanmeigakuResearchBot/2.0 (academic research; contact: researcher@example.com)"
API_URL = "https://ja.wikipedia.org/w/api.php"
MAX_RETRIES = 5
INITIAL_BACKOFF = 5

# === 検索キーワード ===
AFFAIR_KEYWORDS = [
    "不倫 報道", "不倫騒動", "浮気 離婚", "不倫疑惑",
    "W不倫", "不倫 相手", "不倫 スキャンダル",
    "不倫 報道", "浮気 騒動", "不倫 会見",
    "不倫 謝罪", "不倫 発覚",
    "不倫 俳優", "不倫 女優", "不倫 タレント", "不倫 歌手",
    "不倫 お笑い", "不倫 芸人", "不倫 アイドル",
    "浮気 俳優", "浮気 女優", "浮気 タレント",
    "不貞 芸能", "愛人 芸能人", "密会 芸能人",
    "スキャンダル 芸能人", "不倫 報道 2020", "不倫 報道 2019",
    "不倫 報道 2018", "不倫 報道 2017", "不倫 報道 2016",
    "不倫 報道 2015", "不倫 報道 2014", "不倫 報道 2013",
]

DIVORCE_KEYWORDS = [
    "離婚 俳優", "離婚 女優", "離婚 タレント", "離婚 歌手",
    "離婚 お笑い", "離婚 芸人", "離婚 アイドル",
    "離婚 報道", "離婚 成立", "離婚 調停", "離婚 会見",
    "離婚 発表", "離婚 原因", "離婚 不倫",
    "離婚 2020", "離婚 2019", "離婚 2018", "離婚 2017",
    "離婚 2016", "離婚 2015", "離婚 2014", "離婚 2013",
    "離婚 2012", "離婚 2011", "離婚 2010",
    "別居 芸能人", "離婚歴 俳優", "離婚歴 女優",
    "離婚歴 タレント", "離婚歴 歌手",
]

CONTROL_KEYWORDS = [
    "夫婦円満 俳優", "夫婦円満 女優", "夫婦円満 タレント",
    "仲良し 夫婦", "結婚 長続き", "幸せな結婚",
    "安定 結婚", "結婚 何周年", "夫婦円満 ランキング",
    "仲良し夫婦", "結婚記念日 芸能人", "夫婦 共演",
    "日本の俳優", "日本の女優", "日本のタレント",
    "日本の歌手", "日本のお笑い", "日本の芸人",
    "日本のアイドル", "日本の声優", "日本のモデル",
    "日本のミュージシャン", "日本の司会者",
]

# 既存のデータセットから重複を除外するための名前セット
EXISTING_NAMES = set()
existing_path = os.path.join(os.path.dirname(__file__), "expanded_dataset_combined.json")
if os.path.exists(existing_path):
    with open(existing_path, "r", encoding="utf-8") as f:
        existing = json.load(f)
        EXISTING_NAMES = set(d.get("name", "") for d in existing)


def wiki_api_request(params, retries=MAX_RETRIES):
    params["format"] = "json"
    params["formatversion"] = "2"
    url = API_URL + "?" + urllib.parse.urlencode(params)
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 429:
                backoff = INITIAL_BACKOFF * (2 ** attempt)
                print(f"    [429] レート制限。{backoff}秒待機...")
                time.sleep(backoff)
                continue
            raise
        except Exception as e:
            if attempt < retries - 1:
                backoff = INITIAL_BACKOFF * (2 ** attempt)
                print(f"    [エラー] {e}. {backoff}秒待機...")
                time.sleep(backoff)
                continue
            raise
    raise Exception(f"最大リトライ回数({retries})に達しました")


def get_page_text(title):
    params = {
        "action": "query",
        "titles": title,
        "prop": "revisions",
        "rvprop": "content",
        "rvslots": "main",
    }
    data = wiki_api_request(params)
    if "query" in data and "pages" in data["query"]:
        pages = data["query"]["pages"]
        if pages and "revisions" in pages[0]:
            return pages[0]["revisions"][0]["slots"]["main"]["content"]
    return None


def search_wikipedia(query, limit=50):
    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "srlimit": str(limit),
        "srprop": "snippet",
    }
    data = wiki_api_request(params)
    if "query" in data and "search" in data["query"]:
        return [(r["title"], r.get("snippet", "")) for r in data["query"]["search"]]
    return []


def extract_birth_date(text):
    """Wikipedia記事本文から生年月日を抽出"""
    patterns = [
        r"生年月日\s*[\|：:]\s*(\d{4})年(\d{1,2})月(\d{1,2})日",
        r"生年月日\s*[\|：:]\s*\[\[(\d{4})年\]\]\[\[(\d{1,2})月(\d{1,2})日\]\]",
        r"生年月日\s*[\|：:]\s*\{\{生年月日と年齢\|(\d{4})\|(\d{1,2})\|(\d{1,2})",
        r"生年月日\s*[\|：:]\s*\{\{生年月日\|(\d{4})\|(\d{1,2})\|(\d{1,2})",
        r"生年月日と年齢\s*[\|：:]\s*(\d{4})\|(\d{1,2})\|(\d{1,2})",
        r"生年月日\s*[\|：:]\s*(\d{4})-(\d{2})-(\d{2})",
        r"誕生日\s*[\|：:]\s*(\d{4})年(\d{1,2})月(\d{1,2})日",
        r"生誕\s*[\|：:]\s*(\d{4})年(\d{1,2})月(\d{1,2})日",
        r"\{\{生年月日と年齢\|(\d{4})\|(\d{1,2})\|(\d{1,2})",
        r"\{\{生年月日\|(\d{4})\|(\d{1,2})\|(\d{1,2})",
    ]
    for p in patterns:
        m = re.search(p, text)
        if m:
            y, mo, d = m.group(1), int(m.group(2)), int(m.group(3))
            return f"{y}-{mo:02d}-{d:02d}"
    return None


def extract_gender(text):
    """性別を抽出"""
    if re.search(r"\{\{Infobox.*?\|.*?性別\s*=\s*男性", text, re.DOTALL):
        return "male"
    if re.search(r"\{\{Infobox.*?\|.*?性別\s*=\s*女性", text, re.DOTALL):
        return "female"
    if re.search(r"性別\s*[\|：:]\s*男性", text):
        return "male"
    if re.search(r"性別\s*[\|：:]\s*女性", text):
        return "female"
    # 推定: 「日本の男優」「日本の男性」等
    if re.search(r"男性|男優|俳優\b(?!女)|声優.*男性|タレント.*男性|歌手.*男性", text[:500]):
        return "male"
    if re.search(r"女性|女優|声優.*女性|タレント.*女性|歌手.*女性", text[:500]):
        return "female"
    return None


def extract_real_name(text):
    """本名を抽出"""
    patterns = [
        r"本名\s*[\|：:]\s*([^\|\n\}]+)",
        r"別名義\s*[\|：:]\s*([^\|\n\}]+)",
    ]
    for p in patterns:
        m = re.search(p, text)
        if m:
            name = m.group(1).strip().rstrip("}").strip()
            if name and len(name) < 30:
                return name
    return None


def check_affair_evidence(text, snippet=""):
    """不倫・浮気の証拠があるかチェック"""
    combined = text + " " + snippet
    affair_words = ["不倫", "浮気", "W不倫", "不貞", "愛人", "密会", "スキャンダル"]
    count = sum(1 for w in affair_words if w in combined)
    return count


def check_divorce_evidence(text, snippet=""):
    """離婚の証拠があるかチェック"""
    combined = text + " " + snippet
    divorce_words = ["離婚", "協議離婚", "調停離婚", "離婚成立", "離婚発表", "別居"]
    count = sum(1 for w in divorce_words if w in combined)
    return count


def check_stable_marriage(text, snippet=""):
    """安定結婚の証拠があるかチェック"""
    combined = text + " " + snippet
    stable_words = ["夫婦円満", "仲良し", "結婚生活", "妻と", "夫と", "家族円満"]
    count = sum(1 for w in stable_words if w in combined)
    return count


def is_entertainer(text):
    """芸能人かどうかを判定"""
    entertainer_words = [
        "俳優", "女優", "タレント", "歌手", "アイドル", "声優",
        "お笑い", "芸人", "モデル", "ミュージシャン", "バンド",
        "音楽家", "作曲家", "作詞家", "プロデューサー", "司会者",
        "ナレーター", "レポーター", "インフルエンサー",
    ]
    text_lower = text[:2000]
    return any(w in text_lower for w in entertainer_words)


def collect_celebrities(keywords, group, evidence_checker, min_evidence=1, max_collect=200):
    """指定キーワードでWikipedia検索し、芸能人データを収集"""
    collected = {}
    seen_titles = set()

    for kw in keywords:
        print(f"  検索: {kw}")
        try:
            results = search_wikipedia(kw, limit=50)
        except Exception as e:
            print(f"    検索エラー: {e}")
            continue

        for title, snippet in results:
            if title in seen_titles or title in EXISTING_NAMES:
                continue
            if "Category:" in title or "Template:" in title or "Wikipedia:" in title or "ファイル:" in title:
                continue
            seen_titles.add(title)

            time.sleep(REQUEST_INTERVAL)
            try:
                text = get_page_text(title)
                if not text:
                    continue
            except Exception as e:
                print(f"    ページ取得エラー ({title}): {e}")
                continue

            # 芸能人かチェック
            if not is_entertainer(text):
                continue

            # 生年月日を抽出
            birth_date = extract_birth_date(text)
            if not birth_date:
                continue

            # 証拠チェック
            evidence = evidence_checker(text, snippet)
            if evidence < min_evidence:
                continue

            # 性別を抽出
            gender = extract_gender(text)
            if not gender:
                continue

            # 本名を抽出
            real_name = extract_real_name(text)

            celeb = {
                "name": title,
                "real_name": real_name or title,
                "birth_date": birth_date,
                "gender": gender,
                "group": group,
                "evidence_score": evidence,
            }
            collected[title] = celeb
            print(f"    → {title} ({birth_date}, {gender}, evidence={evidence})")

            if len(collected) >= max_collect:
                break

        if len(collected) >= max_collect:
            break

    return list(collected.values())


def main():
    print("=" * 70)
    print("浮気・不倫・離婚・結婚適性度 データ収集スクリプト")
    print("=" * 70)

    # === 1. 不倫・浮気ケース ===
    print("\n【1】不倫・浮気ケースを収集中...")
    affair_cases = collect_celebrities(
        AFFAIR_KEYWORDS, "affair_case", check_affair_evidence, min_evidence=1, max_collect=150
    )
    print(f"  不倫ケース: {len(affair_cases)}名収集")

    # === 2. 離婚ケース ===
    print("\n【2】離婚ケースを収集中...")
    divorce_cases = collect_celebrities(
        DIVORCE_KEYWORDS, "divorce_case", check_divorce_evidence, min_evidence=1, max_collect=200
    )
    print(f"  離婚ケース: {len(divorce_cases)}名収集")

    # === 3. コントロール（安定結婚・問題なし） ===
    print("\n【3】コントロール（安定結婚）を収集中...")
    controls = collect_celebrities(
        CONTROL_KEYWORDS, "control", check_stable_marriage, min_evidence=0, max_collect=300
    )
    print(f"  コントロール: {len(controls)}名収集")

    # === 重複除去 ===
    all_names = set()
    unique_data = []
    for celeb in affair_cases + divorce_cases + controls:
        if celeb["name"] not in all_names:
            all_names.add(celeb["name"])
            unique_data.append(celeb)

    # IDを振る
    for i, celeb in enumerate(unique_data, 1):
        celeb["id"] = i

    # === 出力 ===
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(unique_data, f, ensure_ascii=False, indent=2)

    print(f"\n{'=' * 70}")
    print(f"収集完了: 合計 {len(unique_data)}名")
    print(f"  不倫ケース: {len([c for c in unique_data if c['group'] == 'affair_case'])}名")
    print(f"  離婚ケース: {len([c for c in unique_data if c['group'] == 'divorce_case'])}名")
    print(f"  コントロール: {len([c for c in unique_data if c['group'] == 'control'])}名")
    print(f"出力: {OUTPUT_PATH}")
    print(f"{'=' * 70}")


if __name__ == "__main__":
    main()
