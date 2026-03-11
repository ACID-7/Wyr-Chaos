/* ============================================================
   data.js — all content for Would You Rather: Chaos Edition
   ============================================================ */

const ALL_QUESTIONS = {

  couple: [
    { q:"Your partner suggests a spontaneous weekend trip. Would you rather",          a:"pack in 10 minutes and drive with no destination",         b:"stay home, build a blanket fort, and pretend you're far away",   ea:"🚗",eb:"🏕️" },
    { q:"For a date night in, would you rather",                                       a:"cook a fancy 3-course meal together from scratch",           b:"order every single item from your favourite takeaway menu",      ea:"👨‍🍳",eb:"🍱" },
    { q:"Your partner's love language — would you rather they showed love through",    a:"massive grand romantic gestures that make others jealous",    b:"tiny daily acts so thoughtful only YOU notice them",             ea:"🌹",eb:"🫶" },
    { q:"When you fight, would you rather",                                            a:"do the silent treatment but then laugh it off together",       b:"scream-argue passionately and resolve it within the hour",       ea:"🤐",eb:"🔥" },
    { q:"On your anniversary, would you rather",                                       a:"recreate your very first date exactly",                        b:"do something wildly new that neither of you has ever tried",     ea:"🎞️",eb:"🪂" },
    { q:"Would you rather your partner be",                                            a:"outrageously funny but forgets EVERY important date",          b:"incredibly romantic and remembers everything but has NO humour", ea:"😂",eb:"💐" },
    { q:"On holiday together, would you rather",                                       a:"7 days doing absolutely nothing on a private beach",           b:"a 10-city whirlwind with packed schedules and adventures",       ea:"🏖️",eb:"✈️" },
    { q:"Would you rather move in with your partner and discover they",                a:"leave dishes in the sink for days but clean EVERYTHING else", b:"have immaculate dishes but never clean the bathroom",            ea:"🍽️",eb:"🛁" },
    { q:"For movie night, would you rather your partner pick",                         a:"a devastating 3-hour epic that makes you both ugly-cry",       b:"an objectively terrible film you both MST3K the whole way",      ea:"😭",eb:"🎬" },
    { q:"Would you rather your partner be",                                            a:"a morning person who wakes you with coffee, singing, and joy", b:"a night owl who plans wild 2am adventures on impulse",           ea:"☀️",eb:"🌙" },
    { q:"For your partner's birthday surprise, would you rather plan",                 a:"a perfectly curated party with all their closest people",      b:"a mystery 48-hour adventure where they don't know the plan",     ea:"🎉",eb:"🗺️" },
    { q:"Would you rather your relationship have",                                     a:"zero boredom but occasional chaos and big arguments",          b:"total peace and stability but things feel slightly routine",      ea:"⚡",eb:"🕊️" },
  ],

  spicy: [
    { q:"Would you rather",                                                            a:"reveal your entire browser history to your partner",           b:"let your partner read all your text messages for 1 year",        ea:"🌐",eb:"💬" },
    { q:"Would you rather date someone who is",                                        a:"always right — and usually is",                               b:"always thinks they're right — and usually isn't",               ea:"✅",eb:"🤦" },
    { q:"Would you rather your partner secretly",                                      a:"hates all your friends but is perfectly polite",               b:"loves your friends more than they love you",                    ea:"😬",eb:"🥳" },
    { q:"Would you rather know",                                                       a:"every lie your partner has ever told you",                     b:"the one thing about yourself they would never tell you",         ea:"😰",eb:"🪞" },
    { q:"Would you rather",                                                            a:"be in a relationship where you love slightly more",            b:"be loved slightly more than you love back",                     ea:"💔",eb:"🥲" },
    { q:"Would you rather your partner",                                               a:"be madly in love but terrible at expressing it",               b:"be excellent at romantic gestures but emotionally unavailable",  ea:"❤️",eb:"🌹" },
    { q:"Would you rather your partner",                                               a:"still talks to their ex occasionally — all very innocent",     b:"deleted their ex completely but has a shrine of old memories",   ea:"📱",eb:"📦" },
    { q:"Would you rather",                                                            a:"never fight but also never have deep conversations",           b:"fight intensely but always resolve with raw brutal honesty",     ea:"🕊️",eb:"🔥" },
    { q:"Would you rather",                                                            a:"know your partner checked you out before you got together",    b:"find out they had a crush on your best friend first",            ea:"👀",eb:"😳" },
    { q:"Would you rather your partner choose",                                        a:"a surprise weekend away without asking your input",            b:"plan everything together — even the smallest details",           ea:"🗓️",eb:"🤝" },
  ],

  silly: [
    { q:"Would you rather",                                                            a:"only communicate in memes for an entire week",                b:"only speak in song lyrics for an entire week",                  ea:"😂",eb:"🎵" },
    { q:"Would you rather",                                                            a:"accidentally call your partner by your ex's name at dinner",   b:"accidentally send your most embarrassing selfie to your boss",   ea:"💀",eb:"😵" },
    { q:"Would you rather",                                                            a:"always smell faintly of fresh baked cookies but never showered", b:"shower daily but inexplicably smell of boiled eggs anyway",    ea:"🍪",eb:"🥚" },
    { q:"Would you rather",                                                            a:"have a narrator read every thought you have out loud",         b:"have a laugh track play whenever you say something cringe",     ea:"📢",eb:"😆" },
    { q:"Would you rather",                                                            a:"permanently walk like a penguin",                             b:"make dolphin sounds every single time you laugh",               ea:"🐧",eb:"🐬" },
    { q:"Would you rather",                                                            a:"burst into spontaneous uncontrollable dance when music plays", b:"break into full musical theatre singing at random moments",      ea:"💃",eb:"🎤" },
    { q:"Would you rather",                                                            a:"sneeze actual glitter every single time",                      b:"hiccup soap bubbles in every meeting or conversation",          ea:"✨",eb:"🫧" },
    { q:"Would you rather own a pet that",                                             a:"can roast you better than your funniest friend",              b:"predicts your future but is always cryptically vague",          ea:"🦜",eb:"🔮" },
    { q:"Would you rather",                                                            a:"only eat foods that are physically shaped like your face",     b:"have your face printed on every food label in every shop",      ea:"🍩",eb:"🏪" },
    { q:"Would you rather for one month",                                              a:"have to narrate everything you do in the third person",        b:"refer to yourself exclusively as 'The Supreme One'",            ea:"🗣️",eb:"👑" },
    { q:"Would you rather your laugh be",                                              a:"an incredibly loud, braying donkey hee-haw that you cannot control", b:"completely silent, just shoulders shaking and tears streaming", ea:"🫏",eb:"😶" },
    { q:"Would you rather have the superpower of",                                     a:"being able to instantly fall asleep anywhere but only for 4 min", b:"never needing sleep but being mildly sleepy every single moment", ea:"😴",eb:"🥱" },
  ],

  deep: [
    { q:"Would you rather",                                                            a:"live a short, extraordinary life full of peak experiences",    b:"live a very long life of quiet, steady ordinary happiness",      ea:"⚡",eb:"🌿" },
    { q:"Would you rather know",                                                       a:"the exact date of your death",                                b:"the exact cause of your death",                                 ea:"📅",eb:"⚠️" },
    { q:"Would you rather",                                                            a:"be remembered forever by people who never really knew you",    b:"be deeply loved by a small circle who knew you completely",      ea:"🌍",eb:"💞" },
    { q:"Would you rather have",                                                       a:"unlimited intelligence but no emotional depth",               b:"profound emotional intelligence but average intellect",         ea:"🧠",eb:"💛" },
    { q:"Would you rather",                                                            a:"always know when someone is lying to you",                    b:"never be lied to — but also never told a hard truth",           ea:"🔍",eb:"🫶" },
    { q:"Would you rather",                                                            a:"change one major decision from your past",                    b:"see one major event from your future",                          ea:"⏪",eb:"⏩" },
    { q:"Would you rather",                                                            a:"have complete financial security but a mediocre career",      b:"do your dream job but always live paycheck to paycheck",        ea:"💰",eb:"🌟" },
    { q:"Would you rather",                                                            a:"know your true purpose in life",                              b:"have the freedom to create your own purpose from scratch",      ea:"🧭",eb:"🎨" },
    { q:"Would you rather",                                                            a:"be universally liked but no one truly knows you",             b:"be deeply known by the people who matter and polarising to strangers", ea:"😊",eb:"🪞" },
    { q:"Would you rather your legacy be",                                             a:"a single world-changing idea that outlives you by centuries",  b:"the profound positive impact on the lives of 10 people",        ea:"💡",eb:"🤝" },
  ],

  chaos: [
    { q:"CHAOS ROUND — Would you rather",                                              a:"swap bodies with your partner for an entire week",            b:"let your partner read your mind for 24 hours only",             ea:"🔄",eb:"🧠" },
    { q:"CHAOS ROUND — Would you rather face",                                         a:"100 duck-sized versions of your partner in a debate",         b:"one horse-sized version of your partner in an argument",        ea:"🦆",eb:"🐴" },
    { q:"CHAOS ROUND — Would you rather be teleported to",                             a:"medieval times with your partner — no modern knowledge",      b:"year 3025 alone — with one stranger as your guide",             ea:"⚔️",eb:"🚀" },
    { q:"CHAOS ROUND — Would you rather",                                              a:"lose all memories of your partner, but they remember everything", b:"remember everything perfectly, but they forget you completely", ea:"🧩",eb:"💭" },
    { q:"CHAOS ROUND — Would you rather",                                              a:"solve a riddle to open every door you encounter for life",     b:"sing a full song before completing any purchase ever",          ea:"🔐",eb:"🎶" },
    { q:"CHAOS ROUND — Would you rather",                                              a:"gain superpowers but your partner knows your only weakness",   b:"your partner gains superpowers but you know all of theirs",     ea:"🦸",eb:"🦹" },
    { q:"CHAOS ROUND — Would you rather",                                              a:"text your deepest secret to your entire contacts list right now", b:"have a live studio audience watch your phone screen for a day", ea:"📲",eb:"📺" },
    { q:"CHAOS ROUND — Would you rather",                                              a:"be the most famous person alive but no one knows your real name", b:"be completely unknown but know every secret of every famous person", ea:"🎭",eb:"🕵️" },
  ],

  dare: [
    { q:"Would you rather",                                                            a:"call the last person you texted and reveal one genuine fear",  b:"post a completely unfiltered selfie with your most chaotic caption RIGHT NOW", ea:"📞",eb:"🤳" },
    { q:"Would you rather",                                                            a:"let your partner style your full outfit for tomorrow with no preview", b:"have your partner plan your entire weekend in complete secrecy", ea:"👔",eb:"🗓️" },
    { q:"Would you rather",                                                            a:"hand your partner your phone right now — unlocked, no restrictions", b:"read your three most recent journal or notes entries aloud",   ea:"📱",eb:"📝" },
    { q:"Would you rather",                                                            a:"do 20 push-ups every time you lose a round in this game",     b:"eat a mystery food blindfolded chosen by your partner at the end", ea:"💪",eb:"🍽️" },
    { q:"Would you rather",                                                            a:"do your most embarrassing impression of your partner right now", b:"let your partner impersonate you while you watch in total silence", ea:"🎭",eb:"🪞" },
    { q:"Would you rather",                                                            a:"write a love poem about your partner in 90 seconds — read it aloud", b:"roast your partner savagely for 60 seconds while they smile and nod", ea:"❤️‍🔥",eb:"🔥" },
    { q:"Would you rather",                                                            a:"let your partner post anything from your camera roll to their story", b:"let your partner reply to any 3 of your Instagram DMs as you", ea:"📸",eb:"💬" },
    { q:"Would you rather",                                                            a:"serenade your partner with a song of their choice right now", b:"slow dance with your partner in public right now for 1 full minute", ea:"🎤",eb:"💃" },
  ],

  naughty: [
    { q:"Would you rather your partner",                                               a:"surprise you with a massage that turns into something more",   b:"leave little flirty notes hidden around the house all week",    ea:"💆",eb:"💌" },
    { q:"Would you rather",                                                            a:"be caught in a very compromising moment by your partner's sibling", b:"accidentally call your partner the wrong name at the worst possible time", ea:"😳",eb:"💀" },
    { q:"Would you rather your partner whisper",                                       a:"the most scandalous thing you've ever fantasised about",       b:"something so embarrassingly sweet it makes you cringe AND melt", ea:"🔥",eb:"🥹" },
    { q:"Would you rather",                                                            a:"never be able to keep a straight face during serious moments", b:"always laugh at the absolute worst possible moment",            ea:"😂",eb:"💀" },
    { q:"Would you rather your partner",                                               a:"initiate something unexpected on a random Tuesday night",      b:"plan an elaborate romantic evening that ends… very well",        ea:"😈",eb:"🌹" },
    { q:"Would you rather",                                                            a:"confess your most embarrassing fantasy to your partner",       b:"have your partner correctly guess it without being told",        ea:"🫢",eb:"😏" },
    { q:"Would you rather",                                                            a:"always be the one to make the first move",                    b:"always be the one who is pursued and surprised",               ea:"🏹",eb:"🫦" },
    { q:"Would you rather your partner",                                               a:"be incredibly confident and assertive",                        b:"be teasing, playful and keep you guessing all night",           ea:"😤",eb:"😉" },
    { q:"Would you rather",                                                            a:"recreate your best memory together exactly as it happened",    b:"create something completely new that tops it entirely",         ea:"🎞️",eb:"✨" },
    { q:"Would you rather your partner express love",                                  a:"through passionate intensity and complete presence",           b:"through slow, tender, unrushed attention to every detail",      ea:"🌋",eb:"🌊" },
    { q:"Would you rather",                                                            a:"always be completely in the mood but never say it",           b:"never be shy about it but sometimes get the timing wrong",      ea:"🔥",eb:"🎯" },
    { q:"Would you rather give your partner",                                          a:"the most meaningful gift they've ever received",               b:"the most physically memorable night of their life",             ea:"🎁",eb:"🌟" },
  ],

  horny: [
    { q:"AFTER DARK — Would you rather",                                               a:"your partner sends you a flirty text that ruins your focus all day", b:"your partner surprises you the moment you get home",           ea:"📱",eb:"🚪" },
    { q:"AFTER DARK — Would you rather",                                               a:"spend an entire evening with intense foreplay only — no finale", b:"skip straight to the main event every single time",             ea:"🕯️",eb:"⚡" },
    { q:"AFTER DARK — Would you rather your partner be",                               a:"completely dominant and in total control",                     b:"sweetly submissive and yours to command",                       ea:"👑",eb:"🎀" },
    { q:"AFTER DARK — Would you rather",                                               a:"be woken up in the most fun way imaginable",                   b:"fall asleep being held in the most intimate way possible",      ea:"🌅",eb:"🌙" },
    { q:"AFTER DARK — Would you rather",                                               a:"have your partner describe exactly what they want in full detail", b:"figure it out together with no words — just instinct",        ea:"🗣️",eb:"🤫" },
    { q:"AFTER DARK — Would you rather",                                               a:"make out for 20 minutes with zero hands involved",             b:"full body contact with zero lips involved",                     ea:"💋",eb:"🤲" },
    { q:"AFTER DARK — Would you rather",                                               a:"your partner blindfold you and take full control",             b:"you blindfold your partner and take full control",              ea:"🙈",eb:"😈" },
    { q:"AFTER DARK — Would you rather",                                               a:"be told every detail of what your partner finds irresistible about you", b:"show them what YOU find irresistible about THEM",       ea:"👂",eb:"👀" },
    { q:"AFTER DARK — Would you rather",                                               a:"heat things up somewhere unexpected — kitchen, car, balcony",  b:"make your bedroom feel like a completely different fantasy world", ea:"🏠",eb:"🛏️" },
    { q:"AFTER DARK — Would you rather",                                               a:"have the longest, most luxurious session of your lives",       b:"have the most intensely passionate 20-minute experience ever",  ea:"⏳",eb:"💥" },
    { q:"AFTER DARK — Would you rather",                                               a:"recreate a scene from your most vivid dream about your partner", b:"let your partner act out what THEY'VE been dreaming about",    ea:"💭",eb:"🔮" },
    { q:"AFTER DARK — Would you rather",                                               a:"have your partner narrate exactly how you make them feel in real time", b:"communicate only through touch, sounds, and eye contact",  ea:"🗣️",eb:"🌡️" },
  ]
};

const PUNISHMENTS = [
  { icon:"🎤", txt:"Sing the chorus of any song your partner chooses — no skipping, no whispering. Full performance." },
  { icon:"📸", txt:"Take the most unflattering selfie possible and let your partner choose one person to send it to." },
  { icon:"🗣️", txt:"Confess something small but real you've never told your partner. Right now. Go." },
  { icon:"💃", txt:"Perform a 30-second interpretive dance that expresses your feelings about this round." },
  { icon:"👁️", txt:"Stare into your partner's eyes for 45 seconds without blinking. First to blink loses a point." },
  { icon:"📞", txt:"Call someone in your contacts and give them a genuine, specific compliment. 30 seconds max." },
  { icon:"🤣", txt:"Do your absolute best impression of your partner right now. They score +1 if they can tell what you're doing." },
  { icon:"✍️", txt:"Let your partner write a word anywhere on your arm in marker. They choose the word." },
  { icon:"📷", txt:"Show the last 10 photos in your camera roll to your partner. No explanations allowed." },
  { icon:"🎭", txt:"Act out your biggest fear as a silent mime for 30 seconds. Your partner gets one guess." },
  { icon:"💌", txt:"Write a 3-line poem about something specific you love about your partner. Read it aloud. Now." },
  { icon:"🐔", txt:"Spend the next 2 questions speaking exclusively in a chicken accent. Non-negotiable." },
  { icon:"🌶️", txt:"Take a shot of hot sauce or eat something spicy. No water for 30 seconds." },
  { icon:"🕺", txt:"Go outside (or to another room) and come back with the most dramatic entrance possible." },
  { icon:"🔊", txt:"Say the most dramatic thing you've ever felt about your partner right now. No sarcasm." },
  { icon:"🎡", txt:"Spin the Chaos Wheel! Whatever it lands on — no questions asked, no negotiations." },
  { icon:"🫦", txt:"Give your partner one genuine, heartfelt compliment about their appearance right now." },
  { icon:"🤸", txt:"Do 10 jumping jacks and a dramatic bow while your partner rates your form out of 10." },
  { icon:"🃏", txt:"Pick any Bonus Card from the deck at random — the effect applies to your PARTNER, not you." },
  { icon:"📣", txt:"Stand up, clear your throat, and announce to the room (or the void) one thing you've been holding back." },
];

const BONUS_CARDS = [
  { icon:"⚡", name:"DOUBLE OR NOTHING",    desc:"Your points this round are doubled — BUT if you lose the next round, you lose the bonus too. Risk it." },
  { icon:"🔄", name:"ROLE REVERSAL",        desc:"For the next 3 questions, the LOSER of each round picks the punishment for the winner. Chaos ensues." },
  { icon:"👑", name:"IMMUNITY CROWN",       desc:"You're immune from the next punishment you'd receive. Save it carefully — you only get one." },
  { icon:"🎯", name:"STEAL A POINT",        desc:"Steal 1 point from your partner right now. No debate, no conditions. Cha-ching." },
  { icon:"💫", name:"LUCKY SKIP",           desc:"Skip any one question you absolutely refuse to answer. Use wisely — one skip per game." },
  { icon:"🔥", name:"CHAOS MULTIPLIER",     desc:"For the next 2 rounds every winning argument earns 2 points instead of 1. Make your case." },
  { icon:"🕵️", name:"SECRET KEEPER",       desc:"Both players whisper one secret to the other before the next round. No judgment allowed." },
  { icon:"🏹", name:"DEBATE SHOWDOWN",      desc:"Next question becomes a 60-second head-to-head debate. You both judge who was more convincing." },
  { icon:"🌀", name:"WILD CARD",            desc:"Create your own rule for the next 2 rounds. The other player must agree it's fair. Democracy." },
  { icon:"🎁", name:"GIFT OF CHAOS",        desc:"Choose any punishment from the list and assign it to your partner right now. Your pick." },
  { icon:"🚀", name:"ROCKET ROUND",         desc:"The next 3 questions are answered in 5 seconds flat — no deliberating. Speed decides the point." },
  { icon:"🌈", name:"SWAP SCORES",          desc:"You and your partner swap scores entirely. The lead can flip in an instant." },
  { icon:"😇", name:"FORGIVENESS CARD",     desc:"Cancel the last punishment that happened. Bygones. This card radiates pure mercy." },
  { icon:"💣", name:"CHAOS BOMB",           desc:"Everyone (both players) must complete the next punishment. Together. Suffer equally." },
];

const WHEEL_SEGMENTS = [
  { label:"Truth!",    color:"#FF2D55", punishment:"Tell your partner one thing you've been too nervous to say — RIGHT NOW." },
  { label:"+2 pts!",   color:"#FFD60A", punishment:"Bonus! You just earned 2 extra points from the chaos gods. 🔥" },
  { label:"Dance!",    color:"#30D158", punishment:"30-second victory or defeat dance — your partner chooses which one." },
  { label:"Roast!",    color:"#0A84FF", punishment:"Your partner roasts you for 45 seconds. You must maintain full eye contact and smile." },
  { label:"Dare!",     color:"#FF9F0A", punishment:"Partner gives you a dare. 10 seconds to decide: do it or lose 1 point." },
  { label:"-1 pt!",    color:"#BF5AF2", punishment:"Ouch. The wheel hath spoken. Lose 1 point." },
  { label:"Swap!",     color:"#FF6B9D", punishment:"Swap phones with your partner for exactly 5 minutes. No peeking at notifications." },
  { label:"Confess!",  color:"#5AC8FA", punishment:"Confess something small but real you've been holding back. No lies." },
  { label:"Song!",     color:"#30D158", punishment:"Sing your partner's name to the tune of the last song you listened to." },
  { label:"Kiss!",     color:"#FF2D55", punishment:"Give your partner a 5-second kiss wherever you choose. On the cheek counts. 😘" },
];

// Game history storage key
const HISTORY_KEY = "wyr_chaos_history_v2";

function saveToHistory(p1name, p1score, p2name, p2score) {
  let hist = [];
  try { hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch(e) {}
  hist.unshift({ p1:p1name, s1:p1score, p2:p2name, s2:p2score, date:Date.now() });
  if (hist.length > 20) hist = hist.slice(0,20);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(hist)); } catch(e) {}
}
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch(e) { return []; }
}
