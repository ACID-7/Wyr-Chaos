/* ============================================================
   data.js - all content for Would You Rather: Chaos Edition
   ============================================================ */

const ALL_QUESTIONS = {
  couple: [
    { q: "Your partner suggests a spontaneous weekend trip. Would you rather", a: "pack in 10 minutes and drive with no destination", b: "stay home, build a blanket fort, and pretend you are far away", ea: "CAR", eb: "FORT" },
    { q: "For a date night in, would you rather", a: "cook a fancy 3-course meal together from scratch", b: "order every single item from your favourite takeaway menu", ea: "COOK", eb: "TAKE" },
    { q: "Your partner's love language - would you rather they showed love through", a: "massive grand romantic gestures", b: "tiny daily acts only you would notice", ea: "ROSE", eb: "CARE" },
    { q: "When you fight, would you rather", a: "go silent for a while and laugh it off later", b: "argue hard and resolve it within the hour", ea: "QUIET", eb: "FIRE" },
    { q: "On your anniversary, would you rather", a: "recreate your first date exactly", b: "do something wildly new that neither of you has tried", ea: "PAST", eb: "NEW" },
    { q: "Would you rather your partner be", a: "outrageously funny but forget every important date", b: "incredibly romantic and remember everything but have no humour", ea: "LOL", eb: "LOVE" },
    { q: "On holiday together, would you rather", a: "do 7 days of beach and total rest", b: "do a packed 10-city adventure", ea: "BEACH", eb: "TRIP" },
    { q: "Would you rather move in with your partner and discover they", a: "leave dishes in the sink but clean everything else", b: "keep dishes perfect but ignore the bathroom", ea: "DISH", eb: "BATH" },
    { q: "For movie night, would you rather your partner pick", a: "a devastating 3-hour epic that makes you both cry", b: "an awful movie you both roast for fun", ea: "CRY", eb: "ROAST" },
    { q: "Would you rather your partner be", a: "a morning person who wakes you with coffee and joy", b: "a night owl who plans 2am adventures", ea: "SUN", eb: "MOON" },
    { q: "For your partner's birthday surprise, would you rather plan", a: "a perfectly curated party", b: "a mystery 48-hour adventure", ea: "PARTY", eb: "MYSTERY" },
    { q: "Would you rather your relationship have", a: "zero boredom but occasional chaos and big arguments", b: "total peace and stability but slight routine", ea: "SPARK", eb: "CALM" },
  ],
  spicy: [
    { q: "Would you rather", a: "reveal your entire browser history to your partner", b: "let your partner read all your text messages for 1 year", ea: "WEB", eb: "TEXT" },
    { q: "Would you rather date someone who is", a: "always right and usually is", b: "always thinks they are right and usually is not", ea: "RIGHT", eb: "WRONG" },
    { q: "Would you rather your partner secretly", a: "hate all your friends but stay polite", b: "love your friends more than they love you", ea: "MASK", eb: "CREW" },
    { q: "Would you rather know", a: "every lie your partner has ever told you", b: "the one thing about yourself they would never tell you", ea: "TRUTH", eb: "MIRROR" },
    { q: "Would you rather", a: "be in a relationship where you love slightly more", b: "be loved slightly more than you love back", ea: "GIVE", eb: "GET" },
    { q: "Would you rather your partner", a: "be madly in love but terrible at expressing it", b: "be excellent at romantic gestures but emotionally unavailable", ea: "HEART", eb: "SHOW" },
    { q: "Would you rather your partner", a: "still talk to their ex occasionally and say it is innocent", b: "delete their ex completely but keep a shrine of memories", ea: "TEXT", eb: "BOX" },
    { q: "Would you rather", a: "never fight but also never have deep conversations", b: "fight intensely but always resolve with brutal honesty", ea: "CALM", eb: "HONEST" },
    { q: "Would you rather", a: "know your partner checked you out before you got together", b: "find out they had a crush on your best friend first", ea: "LOOK", eb: "PLOT" },
    { q: "Would you rather your partner choose", a: "a surprise weekend away without asking you", b: "plan everything together down to the small details", ea: "SURPRISE", eb: "PLAN" },
  ],
  silly: [
    { q: "Would you rather", a: "only communicate in memes for a week", b: "only speak in song lyrics for a week", ea: "MEME", eb: "SONG" },
    { q: "Would you rather", a: "accidentally call your partner by your ex's name at dinner", b: "accidentally send your most embarrassing selfie to your boss", ea: "NAME", eb: "SELFIE" },
    { q: "Would you rather", a: "smell like fresh cookies but never shower", b: "shower daily but somehow smell like boiled eggs", ea: "COOKIE", eb: "EGGS" },
    { q: "Would you rather", a: "have a narrator read every thought out loud", b: "have a laugh track play whenever you say something cringe", ea: "VOICE", eb: "TRACK" },
    { q: "Would you rather", a: "walk like a penguin forever", b: "make dolphin sounds every time you laugh", ea: "WADDLE", eb: "DOLPHIN" },
    { q: "Would you rather", a: "burst into dance whenever music plays", b: "break into full musical theatre singing at random", ea: "DANCE", eb: "MUSICAL" },
    { q: "Would you rather", a: "sneeze glitter every single time", b: "hiccup soap bubbles in every meeting", ea: "GLITTER", eb: "BUBBLES" },
    { q: "Would you rather own a pet that", a: "can roast you better than your funniest friend", b: "predicts your future but is always cryptic", ea: "ROAST", eb: "ORACLE" },
    { q: "Would you rather", a: "only eat foods shaped like your face", b: "have your face printed on every food label", ea: "FACE", eb: "LABEL" },
    { q: "Would you rather for one month", a: "narrate everything you do in the third person", b: "refer to yourself only as The Supreme One", ea: "NARRATE", eb: "SUPREME" },
    { q: "Would you rather your laugh be", a: "a loud donkey bray you cannot control", b: "completely silent with only shoulders shaking", ea: "LOUD", eb: "SILENT" },
    { q: "Would you rather have the superpower of", a: "falling asleep instantly anywhere for 4 minutes", b: "never needing sleep but feeling mildly sleepy forever", ea: "NAP", eb: "WAKE" },
  ],
  deep: [
    { q: "Would you rather", a: "live a short extraordinary life full of peak experiences", b: "live a very long life of quiet steady happiness", ea: "FLASH", eb: "ROOT" },
    { q: "Would you rather know", a: "the exact date of your death", b: "the exact cause of your death", ea: "DATE", eb: "CAUSE" },
    { q: "Would you rather", a: "be remembered forever by people who never really knew you", b: "be deeply loved by a small circle who knew you completely", ea: "WORLD", eb: "CIRCLE" },
    { q: "Would you rather have", a: "unlimited intelligence but no emotional depth", b: "profound emotional intelligence but average intellect", ea: "MIND", eb: "SOUL" },
    { q: "Would you rather", a: "always know when someone is lying to you", b: "never be lied to but also never be told a hard truth", ea: "LIE", eb: "TRUTH" },
    { q: "Would you rather", a: "change one major decision from your past", b: "see one major event from your future", ea: "PAST", eb: "FUTURE" },
    { q: "Would you rather", a: "have complete financial security but a mediocre career", b: "do your dream job but always live paycheck to paycheck", ea: "SAFE", eb: "DREAM" },
    { q: "Would you rather", a: "know your true purpose in life", b: "have the freedom to create your own purpose from scratch", ea: "PURPOSE", eb: "CREATE" },
    { q: "Would you rather", a: "be universally liked but no one truly knows you", b: "be deeply known by the people who matter and polarising to strangers", ea: "LIKED", eb: "KNOWN" },
    { q: "Would you rather your legacy be", a: "a single world-changing idea", b: "a profound positive impact on 10 people", ea: "IDEA", eb: "IMPACT" },
  ],
  chaos: [
    { q: "CHAOS ROUND - Would you rather", a: "swap bodies with your partner for a week", b: "let your partner read your mind for 24 hours", ea: "SWAP", eb: "MIND" },
    { q: "CHAOS ROUND - Would you rather face", a: "100 duck-sized versions of your partner in a debate", b: "one horse-sized version of your partner in an argument", ea: "DUCK", eb: "HORSE" },
    { q: "CHAOS ROUND - Would you rather be teleported to", a: "medieval times with your partner and no modern knowledge", b: "year 3025 alone with one stranger as your guide", ea: "PAST", eb: "3025" },
    { q: "CHAOS ROUND - Would you rather", a: "lose all memories of your partner while they remember everything", b: "remember everything perfectly while they forget you", ea: "LOSE", eb: "KEEP" },
    { q: "CHAOS ROUND - Would you rather", a: "solve a riddle to open every door for life", b: "sing a full song before every purchase", ea: "RIDDLE", eb: "SONG" },
    { q: "CHAOS ROUND - Would you rather", a: "gain superpowers but your partner knows your only weakness", b: "let your partner gain superpowers while you know all of theirs", ea: "POWER", eb: "SECRETS" },
    { q: "CHAOS ROUND - Would you rather", a: "text your deepest secret to your contacts right now", b: "have a live audience watch your phone screen for a day", ea: "TEXT", eb: "SCREEN" },
    { q: "CHAOS ROUND - Would you rather", a: "be the most famous person alive but no one knows your real name", b: "be completely unknown but know every secret of famous people", ea: "FAME", eb: "FILES" },
  ],
  dare: [
    { q: "Would you rather", a: "call the last person you texted and reveal one genuine fear", b: "post a completely unfiltered selfie with your most chaotic caption right now", ea: "CALL", eb: "POST" },
    { q: "Would you rather", a: "let your partner style your full outfit for tomorrow with no preview", b: "let your partner plan your entire weekend in secrecy", ea: "STYLE", eb: "SECRET" },
    { q: "Would you rather", a: "hand your partner your phone unlocked with no restrictions", b: "read your three most recent notes entries aloud", ea: "PHONE", eb: "NOTES" },
    { q: "Would you rather", a: "do 20 push-ups every time you lose a round", b: "eat a mystery food blindfolded chosen by your partner", ea: "PUSH", eb: "MYSTERY" },
    { q: "Would you rather", a: "do your most embarrassing impression of your partner", b: "let your partner impersonate you while you stay silent", ea: "ACT", eb: "WATCH" },
    { q: "Would you rather", a: "write a love poem in 90 seconds and read it aloud", b: "roast your partner for 60 seconds while they smile and nod", ea: "POEM", eb: "ROAST" },
    { q: "Would you rather", a: "let your partner post anything from your camera roll to their story", b: "let your partner reply to any 3 of your DMs as you", ea: "CAM", eb: "DM" },
    { q: "Would you rather", a: "serenade your partner with a song of their choice", b: "slow dance with your partner in public for 1 minute", ea: "SONG", eb: "DANCE" },
  ],
  naughty: [
    { q: "Would you rather your partner", a: "surprise you with a massage that turns into something more", b: "leave little flirty notes hidden around the house all week", ea: "MASSAGE", eb: "NOTES" },
    { q: "Would you rather", a: "be caught in a compromising moment by your partner's sibling", b: "accidentally call your partner the wrong name at the worst possible time", ea: "CAUGHT", eb: "NAME" },
    { q: "Would you rather your partner whisper", a: "the boldest thing they have ever fantasised about", b: "something so embarrassingly sweet it makes you cringe and melt", ea: "BOLD", eb: "SWEET" },
    { q: "Would you rather", a: "never keep a straight face during serious moments", b: "always laugh at the absolute worst possible moment", ea: "LAUGH", eb: "BREAK" },
    { q: "Would you rather your partner", a: "initiate something unexpected on a random Tuesday night", b: "plan an elaborate romantic evening that ends very well", ea: "SURPRISE", eb: "PLAN" },
    { q: "Would you rather", a: "confess your most embarrassing fantasy to your partner", b: "have your partner correctly guess it without being told", ea: "CONFESS", eb: "GUESS" },
    { q: "Would you rather", a: "always be the one to make the first move", b: "always be the one who is pursued and surprised", ea: "CHASE", eb: "CAUGHT" },
    { q: "Would you rather your partner", a: "be incredibly confident and assertive", b: "be teasing playful and keep you guessing all night", ea: "ASSERT", eb: "TEASE" },
    { q: "Would you rather", a: "recreate your best memory together exactly as it happened", b: "create something completely new that tops it entirely", ea: "REPLAY", eb: "UPGRADE" },
    { q: "Would you rather your partner express love", a: "through passionate intensity and complete presence", b: "through slow tender unrushed attention to every detail", ea: "HEAT", eb: "SLOW" },
    { q: "Would you rather", a: "always be completely in the mood but never say it", b: "never be shy about it but sometimes get the timing wrong", ea: "HINT", eb: "BOLD" },
    { q: "Would you rather give your partner", a: "the most meaningful gift they have ever received", b: "the most physically memorable night of their life", ea: "GIFT", eb: "MEMORY" },
    { q: "Would you rather your partner catch you", a: "sending an outrageously bold flirty text you absolutely meant", b: "practising your filthiest one-liner before seeing them", ea: "TEXT", eb: "LINE" },
    { q: "Would you rather", a: "be teased all night by eye contact smirks and zero mercy", b: "have the tension snap the second you are finally alone", ea: "LOOK", eb: "SNAP" },
    { q: "Would you rather your partner be", a: "dangerously smooth and fully aware of their effect on you", b: "messy direct and impossible to ignore once they start", ea: "SMOOTH", eb: "RAW" },
    { q: "Would you rather", a: "admit the exact compliment that would destroy your self-control", b: "hear the one thing you do that drives your partner wild", ea: "COMPLIMENT", eb: "TRIGGER" },
  ],
  horny: [
    { q: "AFTER DARK - Would you rather", a: "have your partner send you a flirty text that ruins your focus all day", b: "have your partner surprise you the moment you get home", ea: "TEXT", eb: "DOOR" },
    { q: "AFTER DARK - Would you rather", a: "spend an entire evening on tension and build-up only", b: "skip straight to the main event every single time", ea: "BUILD", eb: "FAST" },
    { q: "AFTER DARK - Would you rather your partner be", a: "completely dominant and in total control", b: "sweetly submissive and yours to command", ea: "CONTROL", eb: "COMMAND" },
    { q: "AFTER DARK - Would you rather", a: "be woken up in the most fun way imaginable", b: "fall asleep being held in the most intimate way possible", ea: "WAKE", eb: "SLEEP" },
    { q: "AFTER DARK - Would you rather", a: "have your partner describe exactly what they want in full detail", b: "figure it out together with no words and pure instinct", ea: "WORDS", eb: "INSTINCT" },
    { q: "AFTER DARK - Would you rather", a: "make out for 20 minutes with zero hands involved", b: "have full body contact with zero lips involved", ea: "KISS", eb: "TOUCH" },
    { q: "AFTER DARK - Would you rather", a: "have your partner blindfold you and take full control", b: "blindfold your partner and take full control", ea: "BLINDFOLD", eb: "TAKEOVER" },
    { q: "AFTER DARK - Would you rather", a: "be told every detail of what your partner finds irresistible about you", b: "show them what you find irresistible about them", ea: "DETAIL", eb: "SHOW" },
    { q: "AFTER DARK - Would you rather", a: "heat things up somewhere unexpected like the kitchen car or balcony", b: "make your bedroom feel like a different fantasy world", ea: "RISK", eb: "FANTASY" },
    { q: "AFTER DARK - Would you rather", a: "have the longest most luxurious session of your lives", b: "have the most intensely passionate 20-minute experience ever", ea: "LONG", eb: "INTENSE" },
    { q: "AFTER DARK - Would you rather", a: "recreate a scene from your most vivid dream about your partner", b: "let your partner act out what they have been dreaming about", ea: "DREAM", eb: "ACT" },
    { q: "AFTER DARK - Would you rather", a: "have your partner narrate exactly how you make them feel in real time", b: "communicate only through touch sounds and eye contact", ea: "TALK", eb: "FEEL" },
    { q: "AFTER DARK - Would you rather", a: "get an all-night slow-burn build-up that keeps getting rougher and hotter", b: "have the tension snap instantly the moment the door closes", ea: "SLOW", eb: "SNAP" },
    { q: "AFTER DARK - Would you rather your partner", a: "pin you with one look that says they already know what they want", b: "talk you into trouble so smoothly you walk into it smiling", ea: "LOOK", eb: "TALK" },
    { q: "AFTER DARK - Would you rather", a: "be told to sit still while your partner takes total control of the vibe", b: "be the one setting the pace while they try to keep up", ea: "STILL", eb: "PACE" },
    { q: "AFTER DARK - Would you rather", a: "have one brutally honest conversation about chemistry cravings and limits", b: "skip the talking and let the tension speak first", ea: "HONEST", eb: "TENSION" },
  ],
};

const PUNISHMENTS = [
  { icon: "SONG", txt: "Sing the chorus of any song your partner chooses. Full performance." },
  { icon: "SELFIE", txt: "Take the most unflattering selfie possible and let your partner choose one person to send it to." },
  { icon: "CONFESS", txt: "Confess something small but real you have never told your partner." },
  { icon: "DANCE", txt: "Perform a 30-second interpretive dance about this round." },
  { icon: "STARE", txt: "Stare into your partner's eyes for 45 seconds without blinking." },
  { icon: "CALL", txt: "Call someone in your contacts and give them a genuine compliment." },
  { icon: "IMPERSONATE", txt: "Do your absolute best impression of your partner right now." },
  { icon: "MARK", txt: "Let your partner write one harmless word on your arm in marker." },
  { icon: "PHOTOS", txt: "Show the last 10 photos in your camera roll. No explanations allowed." },
  { icon: "MIME", txt: "Act out your biggest fear as a silent mime for 30 seconds." },
  { icon: "POEM", txt: "Write a 3-line poem about something specific you love about your partner and read it aloud." },
  { icon: "ACCENT", txt: "Spend the next 2 questions speaking in a ridiculous accent." },
  { icon: "SPICY", txt: "Take a shot of hot sauce or eat something spicy. No water for 30 seconds." },
  { icon: "ENTRANCE", txt: "Leave the room and come back with the most dramatic entrance possible." },
  { icon: "LOUD", txt: "Say the most dramatic thing you have ever felt about your partner. No sarcasm." },
  { icon: "WHEEL", txt: "Spin the Chaos Wheel. Whatever it lands on stands." },
  { icon: "PRAISE", txt: "Give your partner one genuine heartfelt compliment about their appearance." },
  { icon: "JACKS", txt: "Do 10 jumping jacks and finish with a dramatic bow." },
  { icon: "BONUS", txt: "Pick a random Bonus Card. The effect applies to your partner, not you." },
  { icon: "ANNOUNCE", txt: "Stand up and announce one thing you have been holding back." },
];

const BONUS_CARDS = [
  { icon: "2X", name: "DOUBLE OR NOTHING", desc: "Gain +1 now, but if you lose the next round you lose the bonus." },
  { icon: "SWAP", name: "ROLE REVERSAL", desc: "For the next 3 rounds, the loser decides the punishment." },
  { icon: "CROWN", name: "IMMUNITY CROWN", desc: "You are immune from the next punishment you would receive." },
  { icon: "STEAL", name: "STEAL A POINT", desc: "Steal 1 point from your partner right now." },
  { icon: "SKIP", name: "LUCKY SKIP", desc: "Bank one skip token for a question you refuse to answer." },
  { icon: "2PT", name: "CHAOS MULTIPLIER", desc: "For the next 2 rounds, each win is worth 2 points." },
  { icon: "SECRET", name: "SECRET KEEPER", desc: "Both players should share one secret before the next round." },
  { icon: "DEBATE", name: "DEBATE SHOWDOWN", desc: "The next question becomes a head-to-head debate round." },
  { icon: "RULE", name: "WILD CARD", desc: "Create one temporary house rule for the next 2 rounds." },
  { icon: "GIFT", name: "GIFT OF CHAOS", desc: "Choose any punishment from the list and assign it immediately." },
  { icon: "FAST", name: "ROCKET ROUND", desc: "The next 3 questions are meant to be answered fast." },
  { icon: "FLIP", name: "SWAP SCORES", desc: "Swap scores with your partner instantly." },
  { icon: "MERCY", name: "FORGIVENESS CARD", desc: "Cancel the last punishment that happened." },
  { icon: "BOMB", name: "CHAOS BOMB", desc: "The next punishment hits both players." },
];

const WHEEL_SEGMENTS = [
  { label: "Truth!", color: "#FF2D55", punishment: "Tell your partner one thing you have been too nervous to say." },
  { label: "+2 pts!", color: "#FFD60A", punishment: "You just earned 2 extra points from the chaos gods." },
  { label: "Dance!", color: "#30D158", punishment: "Do a 30-second victory or defeat dance." },
  { label: "Roast!", color: "#0A84FF", punishment: "Your partner roasts you for 45 seconds while you maintain eye contact." },
  { label: "Dare!", color: "#FF9F0A", punishment: "Your partner gives you a dare. Do it or lose 1 point." },
  { label: "-1 pt!", color: "#BF5AF2", punishment: "Lose 1 point." },
  { label: "Swap!", color: "#FF6B9D", punishment: "Swap phones with your partner for exactly 5 minutes." },
  { label: "Confess!", color: "#5AC8FA", punishment: "Confess something small but real you have been holding back." },
  { label: "Song!", color: "#30D158", punishment: "Sing your partner's name to the tune of the last song you heard." },
  { label: "Kiss!", color: "#FF2D55", punishment: "Give your partner a 5-second kiss wherever you both agree counts." },
];

const HISTORY_KEY = 'wyr_chaos_history_v2';

function saveToHistory(p1name, p1score, p2name, p2score) {
  let hist = [];
  try { hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (e) {}
  hist.unshift({ p1: p1name, s1: p1score, p2: p2name, s2: p2score, date: Date.now() });
  if (hist.length > 20) hist = hist.slice(0, 20);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(hist)); } catch (e) {}
}

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (e) { return []; }
}
