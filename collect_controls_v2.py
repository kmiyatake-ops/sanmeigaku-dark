# -*- coding: utf-8 -*-
"""
第2弾対照収集: 病気記述率の低いカテゴリ（力士・野球・声優等）から
対照群を収集。途中経過も定期的に保存する。
"""

import json
import os
import sys
import time
import random

sys.path.insert(0, os.path.dirname(__file__))
from collect_phase2 import (
    get_page_text, get_category_members, extract_birth_date,
    extract_gender, extract_real_name, split_japanese_name,
    has_illness_mention, is_likely_person,
    REQUEST_INTERVAL, OUTPUT_CONTROLS,
)

EXISTING_COMBINED = os.path.join(os.path.dirname(__file__), "expanded_dataset_combined.json")

# 病気記述の少なそうなカテゴリ
CATEGORIES = [
    "大相撲力士", "日本の野球選手", "日本のサッカー選手",
    "日本のフィギュアスケート選手", "日本の水泳選手",
    "日本の体操選手", "日本の陸上競技選手", "日本の競輪選手",
    "日本の競馬騎手", "日本のプロボウラー", "日本の将棋棋士",
    "日本の囲碁棋士", "日本のチェス選手", "日本の空手家",
    "日本の柔道家", "日本の剣道家", "日本のレスリング選手",
    "日本のボクサー", "日本のプロレスラー", "日本の総合格闘家",
    "日本のキックボクサー", "日本のテニス選手", "日本のバレーボール選手",
    "日本のバスケットボール選手", "日本のラグビー選手",
    "日本のハンドボール選手", "日本の卓球選手", "日本のバドミントン選手",
    "日本のアーチェリー選手", "日本の射撃選手", "日本のフェンシング選手",
    "日本のボート選手", "日本のカヌー選手", "日本の自転車選手",
    "日本のスケートボード選手", "日本のスノーボード選手",
    "日本のスキー選手", "日本のスピードスケート選手",
    "日本のショートトラックスピードスケート選手",
    "日本のトライアスロン選手", "日本の男子マラソン選手",
    "日本の登山家", "日本のピアニスト", "日本のヴァイオリニスト",
    "日本のチェリスト", "日本の指揮者", "日本のオペラ歌手",
    "日本のバレエダンサー", "日本の能楽師", "日本の狂言師",
    "日本の歌舞伎俳優", "日本の落語家", "日本の講談師",
    "日本の浪曲師", "日本の漫才師", "日本のものまねタレント",
    "日本の奇術師", "日本の声優", "日本の男性声優", "日本の女性声優",
    "日本の写真家", "日本の建築家", "日本のファッションデザイナー",
    "日本のプロダクトデザイナー", "日本のゲームクリエイター",
    "日本の漫画家", "日本のイラストレーター", "日本の絵本作家",
    "日本の書家", "日本の彫刻家", "日本の陶芸家",
    "日本のジャズミュージシャン", "日本のロックミュージシャン",
    "日本のフォークシンガー", "日本のシンガーソングライター",
    "日本のDJ", "日本のトラックメイカー", "日本の作曲家",
    "日本の編曲家", "日本の作詞家", "日本の音楽プロデューサー",
    "日本の映画監督", "日本のアニメーション監督", "日本の脚本家",
    "日本の小説家", "日本の詩人", "日本のエッセイスト",
    "日本の歌人", "日本の俳人", "日本の放送作家",
    "日本のテレビプロデューサー", "日本の演出家",
    "日本のダンサー", "日本の振付家", "日本のモデル",
    "日本のファッションモデル", "日本のレースクイーン",
    "日本のグラビアアイドル", "日本のコスプレイヤー",
    "日本のYouTuber", "日本のプロゲーマー", "日本の棋士 (将棋)",
    "日本の棋士 (囲碁)", "日本の麻雀プロ", "日本の競輪選手",
    "日本の騎手", "日本の調教師", "日本の馬主",
    "日本のプロボウラー", "日本のダーツプレイヤー",
    "日本のビリヤード選手", "日本のボウリング選手",
    "日本のカーリング選手", "日本のスケートボーダー",
    "日本のスノーボーダー", "日本のフリースタイルスキー選手",
    "日本のアルペンスキー選手", "日本のクロスカントリースキー選手",
    "日本のスキージャンプ選手", "日本のノルディック複合選手",
    "日本のバイアスロン選手", "日本のリュージュ選手",
    "日本のボブスレー選手", "日本のスケルトン選手",
]

TARGET_NEW = 150  # 追加目標


def main():
    with open(EXISTING_COMBINED, "r", encoding="utf-8") as f:
        existing = json.load(f)
    existing_names = set(d["name"] for d in existing)

    prev = []
    if os.path.exists(OUTPUT_CONTROLS):
        with open(OUTPUT_CONTROLS, "r", encoding="utf-8") as f:
            prev = json.load(f)
    prev_names = set(d["name"] for d in prev)
    skip = existing_names | prev_names

    # カテゴリから候補列挙
    all_titles = []
    seen_titles = set()
    for cat in CATEGORIES:
        try:
            members = get_category_members(cat, limit=300)
            for m in members:
                if m in skip or m in seen_titles:
                    continue
                if not is_likely_person(m):
                    continue
                seen_titles.add(m)
                all_titles.append(m)
            print(f"[CAT] {cat}: +{len(members)} (candidates: {len(all_titles)})", flush=True)
        except Exception as e:
            print(f"[CAT-ERR] {cat}: {e}", flush=True)
        time.sleep(REQUEST_INTERVAL)

    random.shuffle(all_titles)
    print(f"\n候補総数: {len(all_titles)}件 / 目標追加: {TARGET_NEW}名\n", flush=True)

    new_controls = list(prev)  # 既存分も保持して定期保存
    found = 0
    older = 0
    processed = 0

    for title in all_titles:
        if found >= TARGET_NEW:
            break
        processed += 1
        if processed % 100 == 0:
            print(f"  progress {processed}/{len(all_titles)} (found: {found})", flush=True)
            # 定期保存
            with open(OUTPUT_CONTROLS, "w", encoding="utf-8") as f:
                json.dump(new_controls, f, ensure_ascii=False, indent=2)
        try:
            text = get_page_text(title)
            if not text:
                time.sleep(REQUEST_INTERVAL)
                continue
            if has_illness_mention(text):
                time.sleep(REQUEST_INTERVAL)
                continue
            birth_date = extract_birth_date(text)
            gender = extract_gender(text)
            if not (birth_date and gender):
                time.sleep(REQUEST_INTERVAL)
                continue
            real_name = extract_real_name(text) or title
            last_name, first_name = split_japanese_name(real_name)
            new_controls.append({
                "name": title,
                "real_name": real_name,
                "last_name": last_name,
                "first_name": first_name,
                "birth_date": birth_date,
                "gender": gender,
                "illness": None,
                "illness_category": None,
                "onset_year": None,
                "notes": "対照群（病気公表なし）",
                "source": "Wikipedia",
                "group": "control",
            })
            found += 1
            if int(birth_date[:4]) <= 1976:
                older += 1
            if found % 10 == 0:
                print(f"  [CTRL {found}] {title}: {birth_date}", flush=True)
        except Exception:
            pass
        time.sleep(REQUEST_INTERVAL)

    with open(OUTPUT_CONTROLS, "w", encoding="utf-8") as f:
        json.dump(new_controls, f, ensure_ascii=False, indent=2)
    print(f"\n完了: +{found}名（50歳以上: {older}名） / phase2対照累計: {len(new_controls)}名", flush=True)


if __name__ == "__main__":
    main()
