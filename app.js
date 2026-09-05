const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const elements = ["木", "木", "火", "火", "土", "土", "金", "金", "水", "水"];
const yinYang = ["陽", "陰", "陽", "陰", "陽", "陰", "陽", "陰", "陽", "陰"];
const branchElements = { 子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火", 午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水" };
// 二十八元表（高尾式）: 各地支の蔵干を「前節入りからの日数」で判定（初元→中元→本元の順）
const zoukanTable = {
  子: [{ upTo: Infinity, stem: "癸" }],
  丑: [{ upTo: 9, stem: "癸" }, { upTo: 12, stem: "辛" }, { upTo: Infinity, stem: "己" }],
  寅: [{ upTo: 7, stem: "戊" }, { upTo: 14, stem: "丙" }, { upTo: Infinity, stem: "甲" }],
  卯: [{ upTo: Infinity, stem: "乙" }],
  辰: [{ upTo: 9, stem: "乙" }, { upTo: 12, stem: "癸" }, { upTo: Infinity, stem: "戊" }],
  巳: [{ upTo: 7, stem: "戊" }, { upTo: 14, stem: "庚" }, { upTo: Infinity, stem: "丙" }],
  午: [{ upTo: 19, stem: "己" }, { upTo: Infinity, stem: "丁" }],
  未: [{ upTo: 9, stem: "丁" }, { upTo: 12, stem: "乙" }, { upTo: Infinity, stem: "己" }],
  申: [{ upTo: 7, stem: "戊" }, { upTo: 14, stem: "壬" }, { upTo: Infinity, stem: "庚" }],
  酉: [{ upTo: Infinity, stem: "辛" }],
  戌: [{ upTo: 9, stem: "辛" }, { upTo: 12, stem: "丁" }, { upTo: Infinity, stem: "戊" }],
  亥: [{ upTo: 12, stem: "甲" }, { upTo: Infinity, stem: "壬" }]
};

function getZoukan(branch, daysSinceSetsuiri) {
  const segments = zoukanTable[branch];
  for (const seg of segments) {
    if (daysSinceSetsuiri <= seg.upTo) return seg.stem;
  }
  return segments[segments.length - 1].stem;
}
const starNames = ["貫索星", "石門星", "鳳閣星", "調舒星", "禄存星", "司禄星", "車騎星", "牽牛星", "龍高星", "玉堂星"];
const energyStars = [
  { name: "天報星", score: 3, text: "変化変容・気分屋・多芸多才の星。前世〜胎児期の無限の可能性を秘め、変化の多い運勢を持つ。一般的に大きな方向転換でも些細なことと受け入れ、刺激的なことが好きでちょっとやそっとのことでは動じない。同じ環境に長く留まれず、気持ちの変化が激しく周囲が根を上げるほどの気分屋。一般常識では理解できない不思議な感性を持ち、多方向に大きな可能性を秘める。器用貧乏と継続不能がネックだが、一つに絞れば大金を稼ぐ可能性も。無自覚・無反省な言動になりやすいので注意。" },
  { name: "天印星", score: 6, text: "かわいい・ユーモア・平穏・受け身の星。現世〜赤児期のエネルギーで、無邪気さとユーモアがありいるだけで人を明るくさせる。これほど人に好かれる星はなく、努力しなくても人の心を掴んで助けてもらえる。人との縁が常にあり、対人トラブルはほとんどない。過去や未来ではなく現在にフォーカスし、いま楽しいこと・やりたいことに忠実。あわてんぼうでミスは多いが憎めない愛されキャラ。援助運・引き立て運が強く、受け身でも人の力を借りて大成できる。「養子星」でもあり養子縁に縁がある。" },
  { name: "天貴星", score: 9, text: "学び・品位・お洒落の星。現世〜幼年期のエネルギーで、好奇心が旺盛で学ぶことに熱心。学んだことを人に伝えていく運勢を持つ。純粋に物事や人に向き合い、人を疑うことを知らない。自意識が高く人の目を気にするため、社会的に良くないことを徹底的に守り品位を保つ。徳の高さから常識人からの支持は高いが、反骨精神の強い人からは疎まれる。人には平等に接するべきという考えで人脈は広い。情深く現実味に欠け、考えが甘く打たれ弱い。人に騙されやすいので、信頼できる現実的な友人や家族に守ってもらうべき。向上心が強く古くからあるものや社会に浸透した概念を学ぶ保守派。美的感覚に優れファッションや芸術にも強い。金銭感覚は疎くどんぶり勘定。" },
  { name: "天恍星", score: 7, text: "奔放・タレント性・夢・恋愛の星。現世〜青少年期のエネルギーで、思春期の子どものように夢追い人で派手なものに関心がある。人との関わりの中で華々しく生きる運勢。自分に正直に生き、常に新しいものや人を求めて動く。自立心と反抗心があり一か所に縛られない。派手なもの好きで華やかな雰囲気と色気で人を魅了。夢を追うため現実味には欠け、理想と現実のギャップに悩み苦労する。キラキラしたものに憧れる感性はクリエイティブな世界や人の憧れの存在へ導く。「離郷の星」と呼ばれ遠くに羽ばたく人が多い。恋愛魅力度ナンバーワンでモテるが、束縛を嫌い移り気な面も。金運は強く一定水準以上の稼ぎに恵まれる。" },
  { name: "天南星", score: 10, text: "推進力・反骨精神・正義感の星。現世〜青年期のエネルギーで、成人したばかりのように自分と社会に夢を持って勢いのまま突き進む。恐れを知らず果敢に道を切り開き、反骨精神も旺盛なので難しそうなことにほど熱意がみなぎる。前人未到の地を開拓する才がある。正義感が強く年上や偉い人にも構わず白黒つけたがる。正義感が強すぎて批判的な態度やストレートすぎる言葉で周囲を傷つけることも。一本気で不器用、複数のことを同時にしたり複雑なことを落ち着いて考えたりするのは苦手。エネルギー消費も激しい。言語化が得意で雄弁、度胸と言葉を使う職に適性。恋愛は追うタイプで手に入らない人にほど闘志を燃やす。" },
  { name: "天禄星", score: 11, text: "堅実・安定的・冷静・理論的の星。現世〜壮年期のエネルギーで、年齢を重ねた人生経験豊富な人のように状況を冷静に見極めて安定的な生活を送る。落ち着いてどっしりとした風格を持ち、若くても大人びた重厚感がある。同年代とはしゃぐより年上や年配との交流が多い。平和で健康的、ミスや無理のない道筋を大事にし計画通りに事を運ぶ。論理的思考に基づいて意思決定し、トラブルに巻き込まれることが非常に少ない。鋭い観察眼を持ち相談事に乗ることも多く人から頼られる。責任感があり引き受けたことを投げ出さず、穏やかな性格で厚い信頼を受ける。慎重派でリスクのあるものには手を出さず、行動のテンポはゆっくりだが着実に成果を出す。サポート役やスペシャリストに向く。恋愛も慎重で友達付き合いから発展することが多い。金運は波が少なく積み上げで財を大きくする。" },
  { name: "天将星", score: 12, text: "王様的・精神力・創始者の星。現世〜頭領期のエネルギーで、経験を積んできた50代のように実力と自信、人を支える力を持ち上に立つ。十二大従星の中で一番強いエネルギーを持つ。人を率いて新しいことを始める能力があり、責任感のある立場につくことが多くリーダーや大黒柱として何かを背負える力強さがある。若いときの苦労が必要で、苦労・困難・人の痛み・悲しみ・喜びを知ることで優れたリーダーになる。甘やかされると有り余るエネルギーの使いどころが分からず不満と叱責で気苦労の多い人生に。人情に厚く表面上は穏やかだが、ワンマンにならなければ人から信頼され好かれる。「創始者の星」でゼロから作り上げることで大成できる大器晩成型。一つのことを極めるのが得意。恋愛では主導権を握りたがるタイプで、付き従う人には慈悲深い。面食いで釣り合いを気にする。" },
  { name: "天堂星", score: 8, text: "自制心・奥手・落ち着きの星。現世〜老人期のエネルギーで、60代のまだ若々しいが年を重ねた深みがある冷静さと安定感を持ち、縁の下の力持ち的存在に。温厚で常識人、目立つことを好まず堅実に力を磨く。自己表現が苦手でアピール下手。表面的なものより中身を重視し、地位や財にとらわれず精神的に充実した生活を送る。精神性の高さから年上と縁が深く、幅広い人と長期的で穏やかな関わりを保つ。経験値があっても人の上や前に立てる性分ではなく、補佐役で実力を発揮する。勤勉で真面目、規則が緩い環境は不向き。植物や動物、芸術を好みひとりの時間を大事にする。恋愛は引っ込み思案だが落ち着きと理解力で隠れファンがいる。愛情表現は苦手だが誠実で一途。金運は堅実にコツコツ貯めるタイプ。" },
  { name: "天胡星", score: 4, text: "ロマンチスト・音感・直感・感受性の星。現世〜病人期のエネルギーで、晩年の病床につく人が衰えない心と現実の狭間で揺れるように、自由な夢を抱くときと現実的な考えを抱くときの両極端な思考の間で揺れ動く。丈夫な体ではないが病気になりやすいわけではない。空想を抱いて夢に生きる人で、夢を現実化する才能がある。夢が叶って自分の利になるかは保証されないが、夢を与える人はどの世界でも必要なので居場所はある。純粋な心を持ち人と争うことを好まない。崇高な精神力で人を信じるが、感受性が強いので人の嘘には敏感。嘘をつく人からはすぐに離れる。切り替えが早くひとりの時間を大切にする。人の痛みや不調に敏感で親切、しっとりとした雰囲気でモテる。体が頑丈ではないので健康知識が高くなる傾向。感性が鋭く美意識があり、特に音に関する感性が優れ音感やリズム感に長ける。芸術の分野に縁がある。" },
  { name: "天極星", score: 2, text: "柔軟性・お人好し・解放・無欲の星。あの世〜死人期のエネルギーで、霊魂となった人のように自由かつ柔軟に飛び回る。現世から解放された自由人というポジティブな意味を持つ。欲望や喜怒哀楽、愛憎といった現世の欲から解き放たれた感覚の持ち主で、損得勘定を考えず水のように自然な流れに任せて柔軟に生きる。無欲な心はかえって強靭な精神を生み、どんな環境にも馴染む。人とも柔軟に関わり無理のない範囲で相手に合わせ、人に執着しないからこその立ち振る舞い。差別や区別もしない。鋭い感覚を持ち霊感を持つ人もおり、感性を磨いて特殊技能の世界で生きることも可能。環境を選ばずその場に馴染み、意固地な考えを持たず早い切り替えができるのでストレスをため込みづらい。第六感のような感覚に優れ、芸術や学術、哲学と相性が良い。手先が器用で創作や技術系にも向く。恋愛はフットワークが軽く流されやすい。しがらみを嫌い自分から結婚に動くことはない。" },
  { name: "天庫星", score: 5, text: "凝り性・頑固・歴史の星。あの世〜入墓期のエネルギーで、祖先との縁が強く墓守りとしての使命を持つ。祖先に守られて生き安定した環境に長く身を置く運勢。一つのことに深く熱中する凝り性で、正直さと頑固さのある性格。どっしりとして困難が立ちはだかってもしぶとく耐える。世渡り上手ではないが正直で純粋なので嫌われず孤立もしない。深く長く人付き合いをし、一度濃密な関りを持った人からの信頼は厚い。祖先との縁が強く供養をしっかりしていればピンチの時にサポートが入りどん底を経験することはない。物事をとことん詰める探求心があり関心あるものはすべて知り尽くすプロフェッショナル。特に古いものに関心があり歴史や古典の知識が深い。頑固で真面目で文化に強く文章や土地にも適性。社交性には欠けるが個性を磨き価値を高めることで周囲から求められる。恋愛は古風で浮ついていない人を好み、待ちの姿勢で付き合うと恋人一筋。金運は遺産や土地を引き継ぐタイプで時間をかけて確実に財を積み上げる。" },
  { name: "天馳星", score: 1, text: "活動家・ひらめき・救急・無欲の星。あの世〜彼岸期のエネルギーで、天の正解を馳ける存在のように俊敏で常に活動的。行動力と瞬発力のある活動的な人で、忙しくしていることが性に合っておりじっとはできない。土壇場に強くいざというときの底力は計り知れない。困難に立ち向かうことを楽しみの一つとして恐れずに向かっていく。地位や名誉、財産には無欲でお金が絡むからという理由では行動しない。お人好しで情に厚く人のために動き、報いを求めず優しさをふりまき感謝されるのもそこそこに次の目的地へ去っていく。爽やかさがあり好かれるが行動のテンポが早すぎて人はついてこれず一人行動が多くなり孤独を抱えやすい。スピードと量をまかなう活動的でスケジュールを詰め込み多忙な生活を好む。同時に複数の仕事を振られると燃え見事にこなす。追い込まれたときほど本領を発揮しタフで瞬発力がある。腰を据えて長期間同じことは向かず持続力には欠ける。恋愛はひらめきで始まり行動は早くせっかち。自由や行動を制限されるのが苦手。金運は無欲だが人のために動くことで稼げ、一発逆転的な稼ぎ方に適性。" }
];
const starTexts = {
  貫索星: {
    balanced: "自立心と頑固さ。内面のバランスが自立心を確固たるものにし、人の忠告も柔軟に取り入れられる。",
    moderate: "自立心と頑固さ。自分軸は強いが、人の忠告を聞かないと同じ失敗を繰り返す。",
    imbalanced: "自立心と頑固さ。内面の偏りが自我を硬化させ、孤立と独善が加速しやすい。"
  },
  石門星: {
    balanced: "協調と政治力。内面のバランスが社交性を円滑にし、本物の人脈を築ける。",
    moderate: "協調と政治力。人脈を作れるが、迎合しすぎると中身のない八方美人になる。",
    imbalanced: "協調と政治力。内面の偏りが対人関係のムラを生み、特定のタイプに依存した人脈しかできない。"
  },
  鳳閣星: {
    balanced: "自然体と表現。内面のバランスが表現力を豊かにし、場を自然に明るくする。",
    moderate: "自然体と表現。ゆるさは魅力だが、危機感が薄いと怠慢に見える。",
    imbalanced: "自然体と表現。内面の偏りが感情の波を激化させ、明るさと虚無感の落差が大きくなる。"
  },
  調舒星: {
    balanced: "感性と孤高。内面のバランスが感性を研ぎ澄まし、孤独を創造力に変える。",
    moderate: "感性と孤高。鋭い美意識は武器だが、被害者意識が強いと才能が刺々しさに変わる。",
    imbalanced: "感性と孤高。内面の偏りが感受性を過敏にし、世界全体が敵に見える孤独に沈みやすい。"
  },
  禄存星: {
    balanced: "包容と奉仕。内面のバランスが奉仕精神を純粋にし、見返りを求めない本物の優しさを発揮する。",
    moderate: "包容と奉仕。面倒見は良いが、承認欲求で尽くすと利用されやすい。",
    imbalanced: "包容と奉仕。内面の偏りが承認欲求を肥大化させ、尽くすことで自分を保つ依存状態に陥る。"
  },
  司禄星: {
    balanced: "堅実と蓄積。内面のバランスが堅実さを安定感に変え、長期的な信頼を築ける。",
    moderate: "堅実と蓄積。安定志向は強みだが、変化を拒むと機会を失う。",
    imbalanced: "堅実と蓄積。内面の偏りが変化への恐怖を極限化し、現状維持に執着して成長が止まる。"
  },
  車騎星: {
    balanced: "行動と競争。内面のバランスが行動力に持続力を与え、感情に流されない突破を実現する。",
    moderate: "行動と競争。突破力はあるが、短気だと人間関係を壊す。",
    imbalanced: "行動と競争。内面の偏りが短気と攻撃性を増幅し、周囲を巻き込む爆発を起こしやすい。"
  },
  牽牛星: {
    balanced: "責任と名誉。内面のバランスが品格を内面から支え、真の尊敬を集める。",
    moderate: "責任と名誉。品格を重んじるが、見栄で動くと本質を見失う。",
    imbalanced: "責任と名誉。内面の偏りが面目への執着を強め、見栄と実力の乖離が目立つようになる。"
  },
  龍高星: {
    balanced: "改革と冒険。内面のバランスが独創性を安定した変革力に変え、継続的な革新を実現する。",
    moderate: "改革と冒険。独創性は高いが、飽きて壊すだけなら信用されない。",
    imbalanced: "改革と冒険。内面の偏りが衝動性を極限化し、離脱を繰り返し落ち着きに欠ける傾向になる。"
  },
  玉堂星: {
    balanced: "知性と伝統。内面のバランスが知性を実践力に結びつけ、学んだことを現実で活かせる。",
    moderate: "知性と伝統。学習力は強いが、理屈で逃げると現場感覚が育たない。",
    imbalanced: "知性と伝統。内面の偏りが理屈への依存を深め、頭でっかちで行動できない評論家タイプになる。"
  }
};

// 相性鑑定用：Aから見たBの主星が表す「相手の存在感」
const starRelationTexts = {
  貫索星: {
    good: "自分の軸を曲げない人。頼りになるが、譲らない頑固さにイライラすることも。",
    moderate: "一人で生きられる強さがある。ただ、自分のやり方を押し通すので、歩み寄りが必要な場面で壁になる。",
    bad: "頑固で自分の世界に閉じこもる。話し合いが成立しないことが最大のストレス。"
  },
  石門星: {
    good: "誰とでも打ち解ける社交的な人。一緒にいて安心感がある。",
    moderate: "人当たりが良いが、誰にでも優しいので「自分だけ特別」感が出にくい。",
    bad: "八方美人で本音が見えない。自分の気持ちより空気を読むため、信頼しづらい。"
  },
  鳳閣星: {
    good: "一緒にいて楽しくリラックスできる。ムードメーカー的存在。",
    moderate: "明るくて楽しいが、危機感が薄く責任を先延ばしにする傾向がある。",
    bad: "ゆるすぎて頼りにならない。いざという時に逃げるのではないか不安になる。"
  },
  調舒星: {
    good: "ミステリアスで惹きつけられる。一緒に深い世界を味わえる特別な人。",
    moderate: "鋭い感性は魅力的だが、繊細すぎて気を使う。機嫌の波に振り回されやすい。",
    bad: "感情の波が激しく、何が気に入らないのか分からない。一緒にいて疲れる。"
  },
  禄存星: {
    good: "包容力があって安心する。尽くしてくれる優しさに癒やされる。",
    moderate: "面倒見は良いが、全員に優しいので独占感を持ちにくい。",
    bad: "見返りを求めて尽くす傾向がある。「やってあげた」が重荷になる。"
  },
  司禄星: {
    good: "堅実で信頼できる。地に足がついた生活感に安心感を覚える。",
    moderate: "安定志向は嬉しいが、変化を嫌うので新しいことを始めにくい。",
    bad: "保守的すぎて冒険がない。堅苦しさが息苦しく感じる。"
  },
  車騎星: {
    good: "さっぱりして裏表がない。情に厚く、損得抜きで付き合える。",
    moderate: "ストレートで分かりやすいが、短気な面に振り回される。",
    bad: "感情的で爆発しやすい。言い争いが多く、穏やかな時間が少ない。"
  },
  牽牛星: {
    good: "真面目で品がある。知的な会話ができ、尊敬できる相手。",
    moderate: "品格はあるが、見栄を気にするので素の自分を見せにくい。",
    bad: "プライドが高すぎて素直になれない。意地を張り合って溝が深まる。"
  },
  龍高星: {
    good: "予測不能で刺激的。一緒にいると日常が冒険になる。",
    moderate: "独創性は魅力的だが、飽きっぽくて継続力がない。",
    bad: "自由奔放すぎて信用できない。いつ離れていくか不安がつきまとう。"
  },
  玉堂星: {
    good: "知的で落ち着いている。話が通じ、精神的に深いつながりを感じる。",
    moderate: "学習力はあるが、理屈っぽくて感情のやり取りが希薄になりがち。",
    bad: "頭でっかちで現場感覚がない。理論ばかりで行動が伴わない。"
  }
};

// === 五行バランス判定ヘルパー ===
// countsから五行の偏りを判定し、テキスト選択に使用するタイプを返す
function getBalanceType(counts) {
  const vals = Object.values(counts);
  const balance = Math.max(...vals) - Math.min(...vals);
  if (balance <= 1) return "balanced";
  if (balance <= 3) return "moderate";
  return "imbalanced";
}
// テキストが文字列ならそのまま返し、オブジェクトならbalanceTypeに応じたテキストを返す
function pickByBalance(text, balanceType) {
  if (typeof text === "string") return text;
  if (text === null || text === undefined) return "";
  return text[balanceType] || text.moderate || text.balanced || "";
}

const tenchusatsuMap = ["戌亥", "申酉", "午未", "辰巳", "寅卯", "子丑"];

// === 結婚・離婚・浮気（不倫）鑑定用データ ===
// 陰陽ペア（同じ五行の陽干支×陰干支）: 二度縁（二度の結婚運）の判定に使用
const yinYangPairStar = {
  貫索星: "石門星", 石門星: "貫索星",
  鳳閣星: "調舒星", 調舒星: "鳳閣星",
  禄存星: "司禄星", 司禄星: "禄存星",
  車騎星: "牽牛星", 牽牛星: "車騎星",
  龍高星: "玉堂星", 玉堂星: "龍高星"
};

// 配偶者宮（日支）の十二大従星が示す家庭運の傾向
const spouseEnergyTexts = {
  天報星: { balanced: "家庭に落ち着きが出にくいが内面のバランスがきまぐれを抑え、パートナーを振り回さない。不安も軽度に抑えられる。", moderate: "家庭に落ち着きが出にくく、きまぐれで気分が変わりやすい。本人は無自覚だが、パートナーは振り回されやすい。不安に襲われた時は「大丈夫」と根拠を示して支えることが一番の良薬。", imbalanced: "内面の偏りがきまぐれを極限化し、家庭内で気分が変わりやすくパートナーを振り回しがち。" },
  天印星: { balanced: "配偶者や家庭環境に適応しやすい。内面のバランスが主体性も保ち、依存癖を抑えて家庭運を安定させる。", moderate: "配偶者や家庭環境に適応しやすいが、中身が環境で決まるため自分の意志が薄れやすい。依存癖が出ると関係が冷める。今を堅実に生きることで家庭運は安定する。", imbalanced: "内面の偏りが依存癖を極限化し、自分の意志が薄れやすく関係が冷めやすい。" },
  天貴星: { balanced: "配偶者にも品を求めやすいが内面のバランスがプライドを適度に保ち、気負いで隠さずに済む。", moderate: "配偶者にも品や見栄を求めやすい。プライドの裏側に弱さと不安があり、気負いで隠そうとする。従順さは自信のなさから来るもので、成長とともに変化する。", imbalanced: "内面の偏りがプライドを極限化し、気負いで弱さを隠し独善的になりやすい。" },
  天恍星: { balanced: "外の刺激に気持ちが向きやすいが内面のバランスが落ち着く力も与え、マンネリを適度に解消できる。", moderate: "家庭より外の刺激に気持ちが向きやすい。落ち着くと居心地の悪さを感じ、脱皮したくなる想念が湧く。マンネリを最も嫌い、冒険心が家庭を離れる方向に働く。", imbalanced: "内面の偏りが刺激への欲求を極限化し、冒険心が家庭を離れる方向に働きやすい。" },
  天南星: { balanced: "家庭内でも前進・変化を求める。内面のバランスが不器用さを柔軟性で補い、摩擦を減らして長く続く関係を作る。", moderate: "家庭内でも前進・変化を求める。自分を曲げられない不器用さが摩擦を生むが、一本気な性質は長く続く関係を作る。安定を窮屈に感じると外へ目が向く。", imbalanced: "内面の偏りが不器用さを極限化し、摩擦が増えやすく安定を窮屈に感じて外へ目が向きやすい。" },
  天禄星: { balanced: "家庭を守る堅実さと生存本能が基盤。内面のバランスが安全策と適度な刺激のバランスを取り、家庭運を安定して築く。", moderate: "家庭を守る堅実さと生存本能が基盤。健康と経済の安定を最優先し、地味な積み重ねで家庭運を築く。ただし安全策に逃げて刺激不足になりやすい。", imbalanced: "内面の偏りが安全策への逃避を極限化し、刺激不足で家庭運が停滞しやすい。" },
  天将星: { balanced: "家庭でも主導権を握りたがる。内面のバランスが自我を健全なリーダーシップに変え、家庭運や子供運にも良い影響を与える。", moderate: "家庭でも主導権を握りたがる。自我と頑固さが極めて強く、自分の意志を押し通す。強すぎるエネルギーが家庭運や子供運に影響することも。高い教養で自我に出処進退が加わると安定する。", imbalanced: "内面の偏りが自我を極限化し、強すぎるエネルギーが家庭運や子供運に影響を与えやすくなる。" },
  天堂星: { balanced: "家庭では落ち着いた観察者で自制心が強い。内面のバランスが適度な自己主張も可能にし、相手の寂しさを防ぐ。", moderate: "家庭では落ち着いた観察者で自制心が強い。一歩下がって相手を立てるが、底には単独行動を好む頑固さがある。同年代・同性の環境では居心地の悪さを感じ、冷めた態度が続くと相手が寂しさを覚える。", imbalanced: "内面の偏りが自制心を行き過ぎさせ、冷めた態度が続き相手が寂しさを覚えやすい。" },
  天胡星: { balanced: "家庭内でも繊細だが内面のバランスが現実感覚を保ち、周囲と足並みを揃えられる。希望を持ち続けられる。", moderate: "家庭内でも繊細で現実を居場所にできない。時間を超越した発想で周囲と足並みが揃わず孤独感を感じやすい。希望が燃料なので未来が閉ざされると外に慰めを求める危険がある。", imbalanced: "内面の偏りが現実逃避を極限化し、未来が閉ざされると外に慰めを求めて家庭が不安定になりやすい。" },
  天極星: { balanced: "環境に合わせて心を作るため家庭に適応する。内面のバランスが主体性も与え、環境が揺らぐ時にも立て直せる。", moderate: "環境に合わせて心を作るため、結婚相手や家庭環境に適応するが主体性が薄い。環境が持続すると出来上がった思考や行動パターンを繰り返し、発想の転換がきかない。環境が揺らぐと立て直す力が弱い。", imbalanced: "内面の偏りが環境依存を極限化し、環境が揺らぐと立て直す力が失われやすい。" },
  天庫星: { balanced: "家庭に執着し過去を引きずりやすい。内面のバランスが執着を健全な深掘りに変え、家族との協調も保つ。", moderate: "家庭に執着し過去を引きずりやすい。自分で決めた道を突き進む頑固さで、連結のない思考が家族との協調を難しくする。二度目の家庭を持つ宿命とも言われる。", imbalanced: "内面の偏りが執着を極限化し、連結のない思考で家族との協調が崩れやすい。" },
  天馳星: { balanced: "家庭内でも瞬発的だが内面のバランスが点的今の連続にまとまりを与え、継続的な関係設計を可能にする。", moderate: "家庭内でも瞬発的・気分屋で、点的今の連続でまとまりを作れない。動けない環境だと健康を損ないやすい。継続的な関係設計を怠ると家庭が不安定になりやすい。", imbalanced: "内面の偏りが分裂を極限化し、まとまりがなく継続的な関係設計ができず家庭が不安定になりやすい。" }
};

// 十大主星別の恋愛傾向（本質・人生観を表す中央の主星を基準に判定）
const loveTendencyTexts = {
  貫索星: {
    balanced: "一途で情熱的。内面のバランスが束縛を適度に緩め、お互いの自立を尊重できるパートナーシップを築ける。",
    moderate: "一途で情熱的。好きになったら真っ直ぐに気持ちを伝えます。束縛を嫌う一方で、自分も相手を束縛しがち。お互いの自立を尊重できるパートナーとの相性が良いでしょう。",
    imbalanced: "一途だが内面の偏りが独占欲を極限化し、束縛がエスカレートして相手を圧迫しがち。"
  },
  石門星: {
    balanced: "穏やかで安定した関係を築くのが得意。内面のバランスが異性の友人が多くても誤解されない距離感を保てる。",
    moderate: "穏やかで安定した関係を築くのが得意。相手の気持ちに寄り添い、自然体で付き合えるタイプです。社交的なため異性の友人が多く、パートナーから誤解されることも。",
    imbalanced: "内面の偏りが社交性をエスカレートさせ、異性の友人との距離感が曖昧になってパートナーの誤解を招きやすい。"
  },
  鳳閣星: {
    balanced: "オープンで裏表のない性格が異性からの人気を集める。内面のバランスが軽さと誠実さのバランスを取り、本物の信頼を築ける。",
    moderate: "オープンで裏表のない性格が、異性からの人気を集めます。一緒にいると楽しいと感じさせるタイプで、笑顔とユーモアで相手の心を開かせます。",
    imbalanced: "内面の偏りが軽さをエスカレートさせ、楽しさだけで関係を作って深いつながりが育たない。"
  },
  調舒星: {
    balanced: "ロマンチストで理想が高い。内面のバランスが理想と現実のギャップを埋め、深いつながりを現実でも育める。",
    moderate: "ロマンチストで、理想のパートナー像を強く持っています。表面的な関係では満足できず、精神的な深いつながりを求めます。一度恋に落ちると、激しい情熱を注ぎます。",
    imbalanced: "内面の偏りが理想を極限化し、現実のパートナーに必ず失望し、激しい情熱が執着に変わる。"
  },
  禄存星: {
    balanced: "惜しみない愛情を注ぐタイプ。内面のバランスが見返りを求めない純粋な愛情を可能にし、相手に負担をかけない。",
    moderate: "惜しみない愛情を注ぐタイプです。プレゼントやサプライズで相手を喜ばせることが大好きで、愛情表現がとてもストレート。尽くしすぎて「重い」と感じられることもあります。",
    imbalanced: "内面の偏りが愛情の重さを極限化し、尽くしすぎて相手を圧迫し、見返りがないと不満が蓄積しやすい。"
  },
  司禄星: {
    balanced: "安定した家庭的な関係を求める。内面のバランスが安定と変化のバランスを取り、マンネリを防げる。",
    moderate: "安定した家庭的な関係を求めます。派手な恋より、日常の中で信頼を積み重ねていく穏やかな愛情を好みます。安定した関係を築くのを得意とする星です。",
    imbalanced: "内面の偏りが安定への執着を強め、変化を恐れて関係がマンネリ化しやすくなる。"
  },
  車騎星: {
    balanced: "ストレートに気持ちを伝える情熱家。内面のバランスが情熱に持続力を与え、忙しくてもパートナーとの時間を大切にできる。",
    moderate: "ストレートに気持ちを伝える情熱家です。好きになったら猪突猛進で、駆け引きは得意ではありません。忙しさに追われてパートナーとの時間を疎かにしがちな面も。",
    imbalanced: "内面の偏りが情熱を短絡化させ、勢いで突っ走ってすぐ冷め、パートナーとの時間を後回しにしがち。"
  },
  牽牛星: {
    balanced: "品のある大人の恋愛を好む。内面のバランスがプライドを適度に保ちつつ素直になれる瞬間も作れる。",
    moderate: "品のある大人の恋愛を好みます。教養があり、マナーを大切にする相手に惹かれます。自分も相手も高め合える関係を理想とします。",
    imbalanced: "内面の偏りがプライドを極限化し、素直になれずすれ違いが深刻化して関係が不安定になりやすい。"
  },
  龍高星: {
    balanced: "自由を大切にし、束縛を最も嫌う。内面のバランスが自由と安定を両立し、刺激的な関係でも落としどころを見つけられる。",
    moderate: "自由を大切にし、束縛を最も嫌う主星です。国際恋愛や遠距離恋愛にも抵抗がなく、むしろ刺激的な関係を楽しみます。旅先での出会いがきっかけで恋が始まることも多いでしょう。",
    imbalanced: "内面の偏りが自由への執着を極限化し、関係が落ち着くと即座に逃げ出し、束縛されると距離を置きたくなる。"
  },
  玉堂星: {
    balanced: "知的なつながりを重視する。内面のバランスが知性を行動に結びつけ、長い時間をかけて育む愛情を行動で示せる。",
    moderate: "知的なつながりを重視するタイプです。本や映画、芸術について語り合える相手、精神的な深さを持つ相手に強く惹かれます。急な展開は苦手で、長い時間をかけて育む穏やかな愛情を好みます。",
    imbalanced: "内面の偏りが知的な会話に逃避させ、考えすぎて行動が常に遅くチャンスを逃しがち。"
  }
};

// 十大主星別の恋愛対象タイプ（本質を表す中央の主星を基準に判定）
const loveTypeTexts = {
  貫索星: {
    like: "自立していて自分の意見をしっかり持つ、ぶれない強さのある人に惹かれやすい。",
    dislike: "自分の意見を言わず周囲に合わせるだけの人。何を聞いても『みんなに合わせる』で返してくる人は、会話が深まらないので恋愛対象に入りにくい。",
    marriage: "価値観の違いを尊重し合い、お互いの自立を認め合える人。束縛せず信頼で繋がれる相手が理想。"
  },
  石門星: {
    like: "誰とでも自然に打ち解けられる、社交的で明るい人に惹かれやすい。",
    dislike: "『友達は少ない方がいい』と豪語する人や、恋人の交友関係にいちいち口出しする人。人脈は命綱なので、それを制限しようとする人は即NG。",
    marriage: "友人や家族とも良い関係を築ける、社交性を認め合えるオープンな人。"
  },
  鳳閣星: {
    like: "一緒にいて楽しい、笑わせてくれる明るい人に惹かれやすい。",
    dislike: "デートのたびに『これ意味ある？』と効率を気にする人や、冗談を言っても真に受けて解説し始める人。楽しさを削ぐ相手は存在意義がない。",
    marriage: "一緒にいて笑いが多く、日常を楽しめる、明るく前向きな人。"
  },
  調舒星: {
    like: "独自の世界観を持つ、感性豊かでミステリアスな人に惹かれやすい。",
    dislike: "『趣味で食べていけるの？』と現実面でしか物事を測る人や、相手が泣いているのに『で、どうしたいの？』と解決案ばかり出す人。感性を理解しない人は心を開けない。",
    marriage: "精神的なつながりを大切にでき、感性を共有できる、深い理解者になれる人。"
  },
  禄存星: {
    like: "頼ってくれる、素直に感謝を伝えてくれる人に惹かれやすい。",
    dislike: "毎食『美味しいね』と言わない人や、プレゼントをもらっても『うん、ありがとう』だけで終わらせる人。感謝の言葉で動くタイプなので、それがないと何もしたくなくなる。",
    marriage: "尽くした分だけ愛情を返してくれる、思いやりのキャッチボールができる人。"
  },
  司禄星: {
    like: "誠実で堅実、地に足のついた生活を送る人に惹かれやすい。",
    dislike: "給料日前に『お金ない』と毎月言う人や、貯金ゼロでも『なんとかなる』と言う人。堅実さに安心感を覚えるため、金銭感覚の緩い人は最初から候補に入れない。",
    marriage: "家庭を大切にし、コツコツと将来を一緒に築いていける、経済観念の合う人。"
  },
  車騎星: {
    like: "ストレートで裏表がなく、行動力のある人に惹かれやすい。",
    dislike: "『今日は何食べたい？』→『なんでもいい』→『じゃあラーメン』→『ラーメンじゃなくてもいい』となる人。スピード感が命なので、決断しない相手には苛立ちしか感じない。",
    marriage: "お互いに正直で、困難があっても一緒に前へ進んでいける、まっすぐな人。"
  },
  牽牛星: {
    like: "教養があり、礼儀や品を大切にする人に惹かれやすい。",
    dislike: "初対面でタメ口を使う人や、高級店でスマホをいじる人。品とけじめで人を測るので、そういう細かい所作が崩れている人は最初から恋愛対象に入りにくい。",
    marriage: "お互いを高め合える、知性と気品を兼ね備えた、対等なパートナーになれる人。"
  },
  龍高星: {
    like: "個性的で自由な発想を持つ、束縛しない人に惹かれやすい。",
    dislike: "『今どこにいるの？』『誰といるの？』と毎時間連絡してくる人や、スマホの画面を覗き込む人。自由を制限されることは苦痛でしかない。",
    marriage: "お互いの自由を尊重し合い、それぞれのペースを認め合える、束縛しないパートナー。"
  },
  玉堂星: {
    like: "知的な会話ができる、学び続ける姿勢のある人に惹かれやすい。",
    dislike: "『本なんて読まなくても生きていける』と言う人や、ニュースを一切見ない人。知的好奇心が原動力なので、それを共有できない相手との会話は砂を噛むように退屈。",
    marriage: "知的好奇心を共有し、穏やかに長く一緒に成長していける、精神的に安定した人。"
  }
};

// 十大主星別の浮気・不倫傾向（西＝配偶者との関係性が現れる場所の主星を基準に判定）
const affairTendencyTexts = {
  貫索星: {
    balanced: "一度好きになった相手への忠誠心は強い。内面のバランスが執着を緩め、不倫状態に陥っても早く決断できる。",
    moderate: "一度好きになった相手への忠誠心は強いが、意地とプライドで別れられず不倫状態が長引きやすい。",
    imbalanced: "内面の偏りが執着を極限化し、意地とプライドで別れられず不倫状態が非常に長引きやすい。"
  },
  石門星: {
    balanced: "社交性は高いが、内面のバランスが距離感を保ち、誤解や火遊びに巻き込まれにくい。",
    moderate: "誰にでも良い顔をする社交性が裏目に出て、誤解や火遊びに巻き込まれやすい。",
    imbalanced: "内面の偏りが八方美人を極限化し、誰にでも良い顔して誤解や火遊びに常態的に巻き込まれる。"
  },
  鳳閣星: {
    balanced: "モテやすいが、内面のバランスが罪悪感を適度に保ち、複数の関係を並行させない。",
    moderate: "楽天的でモテやすく、罪悪感が薄いまま複数の関係を並行させやすい。",
    imbalanced: "内面の偏りが罪悪感を感じにくくさせ、複数の関係を平気で並行させる。"
  },
  調舒星: {
    balanced: "一途で情熱的。内面のバランスが孤独感を健全な創造力に変え、刺激的な恋に逃げない。",
    moderate: "一途で情熱的だが、孤独感や被害者意識から刺激的な恋に逃げやすい。",
    imbalanced: "内面の偏りが孤独感を極限化し、被害者意識から刺激的な恋に常に逃げ込む。"
  },
  禄存星: {
    balanced: "頼られると尽くす性質があるが、内面のバランスが同情と愛情の境界を保てる。",
    moderate: "頼られると尽くしてしまう性質から、同情がいつの間にか愛情に変わりやすい。",
    imbalanced: "内面の偏りが同情を愛情に変える傾向を極限化し、頼られると常に尽くして不倫に陥る。"
  },
  司禄星: {
    balanced: "堅実だが、内面のバランスがマンネリを防ぎ、外の刺激に流されない。",
    moderate: "堅実な反面、家庭が安定しすぎるとマンネリを感じ、外の刺激に流されることがある。",
    imbalanced: "内面の偏りがマンネリへの不満を極限化し、外の刺激に簡単に流される。"
  },
  車騎星: {
    balanced: "情熱的で行動が早い。内面のバランスが衝動を抑え、不倫関係に走らない判断力を保てる。",
    moderate: "情熱的で行動が早く、勢いと直感で不倫関係を始めてしまいやすい。",
    imbalanced: "内面の偏りが衝動性を極限化し、勢いと直感で不倫関係を頻繁に始めてしまう。"
  },
  牽牛星: {
    balanced: "プライドは高いが、内面のバランスが隠れ事をせず、問題が起きても正直に対処できる。",
    moderate: "プライドが高く隠れて動くため、発覚すると徹底的に隠そうとして事態を悪化させる。",
    imbalanced: "内面の偏りがプライドを極限化し、発覚すると徹底的に隠そうとして事態を最悪に悪化させる。"
  },
  龍高星: {
    balanced: "束縛を嫌うが、内面のバランスが自由と責任のバランスを取り、複数愛に走らない。",
    moderate: "束縛を最も嫌う星で、自由度の高い関係に惹かれやすい。海外・遠距離の恋にも抵抗がない。",
    imbalanced: "内面の偏りが自由への執着を極限化し、複数の関係を許容しがちで、束縛を苦手とする。"
  },
  玉堂星: {
    balanced: "理性的だが、内面のバランスが孤独に強く、精神的な繋がりを外に求めない。",
    moderate: "理性的だが孤独に弱く、精神的な繋がりを外に求めやすい。",
    imbalanced: "内面の偏りが孤独への脆弱さを極限化し、精神的な繋がりを常に外に求めて不倫に走る。"
  }
};

// 十大主星別の恋愛時の具体的な行動パターン
const loveBehaviorTexts = {
  貫索星: {
    approach: "駆け引きをせず正面から直球で気持ちを伝える。相手の反応が薄いと、意地で引いてしまうこともある。",
    date: "初対面の場所より、行きつけの落ち着いた店を好む。サプライズより誠実な行動の積み重ねで信頼を築く。",
    contact: "会った時の充実度を重視し、連絡はマメでなくても平気。用件がなければ連絡しないタイプ。",
    jealousy: "相手を束縛しないが、自分が束縛されるのは嫌う。信じた相手には深く尽くし、浮気の心配は少ない。"
  },
  石門星: {
    approach: "自然な流れで距離を詰めるのが得意。複数人から誘われることも多く、告白よりも空気で進む。",
    date: "みんなで集まる場からカップルに発展しやすい。人が多い場所でも自然体で楽しめる。",
    contact: "マメで気軽な連絡を好む。社交的なネットワークをそのまま恋愛にも活かす。",
    jealousy: "誤解されやすい行動が多いが本人に浮気心は薄い。説明不足だと相手に疑われやすいので注意。"
  },
  鳳閣星: {
    approach: "明るく誘って自然に仲良くなる。告白よりムードで関係が進むことが多い。",
    date: "食事・旅行など楽しいイベントを重視。デートの計画に力を入れる。",
    contact: "気分次第で連絡量が変わる。忙しいと連絡が滞りやすいが悪気はない。",
    jealousy: "あっさりしていて根に持たないが、飽きるとフェードアウトしがちな面も。"
  },
  調舒星: {
    approach: "なかなか自分から動かず、じっくり距離を詰めてから重みのある告白をする。",
    date: "二人だけの空間や芸術的な場所を好む。人混みより静かな時間を重視。",
    contact: "既読・返信の速さに敏感で、連絡の温度差に一喜一憂しやすい。",
    jealousy: "独占欲が強く、被害者意識が出ると疑心暗鬼になりやすい。放っておかれると特に不安定になる。"
  },
  禄存星: {
    approach: "世話を焼きながら距離を詰める。プレゼントや気配りで相手の心を掴む。",
    date: "記念日やサプライズを大事にする。贅沢な演出で愛情を表現したがる。",
    contact: "マメに気遣いの連絡をする。既読無視や返信の遅さに傷つきやすい。",
    jealousy: "尽くしすぎて依存されるのを恐れる反面、自分も相手に依存しがち。"
  },
  司禄星: {
    approach: "急がずゆっくり関係を育てるタイプ。告白は控えめで様子を見ながら進める。",
    date: "自宅デートや日常的な時間の共有を重視。派手なイベントより積み重ねを好む。",
    contact: "決まったリズムで安定した連絡をする。連絡が突然乱れると不安になる。",
    jealousy: "変化を怖がるため、関係が停滞したり相手の態度が変わると強い不安を感じる。"
  },
  車騎星: {
    approach: "好きになったら即行動。駆け引きなしの猪突猛進な告白をする。",
    date: "アクティブなデートを好み、スポーツや外出など体を動かす予定を入れたがる。",
    contact: "連絡は用件のみで簡潔。忙しいと後回しになりがちで、マメさは苦手。",
    jealousy: "短気で嫉妬もすぐ言葉に出すが、後には引かずさっぱりしている。"
  },
  牽牛星: {
    approach: "品を保ちながら段階を踏んで進める。軽い誘いや投げやりなアプローチは避ける。",
    date: "高級感や特別感のある場所を好む。TPOに合わせた振る舞いを大切にする。",
    contact: "マナーを守った丁寧な連絡を好み、乱れた言葉遣いや軽い連絡は嫌う。",
    jealousy: "プライドが高く嫉妬を表に出しにくいが、面子を潰されると激しく怒る。"
  },
  龍高星: {
    approach: "刺激的な出会いから一気に距離を詰める。旅先や非日常のシチュエーションで告白することが多い。",
    date: "遠出・海外・非日常体験を好む。マンネリを避け、常に新しい刺激を求める。",
    contact: "連絡は不規則。束縛されると感じると既読を返さなくなることがある。",
    jealousy: "束縛を最も嫌う星。疑われたり詰められたりすると、すぐに距離を置く傾向がある。"
  },
  玉堂星: {
    approach: "知的な会話を重ねてゆっくり関係を深める。焦らず時間をかけて心を開く。",
    date: "図書館・美術館・映画など知的な時間を共有できるデートを好む。",
    contact: "丁寧で穏やかな連絡を好み、短くても言葉を選んで気持ちを伝える。",
    jealousy: "表には出しにくいが内心は繊細。孤独を感じると寂しさを一人で溜め込みやすい。"
  }
};

// 十大主星別の性癖・性的傾向（構造化データ）
const sexTendencyTexts = {
  貫索星: {
    keyword: "一途・独占欲",
    summary: "信頼した相手には深く没頭するが、裏切りは許さない",
    traits: ["肉体関係でも自分のペースを守りたがる", "相手を自分のものにしたい欲求が強い", "ベッドでも主導権を握りたがる"],
    caution: "裏切りに対して厳しすぎる面がある"
  },
  石門星: {
    keyword: "柔軟・ムード重視",
    summary: "ムードや雰囲気を重視し、スキンシップで安心感を求める",
    traits: ["相手に合わせる型で柔軟", "スキンシップを通じて安心感を求める", "本命には従順"],
    caution: "複数の関係に巻き込まれやすい面がある"
  },
  鳳閣星: {
    keyword: "楽しさ・オープン",
    summary: "心地よさを重視し、新しいことにも興味がある",
    traits: ["楽しさと心地よさを最優先", "新しいプレイやシチュエーションに興味がある", "性的なことにもオープン"],
    caution: "飽きっぽく、マンネリになると外に刺激を求めやすい"
  },
  調舒星: {
    keyword: "精神重視・繊細",
    summary: "精神的な繋がりが性的満足度に直結する",
    traits: ["雰囲気や演出にこだわる", "独占欲が強い", "信頼関係が前提"],
    caution: "相手が自分だけを見ていないと冷める。傷つきやすいため配慮が必要"
  },
  禄存星: {
    keyword: "奉仕・尽くす",
    summary: "相手の喜びが自分の喜び。スキンシップで愛情を表現",
    traits: ["相手に尽くすことで満足を感じる", "スキンシップを愛情表現の最優先手段とする", "相手の喜びを自分の喜びとして受け取る"],
    caution: "尽くしすぎて相手を甘やかし、依存関係になりやすい"
  },
  司禄星: {
    keyword: "控えめ・安定",
    summary: "日常の中でのスキンシップを重視。派手さより安心感",
    traits: ["控えめで安定を好む", "日常の中での触れ合いを重視", "パートナーが固定されれば安定"],
    caution: "変化を嫌うため、新しさを求める相手とはミスマッチ"
  },
  車騎星: {
    keyword: "情熱・ストレート",
    summary: "肉体的な魅力を率直に大切にする",
    traits: ["情熱的で性的欲求が強い", "勢いで関係を進める", "駆け引きなしのストレートさ"],
    caution: "すぐ燃え上がるが冷めるのも早い。忙しさでパートナーを放置しがち"
  },
  牽牛星: {
    keyword: "品・TPO重視",
    summary: "マナーとTPOを大切にし、相手の気持ちを尊重する",
    traits: ["品と格式を重んじる", "相手の気持ちを尊重する", "性的にもマナーを大切にする"],
    caution: "プライドが高く、軽薄な振る舞いやプライドを傷つけられると冷める"
  },
  龍高星: {
    keyword: "自由・非日常",
    summary: "型にはまらず、非日常的なシチュエーションに興味がある",
    traits: ["自由と刺激を求める", "非日常的なシチュエーションに興味がある", "束縛を嫌いオープンな関係を好む"],
    caution: "好奇心が新しい関係に向きやすい面がある"
  },
  玉堂星: {
    keyword: "知的・精神重視",
    summary: "会話や精神的な交流があってこそ肉体関係が深まる",
    traits: ["知的な繋がりが性的魅力に直結する", "相手の内面を理解してから一歩踏み出す", "理性的で焦らない"],
    caution: "理屈で感情を抑えがち。相手にとって物足りなさを感じさせる可能性"
  }
};

// 浮気・不倫リスク指数の計算用ベーススコア（西＝配偶者との関係性が現れる場所の主星）
const affairBaseScore = {
  貫索星: 28, 石門星: 62, 鳳閣星: 72, 調舒星: 58, 禄存星: 25,
  司禄星: 12, 車騎星: 65, 牽牛星: 18, 龍高星: 78, 玉堂星: 10
};

// 配偶者宮（日支）の十二大従星による加減点
const affairEnergyAdjust = {
  天報星: 8, 天印星: -8, 天貴星: 0, 天恍星: 20, 天南星: 15,
  天禄星: -15, 天将星: 15, 天堂星: -15, 天胡星: 15, 天極星: -8,
  天庫星: -15, 天馳星: 20
};

// 他の主星による浮気・不倫への影響度
const affairStarInfluence = {
  貫索星: -8, 石門星: 8, 鳳閣星: 15, 調舒星: 8, 禄存星: 0,
  司禄星: -8, 車騎星: 15, 牽牛星: -8, 龍高星: 18, 玉堂星: -12
};

// 日干の陰陽による浮気傾向（陽干は外向的で行動力が高い）
const affairYinYangAdjust = {
  "甲": 8, "丙": 12, "戊": 5, "庚": 8, "壬": 10,
  "乙": -5, "丁": 3, "己": -8, "辛": -5, "癸": -3
};

function getAffairRiskScore({ westStar, spouseEnergyName, isDoubleEn, hasAbnormal, hasTopThreeAbnormal, centerStar, northStar, southStar, eastStar, dayStem, gogyoBalance, dayElement, tenchusatsu, topologyNames, weakestGogyo, balanceType, gender }) {
  let score = affairBaseScore[westStar] ?? 30;
  score += affairEnergyAdjust[spouseEnergyName] ?? 0;
  // --- 統計的知見に基づく調整（166名芸能人データ、ロジスティック回帰 AUC=0.79）---
  // 従来: isDoubleEn +20, hasAbnormal +15 → 統計では保護的（OR<1）
  if (isDoubleEn) score -= 4;   // OR=0.45, p=0.037 (保護)
  if (hasAbnormal) score -= 5;  // OR=0.50, p=0.020 (保護、離婚分析)
  if (hasTopThreeAbnormal) score += 15;  // 传统維持（統計データなし）
  // 中央（本質）の主星の影響
  score += affairStarInfluence[centerStar] ?? 0;
  // 北（表に出やすい面）の主星の影響
  score += (affairStarInfluence[northStar] ?? 0) * 0.6;
  // 南（内面）の主星の影響
  score += (affairStarInfluence[southStar] ?? 0) * 0.5;
  // 東（行動・外面）の主星の影響
  score += (affairStarInfluence[eastStar] ?? 0) * 0.7;
  // 日干の陰陽による調整
  score += affairYinYangAdjust[dayStem] ?? 0;
  // 五行バランス: 統計では balance_high が保護的(OR=0.49)、balance_moderate がリスク(OR=5.19)
  if (gogyoBalance !== undefined && gogyoBalance >= 4) score -= 4;  // balance_high: 保護
  else if (gogyoBalance !== undefined && gogyoBalance >= 3) score -= 2;  // balance_high寄り: 軽微保護
  else if (gogyoBalance !== undefined && gogyoBalance <= 1) score -= 5;  // 従来維持
  // balance_moderate (gogyoBalance=2) はリスク +8
  if (balanceType === "moderate") score += 8;  // OR=5.19, p<0.001
  // --- 新規統計パラメータ ---
  // 日干五行「水」は保護的 (OR=0.28, p=0.004)
  if (dayElement === "水") score -= 6;
  // 天中殺「寅卯」はリスク (OR=2.44, p=0.032)
  if (tenchusatsu === "寅卯") score += 5;
  // 水が最弱はリスク (OR=2.84, p=0.0004)
  if (weakestGogyo && weakestGogyo.includes("水")) score += 5;
  // 生貴刑（南方刑）は保護的 (OR=0.17, p=0.002)
  if (topologyNames && topologyNames.includes("生貴刑（南方刑）")) score -= 9;
  // 支合はリスク (OR=2.06, p=0.030)
  if (topologyNames && topologyNames.includes("支合")) score += 4;
  // 正規化: 生スコアを0-100スケールに変換
  const RAW_MIN_A = 5;
  const RAW_MAX_A = 130;
  return Math.max(5, Math.min(100, Math.round(((score - RAW_MIN_A) / (RAW_MAX_A - RAW_MIN_A)) * 100)));
}

// 結婚適性度のベーススコア（中央＝本質の主星）
const marriageBaseScore = {
  貫索星: 65, 石門星: 70, 鳳閣星: 45, 調舒星: 40, 禄存星: 80,
  司禄星: 85, 車騎星: 42, 牽牛星: 72, 龍高星: 38, 玉堂星: 75
};
// 配偶者宮（日支）の十二大従星による結婚適性への加減点
const marriageEnergyAdjust = {
  天報星: -10, 天印星: 12, 天貴星: 10, 天恍星: -12, 天南星: -8,
  天禄星: 12, 天将星: -5, 天堂星: 12, 天胡星: 5, 天極星: 8,
  天庫星: 10, 天馳星: -12
};
// 西（右手・配偶者との関係）の主星による加減点
const marriageWestAdjust = {
  貫索星: 8, 石門星: 6, 鳳閣星: -8, 調舒星: -6, 禄存星: 10,
  司禄星: 12, 車騎星: -8, 牽牛星: 8, 龍高星: -10, 玉堂星: 8
};

function getMarriageScore({ centerStar, westStar, spouseEnergyName, isDoubleEn, hasAbnormal, hasTopThreeAbnormal, affairScore, gogyoBalance, dayElement, tenchusatsu, topologyNames, weakestGogyo, balanceType, gender }) {
  let score = marriageBaseScore[centerStar] ?? 50;
  score += marriageEnergyAdjust[spouseEnergyName] ?? 0;
  score += marriageWestAdjust[westStar] ?? 0;
  // --- 統計的知見に基づく調整（166名芸能人データ）---
  // isDoubleEn は保護的 (OR=0.45, p=0.037) → 結婚適性は上がる
  if (isDoubleEn) score += 4;
  // hasAbnormal は保護的 (OR=0.50, p=0.020)
  if (hasAbnormal) score += 5;
  if (hasTopThreeAbnormal) score -= 5;
  // 浮気リスクが高いほど結婚適性は下がる
  score += (100 - affairScore) * 0.15;
  // 五行バランス: balance_high は保護的(OR=0.49)、balance_moderate はリスク(OR=5.19)
  if (gogyoBalance !== undefined && gogyoBalance >= 4) score += 4;  // balance_high: 保護
  else if (gogyoBalance !== undefined && gogyoBalance >= 3) score += 2;
  else if (gogyoBalance !== undefined && gogyoBalance <= 1) score += 6;
  if (balanceType === "moderate") score -= 8;  // OR=5.19, p<0.001 (リスク)
  // --- 新規統計パラメータ ---
  // 日干五行「水」は保護的 (OR=0.28, p=0.004)
  if (dayElement === "水") score += 6;
  // 天中殺「寅卯」はリスク (OR=2.44, p=0.032)
  if (tenchusatsu === "寅卯") score -= 5;
  // 水が最弱はリスク (OR=2.84, p=0.0004)
  if (weakestGogyo && weakestGogyo.includes("水")) score -= 5;
  // 生貴刑（南方刑）は保護的 (OR=0.17, p=0.002)
  if (topologyNames && topologyNames.includes("生貴刑（南方刑）")) score += 9;
  // 支合はリスク (OR=2.06, p=0.030)
  if (topologyNames && topologyNames.includes("支合")) score -= 4;
  return Math.max(5, Math.min(100, Math.round(score)));
}

function getChongBranch(branch) {
  return branches[mod(branches.indexOf(branch) + 6, 12)];
}

// 結婚に適した時期を算出（15〜50歳、スコア順で上位2件）
function getMarriageAges(day, pillars, taiun, tenchusatsu, birthYear, currentAge, counts, mainStars, gender) {
  const dayBranch = day.branch;
  const natalBranches = [pillars.year.branch, pillars.month.branch, pillars.day.branch];
  const goodMarriageStars = ["禄存星", "司禄星", "石門星", "玉堂星", "牽牛星"];
  const allYears = [];

  // 統計知見に基づく追加判定要素
  const dayElement = elements[stems.indexOf(day.stem)];
  const gogyoValues = Object.values(counts);
  const gogyoBalance = Math.max(...gogyoValues) - Math.min(...gogyoValues);
  const balanceModerate = gogyoBalance >= 2 && gogyoBalance <= 3;
  const balanceHigh = gogyoBalance <= 1;
  const weakestGogyo = Object.entries(counts).sort((a, b) => a[1] - b[1])[0][0];
  const isDoubleEn = mainStars.east && mainStars.west && (mainStars.east === mainStars.west || yinYangPairStar[mainStars.east] === mainStars.west);

  taiun.periods.forEach((p) => {
    const taiunStar = getMainStar(day.stem, p.stem);
    const taiunBranch = p.branch;
    const isTenchu = isTenchusatsuYear(taiunBranch, tenchusatsu);
    if (isTenchu) return;

    const taiunReasons = [];
    let taiunBonus = 0;
    if (shigouPair[taiunBranch] === dayBranch) { taiunBonus += 30; taiunReasons.push("大運支が日支と支合"); }
    if (goodMarriageStars.includes(taiunStar)) { taiunBonus += 20; taiunReasons.push(`大運星「${taiunStar}」が結婚に良い星`); }

    // 統計知見: topo_支合は結婚保護因子 (OR=2.06, p=0.030)
    if (shigouPair[taiunBranch] === dayBranch) { taiunBonus += 8; taiunReasons.push("統計: 支合は結婚安定性に寄与(OR=2.06)"); }

    const allWithTaiun = [...natalBranches, taiunBranch];
    sangoBureaus.forEach((bureau) => {
      const matchCount = bureau.branches.filter((b) => allWithTaiun.includes(b)).length;
      const natalMatch = bureau.branches.filter((b) => natalBranches.includes(b)).length;
      if (matchCount === 4) { taiunBonus += 25; taiunReasons.push(`三合会局（${bureau.element}局）が完成`); }
      else if (matchCount === 3 && natalMatch === 2 && bureau.branches.includes(taiunBranch)) {
        taiunBonus += 25; taiunReasons.push(`三合会局（${bureau.element}局）が完成`);
      }
    });

    for (let age = p.age; age <= p.ageTo; age++) {
      if (age < 15 || age > 50) continue;
      const year = birthYear + age;
      const yp = getYearPillarForYear(year);
      const isYearTenchu = isTenchusatsuYear(yp.branch, tenchusatsu);
      if (isYearTenchu) continue;
      const yearStar = getMainStar(day.stem, yp.stem);
      const reasons = [...taiunReasons];
      let score = taiunBonus;
      if (shigouPair[yp.branch] === dayBranch) { score += 15; reasons.push("年支が日支と支合"); }
      if (goodMarriageStars.includes(yearStar)) { score += 10; reasons.push(`年運星「${yearStar}」が結婚に良い星`); }
      const allWithYear = [...natalBranches, yp.branch];
      sangoBureaus.forEach((bureau) => {
        const mc = bureau.branches.filter((b) => allWithYear.includes(b)).length;
        const nm = bureau.branches.filter((b) => natalBranches.includes(b)).length;
        if (mc === 4) { score += 20; reasons.push(`三合会局（${bureau.element}局）が完成`); }
        else if (mc === 3 && nm === 2 && bureau.branches.includes(yp.branch)) {
          score += 20; reasons.push(`三合会局（${bureau.element}局）が完成`);
        }
      });

      // === 統計知見に基づく調整（166名芸能人データ、ロジスティック回帰 AUC=0.79）===
      // day_element_水 は結婚保護因子 (OR=0.28, p=0.004)
      if (dayElement === "水") { score += 12; reasons.push("統計: 日干五行が水・結婚保護因子(OR=0.28)"); }
      // balance_high は保護因子 (OR=0.49, p=0.003)
      if (balanceHigh) { score += 8; reasons.push("統計: 五行バランス良好・保護因子(OR=0.49)"); }
      // is_double_en は保護因子 (OR=0.45, p=0.037)
      if (isDoubleEn) { score += 6; reasons.push("統計: 二度縁の型・結婚保護因子(OR=0.45)"); }
      // balance_moderate はリスク因子 (OR=5.19, p<0.001) → 結婚タイミングとしては減点
      if (balanceModerate) { score -= 10; reasons.push("統計: 五行バランス中程度・リスク因子(OR=5.19)"); }
      // weakest_水 はリスク因子 (OR=2.84, p<0.001)
      if (weakestGogyo === "水") { score -= 6; reasons.push("統計: 水不足・リスク因子(OR=2.84)"); }
      // male は保護因子 (OR=0.26, p<0.001) → 男性は結婚安定性高い
      if (gender === "male") { score += 5; reasons.push("統計: 男性・結婚保護因子(OR=0.26)"); }
      // tenchu_寅卯 はリスク因子 (OR=2.44, p=0.032)
      if (tenchusatsu === "寅" || tenchusatsu === "卯") { score -= 5; reasons.push("統計: 寅卯天中殺・リスク因子(OR=2.44)"); }

      if (score > taiunBonus || taiunBonus > 0) {
        allYears.push({ age, year, star: yearStar, branch: yp.branch, taiunStar, reasons, score });
      }
    }
  });

  allYears.sort((a, b) => b.score - a.score);
  return allYears.slice(0, 2);
}

// 恋愛しやすい時期を算出（15〜50歳、スコア順で上位2件）
function getLoveAges(day, pillars, taiun, tenchusatsu, birthYear, currentAge, counts, mainStars, gender) {
  const dayBranch = day.branch;
  const natalBranches = [pillars.year.branch, pillars.month.branch, pillars.day.branch];
  const goodLoveStars = ["鳳閣星", "調舒星", "禄存星", "車騎星", "龍高星", "石門星"];
  const allYears = [];

  // 統計知見に基づく追加判定要素
  const dayElement = elements[stems.indexOf(day.stem)];
  const gogyoValues = Object.values(counts);
  const gogyoBalance = Math.max(...gogyoValues) - Math.min(...gogyoValues);
  const balanceModerate = gogyoBalance >= 2 && gogyoBalance <= 3;
  const balanceHigh = gogyoBalance <= 1;
  const weakestGogyo = Object.entries(counts).sort((a, b) => a[1] - b[1])[0][0];
  const isDoubleEn = mainStars.east && mainStars.west && (mainStars.east === mainStars.west || yinYangPairStar[mainStars.east] === mainStars.west);

  taiun.periods.forEach((p) => {
    const taiunStar = getMainStar(day.stem, p.stem);
    const taiunBranch = p.branch;
    const isTenchu = isTenchusatsuYear(taiunBranch, tenchusatsu);
    if (isTenchu) return;

    const taiunReasons = [];
    let taiunBonus = 0;
    if (shigouPair[taiunBranch] === dayBranch) { taiunBonus += 25; taiunReasons.push("大運支が日支と支合"); }
    if (goodLoveStars.includes(taiunStar)) { taiunBonus += 15; taiunReasons.push(`大運星「${taiunStar}」が恋愛に良い星`); }

    const allWithTaiun = [...natalBranches, taiunBranch];
    sangoBureaus.forEach((bureau) => {
      const matchCount = bureau.branches.filter((b) => allWithTaiun.includes(b)).length;
      const natalMatch = bureau.branches.filter((b) => natalBranches.includes(b)).length;
      if (matchCount === 4) { taiunBonus += 20; taiunReasons.push(`三合会局（${bureau.element}局）が完成`); }
      else if (matchCount === 3 && natalMatch === 2 && bureau.branches.includes(taiunBranch)) {
        taiunBonus += 20; taiunReasons.push(`三合会局（${bureau.element}局）が完成`);
      } else if (matchCount === 3 && natalMatch === 1 && bureau.branches.includes(taiunBranch)) {
        taiunBonus += 10; taiunReasons.push(`半会（${bureau.element}局）が強まる`);
      }
    });

    for (let age = p.age; age <= p.ageTo; age++) {
      if (age < 15 || age > 50) continue;
      const year = birthYear + age;
      const yp = getYearPillarForYear(year);
      const isYearTenchu = isTenchusatsuYear(yp.branch, tenchusatsu);
      if (isYearTenchu) continue;
      const yearStar = getMainStar(day.stem, yp.stem);
      const reasons = [...taiunReasons];
      let score = taiunBonus;
      if (shigouPair[yp.branch] === dayBranch) { score += 12; reasons.push("年支が日支と支合"); }
      if (goodLoveStars.includes(yearStar)) { score += 8; reasons.push(`年運星「${yearStar}」が恋愛に良い星`); }
      const allWithYear = [...natalBranches, yp.branch];
      sangoBureaus.forEach((bureau) => {
        const mc = bureau.branches.filter((b) => allWithYear.includes(b)).length;
        const nm = bureau.branches.filter((b) => natalBranches.includes(b)).length;
        if (mc === 4) { score += 15; reasons.push(`三合会局（${bureau.element}局）が完成`); }
        else if (mc === 3 && nm === 2 && bureau.branches.includes(yp.branch)) {
          score += 15; reasons.push(`三合会局（${bureau.element}局）が完成`);
        }
      });

      // === 統計知見に基づく調整（166名芸能人データ、ロジスティック回帰 AUC=0.79）===
      // 恋愛タイミングには不倫リスク因子を考慮（リスク高い年は恋愛発生しやすいが結婚には注意）
      // balance_moderate はリスク因子 (OR=5.19) → 恋愛は発生しやすいが結婚リスク
      if (balanceModerate) { score += 5; reasons.push("統計: 五行バランス中程度・恋愛発生しやすい(OR=5.19)"); }
      // weakest_水 はリスク因子 (OR=2.84) → 恋愛発生しやすい
      if (weakestGogyo === "水") { score += 4; reasons.push("統計: 水不足・恋愛発生しやすい(OR=2.84)"); }
      // tenchu_寅卯 はリスク因子 (OR=2.44) → 恋愛発生しやすい
      if (tenchusatsu === "寅" || tenchusatsu === "卯") { score += 3; reasons.push("統計: 寅卯天中殺・恋愛発生しやすい(OR=2.44)"); }
      // day_element_水 は保護因子 → 恋愛は安定傾向
      if (dayElement === "水") { score += 6; reasons.push("統計: 日干五行が水・恋愛安定(OR=0.28)"); }
      // balance_high は保護因子
      if (balanceHigh) { score += 4; reasons.push("統計: 五行バランス良好・恋愛安定(OR=0.49)"); }
      // is_double_en は保護因子
      if (isDoubleEn) { score += 3; reasons.push("統計: 二度縁の型・恋愛安定(OR=0.45)"); }

      if (score > taiunBonus || taiunBonus > 0) {
        allYears.push({ age, year, star: yearStar, branch: yp.branch, taiunStar, reasons, score });
      }
    }
  });

  allYears.sort((a, b) => b.score - a.score);
  return allYears.slice(0, 2);
}

// 異常干支（13個）: 通常異常干支（6個）＋暗合異常干支（7個）
// 参考: https://sanmei-stock.com/applied/unique-zodiac/
const abnormalZodiacData = {
  甲戌: { type: "通常", star: "天印星", note: "" },
  乙亥: { type: "通常", star: "天極星", note: "" },
  戊戌: { type: "通常", star: "天庫星", note: "教養が高いほど個性が強まりやすい。配偶者が最身強（天将星2つ以上）だと個性は抑えられる。" },
  庚子: { type: "通常", star: "天極星", note: "" },
  辛亥: { type: "通常", star: "天恍星", note: "" },
  丁巳: { type: "通常", star: "天将星", note: "" },
  辛巳: { type: "暗合", star: "天極星", note: "直感力が強い干支の第3位。内面が外に変化しやすい特別なパターン。" },
  壬午: { type: "暗合", star: "天報星", note: "直感力が強い干支の第2位。内面が外に変化しやすい特別なパターン。視力の異常性が出やすい。配偶者は天将星の人だと良い。" },
  丙戌: { type: "暗合", star: "天庫星", note: "内面が外に変化しやすい特別なパターン。教養が高いほど個性が強まりやすい。配偶者が最身強だと個性は抑えられる。" },
  丁亥: { type: "暗合", star: "天報星", note: "直感力が最も強い干支。内面が外に変化しやすい特別なパターン。" },
  戊子: { type: "暗合", star: "天報星", note: "内面が外に変化しやすい特別なパターン。" },
  癸巳: { type: "暗合", star: "天報星", note: "内面が外に変化しやすい特別なパターン。配偶者は天将星の人だと良い。" },
  己亥: { type: "暗合", star: "天報星", note: "内面が外に変化しやすい特別なパターン。視力の異常性が出やすい。配偶者は天将星の人だと良い。" }
};
const abnormalTopThree = ["丁亥", "壬午", "辛巳"];

function getAbnormalZodiac(stem, branch) {
  return abnormalZodiacData[stem + branch] || null;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function parseLocalDate(value) {
  const digits = value.trim().replace(/[^0-9]/g, "");
  if (digits.length < 8) return new Date(NaN);
  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6));
  const day = Number(digits.slice(6, 8));
  return new Date(year, month - 1, day);
}

function normalizeBirthdate(value) {
  const digits = value.trim().replace(/[^0-9]/g, "");
  if (digits.length < 8) return value;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

function pillarFromIndex(index) {
  return { stem: stems[mod(index, 10)], branch: branches[mod(index, 12)], index: mod(index, 60) };
}

// 節入り日（各月の太陽黄経に基づく月の切り替わり日）
// 0=1月(小寒≈6日), 1=2月(立春≈4日), 2=3月(啓蟄≈6日), 3=4月(清明≈5日),
// 4=5月(立夏≈6日), 5=6月(芒種≈6日), 6=7月(小暑≈7日), 7=8月(立秋≈8日),
// 8=9月(白露≈8日), 9=10月(寒露≈8日), 10=11月(立冬≈7日), 11=12月(大雪≈7日)
const setsuiriDays = [6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7];

// 前節入りからの日数（高尾式：節入り日当日を1日目として数える）
function getDaysSinceSetsuiri(date) {
  const m = date.getMonth();
  const d = date.getDate();
  let setsuiriMonth = m;
  let setsuiriYear = date.getFullYear();
  if (d < setsuiriDays[m]) {
    setsuiriMonth = mod(m - 1, 12);
    if (m === 0) setsuiriYear -= 1;
  }
  const setsuiriDate = new Date(setsuiriYear, setsuiriMonth, setsuiriDays[setsuiriMonth]);
  const diffDays = Math.round((date - setsuiriDate) / 86400000);
  return diffDays + 1;
}

// === 六親法 ===
// 干合のペア: 甲↔己, 乙↔庚, 丙↔辛, 丁↔壬, 戊↔癸
const kangouPairs = { 甲: "己", 己: "甲", 乙: "庚", 庚: "乙", 丙: "辛", 辛: "丙", 丁: "壬", 壬: "丁", 戊: "癸", 癸: "戊" };

// 相生: 生じる側 → 生じられる側
// 水生木, 木生火, 火生土, 土生金, 金生水
const seiseiMap = { 水: "木", 木: "火", 火: "土", 土: "金", 金: "水" };

function calcSixParents(dayStem, gender) {
  const dayIdx = stems.indexOf(dayStem);
  const dayEl = elements[dayIdx];
  const dayIsYang = dayIdx % 2 === 0;

  // 母親: 日干を生じる五行の干
  // 生じる五行を逆引き: dayEl を生じる五行
  const generateEl = Object.entries(seiseiMap).find(([, child]) => child === dayEl)[0];
  const generateStems = stems.filter((s) => elements[stems.indexOf(s)] === generateEl);
  // 正母: プラスマイナスが異なる干（玉堂星）
  const mother = generateStems.find((s) => (stems.indexOf(s) % 2 === 0) !== dayIsYang) || generateStems[0];
  // 偏母: プラスマイナスが同じ干（龍高星）
  const motherAlt = generateStems.find((s) => (stems.indexOf(s) % 2 === 0) === dayIsYang) || generateStems[0];

  // 父親: 母親の干合相手
  const father = kangouPairs[mother];
  // 恋人（母親の干合相手の陰陽逆）= 母親から見て車騎星 or 禄存星
  const fatherAlt = kangouPairs[mother] === stems.find((s) => elements[stems.indexOf(s)] === elements[stems.indexOf(kangouPairs[mother])] && (stems.indexOf(s) % 2 === 0) === dayIsYang)
    ? stems.find((s) => elements[stems.indexOf(s)] === elements[stems.indexOf(kangouPairs[mother])] && (stems.indexOf(s) % 2 === 0) !== dayIsYang)
    : stems.find((s) => elements[stems.indexOf(s)] === elements[stems.indexOf(kangouPairs[mother])] && (stems.indexOf(s) % 2 === 0) !== (stems.indexOf(mother) % 2 === 0));

  // 兄弟姉妹: 日干と同じ五行の干
  const siblingStems = stems.filter((s) => elements[stems.indexOf(s)] === dayEl);
  // 同性（兄弟）: 日干と同じ陰陽
  const brother = siblingStems.find((s) => (stems.indexOf(s) % 2 === 0) === dayIsYang && s !== dayStem) || siblingStems.find((s) => (stems.indexOf(s) % 2 === 0) === dayIsYang);
  // 異性（姉妹）: 日干と逆の陰陽
  const sister = siblingStems.find((s) => (stems.indexOf(s) % 2 === 0) !== dayIsYang);

  // 結婚相手: 日干の干合相手（牽牛星 or 司禄星）
  const spouse = kangouPairs[dayStem];
  // 恋人: 日干の干合相手の陰陽逆（車騎星 or 禄存星）
  const spouseEl = elements[stems.indexOf(spouse)];
  const spouseAlt = stems.find((s) => elements[stems.indexOf(s)] === spouseEl && (stems.indexOf(s) % 2 === 0) === dayIsYang && s !== spouse) || spouse;

  // 子供: 日干（または妻）が生じる干
  // 男性の場合は妻（干合相手）が生じる干、女性の場合は自分が生じる干
  const childGenSource = gender === "male" ? spouse : dayStem;
  const childEl = seiseiMap[elements[stems.indexOf(childGenSource)]];
  const childStems = stems.filter((s) => elements[stems.indexOf(s)] === childEl);
  const sourceIsYang = stems.indexOf(childGenSource) % 2 === 0;
  // 女児: 生じる側と同じ陰陽（鳳閣星）
  const daughter = childStems.find((s) => (stems.indexOf(s) % 2 === 0) === sourceIsYang);
  // 男児: 生じる側と逆の陰陽（調舒星）
  const son = childStems.find((s) => (stems.indexOf(s) % 2 === 0) !== sourceIsYang);

  return {
    mother, motherAlt, father, fatherAlt,
    brother, sister,
    spouse, spouseAlt,
    son, daughter,
    dayStem, dayEl, dayIsYang,
    motherStar: getMainStar(dayStem, mother),
    motherAltStar: getMainStar(dayStem, motherAlt),
    fatherStar: getMainStar(dayStem, father),
    brotherStar: getMainStar(dayStem, brother),
    sisterStar: getMainStar(dayStem, sister),
    spouseStar: getMainStar(dayStem, spouse),
    spouseAltStar: getMainStar(dayStem, spouseAlt),
    sonStar: getMainStar(dayStem, son),
    daughterStar: getMainStar(dayStem, daughter)
  };
}

function findStemInNatal(stem, pillars, zoukan) {
  const found = [];
  if (pillars.year.stem === stem) found.push("年干");
  if (pillars.month.stem === stem) found.push("月干");
  if (pillars.day.stem === stem) found.push("日干");
  if (zoukan.year === stem) found.push("年支蔵干");
  if (zoukan.month === stem) found.push("月支蔵干");
  if (zoukan.day === stem) found.push("日支蔵干");
  return found;
}

function getTenchusatsuPillars(tenchusatsu) {
  const map = { "戌亥": ["year"], "申酉": ["year"], "午未": ["year", "month"], "辰巳": ["month"], "寅卯": ["month", "day"], "子丑": ["day"] };
  return map[tenchusatsu] || [];
}

function getSixParentsRelation(parents, pillars, zoukan, tenchusatsu) {
  const tenchuPillars = getTenchusatsuPillars(tenchusatsu);
  const allHiddenStems = [pillars.year.stem, pillars.month.stem, pillars.day.stem, zoukan.year, zoukan.month, zoukan.day];
  const result = {};

  const checkRelation = (key, stem, label, defaultPosition) => {
    const positions = findStemInNatal(stem, pillars, zoukan);
    // 天中殺の柱にある干は無効
    const validPositions = positions.filter((p) => {
      if (p === "年干" && tenchuPillars.includes("year")) return false;
      if (p === "月干" && tenchuPillars.includes("month")) return false;
      if (p === "日干" && tenchuPillars.includes("day")) return false;
      return true;
    });
    const depth = validPositions.length === 0 ? "縁薄" : validPositions.length === 1 ? "縁あり" : validPositions.length >= 3 ? "縁濃（偏り注意）" : "縁濃";
    result[key] = { stem, label, star: getMainStar(parents.dayStem, stem), positions: validPositions, depth, defaultPosition };
  };

  checkRelation("mother", parents.mother, "正母（母親）", "月支蔵干");
  checkRelation("motherAlt", parents.motherAlt, "偏母（母親代行）", "月支蔵干");
  checkRelation("father", parents.father, "正父（父親）", "月干");
  checkRelation("fatherAlt", parents.fatherAlt, "偏父（父親代行）", "月干");
  checkRelation("brother", parents.brother, "兄弟", "なし");
  checkRelation("sister", parents.sister, "姉妹", "なし");
  checkRelation("spouse", parents.spouse, "正配偶（結婚相手）", "日支蔵干");
  checkRelation("spouseAlt", parents.spouseAlt, "偏配偶（恋人）", "日支蔵干");
  checkRelation("son", parents.son, "男児", "月干");
  checkRelation("daughter", parents.daughter, "女児", "月干");

  return result;
}

function getYearPillar(date) {
  const y = date.getFullYear();
  // 算命学では立春（2月4日頃）が年の境界
  const lichun = new Date(y, 1, setsuiriDays[1]);
  const adjusted = date < lichun ? y - 1 : y;
  // 1984年 = 甲子年
  return pillarFromIndex(adjusted - 1984);
}

function getMonthPillar(date, yearStemIndex) {
  const m = date.getMonth(); // 0=Jan, 1=Feb, ...
  const d = date.getDate();
  // 節入り日以降なら当月、未満なら前月の太陽月
  let solarMonth;
  if (d >= setsuiriDays[m]) {
    solarMonth = m;
  } else {
    solarMonth = (m - 1 + 12) % 12;
  }
  // 地支: solarMonth 0(1月/丑)→1, 1(2月/寅)→2, ..., 11(12月/子)→0
  const branchIndex = (solarMonth + 1) % 12;
  // 天干: 年干から寅月の天干を決定し、月のオフセット分を加算
  // 甲己年→丙寅(2), 乙庚年→戊寅(4), 丙辛年→庚寅(6), 丁壬年→壬寅(8), 戊癸年→甲寅(0)
  const tigerStemStart = [2, 4, 6, 8, 0][yearStemIndex % 5];
  const monthsFromTiger = (branchIndex - 2 + 12) % 12;
  const stemIndex = (tigerStemStart + monthsFromTiger) % 10;
  return { stem: stems[stemIndex], branch: branches[branchIndex] };
}

function getDayPillar(date) {
  // 基準日: 2000年1月7日 = 甲子日（ユリウス日計算で確認済み）
  const base = new Date(2000, 0, 7);
  const days = Math.round((date - base) / 86400000);
  return pillarFromIndex(days);
}

function getMainStar(dayStem, targetStem) {
  const dayIndex = stems.indexOf(dayStem);
  const targetIndex = stems.indexOf(targetStem);
  const isDayYang = dayIndex % 2 === 0;
  if (isDayYang) {
    // 陽干: 日干からの十干の差をそのまま星indexとする
    return starNames[mod(targetIndex - dayIndex, 10)];
  } else {
    // 陰干: 陰陽ペア(甲乙・丙丁・戊己・庚辛・壬癸)ごとに
    // 陰を偶数index、陽を奇数indexとして割り当てる
    const dayPair = Math.floor(dayIndex / 2);
    const targetPair = Math.floor(targetIndex / 2);
    const pairDiff = mod(targetPair - dayPair, 5);
    const isTargetYang = targetIndex % 2 === 0;
    return starNames[pairDiff * 2 + (isTargetYang ? 1 : 0)];
  }
}

// 十二大従星の算出: 胎(天報星)の開始地支
// 四柱推命の十二運と同じ原理。陽干は順行、陰干は逆行。
// 甲→酉, 乙→申, 丙→子, 丁→亥, 戊→子, 己→亥, 庚→卯, 辛→寅, 壬→午, 癸→巳
const taiStartBranch = [9, 8, 0, 11, 0, 11, 3, 2, 6, 5];

function getEnergyStar(dayStem, branch) {
  const dayIndex = stems.indexOf(dayStem);
  const branchIndex = branches.indexOf(branch);
  const isYang = dayIndex % 2 === 0;
  let stage;
  if (isYang) {
    stage = mod(branchIndex - taiStartBranch[dayIndex], 12);
  } else {
    stage = mod(taiStartBranch[dayIndex] - branchIndex, 12);
  }
  return energyStars[stage];
}

function getShiGan(dayStem, targetStem) {
  const d = stems.indexOf(dayStem);
  const t = stems.indexOf(targetStem);
  const dayEl = elements[d];
  const targetEl = elements[t];
  const sameYin = (d % 2) === (t % 2);
  const cycle = ["木", "火", "土", "金", "水"];
  const dayIdx = cycle.indexOf(dayEl);
  const targetIdx = cycle.indexOf(targetEl);
  const next = (dayIdx + 1) % 5;
  const prev = (dayIdx + 5 - 1) % 5;
  const overcome = cycle[(dayIdx + 2) % 5];
  if (dayEl === targetEl) return sameYin ? "比肩" : "劫財";
  if (targetIdx === next) return sameYin ? "食神" : "傷官";
  if (targetIdx === prev) return sameYin ? "偏印" : "正印";
  if (targetEl === overcome) return sameYin ? "偏財" : "正財";
  return sameYin ? "偏官（七殺）" : "正官";
}

function buildFourPillarsComparison(pillars, zoukan, day) {
  const rows = ["year", "month", "day"].map((key) => {
    const p = pillars[key];
    const z = zoukan[key];
    const label = key === "year" ? "年柱" : key === "month" ? "月柱" : "日柱";
    const mainStar = getMainStar(day.stem, p.stem);
    const energy = getEnergyStar(day.stem, p.branch);
    const shiGan = getShiGan(day.stem, p.stem);
    const shiGanZoukan = getShiGan(day.stem, z);
    return `<tr>
      <th>${label}</th>
      <td>${p.stem}<br><small>十神：${shiGan}</small></td>
      <td>${p.branch}<br><small>蔵干：${z}（${shiGanZoukan}）</small></td>
      <td>${energy.name}</td>
      <td>${mainStar}<br><small>${energy.name}</small></td>
    </tr>`;
  }).join("");
  return `
    <div class="result-card expert-only">
      <h3>四柱推命（三柱）と算命学の比較</h3>
      <p class="note is-small mb-12">簡易表示のため出生時刻は使用せず、年月日の三柱で比較しています。</p>
      <div class="comparison-table-wrap">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>柱</th>
              <th>四柱推命・天干（十神）</th>
              <th>四柱推命・地支（蔵干）</th>
              <th>十二運</th>
              <th>算命学・主星（従星）</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

// === 陽占法・数理法 ===
// 十大主星の五行マッピング
const starElementMap = ["木", "木", "火", "火", "土", "土", "金", "金", "水", "水"];
function getStarElement(starName) { return starElementMap[starNames.indexOf(starName)]; }

// 五行相生相剋の方向判定
const gogyoCycle = ["木", "火", "土", "金", "水"];
const gogyoRelation = { 木: { 木: "比和", 火: "相生", 土: "相剋", 金: "反剋", 水: "相生" }, 火: { 木: "相生", 火: "比和", 土: "相生", 金: "相剋", 水: "反剋" }, 土: { 木: "反剋", 火: "相生", 土: "比和", 金: "相生", 水: "相剋" }, 金: { 木: "相剋", 火: "反剋", 金: "比和", 土: "相生", 水: "相生" }, 水: { 木: "相生", 火: "相剋", 土: "反剋", 金: "相生", 水: "比和" } };
function getGogyoRelation(a, b) {
  if (a === b) return "比和";
  const ai = gogyoCycle.indexOf(a);
  const bi = gogyoCycle.indexOf(b);
  if ((ai + 1) % 5 === bi) return "相生(→)"; // a生b
  if ((bi + 1) % 5 === ai) return "相生(←)"; // b生a
  if ((ai + 2) % 5 === bi) return "相剋(→)"; // a剋b
  return "相剋(←)"; // b剋a
}

function relToText(rel) {
  if (rel === "比和") return "同じ性質";
  if (rel === "相生(→)") return "後押しする";
  if (rel === "相生(←)") return "後押しされる";
  if (rel === "相剋(→)") return "抑え込む";
  if (rel === "相剋(←)") return "抑え込まれる";
  return rel;
}

// === 流動法 ===
// 参考: https://sanmei-stock.com/basic/yang/flow-technique/
function analyzeRyudo(mainStars) {
  const centerEl = getStarElement(mainStars.center);
  const dirs = [
    { key: "north", label: "北（目上・親・上司）", naturalRels: ["相剋(→)", "相剋(←)", "比和"] },
    { key: "east", label: "東（社会・友人・兄弟）", naturalRels: ["相剋(→)", "相剋(←)", "比和"] },
    { key: "south", label: "南（目下・部下・子供）", naturalRels: ["相生(→)", "相生(←)"] },
    { key: "west", label: "西（配偶者・パートナー）", naturalRels: ["相生(→)", "相生(←)"] }
  ];
  return dirs.map(d => {
    const otherEl = getStarElement(mainStars[d.key]);
    const rel = getGogyoRelation(centerEl, otherEl);
    const isNatural = d.naturalRels.includes(rel);
    let advice;
    if (d.key === "north") {
      advice = isNatural
        ? "目上とぶつかりやすい、または似た性質の関係。摩擦はあるが、自分のやり方を磨くチャンスでもあります。"
        : "目上と相生の恵まれた関係。目上から応援されるか、自分が目上を支えることで信頼を得ます。依存せず自分の力も大切に。";
    } else if (d.key === "east") {
      advice = isNatural
        ? "社会と対立しやすい、または似た性質の関係。苦労はあるが、自力で成長できる環境です。"
        : "社会と相生の関係。社会に貢献して評価されるか、周りの支援を得て伸びていきます。甘えすぎず自力も意識すると良い。";
    } else if (d.key === "south") {
      advice = isNatural
        ? "目下を自然に導ける関係。部下や後輩、子供に恵まれやすいです。"
        : "目下とぶつかりやすい、または似た性質の関係。目下の運に注意が必要です。";
    } else {
      advice = isNatural
        ? "配偶者から支えられる、または自然に尽くせる関係。家庭が安定しやすいです。"
        : "配偶者とぶつかりやすい、または似た性質の関係。適度な距離感を保つことが大切です。";
    }
    return { dir: d.label, myStar: mainStars.center, myEl: centerEl, otherStar: mainStars[d.key], otherEl, rel, isNatural, advice };
  });
}

// === 循環法 ===
// 参考: https://sanmei-stock.com/basic/yang/circular-law/
function analyzeJunkan(mainStars) {
  const starKeys = ["center", "north", "south", "east", "west"];
  const stars = starKeys.map(k => mainStars[k]);
  const els = stars.map(s => getStarElement(s));

  let bestChain = [];
  let bestEnd = -1;

  for (let start = 0; start < 5; start++) {
    const chain = [start];
    let current = start;
    for (let step = 0; step < 5; step++) {
      let next = -1;
      for (let i = 0; i < 5; i++) {
        if (chain.includes(i)) continue;
        const rel = getGogyoRelation(els[current], els[i]);
        if (rel === "相生(→)") { next = i; break; }
      }
      if (next === -1) break;
      chain.push(next);
      current = next;
    }
    if (chain.length > bestChain.length) {
      bestChain = chain;
      bestEnd = current;
    }
  }

  if (bestChain.length <= 1) {
    return { poleStar: mainStars.center, chain: [], note: "性格を表す星のエネルギーの流れが見つからないため、中央の星を「ものの考え方の根幹」とします。" };
  }
  const chainStars = bestChain.map(idx => stars[idx]);
  const poleStar = stars[bestEnd];
  return {
    poleStar,
    chain: chainStars,
    note: `エネルギーの流れが「${chainStars.join(" → ")}」の順で進み、「${poleStar}」で止まります。この星が「ものの考え方の根幹」になり、人生の土台となる考え方を表します。`
  };
}

// === 東方星と南方星の関係 ===
// 参考: https://sanmei-stock.com/basic/yang/east-and-south/
function analyzeEastSouth(mainStars) {
  const eastEl = getStarElement(mainStars.east);
  const southEl = getStarElement(mainStars.south);
  const rel = getGogyoRelation(eastEl, southEl);
  let title, text;
  switch (rel) {
    case "相生(→)":
      title = "現実から理想へ（オーソドックス型）";
      text = "現実（収入・社会的地位）が理想（やりがい・夢）を後押しする関係。始めは現実やお金を大事にし、だんだん夢や理想を大切にするようになります。最終的には生きがいを大切にする人です。";
      break;
    case "相生(←)":
      title = "理想を現実化する型（起業家タイプ）";
      text = "理想（やりがい・夢）が現実（収入・社会的地位）を後押しする関係。自分の夢や理想を着々と実現の方向に持って行く人です。苦労しながら時間をかけて夢を実現する起業家タイプです。";
      break;
    case "相剋(→)":
      title = "現実優先型（サラリーマンタイプ）";
      text = "現実が理想を抑える関係。環境や現実を優先して自分の理想は妥協できる人です。組織のために理想を曲げられるサラリーマンタイプです。";
      break;
    case "相剋(←)":
      title = "理想押し込み型（デストロイヤータイプ）";
      text = "理想が現実を抑え込む関係。無理やり理想を実現させようとする気が短いタイプです。周りから迷惑がられやすいので、物の言い方に注意が必要です。";
      break;
    default:
      title = "バランスタイプ";
      text = "現実と理想が同じ性質の関係。現実と理想のバランスが取りやすいタイプですが、刺激に欠けることもあります。";
      break;
  }
  return { eastStar: mainStars.east, southStar: mainStars.south, eastEl, southEl, rel, title, text };
}

// === 気図法 ===
// 参考: https://sanmei-stock.com/basic/mathematical-technique/spirit/
function analyzeKizu(counts) {
  const vertical = (counts["水"] || 0) + (counts["火"] || 0);
  const horizontal = (counts["木"] || 0) + (counts["金"] || 0);
  const southeast = (counts["木"] || 0) + (counts["火"] || 0);
  const northwest = (counts["金"] || 0) + (counts["水"] || 0);

  let type, text;
  if (vertical > horizontal) {
    type = "学問優秀型";
    text = "縦線（北・水＋南・火）のエネルギーが横線（東・木＋西・金）を上回るため、学問に優れたタイプです。何事も積極的に学ぼうとし、研究没頭や創作活動などクリエイティブな領域で力を発揮します。";
  } else if (horizontal > vertical) {
    type = "現実社会型";
    text = "横線（東・木＋西・金）のエネルギーが縦線（北・水＋南・火）を上回るため、現実社会に強いタイプです。世渡り上手で人付き合いも卒なくこなせ、社会で生き残る術を追求し、お金儲けが得意な働き者です。";
  } else {
    type = "バランス型";
    text = "縦線と横線のエネルギーが均衡しており、学問と現実社会の両面でバランスよく活躍できるタイプです。";
  }

  let schoolAdvice;
  if (southeast > northwest) {
    schoolAdvice = "東南の合計値が高いため、私立校への進学が向いています。";
  } else if (northwest > southeast) {
    schoolAdvice = "西北の合計値が高いため、官公立校への進学が才能を伸ばす傾向が高いです。";
  } else {
    schoolAdvice = "東南と西北のバランスが取れているため、どちらの進学先でも才能を発揮できます。";
  }

  return { type, text, schoolAdvice, vertical, horizontal, southeast, northwest };
}

// === 干合法 ===
// 参考: https://sanmei-stock.com/applied/resonance/
// kangouPairs は六親法セクションで既に定義済み（line 844）

function analyzeKangou(pillars) {
  const results = [];
  const pairDefs = [
    { a: "year", b: "month", label: "年柱と月柱" },
    { a: "year", b: "day", label: "年柱と日柱" },
    { a: "month", b: "day", label: "月柱と日柱" }
  ];
  pairDefs.forEach(({ a, b, label }) => {
    const sa = pillars[a].stem, sb = pillars[b].stem;
    const ba = pillars[a].branch, bb = pillars[b].branch;
    if (kangouPairs[sa] === sb) {
      results.push({ label, type: "干合", stars: `${sa}↔${sb}`, note: `${sa}と${sb}は引き寄せ合う関係です。上の文字同士が強く引き合い、特別な縁を表します。出会うべき人との縁を意味します。` });
    }
    if (kangouPairs[sa] === sb && shigouPair[ba] === bb) {
      results.push({ label, type: "干合支合", stars: `${sa}${ba}↔${sb}${bb}`, note: `${sa}${ba}と${sb}${bb}は上も下も引き寄せ合う関係です。非常に結びつきが強い組み合わせで、思考力があり、危険を避けながら周囲と上手くやっていける人です。` });
    }
    if (kangouPairs[sa] === sb && gaiPair[ba] === bb) {
      results.push({ label, type: "干合支害", stars: `${sa}${ba}↔${sb}${bb}`, note: `${sa}${ba}と${sb}${bb}は上は引き合うのに下はぶつかり合う、複雑な関係です。表面的には惹かれ合っても、内在する摩擦やストレスを抱えやすい組み合わせです。` });
    }
  });
  return results;
}

// === 洩天地支（えいてんちし）===
// 参考: https://sanmei-stock.com/applied/eten-chishi/
function analyzeEitenchishi(pillars) {
  const results = [];
  ["year", "month", "day"].forEach(key => {
    const p = pillars[key];
    const stemEl = elements[stems.indexOf(p.stem)];
    const branchEl = branchElements[p.branch];
    const rel = getGogyoRelation(stemEl, branchEl);
    if (rel === "相生(→)") {
      const label = key === "year" ? "年柱" : key === "month" ? "月柱" : "日柱";
      results.push({ pillar: label, stem: p.stem, branch: p.branch, note: `${p.stem}${p.branch}は内面のエネルギーが自然に外面に表れやすい干支です。上の文字が下の文字を後押しする関係にあり、才能が外に発揮されやすい傾向があります。` });
    }
  });
  return results;
}

// === 調候守護神 ===
// 参考: https://sanmei-stock.com/category/basic/guardian/
function getSeasonFromMonth(month) {
  if (month >= 2 && month <= 4) return "春";
  if (month >= 5 && month <= 7) return "夏";
  if (month >= 8 && month <= 10) return "秋";
  return "冬";
}

const choukouTable = {
  "甲": { 春: { el: "火", reason: "春の木は火で発散させると良い。" }, 夏: { el: "水", reason: "夏の木は水で潤すと良い。" }, 秋: { el: "水", reason: "秋の木は金剋を水で和らげると良い。" }, 冬: { el: "火", reason: "冬の木は火で温めると良い。" } },
  "乙": { 春: { el: "火", reason: "春の木は火で発散させると良い。" }, 夏: { el: "水", reason: "夏の木は水で潤すと良い。" }, 秋: { el: "水", reason: "秋の木は金剋を水で和らげると良い。" }, 冬: { el: "火", reason: "冬の木は火で温めると良い。" } },
  "丙": { 春: { el: "水", reason: "春の火は水で潤すと良い。" }, 夏: { el: "水", reason: "夏の火は水で冷やすと良い。" }, 秋: { el: "木", reason: "秋の火は木で助けると良い。" }, 冬: { el: "木", reason: "冬の火は木で助けると良い。" } },
  "丁": { 春: { el: "水", reason: "春の火は水で潤すと良い。" }, 夏: { el: "水", reason: "夏の火は水で冷やすと良い。" }, 秋: { el: "木", reason: "秋の火は木で助けると良い。" }, 冬: { el: "木", reason: "冬の火は木で助けると良い。" } },
  "戊": { 春: { el: "火", reason: "春の土は火で温めると良い。" }, 夏: { el: "水", reason: "夏の土は水で潤すと良い。" }, 秋: { el: "火", reason: "秋の土は火で温めると良い。" }, 冬: { el: "火", reason: "冬の土は火で温めると良い。" } },
  "己": { 春: { el: "火", reason: "春の土は火で温めると良い。" }, 夏: { el: "水", reason: "夏の土は水で潤すと良い。" }, 秋: { el: "火", reason: "秋の土は火で温めると良い。" }, 冬: { el: "火", reason: "冬の土は火で温めると良い。" } },
  "庚": { 春: { el: "土", reason: "春の金は土で保護すると良い。" }, 夏: { el: "水", reason: "夏の金は水で冷やすと良い。" }, 秋: { el: "火", reason: "秋の金は火で鍛えると良い。" }, 冬: { el: "土", reason: "冬の金は土で保護すると良い。" } },
  "辛": { 春: { el: "土", reason: "春の金は土で保護すると良い。" }, 夏: { el: "水", reason: "夏の金は水で冷やすと良い。" }, 秋: { el: "火", reason: "秋の金は火で鍛えると良い。" }, 冬: { el: "土", reason: "冬の金は土で保護すると良い。" } },
  "壬": { 春: { el: "金", reason: "春の水は金で生じると良い。" }, 夏: { el: "金", reason: "夏の水は金で生じると良い。" }, 秋: { el: "火", reason: "秋の水は火で温めると良い。" }, 冬: { el: "火", reason: "冬の水は火で温めると良い。" } },
  "癸": { 春: { el: "金", reason: "春の水は金で生じると良い。" }, 夏: { el: "金", reason: "夏の水は金で生じると良い。" }, 秋: { el: "火", reason: "秋の水は火で温めると良い。" }, 冬: { el: "火", reason: "冬の水は火で温めると良い。" } }
};

function analyzeChoukou(dayStem, birthMonth) {
  const season = getSeasonFromMonth(birthMonth);
  const entry = choukouTable[dayStem];
  if (!entry) return null;
  const s = entry[season];
  return { dayStem, season, element: s.el, reason: s.reason };
}

// === 八門法 ===
// 参考: https://sanmei-stock.com/basic/mathematical-technique/hachimon/
const hachimonLayout = {
  "木": { north: "水", south: "火", east: "土", west: "金", center: "木" },
  "火": { north: "木", south: "土", east: "金", west: "水", center: "火" },
  "土": { north: "火", south: "金", east: "水", west: "木", center: "土" },
  "金": { north: "土", south: "水", east: "木", west: "火", center: "金" },
  "水": { north: "金", south: "木", east: "火", west: "土", center: "水" }
};

function analyzeHachimon(dayStem, counts) {
  const dayEl = elements[stems.indexOf(dayStem)];
  const layout = hachimonLayout[dayEl];
  if (!layout) return null;
  const positions = {
    north: counts[layout.north] || 0,
    south: counts[layout.south] || 0,
    east: counts[layout.east] || 0,
    west: counts[layout.west] || 0,
    center: counts[layout.center] || 0
  };
  const maxDir = Object.entries(positions).reduce((a, b) => b[1] > a[1] ? b : a)[0];
  const typeMap = {
    north: { name: "玄武型", text: "どんなに過保護にされても自分の本質を見失わない強さを持っています。学ぶ意欲が強く、生きていく上で必要な知識が十分にあります。人から頼りにされやすいでしょう。学者や芸術家に多いタイプです。" },
    east: { name: "青龍型", text: "攻撃精神が強く前進力があります。失敗してもへこたれない強さを持っています。後退することを知らないような性格です。サラリーマンやOLよりも商人的な世界が向いています。" },
    south: { name: "朱雀型", text: "「人を助けたい」という欲望が強くあります。誰かの役に立てるなら、環境に沿って自分を変化させることができます。必要とされることで生きがいを感じます。医者や人助けの世界に向いています。" },
    west: { name: "白虎型", text: "褒められるよりも厳しくされる方が伸びるタイプです。人から攻撃されることで成長していきます。自尊心が強く、プライドを傷つけられることで更に上へ上がろうと努力します。エンジニアや弁護士、会計士などが向いています。" },
    center: { name: "螣陀型", text: "自分自身が一番強いと感じており、何があっても動じない強さを持っています。自分自身の意思によってしか行動しません。ただし、助けられると助けられるままに流れていくため、助けられない状態に身を置くことが成功への近道です。政治家に向いています。" }
  };
  const yinYang = (positions.east + positions.south) > (positions.west + positions.north) ? "陽型" : "陰型";
  const yinYangText = yinYang === "陽型"
    ? "現実的な世界、生産的な世界で成功しやすいです。実利主義なので、実業家や起業家として大きな財を成す可能性が高いでしょう。"
    : "学者や芸術家、クリエイターなど、生産性に直結しない世界に向いています。自分の感性やインスピレーションを発信、表現することに重きをおきます。";
  const junGyo = (positions.north + positions.south) > (positions.east + positions.west) ? "順型" : "逆型";
  const junGyoText = junGyo === "順型"
    ? "前進力は弱めですが、理性が働く理論派です。"
    : "前進力が強い、行動派・攻撃派です。";
  return { layout, positions, maxDir, type: typeMap[maxDir], yinYang, yinYangText, junGyo, junGyoText };
}

// === 意識と無意識 ===
// 参考: https://sanmei-stock.com/applied/conscious-and-unconscious/
function analyzeIshiki(pillars, day) {
  const dayEl = elements[stems.indexOf(day.stem)];
  const targets = [];
  ["year", "month", "day"].forEach(key => {
    const p = pillars[key];
    if (key === "day") return; // 日干自身は除外
    const stemEl = elements[stems.indexOf(p.stem)];
    const branchEl = branchElements[p.branch];
    const stemRel = getGogyoRelation(dayEl, stemEl);
    const branchRel = getGogyoRelation(dayEl, branchEl);
    targets.push({ pillar: key === "year" ? "年柱" : "月柱", stem: p.stem, branch: p.branch, stemEl, branchEl, stemRel, branchRel });
  });
  let conscious = 0, unconscious = 0;
  targets.forEach(t => {
    if (t.stemRel === "相生(→)" || t.stemRel === "相生(←)") unconscious++;
    else conscious++;
    if (t.branchRel === "相生(→)" || t.branchRel === "相生(←)") unconscious++;
    else conscious++;
  });
  const monthBranchEl = branchElements[pillars.month.branch];
  const monthBranchRel = getGogyoRelation(dayEl, monthBranchEl);
  const monthConflict = (monthBranchRel === "相生(→)" || monthBranchRel === "相生(←)") ? "低い" : "高い";
  let summary;
  if (conscious > unconscious) {
    summary = "意識して努力することが多いため、葛藤が多い苦労人タイプです。常に何かを意識し、感じながら人生を歩むため心が休まりにくいですが、精神的な成長は早くなります。早咲きの傾向です。";
  } else if (unconscious > conscious) {
    summary = "自然に恵まれることが多いため、周りに助けられながら自然に発展するタイプです。物事を深く考える必要がなく、記憶力は抜群ですが、深みのない人間形成になりがちです。遅咲きの傾向です。";
  } else {
    summary = "意識と無意識のバランスが取れており、苦労と恩恵の両方を経験するタイプです。";
  }
  return { targets, conscious, unconscious, summary, monthBranchRel, monthConflict };
}

// === 二行干支 ===
// 参考: https://sanmei-stock.com/applied/applied-divination/two-lines-of-zodiac/
function analyzeNiko(pillars) {
  const elementSet = new Set();
  const kanshiSet = new Set();
  ["year", "month", "day"].forEach(key => {
    const p = pillars[key];
    elementSet.add(elements[stems.indexOf(p.stem)]);
    elementSet.add(branchElements[p.branch]);
    kanshiSet.add(p.stem + p.branch);
  });
  const isTwoElements = elementSet.size === 2;
  const isTwoKanshi = kanshiSet.size === 2;
  if (!isTwoElements && !isTwoKanshi) return null;
  return {
    isTwoElements,
    isTwoKanshi,
    elements: Array.from(elementSet),
    kanshi: Array.from(kanshiSet),
    note: "二行干支に該当します。直感と感情で行動するパワフルなタイプで、フィーリングを大切にします。周囲からは勘が鋭くて頭の回転が速く見えます。結婚して子供を持つと至って普通の人に戻ります。子供がいなければ、感情で動き、行動力抜群です。"
  };
}

// === 星の組み合わせ（十態）===
// 参考: https://sanmei-stock.com/basic/star-combinations-and-bias/
const juttaiConditions = [
  { name: "傷相", cond: (stars, energies) => stars.includes("龍高星") && stars.includes("鳳閣星") && energies.includes("天極星"), note: "成人するまで（20歳まで）は怪我をしやすいです。" },
  { name: "病相", cond: (stars, energies) => (stars.includes("龍高星") || stars.includes("玉堂星")) && stars.includes("調舒星") && energies.includes("天馳星"), note: "故障が多くなります。※大病ではありません。" },
  { name: "罪相", cond: (stars, energies) => stars.includes("龍高星") && stars.includes("石門星") && energies.includes("天堂星"), note: "騙したり騙されやすくなります。無実の罪を着せられる可能性があります。" },
  { name: "抗相", cond: (stars, energies) => stars.includes("車騎星") && stars.includes("調舒星") && (energies.includes("天極星") || energies.includes("天庫星")), note: "神経質になりやすく、ノイローゼ気味になります。周囲の人と争うと傷付きます。" },
  { name: "独相", cond: (stars, energies) => stars.filter(s => s === "貫索星").length >= 2 && energies.includes("天馳星"), note: "人を受け入れられない頑なな心を持ちやすくなります。実直で義理堅いですが、視野が狭くなりがちです。" },
  { name: "情相", cond: (stars, energies) => stars.includes("禄存星") && (stars.includes("調舒星") || stars.includes("龍高星")) && energies.includes("天恍星"), note: "異性の許容度が高くなり、結婚・恋愛の相手がよりどりみどりになります。" },
  { name: "色相", cond: (stars, energies) => (stars.includes("司禄星") && stars.includes("龍高星")) || (stars.includes("禄存星") && energies.includes("天恍星")), note: "歳を取っても若々しく見られます。恋愛対象となる相手が多すぎて、選り好みしているうちに結婚のタイミングを見極めにくくなることがあります。" },
  { name: "団相", cond: (stars, energies) => stars.includes("調舒星") && stars.includes("龍高星") && stars.includes("石門星") && energies.includes("天堂星"), note: "現存する団体や組織に反対するようになり、車騎星があるとリーダー的存在になります。" },
  { name: "破相", cond: (stars, energies) => stars.includes("禄存星") && stars.includes("司禄星") && energies.includes("天将星"), note: "結婚した場合に最初の10年間は幸せに過ごせても、それ以降は夫婦ともに相手の運を下げてしまう可能性があります。" },
  { name: "消相", cond: (stars, energies) => stars.includes("石門星") && stars.includes("司禄星") && energies.includes("天恍星"), note: "目上から譲り受けた財産を全て失う傾向があります。自分の力で稼いだ分の財産は残ります。" }
];

const sankishiCond = { cond: (stars, energies) => stars.includes("調舒星") && stars.includes("車騎星") && stars.includes("龍高星") && energies.includes("天堂星"), note: "三奇星：心の葛藤が多くなり奇人・変人（良ければ天才）になります。" };
const shichisatsuConds = [
  { cond: (stars) => stars.includes("龍高星") && stars.includes("鳳閣星"), note: "七殺（龍高＋鳳閣）：表面的には穏やかでも内面は葛藤が大きくなります。" },
  { cond: (stars) => stars.includes("車騎星") && stars.includes("調舒星"), note: "七殺（車騎＋調舒）：心の葛藤が顕著で、ある時期に病気を患う可能性が高いため注意が必要です。" }
];

function analyzeStarCombos(mainStars, energyStarsArr) {
  const allStars = Object.values(mainStars);
  const allEnergies = energyStarsArr.map(e => e.name);
  const results = [];
  juttaiConditions.forEach(j => {
    if (j.cond(allStars, allEnergies)) results.push({ type: "十態", name: j.name, note: j.note });
  });
  if (sankishiCond.cond(allStars, allEnergies)) results.push({ type: "特殊", name: "三奇星", note: sankishiCond.note });
  shichisatsuConds.forEach(s => {
    if (s.cond(allStars)) results.push({ type: "特殊", name: "七殺", note: s.note });
  });
  return results;
}

// === 同星3連変化 ===
// 参考: https://sanmei-stock.com/basic/ten-main-stars/triple-variation/
const tripleStarTexts = {
  "貫索星": { dir: "東方定位置", text3: "表面は穏やかですが、中身はとても激しい性格。いざという時の集中力と実行力は凄まじいです。感情の起伏が大きく、視野が狭くなりがちですが、一度恩義を感じた人には一生忠実です。", text4: "表面は柔らかく見えますが、意外とバランスを崩しやすい傾向があります。" },
  "石門星": { dir: "東方定位置", text3: "信念が強く考えを曲げない頑固さを持ちますが、表面には出しません。知らぬ間に周囲を巻き込み、自然にリーダーになるタイプです。", text4: "表面はソフトに見えても、人の話を受け入れることはありません。交渉ごとに強いタイプです。" },
  "鳳閣星": { dir: "南方定位置", text3: "明るく社交的で温かい人ですが、ふとした時に薄情な面を見せます。精神的に不安定になりやすく、人の好き嫌いが激しくなります。", text4: "表面は温かそうですが、実はかなりクールな面も持ちます。晩年も子に囚われず潔いタイプです。" },
  "調舒星": { dir: "南方定位置", text3: "理想を追い求める繊細な性格。感性が鋭くなり、あらゆることに敏感で傷つきやすいです。人からの期待で力を発揮するタイプです。", text4: "" },
  "禄存星": { dir: "中央定位置", text3: "自意識が強く、権力欲の強いタイプ。用心深く頑固で、目上の意見にも耳を貸しません。交渉が巧みで、慕ってくる人には強引なほど親切です。", text4: "" },
  "司禄星": { dir: "中央定位置", text3: "気が利いて要領の良いタイプ。頭の回転が速く、世渡りも上手です。堅実ですが行動力もあり、本心が見えにくい面もあります。", text4: "" },
  "車騎星": { dir: "西方定位置", text3: "闘争心が強く、攻撃的な性格。発想が動的で変化が激しく、周囲からは落ち着きがないように見えますが、本人は動きながら考えるのが自然です。", text4: "" },
  "牽牛星": { dir: "西方定位置", text3: "闘争心が強く、攻撃的な性格。発想が動的で変化が激しく、前に進むか引くかを常に頭の中で考えています。", text4: "" },
  "龍高星": { dir: "北方定位置", text3: "普段はクールですが、義理人情に厚いお人好し。放浪性が強く単独行動が目立ちます。孤独に強く、安住すると力が出ず、変化の時こそ実力を発揮します。", text4: "義理人情が厚くなり、お人好しさに磨きがかかります。情に流されやすいですが、人に助けてもらう機会も増えます。" },
  "玉堂星": { dir: "北方定位置", text3: "頑固ですが社交性があり、人脈を広げるのが上手。甘え上手でピンチの時に人から助けてもらえる運の良さがあります。考えすぎて行動に移せないことも多いです。", text4: "" }
};

function analyzeTripleStar(mainStars) {
  const allStars = Object.values(mainStars);
  const counts = {};
  allStars.forEach(s => { counts[s] = (counts[s] || 0) + 1; });
  const results = [];
  Object.entries(counts).forEach(([star, count]) => {
    if (count >= 3) {
      const info = tripleStarTexts[star];
      if (info) {
        results.push({
          star,
          count,
          dir: info.dir,
          text: count >= 4 && info.text4 ? info.text4 : info.text3
        });
      }
    }
  });
  return results;
}

// === 十二大従星の偏り ===
// 参考: https://sanmei-stock.com/basic/star-combinations-and-bias/
const energyBiasTexts = {
  "天将星": {
    count2: "天将星が2つある人は、一つだけの人よりも天将星の良さがとても発揮されます。きちんとした目的を持つことができれば、迷うことなく凄まじい前進力を発揮します。表面上が優しく見られがちですが、人生に一貫性があり、現実エネルギーが高くとても逞しい人です。",
    count3: "天将星が3つある場合は、弱さと脆さがありますが、一度最悪の時期を経験して乗り越えることができれば、天将星の良さが出てくるようになります。両極端な人で、落ちこぼれになる可能性も十分あります。天才か狂人のどちらかになれます。"
  },
  "天庫星": { count3: "天庫星が3つある人は、5歳を超えるまでは危険ですが、5歳を超えると長寿の人になれます。" },
  "天胡星": { count3: "天胡星が3つある人は、無欲になれますが、義理人情もなく、世の中の常識や習わしを軽視する傾向があります。弱々しく見えても短命ではありません。" },
  "天極星": { count3: "天極星が3つある人は、天将星が3つある人も敵わないほど変人・奇人です。この場合の変人・奇人度は「死を恐れない」ほどです。" },
  "天馳星": { count3: "天馳星が3つある人は、天将星一つと同じ強さになります。成功するしないに関わらず、常に忙しく動き回り、汗水流して働きまくります。この性質は天馳星が2つの場合も同じです。" }
};

function analyzeEnergyBias(energyStarsArr) {
  const counts = {};
  energyStarsArr.forEach(e => { counts[e.name] = (counts[e.name] || 0) + 1; });
  const results = [];
  Object.entries(counts).forEach(([star, count]) => {
    if (count >= 2) {
      const info = energyBiasTexts[star];
      if (info) {
        let text = "";
        if (count >= 3 && info.count3) text = info.count3;
        else if (count === 2 && info.count2) text = info.count2;
        else if (count >= 3 && info.count3) text = info.count3;
        if (text) results.push({ star, count, text });
      }
    }
  });
  return results;
}

// === 三分法 ===
// 参考: https://sanmei-stock.com/basic/yang/trichotomy/
const sanbunPeriodMap = {
  year: { label: "初年期（若年期）", ageRange: "生誕〜成人", starKey: "north" },
  month: { label: "中年期（壮年期）", ageRange: "成人〜引退", starKey: "south" },
  day: { label: "晩年期", ageRange: "引退〜死", starKey: "west" }
};

const realityStars = ["貫索星", "石門星", "禄存星", "司禄星", "車騎星", "牽牛星"];
const spiritStars = ["鳳閣星", "調舒星", "龍高星", "玉堂星"];
const realityEnergies = ["天貴星", "天恍星", "天南星", "天禄星", "天将星", "天堂星", "天胡星"];
const spiritEnergies = ["天極星", "天庫星", "天馳星", "天報星", "天印星"];

const mismatchTexts = {
  5: "現実と精神が大きく逆回転する型。会社員よりフリーランス、芸術・企画・研究など型破りな道で才能が爆発する。常識に従うと息苦しくなるので、自分の世界を貫くのが開運の鍵。周りと違うことを恐れず、想像力を武器に生きる人。",
  4: "現実と精神が大きくズレる型。真面目にやろうとするほど空回りし、周囲の期待に応えられない苦しみがある。人を当てにせず、自分のペースでコツコツ積み上げると運が開く。信仰や哲学など精神の拠り所を持つと心が安定する。",
  3: "現実と精神が半々の型。サラリーマンにも独立にも適応できる柔軟さがあるが、どちらつかずで迷いやすい。30代までに「安定か挑戦か」を決めると良い。変化の激しい業界（IT・メディア・外食等）に入ると本来の力が出る。",
  2: "現実寄りの型。ルールを守り、信用第一で着実に歩む人生。公務員・大企業・士業など安定した職場で力を発揮する。派手な成功より、確実な実績を積むことで40代以降に安定した地位と収入が築ける。",
  1: "精神寄りの型。自分からガンガン攻めるより、信頼できる人についていくことで運が開く。優秀な上司やパートナーに恵まれると伸びるが、自分一人で全部やろうとすると空回りする。組織の中でNo.2として力を発揮するタイプ。",
  0: "現実と精神が一致する型。守りを徹底することが最も運を呼ぶ。引越しや転職は最小限にし、年中行事や地域の行事を大切にすると運が安定する。地元で地道に信頼を積み上げるのが最良の生き方。変化より継続が運を開く。"
};

function analyzeSanbun(mainStars, energyStarsArr) {
  const periods = ["year", "month", "day"];
  const results = periods.map(key => {
    const periodInfo = sanbunPeriodMap[key];
    const mainStar = mainStars[periodInfo.starKey];
    const energyStar = energyStarsArr.find(e => e.pillar === key);
    const energyName = energyStar ? energyStar.name : "";
    const isRealityMain = realityStars.includes(mainStar);
    const isSpiritMain = spiritStars.includes(mainStar);
    const isRealityEnergy = realityEnergies.includes(energyName);
    const isSpiritEnergy = spiritEnergies.includes(energyName);
    const isMismatch = (isRealityMain && isSpiritEnergy) || (isSpiritMain && isRealityEnergy);
    return {
      key,
      label: sanbunPeriodMap[key].label,
      ageRange: sanbunPeriodMap[key].ageRange,
      mainStar,
      energyName,
      isRealityMain,
      isSpiritMain,
      isRealityEnergy,
      isSpiritEnergy,
      isMismatch
    };
  });
  const mismatchCount = results.filter(r => r.isMismatch).length;
  const matchCount = 3 - mismatchCount;
  const mismatchText = mismatchTexts[mismatchCount] || "";
  return { periods: results, mismatchCount, matchCount, mismatchText };
}

// === 適職占技 ===
// 参考: https://sanmei-stock.com/applied/applied-divination/suitable-occupation-reading/
const sekishokuData = {
  "貫索星": { keywords: "維持、保守、管理、自立", text: "変えない、変化させない事を目的とする仕事が適職です。守ることが得意なので、美術品を守る博物館の仕事や警備員なども向いています。人間の命を守ろうとする臨床医、他人のものを保管してあげるような仕事も向いています。単独行動、独立業や自営業が向いています。", celebs: "堀江貴文（起業家）、赤川次郎（作家）、伊東四朗（俳優）" },
  "石門星": { keywords: "人脈を広げる、リーダーシップ、人を束ねる", text: "和合を重視する仕事が向いています。人を集めたり、大勢を束ねたり、グループ形成が得意です。交渉力や説得力が抜群なので、そういった局面が多い職業はいいでしょう。フランチャイズや営業など、人を使って広げていく仕事が向いています。", celebs: "安倍晋三（政治家・首相）、松下幸之助（実業家・パナソニック創業者）、三木谷浩史（実業家・楽天社長）" },
  "鳳閣星": { keywords: "客観的、分かりやすさ、バランス感", text: "伝達に関わる仕事（客観的）に向いています。自然に向き合う仕事も向いていますので農業や酪農なども向いています。人を楽しませる職業も向いていますので、レジャー系の仕事や飲食の仕事、芸能関係の仕事も向いています。報道系でアナウンサーやリポーターなどの職業も向いています。", celebs: "小泉純一郎（政治家・首相）、中曽根康弘（政治家・首相）" },
  "調舒星": { keywords: "きめ細やかさ、センス", text: "自分のこだわりを貫ける、特殊技術を扱う仕事や専門家が向いています。繊細で神経を使うような仕事や、代わりの効かない仕事がいいです。基本的には個人プレイで完結できる仕事で、自分個人の考えや主張を伝える仕事はほぼ含まれます。", celebs: "井ノ原快彦（タレント・キャスター・V6）" },
  "禄存星": { keywords: "信用、奉仕", text: "奉仕的な仕事全般が向いています。人を惹きつける根本には深い愛情があります。また、財を回す仕事も向いています。ボランティア関連、医療全般、証券会社、銀行員など人の財産を扱う仕事も適職です。", celebs: "明石家さんま（タレント）、北野武（タレント・映画監督）、天海祐希（女優）、浜崎あゆみ（歌手）、吉永小百合（女優）" },
  "司禄星": { keywords: "家庭的、コツコツ努力", text: "生活関連、真面目さ、誠実さ、まとめる力を試される仕事が向いています。コツコツ努力することが得意なので、どんな仕事でも地味だけど着実に前進します。集めたり、蓄積と準備が得意です。情報収集、金融系、保険系の仕事も向いています。", celebs: "大谷翔平（野球選手・二刀流）、三浦知良（サッカー選手・J最年長）" },
  "車騎星": { keywords: "役に立つ、負けない、頑張る、営業現場力", text: "行動的な仕事で、現場でやる仕事が得意です。スピードを求められる仕事も向いています。スポーツ選手として好まれる星です。金星は攻撃本能なので、ルールに則った勝負事を得意としますので法律関係の仕事も向いています。「武官」と称します。", celebs: "木村拓哉（俳優・SMAP）、加藤茶（タレント・ザ・ドリフターズ）" },
  "牽牛星": { keywords: "組織大切、既存の組織を作る", text: "プライドが高い星なので、国家資格など誰もが知っているような資格を取得して、みんなから認められるような仕事が向いています。公務員や役員や政治家、大企業への就職などを求めます。補佐的な仕事（No.2的立ち位置、秘書など）も向いています。「文官」と称します。", celebs: "石原慎太郎（政治家・東京都知事）、田原総一朗（ジャーナリスト）、森田正光（気象キャスター・実業家）" },
  "龍高星": { keywords: "企画、臨機応変さ", text: "外国や異文化に関わる仕事に向いています。マンネリを一番嫌うので、常に変化がある仕事を好みます。独創的で常に新しいものに触れていられる仕事が向いています。立体思考の持ち主なので、もともとあるものを応用して変化させることを得意とします。デザイン関係の仕事も向いています。", celebs: "大村智（ノーベル生理学・医学賞受賞者）、澤穂希（サッカー選手・元日本代表）、森英惠（ファッションデザイナー）" },
  "玉堂星": { keywords: "企画、教育", text: "企画・設計・計画する仕事が向いています。教養を活かした仕事や、教育に関わる仕事も適職です。準備や蓄積が得意なので、研究職や開発職にも向いています。", celebs: "タモリ（タレント）、イチロー（野球選手）、藤井聡太（将棋棋士・最年少名人）、鳥山明（漫画家・ドラゴンボール）、田中角栄（政治家・首相）" }
};

function analyzeSekishoku(mainStars) {
  const eastStar = mainStars.east;
  const southStar = mainStars.south;
  const eastData = sekishokuData[eastStar];
  const southData = sekishokuData[southStar];
  if (!eastData || !southData) return null;
  const eastElVal = getStarElement(eastStar);
  const southElVal = getStarElement(southStar);
  let relation = "バランス";
  let relationText = "報酬もやりがいも重視し、理想と現実が一致します。そのため、適職を見極めるのに迷いはありません。しかし、その仕事ができない時の苦しみは人一倍あります。";
  if (eastElVal && southElVal) {
    const rel = getGogyoRelation(eastElVal, southElVal);
    if (rel === "相生(→)" || rel === "相生(←)") {
      relation = "うまくまとまる";
      relationText = "うまくまとまるので仕事に対する矛盾や悩みは少なくなります。現実重視から自然にやりがいなどの精神的満足を重視するようになります。または、仕事内容を重視しながら報酬も重視する傾向があります。";
    } else if (rel === "相剋(→)" || rel === "相剋(←)") {
      relation = "現実と理想がぶつかる";
      relationText = "理想と現実が繋がらないため、仕事に迷いが生じやすいです。ただ、苦しむことで得られる成長があります。現実を優先する場合は報酬を重視し、やりがいは二の次になります。理想を優先する場合はやりがいを重視し、報酬は気にならなくなります。";
    }
  }
  return { eastStar, southStar, eastData, southData, relation, relationText };
}

// === 情的か理性的か ===
// 参考: https://sanmei-stock.com/mind-skill/yang-hao/myself/emotional_or_rational/
function analyzeJoritsu(mainStars) {
  const horizontalStars = [mainStars.east, mainStars.west, mainStars.center];
  const southNorthStars = ["玉堂星", "龍高星", "鳳閣星", "調舒星"];
  const hasSouthNorth = horizontalStars.some(s => southNorthStars.includes(s));
  if (hasSouthNorth) {
    return {
      type: "理性的",
      text: "情の立ち切りが早い人です。親離れ・子離れも早いでしょう。理性度が高すぎると、恋愛にのめり込めず結婚のタイミングを見極めにくくなる傾向があります。理性的な人は、恋愛結婚よりもお見合い結婚の方が向いています。",
      horizontalStars
    };
  } else {
    return {
      type: "情的",
      text: "情的なのでお人好しの傾向があります。親離れ・子離れも遅くなりがちです。ただ、横線に南・北定位置星がないのに情の立ち切り方が早い人もいますが、その人は薄情だと思われがちです。",
      horizontalStars
    };
  }
}

// === 変剋律 ===
// 参考: https://sanmei-stock.com/applied/applied-divination/henkokuritsu/
const abnormalZodiacList = ["甲戌", "乙亥", "丙戌", "丁巳", "丁亥", "戊戌", "戊子", "己亥", "庚子", "辛巳", "辛亥", "壬午", "癸巳"];

const henkokuChains = [
  { stars: ["丙戌", "丁亥", "戊子"], type: "3つ連続", note: "丙戌→丁亥→戊子の3つ連続変剋律。大運天中殺の代わりとなる運気（準大運天中殺）です。" },
  { stars: ["戊戌", "己亥", "庚子"], type: "3つ連続", note: "戊戌→己亥→庚子の3つ連続変剋律。大運天中殺の代わりとなる運気（準大運天中殺）です。" },
  { stars: ["甲戌", "乙亥"], type: "2つ連続", note: "甲戌→乙亥の2つ連続変剋律。大運天中殺を優先してください。" },
  { stars: ["辛巳", "壬午"], type: "2つ連続", note: "辛巳→壬午の2つ連続変剋律。" }
];

function analyzeHenkoku(pillars) {
  const pillarKanshi = ["year", "month", "day"].map(k => pillars[k].stem + pillars[k].branch);
  const abnormalInMeimei = pillarKanshi.filter(k => abnormalZodiacList.includes(k));
  if (abnormalInMeimei.length === 0) return null;
  const matchedChains = [];
  henkokuChains.forEach(chain => {
    const matched = chain.stars.filter(s => abnormalInMeimei.includes(s));
    if (matched.length >= 2) {
      matchedChains.push({ ...chain, matched });
    }
  });
  return {
    abnormalInMeimei,
    matchedChains,
    note: "生まれ持った特殊な干支があります。運気の周期で特殊な干支が2つ以上連続して現れる時期は、人生の大きな転換期になります。その時期を乗り越えるには、突入して最初の5年間の悩み抜くことが成長の鍵になります。"
  };
}

// === 混在占技 ===
// 参考: https://sanmei-stock.com/applied/applied-divination/mixture/
function analyzeKonzai(pillars) {
  const pillarKanshi = ["year", "month", "day"].map(k => pillars[k].stem + pillars[k].branch);
  const abnormalInMeimei = pillarKanshi.filter(k => abnormalZodiacList.includes(k));
  const scrambleBranches = ["子", "巳", "午", "戌", "亥"];
  const hasScrambleBranch = ["year", "month", "day"].some(k => scrambleBranches.includes(pillars[k].branch));
  if (abnormalInMeimei.length > 0) {
    return {
      hasAbnormal: true,
      hasScrambleBranch,
      note: "生まれ持った命式に特殊な干支があるため、混在占技の作用は弱めです。生まれ持った命式に特殊な干支がない人の方が、混在占技の作用が大きくなります。"
    };
  }
  if (!hasScrambleBranch) {
    return {
      hasAbnormal: false,
      hasScrambleBranch: false,
      note: "生まれ持った命式に「子・巳・午・戌・亥」いずれもないため、混在占技の対象外です。"
    };
  }
  return {
    hasAbnormal: false,
    hasScrambleBranch: true,
    note: "生まれ持った命式に特殊な干支はありませんが、「子・巳・午・戌・亥」があるため、運気の周期との組み合わせで突然壁にぶつかる時期ができる可能性があります。その時期は、特に注意が必要な年と、助けが来る年があります。"
  };
}

// === 特殊位相法（大半会・律音・納音・天剋地冲）===
// 参考: https://sanmei-stock.com/category/basic/yin/topology/
const taishuPair = { 寅: "卯", 卯: "辰", 辰: "巳", 巳: "午", 午: "未", 未: "申", 申: "酉", 酉: "戌", 戌: "亥", 亥: "子", 子: "丑", 丑: "寅" };
const taichuPair = { 子: "午", 午: "子", 丑: "未", 未: "丑", 寅: "申", 申: "寅", 卯: "酉", 酉: "卯", 辰: "戌", 戌: "辰", 巳: "亥", 亥: "巳" };

function analyzeTokushuIso(pillars) {
  const results = [];
  const pairs = [
    { keys: ["year", "month"], label: "年柱×月柱" },
    { keys: ["year", "day"], label: "年柱×日柱" },
    { keys: ["month", "day"], label: "月柱×日柱" }
  ];
  pairs.forEach(pair => {
    const p1 = pillars[pair.keys[0]];
    const p2 = pillars[pair.keys[1]];
    const k1 = p1.stem + p1.branch;
    const k2 = p2.stem + p2.branch;
    if (k1 === k2) {
      results.push({ pair: pair.label, type: "律音", note: "上の文字も下の文字も全く同じ（同干支）。同じ性質が重なるため、結びつきが非常に強い関係です。" });
    }
    if (p1.stem === p2.stem && taichuPair[p1.branch] === p2.branch) {
      results.push({ pair: pair.label, type: "納音", note: "上の文字が同じで下の文字が正反対。「音が納まる」＝物事が一つにまとまる関係です。" });
    }
    if (p1.stem === p2.stem && taishuPair[p1.branch] === p2.branch) {
      results.push({ pair: pair.label, type: "大半会", note: "上の文字が同じで下の文字が隣り合う。隣り合うよりも強い結びつきがあります。" });
    }
    const s1El = elements[stems.indexOf(p1.stem)];
    const s2El = elements[stems.indexOf(p2.stem)];
    const stemRel = getGogyoRelation(s1El, s2El);
    const isYangSame = (stems.indexOf(p1.stem) % 2 === 0 && stems.indexOf(p2.stem) % 2 === 0) || (stems.indexOf(p1.stem) % 2 === 1 && stems.indexOf(p2.stem) % 2 === 1);
    if (isYangSame && (stemRel === "相剋(→)" || stemRel === "相剋(←)") && taichuPair[p1.branch] === p2.branch) {
      results.push({ pair: pair.label, type: "天剋地冲", note: "上の文字が同じタイプ同士でぶつかり合い、下の文字が正反対。信頼しづらい関係で、利害関係ベースの付き合いになりやすいです。" });
    }
  });
  return results;
}

function countElements(pillars) {
  const counts = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  pillars.forEach((p) => {
    counts[elements[stems.indexOf(p.stem)]] += 1;
    counts[branchElements[p.branch]] += 1;
  });
  return counts;
}

function getTenchusatsu(dayIndex) {
  return tenchusatsuMap[Math.floor(mod(dayIndex, 60) / 10)];
}

// === 位相法（地支同士の関係）===
// 参考: https://sanmei-stock.com/category/basic/yin/topology/
const sangoBureaus = [
  { branches: ["申", "子", "辰"], element: "水" },
  { branches: ["亥", "卯", "未"], element: "木" },
  { branches: ["寅", "午", "戌"], element: "火" },
  { branches: ["巳", "酉", "丑"], element: "金" }
];
const hougoGroups = [
  { branches: ["寅", "卯", "辰"], name: "東方（春）" },
  { branches: ["巳", "午", "未"], name: "南方（夏）" },
  { branches: ["申", "酉", "戌"], name: "西方（秋）" },
  { branches: ["亥", "子", "丑"], name: "北方（冬）" }
];
const shigouPair = { 子: "丑", 丑: "子", 寅: "亥", 亥: "寅", 卯: "戌", 戌: "卯", 辰: "酉", 酉: "辰", 巳: "申", 申: "巳", 午: "未", 未: "午" };
const chongPairMap = { 子: "午", 午: "子", 丑: "未", 未: "丑", 寅: "申", 申: "寅", 卯: "酉", 酉: "卯", 辰: "戌", 戌: "辰", 巳: "亥", 亥: "巳" };
const gaiPair = { 子: "未", 未: "子", 丑: "午", 午: "丑", 寅: "巳", 巳: "寅", 卯: "辰", 辰: "卯", 申: "亥", 亥: "申", 酉: "戌", 戌: "酉" };
const haPair = { 子: "酉", 酉: "子", 午: "卯", 卯: "午", 丑: "辰", 辰: "丑", 未: "戌", 戌: "未" };
const keiGroups = [
  { branches: ["子", "卯"], name: "旺気刑（東方刑）", note: "友人・兄弟・同僚と喧嘩になりやすい。仲直りしても同じ件でまた揉めるため、感情的になる前に一度距離を置くのが有効。" },
  { branches: ["寅", "巳", "申"], name: "生貴刑（南方刑）", note: "目下（子供・部下・後輩）と衝突しやすい。指導中や育成中に問題が起きやすいため、相手のペースを尊重しすぎない程度に介入する。" },
  { branches: ["丑", "戌", "未"], name: "庫気刑（北方刑）", note: "目上（親・上司・先輩）と対立しやすい。一度こじれると長引くため、早めに謝るか第三者に間に入ってもらうと解決が早い。" }
];
const jikeiBranches = ["辰", "午", "酉", "亥"];

function isSameParityOvercome(aStem, bStem) {
  const a = stems.indexOf(aStem);
  const b = stems.indexOf(bStem);
  if (a < 0 || b < 0) return false;
  if ((a % 2) !== (b % 2)) return false;
  const cycle = ["木", "火", "土", "金", "水"];
  const aE = cycle.indexOf(elements[a]);
  const bE = cycle.indexOf(elements[b]);
  return bE === (aE + 2) % 5;
}

function isHanKaiPair(aBranch, bBranch) {
  return sangoBureaus.some((bureau) => bureau.branches.includes(aBranch) && bureau.branches.includes(bBranch) && aBranch !== bBranch);
}

function analyzeTopology(pillars) {
  const pairDefs = [
    { a: "year", b: "month", label: "年支×月支" },
    { a: "month", b: "day", label: "月支×日支" },
    { a: "year", b: "day", label: "年支×日支" }
  ];
  const results = [];
  pairDefs.forEach(({ a, b, label }) => {
    const ba = pillars[a].branch;
    const bb = pillars[b].branch;
    const sa = pillars[a].stem;
    const sb = pillars[b].stem;
    if (shigouPair[ba] === bb) results.push({ label, name: "支合", group: "合法", note: "この二つの地支は引き合う関係。協力関係が生まれ、物事が順調に進みやすくなる。人付き合いや仕事の提携で良い結果が出やすい。" });
    if (sa === sb && isHanKaiPair(ba, bb)) {
      results.push({ label, name: "大半会", group: "合法", note: "大半会（だいはんかい）は、天干が同じで地支が半会している状態です。考え方に一貫性があり、果敢にチャレンジする冒険的な性質を強めます。シーソーのように「進みすぎる」か「物事を壊してしまう」かの2つの作用があり、家の恩恵と因縁を同時に引き受けやすい関係です。" });
    }
    if (chongPairMap[ba] === bb) results.push({ label, name: "対冲", group: "散法", note: "この二つの地支は正面衝突する関係。予期しない変化や急な方向転換が起きやすくなる。慌てて決断せず、一旦立ち止まって検証するのが安全。" });
    if (chongPairMap[ba] === bb && sa === sb) {
      let natchinNote = "納音（なっちん）とは天干が同じで地支が対冲している状態です。物事が一つにまとまり、一定の範囲内で行動するため用心深く手堅い性質を強めます。";
      if (a === "year" && b === "month") natchinNote += " 年干支と月干支が納音の場合は、頭で考えていることと行動が伴いにくく、職場では隠し事や秘め事が多くなりがちです。";
      if (a === "month" && b === "day") natchinNote += " 月干支と日干支が納音の場合は、考えと行動が一致しにくく家庭内に隠し事が多くなる傾向があります。";
      if (a === "year" && b === "day") natchinNote += " 年干支と日干支が納音の場合は、社会面とプライベート面を切り離し、外面と家での顔をうまく使い分けます。";
      results.push({ label, name: "納音", group: "合法", note: natchinNote });
    }
    if (chongPairMap[ba] === bb && (isSameParityOvercome(sa, sb) || isSameParityOvercome(sb, sa))) {
      results.push({ label, name: "天剋地冲", group: "散法", note: "天剋地冲（てんこくちちゅう）は、天干が陽同士・陰同士の相剋で地支が対冲する状態です。なんとか成功したい・勝ちたいという強い意志を持ち、負けない戦い方ができます。人生の曲がり角でびっくりするような変化が起きやすく、周囲への影響にも注意が必要です。" });
    }
    if (gaiPair[ba] === bb) results.push({ label, name: "害法", group: "散法", note: "この二つの地支は害し合う関係。ストレスが蓄積しやすく、体調不良や人間関係の裏切りに遭いやすくなる。無理をせず、信頼できる人に相談するのが有効。" });
    if (haPair[ba] === bb) results.push({ label, name: "破法", group: "散法", note: "この二つの地支は破壊し合う関係。単独では影響は軽いが、他の散法（対冲・害法・刑法）と同時に出ると影響が強まる。決断が揺れやすくなるため、重要な判断は人と相談してから出す。" });
    if (ba === bb && jikeiBranches.includes(ba)) results.push({ label, name: "自刑（西方刑）", group: "散法", note: "同じ地支が重なることで自分自身と矛盾する関係。身内やパートナーと価値観がぶつかりやすくなる。同居や密な関係では摩擦が増えるため、適度な距離を保つと上手くいく。" });
    if (ba === bb && sa === sb) {
      let ritsuNote = "同干支＝自分の分身ができる（いる）ということになり、変人気質で二面性があります。考えが変わりやすく裏表があると見られる一面もありますが、人には真似できないオリジナリティで勝負すれば活躍できます。一生のうちに二度、異なる人生を歩む意味もあります。";
      if (a === "year" && b === "month") ritsuNote += " 視野が狭くなる傾向はありますが、特定の技芸や才能に専念することで成功します。親が家系の名誉や伝統を重要視していても、本人はあまり興味がなく無頓着です。";
      if (a === "month" && b === "day") ritsuNote += " 無欲な性格で行動範囲は狭くなります。しかし、集中力がずば抜けているので一つのことに専念できれば才能を開花させます。家系との結びつきが強く、生家から離れにくい宿命です。";
      if (a === "year" && b === "day") ritsuNote += " 無欲な性格で親との絆が深くなります。跡取りに向いており、親元を離れにくい宿命です。視野は広くなく狭くなりがちですが、一つのことに集中すれば成功できます。";
      results.push({ label, name: "律音", group: "合法", note: ritsuNote });
    }
    keiGroups.forEach((g) => {
      if (g.branches.includes(ba) && g.branches.includes(bb) && ba !== bb) {
        results.push({ label, name: g.name, group: "散法", note: g.note });
      }
    });
  });
  const allBranches = [pillars.year.branch, pillars.month.branch, pillars.day.branch];
  sangoBureaus.forEach((bureau) => {
    const matchCount = bureau.branches.filter((b) => allBranches.includes(b)).length;
    if (matchCount === 3) {
      results.push({ label: "年月日", name: `三合会局（${bureau.element}局）`, group: "合法", note: "三つの地支が協力し合って強力なエネルギーを生む。自分とは異なる文化や環境に適応しやすくなり、異業種や海外との縁で大成しやすい。" });
    } else if (matchCount === 2) {
      results.push({ label: "宿命内", name: `半会（${bureau.element}局）`, group: "合法", note: "三合会局の2/3が揃った状態。スケールの大きな目標に向かって行動しやすくなるが、残り1/3が揃うまでは成果が安定しない。根気強く継続すると三合会局が完成する。" });
    }
  });
  hougoGroups.forEach((g) => {
    const matchCount = g.branches.filter((b) => allBranches.includes(b)).length;
    if (matchCount === 3) {
      results.push({ label: "年月日", name: `方三位（${g.name}）`, group: "合法", note: "同じ季節の三つの地支が揃い、一つの分野に集中しやすくなる。専門知識や技術で評価されやすくなるが、視野が狭くなり別分野への適応が苦手になりやすい。" });
    }
  });
  return results;
}

function analyzeBranchTopology(branch, natalPillars, movingStem = null) {
  const natalLabels = { year: "年支", month: "月支", day: "日支" };
  const results = [];
  ["year", "month", "day"].forEach((key) => {
    const nb = natalPillars[key].branch;
    const ns = natalPillars[key].stem;
    if (branch === nb && movingStem === ns && movingStem) {
      let ritsuNote = "律音になる年は道が２つに別れやすい分岐点です。物事をガラリと変えるチャンスの時期であり、その年の十二支が強調されます。";
      if (key === "year") ritsuNote += " 年干支と後天運が律音する場合は仕事に変化が起こりやすく、同じ志を持つ仲間やライバルが現れやすい時期です。現在の境遇から抜け出したくなり、新しい目標を掲げてスタートする時期です。";
      if (key === "month") ritsuNote += " 月干支と後天運が律音する場合は信念が強固になり自己確立し、出世しやすい時期です。家族と離れて暮らしたり引越しなど、置かれた状況から抜け出したい欲求が強まります。";
      if (key === "day") ritsuNote += " 日干支と後天運が律音する場合はパーソナルな部分が強化され、自分の時代が来るチャンスです。ただし反発や揉め事、離婚にも注意が必要です。固定観念を捨てて進化すれば大きく飛躍できます。";
      results.push({ label: natalLabels[key], name: "律音（後天運）", group: "合法", note: ritsuNote });
      return;
    }
    if (branch === nb) return;
    if (shigouPair[branch] === nb) results.push({ label: natalLabels[key], name: "支合", group: "合法", note: "この時期の地支と" + natalLabels[key] + "が引き合う関係。協力関係が生まれ、物事が順調に進みやすくなる。人付き合いや仕事の提携で良い結果が出やすい。" });
    if (movingStem && movingStem === ns && isHanKaiPair(branch, nb)) {
      let daikaiNote = "大半会（だいはんかい）の年。天干が同じで地支が半会し、考えが一貫して広がりのある展開を迎えやすい年です。謙虚に行動し、忌神や天中殺・対冲などのブレーキには注意しましょう。";
      if (key === "year") daikaiNote += " 年干支と大半会する場合は仕事面や社交で異業種の交流が広がり、事業規模が拡大しやすい大飛躍の年です。";
      if (key === "month") daikaiNote += " 月干支と大半会する場合は自信がつき気分がノリノリになり、新しい分野へのチャレンジや目標の規模が大きくなります。";
      if (key === "day") daikaiNote += " 日干支と大半会する場合はこれまでの努力が実を結び、実りある年になります。家庭も明るくなり、結婚に向いている時期でもあります。";
      results.push({ label: natalLabels[key], name: "大半会（後天運）", group: "合法", note: daikaiNote });
    }
    if (chongPairMap[branch] === nb) results.push({ label: natalLabels[key], name: "対冲", group: "散法", note: "この時期の地支と" + natalLabels[key] + "が正面衝突する関係。" + natalLabels[key] + "が示す領域（年支＝実家・先祖、月支＝親・仕事環境、日支＝配偶者・自分自身）で予期しない変化やトラブルが起きやすくなる。慌てて決断せず、一旦立ち止まって検証するのが安全。" });
    if (chongPairMap[branch] === nb && movingStem && movingStem === ns) {
      let natchinNote = "納音（なっちん）の年。天干が同じで地支が対冲し、物事が一つにまとまる性質を強めます。無茶をせず用心深く行動すると、流れを良い方向に切り替えられます。";
      if (key === "year") natchinNote += " 年干支と納音する場合は仕事面で八方塞がりになりやすく、表舞台よりも裏方で影で作戦を立てた方が得策です。";
      if (key === "month") natchinNote += " 月干支と納音する場合は今までの立場が変わったり、内面と向き合う生まれ変わるような変化が起こります。";
      if (key === "day") natchinNote += " 日干支と納音する場合は今までの人生に一区切りをつける急ブレーキ的な出来事が起きやすく、柔軟な対応がチャンスをつかむ鍵です。";
      results.push({ label: natalLabels[key], name: "納音（後天運）", group: "合法", note: natchinNote });
    }
    if (chongPairMap[branch] === nb && movingStem && (isSameParityOvercome(movingStem, ns) || isSameParityOvercome(ns, movingStem))) {
      let tenkokuNote = "天剋地冲（てんこくちちゅう）の年。天干が陽同士・陰同士の相剋で地支が対冲し、人生の曲がり角となる大きな変化が起きやすい年です。無理を避け、状況を見極めてから行動しましょう。";
      if (key === "year") tenkokuNote += " 年干支と天剋地冲する場合は職場や組織でメンバーが総入れ替えになったり、自分を取り巻く環境が大きく変化する時期です。";
      if (key === "month") tenkokuNote += " 月干支と天剋地冲する場合は今まで信じてきたことや常識が覆ることが起こりやすく、心が折れやすくなります。スルー力を大切にしましょう。";
      if (key === "day") tenkokuNote += " 日干支と天剋地冲する場合は身の回りの断捨離やリセットをしたくなり、今までのこだわりを捨てる時期です。";
      results.push({ label: natalLabels[key], name: "天剋地冲（後天運）", group: "散法", note: tenkokuNote });
    }
    if (gaiPair[branch] === nb) results.push({ label: natalLabels[key], name: "害法", group: "散法", note: "この時期の地支と" + natalLabels[key] + "が害し合う関係。ストレスが蓄積しやすく、体調不良や人間関係の裏切りに遭いやすくなる。無理をせず、信頼できる人に相談するのが有効。" });
    if (haPair[branch] === nb) results.push({ label: natalLabels[key], name: "破法", group: "散法", note: "この時期の地支と" + natalLabels[key] + "が破壊し合う関係。単独では影響は軽いが、他の散法と同時に出ると影響が強まる。決断が揺れやすくなるため、重要な判断は人と相談してから出す。" });
    keiGroups.forEach((g) => {
      if (g.branches.includes(branch) && g.branches.includes(nb) && branch !== nb) {
        results.push({ label: natalLabels[key], name: g.name, group: "散法", note: g.note });
      }
    });
    if (branch === nb && jikeiBranches.includes(branch)) {
      results.push({ label: natalLabels[key], name: "自刑（西方刑）", group: "散法", note: "この時期の地支と" + natalLabels[key] + "が同じ地支で重なる関係。自分自身と矛盾しやすくなり、身内やパートナーと価値観がぶつかりやすくなる。適度な距離を保つと摩擦が減る。" });
    }
  });
  const natalBranches = [natalPillars.year.branch, natalPillars.month.branch, natalPillars.day.branch];
  const allWithMoving = [...natalBranches, branch];
  sangoBureaus.forEach((bureau) => {
    const matchCount = bureau.branches.filter((b) => allWithMoving.includes(b)).length;
    if (matchCount === 4) {
      results.push({ label: "宿命全体", name: `三合会局（${bureau.element}局）完成`, group: "合法", note: "この時期に三合会局が完成する。三つの地支が協力し合って強力なエネルギーを生むため、異業種や海外との縁で大成するチャンスが広がる。" });
    } else if (matchCount === 3 && bureau.branches.includes(branch)) {
      const natalMatch = bureau.branches.filter((b) => natalBranches.includes(b)).length;
      if (natalMatch === 2) {
        results.push({ label: "宿命全体", name: `半会→三合会局（${bureau.element}局）完成`, group: "合法", note: "宿命にあった半会がこの時期に三合会局として完成する。これまでの努力が一気に実を結びやすくなり、大きな飛躍のチャンス。" });
      }
    }
  });
  hougoGroups.forEach((g) => {
    const matchCount = g.branches.filter((b) => allWithMoving.includes(b)).length;
    if (matchCount === 4) {
      results.push({ label: "宿命全体", name: `方三位（${g.name}）完成`, group: "合法", note: "この時期に方三位が完成する。同じ季節の地支が揃い一つの分野に集中しやすくなるため、専門知識や技術で高い評価を得るチャンス。ただし視野が狭くなりやすいため、他分野への目配りも忘れずに。" });
    }
  });
  return results;
}

function topologySummary(results) {
  if (results.length === 0) return null;
  const goResults = results.filter((r) => r.group === "合法");
  const sanResults = results.filter((r) => r.group === "散法");
  const goCount = goResults.length;
  const sanCount = sanResults.length;
  const goNames = goResults.map((r) => r.name);
  const sanNames = sanResults.map((r) => r.name);

  // 総合判定の構築
  const summary = { title: "", text: "", advice: "" };

  // 合法・散法のバランスで大枠を決める
  if (goCount >= 2 && sanCount === 0) {
    summary.title = "協力関係に恵まれた命式";
    summary.text = "地支同士が引き合う関係（合法）が複数あり、周囲からの支援や協力が自然に得られやすい環境が整っています。人との縁を活かした仕事や活動で成果を出しやすいタイプです。";
    if (goNames.some((n) => n.includes("三合会局"))) {
      summary.text += "特に三合会局が成立しており、自分とは異なる環境や分野でも適応力を発揮できる強力なパターンです。";
    }
    summary.advice = "周囲のサポートを当たり前と思わず、感謝と恩返しを忘れないことで関係が長期的に安定します。";
  } else if (goCount >= 1 && sanCount === 0) {
    summary.title = "安定した人間関係の基盤あり";
    summary.text = "合法が1つ成立しており、特定の相手や環境と協力関係を築きやすい傾向があります。程よい支援を受けながら物事を進められるバランスの良い命式です。";
    summary.advice = "この協力関係を軸に、新しい挑戦にも挑んでいくと良いでしょう。";
  } else if (sanCount >= 2 && goCount === 0) {
    summary.title = "変化と摩擦の多い命式";
    summary.text = "地支同士が衝突・反発する関係（散法）が複数あり、人生において予期しない変化や人間関係の摩擦が起きやすい傾向があります。ストレスや対立を経験しやすい分、逆境を乗り越える力が培われます。";
    if (sanNames.some((n) => n.includes("対冲"))) {
      summary.text += "対冲があるため、急な方向転換や環境の変化が特に起きやすくなっています。";
    }
    if (sanNames.some((n) => n.includes("害法"))) {
      summary.text += "害法があるため、信頼していた人からの裏切りや、ストレスによる体調不良に注意が必要です。";
    }
    if (sanNames.some((n) => n.includes("刑"))) {
      summary.text += "刑法があるため、特定の相手（目上・目下・同僚いずれか）とこじれると長引きやすい傾向があります。";
    }
    summary.advice = "変化を恐れず柔軟に対応する力を身につけることが重要です。感情的になる前に距離を置く、第三者に相談するなど、摩擦を最小限にする工夫をしましょう。";
  } else if (sanCount >= 1 && goCount === 0) {
    summary.title = "一部に摩擦要素あり";
    summary.text = "散法が1つあるため、特定の関係性や場面で摩擦やストレスを感じやすい面があります。ただし影響は限定的で、日々の工夫で対応可能なレベルです。";
    summary.advice = "摩擦の起きやすい相手や状況を把握し、無理に解決しようとせず適度な距離を保つのが有効です。";
  } else if (goCount > sanCount) {
    summary.title = "協力優位・一部摩擦あり";
    summary.text = `合法${goCount}つに対し散法${sanCount}つで、全体的には協力関係が強い命式です。基本的には周囲の支援を得やすいものの、一部に摩擦や変化の要素も混在しています。`;
    summary.advice = "協力関係を大切にしつつ、散法の部分だけ注意して立ち回ることで、全体として順調に進められます。";
  } else if (sanCount > goCount) {
    summary.title = "摩擦優位・一部協力あり";
    summary.text = `散法${sanCount}つに対し合法${goCount}つで、全体的には変化や摩擦の要素が強い命式です。ただし協力関係も一部あるため、味方を活かすことで逆境を乗り越えられます。`;
    summary.advice = "散法の影響が強い時期は無理をせず、合法で得られる協力関係に頼ることでバランスを取ることが大切です。";
  } else {
    summary.title = "協力と摩擦のバランス型";
    summary.text = `合法${goCount}つ・散法${sanCount}つで、協力関係と摩擦要素がほぼ同等に存在します。状況によって協力が得られたり摩擦が起きたりと、安定と変化が交互に訪れやすい命式です。`;
    summary.advice = "協力が得られている時に蓄積し、摩擦が起きる時に焦らず対処するというメリハリのある対応が効果的です。";
  }

  return summary;
}

function topologyBriefDescription(results) {
  if (!results || results.length === 0) return null;
  const goResults = results.filter((r) => r.group === "合法");
  const sanResults = results.filter((r) => r.group === "散法");
  const parts = [];
  goResults.forEach(r => {
    if (r.name.includes("律音")) parts.push("同じ干支が重なる分岐点");
    else if (r.name.includes("大半会")) parts.push("力が広がる飛躍のチャンス");
    else if (r.name.includes("納音")) parts.push("物事が一つにまとまる");
    else if (r.name.includes("三合会局")) parts.push("強力な協力関係が完成");
    else if (r.name.includes("方三位")) parts.push("一つの分野に集中し評価を得る");
    else if (r.name.includes("支合")) parts.push("協力関係が生まれ順調に進む");
  });
  sanResults.forEach(r => {
    if (r.name.includes("天剋地冲")) parts.push("人生の曲がり角・大きな変化");
    else if (r.name.includes("対冲")) parts.push("正面衝突・予期せぬ変化");
    else if (r.name.includes("害法")) parts.push("ストレス・裏切りに注意");
    else if (r.name.includes("破法")) parts.push("決断が揺れやすい");
    else if (r.name.includes("刑")) parts.push("人間関係のこじれ");
  });
  if (parts.length === 0) return null;
  const goCount = goResults.length;
  const sanCount = sanResults.length;
  let prefix = "";
  if (goCount > 0 && sanCount === 0) prefix = "協力関係に恵まれる時期。";
  else if (sanCount > 0 && goCount === 0) prefix = "摩擦や変化の多い時期。";
  else if (goCount > sanCount) prefix = "協力優位だが一部摩擦あり。";
  else if (sanCount > goCount) prefix = "摩擦優位だが一部協力あり。";
  else prefix = "協力と摩擦が混在する時期。";
  return prefix + parts.join("、") + "。";
}

function topologyToComment(results) {
  if (results.length === 0) return null;
  const goResults = results.filter((r) => r.group === "合法");
  const sanResults = results.filter((r) => r.group === "散法");
  const parts = [];
  if (goResults.length > 0) {
    parts.push("【合法】" + goResults.map((r) => `${r.label}に${r.name}（${r.note}）`).join("／"));
  }
  if (sanResults.length > 0) {
    parts.push("【散法】" + sanResults.map((r) => `${r.label}に${r.name}（${r.note}）`).join("／"));
  }
  return parts.join("　");
}

// === 今年の総合運勢（大運×年運 統合判定）===
// 十大主星ごとの金運・恋愛運・仕事運の基本傾向
const starFortuneMoney = {
  貫索星: { good: { balanced: "自分の専門性を磨く投資が実を結ぶ時期。内面のバランスが柔軟性を与え、市場変化にも対応できる。", moderate: "自分の専門性を磨く投資が実を結ぶ時期。独自の分野で収入が安定する。", imbalanced: "自分の専門性を磨く投資が実を結ぶ時期。内面の偏りが頑固さを強め、変化する市場に対応できず収入機会を逃す。" }, bad: { balanced: "頑固さが出るが内面のバランスが柔軟性を保ち、市場変化にも対応できる。", moderate: "頑固さが強まり、変化する市場に対応できず収入機会を逃す。", imbalanced: "内面の偏りが頑固さを極限化し、市場変化に対応できず収入機会を逃しやすくなる。" } },
  石門星: { good: { balanced: "人脈を通じた金運が活発。内面のバランスが交際費を適度に抑え、純粋な収入の道を開く。", moderate: "人脈を通じた金運が活発。紹介やネットワークから収入の道が開く。", imbalanced: "人脈を通じた金運が活発だが内面の偏りが交際費をエスカレートさせ、人付き合いで散財する。" }, bad: { balanced: "交際費がかさむが内面のバランスが支出を抑え、人脈を維持できる。", moderate: "交際費がかさみ、人付き合いで散財しやすい。", imbalanced: "内面の偏りが交際費を極限化し、人付き合いで散財しやすくなる。" } },
  鳳閣星: { good: { balanced: "趣味や表現力を活かした収入のチャンス。内面のバランスが遊びと仕事の境界を明確にする。", moderate: "趣味や表現力を活かした収入のチャンス。クリエイティブな仕事が報われやすい。", imbalanced: "趣味や表現力を活かした収入のチャンスだが内面の偏りが遊びと仕事の境界を曖昧にし、浪費が増える。" }, bad: { balanced: "遊びと仕事の境界が曖昧になりがちだが内面のバランスがメリハリを付ける。", moderate: "遊びと仕事の境界が曖昧になり、浪費が増える。", imbalanced: "内面の偏りが遊びと仕事の境界が曖昧になり、浪費が増えやすくなる。" } },
  調舒星: { good: { balanced: "感性を活かした作品や専門スキルで評価され収入が安定。内面のバランスが気分の波を安定させる。", moderate: "感性を活かした作品や専門的なスキルで評価され、収入が安定する。", imbalanced: "感性を活かした作品で評価されるが内面の偏りが気分の波を激化させ、収入が不安定になる。" }, bad: { balanced: "気分の波が出るが内面のバランスが継続力を保ち、仕事を継続できる。", moderate: "気分の波で仕事の継続性が崩れ、収入が不安定になる。", imbalanced: "内面の偏りが気分の波を極限化し、仕事の継続性が崩れて収入が不安定になりやすい。" } },
  禄存星: { good: { balanced: "人望が金運に直結する時期。内面のバランスが見返りを求めない純粋な奉仕を可能にする。", moderate: "人望が金運に直結する時期。奉仕した分が還ってきやすい。", imbalanced: "人望が金運に直結する時期だが内面の偏りが見返りへの期待を強め、投資や貸し付けで損をする。" }, bad: { balanced: "見返りを期待する傾向はあるが内面のバランスが損失を抑えられる。", moderate: "見返りを期待しすぎて投資や貸し付けで損をする。", imbalanced: "内面の偏りが見返りへの期待を極限化し、投資や貸し付けで大きな損をする。" } },
  司禄星: { good: { balanced: "堅実な蓄積が評価される時期。内面のバランスが安定と成長のバランスを取り、新しい収入源にも手が届く。", moderate: "堅実な蓄積が評価される時期。資格や実績が収入の安定に繋がる。", imbalanced: "堅実な蓄積が評価される時期だが内面の偏りが変化への恐怖を強め、新しい収入源に手を出せず停滞する。" }, bad: { balanced: "変化を恐れる傾向はあるが内面のバランスが適度な挑戦を可能にする。", moderate: "変化を恐れて新しい収入源に手を出せず、停滞する。", imbalanced: "内面の偏りが変化への恐怖を極限化し、新しい収入源に手を出せず停滞しやすい。" } },
  車騎星: { good: { balanced: "行動力で収入を叩き出す時期。内面のバランスが衝動を抑え、持続的な収入を作れる。", moderate: "行動力で収入を叩き出す時期。競争環境では報酬を勝ち取りやすい。", imbalanced: "行動力で収入を叩き出す時期だが内面の偏りが短期的利益に飛びつかせ、衝動的な出費や投資で失敗する。" }, bad: { balanced: "短期的利益に飛びつく傾向はあるが内面のバランスが冷静な判断を保つ。", moderate: "短期的な利益に飛びつき、衝動的な出費や投資で失敗する。", imbalanced: "内面の偏りが衝動性を極限化し、短期的利益に飛びついて衝動的な出費や投資で失敗しやすくなる。" } },
  牽牛星: { good: { balanced: "名誉や立場が金運に直結する時期。内面のバランスが面目と実質を両立させる。", moderate: "名誉や立場が金運に直結する時期。社会的評価が収入向上に繋がる。", imbalanced: "名誉や立場が金運に直結する時期だが内面の偏りが見栄を強め、プライドで無理な出費をして散財する。" }, bad: { balanced: "見栄やプライドで出費する傾向はあるが内面のバランスが身の丈を保たせる。", moderate: "見栄やプライドで無理な出費をし、面目を保つために散財する。", imbalanced: "内面の偏りが見栄を極限化し、面目を保つために無理な出費を繰り返して散財する。" } },
  龍高星: { good: { balanced: "新しい分野や未開拓の市場で収益を見出す時期。内面のバランスが変化を継続力に変える。", moderate: "新しい分野や未開拓の市場で収益を見出す時期。変化が金運の鍵。", imbalanced: "新しい分野で収益を見出す時期だが内面の偏りが飽きっぽさを極限化し、投資や仕事が中途半端になる。" }, bad: { balanced: "飽きっぽさはあるが内面のバランスが継続力を与え、投資や仕事を最後まで遂行できる。", moderate: "飽きっぽさで継続性がなくなり、投資や仕事が中途半端になる。", imbalanced: "内面の偏りが飽きっぽさを極限化し、何も継続できず投資や仕事が中途半端になりやすい。" } },
  玉堂星: { good: { balanced: "知識や学歴が金運に活きる時期。内面のバランスが知性を行動に結びつけ、チャンスを掴める。", moderate: "知識や学歴が金運に活きる時期。資格や専門性が収入の柱になる。", imbalanced: "知識や学歴が金運に活きる時期だが内面の偏りが理屈への依存を深め、行動が遅くチャンスを目の前で逃す。" }, bad: { balanced: "理屈で逃げる傾向はあるが内面のバランスが実行力を与え、チャンスを掴める。", moderate: "理屈ばかりで行動が遅く、チャンスを目の前で逃す。", imbalanced: "内面の偏りが理屈への逃避を極限化し、行動が遅くチャンスを逃しやすくなる。" } }
};

const starFortuneLove = {
  貫索星: { good: { balanced: "一途な想いが通じる時期。内面のバランスが意地を緩め、素直なアプローチが相手の心を掴む。", moderate: "一途な想いが通じる時期。誠実なアプローチが相手の心を掴む。", imbalanced: "一途な想いが通じる時期だが内面の偏りが意地を強め、素直になれず大切な人との距離が開く。" }, bad: { balanced: "意地を張る傾向はあるが内面のバランスが素直さを取り戻させ、距離を縮められる。", moderate: "意地を張って素直になれず、大切な人との距離が開く。", imbalanced: "内面の偏りが意地を極限化し、素直になれず大切な人との距離が大きく開く。" } },
  石門星: { good: { balanced: "社交的な場で出会いが豊富。内面のバランスが距離感を保ち、パートナーに誤解されない。", moderate: "社交的な場で出会いが豊富。友人関係から恋愛に発展しやすい。", imbalanced: "社交的な場で出会いが豊富だが内面の偏りが八方美人をエスカレートさせ、パートナーに誤解や不信感を与える。" }, bad: { balanced: "誰にでも良い顔をする傾向はあるが内面のバランスが距離感を保てる。", moderate: "誰にでも良い顔をし、パートナーに誤解や不信感を与える。", imbalanced: "内面の偏りが八方美人を極限化し、パートナーに大きな誤解と不信感を与える。" } },
  鳳閣星: { good: { balanced: "明るさと魅力でモテ期。内面のバランスが軽さと誠実さのバランスを取り、真剣な関係も育める。", moderate: "明るさと魅力でモテ期。楽しいデートやイベントで関係が深まる。", imbalanced: "明るさと魅力でモテ期だが内面の偏りが軽さをエスカレートさせ、真剣な関係を遠ざけてしまう。" }, bad: { balanced: "軽い態度が出るが内面のバランスが真剣さも保ち、関係を深められる。", moderate: "軽い態度が目立ち、真剣な関係を遠ざけてしまう。", imbalanced: "内面の偏りが軽さを極限化し、真剣な関係が遠ざかりやすい。" } },
  調舒星: { good: { balanced: "感性が研ぎ澄まされ、芸術的・精神的なつながりで恋が深まる。内面のバランスが孤独感を健全な創造力に変える。", moderate: "感性が研ぎ澄まされ、芸術的・精神的なつながりで恋が深まる。", imbalanced: "感性が研ぎ澄まされるが内面の偏りが孤独感を極限化し、パートナーを試してしまう。" }, bad: { balanced: "孤独感が出るが内面のバランスが被害者意識を抑え、パートナーを試さずに済む。", moderate: "孤独感や被害者意識が強まり、パートナーを試してしまう。", imbalanced: "内面の偏りが孤独感を極限化し、被害者意識からパートナーを試しがちで関係が不安定になりやすい。" } },
  禄存星: { good: { balanced: "優しさと気配りで相手を安心させる。内面のバランスが依存を抑え、健全な愛情を注げる。", moderate: "優しさと気配りで相手を安心させる。尽くす愛情が報われやすい。", imbalanced: "優しさと気配りで相手を安心させるが内面の偏りが依存をエスカレートさせ、相手を重くして距離を置かれる。" }, bad: { balanced: "依存する傾向はあるが内面のバランスが自立を保ち、相手を重くさせない。", moderate: "依存しすぎて相手を重くさせ、距離を置かれる。", imbalanced: "内面の偏りが依存を極限化し、相手を強く圧迫して距離を置かれる。" } },
  司禄星: { good: { balanced: "安定した関係を築きやすい時期。内面のバランスが安定と変化のバランスを取り、マンネリを防ぐ。", moderate: "安定した関係を築きやすい時期。日常の積み重ねで信頼が深まる。", imbalanced: "安定した関係を築きやすい時期だが内面の偏りが変化への恐怖を強め、マンネリになって関係が停滞する。" }, bad: { balanced: "マンネリになりがちだが内面のバランスが適度な変化をもたらす。", moderate: "変化を恐れてマンネリになり、関係が停滞する。", imbalanced: "内面の偏りが変化への恐怖を極限化し、マンネリになりやすく関係が停滞しやすい。" } },
  車騎星: { good: { balanced: "情熱的なアプローチで恋が動く。内面のバランスが情熱に持続力を与え、ストレートな気持ちが相手を惹きつける。", moderate: "情熱的なアプローチで恋が動く。ストレートな気持ちが相手を惹きつける。", imbalanced: "情熱的なアプローチで恋が動くが内面の偏りが短気をエスカレートさせ、喧嘩になりやすく勢いで言葉を過ぎて関係を壊す。" }, bad: { balanced: "短気な傾向はあるが内面のバランスが感情を抑え、喧嘩にならずに済む。", moderate: "短気で喧嘩になりやすく、勢いで言葉を過ぎて関係を壊す。", imbalanced: "内面の偏りが短気を極限化し、些細なことで喧嘩になり勢いで関係が不安定になりやすい。" } },
  牽牛星: { good: { balanced: "品のある態度で信頼を勝ち取る。内面のバランスがプライドを適度に保ち、素直になれる瞬間も作れる。", moderate: "品のある態度で信頼を勝ち取る。大人の恋愛として関係が深まる。", imbalanced: "品のある態度で信頼を勝ち取るが内面の偏りがプライドを極限化し、素直になれずすれ違いが生じる。" }, bad: { balanced: "プライドが邪魔することはあるが内面のバランスが素直さを取り戻させ、すれ違いを解消できる。", moderate: "プライドが邪魔をして素直になれず、すれ違いが生じる。", imbalanced: "内面の偏りがプライドを極限化し、素直になれずすれ違いが深刻になる。" } },
  龍高星: { good: { balanced: "非日常の出会いや刺激的な恋愛のチャンス。内面のバランスが自由と安定を両立し、関係を深められる。", moderate: "非日常の出会いや刺激的な恋愛のチャンス。旅先での縁あり。", imbalanced: "非日常の出会いや刺激的な恋愛のチャンスだが内面の偏りが自由への執着を強め、関係を深める前に逃げてしまう。" }, bad: { balanced: "束縛を嫌う傾向はあるが内面のバランスが落としどころを見つけさせる。", moderate: "束縛を嫌って自由を優先し、関係を深める前に逃げてしまう。", imbalanced: "内面の偏りが自由への執着を極限化し、関係が落ち着くと即座に逃げ出す。" } },
  玉堂星: { good: { balanced: "知的な会話や精神的なつながりで恋が育つ。内面のバランスが考えすぎを抑え、適切なタイミングで行動できる。", moderate: "知的な会話や精神的なつながりで恋が育つ。ゆっくりとしたペースが良縁を呼ぶ。", imbalanced: "知的な会話や精神的なつながりで恋が育つが内面の偏りが考えすぎをエスカレートさせ、行動が遅くチャンスを逃して後悔する。" }, bad: { balanced: "考えすぎる傾向はあるが内面のバランスが行動力を与え、チャンスを掴める。", moderate: "考えすぎて行動が遅く、チャンスを逃して後悔する。", imbalanced: "内面の偏りが考えすぎを極限化し、行動が遅れがちでチャンスを逃しやすく後悔する。" } }
};

const starFortuneWork = {
  貫索星: { good: { balanced: "自分の専門分野で評価が高まる時期。内面のバランスが協調性も与え、独立と協調のバランスを取れる。", moderate: "自分の専門分野で評価が高まる時期。独立や専門性の深化に最適。", imbalanced: "自分の専門分野で評価が高まる時期だが内面の偏りが協調性を欠かせ、チームや組織と衝突して孤立する。" }, bad: { balanced: "協調性を欠く傾向はあるが内面のバランスが柔軟性を保ち、チームと協調できる。", moderate: "協調性を欠き、チームや組織と衝突して孤立する。", imbalanced: "内面の偏りが協調性の欠如を極限化し、チームや組織と衝突して孤立しやすくなる。" } },
  石門星: { good: { balanced: "チームや組織の中で力を発揮。内面のバランスが自分の意見も持ちつつ協調できる。", moderate: "チームや組織の中で力を発揮。人脈を活かした仕事の成果が出やすい。", imbalanced: "チームや組織の中で力を発揮するが内面の偏りが八方美人をエスカレートさせ、自分の意見がなく評価が曖昧になる。" }, bad: { balanced: "八方美人になる傾向はあるが内面のバランスが自分の意見を保たせる。", moderate: "八方美人になり、自分の意見がなく評価が曖昧になる。", imbalanced: "内面の偏りが八方美人を極限化し、自分の意見がなく評価が曖昧になりやすい。" } },
  鳳閣星: { good: { balanced: "表現力や企画力が光る時期。内面のバランスが危機感も適度に保ち、締め切りや責任を果たせる。", moderate: "表現力や企画力が光る時期。クリエイティブな仕事で評価される。", imbalanced: "表現力や企画力が光る時期だが内面の偏りが危機感を欠きがちで、締め切りや責任を軽視して信用を落としやすくなる。" }, bad: { balanced: "危機感が薄い傾向はあるが内面のバランスが責任感を保ち、信用を落とさない。", moderate: "危機感が薄く、締め切りや責任を軽視して信用を落とす。", imbalanced: "内面の偏りが危機感の欠如を極限化し、締め切りや責任を軽視して信用を落としやすくなる。" } },
  調舒星: { good: { balanced: "感性と審美眼が武器になる時期。内面のバランスが対人摩擦を抑え、チームワークも保てる。", moderate: "感性と審美眼が武器になる時期。専門的なスキルで独自のポジションを確保。", imbalanced: "感性と審美眼が武器になる時期だが内面の偏りが対人摩擦をエスカレートさせ、チームワークを欠いて孤立する。" }, bad: { balanced: "対人摩擦が起きやすいが内面のバランスが協調性を保ち、孤立を防げる。", moderate: "対人摩擦が起きやすく、チームワークを欠いて孤立する。", imbalanced: "内面の偏りが対人摩擦を極限化し、チームワークが崩れて孤立しやすくなる。" } },
  禄存星: { good: { balanced: "面倒見の良さが評価され、指導や教育の役割で信頼を集める。内面のバランスが自分の仕事とのバランスを取る。", moderate: "面倒見の良さが評価され、指導や教育の役割で信頼を集める。", imbalanced: "面倒見の良さが評価されるが内面の偏りが他人への時間投入をエスカレートさせ、自分の仕事が進まない。" }, bad: { balanced: "他人に時間を使いすぎる傾向はあるが内面のバランスが自分の仕事も進められる。", moderate: "他人に時間を使いすぎて自分の仕事が進まない。", imbalanced: "内面の偏りが他人への時間投入を極限化し、自分の仕事が進みにくくなる。" } },
  司禄星: { good: { balanced: "堅実な仕事ぶりが評価される時期。内面のバランスが変化への適応力も与え、新しいプロジェクトにも対応できる。", moderate: "堅実な仕事ぶりが評価される時期。実績の蓄積が成果に繋がる。", imbalanced: "堅実な仕事ぶりが評価される時期だが内面の偏りが変化に弱く、新しいプロジェクトや環境に対応できない。" }, bad: { balanced: "変化に弱い傾向はあるが内面のバランスが適応力を保ち、新しい環境にも対応できる。", moderate: "変化に弱く、新しいプロジェクトや環境に対応できない。", imbalanced: "内面の偏りが変化への不適応を極限化し、新しいプロジェクトや環境に対応が難しくなる。" } },
  車騎星: { good: { balanced: "行動力と競争力が光る時期。内面のバランスがチームの信頼も損なわず、単独と協調のバランスを取れる。", moderate: "行動力と競争力が光る時期。営業や新規開拓で成果を出しやすい。", imbalanced: "行動力と競争力が光る時期だが内面の偏りが独断専行をエスカレートさせ、チームの信頼を損なう。" }, bad: { balanced: "独断専行の傾向はあるが内面のバランスがチームの信頼を保ち、協調できる。", moderate: "独断専行が目立ち、チームの信頼を損なう。", imbalanced: "内面の偏りが独断専行を極限化し、チームの信頼を失いやすくなる。" } },
  牽牛星: { good: { balanced: "名誉と立場が向上する時期。内面のバランスが面子と実質を両立させ、真のリーダーとして機能する。", moderate: "名誉と立場が向上する時期。責任あるポジションで評価される。", imbalanced: "名誉と立場が向上する時期だが内面の偏りが面子へのこだわりを強め、実質を疎かして周囲の不信を買う。" }, bad: { balanced: "面子にこだわる傾向はあるが内面のバランスが実質も保ち、不信を買わない。", moderate: "面子にこだわって実質を疎かし、周囲の不信を買う。", imbalanced: "内面の偏りが面子へのこだわりを極限化し、実質を疎かにしがちで周囲の不信を買いやすくなる。" } },
  龍高星: { good: { balanced: "改革や新規事業で力を発揮。内面のバランスが型破りなアプローチに継続性を与え、成功の鍵を掴む。", moderate: "改革や新規事業で力を発揮。型破りなアプローチが成功の鍵。", imbalanced: "改革や新規事業で力を発揮するが内面の偏りが飽きっぽさをエスカレートさせ、プロジェクトを放り出し信用を失う。" }, bad: { balanced: "飽きっぽい傾向はあるが内面のバランスが継続力を与え、信用を失わない。", moderate: "飽きっぽさでプロジェクトを放り出し、信用を失う。", imbalanced: "内面の偏りが飽きっぽさを極限化し、プロジェクトを放り出しがちで信用を失いやすくなる。" } },
  玉堂星: { good: { balanced: "知識と学習力が評価される時期。内面のバランスが実行力も与え、現場から浮かずに成果を出せる。", moderate: "知識と学習力が評価される時期。研究や資格、教育関連で成果が出る。", imbalanced: "知識と学習力が評価される時期だが内面の偏りが理屈への依存を深め、実行力がなく現場から浮く。" }, bad: { balanced: "理屈で逃げる傾向はあるが内面のバランスが実行力を与え、現場から浮かない。", moderate: "理屈ばかりで実行力がなく、現場から浮く。", imbalanced: "内面の偏りが理屈への逃避を極限化し、実行力が乏しく現場から浮きやすくなる。" } }
};

// 十二大従星ごとの金運・恋愛運・仕事運の補正
const energyFortuneMoney = {
  天報星: { balanced: "複数の収入源があるがまとまりに欠ける。内面のバランスが優先順位を明確にし、小刻みの短期決戦を効率的に回せる。", moderate: "複数の収入源があるがまとまりに欠ける。小刻みの短期決戦を繰り返すことで財をなす時期。長期展望より瞬間瞬間をうまく使うのが鍵。", imbalanced: "複数の収入源があるが内面の偏りが分散を極限化し、まとまりに欠け収入が安定しない。" },
  天印星: { balanced: "今を堅実に生きることで金運が回る。内面のバランスが着実な積み重ねに持続力を与える。", moderate: "長期展望を持たず今を堅実に生きることで金運が回る。一つ一つを着実に消化することが財を成す鍵。", imbalanced: "内面の偏りが堅実さを行き過ぎさせ、何も挑戦できず金運が停滞する。" },
  天貴星: { balanced: "品と向上心で金運上昇。内面のバランスがプライドを適度に保ち、実績を積んで安定する。", moderate: "品と向上心で金運上昇。積み重ね型の思考なので、コツコツ実績を積むことで安定する。プライドが高すぎると機会を逸する。", imbalanced: "内面の偏りがプライドを極限化し、高望みして機会を逸しがちになる。" },
  天恍星: { balanced: "移動や変化が金運の鍵。内面のバランスが刺激への衝動を抑え、新しい分野で確実に財を開ける。", moderate: "移動や変化が金運の鍵。現状打破のタイミングで新しい分野に飛び込むことで財が開ける。ただし刺激を求めて散財しやすい。", imbalanced: "内面の偏りが刺激への欲求を極限化し、散財が止まらなくなる。" },
  天南星: { balanced: "仕事と財力が一致しない特性がある。内面のバランスが強引さを抑え、前進力で安定的に収入増する。", moderate: "仕事と財力が一致しない特性がある。生き甲斐で動くタイプで、体制側からの恩恵に頼らず前進する。前進力で収入増だが、強引さが出ると取引先を失う。", imbalanced: "内面の偏りが強引さを極限化し、取引先を失いやすくなり収入が途絶えやすい。" },
  天禄星: { balanced: "堅実な蓄積で金運安定。内面のバランスが安全策と適度な挑戦のバランスを取り、成長も止まらない。", moderate: "堅実な蓄積で金運安定。健康と経済が生存の二大現実で、地味な積み重ねの努力が財を成す。安全策に逃げすぎると成長が止まる。", imbalanced: "内面の偏りが安全策への逃避を極限化し、成長が止まりやすくなる。" },
  天将星: { balanced: "強い権力と金運。内面のバランスが器を大きくし、波の頂点でも底辺でも人脈を失わない。", moderate: "強い権力と金運。上下動の大きい人生で、波の頂点と底辺で最大エネルギーが発揮される。器が小さいと独占的になり人脈を失う。", imbalanced: "内面の偏りが独占的になりやすく人脈を失って金運も停滞する。" },
  天堂星: { balanced: "観察力で堅実に稼ぐ。内面のバランスが諦念を健全な慎重さに変え、地に足の着いた収入を安定させる。", moderate: "観察力で堅実に稼ぐ。退気のエネルギーで派手なことを嫌い、地に足の着いた収入を好む。諦念が強すぎると機会を逃す。", imbalanced: "内面の偏りが諦念を極限化し、機会を逃しがちで収入が停滞する。" },
  天胡星: { balanced: "感性で稼ぐ時期。内面のバランスが感性と現実感覚のバランスを取り、発明発見で確実に財を成す。", moderate: "感性で稼ぐ時期。有から無を感知して無から新たな有を作る才能で、発明発見やアイデアの世界で才を発揮する。ただし現実逃避すると金運が流れる。", imbalanced: "内面の偏りが現実逃避を極限化し、金運が流れやすくなる。" },
  天極星: { balanced: "精神的な豊かさが先行するが、内面のバランスが現実的な金運にも目を向けさせ、環境に恵まれれば安定する。", moderate: "精神的な豊かさが先行し、現実的な金運は後回しになりやすい。自力で現実を作れず環境依存のため、環境に恵まれれば安定するが、自分から計画的に財を築くのは難しい。", imbalanced: "内面の偏りが精神への逃避を極限化し、現実的な金運が後回しになりやすい。" },
  天庫星: { balanced: "蓄積と探究のチャンス。内面のバランスが執着を健全な探究心に変え、社会的有用性を見失わずに財を成す。", moderate: "蓄積と探究のチャンス。単一志向で突き進む探究心が財を成すが、連結のない思考で社会的有用性を見失うと資金が固定化する。執着しすぎると縛られやすくなる。", imbalanced: "内面の偏りが執着を極限化し、資金が固定化され縛られやすく金運が動かなくなる。" },
  天馳星: { balanced: "点的今の連続で目の前のことに全力を注ぐ。内面のバランスが複数の収入源をうまく並行させ、持続力の限界も補う。", moderate: "点的今の連続で目の前のことに全力を注ぐ。分裂・分離の本性で複数の収入源を並行できるが、一つに集中すると持続力に限界がある。名誉や財にとらわれないさっぱりとした金運。", imbalanced: "内面の偏りが分裂を極限化し、複数の収入源がすべて中途半端になり金運が安定しない。" }
};
const energyFortuneLove = {
  天報星: { balanced: "恋愛の選択肢が広がる。内面のバランスがきまぐれを抑え、一つに絞る判断力を与える。", moderate: "恋愛の選択肢が広がるが、きまぐれで気持ちがふらふらしやすい。一つに絞るのが課題だが、本人に自覚がないため、相手が受け入れるかが鍵。", imbalanced: "内面の偏りがきまぐれを極限化し、気持ちが定まりにくく関係が不安定になりやすい。" },
  天印星: { balanced: "無自覚に相手の必要性を察知して惹きつける時期。内面のバランスが依存を抑え、今の縁を健全に育てる。", moderate: "無自覚に相手の必要性を察知して惹きつける時期。ただし依存しすぎると重く感じられる。今の縁を堅実に育てるのが鍵。", imbalanced: "内面の偏りが依存を極限化し、相手を重く感じさせて距離を置かれる。" },
  天貴星: { balanced: "品が魅力で好印象。内面のバランスが不安を乗り越えさせ、適度な高望みで良縁を引き寄せる。", moderate: "品が魅力で好印象だが、ピュアな自意識の裏側にある不安を見せられない。高望みしすぎると相手を遠ざける。", imbalanced: "内面の偏りが不安を極限化し、高望みして相手を遠ざけがちになる。" },
  天恍星: { balanced: "華やかさで注目を集める。内面のバランスが刺激への衝動を抑え、冒険しても関係を安定させる。", moderate: "華やかさで注目を集めるが、肉体の揺らぎが色事や冒険に向かいやすい。刺激を求めすぎると関係が不安定になる。", imbalanced: "内面の偏りが刺激への欲求を極限化し、色事や冒険に走り関係が不安定になりやすい。" },
  天南星: { balanced: "一本気で純粋なアプローチが実る時期。内面のバランスが強引さを抑え、一度交われば長く続く縁になる。", moderate: "一本気で純粋なアプローチが実る時期。ただし自分を曲げられない不器用さが摩擦を生み、強引さが出ると相手を引かせる。一度交われば長く続く縁になる。", imbalanced: "内面の偏りが強引さを極限化し、不器用さが摩擦を生み続けて相手を引かせる。" },
  天禄星: { balanced: "安定した関係を築きやすい。内面のバランスが安全策と適度な冒険のバランスを取り、マンネリを防ぐ。", moderate: "安定した関係を築きやすい。自己保身の中庸バランスで無難な相手選びをするが、冒険を避けて変化を恐れるとマンネリになる。", imbalanced: "内面の偏りが安全策への逃避を極限化し、マンネリになりやすく関係が停滞しやすい。" },
  天将星: { balanced: "主導権を握りやすい。内面のバランスが自我を健全なリーダーシップに変え、相手を尊重できる。", moderate: "主導権を握りやすい。自我が強く自分の意志を押し通すが、内実は子供のように無邪気で寂しがり屋な面がある。相手を従わせようとすると衝突する。", imbalanced: "内面の偏りが自我を極限化し、相手を従わせようとして衝突が絶えない。" },
  天堂星: { balanced: "落ち着いた観察で良い縁を引き寄せる。内面のバランスが自制心と適度な情熱のバランスを取り、相手を不安にさせない。", moderate: "落ち着いた観察で良い縁を引き寄せる。間断の気で年齢差のある関係で燃焼しやすい。自制心が強いが、冷めると相手を不安にする。", imbalanced: "内面の偏りが自制心を行き過ぎさせ、冷めると相手を不安にさせやすく関係が揺らぎやすくなる。" },
  天胡星: { balanced: "感受性が豊かでロマンチック。内面のバランスが現実感覚も保ち、誤解を招かずに関係を築ける。", moderate: "感受性が豊かでロマンチック。美意識が強く人を疑わないが、時系列的な秩序を欠く発想で誤解を招きやすい。現実を離れた発想ゆえに関係が崩れやすい。", imbalanced: "内面の偏りが現実逃避を極限化し、関係が崩れやすくなる。" },
  天極星: { balanced: "受け身だが、内面のバランスが環境に合わせつつ自分から動く意識も与え、縁を掴みやすくなる。", moderate: "受け身で縁を掴みにくいが、環境に合わせて心を作るため恵まれた環境では自然に縁が入る。自分から動く意識と、環境依存から抜け出す主体性が必要。", imbalanced: "内面の偏りが受身を極限化し、環境依存から抜け出せず縁を掴めない。" },
  天庫星: { balanced: "過去の縁を引きずりやすいが、内面のバランスが執着を健全な深掘りに変え、新たな縁も入れる。", moderate: "過去の縁を引きずりやすい。連結のない一筋の探究心で相手に固執するが、自分なりのバランス感覚で違和感を排除しようとする。執着を手放すと新たな縁が入る。", imbalanced: "内面の偏りが執着を極限化し、過去の縁に固執して新たな縁が入りにくくなる。" },
  天馳星: { balanced: "瞬発的な魅力で急接近する。内面のバランスが点的今の連続でも持続的な感情を作り、気分屋に映らない。", moderate: "瞬発的な魅力で急接近するが、点的今の連続で固定された持続的な感情を作らない。こだわりを持たないさっぱりとした精神が相手には気分屋に映る。", imbalanced: "内面の偏りが分裂を極限化し、持続的な感情を作りにくく相手に気分屋に映りやすくなる。" }
};
const energyFortuneWork = {
  天報星: { balanced: "複数の仕事が同時に回る。内面のバランスが優先順位を明確にし、前例のない分野で効率的に力を発揮する。", moderate: "複数の仕事が同時に回るが、まとまりに欠ける。前例のない新しい分野で力を発揮するが、優先順位の明確化と小刻みの連結が必要。", imbalanced: "内面の偏りが分散を極限化し、複数の仕事が中途半端になり成果が出にくい。" },
  天印星: { balanced: "裏方で力を発揮する時期。内面のバランスが着実な準備に持続力を与え、一つ一つを確実に成果に繋げる。", moderate: "人の目に触れないところで事の原因を作り出す時期。準備と観察の星なので、表舞台より裏方で力を発揮する。一つ一つを着実に消化することが成果に繋がる。", imbalanced: "内面の偏りが裏方への逃避を極限化し、表舞台に出にくく成果が見えにくい。" },
  天貴星: { balanced: "試練によって磨かれる時期。内面のバランスがプライドを適度に保ち、教える立場でチームからも信頼される。", moderate: "試練によって磨かれる時期。積み重ね型の学習力で綿密に準備し、教える立場で評価される。ただし飛躍した発想には限界があり、プライドが高すぎるとチームから浮く。", imbalanced: "内面の偏りがプライドを極限化し、チームから浮いて孤立しやすくなる。" },
  天恍星: { balanced: "現状打破のチャンス。内面のバランスが刺激への衝動を抑え、新しい分野で確実に成長を加速する。", moderate: "現状打破のチャンス。脱皮したくなる想念が新しい分野への転職や冒険を促す。分岐点を乗り越えると成長が加速するが、刺激を追いすぎると腰が落ち着かない。", imbalanced: "内面の偏りが刺激への欲求を極限化し、腰が落ち着かず転職を繰り返しやすい。" },
  天南星: { balanced: "新しい世界を切り開く時期。内面のバランスが批判力を建設的な改革に変え、協力者を失わない。", moderate: "内的世界への固執が前進力となり、新しい世界を切り開く時期。古いものを廃し独創的な思考力で改革を推し進める。ただし環境を無視した批判力で協力者を失うことも。", imbalanced: "内面の偏りが批判力を極限化し、協力者を失って孤立しやすくなる。" },
  天禄星: { balanced: "堅実に実績を積める時期。内面のバランスが用心深さと適度な挑戦のバランスを取り、発明発見にも繋げる。", moderate: "堅実に実績を積める時期。職人として積み重ねた経験が評価され、経験則に基づく未来予測力で安定した成果を出す。用心深さが発明や発見につながることも。変化に弱く新しい挑戦を避けがち。", imbalanced: "内面の偏りが用心深さを行き過ぎさせ、新しい挑戦を避けがちで成長が止まりやすい。" },
  天将星: { balanced: "強いリーダーシップで成果を出す。内面のバランスが周囲を押し付けず、創造と破壊のバランスを取って次元を上げる。", moderate: "強いリーダーシップで成果を出す。極まることで転換を作り出し、創造と破壊を繰り返しながら次元を上げる。ただし周囲を押し付けると反発を招き、強すぎる運勢が協力者に負担をかけることも。", imbalanced: "内面の偏りが押し付けを極限化し、反発を招いて協力者に負担をかける。" },
  天堂星: { balanced: "観察と分析で確実に成果を出す。内面のバランスが諦念を健全な慎重さに変え、単独行動でも伸びしろを活かせる。", moderate: "観察と分析で確実に成果を出す。自制心による出処進退のわきまえがあり、単独行動で力を発揮する。ただし諦念が強すぎると伸びしろを消す。", imbalanced: "内面の偏りが諦念を極限化し、伸びしろを消しがちで挑戦から遠ざかりやすい。" },
  天胡星: { balanced: "感性を活かした仕事で光る。内面のバランスが集中力と休憩のバランスを取り、先見性のある成果を安定して出す。", moderate: "感性を活かした仕事で光る。無から何かを作り出す能力と異常な集中力で先見性のある成果を出す。ただし精神が肉体を追い込みやすく、際限のない集中で体調を崩しやすい。", imbalanced: "内面の偏りが集中を極限化し、際限のない集中で体調を崩して仕事が続けにくくなる。" },
  天極星: { balanced: "精神性が深まり回帰作用で異次元への飛翔力が増す。内面のバランスが行動力も与え、計画的に動く主体性を発揮できる。", moderate: "精神性が深まり回帰作用で異次元への飛翔力が増すが、行動力が不足しがち。環境に合わせて力を発揮するが、自分から未来を志向して計画的に動く主体性が必要。", imbalanced: "内面の偏りが行動力の不足を極限化し、自分から動けず主体性が弱くなる。" },
  天庫星: { balanced: "蓄積と研究で成果が出る。内面のバランスが執着を健全な探究に変え、過去のやり方に固執せず変化にも対応する。", moderate: "蓄積と研究で成果が出る。連結のない一筋の探究心で深く掘り下げ、中庸力で本質を感知する。ただし過去のやり方に固執すると変化に遅れ、とらわれたものに縛られやすくなる。", imbalanced: "内面の偏りが固執を極限化し、過去のやり方に固執して縛られやすく変化に遅れやすくなる。" },
  天馳星: { balanced: "外動内静でよく働き動き回る。内面のバランスが異質な分野の作業を効率的に並行させ、持続力の限界も補う。", moderate: "外動内静でよく働き動き回る。分裂・分離の本性で異質な分野の作業を並行してこなす。点的今に全力を注ぐが、一つに集中すると持続力に限界がある。動けない環境だと体調を崩しやすい。", imbalanced: "内面の偏りが分裂を極限化し、一つに集中すると持続力が限界に達しやすく、動けない環境だと体調を崩しやすくなる。" }
};

// 五行関係による運勢の補正テキスト
function getGogyoRelationText(relA, relB) {
  const relations = [];
  const relNames = { 0: "比和", 1: "相生", 2: "相剋", 3: "反剋" };
  [relA, relB].forEach((r) => {
    if (r === "相生") relations.push("相生（生じられる・助けられる）関係で、運気が自然に伸びる");
    if (r === "比和") relations.push("比和（同質）関係で、力は増すが刺激に欠ける");
    if (r === "相剋") relations.push("相剋（剋される）関係で、摩擦や抵抗が出やすい");
    if (r === "反剋") relations.push("反剋（剋する）関係で、環境を変える力があるが消耗しやすい");
  });
  return relations.length > 0 ? relations.join("。") + "。" : "";
}

function analyzeYearlyFortune(day, pillars, taiun, currentAge, thisYear, balanceType) {
  const currentTaiun = taiun.periods.find((p) => currentAge >= p.age && currentAge <= p.ageTo);
  const yp = getYearPillarForYear(thisYear);
  const yearStar = getMainStar(day.stem, yp.stem);
  const yearEnergy = getEnergyStar(day.stem, yp.branch);
  const taiunStar = currentTaiun ? getMainStar(day.stem, currentTaiun.stem) : null;
  const taiunEnergy = currentTaiun ? getEnergyStar(day.stem, currentTaiun.branch) : null;

  // 天中殺判定
  const tenchusatsu = getTenchusatsu(day.index);
  const isYearTenchu = isTenchusatsuYear(yp.branch, tenchusatsu);
  const isTaiunTenchu = currentTaiun ? isTenchusatsuYear(currentTaiun.branch, tenchusatsu) : false;

  // 位相法（年運の地支と宿命）
  const yearTopo = analyzeBranchTopology(yp.branch, pillars, yp.stem);
  const taiunTopo = currentTaiun ? analyzeBranchTopology(currentTaiun.branch, pillars, currentTaiun.stem) : [];

  // 五行関係（日干と年運・大運の天干）
  const dayEl = elements[stems.indexOf(day.stem)];
  const yearEl = elements[stems.indexOf(yp.stem)];
  const taiunEl = currentTaiun ? elements[stems.indexOf(currentTaiun.stem)] : null;
  const yearRel = gogyoRelation[dayEl][yearEl];
  const taiunRel = taiunEl ? gogyoRelation[dayEl][taiunEl] : null;

  // 金運・恋愛運・仕事運の構築
  const isGood = (star) => {
    const goodStars = ["禄存星", "司禄星", "石門星", "玉堂星", "牽牛星"];
    return goodStars.includes(star);
  };

  const moneyText = (() => {
    const yearPart = isGood(yearStar) || yearRel === "相生"
      ? pickByBalance(starFortuneMoney[yearStar].good, balanceType)
      : pickByBalance(starFortuneMoney[yearStar].bad, balanceType);
    const taiunPart = taiunStar ? (isGood(taiunStar) || taiunRel === "相生"
      ? pickByBalance(starFortuneMoney[taiunStar].good, balanceType)
      : pickByBalance(starFortuneMoney[taiunStar].bad, balanceType)) : "";
    const energyPart = pickByBalance(energyFortuneMoney[yearEnergy.name], balanceType);
    const tenchuPart = isYearTenchu ? "天中殺年中は金運が不安定。大きな投資や買い物は避け、現状維持と整理に徹するのが無難。" : "";
    const topoGo = yearTopo.filter((r) => r.group === "合法");
    const topoSan = yearTopo.filter((r) => r.group === "散法");
    const topoPart = [];
    if (topoGo.length > 0) topoPart.push("位相法の合法（" + topoGo.map((r) => r.name).join("・") + "）が金運の支えになる");
    if (topoSan.length > 0) topoPart.push("位相法の散法（" + topoSan.map((r) => r.name).join("・") + "）に注意。金銭トラブルや契約の崩れに気をつけろ");
    return [yearPart, taiunPart && `大運「${taiunStar}」: ${taiunPart}`, `年運十二大従星「${yearEnergy.name}」: ${energyPart}`, tenchuPart, topoPart.length > 0 ? topoPart.join("。") + "。" : ""].filter(Boolean).join(" ");
  })();

  const loveText = (() => {
    const yearPart = yearRel === "相生" || yearRel === "比和"
      ? pickByBalance(starFortuneLove[yearStar].good, balanceType)
      : pickByBalance(starFortuneLove[yearStar].bad, balanceType);
    const taiunPart = taiunStar ? (taiunRel === "相生" || taiunRel === "比和"
      ? pickByBalance(starFortuneLove[taiunStar].good, balanceType)
      : pickByBalance(starFortuneLove[taiunStar].bad, balanceType)) : "";
    const energyPart = pickByBalance(energyFortuneLove[yearEnergy.name], balanceType);
    const tenchuPart = isYearTenchu ? "天中殺年中の恋愛は縁が不安定。新たな関係のスタートは避け、既存の関係を見直す時期。" : "";
    const topoGo = yearTopo.filter((r) => r.group === "合法");
    const topoSan = yearTopo.filter((r) => r.group === "散法");
    const topoPart = [];
    if (topoGo.length > 0) topoPart.push("位相法の合法（" + topoGo.map((r) => r.name).join("・") + "）が恋愛運を後押しする");
    if (topoSan.length > 0) topoPart.push("位相法の散法（" + topoSan.map((r) => r.name).join("・") + "）で関係の摩擦や別れに注意");
    return [yearPart, taiunPart && `大運「${taiunStar}」: ${taiunPart}`, `年運十二大従星「${yearEnergy.name}」: ${energyPart}`, tenchuPart, topoPart.length > 0 ? topoPart.join("。") + "。" : ""].filter(Boolean).join(" ");
  })();

  const workText = (() => {
    const yearPart = isGood(yearStar) || yearRel === "相生"
      ? pickByBalance(starFortuneWork[yearStar].good, balanceType)
      : pickByBalance(starFortuneWork[yearStar].bad, balanceType);
    const taiunPart = taiunStar ? (isGood(taiunStar) || taiunRel === "相生"
      ? pickByBalance(starFortuneWork[taiunStar].good, balanceType)
      : pickByBalance(starFortuneWork[taiunStar].bad, balanceType)) : "";
    const energyPart = pickByBalance(energyFortuneWork[yearEnergy.name], balanceType);
    const tenchuPart = isYearTenchu ? "天中殺年中は仕事の変化や拡大より整理・準備向き。転職や独立は天中殺明けが無難。" : "";
    const topoGo = yearTopo.filter((r) => r.group === "合法");
    const topoSan = yearTopo.filter((r) => r.group === "散法");
    const topoPart = [];
    if (topoGo.length > 0) topoPart.push("位相法の合法（" + topoGo.map((r) => r.name).join("・") + "）が仕事運の追い風になる");
    if (topoSan.length > 0) topoPart.push("位相法の散法（" + topoSan.map((r) => r.name).join("・") + "）で職場的人間関係のトラブルに注意");
    return [yearPart, taiunPart && `大運「${taiunStar}」: ${taiunPart}`, `年運十二大従星「${yearEnergy.name}」: ${energyPart}`, tenchuPart, topoPart.length > 0 ? topoPart.join("。") + "。" : ""].filter(Boolean).join(" ");
  })();

  // 総合スコア（0-100）極端化・ドメイン別重み付け
  let moneyScore = 50, loveScore = 50, workScore = 50;

  // 星ごとのドメイン別重み（金運/恋愛/仕事）— 星によって得意不得意を分ける
  const starDomainWeights = {
    "貫索星": { money: 22, love: -8,  work: 18 },
    "石門星": { money: 12, love: 18,  work: 14 },
    "鳳閣星": { money: -6, love: 25,  work: -10 },
    "調舒星": { money: -12, love: 20, work: -14 },
    "禄存星": { money: 16, love: 22,  work: 8 },
    "司禄星": { money: 24, love: -4,  work: 20 },
    "車騎星": { money: 6,  love: 18,  work: 16 },
    "牽牛星": { money: 18, love: -10, work: 24 },
    "龍高星": { money: -14, love: 22, work: -16 },
    "玉堂星": { money: 14, love: 6,   work: 22 }
  };

  // 年運星の影響
  const yw = starDomainWeights[yearStar] || { money: 0, love: 0, work: 0 };
  moneyScore += yw.money; loveScore += yw.love; workScore += yw.work;

  // 大運星の影響（やや弱め）
  if (taiunStar) {
    const tw = starDomainWeights[taiunStar] || { money: 0, love: 0, work: 0 };
    moneyScore += Math.round(tw.money * 0.7); loveScore += Math.round(tw.love * 0.7); workScore += Math.round(tw.work * 0.7);
  }

  // 五行関係性のドメイン別影響
  if (yearRel === "相生") { moneyScore += 12; loveScore += 20; workScore += 14; }
  if (yearRel === "比和") { moneyScore += 6; loveScore += 4; workScore += 8; }
  if (yearRel === "相剋") { moneyScore -= 18; loveScore -= 14; workScore -= 12; }
  if (yearRel === "反剋") { moneyScore -= 8; loveScore -= 12; workScore -= 14; }
  if (taiunRel === "相生") { moneyScore += 8; loveScore += 14; workScore += 8; }
  if (taiunRel === "相剋") { moneyScore -= 12; loveScore -= 8; workScore -= 12; }

  // 十二大従星のドメイン別影響
  const energyDomainWeights = {
    "天貴星": { money: 12, love: 6,  work: 14 },
    "天南星": { money: 8,  love: 14, work: 10 },
    "天禄星": { money: 16, love: 8,  work: 12 },
    "天将星": { money: 14, love: 10, work: 16 },
    "天堂星": { money: 10, love: 16, work: 6 },
    "天印星": { money: 4,  love: 12, work: 6 },
    "天報星": { money: -12, love: -6, work: -10 },
    "天胡星": { money: -8, love: -14, work: -8 },
    "天極星": { money: -10, love: -8, work: -14 },
    "天馳星": { money: -6, love: -12, work: -10 },
    "天庫星": { money: 14, love: 4,  work: 12 },
    "天恍星": { money: -4, love: -8, work: -6 }
  };
  const ew = energyDomainWeights[yearEnergy.name] || { money: 0, love: 0, work: 0 };
  moneyScore += ew.money; loveScore += ew.love; workScore += ew.work;

  // 天中殺のドメイン別影響（恋愛への打撃が最大）
  if (isYearTenchu) { moneyScore -= 16; loveScore -= 28; workScore -= 14; }
  if (isTaiunTenchu) { moneyScore -= 8; loveScore -= 14; workScore -= 8; }

  // 位相法のドメイン別影響
  const topoGoCount = yearTopo.filter((r) => r.group === "合法").length;
  const topoSanCount = yearTopo.filter((r) => r.group === "散法").length;
  moneyScore += topoGoCount * 10 - topoSanCount * 6;
  loveScore += topoGoCount * 12 - topoSanCount * 10;
  workScore += topoGoCount * 8 - topoSanCount * 8;

  // 日干五行のドメイン別影響（命式の土・金は金運に強い、水は恋愛に強いなど）
  const gogyoDomainBonus = {
    "木": { money: -4, love: 8,  work: 6 },
    "火": { money: 4,  love: 10, work: -4 },
    "土": { money: 12, love: -6, work: 10 },
    "金": { money: 10, love: -8, work: 8 },
    "水": { money: -6, love: 14, work: 2 }
  };
  const gd = gogyoDomainBonus[dayEl] || { money: 0, love: 0, work: 0 };
  moneyScore += gd.money; loveScore += gd.love; workScore += gd.work;

  // 天中殺+相剋のダブルパンチ
  if (isYearTenchu && yearRel === "相剋") { moneyScore -= 8; loveScore -= 12; workScore -= 8; }
  // 良い星+相生のダブルボーナス
  const goodStars = ["禄存星", "司禄星", "石門星", "玉堂星", "牽牛星"];
  if (goodStars.includes(yearStar) && yearRel === "相生") { moneyScore += 6; loveScore += 6; workScore += 6; }

  moneyScore = Math.max(5, Math.min(98, moneyScore));
  loveScore = Math.max(5, Math.min(98, loveScore));
  workScore = Math.max(5, Math.min(98, workScore));

  return {
    thisYear,
    yp,
    yearStar,
    yearEnergy,
    taiunStar,
    taiunEnergy,
    currentTaiun,
    isYearTenchu,
    isTaiunTenchu,
    yearRel,
    taiunRel,
    yearTopo,
    taiunTopo,
    moneyText,
    loveText,
    workText,
    moneyScore,
    loveScore,
    workScore
  };
}

// === 今日の運勢・今月の運勢 ===
function analyzeDailyMonthlyFortune(day, pillars, tenchusatsu, balanceType) {
  const now = new Date();
  const todayPillar = getDayPillar(now);
  const yearPillar = getYearPillar(now);
  const monthPillar = getMonthPillar(now, stems.indexOf(yearPillar.stem));

  // 日運・月運の主星と従星
  const dayStar = getMainStar(day.stem, todayPillar.stem);
  const dayEnergy = getEnergyStar(day.stem, todayPillar.branch);
  const monthStar = getMainStar(day.stem, monthPillar.stem);
  const monthEnergy = getEnergyStar(day.stem, monthPillar.branch);

  // 五行関係
  const dayEl = elements[stems.indexOf(day.stem)];
  const todayEl = elements[stems.indexOf(todayPillar.stem)];
  const monthEl_el = elements[stems.indexOf(monthPillar.stem)];
  const dayRel = gogyoRelation[dayEl][todayEl];
  const monthRel = gogyoRelation[dayEl][monthEl_el];

  // 天中殺判定
  const isDayTenchu = isTenchusatsuYear(todayPillar.branch, tenchusatsu);
  const isMonthTenchu = isTenchusatsuYear(monthPillar.branch, tenchusatsu);

  // 位相法
  const dayTopo = analyzeBranchTopology(todayPillar.branch, pillars, todayPillar.stem);
  const monthTopo = analyzeBranchTopology(monthPillar.branch, pillars, monthPillar.stem);

  // スコア計算（年運と同じロジックを縮小適用）
  const starDomainWeights = {
    "貫索星": { money: 22, love: -8, work: 18 },
    "石門星": { money: 12, love: 18, work: 14 },
    "鳳閣星": { money: -6, love: 25, work: -10 },
    "調舒星": { money: -12, love: 20, work: -14 },
    "禄存星": { money: 16, love: 22, work: 8 },
    "司禄星": { money: 24, love: -4, work: 20 },
    "車騎星": { money: 6, love: 18, work: 16 },
    "牽牛星": { money: 18, love: -10, work: 24 },
    "龍高星": { money: -14, love: 22, work: -16 },
    "玉堂星": { money: 14, love: 6, work: 22 }
  };
  const energyDomainWeights = {
    "天貴星": { money: 12, love: 6, work: 14 },
    "天南星": { money: 8, love: 14, work: 10 },
    "天禄星": { money: 16, love: 8, work: 12 },
    "天将星": { money: 14, love: 10, work: 16 },
    "天堂星": { money: 10, love: 16, work: 6 },
    "天印星": { money: 4, love: 12, work: 6 },
    "天報星": { money: -12, love: -6, work: -10 },
    "天胡星": { money: -8, love: -14, work: -8 },
    "天極星": { money: -10, love: -8, work: -14 },
    "天馳星": { money: -6, love: -12, work: -10 },
    "天庫星": { money: 14, love: 4, work: 12 },
    "天恍星": { money: -4, love: -8, work: -6 }
  };

  function calcScore(star, energyName, rel, isTenchu, topo) {
    let money = 50, love = 50, work = 50;
    const sw = starDomainWeights[star] || { money: 0, love: 0, work: 0 };
    money += sw.money; love += sw.love; work += sw.work;
    if (rel === "相生") { money += 12; love += 20; work += 14; }
    else if (rel === "比和") { money += 6; love += 4; work += 8; }
    else if (rel === "相剋") { money -= 18; love -= 14; work -= 12; }
    else if (rel === "反剋") { money -= 8; love -= 12; work -= 14; }
    const ew = energyDomainWeights[energyName] || { money: 0, love: 0, work: 0 };
    money += ew.money; love += ew.love; work += ew.work;
    if (isTenchu) { money -= 16; love -= 28; work -= 14; }
    const goCount = topo.filter(r => r.group === "合法").length;
    const sanCount = topo.filter(r => r.group === "散法").length;
    money += goCount * 10 - sanCount * 6;
    love += goCount * 12 - sanCount * 10;
    work += goCount * 8 - sanCount * 8;
    return {
      money: Math.max(5, Math.min(98, money)),
      love: Math.max(5, Math.min(98, love)),
      work: Math.max(5, Math.min(98, work))
    };
  }

  const dayScores = calcScore(dayStar, dayEnergy.name, dayRel, isDayTenchu, dayTopo);
  const monthScores = calcScore(monthStar, monthEnergy.name, monthRel, isMonthTenchu, monthTopo);

  // アドバイス生成
  function buildAdvice(star, energyName, rel, isTenchu, scores, period) {
    const parts = [];
    const goodStars = ["禄存星", "司禄星", "石門星", "玉堂星", "牽牛星"];

    if (isTenchu) {
      parts.push(`${period}は天中殺中。大きな決断や新しいことを始めるのは避け、整理と準備に徹するのが無難です。`);
    } else if (rel === "相生" || rel === "比和") {
      parts.push(`${period}は運気の追い風がある時期。積極的に動くことで良い結果が期待できます。`);
    } else if (rel === "相剋" || rel === "反剋") {
      parts.push(`${period}は摩擦や抵抗が出やすい時期。無理をせず、慎重に行動するのが安全です。`);
    } else {
      parts.push(`${period}は平凡な運気。日常を着実に過ごし、コンディションを整えるのに適しています。`);
    }

    // 星別の具体的アドバイス
    const starAdvice = {
      "貫索星": "自分のペースを守り、一つのことに集中するのが吉。",
      "石門星": "人との交流を大切にすると運が開ける。",
      "鳳閣星": "楽しさや表現力を活かすと良い流れが来る。",
      "調舒星": "感性を大切にしつつ、感情の波に注意。",
      "禄存星": "人に親切にすると自分にも良いことが返ってくる。",
      "司禄星": "コツコツ積み重ねることが成果につながる。",
      "車騎星": "行動力が鍵。思い切って動くのが吉。",
      "牽牛星": "品位と責任を大切にすると評価が上がる。",
      "龍高星": "変化を受け入れ、柔軟に対応するのが吉。",
      "玉堂星": "学びや知識を活かすと良い結果が出る。"
    };
    if (starAdvice[star]) parts.push(starAdvice[star]);

    // スコア別のドメインアドバイス
    const domains = [
      { name: "金運", score: scores.money },
      { name: "恋愛運", score: scores.love },
      { name: "仕事運", score: scores.work }
    ];
    const best = domains.reduce((a, b) => a.score > b.score ? a : b);
    const worst = domains.reduce((a, b) => a.score < b.score ? a : b);

    if (best.score >= 65) {
      parts.push(`${best.name}が特に好調（${best.score}点）。この分野で積極的に動くのが効果的です。`);
    }
    if (worst.score <= 35) {
      parts.push(`${worst.name}には注意（${worst.score}点）。無理をせず、守りに入るのが賢明です。`);
    }

    return parts.join(" ");
  }

  const dayAdvice = buildAdvice(dayStar, dayEnergy.name, dayRel, isDayTenchu, dayScores, "今日");
  const monthAdvice = buildAdvice(monthStar, monthEnergy.name, monthRel, isMonthTenchu, monthScores, "今月");

  // 日付フォーマット
  const todayStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  const monthStr = `${now.getFullYear()}年${now.getMonth() + 1}月`;

  return {
    today: {
      date: todayStr,
      pillar: todayPillar,
      star: dayStar,
      energy: dayEnergy,
      rel: dayRel,
      isTenchu: isDayTenchu,
      scores: dayScores,
      advice: dayAdvice
    },
    monthly: {
      month: monthStr,
      pillar: monthPillar,
      star: monthStar,
      energy: monthEnergy,
      rel: monthRel,
      isTenchu: isMonthTenchu,
      scores: monthScores,
      advice: monthAdvice
    }
  };
}

// 大運・年運の星を分かりやすく解説する関数
function starToPlainDesc(starName, isTenchu, rel, period) {
  const starDesc = {
    "貫索星": {
      title: "自分の道を貫く時期",
      desc: "自分の信念を大切にして、周りに流されずに進む時期。一人で始めたことが評価されやすいです。",
      good: "自分のやりたい仕事を貫いて認められる、一人で始めたことが評価される",
      bad: "頑固になりすぎて周りと対立する、人のアドバイスを聞かずに失敗する",
      neutral: "今の仕事や関係を深めつつ、自分のペースを守るのが正解"
    },
    "石門星": {
      title: "人とのつながりが鍵の時期",
      desc: "協力やチームワークが成果を生む時期。人との出会いが運を呼び込みます。",
      good: "新しいコミュニティで大切な人脈ができる、チームで大きなプロジェクトを成功させる",
      bad: "人間関係のトラブルに巻き込まれる、グループ内の対立で板挟みになる",
      neutral: "交流会に参加して来年に向けた人脈を育む、今の仲間との関係を深める"
    },
    "鳳閣星": {
      title: "楽しさと表現力が広がる時期",
      desc: "明るさや表現力が運を呼び込む時期。自分を楽しませることが、結果的に運を開きます。",
      good: "SNSの発信が評価されて仕事につながる、趣味が収入になる",
      bad: "遊びすぎて健康やお金を損なう、だらけすぎて仕事に支障が出る",
      neutral: "週末は趣味を楽しみつつ平日はしっかり働くバランスが取れる"
    },
    "調舒星": {
      title: "感受性が鋭くなる時期",
      desc: "感性や直感が冴える一方、感情の波にも注意が必要。クリエイティブな作業に向いています。",
      good: "ひらめいたアイデアが評価される、クリエイティブな仕事で成果を出す",
      bad: "些細なことで怒って人間関係を悪化させる、感情の波で仕事が手につかない",
      neutral: "日記や一人の時間で自分の感情を整理する内省の期間"
    },
    "禄存星": {
      title: "愛情と奉仕が運を呼ぶ時期",
      desc: "人に親切にすることで自分にも良いことが巡ってくる時期。優しさが運を連れてきます。",
      good: "後輩を指導して自分の評価も上がる、人に尽くしたことが形になって返ってくる",
      bad: "人に尽くしすぎて自分が疲弊する、いい人になりすぎて利用される",
      neutral: "お世話になった人に挨拶回りをして関係を深める"
    },
    "司禄星": {
      title: "蓄積と堅実さが報われる時期",
      desc: "コツコツ積み重ねたことが評価される時期。地道な努力が花を開かせます。",
      good: "長年続けた勉強が資格試験合格につながる、地道な努力が昇進に結びつく",
      bad: "変化を恐れてチャンスを逃す、安全策ばかり取って成長がない",
      neutral: "貯金や基盤作りを着実に進め、来年の飛躍に備える"
    },
    "車騎星": {
      title: "行動力が試される時期",
      desc: "動いて結果を出すことが求められる時期。思い切って動く人が報われます。",
      good: "営業成績でトップを取る、コンテストに応募して入賞する",
      bad: "焦って失敗する、勢いで契約して後で条件が悪いことに気づく",
      neutral: "体力作りから始め、来年の勝負に備える"
    },
    "牽牛星": {
      title: "名誉と責任が訪れる時期",
      desc: "評価される一方で、責任も重くなる時期。やりがいとプレッシャーが表裏一体です。",
      good: "昇進して役職がつき、やりがいと充実感を感じる、表彰される",
      bad: "責任が重すぎて潰されそうになる、スケジュール管理ができずチームが混乱する",
      neutral: "地道に実績を積み上げて「次は任せよう」と言われる"
    },
    "龍高星": {
      title: "変革と冒険の時期",
      desc: "環境が大きく変わる可能性がある時期。変化を恐れず飛び込む人が成果をつかみます。",
      good: "未経験の業界に転職して活躍し始める、新しい分野に挑戦して成功する",
      bad: "引っ越し・転職・別れが同時に起きて心の余裕がない、変化が多すぎて疲弊する",
      neutral: "趣味を一つ変えてみるなど、小さな冒険から始める"
    },
    "玉堂星": {
      title: "学びと知恵が評価される時期",
      desc: "知識や学習が成果につながる時期。学んだことが自信になり、自信が運を呼びます。",
      good: "取得した資格が活きる部署に異動する、専門知識が評価されて仕事が増える",
      bad: "理屈ばかりで行動が遅れる、考えすぎてチャンスを逃す",
      neutral: "オンライン講座を受講し、来年に向けたスキルを身につける"
    }
  };

  // 従星（十二大従星）の分かりやすい解説
  const energyDesc = {
    "天貴星": { title: "品性と役割意識を磨く時期", desc: "自分の役割を見つけ、品と向上心を大切にする時期です。" },
    "天南星": { title: "内なる想いを形にする時期", desc: "自分の主張を行動に変え、新しい道を開く時期です。" },
    "天禄星": { title: "コツコツ積み重ねて安定を築く時期", desc: "堅実な積み重ねで将来の安定を作る時期です。" },
    "天将星": { title: "大きな変化を生み出す時期", desc: "創造と破壊の波が訪れ、新しいものを生み出す時期です。" },
    "天堂星": { title: "一歩下がって協調する時期", desc: "自制心を持ち、周囲と協調することで道が開ける時期です。" },
    "天恍星": { title: "現状を打破し飛び込む時期", desc: "新しい環境に飛び込み、自分を変える時期です。" },
    "天印星": { title: "目の前の現実に集中する時期", desc: "今の環境に適応し、準備を整える時期です。" },
    "天報星": { title: "前例のない道を切り開く時期", desc: "変化と直感力で新しい道を作る時期です。" },
    "天胡星": { title: "感受性と集中力が高まる時期", desc: "鋭い感性で無から有を生み出す時期です。" },
    "天極星": { title: "環境に合わせて持続する時期", desc: "柔軟に環境に適応し、心を整える時期です。" },
    "天庫星": { title: "一つのことに集中して探究する時期", desc: "一つの分野を深く掘り下げ、専門性を高める時期です。" },
    "天馳星": { title: "動きの中で変化を受け入れる時期", desc: "変化の多い中で静けさを保ち、柔軟に生きる時期です。" }
  };

  const relText = {
    "相生": "あなたを後押しする関係",
    "比和": "同じ性質が重なり勢いが増す関係",
    "相剋": "ぶつかり合い摩擦を生む関係",
    "反剋": "予期せぬ逆風が吹く関係"
  };

  const info = starDesc[starName];
  if (!info) return null;

  let tone = "neutral";
  if (isTenchu) {
    tone = "bad";
  } else if (rel === "相生" || rel === "比和") {
    tone = "good";
  } else if (rel === "相剋" || rel === "反剋") {
    tone = "bad";
  }

  return {
    title: info.title,
    desc: info.desc,
    example: info[tone],
    relText: rel ? relText[rel] || rel : "",
    isTenchu
  };
}

function buildYearlyConcreteDescription(yf, simple) {
  const parts = [];
  const yearStarName = yf.yearStar;
  const taiunStarName = yf.taiunStar || "";

  // 大運×年運の星の組み合わせで「今年はこんな年」を生成
  const starComboMeaning = {
    "貫索星": {
      good: "自分の信念を貫いて新しい道を切り開く年。独立や転職を決断し、周囲の反対を押し切って自分の方向性を貫く。",
      bad: "頑固さが裏目に出て孤立しがちな年。周囲のアドバイスを聞かず自分のやり方に固執して人間関係が悪化する。",
      neutral: "自分のペースでコツコツ進めるのが正解の年。大きな変化を求めず、今の仕事や関係を深めることに集中する。"
    },
    "石門星": {
      good: "人とのつながりが拡がり、協力して大きな成果を出せる年。新しいコミュニティに参加し、そこで出会った人と共同プロジェクトを立ち上げる。",
      bad: "人間関係のトラブルに巻き込まれやすい年。友人の喧嘩に巻き込まれたり、グループ内の対立で板挟みになる。",
      neutral: "人脈を広める基礎作りの年。業界の交流会に参加し、名刺交換を重ねて来年に向けた人脈を蓄える。"
    },
    "鳳閣星": {
      good: "表現力が光り、楽しさが運を呼ぶ年。SNSで発信した内容がバズったり、趣味が仕事につながる。",
      bad: "遊びすぎて生活が乱れる年。毎週飲み会で健康を損ねたり、交際費がかさんで貯金が減る。",
      neutral: "バランス良く楽しみながら成果も出せる年。週末は趣味を楽しみつつ、平日はしっかり仕事をこなす。"
    },
    "調舒星": {
      good: "感受性が鋭くなり、クリエイティブな成果が出せる年。ひらめきで新しいアイデアを提案し、評価される。",
      bad: "感情の波が激しく、人と衝突しやすい年。些細なことで怒って上司に反発し、評価を下げる。",
      neutral: "自分の感情と向き合う内省の年。日記をつけたり、カウンセリングを受けて自分を見つめ直す。"
    },
    "禄存星": {
      good: "愛情と奉仕が好循環を生む年。後輩を親身に指導し、その後輩が成果を出して自分の評価も上がる。",
      bad: "人に尽くしすぎて自分が疲弊する年。同僚の仕事を手伝いすぎて自分の仕事が回らなくなる。",
      neutral: "人への感謝を形にする年。お世話になった人に挨拶回りをし、関係を深める。"
    },
    "司禄星": {
      good: "蓄積した努力が実を結ぶ年。何年も続けた勉強が認められ、資格試験に一発で合格する。",
      bad: "変化を恐れてチャンスを逃す年。転職の誘いがあるのに「今の職場が安心」と断り、後で後悔する。",
      neutral: "堅実に基盤を固める年。貯金を着実に増やし、保険を見直して万全の体制を作る。"
    },
    "車騎星": {
      good: "行動力が爆発し、勝負に出るのに最適な年。コンテストに応募して入賞、または営業成績でトップを取る。",
      bad: "焦って失敗しやすい年。勢いで契約して後で条件が悪いことに気づく、スピード違反で捕まる。",
      neutral: "体力作りから始める年。ジムに通い始め、体力をつけてから来年の勝負に備える。"
    },
    "牽牛星": {
      good: "名誉と責任が同時に訪れ、ステップアップの年。昇進して役職がつき、やりがいとプレッシャーを同時に感じる。",
      bad: "責任が重すぎて潰されそうになる年。プロジェクトリーダーに任命されるが、スケジュール管理ができずチームが混乱する。",
      neutral: "実績を積み上げて評価を得る年。地道に成果を出し続け、上司から「次は任せよう」と言われる。"
    },
    "龍高星": {
      good: "変革のチャンスが訪れ、冒険が成功する年。未経験の業界に転職し、新しいスキルを覚えて活躍し始める。",
      bad: "変化が多すぎて落ち着かない年。引っ越し、転職、別れが同時に起きて心の余裕がなくなる。",
      neutral: "小さな変化から始める年。趣味を一つ変えてみる、通勤ルートを変えてみるなど、小さな冒険を楽しむ。"
    },
    "玉堂星": {
      good: "学びが評価につながり、知恵を活かせる年。取得した資格が活きる部署に異動し、専門性を発揮する。",
      bad: "理屈ばかりで行動が遅れる年。あれこれ考えすぎてチャンスを逃し、結局何も始められない。",
      neutral: "知識を蓄える勉強の年。オンライン講座を受講し、来年に向けたスキルを身につける。"
    }
  };

  // 年運星と相性関係からgood/bad/neutralを判定
  const yearRel = yf.yearRel;
  const taiunRel = yf.taiunRel;
  const isTenchu = yf.isYearTenchu || yf.isTaiunTenchu;
  let tone = "neutral";
  if (isTenchu) {
    tone = "bad";
  } else if ((yearRel === "相生" || yearRel === "比和") && (taiunRel === "相生" || taiunRel === "比和" || !taiunRel)) {
    tone = "good";
  } else if (yearRel === "相剋" || yearRel === "反剋" || taiunRel === "相剋" || taiunRel === "反剋") {
    tone = "bad";
  }

  const starInfo = starComboMeaning[yearStarName];
  if (starInfo) {
    const desc = starInfo[tone];
    if (desc) parts.push(desc);
  }

  // 位相法から具体的な出来事を追加
  const allTopo = [...(yf.taiunTopo || []).map((r) => ({ ...r, source: "大運" })), ...yf.yearTopo.map((r) => ({ ...r, source: "年運" }))];
  const goResults = allTopo.filter((r) => r.group === "合法");
  const sanResults = allTopo.filter((r) => r.group === "散法");

  if (goResults.length > 0) {
    const goNames = goResults.map((r) => r.name);
    const topoExamples = [];
    if (goNames.includes("支合")) topoExamples.push("特定の人と強い縁で結ばれる（仕事で意気投合するパートナーに出会う）");
    if (goNames.includes("三合会局")) topoExamples.push("三方から協力が集まり大きなことが成就する（複数の支援者に後押しされて独立する）");
    if (goNames.includes("大半会")) topoExamples.push("グループや組織の力で飛躍する（チーム全体が表彰され、自分も評価される）");
    if (goNames.includes("納音")) topoExamples.push("異なる要素が融合して新しい形になる（別々の趣味を組み合わせて新しい仕事を生み出す）");
    if (goNames.includes("律音")) topoExamples.push("過去と同じパターンが再び巡り、今度はうまくいく（以前失敗した企画を改良して成功させる）");
    if (goNames.includes("方三位")) topoExamples.push("専門性が認められる（特定分野の知識が求められ、コンサル依頼が来る）");
    if (topoExamples.length) {
      parts.push(simple ? `人との縁：${topoExamples.slice(0, 2).join("／")}` : `位相法の協力関係から：${topoExamples.join("／")}`);
    }
  }

  if (sanResults.length > 0) {
    const sanNames = sanResults.map((r) => r.name);
    const sanExamples = [];
    if (sanNames.includes("対冲")) sanExamples.push("予期しない変化や対立が起きる（突然の人事異動、あるいは親しい人と意見が対立する）");
    if (sanNames.includes("天剋地冲")) sanExamples.push("天と地の両方で変化が起きる大転換（仕事と家庭が同時に大きく変わる）");
    if (sanNames.includes("害法")) sanExamples.push("誤解や損失に注意（言葉の行き違いで取引先を怒らせる）");
    if (sanNames.includes("破法")) sanExamples.push("関係の亀裂や約束の破れ（契約寸前で相手が白紙にする）");
    if (sanNames.includes("自刑")) sanExamples.push("自分自身との葛藤（やりたいことが複数あって決断できない）");
    if (sanExamples.length) {
      parts.push(simple ? `注意ポイント：${sanExamples.slice(0, 2).join("／")}` : `位相法の摩擦要素から：${sanExamples.join("／")}`);
    }
  }

  // 天中殺の具体的な内容
  if (isTenchu) {
    const tenchuParts = [];
    if (yf.isTaiunTenchu && yf.isYearTenchu) {
      tenchuParts.push(simple
        ? "大運も年運も天中殺なので、特に何も始めない年。転職や結婚などの大きな決断は避け、整理と準備に徹する。"
        : "大運・年運ともに天中殺で、運気の空白期間。転職・結婚・独立などの大きな決断は避け、身辺整理と準備に徹する。過去の未整理事項（契約の見直し、人間関係の断捨離）を片付けるのに適した時期。");
    } else if (yf.isYearTenchu) {
      tenchuParts.push(simple
        ? "今年は年運が天中殺なので、新しいことを始めるには不向きな年。新しいプロジェクトの立ち上げは来年に回し、今は準備と体力作りに専念する。"
        : "年運が天中殺で、ご縁が不安定になりやすい年。新しいプロジェクトの立ち上げは来年に回し、今は準備と体力作りに専念する。既存の関係を見直し、本当に信頼できる人を再確認する時期。");
    } else if (yf.isTaiunTenchu) {
      tenchuParts.push(simple
        ? "大運が天中殺の時期なので、大きな変化は避ける年。独立や転職は時期が明けてからにし、今は基礎固めに集中する。"
        : "大運が天中殺の時期で、10年周期の運気が空白状態。独立や転職は時期が明けてからにし、今は基礎固めに集中する。この時期に蓄えた力が、天中殺明けと同時に一気に花開く。");
    }
    if (tenchuParts.length) parts.push(tenchuParts.join(""));
  }

  // 大運と年運の星の組み合わせによる相乗効果
  if (taiunStarName && taiunStarName !== yearStarName && !isTenchu) {
    const comboAdvice = {
      "貫索星|石門星": "自立心と協調性のバランスが問われる年。自分の意見を持ちつつ、人の意見も取り入れることで成果が出る。",
      "石門星|貫索星": "人脈を活かしつつ自分の軸を保つ年。周囲に流されず、自分の信念に合う人だけと深く関わるのが成功の鍵。",
      "鳳閣星|玉堂星": "楽しさと学びが両立する年。趣味から学びにつながるような展開が期待できる。",
      "玉堂星|鳳閣星": "知識を楽しく活かせる年。学んだことを発表したり教えたりすることで評価が高まる。",
      "禄存星|司禄星": "奉仕と蓄積がセットで報われる年。人に親切にしながら、自分の資産も着実に増える。",
      "司禄星|禄存星": "堅実な蓄積の上に愛情が乗る年。貯金や基盤作りをしつつ、周囲に感謝を伝えることで運が上がる。",
      "車騎星|牽牛星": "行動力が名誉につながる年。動いて成果を出すことで、周囲から評価される。",
      "牽牛星|車騎星": "責任ある立場で行動力を発揮する年。リーダーとして先頭に立つことで結果を出せる。",
      "龍高星|調舒星": "変革と感受性が組み合わさる年。環境の変化を感性で乗り越え、新しい自分を発見する。",
      "調舒星|龍高星": "感性の変化が行動変化を生む年。今まで感じなかったことに興味を持ち、新しい世界に踏み出す。"
    };
    const key1 = `${taiunStarName}|${yearStarName}`;
    const key2 = `${yearStarName}|${taiunStarName}`;
    if (comboAdvice[key1]) parts.push(comboAdvice[key1]);
    else if (comboAdvice[key2]) parts.push(comboAdvice[key2]);
  }

  return parts;
}

function buildYearlySummary(yf, simple) {
  const parts = [];

  // 大運と年運の星
  const taiunStarName = yf.taiunStar || "不明";
  const yearStarName = yf.yearStar;
  const taiunEnergyName = yf.taiunEnergy ? yf.taiunEnergy.name : "";
  const yearEnergyName = yf.yearEnergy.name;

  // 天中殺
  const tenchuStatus = [];
  if (yf.isTaiunTenchu) tenchuStatus.push("大運が天中殺");
  if (yf.isYearTenchu) tenchuStatus.push("年運が天中殺");

  // 五行関係
  const relText = {
    "相生": "順調に流れる追い風の関係",
    "比和": "同質の力が重なり、勢いが増す関係",
    "相剋": "ぶつかり合い、摩擦や変化を生む関係",
    "反剋": "予期せぬ抵抗や逆風が吹く関係"
  };

  // 星の性格傾向
  const starTendency = {
    "貫索星": "自立と信念が前面に出る時期",
    "石門星": "協調と人脈が鍵を握る時期",
    "鳳閣星": "表現と楽しさが広がる時期",
    "調舒星": "感受性と反抗心が強まる時期",
    "禄存星": "愛情と奉仕が運を呼ぶ時期",
    "司禄星": "蓄積と堅実さが報われる時期",
    "車騎星": "行動力と勝負が求められる時期",
    "牽牛星": "名誉と責任が重くのしかかる時期",
    "龍高星": "変革と冒険のチャンスが来る時期",
    "玉堂星": "学びと知恵が評価される時期"
  };

  // 従星の傾向
  const energyTendency = {
    "天貴星": "自意識が試練で磨かれ役割意識へ変わる時期（品と向上心）",
    "天南星": "内的世界の主張が前進力となり新しい世界を作る時期（不屈の改革エネルギー）",
    "天禄星": "自己保身の中庸バランスで安定を築く時期（堅実な積み重ねと未来予測）",
    "天将星": "気が極まり転換を作り出す時期（創造と破壊の波動）",
    "天堂星": "退気の自制心で一歩下がり道を譲る時期（間断の気と単独行動）",
    "天恍星": "現状打破と脱皮の時期（離郷と冒険の衝動）",
    "天印星": "目の前の現実に適応し準備する時期（無自覚な察知力）",
    "天報星": "前例のない新しい道を作る時期（変化と直観力）",
    "天胡星": "時間と場所を超越した発想で無から有を作る時期（感受性と集中力）",
    "天極星": "現実の無・気の有で環境に心を作られ持続する時期（格差なき一次元思考と回帰作用）",
    "天庫星": "異次元の世界を進み連結のない探究心で突き進む時期（中庸力と単一志向）",
    "天馳星": "霊魂が宇宙空間に帰り点的今の連続で生きる時期（外動内静と分裂・分離）"
  };
  const energyTendencySimple = {
    "天貴星": "自分の役割を見つけ、品性を磨く時期",
    "天南星": "内なる想いを行動に変え、新しい道を開く時期",
    "天禄星": "コツコツ積み重ねて安定を築く時期",
    "天将星": "大きな変化が起き、新しいものを生み出す時期",
    "天堂星": "一歩下がって周囲と協調する時期",
    "天恍星": "現状を打破し、新しい環境に飛び込む時期",
    "天印星": "目の前の現実に集中し、準備を整える時期",
    "天報星": "前例のない道を切り開く時期",
    "天胡星": "感受性が鋭くなり、集中力で成果を出す時期",
    "天極星": "環境に合わせて心を整え、持続力を高める時期",
    "天庫星": "一つのことに集中して探究する時期",
    "天馳星": "動きの中で静けさを保ち、変化を受け入れる時期"
  };

  // 総合スコア
  const avgScore = Math.round((yf.moneyScore + yf.loveScore + yf.workScore) / 3);

  const energyTendencyMap = simple ? energyTendencySimple : energyTendency;
  let overallTone = "";
  if (simple) {
    if (avgScore >= 70) overallTone = "全体的に運気が良く、積極的に動くといい時期です";
    else if (avgScore >= 55) overallTone = "だいたい順調です。油断せずコツコツ進めるのがちょうどいい時期です";
    else if (avgScore >= 40) overallTone = "良いことと悪いことが混ざる時期。メリハリをつけて動くのがコツです";
    else overallTone = "運気が低迷しやすい時期です。無理をせず、自分を労わりながら守りを固めましょう";
    const taiunTendencyText = starTendency[taiunStarName] || (taiunStarName === "不明" ? "大運の影響がまだ始まっていない、または終わった時期" : "");
    parts.push(`今は10年周期の流れとして「${taiunTendencyText}」、今年1年の流れとして「${starTendency[yearStarName] || ""}」が来ています。${overallTone}。`);
    // === 運気の相性（シンプル） ===
    const taiunRelText = yf.taiunRel ? relText[yf.taiunRel] : "大運の影響が外れた時期";
    const yearRelText = relText[yf.yearRel] || "";
    parts.push(`自分との相性は、10年周期が「${taiunRelText}」、今年は「${yearRelText}」。${yf.taiunRel === "相生" && yf.yearRel === "相生" ? "どちらも追い風で、流れに乗りやすい絶好のタイミングです。" : yf.taiunRel === "相剋" || yf.yearRel === "相剋" ? "摩擦が含まれるため、順調に見えても突然の壁や方向転換がありえます。" : yf.taiunRel === "比和" || yf.yearRel === "比和" ? "勢いは増しますが、偏りが強くなりすぎないよう注意が必要です。" : "標準的な流れで、星の性質を総合的に判断する時期です。"}`);
  } else {
    if (avgScore >= 70) overallTone = "総じて運勢が良好で、積極的に動くべき時期です";
    else if (avgScore >= 55) overallTone = "概ね順調ですが、油断せず地道に積み重ねるのが良い時期です";
    else if (avgScore >= 40) overallTone = "一長一短の時期で、メリハリをつけて立ち回る必要があります";
    else overallTone = "厳しい運勢の時期で、守りを固め、無理を避けるのが賢明です";
    const taiunTendencyText = starTendency[taiunStarName] || (taiunStarName === "不明" ? "大運の影響がまだ始まっていない、または終わった時期" : "");
    parts.push(`今は10年周期の運気として「${taiunTendencyText}」、今年1年の運気として「${starTendency[yearStarName] || ""}」が流れています。${overallTone}。`);
    // === 運気の相性 ===
    const taiunRelText = yf.taiunRel ? relText[yf.taiunRel] : "大運の影響が外れた時期";
    const yearRelText = relText[yf.yearRel] || "";
    parts.push(`自分との相性は、10年周期が「${taiunRelText}」、今年は「${yearRelText}」。${yf.taiunRel === "相生" && yf.yearRel === "相生" ? "どちらも追い風で、流れに乗りやすい絶好のタイミングです。" : yf.taiunRel === "相剋" || yf.yearRel === "相剋" ? "摩擦が含まれるため、順調に見えても突然の壁や方向転換がありえます。" : yf.taiunRel === "比和" || yf.yearRel === "比和" ? "勢いは増しますが、偏りが強くなりすぎないよう注意が必要です。" : "標準的な流れで、星の性質を総合的に判断する時期です。"}`);
  }

  // === ライフステージの傾向 ===
  const energyDesc = [];
  if (taiunEnergyName && energyTendencyMap[taiunEnergyName]) energyDesc.push(`10年周期のテーマは「${energyTendencyMap[taiunEnergyName]}」`);
  if (energyTendencyMap[yearEnergyName]) energyDesc.push(`今年のテーマは「${energyTendencyMap[yearEnergyName]}」`);
  if (energyDesc.length) parts.push(energyDesc.join("、") + "です。");

  // === 注意が必要な時期 ===
  if (tenchuStatus.length > 0) {
    if (simple) {
      parts.push(`今は注意が必要な時期です。新しいことを始めるより、整理や準備、見直しに適したタイミングです。無理に勝負すると苦しくなりやすいです。いらないものを手放すのに適した時期です。`);
    } else {
      parts.push(`現在は注意が必要な時期です。新しく何かを始めるより、整理・準備・見直しに適したタイミング。無理に勝負すると手に入れたものの維持で苦しくなりやすいです。不要なものを手放すのに適した時期です。`);
    }
  }

  // === 金運・恋愛運・仕事運の総合 ===
  const fortuneDesc = [];
  if (simple) {
    if (yf.moneyScore >= 80) fortuneDesc.push("お金の運気はかなり良く、大きな買い物や投資に踏み切っても良いタイミングです。臨時収入やボーナスにも恵まれやすい時期です");
    else if (yf.moneyScore >= 65) fortuneDesc.push("お金の運気は良く、欲しかったものを買ったり、少額から投資を始めたりするのに向いています");
    else if (yf.moneyScore >= 55) fortuneDesc.push("お金の運気はやや良めで、無駄遣いに気をつければ着実に貯蓄が増えていく時期です");
    else if (yf.moneyScore >= 45) fortuneDesc.push("お金の運気は普通です。急な出費に備えて生活費の3〜6か月分は手をつけずに残し、大きな買い物は先送りするのが無難です");
    else if (yf.moneyScore >= 30) fortuneDesc.push("お金の運気は低めです。ローンや高額な契約、人への貸し借りは避け、固定費の見直しなど節約を意識しましょう");
    else fortuneDesc.push("お金の運気はかなり低いです。大きな出費・投資・保証人になることは避け、今ある資産を守ることを最優先にしましょう");

    if (yf.loveScore >= 80) fortuneDesc.push("恋愛・人間関係の運気は絶好調で、出会いが結婚や大きな進展につながりやすい時期です");
    else if (yf.loveScore >= 65) fortuneDesc.push("恋愛や人間関係の運気は好調で、気になる人に自分から声をかけたり、飲み会や紹介の誘いに乗ると良い縁につながりやすいです");
    else if (yf.loveScore >= 55) fortuneDesc.push("恋愛・人間関係の運気はやや良く、今の関係を一歩進める（告白・同棲・プロポーズなど）のに向いた時期です");
    else if (yf.loveScore >= 45) fortuneDesc.push("恋愛や人間関係の運気は平坦です。新しい出会いを無理に探すより、今のパートナーや家族・友人に感謝を言葉で伝えると関係が長持ちします");
    else if (yf.loveScore >= 30) fortuneDesc.push("恋愛・人間関係で誤解やすれ違いが起きやすい時期です。LINEやメールだけで済ませず、直接会って話す機会を増やすと衝突を避けやすいです");
    else fortuneDesc.push("恋愛・人間関係でトラブルが起きやすい時期です。結婚や別居など大きな決断は先延ばしにし、感情的な言い合いを避けましょう");

    if (yf.workScore >= 80) fortuneDesc.push("仕事運は絶好調です。昇進や独立、新規プロジェクトの立ち上げなど大きな勝負に出るのに最適な時期です");
    else if (yf.workScore >= 65) fortuneDesc.push("仕事運は追い風です。自分から手を挙げて新しい仕事や役割に挑戦すると、実力以上の評価を得やすいでしょう");
    else if (yf.workScore >= 55) fortuneDesc.push("仕事運はやや良く、これまで積み重ねてきたことが少しずつ評価され始める時期です");
    else if (yf.workScore >= 45) fortuneDesc.push("仕事の運気は安定しています。大きな挑戦より、今の仕事を一つずつ丁寧に仕上げることが評価につながる時期です");
    else if (yf.workScore >= 30) fortuneDesc.push("仕事で足踏み感を感じやすい時期です。無理に結果を急がず、スキルアップや基礎固めに時間を使うのがおすすめです");
    else fortuneDesc.push("仕事運は厳しい時期です。転職や独立などの大きな決断は避け、今の環境で信頼関係を保つことを優先しましょう");
  } else {
    if (yf.moneyScore >= 80) fortuneDesc.push("金運はかなり良好で、大きな買い物や投資に踏み切っても良い時期です。臨時収入にも恵まれやすいでしょう");
    else if (yf.moneyScore >= 65) fortuneDesc.push("金運は良好で、欲しかったものの購入や少額投資のスタートに向いています");
    else if (yf.moneyScore >= 55) fortuneDesc.push("金運はやや良好で、無駄遣いを避ければ着実に資産が積み上がる時期です");
    else if (yf.moneyScore >= 45) fortuneDesc.push("金運は標準的です。生活費の3〜6か月分の予備資金を確保し、大きな買い物は先送りするのが無難です");
    else if (yf.moneyScore >= 30) fortuneDesc.push("金運は低調です。ローンや高額契約、貸し借りは避け、固定費の見直しを優先しましょう");
    else fortuneDesc.push("金運はかなり低調です。大きな出費・投資・保証は避け、資産保全を最優先にすべき時期です");

    if (yf.loveScore >= 80) fortuneDesc.push("恋愛・対人運は絶好調で、出会いが結婚など大きな進展につながりやすい時期です");
    else if (yf.loveScore >= 65) fortuneDesc.push("恋愛・対人運は好調で、自分から動くことで良縁を引き寄せやすい時期です");
    else if (yf.loveScore >= 55) fortuneDesc.push("恋愛・対人運はやや良好で、今の関係を一歩進めるのに向いた時期です");
    else if (yf.loveScore >= 45) fortuneDesc.push("恋愛・対人運は平坦です。新規開拓より既存の関係を大切にし、感謝を言葉にすることを意識しましょう");
    else if (yf.loveScore >= 30) fortuneDesc.push("恋愛・対人運は摩擦が起きやすく、対面での対話を増やすことで衝突を避けやすくなります");
    else fortuneDesc.push("恋愛・対人運はトラブルが起きやすく、大きな決断は先延ばしにし感情的な対立を避けるべきです");

    if (yf.workScore >= 80) fortuneDesc.push("仕事運は絶好調で、昇進・独立・新規プロジェクトなど大きな勝負に最適な時期です");
    else if (yf.workScore >= 65) fortuneDesc.push("仕事運は追い風で、新しい役割への挑戦が実力以上の評価につながりやすいでしょう");
    else if (yf.workScore >= 55) fortuneDesc.push("仕事運はやや良好で、これまでの積み重ねが評価され始める時期です");
    else if (yf.workScore >= 45) fortuneDesc.push("仕事運は安定しており、大きな挑戦より着実な仕事の積み重ねが評価につながる時期です");
    else if (yf.workScore >= 30) fortuneDesc.push("仕事運は足踏みしやすく、結果を急がずスキルアップや基礎固めに時間を使うのが得策です");
    else fortuneDesc.push("仕事運は厳しく、転職・独立などの大きな決断は避け、信頼関係の維持を優先すべき時期です");
  }
  parts.push(fortuneDesc.join("。") + "。");

  // === 人との縁の影響 ===
  if (!simple) {
    const allTopo = [...(yf.taiunTopo || []).map((r) => ({ ...r, source: "大運" })), ...yf.yearTopo.map((r) => ({ ...r, source: "年運" }))];
    const goNames = allTopo.filter((r) => r.group === "合法").map((r) => r.name);
    const sanNames = allTopo.filter((r) => r.group === "散法").map((r) => r.name);
    if (goNames.length || sanNames.length) {
      const topoParts = [];
      if (goNames.length) topoParts.push(`人との協力関係による追い風`);
      if (sanNames.length) topoParts.push(`摩擦やストレスのもとになる要素`);
      parts.push(`${topoParts.join("と")}が同時に働いています。${goNames.length > sanNames.length ? "協力関係の方が強いため、人との縁を活かせば乗り越えられます。" : sanNames.length > goNames.length ? "摩擦要素が強いため、無理をせず信頼できる人に相談するのが有効です。" : "協力と摩擦が半々なため、状況に応じて柔軟に立ち回る必要があります。"}`);
    }
  }

  // === 総合アドバイス ===
  let advice = "";
  if (simple) {
    if (avgScore >= 65 && !tenchuStatus.length) {
      advice = "この時期は積極的に動いていいタイミングです。今年の追い風に乗って、新しいことに挑戦してみましょう。";
    } else if (avgScore >= 45 && !tenchuStatus.length) {
      advice = "基本は守りながら、チャンスを見極めて動く時期です。今年の運気に合った行動をとりましょう。";
    } else if (tenchuStatus.length) {
      advice = "今は少し注意が必要な時期です。「動かないこと」が一番の戦略。整理や準備に微せて、時期が明けたらスタートダッシュに備えましょう。";
    } else {
      advice = "少し厳しい時期ですが、無理をしなければ乗り越えられます。健康と人間関係を大切にしながら、次のチャンスに備えて力を蓄えましょう。";
    }
  } else {
    if (avgScore >= 65 && !tenchuStatus.length) {
      advice = "この時期は積極的に動いて良いタイミングです。10年周期の運気の方向性を活かし、今年の追い風に乗って新しいことに挑戦しましょう。";
    } else if (avgScore >= 45 && !tenchuStatus.length) {
      advice = "基本は守りながら、チャンスを見極めて動く時期です。10年周期のテーマを意識しつつ、今年の運気に合った行動をとりましょう。";
    } else if (tenchuStatus.length) {
      advice = "注意が必要な時期は「動かないこと」が最大の戦略です。整理・準備・見直しに徹し、時期が明けた後のスタートダッシュに備えましょう。";
    } else {
      advice = "厳しい時期ですが、無理をしなければ底上げできます。健康と人間関係を最優先し、次の好機に備えて力を蓄えましょう。";
    }
  }
  parts.push(advice);

  return parts.join("\n");
}

// === 宿命天中殺（詳細判定）===
// 参考: https://sanmei-stock.com/category/basic/tenchusatsu/fate/
function getTenchusatsuRangeByIndex(idx) {
  return tenchusatsuMap[Math.floor(mod(idx, 60) / 10)];
}

function analyzeFateTenchusatsu(pillars) {
  const dayRange = getTenchusatsuRangeByIndex(pillars.day.index);
  const yearRange = getTenchusatsuRangeByIndex(pillars.year.index);
  const seinen = dayRange.includes(pillars.year.branch);
  const seigetsu = dayRange.includes(pillars.month.branch);
  const seinichi = yearRange.includes(pillars.day.branch);
  const kokan = seinen && seinichi;
  const dayZa = ["甲戌", "乙亥"].includes(pillars.day.stem + pillars.day.branch);
  const dayKyo = ["甲辰", "乙巳"].includes(pillars.day.stem + pillars.day.branch);
  const shukumei2 = seinen && seigetsu;
  const zenTenchusatsu = dayZa && seigetsu && seinen;
  return { seinen, seigetsu, seinichi, kokan, dayZa, dayKyo, shukumei2, zenTenchusatsu };
}

// === 守護神 ===
// 参考: https://sanmei-stock.com/applied/guardian-deity/whole/ , https://sanmei-stock.com/category/applied/guardian-deity/head-oarsman/
const gogyoMeaning = { 木: "福（精神の充実）", 火: "寿（健康・生命力）", 土: "禄（経済・生活基盤）", 金: "官（名誉・社会的地位）", 水: "印（知恵・学び）" };
const controllerOf = { 土: "木", 水: "土", 火: "水", 金: "火", 木: "金" };

function getGuardianElements(counts) {
  const entries = Object.entries(counts);
  const maxVal = Math.max(...entries.map(([, v]) => v));
  const minVal = Math.min(...entries.map(([, v]) => v));
  const strongest = entries.filter(([, v]) => v === maxVal).map(([k]) => k);
  const weakest = entries.filter(([, v]) => v === minVal).map(([k]) => k);
  const controllers = strongest.map((e) => controllerOf[e]);
  const guardians = Array.from(new Set([...weakest, ...controllers]));
  return { strongest, weakest, guardians, isBalanced: maxVal === minVal };
}

function getNextSolarTerm(date, forward) {
  const m = date.getMonth();
  const d = date.getDate();
  if (forward) {
    let targetMonth = m;
    if (d >= setsuiriDays[m]) targetMonth += 1;
    if (targetMonth > 11) { targetMonth = 0; }
    const targetYear = targetMonth <= m && d >= setsuiriDays[m] ? date.getFullYear() + 1 : date.getFullYear();
    const targetDate = new Date(targetYear, targetMonth, setsuiriDays[targetMonth]);
    return Math.max(1, Math.ceil((targetDate - date) / 86400000));
  } else {
    let targetMonth = m;
    if (d < setsuiriDays[m]) targetMonth -= 1;
    if (targetMonth < 0) { targetMonth = 11; }
    const targetYear = targetMonth >= m && d < setsuiriDays[m] ? date.getFullYear() - 1 : date.getFullYear();
    const targetDate = new Date(targetYear, targetMonth, setsuiriDays[targetMonth]);
    return Math.max(1, Math.ceil((date - targetDate) / 86400000));
  }
}

// === モテ度分析 ===
// 十大主星ごとの異性・同性からの魅力ポイント
const starMotePoint = {
  "貫索星": { opposite: 2, same: 18, oppDesc: "ぶれない軸と自立心が頼もしい。束縛しすぎると逆効果", sameDesc: "自立していて一人で生きられる力がある。同性からは信頼されるタイプ" },
  "石門星": { opposite: 18, same: 35, oppDesc: "人当たりが良くサラッとした社交性。八方美人に見えないよう本命には差をつけて", sameDesc: "協調性が高くグループの中心。同性から最も好かれやすいタイプ" },
  "鳳閣星": { opposite: 30, same: 3, oppDesc: "一緒にいて楽しい明るさと自然体。ムードメーカー的存在", sameDesc: "明るく楽しいが、同性からは軽く見えやすい面もある" },
  "調舒星": { opposite: 30, same: 2, oppDesc: "ミステリアスな魅力が際立つ。年を重ねるほど魅力アップ", sameDesc: "繊細で独自の世界を持ち、同性からは理解しづらい面も" },
  "禄存星": { opposite: 35, same: 8, oppDesc: "誰からも愛される魅力がある。奉仕精神とホスピタリティで人を惹きつける", sameDesc: "面倒見が良く頼れるが、同性からは「全員に優しい」と不満も" },
  "司禄星": { opposite: 2, same: 18, oppDesc: "控えめで家庭的。派手さはないが長く付き合うほど安心感", sameDesc: "堅実でマメ。同性からは信頼できる良き理解者として好かれる" },
  "車騎星": { opposite: 8, same: 30, oppDesc: "さっぱりして裏表がない。情に厚いが張り合いすぎに注意", sameDesc: "竹を割ったような性格で同性から圧倒的人気。損得抜きで動く誠実さ" },
  "牽牛星": { opposite: 3, same: 25, oppDesc: "真面目で品がある。知的な会話を好む相手に響く", sameDesc: "信用が置けて頼りになる。同性からは尊敬を集めるタイプ" },
  "龍高星": { opposite: 25, same: 3, oppDesc: "予測不能な魅力がある。知的好奇心で惹きつける", sameDesc: "自由奔放で個性的。同性からは面白いが掴みどころないと映る" },
  "玉堂星": { opposite: 10, same: 18, oppDesc: "素直で可愛げがあり愛され力高い。受け取り上手ナンバーワン", sameDesc: "面倒見が良く包容力がある。同性からも異性からも安定して好かれる" }
};

// どんな人からモテるか（星ごとのファン層）
const starFanType = {
  "貫索星": {
    oppFans: ["自立心を尊重できる人", "依存しすぎない大人の相手", "芯のある人に惹かれる人", "束縛に縛られたくない自由人"],
    sameFans: ["一人で生きられる力に憧れる人", "精神的に自立した人を尊敬する人", "頼りになるリーダーを探す人"]
  },
  "石門星": {
    oppFans: ["穏やかで安定した関係を求める人", "コミュニケーションを大切にする人", "グループ交際が好きな人", "争いを嫌う平和主義者"],
    sameFans: ["グループの輪を広げたい人", "協調性を重視する人", "社交的な人と一緒にいたい人", "組織の中心にいる人を好む人"]
  },
  "鳳閣星": {
    oppFans: ["一緒にいて楽しい時間を過ごしたい人", "明るい雰囲気が好きな人", "食事やデートを楽しみたい人", "ユーモアを重視する人"],
    sameFans: ["場を盛り上げてくれる人を探す人", "楽しい付き合いを求める人"]
  },
  "調舒星": {
    oppFans: ["ミステリアスな魅力に惹かれる人", "芸術や文化を愛する人", "深い精神性を求める人", "年上や成熟した相手", "束縛を嫌う自由な相手"],
    sameFans: ["繊細な感性を理解できる人", "クリエイティブな人と付き合いたい人"]
  },
  "禄存星": {
    oppFans: ["包容力に包まれたい人", "尽くしてくれる相手を求める人", "安心感を重視する人", "誰にでも優しい人に惹かれる人", "面倒見の良さを評価する人"],
    sameFans: ["頼れる兄貴・姉御を探す人", "面倒見の良い人と付き合いたい人", "奉仕精神を持つ人を尊敬する人"]
  },
  "司禄星": {
    oppFans: ["家庭的で安定した関係を求める人", "結婚を意識した付き合いをする人", "コツコツ積み重ねる人を好む人", "派手さより中身を重視する人"],
    sameFans: ["堅実で信頼できる人を探す人", "マメで誠実な人を好む人", "家庭的な人と友人になりたい人"]
  },
  "車騎星": {
    oppFans: ["ストレートな愛情表現に惹かれる人", "行動力のある人に憧れる人", "情に厚い人を好む人", "さっぱりした関係を求める人"],
    sameFans: ["裏表のない人を探す人", "損得抜きで付き合える人を求める人", "スポーツやアクティブな人と付き合いたい人", "正義感のある人を尊敬する人"]
  },
  "牽牛星": {
    oppFans: ["品のある大人の付き合いを求める人", "知的な会話を楽しみたい人", "真面目で誠実な人を好む人", "プライドを尊重できる人"],
    sameFans: ["信用できる人を探す人", "責任感のある人を尊敬する人", "真面目で努力家な人と付き合いたい人"]
  },
  "龍高星": {
    oppFans: ["予測不能な刺激を求める人", "自由奔放な人に惹かれる人", "旅先や非日常で出会いたい人", "常識に縛られない人"],
    sameFans: ["個性的な人と付き合いたい人", "面白い経験を求める人"]
  },
  "玉堂星": {
    oppFans: ["知的なつながりを求める人", "本や映画を語り合える人", "精神的な深さを持つ相手", "ゆっくり信頼を育みたい人", "面倒見の良さに安心する人"],
    sameFans: ["面倒見の良い人を探す人", "知的で落ち着いた人と付き合いたい人", "母性・父性を感じる人を好む人"]
  }
};

// 内面の偏りが惹きつけるタイプ
const gogyoFanType = {
  "木過剰": { opp: "自分の意見を曲げない人に惹かれる人、または逆に従順な人", same: "芯の強い人を尊敬する人、または逆に自分に無い軸を求める人" },
  "木不足": { opp: "頼りがいのある人、決断力を持つ人を求める人", same: "リーダーシップのある人に憧れる人" },
  "火過剰": { opp: "明るく表現力のある人に惹かれる人、または逆に静かな人", same: "ムードメーカーを求める人、または逆に穏やかな人を好む人" },
  "火不足": { opp: "情熱的で温かい人を求める人", same: "明るく元気な人に引っ張ってほしい人" },
  "土過剰": { opp: "包容力のある人に安心する人、または逆に刺激を求める人", same: "面倒見の良い人を探す人、または逆に刺激的な人を求める人" },
  "土不足": { opp: "家庭的で安定した人を求める人", same: "堅実で頼れる人を探す人" },
  "金過剰": { opp: "さっぱりした関係を好む人、または逆で粘着質な人", same: "ルールや正義を重んじる人を尊敬する人" },
  "金不足": { opp: "正義感のある人、または品のある人を求める人", same: "誠実で信頼できる人を探す人" },
  "水過剰": { opp: "自由で束縛のない関係を求める人、または知的な人", same: "個性的で面白い人を探す人" },
  "水不足": { opp: "知的で落ち着いた人、または面倒見の良い人を求める人", same: "知識豊富な人に引っ張ってほしい人" }
};

function analyzeMote(mainStars, energy, counts, day, pillars) {
  const allStars = [mainStars.north, mainStars.south, mainStars.east, mainStars.west, mainStars.center, mainStars.companion];

  // 基本スコア: 全主星の魅力ポイントを合計
  let oppositeScore = 0;
  let sameScore = 0;
  const oppFactors = [];
  const sameFactors = [];

  allStars.forEach((star) => {
    const p = starMotePoint[star];
    if (p) {
      oppositeScore += p.opposite;
      sameScore += p.same;
    }
  });

  // 重複する星は加点（同じ星が複数ある＝その特性が強い）
  const starCount = {};
  allStars.forEach(s => { starCount[s] = (starCount[s] || 0) + 1; });
  Object.entries(starCount).forEach(([star, cnt]) => {
    if (cnt >= 2) {
      const p = starMotePoint[star];
      if (p && cnt >= 2) {
        oppositeScore += p.opposite * (cnt - 1) * 0.5;
        sameScore += p.same * (cnt - 1) * 0.5;
        if (cnt >= 2) {
          oppFactors.push(`${star}が${cnt}個あり「${p.oppDesc}」の特性が強く出る`);
          sameFactors.push(`${star}が${cnt}個あり「${p.sameDesc}」の特性が強く出る`);
        }
      }
    }
  });

  // 五行バランス補正
  const vals = Object.values(counts);
  const maxV = Math.max(...vals);
  const minV = Math.min(...vals);
  const balance = maxV - minV;
  if (balance <= 1) {
    oppositeScore += 20;
    sameScore += 20;
    oppFactors.push("バランスが良く、誰からも受け入れられやすい");
    sameFactors.push("バランスが良く、同性からも違和感なく受け入れられる");
  } else if (balance >= 3) {
    oppositeScore -= 15;
    sameScore -= 15;
    oppFactors.push("内面の偏りが大きく、好みが分かれやすい");
    sameFactors.push("内面の偏りが大きく、同性からも受け入れにくい面がある");
  }

  // 日干の陰陽による補正
  const dayYinYang = yinYang[stems.indexOf(day.stem)];
  if (dayYinYang === "陽") {
    oppositeScore += 12;
    sameScore += 6;
    oppFactors.push("陽干で積極性があり、異性から目立ちやすい");
    sameFactors.push("陽干の明るさが同性からも好まれる");
  } else {
    oppositeScore += 6;
    sameScore += 12;
    oppFactors.push("陰干で柔らかさがあり、異性に受けが良い");
    sameFactors.push("陰干の穏やかさが同性から親しみやすい");
  }

  // 十二大従星の補正
  const energyTotal = energy.reduce((sum, e) => sum + e.score, 0);
  if (energyTotal >= 30) {
    oppositeScore += 12;
    sameScore += 12;
    oppFactors.push("十二大従星のエネルギーが強く、存在感で人を惹きつける");
    sameFactors.push("エネルギーが強く、同性からも力強さを感じて惹かれる");
  } else if (energyTotal <= 20) {
    oppositeScore += 8;
    sameScore += 5;
    oppFactors.push("エネルギーが控えめで、繊細さが異性の保護欲を刺激する");
    sameFactors.push("控えめなエネルギーが同性からも安心感を与える");
  }

  // 特殊な干支の補正
  const hasAbnormal = ["year", "month", "day"].some(key => getAbnormalZodiac(pillars[key].stem, pillars[key].branch));
  if (hasAbnormal) {
    oppositeScore += 12;
    sameScore += 8;
    oppFactors.push("特殊な干支を持つ独特なオーラが、一部の異性を強烈に惹きつける");
    sameFactors.push("特殊な干支の個性が、同性からも「面白い人」として注目される");
  }

  // 正規化: 生スコアを0-100スケールに変換
  // 実用的な範囲は約15-220（星6個×最大35 + 補正類）
  const RAW_MIN = 5;
  const RAW_MAX = 250;
  oppositeScore = Math.max(5, Math.min(100, Math.round(((oppositeScore - RAW_MIN) / (RAW_MAX - RAW_MIN)) * 100)));
  sameScore = Math.max(5, Math.min(100, Math.round(((sameScore - RAW_MIN) / (RAW_MAX - RAW_MIN)) * 100)));

  // ランク判定: S約10%, A約20%, B約40%, C+D約30%の分布を目標
  const getRank = (score) => {
    if (score >= 80) return { rank: "S", label: "圧倒的モテ期常駐型" };
    if (score >= 65) return { rank: "A", label: "自然と人が集まる型" };
    if (score >= 45) return { rank: "B", label: "好かれる素質十分" };
    if (score >= 25) return { rank: "C", label: "普通・磨けば光る" };
    return { rank: "D", label: "自分から動く必要あり" };
  };

  // 各星の魅力コメントを収集（重複排除）
  const seenStars = new Set();
  const starCharmPoints = [];
  allStars.forEach(star => {
    if (!seenStars.has(star)) {
      seenStars.add(star);
      const p = starMotePoint[star];
      if (p) starCharmPoints.push({ star, oppDesc: p.oppDesc, sameDesc: p.sameDesc });
    }
  });

  // どんな人からモテるか（ファン層分析）
  // 中央（本質）→北→南→東→西→伴星の順で優先度をつけてファンを収集
  const fanPriority = [mainStars.center, mainStars.north, mainStars.south, mainStars.east, mainStars.west, mainStars.companion];
  const oppFanSet = new Set();
  const sameFanSet = new Set();
  fanPriority.forEach(star => {
    const f = starFanType[star];
    if (f) {
      f.oppFans.forEach(t => oppFanSet.add(t));
      f.sameFans.forEach(t => sameFanSet.add(t));
    }
  });

  // 五行の偏りによるファン層
  const gogyoFans = { opp: [], same: [] };
  const sortedGogyo = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const topGogyo = sortedGogyo[0];
  const bottomGogyo = sortedGogyo[sortedGogyo.length - 1];
  if (topGogyo[1] >= 2) {
    const key = topGogyo[0] + "過剰";
    const fan = gogyoFanType[key];
    if (fan) {
      gogyoFans.opp.push(fan.opp);
      gogyoFans.same.push(fan.same);
    }
  }
  if (bottomGogyo[1] === 0) {
    const key = bottomGogyo[0] + "不足";
    const fan = gogyoFanType[key];
    if (fan) {
      gogyoFans.opp.push(fan.opp);
      gogyoFans.same.push(fan.same);
    }
  }

  // 日干の陰陽によるファン層
  if (dayYinYang === "陽") {
    oppFanSet.add("明るく積極的な人に惹かれる人");
    sameFanSet.add("元気でリーダーシップのある人を好む人");
  } else {
    oppFanSet.add("柔らかく穏やかな人に癒やされたい人");
    sameFanSet.add("落ち着いた人と付き合いたい人");
  }

  // 特殊な干支持ちのファン層
  if (hasAbnormal) {
    oppFanSet.add("型破りな人に惹かれる人");
    sameFanSet.add("個性的で面白い人を探す人");
  }

  return {
    oppositeScore,
    sameScore,
    oppositeRank: getRank(oppositeScore),
    sameRank: getRank(sameScore),
    oppFactors,
    sameFactors,
    starCharmPoints,
    dayYinYang,
    oppFans: [...oppFanSet],
    sameFans: [...sameFanSet],
    gogyoFans
  };
}

// === 九星気学（方位判定）===
// 出典: 園田真次郎が1924年に体系化した日本の方位占術
const kyuseiStarNames = ["一白水星", "二黒土星", "三碧木星", "四緑木星", "五黄土星", "六白金星", "七赤金星", "八白土星", "九紫火星"];
const kyuseiStarElements = ["水", "土", "木", "木", "土", "金", "金", "土", "火"];

// 洛書の飛星順序: 中宮→NW→W→NE→S→N→SW→E→SE
const rakushoOrder = [5, 6, 7, 8, 9, 1, 2, 3, 4];

// 方位名（洛書番号→方位名）
const kyuseiPositionNames = {
  1: "北", 2: "南西", 3: "東", 4: "南東",
  5: "中央", 6: "北西", 7: "西", 8: "北東", 9: "南"
};

// 十二支→方位ポジション（8方位に圧縮）
const branchToKyuseiPosition = {
  "子": 1, "丑": 8, "寅": 8, "卯": 3, "辰": 4, "巳": 4,
  "午": 9, "未": 2, "申": 2, "酉": 7, "戌": 6, "亥": 6
};

// 方位の反対
const oppositePosition = { 1: 9, 9: 1, 2: 8, 8: 2, 3: 7, 7: 3, 4: 6, 6: 4 };

// 本命星を計算（立春区切り、1984年=下元甲子・中宮七赤）
function getKyuseiHonmeisei(date) {
  const y = date.getFullYear();
  const lichun = new Date(y, 1, setsuiriDays[1]);
  const adjustedYear = (date >= lichun) ? y : y - 1;
  const diff = adjustedYear - 1984;
  return ((7 - diff - 1) % 9 + 9) % 9 + 1;
}

// 月命星を計算
function getKyuseiGetsumeisei(date) {
  const honmeisei = getKyuseiHonmeisei(date);
  let monthStartStar;
  if ([1, 4, 7].includes(honmeisei)) monthStartStar = 8;
  else if ([2, 5, 8].includes(honmeisei)) monthStartStar = 5;
  else monthStartStar = 2;
  const m = date.getMonth();
  const d = date.getDate();
  let solarMonth = m;
  if (d < setsuiriDays[m]) solarMonth = mod(m - 1, 12);
  return ((monthStartStar - solarMonth - 1) % 9 + 9) % 9 + 1;
}

// 飛星盤を生成（陰遁・減少順）
function generateKyuseiBoard(centerStar) {
  const board = {};
  rakushoOrder.forEach((pos, i) => {
    board[pos] = ((centerStar - i - 1) % 9 + 9) % 9 + 1;
  });
  return board;
}

// 指定年の年盤を取得
function getKyuseiYearBoard(adjustedYear) {
  const diff = adjustedYear - 1984;
  const centerStar = ((7 - diff - 1) % 9 + 9) % 9 + 1;
  return generateKyuseiBoard(centerStar);
}

// 指定月の月盤を取得
function getKyuseiMonthBoard(date) {
  const centerStar = getKyuseiGetsumeisei(date);
  return generateKyuseiBoard(centerStar);
}

// 日命星を計算（1900年1月1日=中宮一白を基準に日ごとに減少）
function getKyuseiNichimeisei(date) {
  const epoch = new Date(1900, 0, 1);
  const diffDays = Math.floor((date - epoch) / (1000 * 60 * 60 * 24));
  return ((1 - diffDays - 1) % 9 + 9) % 9 + 1;
}

// 指定日の日盤を取得
function getKyuseiDayBoard(date) {
  const centerStar = getKyuseiNichimeisei(date);
  return generateKyuseiBoard(centerStar);
}

// 方位判定メイン関数
function analyzeKyuseiDirections(birthDate, targetDate) {
  const honmeisei = getKyuseiHonmeisei(birthDate);
  const getsumeisei = getKyuseiGetsumeisei(birthDate);
  const honmeiElement = kyuseiStarElements[honmeisei - 1];

  const ty = targetDate.getFullYear();
  const lichun = new Date(ty, 1, setsuiriDays[1]);
  const adjustedYear = (targetDate >= lichun) ? ty : ty - 1;
  const yearBoard = getKyuseiYearBoard(adjustedYear);

  // 五黄の位置を探す
  let goouPosition = null;
  for (const [pos, star] of Object.entries(yearBoard)) {
    if (star === 5) goouPosition = parseInt(pos);
  }

  // 暗剣殺（五黄の位置、中央以外）
  const ankenSatsu = (goouPosition && goouPosition !== 5) ? goouPosition : null;

  // 歳破（年の十二支の反対方位）
  const yearBranchIdx = mod(adjustedYear - 1984, 12);
  const yearBranchName = branches[yearBranchIdx];
  const oppositeBranchName = branches[mod(yearBranchIdx + 6, 12)];
  const saihaiPosition = branchToKyuseiPosition[oppositeBranchName];

  // 本命殺（本命星の位置、中央以外）
  let honmeiSatsu = null;
  for (const [pos, star] of Object.entries(yearBoard)) {
    if (star === honmeisei && parseInt(pos) !== 5) honmeiSatsu = parseInt(pos);
  }
  // 本命的殺（本命殺の反対方位）
  const honmeiTekiSatsu = honmeiSatsu ? oppositePosition[honmeiSatsu] : null;

  // 月盤の凶方位
  const monthBoard = getKyuseiMonthBoard(targetDate);
  let getsumeiSatsu = null;
  for (const [pos, star] of Object.entries(monthBoard)) {
    if (star === getsumeisei && parseInt(pos) !== 5) getsumeiSatsu = parseInt(pos);
  }
  const getsumeiTekiSatsu = getsumeiSatsu ? oppositePosition[getsumeiSatsu] : null;

  // 日盤の計算
  const nichimeisei = getKyuseiNichimeisei(targetDate);
  const dayBoard = getKyuseiDayBoard(targetDate);

  // 日盤の凶方位（日命殺・日命的殺）
  let nichimeiSatsu = null;
  for (const [pos, star] of Object.entries(dayBoard)) {
    if (star === nichimeisei && parseInt(pos) !== 5) nichimeiSatsu = parseInt(pos);
  }
  const nichimeiTekiSatsu = nichimeiSatsu ? oppositePosition[nichimeiSatsu] : null;

  // 月盤の五黄の位置（暗剣殺・月破判定用）
  let monthGoouPosition = null;
  for (const [pos, star] of Object.entries(monthBoard)) {
    if (star === 5) monthGoouPosition = parseInt(pos);
  }
  const monthAnkenSatsu = (monthGoouPosition && monthGoouPosition !== 5) ? monthGoouPosition : null;

  // 月破（月の十二支の反対方位）
  const m = targetDate.getMonth();
  const d = targetDate.getDate();
  const solarMonth = (d < setsuiriDays[m]) ? mod(m - 1, 12) : m;
  const monthBranchIdx = mod(solarMonth + 2, 12); // 寅月=2→branches[2]=寅
  const monthBranchName = branches[monthBranchIdx];
  const monthOppositeBranchName = branches[mod(monthBranchIdx + 6, 12)];
  const monthSaihaiPosition = branchToKyuseiPosition[monthOppositeBranchName];

  // 日盤の五黄の位置（暗剣殺判定用）
  let dayGoouPosition = null;
  for (const [pos, star] of Object.entries(dayBoard)) {
    if (star === 5) dayGoouPosition = parseInt(pos);
  }
  const dayAnkenSatsu = (dayGoouPosition && dayGoouPosition !== 5) ? dayGoouPosition : null;

  // 年盤の凶方位のセット
  const badPositions = new Set();
  if (ankenSatsu) badPositions.add(ankenSatsu);
  badPositions.add(saihaiPosition);
  if (honmeiSatsu) badPositions.add(honmeiSatsu);
  if (honmeiTekiSatsu) badPositions.add(honmeiTekiSatsu);
  if (getsumeiSatsu) badPositions.add(getsumeiSatsu);
  if (getsumeiTekiSatsu) badPositions.add(getsumeiTekiSatsu);

  // 月盤の凶方位のセット
  const monthBadPositions = new Set();
  if (monthAnkenSatsu) monthBadPositions.add(monthAnkenSatsu);
  monthBadPositions.add(monthSaihaiPosition);
  if (honmeiSatsu) monthBadPositions.add(honmeiSatsu);
  if (honmeiTekiSatsu) monthBadPositions.add(honmeiTekiSatsu);
  if (getsumeiSatsu) monthBadPositions.add(getsumeiSatsu);
  if (getsumeiTekiSatsu) monthBadPositions.add(getsumeiTekiSatsu);

  // 日盤の凶方位のセット
  const dayBadPositions = new Set();
  if (dayAnkenSatsu) dayBadPositions.add(dayAnkenSatsu);
  if (honmeiSatsu) dayBadPositions.add(honmeiSatsu);
  if (honmeiTekiSatsu) dayBadPositions.add(honmeiTekiSatsu);
  if (nichimeiSatsu) dayBadPositions.add(nichimeiSatsu);
  if (nichimeiTekiSatsu) dayBadPositions.add(nichimeiTekiSatsu);

  // 吉方位の判定（相生・比和で凶方位以外）
  function calcGoodDirs(board, badSet) {
    const dirs = [];
    for (const [posStr, star] of Object.entries(board)) {
      const pos = parseInt(posStr);
      if (pos === 5 || badSet.has(pos)) continue;
      const starElement = kyuseiStarElements[star - 1];
      const rel = gogyoRelation[honmeiElement]?.[starElement];
      if (rel === "相生" || rel === "比和") {
        dirs.push({
          position: pos,
          direction: kyuseiPositionNames[pos],
          star: kyuseiStarNames[star - 1],
          relationship: rel
        });
      }
    }
    return dirs;
  }

  const goodDirections = calcGoodDirs(yearBoard, badPositions);
  const monthGoodDirections = calcGoodDirs(monthBoard, monthBadPositions);
  const dayGoodDirections = calcGoodDirs(dayBoard, dayBadPositions);

  // 凶方位の詳細リスト
  const badDirections = [];
  if (ankenSatsu) badDirections.push({ direction: kyuseiPositionNames[ankenSatsu], type: "暗剣殺", note: "全員に凶。最も注意が必要な方位" });
  badDirections.push({ direction: kyuseiPositionNames[saihaiPosition], type: "歳破", note: `${yearBranchName}年の反対方位。全員に凶` });
  if (honmeiSatsu) badDirections.push({ direction: kyuseiPositionNames[honmeiSatsu], type: "本命殺", note: "あなたの本命星の方位。特に凶" });
  if (honmeiTekiSatsu) badDirections.push({ direction: kyuseiPositionNames[honmeiTekiSatsu], type: "本命的殺", note: "本命殺の反対方位" });
  if (getsumeiSatsu) badDirections.push({ direction: kyuseiPositionNames[getsumeiSatsu], type: "月命殺", note: "今月の月命星の方位" });
  if (getsumeiTekiSatsu) badDirections.push({ direction: kyuseiPositionNames[getsumeiTekiSatsu], type: "月命的殺", note: "月命殺の反対方位" });

  // 月盤の凶方位リスト
  const monthBadDirections = [];
  if (monthAnkenSatsu) monthBadDirections.push({ direction: kyuseiPositionNames[monthAnkenSatsu], type: "月暗剣殺", note: "今月の暗剣殺。全員に凶" });
  monthBadDirections.push({ direction: kyuseiPositionNames[monthSaihaiPosition], type: "月破", note: `${monthBranchName}月の反対方位。全員に凶` });
  if (honmeiSatsu) monthBadDirections.push({ direction: kyuseiPositionNames[honmeiSatsu], type: "本命殺", note: "あなたの本命星の方位" });
  if (honmeiTekiSatsu) monthBadDirections.push({ direction: kyuseiPositionNames[honmeiTekiSatsu], type: "本命的殺", note: "本命殺の反対方位" });
  if (getsumeiSatsu) monthBadDirections.push({ direction: kyuseiPositionNames[getsumeiSatsu], type: "月命殺", note: "月命星の方位" });
  if (getsumeiTekiSatsu) monthBadDirections.push({ direction: kyuseiPositionNames[getsumeiTekiSatsu], type: "月命的殺", note: "月命殺の反対方位" });

  // 日盤の凶方位リスト
  const dayBadDirections = [];
  if (dayAnkenSatsu) dayBadDirections.push({ direction: kyuseiPositionNames[dayAnkenSatsu], type: "日暗剣殺", note: "本日の暗剣殺。全員に凶" });
  if (honmeiSatsu) dayBadDirections.push({ direction: kyuseiPositionNames[honmeiSatsu], type: "本命殺", note: "あなたの本命星の方位" });
  if (honmeiTekiSatsu) dayBadDirections.push({ direction: kyuseiPositionNames[honmeiTekiSatsu], type: "本命的殺", note: "本命殺の反対方位" });
  if (nichimeiSatsu) dayBadDirections.push({ direction: kyuseiPositionNames[nichimeiSatsu], type: "日命殺", note: "本日の日命星の方位" });
  if (nichimeiTekiSatsu) dayBadDirections.push({ direction: kyuseiPositionNames[nichimeiTekiSatsu], type: "日命的殺", note: "日命殺の反対方位" });

  // 月名（太陽月）
  const solarMonthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  const monthLabel = solarMonthNames[solarMonth];

  return {
    honmeisei: { number: honmeisei, name: kyuseiStarNames[honmeisei - 1], element: honmeiElement },
    getsumeisei: { number: getsumeisei, name: kyuseiStarNames[getsumeisei - 1], element: kyuseiStarElements[getsumeisei - 1] },
    nichimeisei: { number: nichimeisei, name: kyuseiStarNames[nichimeisei - 1], element: kyuseiStarElements[nichimeisei - 1] },
    yearBoard,
    monthBoard,
    dayBoard,
    adjustedYear,
    yearBranch: yearBranchName,
    monthBranch: monthBranchName,
    monthLabel,
    targetDate,
    goodDirections,
    badDirections,
    badPositions: [...badPositions],
    monthGoodDirections,
    monthBadDirections,
    monthBadPositions: [...monthBadPositions],
    dayGoodDirections,
    dayBadDirections,
    dayBadPositions: [...dayBadPositions]
  };
}

// === 病気リスク分析 ===
const gogyoHealth = {
  "木": { organs: "肝臓・神経系・目・胆嚢", excess: "肝機能過剰、自律神経失調、不眠、ストレス性疾患、怒りっぽさ", deficiency: "肝機能低下、筋力低下、判断力の衰え、慢性疲労" },
  "火": { organs: "心臓・循環器系・血液・小腸", excess: "心臓病、高血圧、動脈硬化、炎症性疾患、興奮状態", deficiency: "血行不良、体温調節機能の低下、活力減退、低血圧" },
  "土": { organs: "胃・脾臓・消化器系・口腔", excess: "消化器系の問題、肥満、生活習慣病、糖尿病、腫瘍", deficiency: "消化吸収力の低下、栄養不足、免疫力低下、胃腸虚弱" },
  "金": { organs: "肺・呼吸器系・皮膚・大腸・骨", excess: "呼吸器系の問題、喘息、皮膚疾患、過剰な防御反応", deficiency: "呼吸機能の低下、肺活量減少、皮膚の弾力性低下、アレルギー" },
  "水": { organs: "腎臓・泌尿器系・生殖器・耳・骨髄", excess: "腎臓・泌尿器系の問題、むくみ、冷え性、生殖機能の乱れ", deficiency: "腎機能低下、骨の弱化、生殖機能の低下、脱水、耳の疾患" }
};

const dayStemConstitution = {
  "甲": "疲労やストレスで頭痛が起きやすく、体調がメンタルに現れやすい。無理をせず限界前に休養を。",
  "乙": "不調が咽喉や首に現れやすい。扁桃腺炎などは甘くみず早めに対処を。",
  "丙": "胃腸が弱く、ストレスから過敏性胃腸炎になりやすい。眼の疲れから肩凝りも慢性化しやすい。",
  "丁": "狭心症など心臓の病気に注意。無理をしすぎないことが大切。定期健康診断を推奨。",
  "戊": "ストレスや疲れが胃に来るタイプ。暴飲暴食に注意。気になる症状は早めに受診。",
  "己": "腸が弱く、腸内環境の乱れから様々な病気になりやすい。体を冷やさないよう注意。",
  "庚": "酸性に偏る体質。生活習慣病や高血圧に注意。食事バランスと定期健診を。",
  "辛": "皮膚が繊細で乾燥・アレルギーに注意。喘息など呼吸器や神経の病気にも注意。",
  "壬": "血液に関する病気に注意。糖尿病、膝や腰の痛みも。下半身を冷やさない工夫を。",
  "癸": "冷え症になりやすく、膀胱炎・腎臓の病気に注意。疲れを溜め込まない工夫を。"
};

function analyzeHealthRisk(day, pillars, counts, taiun, tenchusatsu, currentAge, thisYear, mainStars) {
  const dayElement = elements[stems.indexOf(day.stem)];
  const entries = Object.entries(counts);
  const maxVal = Math.max(...entries.map(([, v]) => v));
  const minVal = Math.min(...entries.map(([, v]) => v));
  const strongest = entries.filter(([, v]) => v === maxVal).map(([k]) => k);
  const weakest = entries.filter(([, v]) => v === minVal).map(([k]) => k);

  // === 統計的知見に基づく宿命リスクプロファイル ===
  // 481名のケース・コントロール研究（ロジスティック回帰、交絡因子調整済み）より
  // ※補正後は有意でない要素も含むため、参考情報として扱う
  const statisticalRiskFactors = [];
  const statisticalProtectiveFactors = [];
  let statisticalRiskScore = 0;

  // リスク亢進因子（OR > 1）
  if (mainStars) {
    if (mainStars.west === "禄存星") {
      statisticalRiskScore += 15;
      statisticalRiskFactors.push({ star: "west_禄存星", OR: 2.27, p: 0.007, note: "全疾患リスクが約2.3倍（統計的有意）" });
    }
    if (mainStars.center === "玉堂星") {
      statisticalRiskScore += 12;
      statisticalRiskFactors.push({ star: "center_玉堂星", OR: 2.29, p: 0.011, note: "全疾患リスクが約2.3倍（統計的有意）" });
    }
    if (mainStars.north === "車騎星") {
      statisticalRiskScore += 12;
      statisticalRiskFactors.push({ star: "north_車騎星", OR: 2.18, p: 0.013, note: "全疾患リスクが約2.2倍、神経疾患でOR=8.8" });
    }
    if (mainStars.south === "玉堂星") {
      statisticalRiskScore += 12;
      statisticalRiskFactors.push({ star: "south_玉堂星", OR: 2.46, p: 0.015, note: "全疾患リスクが約2.5倍（統計的有意）" });
    }
    if (mainStars.east === "禄存星") {
      statisticalRiskFactors.push({ star: "east_禄存星", OR: 6.19, p: 0.002, note: "循環器疾患でOR=6.2（病気カテゴリ別）" });
    }
    if (mainStars.south === "調舒星") {
      statisticalRiskFactors.push({ star: "south_調舒星", OR: 6.25, p: 0.004, note: "パニック障害でOR=6.3（病気カテゴリ別）" });
    }
    if (mainStars.east === "車騎星") {
      statisticalRiskFactors.push({ star: "east_車騎星", OR: 5.21, p: 0.008, note: "パニック障害でOR=5.2（病気カテゴリ別）" });
    }

    // 保護因子（OR < 1）
    if (mainStars.west === "鳳閣星") {
      statisticalRiskScore -= 10;
      statisticalProtectiveFactors.push({ star: "west_鳳閣星", OR: 0.45, p: 0.024, note: "全疾患リスクが約半減（統計的有意・保護的）" });
    }
  }

  // 五行「土」が最強 = 全疾患リスク OR=1.48
  if (strongest.includes("土")) {
    statisticalRiskScore += 5;
    statisticalRiskFactors.push({ star: "strongest_土", OR: 1.48, p: 0.046, note: "土が最強五行で全疾患リスクが約1.5倍" });
  }

  // 宿命天中殺「申酉」= うつ・抑うつ OR=5.57
  if (tenchusatsu === "申酉") {
    statisticalRiskScore += 10;
    statisticalRiskFactors.push({ star: "tenchu_申酉", OR: 5.57, p: 0.0004, note: "うつ・抑うつ疾患でOR=5.6（最も強い関連）" });
  }

  // 病気カテゴリ別リスクプロファイル
  const diseaseSpecificRisks = [];
  if (mainStars) {
    if (mainStars.west === "禄存星") diseaseSpecificRisks.push({ disease: "うつ・抑うつ", OR: 3.94, p: 0.007 });
    if (mainStars.north === "車騎星") diseaseSpecificRisks.push({ disease: "神経疾患", OR: 8.76, p: 0.006 });
    if (mainStars.east === "禄存星") diseaseSpecificRisks.push({ disease: "循環器疾患", OR: 6.19, p: 0.002 });
    if (mainStars.south === "玉堂星") diseaseSpecificRisks.push({ disease: "循環器疾患", OR: 7.56, p: 0.004 });
    if (mainStars.south === "調舒星") diseaseSpecificRisks.push({ disease: "パニック障害", OR: 6.25, p: 0.004 });
    if (mainStars.east === "車騎星") diseaseSpecificRisks.push({ disease: "パニック障害", OR: 5.21, p: 0.008 });
    if (mainStars.west === "石門星") diseaseSpecificRisks.push({ disease: "脳血管・脳腫瘍", OR: 3.65, p: 0.013 });
    if (mainStars.center === "玉堂星") diseaseSpecificRisks.push({ disease: "脳血管・脳腫瘍", OR: 3.66, p: 0.014 });
  }
  if (tenchusatsu === "申酉") diseaseSpecificRisks.push({ disease: "うつ・抑うつ", OR: 5.57, p: 0.0004 });

  // 宿命の体質的弱点
  const natalWeakness = weakest.map(e => ({
    element: e,
    organs: gogyoHealth[e].organs,
    risk: gogyoHealth[e].deficiency
  }));
  const natalExcess = strongest.map(e => ({
    element: e,
    organs: gogyoHealth[e].organs,
    risk: gogyoHealth[e].excess
  }));

  // 五行相剋関係: 剋す五行 → 剋される五行
  const sokoku = { "木": "土", "土": "水", "水": "火", "火": "金", "金": "木" };
  // 相生: 生む五行 → 生まれる五行
  const seisei = { "木": "火", "火": "土", "土": "金", "金": "水", "水": "木" };

  // 大病リスクの具体的病名マッピング
  const majorDiseaseMap = {
    "木": { excess: "肝硬変・肝癌・自律神経失調症・緑内障", deficiency: "慢性肝炎・筋ジストロフィ・視神経萎縮" },
    "火": { excess: "心筋梗塞・脳出血・高血圧性心疾患", deficiency: "心不全・低血圧性ショック・循環不全" },
    "土": { excess: "糖尿病・胃がん・膵臓癌・肝硬化", deficiency: "栄養失調・免疫不全・慢性胃腸炎" },
    "金": { excess: "肺がん・気管支喘息・肺線維症・皮膚癌", deficiency: "肺気腫・慢性呼吸不全・アトピー性皮膚炎" },
    "水": { excess: "腎不全・尿毒症・前立腺癌・子宮筋腫", deficiency: "慢性腎炎・骨粗鬆症・不妊症・難聴" }
  };

  // 大病リスク判定: リスク要因から該当五行を特定し、具体的病名を生成
  function getMajorDiseases(factors, score) {
    const diseases = [];
    const checked = new Set();
    for (const f of factors) {
      for (const el of ["木", "火", "土", "金", "水"]) {
        if (f.includes(el) && !checked.has(el)) {
          checked.add(el);
          const isExcess = f.includes("過剰") || f.includes("強ま");
          const isDeficiency = f.includes("不足") || f.includes("低下") || f.includes("剋さ");
          if (isExcess) diseases.push({ element: el, type: "過剰", diseases: majorDiseaseMap[el].excess });
          if (isDeficiency) diseases.push({ element: el, type: "不足", diseases: majorDiseaseMap[el].deficiency });
        }
      }
    }
    // 天中殺・対冲・60年周期の追加リスク
    if (factors.some(f => f.includes("60年周期"))) diseases.push({ element: "全身", type: "転換点", diseases: "生死に関わる重大な健康危機・突然の発症" });
    if (factors.some(f => f.includes("天中殺")) && diseases.length === 0) diseases.push({ element: "全身", type: "抵抗力低下", diseases: "既存疾患の悪化・感染症への抵抗力低下" });
    return diseases;
  }

  // 各年の健康リスクを計算（全生涯：大運の最後まで）
  const lastTaiunAge = taiun.periods.length > 0 ? taiun.periods[taiun.periods.length - 1].ageTo : currentAge + 50;
  const endYear = thisYear + (lastTaiunAge - currentAge);
  const yearRisks = [];
  for (let y = thisYear - 1; y <= endYear; y++) {
    const yp = getYearPillarForYear(y);
    const yearEl = elements[stems.indexOf(yp.stem)];
    const yearBranchEl = branchElements[yp.branch];
    const isTenchu = isTenchusatsuYear(yp.branch, tenchusatsu);
    const age = y - (thisYear - currentAge);

    let riskScore = 0;
    const riskFactors = [];

    // 1. 命式で過剰な五行が年運でさらに強まる
    if (strongest.includes(yearEl)) {
      riskScore += 20;
      riskFactors.push(`${yearEl}（過剰な性質）が年運でさらに強まり、${gogyoHealth[yearEl].organs}に負担がかかる`);
    }
    if (strongest.includes(yearBranchEl)) {
      riskScore += 12;
      riskFactors.push(`${yearBranchEl}（過剰な性質・地支）が年運の地支で強まり、${gogyoHealth[yearBranchEl].organs}に負担`);
    }

    // 2. 命式で不足な五行が年運で剋される
    if (weakest.includes(yearEl)) {
      // その五行を剋する五行が年運にあるか
      for (const [atk, def] of Object.entries(sokoku)) {
        if (def === yearEl && strongest.includes(atk)) {
          riskScore += 15;
          riskFactors.push(`${yearEl}（不足な性質）が命式の過剰な${atk}に剋され、${gogyoHealth[yearEl].organs}の機能低下リスク`);
        }
      }
    }

    // 3. 不足五行が年運でさらに弱る（剋される五行が年運に来る）
    const attacksWeakest = weakest.some(w => sokoku[yearEl] === w);
    if (attacksWeakest) {
      riskScore += 18;
      const target = sokoku[yearEl];
      riskFactors.push(`年運の${yearEl}が命式の不足な性質${target}を剋し、${gogyoHealth[target].organs}の疾患リスク`);
    }

    // 4. 天中殺年
    if (isTenchu) {
      riskScore += 15;
      riskFactors.push(`${tenchusatsu}天中殺年。心身ともに不安定になりやすく、既存の不調が悪化しやすい`);
    }

    // 5. 対冲（日支との衝突）
    const chongBranch = getChongBranch(day.branch);
    if (yp.branch === chongBranch) {
      riskScore += 12;
      riskFactors.push(`日支${day.branch}と対冲（${yp.branch}）。体調を崩しやすい衝突の年`);
    }
    // 年支・月支との対冲も確認
    const yearChong = getChongBranch(pillars.year.branch);
    const monthChong = getChongBranch(pillars.month.branch);
    if (yp.branch === yearChong) {
      riskScore += 8;
      riskFactors.push(`年支${pillars.year.branch}と対冲。家系・基盤に関わる健康負担`);
    }
    if (yp.branch === monthChong) {
      riskScore += 8;
      riskFactors.push(`月支${pillars.month.branch}と対冲。仕事・日常のストレスが健康に影響`);
    }

    // 6. 大運の五行との関係
    const currentTaiun = taiun.periods.find(p => age >= p.age && age <= p.ageTo);
    if (currentTaiun) {
      const taiunEl = elements[stems.indexOf(currentTaiun.stem)];
      const taiunBranchEl = branchElements[currentTaiun.branch];
      if (strongest.includes(taiunEl) || strongest.includes(taiunBranchEl)) {
        riskScore += 10;
        riskFactors.push(`大運${currentTaiun.stem}${currentTaiun.branch}が命式の過剰な性質をさらに強め、慢性的な負担が継続`);
      }
      if (weakest.some(w => sokoku[taiunEl] === w)) {
        riskScore += 10;
        riskFactors.push(`大運の${taiunEl}が命式の不足な性質を剋し、基礎体力の低下`);
      }
      // 大運天中殺の判定（簡易: 異常干支の連続等は省略し、天中殺範囲との照合）
      const taiunTenchu = isTenchusatsuYear(currentTaiun.branch, tenchusatsu);
      if (taiunTenchu) {
        riskScore += 8;
        riskFactors.push(`大運${currentTaiun.stem}${currentTaiun.branch}が天中殺範囲にあり、10年間の健康基盤が脆弱`);
      }
    }

    // 7. 日干と同じ干支の年（60年に一度の要注意年）
    if (yp.stem === day.stem && yp.branch === day.branch) {
      riskScore += 25;
      riskFactors.push(`日干支と同じ${yp.stem}${yp.branch}が年運に巡る（60年周期の要注意年）。生死に関わる重大な転換点`);
    }

    // 統計的知見に基づく宿命リスクの加算（各年に共通する基礎リスク）
    if (statisticalRiskScore > 0) {
      riskScore += Math.round(statisticalRiskScore * 0.3); // 宿命リスクは30%のみ各年に反映
      if (statisticalRiskFactors.length > 0) {
        const topStat = statisticalRiskFactors.slice(0, 2);
        for (const sf of topStat) {
          riskFactors.push(`【統計的知見】${sf.star}: ${sf.note} (OR=${sf.OR}, p=${sf.p})`);
        }
      }
    }

    riskScore = Math.min(100, riskScore);
    const level = riskScore >= 50 ? "高危険" : riskScore >= 15 ? "軽度注意" : "通常";

    if (riskScore >= 15 && age >= 30 && age <= 90) {
      yearRisks.push({
        year: y,
        age,
        pillar: `${yp.stem}${yp.branch}`,
        riskScore,
        level,
        factors: riskFactors,
        isTenchu,
        majorDiseases: riskScore >= 40 ? getMajorDiseases(riskFactors, riskScore) : []
      });
    }
  }

  // 宿命の体質診断
  const constitution = dayStemConstitution[day.stem];

  return {
    dayElement,
    natalWeakness,
    natalExcess,
    constitution,
    yearRisks: yearRisks.sort((a, b) => b.riskScore - a.riskScore),
    majorDiseaseRisks: yearRisks.filter(r => r.majorDiseases.length > 0 && r.level === "高危険").sort((a, b) => b.riskScore - a.riskScore),
    statisticalProfile: {
      riskFactors: statisticalRiskFactors,
      protectiveFactors: statisticalProtectiveFactors,
      diseaseSpecificRisks: diseaseSpecificRisks,
      baseRiskScore: statisticalRiskScore,
      studyNote: "481名のケース・コントロール研究（ロジスティック回帰、性別・出生年代調整済み）に基づく。AUC=0.66（中程度の判別力）。補正後は個別要素が有意でないため参考情報として扱う。"
    }
  };
}

function getTaiun(date, monthPillar, yearStemIndex, gender) {
  const isYangYear = yearStemIndex % 2 === 0;
  const isMale = gender === "male";
  const forward = (isMale && isYangYear) || (!isMale && !isYangYear);
  const daysToTerm = getNextSolarTerm(date, forward);
  const startAge = Math.round(daysToTerm / 3);
  const monthStemIdx = stems.indexOf(monthPillar.stem);
  const monthBranchIdx = branches.indexOf(monthPillar.branch);
  const periods = [];
  for (let i = 1; i <= 12; i++) {
    const offset = forward ? i : -i;
    const stemIdx = mod(monthStemIdx + offset, 10);
    const branchIdx = mod(monthBranchIdx + offset, 12);
    const age = startAge + (i - 1) * 10;
    periods.push({
      age,
      ageTo: age + 9,
      stem: stems[stemIdx],
      branch: branches[branchIdx]
    });
  }
  return { startAge, forward, periods };
}

const nenunComments = {
  貫索星: ["自分の軸を試される年。孤立しやすいが、それが正しい場合もある。", "周囲と合わないなら無理に合わせるな。ただし独善に注意。"],
  石門星: ["人間関係が動く年。新しい繋がりが生まれるが、質を見極めろ。", "八方美人で終わると何も残らない。誰と深く付き合うか選べ。"],
  鳳閣星: ["楽しみや表現が広がる年。油断すると遊びで終わる。", "余裕があるからこそ怠惰になりやすい。創造に転化しろ。"],
  調舒星: ["感性が研ぎ澄まされる年。孤独感が増すが、作品や成果に昇華できる。", "傷つきやすい時期。被害者意識に浸ると周囲が離れる。"],
  禄存星: ["人望や金運が動く年。与えすぎて消耗しないよう注意。", "見返りを期待する奉仕は取引。純粋に出せないなら引け。"],
  司禄星: ["堅実に蓄える年。地味だが着実に積める時期。", "安定に甘えると停滞。守りながらも小さな挑戦を入れろ。"],
  車騎星: ["行動力が高まる年。攻めの一年だが暴走すると大怪我。", "短気が出やすい。一呼吸おいてから動け。"],
  牽牛星: ["責任や立場が重くなる年。名誉と引き換えにプレッシャー増。", "体面を気にしすぎると本音が死ぬ。格好つけるな。"],
  龍高星: ["変化と改革の年。新しい世界に飛び込める。ただし壊すだけなら無責任。", "刺激を求めて散財・転職を繰り返すと信用が消える。"],
  玉堂星: ["学びと知識が広がる年。資格取得や研究に向く。", "頭でっかちになりやすい。実践なき学問は趣味。"]
};

function getYearPillarForYear(y) {
  return pillarFromIndex(y - 1984);
}

function isTenchusatsuYear(yearBranch, tenchusatsu) {
  return tenchusatsu.includes(yearBranch);
}

// === 開運アクション・ラッキーアドバイス ===
const gogyoLuckyData = {
  "木": { color: "グリーン・青系", direction: "東", season: "春", time: "早朝（5時〜7時）", food: "野菜・豆類・酸味", action: "自然に触れる・植物を育てる・読書・学び直し" },
  "火": { color: "レッド・オレンジ系", direction: "南", season: "夏", time: "昼（11時〜13時）", food: "果物・辛味・赤身肉", action: "人と交流する・表現活動・運動・陽の光を浴びる" },
  "土": { color: "イエロー・ベージュ系", direction: "中央・南西", season: "土用（季節の変わり目）", time: "昼過ぎ（13時〜15時）", food: "穀物・いも類・甘味", action: "整理整頓・記録をつける・家族と過ごす・基盤を固める" },
  "金": { color: "ホワイト・シルバー・ゴールド系", direction: "西", season: "秋", time: "夕方（15時〜17時）", food: "白い食材・辛味・豆類", action: "身だしなみを整える・ルールを見直す・断捨離・決断する" },
  "水": { color: "ブラック・ネイビー・ブルー系", direction: "北", season: "冬", time: "夜（21時〜23時）", food: "黒い食材・塩味・海藻類", action: "静かに内省する・計画を立てる・湯船にゆっくり浸かる・情報を集める" }
};

function buildLuckyAdvice(counts, guardian, balanceType) {
  const weakest = Object.entries(counts).sort((a, b) => a[1] - b[1])[0][0];
  const strongest = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  const weakData = gogyoLuckyData[weakest];
  const strongData = gogyoLuckyData[strongest];
  const guardianData = guardian.guardians.map(g => gogyoLuckyData[g]);

  return {
    weakest,
    strongest,
    weakData,
    strongData,
    guardianData,
    guardians: guardian.guardians,
    advice: `不足している「${weakest}」の性質を補うことが開運の鍵です。ラッキーカラーは${weakData.color}、開運方角は${weakData.direction}、得意な時間帯は${weakData.time}です。食事では${weakData.food}を意識的に取り入れましょう。日常では${weakData.action}を取り入れると運気が安定します。守護神（${guardian.guardians.join("・")}）の性質も意識すると、さらに効果的です。`
  };
}

// === 適職の具体化 ===
const starSpecificJobs = {
  "貫索星": { jobs: ["研究員", "エンジニア", "職人", "フリーランスコンサルタント", "専門技術職"], workStyle: "独立向き・自分のペースを保てる環境がベスト", strengths: "専門性を深めることで評価される" },
  "石門星": { jobs: ["営業マネージャー", "人事担当", "政治家の秘書", "コミュニティマネージャー", "広報"], workStyle: "組織向き・人と人を繋ぐポジションで活きる", strengths: "人脈構築力と調整力が最大の武器" },
  "鳳閣星": { jobs: ["クリエイティブディレクター", "企画プランナー", "イベントプロデューサー", "タレント・インフルエンサー", "ブランド戦略"], workStyle: "自由度の高い環境向き・クリエイティブな裁量があると伸びる", strengths: "表現力と場を盛り上げる力で差別化" },
  "調舒星": { jobs: ["デザイナー", "アーティスト", "写真家", "専門技術コンサルタント", "心理カウンセラー"], workStyle: "一人で深掘りできる時間が必要・感覚を活かす仕事向き", strengths: "独自の感性と審美眼が収入に直結" },
  "禄存星": { jobs: ["教師", "看護師", "カウンセラー", "接客・サービス業", "福祉・介護コンサルタント"], workStyle: "組織向き・人を支えるポジションで信頼を蓄積", strengths: "奉仕精神と気配りでファンを作る力" },
  "司禄星": { jobs: ["経理担当", "公務員", "管理部門", "不動産管理", "品質管理"], workStyle: "組織向き・コツコツ積み上げる安定型がベスト", strengths: "正確さと継続力で欠かせない存在に" },
  "車騎星": { jobs: ["新規事業開発", "営業・開拓職", "起業家", "外回り営業", "スポーツ関連"], workStyle: "独立向き・スピード感を活かせる環境が最適", strengths: "行動力と決断の速さで先行者利益を取る" },
  "牽牛星": { jobs: ["経営者", "管理職", "名誉職・顧問", "コンサルタント", "官僚"], workStyle: "組織のトップ向き・責任ある立場で本領発揮", strengths: "品格と教養で信頼を集め、上のポジションへ" },
  "龍高星": { jobs: ["ベンチャー起業家", "企画開発", "発明家", "戦略コンサルタント", "投資家"], workStyle: "独立向き・常識に縛られない環境で才能が爆発", strengths: "型破りな発想と自由な視点で新しい市場を作る" },
  "玉堂星": { jobs: ["研究者", "コンサルタント", "大学教授", "教育コンサルタント", "ライター・評論家"], workStyle: "組織・独立どちらも可・知的好奇心を満たせる環境が鍵", strengths: "知識の深さと教える力で権威になる" }
};

function buildSpecificJobs(centerStar, workEx) {
  const data = starSpecificJobs[centerStar];
  if (!data) return null;
  return {
    jobs: data.jobs,
    workStyle: data.workStyle,
    strengths: data.strengths,
    score: workEx.score,
    rank: workEx.rank,
    jobTendency: workEx.jobTendency
  };
}

// === 子育て・育児アドバイス ===
const starParentingAdvice = {
  "貫索星": { strength: "自立心を教えるのが上手。子供に「自分で考えさせる」姿勢が身につく。", caution: "厳しすぎると子供が心を閉ざす。たまには甘えさせて安心感を。", tip: "子供の意見を否定せず、まず聞いてからアドバイスする習慣を。" },
  "石門星": { strength: "人との関わり方を自然に教えられる。社交性が子供にも引き継がれる。", caution: "外ばかり気にして家庭内が疎かになりやすい。家での対話時間を意識して。", tip: "家族だけの時間を週に1回は確保し、家族の絆を深めて。" },
  "鳳閣星": { strength: "楽しい家庭を作るのが得意。子供が伸び伸び育つ環境を作れる。", caution: "ルーズさが子供の生活リズムを崩す。基本のけじめは親が示して。", tip: "楽しさとメリハリのバランスを意識。遊び時間と学習時間の切り替えを明確に。" },
  "調舒星": { strength: "子供の感性を尊重できる。個性を伸ばす感覚的な親になれる。", caution: "感情の波が子供に伝染する。親のメンタル安定が子供の安心感に直結。", tip: "子供の感情に寄り添いすぎず、少し引いた視点で見守る練習を。" },
  "禄存星": { strength: "奉仕精神で子供を大切に育てる。感謝の心を自然に教えられる。", caution: "過保護になりやすい。子供の自立を妨げないよう手出しを控える勇気を。", tip: "「やってあげる」より「一緒にやる」を意識。子供の自己肯定感を育てて。" },
  "司禄星": { strength: "堅実さで安定した家庭を作る。規律正しい生活習慣が子供に身につく。", caution: "堅苦しさが子供の自由な発想を縛る。たまにはルールを緩めて。", tip: "基本の生活リズムを守りつつ、週末は少しゆるく過ごすメリハリを。" },
  "車騎星": { strength: "行動力で子供に「やってみる勇気」を教えられる。", caution: "スピードが早すぎて子供がついていけない。子供のペースに合わせる忍耐を。", tip: "子供が失敗してもすぐ介入せず、自分でやり切る経験をさせよう。" },
  "牽牛星": { strength: "品格と礼儀を教えられる。社会性の高い子供に育ちやすい。", caution: "期待が高すぎると子供がプレッシャーを感じる。完璧を求めすぎないで。", tip: "子供の個性を尊重し、親の理想を押し付けないバランスを大切に。" },
  "龍高星": { strength: "自由な発想を尊重できる。子供の個性を最大限に伸ばす親になれる。", caution: "自由すぎて子供が不安になることも。最低限のルールは設定して。", tip: "「自由と責任はセット」と教え、選択の結果を自分で受け止めさせる。" },
  "玉堂星": { strength: "知的好奇心を共有できる。学ぶ楽しさを子供に伝えられる。", caution: "理屈っぽすぎると子供が反発する。感情でも繋がる時間を作って。", tip: "一緒に本を読んだり博物館に行くなど、知的好奇心を共有する時間を。" }
};

function buildParentingAdvice(centerStar) {
  return starParentingAdvice[centerStar] || null;
}

// === トラブル予防ガイド ===
const starTroublePattern = {
  "貫索星": "自分の考えに固執して人と衝突しやすい。意地を張って関係を壊すリスク。",
  "石門星": "誰にでも良い顔をして信頼を失う。八方美人が裏目に出るリスク。",
  "鳳閣星": "危機感が薄くて大事な時期に準備不足になる。怠慢が致命傷になるリスク。",
  "調舒星": "感情の波で周囲を振り回す。感覚的判断で現実を見落とすリスク。",
  "禄存星": "尽くしすぎて自分をすり減らす。依存される関係に巻き込まれるリスク。",
  "司禄星": "堅実さが行き過ぎてチャンスを逃す。変化への抵抗が孤立を招くリスク。",
  "車騎星": "スピード重視で周囲を置き去りにする。決断が早すぎて失敗するリスク。",
  "牽牛星": "プライドが高すぎて人を遠ざける。面子にこだわって実質を損するリスク。",
  "龍高星": "自由を求めて約束を破る。突発的な行動で周囲を混乱させるリスク。",
  "玉堂星": "理屈で人を傷つける。知的な優越感が人間関係を壊すリスク。"
};

function buildTroublePrevention(centerStar, tenchusatsu, turningPoints) {
  const pattern = starTroublePattern[centerStar] || "";
  const tenchuPeriods = tenchusatsu || "";

  const turningPointRisks = (turningPoints || []).map(tp => {
    return `${tp.age}歳前後（${tp.type}）：${tp.description || ""}`;
  });

  return {
    pattern,
    tenchuPeriods,
    turningPointRisks,
    advice: `通常時でも「${pattern}」という傾向があります。特に${tenchuPeriods}の期間中は、この傾向が強まりやすいため、大きな決断や人間関係の変更は避け、整理・準備に徹してください。${turningPointRisks.length > 0 ? "また、以下の時期は特に注意が必要です：\n" + turningPointRisks.join("\n") : ""}`
  };
}

// === 人生のターニングポイント算出 ===
function analyzeTurningPoints(day, pillars, mainStars, taiun, tenchusatsu, birthYear, currentAge) {
  const points = [];
  const dayEl = elements[stems.indexOf(day.stem)];
  const goodStars = ["禄存星", "司禄星", "石門星", "玉堂星", "牽牛星", "貫索星"];
  const badStars = ["調舒星", "龍高星", "車騎星"];
  const yangStars = [mainStars.center, mainStars.north, mainStars.south, mainStars.east, mainStars.west];

  // 位相法の専門用語を分かりやすく変換
  const topoExplain = (results) => {
    return results.map((r) => {
      const labelMap = { "年支": "実家・先祖", "月支": "親・仕事環境", "日支": "配偶者・自分自身", "宿命全体": "人生全体" };
      const area = labelMap[r.label] || r.label;
      if (r.name === "支合") return `「${area}」と協力関係になり、物事が順調に進みやすい`;
      if (r.name === "対冲") return `「${area}」と正面衝突し、予期しない変化やトラブルが起きやすい`;
      if (r.name === "害法") return `「${area}」との間でストレスが蓄積し、体調不良や人間関係の裏切りに遭いやすい`;
      if (r.name === "破法") return `「${area}」との関係で決断が揺れやすく、重要な判断は人と相談すべき`;
      if (r.name.includes("刑")) return `「${area}」との間で摩擦や葛藤が生じやすく、身内とぶつかりやすい`;
      if (r.name.includes("三合会局")) return `三つの地支が協力して強力なエネルギーを生み、異業種や海外との縁で大成するチャンス`;
      if (r.name.includes("方三位")) return `同じ分野に集中しやすく、専門知識や技術で高い評価を得るチャンス`;
      if (r.name.includes("律音")) return `同じ干支が重なる分岐点。道が2つに別れやすい重要な岐道`;
      if (r.name.includes("大半会")) return `天干が同じで地支が半会し、広がりのある展開を迎える飛躍の年`;
      if (r.name.includes("納音")) return `物事が一つにまとまる性質が強まり、用心深く行動すると流れを良い方向に変えられる`;
      if (r.name.includes("天剋地冲")) return `人生の曲がり角となる大きな変化が起きやすい年`;
      return r.note || r.name;
    });
  };

  // === 大運レベルの判定 ===
  taiun.periods.forEach((p, idx) => {
    const star = getMainStar(day.stem, p.stem);
    const isTenchu = isTenchusatsuYear(p.branch, tenchusatsu);
    const prevP = idx > 0 ? taiun.periods[idx - 1] : null;
    const prevStar = prevP ? getMainStar(day.stem, prevP.stem) : null;
    const prevTenchu = prevP ? isTenchusatsuYear(prevP.branch, tenchusatsu) : false;
    const yearStart = birthYear + p.age;
    const topoResults = analyzeBranchTopology(p.branch, pillars, p.stem);
    const topoGo = topoResults.filter((r) => r.group === "合法");
    const topoSan = topoResults.filter((r) => r.group === "散法");
    const starInYang = yangStars.includes(star);

    // 1. 大運の切り替わり（星が変わった時）
    if (prevStar && prevStar !== star) {
      const events = [];
      if (goodStars.includes(star)) {
        if (star === "禄存星" || star === "司禄星") events.push("家庭運・パートナーシップ運が上昇。結婚・出産・マイホーム購入のタイミング。長年付き合っていた人との結婚が決まる、待望の子どもに恵まれる、住宅購入のチャンスが訪れる");
        if (star === "石門星") events.push("人脈運が急拡大。新しいコミュニティや組織での活躍が期待できる。新しい職場で重要プロジェクトの中心メンバーに抜擢される、業界団体でリーダー役を任される");
        if (star === "玉堂星") events.push("学習運・資格運が好調。専門性を深めることで評価が高まる。難関資格を取得して収入アップにつながる、大学院や留学で専門性を高める");
        if (star === "牽牛星") events.push("社会的責任・名誉運が上昇。地位が上がり名誉ある立場を任される。管理職に昇進する、業界賞や社内表彰を受ける");
        if (star === "貫索星") events.push("独立・自立運が旺盛。自分の道を切り開く決断の時期。独立してフリーランスや起業する、新規事業の責任者になる");
      }
      if (badStars.includes(star)) {
        if (star === "調舒星") events.push("感受性が鋭くなり芸術や精神面で深まる一方、人間関係で孤立しやすい。創作活動に没頭するが周囲と意見が合わず疎外感を感じる、職場で自分の意見が通らずストレスが溜まる");
        if (star === "龍高星") events.push("現状を壊して新しい道を切り開く変革期。思い切って転職や独立を決意する、住み慣れた街を離れて新しい土地に引っ越す");
        if (star === "車騎星") events.push("行動力と競争心が高まるが、摩擦や衝突に注意。営業成績でトップを争うなど競争が激化する、職場で意見対立が起きやすい");
      }
      if (events.length > 0) {
        let score = 50;
        if (starInYang) score += 15;
        if (topoGo.length > 0) { score += 10; topoExplain(topoGo).forEach((t) => events.push(t)); }
        if (topoSan.length > 0) { score += 8; topoExplain(topoSan).forEach((t) => events.push(t)); }
        if (isTenchu) score += 10;
        points.push({ age: p.age, year: yearStart, type: "大運切り替わり", star, events, isTenchu, score });
      }
    }

    // 2. 天中殺の開始・終了（大運レベル）
    if (isTenchu && !prevTenchu) {
      const events = [
        "ご縁が不安定になりやすく、大きな決断や新規スタートは避けるべき時期の始まり。結婚・離婚・起業・転職などの重要な決断はこの時期を避けるのが無難",
        "これまでの成果を見直し、整理・準備に使うことで次の飛躍の土台を作る時期。スキルアップの勉強に集中する、人脈の整理と健康管理に時間を使う"
      ];
      let score = 60;
      if (topoSan.length > 0) { score += 12; topoExplain(topoSan).forEach((t) => events.push(t)); }
      if (starInYang) score += 8;
      points.push({ age: p.age, year: yearStart, type: "天中殺開始", star, events, isTenchu: true, score });
    }
    if (!isTenchu && prevTenchu) {
      const events = [
        "天中殺が明け、新しいご縁やチャンスが動き出す時期。突然良いオファーが舞い込む、新しい人脈から仕事の話が進む、恋人やパートナーとのご縁ができやすい",
        "準備してきたことが一気に花開きやすい時期。天中殺中に勉強していた資格が役に立って仕事が決まる、温めていた企画が承認される"
      ];
      let score = 55;
      if (topoGo.length > 0) { score += 12; topoExplain(topoGo).forEach((t) => events.push(t)); }
      points.push({ age: p.age, year: yearStart, type: "天中殺終了", star, events, isTenchu: false, score });
    }
  });

  // === 年運レベルの判定（ピンポイント） ===
  for (let age = 20; age <= 60; age++) {
    const year = birthYear + age;
    const yp = getYearPillarForYear(year);
    const yearStar = getMainStar(day.stem, yp.stem);
    const yearEl = elements[stems.indexOf(yp.stem)];
    const yearRel = gogyoRelation[dayEl][yearEl];
    const isYearTenchu = isTenchusatsuYear(yp.branch, tenchusatsu);

    // その年の大運を取得
    const currentTaiunP = taiun.periods.find((p) => age >= p.age && age <= p.ageTo);
    const taiunStar = currentTaiunP ? getMainStar(day.stem, currentTaiunP.stem) : null;

    // 年運の位相法
    const yearTopo = analyzeBranchTopology(yp.branch, pillars, yp.stem);
    const yearTopoGo = yearTopo.filter((r) => r.group === "合法");
    const yearTopoSan = yearTopo.filter((r) => r.group === "散法");

    // 特殊な位相法（律音・大半会・納音・天剋地冲・三合会局完成）を検出
    const specialTopo = yearTopo.filter((r) =>
      r.name.includes("律音") || r.name.includes("大半会") || r.name.includes("納音") ||
      r.name.includes("天剋地冲") || r.name.includes("三合会局") || r.name.includes("方三位")
    );

    // 3. 特殊な位相法が成立する年（ピンポイント）
    if (specialTopo.length > 0) {
      const events = [];
      let score = 45;
      specialTopo.forEach((r) => {
        const labelMap = { "年支": "実家・先祖", "月支": "親・仕事環境", "日支": "配偶者・自分自身", "宿命全体": "人生全体" };
        const area = labelMap[r.label] || r.label;
        if (r.name.includes("律音")) {
          events.push(`「${area}」と同じ干支が重なる分岐点（${r.name}）。道が2つに別れる重要な岐道。仕事の方向転換を迫られる、人生の大きな選択を迫られる`);
          score += 20;
        }
        if (r.name.includes("大半会")) {
          events.push(`「${area}」と大半会する飛躍の年。天干が同じで地支が半会し、広がりのある展開が期待できる。事業規模が拡大する、異業種交流で大きなチャンスを掴む`);
          score += 18;
        }
        if (r.name.includes("納音")) {
          events.push(`「${area}」と納音する年。物事が一つにまとまる性質が強まる。用心深く行動すると流れを良い方向に変えられる。それまでの経験を一つに統合して新しいステージに進む`);
          score += 15;
        }
        if (r.name.includes("天剋地冲")) {
          events.push(`「${area}」と天剋地冲する年。人生の曲がり角となる大きな変化が起きやすい。職場環境が総入れ替えになる、信じてきた常識が覆る、身の回りの断捨離を迫られる`);
          score += 22;
        }
        if (r.name.includes("三合会局")) {
          events.push(`三つの地支が協力して強力なエネルギーを生む年（${r.name}）。異業種や海外との縁で大成するチャンス。海外事業を立ち上げる、異分野のコラボで大成功する`);
          score += 20;
        }
        if (r.name.includes("方三位")) {
          events.push(`同じ季節の地支が揃い一つの分野に集中する年（${r.name}）。専門知識や技術で高い評価を得るチャンス。専門性が認められて業界の権威になる、研究が成果として認められる`);
          score += 16;
        }
      });
      if (isYearTenchu) { score += 10; events.push("この年は天中殺でもあるため、変化がより劇的になりやすい。無理を避け、状況を見極めてから行動するのが安全"); }
      if (events.length > 0) {
        points.push({ age, year, type: specialTopo[0].name.includes("天剋地冲") ? "天剋地冲" : specialTopo[0].name.includes("律音") ? "律音" : specialTopo[0].name.includes("大半会") ? "大半会" : specialTopo[0].name.includes("納音") ? "納音" : specialTopo[0].name.includes("三合会局") ? "三合会局" : "方三位", star: yearStar, events, isTenchu: isYearTenchu, score });
      }
    }

    // 4. 天中殺の開始・終了（年運レベル：天中殺範囲の境界年）
    const prevYp = getYearPillarForYear(year - 1);
    const prevYearTenchu = isTenchusatsuYear(prevYp.branch, tenchusatsu);
    if (isYearTenchu && !prevYearTenchu && !points.some(pt => pt.age === age && pt.type === "天中殺開始")) {
      const events = [
        `${year}年（${age}歳）から天中殺に入る。ご縁が不安定になりやすく、大きな決断は避けるべき時期の始まり。結婚・離婚・起業・転職などの重要な決断はこの年を避ける`,
        "この年から約5年間は整理・準備に使うことで次の飛躍の土台を作る時期。スキルアップの勉強に集中する、健康管理や人脈の整理に時間を使う"
      ];
      let score = 55;
      if (yearTopoSan.length > 0) { score += 10; topoExplain(yearTopoSan).forEach((t) => events.push(t)); }
      points.push({ age, year, type: "天中殺開始", star: yearStar, events, isTenchu: true, score });
    }
    if (!isYearTenchu && prevYearTenchu && !points.some(pt => pt.age === age && pt.type === "天中殺終了")) {
      const events = [
        `${year}年（${age}歳）で天中殺が明ける。新しいご縁やチャンスが動き出す時期。突然良いオファーが舞い込む、新しい人脈から仕事の話が進む、恋人とのご縁ができやすい`,
        "準備してきたことが一気に花開きやすい時期。天中殺中に勉強していた資格が役に立って仕事が決まる、温めていた企画が承認される"
      ];
      let score = 50;
      if (yearTopoGo.length > 0) { score += 10; topoExplain(yearTopoGo).forEach((t) => events.push(t)); }
      points.push({ age, year, type: "天中殺終了", star: yearStar, events, isTenchu: false, score });
    }

    // 5. 日干支と同じ年（60年周期の大転換点）
    if (yp.stem === day.stem && yp.branch === day.branch) {
      const events = [
        `${year}年（${age}歳）は日干支と同じ干支が巡る60年周期の大転換点。人生の大きな区切りとなる年。これまでの人生を総括し、次のステージの方向性が決まる`,
        "生死に関わるような重大な転換点になりやすく、健康面でも要注意。大病を機に生活習慣を変える、人生観が大きく変わる出来事が起きる"
      ];
      let score = 65;
      if (yearTopoGo.length > 0) { score += 8; topoExplain(yearTopoGo).forEach((t) => events.push(t)); }
      if (yearTopoSan.length > 0) { score += 8; topoExplain(yearTopoSan).forEach((t) => events.push(t)); }
      points.push({ age, year, type: "60年周期の大転換", star: yearStar, events, isTenchu: isYearTenchu, score });
    }

    // 6. 年運星が陽占の主星と一致＋位相法の強力な関係
    const starInYang = yangStars.includes(yearStar);
    if (starInYang && (yearTopoGo.length >= 2 || yearTopoSan.length >= 2)) {
      const events = [];
      let score = 42;
      if (yearTopoGo.length >= 2) {
        events.push(`この年は「${yearStar}」があなたの命式の星と一致し、複数の協力関係が同時に成立する強運の年。複数の人からの支援が同時に届き、大きなプロジェクトが実現する`);
        score += 15;
        topoExplain(yearTopoGo).forEach((t) => events.push(t));
      }
      if (yearTopoSan.length >= 2) {
        events.push(`この年は「${yearStar}」があなたの命式の星と一致するが、複数の摩擦要素も同時に出る変化の年。チャンスと壁が同時に訪れ、乗り越えれば大きく成長する`);
        score += 12;
        topoExplain(yearTopoSan).forEach((t) => events.push(t));
      }
      if (events.length > 0) {
        points.push({ age, year, type: yearTopoGo.length >= 2 ? "運気の好転" : "運気の転換", star: yearStar, events, isTenchu: isYearTenchu, score });
      }
    }
  }

  // 重複する年をマージ（同じ年齢のポイントを統合）
  const merged = {};
  points.forEach((p) => {
    if (!merged[p.age]) {
      merged[p.age] = p;
    } else {
      // よりスコアの高い方をベースにしつつ、イベントを統合
      const existing = merged[p.age];
      if (p.score > existing.score) {
        merged[p.age] = { ...p, events: [...new Set([...existing.events, ...p.events])] };
      } else {
        existing.events = [...new Set([...existing.events, ...p.events])];
        existing.score = Math.max(existing.score, p.score);
      }
    }
  });

  const mergedPoints = Object.values(merged);
  // 20歳〜60歳の範囲に絞る
  const filtered = mergedPoints.filter((p) => p.age >= 20 && p.age <= 60);
  // スコア順にソートして上位3件のみ残す
  filtered.sort((a, b) => b.score - a.score);
  const top = filtered.slice(0, 3);
  // 年齢順に並び直す
  top.sort((a, b) => a.age - b.age);
  return top;
}

// === 年代別運勢分析 ===
// 十二大従星のライフステージ別解釈
const energyLifeInterpretation = {
  "天報星": {
    childhood: "好奇心旺盛で色々なことに興味を持ち、器用にこなせる子ども。勉強もスポーツもそこそこできるが、一つに絞れず部活を転々とする。親の期待通りには進みにくく、自分なりの道を探す。20代までは定職が決まりにくく、転職やバイト変更が多い。飲食店→アパレル→IT系と職種が変わる。早めに一つに絞って粘り強く取り組めば、30代以降の飛躍の土台になる。",
    middleAge: "人生が大きく変わる出来事が起きやすい時期。30代で脱サラして独立する、40代で全く別の業界に転職する。現状維持ができず、新しい分野に挑戦し続ける。短期決戦を繰り返しながら上昇するが、一気に仕事を受けて燃え尽き、数ヶ月休んでまた動き出すパターン。30歳前後に決めたことを続けていれば安定する。恋愛では刺激を求めるため、マンネリになると浮気や別れの危機。付き合って3年で刺激がなくなり別れる。",
    lateLife: "年齢を重ねても若々しく活動的な晩年。60代で新しい趣味を始め、70代で海外移住を検討する。引っ越しを繰り返したり、新しいことを始めたりと落ち着きがない反面、型破りな経験が若者からの憧れの的になる。孫に「おじいちゃん（おばあちゃん）面白い」と言われる。ただし家族を巻き込む変化を求めると摩擦が起きる。勝手に引っ越しを決めて家族と揉める。"
  },
  "天印星": {
    childhood: "無邪気で人なつっこく、いるだけで場を明るくする愛されキャラ。クラスの人気者で、先生にも同級生にも好かれる。あわてんぼうで小さなミスは多いが、憎めないので許される。忘れ物をしても「またか」と笑って済まされる。ただし甘えすぎると自立できなくなる。20代になっても親に頼りきりで生活費を送ってもらう。早めに「自分でやる習慣」をつけないと中年期以降に愛想を尽かされる。",
    middleAge: "大人になっても甘さが残る時期。うっかりミスで書類を間違えるが、笑って許される。不思議と人の引き立てに恵まれ、自分から先陣を切るより既存の環境を受け入れて引き継ぐ方が成功する。先代の事業をそのまま受け継んで安定経営する。人間関係に恵まれ、職場でもプライベートでも笑いの多い生活。浮き沈みが少なく苦労が少ない反面、怠けぐせが出やすい。仕事が順調だと油断してスキルアップを怠る。",
    lateLife: "若者や子どもに好かれ、囲まれる穏やかな晩年。地域のボランティアで子どもたちと触れ合い、笑顔で慕われる。安定的な運勢なので、蓄えをたっぷり持っておけば心配の少ない人生に。定年後も趣味のサークルで人気者として楽しく過ごす。これまで人に好かれて生きてきた経験が、若者の道標になる。"
  },
  "天貴星": {
    childhood: "自分の考えに自信があり、良いと思ったことは忠実に守る子ども。勉強方法にこだわりがあり、親が別の方法を勧めても自分のやり方を貫く。大人の言うことには一つ一つ疑問を抱き、納得するまで聞かないため反抗的と思われることも。「なぜそうするの？」と毎回質問して親を困らせる。自意識が高く周囲の目を気にするので、基本は大人しく目立たないようにする。純粋ゆえに騙されやすい。友達に裏切られて初めて人を疑うことを学ぶ。",
    middleAge: "真面目にやるべきことを全うし、学び続ける安定した中年期。会社で確実に業務をこなし、資格を取って昇進する。責任感があり高い地位につくことも。ただプライドが高く「泥臭く頼む」ことができない。取引先に頭を下げるのが苦手で受注を逃す。受け身でチャンスを掴みに行けない弱点あり。恋愛では自分から積極的に行けない。好きな人がいても確信がないと動けず、結局相手に先を越される。金銭感覚がルーズなので信頼できる人に管理を任せるのが安全。家計は配偶者に任せる。",
    lateLife: "活力に溢れた晩年。定年後も現役で働き、若者に教える立場で活躍する。気持ちは若いが体力が追いつかずもどかしさを感じる。孫と走って競争したが息切りして悔しがる。若者から年寄り扱いされると傷つく。「おじいちゃん（おばあちゃん）無理しないで」と言われて不機嫌になる。得た知識を活かして尊敬されるには、心は若くても大人な態度を示すことが大切。後進を導く円熟した時期で、多くの人に慕われる。"
  },
  "天恍星": {
    childhood: "自立心が強く、成人までに親元を離れることで運が開く。高校で寮生活、大学で一人暮らしを始める。実家に留まるとチャンスが来ない。実家で暮らし続けると就職先が決まらない。恋に恋する理想家で、人に期待しすぎて裏切られるとショックが大きい。付き合った相手に理想を押し付け、期待と違うと激しく落ち込む。引っ越しや転校が多く、常識に縛られない自由な発想が才能。学校の課題で誰も思いつかないアプローチを提案して褒められる。",
    middleAge: "自由で開放的な中年期。型にはまることを嫌い、気の向くままに動く。安定した会社員生活を捨てて海外で仕事を始める、突然フリーランスに転身する。簡単に手の届くことには興味を示さず、冒険的な道を選ぶ。人生への満足度は高いが、恋愛面ではトラブルがつきもの。モテるため浮気や不倫の問題が起きやすい。離郷やキャリアチェンジを繰り返しながら本質を表に出していく。30代で別の業界、40代でまた別の業界と変化を続ける。",
    lateLife: "年齢を重ねてもフレッシュさとときめきを忘れない晩年。60代で新しい恋に落ちる、70代で初めて海外旅行に行く。華々しい雰囲気を放ち、若者の気持ちが分かる良き理解者として好かれる。若者から「おじいちゃん（おばあちゃん）みたいになりたい」と言われる。恋愛面でも好かれる存在で恋人にも恵まれやすい。これまでの冒険が豊かな経験談となり、常識に縛られない生き方を後進に伝える。"
  },
  "天南星": {
    childhood: "大人のような意見を持ち、正義感の強い子ども。5歳で「それは不公平だ」と主張する。批判力があり、些細なことにも理由を求める。「なぜこれをやるの？」と毎回納得理由を聞く。白黒はっきりさせたがり、人も好きか嫌いかで分ける。言葉を選ばずはっきり言うので人を傷つけることも。友達の作品に「これ下手だね」と正直に言って泣かせる。反抗心が強く無理強いが嫌い。親が無理に習い事を勧めると頑として拒否する。この強さを活かせば飛躍につながる。",
    middleAge: "反骨精神と経験値が上手く働き、エネルギッシュな中年期。活動的でリーダーシップがあり、新プロジェクトの立役者になる。社内で誰もやりたがらない新規事業を自分から手を挙げて成功させる。猪突猛進で目標に突き進むが、一度挫折すると立ち直るまで時間がかかる。失敗して自信を失い、半年間引きこもる。言葉がストレートで計画が甘いところを過去の経験で補えるかが重要。恋愛では好きなら一直線にアプローチする追うタイプ。一目惚れで毎日LINEを送りまくる。",
    lateLife: "肉体も精神も老いずに活動的な晩年。70代でマラソンに参加し、若者より速いタイムを出す。知識が増え視野が広がり、社会のことにも積極的に意見する。地域の町会で改革案を提案して賛否を呼ぶ。説教くさくなると若者から疎まれるので、行動で示す方が良い。口で説教するより自分がボランティア活動をして見せる。頑固さは円熟味に変わり、若い世代の道を開く存在に。"
  },
  "天禄星": {
    childhood: "大抵のことには動じず、どっしりと構えた大人びた子ども。友達が騒いでいても一人で本を読んでいる。きゃぴきゃぴとはしゃぐことはないが、観察力が鋭く大人と同じ視点を持つ。親の悩みに「まあ焦っても仕方ないよ」と諭す。経験の積み重ねで良さが出る星なので、幼少期に色々な経験を積むと後で大きく花開く。子ども時代に色々な習い事をした経験が、大人になってから幅広い知識として役立つ。口下手なので話術を身につけると社会に出てから苦労が減る。",
    middleAge: "安心安全な方法を模索し、リスクを取らない安定した中年期。転職せず同じ会社で着実に昇進する。温厚な人柄と鋭い観察眼で周囲の信頼が厚い。自分から新しいことに挑戦するタイプではないので、サポート役で冷静に状況を見極めるポジションを保つと良い。営業ではなく管理部門で長年活躍する。一芸に秀でる人が多く、スペシャリストとして頭角を表す。会計の専門家として社内で欠かせない存在になる。恋愛では慎重派で、友達付き合いから長い時間をかけて恋に発展する。何度も食事に行って半年後にやっと付き合う。金運は波が少なく、地道に貯蓄で財を大きくする。",
    lateLife: "中年期の過ごし方をそのまま継続する晩年。実りの多い晩年にするには、中年期に一生味わいたい生活水準に上げておくことが大切。定年前に住宅ローンを完済し、老後は趣味を楽しむ。気持ちは働き盛りのままなので活動的に過ごせる。定年後も顧問として週2日出勤する。人生経験豊富で話すことに説得力があり、的確な相談役として若者から慕われる。後輩から「先生に相談すると道が見えます」と言われる。堅実に築いた基盤が支える安定した晩年。"
  },
  "天将星": {
    childhood: "有り余る最強のエネルギーを抱え、消化しきれず体を壊しがちな子ども。小さい頃から熱が出やすく、何度も入院する。親が元気でエネルギッシュな性格か、子どもがスポーツなどでエネルギーを消費すればバランスが取れる。激しいスポーツを始めたら病気がぴたりと治まった。緩い環境より努力を強いられる環境で丈夫さが出る。厳しい塾に入れたら逆に元気になった。自我と頑固さがどの星より強い。自分の意見が絶対で、親が反対しても絶対に譲らない。",
    middleAge: "強いエネルギーで大きな成果を手にする満足度の高い中年期。ただし若い頃に苦労した人に限る。20代で苦労して起業した経験が、40代で事業を大きく拡大する基盤になる。甘やかされて育った人はエネルギーの発散方法が分からず傲慢になる。何でも思い通りにできたため、40代で初めて挫折した時に周囲が誰も助けてくれない。重い荷を背負っても平気な心の広さと余裕を持つと良い。部下の失敗を自分の責任として被り、かえって信頼を集める。創始者の星としてゼロから作り上げることで大成する大器晩成型。",
    lateLife: "若者より精力的に活動するパワフルな晩年。70代で新しい事業を立ち上げる、80代まで現役で働く。強い生命力があり長生きする傾向。長い老後をどう過ごすか筋道を立てておくと良い。定年後の10年間で何を成し遂げるか目標を立てる。趣味や仕事など生きがいを見つけられれば充実した人生に。地域のNPOを立ち上げて代表を務める。波乱の人生を総括し、自我を手放すことで真の円熟に至る。精神性の深化が晩年のテーマ。"
  },
  "天堂星": {
    childhood: "とても落ち着いていて自制心の強い、不思議なほど真面目な子ども。幼稚園で他の子が騒いでいる中、一人で静かに遊ぶ。人前に立つのが苦手で、気持ちを表現するのも苦手。授業で指されても小声でしか答えられない。若いうちから大人びた慈悲の心を持ち、同年代から頼りにされる。クラスで喧嘩が起きると「落ち着いて」と仲裁する。人との交流は多くないが、自分の世界を作り着実に能力を磨く。一人で絵を描いたり本を読んだりすることが好き。",
    middleAge: "確かな実力を持って補佐役として活躍する中年期。人の前に出ると臆するので補佐役が適任。社長ではなく副社長や右腕として実力を発揮する。トップに立つと波乱が多いので堅実な道を選ぶのが賢明。独立の誘いを断り、会社のNo.2として安定した実績を積む。勤勉で実力はあるので、ひっそりと高みを目指すことも可能。表舞台に出ず、裏で社内システムを構築して会社に欠かせない存在になる。一歩引いた視点から全体を見渡し、後進に道を譲る。ただし諦めすぎないよう注意。昇進のチャンスを「自分には無理」と辞退して後悔する。",
    lateLife: "人生経験から深みのある言動ができる穏やかな晩年。孫からの相談に「まあ焦るな、ゆっくり考えな」と優しくアドバイスする。控えめで若者を立てるため幅広い世代に好かれる。若手社員から「先生の言葉はいつも腑に落ちます」と慕われる。言葉に深みがあるので人生相談の聞き役として重宝される。地域の相談窓口で静かに話を聞き、的確なアドバイスをする。交流の幅を広げておくとより楽しい老後に。"
  },
  "天胡星": {
    childhood: "感受性が鋭く、大人びた雰囲気のある子ども。特に音に敏感で音楽が重要な位置を占める。初めて聴いた曲のメロディをすぐに覚えて完璧に歌える。空想家で、一人でいても自分の世界を楽しめる。部屋で一人で空想の物語を作り、何時間も遊ぶ。宇宙や不思議なことに興味を示す。図鑑の宇宙のページばかり読み返す。その世界に没頭するため友達付き合いは多くない。休み時間も一人で絵を描いている。空想と現実の区別がつかなくなることも。夢の内容を実際にあったことと思い込む。",
    middleAge: "地に足の着いた生活に疑問を抱きやすい時期。堅実な会社員生活に「これでいいのか？」と悩み始める。夢見がちで、現実的な生き方をしていると全く違う価値観が芽生える。40代で突然音楽を始め、プロを目指し始める。もともと音楽や芸術の仕事に就いていれば才能が活かされる。デザイナーとして独自の世界観で評価される。根を詰める働き方とは相性が良くない。毎日残業続きだと体調を崩す。集中力が凄まじく、精神が肉体を追い込むほど成果が出る。徹夜で作品を作り続け、傑作を生み出す。しかし希望を失うと落ち込んでしまう。作品が評価されないと数ヶ月引きこもる。",
    lateLife: "子どものような感性を忘れない好奇心旺盛な晩年。70代で若者の流行りのTikTokを始める、新しい楽器を覚える。健康さえ守れれば趣味に旅行、仕事と退屈のない生活。毎月違う場所に旅行して写真を撮る。若い人たちから助けてもらえる運を持つ。若い近所の人が親切にしてくれて助かる。年齢を気にしてできる範囲を決めつける必要はない。80代で初めて絵画教室に通い始める。精神の世界に深く沈み込み、美へのあこがれを追求する。希望を持ち続けることで精神的な豊かさを得る。"
  },
  "天極星": {
    childhood: "素直で従順な可愛がられる子ども。親の言うことを素直に聞き、幼稚園で先生に褒められる。人の好き嫌いがなく敵を作らない。クラスで誰とでも仲良く遊ぶ。誘われるがままに遊び、多数決に従う。友達が行くと言えば自分も行く、みんなが赤なら自分も赤にする。親との運勢がかみ合わない。親が昇進して忙しい時に限って子どもが病気になる、親が失業している時は子どもが健康で助けになる。病気やケガが長引きやすいので無茶は禁物。風邪をこじらせて2週間寝込む。",
    middleAge: "現実を堅実に生きることに重荷を感じやすい時期。住宅ローンと家族のために働く生活に「これでいいのか」と疑問を持つ。夢を思い描くことが増え、家族や社会に縛られることに疑問を抱く。家族に内緒で趣味に没頭する時間を作る。自由を手に入れるために思い切った行動に出ることも。40代で仕事をセミリタイアして田舎に移住する。これまで現実に根付いて生きてきた人ほどこの傾向が強い。20代から30代まで必死に働いた人が40代でスローライフに転向する。",
    lateLife: "頑固さがなく、あっさりとして素直な充実した晩年。孫の好きなアイドルを一緒に応援する。可愛げがあるので子どもや孫から好かれ構ってもらえる。孫がよく遊びに来て、一緒にゲームをする。悠々自適で怒りも少なく、悟ったような視点で物事を見る。「まあなんとかなるさ」と何でも受け入れる。無理に一人で頑張る必要はなく、流れに任せていれば幸せ。介護も「お世話になるのが当然」と素直に受け入れる。自由な思考転回が円熟となり、どのような環境でも適応する柔軟さが深まる。"
  },
  "天庫星": {
    childhood: "一つのことにとことんのめり込む集中力のある子ども。恐竜に興味を持つと図鑑を何冊も読み、学名をすべて暗記する。真面目で努力家なので、極めたい分野ができたらその道に進むと良い。歴史が好きで遺跡を調べ尽くし、将来は考古学者を目指す。先祖との縁は深いが親との縁は薄い。お盆やお墓参りを欠かさないが、親とは性格が合わない。祖先を大事にすると助けを得られる。自分で決めた道なら誰が反対しても譲らない頑固さがある。親に「もっと稼げる仕事につけ」と言われても自分の道を貫く。",
    middleAge: "奉仕的な生き方が開運につながる時期。家族の縁が深まり、面倒を見ることが多くなる。親の介護を引き受け、家族のまとめ役になる。家庭内での役割を全うすると運気が安定する。家事も育児も積極的にやり、家族から感謝される。責任を放棄して自己中心的に生きると運気が下がる。家庭をないがしろにして趣味に没頭すると、家族との関係が壊れる。仕事も家庭も自分以外のことに注力する時期だが、仕切ることを楽しんで感謝を忘れなければ穏やかに過ごせる。PTAや町会の役員を引き受けて、文句を言わずやり遂げる。",
    lateLife: "これまでの知識や努力が役に立つ晩年。長年研究した分野で有識者として知られ、テレビや雑誌から取材を受ける。自分の好きなことに熱中していられるので満足感が高い。毎日図書館に通って研究を続ける。ただ頑固さが災いすることもある。「自分のやり方が正しい」と譲らず、若者と衝突する。一筋の探究心が結実する時期で、自分で決めた道を貫いた成果が現れる。30年間続けた研究が認められて賞を受賞する。頑固さが円熟した信念に変わる。"
  },
  "天馳星": {
    childhood: "勉強も友達付き合いも恋愛も忙しく、バラエティに富んだ子ども時代。部活も習い事も恋愛も同時にやって毎日忙しい。あちこちに関心があり一か所に留まっていられない。趣味が月替わりで、今月は料理、来月は写真と変わる。発想が豊かで面白い子としてムードメーカーになる。クラスで「今日は何する？」と提案していつも盛り上げる。親との運勢はかみ合わない。親が仕事でうまくいっている時に限って子どもが問題を起こす。病弱になりやすいので無茶は禁物。無理をして風邪をこじらせて長引く。成功にも失敗にもこだわらない。テストで悪い点を取ってもすぐ忘れて次の日に遊びに行く。",
    middleAge: "波乱や停滞感を感じやすい中年期。働き盛りなのに一番エネルギーの低い運気が巡るため、思い通りにいかないことが多い。昇進試験に落ちる、取引先との契約が破談になる。家庭内不和や仕事の不調が続く可能性あり。配偶者と意見が合わず別居を考える。流れに抗わず健康を維持することが大切。無理をして過労にならず、散歩や軽い運動で体力を保つ。短気を起こさないのが重要。思い通りにいかないからといって上司に噛みついて評価をさらに下げるのはNG。運気は必ず上がるので辛抱。40代後半から徐々に調子が上がり、50代で飛躍する。",
    lateLife: "せわしく動き回る晩年。体を動かすことが心の平穏につながる。毎日朝の散歩を欠かさない、趣味の園芸で毎日庭仕事をする。お金や名誉には無欲なので、社会的な活動より趣味に活動の幅が広がる。複数の趣味を同時に楽しみ、毎日忙しい。体の衰えを感じると少し穏やかになる。70代まではハイキング、80代からは近所の散歩に変える。単独行動をしがちなので自分のペースが過ぎると孤独に。自分のペースでばかり動いて家族から「付き合いが悪い」と言われる。家族や友人を大事にすれば穏やかで自由な晩年に。"
  },
};

function analyzeLifeStageFortune(day, pillars, taiun, tenchusatsu, currentAge) {
  const dayEl = elements[stems.indexOf(day.stem)];

  const goodStars = ["貫索星", "石門星", "禄存星", "司禄星", "牽牛星", "玉堂星"];
  const badStars = ["調舒星", "龍高星", "車騎星"];
  const goodEnergy = ["天貴星", "天南星", "天禄星", "天将星", "天堂星"];
  const badEnergy = ["天報星", "天胡星", "天極星", "天馳星"];

  const stages = [
    { key: "childhood", label: "幼少期（0〜30歳）", ageFrom: 0, ageTo: 30, desc: "家庭環境・親との関係・学業・友情・自己確立・初恋・独立の時期", descSimple: "家庭環境や親との関係が性格の土台を作り、学業や友情を通じて自分らしさを見つけ、初恋や独立を経験する時期です。" },
    { key: "middleAge", label: "中年期（31〜60歳）", ageFrom: 31, ageTo: 60, desc: "仕事・恋愛・結婚・家庭・社会的地位・子育て・事業の時期", descSimple: "仕事で実力をつけ、家庭を築き、社会的な地位を確立し、子育てに奮闘する時期です。" },
    { key: "lateLife", label: "晩年期（61歳〜）", ageFrom: 61, ageTo: 120, desc: "引退・健康・子孫・人生の総括・後進の育成の時期", descSimple: "仕事から離れて健康に気をつかいながら、家族や孫との時間を大切にし、人生を振り返る時期です。" }
  ];

  const stageResults = stages.map((stage) => {
    const stageTaiun = taiun.periods.filter((p) => p.age >= stage.ageFrom && p.age <= stage.ageTo + 9);
    const isCurrent = currentAge >= stage.ageFrom && currentAge <= stage.ageTo;

    let totalScore = 50;
    const factors = [];
    const taiunDetails = [];

    stageTaiun.forEach((p) => {
      const star = getMainStar(day.stem, p.stem);
      const eStar = getEnergyStar(day.stem, p.branch);
      const taiunEl = elements[stems.indexOf(p.stem)];
      const rel = gogyoRelation[dayEl][taiunEl];
      const isTenchu = isTenchusatsuYear(p.branch, tenchusatsu);
      const topoResults = analyzeBranchTopology(p.branch, pillars, p.stem);

      let periodScore = 50;
      const periodFactors = [];

      if (goodStars.includes(star)) { periodScore += 10; periodFactors.push(`${star}（吉星）+10`); }
      if (badStars.includes(star)) { periodScore -= 8; periodFactors.push(`${star}（凶星）-8`); }
      if (rel === "相生") { periodScore += 8; periodFactors.push(`相性関係+8`); }
      else if (rel === "比和") { periodScore += 3; periodFactors.push(`同質関係+3`); }
      else if (rel === "相剋") { periodScore -= 8; periodFactors.push(`ぶつかり関係-8`); }
      else if (rel === "反剋") { periodScore -= 5; periodFactors.push(`逆風関係-5`); }
      if (goodEnergy.includes(eStar.name)) { periodScore += 5; periodFactors.push(`${eStar.name}+5`); }
      if (badEnergy.includes(eStar.name)) { periodScore -= 5; periodFactors.push(`${eStar.name}-5`); }
      if (isTenchu) { periodScore -= 10; periodFactors.push("天中殺-10"); }
      const topoGo = topoResults.filter((r) => r.group === "合法").length;
      const topoSan = topoResults.filter((r) => r.group === "散法").length;
      if (topoGo > 0) { periodScore += topoGo * 4; periodFactors.push(`位相法合法+${topoGo * 4}`); }
      if (topoSan > 0) { periodScore -= topoSan * 4; periodFactors.push(`位相法散法-${topoSan * 4}`); }

      periodScore = Math.max(10, Math.min(95, periodScore));
      totalScore += (periodScore - 50) * 0.3;

      taiunDetails.push({
        age: `${p.age}〜${p.ageTo}歳`,
        stem: p.stem,
        branch: p.branch,
        star,
        energy: eStar.name,
        rel,
        isTenchu,
        score: periodScore,
        factors: periodFactors,
        topo: topoResults
      });
    });

    totalScore = Math.max(10, Math.min(95, Math.round(totalScore / Math.max(1, stageTaiun.length) + 50)));

    // 総評テキスト
    let summary = "";
    let summarySimple = "";
    if (totalScore >= 70) {
      summary = "この時期は全体的に運気が安定しており、順調に成長・発展できる時期です。大運の星が良く、相性関係も恵まれています。";
      summarySimple = "この時期は全体的に運気が安定していて、順調に成長できる時期です。";
    } else if (totalScore >= 55) {
      summary = "この時期は概ね順調ですが、一部波や課題があります。大運の星や相性関係を確認し、注意が必要な年に備えましょう。";
      summarySimple = "この時期はだいたい順調ですが、少し波や課題があります。注意が必要な年に備えましょう。";
    } else if (totalScore >= 40) {
      summary = "この時期は波があり、努力が試される時期です。天中殺や凶星の影響を受けやすい年代なので、焦らず着実に進むことが重要です。";
      summarySimple = "この時期は波があり、努力が試される時期です。焦らず着実に進むことが大切です。";
    } else {
      summary = "この時期は運気が低迷しやすい時期です。天中殺や凶星が重なっている可能性が高く、大きな変化や決断は避け、守りを固めるのが無難です。";
      summarySimple = "この時期は運気が低迷しやすい時期です。大きな変化や決断は避け、守りを固めるのが無難です。";
    }

    // 辛口アドバイス
    let advice = "";
    let adviceSimple = "";
    const hasTenchu = stageTaiun.some((p) => isTenchusatsuYear(p.branch, tenchusatsu));
    const hasBadStar = taiunDetails.some((d) => badStars.includes(d.star));
    const hasGoodStar = taiunDetails.some((d) => goodStars.includes(d.star));

    if (hasTenchu && hasBadStar) {
      advice = "天中殺と凶星が重なる時期。無理をすれば痛い目に遭う。守勢に徹し、耐えることに意味がある。『頑張ればなんとかなる』は通用しない。";
      adviceSimple = "運気が下がりやすい時期が重なっています。無理をすると痛い目に遭うかもしれません。守りに徹し、耐えることに意味があります。『頑張ればなんとかなる』は通用しません。";
    } else if (hasTenchu) {
      advice = "天中殺の時期を含む。ご縁が不安定になりやすく、大きな決断やスタートは避けるべき。『じっとしていればいい』ではなく、準備と整理に使うべき時期。";
      adviceSimple = "ご縁が不安定になりやすい時期を含んでいます。大きな決断や新しいスタートは避けた方がよいでしょう。ただじっとしているのではなく、準備や整理に使うべき時期です。";
    } else if (hasBadStar && !hasGoodStar) {
      advice = "凶星が続く時期。自己主張が強すぎると摩擦を生む。周囲に合わせることより、自分の基礎を磨くことに集中すべき。";
      adviceSimple = "運気が下がりやすい時期が続きます。自己主張が強すぎると摩擦を生むので、周囲に合わせるより自分の基礎を磨くことに集中しましょう。";
    } else if (hasGoodStar && !hasBadStar) {
      advice = "吉星が続く恵まれた時期。ただし『運がいい』ことに甘えて手抜きをすると、良い時期が終わった時に何も残らない。勢いがあるうちに備えるべき。";
      adviceSimple = "運気が良い時期が続きます。ただし『運がいい』ことに甘えて手抜きをすると、良い時期が終わった時に何も残りません。勢いがあるうちに備えましょう。";
    } else {
      advice = "吉凶入り混じる時期。良い年は攻め、悪い年は守る。メリハリをつけて動くことが鍵。『ずっと良い』も『ずっと悪い』もない。";
      adviceSimple = "良い時期と悪い時期が入り混じります。良い年は攻め、悪い年は守る。メリハリをつけて動くことがポイントです。";
    }

    // 大運の十二大従星の解釈を収集
    const energyInterpretations = taiunDetails.map((d) => {
      const interp = energyLifeInterpretation[d.energy];
      const stageKey = stage.key === "childhood" ? "childhood" : stage.key === "middleAge" ? "middleAge" : "lateLife";
      return {
        age: d.age,
        energy: d.energy,
        star: d.star,
        isTenchu: d.isTenchu,
        text: interp ? interp[stageKey] : ""
      };
    });

    return {
      ...stage,
      isCurrent,
      score: totalScore,
      summary,
      summarySimple,
      advice,
      adviceSimple,
      taiunDetails,
      energyInterpretations
    };
  });

  return stageResults;
}

function calcWorkExcellence(center, northStar, southStar, energy, counts, pillars) {
  let score = 50;
  const breakdown = [];

  // 十大主星（中星）の仕事適性ベース点（極端化：優秀星は大幅プラス、苦手星は大幅マイナス）
  const starWorkBase = {
    "貫索星": 15, "石門星": 10, "鳳閣星": -5, "調舒星": -8,
    "禄存星": 8, "司禄星": 12, "車騎星": 6, "牽牛星": 16,
    "龍高星": -10, "玉堂星": 14
  };
  const centerPt = starWorkBase[center] || 0;
  score += centerPt;
  if (centerPt) breakdown.push(`中星「${center}」${centerPt > 0 ? "+" : ""}${centerPt}`);

  // 北星・南星の仕事適性（極端化）
  const subStarWorkBase = {
    "貫索星": 8, "石門星": 10, "鳳閣星": -6, "調舒星": -7,
    "禄存星": 6, "司禄星": 9, "車騎星": 8, "牽牛星": 11,
    "龍高星": -8, "玉堂星": 9
  };
  const northPt = subStarWorkBase[northStar] || 0;
  const southPt = subStarWorkBase[southStar] || 0;
  const subPt = Math.round((northPt + southPt) * 0.6);
  score += subPt;
  if (northPt) breakdown.push(`北星「${northStar}」${northPt > 0 ? "+" : ""}${Math.round(northPt * 0.6)}`);
  if (southPt) breakdown.push(`南星「${southStar}」${southPt > 0 ? "+" : ""}${Math.round(southPt * 0.6)}`);

  // 主星の相乗効果（良い組み合わせで大幅ボーナス、悪い組み合わせで大幅ペナルティ）
  const excellentCombos = [
    ["牽牛星", "玉堂星"], ["貫索星", "司禄星"], ["石門星", "禄存星"],
    ["玉堂星", "司禄星"], ["牽牛星", "石門星"]
  ];
  const poorCombos = [
    ["龍高星", "鳳閣星"], ["調舒星", "龍高星"], ["鳳閣星", "調舒星"]
  ];
  const allThreeStars = [center, northStar, southStar];
  for (const [s1, s2] of excellentCombos) {
    if (allThreeStars.includes(s1) && allThreeStars.includes(s2)) {
      score += 12;
      breakdown.push(`${s1}×${s2}の相乗+12`);
      break;
    }
  }
  for (const [s1, s2] of poorCombos) {
    if (allThreeStars.includes(s1) && allThreeStars.includes(s2)) {
      score -= 15;
      breakdown.push(`${s1}×${s2}の摩擦-15`);
      break;
    }
  }

  // 十二大従星の仕事エネルギー（極端化）
  const energyWorkBonus = {
    "天貴星": 10, "天南星": 8, "天禄星": 12, "天将星": 14, "天堂星": 6,
    "天印星": 4, "天報星": -4, "天胡星": -6, "天極星": -3, "天馳星": -5,
    "天庫星": 7, "天恍星": -2
  };
  let energyPt = 0;
  energy.forEach((e) => {
    const bonus = energyWorkBonus[e.name] || 0;
    const weighted = Math.round(bonus * (e.score / 10));
    energyPt += weighted;
  });
  energyPt = Math.round(energyPt / energy.length * 2.5);
  score += energyPt;
  if (energyPt) breakdown.push(`十二大従星${energyPt > 0 ? "+" : ""}${energyPt}`);

  // 五行バランス（極端化：土・金は仕事に強く、水・木は弱い）
  const gogyoWorkBonus = { "木": -2, "火": 3, "土": 10, "金": 8, "水": -5 };
  const sortedGogyo = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const strongEl = sortedGogyo[0][0];
  const weakEl = sortedGogyo[sortedGogyo.length - 1][0];
  const gogyoPt = gogyoWorkBonus[strongEl] || 0;
  const gogyoPenalty = gogyoWorkBonus[weakEl] ? Math.round(gogyoWorkBonus[weakEl] * 0.5) : 0;
  score += gogyoPt + gogyoPenalty;
  if (gogyoPt) breakdown.push(`最強五行${strongEl}${gogyoPt > 0 ? "+" : ""}${gogyoPt}`);
  if (gogyoPenalty) breakdown.push(`最弱五行${weakEl}${gogyoPenalty > 0 ? "+" : ""}${gogyoPenalty}`);

  // 五行バランスの良さ（極端化）
  const gogyoValues = Object.values(counts);
  const gogyoMax = Math.max(...gogyoValues);
  const gogyoMin = Math.min(...gogyoValues);
  const balance = gogyoMax - gogyoMin;
  if (balance <= 1) { score += 10; breakdown.push("五行バランス良好+10"); }
  else if (balance <= 2) { score += 4; breakdown.push("五行バランスやや良好+4"); }
  else if (balance >= 5) { score -= 12; breakdown.push("五行偏り極大-12"); }
  else if (balance >= 4) { score -= 7; breakdown.push("五行偏り大-7"); }
  else if (balance >= 3) { score -= 3; breakdown.push("五行偏り-3"); }

  // 日干の仕事力（極端化）
  const dayStemWorkBonus = {
    "甲": 8, "乙": 4, "丙": 6, "丁": 3, "戊": 9,
    "己": 6, "庚": 10, "辛": 6, "壬": 5, "癸": -3
  };
  const dayPt = dayStemWorkBonus[pillars.day.stem] || 0;
  score += dayPt;
  if (dayPt) breakdown.push(`日干${pillars.day.stem}${dayPt > 0 ? "+" : ""}${dayPt}`);

  // 正規化: 生スコアを0-100スケールに変換（極端な範囲に拡大）
  const RAW_MIN_W = 20;
  const RAW_MAX_W = 110;
  score = Math.max(5, Math.min(100, Math.round(((score - RAW_MIN_W) / (RAW_MAX_W - RAW_MIN_W)) * 100)));

  // 評価ランク: 極端な分布を目標（SとEを明確に分離）
  let rank = "";
  if (score >= 80) rank = "S級（超優秀・エリート候補）";
  else if (score >= 65) rank = "A級（優秀・リーダー候補）";
  else if (score >= 45) rank = "B級（上位・安定して成果を出す）";
  else if (score >= 25) rank = "C級（標準・努力で伸びる）";
  else if (score >= 15) rank = "D級（やや苦手・工夫が必要）";
  else rank = "E級（仕事運低調・環境選びが鍵）";

  // 適職傾向
  const jobTendency = {
    "貫索星": "専門職・研究者・職人系", "石門星": "営業・人事・政治家系",
    "鳳閣星": "クリエイティブ・企画系", "調舒星": "芸術・デザイン・専門技術系",
    "禄存星": "教育・医療・サポート系", "司禄星": "経理・管理・公務員系",
    "車騎星": "営業・新規開拓・起業家系", "牽牛星": "経営者・管理職・名誉職系",
    "龍高星": "ベンチャー・企画開発系", "玉堂星": "コンサル・研究・教育系"
  };

  return { score, rank, breakdown: breakdown.join(" / "), jobTendency: jobTendency[center] || "" };
}

// === 主星相互関係（中央×他方位の組み合わせパターン） ===
const starInteractionData = {
  "相生(→)": {
    north: "目上の人を支える関係。自分から頼るのが苦手で、尽くすことで信頼を得ます。",
    south: "部下や後輩を自然に導ける関係。教える立場で成果を出し、人に慕われます。",
    east: "社会に貢献して評価される関係。自己主張は控えめですが、実績で勝負します。",
    west: "パートナーに尽くす関係。自分の気持ちを我慢しすぎないよう気をつけて。"
  },
  "相生(←)": {
    north: "上司や親から自然に応援してもらえる恵まれた関係。目上の人の引き立てでチャンスが広がります。",
    south: "目下から助けてもらえる関係。ただし甘えさせすぎに注意が必要です。",
    east: "友人や同僚と自然に協力できる関係。周りの支援を得て社会で伸びていきます。",
    west: "パートナーから支えられる関係。家庭が安定し、安心感があります。"
  },
  "相剋(→)": {
    north: "目上の人とぶつかりやすい関係。自分のやり方を押し通す傾向があり、摩擦に注意。",
    south: "部下や後輩に厳しくなりすぎる関係。コントロールしすぎず、ゆだねることも大切。",
    east: "社会と対立しやすい関係。自分のペースを押し付けず、協調性を意識すると良い。",
    west: "パートナーと主導権争いになりやすい関係。適度な距離感を保つことが鍵。"
  },
  "相剋(←)": {
    north: "目上から抑圧されやすい関係。自分の意思を抑えがちなので、勇気を持って主張を。",
    south: "目下から反発されやすい関係。思い通りにいかず苦労しますが、寛容さが鍵。",
    east: "社会から圧力を受けやすい関係。自分のペースを保つ工夫と忍耐が必要。",
    west: "パートナーに押されがちな関係。自分の主張を大切にしないと不満が溜まります。"
  },
  "比和": {
    north: "目上と似た性質の関係。親しみやすいですが、目上の良し悪しの影響を直接受けます。",
    south: "目下と似た性質の関係。共感しやすいですが、似た欠点も共有しやすいです。",
    east: "社会と似た性質の関係。波長は合いますが、刺激に欠けて成長のきっかけが少ないです。",
    west: "パートナーと似たもの同士。安定しますが、変化がなくマンネリになりやすいです。"
  }
};

function getStarInteraction(centerStar, otherStar, direction) {
  const centerEl = getStarElement(centerStar);
  const otherEl = getStarElement(otherStar);
  if (!centerEl || !otherEl) return "";
  const rel = getGogyoRelation(centerEl, otherEl);
  const data = starInteractionData[rel];
  if (!data || !data[direction]) return "";
  const dirLabel = direction === "north" ? "目上（親・上司）" : direction === "south" ? "目下（部下・子供）" : direction === "east" ? "社会（友人・同僚）" : "配偶者（パートナー）";
  return `【${dirLabel}】${data[direction]}`;
}

// === 主星×十二大従星の組み合わせ ===
const mainEnergyComboData = {
  "相生(→)": "内面がそのまま外に表れる。社会では素直に自分を出せるタイミング。",
  "相生(←)": "環境が自分を後押しする。周りの支援で性格が発揮しやすい。",
  "相剋(→)": "気持ちと行動にズレが生じやすい。内面と外面が葛藤する。",
  "相剋(←)": "環境に制限され自分を出しにくい。工夫して表現する必要がある。",
  "比和": "内面と外面が一致。等身大の自分を自然に表現できる。"
};

function getMainEnergyCombo(mainStar, energyStar) {
  const mainEl = getStarElement(mainStar);
  const energyEl = getEnergyElement(energyStar);
  if (!mainEl || !energyEl) return "";
  const rel = getGogyoRelation(mainEl, energyEl);
  return mainEnergyComboData[rel] || "";
}

function getEnergyElement(energyName) {
  const energyElementMap = {
    "天貴星": "土", "天南星": "水", "天禄星": "木", "天将星": "木", "天堂星": "土",
    "天恍星": "火", "天印星": "土", "天報星": "水", "天胡星": "木", "天極星": "水",
    "天庫星": "土", "天馳星": "金"
  };
  return energyElementMap[energyName] || "";
}

function buildReading(name, pillars, mainStars, energy, counts, tenchusatsu, seimei, extra) {
  const weakest = Object.entries(counts).sort((a, b) => a[1] - b[1])[0][0];
  const strongest = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  const center = mainStars.center;
  const totalEnergy = energy.reduce((sum, item) => sum + item.score, 0);
  const dayEl = elements[stems.indexOf(pillars.day.stem)];
  const dayYinYang = yinYang[stems.indexOf(pillars.day.stem)];
  const balanceType = getBalanceType(counts);

  // 姓名判断の性格データ
  const hasSeimei = seimei && !seimei.error;
  // 人格（姓の末字＋名の初字）の五行から見る性格
  const jinGogyoPersonality = {
    "木": { good: "向上心と正義感が強い。自分を磨く努力を惜しまない。", bad: "独善的で頑固。自分が正しいと思い込んで譲らない。" },
    "火": { good: "情熱的で表現力が高い。明るさで人を惹きつける。", bad: "感情的になりやすく、熱しやすく冷めやすい。" },
    "土": { good: "誠実で信頼される。約束を守り、人を支える。", bad: "頑固で変化に弱い。心配性で干渉しすぎる。" },
    "金": { good: "意志が強く潔い。ルールを重んじ、決断力がある。", bad: "冷たさが出る。自分と違うものを拒絶する。" },
    "水": { good: "柔軟で適応力が高い。状況を読む洞察力がある。", bad: "流されやすく、自分の意見がない。逃げ癖がある。" }
  };
  // 三才配置（天格・人格・地格の五行関係）から見る性格
  const sancaiPersonality = {
    "相生": "天格から人格、人格から地格へ性質が順相生しており、内面と外面の調和が取りやすい。素直で伸びやかな性格。",
    "相剋": "天格と人格、または人格と地格が相剋しており、内面の葛藤や親との価値観の衝突が出やすい。自分の中に矛盾する要素を抱えている。",
    "比和": "天格・人格・地格の性質が同気質で、一貫性がある。しかし偏りが強くなり、柔軟性に欠ける。"
  };
  // 人格の吉凶から見る性格傾向
  const jinkakuRankPersonality = {
    "大吉": "芯が強く、周囲から信頼される。自分を曲げない意志の強さが長所。",
    "吉": "基本的に安定した性格。努力を続ければ大成する。",
    "半吉": "普段は安定しているが、ストレスが溜まると性格の偏りが出る。",
    "凶": "自己肯定感が揺らぎやすい。自分を過小評価する癖がある。",
    "大凶": "内面に不安を抱えやすく、人間関係で摩擦が出やすい。"
  };
  // 地格（名の合計画数）から見る内面・感受性
  const chikakuPersonality = {
    "大吉": "感受性が豊かで素直。感情表現が自然で、人に好かれる。",
    "吉": "感情が安定しており、素直な心持ち。",
    "半吉": "感受性はあるが、ムラが出やすい。",
    "凶": "感情の起伏が激しく、傷つきやすい。",
    "大凶": "内面が不安定で、感情的になりやすい。"
  };
  // 外格（対人関係）から見る社交性
  const gaikakuPersonality = {
    "大吉": "社交性が高く、人付き合いが上手い。初対面でも打ち解けやすい。",
    "吉": "人当たりが良く、基本的に対人関係はスムーズ。",
    "半吉": "親しい人には素直だが、初対面では警戒する。",
    "凶": "人付き合いが苦手で、壁を作りやすい。",
    "大凶": "対人関係で摩擦が起きやすく、孤立しやすい。"
  };

  const seimeiPersonality = hasSeimei ? {
    jinGogyo: jinGogyoPersonality[seimei.jinGogyo] || { good: "", bad: "" },
    sancaiText: sancaiPersonality[seimei.tenJinRel] && sancaiPersonality[seimei.jinChiRel] ?
      `天格→人格は${seimei.tenJinRel}、人格→地格は${seimei.jinChiRel}。${seimei.tenJinRel === "相生" && seimei.jinChiRel === "相生" ? sancaiPersonality["相生"] : seimei.tenJinRel === "相剋" || seimei.jinChiRel === "相剋" ? sancaiPersonality["相剋"] : sancaiPersonality["比和"]}` : "",
    jinRankText: jinkakuRankPersonality[seimei.jinRank?.rank] || "",
    chiRankText: chikakuPersonality[seimei.chiRank?.rank] || "",
    gaiRankText: gaikakuPersonality[seimei.gaiRank?.rank] || "",
    overall: seimei.overallRank
  } : null;

  // 十大主星の詳細性格
  const starPersonality = {
    貫索星: {
      good: {
        balanced: "自立心が強く、自分の軸を持っている。内面のバランスが信念を柔軟にし、人の忠告も取り入れながら自分の道を貫く。",
        moderate: "自立心が強く、自分の軸を持っている。一度決めたら貫く意志力があり、周囲に流されない信念がある。",
        imbalanced: "自立心が強く、自分の軸を持っている。内面の偏りが意志を硬化させ、誰の意見も聞かない独善的な孤立に向かいやすい。"
      },
      work: {
        balanced: "専門一筋で力を発揮。独自の分野で評価される。内面のバランスが協調性も兼ね備え、チームと自分を両立できる。",
        moderate: "専門一筋で力を発揮。独自の分野で評価されるが、チームワークを軽視すると孤立。",
        imbalanced: "専門一筋で力を発揮するが、内面の偏りが協調性を欠き、組織やチームと衝突して孤立しやすい。"
      },
      love: {
        balanced: "一途で情熱的。内面のバランスが束縛を緩め、相手の自由を尊重しつつ深い絆を築ける。",
        moderate: "一途で情熱的だが、束縛しやすい。相手の自由を認めないと関係が息苦しくなる。",
        imbalanced: "一途だが内面の偏りが独占欲を極限化し、束縛がエスカレートして相手を圧迫しがち。"
      },
      money: {
        balanced: "自分の道に投資する。内面のバランスが金銭感覚に冷静さを与え、無駄なく賢く管理できる。",
        moderate: "自分の道に投資する。趣味や専門分野には惜しみないが、それ以外は倹約家。金銭管理は自分で握りたがる。",
        imbalanced: "内面の偏りが金銭への執着を強め、自分の道以外には極端な倹約家になり、金銭管理の主導権を手放したがらない。"
      },
      marriage: {
        balanced: "結婚は「自分の城」を築くこと。内面のバランスがパートナーの自立も認めつつ、お互いの領域を尊重できる。",
        moderate: "結婚は「自分の城」を築くこと。パートナーに自立を求めるが、自分のペースを守らせようとして摩擦が出る。",
        imbalanced: "内面の偏りが支配欲を強め、パートナーに自分のペースを押しつけがちで摩擦が深刻化しやすい。"
      },
      social: {
        balanced: "基本的に一人を好むが、内面のバランスが適度な社交性も与え、必要な人脈を最小限かつ深く築ける。",
        moderate: "基本的に一人を好む。必要な人脈は最小限に絞り、深い関係を少数と築く。大人数の集まりでは疲れ、早く帰りたくなる。自分の領域に入り込まれると不快感を覚えやすい。",
        imbalanced: "内面の偏りが対人関係を狭めすぎ、誰も領域に入れず孤立しやすくなる。集まりでは居心地の悪さを隠しきれない。"
      },
      byDayStem: {
        "甲": "木性の貫索星：成長と向上の自我。自分の道を真っ直ぐに伸ばし、信念を曲げない。上に立つ自我で、自分のやり方を押し通す。",
        "乙": "木性の貫索星：柔軟だが根強い自我。周囲に合わせつつも自分の芯は曲げない。草のように見た目は柔らかいが、引き抜くのが難しい根を持つ。",
        "丙": "火性の貫索星（混沌の自我）：自然のうちに明るいムードの中で自我が表出する。「柔らかいが強引」というニュアンス。対「個人」よりも大勢の人達を相手にして発揮する力。方向性のない自我だが、こだわることそのことが貫索星の働きになる。一般的な枠組みに収まりきらない側面がある。",
        "丁": "火性の貫索星（混沌の自我）：孤独を感じさせる自我で、人に理解されることが少ない。自分の判断を優先する傾向がある。1対多数よりも1対1（少数）で発揮される自我。小さい個人的世界を作り、長い時間をかけて自分のこだわりを形にする。",
        "戊": "土性の貫索星（領域確立の自我）：山の自我は不動。自分から動く自己主張にはならず、受け身の自我で穏やかに悠然と構える。人によって動かされることはなく、日々はたんたんとマイペース。攻撃に対しては悠然と反撃に転じる。温厚に見えるが中に入ると強い自我がある。目的に向かう時は単独性だが、目的外では石門的社交性を発揮する合理的・理性的な姿。",
        "己": "土性の貫索星（領域確立の自我）：平均的庶民的な自我。それほど強い自己主張は生まれないが、自分が信じるもの、こだわるものへの思い入れは強く、「かくあるべし」という信条に近いものを貫く頑固さがある。目的外のことに関しては自我がなく、無形連帯の社交性を発揮する。",
        "庚": "金性の貫索星（建設と破壊の自我）：いつ如何なる時と所であっても自分は自分という姿を持ち、主張を押し出し態度にも現わす。剛であり、言葉は率直で筋が通る。攻撃的な衣をまとった自我で、ある種のさわやかさを感じさせるが、その自我を押さえようとすれば押さえる方が傷つくほどの強さを持つ。既存空間を変形させ、流れや秩序を改革する役割。荒波を乗り越える力を持つ。",
        "辛": "金性の貫索星（建設と破壊の自我）：自我が美意識をまとい、言葉も態度も柔らかく気品を持つが、大いに自我を押し出してくる。その美意識は自分なりの大義名分を旗印にしているので、揺るぎない自己主張になる。未熟な状態では身勝手、わがままになる。既存の秩序を美しく変革する力がある。",
        "壬": "水性の貫索星（裏に隠れる自我）：海の水の如く流動的な自我。相手が弱ければ強く発し、強ければ弱く発する。水が高いところから低いところへ流れるように、自我を使い分ける。ある意味では自分をよくわかっている自我。貫索星としての自我力は最弱で、強い自己主張はなく表からは自我がないようにも見える。不言実行型。有形にすることで満たされる自我。",
        "癸": "水性の貫索星（裏に隠れる自我）：やや陰気な状態で現われ、表出の仕方も湿気を含んでいる。貫索星らしい単独の自己主張は表からは見えず、他の性格の裏側に隠れる。人の意見を借りて自己表現するような形。単独の自己主張力は弱いが、無→有→無→有を繰り返しながら現実を形作る。"
      },
      hidden: {
        balanced: "実は一人でいる時が一番安心。内面のバランスがその寂しさを程よく中和し、人との関わりも苦痛なく受け入れられる。",
        moderate: "実は一人でいる時が一番安心。人に頼ることを恥と思いがち。",
        imbalanced: "実は一人でいる時が一番安心。内面の偏りが人への不信を深め、殻に閉じこもりがちになる。"
      }
    },
    石門星: {
      good: {
        balanced: "協調性が高く、人脈を作るのが上手い。内面のバランスが本物の信頼関係を築かせ、良い面も悪い面も受け入れて巻き込む包容力がある。",
        moderate: "協調性が高く、人脈を作るのが上手い。場をまとめる力があり、様々な人と関係を築ける。良い面も悪い面も受け入れて、自分のペースに巻き込む包容力がある。",
        imbalanced: "協調性は高いが内面の偏りで特定のタイプの人としか深く繋がれず、人脈の質にムラが出やすい。"
      },
      bad: {
        balanced: "全員に良い顔をする傾向はあるが、内面のバランスが本音を見極める目を養い、表面的な調和に終始しない。",
        moderate: "全員に良い顔をして、結局誰の信頼も深まらない。調和を装って問題を先送りする。正直すぎる発言が逆に人を傷つけることもある。",
        imbalanced: "内面の偏りが八方美人を極限化し、全員に良い顔して問題を先送りし続け、最終的に誰からも信頼されない。"
      },
      work: {
        balanced: "組織の中で力を発揮。内面のバランスが自分の意見も持ちつつ協調できるバランスを与え、人脈を活かした仕事で最大限の成果を出す。",
        moderate: "組織の中で力を発揮。人脈を活かした仕事が得意だが、自分の意見がなくなる。",
        imbalanced: "内面の偏りが組織内での自分を失う傾向を強め、他人の意見に流されて評価されにくい。"
      },
      love: {
        balanced: "誰とでも仲良くできるが、内面のバランスが本命には差をつける判断力を与え、パートナーを安心させる。",
        moderate: "誰とでも仲良くできるが、パートナーに「全員に優しい」と不満を持たれる。",
        imbalanced: "内面の偏りが差をつける判断力を曖昧にし、パートナーの不信感が深刻化しやすい。"
      },
      money: {
        balanced: "交際費や人への投資に回るが、内面のバランスが支出のメリハリをつけ、人脈を本当に財産に変えられる。",
        moderate: "交際費や人への投資に回る。人脈が財産だが、付き合いで出費がかさむ。金銭の貸し借りでトラブルになりやすい。",
        imbalanced: "内面の偏りが交際費の浪費をエスカレートさせ、金銭の貸し借りで大きなトラブルを起こしやすい。"
      },
      marriage: {
        balanced: "結婚は「二人のコミュニティ」。内面のバランスが家族の和と個人の自由を両立させ、程よい距離感を保てる。",
        moderate: "結婚は「二人のコミュニティ」。家族の和を重んじるが、パートナーの交友関係に干渉しすぎると息苦しくなる。",
        imbalanced: "内面の偏りが干渉を過剰にし、パートナーの交友関係にまで口を出して関係を息苦しくさせる。"
      },
      social: {
        balanced: "社交性は最高クラス。内面のバランスが本音を出せる相手を見極め、表面上の社交と内面の孤独のバランスを取る。",
        moderate: "社交性は最高クラス。誰とでも打ち解け、場を盛り上げる。ただし全員に良い顔をして本音を出せないため、表面上は社交的だが内面は孤独。善悪、清濂という境界線を持たない。",
        imbalanced: "内面の偏りが社交の表面化を極限にし、本音を出せる相手がいなくなり、表面上は誰とでも仲良しだが内面は深く孤独。"
      },
      byDayStem: {
        "甲": "木性の石門星：成長の和合性。自分が伸びる過程で自然に人脈が広がる。信念を持って人を集めるが、自分の成長が止まると和合も弱まる。",
        "乙": "木性の石門星：柔軟な和合性。草が広がるように、環境に合わせて人脈を広げる。誰とでも合わせられるが、自分の根が浅いと流されやすい。",
        "丙": "火性の石門星（混沌の和合）：混乱した状況の中でもっとも威力を発揮する和合精神。環境が混乱や過渡期を迎える時に出番が来る。形のないものを有形にする働き、人々が注目する何かを作り出す力がある。ただし有形にしたものを導く力はなく、リーダーシップを発揮すると道を外れる。新しい芽を作り出す力、未完の美の中に喜びを感じる。時に周囲に負担や忍耐を強いることもある。善悪、清濂という価値基準を持たず、どんな人でも受け入れる発想の大きさを持つ。",
        "丁": "火性の石門星（混沌の和合）：明るさと穏やかさによって集団の和合性を作る。いわゆる人気者的な仲間作り。集団の問題を照射して解決したり、組織の救世主的な存在になる。人の輪がどんどん拡大して絆の強い和合体を作り上げる。未来を目指す力はないが、仲間の輪は時間と共に広がって行く。",
        "戊": "土性の石門星（領域確立の和合）：上下関係にこだわらない仲間意識。同格、同年代という共通項で人が集まる。縦社会ではうまく稼働できない。同じ目的や関心を持った人との範囲で働く和合性。自分が中心にいるべき人になり、少なからずワンマン性を持つ。自分からの働きかけは少なく、同じ志を持った人が集まる。領域を持ち、他者との区別は明確になる。善悪、清濂という価値基準は持たない。",
        "己": "土性の石門星（領域確立の和合）：やってくる人を選ばずに迎い入れて仲間の輪を広げる。自然に自分が輪の中核にいてワンマン性も出る。自分からの動きは少なく、受け入れる度量は大きく、善悪を問わず人を選ばずに和合する。仲間づくりというより自分を中心に人が集まる形。器の大きさによってリーダー足り得るか、わがままなワンマンかに分かれる。",
        "庚": "金性の石門星（建設と破壊の和合）：「僧兵世を乱す」——平和を願って和合を試みるが、結果的には動乱を生む。目的と結果が大きくズレるのが本性。表は和合だが中身は戦いの気。鎧の上に衣をつけた姿。自分から積極的に動いて仲間を作る。特別意識を持った人たちの和合性で、庶民性や広がりはなく、独自の価値観や美意識を共有する仲間が集う。協調性はあるが、結果的に穏やかな和合の意図が波乱と混乱を生む。広い視野と広い心を持つことが条件で、それがないと家庭も争いの場に転じる。",
        "辛": "金性の石門星（建設と破壊の和合）：良くも悪くも波乱を巻き起こす仲間づくり。はっきりした目的を持った仲間が集う。スポーツ競技や政治・宗教のような役目意識に目覚めた人々の集団となることが多く、周囲に与える影響は大きい。闘争心が旺盛な集団で、波乱を起こす元凶にもなる。自分から積極的に動くが、和合の意図が結果として混乱を生む本性を持つ。",
        "壬": "水性の石門星（裏に隠れる和合）：裏側の政治力、折衝力があり、根回しや裏工作を得意とする。華やかさはなく地味な存在。仲間内でも本心はあまり表に出さない。時間をかけて浸透するような和合性で、人脈形成に長い時間を必要とする。水が下に流れるが如く、目下や後進との交流が多くなる。人を選別せず、流れの中で輪を広げる。安定した環境では変革の種を作り、動乱では秩序を作ろうとする。善悪、清濂という価値基準は持たない。",
        "癸": "水性の石門星（裏に隠れる和合）：自分が動くことによって和を広げ、人脈を大きくする。誰でもいいわけではなく、自分に合った人だけを選別する。かなり好き嫌いの激しい和合性。裏側で政治力を発揮し、表向きは静かながら本心は裏に隠れる。根回しや裏工作が得意だが、華やかさはない。"
      },
      hidden: {
        balanced: "実は人間関係に一番エネルギーを使う。内面のバランスが適度に一人の時間を確保でき、疲弊を防げる。",
        moderate: "実は人間関係に一番エネルギーを使う。一人の時間がないと疲弊する。",
        imbalanced: "実は人間関係に一番エネルギーを使う。内面の偏りが一人の時間を奪い、対人疲れが蓄積して燃え尽きやすい。"
      }
    },
    鳳閣星: {
      good: {
        balanced: "自然体で表現力がある。内面のバランスが表現力に深みを与え、柔軟かつ確かな感性で周囲をリラックスさせる。",
        moderate: "自然体で表現力がある。雰囲気が良く、周囲をリラックスさせる。柔軟で凝り固まらない。無理をせず心のままに生きる。自分の感じたことをそのまま周囲に伝える感性を持つ。",
        imbalanced: "自然体だが内面の偏りが感情の波を激化させ、明るさと虚無感の落差が大きくなる。表現は鋭くなるが安定感に欠ける。"
      },
      bad: {
        balanced: "危機感が薄い傾向はあるが、内面のバランスが最低限の責任感を保ち、怠慢に見られにくい。",
        moderate: "危機感が薄く、締め切りや責任を軽視する。怠慢に見られ、信用を落とす。楽な方に逃げる癖がある。",
        imbalanced: "内面の偏りが危機感の欠如を極限化し、締め切りや責任を無視しがちで信用を失墜しやすい。"
      },
      work: {
        balanced: "クリエイティブな仕事で光る。内面のバランスが締め切り管理の意識も与え、才能と責任を両立できる。",
        moderate: "クリエイティブな仕事で光るが、締め切り管理と責任を持たないと信用失墜。",
        imbalanced: "内面の偏りがクリエイティブ面の不安定さを増幅し、締め切りや責任を放置しがちで信用を失いやすい。"
      },
      love: {
        balanced: "楽しい関係を好む。内面のバランスが安定も受け入れられ、マンネリや責任から逃げずに関係を育める。",
        moderate: "楽しい関係を好むが、マンネリや責任から逃げたくなる。安定を求められると重く感じる。",
        imbalanced: "内面の偏りが責任からの逃避をエスカレートさせ、楽しい時だけ付き合い、安定を求められるとすぐに離れたくなる。"
      },
      money: {
        balanced: "お金は「楽しむためのもの」。内面のバランスが支出のメリハリをつけ、貯金も無理なくできる。",
        moderate: "お金は「楽しむためのもの」。趣味や体験にお金をかけるが、貯金意識が薄い。気づいたら使っているタイプ。",
        imbalanced: "内面の偏りが浪費をエスカレートさせ、貯金意識が薄く気づいたら使っているという状態に陥りやすい。"
      },
      marriage: {
        balanced: "結婚に「楽しさ」を求める。内面のバランスが日常の喜びと現実の責任を両立させ、バランスの取れた家庭を築ける。",
        moderate: "結婚に「楽しさ」を求める。日常の喜びを重視するが、現実的な責任分担から逃げたくなる時がある。",
        imbalanced: "内面の偏りが責任分担から常に逃げたがり、結婚を「楽しいだけ」のものと勘違いして家庭が崩れやすい。"
      },
      social: {
        balanced: "雰囲気で人をリラックスさせる社交タイプ。内面のバランスが深い関係も恐れず、表面的な関わりに留まらない。",
        moderate: "雰囲気で人をリラックスさせる社交タイプ。初対面でも自然に打ち解ける。ただし深い関係になるのを避け、表面的な関係を保つ癖がある。",
        imbalanced: "内面の偏りが表面的な関係しか築けない傾向を強め、誰とでも打ち解けるが深く繋がれにくい。"
      },
      byDayStem: {
        "甲": "木性の鳳閣星（動体の自然体）：自然に親しむ中で楽しみを見出す。山や海などの大自然を求めて行動する。俗にいうレジャーを楽しむ形が最も自然な鳳閣星のエネルギー。感情・感性が自然体の基準で、庶民的で日常生活を楽しむライフスタイル。人間関係の中で本分が発揮されるので孤独には弱く、自分から人を求める。善悪を問わず自分好みの人間関係を作る。無理することなく好ましいと感じる世界を大事にする。",
        "乙": "木性の鳳閣星（動体の自然体）：孤独の楽しみとなり、自分の内なる世界に楽しみの場を作る。芸術性が生まれ、絵画や文芸など自分一人でできる世界が居場所。社交力はなく文学芸術などの世界で「燃える」ことが楽しみ。燃えるという本性があり、何かに対して自己の楽しみを燃焼させていなければ満足できない。家族などの小集団でも単独性が出て、協調性には欠ける。",
        "丙": "火性の鳳閣星（混沌の光）：混沌の中で光となり、現実に最初の光をもたらす働き。物事が動き出すきっかけを作り示唆を与える。中心にいるがまとめたり引っ張る中心人物足りえない。火付け役であとは自然にまかせる。動きの少ない鳳閣星で、楽しみの場は日常的な生活範囲。わざわざ動き回って何かを求める行動力は出ない。行動範囲は狭く、日々を楽しく過ごすライフスタイル。強い伝達力を持つが、伝えるものの真実味を自分もわかっているわけではない。そこにとどまっているものを動かす火付け役。情報を伝達するが導くものではなく、責任を持てない拡散を招くこともある。",
        "丁": "火性の鳳閣星（混沌の光）：庶民的な楽しみ。社会や時代のムードにのりやすく、流行を追う傾向。自分の気持ちに関係なく状況を楽しむことができる。一見流行を追っているように見えるが、時代の後（歴史）先（未来予測）に精通した上で今の流れ・現況を楽しむ。時代の流れを感知し、未来や過去に気持ちが向く。",
        "戊": "土性の鳳閣星（領域の伝達）：個人的な何かを伝える鳳閣星にはならない。自分が見聞したものをまとめて伝えることが得意で、客観性の強い鳳閣星。興味の対象は自分領域内で広がりはなく、専門分野での伝達。抽象的なことよりも現実的な事柄が対象。動きの大きな鳳閣星で、金性の闘争心があって戦闘的な遊びを好む。勝ち負けのあるスポーツやゲームを楽しむ。チャレンジ精神が加わり、持久力のある頑張る人。本性的に知性を備え、人に教え感化する能力を持つ。",
        "己": "土性の鳳閣星（領域の伝達）：庶民性を持たず、特別意識に支えられた鳳閣星。上流階級にあるような遊びを好む。特定の人たちだけの集いの中で楽しみが生まれ、時代の流れとは無関係に少数の同じレベルの人たちで共有する楽しみ。そこにプライドを満たす要素が必要。個人的伝達力は低いが、見聞したものをまとめて伝えるのは得意。客観性が強く専門分野が居場所。人を育て感化する能力を持つ。",
        "庚": "金性の鳳閣星（動と中庸の葛藤）：自然体でいれば中庸を崩す方向へ向かう動的本性と、鳳閣星の中庸バランスの矛盾を抱える。バランスを保つための見えない努力がある。内的葛藤が大きく、金性の攻撃力は自分に発せられて自分との戦いを繰り返す。それが中庸バランスを生み、余裕のある姿にたどり着く。動くことそのことが楽しさのコアで、目的よりもプロセスを楽しむ。旅行でも目的地より到着までの行程を楽しむ。前進力旺盛な動的鳳閣星。孤独な作業の結果、先見性と本質を見抜く鋭い観察力を身につける。",
        "辛": "金性の鳳閣星（動と中庸の葛藤）：動きは少なく思索的な鳳閣星。本を読んだり映画を観たり美術を鑑賞することに楽しみを見出す。雨水が溜まるが如く集める楽しみが加わり、コレクションの趣味や物事をまとめる能力につながる。知的なゲームや夢を現実化する遊び、ゲームやおもちゃ作り、日曜大工のような創造の楽しみにも向く。自然体で楽しめるように努力を重ね、動的本性との葛藤から中庸バランスを生み出す。単独行動が多く身勝手にも見えるが、結果として冷静な観察力と未来を見抜く力を持つ。",
        "壬": "水性の鳳閣星（裏に隠れる中庸）：伝達力が弱く、伝達の準備段階である整理・整頓に力を発揮する。計算能力であり、伝達の代わりに記録する作用が働く。後に伝達されることを含んでの記録。甲木の単一方向性と直進傾向が表れ、興味の対象は狭い範囲。1つの対象と長くかかわり、広がるとしても枝が伸びるように本体と関連したことに関心が向く。みんなで楽しむより一人の楽しみの世界。物事にこだわらないあきらめの良さといさぎよい気風を持つ。個人感情を表に出さず、伝達力は公的なものに限られる。ものごとをまとめ計算して整理統合することが得意。",
        "癸": "水性の鳳閣星（裏に隠れる中庸）：執着やこだわりはなく、その時々に興味を持ったことを楽しむ。関心の範囲は広く多趣味傾向だが、あれこれ手を広げることはなく1つ決着すると次へ向かう。協調性があって仲間と楽しみを共有する。人に対しても物に対しても中庸の精神が働き、必要以上の深入りはしない。伝達力は弱いが整理・整頓・記録に力を発揮する。物事にこだわらないあきらめの良さといさぎよい気風を持つ。"
      },
      hidden: {
        balanced: "実は他人の評価を気にしている。内面のバランスがその敏感さを活かし、空気を読む力として発揮できる。",
        moderate: "実は他人の評価を気にしている。表面上のゆるさとは裏腹に、見られ方に敏感。",
        imbalanced: "実は他人の評価を気にしている。内面の偏りが過敏さを極限化し、他人の目が気になって行動できなくなる。"
      }
    },
    調舒星: {
      good: {
        balanced: "感性が鋭く、美意識と審美眼が高い。内面のバランスが感性を安定させ、孤独を創造力に変える深い表現力を持つ。",
        moderate: "感性が鋭く、美意識と審美眼が高い。独自の世界観を持ち、表現や芸術で才能を発揮する。繊細さは他の誰よりも深く、愛情深い面もある。社会で認められなかった感情が、文学や芸術などの世界で花開く。",
        imbalanced: "感性は鋭いが内面の偏りが感受性を過敏にし、世界全体が敵に見える孤独に沈みやすい。才能は尖るが情緒不安定になりやすい。"
      },
      bad: {
        balanced: "被害者意識は出やすいが、内面のバランスが客観性を保ち、感情を創造に昇華できる。",
        moderate: "被害者意識が強く、すぐに傷つく。孤独に陥りやすく、周囲を刺々しい態度で遠ざける。嫉妬深い。自分の感情を優先して周囲を振り回す。",
        imbalanced: "内面の偏りが被害者意識を極限化し、世界中が自分を理解していないと感じて孤立し、刺々しい態度で誰も寄せ付けなくなる。"
      },
      work: {
        balanced: "専門スキルや感性を活かす仕事で独自のポジションを確保。内面のバランスがチームとの摩擦も和らげる。",
        moderate: "専門スキルや感性を活かす仕事で独自のポジションを確保できるが、チーム摩擦に注意。",
        imbalanced: "内面の偏りがチームとの摩擦を頻発させ、独自の才能はあるが組織に馴染めず孤立しやすい。"
      },
      love: {
        balanced: "理想が高く、精神的なつながりを求める。内面のバランスが現実とのバランスを取り、裏切りにも回復力を持てる。",
        moderate: "理想が高く、精神的なつながりを求める。裏切られると深く傷つき、執着を手放しにくい。",
        imbalanced: "内面の偏りが理想を極限化し、現実のパートナーに必ず失望し、裏切りに対する執着が非常に強くなる。"
      },
      money: {
        balanced: "美しさやこだわりにお金をかける。内面のバランスが金銭感覚に程よい冷静さを与え、質と家計のバランスを取れる。",
        moderate: "美しさやこだわりにお金をかける。ブランドや質にこだわって出費が膨らむ。金銭感覚は感情的で波がある。",
        imbalanced: "内面の偏りが感情的な出費をエスカレートさせ、美しさへの執着で金銭感覚が不安定になりやすい。"
      },
      marriage: {
        balanced: "結婚に「精神的な一体感」を求める。内面のバランスが理想と現実のギャップを埋め、パートナーの欠点も受け入れられる。",
        moderate: "結婚に「精神的な一体感」を求める。理想が高すぎて現実のパートナーに失望しやすい。裏切りは許せない。",
        imbalanced: "内面の偏りが理想を極限化し、現実のパートナーに必ず失望し、裏切りを許せず関係が不安定になりやすい。"
      },
      social: {
        balanced: "社交性は低いが、内面のバランスが少数の理解者との深い繋がりを可能にし、質の高い人間関係を築ける。",
        moderate: "社交性は低い。人付き合いにエネルギーを消費し、すぐに疲れる。少数の理解者とだけ深く繋がりたい。集団の中では壁を作り、刺々しい態度で人を遠ざける。",
        imbalanced: "内面の偏りが対人関係を極限に狭め、集団の中では常に壁を作り、刺々しい態度で誰も寄せ付けず孤立しやすくなる。"
      },
      byDayStem: {
        "甲": "木性の調舒星（燃焼の孤独）：自己の想念や夢を長時間燃焼させることができ、それが才能（芸術性や創造性）へと転化する。内向する個人感情が起点で孤独性を含む。孤独には気持ちが通じない怒りもあって、炎のように振幅の大きい感性になる。直観によって相手を知る特性があり、相手にも同じような理解を望むため人間関係は狭い範囲に限定。生きる目的が眼前すると一気に集中し、邪魔されたくないという孤独性が生まれる。目的外では人情家としての一面も出る二面性。",
        "乙": "木性の調舒星（燃焼の孤独）：活動的で明るい孤独性と呼ばれ、ある種の愛に近い感情（宗教性や信仰心）が生まれる。社会性（道徳的・道義的なもの）への目覚めが早い感性で、人との交流も可能で和を保てる。相手を理解し相手の人間性を感じ取れる感性の持ち主。人を嫌う孤独性よりも自然に燃焼できる世界を作る。",
        "丙": "火性の調舒星（混沌の感情）：持続的な感情は持てず、気分に近い。過敏な感受性を持ち、感情の起伏が大きく、理解されない孤独感を持つ。悲しみ・孤独・憤りを最も強く感じる星。人を嫌う孤独性と人を頼る依存性が共存し、愛する人とのすれ違いで「あなたなんか大嫌い！」と爆発する両極の同居。天性の直観力と組むと予知能力や芸術的才能になる。才能以前では誰かに何かに寄り添う形の生き方。夢は夢、生活は生活と分離して平行進行する。",
        "丁": "火性の調舒星（混沌の感情）：ある種の神秘性があり人を引きつける魅力が生まれる。揺れ動きも少なく常に静なる状態を保ち、鋭い感性にはならず庶民的でおだやか。表面的には山特有の屹立感があって近寄りがたい印象になるが、一歩懐に入れば温かい人柄。表は大人、中身は子供といわれる調舒星。感情の振幅も高まらず孤独感も強まらない。",
        "戊": "土性の調舒星（領域の感性）：狭い範囲・専門分野で発揮される感性。自分なりの伝達力を持ち、思想・宗教などの出発点・創始者となりうる。個人的見解が起点なので既存の力を借りることが必須で、既存を土台として自分の感性を上乗せする。不満は少なく反抗心も生まれない一点集中型。調舒星の中で一番理解されにくい世界で、辛の感性は常人には見えないところまで行き届く深い感性。行動には生かし難く思索的な想念の世界で大いに発揮。哲学的な感性と孤独性。現実濁世を生きながら高尚な想念を持ち、孤独感が際立つ。",
        "己": "土性の調舒星（領域の感性）：攻撃性や前進力を持った感性。表現力自体に攻撃性が含まれ、自分の思いや考えが激しい形で表に出る。感性としては至って冷静で理性的だが、遠慮なく相手の気持ちに切り込んでいくところに問題がある。他人に影響されたり環境に左右されない感性の所有者で、それが個性と能力にもなる。狭い範囲・専門分野で発揮され、不満は少なく反抗心も生まれない一点集中型。",
        "庚": "金性の調舒星（攻撃的表現）：個人的表現力に攻撃性が加わり、過激な表現力になる。言葉による暴力や過激な表現として現れる。必ずしも短気というわけではない。感情がすぐには発露せず長い時間の経過の後に表れる。例えば熟年離婚する夫婦の如く、表面に見えるときは爆発的だが、そこへ到達するまで小さい想念が寄り集まっている。感性の鋭さと着眼点の良さは突出するが、理解されない状況も作る。天才型の能力発揮になる一方で実務的な現実力には弱さ。強い家族愛を持ちながらも理解されない孤独感。",
        "辛": "金性の調舒星（攻撃的表現）：高感度の感受性を持ち、日常生活の中で人が気付かない不合理を即座に感じ取る。常に神経が稼働している状態。大きな集団に入ると不合理に対し許し難い反抗心が生まれ、黙っていられずはみ出す。反逆性が孤独性を生み、表面の反抗や怒りよりも内面の怒りの方が強く、他人にはわからない葛藤。常に二人の自分が存在するような感覚で、外からも二面性の人とみられる。天才型の能力発揮と実務的弱さの両面を持つ。",
        "壬": "水性の調舒星（内向の感性）：柔軟な感受性で感情は表面に現れず、子供のころは不本意な感情表現で孤立することもある。年齢と共に明るさが出てくる。現実面では人との交流も生まれるが、内面には孤独の領域を抱える。鋭い感性は外ではなく内に向かい、ちょっとしたことで傷つきやすい。感情が圧縮された形になって、表現力も凝縮した短い表現が得意（俳句やエッセイなど）。愛情深い心を持ちながら外に対しては身構え、孤独感は増す。瞬間的に働く直感的・霊的感性。",
        "癸": "水性の調舒星（内向の感性）：気持ちはまっすぐに現れる。他人との交流を嫌い、自己の世界にのみ閉じこもる形となり、現実的な意味で他人との和が保ちにくい孤独性になる。感性の集中力は高く、特殊な才能や技能として開花する。研究熱心だが社会性には乏しく、自分の世界内で活躍する資質。鋭い感性は内に向かい、圧縮された感情表現が得意。瞬間的に働く直感的・霊的感性を持つ。"
      },
      hidden: {
        balanced: "実は誰よりも認められたい。内面のバランスがその欲求を創作意欲として昇華でき、健全な表現活動に向ける。",
        moderate: "実は誰よりも認められたい。無関心を装うが、内心は承認に飢えている。",
        imbalanced: "実は誰よりも認められたい。内面の偏りが承認欲求を異常に強め、無関心を装うが内心は飢餓状態で、歪んだ形で爆発しやすい。"
      }
    },
    禄存星: {
      good: {
        balanced: "包容力があり、面倒見が良い。内面のバランスが見返りを求めない純粋な愛情を可能にし、人を引き寄せる本物の魅力を持つ。",
        moderate: "包容力があり、面倒見が良い。人に尽くす優しさを持ち、周囲から頼りにされる。人情深く、愛情深い面が強い。人を引き寄せる魅力があり、見返りを求めない純粋な愛情を持つ。",
        imbalanced: "包容力はあるが内面の偏りが承認欲求を肥大化させ、尽くすことで自分を保つ依存状態に陥りやすい。"
      },
      bad: {
        balanced: "承認欲求で尽くす傾向はあるが、内面のバランスが見返りを求める心を抑え、健全な奉仕に留められる。",
        moderate: "承認欲求で尽くし、見返りを求める。依存しすぎて相手を重くし、利用されやすい。自分がない。ずっと与え続けると疲弊してしまう。",
        imbalanced: "内面の偏りが承認欲求を極限化し、見返りを求めて尽くし続け、利用されても止められない依存状態に陥る。"
      },
      work: {
        balanced: "指導・教育・サポート役で信頼を集める。内面のバランスが自分の仕事とのバランスを取り、疲弊を防げる。",
        moderate: "指導・教育・サポート役で信頼を集めるが、自分の仕事がおろそかになる。",
        imbalanced: "内面の偏りが他人への奉仕に没頭させ、自分の仕事がおろそかになって評価されにくい。"
      },
      love: {
        balanced: "惜しみない愛情を注ぐ。内面のバランスが見返りを期待する心を抑え、純粋な愛情として相手に届く。",
        moderate: "惜しみない愛情を注ぐが、尽くしすぎて「重い」と距離を置かれる。見返りを期待してしまう。愛情は行為としての愛情で、精神性はない。",
        imbalanced: "内面の偏りが愛情の重さを極限化し、尽くしすぎて相手を圧迫し、見返りがないと不満が蓄積しやすい。"
      },
      money: {
        balanced: "人にお金を使う。内面のバランスが支出の判断力を与え、人脈を本当に財産に変えられる。",
        moderate: "人にお金を使う。プレゼントや奢りで関係を築くが、見返りを期待して損をする。貸したお金は戻りにくい。回転財——回転を続けることで引力を増す。",
        imbalanced: "内面の偏りが人への出費をエスカレートさせ、見返りを期待して貸したお金が戻らず、金銭的に利用されやすい。"
      },
      marriage: {
        balanced: "結婚は「家族に尽くすこと」。内面のバランスが尽くしすぎない距離感を保ち、相手の自立も促せる。",
        moderate: "結婚は「家族に尽くすこと」。パートナーを支えるが、尽くしすぎて相手を依存させ、自分が疲弊する。",
        imbalanced: "内面の偏りが奉仕を過剰にし、家族に尽くしすぎて相手を依存させ、自分が燃え尽きて疲弊する。"
      },
      social: {
        balanced: "面倒見が良く人に好かれる。内面のバランスが本音を言える相手も作り、孤独を防げる。",
        moderate: "面倒見が良く人に好かれるが、社交性は「尽くすことで繋がる」タイプ。誰からも頼りにされるが、自分の本音を言える相手がいない孤独がある。",
        imbalanced: "内面の偏りが「尽くすことでしか繋がれない」状態を固定化し、誰からも頼りにされるが本音を言える相手がいなくて孤独が深まる。"
      },
      byDayStem: {
        "甲": "木性の禄存星（経済的愛情）：愛情の大きさと現実的行為が同居するエネルギー。経済や肉体など目に見える現実という形での愛情表現となり、わかりやすい分誤解も受ける。自分から動く積極性は薄く、やって来るものに対して愛情奉仕の精神を発揮。去って行く者の背中を追うような積極性はない。気くばり・気遣いのような相手に気付かれないこともある愛情奉仕行動。その分、今だけという時間制限が消えて長時間継続する特色。長く続く普遍性はなく、その時その時に稼働する非時間的愛情。それを繰り返し次元を上げて行く。",
        "乙": "木性の禄存星（経済的愛情）：庶民的な情の世界。深くはないにしても広がりがあり、俗にいう「お人好し」。助け合いの精神を持って、よく人の世話事や厄介事を引き受ける。情的なもので、社会生活に欠かせない愛情であり奉仕の精神だが、高い理念や哲学的な思想に基づくものではない。実生活に密着した実用的な愛情。愛情の大きさと現実的行為が同居するエネルギー。",
        "丙": "火性の禄存星（無限の愛）：精神性の強い愛情奉仕。「無限の愛」と呼ばれるが、実際は足るを知らない燃焼で、必要以上の奉仕・愛情へのこだわり・集財力や財力へのこだわりとなって現れる。若さゆえに行き過ぎた愛情が行使され、届かないと反転して憎しみに変わる激しさを含む愛。ある種の押しつけ的なもので、これが愛情であると相手に解らせなければ気が済まない。純粋で無防備、直線的に示す愛情。実らなかった場合は自分も相手も傷つく。言葉より現実の態度として愛情が現れる。",
        "丁": "火性の禄存星（無限の愛）：冷静さや理性的な面が加わる。愛情を示すことによってなんらかの「優越感」が起こるのが特徴。奉仕の結果優越感が生まれる、あるいは優越感を得たいために奉仕する。特別意識という器の中に愛情が入っている。奉仕や愛情のエネルギーを放出することによって内面の想念が高まる現象を伴い、次元の高い愛情になる可能性。足るを知らない燃焼で、必要以上の奉仕になることも。",
        "戊": "土性の禄存星（領域の愛情）：狭い範囲・限られた人達の間においてのみエネルギーが燃焼する。エリア外に対しては憎しみなど反対の気持ちも宿る。隠れるという意味合いが加わり、かくし財・かくれ愛・かくれ権力欲・かくれた信用などとなる。動き（行動力）のある愛情だが限られた範囲で現れる。与えるだけでなく求める気持ちも強い。動くことの意味には対象が変化することも含まれ、一筋に続くものではなく狭い範囲ながら流動的な愛情表現。深さが特徴。",
        "己": "土性の禄存星（領域の愛情）：明るく派手な愛情ではないが、長い時間をかけて人の心の中に浸透して行く。そこに集まるという作用が働き、最終的には大きな愛情となり奉仕的な行為となる。最初から現れるものではなく、人付き合いでははじめは冷たい人のように思われるが、徐々に愛情が大きくなる。古典的な愛情の形で、時代の先を進むものではない。狭い範囲・限られた人達の間で発動し、隠れる意味合いがある。",
        "庚": "金性の禄存星（権力の愛情）：情愛的なものよりも権力思考が強くなり、自らが中心的存在になろうとする。奉仕よりも自己顕示型で、力によって敵を打ち、力によって味方を増大させる。力と財力に最大の価値観を見出す。車騎星のような競争心や敵対心が生まれ、相対増気でパワーアップ。後退が許されない。家庭でも組織でもワンマン性が出て、自分が上に立って周囲を従える。動乱期には先頭に立って活躍。裏表のないわかりやすい真直ぐな愛情で、同じ速度・同じ分量で常に放出し続け、分けへだてない愛情を提供。",
        "辛": "金性の禄存星（権力の愛情）：環境に応じて愛情の出方が変わる。自分が意識してコントロールするわけではなく、その時々の回りの状況に対応して変化する受身の愛情。主体は自分ではなく相手側。時に愛情がない人のような評価も受けるが、愛情の中心が変化することはなく現わし方が変化するだけ。古風で奉仕的な愛情表現。権力思考と自己顕示欲が前面に出るが、辛の柔軟性で状況に適応する。",
        "壬": "水性の禄存星（外向の愛情）：自在性と流動性があり、外に対して奉仕の精神が発動する。常識に従わない独自性があって自己顕示欲も強い。内（家庭）に対しては家族愛があっても表には出なくて誤解も受ける。現実性が強くなって自分の理想や夢が育ちにくい。外を満たす愛は内の孤独を生む。気持ちは外側に向かい、他人に対して明るく暖かい奉仕の精神を発揮。身内には行き届かないところがあって外面が良い。積極的に外に表すので1つを掘り下げることはなく、広く浅い愛情。",
        "癸": "水性の禄存星（内向の愛情）：他人よりも身内に対しての愛情・奉仕の精神を持つ。他人には理解されない愛情でも、身内にはよく理解される。安定感はなく時に激しい感情も生まれる。わがままさを持った愛情で、時に相手の感情を考慮しない一方的な押し付け愛になることも。常識に従わない自己中心的な愛情奉仕で、自己顕示欲も強い。夢と現実の葛藤があって現実が強く、内面は満たされない孤独を抱える。"
      },
      hidden: {
        balanced: "実は見捨てられるのが一番怖い。内面のバランスがその恐怖を健全な奉仕意欲に変え、人に必要とされることで自信を築ける。",
        moderate: "実は見捨てられるのが一番怖い。人に必要とされることで自分の価値を確認する。",
        imbalanced: "実は見捨てられるのが一番怖い。内面の偏りが見捨てられ不安を極限化し、人に必要とされるために異常なまでに尽くし続ける。"
      }
    },
    司禄星: {
      good: {
        balanced: "堅実で蓄積力がある。内面のバランスが堅実さを安定感に変え、長期的な信頼を築きつつ変化にも対応できる。",
        moderate: "堅実で蓄積力がある。コツコツと実績を積み上げ、約束を守る信頼できるタイプ。家庭や身内との関係を大切にし、長く守り続ける忍耐力がある。何事にも蓄積を重視し、感情よりも安定を優先する。",
        imbalanced: "堅実さはあるが内面の偏りが変化への恐怖を極限化し、現状維持に執着して成長が止まりやすくなる。"
      },
      bad: {
        balanced: "変化を恐れる傾向はあるが、内面のバランスが柔軟性を保ち、安全策に逃げずに挑戦もできる。",
        moderate: "変化を恐れ、新しい挑戦を避ける。安全策に逃げて成長が止まる。ルーティンに固執する。自己中心的な所有欲を含む。",
        imbalanced: "内面の偏りが変化への恐怖を極限化し、ルーティンに固執しがちで、新しい挑戦を拒絶しがちで成長が止まりやすい。"
      },
      work: {
        balanced: "堅実な仕事ぶりで評価される。内面のバランスが新しいプロジェクトにも柔軟に対応できる力を与える。",
        moderate: "堅実な仕事ぶりで評価されるが、変化に弱く新しいプロジェクトに対応できない。",
        imbalanced: "内面の偏りが変化への対応力を奪い、新しいプロジェクトや環境変化についていけにくくなる。"
      },
      love: {
        balanced: "安定した関係を築く。内面のバランスがマンネリを防ぐ柔軟性を与え、相手の成長にもついていける。",
        moderate: "安定した関係を築くが、変化を恐れてマンネリになる。相手の成長についていけない。",
        imbalanced: "内面の偏りがマンネリを固定化し、相手の成長についていけず関係が停滞しやすくなる。"
      },
      money: {
        balanced: "貯金と蓄財が得意。内面のバランスが投資チャンスも見極め、守ることと増やすことのバランスを取れる。",
        moderate: "貯金と蓄財が得意。無駄遣いを嫌い、コツコツ貯める。しかし守ることに固執して投資チャンスを逃す。",
        imbalanced: "内面の偏りが蓄財への執着を極限化し、無駄遣いを嫌いすぎ投資チャンスを全て逃して成長しない。"
      },
      marriage: {
        balanced: "結婚は「安心の土台を築くこと」。内面のバランスが安定と変化のバランスを取り、硬直化を防げる。",
        moderate: "結婚は「安心の土台を築くこと」。安定した家庭を築くが、変化を恐れて関係が硬直化しやすい。",
        imbalanced: "内面の偏りが関係の硬直化を固定化し、変化を恐れて家庭が停滞しやすくなる。"
      },
      social: {
        balanced: "社交性は控えめだが、内面のバランスが新しい人間関係にも適度に対応でき、圈子を徐々に広げられる。",
        moderate: "社交性は控えめ。決まった圈子の中では安定した関係を築くが、新しい人間関係には消極的。付き合いは堅実で無駄がない。",
        imbalanced: "内面の偏りが新しい人間関係を拒絶しがちで、決まった圈子の外には出たがらず人脈が狭くなりやすい。"
      },
      byDayStem: {
        "甲": "木性の司禄星（大らかな蓄積）：司禄星の中でも最も大らか。堅実さは十分に備わり、蓄積・準備の意味合いも持つ。権力欲が加わるのが特徴。蓄積力が最強で、代々伝わる庶民の生活の知恵。社会の変貌・時代の移り変わりに対処できる諸々のものを蓄積。財に関わる世渡りの知恵、時代の変化を掴む術、その時々によって異なる価値あるものの選別が働く。畑を耕す意味で、癸水（雨）と丙火（太陽）が後天運に廻るとき最大稼動時になる。",
        "乙": "木性の司禄星（大らかな蓄積）：積極的な動きにはならず、蓄積の形が常に受動的。自分自ら求めるのではなく、寄ってきたもの入り込んできたもののみを蓄積・準備する。蓄積のために諸々のものを惹きつける力を持つ。何かにこだわるわけではなく間口は広く、種々雑多なものを蓄積。知識なら異なった世界のものまでも知って博学となり、雑学的な知恵を身につける。財力なら諸々の雑収入を一つにまとめて蓄積。「貴賤同居の財」と呼ばれる。大らかさと堅実さを備える。",
        "丙": "火性の司禄星（別枠の引力）：混沌とした中で自分たちの領域だけをまとまる別ワクのエネルギー体。禄存星のような強い引力を持たない代わりに、近づいてくるものを引き入れようとする引力を発揮。不変的な引力を半永久的に持続し、無限吸収・放出のない積み重ね。無自覚のうちに人に大きな影響を与え、動き出すと方向を持たないために既存を破壊する働きを無自覚のうちに果たす。蓄積に美意識が働き、なりふり構わず集めることはしない。大義名分を持ってふさわしいものを取得し、正論が必要で道に外れた方法はとらない。",
        "丁": "火性の司禄星（別枠の引力）：混沌の中で別ワクの領域を持ち、不変的な引力を半永久的に所有。動きのある積極的な蓄積力で、戦いや闘争の気を秘め「軍備のような」。財をためるのに単なる貯蓄ではなく投機的な蓄積力を発揮し、蓄積が戦力となってさらに大きな蓄積を生む。柔軟性に欠け、自分の視野だけで闘争的な活動を続けるため独善・排他という他者との軋轢を生む。無自覚のうちに既存を破壊する力を持つ。",
        "戊": "土性の司禄星（隠れた蓄積）：地味な蓄積力の発揮で、裏側で隠れた形で発揮される。表からは司禄星的な活動をしているようには見えない。単に蓄積するだけでなく精神活動も含めて分類・区分といった整理整頓を含んだ蓄積力。引き出す時に必要なものが瞬時に引き出される優れた能力で、周囲に信頼と安心を与える。最初は小さく時間とともに大きな流れとなる蓄積。一攫千金を狙わず一つの道を堅実に進む。清濁併せ呑む集積作用で善の準備も悪の蓄積も得手。自分の欲求を追求したものが他人の役に立つという特殊な現象。",
        "己": "土性の司禄星（隠れた蓄積）：地味な蓄積力が裏側で隠れた形で発揮される。動きのある壬からなるので、自分の行動力によって自分の世界外から学んだものを多く蓄積。知識に関しては親や先生から学ぶことよりも、海外で学んだことの方がはるかに身に付く。海外の蓄積のノウハウを取り入れるのも得意。本業外のアルバイト的な収入による蓄財も特徴。蓄積に関する考え方が常に体験によって構成される。分類・区分の整理整頓能力を持ち、個人的欲求で身につけたものが他人の役に立つ。",
        "庚": "金性の司禄星（動的蓄積）：積極的な行動力と攻撃力を持った司禄星。自分から動きながら集積を果たし、単独で動くことが多く協調性はない。リーダーになれば周囲はついてこれなくなり、リーダー願望も薄い。単独で自由に動ける道を選択。当たり前の家庭を持つことも難しく、逆縁夫婦や週末婚など特殊な結婚形態に向く。親子関係も縦列意識が薄れ横並びの友達親子に。上下意識や男女意識が薄く、男女を問わず人間の原点のような魅力が内在。柔軟性があり、与えられた環境によって稼働の仕方が変わる。臨機応変さを持った蓄積・準備力で、日頃の信用の積み重ねが背景。",
        "辛": "金性の司禄星（動的蓄積）：積極的な行動力と攻撃力を持った司禄星で単独行動向き。臨機応変さはなく、環境に関係なく一定のやり方で蓄積。特別の策もなくストレートにすべてのものを蓄積。お金なら運用や利殖にこだわらず定額貯金のような方式。「官人の蓄財」と呼ばれ商人感覚はない。多角化より一つの商売をいつまでも続ける老舗感覚。既存的平均的家庭感はなく、始原的人間的な家庭感を持つ。上下意識や男女意識が薄い。",
        "壬": "水性の司禄星（流動の蓄積）：堅実・安定の司禄星と流動する水性の矛盾で、蓄積力が半減。積んでは崩れる状況を生むが、蓄積する本性は消えず。役割は現実ではなく積むという行為（ノウハウ）。蓄積に関する知恵や企画のような部門で最大の力を発揮し、金融コンサルタント的な能力。智性・情報・創造が司禄星と連動。家庭構築では思い通りに行かないことも。揺れる炎のごとく安定感がなく、確固たる目的が必要で自分のためだとうまくいかない。社会のため・子供のため・会社のためと自分外に目的を置くことで稼働。蓄積失敗の原因も自分外に置く副作用。人を育てる能力やコンサルタント的才能。",
        "癸": "水性の司禄星（流動の蓄積）：堅実・安定の司禄星と流動する水性の矛盾で蓄積力が半減。地味であるはずの蓄積力が、明るく派手な丙によって目立つ。混沌の意味も含まれ目的のないアバウトな蓄積力。強いて言えば蓄財や準備そのものが楽しみとなりそれが目的。将来なんの役に立つのかも考えず、蓄積するという行為だけが先行。積んでは崩れるが蓄積の知恵や企画力でコンサルタント的才能を発揮。社交性があり、人を育てる面で力量を発揮。家庭で苦労する分、財や人育てで実る。"
      },
      hidden: {
        balanced: "実は変化が怖くて仕方ない。内面のバランスがその不安を健康的な準備力に変え、変化にも段階的に対応できる。",
        moderate: "実は変化が怖くて仕方ない。表面上の安定とは裏腹に、内心は不安を抱えている。",
        imbalanced: "実は変化が怖くて仕方ない。内面の偏りが変化への恐怖を極限化し、内心の不安が常に状態で行動が取れなくなる。"
      }
    },
    車騎星: {
      good: {
        balanced: "行動力と競争力が高い。内面のバランスが行動力に持続力を与え、感情に流されない突破を実現する。",
        moderate: "行動力と競争力が高い。困難を突破する力があり、勝負所で力を発揮する。前に進む姿勢は誰にも負けない。動くべき時は動き、止まるべき時は止まる判断力もある。",
        imbalanced: "行動力はあるが内面の偏りが短気と攻撃性を増幅し、周囲を巻き込む爆発を起こしやすい。"
      },
      bad: {
        balanced: "短気な傾向はあるが、内面のバランスが感情を抑え、勢いで人を傷つけることを防げる。",
        moderate: "短気でキレやすい。勢いで言葉を過ぎ、人間関係を壊す。負けを認められない。人生において肉体的にも精神的にも休息が少ない。",
        imbalanced: "内面の偏りが短気を極限化し、キレやすく勢いで人間関係を壊しがちで、休息のない人生になりやすい。"
      },
      work: {
        balanced: "営業や新規開拓で成果を出す。内面のバランスがチームの信頼も損なわず、単独と協調のバランスを取れる。",
        moderate: "営業や新規開拓で成果を出すが、独断専行でチームの信頼を損なう。",
        imbalanced: "内面の偏りが独断専行をエスカレートさせ、チームの信頼を失いやすく孤立する。"
      },
      love: {
        balanced: "情熱的にアプローチする。内面のバランスが嫉妬を抑え、冷却しても急に冷めない安定感を与える。",
        moderate: "情熱的にアプローチするが、嫉妬深く、勢いで相手を傷つける。冷却すると急に冷める。",
        imbalanced: "内面の偏りが嫉妬を極限化し、勢いで相手を傷つけ、冷めると無関心になりやすく振れ幅の大きい恋愛になりやすい。"
      },
      money: {
        balanced: "勝負にお金をかける。内面のバランスが投資判断に冷静さを与え、ギャンブル的な出費を抑えられる。",
        moderate: "勝負にお金をかける。投資やギャンブル的な出費に注意。勢いで買って後悔することも多い。",
        imbalanced: "内面の偏りがギャンブル的な出費をエスカレートさせ、勢いで買って後悔するパターンがエスカレートする。"
      },
      marriage: {
        balanced: "結婚も「勝負」。内面のバランスが情熱と安定のバランスを取り、パートナーを尊重できる。",
        moderate: "結婚も「勝負」。情熱で突っ走るが、冷めると急に冷める。パートナーを支配しようとする傾向。",
        imbalanced: "内面の偏りが支配欲を極限化し、情熱で突っ走った後急に冷め、パートナーを支配しようとして関係が不安定になりやすい。"
      },
      social: {
        balanced: "社交性は高い。内面のバランスが主導権争いを抑え、集団の中で協調しつつ力を発揮できる。",
        moderate: "社交性は高いが、主導権を握らないと気が済まない。集団の中で自分が中心でないと不満。勝負気質で人を押し切るため、敵も作りやすい。",
        imbalanced: "内面の偏りが主導権への執着を極限化し、集団で中心でないと不満を爆発させ、敵を多数作る。"
      },
      byDayStem: {
        "甲": "木性の車騎星（機敏なる質）：車騎星の標準型。本体は「機敏なる質」で、動くべきときに動き止まるべきときに止まる。退却の時に敏速性が表れるのが特徴。スケールの大きい戦いで「武人の本分」。日常生活の争い事には逆に弱さが現れ、闘争心のない人のように見える。大義のため・大きな目的のための戦いでは生涯闘争に終始しても満足度は大きい。短い時間内では良さが現れず、長時間の中で真の強さを見せる。合理的な闘争ゆえに人間性の冷たさが表出する危険性。",
        "乙": "木性の車騎星（機敏なる質）：戦いの中においても美意識を忘れない。他人の目を意識するためではなく自分一人のみの満足感。自分の心に対しての自尊心。世間の常識では計り知れない闘争心理が働き理解されがち。大義名分は不要で常に自分のために自分が戦う。自己満足にすぎなくてもそれが「美なる闘争」として自分を満たす。機敏なる質を持ち、退却時に敏速性が表れる。",
        "丙": "火性の車騎星（空間の浮遊者）：混沌とした火性と車騎星の集中力は矛盾。「空間の浮遊者」の異名。動くほどに既存性からはみ出し、「新しい世界を作る」「既成を破壊し今までにない道を作る」使命を持つ。既存性の強い環境でははみ出し者や破壊者のレッテル。葛藤の大きな星。自分から動いて闘争を求め、マイエリアでは発動しにくく外へ展開する。短期決戦型でスピード感があるが持続力はさほどない。直感的な知力が加わり奇策を用いる攻撃で、相手が強いほど力を発揮。心理的な錯乱や多面多角的な戦い。",
        "丁": "火性の車騎星（空間の浮遊者）：動的なエネルギーだが裏方的存在。戦いの準備やプロパガンダ的な情報戦を得意とする。争いのきっかけを作り出したり、人と人とを争わせる力を発揮。争いを仲裁したり終結させたりの才能もあり、最初と最後に最大の力量発揮ができるのが大きな特徴。混沌の中で方向性のない動的エネルギーが発動し、既存を破壊し新しい道を作る使命を持つ。",
        "戊": "土性の車騎星（静なる闘争）：外側へ力を示す車騎星にはならない。動的エネルギーが土性の引力で半減し、蓄積という現象になる。表向きは小さな動き。静なる上層と動なる下層の二層分離が起こり、おとなしく見えても下方ではマグマのようにエネルギーが溜まる。きっかけがあると一気に爆発し、爆発できないと心の中で不安定な揺れ動きが続き精神を病むことも。動乱期に出番。動的エネルギーが直線的・直情的に現れ、後退を知らない前進力。一途な純粋さで短期決戦向きだが長時間の闘争は不向き。裏表のない正直な行動力だが進み過ぎて相手の心を傷つけることも。",
        "己": "土性の車騎星（静なる闘争）：進退自在の行動力で、失敗しても何度でも試行錯誤ができる。行動意欲を長時間にわたり保持。表に見える行動からは目的や方向が見えないこともあるが、根っこのところでは強い負けん気と根性を持つ。動的エネルギーが土性の引力で半減し蓄積現象になる。表静裏動の二層の心で、きっかけがあると爆発。動乱期に活躍。",
        "庚": "金性の車騎星（純粋なる戦い）：激しく爆発するが如きエネルギー。純粋な戦いの性情。待つことが許されない業を持ち、休息はなくエネルギーは消耗の連続だが、気の燃焼回転は最も早い。自我も削がれて悟りを開くような天啓を受けやすい。強い責任感で単独で動き、全部背負って不利な立場に回りやすい。人を理解することもされることも少なく孤独傾向。明るく積極的な行動エネルギーで陰湿さはない。正攻法で動き周囲から理解されやすく伝達力は見事。ただ目的を定めて行動するわけではなく行動は多岐にわたる。",
        "辛": "金性の車騎星（純粋なる戦い）：行動範囲は狭く個人的な行動力。感情的には強いものがあり、時に相手を攻撃したり激しい燃焼が起こる。行動していくうちにエスカレートし、新しい反発や恨みが生まれ攻撃的な色合いが濃くなり力が増幅する。「革命への闘争」と呼ばれる。大勢を相手にする形は向かずあくまで個人的範疇。純粋な戦いの性情で待つことが許されず、気の燃焼回転は最も早い。自我が削がれて天啓を受けやすい。",
        "壬": "水性の車騎星（かくれ戦い）：水性の知性が表に出て、車騎星の行動力や闘争心は裏に隠れる。一見牽牛星のようで智的な前進力・行動力を持ち、短気・短絡な面は表向き消える。回りの人の力を活用する術を心得る（人の活用、人的教育の才）。参謀・軍師的な立場で良好だが将になると良さが消える。影武者的存在が役割。安定した組織は居場所ではなく未知の世界を目指すところに生き場。「かくれ戦い」と称され、裏にあったほうが本来の良さが出る。山のように自分からは動かず受け身の戦いだが、降りかかる火の粉を振り払うよう攻撃力を発揮。エリア内では強さも忍耐力もあるが外に対してはもろさも。知力が加わると策謀家的行為にも。自己顕示欲や権力意識も持つ。",
        "癸": "水性の車騎星（かくれ戦い）：庶民的な日常生活の前進力。行動の範囲が横広がりに伸展。多分に感情的な面を持ち、行動が争いになることもあり横広がりに拡大。逆に一家一族のために自分一人が表面に立って外敵と戦う義侠心にもなる。攻撃力が内側か外側かの違い。大勢を相手にしたり大勢のために戦ったり一対一の闘争が少ない形。義理と人情の谷間で闘争を繰り広げるきわめて人間的な闘争心。智的な前進力が表に出て闘争心は裏に隠れ、人の力を活用する術を心得る。"
      },
      hidden: {
        balanced: "実は負けるのが許せない。内面のバランスがその恐怖を健全な競争力に変え、敗北から学ぶ力を与える。",
        moderate: "実は負けるのが許せない。強さを装うが、敗北に対する恐怖が行動力の原動力。",
        imbalanced: "実は負けるのが許せない。内面の偏りが敗北への恐怖を極限化し、強さを装い続けて精神的に追い詰められやすい。"
      }
    },
    牽牛星: {
      good: {
        balanced: "責任感と名誉心が強い。内面のバランスが品格を内面から支え、真の尊敬を集める。約束を守り、立場に見合った行動をとる。",
        moderate: "責任感と名誉心が強い。品格を重んじ、信頼を集める。約束を守り、立場に見合った行動をとる。自尊心が高く自分を信じる気持ちが強い。自分で自分を律し、自分なりの価値基準を持つ。役割意識が強く、自己犠牲もいとわない。",
        imbalanced: "責任感は強いが内面の偏りが面目への執着を強め、見栄と実力の乖離が目立つようになりやすい。"
      },
      bad: {
        balanced: "見栄で動く傾向はあるが、内面のバランスが本質を見失わない目を保ち、体面と中身のバランスを取れる。",
        moderate: "見栄で動き、本質を見失う。プライドが高すぎて素直になれない。体面を守るために無理をする。見栄っ張りな面が強調されると、周囲と衝突しやすい。",
        imbalanced: "内面の偏りが見栄を極限化し、体面を守るために無理を続け、本質を見失って周囲と衝突する。"
      },
      work: {
        balanced: "責任あるポジションで評価される。内面のバランスが面子と実質を両立させ、真のリーダーとして機能する。",
        moderate: "責任あるポジションで評価されるが、面子にこだわって実質を疎かにする。",
        imbalanced: "内面の偏りが面子へのこだわりを極限化し、実質を疎かにして評価を失う。"
      },
      love: {
        balanced: "品のある態度で信頼を勝ち取る。内面のバランスがプライドを適度に保ち、素直になれる瞬間も作れる。",
        moderate: "品のある態度で信頼を勝ち取るが、プライドが邪魔して素直になれずすれ違う。",
        imbalanced: "内面の偏りがプライドを極限化し、素直になれずすれ違いが深刻化して関係が不安定になりやすい。"
      },
      money: {
        balanced: "ブランドや見栄にお金をかける。内面のバランスが身の丈に合った支出を保ち、品格と家計のバランスを取れる。",
        moderate: "ブランドや見栄にお金をかける。身の丈に合わない出費をしてプライドを保とうとする。金銭管理は見栄っぱり。",
        imbalanced: "内面の偏りが見栄による出費をエスカレートさせ、身の丈に合わない出費で金銭的に苦しくなりやすい。"
      },
      marriage: {
        balanced: "結婚は「身分に見合った関係」。内面のバランスが体裁と本音のバランスを取り、家庭の体面と実質を両立できる。",
        moderate: "結婚は「身分に見合った関係」。体裁を重んじ、家庭の体面を気にする。プライドが邪魔して本音で向き合えない。",
        imbalanced: "内面の偏りが体裁への執着を極限化し、家庭の体面ばかり気にして本音で向き合えず、関係が空虚になる。"
      },
      social: {
        balanced: "社交性は品格がある。内面のバランスが本音を出せる相手を見極め、計算高さと誠実さのバランスを取れる。",
        moderate: "社交性は品格があるが、本音を出さない。立場に見合った振る舞いを心がけ、誰からも「好ましい」と思われるように振る舞う。しかし腹の中は計算高い。",
        imbalanced: "内面の偏りが計算高さを極限化し、誰にでも良い顔をするが本音を出さず、表面的な品格しか残らない。"
      },
      byDayStem: {
        "甲": "木性の牽牛星（遅咲きの自尊心）：牽牛星らしさが現れるのが遅い。若い時代は環境に従属し、親や先生に褒められることが自尊心を満たすが本来の燃焼ではない。自我に目覚めるような出来事がきっかけとなり、そこから自尊心や役割意識が急速に強まる。きっかけの出来事がその後の自尊心の底辺に核として残る。美意識や特権意識がある平和型の自尊心で、争いを極力避けて通る。「高堂の自尊心」——社会性を持った価値の中で発動し、社会的地位が高ければ最良の自尊心となるが、身分が低い時は争いから逃げ回る人のように見える。入れ物（高堂）が大事。",
        "乙": "木性の牽牛星（遅咲きの自尊心）：自尊心の中に強い攻撃性を所有し、現わし方は相当に鋭くある一点に集中する特質。自尊心ゆえに死を選ぶこともあり、死と自尊心を計りにかければ自尊心の方が重きを成す。名誉のために戦ったり実よりも名を残し大切にする思いが強い。直線的な単純さによって支えられ論理が介入する余地を与えない。自我に目覚める出来事がきっかけで自尊心が急速に強まる。",
        "丙": "火性の牽牛星（大衆の自尊心）：混沌とした火性と牽牛星の秩序性は相反する相剋。気品や品性、大義名分すら表に出にくく、庶民的な自己満足に近い自分流の自尊心。大衆が社会に対して抱く不満をみんなと共に戦って解消しようとする姿。若い時は役割意識を探し、方向感がないまま周囲を気にして他人と自分を常に比べ妬みや恨みも生まれる。物事を完成させることが自尊心の完全燃焼につながり、「不言実行型の自尊心」。形として成果を示すことが大事。長い時間の経過後に現れる。",
        "丁": "火性の牽牛星（大衆の自尊心）：自尊心が動の中で発揮され外からはわかりにくい。はっきりした主義主張ではなくその時その時の状況から生まれる自尊心で、庶民的・大衆的。社会的地位や名誉に関しての自尊心にはならない。日常生活のルールや礼儀礼節にこだわる心が強く、筋を通す人。親子・夫婦など各領域で礼儀・礼節を重んじ、それが守られないと即自尊心が傷つく。出世や成功を目指す自尊心ではなく実生活の中で発揮される。",
        "戊": "土性の牽牛星（プロフェッショナルの自尊心）：領域を作る土性と牽牛星の役割意識が一致し、牽牛星らしさが発揮できる。密度が濃くなり試練も濃くなって磨かれた牽牛星になる。専門分野においては即座に対応できる精神を持ち、問題解決能力が高いプロフェッショナルな仕事世界を作る。白紙から創造する力はないが、ヒントや既成状況があれば改良し拡大する力を持つ。柔質で傍目からは自尊心がないようにも見える。大きな目的に向かってゆっくり前進し、試練の度に真の自尊心を形成。スケールの大きい人になり大衆に理解されやすい。「出世運を持った牽牛星」。",
        "己": "土性の牽牛星（プロフェッショナルの自尊心）：何事についても素直な自尊心の表出で、外からは単純に「気位高い人」とみられる。自尊心が満たされない環境では葛藤が大きく、プライドだけの自己主張で反感を買うことも。自尊心を満たす他の能力が必要で、そのうえで燃焼することで肯定されやすい。策略や策謀がないためやや幼児的な自尊心となりやすいが、正直・単純・純粋ということで肯定される人間性。専門分野を持ち試練を超えてプロフェッショナルになる。",
        "庚": "金性の牽牛星（内戦の自尊心）：社会性を意識する牽牛星と金性の個人行動は相いれず、その相剋が自分を作り替える。自然に自己訓練の世界に入り、自分で自分を作り替えて行く。本能的バランス思考が生まれる。自分が自分と戦う内戦状態で、年齢とともに人間的次元の高さを作り出し自己を律する力が強く働く。内に爆発性をかかえながら表面は最大の制御力を持つが、外からは葛藤や努力は見えない。激しさと責任感の狭間で時に自爆する可能性も（武人の生き方）。伝統を重んじ国家や民族等の大義名分を欲する潜在願望。自尊心が奥深いところで燃え、ある一点に集中。主に自己表現の世界で自尊心の強さを現わし、自己宣伝・売名になることも。良好な面に出れば時代のヒーロー・人気者として輝く。",
        "辛": "金性の牽牛星（内戦の自尊心）：自尊心やプライドが特定の分野だけで現れず、すべて万遍なく平均的に働く。「常に」自尊心が能動的に現れ、傍目からはやや高慢な態度にみられる。自尊心を隠す謙遜がなく、常に自尊心が能動的に現れる。自分の内面のみを表出し相手の意を解さない場合も。マイペースに孤高を保てる自尊心。自己訓練で自分を作り替え、内に爆発性をかかえながら表面は最大の制御力を持つ。",
        "壬": "水性の牽牛星（隠れた名声）：水性の水気が強く牽牛星の闘争的部分を隠す。一見龍高性的な性状（客観性・改革性）が表出。名誉名声への意欲は消えないが自分に向かうのではなく、友人・配偶者等自分をとりまく人たちの名誉名声を望む。他人に名声を授ける力で、自分は一歩下がって隠れ神界の人となって地上の人を持ち上げる。人間的次元の高まりが早い要素があるが、現実的な役割を果たす力は削がれ当たり前の現実生活が苦手になる。創造・芸術等の世界が居場所にも。自尊心自体に目的が生まれず全ての行為・想念の中に発揮され、まんべんなく表出する自己愛の強い自尊心。何事に対しても負けん気が強く競争心を持ち、優越感を味わうことで満たされる。理性・知性で論じられない庶民的な自尊心。",
        "癸": "水性の牽牛星（隠れた名声）：外側に開示される自尊心ではなく自分の心（内面）で強く意識する。地位や役割に比例して自意識過剰傾向。柔軟性に欠け、自尊心を傷つけられる相手を強く嫌う。自分の大変さや苦しみを他人に見せまいとするやせ我慢的な牽牛星。「皇帝の自尊心」と呼ばれ、内面を秘す感覚を所有。水性の知性が表に出て牽牛星の闘争部分は隠れ、他人の名誉名声を望む傾向。創造・芸術等の世界が居場所にも。"
      },
      hidden: {
        balanced: "実は他人の目が気になって仕方ない。内面のバランスが評価への執着を健全な自己研鑽に変えられる。",
        moderate: "実は他人の目が気になって仕方ない。評価されることで自分を保っている。",
        imbalanced: "実は他人の目が気になって仕方ない。内面の偏りが評価への依存を極限化し、他人の評価がないと自分を保てなくなる。"
      }
    },
    龍高星: {
      good: {
        balanced: "改革力と冒険心がある。内面のバランスが独創性を安定した変革力に変え、継続的な革新を実現する。",
        moderate: "改革力と冒険心がある。型破りな発想で新しい道を切り開く。既存の枠に収まらない創造性。未知の世界に興味を持ち、学ぶことで新しいアイデアが生まれる。自分で確かめたことだけを信じる。行動の中で本当の力が発揮され、人に頼らず自分で道を切り開く。",
        imbalanced: "改革力はあるが内面の偏りが衝動性を極限化し、破壊と離脱を繰り返す浮き草人生になりやすい。"
      },
      bad: {
        balanced: "飽きっぽい傾向はあるが、内面のバランスが継続力を与え、面白くなくなっても最後までやり遂げられる。",
        moderate: "飽きっぽく、続かない。面白くなるとすぐ放り出し、信用を失う。束縛を嫌いすぎて関係を壊す。自分の意見にこだわりすぎて他を受け入れられない。",
        imbalanced: "内面の偏りが飽きっぽさを極限化し、何も継続できず信用を失いやすく、束縛を嫌うあまり関係が不安定になりやすい。"
      },
      work: {
        balanced: "新規事業や改革で力を発揮する。内面のバランスが継続性を与え、プロジェクトを最後まで遂行できる。",
        moderate: "新規事業や改革で力を発揮するが、継続性がなくプロジェクトを中途半端にする。",
        imbalanced: "内面の偏りが継続性を欠き、プロジェクトを中途半端に放り出して信用を失う。"
      },
      love: {
        balanced: "刺激的な恋愛を好む。内面のバランスが関係が落ち着いても逃げず、深い絆を築ける。",
        moderate: "刺激的な恋愛を好むが、関係が落ち着くと逃げたくなる。束縛を最も嫌う。",
        imbalanced: "内面の偏りが刺激への依存を極限化し、関係が落ち着くと逃げ出しやすく、束縛されると反発して関係が不安定になりやすい。"
      },
      money: {
        balanced: "新しいことに投資する。内面のバランスが衝動買いを抑え、投資を継続して成果を出せる。",
        moderate: "新しいことに投資するが、飽きて放置する。金銭管理はルーズで、衝動買いが多い。",
        imbalanced: "内面の偏りが衝動買いをエスカレートさせ、金銭管理がルーズで投資も全て放置する。"
      },
      marriage: {
        balanced: "結婚に「自由と刺激」を求める。内面のバランスが日常の繰り返しにも耐え、自由と安定を両立できる。",
        moderate: "結婚に「自由と刺激」を求める。日常の繰り返しに飽きて浮気や離婚のリスクが高い。束縛されると即座に関係を壊す。",
        imbalanced: "内面の偏りが日常への耐性を奪い、浮気や離婚のリスクが高く、束縛されると関係が不安定になりやすい。"
      },
      social: {
        balanced: "社交性は面白い人を探すタイプ。内面のバランスが広い人脈の中に深い関係も作り、落としどころを見つける。",
        moderate: "社交性は面白い人を探すタイプ。型破りな人や刺激的な環境に惹かれるが、関係が落ち着くとすぐに次を探す。人脈は広いが浅い。",
        imbalanced: "内面の偏りが人脈の浅さを固定化し、刺激を求めて関係を渡り歩き、深く繋がれにくい。"
      },
      byDayStem: {
        "甲": "木性の龍高星（探究の創造）：放浪的要素が少なく忍耐力が強い。行動範囲を狭くする反面創造性を強くする。既存を既存として受け止めず「なぜ」という疑問から始まり別の何かを模索。観察力は多面におよび新しい改良の創造が生まれる。最大稼動すると通常変人に見えるが新しい世界・事物を生み出す欠かせない存在。物事を知りたい欲求を深く掘り下げ、広がりよりも探究心が強く現れる。研究・創造の能力。自力本願で人に頼ることを嫌う。",
        "乙": "木性の龍高星（探究の創造）：放浪的要素が少なく忍耐力が強い。裏・陰がキーワードで人生の裏街道的なところで発揮される知力。人の裏面を観察する力があり、交渉事やものごとの対応策（改革性）が得手。根幹の改革にはつながらないエネルギーで、名補佐役・参謀役のエネルギーとなる。既存に対して常に改革的意識で見る本性を持ち、なぜという疑問からくる探求心と改良の精神を持つ。",
        "丙": "火性の龍高星（混沌の探究）：混沌とした火性と探究する龍高星は一致点が多い。未知の世界への興味・好奇心が旺盛で不安に対しては強い忍耐力を発揮。方向の定まらない環境ではがぜん力を発揮するが、その場その場の働きで連続や継続がなく瞬間芸。一種のアイデア的素要で単発性が特徴。芸術性・創造性も小さい作品作りという限られた範疇。現代芸術など「今」を冠とした創造の世界で活躍期待。心に広大な夢が広がり国境が意味を成さない星。自分が知りたいことを素直に行動し、アプローチに多様性が生まれ動くこと改革することが多岐にわたる。一芸は万芸に通じ、行動することで博識になる。",
        "丁": "火性の龍高星（混沌の探究）：混沌とした火性と探究の一致で好奇心旺盛。「知」を求めるのにストレートではなく遠回りし時間を必要とする。時間をかけた分知力は広く深くなり広がりのある想像力となる。地味な忍耐強さも発揮。忍耐と芸術創造の龍高星と呼ばれる。自分を取り巻く環境を上手に利用して事をなす柔軟性があり、その中で放浪・改革が成し遂げられる。瞬間芸的だが深い知力を持つ。",
        "戊": "土性の龍高星（沈潜の探究）：土性の領域が龍高星の動きを狭め放浪性を小さくする。忍耐力や耐久力は最大限に強くなる。自由が消えて忍耐となり、エネルギーは横へ広がるのではなく深く地中へ沈み込む。窮屈になったエネルギーが蓄積され、一定期間後に爆発する。深い探求力・研究心は専門分野で優れた知力。創造された作品や作家としての自分が幅広い引力を生み多くの人の心を引きつける。奥深く潜る性質で外からは心が読みにくく、事があると深く隠れる。反既存の本質を持ちつつ視野が広くこだわりが強くならず、趣味的な感覚で探究心が起こる。学問よりも生活の知恵で、別世界の知恵を導入する改革。",
        "己": "土性の龍高星（沈潜の探究）：放浪性と改革性が精神世界において発揮される。精神の次元の高さによって能力が変わり、高ければ新しい世界を創造する人・時代と社会の先駆者的存在、低ければ不安定な精神状態で人生の浮浪人となる。自由な活動力は影を潜めて忍耐力が強く、エネルギーは地中へ沈み込む。蓄積後の爆発特性。奥深く潜る性質で深い探求力・研究心を持つ。",
        "庚": "金性の龍高星（激する探究）：忍耐力にはならず、平穏で動きの少ない世界にいると爆発的な現象が起こる。自己の想いと心の中身が行動として常に表れる。放浪性は冒険に近く、突発的に外国へ行ったり旅に出たりして創造のヒントを得て発明・発見など新しい分野を開拓。激する知性は視野を小さくし優れた集中力やこだわる力となって研究・発明・発見につながるが、内面の激しさが変人・奇人の人格を構成する可能性。自分の世界に入り込む思考で周囲を気にせず自己のペースで改革も探究も行い時に自分勝手。自己表現は少なく忍耐力は強く規制を嫌い自分の世界を生きる。",
        "辛": "金性の龍高星（激する探究）：忍耐力は薄く、目的意識の薄い放浪性で単に移動することを好む。環境の変化を求める動きで旅行・移転などを好む。動くことそのことが改革を意味。物事を育む能力を備え教育的要素を持つ。動植物を育てることも特徴。激する知性で集中力やこだわる力があり発明・発見につながるが変人・奇人の可能性も。自分の思い通りの行動をとり新しい分野を開拓。",
        "壬": "水性の龍高星（放浪の探究）：水性が二重に働きコントロール不能の状態が生まれる。忍耐力は隠れて放浪性や外交性及び反体制的な改革性が強く現れる。エネルギー燃焼ができない環境で限界点を超えると一気に爆発し、人生の根幹を破壊するほどの爆発力。環境が味方すれば活動範囲の大きさと創造性の豊かさで国際的な活躍。冷静な観察力と適確な批判精神。肉親・兄弟に縁厚くとも自らが孤独・孤立の道を好み細かい情にとらわれない。平穏より波乱の状況でエネルギー発揮。スケールが大きく情的には欠落感が生じ冷たい人間性と思われることも。旺盛な前進力で行動的で動くことで広範囲な知識を吸収。目の前の今より過去や未来に興味が向かい、過去（歴史・伝統）や先見性によって今を批判する。庚の闘争心で批判が過熱して争いになることも。反社会的な思考。",
        "癸": "水性の龍高星（放浪の探究）：水性が二重に働きコントロール不能の状態。忍耐力は隠れて放浪性・外交性・反体制的改革性が強く現れる。燃焼できない環境で限界を超えると人生の根幹を破壊するほどの爆発。環境が味方すれば国際的活躍。知識欲習得力は旺盛だが形にこだわり、名のある先生や教育機関のグレードにこだわる。雑学的な学びはなく大義名分のために学ぶ。ライセンスや証書の類を必要とし、いくつもの自己証明を繰り返すことが改革と放浪を満たす。冷静な観察力と批判精神。スケールが大きく細かい情にとらわれない。"
      },
      hidden: {
        balanced: "実は退屈が死ぬほど嫌い。内面のバランスがその空洞を創造的なエネルギーに変え、刺激を建設的に使える。",
        moderate: "実は退屈が死ぬほど嫌い。刺激を求めるのは、自分の内面の空洞を埋めるため。",
        imbalanced: "実は退屈が死ぬほど嫌い。内面の偏りが内面の空洞を拡大し、刺激を求めて破壊的な行動に走りやすい。"
      }
    },
    玉堂星: {
      good: {
        balanced: "知性と学習力が高い。内面のバランスが知性を実践力に結びつけ、学んだことを現実で活かせる。",
        moderate: "知性と学習力が高い。伝統を重んじ、教養を活かせる。論理的思考と指導力を併せ持つ。先生や本から学ぶのが得意で、座って学ぶことを好む。受け継いだ知識を深く解釈し、より良い形にして次の世代に伝える。伝統を土台にしながらも、独自の視点を加える創造性がある。",
        imbalanced: "知性は高いが内面の偏りが理屈への依存を深め、頭でっかちで行動できない評論家タイプになる。"
      },
      bad: {
        balanced: "理屈で逃げる傾向はあるが、内面のバランスが現場感覚を育て、知識を行動に結びつける。",
        moderate: "理屈で逃げ、行動が伴わない。現場感覚が育たず、頭でっかちになる。人を見下す癖がある。人生をいそぎ過ぎると小手先の知識となり心がともなわない言葉ばかりの状態になりやすい。",
        imbalanced: "内面の偏りが理屈への逃避を極限化し、現場感覚に欠け人を見下す癖が強まり、頭でっかちになりやすい。"
      },
      work: {
        balanced: "知識と資格で評価される。内面のバランスが実行力も与え、現場から浮かずに活躍できる。",
        moderate: "知識と資格で評価されるが、理屈ばかりで現場から浮く。実行力が不足する。",
        imbalanced: "内面の偏りが実行力を欠きがちで、理屈ばかりで現場から浮きやすく評価されにくい。"
      },
      love: {
        balanced: "知的な会話で関係を深める。内面のバランスが考えすぎを抑え、適切なタイミングで行動できる。",
        moderate: "知的な会話で関係を深めるが、考えすぎて行動が遅く、チャンスを逃す。",
        imbalanced: "内面の偏りが考えすぎを極限化し、行動が遅くなりがちでチャンスを逃しやすい。"
      },
      money: {
        balanced: "教育や資格にお金をかける。内面のバランスが投資に実行力を与え、知識を現実の成果に変えられる。",
        moderate: "教育や資格にお金をかける。投資は理論派だが、実際の行動が伴わないことが多い。知識にお金を払うタイプ。",
        imbalanced: "内面の偏りが知識への投資をエスカレートさせるが行動が伴わず、知識だけ溜まって現実の成果に結びつかない。"
      },
      marriage: {
        balanced: "結婚は「知的なパートナーシップ」。内面のバランスが理屈と感情のバランスを取り、本音で向き合える。",
        moderate: "結婚は「知的なパートナーシップ」。教養や価値観の合致を重視するが、理屈で感情を否定してすれ違う。",
        imbalanced: "内面の偏りが理屈で感情を否定しがちで、パートナーとのすれ違いが深刻化して関係が冷え込む。"
      },
      social: {
        balanced: "社交性は知的な会話ができる相手に限定される。内面のバランスが幅広い人との対話も可能にし、理屈で人を遠ざけない。",
        moderate: "社交性は知的な会話ができる相手に限定される。教養のない人や無意味な雑談を嫌う。集団では理屈をこねて人を遠ざけ、孤立することがある。",
        imbalanced: "内面の偏りが知的な会話以外を拒絶しがちで、理屈をこねて人を遠ざけ孤立しやすくなる。"
      },
      byDayStem: {
        "甲": "木性の玉堂星（正統の学問）：玉堂星の標準型で正統な学問のエネルギー。伝統・古典に支えられているものを好む。創造性より「学ぶこと」に心をひかれる。教育の要素が強く、始まりは自分流でも最終的には正統な道に至る。情の部分がかなり含まれ庶民性を持つが社会性には欠ける。「生涯学生」と呼ばれ、いくつになっても習得しようとする意欲は衰えず晩年に至って学業は一つの形を成す。長い時間をかけ浸透する水のような知恵で年齢とともに大きくなる。知恵の確立に時間がかかり、人生の出発では知恵なき人のように見られる。現実界では生かし難い知恵で知恵のみが独立する。学問・芸術に最も良さを発揮するが、仕事的・実践的な知力には弱さ。",
        "乙": "木性の玉堂星（正統の学問）：玉堂星の標準型で正統な学問。伝統・古典を好み「学ぶこと」に心をひかれる。教育の要素が強い。情の部分が含まれ庶民性を持つ。「生涯学生」。「動」の中で得る知恵だが即現実に結び付かない。職業や仕事とは関係なく「動」からの知恵（体験的に得る知識）。人生に波乱が多いほど大きい知恵を得る。得た知識で人を導く・助言する姿の中で最も燃焼しやすい。実践的な知恵とは呼べない一面があり、知恵が現実を求めず独立を保つ。無欲な知恵で生活現実とは別のところで稼働。",
        "丙": "火性の玉堂星（初代創造）：人間界の伝統や歴史に頼らず自分初の独創的な知性を創出。一つの思考が百年千年と続く要因を秘めた創造性で、伝統の出発点を作る知性。神界と人間界の違い（水剋火）という本性的葛藤から生まれた創造力で、自分の考えが個人的に有用かつ有益には使えない。独学的要素が強く師に就かず自己流。追い込まれたときに策士的な知恵が生まれ、試験で落とすと落第というときに突然好成績。どのような環境にも順応する広がりのある知恵で、物事に対応・対処する場面で素早く的確に反応。要領の良い知恵で生活上のアイデアが豊富。主義信条的ではないので大きなまとまりを作らず体系化されない弱点。一貫性のない知恵に見えるが時代と社会の変貌時には最大限に生かされる。清濁・善悪両面が極端にあらわれ知恵ゆえに真の人間性を理解されない部分が生まれる。",
        "丁": "火性の玉堂星（初代創造）：人間界の伝統に頼らず自分初の独創的知性。伝統の出発点を作る知性。独学的で師に就かず自己流。追い込まれたときに策士的な知恵が生まれる。伝統を重んじ先代・先々代からの知恵を素直に受け継ぐ古典的玉堂星。改革性や自分一代の知恵が少なく大きな流れの一部分を担うイメージ。民族意識が強く国家・一族という単位を思考の根元に位置させる。身につけた知識を後継者に受け継がせようとする欲求が強く伝統を守ろうとする。学問・芸術の知恵よりも生活の知恵・世渡りの知恵が大きくなり、人生の窮地からの脱出にも役立つ。精神世界より現実世界で強く発揮される。",
        "戊": "土性の玉堂星（沈潜の教養）：土性の地冲に引き込む引力が玉堂星にも及び、知性・理性など高い次元の性情がすべて地中へ沈む。若年期は理性・知性が無いように見える。地味な教養の積み重ねで年齢とともに少しずつ表面化し、中年期以降に本来の姿が現れる。学ぶ力が記憶ではなく自然の蓄積力によって構成。専門分野における創造性は相当の力量。行動面では龍高星的な探求心を持ち、思考面では玉堂星そのままの教養を発揮。常に眼前の現実界から学び取ったことを精神的自己形成に役立てようとする。「市井の哲学者」。個人的に体系化し人生観から他人の賛意を得る哲学・思想へと高める。独特の説得力が生まれ精神的な交流を保つ仲間を多く持つ。",
        "己": "土性の玉堂星（沈潜の教養）：土性の引力で知性・理性が地中へ沈む。若年期は知性がないように見え、地味な教養の積み重ねで年齢とともに表面化。中年期以降に本領発揮。学ぶ力が自然の蓄積力で構成され、専門分野で創造性を発揮。行動面では龍高星的な探求心、思考面では玉堂星そのままの教養を発揮。深く思案することがなくその時々で自由な発想。古典・伝統の側面は薄れ臨機応変の知恵。根底は「応用の知恵」で無から有を生じるのではなく「有」から新しい「有」を創造。先達が遺した知恵を改良し応用できる知恵に作り変える。時代を保守性の中で推し進める知恵。",
        "庚": "金性の玉堂星（激する知性）：金性の爆発性や激攻性が玉堂の知性理性を支え、激しさを所有する玉堂星。文戦・言戦といわれ文字・言葉による攻撃として受身が欠落する可能性。知性をもって世を見たときある種の怒りを覚える気質。不合理に怒り世の中の悪に怒り、言動による攻撃として表出。動乱期戦乱期に水を得るが平穏な中では不満と反抗が芽生え心から休まらない。伝統の中から戦いの知恵を取り出す能力にめぐまれ歴史の流れをたくみに利用。温故知新型。視野は大きく鋭い観察力を持つが知に走り徳の形成が出来にくい。統計分析や過去のデータを未来に生かす能力で軍師・参謀的要素を持つが長としての器に欠ける。柔軟性と庶民性を持った知恵で現実味が強く幅広い範囲で知識を求める。万人に理解される常識感を持ち個性は薄いが偏りのない知恵。時代の流れに従った創造力で即社会に活かせる。",
        "辛": "金性の玉堂星（激する知性）：金性の激攻性が玉堂の知性を支え激しさを所有。文戦・言戦で言葉による攻撃。知性をもって世を見たとき怒りを覚える気質。動乱期に水を得るが平穏では不満と反抗。伝統から戦いの知恵を取り出し歴史を利用する温故知新型。視野は大きく観察力は鋭いが知に走り徳の形成が出来にくい。軍師・参謀的要素。自分からの能動的な動きは少なく与えられるもののみを知恵とする。与えられるものが多ければ大きな知恵、少なければ小さな知恵。環境や指導者の影響が大きく成長状況が後年の姿を決める。「静なる知恵」で固定観念が強く時代の変化に対応し難い。臨機応変さはなく伝統性は強く維持できる。",
        "壬": "水性の玉堂星（陰の習得）：水性が二重に働き陰の気が拡大。習得力は強いが創造性や伝承性は小さくなり、習得のみに偏る。習得したものが形になり難く現実味が薄い。人間的にはやさしさを身につけ身の程を知り自分の枠をはみ出ない。自分の心の中が表に出ない仕組みを作り表現力に乏しく外からの理解を得にくく孤独感が強い。実際は細やかな情愛に厚く行動によって情愛を表わす。愛情豊かに育ったかが分かれ目で、恵まれないと極端な現実主義者になり相手を許せなくなる。恵まれると内面でバランスの取れた心を作る。「終りに強い星」（結果オーライ）。常に特別意識を持った知恵で、人より自分の方がすぐれていると自覚することで安住。常に学んでいなければ安心感がなく、知識欲と心の安住が一体で学んでいること自体が大事。創造力は大きく企画や計画で最大の力を発揮。",
        "癸": "水性の玉堂星（陰の習得）：水性が二重に働き陰の気が拡大。習得力は強いが創造性や伝承性は薄れ現実味も薄い。表現力に乏しく外から理解を得にくく孤独感が強いが、実際は細やかな情愛に厚く行動で表わす。愛情豊かに育ったかが分かれ目。「終りに強い星」。外からも知恵があることが分かりやすい状態で「頭が良い人」とみられやすい。知恵を発揮し発揮することによってまた新しい知恵を掴む循環の中で常に新鮮な知恵を養う。行動と知恵が一体で行動が停止すれば知恵も停止。実践家の知恵で行動を意識した知恵が湧き出る。学問・芸術でも職業や仕事に直結するものを身につける。"
      },
      hidden: {
        balanced: "実は知識で人を測る癖がある。内面のバランスがその傾向を客観的思考で中和し、現場の価値も認められる。",
        moderate: "実は知識で人を測る癖がある。学ぶことは安全だから好き。未知の現場は怖い。",
        imbalanced: "実は知識で人を測る癖がある。内面の偏りが知識への依存を深め、未知の現場を極端に怖がり何も行動できない。"
      }
    }
  };

  const starByDayStem = {};
  for (const [star, data] of Object.entries(starPersonality)) {
    if (data.byDayStem) {
      starByDayStem[star] = data.byDayStem;
      delete data.byDayStem;
    }
  }

  // 日干の陰陽×五行の性格
  const dayStemPersonality = {
    "甲": { good: "大木のように真っ直ぐ伸びる成長力。リーダーシップがあり、自分の信念を曲げない。", bad: "上から押し付ける威圧感が出る。自分のやり方が正しいと思い込み、柔軟性を失う。" },
    "乙": { good: "花や草のように柔軟で適応力が高い。周囲に合わせながら成長する協調性がある。", bad: "依存心が強く、自分で決められない。周囲に合わせすぎて本心を見失う。" },
    "丙": { good: "太陽のように明るく情熱的。周囲を照らし、エネルギーを与える存在感がある。", bad: "熱しやすく冷めやすい。自己中心的な感情で周囲を振り回す。見栄っ張り。" },
    "丁": { good: "灯火のように繊細で温かい。内面に強い光を持ち、人を導く優しさがある。", bad: "神経質で執着しやすい。小さなことにこだわり、視野が狭くなる。" },
    "戊": { good: "大山のように安定し、信頼される。包容力があり、周囲の支柱になる。", bad: "頑固で変化に弱い。一度動き出すと止まらず、周囲の意見を無視する。" },
    "己": { good: "田土のように育てる力がある。面倒見が良く、人を成長させる母性を持つ。", bad: "心配性で干渉しすぎる。他人の問題に首を突っ込み、境界線が曖昧になる。" },
    "庚": { good: "刃物のように潔く意志が強い。ルールを重んじ、不正を許さない正義感がある。", bad: "冷たさと排他性が出る。自分と違うものを切り捨て、人を傷つける。" },
    "辛": { good: "宝石のように繊細で美しい。審美眼が高く、本質を見抜く洞察力がある。", bad: "傷つきやすく、執着が強い。自分の価値を過小評価し、嫉妬深くなる。" },
    "壬": { good: "大海のようにスケールが大きい。柔軟性と包容力で何でも受け入れる。", bad: "流されやすく、自分の意見がない。不安になりやすく、準備不足で失敗する。" },
    "癸": { good: "雨水のように静かに浸透する。直感力と洞察力が高く、人の心を読む。", bad: "陰湿で恨みを持ちやすい。ネガティブ思考に沈み、自分から動けない。" }
  };

  // 五行偏りの性格傾向
  const gogyoPersonality = {
    "木": { good: "成長意欲と向上心が強い。筋を通す正義感があり、自分を伸ばす努力を惜しまない。", bad: "独善的で人の意見に耳を貸さない。自分が正しいと思い込んで突き進み、周囲を置き去りにする。" },
    "火": { good: "情熱と表現力に富む。明るさで周囲を照らし、直感力と行動力が高い。", bad: "感情的になりやすく、熱しやすく冷めやすい。衝動的に行動して後悔する。見栄っ張り。" },
    "土": { good: "安定感と信頼感がある。約束を守り、根を張る。面倒見が良く、人を支える。", bad: "頑固で変化に弱い。自分の殻に閉じこもり、新しい刺激を拒絶する。心配性で干渉しすぎる。" },
    "金": { good: "意志の強さと潔さがある。ルールを重んじ、筋を通す。決断力と責任感が高い。", bad: "冷たさと排他性が出る。自分と違うものを切り捨て、視野が狭くなる。人を傷つけることに鈍感。" },
    "水": { good: "柔軟性と適応力が高い。状況を読む洞察力があり、何にでも対応できる。", bad: "流されやすく、自分の意見がない。不安になりやすく、準備不足で失敗する。逃げ癖がある。" }
  };

  // 五行偏りから見る金銭感覚
  const gogyoMoney = {
    "木": "自分の成長やスキルにお金をかける。投資は自分自身が対象。無駄遣いは嫌うが、こだわりには散財する。",
    "火": "勢いと感情でお金を使う。見栄やテンションで出費が膨らむ。キャンペーンやセールに弱い。",
    "土": "貯金と蓄財が基本。無駄遣いを嫌い、堅実に貯める。しかし守ることに固執して成長投資を怠る。",
    "金": "お金は「切る」もの。投資判断は潔いが、切りすぎて生活が寂しくなる。金銭管理はルール重視。",
    "水": "お金は流れるもの。柔軟に使うが、流されすぎて貯まらない。情報投資や人脈投資にお金をかける。"
  };

  // 五行偏りから見る結婚観
  const gogyoMarriage = {
    "木": "結婚は「共に成長する関係」を求める。自分の信念を曲げないため、価値観の違いで衝突しやすい。",
    "火": "結婚に「情熱と楽しさ」を求める。冷めると急に関係が冷える。日常の退屈が最大の敵。",
    "土": "結婚は「安心の基盤」。安定した家庭を築くが、変化を恐れて関係が硬直化する。",
    "金": "結婚は「約束と責任」。ルールを重んじるが、冷たさが出ると相手が離れていく。",
    "水": "結婚は「流れに任せる」。柔軟に合わせるが、自分の意見がなく相手に依存しがち。"
  };

  // 日干から見る金銭感覚・結婚観
  const dayStemMoney = {
    "甲": "自分の道に投資する。大きな目標のために資金を集めるが、自分のやり方に固執して損をする。",
    "乙": "人に合わせてお金を使う。付き合いで出費がかさむが、自分のためには使えない。",
    "丙": "見栄と情熱で散財する。人に奢るのが好きだが、気づいたら財布が空いている。",
    "丁": "こだわりにお金をかける。質や雰囲気を重視し、少額でも納得いくものにしか払わない。",
    "戊": "蓄財が得意。大きな山のように貯めるが、一度動き出すと止まらない出費がある。",
    "己": "家族や身近な人にお金を使う。出費の管理が甘くなりがちで、気づいたら他人に流れている。",
    "庚": "潔くお金を使う。必要なものには投資するが、不要なものは一切払わない。金銭感覚は明確。",
    "辛": "美しさにお金をかける。ブランドや質にこだわるが、自分の価値に見合わない出費をしてしまう。",
    "壬": "スケールが大きい。大きな投資に手を出すが、準備不足で失敗しやすい。お金は流れるものと考える。",
    "癸": "静かにお金を貯めるタイプだが、不安から過剰に備蓄して使うタイミングを逃す。"
  };
  const dayStemMarriage = {
    "甲": "結婚は「自分の信念を共有できる相手」を求める。リーダーシップをとるが、相手を押し付けがち。",
    "乙": "結婚は「寄り添う関係」。相手に依存しがちで、自立を求められると不安になる。",
    "丙": "結婚に「明るさと情熱」を求める。家庭を照らす存在だが、自己中心的な振る舞いで相手を疲れさせる。",
    "丁": "結婚は「温かい家庭」。家族を大切にするが、神経質で細かいことにこだわって相手を疲れさせる。",
    "戊": "結婚は「安定の城」。家族を守るが、頑固さで家庭が硬直化する。一度決めたら動かない。",
    "己": "結婚は「家族を育てること」。面倒見が良いが、干渉しすぎて相手の自由を奪う。",
    "庚": "結婚は「筋を通す関係」。約束を守るが、冷たさが出ると相手が離れていく。",
    "辛": "結婚に「美しさと品位」を求める。理想が高く、現実のパートナーに失望しやすい。",
    "壬": "結婚は「大きな器で受け入れる関係」。柔軟だが、流されすぎて自分の意見がない。",
    "癸": "結婚は「静かに寄り添う関係」。直感で相手を読むが、ネガティブ思考で関係を冷えさせる。"
  };

  // 日干から見る社交性
  const dayStemSocial = {
    "甲": "集団の中で自然にリーダー的位置に立つ。人を引っ張るのが得意だが、自分の意見を押し付けて人を遠ざける。",
    "乙": "集団に溶け込むのが上手い。誰とでも協調するが、自分の意見がなく流されやすい。",
    "丙": "明るさで場を支配する。注目を浴びるのが好きで、人が集まる場所にいる。ただし自己中心的で空気が読めない時がある。",
    "丁": "少数の深い関係を好む。大人数の中では控えめで、親しい人の前では温かい。初対面では警戒心が強い。",
    "戊": "集団の支柱になる。頼りにされるが、頑固で自分の殻に閉じこもり、新しい人を受け入れない。",
    "己": "面倒見の良さで人を集める。誰からも相談されやすいが、干渉しすぎて境界線が曖昧になる。",
    "庚": "社交的だが選択的。合う人とは深く付き合うが、合わない人は一刀両断。集団ではルールを重んじる。",
    "辛": "繊細で警戒心が強い。自分の世界を大切にし、合わない集団には入らない。少数の仲間と深く繋がる。",
    "壬": "誰とでも広く付き合う。大人数が苦にならないが、関係が浅く、いざという時に頼れる人が少ない。",
    "癸": "静かに観察するタイプ。自らは話さず人を見て、直感で人を選ぶ。集団では影に徹するが、内心は鋭く人を見抜いている。"
  };

  // 五行偏りから見る社交性
  const gogyoSocial = {
    "木": "自分の信念を中心に人脈を築く。合わない人とは距離を置くが、志を同じくする人とは強い絆を作る。",
    "火": "感情と勢いで人を惹きつける。場を盛り上げる中心人物だが、熱しやすく冷めやすいので関係が長続きしない。",
    "土": "安定した圈子の中で深い関係を築く。新しい人間関係には慎重で、付き合いは長く続くが広がりに欠ける。",
    "金": "社交的だが選別が厳しい。合う人には潔く付き合うが、合わない人は切り捨てる。集団ではルールや秩序を重んじる。",
    "水": "柔軟に誰とでも付き合う。状況に合わせて立場を変えるが、自分の意見がなく、どの集団にも属しつつどこにも根付かない。"
  };

  // 十二大従星の性格傾向
  const energyPersonality = {
    "天報星": { good: { balanced: "前例のない新しい道を切り開く創造性と直観力がある。内面のバランスが二つの思考を同時に持てるバランス感覚を安定させる。", moderate: "前例のない新しい道を切り開く創造性と直観力がある。二つの思考を同時に持てるバランス感覚。", imbalanced: "前例のない新しい道を切り開く創造性があるが内面の偏りが思考の分散を極限化し、一つのことに注力するのが極めて困難になる。" }, bad: { balanced: "無自覚な言動になりやすいが内面のバランスが方向性をある程度保ち、不安も軽度に抑えられる。", moderate: "無自覚・無反省な言動になりやすく、方向が定まりにくい。行き過ぎると急ブレーキがかかり不安に襲われやすい。一つのことに注力するのが難しい。", imbalanced: "内面の偏りが無自覚さを極限化し、方向が定まりにくく不安に襲われやすく、一つのことに注力しにくくなる。" } },
    "天印星": { good: { balanced: "多面的な思考力と豊かな感性を持つ。内面のバランスが主体性も保ち、環境に適応しつつ自分らしさも発揮する。", moderate: "多面的な思考力と豊かな感性を持つ。目の前の現実に適応し、無自覚に周囲に必要なことを察知して知らしめる力がある。", imbalanced: "多面的な思考力と豊かな感性を持つが内面の偏りが環境依存を極限化し、主体性が薄れやすい。" }, bad: { balanced: "主体性が薄れやすいが内面のバランスが依存癖を抑え、天命を見失わずに済む。", moderate: "中身が環境で決まるため主体性が薄れやすい。依存癖が出ると信用を失い、自分の天命を見失う。", imbalanced: "内面の偏りが依存癖を極限化し、信用を失いやすく天命を見失いやすくなる。" } },
    "天貴星": { good: { balanced: "芽生えたての純粋な自意識と役割意識を持ち、試練によって磨かれていく。内面のバランスがプライドを適度に保ち、飛躍した発想も可能にする。", moderate: "芽生えたての純粋な自意識と役割意識を持ち、試練によって磨かれていく。コツコツと積み重ねる学習力があり、教える立場で綿密な準備力を発揮する。", imbalanced: "芽生えたての純粋な自意識を持つが内面の偏りがプライドを極限化し、独善的になり飛躍した発想に限界がある。" }, bad: { balanced: "自意識の裏側の弱さを隠しがちだが内面のバランスがプライドを適度に保ち、独善化を防ぐ。", moderate: "自意識の裏側にある弱さと不安を気負いや見栄で隠しがち。プライドが高すぎると独善的になり、飛躍した発想に限界がある。", imbalanced: "内面の偏りがプライドを極限化し、独善的になりやすく飛躍した発想がしにくくなる。" } },
    "天恍星": { good: { balanced: "現状打破の力と冒険心を持ち、常に新しい自分を求めて脱皮を繰り返す。内面のバランスが刺激への衝動を抑え、行動力を持続させる。", moderate: "現状打破の力と冒険心を持ち、常に新しい自分を求めて脱皮を繰り返す。正直で率直、夢やロマンに向かって突き進む行動力がある。", imbalanced: "現状打破の力と冒険心を持つが内面の偏りが刺激への欲求を極限化し、自己中心的な面が目立ち安定が奪われやすくなる。" }, bad: { balanced: "自意識が強いが内面のバランスが主観を客観でバランス取り、自己中心的な面を抑える。", moderate: "自意識が非常に強く、主観で動くため常識に縛られない自己中心的な面が出やすい。刺激を求める揺らぎが安定を奪う。", imbalanced: "内面の偏りが自意識を極限化し、自己中心的な面がエスカレートし安定が奪われやすくなる。" } },
    "天南星": { good: { balanced: "内的世界への固執が不屈の前進力となり、新しい世界を作り出す冒険者。内面のバランスが不器用さを柔軟性で補い、協力者も失わない。", moderate: "内的世界への固執が不屈の前進力となり、新しい世界を作り出す冒険者。一本気で純粋、一度交われば長く続く人間関係を作る。", imbalanced: "内的世界への固執が前進力となるが内面の偏りが不器用さを極限化し、怒りや敵対を生んで味方と敵が明確に分かれる。" }, bad: { balanced: "自分を曲げられない不器用さはあるが内面のバランスが批判力を建設的に向け、協力者を失わない。", moderate: "自分を曲げられない不器用さが怒りや敵対を生む。環境を無視した批判力で味方と敵が明確に分かれる。安住や後退には耐えられない。", imbalanced: "内面の偏りが不器用さを極限化し、怒りや敵対がエスカレートし協力者を失いやすくなる。" } },
    "天禄星": { good: { balanced: "自己保身的中庸バランスを保ち、全体的な観察から的確な行動をとる。内面のバランスが用心深さと適度な冒険のバランスを取り、職人として真価を発揮する。", moderate: "自己保身的中庸バランスを保ち、全体的な観察から的確な行動をとる。堅実な積み重ねで職人として真価を発揮し、経験則に基づく未来予測力を持つ。", imbalanced: "自己保身的中庸バランスを保つが内面の偏りが用心深さを行き過ぎさせ、冒険を避けがちで慎重すぎる印象になる。" }, bad: { balanced: "中庸の判断力が自己本位になりやすいが内面のバランスが全体バランスを保ち、人生の崩れを防ぐ。", moderate: "内側傾斜が中庸の判断力を自己本位にし、実利へ走ると人生全体のバランスを崩す。冒険を避け用心深すぎと引っ込み思案に見える。", imbalanced: "内面の偏りが自己本位を極限化し、実利へ走って人生全体のバランスが崩れやすくなる。" } },
    "天将星": { good: { balanced: "極まることで転換を作り出し、創造と破壊を繰り返しながら次元を上げる。内面のバランスが自我を健全なリーダーシップに変え、周囲に負担をかけない。", moderate: "極まることで転換を作り出し、創造と破壊を繰り返しながら次元を上げる。精神世界を渇望し、無形の知恵を現実に引き入れて活用する力に優れる。", imbalanced: "極まることで転換を作り出すが内面の偏りが自我を極限化し、周囲に負担をかけてでも自分を無にできない。" }, bad: { balanced: "自我と頑固さは強いが内面のバランスが周囲への配慮を保ち、協力者に負担をかけない。", moderate: "自我と頑固さが極めて強く、自分を無にできない。強すぎる運勢が周囲に負担をかけることも。幼少期はおだやかに見えるがエネルギーを内向して持て余す。", imbalanced: "内面の偏りが自我を極限化し、周囲に負担をかけやすく孤立しやすくなる。" } },
    "天堂星": { good: { balanced: "退気のエネルギーで一歩下がって道を譲る精神と強靭な自制心を持つ。内面のバランスが諦念を健全な謙虚さに変え、適度な自己主張も可能にする。", moderate: "退気のエネルギーで一歩下がって道を譲る精神と強靭な自制心を持つ。間断の気で年齢差のある関係や無言の世界で最大燃焼する。人を立てる謙虚さと単独行動向きの頑固さを併せ持つ。", imbalanced: "退気のエネルギーで道を譲る精神を持つが内面の偏りが諦念を極限化し、自己主張ができにくく人生が伸び悩みやすい。" }, bad: { balanced: "自己主張ができず引っ込み思案に見られがちだが内面のバランスが適度な主張を可能にし、居心地の悪さを軽減する。", moderate: "自己主張ができず引っ込み思案に見られがち。同年代・同性の環境では居心地の悪さを感じる。諦念が強すぎると人生が縮む。", imbalanced: "内面の偏りが諦念を極限化し、自己主張ができにくく人生が伸び悩みやすくなる。" } },
    "天胡星": { good: { balanced: "時間と場所を超越した発想を持ち、有から無を感知して無から新たな有を作る才能がある。内面のバランスが感性と現実感覚のバランスを取り、先見性を安定して発揮する。", moderate: "時間と場所を超越した発想を持ち、有から無を感知して無から新たな有を作る才能がある。美意識が強く、直感力と異常な集中力で先見性のある人生を構築できる。", imbalanced: "時間と場所を超越した発想を持つが内面の偏りが現実逃避を極限化し、周囲との協調が崩れやすく体調を崩しやすくなる。" }, bad: { balanced: "現実を居場所にできにくいが内面のバランスが現実感覚を保ち、周囲との協調をある程度維持する。", moderate: "現実を居場所にできず、時系列的な秩序を欠く発想で周囲との協調が難しい。精神が肉体を追い込み体調を崩しやすい。希望が閉ざされると現実が苦しくなりやすい。", imbalanced: "内面の偏りが現実逃避を極限化し、周囲との協調が崩れやすく希望が閉ざされると現実に苦しくなりやすい。" } },
    "天極星": { good: { balanced: "格差なき一次元思考で自由な思考転回ができ、環境に合わせて行動も思考も変化させる柔軟性がある。内面のバランスが主体性も与え、計画的に動く力を補う。", moderate: "格差なき一次元思考で自由な思考転回ができ、環境に合わせて行動も思考も変化させる柔軟性がある。回帰作用で異次元への飛翔力を持ち、自然体で今を生きる純粠さがある。", imbalanced: "自由な思考転回ができるが内面の偏りが環境依存を極限化し、自分から未来を志向する主体性が弱くなる。" }, bad: { balanced: "自力で現実を作りにくいが内面のバランスが主体性をある程度保ち、頭の切り換えも機能する。", moderate: "自力で現実を作れず環境依存になりやすい。発想の転換がきかず頭の切り換えが鈍い。自分から未来を志向して計画的に人生を構築する主体性が弱い。", imbalanced: "内面の偏りが環境依存を極限化し、主体性が弱く頭の切り換えも鈍りやすくなる。" } },
    "天庫星": { good: { balanced: "連結のない一筋の探究心で単一志向に突き進み、天性のバランス感覚で不自然・不合理を感知する。内面のバランスが執着を健全な探究に変え、社会協調も保つ。", moderate: "連結のない一筋の探究心で単一志向に突き進み、天性のバランス感覚で不自然・不合理を感知する。現実から精神を学び取る術に優れ、器用で多彩な能力と芸術的センスを発揮する。", imbalanced: "連結のない一筋の探究心で突き進むが内面の偏りが執着を極限化し、独断専行型の人生になり周囲が見えなくなる。" }, bad: { balanced: "社会協調が難しい面はあるが内面のバランスが執着を抑え、とらわれを防ぐ。", moderate: "現実を持たないエネルギーで社会協調が難しく、独断専行型の人生になりやすい。連結のない思考で周囲が見えなくなり、とらわれたものに呪縛される偏向傾向がある。", imbalanced: "内面の偏りが執着を極限化し、とらわれたものに強く縛られやすく社会協調が崩れやすくなる。" } },
    "天馳星": { good: { balanced: "点的今の連続で目の前のことに全力を注ぎ、成功も失敗も固執しないさっぱりとした精神を持つ。内面のバランスが分裂を健全な多芸多才に変え、持続力の限界も補う。", moderate: "点的今の連続で目の前のことに全力を注ぎ、成功も失敗も固執しないさっぱりとした精神を持つ。外動内静で動くほど精神は安定し、異質な分野の作業を並行してこなす多芸多才さがある。", imbalanced: "点的今の連続で全力を注ぐが内面の偏りが分裂を極限化し、まとまりを作れず一つに集中すると持続力が限界に達しやすくなる。" }, bad: { balanced: "分裂・分離の本性でまとまりを作りにくいが内面のバランスが持続力を補い、動けない環境でも肉体をある程度守る。", moderate: "分裂・分離の本性でまとまりを作れず、一つのことに集中すると持続力に限界がある。動けない環境だと肉体が破壊され病弱になりやすい。", imbalanced: "内面の偏りが分裂を極限化し、まとまりに欠け動けない環境だと体調を崩しやすくなる。" } }
  };

  const starP = starPersonality[center] || {};
  const northStar = mainStars.north;
  const southStar = mainStars.south;
  const northP = starPersonality[northStar] || {};
  const southP = starPersonality[southStar] || {};
  const dayP = dayStemPersonality[pillars.day.stem] || { good: "", bad: "" };
  const strongP = gogyoPersonality[strongest] || { good: "", bad: "" };
  const weakP = gogyoPersonality[weakest] || { good: "", bad: "" };
  const energyLabels = ["年柱（社会・家系のタイミング）", "月柱（仕事・中年期のタイミング）", "日柱（本質・配偶者のタイミング）"];
  const energyTexts = energy.map((e, i) => `【${energyLabels[i]}】${e.name}（${pickByBalance(energyPersonality[e.name]?.good, balanceType)?.split("。")[0] || ""}）`);
  const workEx = calcWorkExcellence(center, northStar, southStar, energy, counts, pillars);

  // 姓名判断の性格データを統合
  const seimeiGood = hasSeimei ? `【姓名判断・人格の性質（${seimei.jinGogyo}）】${seimeiPersonality.jinGogyo.good}\n【姓名判断・人格${seimei.jinRank?.rank}】${seimeiPersonality.jinRankText}\n【姓名判断・地格${seimei.chiRank?.rank}】${seimeiPersonality.chiRankText}\n【姓名判断・外格${seimei.gaiRank?.rank}】${seimeiPersonality.gaiRankText}` : "";
  const seimeiBad = hasSeimei ? `【姓名判断・人格の性質（${seimei.jinGogyo}）】${seimeiPersonality.jinGogyo.bad}\n【姓名判断・三才配置】${seimeiPersonality.sancaiText}` : "";

  // 主星相互関係
  const interactionNorth = getStarInteraction(center, mainStars.north, "north");
  const interactionSouth = getStarInteraction(center, mainStars.south, "south");
  const interactionEast = getStarInteraction(center, mainStars.east, "east");
  const interactionWest = getStarInteraction(center, mainStars.west, "west");
  const interactionEastWest = getStarInteraction(mainStars.east, mainStars.west, "west");

  // 主星×従星の組み合わせ
  const energyCombos = energy.map((e, i) => {
    const combo = getMainEnergyCombo(center, e.name);
    const timingDesc = i === 0 ? "社会や家系の中で" : i === 1 ? "仕事や中年期で" : "本質や配偶者との間で";
    return combo ? `【${energyLabels[i]}】${timingDesc}${combo}` : "";
  }).filter(Boolean);

  // extra データ（既存分析結果）
  const ex = extra || {};
  const ryudoText = ex.ryudo ? ex.ryudo.map(r => `${r.dir}：${r.advice.split("。")[0]}。`).join("\n") : "";
  const starBrief = { "牽牛星": "責任感・品格", "龍高星": "好奇心・探求", "玉堂星": "知性・学び", "車騎星": "行動力・勝負", "石門星": "協力・絆", "禄存星": "愛情・奉仕", "鳳閣星": "楽しさ・自由", "調舒星": "繊細・調和", "司禄星": "蓄積・実務", "貫索星": "独立・貫徹" };
  const junkanText = ex.junkan && ex.junkan.chain && ex.junkan.chain.length > 1
    ? `物事を考える時の基本姿勢は「${ex.junkan.poleStar}」（${starBrief[ex.junkan.poleStar] || ""}）。思考の流れ：${ex.junkan.chain.map(s => `${s}（${starBrief[s] || ""}）`).join(" → ")}。最終的に「${ex.junkan.poleStar}」の性質で結論を出す傾向があります。`
    : (ex.junkan ? `物事を考える時の基本姿勢は「${ex.junkan.poleStar}」（${starBrief[ex.junkan.poleStar] || ""}）。` : "");
  const eastSouthText = ex.eastSouth ? `${ex.eastSouth.title}：${ex.eastSouth.text.split("。")[0]}。` : "";
  const joritsuText = ex.joritsu ? `${ex.joritsu.type}型：${ex.joritsu.text.split("。")[0]}。` : "";
  const starCombosText = ex.starCombos && ex.starCombos.length > 0 ? ex.starCombos.map(c => `${c.name}：${c.note.split("。")[0]}。`).join("\n") : "";
  const tripleStarText = ex.tripleStars && ex.tripleStars.length > 0 ? ex.tripleStars.map(t => `${t.star}×${t.count}` + (t.text ? `：${t.text.split("。").slice(0, 2).join("。")}。` : "")).join("\n") : "";
  const energyBiasText = ex.energyBias && ex.energyBias.length > 0 ? ex.energyBias.map(b => `${b.star}×${b.count}：${b.text.split("。")[0]}。`).join("\n") : "";
  const kizuText = ex.kizu ? `${ex.kizu.type}：${ex.kizu.text.split("。")[0]}。` : "";
  const sekishokuText = ex.sekishoku ? `${ex.sekishoku.relation}：${ex.sekishoku.relationText.split("。")[0]}。　現実：${ex.sekishoku.eastData.keywords}　理想：${ex.sekishoku.southData.keywords}` : "";
  const sanbunText = ex.sanbun ? ex.sanbun.mismatchText : "";
  const topologyText = ex.topology && ex.topology.length > 0 ? ex.topology.map(t => `${t.name}（${t.label}）：${t.note.split("。")[0]}。`).join("\n") : "";

  const reading = [
    { title: `${name}さんの本質`, text: `${dayP.good}${hasSeimei ? `\n姓名判断では人格${seimei.jinkaku}画（${seimei.jinRank?.rank}）。` : ""}` },
    { title: "性格の長所", text: `【中心的な性格】${pickByBalance(starP.good, balanceType)}\n【生まれた日の性質】${dayP.good}\n【最も強い要素（${strongest}）】${strongP.good}\n【表に出やすい面】${pickByBalance(northP.good, balanceType)}\n【内面に持っている面】${pickByBalance(southP.good, balanceType)}${seimeiGood ? "\n" + seimeiGood : ""}` },
    { title: "性格の短所（隠さず直視すべき点）", text: `【中心的な性格】${pickByBalance(starP.bad, balanceType)}\n【生まれた日の性質】${dayP.bad}\n【最も強い要素（${strongest}）が強すぎる面】${strongP.bad}\n【足りない要素（${weakest}）の影響】${weakP.bad}${seimeiBad ? "\n" + seimeiBad : ""}` },
    { title: "仕事面での性格", text: pickByBalance(starP.work, balanceType) },
    { title: "仕事の優秀度", text: `総合仕事優秀度スコア：${workEx.score}点（${workEx.rank}）\n適職傾向：${workEx.jobTendency}\n内訳：${workEx.breakdown}${hasSeimei ? `\n姓名判断の仕事運スコア：${seimei.workFortune}点` : ""}` },
    { title: "恋愛面での性格", text: `${pickByBalance(starP.love, balanceType)}${hasSeimei ? `\n姓名判断の恋愛運スコアは${seimei.loveFortune}点。${seimei.loveFortune >= 70 ? "姓名判断的にも恋愛運は良好。" : seimei.loveFortune >= 50 ? "姓名判断的には標準的。" : "姓名判断的には恋愛面で波乱あり。"}` : ""}` },
    { title: "金銭感覚とお金の性格", text: pickByBalance(starP.money, balanceType) },
    { title: "結婚観と家庭の性格", text: pickByBalance(starP.marriage, balanceType) },
    { title: "社交性と対人関係の性格", text: pickByBalance(starP.social, balanceType) },
    { title: `中心的な性格×生まれた日の性質の詳細`, text: starByDayStem[center] ? (starByDayStem[center][pillars.day.stem] || "").split("。").slice(0, 2).join("。") + "。" : "" },
    { title: `表に出やすい面×生まれた日の性質の詳細`, text: starByDayStem[northStar] ? (starByDayStem[northStar][pillars.day.stem] || "").split("。").slice(0, 2).join("。") + "。" : "" },
    { title: `内面に持っている面×生まれた日の性質の詳細`, text: starByDayStem[southStar] ? (starByDayStem[southStar][pillars.day.stem] || "").split("。").slice(0, 2).join("。") + "。" : "" },
    { title: "本人も自覚しにくい裏の性格", text: pickByBalance(starP.hidden, balanceType) },
    { title: "人生のタイミングから見る性格要素", text: energyTexts.join("　") },
    { title: "内面の構造（人間関係の相性）", text: [interactionNorth, interactionSouth, interactionEast, interactionWest].filter(Boolean).join("\n") },
    { title: "社会と配偶者の関係", text: interactionEastWest || "" },
    { title: "内面と外面の表現の仕方", text: energyCombos.join("\n") || "" },
    { title: "人間関係の相性（流動法）", text: ryudoText },
    { title: "考え方の根幹（循環法）", text: junkanText },
    { title: "現実と理想のバランス", text: eastSouthText },
    { title: "情的か理性的か", text: joritsuText },
    { title: "起こりやすい現象", text: starCombosText },
    { title: "天才・変人タイプ（同星3連）", text: tripleStarText },
    { title: "従星の偏り", text: energyBiasText },
    { title: "精神性と行動力（気図法）", text: kizuText },
    { title: "仕事のバランス（適職占技）", text: sekishokuText },
    { title: "現実と精神のミスマッチ（三分法）", text: sanbunText },
    { title: "干支の相互作用", text: topologyText },
    { title: "バランスと課題", text: `内面では「${strongest}」の性質が強く、「${weakest}」の性質が不足気味。強い要素は武器ですが、過剰になると自分の考えに固執し、視野が狭くなります。不足する「${weakest}」は、人生で意識的に鍛えないと同じ壁として何度も出ます。${strongP.good}という長所を活かしつつ、${weakP.bad}という弱点を補う環境選びが鍵です。${hasSeimei ? `\n姓名判断の総合判定は「${seimei.overallRank}」。${seimei.overallRank === "大吉" || seimei.overallRank === "吉" ? "名前の画数バランスが良く、運勢を後押しする。" : seimei.overallRank === "半吉" ? "名前の画数は標準的。努力次第で運勢を引き上げられる。" : "名前の画数に偏りがあり、意識的な努力で補う必要がある。"}` : ""}` },
    { title: "エネルギー傾向", text: `人生のタイミングを表す星の合計エネルギーは${totalEnergy}点。${energy.map((e) => `${e.name}${e.score}点`).join("・")}。${totalEnergy >= 28 ? "強い運命ほど、怠けた時の反動も大きいです。力を持て余すと周囲への圧になります。" : "繊細な運命ほど、環境の悪さに削られます。根性論だけで突破しようとすると消耗します。"}` },
    { title: "注意が必要な時期", text: `${tenchusatsu}の期間中は、拡大や大きな決断より整理・準備・見直し向き。無理に勝負すると、手に入れたものの維持で苦しくなりやすいです。` }
  ].filter(r => r.text);
  return reading;
}

// === 記録 (localStorage) ===
const STORAGE_KEY = "sanmei_history";

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}

function saveToHistory(entry) {
  const history = loadHistory();
  const exists = history.findIndex((h) => h.birthdate === entry.birthdate && h.name === entry.name);
  if (exists >= 0) history[exists] = entry; else history.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function clearAllHistory() {
  localStorage.removeItem(STORAGE_KEY);
  refreshHistoryUI();
}

function refreshHistoryUI() {
  const history = loadHistory();
  const list = document.querySelector("#historyList");
  const personA = document.querySelector("#personA");
  const personB = document.querySelector("#personB");
  if (!list) return;
  if (history.length === 0) {
    list.innerHTML = '<p class="note">まだ鑑定記録がありません。</p>';
  } else {
    list.innerHTML = history.map((h, i) => {
      const affair = h.affairScore != null ? h.affairScore : null;
      const marriage = h.marriageScore != null ? h.marriageScore : null;
      const work = h.workScore != null ? h.workScore : null;
      const oppMote = h.oppositeMoteScore != null ? h.oppositeMoteScore : null;
      const sameMote = h.sameMoteScore != null ? h.sameMoteScore : null;
      const affairColor = affair != null ? (affair >= 80 ? "#ff5050" : affair >= 65 ? "#f0a040" : affair >= 45 ? "#e0c060" : affair >= 25 ? "#80d080" : "#60c0e0") : null;
      const marriageColor = marriage != null ? (marriage >= 80 ? "#60c0e0" : marriage >= 65 ? "#80d080" : marriage >= 45 ? "#e0c060" : marriage >= 30 ? "#f0a040" : "#ff5050") : null;
      const workColor = work != null ? (work >= 80 ? "#f0e080" : work >= 65 ? "#e0c060" : work >= 45 ? "#c0a050" : work >= 25 ? "#a09060" : "#c07060") : null;
      const moteColor = (s) => s != null ? (s >= 80 ? "#ff80c0" : s >= 65 ? "#e070a0" : s >= 45 ? "#c06080" : s >= 25 ? "#a05060" : "#804060") : null;
      const toBadge = (val, color, label) => val != null
        ? `<span class="score-badge" style="--badge-bg:${color}22;--badge-color:${color}">${label}${val}</span>`
        : "";
      const scoreTags = [
        toBadge(work, workColor, "仕事"),
        toBadge(oppMote, moteColor(oppMote), "異性モテ"),
        toBadge(sameMote, moteColor(sameMote), "同性モテ"),
        toBadge(affair, affairColor, "浮気"),
        toBadge(marriage, marriageColor, "結婚")
      ].filter(Boolean).join(" ");
      return `<div class="history-item" data-idx="${i}"><span class="history-name">${h.name}</span><span class="history-info">${h.birthdate} / ${h.dayStem}${h.dayBranch} / ${h.centerStar}</span>${scoreTags ? `<span class="history-tags">${scoreTags}</span>` : ""}<button class="history-del" data-idx="${i}">&times;</button></div>`;
    }).join("");
  }
  const opts = history.map((h, i) => `<option value="${i}">${h.name}（${h.birthdate}）</option>`).join("");
  personA.innerHTML = '<option value="">-- 記録から選択 --</option>' + opts;
  personB.innerHTML = '<option value="">-- 記録から選択 --</option>' + opts;
}

function deleteHistoryItem(idx) {
  const history = loadHistory();
  history.splice(idx, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  refreshHistoryUI();
}

function replayHistory(idx) {
  const history = loadHistory();
  const h = history[idx];
  if (!h) return;
  const lastNameInput = document.querySelector("#lastName");
  const firstNameInput = document.querySelector("#firstName");
  const birthYearInput = document.querySelector("#birthYear");
  const birthMonthInput = document.querySelector("#birthMonth");
  const birthDayInput = document.querySelector("#birthDay");
  const genderSelect = document.querySelector("#gender");
  if (h.lastName) lastNameInput.value = h.lastName;
  if (h.firstName) firstNameInput.value = h.firstName;
  if (h.birthYear) {
    birthYearInput.value = h.birthYear;
    birthMonthInput.value = h.birthMonth;
    birthDayInput.value = h.birthDay;
  } else {
    const parts = h.birthdate.split("-");
    if (parts.length === 3) {
      birthYearInput.value = parts[0];
      birthMonthInput.value = parseInt(parts[1], 10);
      birthDayInput.value = parseInt(parts[2], 10);
    }
  }
  if (h.gender) genderSelect.value = h.gender;
  render();
}

// === 職場・親子の相性追加 ===

// 星ごとの職場での役割傾向
const starWorkRole = {
  "貫索星": "専門・独立系", "石門星": "調整・仲介系", "鳳閣星": "企画・ムード系",
  "調舒星": "感覚・専門系", "禄存星": "サポート・奉仕系", "司禄星": "管理・堅実系",
  "車騎星": "行動・開拓系", "牽牛星": "管理・名誉系", "龍高星": "企画・変革系", "玉堂星": "知識・教育系"
};

// 職場相性の星ペアボーナス
const workStarBonus = {
  "貫索星": { "石門星": 10, "玉堂星": 8, "禄存星": 6, "牽牛星": 7, "司禄星": 5, "貫索星": -5, "車騎星": 2, "鳳閣星": 3, "調舒星": 4, "龍高星": 0 },
  "石門星": { "貫索星": 10, "車騎星": 8, "鳳閣星": 7, "玉堂星": 6, "石門星": -3, "禄存星": 8, "司禄星": 7, "牽牛星": 8, "龍高星": 5, "調舒星": 4 },
  "鳳閣星": { "石門星": 7, "調舒星": 8, "龍高星": 7, "禄存星": 6, "鳳閣星": -4, "車騎星": 6, "玉堂星": 5, "貫索星": 3, "司禄星": 2, "牽牛星": 3 },
  "調舒星": { "鳳閣星": 8, "玉堂星": 7, "龍高星": 6, "貫索星": 4, "調舒星": -6, "石門星": 4, "禄存星": 5, "司禄星": 2, "車騎星": 2, "牽牛星": 3 },
  "禄存星": { "石門星": 8, "玉堂星": 7, "司禄星": 8, "牽牛星": 7, "禄存星": -2, "貫索星": 6, "鳳閣星": 6, "調舒星": 5, "車騎星": 4, "龍高星": 3 },
  "司禄星": { "禄存星": 8, "牽牛星": 8, "玉堂星": 6, "石門星": 7, "司禄星": -4, "貫索星": 5, "鳳閣星": 2, "調舒星": 2, "車騎星": 2, "龍高星": 0 },
  "車騎星": { "石門星": 8, "牽牛星": 8, "貫索星": 2, "鳳閣星": 6, "車騎星": -6, "禄存星": 4, "司禄星": 2, "玉堂星": 3, "龍高星": 5, "調舒星": 2 },
  "牽牛星": { "司禄星": 8, "禄存星": 7, "玉堂星": 7, "石門星": 8, "車騎星": 8, "牽牛星": -4, "貫索星": 6, "鳳閣星": 3, "調舒星": 3, "龍高星": 2 },
  "龍高星": { "鳳閣星": 7, "調舒星": 6, "玉堂星": 8, "石門星": 5, "車騎星": 5, "龍高星": -6, "貫索星": 0, "禄存星": 3, "司禄星": 0, "牽牛星": 2 },
  "玉堂星": { "龍高星": 8, "貫索星": 8, "禄存星": 7, "石門星": 6, "司禄星": 6, "牽牛星": 7, "調舒星": 7, "玉堂星": -4, "鳳閣星": 5, "車騎星": 3 }
};

const workRelationAdvice = {
  "相生": "上司と部下、または先輩と後輩として相性抜群。育てる・育てられる関係が自然に成立する。",
  "比和": "似た働き方をするため協力しやすいが、役割が被ると競争になる。担当を明確に分けること。",
  "相剋": "意見対立が起きやすい。ただし衝突から新しいアイデアが生まれることも。議論のルールを決めること。",
  "反剋": "一方がもう一方にストレスを与えやすい。物理的な距離を置くか、関わりを最小限にするのが無難。"
};

function calcWorkCompatibility(a, b) {
  const elA = elements[stems.indexOf(a.dayStem)];
  const elB = elements[stems.indexOf(b.dayStem)];
  const relation = gogyoRelation[elA][elB];
  const centerA = a.centerStar || "";
  const centerB = b.centerStar || "";

  let score = 50;
  const factors = [];

  if (relation === "相生") { score += 25; factors.push("五行相生+25"); }
  else if (relation === "比和") { score += 12; factors.push("五行比和+12"); }
  else if (relation === "相剋") { score -= 15; factors.push("五行相剋-15"); }
  else if (relation === "反剋") { score -= 20; factors.push("五行反剋-20"); }

  const starPt = workStarBonus[centerA] && workStarBonus[centerA][centerB] !== undefined ? workStarBonus[centerA][centerB] : 0;
  score += starPt;
  if (starPt) factors.push(`主星(${centerA}×${centerB})${starPt > 0 ? "+" : ""}${starPt}`);

  const yinYangA = stems.indexOf(a.dayStem) % 2 === 0 ? "陽" : "陰";
  const yinYangB = stems.indexOf(b.dayStem) % 2 === 0 ? "陽" : "陰";
  if (yinYangA !== yinYangB) { score += 8; factors.push("陰陽補完+8"); }
  else { score -= 4; factors.push("同陰陽-4"); }

  score = Math.max(5, Math.min(98, Math.round(score)));

  const roleA = starWorkRole[centerA] || "";
  const roleB = starWorkRole[centerB] || "";
  const advice = workRelationAdvice[relation] || "";

  return { score, relation, factors, roleA, roleB, centerA, centerB, advice };
}

// 親子相性の星ペアボーナス
const parentChildStarBonus = {
  "貫索星": { "石門星": 12, "禄存星": 10, "玉堂星": 8, "鳳閣星": 5, "貫索星": 3, "調舒星": 4, "司禄星": 7, "車騎星": 2, "牽牛星": 6, "龍高星": 1 },
  "石門星": { "貫索星": 10, "鳳閣星": 10, "禄存星": 8, "石門星": 5, "玉堂星": 7, "車騎星": 6, "牽牛星": 7, "龍高星": 6, "調舒星": 4, "司禄星": 6 },
  "鳳閣星": { "石門星": 10, "調舒星": 8, "龍高星": 7, "禄存星": 7, "鳳閣星": 4, "玉堂星": 5, "貫索星": 3, "司禄星": 3, "車騎星": 5, "牽牛星": 3 },
  "調舒星": { "鳳閣星": 8, "玉堂星": 7, "龍高星": 8, "貫索星": 4, "調舒星": 2, "石門星": 4, "禄存星": 6, "司禄星": 3, "車騎星": 2, "牽牛星": 3 },
  "禄存星": { "貫索星": 10, "石門星": 8, "司禄星": 8, "玉堂星": 7, "禄存星": 6, "鳳閣星": 7, "調舒星": 6, "牽牛星": 7, "車騎星": 4, "龍高星": 3 },
  "司禄星": { "禄存星": 8, "牽牛星": 8, "玉堂星": 6, "石門星": 6, "司禄星": 5, "貫索星": 7, "鳳閣星": 3, "調舒星": 3, "車騎星": 2, "龍高星": 1 },
  "車騎星": { "石門星": 6, "牽牛星": 7, "貫索星": 2, "鳳閣星": 5, "車騎星": 3, "禄存星": 4, "司禄星": 2, "玉堂星": 3, "龍高星": 5, "調舒星": 2 },
  "牽牛星": { "司禄星": 8, "禄存星": 7, "玉堂星": 7, "石門星": 7, "車騎星": 7, "牽牛星": 4, "貫索星": 6, "鳳閣星": 3, "調舒星": 3, "龍高星": 2 },
  "龍高星": { "鳳閣星": 7, "調舒星": 8, "玉堂星": 8, "石門星": 6, "車騎星": 5, "龍高星": 2, "貫索星": 1, "禄存星": 3, "司禄星": 1, "牽牛星": 2 },
  "玉堂星": { "龍高星": 8, "貫索星": 8, "禄存星": 7, "石門星": 7, "司禄星": 6, "牽牛星": 7, "調舒星": 7, "玉堂星": 4, "鳳閣星": 5, "車騎星": 3 }
};

const parentChildRelationAdvice = {
  "相生": "親が子を育てる自然な関係。親の愛情がスムーズに伝わり、子供は素直に伸びる。",
  "比和": "親子で似た気質。理解しやすいが、同じ欠点も共有する。親の課題が子にも受け継がれやすい。",
  "相剋": "親子の意見が対立しやすい。特に思春期に衝突が増える。相手を変えようとせず認めることが鍵。",
  "反剋": "親の期待が子にプレッシャーとしてのしかかる。放任気味に関わる方がかえって上手くいく関係。"
};

function calcParentChildCompatibility(parent, child) {
  const elP = elements[stems.indexOf(parent.dayStem)];
  const elC = elements[stems.indexOf(child.dayStem)];
  const relation = gogyoRelation[elP][elC];
  const centerP = parent.centerStar || "";
  const centerC = child.centerStar || "";

  let score = 50;
  const factors = [];

  if (relation === "相生") { score += 28; factors.push("五行相生+28"); }
  else if (relation === "比和") { score += 15; factors.push("五行比和+15"); }
  else if (relation === "相剋") { score -= 12; factors.push("五行相剋-12"); }
  else if (relation === "反剋") { score -= 18; factors.push("五行反剋-18"); }

  const starPt = parentChildStarBonus[centerP] && parentChildStarBonus[centerP][centerC] !== undefined ? parentChildStarBonus[centerP][centerC] : 0;
  score += starPt;
  if (starPt) factors.push(`主星(${centerP}×${centerC})${starPt > 0 ? "+" : ""}${starPt}`);

  const yinYangP = stems.indexOf(parent.dayStem) % 2 === 0 ? "陽" : "陰";
  const yinYangC = stems.indexOf(child.dayStem) % 2 === 0 ? "陽" : "陰";
  if (yinYangP !== yinYangC) { score += 10; factors.push("陰陽補完+10"); }
  else { score -= 5; factors.push("同陰陽-5"); }

  score = Math.max(5, Math.min(98, Math.round(score)));

  const advice = parentChildRelationAdvice[relation] || "";

  return { score, relation, factors, centerP, centerC, advice };
}

// === 相性占い ===

const compatTexts = {
  比和: { good: "似た者同士で居心地はいいが、成長は止まる。馴れ合いで互いに甘え合い、結局どちらも変わらないまま関係が停滞しやすいタイプ。", bad: "似た者同士は最初は安心するが、刺激がないと関係が停滞する。欠点まで似ているため、同じ壁にぶつかり二人して止まる。最悪の組み合わせではないが、最善でもない。" },
  相生: { good: "一方がもう一方を育てる関係。ただし与える側が一方的に尽くす構図になりやすく、疲弊して愛情が冷めるリスクがある。受け取る側の感謝がなければ崩壊する。", bad: "与える側が犠牲者意識を持ち始めると一気に崩壊する。『私ばかりやってる』という不満が爆発した時、受け取る側は何が起きたか理解できないほど温度差がある。" },
  相剋: { good: "衝突が絶えないが、その摩擦で互いに削られる。成長するかすれ違うかの選択になる。適度な距離感を保てないと共倒れ。", bad: "衝突が激しい組み合わせ。相手を変えようとすると泥沼。どちらかが折れるか、物理的に距離を置くかしないと破綻する。『愛があれば変われる』は幻想。" },
  反剋: { good: "一方的に鍛えられる関係。我慢が効く間は成長するが、限界を超えると感情が麻痺しやすくなる。", bad: "一方的に削られる関係。耐えているうちはいいが、限界を超えると感情が麻痺し、ある日突然冷める。撤退のタイミングを見極めないと深傷を負う。" }
};

function calcCompatibility(a, b) {
  const elA = elements[stems.indexOf(a.dayStem)];
  const elB = elements[stems.indexOf(b.dayStem)];
  const relation = gogyoRelation[elA][elB];
  const starAtoB = getMainStar(a.dayStem, b.dayStem);
  const starBtoA = getMainStar(b.dayStem, a.dayStem);
  const branchA = branches.indexOf(a.dayBranch);
  const branchB = branches.indexOf(b.dayBranch);
  const branchDiff = Math.abs(branchA - branchB);
  const branchHarmony = [0, 6].includes(branchDiff) ? "支合/冲" : [4, 8].includes(branchDiff) ? "三合候補" : "普通";
  const centerA = a.centerStar || "";
  const centerB = b.centerStar || "";
  const yinYangA = stems.indexOf(a.dayStem) % 2 === 0 ? "陽" : "陰";
  const yinYangB = stems.indexOf(b.dayStem) % 2 === 0 ? "陽" : "陰";
  const sameYinYang = yinYangA === yinYangB;

  // --- 恋愛の相性 ---
  let loveScore = 50;
  const loveFactors = [];
  if (relation === "相生") { loveScore += 30; loveFactors.push("相性関係+30"); }
  else if (relation === "比和") { loveScore += 18; loveFactors.push("同質関係+18"); }
  else if (relation === "相剋") { loveScore -= 15; loveFactors.push("ぶつかり関係-15"); }
  else if (relation === "反剋") { loveScore -= 25; loveFactors.push("逆風関係-25"); }
  if (!sameYinYang) { loveScore += 15; loveFactors.push("陰陽の補完+15"); }
  else { loveScore -= 8; loveFactors.push("同陰陽-8"); }
  if ([4, 8].includes(branchDiff)) { loveScore += 12; loveFactors.push("地支三合+12"); }
  if (branchDiff === 6) { loveScore -= 15; loveFactors.push("地支冲-15"); }
  // 星の相性（恋愛）
  const loveStarBonus = {
    "貫索星": { "石門星": 8, "鳳閣星": 3, "調舒星": 5, "禄存星": 6, "司禄星": 7, "車騎星": 4, "牽牛星": 6, "龍高星": 2, "玉堂星": 5, "貫索星": -3 },
    "石門星": { "貫索星": 8, "鳳閣星": 7, "調舒星": 4, "禄存星": 6, "司禄星": 6, "車騎星": 5, "牽牛星": 7, "龍高星": 6, "玉堂星": 5, "石門星": -2 },
    "鳳閣星": { "貫索星": 3, "石門星": 7, "調舒星": 8, "禄存星": 5, "司禄星": 4, "車騎星": 6, "牽牛星": 4, "龍高星": 7, "玉堂星": 5, "鳳閣星": -3 },
    "調舒星": { "貫索星": 5, "石門星": 4, "鳳閣星": 8, "禄存星": 6, "司禄星": 3, "車騎星": 3, "牽牛星": 4, "龍高星": 5, "玉堂星": 7, "調舒星": -4 },
    "禄存星": { "貫索星": 6, "石門星": 6, "鳳閣星": 5, "調舒星": 6, "司禄星": 8, "車騎星": 4, "牽牛星": 7, "龍高星": 3, "玉堂星": 6, "禄存星": -2 },
    "司禄星": { "貫索星": 7, "石門星": 6, "鳳閣星": 4, "調舒星": 3, "禄存星": 8, "車騎星": 3, "牽牛星": 8, "龍高星": 2, "玉堂星": 6, "司禄星": -3 },
    "車騎星": { "貫索星": 4, "石門星": 5, "鳳閣星": 6, "調舒星": 3, "禄存星": 4, "司禄星": 3, "牽牛星": 8, "龍高星": 5, "玉堂星": 3, "車騎星": -5 },
    "牽牛星": { "貫索星": 6, "石門星": 7, "鳳閣星": 4, "調舒星": 4, "禄存星": 7, "司禄星": 8, "車騎星": 8, "龍高星": 3, "玉堂星": 7, "牽牛星": -3 },
    "龍高星": { "貫索星": 2, "石門星": 6, "鳳閣星": 7, "調舒星": 5, "禄存星": 3, "司禄星": 2, "車騎星": 5, "牽牛星": 3, "玉堂星": 8, "龍高星": -4 },
    "玉堂星": { "貫索星": 5, "石門星": 5, "鳳閣星": 5, "調舒星": 7, "禄存星": 6, "司禄星": 6, "車騎星": 3, "牽牛星": 7, "龍高星": 8, "玉堂星": -3 }
  };
  const starLovePt = loveStarBonus[centerA] && loveStarBonus[centerA][centerB] !== undefined ? loveStarBonus[centerA][centerB] : 0;
  loveScore += starLovePt * 1.5;
  if (starLovePt) loveFactors.push(`主星(${centerA}×${centerB})${starLovePt > 0 ? "+" : ""}${Math.round(starLovePt * 1.5)}`);
  loveScore = Math.max(5, Math.min(98, loveScore));

  // --- SEXの相性 ---
  let sexScore = 50;
  const sexFactors = [];
  // 陰陽の組み合わせ（異陰陽が高い）
  if (!sameYinYang) { sexScore += 25; sexFactors.push("陰陽異性+25"); }
  else { sexScore -= 12; sexFactors.push("同陰陽-12"); }
  // 五行関係
  if (relation === "相生") { sexScore += 22; sexFactors.push("相性関係+22"); }
  else if (relation === "相剋") { sexScore += 12; sexFactors.push("ぶつかり関係(刺激)+12"); }
  else if (relation === "比和") { sexScore += 8; sexFactors.push("同質関係+8"); }
  else if (relation === "反剋") { sexScore -= 18; sexFactors.push("逆風関係-18"); }
  // 地支の関係（冲は性的緊張感としてプラス、三合は安心感）
  if (branchDiff === 6) { sexScore += 15; sexFactors.push("地支冲(緊張感)+15"); }
  if ([4, 8].includes(branchDiff)) { sexScore += 8; sexFactors.push("地支三合+8"); }
  // 星の性的相性
  const sexStarBonus = {
    "車騎星": 10, "調舒星": 8, "龍高星": 8, "鳳閣星": 7, "禄存星": 6,
    "石門星": 5, "貫索星": 5, "牽牛星": 4, "玉堂星": 2, "司禄星": 2
  };
  const sexPtA = sexStarBonus[centerA] || 0;
  const sexPtB = sexStarBonus[centerB] || 0;
  const sexStarPt = Math.round((sexPtA + sexPtB) / 2);
  sexScore += sexStarPt;
  if (sexStarPt) sexFactors.push(`主星の情熱度+${sexStarPt}`);
  sexScore = Math.max(5, Math.min(98, sexScore));

  // --- 結婚後の相性 ---
  let marriageScore = 50;
  const marriageFactors = [];
  if (relation === "相生") { marriageScore += 32; marriageFactors.push("相性関係+32"); }
  else if (relation === "比和") { marriageScore += 22; marriageFactors.push("同質関係+22"); }
  else if (relation === "相剋") { marriageScore -= 18; marriageFactors.push("ぶつかり関係-18"); }
  else if (relation === "反剋") { marriageScore -= 28; marriageFactors.push("逆風関係-28"); }
  if ([4, 8].includes(branchDiff)) { marriageScore += 18; marriageFactors.push("地支三合+18"); }
  if (branchDiff === 6) { marriageScore -= 18; marriageFactors.push("地支冲-18"); }
  if (branchDiff === 0) { marriageScore += 12; marriageFactors.push("同地支+12"); }
  // 星の結婚適性
  const marriageStarBonus = {
    "司禄星": 10, "禄存星": 9, "牽牛星": 8, "玉堂星": 7, "石門星": 6,
    "貫索星": 5, "鳳閣星": 4, "調舒星": 3, "車騎星": 2, "龍高星": 1
  };
  const marPtA = marriageStarBonus[centerA] || 0;
  const marPtB = marriageStarBonus[centerB] || 0;
  const marStarPt = Math.round((marPtA + marPtB) / 2);
  marriageScore += marStarPt;
  if (marStarPt) marriageFactors.push(`主星の結婚適性+${marStarPt}`);
  // 同陰陽は安定感がある
  if (sameYinYang) { marriageScore += 8; marriageFactors.push("同陰陽(安定)+8"); }
  marriageScore = Math.max(5, Math.min(98, marriageScore));

  // 総合スコア
  let score = Math.round((loveScore + sexScore + marriageScore) / 3);

  // --- 不倫リスク ---
  const affairRiskA = getAffairRiskScore({
    westStar: a.westStar || a.centerStar || "",
    spouseEnergyName: a.dayEnergy || "",
    isDoubleEn: a.eastStar && a.westStar && (a.eastStar === a.westStar || yinYangPairStar[a.eastStar] === a.westStar),
    hasAbnormal: false,
    hasTopThreeAbnormal: false,
    centerStar: a.centerStar || "",
    northStar: a.northStar || "",
    southStar: a.southStar || "",
    eastStar: a.eastStar || "",
    dayStem: a.dayStem || "",
    dayElement: a.dayElement,
    tenchusatsu: a.tenchusatsu,
    topologyNames: a.topologyNames,
    weakestGogyo: a.weakestGogyo,
    balanceType: a.balanceType,
    gender: a.gender
  });
  const affairRiskB = getAffairRiskScore({
    westStar: b.westStar || b.centerStar || "",
    spouseEnergyName: b.dayEnergy || "",
    isDoubleEn: b.eastStar && b.westStar && (b.eastStar === b.westStar || yinYangPairStar[b.eastStar] === b.westStar),
    hasAbnormal: false,
    hasTopThreeAbnormal: false,
    centerStar: b.centerStar || "",
    northStar: b.northStar || "",
    southStar: b.southStar || "",
    eastStar: b.eastStar || "",
    dayStem: b.dayStem || "",
    dayElement: b.dayElement,
    tenchusatsu: b.tenchusatsu,
    topologyNames: b.topologyNames,
    weakestGogyo: b.weakestGogyo,
    balanceType: b.balanceType,
    gender: b.gender
  });
  // 相手の組み合わせによる不倫リスク調整
  let affairRisk = Math.round((affairRiskA + affairRiskB) / 2);
  const affairFactors = [];
  affairFactors.push(`${a.name}の不倫リスク${affairRiskA}点`);
  affairFactors.push(`${b.name}の不倫リスク${affairRiskB}点`);
  // 相剋関係は不倫リスクを高める
  if (relation === "相剋") { affairRisk += 12; affairFactors.push("ぶつかり関係(刺激)+12"); }
  else if (relation === "反剋") { affairRisk += 18; affairFactors.push("逆風関係+18"); }
  // 龍高星×龍高星は自由奔放
  if (centerA === "龍高星" && centerB === "龍高星") { affairRisk += 15; affairFactors.push("龍高星×龍高星(自由奔放)+15"); }
  // 鳳閣星がいるとモテやすく誘惑多い
  if (centerA === "鳳閣星" || centerB === "鳳閣星") { affairRisk += 8; affairFactors.push("鳳閣星の誘惑+8"); }
  // 司禄星がいると堅実
  if (centerA === "司禄星" || centerB === "司禄星") { affairRisk -= 8; affairFactors.push("司禄星の堅実-8"); }
  // 地支冲は不安定
  if (branchDiff === 6) { affairRisk += 10; affairFactors.push("地支冲(不安定)+10"); }
  affairRisk = Math.max(5, Math.min(98, affairRisk));

  // --- 離婚リスク ---
  let divorceRisk = 50;
  const divorceFactors = [];
  // 結婚スコアが低いほど離婚リスク高い
  divorceRisk += Math.round((50 - marriageScore) * 0.6);
  if (marriageScore < 40) { divorceRisk += 15; divorceFactors.push("結婚相性低+15"); }
  // 五行相剋・反剋は離婚リスク高い
  if (relation === "相剋") { divorceRisk += 12; divorceFactors.push("ぶつかり関係+12"); }
  else if (relation === "反剋") { divorceRisk += 22; divorceFactors.push("逆風関係+22"); }
  else if (relation === "比和") { divorceRisk -= 8; divorceFactors.push("同質関係(安定)-8"); }
  // 地支冲は離婚リスク高い
  if (branchDiff === 6) { divorceRisk += 18; divorceFactors.push("地支冲+18"); }
  // 二度縁の人は離婚しやすい
  const aDoubleEn = a.eastStar && a.westStar && (a.eastStar === a.westStar || yinYangPairStar[a.eastStar] === a.westStar);
  const bDoubleEn = b.eastStar && b.westStar && (b.eastStar === b.westStar || yinYangPairStar[b.eastStar] === b.westStar);
  if (aDoubleEn) { divorceRisk += 12; divorceFactors.push(`${a.name}の二度縁+12`); }
  if (bDoubleEn) { divorceRisk += 12; divorceFactors.push(`${b.name}の二度縁+12`); }
  // 不倫リスクが高いと離婚リスクも高い
  if (affairRisk >= 60) { divorceRisk += 15; divorceFactors.push("不倫リスク高+15"); }
  // 同陰陽は安定
  if (sameYinYang) { divorceRisk -= 8; divorceFactors.push("同陰陽(安定)-8"); }
  divorceRisk = Math.max(5, Math.min(98, divorceRisk));

  return { relation, starAtoB, starBtoA, branchHarmony, score, elA, elB, loveScore, sexScore, marriageScore, loveFactors, sexFactors, marriageFactors, centerA, centerB, affairRiskA, affairRiskB, affairRisk, affairFactors, divorceRisk, divorceFactors };
}

function renderCompat(event) {
  event.preventDefault();
  const history = loadHistory();
  const idxA = document.querySelector("#personA").value;
  const idxB = document.querySelector("#personB").value;
  if (idxA === "" || idxB === "") return alert("2人を選択してください");
  if (idxA === idxB) return alert("異なる人物を選択してください");
  const a = history[idxA];
  const b = history[idxB];
  if (a.gender && b.gender && a.gender === b.gender) {
    // 同性ペアの場合は恋愛相性をスキップし、職場・親子相性のみ表示
  }
  const c = calcCompatibility(a, b);
  const wc = calcWorkCompatibility(a, b);
  const pc = calcParentChildCompatibility(a, b);
  const severity = c.score < 40 ? "bad" : "good";

  // スコア→ランク
  const scoreRank = (s) => s >= 85 ? "S" : s >= 72 ? "A" : s >= 58 ? "B" : s >= 42 ? "C" : s >= 28 ? "D" : "E";
  const scoreColor = (s) => s >= 85 ? "#f0e080" : s >= 72 ? "#e0c060" : s >= 58 ? "#c0a050" : s >= 42 ? "#a09060" : s >= 28 ? "#c07060" : "#c05050";

  // 恋愛の相性テキスト（辛口）
  const loveDesc = {
    S: "魂レベルで惹かれ合う稀有な関係。ただし、これほど合うと『他にいない』という依存が生まれやすく、別れが迫った時の影響は大きい。幸せな関係ほど、壊れた時の落差は大きい。",
    A: "良い恋愛関係だが、感情の波がないわけではない。『合う』ことに甘えて手抜きを始めると、あっさり冷める。良い関係は維持に努力がいる。",
    B: "そこそこ良い関係。すれ違うこともあるが、我慢の範囲内。ただし『まあいいか』で済ませ続けると、不満が静かに蓄積し数年後に爆発する。",
    C: "平凡な相性。最初のトキメキはあるが、半年もすれば新鮮味が消える。意識的に関係を育まないと、ただの同居人になる。",
    D: "すれ違いが目立つ。恋愛感情はあるが、タイミングや価値観のズレが常にストレスになる。『愛があれば』という根性論で乗り切れる範囲ではない。",
    E: "恋愛として成立するのが難しい。無理に続けると両者とも負担が大きい。『頑張ればなんとかなる』と思っているうちは痛手が大きくなるだけ。"
  };

  // SEXの相性テキスト（辛口）
  const sexDesc = {
    S: "身体的な相性は最高レベル。陰陽の補完が完璧で、自然な吸引力がある。ただし、これほど合うとセックスで関係を繋ぎ止めている面があり、心の問題を先送りにする危険がある。",
    A: "とても良い身体的相性。情熱と安心感のバランスも良い。ただし『体が合う＝心も合う』と勘違いすると、根本的な問題を見逃す。",
    B: "そこそこ良い相性。波はあるが概ね満足できる。ただし『まあいい』で放置すると、徐々に頻度が減り、最終的にセックスレスに陥る。",
    C: "普通の相性。最初は良くても数ヶ月で慣れが出る。工夫なしではマンネリ確実。『セックスは関係ない』と言い出したら終わりの始まり。",
    D: "身体的なミスマッチが生じやすい。頻度やタイミングのズレが不満になり、どちらかが我慢している構図になりがち。我慢は限界を超えると不倫につながりかねない。",
    E: "性的な相性に大きな課題がある。無理に合わせるとストレスが蓄積し、最終的に身体的な拒否反応が強くなる可能性がある。"
  };

  // 結婚後の相性テキスト（辛口）
  const marriageDesc = {
    S: "結婚後も安定と成長を続けられる稀有なパートナーシップ。ただし、これほど合うと『この人を失ったら終わり』という恐怖が生まれやすく、過度な依存で関係が重くなるリスクがある。",
    A: "安定した結婚関係。価値観の一致度も高い。ただし『合う』ことに甘えてすれ違いを放置すると、5年〜10年後に突然冷めるパターンに入る。",
    B: "そこそこ安定。日常の積み重ねで信頼は育つが、変化への対応力が試される。子育てや経済問題で初めて壁にぶつかった時、どちらが折れるかで今後が決まる。",
    C: "平凡な結婚相性。最初は安定していても、日常のストレスで摩擦が生じる。『結婚なんてこんなもの』と言い聞かせて我慢し続けると、ある日限界が来る。",
    D: "結婚後のすれ違いが多い。価値観や生活リズムの違いが表面化し、我慢の連続。『離婚したくないから耐える』と言っているうちは良いが、心が麻痺し始めたら危険。",
    E: "結婚関係の維持が困難。根本的な価値観の違いがあり、無理に続けると両者とも負担が大きい。子どもを理由に我慢を続けると、いずれ限界が来やすい。"
  };

  const loveR = scoreRank(c.loveScore);
  const sexR = scoreRank(c.sexScore);
  const marR = scoreRank(c.marriageScore);

  const compatResult = document.querySelector("#compatResult");
  compatResult.classList.remove("hidden");
  compatResult.innerHTML = `
    <div class="result-card">
      <h3>${a.name} × ${b.name} の相性</h3>
      <div class="compat-score">
        <div class="score-circle"><span>${c.score}</span><small>/100</small></div>
      </div>
      <div class="compat-detail">
        <div class="compat-row"><b>相性の関係</b><span>${c.elA}（${a.name}）× ${c.elB}（${b.name}）= <strong>${c.relation}</strong></span></div>
        <div class="compat-row"><b>${a.name}→${b.name}</b><span>${c.starAtoB}（${a.name}から見た${b.name}の存在）</span></div>
        <div class="compat-row"><b>${b.name}→${a.name}</b><span>${c.starBtoA}（${b.name}から見た${a.name}の存在）</span></div>
        <div class="compat-row"><b>地支関係</b><span>${c.branchHarmony}</span></div>
      </div>
    </div>

    <div class="result-card compat-cats">
      <h3>3つの相性</h3>

      <div class="compat-cat is-love">
        <div class="compat-cat-head">
          <h4>恋愛の相性</h4>
          <div class="compat-cat-score" style="--score-color:${scoreColor(c.loveScore)}">${c.loveScore}<small>点</small><span class="compat-cat-rank">${loveR}</span></div>
        </div>
        <div class="compat-cat-bar"><div class="compat-cat-bar-fill" style="--score:${c.loveScore}%;--score-color:${scoreColor(c.loveScore)}"></div></div>
        <p>${loveDesc[loveR]}</p>
        <div class="compat-cat-factors">${c.loveFactors.map(f => `<span class="factor-tag">${f}</span>`).join("")}</div>
        <div class="compat-cat-stars">
          <div><b>${a.name}</b>：${pickByBalance(loveTendencyTexts[c.centerA], "moderate") || ""}</div>
          <div><b>${b.name}</b>：${pickByBalance(loveTendencyTexts[c.centerB], "moderate") || ""}</div>
        </div>
      </div>

      <div class="compat-cat is-sex">
        <div class="compat-cat-head">
          <h4>SEXの相性</h4>
          <div class="compat-cat-score" style="--score-color:${scoreColor(c.sexScore)}">${c.sexScore}<small>点</small><span class="compat-cat-rank">${sexR}</span></div>
        </div>
        <div class="compat-cat-bar"><div class="compat-cat-bar-fill" style="--score:${c.sexScore}%;--score-color:${scoreColor(c.sexScore)}"></div></div>
        <p>${sexDesc[sexR]}</p>
        <div class="compat-cat-factors">${c.sexFactors.map(f => `<span class="factor-tag">${f}</span>`).join("")}</div>
        <div class="compat-cat-stars">
          ${(() => {
            const renderSex = (name, star) => {
              const s = sexTendencyTexts[star];
              if (!s || typeof s === 'string') return `<div><b>${name}の性癖（${star}）</b>：${typeof s === 'string' ? s : ''}</div>`;
              return `<div class="sex-tendency">
                <div class="sex-tendency-head"><b>${name}の性癖</b> <span class="sex-tendency-keyword">${star}・${s.keyword}</span></div>
                <div class="sex-tendency-summary">${s.summary}</div>
                <ul class="sex-tendency-traits">
                  ${s.traits.map(t => `<li>${t}</li>`).join("")}
                </ul>
                <div class="sex-tendency-caution">⚠ ${s.caution}</div>
              </div>`;
            };
            return renderSex(a.name, c.centerA) + renderSex(b.name, c.centerB);
          })()}
        </div>
      </div>

      <div class="compat-cat is-marriage">
        <div class="compat-cat-head">
          <h4>結婚後の相性</h4>
          <div class="compat-cat-score" style="--score-color:${scoreColor(c.marriageScore)}">${c.marriageScore}<small>点</small><span class="compat-cat-rank">${marR}</span></div>
        </div>
        <div class="compat-cat-bar"><div class="compat-cat-bar-fill" style="--score:${c.marriageScore}%;--score-color:${scoreColor(c.marriageScore)}"></div></div>
        <p>${marriageDesc[marR]}</p>
        <div class="compat-cat-factors">${c.marriageFactors.map(f => `<span class="factor-tag">${f}</span>`).join("")}</div>
        <div class="compat-cat-stars">
          <div><b>${a.name}の配偶者宮</b>：${pickByBalance(spouseEnergyTexts[a.dayEnergy], "moderate") || "データなし"}</div>
          <div><b>${b.name}の配偶者宮</b>：${pickByBalance(spouseEnergyTexts[b.dayEnergy], "moderate") || "データなし"}</div>
        </div>
      </div>
    </div>

    <div class="result-card compat-risks">
      <h3>リスク診断</h3>

      <div class="compat-cat is-affair">
        <div class="compat-cat-head">
          <h4>不倫確率</h4>
          <div class="compat-cat-score" style="--score-color:${scoreColor(100 - c.affairRisk)}">${c.affairRisk}<small>%</small><span class="compat-cat-rank">${c.affairRisk >= 65 ? "高" : c.affairRisk >= 40 ? "中" : "低"}</span></div>
        </div>
        <div class="compat-cat-bar"><div class="compat-cat-bar-fill" style="--score:${c.affairRisk}%;--score-color:${scoreColor(100 - c.affairRisk)}"></div></div>
        <p>${c.affairRisk >= 65 ? "不倫リスクが高い。刺激を求める性質と誘惑に弱い要素が重なっている。『うちは大丈夫』と思っているほど危ない。不倫は『する人』ではなく『できる状況』で起きる。この組み合わせはその状況ができやすい。" : c.affairRisk >= 40 ? "不倫リスクは中程度。油断はできない。マンネリやコミュニケーション不足がきっかけで浮気に走る可能性は十分ある。『まあうちは大丈夫』という根拠のない安心が一番危ない。" : "不倫リスクは低め。ただし『低い』は『ない』ではない。リスクが低いからこそ油断して、突発的な誘惑に弱くなるパターンもある。過信は禁物。"}</p>
        <div class="compat-cat-factors">${c.affairFactors.map(f => `<span class="factor-tag">${f}</span>`).join("")}</div>
        <div class="compat-cat-stars">
          <div><b>${a.name}の不倫傾向</b>：${pickByBalance(affairTendencyTexts[a.westStar || a.centerStar], "moderate") || "データなし"}</div>
          <div><b>${b.name}の不倫傾向</b>：${pickByBalance(affairTendencyTexts[b.westStar || b.centerStar], "moderate") || "データなし"}</div>
        </div>
      </div>

      <div class="compat-cat is-divorce">
        <div class="compat-cat-head">
          <h4>離婚確率</h4>
          <div class="compat-cat-score" style="--score-color:${scoreColor(100 - c.divorceRisk)}">${c.divorceRisk}<small>%</small><span class="compat-cat-rank">${c.divorceRisk >= 65 ? "高" : c.divorceRisk >= 40 ? "中" : "低"}</span></div>
        </div>
        <div class="compat-cat-bar"><div class="compat-cat-bar-fill" style="--score:${c.divorceRisk}%;--score-color:${scoreColor(100 - c.divorceRisk)}"></div></div>
        <p>${c.divorceRisk >= 65 ? "離婚リスクが高い。価値観の違いや衝突が蓄積しやすい要素が重なっている。結婚前のすり合わせを怠ると、結婚してから『こんなはずじゃなかった』になる。それでも結婚するなら、離婚時の取り決めを事前に話し合っておくのが現実的。" : c.divorceRisk >= 40 ? "離婚リスクは中程度。高いわけではないが、油断はできない。日常の小さなすれ違いを放置し続けると、ある日『もう無理』と一気に壊れる。離婚は『急に起きる』のではなく『積み重なって起きる』。" : "離婚リスクは低め。ただし『低い』は『ない』ではない。経済問題や健康問題などの外部要因で関係が揺らぐ可能性はある。困難時に互いに背中を預けられるかが、最終的な分かれ道。"}</p>
        <div class="compat-cat-factors">${c.divorceFactors.map(f => `<span class="factor-tag">${f}</span>`).join("")}</div>
      </div>
    </div>

    <div class="result-card">
      <h3>辛口総評</h3>
      <div class="reading mt-18">
        <article><h4>厳しい一言</h4><div>${(() => { const s = c.score; if (s >= 80) return `総合${s}点。数値上は良い相性だが、合うことの罠を忘れるな。『合う』ことに甘えて成長を止めると、良い関係ほど停滞しやすい。合うからこそ手抜きをせず、関係を磨き続けられるかが問われる。`; if (s >= 60) return `総合${s}点。悪くはないが、良いとも言い切れない。『まあまあ』で済ませ続けると、不満が静かに蓄積する。5年後に『いつの間にか気持ちが冷めていた』というパターンに入らないよう、今のうちから向き合うべき課題がある。`; if (s >= 40) return `総合${s}点。正直、厳しい。恋愛の最初の勢いで乗り切れても、日常に入るとズレが露骨になる。『愛があればなんとかなる』という根性論で突っ走ると、両者とも負担が大きくなる。冷静に現実を見るべき。`; return `総合${s}点。厳しい評価だが、数値は嘘をつかない。この関係を維持するには、通常以上の覚悟と労力が必要。『頑張れば変われる』という幻想を捨て、現実を受け入れるか、早めに見切りをつけるかの二択。引き延ばすほど負担が大きくなる。`; })()}</div></article>
        <article><h4>相性の本質</h4><div>${compatTexts[c.relation][severity]}</div></article>
        <article><h4>${a.name}から見た${b.name}</h4><div>${starRelationTexts[c.starAtoB]?.[severity] || starRelationTexts[c.starAtoB]?.moderate || pickByBalance(starTexts[c.starAtoB], "moderate")}</div>
        <div class="note-text-sm mt-4">主星「${c.starAtoB}」が表す${b.name}の存在感</div></article>
        <article><h4>${b.name}から見た${a.name}</h4><div>${starRelationTexts[c.starBtoA]?.[severity] || starRelationTexts[c.starBtoA]?.moderate || pickByBalance(starTexts[c.starBtoA], "moderate")}</div>
        <div class="note-text-sm mt-4">主星「${c.starBtoA}」が表す${a.name}の存在感</div></article>
      </div>
    </div>
  `;
  compatResult.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildLifeSummary(mainStars, energy, counts, balanceType, tenchusatsu, ishiki, sanbun, mote, workEx, marriageScore, affairScore, turningPoints, healthRisk, gender) {
  const gKey = gender === "male" ? "male" : "female";
  const center = mainStars.center;

  const starKeyword = {
    貫索星: "自分の軸をしっかり持って、ぶれない人",
    石門星: "人と人をつなぐ、ムードメーカー",
    鳳閣星: "一緒にいるとホッとする、自然体の人",
    調舒星: "繊細な感性で世界を捉える、アーティスト型",
    禄存星: "周りを温かく支える、安心感のある人",
    司禄星: "コツコツ積み重ねて、着実に歩む人",
    車騎星: "思い立ったら動く、行動力の人",
    牽牛星: "責任を背負える、頼りがいのある人",
    龍高星: "常識にとらわれない、自由な発想の人",
    玉堂星: "知るのが好き、学び続ける知性派"
  };

  const balanceDesc = {
    balanced: "心が安定しやすく、どんな状況でもフットワークが軽いタイプ",
    moderate: "少し偏りはあるけれど、意識すればすぐ整うバランス",
    imbalanced: "心の波は大きい分、自分を知ることで一番伸びるタイプ"
  };

  const effortType = ishiki.conscious > ishiki.unconscious
    ? "自分で道を切り開くタイプ。若い頃は苦労する分、後半に花が開く"
    : ishiki.unconscious > ishiki.conscious
    ? "人との縁に恵まれ、周りに引いてもらえるタイプ。のびのか咲く"
    : "努力と運のバランス型。自分で動くことも、人に頼ることも上手"
  ;

  const workRank = workEx.rank || "";
  const workScore = workEx.score || 0;

  const marriageLevel = marriageScore >= 80 ? "とても向いている" : marriageScore >= 65 ? "向いている" : marriageScore >= 45 ? "普通" : marriageScore >= 30 ? "少し工夫がいる" : "向いていない";
  const affairLevel = affairScore >= 80 ? "高危険" : affairScore >= 65 ? "要注意" : affairScore >= 45 ? "普通" : affairScore >= 25 ? "低め" : "安心";

  const major = healthRisk.majorDiseaseRisks || [];
  const healthSummary = major.length > 0
    ? `${major[0].year}年（${major[0].age}歳）頃に${major[0].majorDiseases[0] ? major[0].majorDiseases[0].diseases.split("・")[0] : "健康面"}に気をつけて`
    : "現時点で大病のサインは出ていません。今のペースで大丈夫";

  const tpSummary = turningPoints.length > 0
    ? turningPoints.slice(0, 3).map(tp => `${tp.age}歳（${tp.year}年）${tp.type}`).join("、")
    : "特別大きな転換期は出ていません。日々の積み重ねが花を開かせます";

  // ワンポイントアドバイス生成
  const adviceParts = [];

  // 性格の強みと注意点
  const starAdvice = {
    貫索星: "ぶれない軸はあなたの魅力。ただ、たまには人に頼ってもいい。周りの声に耳を傾けるだけで、もっと世界が広がります。",
    石門星: "人と人をつなぐ力は宝物。ただ、全員にいい顔をしなくていい。本当に大切にしたい関係を見極めると、もっと心地よくなります。",
    鳳閣星: "一緒にいるとホッとする空気感は本物。ただ、いざという時に少し引き締めるだけで、チャンスを逃さずつかめます。",
    調舒星: "繊細な感性は才能。ただ、感情の波が来たら一歩引いて深呼吸。客観的に見る癖をつけると、感性がもっと生きます。",
    禄存星: "人を支える温かさは宝。ただ、見返りを求めず、自分も大切にする境界線を引くと、優しさがもっと長続きします。",
    司禄星: "コツコツ積み重ねる力は確か。ただ、たまには冒険してもいい。小さなリスクが、思いがけない成長を連れてきます。",
    車騎星: "思い立ったら動く行動力は武器。ただ、一呼吸置いて周りを巻き込むと、成果が倍になります。一人で頑張りすぎないで。",
    牽牛星: "責任を背負える姿は信頼の源。ただ、たまには素の自分を見せていい。完璧じゃないあなたに、人はもっと惹かれます。",
    龍高星: "常識にとらわれない発想は才能。ただ、自由と約束のバランスを意識すると、信用を失わずに革新できます。",
    玉堂星: "知るのが好き、学ぶ力は武器。ただ、理屈より相手の気持ちに寄り添うと、人間関係がぐっと深まります。"
  };
  if (starAdvice[center]) adviceParts.push(starAdvice[center]);

  // バランス
  if (balanceType === "imbalanced") adviceParts.push("心の波は大きい分、自分を知ることが開運の鍵。不足している性質を日常にちょっと取り入れるだけで、心が軽くなります。");

  // 努力タイプ
  if (ishiki.conscious > ishiki.unconscious) adviceParts.push("自分で道を切り開くタイプ。若い頃の苦労は、将来の財産になります。諦めずに経験を積み重ねていってください。");
  else if (ishiki.unconscious > ishiki.conscious) adviceParts.push("人との縁に恵まれるタイプ。周りに助けてもらった恩を忘れず、お返ししていくことで、運がさらに開いていきます。");

  // 結婚・浮気
  if (marriageScore < 45) adviceParts.push(`結婚には少し工夫がいる傾向。でも、焦らなくて大丈夫。自分を高めながら、本当に合う人をゆっくり見極めていってください。`);
  if (marriageScore >= 65) adviceParts.push(`結婚に向いている時期がしっかりあります。タイミングを逃さず、安心できるパートナーシップを築いてください。`);
  if (affairScore >= 65) adviceParts.push("浮気リスクが高め。誘惑に気をつけ、パートナーとの信頼関係を意識的に育てることが大切です。");

  // 健康
  if (major.length > 0) adviceParts.push(`${major[0].year}年（${major[0].age}歳）頃は健康面に気をつけて。早めに定期健診を受けて、生活習慣を少し整えるだけで、不安が安心に変わります。`);
  else adviceParts.push(`今のところ大きな健康リスクは出ていませんが、日々の小さなケアが未来の健康を守ります。`);

  // 仕事・収入
  if (workScore >= 70) adviceParts.push(`仕事運は良好。今の調子でスキルを積み上げれば、さらに可能性が広がります。`);
  else if (workScore < 45) adviceParts.push(`仕事面では少し工夫がいる時期。焦らず、自分のペースで確実に力をつけていきましょう。`);

  // ターニングポイント
  if (turningPoints.length > 0) {
    const firstTP = turningPoints[0];
    adviceParts.push(`${firstTP.age}歳（${firstTP.year}年）の「${firstTP.type}」が最初の大きな転機。この時期は準備と勇気を持って変化を受け入れることで、次のステージへ進めます。`);
  }

  // 天中殺
  adviceParts.push(`${tenchusatsu}天中殺の期間は、大きな決断は少し待って。整理と準備に徹する時間と思えば、無駄にならない静かな充電期間になります。`);

  const onePointAdvice = adviceParts.join("\n\n");

  return {
    personality: `${starKeyword[center] || ""}タイプ。${balanceDesc[balanceType]}。`,
    lifeFlow: sanbun.mismatchText,
    effortType,
    work: `${workRank}（${workScore}点）`,
    marriage: `${marriageLevel}（${marriageScore}点）`,
    affair: `${affairLevel}（${affairScore}点）`,
    popularity: `異性から${mote.oppositeRank.rank}・同性から${mote.sameRank.rank}（異性${mote.oppositeScore}点・同性${mote.sameScore}点）`,
    health: healthSummary,
    turningPoints: tpSummary,
    tenchu: `${tenchusatsu}天中殺`,
    onePointAdvice
  };
}

function analyzeYinYang(pillars) {
  const allPillars = ["year", "month", "day", "hour"].filter(k => pillars[k]);
  let yangCount = 0, yinCount = 0;
  allPillars.forEach(k => {
    const p = pillars[k];
    if (stems.indexOf(p.stem) % 2 === 0) yangCount++; else yinCount++;
    if (branches.indexOf(p.branch) % 2 === 0) yangCount++; else yinCount++;
  });
  const total = yangCount + yinCount;
  let summary;
  if (yangCount >= total * 0.7) summary = "陽が非常に多く、積極的で行動力のある性格。ただし強気すぎる面が出ることも。";
  else if (yangCount >= total * 0.55) summary = "陽がやや多く、基本的には積極的。状況に応じて受動的にもなれる柔軟さがある。";
  else if (yinCount >= total * 0.7) summary = "陰が非常に多く、受動的で慎重な性格。しかし内面に強い情熱を秘めている。";
  else if (yinCount >= total * 0.55) summary = "陰がやや多く、慎重で思慮深い。行動する前に熟考するタイプ。";
  else summary = "陰陽のバランスが良く、状況に応じて積極的にも受動的にもなれる柔軟な性格。";
  return { yangCount, yinCount, summary };
}

function analyzeSpecialRelations(pillars) {
  const results = [];
  const allPillars = ["year", "month", "day", "hour"].filter(k => pillars[k]).map(k => ({ key: k, ...pillars[k] }));
  for (let i = 0; i < allPillars.length; i++) {
    for (let j = i + 1; j < allPillars.length; j++) {
      const a = allPillars[i];
      const b = allPillars[j];
      const branchDiff = (branches.indexOf(b.branch) - branches.indexOf(a.branch) + 12) % 12;
      if (branchDiff === 6) {
        results.push({ name: `${a.key}柱×${b.key}柱 対冲`, type: "冲", text: "正面衝突の関係。予期しない変化や摩擦が起きやすい組み合わせ。" });
      }
      if (branchDiff === 0) {
        results.push({ name: `${a.key}柱×${b.key}柱 自刑`, type: "刑", text: "同じ地支が重なり、自分自身との葛藤が生じやすい組み合わせ。" });
      }
      if ([4, 8].includes(branchDiff)) {
        results.push({ name: `${a.key}柱×${b.key}柱 三合候補`, type: "合", text: "協力関係の候補。三つ揃うと強力な協力関係が生まれる。" });
      }
    }
  }
  return results;
}

function buildLifeChronology(taiun, turningPoints, healthRisk, marriageScore, affairScore, workEx, seimeiResult, tenchusatsu, birthYear, gender, day, currentAge, mote, isDoubleEn) {
  const stages = [];

  // 健康リスクTOP3（高危険の上位3件のみ）
  const top3HealthRisks = (healthRisk.yearRisks || [])
    .filter(r => r.level === "高危険" && r.majorDiseases && r.majorDiseases.length > 0)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3);

  taiun.periods.forEach((p, idx) => {
    if (p.age >= 90) return;
    const ageFrom = p.age;
    const ageTo = p.ageTo;
    const yearFrom = birthYear + ageFrom;
    const yearTo = birthYear + ageTo;
    const star = getMainStar(day.stem, p.stem);
    const isTenchu = isTenchusatsuYear(p.branch, tenchusatsu);

    const events = [];

    if (idx === 0 && ageFrom <= 20) {
      events.push({ icon: "school", text: "学生時代・人格形成期" });
    }

    // 星ごとの運勢と具体的な出来事
    const starEvents = {
      "禄存星": { text: "家庭運・パートナーシップ運が上昇。結婚や家庭を築くのに良い時期", marriage: true },
      "司禄星": { text: "コツコツ積み重ねる時期。地道な努力が財産になる", save: true },
      "石門星": { text: "人脈が広がる時期。新しいコミュニティで活躍", network: true },
      "玉堂星": { text: "学習・資格運が好調。専門性を深めて評価アップ", study: true },
      "牽牛星": { text: "社会的責任・名誉運が上昇。地位が上がる", promotion: true },
      "貫索星": { text: "独立・自立運。自分の道を切り開く", independence: true },
      "調舒星": { text: "感受性が鋭くなる一方、人間関係で孤立しやすい", caution: true },
      "龍高星": { text: "現状を壊して新しい道を切り開く変革期。転職や独立のチャンス", jobChange: true },
      "車騎星": { text: "行動力が高まるが、摩擦や衝突に注意", action: true }
    };
    const starInfo = starEvents[star];
    if (starInfo) {
      events.push({ icon: "star", text: starInfo.text });
    }

    if (isTenchu) {
      events.push({ icon: "warning", text: "天中殺期間。大きな決断（結婚・転職・起業）は少し待って、整理と準備の時間に" });
    }

    // 結婚の時期（20〜50歳の範囲で判定）
    const moteScore = mote ? mote.oppositeScore : 50;
    const canMarry = moteScore >= 35 && marriageScore >= 35;
    const easyMarry = moteScore >= 60 && marriageScore >= 55;
    const inMarriageRange = ageTo >= 20 && ageFrom <= 50;

    if (inMarriageRange) {
      if (canMarry) {
        if (isDoubleEn) {
          if (easyMarry) {
            // 二度縁＋モテ度高：1回目も2回目も結婚する
            if (starInfo && starInfo.marriage && !isTenchu) {
              events.push({ icon: "heart", text: "【1回目の結婚】のベストタイミング。若い頃の縁を大切に" });
            }
            if (ageFrom <= 29 && !isTenchu) {
              events.push({ icon: "heart", text: "【1回目の結婚】早めの結婚適齢期。出会いのチャンスが多い" });
            }
            if (ageFrom >= 30 && ageFrom <= 45 && !isTenchu) {
              events.push({ icon: "heart", text: "【2回目の結婚】のチャンス。一度目の経験を活かし、価値観の合う相手と再婚しやすい時期" });
            }
          } else {
            // 二度縁＋モテ度普通：1回目は実現せず、2回目のみ結婚
            if (ageFrom >= 30 && ageFrom <= 45 && !isTenchu) {
              events.push({ icon: "heart", text: "【2回目の結婚】のチャンス。若い頃の縁は実らなかったが、30代以降に価値観の合う相手と結婚しやすい時期" });
            }
          }
        } else {
          // 通常：1回の結婚時期
          if (easyMarry) {
            if (starInfo && starInfo.marriage && !isTenchu) {
              events.push({ icon: "heart", text: "結婚のベストタイミング。良縁に恵まれやすく、家庭を築くのに最適な時期" });
            }
            if (ageFrom <= 29 && !isTenchu) {
              events.push({ icon: "heart", text: "早めの結婚適齢期。出会いのチャンスが多く、若くして結婚に至りやすい" });
            }
            if (ageFrom >= 28 && ageFrom <= 35 && !isTenchu) {
              events.push({ icon: "heart", text: "結婚のチャンス続行。理想の相手に出会いやすい時期" });
            }
          } else {
            if (starInfo && starInfo.marriage && !isTenchu) {
              events.push({ icon: "heart", text: "結婚のチャンス。縁を大切にすれば家庭を築ける時期" });
            }
            if (ageFrom >= 25 && ageFrom <= 35 && !isTenchu) {
              events.push({ icon: "heart", text: "結婚を意識する時期。自分から積極的に出会いの場に出ることで縁が結ばれる" });
            }
            if (ageFrom >= 35 && ageFrom <= 45 && !isTenchu) {
              events.push({ icon: "heart", text: "遅めの結婚のチャンス。焦らず、価値観の合う相手を見つける時期" });
            }
          }
        }
      } else {
        events.push({ icon: "heart", text: "結婚は縁遠い時期。趣味や仕事に打ち込み、自分の時間を大切にするのが吉" });
      }
    }

    // 浮気の時期（より具体的）
    if (starInfo && (star === "鳳閣星" || star === "車騎星") && !isTenchu) {
      if (affairScore >= 45) {
        events.push({ icon: "alert", text: "異性からのアプローチが増え、浮気の誘惑が生じやすい時期" });
      }
    }
    if (ageFrom >= 25 && ageTo <= 45 && affairScore >= 80) {
      events.push({ icon: "alert", text: "浮気リスクが非常に高い時期。誘惑を避け、パートナーとの時間を大切に" });
    }
    if (ageFrom >= 25 && ageTo <= 45 && affairScore >= 65 && affairScore < 80) {
      events.push({ icon: "alert", text: "浮気リスクが高まりやすい時期。異性との距離感に注意" });
    }
    if (ageFrom >= 30 && ageTo <= 50 && affairScore >= 45 && affairScore < 65) {
      events.push({ icon: "alert", text: "浮気の誘惑がちらつく時期。自制心を保ち、家庭を守る意識が大切" });
    }

    // 転職・仕事の時期（より具体的）
    if (starInfo && starInfo.jobChange && !isTenchu) {
      events.push({ icon: "work", text: "転職や独立に最適な時期。現状を変える決断が良い結果を生みやすい" });
    }
    if (starInfo && starInfo.independence && !isTenchu) {
      events.push({ icon: "work", text: "独立・起業のチャンス。自分の力で道を切り開く決断の時期" });
    }
    if (starInfo && starInfo.promotion && !isTenchu) {
      events.push({ icon: "work", text: "昇進・昇格のチャンス。管理職やリーダー役を任されやすい" });
    }
    if (starInfo && starInfo.study && !isTenchu) {
      events.push({ icon: "work", text: "資格取得やスキルアップに最適。専門性を高めて転職や昇進につなげる" });
    }
    if (ageFrom >= 25 && ageTo <= 45 && !isTenchu) {
      events.push({ icon: "work", text: `仕事運：${workEx.rank}（${workEx.score}点）` });
    }
    if (ageFrom >= 28 && ageTo <= 50 && !isTenchu) {
      events.push({ icon: "work", text: "転職を検討するなら天中殺明け後が有利。準備期間として資格取得を進めるのが吉" });
    }
    if (isTenchu && ageFrom >= 25 && ageTo <= 55) {
      events.push({ icon: "work", text: "転職・独立は避けるべき時期。今の職場で実力を蓄えることに専念" });
    }

    // ターニングポイント
    turningPoints.filter(tp => tp.age >= ageFrom && tp.age <= ageTo).forEach(tp => {
      const labelMap = {
        "大運切り替わり": "運気の切り替わり",
        "天中殺開始": "天中殺の開始",
        "天中殺終了": "天中殺の明け（チャンスが動き出す）",
        "運気の好転": "運気の好転",
        "運気の転換": "運気の転換",
        "60年周期の大転換": "60年周期の大転換",
        "律音": "人生の分岐点（律音）",
        "大半会": "飛躍の年（大半会）",
        "納音": "統合の年（納音）",
        "天剋地冲": "大変化の年（天剋地冲）",
        "三合会局": "大成のチャンス（三合会局）",
        "方三位": "専門性が評価される年（方三位）"
      };
      const label = labelMap[tp.type] || tp.type;
      const evText = tp.events ? tp.events[0] : "";
      events.push({ icon: "turning", text: `${tp.age}歳（${tp.year}年）${label}${evText ? "：" + evText : ""}` });
    });

    // 健康リスク（TOP3のみ）
    top3HealthRisks.filter(hy => hy.year >= yearFrom && hy.year <= yearTo).forEach(hy => {
      const disease = hy.majorDiseases && hy.majorDiseases[0] ? hy.majorDiseases[0].diseases.split("・")[0] : "健康リスク";
      events.push({ icon: "health", text: `${hy.year}年（${hy.age}歳）頃に健康リスク上昇：${disease}に注意` });
    });

    stages.push({
      ageFrom, ageTo, yearFrom, yearTo, star, isTenchu, events,
      isCurrent: currentAge >= ageFrom && currentAge <= ageTo
    });
  });

  return stages;
}

function render(event) {
  if (event) event.preventDefault();
  const result = document.querySelector("#result");
  const lastNameInput = document.querySelector("#lastName");
  const firstNameInput = document.querySelector("#firstName");
  const birthYearInput = document.querySelector("#birthYear");
  const birthMonthInput = document.querySelector("#birthMonth");
  const birthDayInput = document.querySelector("#birthDay");
  const genderSelect = document.querySelector("#gender");
  const birthYear = parseInt(birthYearInput.value, 10);
  const birthMonth = parseInt(birthMonthInput.value, 10);
  const birthDay = parseInt(birthDayInput.value, 10);
  if (!birthYear || !birthMonth || !birthDay) {
    alert("生年月日を正しく入力してください");
    return;
  }
  const date = new Date(birthYear, birthMonth - 1, birthDay);
  if (isNaN(date.getTime())) {
    alert("生年月日が不正です");
    return;
  }
  const birthdateDisplay = `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`;
  const lastName = lastNameInput.value.trim();
  const firstName = firstNameInput.value.trim();
  const name = (lastName || firstName) ? `${lastName} ${firstName}`.trim() : "あなた";
  const year = getYearPillar(date);
  const month = getMonthPillar(date, stems.indexOf(year.stem));
  const day = getDayPillar(date);
  const pillars = { year, month, day };
  const allPillars = [year, month, day];
  const counts = countElements(allPillars);
  const balanceType = getBalanceType(counts);
  const daysSinceSetsuiri = getDaysSinceSetsuiri(date);
  const zoukan = {
    year: getZoukan(year.branch, daysSinceSetsuiri),
    month: getZoukan(month.branch, daysSinceSetsuiri),
    day: getZoukan(day.branch, daysSinceSetsuiri)
  };
  const mainStars = {
    north: getMainStar(day.stem, year.stem),
    south: getMainStar(day.stem, month.stem),
    east: getMainStar(day.stem, zoukan.year),
    west: getMainStar(day.stem, zoukan.day),
    center: getMainStar(day.stem, zoukan.month),
    companion: getMainStar(day.stem, stems[mod(stems.indexOf(year.stem) + 5, 10)])
  };
  const energy = [getEnergyStar(day.stem, year.branch), getEnergyStar(day.stem, month.branch), getEnergyStar(day.stem, day.branch)];
  const energyYear = { pillar: "year", name: energy[0] };
  const energyMonth = { pillar: "month", name: energy[1] };
  const energyDay = { pillar: "day", name: energy[2] };
  const tenchusatsu = getTenchusatsu(day.index);
  const maxCount = Math.max(...Object.values(counts), 1);
  const gender = genderSelect.value;
  const taiun = getTaiun(date, month, stems.indexOf(year.stem), gender);
  const currentAge = Math.floor((new Date() - date) / (365.25 * 86400000));
  const seimeiResult = analyzeSeimei(lastName, firstName);
  const topologyResults = analyzeTopology(pillars);
  const fateTenchu = analyzeFateTenchusatsu(pillars);
  const guardian = getGuardianElements(counts);
  const thisYear = 2026;
  const yearlyFortune = analyzeYearlyFortune(day, pillars, taiun, currentAge, thisYear, balanceType);
  const dailyMonthlyFortune = analyzeDailyMonthlyFortune(day, pillars, tenchusatsu, balanceType);
  const healthRisk = analyzeHealthRisk(day, pillars, counts, taiun, tenchusatsu, currentAge, thisYear, mainStars);
  const mote = analyzeMote(mainStars, energy, counts, day, pillars);
  const turningPoints = analyzeTurningPoints(day, pillars, mainStars, taiun, tenchusatsu, birthYear, currentAge);
  const workEx = calcWorkExcellence(mainStars.center, mainStars.north, mainStars.south, energy, counts, pillars);
  const luckyAdvice = buildLuckyAdvice(counts, guardian, balanceType);
  const specificJobs = buildSpecificJobs(mainStars.center, workEx);
  const parentingAdvice = buildParentingAdvice(mainStars.center);
  const troublePrevention = buildTroublePrevention(mainStars.center, tenchusatsu, turningPoints);
  const ishiki = analyzeIshiki(pillars, day);
  const sanbun = analyzeSanbun(mainStars, [energyYear, energyMonth, energyDay]);

  // buildReading用のextraデータを準備
  const readingExtra = {
    ryudo: analyzeRyudo(mainStars),
    junkan: analyzeJunkan(mainStars),
    eastSouth: analyzeEastSouth(mainStars),
    joritsu: analyzeJoritsu(mainStars),
    starCombos: analyzeStarCombos(mainStars, [energyYear, energyMonth, energyDay]),
    tripleStars: analyzeTripleStar(mainStars),
    energyBias: analyzeEnergyBias([energyYear, energyMonth, energyDay]),
    kizu: analyzeKizu(counts),
    sekishoku: analyzeSekishoku(mainStars),
    sanbun: sanbun,
    topology: topologyResults
  };
  const reading = buildReading(name, pillars, mainStars, energy, counts, tenchusatsu, seimeiResult, readingExtra);

  // 浮気リスク・結婚適性度を事前計算（saveToHistoryで使用）
  const spouseEnergyForScore = getEnergyStar(day.stem, day.branch);
  const isDoubleEnForScore = mainStars.east === mainStars.west || yinYangPairStar[mainStars.east] === mainStars.west;
  const abnormalMatchesForScore = ["year", "month", "day"].map((key) => getAbnormalZodiac(pillars[key].stem, pillars[key].branch)).filter(Boolean);
  const hasAbnormalForScore = abnormalMatchesForScore.length > 0;
  const hasTopThreeAbnormalForScore = ["year", "month", "day"].some((key) => abnormalTopThree.includes(pillars[key].stem + pillars[key].branch));
  const gogyoValsForScore = Object.values(counts);
  const gogyoBalanceForScore = Math.max(...gogyoValsForScore) - Math.min(...gogyoValsForScore);
  const gogyoEntriesForScore = Object.entries(counts);
  const gogyoMaxForScore = Math.max(...gogyoValsForScore);
  const gogyoMinForScore = Math.min(...gogyoValsForScore);
  const weakestGogyoForScore = gogyoEntriesForScore.filter(([, v]) => v === gogyoMinForScore).map(([k]) => k);
  const topologyNamesForScore = topologyResults.map(r => r.name);
  const dayElementForScore = elements[stems.indexOf(day.stem)];
  const affairScore = getAffairRiskScore({
    westStar: mainStars.west,
    spouseEnergyName: spouseEnergyForScore.name,
    isDoubleEn: isDoubleEnForScore,
    hasAbnormal: hasAbnormalForScore,
    hasTopThreeAbnormal: hasTopThreeAbnormalForScore,
    centerStar: mainStars.center,
    northStar: mainStars.north,
    southStar: mainStars.south,
    eastStar: mainStars.east,
    dayStem: day.stem,
    gogyoBalance: gogyoBalanceForScore,
    dayElement: dayElementForScore,
    tenchusatsu,
    topologyNames: topologyNamesForScore,
    weakestGogyo: weakestGogyoForScore,
    balanceType,
    gender
  });
  const marriageScore = getMarriageScore({
    centerStar: mainStars.center,
    westStar: mainStars.west,
    spouseEnergyName: spouseEnergyForScore.name,
    isDoubleEn: isDoubleEnForScore,
    hasAbnormal: hasAbnormalForScore,
    hasTopThreeAbnormal: hasTopThreeAbnormalForScore,
    affairScore,
    gogyoBalance: gogyoBalanceForScore,
    dayElement: dayElementForScore,
    tenchusatsu,
    topologyNames: topologyNamesForScore,
    weakestGogyo: weakestGogyoForScore,
    balanceType,
    gender
  });
  const lifeSummary = buildLifeSummary(mainStars, energy, counts, balanceType, tenchusatsu, ishiki, sanbun, mote, workEx, marriageScore, affairScore, turningPoints, healthRisk, gender);
  const lifeChronology = buildLifeChronology(taiun, turningPoints, healthRisk, marriageScore, affairScore, workEx, seimeiResult, tenchusatsu, birthYear, gender, day, currentAge, mote, isDoubleEnForScore);
  const kyuseiResult = analyzeKyuseiDirections(date, new Date());

  result.classList.remove("hidden");
  console.log("[render] starting, simple-mode:", document.body.classList.contains("simple-mode"));
  result.innerHTML = `
    <div class="result-card result-header">
      <div>
        <h2>${name}さんの鑑定結果</h2>
        <div class="result-version">v2.0.1</div>
        <p class="expert-only">${birthdateDisplay} 生まれ / ${tenchusatsu}天中殺 / 日干 ${day.stem}（${elements[stems.indexOf(day.stem)]}・${yinYang[stems.indexOf(day.stem)]}）</p>
        <p class="simple-only">${birthdateDisplay} 生まれ / ${gender === "male" ? "男性" : "女性"}</p>
      </div>
    </div>
    <div class="view-toggle-wrap">
      <label class="view-toggle">
        <input type="checkbox" id="viewModeToggle" />
        <span class="view-toggle-slider"></span>
        <span class="view-toggle-label-expert">専門用語あり</span>
        <span class="view-toggle-label-simple">専門用語なし</span>
      </label>
      <p class="view-toggle-hint expert-only">専門用語を含む詳細表示中。切り替えると分かりやすい表示になります。</p>
      <p class="view-toggle-hint simple-only">分かりやすい表示中。切り替えると専門的な詳細が見られます。</p>
    </div>
    <div class="result-card life-summary-card">
      <h3 class="expert-only">総合人生鑑定</h3>
      <h3 class="simple-only">あなたの人生、ざっくりいうと</h3>
      <div class="info-box is-gold">
        <p class="info-text is-lead">${lifeSummary.personality}</p>
        <p class="info-text mt-6">${lifeSummary.lifeFlow}</p>
      </div>
      <div class="life-summary-grid">
        <div class="life-summary-item"><b>運の掴み方</b><span>${lifeSummary.effortType}</span></div>
        <div class="life-summary-item"><b>仕事の向き</b><span>${lifeSummary.work}</span></div>
        <div class="life-summary-item"><b>結婚の向き</b><span>${lifeSummary.marriage}</span></div>
        <div class="life-summary-item"><b>浮気の傾向</b><span>${lifeSummary.affair}</span></div>
        <div class="life-summary-item"><b>人気度</b><span>${lifeSummary.popularity}</span></div>
        <div class="life-summary-item"><b>健康</b><span>${lifeSummary.health}</span></div>
        <div class="life-summary-item"><b>人生の転機</b><span>${lifeSummary.turningPoints}</span></div>
        <div class="life-summary-item"><b>天中殺</b><span>${lifeSummary.tenchu}</span></div>
      </div>
      <div class="life-advice-box">
        <h4 class="expert-only">人生のワンポイントアドバイス</h4>
        <h4 class="simple-only">あなたへのメッセージ</h4>
        <div class="life-advice-text">${lifeSummary.onePointAdvice.split("\n\n").map(p => `<p>${p}</p>`).join("")}</div>
      </div>
    </div>
    <div class="result-card life-chronology-card">
      <h3 class="expert-only">自分年表（姓名判断×算命学 総合人生予測）</h3>
      <h3 class="simple-only">あなたの人生年表</h3>
      <p class="expert-only note mb-14">大運（10年周期）の星・天中殺・ターニングポイント・健康リスク・姓名判断の各格の影響を統合し、年代別に具体的にどんなことが起きるかを表示します。</p>
      <p class="simple-only note mb-14">年代別に、仕事・結婚・転職・健康など、どんなことが起きやすいかをやさしくお伝えします。</p>
      <div class="life-chronology-timeline">
        ${lifeChronology.map((s) => `
          <div class="chronology-stage${s.isCurrent ? " current" : ""}${s.isTenchu ? " tenchu" : ""}">
            <div class="chronology-stage-header">
              <span class="chronology-age">${s.ageFrom}〜${s.ageTo}歳</span>
              <span class="chronology-year">（${s.yearFrom}〜${s.yearTo}年）</span>
              <span class="chronology-star">${s.star}</span>
              ${s.isTenchu ? '<span class="tenchu-badge">天中殺</span>' : ''}
              ${s.isCurrent ? '<span class="chronology-current-tag">現在</span>' : ''}
            </div>
            <div class="chronology-events">
              ${s.events.map((e) => `<div class="chronology-event chronology-icon-${e.icon}">${e.text}</div>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
    <div class="result-card kyusei-card">
      <h3 class="expert-only">九星気学 方位判定（${kyuseiResult.adjustedYear}年 ${kyuseiResult.yearBranch}年）</h3>
      <h3 class="simple-only">九星気学で見る開運方位</h3>
      <p class="expert-only note mb-14">九星気学は算命学とは別の体系で、生年月日の九星と方位盤から吉凶方位を導きます。引越し・旅行・開運方位の参考にしてください。</p>
      <p class="simple-only note mb-14">引越しや旅行の方角選びに役立つ、九星気学の方位占いです。算命学とは違う視点から運勢を読み解きます。</p>
      <div class="kyusei-stars-info">
        <div class="kyusei-star-item">
          <span class="kyusei-star-label">本命星</span>
          <span class="kyusei-star-value">${kyuseiResult.honmeisei.name}（${kyuseiResult.honmeisei.element}）</span>
        </div>
        <div class="kyusei-star-item">
          <span class="kyusei-star-label">月命星</span>
          <span class="kyusei-star-value">${kyuseiResult.getsumeisei.name}（${kyuseiResult.getsumeisei.element}）</span>
        </div>
        <div class="kyusei-star-item">
          <span class="kyusei-star-label">日命星</span>
          <span class="kyusei-star-value">${kyuseiResult.nichimeisei.name}（${kyuseiResult.nichimeisei.element}）</span>
        </div>
      </div>
      <div class="kyusei-board-wrap">
        <h4 class="expert-only">${kyuseiResult.adjustedYear}年 年盤</h4>
        <h4 class="simple-only">今年的方位盤</h4>
        <div class="kyusei-board">
          ${[4, 9, 2, 3, 5, 7, 8, 1, 6].map(pos => {
            const star = kyuseiResult.yearBoard[pos];
            const starName = kyuseiStarNames[star - 1];
            const isGood = kyuseiResult.goodDirections.some(g => g.position === pos);
            const isBad = kyuseiResult.badPositions.includes(pos);
            const cls = pos === 5 ? "kyusei-cell center" : "kyusei-cell";
            const badge = isGood ? '<span class="kyusei-badge good">吉</span>' : isBad ? '<span class="kyusei-badge bad">凶</span>' : '';
            return `<div class="${cls}${isGood ? " is-good" : ""}${isBad ? " is-bad" : ""}">
              <span class="kyusei-pos">${kyuseiPositionNames[pos]}</span>
              <span class="kyusei-star">${starName}</span>
              ${badge}
            </div>`;
          }).join("")}
        </div>
      </div>
      <div class="kyusei-directions">
        <div class="kyusei-good-directions">
          <h4 class="expert-only">吉方位（開運方位）</h4>
          <h4 class="simple-only">運気が上がる方角</h4>
          ${kyuseiResult.goodDirections.length > 0
            ? `<div class="kyusei-good-summary"><span class="kyusei-good-label">吉方位</span> ${kyuseiResult.goodDirections.map(g => `<span class="kyusei-good-tag">${g.direction}</span>`).join("\n")}</div>
               <ul class="kyusei-dir-list">${kyuseiResult.goodDirections.map(g => `<li><b>${g.direction}</b>　${g.star}（${g.relationship}）</li>`).join("")}</ul>
               <p class="note-text-sm mt-6">引越し・旅行・開運アクションに良い方角です。吉方位への移動は運気上昇の手助けになります。</p>`
            : "<p class='note'>今年は吉方位が少ない年です。無理に移動せず、今の場所で地力を養うのも一手です。</p>"
          }
        </div>
        <div class="kyusei-bad-directions">
          <h4 class="expert-only">凶方位（要注意方位）</h4>
          <h4 class="simple-only">気をつけたい方角</h4>
          <ul class="kyusei-dir-list">
            ${kyuseiResult.badDirections.map(b => `<li><b>${b.direction}</b>　<span class="kyusei-bad-type">${b.type}</span> — ${b.note}</li>`).join("")}
          </ul>
          <p class="note-text-sm mt-6">これらの方角への引越し・長距離移動は避けるのが無難です。やむを得ない場合は、吉方位を経由するなど工夫を。</p>
        </div>
      </div>
      <div class="kyusei-sub-section">
        <h4 class="expert-only">${kyuseiResult.monthLabel}の月盤</h4>
        <h4 class="simple-only">今月の方位盤</h4>
        <div class="kyusei-board kyusei-board-sm">
          ${[4, 9, 2, 3, 5, 7, 8, 1, 6].map(pos => {
            const star = kyuseiResult.monthBoard[pos];
            const starName = kyuseiStarNames[star - 1];
            const isGood = kyuseiResult.monthGoodDirections.some(g => g.position === pos);
            const isBad = kyuseiResult.monthBadPositions.includes(pos);
            const cls = pos === 5 ? "kyusei-cell center" : "kyusei-cell";
            const badge = isGood ? '<span class="kyusei-badge good">吉</span>' : isBad ? '<span class="kyusei-badge bad">凶</span>' : '';
            return `<div class="${cls}${isGood ? " is-good" : ""}${isBad ? " is-bad" : ""}">
              <span class="kyusei-pos">${kyuseiPositionNames[pos]}</span>
              <span class="kyusei-star">${starName}</span>
              ${badge}
            </div>`;
          }).join("")}
        </div>
        <div class="kyusei-directions kyusei-directions-sm">
          <div class="kyusei-good-directions">
            <h4 class="expert-only">今月の吉方位</h4>
            <h4 class="simple-only">今月運気が上がる方角</h4>
            ${kyuseiResult.monthGoodDirections.length > 0
              ? `<div class="kyusei-good-summary"><span class="kyusei-good-label">今月の吉方位</span> ${kyuseiResult.monthGoodDirections.map(g => `<span class="kyusei-good-tag">${g.direction}</span>`).join("\n")}</div>
                 <ul class="kyusei-dir-list">${kyuseiResult.monthGoodDirections.map(g => `<li><b>${g.direction}</b>　${g.star}（${g.relationship}）</li>`).join("")}</ul>`
              : "<p class='note'>今月は吉方位が少ない月です。</p>"
            }
          </div>
          <div class="kyusei-bad-directions">
            <h4 class="expert-only">今月の凶方位</h4>
            <h4 class="simple-only">今月気をつけたい方角</h4>
            <ul class="kyusei-dir-list">
              ${kyuseiResult.monthBadDirections.map(b => `<li><b>${b.direction}</b>　<span class="kyusei-bad-type">${b.type}</span> — ${b.note}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
      <div class="kyusei-sub-section">
        <h4 class="expert-only">${kyuseiResult.targetDate.getMonth()+1}月${kyuseiResult.targetDate.getDate()}日の日盤</h4>
        <h4 class="simple-only">今日の方位盤</h4>
        <div class="kyusei-board kyusei-board-sm">
          ${[4, 9, 2, 3, 5, 7, 8, 1, 6].map(pos => {
            const star = kyuseiResult.dayBoard[pos];
            const starName = kyuseiStarNames[star - 1];
            const isGood = kyuseiResult.dayGoodDirections.some(g => g.position === pos);
            const isBad = kyuseiResult.dayBadPositions.includes(pos);
            const cls = pos === 5 ? "kyusei-cell center" : "kyusei-cell";
            const badge = isGood ? '<span class="kyusei-badge good">吉</span>' : isBad ? '<span class="kyusei-badge bad">凶</span>' : '';
            return `<div class="${cls}${isGood ? " is-good" : ""}${isBad ? " is-bad" : ""}">
              <span class="kyusei-pos">${kyuseiPositionNames[pos]}</span>
              <span class="kyusei-star">${starName}</span>
              ${badge}
            </div>`;
          }).join("")}
        </div>
        <div class="kyusei-directions kyusei-directions-sm">
          <div class="kyusei-good-directions">
            <h4 class="expert-only">今日の吉方位</h4>
            <h4 class="simple-only">今日運気が上がる方角</h4>
            ${kyuseiResult.dayGoodDirections.length > 0
              ? `<div class="kyusei-good-summary"><span class="kyusei-good-label">今日の吉方位</span> ${kyuseiResult.dayGoodDirections.map(g => `<span class="kyusei-good-tag">${g.direction}</span>`).join("\n")}</div>
                 <ul class="kyusei-dir-list">${kyuseiResult.dayGoodDirections.map(g => `<li><b>${g.direction}</b>　${g.star}（${g.relationship}）</li>`).join("")}</ul>`
              : "<p class='note'>今日は吉方位が少ない日です。</p>"
            }
          </div>
          <div class="kyusei-bad-directions">
            <h4 class="expert-only">今日の凶方位</h4>
            <h4 class="simple-only">今日気をつけたい方角</h4>
            <ul class="kyusei-dir-list">
              ${kyuseiResult.dayBadDirections.map(b => `<li><b>${b.direction}</b>　<span class="kyusei-bad-type">${b.type}</span> — ${b.note}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="section-group-header expert-only">運勢の全体像<span class="sg-sub">今年の運勢・開運アクション</span></div>
    <div class="section-group-header simple-only">今年の運勢<span class="sg-sub">何に気をつけて、何をすればいい？</span></div>
    <div class="result-card yearly-fortune-card">
      <h3 class="expert-only">${yearlyFortune.thisYear}年の総合運勢（大運×年運 統合判定）</h3>
      <h3 class="simple-only">${yearlyFortune.thisYear}年、あなたの運勢</h3>
      <div class="yearly-summary expert-only info-box is-gold">${buildYearlySummary(yearlyFortune, false)}</div>
      <div class="yearly-summary simple-only info-box is-gold">${buildYearlySummary(yearlyFortune, true)}</div>
      <div class="yearly-fortune-overview expert-only">
        <div class="yearly-fortune-pillars">
          ${yearlyFortune.currentTaiun ? `<span class="yf-pillar"><b>現在の大運</b> ${yearlyFortune.currentTaiun.stem}${yearlyFortune.currentTaiun.branch}（${yearlyFortune.taiunStar}・${yearlyFortune.taiunEnergy.name}）${yearlyFortune.isTaiunTenchu ? ' <span class="tenchu-badge">天中殺</span>' : ''}</span>` : ''}
          <span class="yf-pillar"><b>年運</b> ${yearlyFortune.yp.stem}${yearlyFortune.yp.branch}（${yearlyFortune.yearStar}・${yearlyFortune.yearEnergy.name}）${yearlyFortune.isYearTenchu ? ' <span class="tenchu-badge">天中殺</span>' : ''}</span>
        </div>
        <div class="yearly-fortune-rel">
          <span><b>日干との相性関係</b> 年運: ${yearlyFortune.yearRel}${yearlyFortune.taiunRel ? ` / 大運: ${yearlyFortune.taiunRel}` : ''}</span>
        </div>
      </div>
      ${(() => {
        const taiunInfo = yearlyFortune.taiunStar ? starToPlainDesc(yearlyFortune.taiunStar, yearlyFortune.isTaiunTenchu, yearlyFortune.taiunRel, "大運") : null;
        const yearInfo = starToPlainDesc(yearlyFortune.yearStar, yearlyFortune.isYearTenchu, yearlyFortune.yearRel, "年運");
        const energyDescMap = {
          "天貴星": "品性と役割意識を磨く時期", "天南星": "内なる想いを形にする時期", "天禄星": "コツコツ積み重ねて安定を築く時期",
          "天将星": "大きな変化を生み出す時期", "天堂星": "一歩下がって協調する時期", "天恍星": "現状を打破し飛び込む時期",
          "天印星": "目の前の現実に集中する時期", "天報星": "前例のない道を切り開く時期", "天胡星": "感受性と集中力が高まる時期",
          "天極星": "環境に合わせて持続する時期", "天庫星": "一つのことに集中して探究する時期", "天馳星": "動きの中で変化を受け入れる時期"
        };
        const taiunEnergyTitle = taiunInfo && yearlyFortune.taiunEnergy ? energyDescMap[yearlyFortune.taiunEnergy.name] : "";
        const yearEnergyTitle = yearInfo && yearlyFortune.yearEnergy ? energyDescMap[yearlyFortune.yearEnergy.name] : "";
        let html = '<div class="taiun-year-friendly">';
        if (taiunInfo) {
          html += `<div class="tyf-block tyf-taiun${yearlyFortune.isTaiunTenchu ? " is-tenchu" : ""}>
            <div class="tyf-header"><span class="tyf-period">大運（10年周期）</span>${yearlyFortune.isTaiunTenchu ? '<span class="tenchu-badge">天中殺</span>' : ''}</div>
            <div class="tyf-title">${taiunInfo.title}</div>
            <div class="tyf-desc">${taiunInfo.desc}</div>
            ${taiunEnergyTitle ? `<div class="tyf-energy">ライフテーマ：${taiunEnergyTitle}</div>` : ''}
            <div class="tyf-rel">あなたとの相性：${taiunInfo.relText || "影響範囲外"}</div>
            ${yearlyFortune.isTaiunTenchu ? '<div class="tyf-tenchu-note">天中殺中：大きな決断は避け、整理と準備に徹するのが正解。転職や結婚は時期が明けてからにする</div>' : ''}
          </div>`;
        }
        if (yearInfo) {
          html += `<div class="tyf-block tyf-year${yearlyFortune.isYearTenchu ? " is-tenchu" : ""}>
            <div class="tyf-header"><span class="tyf-period">年運（今年1年）</span>${yearlyFortune.isYearTenchu ? '<span class="tenchu-badge">天中殺</span>' : ''}</div>
            <div class="tyf-title">${yearInfo.title}</div>
            <div class="tyf-desc">${yearInfo.desc}</div>
            ${yearEnergyTitle ? `<div class="tyf-energy">今年のテーマ：${yearEnergyTitle}</div>` : ''}
            <div class="tyf-rel">あなたとの相性：${yearInfo.relText || "影響範囲外"}</div>
            ${yearlyFortune.isYearTenchu ? '<div class="tyf-tenchu-note">天中殺の年：新しいスタートは来年に回し、準備と体力作りに専念する。新プロジェクトの立ち上げは避ける</div>' : ''}
          </div>`;
        }
        html += '</div>';
        return html;
      })()}
      <div class="yearly-fortune-scores">
        <div class="yf-score-item">
          <div class="yf-score-header"><b>金運</b></div>
          <div class="yf-score-bar"><i class="is-money" style="--yf-width:${yearlyFortune.moneyScore}%"></i></div>
          <div class="yf-score-num">${yearlyFortune.moneyScore}点</div>
        </div>
        <div class="yf-score-item">
          <div class="yf-score-header"><b>恋愛運</b></div>
          <div class="yf-score-bar"><i class="is-love" style="--yf-width:${yearlyFortune.loveScore}%"></i></div>
          <div class="yf-score-num">${yearlyFortune.loveScore}点</div>
        </div>
        <div class="yf-score-item">
          <div class="yf-score-header"><b>仕事運</b></div>
          <div class="yf-score-bar"><i class="is-work" style="--yf-width:${yearlyFortune.workScore}%"></i></div>
          <div class="yf-score-num">${yearlyFortune.workScore}点</div>
        </div>
      </div>
      <div class="yearly-concrete-desc">
        <h4 class="expert-only">今年はこんな年になります</h4>
        <h4 class="simple-only">今年はこんな年になりそう</h4>
        <p class="simple-only note mt-6">ポイントを押さえて、安心して一年を過ごしましょう。</p>
        ${(() => {
          const concreteParts = buildYearlyConcreteDescription(yearlyFortune, false);
          const concretePartsSimple = buildYearlyConcreteDescription(yearlyFortune, true);
          return `<div class="expert-only"><ul class="concrete-year-list">${concreteParts.map((p) => `<li>${p}</li>`).join("")}</ul></div>
                  <div class="simple-only"><ul class="concrete-year-list">${concretePartsSimple.map((p) => `<li>${p}</li>`).join("")}</ul></div>`;
        })()}
      </div>
      <div class="yearly-fortune-detail expert-only">
        <article>
          <h4>金運</h4>
          <div>${yearlyFortune.moneyText}</div>
        </article>
        <article>
          <h4>恋愛運</h4>
          <div>${yearlyFortune.loveText}</div>
        </article>
        <article>
          <h4>仕事運</h4>
          <div>${yearlyFortune.workText}</div>
        </article>
      </div>
      ${(() => {
        const allTopo = [...(yearlyFortune.taiunTopo || []).map((r) => ({ ...r, source: "大運" })), ...yearlyFortune.yearTopo.map((r) => ({ ...r, source: "年運" }))];
        if (allTopo.length === 0) return '';
        const topoSummary = topologySummary(allTopo);
        const topoBrief = topologyBriefDescription(allTopo);
        const goNames = allTopo.filter((r) => r.group === "合法").map((r) => r.name);
        const sanNames = allTopo.filter((r) => r.group === "散法").map((r) => r.name);
        const goNotes = allTopo.filter((r) => r.group === "合法").map((r) => `<div class="topo-note-row"><span class="topo-mini-tag tag-go">${r.name}</span><span class="topo-note-text">${r.note}</span></div>`);
        const sanNotes = allTopo.filter((r) => r.group === "散法").map((r) => `<div class="topo-note-row"><span class="topo-mini-tag tag-san">${r.name}</span><span class="topo-note-text">${r.note}</span></div>`);
        return `<div class="yearly-fortune-topo">
          <h4 class="expert-only">位相法による運勢の補足</h4>
          <h4 class="simple-only">今年の人との縁・出来事</h4>
          ${topoBrief ? `<div class="topo-brief-desc info-box is-blue">${topoBrief}</div>` : ''}
          <div class="expert-only">
            ${topoSummary ? `<div class="topology-summary">
              <div class="topology-summary-title">${topoSummary.title}</div>
              <div class="topology-summary-text">${topoSummary.text}</div>
              <div class="topology-summary-advice"><b>アドバイス：</b>${topoSummary.advice}</div>
            </div>` : ''}
            <div class="topology-tags">
              ${goNames.length ? `<div class="topo-tag-group"><span class="topo-tag-label">協力関係</span>${goNames.map((n) => `<span class="topo-mini-tag tag-go">${n}</span>`).join("")}</div>` : ''}
              ${sanNames.length ? `<div class="topo-tag-group"><span class="topo-tag-label">摩擦要素</span>${sanNames.map((n) => `<span class="topo-mini-tag tag-san">${n}</span>`).join("")}</div>` : ''}
            </div>
            ${goNotes.length ? `<div class="topo-notes"><b class="topo-notes-title">協力関係の詳細：</b>${goNotes.join("")}</div>` : ''}
            ${sanNotes.length ? `<div class="topo-notes"><b class="topo-notes-title">摩擦要素の詳細：</b>${sanNotes.join("")}</div>` : ''}
          </div>
        </div>`;
      })()}
    </div>
    <div class="result-card daily-monthly-fortune-card">
      <h3 class="expert-only">今月の運勢・今日の運勢</h3>
      <h3 class="simple-only">今月と今日の運勢</h3>
      ${(() => {
        const dm = dailyMonthlyFortune;
        const relTextMap = { "相生": "追い風", "比和": "同調", "相剋": "摩擦", "反剋": "逆風" };
        function scoreBar(label, score, cls) {
          return `<div class="dm-score-item">
            <div class="dm-score-header"><b>${label}</b></div>
            <div class="dm-score-bar"><i class="${cls}" style="--dm-width:${score}%"></i></div>
            <div class="dm-score-num">${score}点</div>
          </div>`;
        }
        function fortuneBlock(title, date, pillar, star, energy, rel, isTenchu, scores, advice) {
          return `<div class="dm-fortune-block${isTenchu ? " is-tenchu" : ""}">
            <div class="dm-fortune-header">
              <span class="dm-fortune-title">${title}</span>
              <span class="dm-fortune-date">${date}</span>
              ${isTenchu ? '<span class="tenchu-badge">天中殺</span>' : ''}
            </div>
            <div class="dm-fortune-pillars">
              <span class="dm-pillar"><b>干支</b> ${pillar.stem}${pillar.branch}</span>
              <span class="dm-pillar"><b>主星</b> ${star}</span>
              <span class="dm-pillar"><b>従星</b> ${energy.name}</span>
              <span class="dm-pillar"><b>日干との関係</b> ${rel}（${relTextMap[rel] || ""}）</span>
            </div>
            <div class="dm-fortune-scores">
              ${scoreBar("金運", scores.money, "is-money")}
              ${scoreBar("恋愛運", scores.love, "is-love")}
              ${scoreBar("仕事運", scores.work, "is-work")}
            </div>
            <div class="dm-fortune-advice">
              <b>アドバイス</b>
              <p>${advice}</p>
            </div>
          </div>`;
        }
        return fortuneBlock("今月の運勢", dm.monthly.month, dm.monthly.pillar, dm.monthly.star, dm.monthly.energy, dm.monthly.rel, dm.monthly.isTenchu, dm.monthly.scores, dm.monthly.advice)
             + fortuneBlock("今日の運勢", dm.today.date, dm.today.pillar, dm.today.star, dm.today.energy, dm.today.rel, dm.today.isTenchu, dm.today.scores, dm.today.advice);
      })()}
    </div>
    <div class="result-card">
      <h3 class="expert-only">開運アクション・ラッキーアドバイス</h3>
      <h3 class="simple-only">今日からできる開運アクション</h3>
      ${(() => {
        const la = luckyAdvice;
        return `
          <div class="info-box is-green">
            <p class="info-text is-lead">${la.advice}</p>
            <div class="info-grid">
              <div class="info-item">
                <b class="info-label">ラッキーカラー</b>
                <p>${la.weakData.color}</p>
              </div>
              <div class="info-item">
                <b class="info-label">開運方角</b>
                <p>${la.weakData.direction}</p>
              </div>
              <div class="info-item">
                <b class="info-label">得意な時間帯</b>
                <p>${la.weakData.time}</p>
              </div>
              <div class="info-item">
                <b class="info-label">開運フード</b>
                <p>${la.weakData.food}</p>
              </div>
              <div class="info-item">
                <b class="info-label">開運アクション</b>
                <p>${la.weakData.action}</p>
              </div>
              <div class="info-item">
                <b class="info-label">守護神</b>
                <p>${la.guardians.join("・")}</p>
              </div>
            </div>
          </div>
        `;
      })()}
    </div>
    <div class="section-group-header expert-only">性格・才能・適職<span class="sg-sub">本質の分析と仕事の方向性</span></div>
    <div class="section-group-header simple-only">あなたの性格と才能<span class="sg-sub">本質を知って、もっと生きやすく</span></div>
    <div class="result-card reading">
      <h3>性格</h3>
      ${reading.map((item) => { const isDetailOnly = item.title.includes("詳細") || item.title.includes("タイミング") || item.title.includes("エネルギー傾向") || item.title.includes("バランスと課題") || item.title.includes("注意が必要な時期") || item.title.includes("長所") || item.title.includes("短所"); const cls = (item.title.includes("長所") ? "is-good" : item.title.includes("短所") ? "is-bad" : item.title.includes("優秀度") ? "is-work-ex" : item.title.includes("仕事") ? "is-work" : item.title.includes("恋愛") ? "is-love" : item.title.includes("金銭") ? "is-money" : item.title.includes("結婚") ? "is-marriage" : item.title.includes("社交") ? "is-social" : item.title.includes("×日干") ? "is-star-detail" : item.title.includes("裏の") ? "is-hidden" : "") + (isDetailOnly ? " expert-only" : ""); const isWorkEx = item.title.includes("優秀度"); const scoreMatch = item.text.match(/スコア：(\d+)点/); const scoreNum = scoreMatch ? parseInt(scoreMatch[1]) : 0; const rankMatch = item.text.match(/（(.+?)）/); const rankText = rankMatch ? rankMatch[1] : ""; const detailText = item.text.replace(/総合仕事優秀度スコア：\d+点（.+?）\n/, ""); return `<article class="${cls}"><h4>${item.title}</h4><div>${isWorkEx && scoreNum ? `<div class="work-ex-score-wrap"><div class="work-ex-score-num">${scoreNum}<span>点</span></div><div class="work-ex-rank-badge">${rankText}</div></div><div class="work-ex-bar"><div class="work-ex-bar-fill" style="--work-ex-width:${scoreNum}%"></div></div><div class="work-ex-detail">${detailText}</div>` : item.text}</div></article>`; }).join("")}
    </div>
    <div class="result-card">
      <h3 class="expert-only">適職の具体化（職業名・働き方）</h3>
      <h3 class="simple-only">向いている仕事・働き方</h3>
      ${(() => {
        const sj = specificJobs;
        if (!sj) return '<p class="note">データがありません。</p>';
        return `
          <div class="info-box is-blue">
            <div class="info-section">
              <b class="info-label">具体的な職業例</b>
              <div class="tag-list">
                ${sj.jobs.map(j => `<span class="tag-pill is-blue">${j}</span>`).join("")}
              </div>
            </div>
            <div class="info-section">
              <b class="info-label">向いている働き方</b>
              <p class="info-text">${sj.workStyle}</p>
            </div>
            <div class="info-section">
              <b class="info-label">強み・武器</b>
              <p class="info-text">${sj.strengths}</p>
            </div>
            <div class="info-item">
              <b class="info-label">仕事優秀度スコア</b>
              <span class="info-inline">${sj.score}点（${sj.rank}）</span>
              <span class="note-text-sm info-inline">適職傾向：${sj.jobTendency}</span>
            </div>
          </div>
        `;
      })()}
    </div>
    <div class="section-group-header expert-only">命式の基本情報<span class="sg-sub">姓名判断・陰占・特殊干支</span></div>
    <div class="section-group-header simple-only">名前の運勢<span class="sg-sub">姓名判断</span></div>
    ${(() => {
      if (seimeiResult.error) {
        return `<div class="result-card seimei-card expert-only">
          <h3>姓名判断</h3>
          <p class="note">${seimeiResult.error}</p>
        </div>
        <div class="result-card seimei-card simple-only">
          <h3>名前の運勢</h3>
          <p class="note">${seimeiResult.error}</p>
        </div>`;
      }
      const r = seimeiResult;
      const rankClass = { "大吉": "seimei-rank-dai-kichi", "吉": "seimei-rank-kichi", "半吉": "seimei-rank-han-kichi", "凶": "seimei-rank-kyo", "大凶": "seimei-rank-dai-kyo" };
      const rankScore = { "大吉": 90, "吉": 75, "半吉": 55, "凶": 35, "大凶": 20 };
      const overallClass = rankClass[r.overallRank] || "seimei-rank-han-kichi";
      const gokakuList = [
        { name: "天格", value: r.tenkaku, rank: r.tenRank, desc: "姓の合計画数。家系・祖先から受け継ぐ運勢。", period: "生涯を通じた基盤" },
        { name: "人格", value: r.jinkaku, rank: r.jinRank, desc: "姓の末字＋名の初字。性格の核心・人生の方向性。", period: "20代後半〜50代（最重要）" },
        { name: "地格", value: r.chikaku, rank: r.chiRank, desc: "名の合計画数。内面・感受性・恋愛傾向。", period: "0歳〜20代前半" },
        { name: "外格", value: r.gaikaku, rank: r.gaiRank, desc: "総格－人格。対人関係・社会での立ち位置。", period: "社会に出てから" },
        { name: "総格", value: r.soukaku, rank: r.souRank, desc: "姓名全画数合計。晩年の運勢・人生の到達点。", period: "50代以降" }
      ];
      // 専門用語なし用の簡易説明
      const gokakuSimple = [
        { name: "姓の運勢", value: r.tenkaku, rank: r.tenRank, text: "家系や祖先から受け継ぐ基盤の運勢を表します。", period: "生涯を通じて影響" },
        { name: "性格の核", value: r.jinkaku, rank: r.jinRank, text: "名前の中央部分で、あなたの性格の核心と人生の方向性を表します。最も重要な部分です。", period: "20代後半〜50代で最も影響" },
        { name: "感受性", value: r.chikaku, rank: r.chiRank, text: "名前の部分で、内面の感受性や恋愛の傾向を表します。", period: "0歳〜20代前半で影響" },
        { name: "対人関係", value: r.gaikaku, rank: r.gaiRank, text: "社会に出てからの対人関係や、他人からの見え方を表します。", period: "社会に出てから影響" },
        { name: "晩年の運勢", value: r.soukaku, rank: r.souRank, text: "名前全体の合計で、晩年の運勢と人生の到達点を表します。", period: "50代以降で影響" }
      ];
      const simpleBalance = r.tenJinRel === "相生" && r.jinChiRel === "相生"
        ? "名前の各部分のバランスが良く、環境に恵まれやすく内面と行動が一致しやすいタイプです。"
        : r.tenJinRel === "相剋" || r.jinChiRel === "相剋"
        ? "名前の各部分に少し摩擦があり、家庭環境と自分の方向性にズレを感じやすいタイプです。"
        : "名前の各部分が同じ傾向で、安定感がありますが、柔軟性に欠ける面があります。";
      // 姓名判断から見る性格概要
      const jinGogyoPersonalityText = {
        "木": "向上心があり自分を磨き続ける努力家。ただし頑固な面も。",
        "火": "情熱的で表現力があり人を惹きつける。感情の波には注意。",
        "土": "誠実で信頼され人を支える。心配性で干渉しすぎる面も。",
        "金": "意志が強く潔くルールを重んじる。冷たさが出ることも。",
        "水": "柔軟で適応力があり洞察力が鋭い。流されやすい面も。"
      };
      const jinRankPersonalityText = {
        "大吉": "芯が強く周囲から信頼される。自分を曲げない意志の強さが長所。",
        "吉": "基本的に安定した性格。努力を続ければ大成する素質がある。",
        "半吉": "普段は安定しているが、ストレスが溜まると性格の偏りが出やすい。",
        "凶": "自己肯定感が揺らぎやすい。自分を過小評価する癖がある。",
        "大凶": "内面に不安を抱えやすく、人間関係で摩擦が出やすい。"
      };
      const chiRankPersonalityText = {
        "大吉": "感受性が豊かで素直。感情表現が自然で人に好かれる。",
        "吉": "感情が安定しており素直な心持ち。",
        "半吉": "感受性はあるがムラが出やすい。",
        "凶": "感情の起伏が激しく傷つきやすい。",
        "大凶": "内面が不安定で感情的になりやすい。"
      };
      const gaiRankPersonalityText = {
        "大吉": "社交性が高く人付き合いが上手い。初対面でも打ち解けやすい。",
        "吉": "人当たりが良く基本的に対人関係はスムーズ。",
        "半吉": "親しい人には素直だが初対面では警戒する。",
        "凶": "人付き合いが苦手で壁を作りやすい。",
        "大凶": "対人関係で摩擦が起きやすく孤立しやすい。"
      };
      const seimeiPersonalitySummary = !seimeiResult.error ? [
        jinGogyoPersonalityText[r.jinGogyo] || "",
        jinRankPersonalityText[r.jinRank?.rank] || "",
        chiRankPersonalityText[r.chiRank?.rank] || "",
        gaiRankPersonalityText[r.gaiRank?.rank] || ""
      ].filter(Boolean).join(" ") : "";
      // 簡易版（専門用語なし）
      const seimeiPersonalitySimple = !seimeiResult.error ? [
        jinGogyoPersonalityText[r.jinGogyo] || "",
        jinRankPersonalityText[r.jinRank?.rank] || "",
        chiRankPersonalityText[r.chiRank?.rank] || "",
        gaiRankPersonalityText[r.gaiRank?.rank] || ""
      ].filter(Boolean).join(" ") : "";
      return `<div class="result-card seimei-card expert-only">
        <h3>姓名判断（${r.lastName} ${r.firstName}）</h3>
        <div class="seimei-overview">
          <div class="seimei-overall ${overallClass}">
            <span class="seimei-overall-label">総合判定</span>
            <span class="seimei-overall-rank">${r.overallRank}</span>
            <span class="seimei-overall-sub">${rankScore[r.overallRank] || 55}点 / 吉${r.goodCount} / 凶${r.badCount}</span>
          </div>
          <div class="seimei-stroke-info">
            <div class="seimei-stroke-row"><b>姓</b> ${r.lastChars.map((ch, i) => `${ch}(${r.lastStrokes[i]})`).join(" ＋ ")} = <strong>${r.tenkaku}画</strong></div>
            <div class="seimei-stroke-row"><b>名</b> ${r.firstChars.map((ch, i) => `${ch}(${r.firstStrokes[i]})`).join(" ＋ ")} = <strong>${r.chikaku}画</strong></div>
          </div>
        </div>
        <div class="info-box is-gold mt-10">
          <p class="info-text is-lead">${seimeiPersonalitySummary}</p>
        </div>
        <div class="seimei-gokaku">
          ${gokakuList.map((g) => `
            <div class="seimei-gokaku-item ${rankClass[g.rank.rank] || ''}">
              <div class="seimei-gokaku-head">
                <b>${g.name}</b>
                <span class="seimei-gokaku-value">${g.value}画</span>
                <span class="seimei-gokaku-rank">${g.rank.rank}</span>
                <span class="seimei-gokaku-score">${rankScore[g.rank.rank] || 50}点</span>
              </div>
              <div class="seimei-gokaku-keyword">${g.rank.keyword}</div>
              <div class="seimei-gokaku-desc">${g.desc}</div>
              <div class="seimei-gokaku-period">影響が強い時期: ${g.period}</div>
              <div class="seimei-gokaku-text">${g.rank.text}</div>
            </div>
          `).join("")}
        </div>
        <div class="seimei-sansai">
          <h4>三才配置（天格・人格・地格のバランス）</h4>
          <div class="seimei-sansai-flow">
            <span class="seimei-gogyo-tag">${r.sancai}</span>
            <span class="seimei-rel">天格→人格: ${r.tenJinRel}</span>
            <span class="seimei-rel">人格→地格: ${r.jinChiRel}</span>
          </div>
          <p class="note-text-sm mt-6">${r.tenJinRel === "相生" ? "天格から人格へは相生（支え合う）の流れがあり、環境から個人の運への援助が得やすい。" : r.tenJinRel === "相剋" ? "天格から人格へは相剋（ぶつかり合う）の流れがあり、家庭背景と個人の方向性に摩擦が生じやすい。" : "天格と人格は同じ性質（比和）で、安定感がある。"}${r.jinChiRel === "相生" ? "人格から地格へも相生で、内面と行動が一致しやすい。" : r.jinChiRel === "相剋" ? "人格から地格へは相剋で、思っていることと行動にズレが生じやすい。" : "人格と地格も同じ性質（比和）で、内面と外面の調和が取りやすい。"}</p>
        </div>
        <div class="seimei-fortune-scores">
          <div class="seimei-fs-item">
            <div class="seimei-fs-header"><b>金運</b></div>
            <div class="seimei-fs-bar"><i class="is-money" style="--seimei-width:${r.moneyFortune}%"></i></div>
            <div class="seimei-fs-num">${r.moneyFortune}点</div>
          </div>
          <div class="seimei-fs-item">
            <div class="seimei-fs-header"><b>恋愛運</b></div>
            <div class="seimei-fs-bar"><i class="is-love" style="--seimei-width:${r.loveFortune}%"></i></div>
            <div class="seimei-fs-num">${r.loveFortune}点</div>
          </div>
          <div class="seimei-fs-item">
            <div class="seimei-fs-header"><b>仕事運</b></div>
            <div class="seimei-fs-bar"><i class="is-work" style="--seimei-width:${r.workFortune}%"></i></div>
            <div class="seimei-fs-num">${r.workFortune}点</div>
          </div>
        </div>
      </div>
      <div class="result-card seimei-card simple-only">
        <h3>名前の運勢（${r.lastName} ${r.firstName}）</h3>
        <div class="seimei-overview">
          <div class="seimei-overall ${overallClass}">
            <span class="seimei-overall-label">総合評価</span>
            <span class="seimei-overall-rank">${r.overallRank}</span>
            <span class="seimei-overall-sub">${rankScore[r.overallRank] || 55}点 / 良い${r.goodCount} / 悪い${r.badCount}</span>
          </div>
          <div class="seimei-stroke-info">
            <div class="seimei-stroke-row"><b>姓</b> ${r.lastChars.map((ch, i) => `${ch}(${r.lastStrokes[i]})`).join(" ＋ ")} = <strong>${r.tenkaku}画</strong></div>
            <div class="seimei-stroke-row"><b>名</b> ${r.firstChars.map((ch, i) => `${ch}(${r.firstStrokes[i]})`).join(" ＋ ")} = <strong>${r.chikaku}画</strong></div>
          </div>
        </div>
        <div class="info-box is-gold mt-10">
          <p class="info-text is-lead">${seimeiPersonalitySimple}</p>
        </div>
        <div class="seimei-gokaku">
          ${gokakuSimple.map((g) => `
            <div class="seimei-gokaku-item ${rankClass[g.rank.rank] || ''}">
              <div class="seimei-gokaku-head">
                <b>${g.name}</b>
                <span class="seimei-gokaku-value">${g.value}画</span>
                <span class="seimei-gokaku-rank">${g.rank.rank}</span>
                <span class="seimei-gokaku-score">${rankScore[g.rank.rank] || 50}点</span>
              </div>
              <div class="seimei-gokaku-keyword">${g.rank.keyword}</div>
              <div class="seimei-gokaku-desc">${g.text}</div>
              <div class="seimei-gokaku-period">影響が強い時期: ${g.period}</div>
              <div class="seimei-gokaku-text">${g.rank.text}</div>
            </div>
          `).join("")}
        </div>
        <div class="info-box is-gold mt-10">
          <p class="info-text"><b>名前の五行バランス（${r.sancai}）</b><br>${simpleBalance}</p>
        </div>
        <div class="seimei-fortune-scores">
          <div class="seimei-fs-item">
            <div class="seimei-fs-header"><b>金運</b></div>
            <div class="seimei-fs-bar"><i class="is-money" style="--seimei-width:${r.moneyFortune}%"></i></div>
            <div class="seimei-fs-num">${r.moneyFortune}点</div>
          </div>
          <div class="seimei-fs-item">
            <div class="seimei-fs-header"><b>恋愛運</b></div>
            <div class="seimei-fs-bar"><i class="is-love" style="--seimei-width:${r.loveFortune}%"></i></div>
            <div class="seimei-fs-num">${r.loveFortune}点</div>
          </div>
          <div class="seimei-fs-item">
            <div class="seimei-fs-header"><b>仕事運</b></div>
            <div class="seimei-fs-bar"><i class="is-work" style="--seimei-width:${r.workFortune}%"></i></div>
            <div class="seimei-fs-num">${r.workFortune}点</div>
          </div>
        </div>
      </div>`;
    })()}
    <div class="section-group-header expert-only">命式の基本情報<span class="sg-sub">陰占・特殊干支</span></div>
    <div class="section-group-header simple-only">命式の基本情報</div>
    ${(() => {
      const yinYin = analyzeYinYang(pillars);
      return `<div class="result-card expert-only">
        <h3>陰陽配列（性格のベース）</h3>
        <p class="note mb-10">四柱（年・月・日・時）の陰陽バランスから基本的な性格の傾向を見ます。陽が多い＝積極的、陰が多い＝受動的、バランス型＝柔軟。</p>
        <div class="info-box is-steel">
          <div class="yin-yang-row"><b>年柱</b> ${pillars.year.stem}${pillars.year.branch}（${yinYang[stems.indexOf(pillars.year.stem)]}/${yinYang[branches.indexOf(pillars.year.branch)]}）</div>
          <div class="yin-yang-row"><b>月柱</b> ${pillars.month.stem}${pillars.month.branch}（${yinYang[stems.indexOf(pillars.month.stem)]}/${yinYang[branches.indexOf(pillars.month.branch)]}）</div>
          <div class="yin-yang-row"><b>日柱</b> ${pillars.day.stem}${pillars.day.branch}（${yinYang[stems.indexOf(pillars.day.stem)]}/${yinYang[branches.indexOf(pillars.day.branch)]}）</div>
          ${pillars.hour ? `<div class="yin-yang-row"><b>時柱</b> ${pillars.hour.stem}${pillars.hour.branch}（${yinYang[stems.indexOf(pillars.hour.stem)]}/${yinYang[branches.indexOf(pillars.hour.branch)]}）</div>` : '<div class="yin-yang-row"><b>時柱</b> 不明（出生時刻未入力）</div>'}
          <p class="info-text mt-6">${yinYin.summary}</p>
        </div>
      </div>`;
    })()}
    ${(() => {
      const specialRels = analyzeSpecialRelations(pillars);
      if (specialRels.length === 0) return '';
      return `<div class="result-card expert-only">
        <h3>特殊干支（生まれ持った特別な性質）</h3>
        <p class="note mb-10">四柱の干支の特定の組み合わせから、生まれ持った特別な性質や傾向を読み取ります。</p>
        <div class="special-rel-list">
          ${specialRels.map(rel => `
            <div class="special-rel-item">
              <div class="special-rel-head"><b>${rel.name}</b> <span class="special-rel-type">${rel.type}</span></div>
              <div class="special-rel-text">${rel.text}</div>
            </div>
          `).join("")}
        </div>
      </div>`;
    })()}
    ${(() => {
      const kizu = analyzeKizu(counts);
      if (!kizu) return '';
      return `<div class="result-card expert-only">
        <h3>木・火・土・金・水の位置バランス（木図）</h3>
        <p class="note mb-10">内面の5つのエネルギー（木・火・土・金・水）を自然界の定位置に配置し、縦線（精神性）と横線（行動力）のどちらが強いかを比較します。縦線が強い＝感受性豊か、横線が強い＝実行力があるタイプです。</p>
        <div class="info-box is-steel">
          <div class="kizu-type"><b>タイプ：</b>${kizu.type}</div>
          <div class="kizu-bars">
            <div class="kizu-bar-row"><span>縦線（北・水＋南・火）</span><div class="kizu-bar"><i style="--kizu-width:${Math.min(kizu.vertical / 6 * 100, 100)}%"></i></div><b>${kizu.vertical}</b></div>
            <div class="kizu-bar-row"><span>横線（東・木＋西・金）</span><div class="kizu-bar"><i class="is-horiz" style="--kizu-width:${Math.min(kizu.horizontal / 6 * 100, 100)}%"></i></div><b>${kizu.horizontal}</b></div>
          </div>
          <p class="info-text mt-6">${kizu.text}</p>
          <p class="note-text-sm mt-6">${kizu.schoolAdvice}</p>
        </div>
      </div>`;
    })()}
    ${(() => {
      const hachimon = analyzeHachimon(day.stem, counts);
      if (!hachimon) return '';
      const dirLabels = { north: "北", south: "南", east: "東", west: "西", center: "中央" };
      return `<div class="result-card expert-only">
        <h3>八門法（あなたの器の型）</h3>
        <p class="note mb-10">自分を中心にしたエネルギーの流れから、どんな「器」のタイプかを判定します。縦線が強い＝感受性・直感型、横線が強い＝論理・行動型で、合計8パターンの器の型があります。</p>
        <div class="info-box is-purple">
          <div class="hachimon-type"><b>器の型：</b><span class="hachimon-type-name">${hachimon.type.name}</span></div>
          <div class="hachimon-positions">
            ${Object.entries(hachimon.positions).map(([dir, val]) => `<span class="hachimon-pos${dir === hachimon.maxDir ? " is-max" : ""}">${dirLabels[dir]}：${val}</span>`).join("")}
          </div>
          <p class="info-text mt-6">${hachimon.type.text}</p>
          <div class="hachimon-sub">
            <div class="hachimon-sub-row"><b>陰陽分類：</b><span class="hachimon-sub-val">${hachimon.yinYang}</span> − ${hachimon.yinYangText}</div>
            <div class="hachimon-sub-row"><b>順逆分類：</b><span class="hachimon-sub-val">${hachimon.junGyo}</span> − ${hachimon.junGyoText}</div>
          </div>
        </div>
      </div>`;
    })()}
    ${(() => {
      const combos = analyzeStarCombos(mainStars, [energyYear, energyMonth, energyDay]);
      if (combos.length === 0) return '';
      return `<div class="result-card expert-only">
        <h3>星の組み合わせ（起こりやすい現象）</h3>
        <p class="note mb-10">性格を表す星と心の状態を表す星の特定の組み合わせから、その人に起こりやすい現象や傾向を読み取ります。</p>
        <div class="combo-list">
          ${combos.map(c => `
            <div class="combo-item">
              <div class="combo-head"><span class="combo-type">${c.type}</span><b>${c.name}</b></div>
              <div class="combo-note">${c.note}</div>
            </div>
          `).join("")}
        </div>
      </div>`;
    })()}
    ${(() => {
      const triples = analyzeTripleStar(mainStars);
      if (triples.length === 0) return '';
      return `<div class="result-card expert-only">
        <h3>同星3連変化（天才・変人タイプ）</h3>
        <p class="note mb-10">同じ性格の星が3つ以上ある場合、その性質が極端に強くなります。一般的な常識に当てはまらない、独特の個性を持つ天才型・変人型が多いと言われます。</p>
        <div class="triple-list">
          ${triples.map(t => `
            <div class="triple-item">
              <div class="triple-head"><b>${t.star}</b><span class="triple-count">${t.count}つ</span><span class="triple-dir">${t.dir}</span></div>
              <div class="triple-text">${t.text}</div>
            </div>
          `).join("")}
        </div>
      </div>`;
    })()}
    ${(() => {
      const biases = analyzeEnergyBias([energyYear, energyMonth, energyDay]);
      if (biases.length === 0) return '';
      return `<div class="result-card expert-only">
        <h3>十二大従星の偏り（強く現れる性質）</h3>
        <p class="note mb-10">十二大従星（月・日・年）の偏りから、性格的に強く現れる性質を読み取ります。</p>
        <div class="bias-list">
          ${biases.map(b => `
            <div class="bias-item">
              <div class="bias-head"><b>${b.star}</b> <span class="bias-count">${b.count}つ</span></div>
              <div class="bias-text">${b.text}</div>
            </div>
          `).join("")}
        </div>
      </div>`;
    })()}
    <div class="result-card expert-only">
      <h3>陰占（三柱）</h3>
      <div class="grid">
        <div class="kanshi"><strong>年柱 社会・家系</strong><span>${year.stem}${year.branch}</span></div>
        <div class="kanshi"><strong>月柱 仕事・中年期</strong><span>${month.stem}${month.branch}</span></div>
        <div class="kanshi"><strong>日柱 本質・配偶者</strong><span>${day.stem}${day.branch}</span></div>
      </div>
      <p class="note-text-sm mt-14 mb-8">陰占表（高尾式）</p>
      <table class="inyou-table">
        <thead>
          <tr><th></th><th>年柱</th><th>月柱</th><th>日柱</th></tr>
        </thead>
        <tbody>
          <tr><th>天干</th><td>${year.stem}</td><td>${month.stem}</td><td>${day.stem}</td></tr>
          <tr><th>地支</th><td>${year.branch}</td><td>${month.branch}</td><td>${day.branch}</td></tr>
          <tr><th>蔵干（二十八元）</th><td>${zoukan.year}</td><td>${zoukan.month}</td><td>${zoukan.day}</td></tr>
          <tr><th>十二大従星</th><td>${energy[0].name}</td><td>${energy[1].name}</td><td>${energy[2].name}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="result-card expert-only">
      <h3>特殊な干支（感性が鋭いタイプ）</h3>
      ${(() => {
        const pillarLabels = { year: "年柱", month: "月柱", day: "日柱" };
        const matches = ["year", "month", "day"].map((key) => {
          const p = pillars[key];
          const info = getAbnormalZodiac(p.stem, p.branch);
          return info ? { key, stem: p.stem, branch: p.branch, info } : null;
        }).filter(Boolean);
        if (matches.length === 0) {
          return '<p class="note">この命式に特殊な干支はありません（通常の干支です）。</p>';
        }
        return `
          <p class="note mb-10">生まれ持った干支の組み合わせの中で、特に感性が鋭く・直感力が強いタイプを示す特殊なパターンです。直感やひらめきに優れ、周囲が気づかないことに先に気づく才能があります。一番影響が強いのは生まれた日の干支、次いで生まれた月・年です。</p>
          <div class="abnormal-list">
            ${matches.map((m) => {
              const isTop = abnormalTopThree.includes(m.stem + m.branch);
              return `<div class="abnormal-item">
                <div class="abnormal-head">
                  <span class="pillar-tag">${pillarLabels[m.key]}</span>
                  <b>${m.stem}${m.branch}</b>
                  <span class="abnormal-type">${m.info.type}タイプ</span>
                  ${isTop ? '<span class="tenchu-badge">強烈TOP3</span>' : ''}
                </div>
                <div class="abnormal-body">心の星：${m.info.star}${m.info.note ? ` ／ ${m.info.note}` : ''}</div>
              </div>`;
            }).join("")}
          </div>
        `;
      })()}
    </div>
    <div class="section-group-header expert-only">占技詳細分析<span class="sg-sub">意識・位相法・守護神・星の配置など</span></div>
    ${(() => {
      const ishiki = analyzeIshiki(pillars, day);
      return `<div class="result-card expert-only">
        <h3>意識と無意識（努力型か恵まれ型か）</h3>
        <p class="note mb-10">自分を中心に、周囲との関係性から「意識して努力するタイプ」か「自然に恵まれるタイプ」かを判定します。意識が多い＝自分で切り開く苦労人・早咲き、無意識が多い＝周囲に助けられる恩恵型・遅咲き。</p>
        <div class="info-box is-steel">
          <div class="ishiki-counts">
            <span class="ishiki-count is-conscious">意識（努力が必要）：<b>${ishiki.conscious}</b></span>
            <span class="ishiki-count is-unconscious">無意識（自然に恵まれる）：<b>${ishiki.unconscious}</b></span>
          </div>
          <div class="ishiki-list">
            ${ishiki.targets.map(t => `
              <div class="ishiki-item">
                <span class="ishiki-pillar">${t.pillar}</span>
                <span>${t.stem}（${t.stemEl}）→${relToText(t.stemRel)}</span>
                <span>${t.branch}（${t.branchEl}）→${relToText(t.branchRel)}</span>
              </div>
            `).join("")}
          </div>
          <p class="info-text mt-6">${ishiki.summary}</p>
          <p class="note-text-sm mt-6">自分と月の地支の関係：${relToText(ishiki.monthBranchRel)}（心の葛藤度合い：${ishiki.monthConflict}）。月は中年期の場所なので、中年期に大きく現れます。</p>
        </div>
      </div>`;
    })()}
    ${(() => {
      const niko = analyzeNiko(pillars);
      if (!niko) return '';
      return `<div class="result-card expert-only">
        <h3>二行干支</h3>
        <p class="note mb-10">生年月日の干支が2種類の要素だけで構成されている場合、直感と感情で行動するパワフルなタイプになります。フィーリングを大切にし、行動力が抜群ですが、結婚して子供を持つと落ち着く傾向があります。</p>
        <div class="info-box is-purple">
          <div class="niko-pattern">
            ${niko.isTwoElements ? `<span class="niko-tag">2種類の性質のみ：${niko.elements.join("・")}</span>` : ''}
            ${niko.isTwoKanshi ? `<span class="niko-tag">2種類の干支のみ：${niko.kanshi.join("・")}</span>` : ''}
          </div>
          <p class="info-text mt-6">${niko.note}</p>
        </div>
      </div>`;
    })()}
    ${(() => {
      const henkoku = analyzeHenkoku(pillars);
      if (!henkoku) return '';
      return `<div class="result-card expert-only">
        <h3>変剋律（人生の大転換期）</h3>
        <p class="note mb-10">生まれ持った特殊な干支が2つ以上連続して現れる時期は、人生の大きな転換期になります。環境が大きく変わり、精神的な試練を経て成長する時期です。最初の5年間は悩み抜くことが陽転の鍵になります。</p>
        <div class="info-box is-steel">
          <div class="henkoku-abnormal">生まれ持った特殊な干支：${henkoku.abnormalInMeimei.join("・")}</div>
          ${henkoku.matchedChains.length > 0 ? `
            <div class="henkoku-chains">
              ${henkoku.matchedChains.map(c => `
                <div class="henkoku-chain">
                  <span class="henkoku-chain-type">${c.type}</span>
                  <b>${c.matched.join("→")}</b>
                  <div class="henkoku-chain-note">${c.note}</div>
                </div>
              `).join("")}
            </div>
          ` : '<p class="note mt-6">生まれ持った特殊な干支の組み合わせでは連続パターンは成立しませんが、運気の周期で特殊な干支が連続した場合に転換期が発生します。</p>'}
          <p class="info-text mt-6">${henkoku.note}</p>
        </div>
      </div>`;
    })()}
    ${(() => {
      const konzai = analyzeKonzai(pillars);
      return `<div class="result-card expert-only">
        <h3>混在占技（壁にぶつかる時期）</h3>
        <p class="note mb-10">普段は安定している人でも、特定の時期に突然壁にぶつかったり、迷路に入り込むような時期があるかを判定します。生年月日と運気の周期の組み合わせから、注意が必要な時期を見つけます。</p>
        <div class="info-box is-purple">
          <p class="info-text">${konzai.note}</p>
          ${konzai.hasScrambleBranch && !konzai.hasAbnormal ? '<div class="konzai-warn mt-6">⚠ 運気の周期で壁にぶつかる時期が成立した場合、特に注意が必要な年と、助けが来る年があります。心のバランスを整える要素を意識すると良いでしょう。</div>' : ''}
        </div>
      </div>`;
    })()}
    ${(() => {
      const tokushu = analyzeTokushuIso(pillars);
      if (tokushu.length === 0) return '';
      return `<div class="result-card expert-only">
        <h3>特殊位相法（干支の珍しい組み合わせ）</h3>
        <p class="note mb-10">生年月日の干支の珍しい組み合わせから、特別な結びつきや関係性を判定します。同じ干支の重なり、天干と地支の特殊な組み合わせなど、4種類のレアな関係性があります。</p>
        <div class="tokushu-list">
          ${tokushu.map(t => `
            <div class="tokushu-item">
              <div class="tokushu-head"><span class="tokushu-type">${t.type}</span><b>${t.pair}</b></div>
              <div class="tokushu-note">${t.note}</div>
            </div>
          `).join("")}
        </div>
      </div>`;
    })()}
    <div class="result-card expert-only">
      <h3>内面のバランス</h3>
      <div class="bars">${Object.entries(counts).map(([key, value]) => `<div class="bar-row"><b>${key}</b><div class="bar"><i style="--bar-width:${(value / maxCount) * 100}%"></i></div><span>${value}</span></div>`).join("")}</div>
    </div>
    <div class="result-card expert-only">
      <h3>地支の関係性（結びつきとぶつかり合い）</h3>
      <p class="note mb-10">生まれた年・月・日の地支（動物）同士の関係性を8種類のパターンで判定します。結びつきを表す関係は協力・融合を、ぶつかり合う関係はストレス・変化を意味します。</p>
      ${(() => {
        if (topologyResults.length === 0) {
          return '<p class="note">生まれた年・月・日の間に特別な関係性は検出されませんでした。</p>';
        }
        const topoSummary = topologySummary(topologyResults);
        const goNames = topologyResults.filter((r) => r.group === "合法").map((r) => r.name);
        const sanNames = topologyResults.filter((r) => r.group === "散法").map((r) => r.name);
        return `${topoSummary ? `<div class="topology-summary">
          <div class="topology-summary-title">${topoSummary.title}</div>
          <div class="topology-summary-text">${topoSummary.text}</div>
          <div class="topology-summary-advice"><b>アドバイス：</b>${topoSummary.advice}</div>
        </div>` : ''}
        <div class="topology-tags">
          ${goNames.length ? `<div class="topo-tag-group"><span class="topo-tag-label">合法</span>${goNames.map((n) => `<span class="topo-mini-tag tag-go">${n}</span>`).join("")}</div>` : ''}
          ${sanNames.length ? `<div class="topo-tag-group"><span class="topo-tag-label">散法</span>${sanNames.map((n) => `<span class="topo-mini-tag tag-san">${n}</span>`).join("")}</div>` : ''}
        </div>`;
      })()}
    </div>
    ${(() => {
      const kangouResults = analyzeKangou(pillars);
      if (kangouResults.length === 0) return '';
      return `<div class="result-card expert-only">
        <h3>干合法・干合支合・干合支害</h3>
        <p class="note mb-10">天干（上の文字）同士の引き寄せ合う関係と、地支（下の文字）の結びつき・摩擦の組み合わせを判定します。両方が結びつく場合は非常に強い縁、引き寄せつつも摩擦がある場合は「惹かれるけど衝突する」複雑な関係です。</p>
        <div class="kangou-list">
          ${kangouResults.map(r => `
            <div class="kangou-item">
              <div class="kangou-head"><b>${r.type}</b><span class="kangou-label">${r.label}</span><span class="kangou-stars">${r.stars}</span></div>
              <div class="kangou-note">${r.note}</div>
            </div>
          `).join("")}
        </div>
      </div>`;
    })()}
    ${(() => {
      const eitenResults = analyzeEitenchishi(pillars);
      if (eitenResults.length === 0) return '';
      return `<div class="result-card expert-only">
        <h3>洩天地支（内面が自然に表れる干支）</h3>
        <p class="note mb-10">内面のエネルギーが自然に外面に表れやすい干支を判定します。自分の中にある才能や思いが、自然に周囲に伝わるタイプの干支です。</p>
        <div class="eiten-list">
          ${eitenResults.map(r => `
            <div class="eiten-item">
              <div class="eiten-head"><b>${r.stem}${r.branch}</b><span class="eiten-pillar">${r.pillar}</span></div>
              <div class="eiten-note">${r.note}</div>
            </div>
          `).join("")}
        </div>
      </div>`;
    })()}
    <div class="result-card expert-only">
      <h3>宿命天中殺（型破りな人生の判定）</h3>
      <p class="note mb-10">生まれ持った命式から、常識の枠に収まらない型破りな人生を歩むかを判定します。特定の干支の組み合わせがある場合、既存の枠組みにとらわれない独自の人生になりやすいです。</p>
      ${(() => {
        const items = [];
        if (fateTenchu.seinen) items.push({ name: "生年天中殺", note: "生まれた日の干支の範囲に年支が含まれる。常識の枠を持たず、型破りな人生になりやすい。" });
        if (fateTenchu.seigetsu) items.push({ name: "生月天中殺", note: "生まれた日の干支の範囲に月支が含まれる。家系を離れて他の家系に入る（養子・結婚など）と成功しやすい。" });
        if (fateTenchu.seinichi) items.push({ name: "生日天中殺", note: "生まれた年の干支の範囲に日支が含まれる。自己完結しやすく、独自の世界観を持つ。" });
        if (fateTenchu.kokan) items.push({ name: "互換中殺", note: "生年天中殺と生日天中殺が同時に成立。年と日が相互に影響し合う特殊な関係。" });
        if (fateTenchu.dayZa) items.push({ name: "日座天中殺", note: "生まれた日の干支が甲戌または乙亥。純粋な型破りタイプで、子供と夫婦間のバランスを取りにくいが、実家を出れば成功できる。" });
        if (fateTenchu.dayKyo) items.push({ name: "日居天中殺", note: "生まれた日の干支が甲辰または乙巳。現実と精神のギャップが激しく「異世界」がキーワード。" });
        if (fateTenchu.shukumei2) items.push({ name: "宿命二中殺", note: "生年天中殺と生月天中殺の両方を保持。自分以外頼れるものはない状態だが、それが強さの源泉にもなる。" });
        if (fateTenchu.zenTenchusatsu) items.push({ name: "全天中殺", note: "日座天中殺＋生月天中殺＋生年天中殺の全てが成立。「参禅の行とする」と言われる特別な宿命。" });
        if (items.length === 0) {
          return '<p class="note">この命式に型破りな人生を示すパターンは検出されませんでした（通常の命式です）。</p>';
        }
        return `<div class="fate-tenchu-list">
          ${items.map((it) => `
            <div class="fate-tenchu-item">
              <b>${it.name}</b>
              <div class="fate-tenchu-note">${it.note}</div>
            </div>
          `).join("")}
        </div>`;
      })()}
    </div>
    <div class="result-card expert-only">
      <h3>守護神（心のバランスを整える要素）</h3>
      <p class="note mb-10">内面の5つの要素（木・火・土・金・水）のバランスを整えるのが守護神です。強すぎる性質を抑え、足りない性質を補うものを日頃の生活に取り入れることで、心のバランスが保ちやすくなります。</p>
      ${(() => {
        if (guardian.isBalanced) {
          return '<p class="note">バランスが均等に配置されており、特定の補整要素は不要なバランスの良い命式です。</p>';
        }
        const guardianNames = guardian.guardians.map((g) => `${g}（${gogyoMeaning[g]}）`).join("・");
        const strongNames = guardian.strongest.join("・");
        const weakNames = guardian.weakest.join("・");
        return `
          <div class="guardian-section">
            <div class="guardian-row"><b>最も強い性質</b><span>${strongNames}</span></div>
            <div class="guardian-row"><b>最も弱い性質</b><span>${weakNames}</span></div>
            <div class="guardian-row guardian-highlight"><b>心のバランスを整える要素</b><span>${guardianNames}</span></div>
          </div>
          <div class="note-text-sm mt-10">心のバランスを整える要素を日頃の生活や行動に取り入れることで、心のバランスを保ちやすくなります。命式内に補整要素がなくても、意識的に取り入れることで効果が期待できます。</div>
        `;
      })()}
    </div>
    ${(() => {
      const choukou = analyzeChoukou(day.stem, birthMonth);
      if (!choukou) return '';
      return `<div class="result-card expert-only">
        <h3>調候守護神（季節と自分のバランス）</h3>
        <p class="note mb-10">生まれた季節と自分の性質のバランスを整える要素を判定します。季節によって強すぎる性質を抑え、足りない性質を補うことで、運勢が安定しやすくなります。</p>
        <div class="info-box is-green">
          <div class="choukou-info">
            <span><b>日干：</b>${choukou.dayStem}</span>
            <span><b>季節：</b>${choukou.season}</span>
            <span><b>調候守護神：</b><span class="choukou-element">${choukou.element}</span></span>
          </div>
          <p class="info-text mt-6">${choukou.reason}</p>
          <p class="note-text-sm mt-6">${choukou.element}の性質を日頃の生活に取り入れることで、季節に合った自然な運勢の流れを作ることができます。</p>
        </div>
      </div>`;
    })()}
    <div class="result-card expert-only">
      <h3>陽占（人体星図・簡易）</h3>
      <div class="star-grid">
        <div class="star"><small>北・頭</small><b>${mainStars.north}</b><span>${pickByBalance(starTexts[mainStars.north], balanceType)}</span></div>
        <div class="star"><small>南・腹</small><b>${mainStars.south}</b><span>${pickByBalance(starTexts[mainStars.south], balanceType)}</span></div>
        <div class="star"><small>東・左手</small><b>${mainStars.east}</b><span>${pickByBalance(starTexts[mainStars.east], balanceType)}</span></div>
        <div class="star"><small>西・右手</small><b>${mainStars.west}</b><span>${pickByBalance(starTexts[mainStars.west], balanceType)}</span></div>
        <div class="star"><small>中央・胸</small><b>${mainStars.center}</b><span>${pickByBalance(starTexts[mainStars.center], balanceType)}</span></div>
        <div class="star"><small>右肩・伴星</small><b>${mainStars.companion}</b><span>${pickByBalance(starTexts[mainStars.companion], balanceType)}</span></div>
      </div>
    </div>
    ${(() => {
      const ryudo = analyzeRyudo(mainStars);
      return `<div class="result-card expert-only">
        <h3>流動法（人間関係の相性）</h3>
        <p class="note mb-10">自分を中心に、各方位（目上・目下・友人・家族）との相性の良し悪しを判定します。相性が良い＝自然に恵まれやすい、相性が悪い＝工夫が必要ですが成長できる関係です。</p>
        <div class="ryudo-list">
          ${ryudo.map(r => `
            <div class="ryudo-item${r.isNatural ? " is-natural" : " is-unnatural"}">
              <div class="ryudo-dir">${r.dir}</div>
              <div class="ryudo-stars">${r.myStar}（${r.myEl}） vs ${r.otherStar}（${r.otherEl}）</div>
              <div class="ryudo-rel">${r.rel}</div>
              <div class="ryudo-badge ${r.isNatural ? "tag-go" : "tag-san"}">${r.isNatural ? "自然" : "不自然"}</div>
              <div class="ryudo-advice">${r.advice}</div>
            </div>
          `).join("")}
        </div>
      </div>`;
    })()}
    ${(() => {
      const junkan = analyzeJunkan(mainStars);
      return `<div class="result-card expert-only">
        <h3>循環法（ものの考え方の根幹）</h3>
        <p class="note mb-10">性格を表す5つの星のエネルギーの流れを辿り、循環が止まる星（精神の中心）を導き出します。この星が「ものの考え方の根幹」になり、人生の土台となる考え方を表します。</p>
        <div class="info-box is-blue">
          <div class="junkan-pole"><b>極（精神の中心）：</b><span class="junkan-pole-star">${junkan.poleStar}</span></div>
          ${junkan.chain.length > 0 ? `<div class="junkan-chain">エネルギーの流れ：${junkan.chain.join(" → ")} → <b>止</b></div>` : ""}
          <p class="info-text mt-6">${junkan.note}</p>
        </div>
      </div>`;
    })()}
    ${(() => {
      const es = analyzeEastSouth(mainStars);
      return `<div class="result-card expert-only">
        <h3>東方星と南方星の関係（現実と理想）</h3>
        <p class="note mb-10">東方の星は「現実・収入・社会的地位」を、南方の星は「理想・やりがい・夢」を表します。この2つの星の関係から、現実を優先するか理想を優先するかの人生の傾向が分かります。</p>
        <div class="info-box is-gold">
          <div class="es-relation-title">${es.title}</div>
          <div class="es-relation-stars">東方星：${es.eastStar}（${es.eastEl}） / 南方星：${es.southStar}（${es.southEl}） / 関係：${relToText(es.rel)}</div>
          <p class="info-text mt-6">${es.text}</p>
        </div>
      </div>`;
    })()}
    ${(() => {
      const kizu = analyzeKizu(counts);
      return `<div class="result-card expert-only">
        <h3>気図法（精神性と行動力のどちらが強いか）</h3>
        <p class="note mb-10">内面の5つのエネルギー（木・火・土・金・水）を自然界の定位置に配置し、縦線（精神性）と横線（行動力）のどちらが強いかを比較します。縦線が強い＝感受性豊か、横線が強い＝実行力があるタイプです。</p>
        <div class="info-box is-steel">
          <div class="kizu-type"><b>タイプ：</b>${kizu.type}</div>
          <div class="kizu-bars">
            <div class="kizu-bar-row"><span>縦線（北・水＋南・火）</span><div class="kizu-bar"><i style="--kizu-width:${Math.min(kizu.vertical / 6 * 100, 100)}%"></i></div><b>${kizu.vertical}</b></div>
            <div class="kizu-bar-row"><span>横線（東・木＋西・金）</span><div class="kizu-bar"><i class="is-horiz" style="--kizu-width:${Math.min(kizu.horizontal / 6 * 100, 100)}%"></i></div><b>${kizu.horizontal}</b></div>
          </div>
          <p class="info-text mt-6">${kizu.text}</p>
          <p class="note-text-sm mt-6">${kizu.schoolAdvice}</p>
        </div>
      </div>`;
    })()}
    ${(() => {
      const hachimon = analyzeHachimon(day.stem, counts);
      if (!hachimon) return '';
      const dirLabels = { north: "北", south: "南", east: "東", west: "西", center: "中央" };
      return `<div class="result-card expert-only">
        <h3>八門法（あなたの器の型）</h3>
        <p class="note mb-10">自分を中心にしたエネルギーの流れから、どんな「器」のタイプかを判定します。縦線が強い＝感受性・直感型、横線が強い＝論理・行動型で、合計8パターンの器の型があります。</p>
        <div class="info-box is-purple">
          <div class="hachimon-type"><b>器の型：</b><span class="hachimon-type-name">${hachimon.type.name}</span></div>
          <div class="hachimon-positions">
            ${Object.entries(hachimon.positions).map(([dir, val]) => `<span class="hachimon-pos${dir === hachimon.maxDir ? " is-max" : ""}">${dirLabels[dir]}：${val}</span>`).join("")}
          </div>
          <p class="info-text mt-6">${hachimon.type.text}</p>
          <div class="hachimon-sub">
            <div class="hachimon-sub-row"><b>陰陽分類：</b><span class="hachimon-sub-val">${hachimon.yinYang}</span> − ${hachimon.yinYangText}</div>
            <div class="hachimon-sub-row"><b>順逆分類：</b><span class="hachimon-sub-val">${hachimon.junGyo}</span> − ${hachimon.junGyoText}</div>
          </div>
        </div>
      </div>`;
    })()}
    ${(() => {
      const combos = analyzeStarCombos(mainStars, [energyYear, energyMonth, energyDay]);
      if (combos.length === 0) return '';
      return `<div class="result-card expert-only">
        <h3>星の組み合わせ（起こりやすい現象）</h3>
        <p class="note mb-10">性格を表す星と心の状態を表す星の特定の組み合わせから、その人に起こりやすい現象や傾向を読み取ります。</p>
        <div class="combo-list">
          ${combos.map(c => `
            <div class="combo-item">
              <div class="combo-head"><span class="combo-type">${c.type}</span><b>${c.name}</b></div>
              <div class="combo-note">${c.note}</div>
            </div>
          `).join("")}
        </div>
      </div>`;
    })()}
    ${(() => {
      const triples = analyzeTripleStar(mainStars);
      if (triples.length === 0) return '';
      return `<div class="result-card expert-only">
        <h3>同星3連変化（天才・変人タイプ）</h3>
        <p class="note mb-10">同じ性格の星が3つ以上ある場合、その性質が極端に強くなります。一般的な常識に当てはまらない、独特の個性を持つ天才型・変人型が多いと言われます。</p>
        <div class="triple-list">
          ${triples.map(t => `
            <div class="triple-item">
              <div class="triple-head"><b>${t.star}</b><span class="triple-count">${t.count}つ</span><span class="triple-dir">${t.dir}</span></div>
              <div class="triple-text">${t.text}</div>
            </div>
          `).join("")}
        </div>
      </div>`;
    })()}
    ${(() => {
      const biases = analyzeEnergyBias([energyYear, energyMonth, energyDay]);
      if (biases.length === 0) return '';
      return `<div class="result-card expert-only">
        <h3>十二大従星の偏り（強く現れる性質）</h3>
        <p class="note mb-10">心の状態を表す星が2つ以上重なると、その星の性質が人生において強く現れます。例えば、行動的な星が2つあれば常に動き回る人生になりやすいです。</p>
        <div class="bias-list">
          ${biases.map(b => `
            <div class="bias-item">
              <div class="bias-head"><b>${b.star}</b><span class="bias-count">${b.count}つ</span></div>
              <div class="bias-text">${b.text}</div>
            </div>
          `).join("")}
        </div>
      </div>`;
    })()}
    ${(() => {
      const sanbun = analyzeSanbun(mainStars, [energyYear, energyMonth, energyDay]);
      return `<div class="result-card expert-only">
        <h3>三分法（人生3分割の運気の流れ）</h3>
        <p class="note mb-10">一生を若年期・中年期・晩年期の3つに分け、それぞれの時期の「本能（性格）」と「心（世代）」の組み合わせから運気の流れを読み取ります。現実的な性質と精神的な性質のミスマッチ数から、人生の全体像が分かります。</p>
        <div class="info-box is-steel">
          <div class="sanbun-periods">
            ${sanbun.periods.map(p => `
              <div class="sanbun-period">
                <div class="sanbun-period-head"><b>${p.label}</b><span class="sanbun-age">${p.ageRange}</span></div>
                <div class="sanbun-stars">主星：${p.mainStar} ／ 従星：${p.energyName}</div>
                <div class="sanbun-match${p.isMismatch ? " is-mismatch" : " is-match"}">${p.isMismatch ? "✕ ミスマッチ" : "○ マッチ"}</div>
              </div>
            `).join("")}
          </div>
          <div class="sanbun-summary">
            <div class="sanbun-counts">ミスマッチ：<b>${sanbun.mismatchCount}</b> ／ マッチ：<b>${sanbun.matchCount}</b></div>
            <p class="info-text mt-6">${sanbun.mismatchText}</p>
          </div>
        </div>
      </div>`;
    })()}
    ${(() => {
      const sekishoku = analyzeSekishoku(mainStars);
      if (!sekishoku) return '';
      return `<div class="result-card expert-only">
        <h3>適職占技（あなたに向いている仕事）</h3>
        <p class="note mb-10">東方の星は「現実の収入・社会的地位」、南方の星は「やりがい・夢・生きがい」を表します。この2つの星の関係から、お金重視かやりがい重視か、仕事に対する姿勢の傾向が分かります。</p>
        <div class="info-box is-purple">
          <div class="sekishoku-relation"><b>東と南の関係：</b><span class="sekishoku-relation-val">${sekishoku.relation}</span></div>
          <p class="info-text mt-6">${sekishoku.relationText}</p>
          <div class="sekishoku-stars">
            <div class="sekishoku-star">
              <div class="sekishoku-star-head"><b>東方星（現実・収入）：${sekishoku.eastStar}</b></div>
              <div class="sekishoku-keywords">キーワード：${sekishoku.eastData.keywords}</div>
              <div class="sekishoku-text">${sekishoku.eastData.text}</div>
              ${sekishoku.eastData.celebs ? `<div class="sekishoku-celebs"><span class="sekishoku-celebs-label">同じ星を持つ有名人：</span>${sekishoku.eastData.celebs}</div>` : ''}
            </div>
            <div class="sekishoku-star">
              <div class="sekishoku-star-head"><b>南方星（精神・やりがい）：${sekishoku.southStar}</b></div>
              <div class="sekishoku-keywords">キーワード：${sekishoku.southData.keywords}</div>
              <div class="sekishoku-text">${sekishoku.southData.text}</div>
              ${sekishoku.southData.celebs ? `<div class="sekishoku-celebs"><span class="sekishoku-celebs-label">同じ星を持つ有名人：</span>${sekishoku.southData.celebs}</div>` : ''}
            </div>
          </div>
        </div>
      </div>`;
    })()}
    ${(() => {
      const joritsu = analyzeJoritsu(mainStars);
      return `<div class="result-card expert-only">
        <h3>情的か理性的か（感情豊かかクールか）</h3>
        <p class="note mb-10">性格を表す星の配置から、あなたが「情的（感情豊か）」か「理性的（クール）」かを判定します。親離れ・子離れの早さや、恋愛結婚に向いているかお見合い結婚に向いているかの傾向も分かります。</p>
        <div class="info-box is-steel">
          <div class="joritsu-type"><b>タイプ：</b><span class="joritsu-type-name">${joritsu.type}</span></div>
          <p class="info-text mt-6">${joritsu.text}</p>
        </div>
      </div>`;
    })()}
    <div class="section-group-header expert-only">恋愛・対人関係<span class="sg-sub">恋愛傾向・結婚適性度・モテ度分析</span></div>
    <div class="result-card reading">
      <h3 class="expert-only">恋愛・結婚・離婚・浮気（不倫）傾向</h3>
      <h3 class="simple-only">恋愛・結婚の傾向</h3>
      ${(() => {
        const spouseEnergy = getEnergyStar(day.stem, day.branch);
        const isDoubleEn = mainStars.east === mainStars.west || yinYangPairStar[mainStars.east] === mainStars.west;
        const isInheritEn = mainStars.north === mainStars.south || yinYangPairStar[mainStars.north] === mainStars.south;
        const affairLevel = affairScore >= 80 ? "高危険" : affairScore >= 65 ? "要注意" : affairScore >= 45 ? "普通" : affairScore >= 25 ? "低め" : "安心";
        const simpleAffairLevel = affairScore >= 80 ? "要注意" : affairScore >= 65 ? "注意が必要" : affairScore >= 45 ? "普通" : affairScore >= 25 ? "低め" : "安心";
        const affairRankClass = affairScore >= 80 ? "danger" : affairScore >= 65 ? "warning" : affairScore >= 45 ? "normal" : affairScore >= 25 ? "low" : "safe";
        const affairScoreColor = affairScore >= 80 ? "#ff5050" : affairScore >= 65 ? "#f0a040" : affairScore >= 45 ? "#e0c060" : affairScore >= 25 ? "#80d080" : "#60c0e0";
        const marriageLevel = marriageScore >= 80 ? "非常に向いている" : marriageScore >= 65 ? "向いている" : marriageScore >= 45 ? "普通" : marriageScore >= 30 ? "やや向いていない" : "向いていない";
        const marriageSimpleLevel = marriageScore >= 80 ? "とても向いている" : marriageScore >= 65 ? "向いている" : marriageScore >= 45 ? "どちらともいえない" : marriageScore >= 30 ? "少し向いていないかも" : "向いていないかも";
        const marriageRankClass = marriageScore >= 80 ? "safe" : marriageScore >= 65 ? "low" : marriageScore >= 45 ? "normal" : marriageScore >= 30 ? "warning" : "danger";
        const marriageScoreColor = marriageScore >= 80 ? "#60c0e0" : marriageScore >= 65 ? "#80d080" : marriageScore >= 45 ? "#e0c060" : marriageScore >= 30 ? "#f0a040" : "#ff5050";
        const marriageAges = getMarriageAges(day, pillars, taiun, tenchusatsu, birthYear, currentAge, counts, mainStars, gender);
        const loveAges = getLoveAges(day, pillars, taiun, tenchusatsu, birthYear, currentAge, counts, mainStars, gender);
        const loveAgesHtml = loveAges.length > 0
          ? loveAges.map((y) => `<div class="mb-8"><b>${y.age}歳</b>（${y.year}年）${y.reasons.length > 0 ? "：" + y.reasons.join("、") : ""}</div>`).join("")
          : "恋愛に特に有利な時期は検出されませんでした。";
        const loveAgesHtmlSimple = loveAges.length > 0
          ? loveAges.map((y) => `<div class="mb-8"><b>${y.age}歳</b>（${y.year}年）</div>`).join("")
          : "恋愛に特に有利な時期は見つかりませんでした。";
        const marriageAgesHtml = marriageAges.length > 0
          ? marriageAges.map((y) => `<div class="mb-8"><b>${y.age}歳</b>（${y.year}年）${y.reasons.length > 0 ? "：" + y.reasons.join("、") : ""}</div>`).join("")
          : "結婚に特に有利な時期は検出されませんでした。";
        const marriageAgesHtmlSimple = marriageAges.length > 0
          ? marriageAges.map((y) => `<div class="mb-8"><b>${y.age}歳</b>（${y.year}年）</div>`).join("")
          : "結婚に特に有利な時期は見つかりませんでした。";
        return `
          <div class="expert-only">
          <article>
            <h4>結婚適性度</h4>
            <div class="affair-risk-score-wrap">
              <div class="affair-risk-score-num" style="--risk-color:${marriageScoreColor}">${marriageScore}<span>点</span></div>
              <div class="affair-risk-rank-badge affair-risk-rank-${marriageRankClass}">${marriageLevel}</div>
            </div>
            <div class="affair-risk-bar"><div class="affair-risk-bar-fill ${marriageRankClass}" style="--affair-width:${marriageScore}%"></div></div>
            <div class="note-text-sm mt-6">中央（本質）の主星・西（配偶者との関係）の主星・配偶者宮（日支）の十二大従星・二度縁の型・異常干支・浮気リスク・五行バランス・天中殺・位相 topology から総合的に算出した目安です。166名の芸能人データ（不倫・離婚・安定結婚）の統計分析（ロジスティック回帰 AUC=0.79）に基づく重み付けを反映しています。数値が高いほど結婚に向いている傾向が強いことを示します。</div>
          </article>
          <article>
            <h4>恋愛傾向</h4>
            <div>本質を表す中央（胸）の主星は「${mainStars.center}」。${pickByBalance(loveTendencyTexts[mainStars.center], balanceType)}</div>
            <ul class="love-behavior-list">
              <li><b>アプローチ・告白</b>：${loveBehaviorTexts[mainStars.center].approach}</li>
              <li><b>デートの傾向</b>：${loveBehaviorTexts[mainStars.center].date}</li>
              <li><b>連絡の取り方</b>：${loveBehaviorTexts[mainStars.center].contact}</li>
              <li><b>嫉妬・独占欲</b>：${loveBehaviorTexts[mainStars.center].jealousy}</li>
            </ul>
          </article>
          <article>
            <h4>どんな人を好きになりやすいか／どんな人は恋愛対象に入らないのか／結婚するならこんな人</h4>
            <ul class="love-behavior-list">
              <li><b>好きになりやすいタイプ</b>：${loveTypeTexts[mainStars.center].like}</li>
              <li><b>恋愛対象に入りにくいタイプ</b>：${loveTypeTexts[mainStars.center].dislike}</li>
              <li><b>結婚するならこんな人</b>：${loveTypeTexts[mainStars.center].marriage}</li>
            </ul>
          </article>
          <article>
            <h4>配偶者宮（日支）</h4>
            <div>日支は${day.branch}（蔵干${zoukan.day}）で、家庭運を象徴する十二大従星は「${spouseEnergy.name}」。${pickByBalance(spouseEnergyTexts[spouseEnergy.name], balanceType)}</div>
          </article>
          <article>
            <h4>二度の結婚運（二度縁）</h4>
            <div>${isDoubleEn ? `左手（東・${mainStars.east}）と右手（西・${mainStars.west}）が同じ、または陰陽ペアの関係にあり、二度の結婚運（二度縁）の傾向があります。伝統的には「離婚しても再び縁が巡る」とされますが、166名の芸能人統計分析では二度縁の型はむしろ結婚安定性に寄与する保護因子（OR=0.45, p=0.037）として検出されました。` : "東西の主星に二度縁の型は出ていません。一度の結婚に集中しやすいタイプです。"}</div>
          </article>
          ${isInheritEn ? `<article><h4>参考：相続の型</h4><div>頭（北・${mainStars.north}）と腹（南・${mainStars.south}）が同じ、または陰陽ペアの関係にあり、これは相続運を示す型です。結婚とは直接関係しませんが、家系・財産の継承に縁が出やすいことを意味します。</div></article>` : ""}
          <article>
            <h4>浮気・不倫の傾向</h4>
            <div>配偶者との関係性が現れやすい右手（西）の主星は「${mainStars.west}」。${pickByBalance(affairTendencyTexts[mainStars.west], balanceType)}</div>
            <div class="affair-risk-score-wrap">
              <div class="affair-risk-score-num" style="--risk-color:${affairScoreColor}">${affairScore}<span>点</span></div>
              <div class="affair-risk-rank-badge affair-risk-rank-${affairRankClass}">${affairLevel}</div>
            </div>
            <div class="affair-risk-bar"><div class="affair-risk-bar-fill ${affairRankClass}" style="--affair-width:${affairScore}%"></div></div>
            <div class="note-text-sm mt-6">全主星（中央・北・南・東・西）の傾向＋配偶者宮（日支）の心の星＋二度縁の型＋特殊な干支＋日干の陰陽＋内面のバランスの偏りから総合的に算出した目安です。166名の芸能人データの統計分析（ロジスティック回帰 AUC=0.79）に基づく重み付けを反映しています。断定ではなく傾向として参考にしてください。</div>
          </article>
          <article>
            <h4>天中殺と結婚・離婚</h4>
            <div>宿命は${tenchusatsu}天中殺。天中殺の期間中の結婚はご縁が不安定になりやすいため避けるのが無難です。反対に離婚は「二度と縁が繋がらない」ほど綺麗に切れるとされますが、天中殺中は慰謝料や財産分与などの金銭的要求が通りにくい点に注意してください。</div>
          </article>
          <article>
            <h4>結婚に適した時期（結婚年齢）</h4>
            <div>${marriageAgesHtml}</div>
            <div class="note-text-sm mt-6">大運・年運の支合（日支との引き合い）、三合会局の完成、結婚に良い星（禄存星・司禄星・石門星・玉堂星・牽牛星）の流れに加え、166名の芸能人データの統計分析（ロジスティック回帰 AUC=0.79）に基づく保護・リスク因子（日干五行・五行バランス・二度縁・性別・天中殺）を総合し、天中殺期間を除外した時期を表示しています。断定ではなく目安として参考にしてください。</div>
          </article>
          <article>
            <h4>恋愛しやすい時期</h4>
            <div>${loveAgesHtml}</div>
            <div class="note-text-sm mt-6">大運・年運の支合、半会・三合会局の強まり、恋愛に良い星（鳳閣星・調舒星・禄存星・車騎星・龍高星・石門星）の流れに加え、166名の芸能人データの統計分析に基づく因子を総合し、天中殺期間を除外した時期を表示しています。</div>
          </article>
          </div>
          <div class="simple-only">
          <article>
            <h4>結婚適性度</h4>
            <div class="affair-risk-score-wrap">
              <div class="affair-risk-score-num" style="--risk-color:${marriageScoreColor}">${marriageScore}<span>点</span></div>
              <div class="affair-risk-rank-badge affair-risk-rank-${marriageRankClass}">${marriageSimpleLevel}</div>
            </div>
            <div class="affair-risk-bar"><div class="affair-risk-bar-fill ${marriageRankClass}" style="--affair-width:${marriageScore}%"></div></div>
            <div class="note-text-sm mt-6">星の配置や性格のバランスから算出した、結婚に向いている度合いの目安です。</div>
          </article>
          <article>
            <h4>恋愛のしかた</h4>
            <div>${pickByBalance(loveTendencyTexts[mainStars.center], balanceType)}</div>
            <ul class="love-behavior-list">
              <li><b>アプローチ</b>：${loveBehaviorTexts[mainStars.center].approach}</li>
              <li><b>デート</b>：${loveBehaviorTexts[mainStars.center].date}</li>
              <li><b>連絡</b>：${loveBehaviorTexts[mainStars.center].contact}</li>
              <li><b>嫉妬しやすさ</b>：${loveBehaviorTexts[mainStars.center].jealousy}</li>
            </ul>
          </article>
          <article>
            <h4>どんな人を好きになりやすい？どんな人は恋愛対象に入らない？結婚するならこんな人</h4>
            <ul class="love-behavior-list">
              <li><b>好きになりやすいタイプ</b>：${loveTypeTexts[mainStars.center].like}</li>
              <li><b>恋愛対象に入りにくいタイプ</b>：${loveTypeTexts[mainStars.center].dislike}</li>
              <li><b>結婚するならこんな人</b>：${loveTypeTexts[mainStars.center].marriage}</li>
            </ul>
          </article>
          <article>
            <h4>家庭運の傾向</h4>
            <div>${pickByBalance(spouseEnergyTexts[spouseEnergy.name], balanceType)}</div>
          </article>
          <article>
            <h4>結婚は一度きり？それとも二度？</h4>
            <div>${isDoubleEn ? "再婚の縁が巡りやすいタイプです。離婚しても再び結婚のチャンスが訪れやすい傾向があります。" : "一度の結婚に集中しやすいタイプです。"}</div>
          </article>
          <article>
            <h4>浮気・不倫の傾向</h4>
            <div>${pickByBalance(affairTendencyTexts[mainStars.west], balanceType)}</div>
            <div class="affair-risk-score-wrap">
              <div class="affair-risk-score-num" style="--risk-color:${affairScoreColor}">${affairScore}<span>点</span></div>
              <div class="affair-risk-rank-badge affair-risk-rank-${affairRankClass}">${simpleAffairLevel}</div>
            </div>
            <div class="affair-risk-bar"><div class="affair-risk-bar-fill ${affairRankClass}" style="--affair-width:${affairScore}%"></div></div>
            <div class="note-text-sm mt-6">全体的な性格・家庭運・結婚運・生まれ持った性質のバランスから総合的に算出した目安です。</div>
          </article>
          <article>
            <h4>結婚に適した時期</h4>
            <div>${marriageAgesHtmlSimple}</div>
          </article>
          <article>
            <h4>恋愛しやすい時期</h4>
            <div>${loveAgesHtmlSimple}</div>
          </article>
          </div>
        `;
      })()}
    </div>
    <div class="result-card mote-card">
      <h3 class="expert-only">モテ度分析（異性から・同性から）</h3>
      <h3 class="simple-only">人気度チェック（異性から・同性から）</h3>
      <p class="expert-only note mb-14">性格を表す星の魅力・内面のバランス・日干の陰陽・心の星のエネルギー・特殊な干支を総合して算出しています。あくまで宿命的な素質の目安です。</p>
      <p class="simple-only note mb-14">生まれ持った性格や魅力の傾向から、異性・同性それぞれからの人気度を計算しています。あくまで目安です。</p>
      <div class="mote-scores">
        <div class="mote-score-item mote-opposite">
          <div class="mote-score-header"><b>異性からのモテ度</b></div>
          <div class="mote-score-rank rank-${mote.oppositeRank.rank}">${mote.oppositeRank.rank}</div>
          <div class="mote-score-bar"><i style="--mote-width:${mote.oppositeScore}%"></i></div>
          <div class="mote-score-num">${mote.oppositeScore}点</div>
          <div class="mote-score-label">${mote.oppositeRank.label}</div>
        </div>
        <div class="mote-score-item mote-same">
          <div class="mote-score-header"><b>同性からのモテ度</b></div>
          <div class="mote-score-rank rank-${mote.sameRank.rank}">${mote.sameRank.rank}</div>
          <div class="mote-score-bar"><i style="--mote-width:${mote.sameScore}%"></i></div>
          <div class="mote-score-num">${mote.sameScore}点</div>
          <div class="mote-score-label">${mote.sameRank.label}</div>
        </div>
      </div>
      <div class="mote-charm">
        <h4 class="expert-only">主星別の魅力ポイント</h4>
        <h4 class="simple-only">性格別の魅力ポイント</h4>
        <div class="mote-charm-list">
          ${mote.starCharmPoints.map(c => `
            <div class="mote-charm-item">
              <b class="expert-only">${c.star}</b>
              <div class="mote-charm-opp"><span class="mote-tag">異性</span>${c.oppDesc}</div>
              <div class="mote-charm-same"><span class="mote-tag">同性</span>${c.sameDesc}</div>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="mote-fans">
        <h4 class="expert-only">どんな人からモテるか（ファン層分析）</h4>
        <h4 class="simple-only">どんな人から好かれるか</h4>
        <div class="mote-fans-grid">
          <div class="mote-fans-col mote-fans-opp">
            <h5>異性から</h5>
            <div class="mote-fan-tags">
              ${mote.oppFans.slice(0, 3).map(t => `<span class="mote-fan-tag mote-fan-opp">${t}</span>`).join("")}
            </div>
            ${mote.gogyoFans.opp.length ? `<div class="mote-fans-gogyo"><b class="expert-only">内面の偏りが惹きつける異性</b><b class="simple-only">性格の偏りが惹きつける異性</b>${mote.gogyoFans.opp.map(t => `<p>${t}</p>`).join("")}</div>` : ''}
          </div>
          <div class="mote-fans-col mote-fans-same">
            <h5>同性から</h5>
            <div class="mote-fan-tags">
              ${mote.sameFans.slice(0, 3).map(t => `<span class="mote-fan-tag mote-fan-same">${t}</span>`).join("")}
            </div>
            ${mote.gogyoFans.same.length ? `<div class="mote-fans-gogyo"><b class="expert-only">内面の偏りが惹きつける同性</b><b class="simple-only">性格の偏りが惹きつける同性</b>${mote.gogyoFans.same.map(t => `<p>${t}</p>`).join("")}</div>` : ''}
          </div>
        </div>
      </div>
      <div class="mote-factors expert-only">
        <div class="mote-factors-col">
          <h4>異性から好かれる要因</h4>
          <ul>${mote.oppFactors.length ? mote.oppFactors.map(f => `<li>${f}</li>`).join("") : "<li>特に目立つ要因は見つかりませんでした</li>"}</ul>
        </div>
        <div class="mote-factors-col">
          <h4>同性から好かれる要因</h4>
          <ul>${mote.sameFactors.length ? mote.sameFactors.map(f => `<li>${f}</li>`).join("") : "<li>特に目立つ要因は見つかりませんでした</li>"}</ul>
        </div>
      </div>
    </div>
    <div class="section-group-header expert-only">運気の波と人生の流れ<span class="sg-sub">大運・年運・ターニングポイント・健康・注意点</span></div>
    <div class="result-card expert-only">
      <h3>大運（10年周期の運気）</h3>
      <p class="note mb-8">${taiun.forward ? "順行" : "逆行"} / 立運${taiun.startAge}歳</p>
      <div class="taiun-flow">
        ${taiun.periods.map((p) => {
          const isCurrent = currentAge >= p.age && currentAge <= p.ageTo;
          const mainStar = getMainStar(day.stem, p.stem);
          const topoResults = analyzeBranchTopology(p.branch, pillars, p.stem);
          const topoTags = topoResults.map((r) => `<span class="topo-mini-tag${r.group === '合法' ? ' tag-go' : ' tag-san'}">${r.name}</span>`).join("");
          const topoDesc = topologyBriefDescription(topoResults);
          const isTenchu = isTenchusatsuYear(p.branch, tenchusatsu);
          return `<div class="taiun-item${isCurrent ? " current" : ""}">
            <span class="age">${p.age}〜${p.ageTo}歳</span>
            <span class="pillar">${p.stem}${p.branch}</span>
            <span class="star-label">${mainStar}</span>
            ${isTenchu ? '<span class="tenchu-badge">天中殺</span>' : ''}
            ${topoTags ? `<div class="taiun-topo-tags">${topoTags}</div>` : ''}
            ${topoDesc ? `<div class="taiun-topo-desc">${topoDesc}</div>` : ''}
          </div>`;
        }).join("")}
      </div>
    </div>
    <div class="result-card expert-only">
      <h3>人体星図から見る人生の流れ</h3>
      ${(() => {
        const positions = [
          { label: "左肩［第三従星］", stage: "幼年期", energy: energy[0], key: "childhood" },
          { label: "左足［第二従星］", stage: "中年期", energy: energy[1], key: "middleAge" },
          { label: "右足［第一従星］", stage: "晩年期", energy: energy[2], key: "lateLife" }
        ];
        return positions.map((pos) => {
          const interp = energyLifeInterpretation[pos.energy.name];
          const text = interp ? interp[pos.key] : "";
          return `
            <div class="info-box is-blue">
              <div class="flex-row">
                <span class="note-text-sm">${pos.label}</span>
                <span class="energy-name">${pos.energy.name}</span>
                <span class="mini-badge is-blue">${pos.stage}</span>
              </div>
              <p class="info-text is-compact">${text}</p>
            </div>
          `;
        }).join("");
      })()}
    </div>
    <div class="result-card expert-only">
      <h3>人生のターニングポイント</h3>
      <p class="note mb-14">大運の切り替わり・天中殺・年運の位相法（律音・大半会・納音・天剋地冲・三合会局など）を総合し、人生の中で特に大きな変化が起こりやすい年をピンポイントで最大3つ表示します。具体的な例とともに解説します。</p>
      ${(() => {
        if (turningPoints.length === 0) {
          return '<p class="note">特筆すべきターニングポイントは検出されませんでした。</p>';
        }
        const typeLabel = (t) => {
          if (t === "大運切り替わり") return "運気の切り替わり";
          if (t === "天中殺開始") return "天中殺の開始";
          if (t === "天中殺終了") return "天中殺の終了（明け）";
          if (t === "運気の転換") return "運気の転換";
          if (t === "運気の好転") return "運気の好転";
          if (t === "60年周期の大転換") return "60年周期の大転換";
          if (t === "律音") return "律音（分岐点）";
          if (t === "大半会") return "大半会（飛躍）";
          if (t === "納音") return "納音（統合）";
          if (t === "天剋地冲") return "天剋地冲（大変化）";
          if (t === "三合会局") return "三合会局（大成）";
          if (t === "方三位") return "方三位（専門性）";
          return t;
        };
        const typeColor = (t) => {
          if (t === "天中殺開始") return "#c05050";
          if (t === "天中殺終了") return "#70d0a0";
          if (t === "運気の好転") return "#70d0a0";
          if (t === "運気の転換") return "#c0a050";
          if (t === "60年周期の大転換") return "#e06060";
          if (t === "天剋地冲") return "#e06060";
          if (t === "律音") return "#c0a050";
          if (t === "大半会") return "#70a0e0";
          if (t === "三合会局") return "#70a0e0";
          if (t === "納音") return "#a080d0";
          if (t === "方三位") return "#80c0a0";
          return "#d4a843";
        };
        return turningPoints.map((tp) => `
          <div class="turning-point${tp.isTenchu ? " tenchu" : ""}">
            <div class="flex-row mb-6">
              <b class="tp-age" style="color:${typeColor(tp.type)}">${tp.age}歳</b>
              <span class="note-text-sm">（${tp.year}年）</span>
              <span class="tp-type-tag" style="--tp-tag-bg:${typeColor(tp.type)}22;--tp-tag-color:${typeColor(tp.type)}">${typeLabel(tp.type)}</span>
              ${tp.star ? `<span class="tp-type-tag" style="--tp-tag-bg:#88888822;--tp-tag-color:#aaa">${tp.star}</span>` : ""}
              ${tp.isTenchu ? '<span class="tp-type-tag tenchu">天中殺</span>' : ""}
            </div>
            <ul class="tp-list">
              ${tp.events.map((e) => `<li>${e}</li>`).join("")}
            </ul>
          </div>
        `).join("");
      })()}
    </div>
    <div class="result-card expert-only">
      <h3>年運（1年毎の運勢）</h3>
      <div class="nenun-list">
        ${(() => {
          const thisYear = 2026;
          let html = '';
          for (let y = thisYear - 2; y <= thisYear + 8; y++) {
            const yp = getYearPillarForYear(y);
            const star = getMainStar(day.stem, yp.stem);
            const eStar = getEnergyStar(day.stem, yp.branch);
            const isTenchu = isTenchusatsuYear(yp.branch, tenchusatsu);
            const isCurrent = y === thisYear;
            const comment = nenunComments[star][isTenchu ? 1 : 0];
            const age = y - date.getFullYear();
            const topoResults = analyzeBranchTopology(yp.branch, pillars, yp.stem);
            const topoTags = topoResults.map((r) => `<span class="topo-mini-tag${r.group === '合法' ? ' tag-go' : ' tag-san'}">${r.name}</span>`).join("");
            html += `<div class="nenun-row${isCurrent ? ' current' : ''}${isTenchu ? ' tenchu' : ''}">
              <div class="nenun-year">
                <span class="yr">${y}年</span>
                <span class="yr-age">${age}歳</span>
              </div>
              <div class="nenun-pillar">${yp.stem}${yp.branch}</div>
              <div class="nenun-stars">
                <span class="star-label">${star}</span>
                <span class="energy-label">${eStar.name} ${eStar.score}点</span>
                ${isTenchu ? '<span class="tenchu-badge">天中殺</span>' : ''}
              </div>
              <div class="nenun-comment">${comment}</div>
              ${topoTags ? `<div class="nenun-topo-tags">${topoTags}</div>` : ''}
            </div>`;
          }
          return html;
        })()}
      </div>
    </div>
    <div class="result-card health-card">
      <h3 class="expert-only">病気リスク分析</h3>
      <h3 class="simple-only">健康の傾向</h3>
      <div class="health-constitution">
        <h4 class="expert-only">日干${day.stem}（${healthRisk.dayElement}）の体質</h4>
        <h4 class="simple-only">あなたの体質</h4>
        <p>${healthRisk.constitution}</p>
      </div>
      <div class="health-natal">
        <h4 class="expert-only">宿命のバランスと体質的弱点</h4>
        <h4 class="simple-only">体質的な弱点</h4>
        ${(() => {
          if (guardian.isBalanced) {
            return '<p class="expert-only note">バランスが均等に配置されており、特定の臓器への偏りリスクは低いバランスの良い命式です。</p><p class="simple-only note">バランスが良く、特定の臓器への偏りリスクは低いタイプです。</p>';
          }
          let html = '';
          if (healthRisk.natalExcess.length > 0) {
            html += `<div class="health-excess"><b class="expert-only">過剰な性質</b><b class="simple-only">強すぎる傾向</b>${healthRisk.natalExcess.map(e => `<span class="health-el-tag health-el-excess">${e.element}：${e.organs} → ${e.risk}</span>`).join("")}</div>`;
          }
          if (healthRisk.natalWeakness.length > 0) {
            html += `<div class="health-deficiency"><b class="expert-only">不足な性質</b><b class="simple-only">弱い傾向</b>${healthRisk.natalWeakness.map(e => `<span class="health-el-tag health-el-deficiency">${e.element}：${e.organs} → ${e.risk}</span>`).join("")}</div>`;
          }
          return html;
        })()}
      </div>
      <div class="health-major-diseases">
        <h4 class="expert-only">大病リスクがある年と内容</h4>
        <h4 class="simple-only">特に気をつけたい年</h4>
        <p class="expert-only note-text-sm mb-12">高危険レベル（リスクスコア50点以上）の年について、命式のバランス偏りと年運・大運の相互作用から想定される重大な疾患リスクを表示します。該当年は必ず定期健康診断を受け、該当臓器の検査を早めに行ってください。</p>
        <p class="simple-only note mb-12">健康リスクが高まる年について表示します。該当年は必ず定期健康診断を受け、該当する検査を早めに行ってください。</p>
        ${(() => {
          const major = healthRisk.majorDiseaseRisks || [];
          if (major.length === 0) {
            return '<p class="expert-only note">現時点で大病リスクが高まる年は検出されませんでした。バランスと年運の関係から見て、比較的安定しています。ただし年齢とともに定期健診は必須です。</p><p class="simple-only note">今のところ、特に大きな健康リスクが高まる年は見つかりませんでした。比較的安定していますが、年齢とともに定期健診は必須です。</p>';
          }
          const levelClass = { "高危険": "health-risk-high" };
          const topRisk = major[0];
          const topDiseaseName = topRisk.majorDiseases.length > 0
            ? topRisk.majorDiseases[0].diseases.split("・")[0]
            : "特定の疾患";
          return `<div class="simple-only info-box is-red mb-12">
            <div class="alert-lead">
              <b class="text-red">最も注意が必要なのは${topRisk.year}年（${topRisk.age}歳）の「${topDiseaseName}」</b>です。
            </div>
            <div class="note-text mt-6">
              この年は健康リスクスコア${topRisk.riskScore}点で、特に${topDiseaseName}の検査・予防を早めに行うことをおすすめします。
            </div>
          </div>
          <div class="health-risk-list expert-only">
            ${major.map(r => `
              <div class="health-risk-item ${levelClass[r.level] || 'health-risk-high'}">
                <div class="health-risk-head">
                  <span class="health-risk-year">${r.year}年（${r.age}歳）</span>
                  <span class="health-risk-pillar expert-only">${r.pillar}</span>
                  <span class="health-risk-level expert-only">${r.level}</span>
                  <span class="health-risk-level simple-only">${r.level === "高危険" ? "要注意" : r.level === "軽度注意" ? "少し注意" : r.level}</span>
                  ${r.isTenchu ? '<span class="tenchu-badge expert-only">天中殺</span>' : ''}
                  <span class="health-risk-score">${r.riskScore}点</span>
                </div>
                <div class="health-risk-bar"><i style="--health-risk-width:${r.riskScore}%"></i></div>
                <div class="major-disease-list">
                  ${r.majorDiseases.map(d => `
                    <div class="major-disease-item">
                      <span class="major-disease-element expert-only">${d.element}</span>
                      <span class="major-disease-type">${d.type}</span>
                      <span class="major-disease-names">${d.diseases}</span>
                    </div>
                  `).join("")}
                </div>
                <ul class="health-risk-factors expert-only">
                  ${r.factors.map(f => `<li>${f}</li>`).join("")}
                </ul>
              </div>
            `).join("")}
          </div>`;
        })()}
      </div>
      ${(() => {
        const sp = healthRisk.statisticalProfile;
        if (!sp || (sp.riskFactors.length === 0 && sp.protectiveFactors.length === 0)) return '';
        let html = '<div class="info-box is-steel mt-16">';
        html += '<h4 class="expert-only fs-14 text-steel mb-8">統計的知見に基づく疾患リスクプロファイル</h4>';
        html += '<h4 class="simple-only fs-15 text-steel mb-8">データから見る健康リスク</h4>';
        html += `<p class="expert-only note-text-sm mb-10">${sp.studyNote}</p>`;
        if (sp.riskFactors.length > 0) {
          html += '<div class="info-section"><b class="expert-only info-label is-red-strong">リスク亢進因子</b><b class="simple-only info-label is-red-strong fs-14">⚠ 注意が必要な傾向</b>';
          html += sp.riskFactors.map(f => {
            const diseaseMatch = f.note.match(/(.+?)でOR=/);
            const diseaseName = diseaseMatch ? diseaseMatch[1] : f.note;
            return `<div class="expert-only note-text-sm risk-factor"><b>${f.star}</b>: ${f.note} <span class="text-muted">(OR=${f.OR}, p=${f.p})</span></div>`
              + `<div class="simple-only risk-factor-simple">🔴 <b>${f.star}</b>の人は<b class="text-red">${diseaseName}</b>のリスクが高くなりやすい傾向があります。定期的な健康診断と、該当する検査を早めに受けることをおすすめします。</div>`;
          }).join("");
          html += '</div>';
        }
        if (sp.protectiveFactors.length > 0) {
          html += '<div class="info-section"><b class="expert-only info-label is-seagreen">保護因子</b><b class="simple-only info-label is-seagreen fs-14">✓ 守られている傾向</b>';
          html += sp.protectiveFactors.map(f => {
            const diseaseMatch = f.note.match(/(.+?)でOR=/);
            const diseaseName = diseaseMatch ? diseaseMatch[1] : f.note;
            return `<div class="expert-only note-text-sm risk-factor is-protect"><b>${f.star}</b>: ${f.note} <span class="text-muted">(OR=${f.OR}, p=${f.p})</span></div>`
              + `<div class="simple-only risk-factor-simple is-protect">🟢 <b>${f.star}</b>の人は<b class="text-seagreen">${diseaseName}</b>のリスクが低い傾向があります。現在の生活リズムを維持することが大切です。</div>`;
          }).join("");
          html += '</div>';
        }
        if (sp.diseaseSpecificRisks.length > 0) {
          html += '<div class="info-section"><b class="expert-only info-label is-steel">病気カテゴリ別リスク</b><b class="simple-only info-label is-steel fs-14">🏥 特に注意したい病気</b>';
          html += '<div class="flex-wrap-gap">';
          html += sp.diseaseSpecificRisks.map(d => `<span class="expert-only tag-pill is-red is-sm">${d.disease} <span class="text-muted">OR=${d.OR}</span></span>`).join("");
          html += sp.diseaseSpecificRisks.map(d => `<span class="simple-only tag-pill is-red is-lg">${d.disease}</span>`).join("");
          html += '</div></div>';
        }
        html += `<p class="simple-only note-text mt-10">※これは統計データからの参考情報です。必ず定期健康診断を受けて、自分の健康状態を確認してくださいね。</p>`;
        html += '</div>';
        return html;
      })()}
    </div>
    <div class="result-card reading expert-only">
      <h3>六親法（家系図・縁の深さ）</h3>
      <p class="note is-small mb-14">六親法とは、日干（自分）を中心に家族の干を算出し、宿命の陰占内にその干が存在するかで縁の深さを判定する技法です。<br>縦線（親→子）は「相生」関係、横線（結婚）は「干合」関係で結びます。</p>
      ${(() => {
        const sp = calcSixParents(day.stem, gender);
        const rel = getSixParentsRelation(sp, pillars, zoukan, tenchusatsu);
        const depthColor = (d) => d === "縁薄" ? "#c05050" : d === "縁あり" ? "#a09060" : d.includes("偏り") ? "#e0a040" : "#70d0a0";
        const depthComment = (d) => d === "縁薄" ? "陰占内に見つからず、縁が薄いか関わりが少ない傾向" : d === "縁あり" ? "陰占内に1つ見つかり、一定の縁がある" : d.includes("偏り") ? "3つ以上あり、縁は深いが偏り注意" : "2つ以上あり、縁が深い";
        const renderRow = (key, comment) => {
          const r = rel[key];
          const posText = r.positions.length > 0 ? r.positions.join("・") : `定位置（${r.defaultPosition}）を参照`;
          return `
            <div class="six-parents-row">
              <div class="six-parents-label"><b>${r.label}</b><small class="six-parents-comment">${comment}</small></div>
              <div class="six-parents-stem">${r.stem}<small>${r.star}</small></div>
              <div class="six-parents-depth" style="color:${depthColor(r.depth)}">${r.depth}<small class="six-parents-depth-comment">${depthComment(r.depth)}</small></div>
              <div class="six-parents-positions">${posText}</div>
            </div>
          `;
        };
        return `
          <div class="six-parents-tree">
            <div class="six-parents-gen six-parents-gen-parents">
              <h4>先祖の代（親世代）</h4>
              <p class="six-parents-gen-desc">日干を生じる性質の干が母親。母親の干合相手が父親。</p>
              ${renderRow("mother", "日干を生じる干（相生関係）。陰陽が異なる干が正母（玉堂星）。")}
              ${renderRow("motherAlt", "日干を生じる干で陰陽が同じ干が偏母（龍高星）。正母不在時の代行。")}
              ${renderRow("father", "母親の干合相手（相剋＋異性）。正父（牽牛星 or 司禄星）。")}
              ${renderRow("fatherAlt", "母親の干合相手の陰陽逆。偏父・恋人（車騎星 or 禄存星）。")}
            </div>
            <div class="six-parents-gen six-parents-gen-self">
              <h4>自分の代（兄弟・自分・配偶者）</h4>
              <p class="six-parents-gen-desc">日干と同じ性質が兄弟姉妹。日干と干合する干が結婚相手。</p>
              ${renderRow("brother", "日干と同じ性質・同じ陰陽の干（比和関係）。同性の兄弟姉妹（貫索星）。")}
              ${renderRow("sister", "日干と同じ性質・逆の陰陽の干。異性の兄弟姉妹（石門星）。")}
              <div class="six-parents-row six-parents-self">
                <div class="six-parents-label"><b>自分（日干）</b><small class="six-parents-comment">家系図の中心。全ての関係がここから派生する。</small></div>
                <div class="six-parents-stem">${day.stem}<small>${sp.dayEl}・${sp.dayIsYang ? "陽" : "陰"}</small></div>
                <div class="six-parents-depth">―</div>
                <div class="six-parents-positions">日干（中心）</div>
              </div>
              ${renderRow("spouse", "日干と干合する干（相剋＋異性）。正配偶・結婚相手（牽牛星 or 司禄星）。")}
              ${renderRow("spouseAlt", "日干の干合相手の陰陽逆。偏配偶・恋人（車騎星 or 禄存星）。")}
            </div>
            <div class="six-parents-gen six-parents-gen-children">
              <h4>後世の代（子供世代）</h4>
              <p class="six-parents-gen-desc">日干（女性）または妻（男性）が生じる干が子供。同じ陰陽が女児、逆が男児。</p>
              ${renderRow("son", gender === "male" ? "妻（干合相手）が生じる干で、妻と逆の陰陽。男児（調舒星）。" : "自分が生じる干で、自分と逆の陰陽。男児（調舒星）。")}
              ${renderRow("daughter", gender === "male" ? "妻（干合相手）が生じる干で、妻と同じ陰陽。女児（鳳閣星）。" : "自分が生じる干で、自分と同じ陰陽。女児（鳳閣星）。")}
            </div>
          </div>
          <div class="six-parents-legend">
            <div class="six-parents-legend-item"><span class="six-parents-legend-color" style="background:#70d0a0"></span><b>縁濃</b>：陰占内に2つ以上あり、関係が深い</div>
            <div class="six-parents-legend-item"><span class="six-parents-legend-color" style="background:#e0a040"></span><b>縁濃（偏り注意）</b>：3つ以上で偏りあり、依存やトラブルに注意</div>
            <div class="six-parents-legend-item"><span class="six-parents-legend-color" style="background:#a09060"></span><b>縁あり</b>：1つ見つかり、一定の縁がある</div>
            <div class="six-parents-legend-item"><span class="six-parents-legend-color" style="background:#c05050"></span><b>縁薄</b>：陰占内に見つからず、縁が薄いか関わりが少ない</div>
          </div>
          <div class="six-parents-notes">
            <div class="six-parents-note-item"><b>天中殺の影響</b>：天中殺の柱にある干は「頼りにならない・距離を取った方が成長する」と解釈します。例えば生年天中殺なら年柱の干が無効、生月天中殺なら月柱の干が無効です。</div>
            <div class="six-parents-note-item"><b>定位置とは</b>：陰占内に理想の干が見つからない場合の最終参照位置。母親→月支蔵干、父親→月干、配偶者→日支蔵干、子供→月干。</div>
            <div class="six-parents-note-item"><b>干合とは</b>：五つのペア（甲↔己・乙↔庚・丙↔辛・丁↔壬・戊↔癸）で、異性の相剋関係。結婚や強い引き寄せを意味します。</div>
            <div class="six-parents-note-item"><b>相生とは</b>：親→子の関係（水生木・木生火・火生土・土生金・金生水）。母親と子供の縦線繋がりを表します。</div>
          </div>
        `;
      })()}
    </div>
  `;
  saveToHistory({
    name,
    lastName,
    firstName,
    birthdate: birthdateDisplay,
    birthYear,
    birthMonth,
    birthDay,
    gender,
    dayStem: day.stem,
    dayBranch: day.branch,
    centerStar: mainStars.center,
    northStar: mainStars.north,
    southStar: mainStars.south,
    eastStar: mainStars.east,
    westStar: mainStars.west,
    dayEnergy: energy[2] ? energy[2].name : "",
    affairScore,
    marriageScore,
    workScore: workEx.score,
    oppositeMoteScore: mote.oppositeScore,
    sameMoteScore: mote.sameScore
  });
  refreshHistoryUI();
  result.scrollIntoView({ behavior: "smooth", block: "start" });

  const viewToggle = document.querySelector("#viewModeToggle");
  if (viewToggle) {
    viewToggle.checked = !document.body.classList.contains("simple-mode");
    viewToggle.addEventListener("change", () => {
      if (viewToggle.checked) {
        document.body.classList.remove("simple-mode");
      } else {
        document.body.classList.add("simple-mode");
      }
    });
  }
  console.log("[render] completed. simple-mode:", document.body.classList.contains("simple-mode"), "toggle checked:", viewToggle ? viewToggle.checked : "no toggle");
}

document.body.classList.add("simple-mode");
console.log("[app.js v20260719e] loaded. simple-mode:", document.body.classList.contains("simple-mode"));
document.querySelector("#fortuneForm").addEventListener("submit", render);
document.querySelector("#compatForm").addEventListener("submit", renderCompat);
document.querySelector("#clearHistory").addEventListener("click", clearAllHistory);
document.querySelector("#historyList").addEventListener("click", (e) => {
  if (e.target.classList.contains("history-del")) {
    e.stopPropagation();
    deleteHistoryItem(Number(e.target.dataset.idx));
    return;
  }
  const item = e.target.closest(".history-item");
  if (item) {
    const idx = Number(item.dataset.idx);
    replayHistory(idx);
  }
});
refreshHistoryUI();
