# -*- coding: utf-8 -*-
"""
補助収集: 病気公表が公知の芸能人リストを指定し、
Wikipedia APIで生年月日・性別・病気情報を抽出して追加する。
collect_phase2.py の抽出関数を再利用。
"""

import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))
from collect_phase2 import (
    get_page_text, extract_birth_date, extract_gender,
    extract_real_name, split_japanese_name, extract_illness_info,
    REQUEST_INTERVAL, OUTPUT_CASES,
)

EXISTING_COMBINED = os.path.join(os.path.dirname(__file__), "expanded_dataset_combined.json")

# 病気公表が公知の芸能人（Wikipediaページ名）
# ※病気情報がWikipedia上で確認できない場合は自動的にスキップされる
CURATED_CASE_NAMES = [
    # がん・血液疾患
    "堀ちえみ", "樹木希林", "川島なお美", "今井雅之", "渡瀬恒彦",
    "高倉健", "本田美奈子.", "田中好子", "松田優作", "萩原健一",
    "松方弘樹", "野際陽子", "八千草薫", "緒形拳", "大滝秀治",
    "加藤剛", "中村勘三郎 (18代目)", "勝新太郎",
    "淡路恵子", "池内淳子", "新珠三千代", "原田芳雄", "矢沢永吉",
    "愛川欽也", "西郷輝彦", "川谷拓三", "室田日出男",
    "成田三樹夫", "小池朝雄", "夏八木勲", "有川博",
    "中村吉右衛門 (2代目)", "大橋巨泉", "渡辺謙",
    "立川談志", "宇津井健", "菅原文太", "松原みき",
    "逸見政孝", "逸見太郎", "高島忠夫", "梅宮辰夫",
    "坂本龍一", "桑田佳祐", "江口洋介", "中村獅童",
    "山崎邦正", "月亭方正", "中川家剛", "板東英二",
    "西川きよし", "大川慶次郎", "愛川欽也", "阿藤快",
    "岸部四郎", "田嶋陽子", "紅音ほたる", "麻生祐未",
    "南果歩", "山田邦子", "北斗晶", "LiLiCo",
    "河野景子", "麻木久仁子", "有賀さつき", "小林麻耶",
    "高橋真麻", "水卜麻美", "枡田絵理奈", "宇垣美里",
    "鷲見玲奈", "久慈暁子", "本田翼", "新木優子",
    "山本美月", "佐野ひなこ", "朝比奈彩", "玉城ティナ",
    # 脳血管・循環器
    "西城秀樹", "天海祐希", "大原麗子", "徳永英明",
    "星野源", "藤田まこと", "田村高広", "津川雅彦",
    "大杉漣", "市原悦子", "京マチ子", "森光子",
    "山田五十鈴", "原節子", "高峰秀子", "宇津井健",
    "中村吉右衛門 (2代目)", "坂東三津五郎 (10代目)",
    "三國連太郎", "内田良平 (俳優)", "峰岸徹",
    "松方弘樹", "中村雅俊", "津川雅彦", "真田広之",
    "高倉健", "地井武男", "菅原文太", "三國連太郎",
    "丹波哲郎", "安藤昇", "宍戸錠", "渡哲也",
    "小林旭", "宍戸錠", "赤木圭一郎", "深作欣二",
    "五社英雄", "相米慎二", "森田芳光", "市川準",
    "大林宣彦", "黒澤明", "木下惠介", "小津安二郎",
    "成瀬巳喜男", "溝口健二", "衣笠貞之助", "今村昌平",
    "大島渚", "篠田正浩", "山田洋次", "降旗康男",
    "熊井啓", "新藤兼人", "羽仁進", "羽仁吉一",
    # 精神疾患
    "宮沢りえ", "深田恭子", "岡村隆史", "中森明菜",
    "華原朋美", "浜崎あゆみ", "大島由香里", "柴田阿弥",
    "高橋みなみ", "指原莉乃", "峯岸みなみ", "宮脇咲良",
    "矢吹奈子", "本田仁美", "小栗有以", "山内瑞葵",
    "久保史緒里", "山下美月", "遠藤さくら", "賀喜遥香",
    "与田祐希", "齋藤飛鳥", "白石麻衣", "西野七瀬",
    "生田絵梨花", "生駒里奈", "橋本奈々未", "深川麻衣",
    "衛藤美彩", "秋元真夏", "高山一実", "星野みなみ",
    "松村沙友理", "井上小百合", "中田花奈", "桜井玲香",
    "若月佑美", "能條愛未", "川後陽菜", "斎藤ちはる",
    "相楽伊織", "佐々木琴子", "寺田蘭世", "堀未央奈",
    "北野日奈子", "新内眞衣", "鈴木絢音", "山崎怜奈",
    "渡辺みり愛", "伊藤かりん", "伊藤純奈", "川村真洋",
    "斉藤優里", "永島聖羅", "大和里菜", "畠中清羅",
    "市來玲奈", "伊藤万理華", "中元日芽香", "宮澤成良",
    "能條愛未", "川村真洋", "和田まあや", "樋口日奈",
    # その他の病気
    "米倉涼子", "八代亜紀", "桂歌丸", "ビートたけし",
    "浜田雅功", "谷村新司", "松原みき", "南田洋子",
    "渡哲也", "森光子", "京マチ子", "山田五十鈴",
    "笠置シヅ子", "越路吹雪", "朝丘雪路", "宇津井健",
    "加藤剛", "佐藤慶", "佐藤允", "内田朝雄",
    "江見俊太郎", "成瀬昌彦", "高橋昌也", "加藤嘉",
    "北村和夫", "小沢栄太郎", "殿山泰司", "三橋達也",
    "清水将夫", "信欣三", "加東大介", "藤原釜足",
    "三木のり平", "伴淳三郎", "フランキー堺", "ハナ肇",
    "谷啓", "犬塚弘", "安田伸", "石橋エータロー",
    "植木等", "桜井センリ", "小山ルミ", "西川潔",
    "野川由美子", "中尾ミエ", "園まり", "奥村チヨ",
]


def main():
    with open(EXISTING_COMBINED, "r", encoding="utf-8") as f:
        existing = json.load(f)
    existing_names = set(d["name"] for d in existing)

    # 既存 phase2 ケースも重複対象に含める
    new_cases = []
    found = 0
    for name in CURATED_CASE_NAMES:
        if name in existing_names:
            continue
        try:
            text = get_page_text(name)
            if not text:
                print(f"  [SKIP] {name}: ページなし")
                time.sleep(REQUEST_INTERVAL)
                continue
            illnesses = extract_illness_info(text)
            birth_date = extract_birth_date(text)
            gender = extract_gender(text)
            if not (illnesses and birth_date and gender):
                reason = []
                if not illnesses: reason.append("病気情報なし")
                if not birth_date: reason.append("生年月日なし")
                if not gender: reason.append("性別不明")
                print(f"  [SKIP] {name}: {', '.join(reason)}")
                time.sleep(REQUEST_INTERVAL)
                continue
            real_name = extract_real_name(text) or name
            last_name, first_name = split_japanese_name(real_name)
            for ill in illnesses:
                new_cases.append({
                    "name": name,
                    "real_name": real_name,
                    "last_name": last_name,
                    "first_name": first_name,
                    "birth_date": birth_date,
                    "gender": gender,
                    "illness": ill["illness"],
                    "illness_category": ill["illness_category"],
                    "onset_year": ill["onset_year"],
                    "notes": f"Wikipedia「{name}」より抽出",
                    "source": "Wikipedia",
                })
            found += 1
            print(f"  [OK] {name}: {birth_date} {gender} - {', '.join(i['illness'] for i in illnesses)}")
        except Exception as e:
            print(f"  [ERR] {name}: {e}")
        time.sleep(REQUEST_INTERVAL)

    # dedupe by (name, illness)
    seen = set()
    uniq = []
    for c in new_cases:
        key = (c["name"], c["illness"])
        if key in seen:
            continue
        seen.add(key)
        uniq.append(c)

    # merge with existing phase2_cases
    if os.path.exists(OUTPUT_CASES):
        with open(OUTPUT_CASES, "r", encoding="utf-8") as f:
            prev = json.load(f)
        prev_names = set(d["name"] for d in prev)
        for c in uniq:
            if c["name"] not in prev_names:
                prev.append(c)
        uniq = prev

    with open(OUTPUT_CASES, "w", encoding="utf-8") as f:
        json.dump(uniq, f, ensure_ascii=False, indent=2)
    print(f"\n補助ケース収集: {found}名ヒット / 累計phase2ケース: {len(uniq)}名")


if __name__ == "__main__":
    main()
