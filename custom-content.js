function buildPromptBank() {
  function makePairs(left, right, q, eaPrefix, ebPrefix) {
    const prompts = [];
    left.forEach((a, i) => {
      right.forEach((b, j) => {
        if (a === b) return;
        prompts.push({
          q,
          a,
          b,
          ea: `${eaPrefix}${i + 1}`,
          eb: `${ebPrefix}${j + 1}`,
        });
      });
    });
    return prompts;
  }

  const coupleSetups = [
    'For your next date night, would you rather',
    'When planning a weekend together, would you rather',
    'To make your relationship feel fresh again, would you rather',
    'If both of you had a surprise free evening, would you rather',
    'For a memory you would both talk about for years, would you rather',
  ];
  const coupleA = [
    'book a tiny cabin and disappear from your phones',
    'cook a ridiculous multi-course meal together',
    'recreate your earliest inside joke in public',
    'build a full themed movie night at home',
    'plan a long sunrise drive with snacks and no destination',
    'take a class together and be terrible at it',
    'trade playlists and explain every song choice',
    'write each other a short letter and read it aloud',
    'spend the whole night trying to win carnival prizes',
    'do a no-budget date built entirely from things in your house',
  ];
  const coupleB = [
    'let one person secretly plan the whole night',
    'do a city challenge where each of you controls half the plan',
    'stay in and turn the living room into a mini vacation',
    'visit the cheesiest tourist spot nearby and commit fully',
    'do a memory lane date with photos and old messages',
    'turn dinner into a blind taste-test competition',
    'spend the night making a future bucket list together',
    'go somewhere fancy underdressed and act like it is intentional',
    'take a train or bus somewhere random and explore',
    'have a total no-phone evening and improvise everything',
  ];
  const coupleSetupsExtra = [
    'If you wanted a story you would keep retelling, would you rather',
    'To shake up your usual routine together, would you rather',
    'On a low-budget but high-effort night, would you rather',
    'If one of you had to surprise the other, would you rather',
    'For the most unexpectedly wholesome day together, would you rather',
  ];
  const coupleAExtra = [
    'spend the day making each other fake travel brochures for your own city',
    'take turns designing the worst possible date idea and then actually do it',
    'build a snack tournament bracket and argue about every result',
    'go thrifting for outfits the other person has to style',
    'record a tiny podcast episode about your relationship lore',
    'cook breakfast for dinner and rate each other like a reality show judge',
    'race through a bookstore picking a gift under a strict time limit',
    'do a photo scavenger hunt with absurd challenges',
    'write a two-person bucket list and rank it by chaos level',
    'plan a fake red-carpet arrival for a completely ordinary errand',
  ];
  const coupleBExtra = [
    'redecorate one corner of your place like a themed set',
    'spend the evening retelling old stories from opposite perspectives',
    'compete to build the best comfort-food combo from random groceries',
    'plan a dramatic fake anniversary speech for each other',
    'take personality quizzes and roast the results together',
    'trade control of the music every 10 minutes with no vetoes',
    'try to recreate a restaurant meal entirely from memory',
    'make a tiny awards show for your funniest relationship moments',
    'pack a mystery picnic and only open it when you arrive',
    'do a full no-spend outing and improvise your own entertainment',
  ];

  const spicySetups = [
    'Would you rather find out that your partner',
    'In a relationship, would you rather',
    'If honesty got brutally uncomfortable, would you rather',
    'Would you rather your partner admit that they',
    'When things get emotionally messy, would you rather',
  ];
  const spicyA = [
    'screenshots your best messages because they miss you',
    'asks for reassurance more often than they admit',
    'secretly wants more quality time than they ask for',
    'gets jealous but hides it well',
    'overthinks your tone in text messages',
    'notices every little shift in your mood',
    'remembers your offhand comments for months',
    'would rather fight than feel ignored',
    'wants to know your full unfiltered opinion',
    'cares more about your approval than they say',
  ];
  const spicyB = [
    'needs more independence than you expected',
    'would rather be told the harsh truth immediately',
    'still thinks about one old relationship lesson constantly',
    'values loyalty above romance every single time',
    'would rather lose an argument than lose closeness',
    'needs space first before talking anything out',
    'prefers being chosen publicly not just privately',
    'would rather be challenged than comforted',
    'cares deeply about how your friends see them',
    'would notice instantly if you started pulling away',
  ];
  const spicySetupsExtra = [
    'Would you rather realize that your partner',
    'When you need emotional clarity, would you rather',
    'Would you rather your relationship be the kind that',
    'If communication got painfully honest, would you rather',
    'Would you rather your partner secretly believe that',
  ];
  const spicyAExtra = [
    'takes every goodbye more seriously than they let on',
    'replays your arguments afterwards to find what they missed',
    'wants deeper conversations than your current routine allows',
    'needs consistency more than excitement',
    'trusts actions much more than words',
    'would rather hear bad news early than be comforted first',
    'takes silence personally when they are already anxious',
    'wants public loyalty and private softness',
    'is more sentimental than their image suggests',
    'would rather feel chosen than impressed',
  ];
  const spicyBExtra = [
    'needs a lot more reassurance during conflict than they admit',
    'would rather be understood slowly than fixed quickly',
    'expects you to notice the little things without being asked',
    'wants accountability more than apologies',
    'fears emotional distance more than disagreement',
    'tries to look calm even when they feel rejected',
    'would rather know exactly where they stand at all times',
    'prefers uncomfortable honesty over polished romance',
    'wants to be protected from chaos not passion',
    'is testing reliability more often than they say',
  ];

  const sillySetups = [
    'For one totally cursed month, would you rather',
    'Would you rather wake up tomorrow and discover you',
    'If the universe decided to prank you, would you rather',
    'At the worst possible public moment, would you rather',
    'Would you rather be known forever as the person who',
  ];
  const sillyA = [
    'can only answer serious questions with dramatic whispers',
    'randomly moonwalk whenever you hear your name',
    'hiccup every time you try to sound confident',
    'lose every rock-paper-scissors game instantly',
    'laugh exactly one second too late at every joke',
    'accidentally high-five instead of wave',
    'speak like a documentary narrator when stressed',
    'drop one useless fact into every conversation',
    'point at things instead of describing them properly',
    'clap once before making any important decision',
  ];
  const sillyB = [
    'freeze like a mannequin when someone compliments you',
    'sing every apology like a breakup ballad',
    'walk with dramatic slow-motion intensity in empty hallways',
    'announce snack choices like a sports commentator',
    'bow after every mildly clever sentence',
    'salute before leaving every room',
    'mispronounce one easy word differently every day',
    'treat every chair like it is a throne',
    'nod like you understand even when you absolutely do not',
    'react to tiny inconveniences like a Shakespearean tragedy',
  ];
  const sillySetupsExtra = [
    'If your personal brand became embarrassingly specific, would you rather',
    'Would you rather develop the deeply inconvenient habit of',
    'If every stranger knew you for one weird thing, would you rather',
    'Would you rather be cursed to',
    'For one spectacularly unserious year, would you rather',
  ];
  const sillyAExtra = [
    'announce your own entrances with fake crowd applause',
    'finger-gun at every successful parallel park',
    'treat every spilled drink like a national emergency',
    'over-celebrate tiny achievements with full victory poses',
    'snap twice before telling any story',
    'call every minor plan an operation',
    'squint suspiciously at completely normal objects',
    'nod dramatically before saying absolutely obvious things',
    'stretch like an athlete before opening any difficult jar',
    'whisper wow after every accidental rhyme',
  ];
  const sillyBExtra = [
    'take deep strategic breaths before replying to simple texts',
    'pretend every supermarket visit is a stealth mission',
    'wave at security cameras like they are old friends',
    'point at yourself whenever someone says your name',
    'act personally betrayed by weak Wi-Fi',
    'turn every snack into a formal tasting event',
    'stare into the distance before answering easy questions',
    'celebrate finding a parking spot like winning a championship',
    'thank inanimate objects when they cooperate',
    'speak to mirrors like they are unreliable coworkers',
  ];

  const deepSetups = [
    'Would you rather spend the rest of your life',
    'If you had to choose your personal legacy, would you rather',
    'Would you rather understand more about',
    'If you could secure only one kind of future, would you rather',
    'Would you rather become the kind of person who',
  ];
  const deepA = [
    'being admired by many people who never knew you deeply',
    'protecting a quiet life with people who know you completely',
    'mastering discipline even if it costs spontaneity',
    'following your values even when they make life harder',
    'creating work that outlives you by decades',
    'choosing peace over recognition',
    'being emotionally brave even when you look foolish',
    'always saying what you mean with care',
    'learning how to let go faster than most people can',
    'building a life that feels true rather than impressive',
  ];
  const deepB = [
    'being unforgettable to a small number of people',
    'taking big swings that might fail publicly',
    'optimizing your life for meaning over comfort',
    'becoming impossible to manipulate but harder to read',
    'knowing yourself clearly but being misunderstood often',
    'chasing wonder instead of certainty',
    'becoming reliable before becoming extraordinary',
    'hearing hard truths more often than easy praise',
    'protecting your time with ruthless boundaries',
    'staying openhearted even after getting hurt',
  ];
  const deepSetupsExtra = [
    'Would you rather shape your life around',
    'If you had to trade comfort for growth, would you rather',
    'Would you rather be remembered as someone who',
    'If your future depended on one principle, would you rather',
    'Would you rather learn how to',
  ];
  const deepAExtra = [
    'becoming more honest even when honesty costs approval',
    'building patience strong enough to outlast your impulses',
    'letting your work speak louder than your image',
    'forgiving faster without becoming naive',
    'staying kind without becoming easy to use',
    'choosing depth over speed in the people you trust',
    'protecting your peace instead of proving yourself',
    'living by conviction instead of reaction',
    'becoming resilient without turning cold',
    'care less about being right and more about being clear',
  ];
  const deepBExtra = [
    'risk visible failure to stay aligned with your values',
    'be difficult to impress but easy to move emotionally',
    'build a life that is quiet on the outside but rich underneath',
    'be deeply disciplined while still playful',
    'accept uncertainty without chasing false control',
    'become more forgiving without reopening every old wound',
    'value steadiness over constant reinvention',
    'know yourself clearly but keep evolving anyway',
    'live slower than the world expects but more intentionally',
    'protect wonder instead of pretending certainty',
  ];

  const chaosSetups = [
    'CHAOS ROUND - Would you rather',
    'If the world broke in the funniest possible way, would you rather',
    'Would you rather be trapped in a bizarre timeline where you must',
    'If reality gave you one cursed power, would you rather',
    'In a fully unhinged alternate universe, would you rather',
  ];
  const chaosA = [
    'switch voices with the last person you argued with for a week',
    'live in a world where every lie becomes visible as subtitles',
    'solve every disagreement with obstacle-course races',
    'trade daily luck with a stranger chosen at random',
    'know exactly when awkward moments are coming but not why',
    'be forced to narrate your own dramatic entrances forever',
    'receive one cryptic prophecy every morning',
    'have your thoughts play as movie trailers before meetings',
    'randomly teleport three feet left during tense conversations',
    'swap confidence levels with the nearest person once a day',
  ];
  const chaosB = [
    'live in a world where compliments count as legal currency',
    'be challenged to one public dare every sunrise',
    'hear a dramatic theme song before every minor inconvenience',
    'accidentally trigger confetti whenever you panic',
    'know one completely useless secret about everyone you meet',
    'have doors open only after you answer a riddle correctly',
    'forget one tiny skill every time you learn a new one',
    'be unable to whisper any important information',
    'cause all nearby phones to play the same song when embarrassed',
    'see your worst ideas as glowing signs above your head',
  ];
  const chaosSetupsExtra = [
    'CHAOS ROUND - If one bizarre rule governed your life, would you rather',
    'Would you rather live inside a universe where you must',
    'If reality decided to humiliate everyone equally, would you rather',
    'CHAOS ROUND - Would you rather suddenly gain the power to',
    'In the most inconvenient timeline possible, would you rather',
  ];
  const chaosAExtra = [
    'hear your own internal monologue in surround sound during interviews',
    'swap one random memory with a stranger every month',
    'trigger dramatic lightning whenever you make a bold claim',
    'be challenged to defend your last bad decision in public',
    'forget the lyrics to every song except when it is inappropriate',
    'see all your future detours but none of the main path',
    'cause nearby printers to activate when you panic',
    'get one absurd side quest every time you try to relax',
    'accidentally speak in metaphors when you are under pressure',
    'have your luck change based on how confident your posture looks',
  ];
  const chaosBExtra = [
    'negotiate every disagreement with a spinning wheel of consequences',
    'receive a useless clue before every important decision',
    'hear audience gasps whenever you open a serious message',
    'cause minor weather changes with your mood',
    'be forced to explain every lie using a slideshow',
    'have your calendar occasionally replace plans with mysterious errands',
    'unlock one strange skill only after embarrassing yourself first',
    'be followed by one floating caption that judges your timing',
    'switch handwriting styles depending on how truthful you are',
    'randomly become overqualified for things nobody asked you to do',
  ];

  const dareSetups = [
    'Would you rather prove your courage right now by',
    'For a dare you cannot overthink, would you rather',
    'If your partner got to choose a challenge for you, would you rather',
    'Would you rather take the bold route and',
    'For maximum chaos with minimal preparation, would you rather',
  ];
  const dareA = [
    'sending a voice note with your most dramatic fake apology',
    'posting a harmless but deeply unflattering candid photo',
    'reading your last three search terms out loud',
    'doing a one-minute motivational speech to an object in the room',
    'reenacting your most embarrassing moment with full commitment',
    'letting someone else choose your next profile photo',
    'calling a friend and asking them to rate your villain laugh',
    'writing a tiny poem about the room you are in',
    'doing a dramatic runway walk across the house',
    'letting the other player rename you for the next two rounds',
  ];
  const dareB = [
    'attempting a perfect commercial voice-over for whatever is nearest',
    'revealing the last mildly cringe message you typed and did not send',
    'letting the other player style your hair in the dumbest possible way',
    'recording a fake acceptance speech for winning absolutely nothing',
    'doing ten push-ups while maintaining eye contact',
    'speaking only in questions for the next round',
    'turning your last snack into a full food review',
    'texting someone a harmless but suspiciously formal greeting',
    'performing a 20-second dramatic monologue about losing this game',
    'drawing a self-portrait in under 15 seconds and showing it immediately',
  ];
  const dareSetupsExtra = [
    'If you had to commit to one harmless chaos move, would you rather',
    'Would you rather accept a dare that makes you',
    'For a challenge that is more embarrassing than difficult, would you rather',
    'Would you rather let the room watch you',
    'To prove you can handle mild public chaos, would you rather',
  ];
  const dareAExtra = [
    'perform a fake weather forecast about your current mood',
    'narrate your last five minutes like a nature documentary',
    'pitch yourself as a completely unreliable superhero',
    'read a grocery list like it is breaking news',
    'rank the furniture in the room by emotional support value',
    'deliver a one-minute TED Talk about why you should never be in charge',
    'make a fake advertisement for water',
    'speak in a dramatic villain voice until the next round ends',
    'design a new handshake on the spot and teach it immediately',
    'confidently explain an obviously made-up life hack',
  ];
  const dareBExtra = [
    'do your best impression of being interviewed after a huge sporting upset',
    'send a harmless but overly enthusiastic thumbs-up message to a friend',
    'list five things in the room and call each one iconic',
    'pretend to host an awards show for the next 20 seconds',
    'give yourself a ridiculous nickname and insist on it for one round',
    'demonstrate the walk of someone who just won a petty argument',
    'create a motivational quote that sounds wise but means nothing',
    'review your own posture like a strict coach',
    'declare one snack in the house criminally underrated',
    'perform a dramatic apology to the nearest object you have ignored',
  ];

  const bank = {
    couple: [],
    spicy: [],
    silly: [],
    deep: [],
    chaos: [],
    dare: [],
    naughty: [],
    horny: [],
  };

  coupleSetups.forEach((q, idx) => {
    bank.couple.push(...makePairs(coupleA, coupleB, q, `C${idx + 1}A`, `C${idx + 1}B`));
  });
  coupleSetupsExtra.forEach((q, idx) => {
    bank.couple.push(...makePairs(coupleAExtra, coupleBExtra, q, `CX${idx + 1}A`, `CX${idx + 1}B`));
  });
  spicySetups.forEach((q, idx) => {
    bank.spicy.push(...makePairs(spicyA, spicyB, q, `S${idx + 1}A`, `S${idx + 1}B`));
  });
  spicySetupsExtra.forEach((q, idx) => {
    bank.spicy.push(...makePairs(spicyAExtra, spicyBExtra, q, `SX${idx + 1}A`, `SX${idx + 1}B`));
  });
  sillySetups.forEach((q, idx) => {
    bank.silly.push(...makePairs(sillyA, sillyB, q, `L${idx + 1}A`, `L${idx + 1}B`));
  });
  sillySetupsExtra.forEach((q, idx) => {
    bank.silly.push(...makePairs(sillyAExtra, sillyBExtra, q, `LX${idx + 1}A`, `LX${idx + 1}B`));
  });
  deepSetups.forEach((q, idx) => {
    bank.deep.push(...makePairs(deepA, deepB, q, `D${idx + 1}A`, `D${idx + 1}B`));
  });
  deepSetupsExtra.forEach((q, idx) => {
    bank.deep.push(...makePairs(deepAExtra, deepBExtra, q, `DX${idx + 1}A`, `DX${idx + 1}B`));
  });
  chaosSetups.forEach((q, idx) => {
    bank.chaos.push(...makePairs(chaosA, chaosB, q, `H${idx + 1}A`, `H${idx + 1}B`));
  });
  chaosSetupsExtra.forEach((q, idx) => {
    bank.chaos.push(...makePairs(chaosAExtra, chaosBExtra, q, `HX${idx + 1}A`, `HX${idx + 1}B`));
  });
  dareSetups.forEach((q, idx) => {
    bank.dare.push(...makePairs(dareA, dareB, q, `R${idx + 1}A`, `R${idx + 1}B`));
  });
  dareSetupsExtra.forEach((q, idx) => {
    bank.dare.push(...makePairs(dareAExtra, dareBExtra, q, `RX${idx + 1}A`, `RX${idx + 1}B`));
  });

  return bank;
}

window.WYR_CHAOS_CUSTOM_CONTENT = {
  questions: buildPromptBank(),
};
