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
  { name: "天恍星", score: 7, text: "奔放・タレント性・夢・恋愛の星。現世〜青少年期のエネルギーで、思春期の子どものように夢追い人で派手なものに関心がある。人との関わりの中で華々しく生きる運勢。自分に正直に生き、常に新しいものや人を求めて動く。自立心と反抗心があり一か所に縛られない。派手なもの好きで華やかな雰囲気と色気で人を魅了。夢を追うため現実味には欠け、理想と現実のギャップに悩み苦労する。キラキラしたものに憧れる感性はクリエイティブな世界や人の憧れの存在へ導く。「離郷の星」と呼ばれ遠くに羽ばたく人が多い。恋愛魅力度ナンバーワンでモテるが、束縛を嫌い浮気者な面も。金運は強く一定水準以上の稼ぎに恵まれる。" },
  { name: "天南星", score: 10, text: "推進力・反骨精神・正義感の星。現世〜青年期のエネルギーで、成人したばかりのように自分と社会に夢を持って勢いのまま突き進む。恐れを知らず果敢に道を切り開き、反骨精神も旺盛なので難しそうなことにほど熱意がみなぎる。前人未到の地を開拓する才がある。正義感が強く年上や偉い人にも構わず白黒つけたがる。正義感が強すぎて批判的な態度やストレートすぎる言葉で周囲を傷つけることも。一本気で不器用、複数のことを同時にしたり複雑なことを落ち着いて考えたりするのは苦手。エネルギー消費も激しい。言語化が得意で雄弁、度胸と言葉を使う職に適性。恋愛は追うタイプで手に入らない人にほど闘志を燃やす。" },
  { name: "天禄星", score: 11, text: "堅実・安定的・冷静・理論的の星。現世〜壮年期のエネルギーで、年齢を重ねた人生経験豊富な人のように状況を冷静に見極めて安定的な生活を送る。落ち着いてどっしりとした風格を持ち、若くても大人びた重厚感がある。同年代とはしゃぐより年上や年配との交流が多い。平和で健康的、ミスや無理のない道筋を大事にし計画通りに事を運ぶ。論理的思考に基づいて意思決定し、トラブルに巻き込まれることが非常に少ない。鋭い観察眼を持ち相談事に乗ることも多く人から頼られる。責任感があり引き受けたことを投げ出さず、穏やかな性格で厚い信頼を受ける。慎重派でリスクのあるものには手を出さず、行動のテンポはゆっくりだが着実に成果を出す。サポート役やスペシャリストに向く。恋愛も慎重で友達付き合いから発展することが多い。金運は波が少なく積み上げで財を大きくする。" },
  { name: "天将星", score: 12, text: "王様的・精神力・創始者の星。現世〜頭領期のエネルギーで、経験を積んできた50代のように実力と自信、人を支える力を持ち上に立つ。十二大従星の中で一番強いエネルギーを持つ。人を率いて新しいことを始める能力があり、責任感のある立場につくことが多くリーダーや大黒柱として何かを背負える力強さがある。若いときの苦労が必要で、苦労・困難・人の痛み・悲しみ・喜びを知ることで優れたリーダーになる。甘やかされると有り余るエネルギーの使いどころが分からず不満と叱責で気苦労の多い人生に。人情に厚く表面上は穏やかだが、ワンマンにならなければ人から信頼され好かれる。「創始者の星」でゼロから作り上げることで大成できる大器晩成型。一つのことを極めるのが得意。恋愛では絶対君主で、付き従う人には慈悲深い。面食いで釣り合いを気にする。" },
  { name: "天堂星", score: 8, text: "頂点を過ぎて陰転に向かう退気のエネルギー。一歩下がって道を譲る精神と強靭な自制心を持ち、きらびやかなことを嫌う。間断の気で年齢差のある関係や無言の世界で燃焼し、単独行動を好む頑固さの裏側に諦念がある。" },
  { name: "天胡星", score: 4, text: "時間と場所を超越するエネルギーで、現実を居場所にできず自在な精神が世界を作る。有から無を感知し無から新たな有を作る才能。無への憧憬と美へのあこがれを持ち、精神が肉体を追い込むほどの集中力を発揮するが、希望が燃料で未来が閉ざされると絶望する。" },
  { name: "天極星", score: 2, text: "「現実の無」「気の有」で、自己の想念に関係なく現実の状況を受け入れるエネルギー。格差なき一次元思考で自由な思考転回ができ、環境に合わせて行動も思考も変化させる。回帰作用で異次元への飛翔力を持ち、環境で作られた心を持続する純粋さがある。" },
  { name: "天庫星", score: 5, text: "異次元の世界を進むエネルギーで、現実を持たない。連結のない一筋の探究心で単一志向に突き進み、中庸力とバランス感覚で不自然・不合理を感知する。自分で決めた道なら地獄でも行く自然な頑固さと、現実から精神を学び取る術に優れる。" },
  { name: "天馳星", score: 1, text: "霊魂が宇宙空間に帰るエネルギーで、人間的時空間を持たない。点的今の連続で、成功も失敗も固執しない。精神は静を保ち肉体は常に動き、外動内静で動くほど精神は安定する。分裂・分離の本性で多方面を並行し、一つに集中すると持続力に限界がある。" }
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
    imbalanced: "自然体と表現。内面の偏りが感情の波を激化させ、明るさと虚無感の落差が極端になる。"
  },
  調舒星: {
    balanced: "感性と孤高。内面のバランスが感性を研ぎ澄まし、孤独を創造力に変える。",
    moderate: "感性と孤高。鋭い美意識は武器だが、被害者意識が強いと才能が刺々しさに変わる。",
    imbalanced: "感性と孤高。内面の偏りが感受性を過敏にし、世界全体が敵に見える孤独に沈みやすい。"
  },
  禄存星: {
    balanced: "包容と奉仕。内面のバランスが奉仕精神を純粋にし、見返りを求めない本物の優しさを発揮する。",
    moderate: "包容と奉仕。面倒見は良いが、承認欲求で尽くすと搾取される。",
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
    imbalanced: "責任と名誉。内面の偏りが面目への執着を強め、見栄と実力の乖離が致命的になる。"
  },
  龍高星: {
    balanced: "改革と冒険。内面のバランスが独創性を安定した変革力に変え、継続的な革新を実現する。",
    moderate: "改革と冒険。独創性は高いが、飽きて壊すだけなら信用されない。",
    imbalanced: "改革と冒険。内面の偏りが衝動性を極限化し、破壊と離脱を繰り返す浮き草人生になる。"
  },
  玉堂星: {
    balanced: "知性と伝統。内面のバランスが知性を実践力に結びつけ、学んだことを現実で活かせる。",
    moderate: "知性と伝統。学習力は強いが、理屈で逃げると現場感覚が育たない。",
    imbalanced: "知性と伝統。内面の偏りが理屈への依存を深め、頭でっかちで行動できない評論家タイプになる。"
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
  天報星: { balanced: "家庭に落ち着きが出にくいが内面のバランスがきまぐれを抑え、パートナーを振り回さない。不安も軽度に抑えられる。", moderate: "家庭に落ち着きが出にくく、きまぐれで気分が変わりやすい。本人は無自覚だが、パートナーは振り回されやすい。不安に襲われた時は「大丈夫」と根拠を示して支えることが一番の良薬。", imbalanced: "内面の偏りがきまぐれを極限化し、家庭内で気分が常に変わりパートナーを完全に振り回す。" },
  天印星: { balanced: "配偶者や家庭環境に適応しやすい。内面のバランスが主体性も保ち、依存癖を抑えて家庭運を安定させる。", moderate: "配偶者や家庭環境に適応しやすいが、中身が環境で決まるため自分の意志が薄れやすい。依存癖が出ると関係が冷める。今を堅実に生きることで家庭運は安定する。", imbalanced: "内面の偏りが依存癖を極限化し、自分の意志が完全に薄れて関係が冷める。" },
  天貴星: { balanced: "配偶者にも品を求めやすいが内面のバランスがプライドを適度に保ち、気負いで隠さずに済む。", moderate: "配偶者にも品や見栄を求めやすい。プライドの裏側に弱さと不安があり、気負いで隠そうとする。従順さは自信のなさから来るもので、成長とともに変化する。", imbalanced: "内面の偏りがプライドを極限化し、気負いで弱さを完全に隠し独善的になる。" },
  天恍星: { balanced: "外の刺激に気持ちが向きやすいが内面のバランスが落ち着く力も与え、マンネリを適度に解消できる。", moderate: "家庭より外の刺激に気持ちが向きやすい。落ち着くと居心地の悪さを感じ、脱皮したくなる想念が湧く。マンネリを最も嫌い、冒険心が家庭を離れる方向に働く。", imbalanced: "内面の偏りが刺激への欲求を極限化し、冒険心が常に家庭を離れる方向に働く。" },
  天南星: { balanced: "家庭内でも前進・変化を求める。内面のバランスが不器用さを柔軟性で補い、摩擦を減らして長く続く関係を作る。", moderate: "家庭内でも前進・変化を求める。自分を曲げられない不器用さが摩擦を生むが、一本気な性質は長く続く関係を作る。安定を窮屈に感じると外へ目が向く。", imbalanced: "内面の偏りが不器用さを極限化し、摩擦が常態化し安定を窮屈に感じて外へ目が常に向く。" },
  天禄星: { balanced: "家庭を守る堅実さと生存本能が基盤。内面のバランスが安全策と適度な刺激のバランスを取り、家庭運を安定して築く。", moderate: "家庭を守る堅実さと生存本能が基盤。健康と経済の安定を最優先し、地味な積み重ねで家庭運を築く。ただし安全策に逃げて刺激不足になりやすい。", imbalanced: "内面の偏りが安全策への逃避を極限化し、刺激不足で家庭運が完全に停滞する。" },
  天将星: { balanced: "家庭でも主導権を握りたがる。内面のバランスが自我を健全なリーダーシップに変え、家庭運や子供運にも良い影響を与える。", moderate: "家庭でも主導権を握りたがる。自我と頑固さが極めて強く、自分の意志を押し通す。強すぎるエネルギーが家庭運や子供運に影響することも。高い教養で自我に出処進退が加わると安定する。", imbalanced: "内面の偏りが自我を極限化し、強すぎるエネルギーが家庭運や子供運に深刻な影響を与える。" },
  天堂星: { balanced: "家庭では落ち着いた観察者で自制心が強い。内面のバランスが適度な自己主張も可能にし、相手の寂しさを防ぐ。", moderate: "家庭では落ち着いた観察者で自制心が強い。一歩下がって相手を立てるが、底には単独行動を好む頑固さがある。同年代・同性の環境では居心地の悪さを感じ、冷めた態度が続くと相手が寂しさを覚える。", imbalanced: "内面の偏りが自制心を行き過ぎさせ、冷めた態度が続き相手が完全に寂しさを覚える。" },
  天胡星: { balanced: "家庭内でも繊細だが内面のバランスが現実感覚を保ち、周囲と足並みを揃えられる。希望を持ち続けられる。", moderate: "家庭内でも繊細で現実を居場所にできない。時間を超越した発想で周囲と足並みが揃わず孤独感を感じやすい。希望が燃料なので未来が閉ざされると外に慰めを求める危険がある。", imbalanced: "内面の偏りが現実逃避を極限化し、未来が閉ざされると外に慰めを求めて家庭が崩れる。" },
  天極星: { balanced: "環境に合わせて心を作るため家庭に適応する。内面のバランスが主体性も与え、環境が揺らぐ時にも立て直せる。", moderate: "環境に合わせて心を作るため、結婚相手や家庭環境に適応するが主体性が薄い。環境が持続すると出来上がった思考や行動パターンを繰り返し、発想の転換がきかない。環境が揺らぐと立て直す力が弱い。", imbalanced: "内面の偏りが環境依存を極限化し、環境が揺らぐと立て直す力が完全になくなる。" },
  天庫星: { balanced: "家庭に執着し過去を引きずりやすい。内面のバランスが執着を健全な深掘りに変え、家族との協調も保つ。", moderate: "家庭に執着し過去を引きずりやすい。自分で決めた道を突き進む頑固さで、連結のない思考が家族との協調を難しくする。二度目の家庭を持つ宿命とも言われる。", imbalanced: "内面の偏りが執着を極限化し、連結のない思考で家族との協調が完全に崩れる。" },
  天馳星: { balanced: "家庭内でも瞬発的だが内面のバランスが点的今の連続にまとまりを与え、継続的な関係設計を可能にする。", moderate: "家庭内でも瞬発的・気分屋で、点的今の連続でまとまりを作れない。動けない環境だと肉体が破壊されやすい。継続的な関係設計を怠ると家庭が崩れやすい。", imbalanced: "内面の偏りが分裂を極限化し、まとまりが完全になく継続的な関係設計ができず家庭が崩れる。" }
};

// 十大主星別の恋愛傾向（本質・人生観を表す中央の主星を基準に判定）
const loveTendencyTexts = {
  貫索星: {
    balanced: "一途で情熱的。内面のバランスが束縛を適度に緩め、お互いの自立を尊重できるパートナーシップを築ける。",
    moderate: "一途で情熱的。好きになったら真っ直ぐに気持ちを伝えます。束縛を嫌う一方で、自分も相手を束縛しがち。お互いの自立を尊重できるパートナーとの相性が良いでしょう。",
    imbalanced: "一途だが内面の偏りが独占欲を極限化し、束縛がエスカレートして相手を窒息させやすい。"
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
    imbalanced: "内面の偏りが理想を極限化し、現実のパートナーに必ず失望し、激しい情熱が报复心に変わる。"
  },
  禄存星: {
    balanced: "惜しみない愛情を注ぐタイプ。内面のバランスが見返りを求めない純粋な愛情を可能にし、相手に負担をかけない。",
    moderate: "惜しみない愛情を注ぐタイプです。プレゼントやサプライズで相手を喜ばせることが大好きで、愛情表現がとてもストレート。尽くしすぎて「重い」と感じられることもあります。",
    imbalanced: "内面の偏りが愛情の重さを極限化し、尽くしすぎて相手を窒息させ、見返りがないと怨恨に変わる。"
  },
  司禄星: {
    balanced: "安定した家庭的な関係を求める。内面のバランスが安定と変化のバランスを取り、マンネリを防げる。",
    moderate: "安定した家庭的な関係を求めます。派手な恋より、日常の中で信頼を積み重ねていく穏やかな愛情を好みます。結婚向きの星と言われることも多いです。",
    imbalanced: "内面の偏りが安定への執着を強め、変化を恐れて関係が完全にマンネリ化する。"
  },
  車騎星: {
    balanced: "ストレートに気持ちを伝える情熱家。内面のバランスが情熱に持続力を与え、忙しくてもパートナーとの時間を大切にできる。",
    moderate: "ストレートに気持ちを伝える情熱家です。好きになったら猪突猛進で、駆け引きは得意ではありません。忙しさに追われてパートナーとの時間を疎かにしがちな面も。",
    imbalanced: "内面の偏りが情熱を短絡化させ、勢いで突っ走ってすぐ冷め、パートナーとの時間を完全に疎かにする。"
  },
  牽牛星: {
    balanced: "品のある大人の恋愛を好む。内面のバランスがプライドを適度に保ちつつ素直になれる瞬間も作れる。",
    moderate: "品のある大人の恋愛を好みます。教養があり、マナーを大切にする相手に惹かれます。自分も相手も高め合える関係を理想とします。",
    imbalanced: "内面の偏りがプライドを極限化し、素直になれずすれ違いが深刻化して関係が破綻しやすい。"
  },
  龍高星: {
    balanced: "自由を大切にし、束縛を最も嫌う。内面のバランスが自由と安定を両立し、刺激的な関係でも落としどころを見つけられる。",
    moderate: "自由を大切にし、束縛を最も嫌う主星です。国際恋愛や遠距離恋愛にも抵抗がなく、むしろ刺激的な関係を楽しみます。旅先での出会いがきっかけで恋が始まることも多いでしょう。",
    imbalanced: "内面の偏りが自由への執着を極限化し、関係が落ち着くと即座に逃げ出し、束縛されると関係を壊す。"
  },
  玉堂星: {
    balanced: "知的なつながりを重視する。内面のバランスが知性を行動に結びつけ、長い時間をかけて育む愛情を行動で示せる。",
    moderate: "知的なつながりを重視するタイプです。本や映画、芸術について語り合える相手、精神的な深さを持つ相手に強く惹かれます。急な展開は苦手で、長い時間をかけて育む穏やかな愛情を好みます。",
    imbalanced: "内面の偏りが知的な会話に逃避させ、考えすぎて行動が常に遅くチャンスを全て逃す。"
  }
};

// 十大主星別の恋愛対象タイプ（本質を表す中央の主星を基準に判定）
const loveTypeTexts = {
  貫索星: {
    like: "自立していて自分の意見をしっかり持つ、ぶれない強さのある人に惹かれやすい。",
    dislike: "会議でも飲み会でも誰の顔色も伺って『いいですよね』としか言わない人。自分の意見を聞いても『みんなに合わせる』で返してくる人は、会話が成立しないので恋愛対象に入らない。",
    marriage: "価値観の違いを尊重し合い、お互いの自立を認め合える人。束縛せず信頼で繋がれる相手が理想。"
  },
  石門星: {
    like: "誰とでも自然に打ち解けられる、社交的で明るい人に惹かれやすい。",
    dislike: "『友達は少ない方がいい』と豪語する人や、恋人の交友関係にいちいち口出しする人。石門星にとって人脈は命綱なので、それを制限しようとする人は即NG。",
    marriage: "友人や家族とも良い関係を築ける、社交性を認め合えるオープンな人。"
  },
  鳳閣星: {
    like: "一緒にいて楽しい、笑わせてくれる明るい人に惹かれやすい。",
    dislike: "デートのたびに『これ意味ある？』と効率を気にする人や、冗談を言っても真に受けて解説し始める人。鳳閣星にとって楽しさを削ぐ相手は存在意義がない。",
    marriage: "一緒にいて笑いが多く、日常を楽しめる、明るく前向きな人。"
  },
  調舒星: {
    like: "独自の世界観を持つ、感性豊かでミステリアスな人に惹かれやすい。",
    dislike: "『趣味で食べていけるの？』と現実面でしか物事を測る人や、相手が泣いているのに『で、どうしたいの？』と解決案ばかり出す人。調舒星の感性を理解しない人は心を開けない。",
    marriage: "精神的なつながりを大切にでき、感性を共有できる、深い理解者になれる人。"
  },
  禄存星: {
    like: "頼ってくれる、素直に感謝を伝えてくれる人に惹かれやすい。",
    dislike: "毎食『美味しいね』と言わない人や、プレゼントをもらっても『うん、ありがとう』だけで終わらせる人。禄存星は感謝の言葉で動くタイプなので、それがないと何もしたくなくなる。",
    marriage: "尽くした分だけ愛情を返してくれる、思いやりのキャッチボールができる人。"
  },
  司禄星: {
    like: "誠実で堅実、地に足のついた生活を送る人に惹かれやすい。",
    dislike: "給料日前に『お金ない』と毎月言う人や、貯金ゼロでも『なんとかなる』と言う人。司禄星は堅実さに安心感を覚えるため、金銭感覚の緩い人は最初から候補に入れない。",
    marriage: "家庭を大切にし、コツコツと将来を一緒に築いていける、経済観念の合う人。"
  },
  車騎星: {
    like: "ストレートで裏表がなく、行動力のある人に惹かれやすい。",
    dislike: "『今日は何食べたい？』→『なんでもいい』→『じゃあラーメン』→『ラーメンじゃなくてもいい』となる人。車騎星はスピード感が命なので、決断しない相手には苛立ちしか感じない。",
    marriage: "お互いに正直で、困難があっても一緒に前へ進んでいける、まっすぐな人。"
  },
  牽牛星: {
    like: "教養があり、礼儀や品を大切にする人に惹かれやすい。",
    dislike: "初対面でタメ口を使う人や、高級店でスマホをいじる人。牽牛星は品とけじめで人を測るので、そういう細かい所作が崩れている人には生理的に無理。",
    marriage: "お互いを高め合える、知性と気品を兼ね備えた、対等なパートナーになれる人。"
  },
  龍高星: {
    like: "個性的で自由な発想を持つ、束縛しない人に惹かれやすい。",
    dislike: "『今どこにいるの？』『誰といるの？』と毎時間連絡してくる人や、スマホの画面を覗き込む人。龍高星にとって自由を制限されることは愛情ではなく暴力。",
    marriage: "お互いの自由を尊重し合い、それぞれのペースを認め合える、束縛しないパートナー。"
  },
  玉堂星: {
    like: "知的な会話ができる、学び続ける姿勢のある人に惹かれやすい。",
    dislike: "『本なんて読まなくても生きていける』と言う人や、ニュースを一切見ない人。玉堂星は知的好奇心が原動力なので、それを共有できない相手との会話は砂を噛むように退屈。",
    marriage: "知的好奇心を共有し、穏やかに長く一緒に成長していける、精神的に安定した人。"
  }
};

// 十大主星別の浮気・不倫傾向（西＝配偶者との関係性が現れる場所の主星を基準に判定）
const affairTendencyTexts = {
  貫索星: {
    balanced: "一度好きになった相手への忠誠心は強い。内面のバランスが執着を緩め、不倫状態に陥っても早く決断できる。",
    moderate: "一度好きになった相手への忠誠心は強いが、意地とプライドで別れられず不倫状態が長引きやすい。",
    imbalanced: "内面の偏りが執着を極限化し、意地とプライドで絶対に別れられず不倫状態が異常に長引く。"
  },
  石門星: {
    balanced: "社交性は高いが、内面のバランスが距離感を保ち、誤解や火遊びに巻き込まれにくい。",
    moderate: "誰にでも良い顔をする社交性が裏目に出て、誤解や火遊びに巻き込まれやすい。",
    imbalanced: "内面の偏りが八方美人を極限化し、誰にでも良い顔して誤解や火遊びに常態的に巻き込まれる。"
  },
  鳳閣星: {
    balanced: "モテやすいが、内面のバランスが罪悪感を適度に保ち、複数の関係を並行させない。",
    moderate: "楽天的でモテやすく、罪悪感が薄いまま複数の関係を並行させやすい。",
    imbalanced: "内面の偏りが罪悪感を完全に欠如させ、複数の関係を平気で並行させる。"
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
    balanced: "東縛を嫌うが、内面のバランスが自由と責任のバランスを取り、複数愛に走らない。",
    moderate: "東縛を最も嫌う星で、自由な関係や複数愛を望みやすい。海外・遠距離の恋にも抵抗がない。",
    imbalanced: "内面の偏りが自由への執着を極限化し、複数愛を当然と考え、東縛を一切受け付けない。"
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

// 十大主星別の性癖・性的傾向
const sexTendencyTexts = {
  貫索星: "一途で独占欲が強い。肉体関係でも自分のペースを守りたがる。相手を自分のものにしたい欲求が強く、ベッドでも主導権を握りたがる。裏切りを許さない分、信頼している相手には深く没頭する。",
  石門星: "誰とでも合わせられる柔軟さがあるが、性的には相手に合わせる型。ムードや雰囲気を重視し、スキンシップを通じて安心感を求める。複数の相手と関係を持ちやすいが、本命には従順。",
  鳳閣星: "楽しさと心地よさを重視。性的なことにもオープンで、新しいプレイやシチュエーションに興味がある。飽きっぽい面があり、マンネリになると外に刺激を求めやすい。",
  調舒星: "精神的な繋がりが性的満足度に直結するタイプ。雰囲気や演出にこだわる。独占欲が強く、相手が自分だけを見ていないと冷める。繊細で傷つきやすいため、信頼関係が前提。",
  禄存星: "相手に尽くすことで満足を感じるタイプ。相手の喜びが自分の喜び。スキンシップを愛情表現の最優先手段とする。尽くしすぎて相手を甘やかし、依存関係になりやすい。",
  司禄星: "性的には控えめで安定を好む。日常の中でのスキンシップを重視。派手なプレイより、安心感のある関係の中での触れ合いを好む。変化を嫌うため、パートナーが固定されれば安定。",
  車騎星: "情熱的でストレート。性的欲求が強く、勢いで関係を進める。駆け引きなしで肉体的な吸引力に従う。短気ですぐ燃え上がるが、冷めるのも早い。忙しさでパートナーを放置しがち。",
  牽牛星: "品と格式を重んじる。性的にもマナーとTPOを大切にする。プライドが高く、軽薄な振る舞いを嫌う。ベッドでも相手の気持ちを尊重するが、自分のプライドを傷つけられると冷める。",
  龍高星: "自由と刺激を求める。性的にも型にはまらず、非日常的なシチュエーションに興味がある。束縛を嫌い、オープンな関係を好む。マンネリに弱く、新しい相手への関心が移りやすい。",
  玉堂星: "知的な繋がりが性的魅力に直結する。会話や精神的な交流があってこそ肉体関係が深まる。理性的で焦らず、相手の内面を理解してから一歩踏み出す。理屈で感情を抑えがち。"
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

function getAffairRiskScore({ westStar, spouseEnergyName, isDoubleEn, hasAbnormal, hasTopThreeAbnormal, centerStar, northStar, southStar, eastStar, dayStem, gogyoBalance }) {
  let score = affairBaseScore[westStar] ?? 30;
  score += affairEnergyAdjust[spouseEnergyName] ?? 0;
  if (isDoubleEn) score += 20;
  if (hasAbnormal) score += 15;
  if (hasTopThreeAbnormal) score += 15;
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
  // 五行バランスの偏りが大きいほど情緒不安定になりやすい
  if (gogyoBalance !== undefined && gogyoBalance >= 4) score += 12;
  else if (gogyoBalance !== undefined && gogyoBalance >= 3) score += 6;
  else if (gogyoBalance !== undefined && gogyoBalance <= 1) score -= 5;
  // 正規化: 生スコアを0-100スケールに変換
  // 実用的な範囲は約5-130（ベース10-78 + 各種加減点）
  const RAW_MIN_A = 5;
  const RAW_MAX_A = 130;
  return Math.max(5, Math.min(100, Math.round(((score - RAW_MIN_A) / (RAW_MAX_A - RAW_MIN_A)) * 100)));
}

function getChongBranch(branch) {
  return branches[mod(branches.indexOf(branch) + 6, 12)];
}

// 結婚に適した時期を算出（15〜50歳、スコア順で上位2件）
function getMarriageAges(day, pillars, taiun, tenchusatsu, birthYear, currentAge) {
  const dayBranch = day.branch;
  const natalBranches = [pillars.year.branch, pillars.month.branch, pillars.day.branch];
  const goodMarriageStars = ["禄存星", "司禄星", "石門星", "玉堂星", "牽牛星"];
  const allYears = [];

  taiun.periods.forEach((p) => {
    const taiunStar = getMainStar(day.stem, p.stem);
    const taiunBranch = p.branch;
    const isTenchu = isTenchusatsuYear(taiunBranch, tenchusatsu);
    if (isTenchu) return;

    const taiunReasons = [];
    let taiunBonus = 0;
    if (shigouPair[taiunBranch] === dayBranch) { taiunBonus += 30; taiunReasons.push("大運支が日支と支合"); }
    if (goodMarriageStars.includes(taiunStar)) { taiunBonus += 20; taiunReasons.push(`大運星「${taiunStar}」が結婚に良い星`); }

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
      if (score > taiunBonus || taiunBonus > 0) {
        allYears.push({ age, year, star: yearStar, branch: yp.branch, taiunStar, reasons, score });
      }
    }
  });

  allYears.sort((a, b) => b.score - a.score);
  return allYears.slice(0, 2);
}

// 恋愛しやすい時期を算出（15〜50歳、スコア順で上位2件）
function getLoveAges(day, pillars, taiun, tenchusatsu, birthYear, currentAge) {
  const dayBranch = day.branch;
  const natalBranches = [pillars.year.branch, pillars.month.branch, pillars.day.branch];
  const goodLoveStars = ["鳳閣星", "調舒星", "禄存星", "車騎星", "龍高星", "石門星"];
  const allYears = [];

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
  戊戌: { type: "通常", star: "天庫星", note: "教養が高いほど異常性が強まりやすい。配偶者が最身強（天将星2つ以上）だと異常性は抑えられる。" },
  庚子: { type: "通常", star: "天極星", note: "" },
  辛亥: { type: "通常", star: "天恍星", note: "" },
  丁巳: { type: "通常", star: "天将星", note: "" },
  辛巳: { type: "暗合", star: "天極星", note: "霊感作用が強い干支の第3位。丙が癸巳に変化する暗合異常干支。" },
  壬午: { type: "暗合", star: "天報星", note: "霊感作用が強い干支の第2位。丁が甲午に変化する暗合異常干支。視力の異常性が出やすい。配偶者は天将星の人だと良い。" },
  丙戌: { type: "暗合", star: "天庫星", note: "辛が壬戌に変化する暗合異常干支。教養が高いほど異常性が強まりやすい。配偶者が最身強だと異常性は抑えられる。" },
  丁亥: { type: "暗合", star: "天報星", note: "霊感作用が最も強い干支。壬が乙亥に変化する暗合異常干支。" },
  戊子: { type: "暗合", star: "天報星", note: "癸が丙子に変化する暗合異常干支。" },
  癸巳: { type: "暗合", star: "天報星", note: "戊が丁巳に変化する暗合異常干支。配偶者は天将星の人だと良い。" },
  己亥: { type: "暗合", star: "天報星", note: "甲が己亥（自身と同じ）に変化する暗合異常干支。視力の異常性が出やすい。配偶者は天将星の人だと良い。" }
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
    if (shigouPair[ba] === bb) results.push({ label, name: "支合", group: "合法", note: "この二つの地支は引き合う関係。協力関係が生まれ、物事が順調に進みやすくなる。人付き合いや仕事の提携で良い結果が出やすい。" });
    if (chongPairMap[ba] === bb) results.push({ label, name: "対冲", group: "散法", note: "この二つの地支は正面衝突する関係。予期しない変化や急な方向転換が起きやすくなる。慌てて決断せず、一旦立ち止まって検証するのが安全。" });
    if (gaiPair[ba] === bb) results.push({ label, name: "害法", group: "散法", note: "この二つの地支は害し合う関係。ストレスが蓄積しやすく、体調不良や人間関係の裏切りに遭いやすくなる。無理をせず、信頼できる人に相談するのが有効。" });
    if (haPair[ba] === bb) results.push({ label, name: "破法", group: "散法", note: "この二つの地支は破壊し合う関係。単独では影響は軽いが、他の散法（対冲・害法・刑法）と同時に出ると影響が強まる。決断が揺れやすくなるため、重要な判断は人と相談してから出す。" });
    if (ba === bb && jikeiBranches.includes(ba)) results.push({ label, name: "自刑（西方刑）", group: "散法", note: "同じ地支が重なることで自分自身と矛盾する関係。身内やパートナーと価値観がぶつかりやすくなる。同居や密な関係では摩擦が増えるため、適度な距離を保つと上手くいく。" });
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

function analyzeBranchTopology(branch, natalPillars) {
  const natalLabels = { year: "年支", month: "月支", day: "日支" };
  const results = [];
  ["year", "month", "day"].forEach((key) => {
    const nb = natalPillars[key].branch;
    if (branch === nb) return;
    if (shigouPair[branch] === nb) results.push({ label: natalLabels[key], name: "支合", group: "合法", note: "この時期の地支と" + natalLabels[key] + "が引き合う関係。協力関係が生まれ、物事が順調に進みやすくなる。人付き合いや仕事の提携で良い結果が出やすい。" });
    if (chongPairMap[branch] === nb) results.push({ label: natalLabels[key], name: "対冲", group: "散法", note: "この時期の地支と" + natalLabels[key] + "が正面衝突する関係。" + natalLabels[key] + "が示す領域（年支＝実家・先祖、月支＝親・仕事環境、日支＝配偶者・自分自身）で予期しない変化やトラブルが起きやすくなる。慌てて決断せず、一旦立ち止まって検証するのが安全。" });
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
  貫索星: { good: { balanced: "自分の専門性を磨く投資が実を結ぶ時期。内面のバランスが柔軟性を与え、市場変化にも対応できる。", moderate: "自分の専門性を磨く投資が実を結ぶ時期。独自の分野で収入が安定する。", imbalanced: "自分の専門性を磨く投資が実を結ぶ時期。内面の偏りが頑固さを強め、変化する市場に対応できず収入機会を逃す。" }, bad: { balanced: "頑固さが出るが内面のバランスが柔軟性を保ち、市場変化にも対応できる。", moderate: "頑固さが強まり、変化する市場に対応できず収入機会を逃す。", imbalanced: "内面の偏りが頑固さを極限化し、市場変化に全く対応できず収入機会を次々と逃す。" } },
  石門星: { good: { balanced: "人脈を通じた金運が活発。内面のバランスが交際費を適度に抑え、純粋な収入の道を開く。", moderate: "人脈を通じた金運が活発。紹介やネットワークから収入の道が開く。", imbalanced: "人脈を通じた金運が活発だが内面の偏りが交際費をエスカレートさせ、人付き合いで散財する。" }, bad: { balanced: "交際費がかさむが内面のバランスが支出を抑え、人脈を維持できる。", moderate: "交際費がかさみ、人付き合いで散財しやすい。", imbalanced: "内面の偏りが交際費を極限化し、人付き合いで全財産を散財する。" } },
  鳳閣星: { good: { balanced: "趣味や表現力を活かした収入のチャンス。内面のバランスが遊びと仕事の境界を明確にする。", moderate: "趣味や表現力を活かした収入のチャンス。クリエイティブな仕事が報われやすい。", imbalanced: "趣味や表現力を活かした収入のチャンスだが内面の偏りが遊びと仕事の境界を曖昧にし、浪費が増える。" }, bad: { balanced: "遊びと仕事の境界が曖昧になりがちだが内面のバランスがメリハリを付ける。", moderate: "遊びと仕事の境界が曖昧になり、浪費が増える。", imbalanced: "内面の偏りが遊びと仕事の境界を完全に消滅させ、浪費が止まらなくなる。" } },
  調舒星: { good: { balanced: "感性を活かした作品や専門スキルで評価され収入が安定。内面のバランスが気分の波を安定させる。", moderate: "感性を活かした作品や専門的なスキルで評価され、収入が安定する。", imbalanced: "感性を活かした作品で評価されるが内面の偏りが気分の波を激化させ、収入が不安定になる。" }, bad: { balanced: "気分の波が出るが内面のバランスが継続力を保ち、仕事を継続できる。", moderate: "気分の波で仕事の継続性が崩れ、収入が不安定になる。", imbalanced: "内面の偏りが気分の波を極限化し、仕事の継続性が完全に崩れて収入が極端に不安定になる。" } },
  禄存星: { good: { balanced: "人望が金運に直結する時期。内面のバランスが見返りを求めない純粋な奉仕を可能にする。", moderate: "人望が金運に直結する時期。奉仕した分が還ってきやすい。", imbalanced: "人望が金運に直結する時期だが内面の偏りが見返りへの期待を強め、投資や貸し付けで損をする。" }, bad: { balanced: "見返りを期待する傾向はあるが内面のバランスが損失を抑えられる。", moderate: "見返りを期待しすぎて投資や貸し付けで損をする。", imbalanced: "内面の偏りが見返りへの期待を極限化し、投資や貸し付けで取り返しのつかない損をする。" } },
  司禄星: { good: { balanced: "堅実な蓄積が評価される時期。内面のバランスが安定と成長のバランスを取り、新しい収入源にも手が届く。", moderate: "堅実な蓄積が評価される時期。資格や実績が収入の安定に繋がる。", imbalanced: "堅実な蓄積が評価される時期だが内面の偏りが変化への恐怖を強め、新しい収入源に手を出せず停滞する。" }, bad: { balanced: "変化を恐れる傾向はあるが内面のバランスが適度な挑戦を可能にする。", moderate: "変化を恐れて新しい収入源に手を出せず、停滞する。", imbalanced: "内面の偏りが変化への恐怖を極限化し、完全に新しい収入源に手を出せず永遠に停滞する。" } },
  車騎星: { good: { balanced: "行動力で収入を叩き出す時期。内面のバランスが衝動を抑え、持続的な収入を作れる。", moderate: "行動力で収入を叩き出す時期。競争環境では報酬を勝ち取りやすい。", imbalanced: "行動力で収入を叩き出す時期だが内面の偏りが短期的利益に飛びつかせ、衝動的な出費や投資で失敗する。" }, bad: { balanced: "短期的利益に飛びつく傾向はあるが内面のバランスが冷静な判断を保つ。", moderate: "短期的な利益に飛びつき、衝動的な出費や投資で失敗する。", imbalanced: "内面の偏りが衝動性を極限化し、短期的利益に飛びついて衝動的な出費や投資で次々と失敗する。" } },
  牽牛星: { good: { balanced: "名誉や立場が金運に直結する時期。内面のバランスが面目と実質を両立させる。", moderate: "名誉や立場が金運に直結する時期。社会的評価が収入向上に繋がる。", imbalanced: "名誉や立場が金運に直結する時期だが内面の偏りが見栄を強め、プライドで無理な出費をして散財する。" }, bad: { balanced: "見栄やプライドで出費する傾向はあるが内面のバランスが身の丈を保たせる。", moderate: "見栄やプライドで無理な出費をし、面目を保つために散財する。", imbalanced: "内面の偏りが見栄を極限化し、面目を保つために無理な出費を繰り返して散財する。" } },
  龍高星: { good: { balanced: "新しい分野や未開拓の市場で収益を見出す時期。内面のバランスが変化を継続力に変える。", moderate: "新しい分野や未開拓の市場で収益を見出す時期。変化が金運の鍵。", imbalanced: "新しい分野で収益を見出す時期だが内面の偏りが飽きっぽさを極限化し、投資や仕事が中途半端になる。" }, bad: { balanced: "飽きっぽさはあるが内面のバランスが継続力を与え、投資や仕事を最後まで遂行できる。", moderate: "飽きっぽさで継続性がなくなり、投資や仕事が中途半端になる。", imbalanced: "内面の偏りが飽きっぽさを極限化し、何も継続できず投資や仕事が全て中途半端になる。" } },
  玉堂星: { good: { balanced: "知識や学歴が金運に活きる時期。内面のバランスが知性を行動に結びつけ、チャンスを掴める。", moderate: "知識や学歴が金運に活きる時期。資格や専門性が収入の柱になる。", imbalanced: "知識や学歴が金運に活きる時期だが内面の偏りが理屈への依存を深め、行動が遅くチャンスを目の前で逃す。" }, bad: { balanced: "理屈で逃げる傾向はあるが内面のバランスが実行力を与え、チャンスを掴める。", moderate: "理屈ばかりで行動が遅く、チャンスを目の前で逃す。", imbalanced: "内面の偏りが理屈への逃避を極限化し、行動が全くできずチャンスを全て逃す。" } }
};

const starFortuneLove = {
  貫索星: { good: { balanced: "一途な想いが通じる時期。内面のバランスが意地を緩め、素直なアプローチが相手の心を掴む。", moderate: "一途な想いが通じる時期。誠実なアプローチが相手の心を掴む。", imbalanced: "一途な想いが通じる時期だが内面の偏りが意地を強め、素直になれず大切な人との距離が開く。" }, bad: { balanced: "意地を張る傾向はあるが内面のバランスが素直さを取り戻させ、距離を縮められる。", moderate: "意地を張って素直になれず、大切な人との距離が開く。", imbalanced: "内面の偏りが意地を極限化し、絶対に素直になれず大切な人との距離が決定的に開く。" } },
  石門星: { good: { balanced: "社交的な場で出会いが豊富。内面のバランスが距離感を保ち、パートナーに誤解されない。", moderate: "社交的な場で出会いが豊富。友人関係から恋愛に発展しやすい。", imbalanced: "社交的な場で出会いが豊富だが内面の偏りが八方美人をエスカレートさせ、パートナーに誤解や不信感を与える。" }, bad: { balanced: "誰にでも良い顔をする傾向はあるが内面のバランスが距離感を保てる。", moderate: "誰にでも良い顔をし、パートナーに誤解や不信感を与える。", imbalanced: "内面の偏りが八方美人を極限化し、パートナーに決定的な誤解と不信感を与える。" } },
  鳳閣星: { good: { balanced: "明るさと魅力でモテ期。内面のバランスが軽さと誠実さのバランスを取り、真剣な関係も育める。", moderate: "明るさと魅力でモテ期。楽しいデートやイベントで関係が深まる。", imbalanced: "明るさと魅力でモテ期だが内面の偏りが軽さをエスカレートさせ、真剣な関係を遠ざけてしまう。" }, bad: { balanced: "軽い態度が出るが内面のバランスが真剣さも保ち、関係を深められる。", moderate: "軽い態度が目立ち、真剣な関係を遠ざけてしまう。", imbalanced: "内面の偏りが軽さを極限化し、真剣な関係が完全に遠ざかる。" } },
  調舒星: { good: { balanced: "感性が研ぎ澄まされ、芸術的・精神的なつながりで恋が深まる。内面のバランスが孤独感を健全な創造力に変える。", moderate: "感性が研ぎ澄まされ、芸術的・精神的なつながりで恋が深まる。", imbalanced: "感性が研ぎ澄まされるが内面の偏りが孤独感を極限化し、パートナーを試してしまう。" }, bad: { balanced: "孤独感が出るが内面のバランスが被害者意識を抑え、パートナーを試さずに済む。", moderate: "孤独感や被害者意識が強まり、パートナーを試してしまう。", imbalanced: "内面の偏りが孤独感を極限化し、被害者意識からパートナーを常に試して関係を壊す。" } },
  禄存星: { good: { balanced: "優しさと気配りで相手を安心させる。内面のバランスが依存を抑え、健全な愛情を注げる。", moderate: "優しさと気配りで相手を安心させる。尽くす愛情が報われやすい。", imbalanced: "優しさと気配りで相手を安心させるが内面の偏りが依存をエスカレートさせ、相手を重くして距離を置かれる。" }, bad: { balanced: "依存する傾向はあるが内面のバランスが自立を保ち、相手を重くさせない。", moderate: "依存しすぎて相手を重くさせ、距離を置かれる。", imbalanced: "内面の偏りが依存を極限化し、相手を完全に窒息させて距離を置かれる。" } },
  司禄星: { good: { balanced: "安定した関係を築きやすい時期。内面のバランスが安定と変化のバランスを取り、マンネリを防ぐ。", moderate: "安定した関係を築きやすい時期。日常の積み重ねで信頼が深まる。", imbalanced: "安定した関係を築きやすい時期だが内面の偏りが変化への恐怖を強め、マンネリになって関係が停滞する。" }, bad: { balanced: "マンネリになりがちだが内面のバランスが適度な変化をもたらす。", moderate: "変化を恐れてマンネリになり、関係が停滞する。", imbalanced: "内面の偏りが変化への恐怖を極限化し、完全にマンネリになって関係が死んでしまう。" } },
  車騎星: { good: { balanced: "情熱的なアプローチで恋が動く。内面のバランスが情熱に持続力を与え、ストレートな気持ちが相手を惹きつける。", moderate: "情熱的なアプローチで恋が動く。ストレートな気持ちが相手を惹きつける。", imbalanced: "情熱的なアプローチで恋が動くが内面の偏りが短気をエスカレートさせ、喧嘩になりやすく勢いで言葉を過ぎて関係を壊す。" }, bad: { balanced: "短気な傾向はあるが内面のバランスが感情を抑え、喧嘩にならずに済む。", moderate: "短気で喧嘩になりやすく、勢いで言葉を過ぎて関係を壊す。", imbalanced: "内面の偏りが短気を極限化し、些細なことで喧嘩になり勢いで関係を次々と壊す。" } },
  牽牛星: { good: { balanced: "品のある態度で信頼を勝ち取る。内面のバランスがプライドを適度に保ち、素直になれる瞬間も作れる。", moderate: "品のある態度で信頼を勝ち取る。大人の恋愛として関係が深まる。", imbalanced: "品のある態度で信頼を勝ち取るが内面の偏りがプライドを極限化し、素直になれずすれ違いが生じる。" }, bad: { balanced: "プライドが邪魔することはあるが内面のバランスが素直さを取り戻させ、すれ違いを解消できる。", moderate: "プライドが邪魔をして素直になれず、すれ違いが生じる。", imbalanced: "内面の偏りがプライドを極限化し、絶対に素直になれずすれ違いが決定的になる。" } },
  龍高星: { good: { balanced: "非日常の出会いや刺激的な恋愛のチャンス。内面のバランスが自由と安定を両立し、関係を深められる。", moderate: "非日常の出会いや刺激的な恋愛のチャンス。旅先での縁あり。", imbalanced: "非日常の出会いや刺激的な恋愛のチャンスだが内面の偏りが自由への執着を強め、関係を深める前に逃げてしまう。" }, bad: { balanced: "東縛を嫌う傾向はあるが内面のバランスが落としどころを見つけさせる。", moderate: "東縛を嫌って自由を優先し、関係を深める前に逃げてしまう。", imbalanced: "内面の偏りが自由への執着を極限化し、関係が落ち着くと即座に逃げ出す。" } },
  玉堂星: { good: { balanced: "知的な会話や精神的なつながりで恋が育つ。内面のバランスが考えすぎを抑え、適切なタイミングで行動できる。", moderate: "知的な会話や精神的なつながりで恋が育つ。ゆっくりとしたペースが良縁を呼ぶ。", imbalanced: "知的な会話や精神的なつながりで恋が育つが内面の偏りが考えすぎをエスカレートさせ、行動が遅くチャンスを逃して後悔する。" }, bad: { balanced: "考えすぎる傾向はあるが内面のバランスが行動力を与え、チャンスを掴める。", moderate: "考えすぎて行動が遅く、チャンスを逃して後悔する。", imbalanced: "内面の偏りが考えすぎを極限化し、行動が全くできずチャンスを全て逃して後悔する。" } }
};

const starFortuneWork = {
  貫索星: { good: { balanced: "自分の専門分野で評価が高まる時期。内面のバランスが協調性も与え、独立と協調のバランスを取れる。", moderate: "自分の専門分野で評価が高まる時期。独立や専門性の深化に最適。", imbalanced: "自分の専門分野で評価が高まる時期だが内面の偏りが協調性を欠かせ、チームや組織と衝突して孤立する。" }, bad: { balanced: "協調性を欠く傾向はあるが内面のバランスが柔軟性を保ち、チームと協調できる。", moderate: "協調性を欠き、チームや組織と衝突して孤立する。", imbalanced: "内面の偏りが協調性の欠如を極限化し、チームや組織と常に衝突して完全に孤立する。" } },
  石門星: { good: { balanced: "チームや組織の中で力を発揮。内面のバランスが自分の意見も持ちつつ協調できる。", moderate: "チームや組織の中で力を発揮。人脈を活かした仕事の成果が出やすい。", imbalanced: "チームや組織の中で力を発揮するが内面の偏りが八方美人をエスカレートさせ、自分の意見がなく評価が曖昧になる。" }, bad: { balanced: "八方美人になる傾向はあるが内面のバランスが自分の意見を保たせる。", moderate: "八方美人になり、自分の意見がなく評価が曖昧になる。", imbalanced: "内面の偏りが八方美人を極限化し、自分の意見が完全になく評価が決定的に曖昧になる。" } },
  鳳閣星: { good: { balanced: "表現力や企画力が光る時期。内面のバランスが危機感も適度に保ち、締め切りや責任を果たせる。", moderate: "表現力や企画力が光る時期。クリエイティブな仕事で評価される。", imbalanced: "表現力や企画力が光る時期だが内面の偏りが危機感を完全に欠かせ、締め切りや責任を軽視して信用を落とす。" }, bad: { balanced: "危機感が薄い傾向はあるが内面のバランスが責任感を保ち、信用を落とさない。", moderate: "危機感が薄く、締め切りや責任を軽視して信用を落とす。", imbalanced: "内面の偏りが危機感の欠如を極限化し、締め切りや責任を完全に軽視して信用を決定的に落とす。" } },
  調舒星: { good: { balanced: "感性と審美眼が武器になる時期。内面のバランスが対人摩擦を抑え、チームワークも保てる。", moderate: "感性と審美眼が武器になる時期。専門的なスキルで独自のポジションを確保。", imbalanced: "感性と審美眼が武器になる時期だが内面の偏りが対人摩擦をエスカレートさせ、チームワークを欠いて孤立する。" }, bad: { balanced: "対人摩擦が起きやすいが内面のバランスが協調性を保ち、孤立を防げる。", moderate: "対人摩擦が起きやすく、チームワークを欠いて孤立する。", imbalanced: "内面の偏りが対人摩擦を極限化し、チームワークが完全に崩れて孤立する。" } },
  禄存星: { good: { balanced: "面倒見の良さが評価され、指導や教育の役割で信頼を集める。内面のバランスが自分の仕事とのバランスを取る。", moderate: "面倒見の良さが評価され、指導や教育の役割で信頼を集める。", imbalanced: "面倒見の良さが評価されるが内面の偏りが他人への時間投入をエスカレートさせ、自分の仕事が進まない。" }, bad: { balanced: "他人に時間を使いすぎる傾向はあるが内面のバランスが自分の仕事も進められる。", moderate: "他人に時間を使いすぎて自分の仕事が進まない。", imbalanced: "内面の偏りが他人への時間投入を極限化し、自分の仕事が全く進まない。" } },
  司禄星: { good: { balanced: "堅実な仕事ぶりが評価される時期。内面のバランスが変化への適応力も与え、新しいプロジェクトにも対応できる。", moderate: "堅実な仕事ぶりが評価される時期。実績の蓄積が成果に繋がる。", imbalanced: "堅実な仕事ぶりが評価される時期だが内面の偏りが変化に弱く、新しいプロジェクトや環境に対応できない。" }, bad: { balanced: "変化に弱い傾向はあるが内面のバランスが適応力を保ち、新しい環境にも対応できる。", moderate: "変化に弱く、新しいプロジェクトや環境に対応できない。", imbalanced: "内面の偏りが変化への不適応を極限化し、新しいプロジェクトや環境に全く対応できない。" } },
  車騎星: { good: { balanced: "行動力と競争力が光る時期。内面のバランスがチームの信頼も損なわず、単独と協調のバランスを取れる。", moderate: "行動力と競争力が光る時期。営業や新規開拓で成果を出しやすい。", imbalanced: "行動力と競争力が光る時期だが内面の偏りが独断専行をエスカレートさせ、チームの信頼を損なう。" }, bad: { balanced: "独断専行の傾向はあるが内面のバランスがチームの信頼を保ち、協調できる。", moderate: "独断専行が目立ち、チームの信頼を損なう。", imbalanced: "内面の偏りが独断専行を極限化し、チームの信頼を完全に失う。" } },
  牽牛星: { good: { balanced: "名誉と立場が向上する時期。内面のバランスが面子と実質を両立させ、真のリーダーとして機能する。", moderate: "名誉と立場が向上する時期。責任あるポジションで評価される。", imbalanced: "名誉と立場が向上する時期だが内面の偏りが面子へのこだわりを強め、実質を疎かして周囲の不信を買う。" }, bad: { balanced: "面子にこだわる傾向はあるが内面のバランスが実質も保ち、不信を買わない。", moderate: "面子にこだわって実質を疎かし、周囲の不信を買う。", imbalanced: "内面の偏りが面子へのこだわりを極限化し、実質を完全に疎かして周囲の決定的な不信を買う。" } },
  龍高星: { good: { balanced: "改革や新規事業で力を発揮。内面のバランスが型破りなアプローチに継続性を与え、成功の鍵を掴む。", moderate: "改革や新規事業で力を発揮。型破りなアプローチが成功の鍵。", imbalanced: "改革や新規事業で力を発揮するが内面の偏りが飽きっぽさをエスカレートさせ、プロジェクトを放り出し信用を失う。" }, bad: { balanced: "飽きっぽい傾向はあるが内面のバランスが継続力を与え、信用を失わない。", moderate: "飽きっぽさでプロジェクトを放り出し、信用を失う。", imbalanced: "内面の偏りが飽きっぽさを極限化し、プロジェクトを次々と放り出し信用を完全に失う。" } },
  玉堂星: { good: { balanced: "知識と学習力が評価される時期。内面のバランスが実行力も与え、現場から浮かずに成果を出せる。", moderate: "知識と学習力が評価される時期。研究や資格、教育関連で成果が出る。", imbalanced: "知識と学習力が評価される時期だが内面の偏りが理屈への依存を深め、実行力がなく現場から浮く。" }, bad: { balanced: "理屈で逃げる傾向はあるが内面のバランスが実行力を与え、現場から浮かない。", moderate: "理屈ばかりで実行力がなく、現場から浮く。", imbalanced: "内面の偏りが理屈への逃避を極限化し、実行力が完全になく現場から完全に浮く。" } }
};

// 十二大従星ごとの金運・恋愛運・仕事運の補正
const energyFortuneMoney = {
  天報星: { balanced: "複数の収入源があるがまとまりに欠ける。内面のバランスが優先順位を明確にし、小刻みの短期決戦を効率的に回せる。", moderate: "複数の収入源があるがまとまりに欠ける。小刻みの短期決戦を繰り返すことで財をなす時期。長期展望より瞬間瞬間をうまく使うのが鍵。", imbalanced: "複数の収入源があるが内面の偏りが分散を極限化し、まとまりが完全になく収入が安定しない。" },
  天印星: { balanced: "今を堅実に生きることで金運が回る。内面のバランスが着実な積み重ねに持続力を与える。", moderate: "長期展望を持たず今を堅実に生きることで金運が回る。一つ一つを着実に消化することが財を成す鍵。", imbalanced: "内面の偏りが堅実さを行き過ぎさせ、何も挑戦できず金運が停滞する。" },
  天貴星: { balanced: "品と向上心で金運上昇。内面のバランスがプライドを適度に保ち、実績を積んで安定する。", moderate: "品と向上心で金運上昇。積み重ね型の思考なので、コツコツ実績を積むことで安定する。プライドが高すぎると機会を逸する。", imbalanced: "内面の偏りがプライドを極限化し、高望みして機会を次々と逸する。" },
  天恍星: { balanced: "移動や変化が金運の鍵。内面のバランスが刺激への衝動を抑え、新しい分野で確実に財を開ける。", moderate: "移動や変化が金運の鍵。現状打破のタイミングで新しい分野に飛び込むことで財が開ける。ただし刺激を求めて散財しやすい。", imbalanced: "内面の偏りが刺激への欲求を極限化し、散財が止まらなくなる。" },
  天南星: { balanced: "仕事と財力が一致しない特性がある。内面のバランスが強引さを抑え、前進力で安定的に収入増する。", moderate: "仕事と財力が一致しない特性がある。生き甲斐で動くタイプで、体制側からの恩恵に頼らず前進する。前進力で収入増だが、強引さが出ると取引先を失う。", imbalanced: "内面の偏りが強引さを極限化し、取引先を次々と失って収入が途絶える。" },
  天禄星: { balanced: "堅実な蓄積で金運安定。内面のバランスが安全策と適度な挑戦のバランスを取り、成長も止まらない。", moderate: "堅実な蓄積で金運安定。健康と経済が生存の二大現実で、地味な積み重ねの努力が財を成す。安全策に逃げすぎると成長が止まる。", imbalanced: "内面の偏りが安全策への逃避を極限化し、成長が完全に止まる。" },
  天将星: { balanced: "強い権力と金運。内面のバランスが器を大きくし、波の頂点でも底辺でも人脈を失わない。", moderate: "強い権力と金運。上下動の大きい人生で、波の頂点と底辺で最大エネルギーが発揮される。器が小さいと暴君になり人脈を失う。", imbalanced: "内面の偏りが暴君化を極限化し、人脈を完全に失って金運も崩壊する。" },
  天堂星: { balanced: "観察力で堅実に稼ぐ。内面のバランスが諦念を健全な慎重さに変え、地に足の着いた収入を安定させる。", moderate: "観察力で堅実に稼ぐ。退気のエネルギーで派手なことを嫌い、地に足の着いた収入を好む。諦念が強すぎると機会を逃す。", imbalanced: "内面の偏りが諦念を極限化し、機会を次々と逃して収入が停滞する。" },
  天胡星: { balanced: "感性で稼ぐ時期。内面のバランスが感性と現実感覚のバランスを取り、発明発見で確実に財を成す。", moderate: "感性で稼ぐ時期。有から無を感知して無から新たな有を作る才能で、発明発見やアイデアの世界で才を発揮する。ただし現実逃避すると金運が流れる。", imbalanced: "内面の偏りが現実逃避を極限化し、金運が完全に流れてしまう。" },
  天極星: { balanced: "精神的な豊かさが先行するが、内面のバランスが現実的な金運にも目を向けさせ、環境に恵まれれば安定する。", moderate: "精神的な豊かさが先行し、現実的な金運は後回しになりやすい。自力で現実を作れず環境依存のため、環境に恵まれれば安定するが、自分から計画的に財を築くのは難しい。", imbalanced: "内面の偏りが精神への逃避を極限化し、現実的な金運が完全に後回しになる。" },
  天庫星: { balanced: "蓄積と探究のチャンス。内面のバランスが執着を健全な探究心に変え、社会的有用性を見失わずに財を成す。", moderate: "蓄積と探究のチャンス。単一志向で突き進む探究心が財を成すが、連結のない思考で社会的有用性を見失うと資金が固定化する。執着しすぎると呪縛される。", imbalanced: "内面の偏りが執着を極限化し、資金が固定化され呪縛されて金運が動かなくなる。" },
  天馳星: { balanced: "点的今の連続で目の前のことに全力を注ぐ。内面のバランスが複数の収入源をうまく並行させ、持続力の限界も補う。", moderate: "点的今の連続で目の前のことに全力を注ぐ。分裂・分離の本性で複数の収入源を並行できるが、一つに集中すると持続力に限界がある。名誉や財にとらわれないさっぱりとした金運。", imbalanced: "内面の偏りが分裂を極限化し、複数の収入源がすべて中途半端になり金運が安定しない。" }
};
const energyFortuneLove = {
  天報星: { balanced: "恋愛の選択肢が広がる。内面のバランスがきまぐれを抑え、一つに絞る判断力を与える。", moderate: "恋愛の選択肢が広がるが、きまぐれで気持ちがふらふらしやすい。一つに絞るのが課題だが、本人に自覚がないため、相手が受け入れるかが鍵。", imbalanced: "内面の偏りがきまぐれを極限化し、気持ちが完全に定まらず関係が常に不安定になる。" },
  天印星: { balanced: "無自覚に相手の必要性を察知して惹きつける時期。内面のバランスが依存を抑え、今の縁を健全に育てる。", moderate: "無自覚に相手の必要性を察知して惹きつける時期。ただし依存しすぎると重く感じられる。今の縁を堅実に育てるのが鍵。", imbalanced: "内面の偏りが依存を極限化し、相手を重く感じさせて距離を置かれる。" },
  天貴星: { balanced: "品が魅力で好印象。内面のバランスが不安を乗り越えさせ、適度な高望みで良縁を引き寄せる。", moderate: "品が魅力で好印象だが、ピュアな自意識の裏側にある不安を見せられない。高望みしすぎると相手を遠ざける。", imbalanced: "内面の偏りが不安を極限化し、高望みして相手を次々と遠ざける。" },
  天恍星: { balanced: "華やかさで注目を集める。内面のバランスが刺激への衝動を抑え、冒険しても関係を安定させる。", moderate: "華やかさで注目を集めるが、肉体の揺らぎが色事や冒険に向かいやすい。刺激を求めすぎると関係が不安定になる。", imbalanced: "内面の偏りが刺激への欲求を極限化し、色事や冒険に走り関係が常に不安定になる。" },
  天南星: { balanced: "一本気で純粋なアプローチが実る時期。内面のバランスが強引さを抑え、一度交われば長く続く縁になる。", moderate: "一本気で純粋なアプローチが実る時期。ただし自分を曲げられない不器用さが摩擦を生み、強引さが出ると相手を引かせる。一度交われば長く続く縁になる。", imbalanced: "内面の偏りが強引さを極限化し、不器用さが摩擦を生み続けて相手を引かせる。" },
  天禄星: { balanced: "安定した関係を築きやすい。内面のバランスが安全策と適度な冒険のバランスを取り、マンネリを防ぐ。", moderate: "安定した関係を築きやすい。自己保身の中庸バランスで無難な相手選びをするが、冒険を避けて変化を恐れるとマンネリになる。", imbalanced: "内面の偏りが安全策への逃避を極限化し、完全にマンネリになって関係が死ぬ。" },
  天将星: { balanced: "主導権を握りやすい。内面のバランスが自我を健全なリーダーシップに変え、相手を尊重できる。", moderate: "主導権を握りやすい。自我が強く自分の意志を押し通すが、内実は子供のように無邪気で寂しがり屋な面がある。相手を従わせようとすると衝突する。", imbalanced: "内面の偏りが自我を極限化し、相手を従わせようとして衝突が絶えない。" },
  天堂星: { balanced: "落ち着いた観察で良い縁を引き寄せる。内面のバランスが自制心と適度な情熱のバランスを取り、相手を不安にさせない。", moderate: "落ち着いた観察で良い縁を引き寄せる。間断の気で年齢差のある関係で燃焼しやすい。自制心が強いが、冷めると相手を不安にする。", imbalanced: "内面の偏りが自制心を行き過ぎさせ、冷めると相手を完全に不安にして関係が壊れる。" },
  天胡星: { balanced: "感受性が豊かでロマンチック。内面のバランスが現実感覚も保ち、誤解を招かずに関係を築ける。", moderate: "感受性が豊かでロマンチック。美意識が強く人を疑わないが、時系列的な秩序を欠く発想で誤解を招きやすい。現実を離れた発想ゆえに関係が崩れやすい。", imbalanced: "内面の偏りが現実逃避を極限化し、関係が常に崩れやすい。" },
  天極星: { balanced: "受け身だが、内面のバランスが環境に合わせつつ自分から動く意識も与え、縁を掴みやすくなる。", moderate: "受け身で縁を掴みにくいが、環境に合わせて心を作るため恵まれた環境では自然に縁が入る。自分から動く意識と、環境依存から抜け出す主体性が必要。", imbalanced: "内面の偏りが受身を極限化し、環境依存から抜け出せず縁を掴めない。" },
  天庫星: { balanced: "過去の縁を引きずりやすいが、内面のバランスが執着を健全な深掘りに変え、新たな縁も入れる。", moderate: "過去の縁を引きずりやすい。連結のない一筋の探究心で相手に固執するが、自分なりのバランス感覚で違和感を排除しようとする。執着を手放すと新たな縁が入る。", imbalanced: "内面の偏りが執着を極限化し、過去の縁に固執して新たな縁が一切入らない。" },
  天馳星: { balanced: "瞬発的な魅力で急接近する。内面のバランスが点的今の連続でも持続的な感情を作り、気分屋に映らない。", moderate: "瞬発的な魅力で急接近するが、点的今の連続で固定された持続的な感情を作らない。こだわりを持たないさっぱりとした精神が相手には気分屋に映る。", imbalanced: "内面の偏りが分裂を極限化し、持続的な感情が全く作れず相手に完全に気分屋に映る。" }
};
const energyFortuneWork = {
  天報星: { balanced: "複数の仕事が同時に回る。内面のバランスが優先順位を明確にし、前例のない分野で効率的に力を発揮する。", moderate: "複数の仕事が同時に回るが、まとまりに欠ける。前例のない新しい分野で力を発揮するが、優先順位の明確化と小刻みの連結が必要。", imbalanced: "内面の偏りが分散を極限化し、複数の仕事がすべて中途半端になり成果が出ない。" },
  天印星: { balanced: "裏方で力を発揮する時期。内面のバランスが着実な準備に持続力を与え、一つ一つを確実に成果に繋げる。", moderate: "人の目に触れないところで事の原因を作り出す時期。準備と観察の星なので、表舞台より裏方で力を発揮する。一つ一つを着実に消化することが成果に繋がる。", imbalanced: "内面の偏りが裏方への逃避を極限化し、表舞台に一切出られず成果が見えない。" },
  天貴星: { balanced: "試練によって磨かれる時期。内面のバランスがプライドを適度に保ち、教える立場でチームからも信頼される。", moderate: "試練によって磨かれる時期。積み重ね型の学習力で綿密に準備し、教える立場で評価される。ただし飛躍した発想には限界があり、プライドが高すぎるとチームから浮く。", imbalanced: "内面の偏りがプライドを極限化し、チームから完全に浮いて孤立する。" },
  天恍星: { balanced: "現状打破のチャンス。内面のバランスが刺激への衝動を抑え、新しい分野で確実に成長を加速する。", moderate: "現状打破のチャンス。脱皮したくなる想念が新しい分野への転職や冒険を促す。分岐点を乗り越えると成長が加速するが、刺激を追いすぎると腰が落ち着かない。", imbalanced: "内面の偏りが刺激への欲求を極限化し、腰が全く落ち着かず転職を繰り返す。" },
  天南星: { balanced: "新しい世界を切り開く時期。内面のバランスが批判力を建設的な改革に変え、協力者を失わない。", moderate: "内的世界への固執が前進力となり、新しい世界を切り開く時期。古いものを廃し独創的な思考力で改革を推し進める。ただし環境を無視した批判力で協力者を失うことも。", imbalanced: "内面の偏りが批判力を極限化し、協力者を次々と失って孤立する。" },
  天禄星: { balanced: "堅実に実績を積める時期。内面のバランスが用心深さと適度な挑戦のバランスを取り、発明発見にも繋げる。", moderate: "堅実に実績を積める時期。職人として積み重ねた経験が評価され、経験則に基づく未来予測力で安定した成果を出す。用心深さが発明や発見につながることも。変化に弱く新しい挑戦を避けがち。", imbalanced: "内面の偏りが用心深さを行き過ぎさせ、新しい挑戦を完全に避けて成長が止まる。" },
  天将星: { balanced: "強いリーダーシップで成果を出す。内面のバランスが周囲を押し付けず、創造と破壊のバランスを取って次元を上げる。", moderate: "強いリーダーシップで成果を出す。極まることで転換を作り出し、創造と破壊を繰り返しながら次元を上げる。ただし周囲を押し付けると反発を招き、強すぎる運勢が協力者を犠牲にすることも。", imbalanced: "内面の偏りが押し付けを極限化し、反発を招いて協力者を犠牲にする。" },
  天堂星: { balanced: "観察と分析で確実に成果を出す。内面のバランスが諦念を健全な慎重さに変え、単独行動でも伸びしろを活かせる。", moderate: "観察と分析で確実に成果を出す。自制心による出処進退のわきまえがあり、単独行動で力を発揮する。ただし諦念が強すぎると伸びしろを消す。", imbalanced: "内面の偏りが諦念を極限化し、伸びしろを完全に消して何も挑戦しない。" },
  天胡星: { balanced: "感性を活かした仕事で光る。内面のバランスが集中力と休憩のバランスを取り、先見性のある成果を安定して出す。", moderate: "感性を活かした仕事で光る。無から何かを作り出す能力と異常な集中力で先見性のある成果を出す。ただし精神が肉体を追い込みやすく、際限のない集中で故障しやすい。", imbalanced: "内面の偏りが集中を極限化し、際限のない集中で故障して仕事が続けられない。" },
  天極星: { balanced: "精神性が深まり回帰作用で異次元への飛翔力が増す。内面のバランスが行動力も与え、計画的に動く主体性を発揮できる。", moderate: "精神性が深まり回帰作用で異次元への飛翔力が増すが、行動力が不足しがち。環境に合わせて力を発揮するが、自分から未来を志向して計画的に動く主体性が必要。", imbalanced: "内面の偏りが行動力の不足を極限化し、自分から全く動けず主体性がない。" },
  天庫星: { balanced: "蓄積と研究で成果が出る。内面のバランスが執着を健全な探究に変え、過去のやり方に固執せず変化にも対応する。", moderate: "蓄積と研究で成果が出る。連結のない一筋の探究心で深く掘り下げ、中庸力で本質を感知する。ただし過去のやり方に固執すると変化に遅れ、とらわれたものに呪縛される。", imbalanced: "内面の偏りが固執を極限化し、過去のやり方に固執して呪縛され変化に完全に遅れる。" },
  天馳星: { balanced: "外動内静でよく働き動き回る。内面のバランスが異質な分野の作業を効率的に並行させ、持続力の限界も補う。", moderate: "外動内静でよく働き動き回る。分裂・分離の本性で異質な分野の作業を並行してこなす。点的今に全力を注ぐが、一つに集中すると持続力に限界がある。動けない環境だと肉体が破壊されやすい。", imbalanced: "内面の偏りが分裂を極限化し、一つに集中すると持続力が完全に限界に達し、動けない環境だと肉体が破壊される。" }
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
  const yearTopo = analyzeBranchTopology(yp.branch, pillars);
  const taiunTopo = currentTaiun ? analyzeBranchTopology(currentTaiun.branch, pillars) : [];

  // 五行関係（日干と年運・大運の天干）
  const dayEl = elements[stems.indexOf(day.stem)];
  const yearEl = elements[stems.indexOf(yp.stem)];
  const taiunEl = currentTaiun ? elements[stems.indexOf(currentTaiun.stem)] : null;
  const gogyoRel = { 木: { 木: "比和", 火: "相生", 土: "相剋", 金: "反剋", 水: "相生" }, 火: { 木: "相生", 火: "比和", 土: "相生", 金: "相剋", 水: "反剋" }, 土: { 木: "反剋", 火: "相生", 土: "比和", 金: "相生", 水: "相剋" }, 金: { 木: "相剋", 火: "反剋", 金: "比和", 土: "相生", 水: "相生" }, 水: { 木: "相生", 火: "相剋", 土: "反剋", 金: "相生", 水: "比和" } };
  const yearRel = gogyoRel[dayEl][yearEl];
  const taiunRel = taiunEl ? gogyoRel[dayEl][taiunEl] : null;

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

  // 総合スコア（0-100）
  let moneyScore = 50, loveScore = 50, workScore = 50;
  const goodStars = ["禄存星", "司禄星", "石門星", "玉堂星", "牽牛星"];
  const badStars = ["調舒星", "龍高星", "車騎星"];
  if (goodStars.includes(yearStar)) { moneyScore += 10; loveScore += 8; workScore += 10; }
  if (badStars.includes(yearStar)) { moneyScore -= 8; loveScore -= 5; workScore -= 8; }
  if (taiunStar && goodStars.includes(taiunStar)) { moneyScore += 8; loveScore += 6; workScore += 8; }
  if (taiunStar && badStars.includes(taiunStar)) { moneyScore -= 6; loveScore -= 4; workScore -= 6; }
  if (yearRel === "相生") { moneyScore += 8; loveScore += 10; workScore += 8; }
  if (yearRel === "比和") { moneyScore += 3; loveScore += 3; workScore += 3; }
  if (yearRel === "相剋") { moneyScore -= 8; loveScore -= 8; workScore -= 8; }
  if (yearRel === "反剋") { moneyScore -= 5; loveScore -= 5; workScore -= 5; }
  if (taiunRel === "相生") { moneyScore += 5; loveScore += 6; workScore += 5; }
  if (taiunRel === "相剋") { moneyScore -= 5; loveScore -= 5; workScore -= 5; }
  const goodEnergy = ["天貴星", "天南星", "天禄星", "天将星", "天堂星"];
  const badEnergy = ["天報星", "天胡星", "天極星", "天馳星"];
  if (goodEnergy.includes(yearEnergy.name)) { moneyScore += 5; loveScore += 3; workScore += 5; }
  if (badEnergy.includes(yearEnergy.name)) { moneyScore -= 5; loveScore -= 5; workScore -= 5; }
  if (isYearTenchu) { moneyScore -= 10; loveScore -= 10; workScore -= 8; }
  if (isTaiunTenchu) { moneyScore -= 5; loveScore -= 5; workScore -= 5; }
  const topoGoCount = yearTopo.filter((r) => r.group === "合法").length;
  const topoSanCount = yearTopo.filter((r) => r.group === "散法").length;
  moneyScore += topoGoCount * 4 - topoSanCount * 4;
  loveScore += topoGoCount * 3 - topoSanCount * 4;
  workScore += topoGoCount * 4 - topoSanCount * 3;
  moneyScore = Math.max(5, Math.min(95, moneyScore));
  loveScore = Math.max(5, Math.min(95, loveScore));
  workScore = Math.max(5, Math.min(95, workScore));

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
    else if (avgScore >= 55) overallTone = "だいたい順調ですが、油断せずコツコツ進めるのがいい時期です";
    else if (avgScore >= 40) overallTone = "良いことと悪いことが混ざる時期で、メリハリをつけて動く必要があります";
    else overallTone = "運気が低迷しやすい時期です。無理をせず、守りを固めるのが無難です";
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
      advice = "今は注意が必要な時期です。「動かないこと」が一番の戦略です。整理や準備に徹し、時期が明けたらスタートダッシュに備えましょう。";
    } else {
      advice = "厳しい時期ですが、無理をしなければ乗り越えられます。健康と人間関係を最優先にし、次のチャンスに備えて力を蓄えましょう。";
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
  "鳳閣星": { opposite: 30, same: 3, oppDesc: "一緒にいて楽しい明るさと自然体。ムードメーカー的存在", sameDesc: "明るく楽しいが、同性からは「調号いい」と映ることも" },
  "調舒星": { opposite: 30, same: 2, oppDesc: "ミステリアスで色気ナンバーワン。年を重ねるほどモテ度アップ", sameDesc: "繊細で独自の世界を持ち、同性からは理解しづらい面も" },
  "禄存星": { opposite: 35, same: 8, oppDesc: "モテの王道。奉仕精神とホスピタリティで誰からも愛される", sameDesc: "面倒見が良く頼れるが、同性からは「全員に優しい」と不満も" },
  "司禄星": { opposite: 2, same: 18, oppDesc: "控えめで家庭的。派手さはないが長く付き合うほど安心感", sameDesc: "堅実でマメ。同性からは信頼できる良き理解者として好かれる" },
  "車騎星": { opposite: 8, same: 30, oppDesc: "さっぱりして裏表がない。情に厚いが張り合いすぎに注意", sameDesc: "竹を割ったような性格で同性から圧倒的人気。損得抜きで動く誠実さ" },
  "牽牛星": { opposite: 3, same: 25, oppDesc: "真面目で品がある。知的な会話を好む相手に響く", sameDesc: "信用が置けて頼りになる。同性からは尊敬を集めるタイプ" },
  "龍高星": { opposite: 25, same: 3, oppDesc: "何するか分からないビックリ箱魅力。色気と知的好奇心で惹きつける", sameDesc: "自由奔放で個性的。同性からは面白いが掴みどころないと映る" },
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
      oppositeScore += p.oppDesc ? p.opposite : 0;
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

  // 異常干支の補正
  const hasAbnormal = ["year", "month", "day"].some(key => getAbnormalZodiac(pillars[key].stem, pillars[key].branch));
  if (hasAbnormal) {
    oppositeScore += 12;
    sameScore += 8;
    oppFactors.push("異常干支持ちの独特なオーラが、一部の異性を強烈に惹きつける");
    sameFactors.push("異常干支の個性が、同性からも「面白い人」として注目される");
  }

  // 正規化: 生スコアを0-100スケールに変換
  // 実用的な範囲は約15-220（星6個×最大35 + 補正類）
  const RAW_MIN = 15;
  const RAW_MAX = 220;
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

  // 異常干支持ちのファン層
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

function analyzeHealthRisk(day, pillars, counts, taiun, tenchusatsu, currentAge, thisYear) {
  const dayElement = elements[stems.indexOf(day.stem)];
  const entries = Object.entries(counts);
  const maxVal = Math.max(...entries.map(([, v]) => v));
  const minVal = Math.min(...entries.map(([, v]) => v));
  const strongest = entries.filter(([, v]) => v === maxVal).map(([k]) => k);
  const weakest = entries.filter(([, v]) => v === minVal).map(([k]) => k);

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

    riskScore = Math.min(100, riskScore);
    const level = riskScore >= 50 ? "高危険" : riskScore >= 15 ? "軽度注意" : "通常";

    if (riskScore >= 15) {
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
    majorDiseaseRisks: yearRisks.filter(r => r.majorDiseases.length > 0 && r.level === "高危険").sort((a, b) => b.riskScore - a.riskScore)
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

// === 人生のターニングポイント算出 ===
function analyzeTurningPoints(day, pillars, mainStars, taiun, tenchusatsu, birthYear, currentAge) {
  const points = [];
  const dayEl = elements[stems.indexOf(day.stem)];
  const gogyoRel = { 木: { 木: "比和", 火: "相生", 土: "相剋", 金: "反剋", 水: "相生" }, 火: { 木: "相生", 火: "比和", 土: "相生", 金: "相剋", 水: "反剋" }, 土: { 木: "反剋", 火: "相生", 土: "比和", 金: "相生", 水: "相剋" }, 金: { 木: "相剋", 火: "反剋", 金: "比和", 土: "相生", 水: "相生" }, 水: { 木: "相生", 火: "相剋", 土: "反剋", 金: "相生", 水: "比和" } };
  const goodStars = ["禄存星", "司禄星", "石門星", "玉堂星", "牽牛星", "貫索星"];
  const badStars = ["調舒星", "龍高星", "車騎星"];

  // 陽占の主星リスト
  const yangStars = [mainStars.center, mainStars.north, mainStars.south, mainStars.east, mainStars.west];
  // 陰占の三柱の地支
  const yinBranches = [pillars.year.branch, pillars.month.branch, pillars.day.branch];

  taiun.periods.forEach((p, idx) => {
    const star = getMainStar(day.stem, p.stem);
    const eStar = getEnergyStar(day.stem, p.branch);
    const taiunEl = elements[stems.indexOf(p.stem)];
    const rel = gogyoRel[dayEl][taiunEl];
    const isTenchu = isTenchusatsuYear(p.branch, tenchusatsu);
    const prevP = idx > 0 ? taiun.periods[idx - 1] : null;
    const prevStar = prevP ? getMainStar(day.stem, prevP.stem) : null;
    const prevTenchu = prevP ? isTenchusatsuYear(prevP.branch, tenchusatsu) : false;
    const yearStart = birthYear + p.age;

    // 大運の位相法
    const topoResults = analyzeBranchTopology(p.branch, pillars);
    const topoGo = topoResults.filter((r) => r.group === "合法");
    const topoSan = topoResults.filter((r) => r.group === "散法");

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
        return r.note || r.name;
      });
    };

    // 陽占の主星との関係（大運の主星が陽占に含まれるか）
    const starInYang = yangStars.includes(star);
    // 陰占の地支との関係（大運の地支が陰占に含まれるか）
    const branchInYin = yinBranches.includes(p.branch);

    // === ターニングポイント候補の抽出とスコアリング ===

    // 1. 大運の切り替わり（星が変わった時）
    if (prevStar && prevStar !== star) {
      const events = [];
      if (goodStars.includes(star)) {
        if (star === "禄存星" || star === "司禄星") events.push("家庭やパートナーシップが安定し、結婚や出産などの家庭運が高まる時期");
        if (star === "石門星") events.push("人脈が広がり、新しいコミュニティや組織での活躍が期待できる時期");
        if (star === "玉堂星") events.push("学びや資格取得、専門性の深化によって評価が高まる時期");
        if (star === "牽牛星") events.push("社会的な責任や地位が上がり、名誉ある立場を任される時期");
        if (star === "貫索星") events.push("独立や自立の意志が強まり、自分の道を切り開く決断の時期");
      }
      if (badStars.includes(star)) {
        if (star === "調舒星") events.push("感受性が鋭くなり、芸術や精神的な深まりがある一方、人間関係で孤立しやすい時期");
        if (star === "龍高星") events.push("現状を壊して新しい道を切り開く変革期。転職や移住など大きな変化が起こりやすい時期");
        if (star === "車騎星") events.push("行動力と競争心が高まるが、摩擦や衝突にも注意が必要な時期");
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

    // 2. 天中殺の開始
    if (isTenchu && !prevTenchu) {
      const events = [
        "ご縁が不安定になりやすく、大きな決断や新規スタートは避けるべき時期の始まり",
        "これまでの成果を見直し、整理・準備に使うことで次の飛躍の土台を作る時期"
      ];
      let score = 60;
      if (topoSan.length > 0) { score += 12; topoExplain(topoSan).forEach((t) => events.push(t)); }
      if (starInYang) score += 8;
      points.push({ age: p.age, year: yearStart, type: "天中殺開始", star, events, isTenchu: true, score });
    }

    // 3. 天中殺の終了
    if (!isTenchu && prevTenchu) {
      const events = [
        "天中殺が明け、新しいご縁やチャンスが動き出す時期",
        "準備してきたことが一気に花開きやすい、運気の再スタート時期"
      ];
      let score = 55;
      if (topoGo.length > 0) { score += 12; topoExplain(topoGo).forEach((t) => events.push(t)); }
      points.push({ age: p.age, year: yearStart, type: "天中殺終了", star, events, isTenchu: false, score });
    }

    // 4. 相性関係の大きな変化（相生→相剋など）
    if (prevP) {
      const prevEl = elements[stems.indexOf(prevP.stem)];
      const prevRel = gogyoRel[dayEl][prevEl];
      if (prevRel === "相生" && rel === "相剋") {
        const events = ["順風満帆だった運気に摩擦が生じ始める時期。守りに徹し、無理な拡大は避ける"];
        let score = 40;
        if (topoSan.length > 0) { score += 10; topoExplain(topoSan).forEach((t) => events.push(t)); }
        if (starInYang) score += 5;
        points.push({ age: p.age, year: yearStart, type: "運気の転換", star, events, isTenchu, score });
      } else if (prevRel === "相剋" && rel === "相生") {
        const events = ["困難だった運気が好転し、追い風が吹き始める時期。準備してきたことを形にするチャンス"];
        let score = 40;
        if (topoGo.length > 0) { score += 10; topoExplain(topoGo).forEach((t) => events.push(t)); }
        if (starInYang) score += 5;
        points.push({ age: p.age, year: yearStart, type: "運気の好転", star, events, isTenchu, score });
      }
    }
  });

  // スコア順にソートして上位2件のみ残す
  points.sort((a, b) => b.score - a.score);
  const top2 = points.slice(0, 2);
  // 年齢順に並び直す
  top2.sort((a, b) => a.age - b.age);
  return top2;
}

// === 年代別運勢分析 ===
// 十二大従星のライフステージ別解釈
const energyLifeInterpretation = {
  "天報星": {
    childhood: "変化変容・気分屋・多芸多才の星。周囲と違う方向に興味を持ちやすく、親の期待通りには進みにくい。何にでも浅く広く関わり器用にこなすが、30歳頃までは定職が決まりにくい。親離れが遅くふらふらしがちだが、型にはめず個性を伸ばす接し方が必要。早めに一つに絞って辛抱強く取り組めば、後の飛躍の土台になる。",
    middleAge: "人生が大きく変わる出来事が起きやすい時期。現状維持ができず、新しい分野に挑戦し続ける。短期決戦を繰り返しながら上昇するが、行き過ぎると急ブレーキがかかる。器用貧乏になりやすく、同じ職を長く続ける気力に欠けるため、30歳前後に心を決めたものがあればよそ見せず集中して継続させると運気が安定する。刺激的なことが好きで束縛を嫌うため、恋愛でもマンネリは苦手。",
    lateLife: "波乱の多い晩年。引っ越しをしたり新しい物事にチャレンジしたりと、年齢を重ねても若々しく活動の幅を広げる。これまでの型破りな経験が智恵となり、後進に道を示す役割。ただし家族を巻き込む変化を求めると摩擦が生じるため、家族への配慮を忘れずに。落ち着きを持つことで円熟味が増す。"
  },
  "天印星": {
    childhood: "かわいい・ユーモア・平穏・受け身の星。無邪気で人なつっこく、いるだけで人を明るくさせる「アイドル星」。老若男女問わず好かれ、同世代にも年上にも愛される。あわてんぼうで小さなミスは多いが、憎めない愛されキャラなので問題になりにくい。ただし赤ちゃん過ぎて自立心がないと中年期以降に愛想を尽かされるため、甘えれば解決するという常識を見直す必要がある。",
    middleAge: "大人になっても甘さがある時期。うっかりミスや怠けぐせがあるが、愛嬌で笑って許されたり不思議な引き立てにあって円満に過ごす。援助運・引き立て運が強く、自分で先陣切るよりすでにある環境を受け入れて引き継ぐことに向く。人間関係に恵まれ、仕事でもプライベートでも笑いの多い明るい生活を楽しむ。浮き沈みが少なく苦労の少ない中年期だが、遊びぐせや怠けぐせが出ないよう注意。",
    lateLife: "若者に好かれ囲まれる穏やかな晩年。子どもからも好かれる星なので、子どもや孕んとの関わりが多い環境にいると満足度が高い。安定的な運勢の持ち主で、蓄えをたっぷり持っておけば心配の少ない人生になる。これまで人に好かれて生きてきた経験が、後進の道標になる。静かな充実感を得やすい晩年。"
  },
  "天貴星": {
    childhood: "学び・品位・お洒落の星。自己本位な幼少期で、自分のしたいことや考えに自信があり、良いと思えることは忠実に守り抜く。大人の言うことには一つ一つ疑問を抱き、正しいと分かるまで言うことを聞かないため反抗的と思われることも。しかし自意識が高く周囲にどう見られているか気になるので、基本は大人しく目立たないようにする。温厚なので、正しいと思っていることに口出しされなければ平穏で楽しい青春時代を送る。純粋ゆえに傷つきやすく、人を疑うことを知らないので騙されやすい面に注意。",
    middleAge: "若々しく安定した中年期。真面目にやるべきことを全うし、自分のためになる学びを続ける。責任感があり高い地位につくこともできる。ただプライドが高く精神面にもろさがあるため、泥臭く生きることができず、受け身でいることが多い。流されたりチャンスを掴みにいけなかったりする弱点がある。恋愛では自分から積極的に行くのが苦手で、相手が好意を持っている確信がないと動けない。プライドの高さゆえスキンシップにも恥ずかしさを感じる。金銭感覚が疎くどんぶり勘定になりやすいので、信頼できる人に管理を任せるのが安全。",
    lateLife: "活力に溢れた晩年。いままで築いてきたことを活かして、若者に教え伝えることが多くなる。気持ちは若いが体力的に追いつかないともどかしさを感じたり、若者から年寄り扱いされると傷ついたりする。若者と張り合うこともあるが、得た知識を活かして尊敬されるには、心は若くても大人な態度を示すことが大切。後進を導く円熟した時期で、多くの人に慕われる存在に。"
  },
  "天恍星": {
    childhood: "奔放・タレント性・夢・恋愛の星。自立心のある初年期で、成人するまでに親元を離れることで運が開ける。実家に留まるとチャンスが巡ってこず不満を抱えた人生になる。恋に恋する理想家で、人に期待してガッカリしたり信じすぎて裏切られたときのショックが大きい。現実と理想のギャップに悩まされることが多い。引っ越しや転校など環境の変化が多く、常識に縛られない自由な発想が才能。",
    middleAge: "思春期の気分ままの中年期。開放的で自由な生活を過ごし、型にはまることを知らない。簡単に手の届く範囲には興味を示さず、海外での仕事や急な方向転換で挑む人もいる。気の向くままに動くので人生への満足度は高く楽しい生活。ただし恋愛面ではトラブルがつきもので、モテる上に気ままな恋愛を楽しむので問題が起きやすい。脱皮を繰り返しながら本質を表に出し、離郷や冒険、キャリアチェンジが起きやすい。",
    lateLife: "若々しい感性を持った晩年。年齢を重ねてもフレッシュさとときめきを忘れず、華々しい雰囲気を放つ。若者の気持ちが分かるので、経験豊富な良き理解者として若者から好かれる。恋愛面でも好かれる存在で恋人にも恵まれやすい。これまでの冒険が豊かな経験談となり、常識に縛られない生き方を後進に伝える役割。"
  },
  "天南星": {
    childhood: "推進力・反骨精神・正義感の星。大人のような意見と観点を持った子として幼年期を過ごす。批判力があり些細なことにも理由や目的を求める。白黒はっきりついていることが好きで、人も物も好きか嫌いかで分ける。言葉を選ばずはっきり物を言うので人を傷つけることも。反抗心が強く無理強いが嫌いなので大人や年上との仲は円満になりにくい。この強さを上手くいかせることが今後の飛躍につながる。",
    middleAge: "反骨精神と経験値が上手く働き、若々しくエネルギッシュな中年期。活動的でリーダーシップがあり何事にも果敢に挑戦する。猪突猛進でストレートに目標に突き進み、新プロジェクトの立役者やリーダーになることができる。ただし一度挫折すると立ち直るまでに苦労し、周囲に疎まれることも。言葉がストレートで計画が甘いところ、立ち止まって考え直さず突き進むところを過去の経験で埋められるかが重要。恋愛では好きならストレートにアプローチする追うタイプ。",
    lateLife: "肉体も精神も老いずに活動的な晩年。年齢を重ねた分だけ知識が増え視野が広がる。社会のことにも積極的に意見する。説教くさくなると若者から疎まれかねないので、いつまでも現役でバリバリ取り組むか行動で示すようにすると良い。頑固さは円熟味に変わり、若い世代の道を開く存在に。"
  },
  "天禄星": {
    childhood: "堅実・安定的・冷静・理論的の星。大抵のことには動じずどっしりと構えた幼年期。とても大人びており、きゃぴきゃぴとはしゃぐことはない。積極的に話すことはないが観察力があり、大人と同様の視点や意見を持つ。経験の積み重ねによって良さが出る星なので、幼少期にいろんな経験をしてあらゆる知識をためておくとのちのち大きな成果となる。口下手なので話術を身につけておくと社会に出たときの苦労が減る。",
    middleAge: "安心安全な方法を模索しリスクを取らない中年期。運気も安定している。温泡な人柄に鋭い観察眼、用心深い性格で周囲の信頼は厚い。新しいことに自分から果敢に挑戦するタイプではないので、サポート役に回って冷静に状況を見極められるポジションを崩さないようにすると良い。一芸に秀でる人が多く、能力を極めることでスペシャリストとして頭角を表す。恋愛では慎重派で、長い時間をかけて仲良くなってからやっと心を開く。友達付き合いからでないと恋に発展しない。金運は波が少なく積み上げで財を大きくする。",
    lateLife: "中年期の過ごし方をそのまま継続するような晩年。実りの多い晩年を過ごすには、中年期に今後一生味わいたい生活水準に持っていくことが大切。気持ちは働き盛りのままなので活動的に過ごせる。人生経験豊富で話すことに説得力があり、人からの信頼はとても厚い。的確で論理的な良い相談役として若者から慕われる。堅実に築いた基盤が支える安定した晩年。"
  },
  "天将星": {
    childhood: "王様的・精神力・創始者の星。有り余る最強のエネルギーを消化しきれず体を壊しがちな幼年期。子どものうちから強すぎるエネルギーを抱えると負担になり病気がちになりやすい。親がエネルギー消費の激しい元気な性格をしているか、成長とともにスポーツや夢に向かうことでバランスを取れる。緩い環境に身を置かず努力を強いられる環境にいることで丈夫さが出てくる。最大エネルギーゆえに精神世界に安住できず常に精神性を渇望しながら現実を生きる。自我と頑固さがどの星より強い。",
    middleAge: "強いエネルギーによって大きな成果を手にし満足度の高い生活を送る中年期。ただし若いときに苦労した人に限る。甘やかされた環境や努力を避けてきた人はエネルギーの発散方法が分からないまま傲慢になって苦労する。重い荷を背負っても平気なほどの心の広さと余裕を身につけておくと素敵な中年期に。余裕のある人はボランティア活動など社会奉仕に尽くして完全燃焼を目指すと良い。創始者の星としてゼロから作り上げることで大成できる大器晩成型。",
    lateLife: "とてもパワフルな晩年。若者よりも精力的に活動し、強いエネルギーがあるので生命力があり長生きする。長い老後をどのように過ごすのか筋道を立てておくと良い。趣味や仕事など生きがいを見つけられれば充実した人生になる。波乱の人生を総括し、次の次元へ移行する時期。自我を手放すことで真の円熟に至る。精神性の深化が晩年のテーマ。"
  },
  "天堂星": {
    childhood: "一歩下がって道を譲る自制心を持つ子ども。きらびやかなことを嫌い、年齢差のある関係で燃焼しやすい。単独行動を好む頑固さの裏に諦念。",
    middleAge: "頂点を過ぎて陰転に向かう時期。一歩引いた視点から全体を見渡し、後進に道を譲る。自制心が強みだが、諦めすぎないよう注意。",
    lateLife: "静かな自制心が円熟する時期。年齢差のある関係や無言の世界で深いつながりを築く。独りを好しつつも、深い人間関係に恵まれる。"
  },
  "天胡星": {
    childhood: "時間と場所を超越する繊細な子ども。現実を居場所にできず、自在な精神が世界を作る。希望が燃料なので、未来を閉ざさない接し方が重要。",
    middleAge: "有から無を感知し、無から新たな有を作る時期。集中力が凄まじく、精神が肉体を追い込むほど成果が出る。ただし希望を失うと絶望に沈む。",
    lateLife: "精神の世界に深く沈み込む時期。現実から離れて美へのあこがれを追求。希望を持ち続けることで、精神的な豊かさを得る晩年。"
  },
  "天極星": {
    childhood: "環境に合わせて行動も思考も変化する子ども。格差なき一次元思考で自由な思考転回ができる。環境で作られた心の持続する純粋さがある。",
    middleAge: "環境に順応しながら回帰作用で飛翔する時期。自分の想念に関係なく現実を受け入れ、その中で異次元への飛翔力を発揮する。",
    lateLife: "環境に合わせて生きてきた人生を振り返る時期。自由な思考転回が円熟となり、どのような環境でも適応する柔軟さが深まる。"
  },
  "天庫星": {
    childhood: "単一志向に突き進む子ども。連結のない一筋の探究心を持ち、自分で決めた道なら地獄でも行く自然な頑固さがある。",
    middleAge: "異次元の世界を進む時期。現実を持たず、一筋の探究心で突き進む。中庸力とバランス感覚で不自然・不合理を感知する能力が強み。",
    lateLife: "一筋の探究心が結実する時期。現実から精神を学び取る術に優れ、自分で決めた道を貫いた成果が現れる。頑固さが円熟した信念に変わる。"
  },
  "天馳星": {
    childhood: "点的今の連続で生きる子ども。成功も失敗も固執しない。外動内静で、動くほど精神は安定する。一つに集中すると持続力に限界がある。",
    middleAge: "分裂・分離の本性で多方面を並行する時期。一つに集中せず、多方面を同時に進めることで成果が出る。動くほど精神は安定する。",
    lateLife: "霊魂が宇宙空間に帰るような境地に至る時期。成功も失敗も固執せず、静かな精神を保ちながら肉体は動き続ける。穏やかで自由な晩年。"
  }
};

function analyzeLifeStageFortune(day, pillars, taiun, tenchusatsu, currentAge) {
  const dayEl = elements[stems.indexOf(day.stem)];
  const gogyoRel = { 木: { 木: "比和", 火: "相生", 土: "相剋", 金: "反剋", 水: "相生" }, 火: { 木: "相生", 火: "比和", 土: "相生", 金: "相剋", 水: "反剋" }, 土: { 木: "反剋", 火: "相生", 土: "比和", 金: "相生", 水: "相剋" }, 金: { 木: "相剋", 火: "反剋", 金: "比和", 土: "相生", 水: "相生" }, 水: { 木: "相生", 火: "相剋", 土: "反剋", 金: "相生", 水: "比和" } };

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
      const rel = gogyoRel[dayEl][taiunEl];
      const isTenchu = isTenchusatsuYear(p.branch, tenchusatsu);
      const topoResults = analyzeBranchTopology(p.branch, pillars);

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

  // 十大主星（中星）の仕事適性ベース点
  const starWorkBase = {
    "貫索星": 8, "石門星": 6, "鳳閣星": 4, "調舒星": 5,
    "禄存星": 6, "司禄星": 7, "車騎星": 7, "牽牛星": 8,
    "龍高星": 5, "玉堂星": 7
  };
  const centerPt = starWorkBase[center] || 0;
  score += centerPt;
  if (centerPt) breakdown.push(`中星「${center}」+${centerPt}`);

  // 北星・南星の仕事適性
  const subStarWorkBase = {
    "貫索星": 5, "石門星": 6, "鳳閣星": 3, "調舒星": 3,
    "禄存星": 5, "司禄星": 6, "車騎星": 6, "牽牛星": 7,
    "龍高星": 4, "玉堂星": 6
  };
  const northPt = subStarWorkBase[northStar] || 0;
  const southPt = subStarWorkBase[southStar] || 0;
  score += Math.round((northPt + southPt) * 0.5);
  if (northPt) breakdown.push(`北星「${northStar}」+${Math.round(northPt * 0.5)}`);
  if (southPt) breakdown.push(`南星「${southStar}」+${Math.round(southPt * 0.5)}`);

  // 十二大従星の仕事エネルギー
  const energyWorkBonus = {
    "天貴星": 6, "天南星": 5, "天禄星": 7, "天将星": 8, "天堂星": 4,
    "天印星": 3, "天報星": 2, "天胡星": 1, "天極星": 2, "天馳星": 3,
    "天庫星": 5, "天恍星": 4
  };
  let energyPt = 0;
  energy.forEach((e) => {
    const bonus = energyWorkBonus[e.name] || 0;
    const weighted = Math.round(bonus * (e.score / 10));
    energyPt += weighted;
  });
  energyPt = Math.round(energyPt / energy.length * 2);
  score += energyPt;
  if (energyPt) breakdown.push(`十二大従星+${energyPt}`);

  // 五行バランス（土・金は仕事に強い、木・火はやや強い、水はやや弱い）
  const gogyoWorkBonus = { "木": 3, "火": 2, "土": 5, "金": 4, "水": 1 };
  const sortedGogyo = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const strongEl = sortedGogyo[0][0];
  const gogyoPt = gogyoWorkBonus[strongEl] || 0;
  score += gogyoPt;
  if (gogyoPt) breakdown.push(`性質${strongEl}+${gogyoPt}`);

  // 五行バランスの良さ（偏りが少ないほど仕事は安定）
  const gogyoValues = Object.values(counts);
  const gogyoMax = Math.max(...gogyoValues);
  const gogyoMin = Math.min(...gogyoValues);
  const balance = gogyoMax - gogyoMin;
  if (balance <= 1) { score += 5; breakdown.push("バランス良好+5"); }
  else if (balance <= 2) { score += 2; breakdown.push("バランスやや良好+2"); }
  else if (balance >= 4) { score -= 3; breakdown.push("偏り大-3"); }

  // 日干の仕事力
  const dayStemWorkBonus = {
    "甲": 5, "乙": 3, "丙": 4, "丁": 3, "戊": 5,
    "己": 4, "庚": 6, "辛": 4, "壬": 4, "癸": 2
  };
  const dayPt = dayStemWorkBonus[pillars.day.stem] || 0;
  score += dayPt;
  if (dayPt) breakdown.push(`日干${pillars.day.stem}+${dayPt}`);

  // 正規化: 生スコアを0-100スケールに変換
  // 実用的な範囲は約50-95（ベース50 + 各種加点）
  const RAW_MIN_W = 50;
  const RAW_MAX_W = 95;
  score = Math.max(5, Math.min(100, Math.round(((score - RAW_MIN_W) / (RAW_MAX_W - RAW_MIN_W)) * 100)));

  // 評価ランク: S約10%, A約20%, B約40%, C+D+E約30%の分布を目標
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

function buildReading(name, pillars, mainStars, energy, counts, tenchusatsu, seimei) {
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
        imbalanced: "一途だが内面の偏りが独占欲を極限化し、束縛がエスカレートして相手を窒息させやすい。"
      },
      money: {
        balanced: "自分の道に投資する。内面のバランスが金銭感覚に冷静さを与え、無駄なく賢く管理できる。",
        moderate: "自分の道に投資する。趣味や専門分野には惜しみないが、それ以外は倹約家。金銭管理は自分で握りたがる。",
        imbalanced: "内面の偏りが金銭への執着を強め、自分の道以外には極端な倹約家になり、金銭管理の主導権を絶対に手放さない。"
      },
      marriage: {
        balanced: "結婚は「自分の城」を築くこと。内面のバランスがパートナーの自立も認めつつ、お互いの領域を尊重できる。",
        moderate: "結婚は「自分の城」を築くこと。パートナーに自立を求めるが、自分のペースを守らせようとして摩擦が出る。",
        imbalanced: "結婚は「自分の城」を築くこと。内面の偏りが支配欲を強め、パートナーを自分のペースに強制して摩擦が深刻化しやすい。"
      },
      social: {
        balanced: "基本的に一人を好むが、内面のバランスが適度な社交性も与え、必要な人脈を最小限かつ深く築ける。",
        moderate: "基本的に一人を好む。必要な人脈は最小限に絞り、深い関係を少数と築く。大人数の集まりでは疲れ、早く帰りたくなる。自分の領域に入り込まれると不快感を示す。",
        imbalanced: "内面の偏りが対人関係を極端に狭め、誰も領域に入れず完全に孤立する傾向が強まる。集まりでは不快感を隠さない。"
      },
      byDayStem: {
        "甲": "木性の貫索星：成長と向上の自我。自分の道を真っ直ぐに伸ばし、信念を曲げない。上に立つ自我で、自分のやり方を押し通す。",
        "乙": "木性の貫索星：柔軟だが根強い自我。周囲に合わせつつも自分の芯は曲げない。草のように見た目は柔らかいが、引き抜くのが難しい根を持つ。",
        "丙": "火性の貫索星（混沌の自我）：自然のうちに明るいムードの中で自我が表出する。「柔らかいが強引」というニュアンス。対「個人」よりも大勢の人達を相手にして発揮する力。方向性のない自我だが、こだわることそのことが貫索星の働きになる。秩序ある社会からははみ出す傾向。",
        "丁": "火性の貫索星（混沌の自我）：孤独を感じさせる自我で、人に理解されることが少ない。人の言葉を受け入れない独善性を持つ。1対多数よりも1対1（少数）で発揮される自我。小さい個人的世界を作り、長い時間をかけて自分のこだわりを形にする。",
        "戊": "土性の貫索星（領域確立の自我）：山の自我は不動。自分から動く自己主張にはならず、受け身の自我で穏やかに悠然と構える。人によって動かされることはなく、日々はたんたんとマイペース。攻撃に対しては悠然と反撃に転じる。温厚に見えるが中に入ると強い自我がある。目的に向かう時は単独性だが、目的外では石門的社交性を発揮する合理的・理性的な姿。",
        "己": "土性の貫索星（領域確立の自我）：平均的庶民的な自我。それほど強い自己主張は生まれないが、自分が信じるもの、こだわるものへの思い入れは強く、「かくあるべし」という信条に近いものを貫く頑固さがある。目的外のことに関しては自我がなく、無形連帯の社交性を発揮する。",
        "庚": "金性の貫索星（建設と破壊の自我）：いつ如何なる時と所であっても自分は自分という姿を持ち、主張を押し出し態度にも現わす。剛であり、言葉も鋭く冷徹。攻撃的な衣をまとった自我で、ある種のさわやかさを感じさせるが、その自我を押さえようとすれば押さえる方が傷つくほどの強さを持つ。既存空間を変形させ、流れや秩序を改革する役割。荒っぽく波乱動乱を本性とする。",
        "辛": "金性の貫索星（建設と破壊の自我）：自我が美意識をまとい、言葉も態度も柔らかく気品を持つが、大いに自我を押し出してくる。その美意識は自分なりの大義名分を旗印にしているので、揺るぎない自己主張になる。小人が持てば身勝手、わがままになる。既存の秩序を美しく変革する力がある。",
        "壬": "水性の貫索星（裏に隠れる自我）：海の水の如く流動的な自我。相手が弱ければ強く発し、強ければ弱く発する。水が高いところから低いところへ流れるように、自我を使い分ける。ある意味では自分をよくわかっている自我。貫索星としての自我力は最弱で、強い自己主張はなく表からは自我がないようにも見える。不言実行型。有形にすることで満たされる自我。",
        "癸": "水性の貫索星（裏に隠れる自我）：やや陰気な状態で現われ、表出の仕方も湿気を含んでいる。貫索星らしい単独の自己主張は表からは見えず、他の性格の裏側に隠れる。人の意見を借りて自己表現するような形。単独の自己主張力は弱いが、無→有→無→有を繰り返しながら現実を形作る。"
      },
      hidden: {
        balanced: "実は一人でいる時が一番安心。内面のバランスがその寂しさを程よく中和し、人との関わりも苦痛なく受け入れられる。",
        moderate: "実は一人でいる時が一番安心。人に頼ることを恥と思いがち。",
        imbalanced: "実は一人でいる時が一番安心。内面の偏りが人への不信を深め、完全に殻に閉じこもる傾向が強まる。"
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
        imbalanced: "内面の偏りが交際費の浪費をエスカレートさせ、金銭の貸し借りで致命的なトラブルを起こしやすい。"
      },
      marriage: {
        balanced: "結婚は「二人のコミュニティ」。内面のバランスが家族の和と個人の自由を両立させ、程よい距離感を保てる。",
        moderate: "結婚は「二人のコミュニティ」。家族の和を重んじるが、パートナーの交友関係に干渉しすぎると息苦しくなる。",
        imbalanced: "内面の偏りが干渉を過剰にし、パートナーの交友関係にまで口を出して関係を息苦しくさせる。"
      },
      social: {
        balanced: "社交性は最高クラス。内面のバランスが本音を出せる相手を見極め、表面上の社交と内面の孤独のバランスを取る。",
        moderate: "社交性は最高クラス。誰とでも打ち解け、場を盛り上げる。ただし全員に良い顔をして本音を出せないため、表面上は社交的だが内面は孤独。善悪、清濂という境界線を持たない。",
        imbalanced: "内面の偏りが社交の表面化を極限にし、本音を出せる相手がいなくなり、表面上は誰とでも仲良しだが内面は完全に孤独。"
      },
      byDayStem: {
        "甲": "木性の石門星：成長の和合性。自分が伸びる過程で自然に人脈が広がる。信念を持って人を集めるが、自分の成長が止まると和合も弱まる。",
        "乙": "木性の石門星：柔軟な和合性。草が広がるように、環境に合わせて人脈を広げる。誰とでも合わせられるが、自分の根が浅いと流されやすい。",
        "丙": "火性の石門星（混沌の和合）：混乱した状況の中でもっとも威力を発揮する和合精神。環境が混乱や過渡期を迎える時に出番が来る。形のないものを有形にする働き、人々が注目する何かを作り出す力がある。ただし有形にしたものを導く力はなく、リーダーシップを発揮すると道を外れる。新しい芽を作り出す力、未完の美の中に喜びを感じる。時に周囲に犠牲や忍耐を強いることもある。善悪、清濂という価値基準を持たず、どんな人でも受け入れる発想の大きさを持つ。",
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
        imbalanced: "自然体だが内面の偏りが感情の波を激化させ、明るさと虚無感の落差が極端になる。表現は鋭くなるが安定感に欠ける。"
      },
      bad: {
        balanced: "危機感が薄い傾向はあるが、内面のバランスが最低限の責任感を保ち、怠慢に見られにくい。",
        moderate: "危機感が薄く、締め切りや責任を軽視する。怠慢に見られ、信用を落とす。楽な方に逃げる癖がある。",
        imbalanced: "内面の偏りが危機感の欠如を極限化し、締め切りや責任を完全に無視して信用を失墜しやすい。"
      },
      work: {
        balanced: "クリエイティブな仕事で光る。内面のバランスが締め切り管理の意識も与え、才能と責任を両立できる。",
        moderate: "クリエイティブな仕事で光るが、締め切り管理と責任を持たないと信用失墜。",
        imbalanced: "内面の偏りがクリエイティブ面の不安定さを増幅し、締め切りや責任を完全に放置して信用を失いやすい。"
      },
      love: {
        balanced: "楽しい関係を好む。内面のバランスが安定も受け入れられ、マンネリや責任から逃げずに関係を育める。",
        moderate: "楽しい関係を好むが、マンネリや責任から逃げたくなる。安定を求められると重く感じる。",
        imbalanced: "内面の偏りが責任からの逃避を常態化させ、楽しい時だけ付き合い、安定を求められるとすぐに離れたくなる。"
      },
      money: {
        balanced: "お金は「楽しむためのもの」。内面のバランスが支出のメリハリをつけ、貯金も無理なくできる。",
        moderate: "お金は「楽しむためのもの」。趣味や体験にお金をかけるが、貯金意識が薄い。気づいたら使っているタイプ。",
        imbalanced: "内面の偏りが浪費をエスカレートさせ、貯金意識が皆無で気づいたら金がないという状態に陥りやすい。"
      },
      marriage: {
        balanced: "結婚に「楽しさ」を求める。内面のバランスが日常の喜びと現実の責任を両立させ、バランスの取れた家庭を築ける。",
        moderate: "結婚に「楽しさ」を求める。日常の喜びを重視するが、現実的な責任分担から逃げたくなる時がある。",
        imbalanced: "内面の偏りが責任分担から常に逃げたがり、結婚を「楽しいだけ」のものと勘違いして家庭が崩れやすい。"
      },
      social: {
        balanced: "雰囲気で人をリラックスさせる社交タイプ。内面のバランスが深い関係も恐れず、表面的な関わりに留まらない。",
        moderate: "雰囲気で人をリラックスさせる社交タイプ。初対面でも自然に打ち解ける。ただし深い関係になるのを避け、表面的な関係を保つ癖がある。",
        imbalanced: "内面の偏りが表面的な関係しか築けない傾向を強め、誰とでも打ち解けるが誰とも深く繋がれない。"
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
        imbalanced: "内面の偏りが被害者意識を極限化し、世界中が自分を理解していないと感じて完全に孤立し、刺々しい態度で誰も寄せ付けなくなる。"
      },
      work: {
        balanced: "専門スキルや感性を活かす仕事で独自のポジションを確保。内面のバランスがチームとの摩擦も和らげる。",
        moderate: "専門スキルや感性を活かす仕事で独自のポジションを確保できるが、チーム摩擦に注意。",
        imbalanced: "内面の偏りがチームとの摩擦を頻発させ、独自の才能はあるが組織に馴染めず孤立しやすい。"
      },
      love: {
        balanced: "理想が高く、精神的なつながりを求める。内面のバランスが現実とのバランスを取り、裏切りにも回復力を持てる。",
        moderate: "理想が高く、精神的なつながりを求める。裏切られると深く傷つき、报复心を持つ。",
        imbalanced: "内面の偏りが理想を極限化し、現実のパートナーに必ず失望し、裏切りに対する报复心が異常に強くなる。"
      },
      money: {
        balanced: "美しさやこだわりにお金をかける。内面のバランスが金銭感覚に程よい冷静さを与え、質と家計のバランスを取れる。",
        moderate: "美しさやこだわりにお金をかける。ブランドや質にこだわって出費が膨らむ。金銭感覚は感情的で波がある。",
        imbalanced: "内面の偏りが感情的な出費をエスカレートさせ、美しさへの執着で金銭感覚が崩壊しやすい。"
      },
      marriage: {
        balanced: "結婚に「精神的な一体感」を求める。内面のバランスが理想と現実のギャップを埋め、パートナーの欠点も受け入れられる。",
        moderate: "結婚に「精神的な一体感」を求める。理想が高すぎて現実のパートナーに失望しやすい。裏切りは許せない。",
        imbalanced: "内面の偏りが理想を極限化し、現実のパートナーに必ず失望し、裏切りを絶対に許せないて関係が破綻しやすい。"
      },
      social: {
        balanced: "社交性は低いが、内面のバランスが少数の理解者との深い繋がりを可能にし、質の高い人間関係を築ける。",
        moderate: "社交性は低い。人付き合いにエネルギーを消費し、すぐに疲れる。少数の理解者とだけ深く繋がりたい。集団の中では壁を作り、刺々しい態度で人を遠ざける。",
        imbalanced: "内面の偏りが対人関係を極限に狭め、集団の中では常に壁を作り、刺々しい態度で誰も寄せ付けず完全に孤立する。"
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
        moderate: "承認欲求で尽くし、見返りを求める。依存しすぎて相手を重くし、搾取される。自分がない。ずっと与え続けると疲弊してしまう。",
        imbalanced: "内面の偏りが承認欲求を極限化し、見返りを求めて尽くし続け、搾取されるまでやめてしまえない依存状態に陥る。"
      },
      work: {
        balanced: "指導・教育・サポート役で信頼を集める。内面のバランスが自分の仕事とのバランスを取り、疲弊を防げる。",
        moderate: "指導・教育・サポート役で信頼を集めるが、自分の仕事がおろそかになる。",
        imbalanced: "内面の偏りが他人への奉仕に没頭させ、自分の仕事が完全におろそかになって評価されにくい。"
      },
      love: {
        balanced: "惜しみない愛情を注ぐ。内面のバランスが見返りを期待する心を抑え、純粋な愛情として相手に届く。",
        moderate: "惜しみない愛情を注ぐが、尽くしすぎて「重い」と距離を置かれる。見返りを期待してしまう。愛情は行為としての愛情で、精神性はない。",
        imbalanced: "内面の偏りが愛情の重さを極限化し、尽くしすぎて相手を窒息させ、見返りがないと怨恨に変わる。"
      },
      money: {
        balanced: "人にお金を使う。内面のバランスが支出の判断力を与え、人脈を本当に財産に変えられる。",
        moderate: "人にお金を使う。プレゼントや奢りで関係を築くが、見返りを期待して損をする。貸したお金は戻りにくい。回転財——回転を続けることで引力を増す。",
        imbalanced: "内面の偏りが人への出費をエスカレートさせ、見返りを期待して貸したお金が戻らず、金銭的に搾取されやすい。"
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
        "辛": "金性の禄存星（権力の愛情）：環境に応じて愛情の出方が変わる。自分が意識してコントロールするわけではなく、その時々の回りの状況に対応して変化する受身の愛情。主体は自分ではなく相手側。時に愛情がない人のような評価も受けるが、愛情の中心が変化することはなく現わし方が変化するだけ。古風な女性的愛情であり奉仕。権力思考と自己顕示欲が前面に出るが、辛の柔軟性で状況に適応する。",
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
        imbalanced: "堅実さはあるが内面の偏りが変化への恐怖を極限化し、現状維持に執着して成長が完全に止まる。"
      },
      bad: {
        balanced: "変化を恐れる傾向はあるが、内面のバランスが柔軟性を保ち、安全策に逃げずに挑戦もできる。",
        moderate: "変化を恐れ、新しい挑戦を避ける。安全策に逃げて成長が止まる。ルーティンに固執する。自己中心的な所有欲を含む。",
        imbalanced: "内面の偏りが変化への恐怖を極限化し、ルーティンに完全に固執し、新しい挑戦を一切拒絶して成長が止まる。"
      },
      work: {
        balanced: "堅実な仕事ぶりで評価される。内面のバランスが新しいプロジェクトにも柔軟に対応できる力を与える。",
        moderate: "堅実な仕事ぶりで評価されるが、変化に弱く新しいプロジェクトに対応できない。",
        imbalanced: "内面の偏りが変化への対応力を奪い、新しいプロジェクトや環境変化に完全についていけなくなる。"
      },
      love: {
        balanced: "安定した関係を築く。内面のバランスがマンネリを防ぐ柔軟性を与え、相手の成長にもついていける。",
        moderate: "安定した関係を築くが、変化を恐れてマンネリになる。相手の成長についていけない。",
        imbalanced: "内面の偏りがマンネリを固定化し、相手の成長についていけず関係が完全に停滞する。"
      },
      money: {
        balanced: "貯金と蓄財が得意。内面のバランスが投資チャンスも見極め、守ることと増やすことのバランスを取れる。",
        moderate: "貯金と蓄財が得意。無駄遣いを嫌い、コツコツ貯める。しかし守ることに固執して投資チャンスを逃す。",
        imbalanced: "内面の偏りが蓄財への執着を極限化し、無駄遣いを極端に嫌い投資チャンスを全て逃して成長しない。"
      },
      marriage: {
        balanced: "結婚は「安心の土台を築くこと」。内面のバランスが安定と変化のバランスを取り、硬直化を防げる。",
        moderate: "結婚は「安心の土台を築くこと」。安定した家庭を築くが、変化を恐れて関係が硬直化しやすい。",
        imbalanced: "内面の偏りが関係の硬直化を固定化し、変化を恐れて家庭が完全に停滞しやすくなる。"
      },
      social: {
        balanced: "社交性は控えめだが、内面のバランスが新しい人間関係にも適度に対応でき、圈子を徐々に広げられる。",
        moderate: "社交性は控えめ。決まった圈子の中では安定した関係を築くが、新しい人間関係には消極的。付き合いは堅実で無駄がない。",
        imbalanced: "内面の偏りが新しい人間関係を完全に拒絶し、決まった圈子の外には一切出ず人脈が狭くなる。"
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
        imbalanced: "内面の偏りが短気を極限化し、キレやすく勢いで人間関係を次々と壊し、休息のない人生になりやすい。"
      },
      work: {
        balanced: "営業や新規開拓で成果を出す。内面のバランスがチームの信頼も損なわず、単独と協調のバランスを取れる。",
        moderate: "営業や新規開拓で成果を出すが、独断専行でチームの信頼を損なう。",
        imbalanced: "内面の偏りが独断専行を常態化させ、チームの信頼を完全に失い孤立する。"
      },
      love: {
        balanced: "情熱的にアプローチする。内面のバランスが嫉妬を抑え、冷却しても急に冷めない安定感を与える。",
        moderate: "情熱的にアプローチするが、嫉妬深く、勢いで相手を傷つける。冷却すると急に冷める。",
        imbalanced: "内面の偏りが嫉妬を極限化し、勢いで相手を傷つけ、冷めると完全に無関心になる極端な恋愛になる。"
      },
      money: {
        balanced: "勝負にお金をかける。内面のバランスが投資判断に冷静さを与え、ギャンブル的な出費を抑えられる。",
        moderate: "勝負にお金をかける。投資やギャンブル的な出費に注意。勢いで買って後悔することも多い。",
        imbalanced: "内面の偏りがギャンブル的な出費をエスカレートさせ、勢いで買って後悔するパターンが常態化する。"
      },
      marriage: {
        balanced: "結婚も「勝負」。内面のバランスが情熱と安定のバランスを取り、パートナーを尊重できる。",
        moderate: "結婚も「勝負」。情熱で突っ走るが、冷めると急に冷める。パートナーを支配しようとする傾向。",
        imbalanced: "内面の偏りが支配欲を極限化し、情熱で突っ走った後急に冷め、パートナーを支配しようとして関係が破綻しやすい。"
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
        imbalanced: "責任感は強いが内面の偏りが面目への執着を強め、見栄と実力の乖離が致命的になりやすい。"
      },
      bad: {
        balanced: "見栄で動く傾向はあるが、内面のバランスが本質を見失わない目を保ち、体面と中身のバランスを取れる。",
        moderate: "見栄で動き、本質を見失う。プライドが高すぎて素直になれない。体面を守るために無理をする。見栄っ張りな面が強調されると、周囲と衝突しやすい。",
        imbalanced: "内面の偏りが見栄を極限化し、体面を守るために無理を続け、本質を完全に見失って周囲と衝突する。"
      },
      work: {
        balanced: "責任あるポジションで評価される。内面のバランスが面子と実質を両立させ、真のリーダーとして機能する。",
        moderate: "責任あるポジションで評価されるが、面子にこだわって実質を疎かにする。",
        imbalanced: "内面の偏りが面子へのこだわりを極限化し、実質を完全に疎かにして評価を失う。"
      },
      love: {
        balanced: "品のある態度で信頼を勝ち取る。内面のバランスがプライドを適度に保ち、素直になれる瞬間も作れる。",
        moderate: "品のある態度で信頼を勝ち取るが、プライドが邪魔して素直になれずすれ違う。",
        imbalanced: "内面の偏りがプライドを極限化し、素直になれずすれ違いが深刻化して関係が破綻しやすい。"
      },
      money: {
        balanced: "ブランドや見栄にお金をかける。内面のバランスが身の丈に合った支出を保ち、品格と家計のバランスを取れる。",
        moderate: "ブランドや見栄にお金をかける。身の丈に合わない出費をしてプライドを保とうとする。金銭管理は見栄っぱり。",
        imbalanced: "内面の偏りが見栄による出費をエスカレートさせ、身の丈に合わない出費で金銭的に破綻しやすい。"
      },
      marriage: {
        balanced: "結婚は「身分に見合った関係」。内面のバランスが体裁と本音のバランスを取り、家庭の体面と実質を両立できる。",
        moderate: "結婚は「身分に見合った関係」。体裁を重んじ、家庭の体面を気にする。プライドが邪魔して本音で向き合えない。",
        imbalanced: "内面の偏りが体裁への執着を極限化し、家庭の体面ばかり気にして本音で向き合えず、関係が空虚になる。"
      },
      social: {
        balanced: "社交性は品格がある。内面のバランスが本音を出せる相手を見極め、計算高さと誠実さのバランスを取れる。",
        moderate: "社交性は品格があるが、本音を出さない。立場に見合った振る舞いを心がけ、誰からも「好ましい」と思われるように振る舞う。しかし腹の中は計算高い。",
        imbalanced: "内面の偏りが計算高さを極限化し、誰にでも良い顔をするが本音を一切出さず、表面的な品格しか残らない。"
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
        "癸": "水性の牽牛星（隠れた名声）：外側に開示される自尊心ではなく自分の心（内面）で強く意識する。地位や役割に比例して自意識過剰傾向。柔軟性に欠け、自尊心を傷つけられる相手を極端に嫌う。自分の大変さや苦しみを他人に見せまいとするやせ我慢的な牽牛星。「皇帝の自尊心」と呼ばれ、内面を秘す感覚を所有。水性の知性が表に出て牽牛星の闘争部分は隠れ、他人の名誉名声を望む傾向。創造・芸術等の世界が居場所にも。"
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
        imbalanced: "内面の偏りが飽きっぽさを極限化し、何も継続できず信用を完全に失い、束縛を嫌うあまり全ての関係を壊す。"
      },
      work: {
        balanced: "新規事業や改革で力を発揮する。内面のバランスが継続性を与え、プロジェクトを最後まで遂行できる。",
        moderate: "新規事業や改革で力を発揮するが、継続性がなくプロジェクトを中途半端にする。",
        imbalanced: "内面の偏りが継続性を完全に欠き、プロジェクトを常に中途半端に放り出して信用を失う。"
      },
      love: {
        balanced: "刺激的な恋愛を好む。内面のバランスが関係が落ち着いても逃げず、深い絆を築ける。",
        moderate: "刺激的な恋愛を好むが、関係が落ち着くと逃げたくなる。束縛を最も嫌う。",
        imbalanced: "内面の偏りが刺激への依存を極限化し、関係が落ち着くと即座に逃げ出し、束縛されると暴れて関係を壊す。"
      },
      money: {
        balanced: "新しいことに投資する。内面のバランスが衝動買いを抑え、投資を継続して成果を出せる。",
        moderate: "新しいことに投資するが、飽きて放置する。金銭管理はルーズで、衝動買いが多い。",
        imbalanced: "内面の偏りが衝動買いをエスカレートさせ、金銭管理が完全にルーズで投資も全て放置する。"
      },
      marriage: {
        balanced: "結婚に「自由と刺激」を求める。内面のバランスが日常の繰り返しにも耐え、自由と安定を両立できる。",
        moderate: "結婚に「自由と刺激」を求める。日常の繰り返しに飽きて浮気や離婚のリスクが高い。束縛されると即座に関係を壊す。",
        imbalanced: "内面の偏りが日常への耐性を奪い、浮気や離婚のリスクが極限に高く、束縛されると即座に関係を破壊する。"
      },
      social: {
        balanced: "社交性は面白い人を探すタイプ。内面のバランスが広い人脈の中に深い関係も作り、落としどころを見つける。",
        moderate: "社交性は面白い人を探すタイプ。型破りな人や刺激的な環境に惹かれるが、関係が落ち着くとすぐに次を探す。人脈は広いが浅い。",
        imbalanced: "内面の偏りが人脈の浅さを固定化し、常に次の刺激を求めて関係を渡り歩き、誰とも深く繋がれない。"
      },
      byDayStem: {
        "甲": "木性の龍高星（探究の創造）：放浪的要素が少なく忍耐力が強い。行動範囲を狭くする反面創造性を強くする。既存を既存として受け止めず「なぜ」という疑問から始まり別の何かを模索。観察力は多面におよび新しい改良の創造が生まれる。最大稼動すると通常変人に見えるが新しい世界・事物を生み出す欠かせない存在。物事を知りたい欲求を深く掘り下げ、広がりよりも探究心が強く現れる。研究・創造の能力。自力本願で人に頼ることを嫌う。",
        "乙": "木性の龍高星（探究の創造）：放浪的要素が少なく忍耐力が強い。裏・陰がキーワードで人生の裏街道的なところで発揮される知力。人の裏面を観察する力があり、交渉事やものごとの対応策（改革性）が得手。根幹の改革にはつながらないエネルギーで、名補佐役・参謀役のエネルギーとなる。既存に対して常に改革的意識で見る本性を持ち、なぜという疑問からくる探求心と改良の精神を持つ。",
        "丙": "火性の龍高星（混沌の探究）：混沌とした火性と探究する龍高星は一致点が多い。未知の世界への興味・好奇心が旺盛で不安に対しては強い忍耐力を発揮。方向の定まらない環境ではがぜん力を発揮するが、その場その場の働きで連続や継続がなく瞬間芸。一種のアイデア的素要で単発性が特徴。芸術性・創造性も小さい作品作りという限られた範疇。現代芸術など「今」を冠とした創造の世界で活躍期待。心に広大な夢が広がり国境が意味を成さない星。自分が知りたいことを素直に行動し、アプローチに多様性が生まれ動くこと改革することが多岐にわたる。一芸は万芸に通じ、行動することで博識になる。",
        "丁": "火性の龍高星（混沌の探究）：混沌とした火性と探究の一致で好奇心旺盛。「知」を求めるのにストレートではなく遠回りし時間を必要とする。時間をかけた分知力は広く深くなり広がりのある想像力となる。地味な忍耐強さも発揮。忍耐と芸術創造の龍高星と呼ばれる。自分を取り巻く環境を上手に利用して事をなす柔軟性があり、その中で放浪・改革が成し遂げられる。瞬間芸的だが深い知力を持つ。",
        "戊": "土性の龍高星（沈潜の探究）：土性の領域が龍高星の動きを狭め放浪性を小さくする。忍耐力や耐久力は最大限に強くなる。自由が消えて忍耐となり、エネルギーは横へ広がるのではなく深く地中へ沈み込む。窮屈になったエネルギーが蓄積され、一定期間後に爆発する。深い探求力・研究心は専門分野で優れた知力。創造された作品や作家としての自分が幅広い引力を生み多くの人の心を引きつける。奥深く潜る性質で外からは心が読みにくく、事があると深く隠れる。反既存の本質を持ちつつ視野が広くこだわりが強くならず、趣味的な感覚で探究心が起こる。学問よりも生活の知恵で、別世界の知恵を導入する改革。",
        "己": "土性の龍高星（沈潜の探究）：放浪性と改革性が精神世界において発揮される。精神の次元の高さによって能力が変わり、高ければ新しい世界を創造する人・時代と社会の先駆者的存在、低ければ不安定な精神状態で人生の浮浪人となる。自由な活動力は影を潜めて忍耐力が強く、エネルギーは地中へ沈み込む。蓄積後の爆発特性。奥深く潜る性質で深い探求力・研究心を持つ。",
        "庚": "金性の龍高星（激する探究）：忍耐力にはならず、平穏で動きの少ない世界にいると爆発的な現象が起こる。自己の想いと心の中身が行動として常に表れる。放浪性は冒険に近く、突発的に外国へ行ったり旅に出たりして創造のヒントを得て発明・発見など新しい分野を開拓。激する知性は視野を小さくし優れた集中力やこだわる力となって研究・発明・発見につながるが、内面の激しさが変人・奇人の人格を構成する可能性。自分の世界に入り込む思考で周囲を全く気にせず自己のペースで改革も探究も行い時に自分勝手。自己表現は少なく忍耐力は強く規制を嫌い自分の世界を生きる。",
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
        moderate: "理屈で逃げ、行動が伴わない。現場感覚が育たず、頭でっかちになる。人を見下す癖がある。人生をいそぎ過ぎると小手先の知識となり心がともなわない口先人生となる。",
        imbalanced: "内面の偏りが理屈への逃避を極限化し、現場感覚が皆無で人を見下す癖が強まり、完全に頭でっかちになる。"
      },
      work: {
        balanced: "知識と資格で評価される。内面のバランスが実行力も与え、現場から浮かずに活躍できる。",
        moderate: "知識と資格で評価されるが、理屈ばかりで現場から浮く。実行力が不足する。",
        imbalanced: "内面の偏りが実行力を完全に欠き、理屈ばかりで現場から完全に浮いて評価されにくい。"
      },
      love: {
        balanced: "知的な会話で関係を深める。内面のバランスが考えすぎを抑え、適切なタイミングで行動できる。",
        moderate: "知的な会話で関係を深めるが、考えすぎて行動が遅く、チャンスを逃す。",
        imbalanced: "内面の偏りが考えすぎを極限化し、行動が常に遅くチャンスを全て逃す。"
      },
      money: {
        balanced: "教育や資格にお金をかける。内面のバランスが投資に実行力を与え、知識を現実の成果に変えられる。",
        moderate: "教育や資格にお金をかける。投資は理論派だが、実際の行動が伴わないことが多い。知識にお金を払うタイプ。",
        imbalanced: "内面の偏りが知識への投資をエスカレートさせるが行動が伴わず、知識だけ溜まって現実の成果に結びつかない。"
      },
      marriage: {
        balanced: "結婚は「知的なパートナーシップ」。内面のバランスが理屈と感情のバランスを取り、本音で向き合える。",
        moderate: "結婚は「知的なパートナーシップ」。教養や価値観の合致を重視するが、理屈で感情を否定してすれ違う。",
        imbalanced: "内面の偏りが理屈で感情を完全に否定し、パートナーとのすれ違いが深刻化して関係が冷え込む。"
      },
      social: {
        balanced: "社交性は知的な会話ができる相手に限定される。内面のバランスが幅広い人との対話も可能にし、理屈で人を遠ざけない。",
        moderate: "社交性は知的な会話ができる相手に限定される。教養のない人や無意味な雑談を嫌う。集団では理屈をこねて人を遠ざけ、孤立することがある。",
        imbalanced: "内面の偏りが知的な会話以外を完全に拒絶し、理屈をこねて人を遠ざけ完全に孤立する。"
      },
      byDayStem: {
        "甲": "木性の玉堂星（正統の学問）：玉堂星の標準型で正統な学問のエネルギー。伝統・古典に支えられているものを好む。創造性より「学ぶこと」に心をひかれる。教育の要素が強く、始まりは自分流でも最終的には正統な道に至る。情の部分がかなり含まれ庶民性を持つが社会性には欠ける。「生涯学生」と呼ばれ、いくつになっても習得しようとする意欲は衰えず晩年に至って学業は一つの形を成す。長い時間をかけ浸透する水のような知恵で年齢とともに大きくなる。知恵の確立に時間がかかり、人生の出発では知恵なき人のように見られる。現実界では生かし難い知恵で知恵のみが独立する。学問・芸術に最も良さを発揮するが、仕事的・実践的な知力には弱さ。",
        "乙": "木性の玉堂星（正統の学問）：玉堂星の標準型で正統な学問。伝統・古典を好み「学ぶこと」に心をひかれる。教育の要素が強い。情の部分が含まれ庶民性を持つ。「生涯学生」。「動」の中で得る知恵だが即現実に結び付かない。職業や仕事とは関係なく「動」からの知恵（体験的に得る知識）。人生に波乱が多いほど大きい知恵を得る。得た知識で人を導く・助言する姿の中で最も燃焼しやすい。実践的な知恵とは呼べない一面があり、知恵が現実を求めず独立を保つ。無欲な知恵で生活現実とは別のところで稼働。",
        "丙": "火性の玉堂星（初代創造）：人間界の伝統や歴史に頼らず自分初の独創的な知性を創出。一つの思考が百年千年と続く要因を秘めた創造性で、伝統の出発点を作る知性。神界と人間界の違い（水剋火）という本性的葛藤から生まれた創造力で、自分の考えが個人的に有用かつ有益には使えない。独学的要素が強く師に就かず自己流。追い込まれたときに策士的な知恵が生まれ、試験で落とすと落第というときに突然好成績。どのような環境にも順応する広がりのある知恵で、物事に対応・対処する場面で素早く的確に反応。要領の良い知恵で生活上のアイデアが豊富。主義信条的ではないので大きなまとまりを作らず体系化されない弱点。一貫性のない知恵に見えるが時代と社会の変貌時には最大限に生かされる。清濁・善悪両面が極端にあらわれ知恵ゆえに真の人間性を理解されない部分が生まれる。",
        "丁": "火性の玉堂星（初代創造）：人間界の伝統に頼らず自分初の独創的知性。伝統の出発点を作る知性。独学的で師に就かず自己流。追い込まれたときに策士的な知恵が生まれる。伝統を重んじ先代・先々代からの知恵を素直に受け継ぐ古典的玉堂星。改革性や自分一代の知恵が少なく大きな流れの一部分を担うイメージ。民族意識が強く国家・一族という単位を思考の根元に位置させる。身につけた知識を後継者に受け継がせようとする欲求が強く伝統を守ろうとする。学問・芸術の知恵よりも生活の知恵・世渡りの知恵が大きくなり、人生の窮地からの脱出にも役立つ。精神世界より現実世界で強く発揮される。",
        "戊": "土性の玉堂星（沈潜の教養）：土性の地冲に引き込む引力が玉堂星にも及び、知性・理性など高い次元の性情がすべて地中へ沈む。若年期は理性・知性が無いように見える。地味な教養の積み重ねで年齢とともに少しずつ表面化し、中年期以降に本来の姿が現れる。学ぶ力が記憶ではなく自然の蓄積力によって構成。専門分野における創造性は相当の力量。男性は龍高星的行動と思考構造、女性は玉堂星そのままの現象と思考構造。常に眼前の現実界から学び取ったことを精神的自己形成に役立てようとする。「市井の哲学者」。個人的に体系化し人生観から他人の賛意を得る哲学・思想へと高める。独特の説得力が生まれ精神的な交流を保つ仲間を多く持つ。",
        "己": "土性の玉堂星（沈潜の教養）：土性の引力で知性・理性が地中へ沈む。若年期は知性がないように見え、地味な教養の積み重ねで年齢とともに表面化。中年期以降に本領発揮。学ぶ力が自然の蓄積力で構成され、専門分野で創造性を発揮。男性は龍高星的、女性は玉堂星そのまま。深く思案することがなくその時々で自由な発想。古典・伝統の側面は薄れ臨機応変の知恵。根底は「応用の知恵」で無から有を生じるのではなく「有」から新しい「有」を創造。先達が遺した知恵を改良し応用できる知恵に作り変える。時代を保守性の中で推し進める知恵。",
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
    "天報星": { good: { balanced: "前例のない新しい道を切り開く創造性と直観力がある。内面のバランスが二つの思考を同時に持てるバランス感覚を安定させる。", moderate: "前例のない新しい道を切り開く創造性と直観力がある。二つの思考を同時に持てるバランス感覚。", imbalanced: "前例のない新しい道を切り開く創造性があるが内面の偏りが思考の分散を極限化し、一つのことに注力するのが極めて困難になる。" }, bad: { balanced: "無自覚な言動になりやすいが内面のバランスが方向性をある程度保ち、不安も軽度に抑えられる。", moderate: "無自覚・無反省な言動になりやすく、方向が定まりにくい。行き過ぎると急ブレーキがかかり不安に襲われやすい。一つのことに注力するのが難しい。", imbalanced: "内面の偏りが無自覚さを極限化し、方向が全く定まらず不安に常に襲われ、一つのことに全く注力できない。" } },
    "天印星": { good: { balanced: "多面的な思考力と豊かな感性を持つ。内面のバランスが主体性も保ち、環境に適応しつつ自分らしさも発揮する。", moderate: "多面的な思考力と豊かな感性を持つ。目の前の現実に適応し、無自覚に周囲に必要なことを察知して知らしめる力がある。", imbalanced: "多面的な思考力と豊かな感性を持つが内面の偏りが環境依存を極限化し、主体性が完全に薄れる。" }, bad: { balanced: "主体性が薄れやすいが内面のバランスが依存癖を抑え、天命を見失わずに済む。", moderate: "中身が環境で決まるため主体性が薄れやすい。依存癖が出ると信用を失い、自分の天命を見失う。", imbalanced: "内面の偏りが依存癖を極限化し、信用を完全に失い天命を完全に見失う。" } },
    "天貴星": { good: { balanced: "芽生えたての純粋な自意識と役割意識を持ち、試練によって磨かれていく。内面のバランスがプライドを適度に保ち、飛躍した発想も可能にする。", moderate: "芽生えたての純粋な自意識と役割意識を持ち、試練によって磨かれていく。コツコツと積み重ねる学習力があり、教える立場で綿密な準備力を発揮する。", imbalanced: "芽生えたての純粋な自意識を持つが内面の偏りがプライドを極限化し、独善的になり飛躍した発想に限界がある。" }, bad: { balanced: "自意識の裏側の弱さを隠しがちだが内面のバランスがプライドを適度に保ち、独善化を防ぐ。", moderate: "自意識の裏側にある弱さと不安を気負いや見栄で隠しがち。プライドが高すぎると独善的になり、飛躍した発想に限界がある。", imbalanced: "内面の偏りがプライドを極限化し、完全に独善的になり飛躍した発想が一切できない。" } },
    "天恍星": { good: { balanced: "現状打破の力と冒険心を持ち、常に新しい自分を求めて脱皮を繰り返す。内面のバランスが刺激への衝動を抑え、行動力を持続させる。", moderate: "現状打破の力と冒険心を持ち、常に新しい自分を求めて脱皮を繰り返す。正直で率直、夢やロマンに向かって突き進む行動力がある。", imbalanced: "現状打破の力と冒険心を持つが内面の偏りが刺激への欲求を極限化し、身勝手さが目立ち安定が完全に奪われる。" }, bad: { balanced: "自意識が強いが内面のバランスが主観を客観でバランス取り、身勝手さを抑える。", moderate: "自意識が非常に強く、主観で動くため常識に縛られない身勝手さが出やすい。刺激を求める揺らぎが安定を奪う。", imbalanced: "内面の偏りが自意識を極限化し、身勝手さが常態化し安定が完全に奪われる。" } },
    "天南星": { good: { balanced: "内的世界への固執が不屈の前進力となり、新しい世界を作り出す冒険者。内面のバランスが不器用さを柔軟性で補い、協力者も失わない。", moderate: "内的世界への固執が不屈の前進力となり、新しい世界を作り出す冒険者。一本気で純粋、一度交われば長く続く人間関係を作る。", imbalanced: "内的世界への固執が前進力となるが内面の偏りが不器用さを極限化し、怒りや敵対を生んで味方と敵が明確に分かれる。" }, bad: { balanced: "自分を曲げられない不器用さはあるが内面のバランスが批判力を建設的に向け、協力者を失わない。", moderate: "自分を曲げられない不器用さが怒りや敵対を生む。環境を無視した批判力で味方と敵が明確に分かれる。安住や後退には耐えられない。", imbalanced: "内面の偏りが不器用さを極限化し、怒りや敵対が常態化し協力者を完全に失う。" } },
    "天禄星": { good: { balanced: "自己保身的中庸バランスを保ち、全体的な観察から的確な行動をとる。内面のバランスが用心深さと適度な冒険のバランスを取り、職人として真価を発揮する。", moderate: "自己保身的中庸バランスを保ち、全体的な観察から的確な行動をとる。堅実な積み重ねで職人として真価を発揮し、経験則に基づく未来予測力を持つ。", imbalanced: "自己保身的中庸バランスを保つが内面の偏りが用心深さを行き過ぎさせ、冒険を完全に避けて小心者に見える。" }, bad: { balanced: "中庸の判断力が自己本位になりやすいが内面のバランスが全体バランスを保ち、人生の崩れを防ぐ。", moderate: "内側傾斜が中庸の判断力を自己本位にし、実利へ走ると人生全体のバランスを崩す。冒険を避け用心深すぎると小心者に見える。", imbalanced: "内面の偏りが自己本位を極限化し、実利へ走って人生全体のバランスが完全に崩れる。" } },
    "天将星": { good: { balanced: "極まることで転換を作り出し、創造と破壊を繰り返しながら次元を上げる。内面のバランスが自我を健全なリーダーシップに変え、周囲を犠牲にしない。", moderate: "極まることで転換を作り出し、創造と破壊を繰り返しながら次元を上げる。精神世界を渇望し、無形の知恵を現実に引き入れて活用する力に優れる。", imbalanced: "極まることで転換を作り出すが内面の偏りが自我を極限化し、周囲を犠牲にしてでも自分を無にできない。" }, bad: { balanced: "自我と頑固さは強いが内面のバランスが周囲への配慮を保ち、協力者を犠牲にしない。", moderate: "自我と頑固さが極めて強く、自分を無にできない。強すぎる運勢が周囲を犠牲にすることも。幼少期はおだやかに見えるがエネルギーを内向して持て余す。", imbalanced: "内面の偏りが自我を極限化し、周囲を常に犠牲にして完全に孤立する。" } },
    "天堂星": { good: { balanced: "退気のエネルギーで一歩下がって道を譲る精神と強靭な自制心を持つ。内面のバランスが諦念を健全な謙虚さに変え、適度な自己主張も可能にする。", moderate: "退気のエネルギーで一歩下がって道を譲る精神と強靭な自制心を持つ。間断の気で年齢差のある関係や無言の世界で最大燃焼する。人を立てる謙虚さと単独行動向きの頑固さを併せ持つ。", imbalanced: "退気のエネルギーで道を譲る精神を持つが内面の偏りが諦念を極限化し、自己主張が完全にできず人生が縮む。" }, bad: { balanced: "自己主張ができず引っ込み思案に見られがちだが内面のバランスが適度な主張を可能にし、居心地の悪さを軽減する。", moderate: "自己主張ができず引っ込み思案に見られがち。同年代・同性の環境では居心地の悪さを感じる。諦念が強すぎると人生が縮む。", imbalanced: "内面の偏りが諦念を極限化し、自己主張が完全にできず人生が極端に縮む。" } },
    "天胡星": { good: { balanced: "時間と場所を超越した発想を持ち、有から無を感知して無から新たな有を作る才能がある。内面のバランスが感性と現実感覚のバランスを取り、先見性を安定して発揮する。", moderate: "時間と場所を超越した発想を持ち、有から無を感知して無から新たな有を作る才能がある。美意識が強く、直感力と異常な集中力で先見性のある人生を構築できる。", imbalanced: "時間と場所を超越した発想を持つが内面の偏りが現実逃避を極限化し、周囲との協調が完全に崩れ故障しやすくなる。" }, bad: { balanced: "現実を居場所にできにくいが内面のバランスが現実感覚を保ち、周囲との協調をある程度維持する。", moderate: "現実を居場所にできず、時系列的な秩序を欠く発想で周囲との協調が難しい。精神が肉体を追い込み故障しやすい。希望が閉ざされると現実に絶望する。", imbalanced: "内面の偏りが現実逃避を極限化し、周囲との協調が完全に崩れ希望が閉ざされると現実に完全に絶望する。" } },
    "天極星": { good: { balanced: "格差なき一次元思考で自由な思考転回ができ、環境に合わせて行動も思考も変化させる柔軟性がある。内面のバランスが主体性も与え、計画的に動く力を補う。", moderate: "格差なき一次元思考で自由な思考転回ができ、環境に合わせて行動も思考も変化させる柔軟性がある。回帰作用で異次元への飛翔力を持ち、自然体で今を生きる純粠さがある。", imbalanced: "自由な思考転回ができるが内面の偏りが環境依存を極限化し、自分から未来を志向する主体性が完全に弱くなる。" }, bad: { balanced: "自力で現実を作りにくいが内面のバランスが主体性をある程度保ち、頭の切り換えも機能する。", moderate: "自力で現実を作れず環境依存になりやすい。発想の転換がきかず頭の切り換えが鈍い。自分から未来を志向して計画的に人生を構築する主体性が弱い。", imbalanced: "内面の偏りが環境依存を極限化し、主体性が完全になく頭の切り換えも全くきかない。" } },
    "天庫星": { good: { balanced: "連結のない一筋の探究心で単一志向に突き進み、天性のバランス感覚で不自然・不合理を感知する。内面のバランスが執着を健全な探究に変え、社会協調も保つ。", moderate: "連結のない一筋の探究心で単一志向に突き進み、天性のバランス感覚で不自然・不合理を感知する。現実から精神を学び取る術に優れ、器用で多彩な能力と芸術的センスを発揮する。", imbalanced: "連結のない一筋の探究心で突き進むが内面の偏りが執着を極限化し、独断専行型の人生になり周囲が見えなくなる。" }, bad: { balanced: "社会協調が難しい面はあるが内面のバランスが執着を抑え、呪縛を防ぐ。", moderate: "現実を持たないエネルギーで社会協調が難しく、独断専行型の人生になりやすい。連結のない思考で周囲が見えなくなり、とらわれたものに呪縛される偏向傾向がある。", imbalanced: "内面の偏りが執着を極限化し、とらわれたものに完全に呪縛され社会協調が完全に崩れる。" } },
    "天馳星": { good: { balanced: "点的今の連続で目の前のことに全力を注ぎ、成功も失敗も固執しないさっぱりとした精神を持つ。内面のバランスが分裂を健全な多芸多才に変え、持続力の限界も補う。", moderate: "点的今の連続で目の前のことに全力を注ぎ、成功も失敗も固執しないさっぱりとした精神を持つ。外動内静で動くほど精神は安定し、異質な分野の作業を並行してこなす多芸多才さがある。", imbalanced: "点的今の連続で全力を注ぐが内面の偏りが分裂を極限化し、まとまりを作れず一つに集中すると持続力が完全に限界に達する。" }, bad: { balanced: "分裂・分離の本性でまとまりを作りにくいが内面のバランスが持続力を補い、動けない環境でも肉体をある程度守る。", moderate: "分裂・分離の本性でまとまりを作れず、一つのことに集中すると持続力に限界がある。動けない環境だと肉体が破壊され病弱になりやすい。", imbalanced: "内面の偏りが分裂を極限化し、まとまりが完全になく動けない環境だと肉体が完全に破壊される。" } }
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
  const energyTexts = energy.map((e, i) => `【${energyLabels[i]}】${e.name}（${pickByBalance(energyPersonality[e.name]?.good, balanceType) || ""}／${pickByBalance(energyPersonality[e.name]?.bad, balanceType) || ""}）`);
  const workEx = calcWorkExcellence(center, northStar, southStar, energy, counts, pillars);

  // 姓名判断の性格データを統合
  const seimeiGood = hasSeimei ? `【姓名判断・人格の性質（${seimei.jinGogyo}）】${seimeiPersonality.jinGogyo.good}\n【姓名判断・人格${seimei.jinRank?.rank}】${seimeiPersonality.jinRankText}\n【姓名判断・地格${seimei.chiRank?.rank}】${seimeiPersonality.chiRankText}\n【姓名判断・外格${seimei.gaiRank?.rank}】${seimeiPersonality.gaiRankText}` : "";
  const seimeiBad = hasSeimei ? `【姓名判断・人格の性質（${seimei.jinGogyo}）】${seimeiPersonality.jinGogyo.bad}\n【姓名判断・三才配置】${seimeiPersonality.sancaiText}` : "";

  const reading = [
    { title: `${name}さんの本質`, text: `${dayP.good}${hasSeimei ? `\n姓名判断では人格${seimei.jinkaku}画（${seimei.jinRank?.rank}）。` : ""}` },
    { title: "性格の長所", text: `【中心的な性格】${pickByBalance(starP.good, balanceType)}\n【生まれた日の性質】${dayP.good}\n【最も強い要素（${strongest}）】${strongP.good}\n【表に出やすい面】${pickByBalance(northP.good, balanceType)}\n【内面に持っている面】${pickByBalance(southP.good, balanceType)}${seimeiGood ? "\n" + seimeiGood : ""}` },
    { title: "性格の短所（隠さず直視すべき点）", text: `【中心的な性格】${pickByBalance(starP.bad, balanceType)}\n【生まれた日の性質】${dayP.bad}\n【最も強い要素（${strongest}）が強すぎる面】${strongP.bad}\n【足りない要素（${weakest}）の影響】${weakP.bad}${seimeiBad ? "\n" + seimeiBad : ""}` },
    { title: "仕事面での性格", text: `${pickByBalance(starP.work, balanceType)}${hasSeimei ? `\n姓名判断の仕事運スコアは${seimei.workFortune}点。${seimei.workFortune >= 70 ? "姓名判断的にも仕事運は良好。" : seimei.workFortune >= 50 ? "姓名判断的には標準的。" : "姓名判断的には仕事面で苦労しやすい。"}` : ""}` },
    { title: "仕事の優秀度", text: `総合仕事優秀度スコア：${workEx.score}点（${workEx.rank}）\n適職傾向：${workEx.jobTendency}\n内訳：${workEx.breakdown}${hasSeimei ? `\n姓名判断の仕事運スコア：${seimei.workFortune}点` : ""}` },
    { title: "恋愛面での性格", text: `${pickByBalance(starP.love, balanceType)}${hasSeimei ? `\n姓名判断の恋愛運スコアは${seimei.loveFortune}点。${seimei.loveFortune >= 70 ? "姓名判断的にも恋愛運は良好。" : seimei.loveFortune >= 50 ? "姓名判断的には標準的。" : "姓名判断的には恋愛面で波乱あり。"}` : ""}` },
    { title: "金銭感覚とお金の性格", text: `【中心的な性格】${pickByBalance(starP.money, balanceType)}\n【生まれた日の性質】${dayStemMoney[pillars.day.stem] || ""}\n【最も強い要素（${strongest}）】${gogyoMoney[strongest] || ""}${hasSeimei ? `\n姓名判断の金運スコアは${seimei.moneyFortune}点。${seimei.moneyFortune >= 70 ? "姓名判断的にも金運は良好。" : seimei.moneyFortune >= 50 ? "姓名判断的には標準的。" : "姓名判断的には金運に注意が必要。"}` : ""}` },
    { title: "結婚観と家庭の性格", text: `【中心的な性格】${pickByBalance(starP.marriage, balanceType)}\n【生まれた日の性質】${dayStemMarriage[pillars.day.stem] || ""}\n【最も強い要素（${strongest}）】${gogyoMarriage[strongest] || ""}` },
    { title: "社交性と対人関係の性格", text: `【中心的な性格】${pickByBalance(starP.social, balanceType)}\n【生まれた日の性質】${dayStemSocial[pillars.day.stem] || ""}\n【最も強い要素（${strongest}）】${gogyoSocial[strongest] || ""}${hasSeimei ? `\n姓名判断の対人運${seimei.gaiRank?.rank}：${seimeiPersonality.gaiRankText}` : ""}` },
    { title: `中心的な性格×生まれた日の性質の詳細`, text: starP.byDayStem ? starP.byDayStem[pillars.day.stem] || "" : "" },
    { title: `表に出やすい面×生まれた日の性質の詳細`, text: northP.byDayStem ? northP.byDayStem[pillars.day.stem] || "" : "" },
    { title: `内面に持っている面×生まれた日の性質の詳細`, text: southP.byDayStem ? southP.byDayStem[pillars.day.stem] || "" : "" },
    { title: "本人も自覚しにくい裏の性格", text: pickByBalance(starP.hidden, balanceType) },
    { title: "人生のタイミングから見る性格要素", text: energyTexts.join("　") },
    { title: "バランスと課題", text: `内面では「${strongest}」の性質が強く、「${weakest}」の性質が不足気味。強い要素は武器ですが、過剰になると独善・偏り・視野狭窄になります。不足する「${weakest}」は、人生で意識的に鍛えないと同じ壁として何度も出ます。${strongP.good}という長所を活かしつつ、${weakP.bad}という弱点を補う環境選びが鍵です。${hasSeimei ? `\n姓名判断の総合判定は「${seimei.overallRank}」。${seimei.overallRank === "大吉" || seimei.overallRank === "吉" ? "名前の画数バランスが良く、運勢を後押しする。" : seimei.overallRank === "半吉" ? "名前の画数は標準的。努力次第で運勢を引き上げられる。" : "名前の画数に偏りがあり、意識的な努力で補う必要がある。"}` : ""}` },
    { title: "エネルギー傾向", text: `人生のタイミングを表す星の合計エネルギーは${totalEnergy}点。${energy.map((e) => `${e.name}${e.score}点`).join("・")}。${totalEnergy >= 28 ? "強い運命ほど、怠けた時の反動も大きいです。力を持て余すと周囲への圧になります。" : "繊細な運命ほど、環境の悪さに削られます。根性論だけで突破しようとすると消耗します。"}` },
    { title: "注意が必要な時期", text: `${tenchusatsu}の期間中は、拡大や大きな決断より整理・準備・見直し向き。無理に勝負すると、手に入れたものの維持で苦しくなりやすいです。` }
  ];
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
    list.innerHTML = '<p style="color:var(--muted);font-size:13px">まだ鑑定記録がありません。</p>';
  } else {
    list.innerHTML = history.map((h, i) => `<div class="history-item" data-idx="${i}" style="cursor:pointer"><span class="history-name">${h.name}</span><span class="history-info">${h.birthdate} / ${h.dayStem}${h.dayBranch} / ${h.centerStar}</span><button class="history-del" data-idx="${i}">&times;</button></div>`).join("");
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

// === 相性占い ===
const gogyoRelation = { 木: { 木: "比和", 火: "相生", 土: "相剋", 金: "反剋", 水: "相生" }, 火: { 木: "相生", 火: "比和", 土: "相生", 金: "相剋", 水: "反剋" }, 土: { 木: "反剋", 火: "相生", 土: "比和", 金: "相生", 水: "相剋" }, 金: { 木: "相剋", 火: "反剋", 金: "比和", 土: "相生", 水: "相生" }, 水: { 木: "相生", 火: "相剋", 土: "反剋", 金: "相生", 水: "比和" } };

const compatTexts = {
  比和: { good: "似た者同士で居心地はいいが、成長は止まる。馴れ合いで互いに甘え合い、結局どちらも変わらないまま関係が腐っていくタイプ。", bad: "似た者同士は最初は安心するが、刺激がないと関係が腐る。欠点まで似ているため、同じ壁にぶつかり二人して止まる。最悪の組み合わせではないが、最善でもない。" },
  相生: { good: "一方がもう一方を育てる関係。ただし与える側が一方的に尽くす構図になりやすく、疲弊して愛情が冷めるリスクが常にある。受け取る側の感謝がなければ崩壊する。", bad: "与える側が犠牲者意識を持ち始めると一気に崩壊する。『私ばかりやってる』という不満が爆発した時、受け取る側は何が起きたか理解できないほど温度差がある。" },
  相剋: { good: "衝突が絶えないが、その摩擦で互いに削られる。成長するか憎み合うかの二択。適度な距離感を保てないと共倒れ。", bad: "衝突が激しい組み合わせ。相手を変えようとすると泥沼。どちらかが折れるか、物理的に距離を置くかしないと破綻する。『愛があれば変われる』は幻想。" },
  反剋: { good: "一方的に鍛えられる関係。我慢が効く間は成長するが、限界を超えると心が壊れる。", bad: "一方的に削られる関係。耐えているうちはいいが、限界を超えると感情が麻痺し、ある日突然冷める。撤退のタイミングを見極めないと深傷を負う。" }
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
  if (relation === "相生") { loveScore += 20; loveFactors.push("相性関係+20"); }
  else if (relation === "比和") { loveScore += 12; loveFactors.push("同質関係+12"); }
  else if (relation === "相剋") { loveScore -= 8; loveFactors.push("ぶつかり関係-8"); }
  else if (relation === "反剋") { loveScore -= 15; loveFactors.push("逆風関係-15"); }
  if (!sameYinYang) { loveScore += 10; loveFactors.push("陰陽の補完+10"); }
  else { loveScore -= 5; loveFactors.push("同陰陽-5"); }
  if ([4, 8].includes(branchDiff)) { loveScore += 8; loveFactors.push("地支三合+8"); }
  if (branchDiff === 6) { loveScore -= 10; loveFactors.push("地支冲-10"); }
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
  loveScore += starLovePt;
  if (starLovePt) loveFactors.push(`主星(${centerA}×${centerB})${starLovePt > 0 ? "+" : ""}${starLovePt}`);
  loveScore = Math.max(10, Math.min(95, loveScore));

  // --- 性の相性 ---
  let sexScore = 50;
  const sexFactors = [];
  // 陰陽の組み合わせ（異陰陽が高い）
  if (!sameYinYang) { sexScore += 18; sexFactors.push("陰陽異性+18"); }
  else { sexScore -= 8; sexFactors.push("同陰陽-8"); }
  // 五行関係
  if (relation === "相生") { sexScore += 15; sexFactors.push("相性関係+15"); }
  else if (relation === "相剋") { sexScore += 8; sexFactors.push("ぶつかり関係(刺激)+8"); }
  else if (relation === "比和") { sexScore += 5; sexFactors.push("同質関係+5"); }
  else if (relation === "反剋") { sexScore -= 12; sexFactors.push("逆風関係-12"); }
  // 地支の関係（冲は性的緊張感としてプラス、三合は安心感）
  if (branchDiff === 6) { sexScore += 10; sexFactors.push("地支冲(緊張感)+10"); }
  if ([4, 8].includes(branchDiff)) { sexScore += 5; sexFactors.push("地支三合+5"); }
  // 星の性的相性
  const sexStarBonus = {
    "車騎星": 10, "調舒星": 8, "龍高星": 8, "鳳閣星": 7, "禄存星": 6,
    "石門星": 5, "貫索星": 5, "牽牛星": 4, "玉堂星": 2, "司禄星": 2
  };
  const sexPtA = sexStarBonus[centerA] || 0;
  const sexPtB = sexStarBonus[centerB] || 0;
  const sexStarPt = Math.round((sexPtA + sexPtB) / 3);
  sexScore += sexStarPt;
  if (sexStarPt) sexFactors.push(`主星の情熱度+${sexStarPt}`);
  sexScore = Math.max(10, Math.min(95, sexScore));

  // --- 結婚後の相性 ---
  let marriageScore = 50;
  const marriageFactors = [];
  if (relation === "相生") { marriageScore += 22; marriageFactors.push("相性関係+22"); }
  else if (relation === "比和") { marriageScore += 15; marriageFactors.push("同質関係+15"); }
  else if (relation === "相剋") { marriageScore -= 12; marriageFactors.push("ぶつかり関係-12"); }
  else if (relation === "反剋") { marriageScore -= 18; marriageFactors.push("逆風関係-18"); }
  if ([4, 8].includes(branchDiff)) { marriageScore += 12; marriageFactors.push("地支三合+12"); }
  if (branchDiff === 6) { marriageScore -= 12; marriageFactors.push("地支冲-12"); }
  if (branchDiff === 0) { marriageScore += 8; marriageFactors.push("同地支+8"); }
  // 星の結婚適性
  const marriageStarBonus = {
    "司禄星": 10, "禄存星": 9, "牽牛星": 8, "玉堂星": 7, "石門星": 6,
    "貫索星": 5, "鳳閣星": 4, "調舒星": 3, "車騎星": 2, "龍高星": 1
  };
  const marPtA = marriageStarBonus[centerA] || 0;
  const marPtB = marriageStarBonus[centerB] || 0;
  const marStarPt = Math.round((marPtA + marPtB) / 3);
  marriageScore += marStarPt;
  if (marStarPt) marriageFactors.push(`主星の結婚適性+${marStarPt}`);
  // 同陰陽は安定感がある
  if (sameYinYang) { marriageScore += 5; marriageFactors.push("同陰陽(安定)+5"); }
  marriageScore = Math.max(10, Math.min(95, marriageScore));

  // 総合スコア
  let score = Math.round((loveScore + sexScore + marriageScore) / 3);

  // --- 不倫リスク ---
  const affairRiskA = getAffairRiskScore({
    westStar: a.westStar || a.centerStar || "",
    spouseEnergyName: a.dayEnergy || "",
    isDoubleEn: a.eastStar && a.westStar && (a.eastStar === a.westStar || yinYangPairStar[a.eastStar] === a.westStar),
    hasAbnormal: false,
    hasTopThreeAbnormal: false
  });
  const affairRiskB = getAffairRiskScore({
    westStar: b.westStar || b.centerStar || "",
    spouseEnergyName: b.dayEnergy || "",
    isDoubleEn: b.eastStar && b.westStar && (b.eastStar === b.westStar || yinYangPairStar[b.eastStar] === b.westStar),
    hasAbnormal: false,
    hasTopThreeAbnormal: false
  });
  // 相手の組み合わせによる不倫リスク調整
  let affairRisk = Math.round((affairRiskA + affairRiskB) / 2);
  const affairFactors = [];
  affairFactors.push(`${a.name}の不倫リスク${affairRiskA}点`);
  affairFactors.push(`${b.name}の不倫リスク${affairRiskB}点`);
  // 相剋関係は不倫リスクを高める
  if (relation === "相剋") { affairRisk += 8; affairFactors.push("ぶつかり関係(刺激)+8"); }
  else if (relation === "反剋") { affairRisk += 12; affairFactors.push("逆風関係+12"); }
  // 龍高星×龍高星は自由奔放
  if (centerA === "龍高星" && centerB === "龍高星") { affairRisk += 10; affairFactors.push("龍高星×龍高星(自由奔放)+10"); }
  // 鳳閣星がいるとモテやすく誘惑多い
  if (centerA === "鳳閣星" || centerB === "鳳閣星") { affairRisk += 5; affairFactors.push("鳳閣星の誘惑+5"); }
  // 司禄星がいると堅実
  if (centerA === "司禄星" || centerB === "司禄星") { affairRisk -= 5; affairFactors.push("司禄星の堅実-5"); }
  // 地支冲は不安定
  if (branchDiff === 6) { affairRisk += 6; affairFactors.push("地支冲(不安定)+6"); }
  affairRisk = Math.max(5, Math.min(95, affairRisk));

  // --- 離婚リスク ---
  let divorceRisk = 50;
  const divorceFactors = [];
  // 結婚スコアが低いほど離婚リスク高い
  divorceRisk += Math.round((50 - marriageScore) * 0.4);
  if (marriageScore < 40) { divorceRisk += 10; divorceFactors.push("結婚相性低+10"); }
  // 五行相剋・反剋は離婚リスク高い
  if (relation === "相剋") { divorceRisk += 8; divorceFactors.push("ぶつかり関係+8"); }
  else if (relation === "反剋") { divorceRisk += 15; divorceFactors.push("逆風関係+15"); }
  else if (relation === "比和") { divorceRisk -= 5; divorceFactors.push("同質関係(安定)-5"); }
  // 地支冲は離婚リスク高い
  if (branchDiff === 6) { divorceRisk += 12; divorceFactors.push("地支冲+12"); }
  // 二度縁の人は離婚しやすい
  const aDoubleEn = a.eastStar && a.westStar && (a.eastStar === a.westStar || yinYangPairStar[a.eastStar] === a.westStar);
  const bDoubleEn = b.eastStar && b.westStar && (b.eastStar === b.westStar || yinYangPairStar[b.eastStar] === b.westStar);
  if (aDoubleEn) { divorceRisk += 8; divorceFactors.push(`${a.name}の二度縁+8`); }
  if (bDoubleEn) { divorceRisk += 8; divorceFactors.push(`${b.name}の二度縁+8`); }
  // 不倫リスクが高いと離婚リスクも高い
  if (affairRisk >= 60) { divorceRisk += 10; divorceFactors.push("不倫リスク高+10"); }
  // 同陰陽は安定
  if (sameYinYang) { divorceRisk -= 5; divorceFactors.push("同陰陽(安定)-5"); }
  divorceRisk = Math.max(5, Math.min(95, divorceRisk));

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
  const c = calcCompatibility(a, b);
  const severity = c.score < 40 ? "bad" : "good";

  // スコア→ランク
  const scoreRank = (s) => s >= 80 ? "S" : s >= 70 ? "A" : s >= 60 ? "B" : s >= 50 ? "C" : s >= 40 ? "D" : "E";
  const scoreColor = (s) => s >= 80 ? "#f0e080" : s >= 70 ? "#e0c060" : s >= 60 ? "#c0a050" : s >= 50 ? "#a09060" : s >= 40 ? "#c07060" : "#c05050";

  // 恋愛の相性テキスト（辛口）
  const loveDesc = {
    S: "魂レベルで惹かれ合う稀有な関係。ただし、これほど合うと『他にいない』という依存が生まれやすく、別れが迫った時のダメージは計り知れない。幸せな関係ほど、壊れた時の落差は大きい。",
    A: "良い恋愛関係だが、感情の波がないわけではない。『合う』ことに甘えて手抜きを始めると、あっさり冷める。良い関係は維持に努力がいる。",
    B: "そこそこ良い関係。すれ違うこともあるが、我慢の範囲内。ただし『まあいいか』で済ませ続けると、不満が静かに蓄積し数年後に爆発する。",
    C: "平凡な相性。最初のトキメキはあるが、半年もすれば新鮮味が消える。意識的に関係を育まないと、ただの同居人になる。",
    D: "すれ違いが目立つ。恋愛感情はあるが、タイミングや価値観のズレが常にストレスになる。『愛があれば』という根性論で乗り切れる範囲ではない。",
    E: "恋愛として成立するのが難しい。無理に続けると両者とも人間性が削れる。『頑張ればなんとかなる』と思っているうちは痛手が大きくなるだけ。"
  };

  // 性の相性テキスト（辛口）
  const sexDesc = {
    S: "身体的な相性は最高レベル。陰陽の補完が完璧で、自然な吸引力がある。ただし、これほど合うとセックスで関係を繋ぎ止めている面があり、心の問題を先送りにする危険がある。",
    A: "とても良い身体的相性。情熱と安心感のバランスも良い。ただし『体が合う＝心も合う』と勘違いすると、根本的な問題を見逃す。",
    B: "そこそこ良い相性。波はあるが概ね満足できる。ただし『まあいい』で放置すると、徐々に頻度が減り、最終的にセックスレスに陥る。",
    C: "普通の相性。最初は良くても数ヶ月で慣れが出る。工夫なしではマンネリ確実。『セックスは関係ない』と言い出したら終わりの始まり。",
    D: "身体的なミスマッチが生じやすい。頻度やタイミングのズレが不満になり、どちらかが我慢している構図になりがち。我慢は限界を超えると不倫に直結する。",
    E: "性的な相性に大きな課題がある。無理に合わせるとストレスが蓄積し、最終的に体を受け付けること自体ができなくなる。"
  };

  // 結婚後の相性テキスト（辛口）
  const marriageDesc = {
    S: "結婚後も安定と成長を続けられる稀有なパートナーシップ。ただし、これほど合うと『この人を失ったら終わり』という恐怖が生まれやすく、過度な依存で関係が重くなるリスクがある。",
    A: "安定した結婚関係。価値観の一致度も高い。ただし『合う』ことに甘えてすれ違いを放置すると、5年〜10年後に突然冷めるパターンに入る。",
    B: "そこそこ安定。日常の積み重ねで信頼は育つが、変化への対応力が試される。子育てや経済問題で初めて壁にぶつかった時、どちらが折れるかで今後が決まる。",
    C: "平凡な結婚相性。最初は安定していても、日常のストレスで摩擦が生じる。『結婚なんてこんなもの』と言い聞かせて我慢し続けると、ある日限界が来る。",
    D: "結婚後のすれ違いが多い。価値観や生活リズムの違いが表面化し、我慢の連続。『離婚したくないから耐える』と言っているうちは良いが、心が麻痺し始めたら危険。",
    E: "結婚関係の維持が困難。根本的な価値観の違いがあり、無理に続けると両者とも人間性が削られる。『子どものために』は最も悪い理由付け。"
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
          <div class="compat-cat-score" style="color:${scoreColor(c.loveScore)}">${c.loveScore}<small>点</small><span class="compat-cat-rank" style="background:${scoreColor(c.loveScore)}">${loveR}</span></div>
        </div>
        <div class="compat-cat-bar"><div class="compat-cat-bar-fill" style="width:${c.loveScore}%;background:linear-gradient(90deg,${scoreColor(c.loveScore)},${scoreColor(c.loveScore)})"></div></div>
        <p>${loveDesc[loveR]}</p>
        <div class="compat-cat-factors">${c.loveFactors.map(f => `<span class="factor-tag">${f}</span>`).join("")}</div>
        <div class="compat-cat-stars">
          <div><b>${a.name}</b>：${pickByBalance(loveTendencyTexts[c.centerA], "moderate") || ""}</div>
          <div><b>${b.name}</b>：${pickByBalance(loveTendencyTexts[c.centerB], "moderate") || ""}</div>
        </div>
      </div>

      <div class="compat-cat is-sex">
        <div class="compat-cat-head">
          <h4>性の相性</h4>
          <div class="compat-cat-score" style="color:${scoreColor(c.sexScore)}">${c.sexScore}<small>点</small><span class="compat-cat-rank" style="background:${scoreColor(c.sexScore)}">${sexR}</span></div>
        </div>
        <div class="compat-cat-bar"><div class="compat-cat-bar-fill" style="width:${c.sexScore}%;background:linear-gradient(90deg,${scoreColor(c.sexScore)},${scoreColor(c.sexScore)})"></div></div>
        <p>${sexDesc[sexR]}</p>
        <div class="compat-cat-factors">${c.sexFactors.map(f => `<span class="factor-tag">${f}</span>`).join("")}</div>
        <div class="compat-cat-stars">
          <div><b>${a.name}の性癖（${c.centerA}）</b>：${sexTendencyTexts[c.centerA] || ""}</div>
          <div><b>${b.name}の性癖（${c.centerB}）</b>：${sexTendencyTexts[c.centerB] || ""}</div>
        </div>
      </div>

      <div class="compat-cat is-marriage">
        <div class="compat-cat-head">
          <h4>結婚後の相性</h4>
          <div class="compat-cat-score" style="color:${scoreColor(c.marriageScore)}">${c.marriageScore}<small>点</small><span class="compat-cat-rank" style="background:${scoreColor(c.marriageScore)}">${marR}</span></div>
        </div>
        <div class="compat-cat-bar"><div class="compat-cat-bar-fill" style="width:${c.marriageScore}%;background:linear-gradient(90deg,${scoreColor(c.marriageScore)},${scoreColor(c.marriageScore)})"></div></div>
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
          <div class="compat-cat-score" style="color:${scoreColor(100 - c.affairRisk)}">${c.affairRisk}<small>%</small><span class="compat-cat-rank" style="background:${scoreColor(100 - c.affairRisk)}">${c.affairRisk >= 65 ? "高" : c.affairRisk >= 40 ? "中" : "低"}</span></div>
        </div>
        <div class="compat-cat-bar"><div class="compat-cat-bar-fill" style="width:${c.affairRisk}%;background:linear-gradient(90deg,${scoreColor(100 - c.affairRisk)},${scoreColor(100 - c.affairRisk)})"></div></div>
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
          <div class="compat-cat-score" style="color:${scoreColor(100 - c.divorceRisk)}">${c.divorceRisk}<small>%</small><span class="compat-cat-rank" style="background:${scoreColor(100 - c.divorceRisk)}">${c.divorceRisk >= 65 ? "高" : c.divorceRisk >= 40 ? "中" : "低"}</span></div>
        </div>
        <div class="compat-cat-bar"><div class="compat-cat-bar-fill" style="width:${c.divorceRisk}%;background:linear-gradient(90deg,${scoreColor(100 - c.divorceRisk)},${scoreColor(100 - c.divorceRisk)})"></div></div>
        <p>${c.divorceRisk >= 65 ? "離婚リスクが高い。価値観の違いや衝突が蓄積しやすい要素が重なっている。結婚前のすり合わせを怠ると、結婚してから『こんなはずじゃなかった』になる。それでも結婚するなら、離婚時の取り決めを事前に話し合っておくのが現実的。" : c.divorceRisk >= 40 ? "離婚リスクは中程度。高いわけではないが、油断はできない。日常の小さなすれ違いを放置し続けると、ある日『もう無理』と一気に壊れる。離婚は『急に起きる』のではなく『積み重なって起きる』。" : "離婚リスクは低め。ただし『低い』は『ない』ではない。経済問題や健康問題などの外部要因で関係が揺らぐ可能性はある。困難時に互いに背中を預けられるかが、最終的な分かれ道。"}</p>
        <div class="compat-cat-factors">${c.divorceFactors.map(f => `<span class="factor-tag">${f}</span>`).join("")}</div>
      </div>
    </div>

    <div class="result-card">
      <h3>辛口総評</h3>
      <div class="reading" style="margin-top:18px">
        <article><h4>厳しい一言</h4><div>${(() => { const s = c.score; if (s >= 80) return `総合${s}点。数値上は良い相性だが、合うことの罠を忘れるな。『合う』ことに甘えて成長を止めると、良い関係が一番腐りやすい。合うからこそ手抜きをせず、関係を磨き続けられるかが問われる。`; if (s >= 60) return `総合${s}点。悪くはないが、良いとも言い切れない。『まあまあ』で済ませ続けると、不満が静かに蓄積する。5年後に『いつの間にか気持ちが冷めていた』というパターンに入らないよう、今のうちから向き合うべき課題がある。`; if (s >= 40) return `総合${s}点。正直、厳しい。恋愛の最初の勢いで乗り切れても、日常に入るとズレが露骨になる。『愛があればなんとかなる』という根性論で突っ走ると、両者とも深傷を負う。冷静に現実を見るべき。`; return `総合${s}点。厳しい評価だが、数値は嘘をつかない。この関係を維持するには、通常以上の覚悟と労力が必要。『頑張れば変われる』という幻想を捨て、現実を受け入れるか、早めに見切りをつけるかの二択。引き延ばすほど痛手が大きくなる。`; })()}</div></article>
        <article><h4>相性の本質</h4><div>${compatTexts[c.relation][severity]}</div></article>
        <article><h4>${a.name}から見た${b.name}</h4><div>${pickByBalance(starTexts[c.starAtoB], "moderate")}</div></article>
        <article><h4>${b.name}から見た${a.name}</h4><div>${pickByBalance(starTexts[c.starBtoA], "moderate")}</div></article>
      </div>
    </div>
  `;
  compatResult.scrollIntoView({ behavior: "smooth", block: "start" });
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
  const tenchusatsu = getTenchusatsu(day.index);
  const maxCount = Math.max(...Object.values(counts), 1);
  const gender = genderSelect.value;
  const taiun = getTaiun(date, month, stems.indexOf(year.stem), gender);
  const currentAge = Math.floor((new Date() - date) / (365.25 * 86400000));
  const seimeiResult = analyzeSeimei(lastName, firstName);
  const reading = buildReading(name, pillars, mainStars, energy, counts, tenchusatsu, seimeiResult);
  const topologyResults = analyzeTopology(pillars);
  const fateTenchu = analyzeFateTenchusatsu(pillars);
  const guardian = getGuardianElements(counts);
  const thisYear = 2026;
  const yearlyFortune = analyzeYearlyFortune(day, pillars, taiun, currentAge, thisYear, balanceType);
  const healthRisk = analyzeHealthRisk(day, pillars, counts, taiun, tenchusatsu, currentAge, thisYear);
  const mote = analyzeMote(mainStars, energy, counts, day, pillars);
  const turningPoints = analyzeTurningPoints(day, pillars, mainStars, taiun, tenchusatsu, birthYear, currentAge);

  result.classList.remove("hidden");
  console.log("[render] starting, simple-mode:", document.body.classList.contains("simple-mode"));
  result.innerHTML = `
    <div class="result-card result-header">
      <div>
        <h2>${name}さんの鑑定結果</h2>
        <div style="font-size:10px;color:var(--muted);opacity:0.5">v2.0.1</div>
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
    <div class="result-card yearly-fortune-card">
      <h3 class="expert-only">${yearlyFortune.thisYear}年の総合運勢（大運×年運 統合判定）</h3>
      <h3 class="simple-only">${yearlyFortune.thisYear}年の運勢</h3>
      <div class="yearly-summary expert-only" style="padding:16px 18px;border-radius:14px;background:rgba(217,164,65,0.08);border:1px solid var(--border);margin-bottom:16px;white-space:pre-line;line-height:1.8;font-size:14px">${buildYearlySummary(yearlyFortune, false)}</div>
      <div class="yearly-summary simple-only" style="padding:16px 18px;border-radius:14px;background:rgba(217,164,65,0.08);border:1px solid var(--border);margin-bottom:16px;white-space:pre-line;line-height:1.8;font-size:14px">${buildYearlySummary(yearlyFortune, true)}</div>
      <div class="yearly-fortune-overview expert-only">
        <div class="yearly-fortune-pillars">
          ${yearlyFortune.currentTaiun ? `<span class="yf-pillar"><b>現在の大運</b> ${yearlyFortune.currentTaiun.stem}${yearlyFortune.currentTaiun.branch}（${yearlyFortune.taiunStar}・${yearlyFortune.taiunEnergy.name}）${yearlyFortune.isTaiunTenchu ? ' <span class="tenchu-badge">天中殺</span>' : ''}</span>` : ''}
          <span class="yf-pillar"><b>年運</b> ${yearlyFortune.yp.stem}${yearlyFortune.yp.branch}（${yearlyFortune.yearStar}・${yearlyFortune.yearEnergy.name}）${yearlyFortune.isYearTenchu ? ' <span class="tenchu-badge">天中殺</span>' : ''}</span>
        </div>
        <div class="yearly-fortune-rel">
          <span><b>日干との相性関係</b> 年運: ${yearlyFortune.yearRel}${yearlyFortune.taiunRel ? ` / 大運: ${yearlyFortune.taiunRel}` : ''}</span>
        </div>
      </div>
      <div class="yearly-fortune-scores">
        <div class="yf-score-item">
          <div class="yf-score-header"><b>金運</b></div>
          <div class="yf-score-bar"><i style="width:${yearlyFortune.moneyScore}%;background:linear-gradient(90deg,#d4a843,#f0d060)"></i></div>
          <div class="yf-score-num">${yearlyFortune.moneyScore}点</div>
        </div>
        <div class="yf-score-item">
          <div class="yf-score-header"><b>恋愛運</b></div>
          <div class="yf-score-bar"><i style="width:${yearlyFortune.loveScore}%;background:linear-gradient(90deg,#e04848,#ff8080)"></i></div>
          <div class="yf-score-num">${yearlyFortune.loveScore}点</div>
        </div>
        <div class="yf-score-item">
          <div class="yf-score-header"><b>仕事運</b></div>
          <div class="yf-score-bar"><i style="width:${yearlyFortune.workScore}%;background:linear-gradient(90deg,#4080e0,#80b0ff)"></i></div>
          <div class="yf-score-num">${yearlyFortune.workScore}点</div>
        </div>
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
        const goNames = allTopo.filter((r) => r.group === "合法").map((r) => r.name);
        const sanNames = allTopo.filter((r) => r.group === "散法").map((r) => r.name);
        return `<div class="yearly-fortune-topo expert-only">
          <h4>位相法による運勢の補足</h4>
          ${topoSummary ? `<div class="topology-summary">
            <div class="topology-summary-title">${topoSummary.title}</div>
            <div class="topology-summary-text">${topoSummary.text}</div>
            <div class="topology-summary-advice"><b>アドバイス：</b>${topoSummary.advice}</div>
          </div>` : ''}
          <div class="topology-tags">
            ${goNames.length ? `<div class="topo-tag-group"><span class="topo-tag-label">合法</span>${goNames.map((n) => `<span class="topo-mini-tag tag-go">${n}</span>`).join("")}</div>` : ''}
            ${sanNames.length ? `<div class="topo-tag-group"><span class="topo-tag-label">散法</span>${sanNames.map((n) => `<span class="topo-mini-tag tag-san">${n}</span>`).join("")}</div>` : ''}
          </div>
        </div>`;
      })()}
    </div>
    <div class="result-card reading">
      <h3>性格と課題</h3>
      ${reading.map((item) => { const isDetailOnly = item.title.includes("詳細") || item.title.includes("タイミング") || item.title.includes("エネルギー傾向") || item.title.includes("バランスと課題") || item.title.includes("注意が必要な時期") || item.title.includes("長所") || item.title.includes("短所"); const cls = (item.title.includes("長所") ? "is-good" : item.title.includes("短所") ? "is-bad" : item.title.includes("優秀度") ? "is-work-ex" : item.title.includes("仕事") ? "is-work" : item.title.includes("恋愛") ? "is-love" : item.title.includes("金銭") ? "is-money" : item.title.includes("結婚") ? "is-marriage" : item.title.includes("社交") ? "is-social" : item.title.includes("×日干") ? "is-star-detail" : item.title.includes("裏の") ? "is-hidden" : "") + (isDetailOnly ? " expert-only" : ""); const isWorkEx = item.title.includes("優秀度"); const scoreMatch = item.text.match(/スコア：(\d+)点/); const scoreNum = scoreMatch ? parseInt(scoreMatch[1]) : 0; const rankMatch = item.text.match(/（(.+?)）/); const rankText = rankMatch ? rankMatch[1] : ""; const detailText = item.text.replace(/総合仕事優秀度スコア：\d+点（.+?）\n/, ""); return `<article class="${cls}"><h4>${item.title}</h4><div>${isWorkEx && scoreNum ? `<div class="work-ex-score-wrap"><div class="work-ex-score-num">${scoreNum}<span>点</span></div><div class="work-ex-rank-badge">${rankText}</div></div><div class="work-ex-bar"><div class="work-ex-bar-fill" style="width:${scoreNum}%"></div></div><div class="work-ex-detail">${detailText}</div>` : item.text}</div></article>`; }).join("")}
    </div>
    ${(() => {
      if (seimeiResult.error) {
        return `<div class="result-card seimei-card expert-only">
          <h3>姓名判断</h3>
          <p style="color:var(--muted);font-size:13px">${seimeiResult.error}</p>
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
          <p style="color:var(--muted);font-size:12px;margin-top:6px">${r.tenJinRel === "相生" ? "天格から人格へは相生（支え合う）の流れがあり、環境から個人の運への援助が得やすい。" : r.tenJinRel === "相剋" ? "天格から人格へは相剋（ぶつかり合う）の流れがあり、家庭背景と個人の方向性に摩擦が生じやすい。" : "天格と人格は同じ性質（比和）で、安定感がある。"}${r.jinChiRel === "相生" ? "人格から地格へも相生で、内面と行動が一致しやすい。" : r.jinChiRel === "相剋" ? "人格から地格へは相剋で、思っていることと行動にズレが生じやすい。" : "人格と地格も同じ性質（比和）で、内面と外面の調和が取りやすい。"}</p>
        </div>
        <div class="seimei-fortune-scores">
          <div class="seimei-fs-item">
            <div class="seimei-fs-header"><b>金運</b></div>
            <div class="seimei-fs-bar"><i style="width:${r.moneyFortune}%;background:linear-gradient(90deg,#d4a843,#f0d060)"></i></div>
            <div class="seimei-fs-num">${r.moneyFortune}点</div>
          </div>
          <div class="seimei-fs-item">
            <div class="seimei-fs-header"><b>恋愛運</b></div>
            <div class="seimei-fs-bar"><i style="width:${r.loveFortune}%;background:linear-gradient(90deg,#e04848,#ff8080)"></i></div>
            <div class="seimei-fs-num">${r.loveFortune}点</div>
          </div>
          <div class="seimei-fs-item">
            <div class="seimei-fs-header"><b>仕事運</b></div>
            <div class="seimei-fs-bar"><i style="width:${r.workFortune}%;background:linear-gradient(90deg,#4080e0,#80b0ff)"></i></div>
            <div class="seimei-fs-num">${r.workFortune}点</div>
          </div>
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
      <p style="color:var(--muted);font-size:12px;margin:14px 0 8px">陰占表（高尾式）</p>
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
      <h3>異常干支</h3>
      ${(() => {
        const pillarLabels = { year: "年柱", month: "月柱", day: "日柱" };
        const matches = ["year", "month", "day"].map((key) => {
          const p = pillars[key];
          const info = getAbnormalZodiac(p.stem, p.branch);
          return info ? { key, stem: p.stem, branch: p.branch, info } : null;
        }).filter(Boolean);
        if (matches.length === 0) {
          return '<p style="color:var(--muted);font-size:13px">この命式に異常干支はありません（通常干支）。</p>';
        }
        return `
          <p style="color:var(--muted);font-size:13px;margin:0 0 10px">異常干支とは、精神面で強い個性（鋭い感性・霊感・先見の明など）が出やすい60干支中13種の特殊な干支です。日柱にある場合が最も影響大。強烈TOP3は「丁亥・壬午・辛巳」で、この3つは月柱・年柱にあっても影響が出やすいとされます。</p>
          <div class="abnormal-list">
            ${matches.map((m) => {
              const isTop = abnormalTopThree.includes(m.stem + m.branch);
              return `<div class="abnormal-item">
                <div class="abnormal-head">
                  <span class="pillar-tag">${pillarLabels[m.key]}</span>
                  <b>${m.stem}${m.branch}</b>
                  <span class="abnormal-type">${m.info.type}異常干支</span>
                  ${isTop ? '<span class="tenchu-badge">強烈TOP3</span>' : ''}
                </div>
                <div class="abnormal-body">十二大従星: ${m.info.star}${m.info.note ? ` ／ ${m.info.note}` : ''}</div>
              </div>`;
            }).join("")}
          </div>
        `;
      })()}
    </div>
    <div class="result-card expert-only">
      <h3>内面のバランス</h3>
      <div class="bars">${Object.entries(counts).map(([key, value]) => `<div class="bar-row"><b>${key}</b><div class="bar"><i style="width:${(value / maxCount) * 100}%"></i></div><span>${value}</span></div>`).join("")}</div>
    </div>
    <div class="result-card expert-only">
      <h3>位相法（地支の関係性）</h3>
      <p style="color:var(--muted);font-size:13px;margin:0 0 10px">年支・月支・日支の間に成立する関係を8種類の位相法で判定します。合法は結びつき・融合を、散法は衝突・ストレス・分裂を意味します。</p>
      ${(() => {
        if (topologyResults.length === 0) {
          return '<p style="color:var(--muted);font-size:13px">この命式の三柱間に位相法の関係は検出されませんでした。</p>';
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
    <div class="result-card expert-only">
      <h3>宿命天中殺（詳細判定）</h3>
      <p style="color:var(--muted);font-size:13px;margin:0 0 10px">宿命天中殺は、生日干支の天中殺範囲に年支・月支が含まれるか、生年干支の天中殺範囲に日支が含まれるかで判定します。日座・日居は特定の干支のみ該当します。</p>
      ${(() => {
        const items = [];
        if (fateTenchu.seinen) items.push({ name: "生年天中殺", note: "生日干支の天中殺範囲に年支が含まれる。常識の枠を持たず、型破りな人生になりやすい。" });
        if (fateTenchu.seigetsu) items.push({ name: "生月天中殺", note: "生日干支の天中殺範囲に月支が含まれる。家系を離れて他の家系に入る（養子・結婚など）と成功しやすい。" });
        if (fateTenchu.seinichi) items.push({ name: "生日天中殺", note: "生年干支の天中殺範囲に日支が含まれる。自己完結しやすく、独自の世界観を持つ。" });
        if (fateTenchu.kokan) items.push({ name: "互換中殺", note: "生年天中殺と生日天中殺が同時に成立。年と日が相互に天中殺し合う特殊な関係。" });
        if (fateTenchu.dayZa) items.push({ name: "日座天中殺", note: "日干支が甲戌または乙亥。純粋な宿命天中殺で、子供と夫婦間のバランスを取りにくいが、生家を出れば成功できる。" });
        if (fateTenchu.dayKyo) items.push({ name: "日居天中殺", note: "日干支が甲辰または乙巳。東と西が欠ける天中殺で、現実と精神のギャップが激しく「異世界」がキーワード。" });
        if (fateTenchu.shukumei2) items.push({ name: "宿命二中殺", note: "生年天中殺と生月天中殺の両方を保持。自分以外頼れるものはない状態だが、それが強さの源泉にもなる。" });
        if (fateTenchu.zenTenchusatsu) items.push({ name: "全天中殺", note: "日座天中殺＋生月天中殺＋生年天中殺の全てが成立。「参禅の行とする」と言われる特別な宿命。" });
        if (items.length === 0) {
          return '<p style="color:var(--muted);font-size:13px">この命式に宿命天中殺の型は検出されませんでした（通常命式）。</p>';
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
      <h3>守護神</h3>
      <p style="color:var(--muted);font-size:13px;margin:0 0 10px">全体守護神は、内面のバランスを整える要素です。強すぎる性質を抑え、足りない性質を補うものが守護神となります（蔵干は考慮しません）。</p>
      ${(() => {
        if (guardian.isBalanced) {
          return '<p style="color:var(--muted);font-size:13px">バランスが均等に配置されており、特定の守護神は不要なバランスの良い命式です。</p>';
        }
        const guardianNames = guardian.guardians.map((g) => `${g}（${gogyoMeaning[g]}）`).join("・");
        const strongNames = guardian.strongest.join("・");
        const weakNames = guardian.weakest.join("・");
        return `
          <div class="guardian-section">
            <div class="guardian-row"><b>最も強い性質</b><span>${strongNames}</span></div>
            <div class="guardian-row"><b>最も弱い性質</b><span>${weakNames}</span></div>
            <div class="guardian-row guardian-highlight"><b>全体守護神</b><span>${guardianNames}</span></div>
          </div>
          <div style="font-size:12px;color:var(--muted);margin-top:10px">守護神の性質を日頃の生活や行動に取り入れることで、心のバランスを保ちやすくなります。命式内に守護神がなくても、意識的に取り入れることで効果が期待できます。</div>
        `;
      })()}
    </div>
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
    <div class="result-card reading">
      <h3 class="expert-only">恋愛・結婚・離婚・浮気（不倫）傾向</h3>
      <h3 class="simple-only">恋愛・結婚の傾向</h3>
      ${(() => {
        const spouseEnergy = getEnergyStar(day.stem, day.branch);
        const isDoubleEn = mainStars.east === mainStars.west || yinYangPairStar[mainStars.east] === mainStars.west;
        const isInheritEn = mainStars.north === mainStars.south || yinYangPairStar[mainStars.north] === mainStars.south;
        const chongBranch = getChongBranch(day.branch);
        const thisYear = 2026;
        const divorceYears = [];
        for (let y = thisYear; y <= thisYear + 12 && divorceYears.length < 3; y++) {
          if (getYearPillarForYear(y).branch === chongBranch) divorceYears.push(y);
        }
        const abnormalMatches = ["year", "month", "day"].map((key) => getAbnormalZodiac(pillars[key].stem, pillars[key].branch)).filter(Boolean);
        const hasAbnormal = abnormalMatches.length > 0;
        const hasTopThreeAbnormal = ["year", "month", "day"].some((key) => abnormalTopThree.includes(pillars[key].stem + pillars[key].branch));
        const gogyoVals = Object.values(counts);
        const gogyoBalance = Math.max(...gogyoVals) - Math.min(...gogyoVals);
        const affairScore = getAffairRiskScore({
          westStar: mainStars.west,
          spouseEnergyName: spouseEnergy.name,
          isDoubleEn,
          hasAbnormal,
          hasTopThreeAbnormal,
          centerStar: mainStars.center,
          northStar: mainStars.north,
          southStar: mainStars.south,
          eastStar: mainStars.east,
          dayStem: day.stem,
          gogyoBalance
        });
        const affairLevel = affairScore >= 80 ? "高危険" : affairScore >= 65 ? "要注意" : affairScore >= 45 ? "普通" : affairScore >= 25 ? "低め" : "安心";
        const simpleAffairLevel = affairScore >= 80 ? "要注意" : affairScore >= 65 ? "注意が必要" : affairScore >= 45 ? "普通" : affairScore >= 25 ? "低め" : "安心";
        const affairRankClass = affairScore >= 80 ? "danger" : affairScore >= 65 ? "warning" : affairScore >= 45 ? "normal" : affairScore >= 25 ? "low" : "safe";
        const affairScoreColor = affairScore >= 80 ? "#ff5050" : affairScore >= 65 ? "#f0a040" : affairScore >= 45 ? "#e0c060" : affairScore >= 25 ? "#80d080" : "#60c0e0";
        const marriageAges = getMarriageAges(day, pillars, taiun, tenchusatsu, birthYear, currentAge);
        const loveAges = getLoveAges(day, pillars, taiun, tenchusatsu, birthYear, currentAge);
        const loveAgesHtml = loveAges.length > 0
          ? loveAges.map((y) => `<div style="margin-bottom:8px"><b>${y.age}歳</b>（${y.year}年）${y.reasons.length > 0 ? "：" + y.reasons.join("、") : ""}</div>`).join("")
          : "恋愛に特に有利な時期は検出されませんでした。";
        const loveAgesHtmlSimple = loveAges.length > 0
          ? loveAges.map((y) => `<div style="margin-bottom:8px"><b>${y.age}歳</b>（${y.year}年）</div>`).join("")
          : "恋愛に特に有利な時期は見つかりませんでした。";
        const marriageAgesHtml = marriageAges.length > 0
          ? marriageAges.map((y) => `<div style="margin-bottom:8px"><b>${y.age}歳</b>（${y.year}年）${y.reasons.length > 0 ? "：" + y.reasons.join("、") : ""}</div>`).join("")
          : "結婚に特に有利な時期は検出されませんでした。";
        const marriageAgesHtmlSimple = marriageAges.length > 0
          ? marriageAges.map((y) => `<div style="margin-bottom:8px"><b>${y.age}歳</b>（${y.year}年）</div>`).join("")
          : "結婚に特に有利な時期は見つかりませんでした。";
        return `
          <div class="expert-only">
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
            <div>${isDoubleEn ? `左手（東・${mainStars.east}）と右手（西・${mainStars.west}）が同じ、または陰陽ペアの関係にあり、二度の結婚運（二度縁）の傾向があります。離婚しても宿命の消化であり、再び結婚の縁が巡るとされます。` : "東西の主星に二度縁の型は出ていません。一度の結婚に集中しやすいタイプです。"}</div>
          </article>
          ${isInheritEn ? `<article><h4>参考：相続の型</h4><div>頭（北・${mainStars.north}）と腹（南・${mainStars.south}）が同じ、または陰陽ペアの関係にあり、これは相続運を示す型です。結婚とは直接関係しませんが、家系・財産の継承に縁が出やすいことを意味します。</div></article>` : ""}
          <article>
            <h4>浮気・不倫の傾向</h4>
            <div>配偶者との関係性が現れやすい右手（西）の主星は「${mainStars.west}」。${pickByBalance(affairTendencyTexts[mainStars.west], balanceType)}</div>
            <div class="affair-risk-score-wrap">
              <div class="affair-risk-score-num" style="color:${affairScoreColor}">${affairScore}<span>点</span></div>
              <div class="affair-risk-rank-badge affair-risk-rank-${affairRankClass}">${affairLevel}</div>
            </div>
            <div class="affair-risk-bar"><div class="affair-risk-bar-fill ${affairRankClass}" style="width:${affairScore}%"></div></div>
            <div style="font-size:12px;color:var(--muted);margin-top:6px">全主星（中央・北・南・東・西）の傾向＋配偶者宮（日支）の十二大従星＋二度縁の型＋異常干支＋日干の陰陽＋内面のバランスの偏りから総合的に算出した目安です。断定ではなく傾向として参考にしてください。</div>
          </article>
          <article>
            <h4>天中殺と結婚・離婚</h4>
            <div>宿命は${tenchusatsu}天中殺。天中殺の期間中の結婚はご縁が不安定になりやすいため避けるのが無難です。反対に離婚は「二度と縁が繋がらない」ほど綺麗に切れるとされますが、天中殺中は慰謝料や財産分与などの金銭的要求が通りにくい点に注意してください。</div>
          </article>
          <article>
            <h4>結婚に適した時期（結婚年齢）</h4>
            <div>${marriageAgesHtml}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:6px">大運・年運の支合（日支との引き合い）、三合会局の完成、結婚に良い星（禄存星・司禄星・石門星・玉堂星・牽牛星）の流れを総合し、天中殺期間を除外した時期を表示しています。断定ではなく目安として参考にしてください。</div>
          </article>
          <article>
            <h4>恋愛しやすい時期</h4>
            <div>${loveAgesHtml}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:6px">大運・年運の支合、半会・三合会局の強まり、恋愛に良い星（鳳閣星・調舒星・禄存星・車騎星・龍高星・石門星）の流れを総合し、天中殺期間を除外した時期を表示しています。</div>
          </article>
          </div>
          <div class="simple-only">
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
              <div class="affair-risk-score-num" style="color:${affairScoreColor}">${affairScore}<span>点</span></div>
              <div class="affair-risk-rank-badge affair-risk-rank-${affairRankClass}">${simpleAffairLevel}</div>
            </div>
            <div class="affair-risk-bar"><div class="affair-risk-bar-fill ${affairRankClass}" style="width:${affairScore}%"></div></div>
            <div style="font-size:12px;color:var(--muted);margin-top:6px">全体的な性格・家庭運・結婚運・生まれ持った性質のバランスから総合的に算出した目安です。</div>
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
      <p class="expert-only" style="color:var(--muted);font-size:12px;margin:0 0 14px">十大主星の魅力特性・内面のバランス・日干の陰陽・十二大従星のエネルギー・異常干支を総合して算出しています。あくまで宿命的な素質の目安です。</p>
      <p class="simple-only" style="color:var(--muted);font-size:13px;margin:0 0 14px;line-height:1.7">生まれ持った性格や魅力の傾向から、異性・同性それぞれからの人気度を計算しています。あくまで目安です。</p>
      <div class="mote-scores">
        <div class="mote-score-item mote-opposite">
          <div class="mote-score-header"><b>異性からのモテ度</b></div>
          <div class="mote-score-rank rank-${mote.oppositeRank.rank}">${mote.oppositeRank.rank}</div>
          <div class="mote-score-bar"><i style="width:${mote.oppositeScore}%"></i></div>
          <div class="mote-score-num">${mote.oppositeScore}点</div>
          <div class="mote-score-label">${mote.oppositeRank.label}</div>
        </div>
        <div class="mote-score-item mote-same">
          <div class="mote-score-header"><b>同性からのモテ度</b></div>
          <div class="mote-score-rank rank-${mote.sameRank.rank}">${mote.sameRank.rank}</div>
          <div class="mote-score-bar"><i style="width:${mote.sameScore}%"></i></div>
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
    <div class="result-card expert-only">
      <h3>大運（10年周期の運気）</h3>
      <p style="color:var(--muted);font-size:13px;margin:0 0 8px">${taiun.forward ? "順行" : "逆行"} / 立運${taiun.startAge}歳</p>
      <div class="taiun-flow">
        ${taiun.periods.map((p) => {
          const isCurrent = currentAge >= p.age && currentAge <= p.ageTo;
          const mainStar = getMainStar(day.stem, p.stem);
          const topoResults = analyzeBranchTopology(p.branch, pillars);
          const topoTags = topoResults.map((r) => `<span class="topo-mini-tag${r.group === '合法' ? ' tag-go' : ' tag-san'}">${r.name}</span>`).join("");
          return `<div class="taiun-item${isCurrent ? " current" : ""}">
            <span class="age">${p.age}〜${p.ageTo}歳</span>
            <span class="pillar">${p.stem}${p.branch}</span>
            <span class="star-label">${mainStar}</span>
            ${topoTags ? `<div class="taiun-topo-tags">${topoTags}</div>` : ''}
          </div>`;
        }).join("")}
      </div>
    </div>
    <div class="result-card">
      <h3 class="expert-only">運気の流れ</h3>
      <h3 class="simple-only">人生の流れ</h3>
      <p class="expert-only" style="color:var(--muted);font-size:12px;margin:0 0 14px">10年周期の運気を3つのライフステージ（幼少期・中年期・晩年期）に分け、各時期の運勢スコア・総評・大運の十二大従星による詳細解説を表示します。現在の年代はハイライトされます。</p>
      <p class="simple-only" style="color:var(--muted);font-size:13px;margin:0 0 14px;line-height:1.7">人生の流れを3つの期間に分け、それぞれの時期に何が起きやすいかを詳しく解説します。</p>
      ${(() => {
        const stages = analyzeLifeStageFortune(day, pillars, taiun, tenchusatsu, currentAge);
        const scoreColor = (s) => s >= 70 ? "#70d0a0" : s >= 55 ? "#a0c060" : s >= 40 ? "#c0a050" : "#c05050";
        const scoreRank = (s) => s >= 70 ? "A" : s >= 55 ? "B" : s >= 40 ? "C" : "D";
        const simpleRank = (s) => s >= 70 ? "良い" : s >= 55 ? "やや良い" : s >= 40 ? "普通" : "注意";
        return stages.map((st) => `
          <div class="life-stage${st.isCurrent ? " current" : ""}">
            <div class="life-stage-header">
              <div class="life-stage-title">
                <h4>${st.label}</h4>
                ${st.isCurrent ? '<span class="life-stage-now">現在</span>' : ""}
              </div>
              <div class="life-stage-score" style="color:${scoreColor(st.score)}">
                ${st.score}<small>点</small>
                <span class="life-stage-rank expert-only" style="background:${scoreColor(st.score)}">${scoreRank(st.score)}</span>
                <span class="simple-stage-rank simple-only" style="color:${scoreColor(st.score)}">${simpleRank(st.score)}</span>
              </div>
            </div>
            <div class="life-stage-bar"><div class="life-stage-bar-fill" style="width:${st.score}%;background:${scoreColor(st.score)}"></div></div>
            <p class="life-stage-desc expert-only">${st.desc}</p>
            <p class="life-stage-desc simple-only" style="color:var(--muted);font-size:13px;margin:4px 0 2px">${st.descSimple || st.desc}</p>
            <p class="life-stage-summary expert-only">${st.summary}</p>
            <p class="life-stage-summary simple-only">${st.summarySimple}</p>
            <p class="life-stage-advice expert-only"><b>アドバイス：</b>${st.advice}</p>
            <p class="life-stage-advice simple-only"><b>アドバイス：</b>${st.adviceSimple}</p>
            ${st.energyInterpretations && st.energyInterpretations.length > 0 ? `
              <div style="margin-top:12px;padding:12px 14px;border-radius:10px;background:rgba(100,150,200,0.06);border:1px solid rgba(100,150,200,0.15)">
                <p class="expert-only" style="font-size:12px;font-weight:600;margin:0 0 8px;color:#7ab0d0">大運の十二大従星から見るこの時期の特徴</p>
                <p class="simple-only" style="font-size:13px;font-weight:600;margin:0 0 8px;color:#7ab0d0">この時期の詳しい特徴</p>
                ${st.energyInterpretations.filter((e) => e.text).map((e) => `
                  <div style="margin-bottom:10px${e.isTenchu ? ";opacity:0.7" : ""}">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
                      <span style="font-size:12px;font-weight:600;color:var(--muted)">${e.age}</span>
                      <span style="font-size:13px;font-weight:600;color:#7ab0d0">${e.energy}</span>
                      <span style="font-size:11px;color:var(--muted)">（主星：${e.star}）</span>
                      ${e.isTenchu ? '<span style="font-size:11px;padding:1px 6px;border-radius:4px;background:rgba(192,80,80,0.15);color:#c05050">天中殺</span>' : ""}
                    </div>
                    <p style="font-size:13px;line-height:1.7;margin:0;color:var(--text)">${e.text}</p>
                  </div>
                `).join("")}
              </div>
            ` : ''}
            <div class="expert-only">
            ${st.taiunDetails.length > 0 ? `
              <div class="life-stage-taiun">
                ${st.taiunDetails.map((d) => `
                  <div class="life-stage-taiun-item${d.isTenchu ? " tenchu" : ""}">
                    <span class="lst-age">${d.age}</span>
                    <span class="lst-pillar">${d.stem}${d.branch}</span>
                    <span class="lst-star">${d.star}</span>
                    <span class="lst-rel">${d.rel}</span>
                    ${d.isTenchu ? '<span class="lst-tenchu">天中殺</span>' : ""}
                    <span class="lst-score" style="color:${scoreColor(d.score)}">${d.score}</span>
                  </div>
                `).join("")}
              </div>
            ` : '<p style="color:var(--muted);font-size:12px">この時期に該当する大運がありません。</p>'}
            </div>
          </div>
        `).join("");
      })()}
    </div>
    <div class="result-card">
      <h3 class="expert-only">人生のターニングポイント</h3>
      <h3 class="simple-only">人生のターニングポイント</h3>
      <p class="expert-only" style="color:var(--muted);font-size:12px;margin:0 0 14px">大運の切り替わり・天中殺・位相法・陽占・陰占を総合し、最も重要なターニングポイントを最大2つ表示します。</p>
      <p class="simple-only" style="color:var(--muted);font-size:13px;margin:0 0 14px;line-height:1.7">人生の中で特に大きな変化が起こりやすい時期を、最大2つまで表示します。</p>
      ${(() => {
        if (turningPoints.length === 0) {
          return '<p style="color:var(--muted);font-size:13px">特筆すべきターニングポイントは検出されませんでした。</p>';
        }
        const typeLabel = (t) => {
          if (t === "大運切り替わり") return "運気の切り替わり";
          if (t === "天中殺開始") return "天中殺の開始";
          if (t === "天中殺終了") return "天中殺の終了（明け）";
          if (t === "運気の転換") return "運気の転換";
          if (t === "運気の好転") return "運気の好転";
          return t;
        };
        const typeColor = (t) => {
          if (t === "天中殺開始") return "#c05050";
          if (t === "天中殺終了") return "#70d0a0";
          if (t === "運気の好転") return "#70d0a0";
          if (t === "運気の転換") return "#c0a050";
          return "#d4a843";
        };
        return turningPoints.map((tp) => `
          <div class="turning-point${tp.isTenchu ? " tenchu" : ""}" style="padding:12px 14px;border-radius:12px;background:rgba(217,164,65,0.06);border:1px solid var(--border);margin-bottom:10px">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
              <b style="font-size:16px;color:${typeColor(tp.type)}">${tp.age}歳</b>
              <span style="font-size:13px;color:var(--muted)">（${tp.year}年）</span>
              <span style="font-size:12px;padding:2px 8px;border-radius:6px;background:${typeColor(tp.type)}22;color:${typeColor(tp.type)};font-weight:600">${typeLabel(tp.type)}</span>
              ${tp.isTenchu ? '<span style="font-size:12px;padding:2px 8px;border-radius:6px;background:rgba(192,80,80,0.15);color:#c05050;font-weight:600">天中殺</span>' : ""}
            </div>
            <ul style="margin:0;padding-left:20px;line-height:1.7;font-size:13px;color:var(--text)">
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
            const topoResults = analyzeBranchTopology(yp.branch, pillars);
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
            return '<p class="expert-only" style="color:var(--muted);font-size:13px">バランスが均等に配置されており、特定の臓器への偏りリスクは低いバランスの良い命式です。</p><p class="simple-only" style="color:var(--muted);font-size:13px">バランスが良く、特定の臓器への偏りリスクは低いタイプです。</p>';
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
        <p class="expert-only" style="color:var(--muted);font-size:12px;margin:0 0 12px">高危険レベル（リスクスコア50点以上）の年について、命式のバランス偏りと年運・大運の相互作用から想定される重大な疾患リスクを表示します。該当年は必ず定期健康診断を受け、該当臓器の検査を早めに行ってください。</p>
        <p class="simple-only" style="color:var(--muted);font-size:13px;margin:0 0 12px;line-height:1.7">健康リスクが高まる年について表示します。該当年は必ず定期健康診断を受け、該当する検査を早めに行ってください。</p>
        ${(() => {
          const major = healthRisk.majorDiseaseRisks || [];
          if (major.length === 0) {
            return '<p class="expert-only" style="color:var(--muted);font-size:13px">現時点で大病リスクが高まる年は検出されませんでした。バランスと年運の関係から見て、比較的安定しています。ただし年齢とともに定期健診は必須です。</p><p class="simple-only" style="color:var(--muted);font-size:13px">今のところ、特に大きな健康リスクが高まる年は見つかりませんでした。比較的安定していますが、年齢とともに定期健診は必須です。</p>';
          }
          const levelClass = { "高危険": "health-risk-high" };
          const topRisk = major[0];
          const topDiseaseName = topRisk.majorDiseases.length > 0
            ? topRisk.majorDiseases[0].diseases.split("・")[0]
            : "特定の疾患";
          return `<div class="simple-only" style="padding:14px 16px;border-radius:12px;background:rgba(192,80,80,0.1);border:1px solid rgba(192,80,80,0.3);margin-bottom:12px">
            <div style="font-size:15px;line-height:1.7">
              <b style="color:#e05050">最も注意が必要なのは${topRisk.year}年（${topRisk.age}歳）の「${topDiseaseName}」</b>です。
            </div>
            <div style="font-size:13px;color:var(--muted);margin-top:6px;line-height:1.6">
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
                <div class="health-risk-bar"><i style="width:${r.riskScore}%"></i></div>
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
    </div>
    <div class="result-card reading expert-only">
      <h3>六親法（家系図・縁の深さ）</h3>
      <p style="color:var(--muted);font-size:12px;margin:0 0 14px;line-height:1.7">六親法とは、日干（自分）を中心に家族の干を算出し、宿命の陰占内にその干が存在するかで縁の深さを判定する技法です。<br>縦線（親→子）は「相生」関係、横線（結婚）は「干合」関係で結びます。</p>
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
              <div class="six-parents-depth" style="color:${depthColor(r.depth)}">${r.depth}<small style="display:block;font-size:0.7em;font-weight:400;opacity:0.7">${depthComment(r.depth)}</small></div>
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
    dayEnergy: energy[2] ? energy[2].name : ""
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
