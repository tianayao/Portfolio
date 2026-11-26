/** Edit this file to replace sample content. Null media/links are intentionally unavailable. */
export const profile = {
  displayName: 'Tina!',
  role: 'Curious about people. Playful with technology.',
  intro: [
    "Originally from China and now based in London, I work across creative marketing, audience research and experience design. I'm curious about how people discover, understand and respond to stories across cultures and platforms.",
    'With a background in **Interactive Media and Design Informatics**, I bring together content strategy, visual storytelling and emerging technology to turn audience insight into clear, engaging digital experiences.',
  ],
  philosophy: [
    'To me, good creative work begins with understanding the audience: what they notice, what they care about and what helps an idea stay with them.',
    "I combine **empathy, cultural curiosity and experimentation** with evidence from research and performance data. Whether I'm shaping content, a campaign or an interactive experience, I want the result to feel useful, distinctive and a little playful.",
  ],
  about: [
    'My underwater world is where creative marketing, audience research and design technology meet. I enjoy finding patterns in how people behave, what captures their attention and how a complex idea can become a story people want to follow.',
    'I have worked across digital content, SEO, social and community engagement, accessibility research, visual design, interactive technology, physical computing, Arduino/C++ and digital fabrication. This range helps me move between strategy and making, collaborate across creative and technical teams, and carry an idea from insight to delivery.',
    'I am especially drawn to work that connects cultures, makes information more approachable and gives people an active role in the experience.',
  ],
  skillGroups: [
    {
      title: 'Creative & Marketing',
      icon: '✦\uFE0E',
      items: ['Content Strategy & Copywriting', 'Social Media & Community', 'SEO & Audience Growth', 'Digital Storytelling & Campaign Support'],
    },
    {
      title: 'Audience & Strategy',
      icon: '◌',
      items: ['Audience & Cultural Research', 'UX & Usability Testing', 'Content Analytics & Insight Reporting', 'Cross-cultural Communication'],
    },
    {
      title: 'Design & Technology',
      icon: '✳\uFE0E',
      items: ['Figma & Adobe Creative Suite', 'Visual Content Production', 'Interactive Prototyping, Unity & AR', 'Arduino, C++ & Physical Computing', 'Digital Fabrication & Prototyping', 'Python, SQL & AI Workflows'],
    },
  ],
  experience: null,
  education: null,
  note: 'A little space for curiosity — where small observations grow into playful ideas.',
};

export const contact = {
  email: '030224yaoyu@gmail.com',
  linkedin: 'https://www.linkedin.com/in/yu-yao-221647179/',
  resume: null, // Replace with a local résumé path or an HTTPS URL.
  portfolioLinks: [], // Add { label, href } records for your other portfolio links.
  replacementNote: 'Contact details are awaiting replacement with your own email, LinkedIn, and résumé.',
};

export const chapterLabels = ['Overview', 'Problem', 'Research', 'Ideation', 'Solution', 'Reflection'];

const BL_PROTOTYPE_URL = 'https://bl-universal-media-library-portfolio.dessertthebest.chatgpt.site/';
const EXOFITS_FIGMA_URL = 'https://www.figma.com/design/hgR9uTrAHUs9RrchdEiw8D/exhibtion?node-id=0-1&t=eJpDqFuzQuz0Gr5B-1';
const COVER_ME_VIDEO_URL = 'https://drive.google.com/file/d/1baoJ6sk4TJlJyhCzGvKaIX8ATrrdWHrc/view?usp=sharing';
const coverMeMedia = {
  src: 'assets/images/cover-me/cover-me-gameplay.png',
  alt: 'Cover Me gameplay with an umbrella above a moving character in a rainy Unity scene',
  caption: 'Cover Me · project walkthrough. Select the image to watch the video on Google Drive.',
  fit: 'contain', href: COVER_ME_VIDEO_URL, cta: 'Watch project walkthrough',
};

// Work records include factual case studies and clearly labelled illustrative concepts.
const samples = [
  { slug: 'snuffmouth', title: 'SnuffMouth', cardShape: 'clam', accent: '#996448', illustrative: false, cardLabel: 'Design robotics case study', type: 'Independent project · physical computing & interaction design', summary: 'A robotic installation that turns second-hand smoke into immediate physical, visual and sonic feedback.' },
  { slug: 'exofits', title: 'Exo-Fits', cardShape: 'starfish', accent: '#9b5545', illustrative: false, cardLabel: 'Interactive AR installation case study', type: 'Independent project · AR, body tracking & exhibition design', summary: 'An immersive AR spacewear experience that turns extreme planetary conditions into an embodied exhibition encounter.' },
  { slug: 'bl-universal-media-library', title: 'BL Universal Media Library', cardShape: 'conch', accent: '#775c86', illustrative: false, cardLabel: 'Product design case study', type: 'Independent product design · mobile app concept', summary: 'A calm discovery and tracking layer for BL stories across countries, media formats, and official platforms.', prototypeUrl: BL_PROTOTYPE_URL },
  { slug: 'cover-me', title: 'Cover Me', cardShape: 'whale', accent: '#416c83', illustrative: false, cardLabel: 'Motion capture & game design case study', type: 'Group project · research, data visualisation & Unity', summary: 'Turning motion capture trajectories into a playful challenge: can you predict the space a moving body will need?' },
  { slug: 'slow-table', title: 'Slow Table', cardShape: 'turtle', accent: '#496d59', type: 'Illustrative · food planning concept', summary: 'An illustrative exploration of flexible meal planning.', audience: 'people planning meals around what is already available', question: 'How might a meal plan adapt when ingredients or plans change?', direction: 'ingredient-led suggestions with clear substitutions and a reusable list', caution: 'dietary requirements, ingredient availability, and the clarity of substitutions' },
  { slug: 'drift-space', title: 'Drift Space', cardShape: 'jellyfish', accent: '#856385', type: 'Illustrative · collaboration concept', summary: 'An illustrative exploration of sharing early creative ideas.', audience: 'small teams sharing work before it feels finished', question: 'How might a shared space make the kind of feedback an idea needs clear?', direction: 'idea notes paired with a specific feedback request and visible context', caution: 'whether feedback requests support participation across different working styles' },
];

function chaptersFor(sample) {
  const narrative = [
    `Illustrative concept for ${sample.audience}. This sample frames a possible design journey; it does not describe delivered work, a client engagement, or measured results.`,
    `Illustrative design question: ${sample.question} The problem is a starting hypothesis, awaiting real context and validation.`,
    `Illustrative research plan: speak with ${sample.audience}, review existing approaches, and observe relevant tasks with consent. No interviews, observations, or findings are claimed here.`,
    `Illustrative ideation direction: explore ${sample.direction}. Compare a few low-fidelity alternatives before choosing a direction with participant input.`,
    `Illustrative proposed solution: ${sample.direction}. Replace this description and the media slots with your own screens, interaction details, and evidence. This is not a tested or launched product.`,
    `Illustrative reflection: a useful next step would be to investigate ${sample.caution}. Replace this sample with your own tradeoffs, learning, and supported outcomes.`,
  ];
  const insights = [
    'Illustrative scope only; add your actual role, collaborators, and dates.',
    'A question to investigate, rather than a validated user need.',
    'Research is proposed, not completed. Add evidence only when it exists.',
    'Show alternatives and the reasoning behind your real decisions.',
    'Replace sample media independently from the decorative ocean frame.',
    'No impact metrics are claimed. Add results only with supporting evidence.',
  ];
  return chapterLabels.map((label, index) => ({
    number: index + 1,
    label,
    title: `${label}: ${sample.title}`,
    narrative: narrative[index],
    insight: insights[index],
    images: Array.from({ length: index === 2 || index === 4 ? 2 : 1 }, (_, image) => ({
      src: null,
      alt: `Illustrative ${sample.title} ${label.toLowerCase()} media slot ${image + 1}; awaiting replacement`,
      caption: `Illustrative placeholder · ${label} ${image + 1}. Replace with your own image and caption.`,
    })),
  }));
}

function coverMeChapters() {
  const trajectories = {
    src: 'assets/images/cover-me/cover-me-trajectories.png', fit: 'contain',
    alt: 'Blue foot trajectories in three dimensions with a fitted optimal plane',
    caption: 'Trajectory analysis · fitting a plane to the foot positions revealed a tilt in the recorded movement.',
  };
  const hulls = {
    src: 'assets/images/cover-me/cover-me-body-volumes.png', fit: 'contain',
    alt: 'Four motion capture skeleton frames enclosed by purple convex hulls with volume measurements',
    caption: 'Spatial occupancy · convex hulls compare the enclosing volume of four poses. These are geometric envelopes, not anatomical body volumes.',
  };
  const chapters = [
    {
      title: 'Overview: Predicting the space a body needs',
      narrative: 'Cover Me is a group project that translates motion capture data supplied by RETìníZE into a playable exploration of spatial perception. In the Unity prototype, players position and resize an umbrella to keep a moving friend dry. I contributed concept and theoretical research, motion trajectory analysis and animation, and part of the Unity rendering. The wider team developed the game systems and brought the experience together.',
      insight: 'My contribution · Concept and theory research · Motion capture trajectory analysis and animation · Selected Unity rendering. Delivered scope · One playable scenario and a project walkthrough.',
      images: [{ ...coverMeMedia }],
    },
    {
      title: 'Problem: Seeing movement is not the same as predicting it',
      narrative: 'A body changes its position and the space it occupies as it moves. Viewed from another angle, the same gesture can appear to have a different reach or scale. Our design question was how to make this gap between a visual estimate and recorded movement understandable through interaction. We chose an everyday situation: helping a friend stay dry, while anticipating where their next movement will take them.',
      insight: 'Design question · How might an everyday act of helping someone make the spatial demands of movement visible?',
      images: [{ ...coverMeMedia }],
    },
    {
      title: 'Research: From spatial perception to a playable question',
      narrative: 'My conceptual research connected spatial perception, proprioception and action-based perception with the idea of a “body script”: how movement unfolds through three-dimensional space. The report also draws on game-based learning to frame a cycle of prediction, action and feedback. These ideas informed the interaction; they do not establish that our prototype improves spatial ability or working memory. Although VR motivated the research, the delivered prototype is a Windows desktop game.',
      insight: 'Research to design · Let players inspect a movement, make a spatial prediction, then compare it with the recorded motion. Learning outcomes remain to be evaluated.',
      sources: [
        { label: 'Shi & Shih · Game-Based Learning Design Model (2015)', href: 'https://doi.org/10.1155/2015/549684' },
        { label: 'Azarby & Rice · Spatial Perception in Virtual Environments (2023)', href: 'https://doi.org/10.3390/buildings13010160' },
        { label: 'Witt · Action’s Effect on Perception (2011)', href: 'https://doi.org/10.1177/0963721411408770' },
      ],
      images: [{
        src: 'assets/images/cover-me/cover-me-research-blender.png', fit: 'contain',
        alt: 'Blender armature beside a Python script calculating joint offsets relative to the root bone',
        caption: 'Research workflow · inspecting the skeletal hierarchy and calculating joint offsets in Blender.',
      }],
    },
    {
      title: 'Data analysis: Reading trajectories and spatial occupancy',
      narrative: 'The supplied dataset recorded 28 joints in a hierarchy rooted at the hips. The team cleaned quaternion and position data in Python and visualised the animation in Blender. My work focused on analysing and animating motion trajectories. Foot positions revealed an inclined movement plane; fitting a plane informed a rotation correction in Blender. Alongside these paths, convex hulls described the space enclosed by each pose. Together, trajectories and enclosing volumes made the body’s changing spatial demands visible and informed the game’s prediction-and-feedback loop.',
      insight: 'Two complementary views · Trajectories show where joints move over time; convex hulls describe the enclosing space of a pose. The displayed volumes are relative dataset measurements, with no physical units established here.',
      images: [trajectories, hulls],
    },
    {
      title: 'Solution: An umbrella becomes a spatial decision',
      narrative: 'Players preview the character’s motion up to three times, then move and scale an umbrella and adjust their viewing angle before committing. A larger umbrella offers more coverage but consumes more stamina; insufficient coverage reduces the character’s health. This trade-off makes the prediction matter. The result view brings joint trajectories and animated convex hulls back into the experience so players can compare their estimate with the movement. I contributed the analysis animations and selected Unity rendering within the team’s Blender-to-Unity workflow.',
      insight: 'Interaction loop · Preview the motion → predict position and reach → place the umbrella → inspect the visual feedback. One scenario was completed within the project timeframe.',
      images: [
        {
          src: 'assets/images/cover-me/cover-me-solution-preview.png', fit: 'contain',
          alt: 'Cover Me Unity gameplay with an umbrella, movement preview panel and placement controls',
          caption: 'Gameplay · preview the movement, then position and scale the umbrella before selecting Let’s Go.',
        },
        {
          src: 'assets/images/cover-me/cover-me-solution-feedback.png', fit: 'contain',
          alt: 'Cover Me result screen showing a star rating, coloured joint trajectories and a convex hull view',
          caption: 'Feedback · compare the prediction with joint trajectories and the space enclosed by the moving body.',
        },
      ],
    },
    {
      title: 'Reflection: Making the data part of the experience',
      narrative: 'The most useful connection was between the analysis and the interaction: trajectories and spatial envelopes became both design material and feedback for the player. The project also showed why an engaging demonstration needs an evaluation plan. We produced one scenario, but did not establish a measured improvement in spatial perception or memory. I would next test whether players can interpret the two visualisations and explain the difference between their prediction and the recorded motion. Additional scenarios and a VR version remain future directions.',
      insight: 'What I take forward · Connect theoretical framing to a concrete interaction, make data transformations legible, and distinguish an intended learning experience from a demonstrated learning effect.',
      images: [{
        src: 'assets/images/cover-me/cover-me-reflection-title.png', fit: 'contain',
        alt: 'Cover Me Body Script title screen with an illustrated character and a play button',
        caption: 'Cover Me · Body Script title screen and illustrated visual direction.',
      }],
    },
  ];
  return chapters.map((chapter, index) => ({ number: index + 1, label: chapterLabels[index], ...chapter }));
}

function snuffMouthChapters() {
  const chapters = [
    {
      title: 'Overview: Turning an invisible harm into a physical encounter',
      narrative: 'SnuffMouth is a 2026 independent Design Robotics project that I developed over approximately three to four months. I designed and built the complete installation—from the concept and interaction flow to Arduino/C++ programming, 3D modelling and printing, electronics integration and final fabrication. When a cigarette approaches, the character reacts through jaw movement, coughing audio and dark mist, translating second-hand smoke into an immediate bodily response.',
      insight: 'Role · Sole designer and maker · 2026 · Design Robotics · approximately 3–4 months. No client commission or behaviour-change result is claimed.',
      images: [{
        src: 'assets/images/snuffmouth/snuffmouth-overview-final-output.png',
        alt: 'Three views of the completed SnuffMouth installation showing the open mouth, companion forms and displayed final piece',
        caption: 'Final output overview · interaction detail, complete character group and gallery display.',
      }],
    },
    {
      title: 'Problem: Warnings can feel distant from the moment of exposure',
      narrative: 'I began with a tension in shared spaces: second-hand smoke is harmful, but signs and abstract statistics can remain detached from the moment someone lights a cigarette. Rather than design another passive warning, I asked how a robotic installation might make the physical and social consequence feel immediate without turning the encounter into a lecture.',
      insight: 'Design question · How might an embodied response make an invisible environmental effect visible, audible and difficult to ignore?',
      images: [{
        src: 'assets/images/snuffmouth/snuffmouth-problem-cutout.png',
        alt: 'The completed SnuffMouth robotic mouth displayed with two companion character forms',
        caption: 'Problem made tangible · the SnuffMouth installation turns an invisible environmental effect into a physical encounter.',
      }],
    },
    {
      title: 'Research: Evidence for an embodied warning',
      narrative: 'WHO states that there is no safe level of exposure to second-hand tobacco smoke and attributes more than 1.6 million premature deaths each year to it. The 2023 China National Youth Tobacco Survey found that 35.4% of surveyed secondary-school students reported exposure at school in the previous 30 days. Its national three-stage stratified cluster sample covered 31 provincial-level areas, although the authors note self-report and recall bias. I used this evidence to frame the seriousness and reach of the issue—not to claim that SnuffMouth changes behaviour.',
      insight: 'Desk research supported the problem context. The installation remained an exploratory design hypothesis, not a proven public-health intervention.',
      sources: [
        { label: 'WHO · Tobacco fact sheet', href: 'https://www.who.int/en/news-room/fact-sheets/detail/tobacco' },
        { label: 'China CDC Weekly · Secondary-school survey, 2023', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11154104/' },
      ],
      images: [
        {
          src: 'assets/images/snuffmouth/snuffmouth-research-school-exposure.png',
          alt: 'Bar charts comparing reported second-hand smoke exposure at school across Chinese regions and school stages',
          caption: 'Research context · reported second-hand smoke exposure at school across regions and education stages.',
        },
        {
          src: 'assets/images/snuffmouth/snuffmouth-research-asia-smoking.png',
          alt: 'Infographic comparing selected countries shares of the world smoker population and global population',
          caption: 'Research context · an Asia-focused smoking prevalence infographic used during project framing.',
        },
      ],
    },
    {
      title: 'Ideation: Turn cause and consequence into one short scene',
      narrative: 'I storyboarded a simple event sequence: the robot waits, detects a cigarette, moves its jaw, coughs and releases dark mist while the mouth interior shifts from healthy pink towards contaminated black. Early mouth studies evolved into a larger character whose exaggerated expression could hold discomfort and dark humour at the same time.',
      insight: 'The storyboard let me connect audience action, mechanical response and narrative meaning before committing to fabrication.',
      images: [{
        src: 'assets/images/snuffmouth/snuffmouth-solution-storyboard.png',
        alt: 'Nine-panel storyboard showing a cigarette approaching SnuffMouth, the mouth reacting and a nearby person coughing',
        caption: 'Interaction storyboard · the planned sequence from cigarette detection to a visible, audible bodily response.',
      }],
    },
    {
      title: 'Solution: I integrated sensing, movement, sound and mist',
      narrative: 'I programmed event-driven Arduino/C++ logic around an HC-SR04 ultrasonic sensor. A high-torque stepper motor drives the jaw, an Adafruit Music Maker shield plays the cough, and a humidifier releases dark mist. I modelled and 3D-printed parts, fabricated the wooden-board frame, sculpted the mouth in air-hardening clay and tested both printed and laser-cut gears before selecting wood for the final mechanism.',
      insight: 'The completed system connected interaction design, electronics, code, 3D fabrication and hand-built material detail in one responsive installation.',
      images: [{
        src: 'assets/images/snuffmouth/snuffmouth-solution-concept-material.png',
        alt: 'SnuffMouth concept and material diagram connecting the evolving mouth form to wood, modelling clay, a stepper motor, ultrasonic sensor, audio shield and humidifier',
        caption: 'Solution architecture · form development, fabrication materials and the sensing, motion, sound and mist components.',
        fit: 'contain',
      }],
    },
    {
      title: 'Reflection: Exhibition engagement revealed the maintenance problem',
      narrative: 'I exhibited the completed installation in the campus art museum exhibition room. Visitors stopped to trigger the response, and many chose to photograph it—useful qualitative evidence that the character invited participation, but not a formal evaluation. Repeated operation exposed two practical weaknesses: dark mist created a frequent cleaning burden, and the jaw sometimes opened without closing because the motor torque could not reliably overcome the mouth material’s weight.',
      insight: 'Next iteration · Use a lighter jaw and higher-torque actuation, isolate the mist path for easier cleaning, then run structured observation and short participant interviews.',
      images: [{
        src: 'assets/images/snuffmouth/snuffmouth-reflection-prototype.png',
        alt: 'Three views of the SnuffMouth prototype showing the mouth interaction, interior mechanism and side gears',
        caption: 'Reflection · the final prototype reveals both its expressive character and the mechanical system inside.',
      }],
    },
  ];

  return chapterLabels.map((label, index) => ({
    number: index + 1,
    label,
    ...chapters[index],
  }));
}

function exoFitsChapters() {
  const chapters = [
    {
      title: 'Overview: Trying on a world beyond Earth',
      narrative: 'Exo-Fits is an independent interactive installation that I developed to turn planetary data into an embodied AR spacewear experience. A visitor chooses Venus, Jupiter or Uranus on an iPad, then stands in front of a camera while a projected interface tracks their body and overlays a responsive suit shaped by that planet’s conditions. I brought together concept development, interaction design, Unity prototyping, body tracking, projection and exhibition communication as one complete personal project.',
      insight: 'Role · Sole designer and developer · AR interaction, Unity prototyping, visual identity and exhibition design.',
      images: [{
        src: 'assets/images/exofits/exofits-overview-panorama.png',
        alt: 'Wide strip showing the Exo-Fits planet menu and final Venus, Jupiter and Uranus body-tracking interfaces',
        caption: 'Final interaction panorama · drag sideways to compare the mission menu and three planetary spacewear states.',
        panorama: true,
        href: EXOFITS_FIGMA_URL,
        cta: 'Open interactive prototype in Figma ↗\uFE0E',
      }],
    },
    {
      title: 'Problem: Environmental data is difficult to feel',
      narrative: 'Facts about atmospheric pressure, temperature, radiation and gravity can describe a planet accurately while still feeling remote from the body. I asked how an exhibition could move beyond reading those values and let visitors imagine a more personal question: if human life expanded beyond Earth, what might a future traveller need to wear—and how would those environmental differences change the experience of their body?',
      insight: 'Design question · How might planetary conditions become a playful, embodied encounter rather than a distant scientific display?',
      images: [{
        src: 'assets/images/exofits/exofits-poster-question.png',
        alt: 'Exo-Fits exhibition poster asking what humans would wear if civilisation expanded beyond Earth',
        caption: 'Speculative prompt · the exhibition begins with a question that connects planetary conditions to the visitor’s body.',
        fit: 'contain',
        layout: 'portrait',
      }],
    },
    {
      title: 'Research: From planetary conditions to trackable body data',
      narrative: 'I used NASA’s planet resources to compare environmental characteristics and identify a clear narrative for Venus, Jupiter and Uranus. I then reviewed Unity AR Foundation body tracking to understand how a live camera feed could anchor a digital suit to a moving person. These sources informed the content and technical direction; they do not prove that the installation teaches science or changes audience understanding.',
      insight: 'Evidence boundary · Official planetary and body-tracking documentation informed the design. No formal audience research or measured learning outcome is claimed.',
      sources: [
        { label: 'NASA · Solar System Planets', href: 'https://science.nasa.gov/solar-system/planets/' },
        { label: 'Unity · AR Foundation body tracking', href: 'https://docs.unity.cn/Packages/com.unity.xr.arfoundation%406.6/manual/features/body-tracking.html' },
      ],
      images: [{
        src: 'assets/images/exofits/exofits-poster-jupiter.png',
        alt: 'Purple Exo-Fits Jupiter poster combining a gas-giant landscape with AR spacewear imagery',
        caption: 'Research translated into visual language · Jupiter’s gas-giant identity became a distinct suit and exhibition colour direction.',
        fit: 'contain',
        layout: 'portrait',
      }],
    },
    {
      title: 'Ideation: Moving from projected objects to a live body',
      narrative: 'My first direction projected information onto a hand and used a separate surface to show the selected gear. I expanded this into a full-body projection-mapping concept with several projectors, a mannequin or wearable form and environmental text around the visitor. The diagrams revealed practical problems: uncontrolled light, complex calibration, limited direct interaction and too much equipment competing for attention. I therefore moved towards a camera-based experience in which the visitor’s own movement becomes the central input.',
      insight: 'Design pivot · Replace a fragile multi-projector setup with one camera, one tracked body and one clear projected response.',
      images: [
        {
          src: 'assets/images/exofits/exofits-concept-hand-projection.png',
          alt: 'Early Exo-Fits diagram showing a projected hand, background screen and separate equipment display',
          caption: 'Early concept · hand sensing and projection explored how environmental data might attach to the body.',
          fit: 'contain',
        },
        {
          src: 'assets/images/exofits/exofits-concept-full-body-projection.png',
          alt: 'Exo-Fits projection-mapping diagram with a full-body figure, three projectors and surrounding environmental data',
          caption: 'Expanded concept · full-body projection mapping made the experience more immersive but exposed setup and lighting risks.',
          fit: 'contain',
        },
      ],
    },
    {
      title: 'Solution: Two roles make the journey collaborative',
      narrative: 'The final flow gives two visitors complementary roles. The Conductor uses the iPad to choose a planetary mission, while the Traveller stands on the marked portal area and faces the camera. Unity body tracking maps the selected AR suit to the Traveller, and the projector turns the wall into a shared mission view. This simplified the hardware while keeping choice, movement and social participation visible to the room.',
      insight: 'Final system · iPad mission control + live camera + Unity body tracking + one projected exhibition interface.',
      images: [{
        src: 'assets/images/exofits/exofits-instructions.png',
        alt: 'Orange Exo-Fits instruction poster explaining the Conductor and Traveller roles',
        caption: 'Exhibition instructions · one visitor selects the mission while another steps into the tracked spacewear experience.',
        fit: 'contain',
        layout: 'portrait',
      }],
    },
    {
      title: 'Reflection: Participation worked, but the experience depended on a partner',
      narrative: 'In the exhibition, visitors across age groups recognised the body-tracking interaction, often tried it in pairs and sometimes photographed the projected result. I treat these as qualitative observations rather than a formal evaluation. The two-role structure also created a weakness: a solo visitor could not easily control the iPad and stand in the tracked area at the same time. I also identified button copy, joint-mesh alignment and projection scale as details that needed refinement.',
      insight: 'Next iteration · Add gesture-based mission selection for a solo visitor, improve joint alignment and test a larger projection through structured observation and short interviews.',
      images: [
        {
          src: 'assets/images/exofits/exofits-poster-orange.png',
          alt: 'Orange and black Exo-Fits exhibition identity poster with planetary landscape and AR suit imagery',
          caption: 'Exhibition identity · the orange poster system connected the speculative spacewear story to the physical display.',
          fit: 'contain',
          layout: 'portrait',
        },
        {
          src: 'assets/images/exofits/exofits-poster-jupiter.png',
          alt: 'Purple Jupiter edition of the Exo-Fits exhibition poster',
          caption: 'Visual system iteration · colour and imagery shifted with the selected planetary environment.',
          fit: 'contain',
          layout: 'portrait',
        },
      ],
    },
  ];

  return chapterLabels.map((label, index) => ({
    number: index + 1,
    label,
    ...chapters[index],
  }));
}

function prototypeCover(sample, label) {
  return {
    src: null,
    href: sample.prototypeUrl,
    eyebrow: `${label} · Interactive mobile prototype`,
    title: sample.title,
    subtitle: 'Discover, organise and follow stories across Read and Watch media.',
    cta: 'Open prototype',
    alt: `Open the ${sample.title} interactive prototype`,
    caption: `${label} · Interactive prototype, opens in a new tab.`,
  };
}

function caseStudyChapters(sample) {
  const chapters = [
    {
      title: 'Overview: One calm layer for stories spread across markets',
      narrative: 'I created BL Universal Media Library after noticing how the field had expanded beyond an earlier Japan-centred landscape. Readers can now follow strong work from Japan, China and Korea, but titles, release news and legal access remain dispersed across country-specific platforms. I designed a neutral discovery and tracking layer that connects works, adaptations, official regional availability, personal lists, progress and updates. It does not host or stream content.',
      insight: 'Self-initiated independent product-design case study · 2026 · Sole designer · High-fidelity interactive concept prototype.',
    },
    {
      title: 'Problem: The story continues, but the information breaks apart',
      narrative: 'A reader may need to connect original, translated and romanised titles; identify whether a work is manga, manhwa, manhua, novel or adaptation; check release status; find an official provider for their territory and language; and remember what to continue. Trackers, licensed services, community posts and personal notes each solve part of that journey, but the hand-offs create repeated searching and uncertainty.',
      insight: 'Design question · How might one trustworthy discovery and tracking layer connect BL stories without becoming another content host?',
    },
    {
      title: 'Research: Triangulating behaviour, scale and availability',
      narrative: 'My desk research combined peer-reviewed qualitative evidence, an industry filing and official platform policy. A platform-ecology study documents Chinese BL fans moving between commercial, fan-run and outbound-link platforms. For broader webcomic context, WEBTOON’s 2024 SEC filing reported approximately 170 million monthly users across more than 150 countries as of 31 March 2024; this is broader webcomic context, not BL market size. WEBTOON’s terms also state that catalogue access can vary by geography and licensing. Community observation helped me identify vocabulary and recurring workarounds, but I conducted no formal interviews or representative survey.',
      insight: 'Evidence boundary · Desk research and community observation supported the fragmentation hypothesis; neither establishes the size or preferences of the global BL audience.',
      sources: [
        { label: 'SAGE · BL platform ecology study', href: 'https://journals.sagepub.com/doi/pdf/10.1177/29768624251320367' },
        { label: 'WEBTOON · 2024 SEC prospectus', href: 'https://www.sec.gov/Archives/edgar/data/1997859/000119312524162032/d396527ds1a.htm' },
        { label: 'WEBTOON · Terms and regional availability', href: 'https://about.webtoon.com/terms' },
      ],
    },
    {
      title: 'Ideation: Model one story ecosystem, not separate products',
      narrative: 'I treated media type as a property of a work rather than a database boundary. Read and Watch keep distinct discovery patterns, but share title aliases, adaptation relationships, tags, content boundaries, regional availability and personal state. I separated public Catalogue data from My Library, kept personal progress distinct from release status, and made guest browsing useful before sign-in.',
      insight: 'Core loop · Discover → Evaluate → Save → Open an official provider → Track → Follow updates → Rediscover.',
    },
    {
      title: 'Solution: Connect discovery, official access and continuity',
      narrative: 'I designed a connected flow for guest or member entry, optional preferences, search and mood-led discovery, detailed work evaluation, protected Save actions, official-provider handoff, progress updates and followed releases. Availability is contextual metadata tied to the work, edition, provider, territory, language, release status and verification time. The app is an official-provider discovery and tracking layer, not a content host.',
      insight: 'Creator-led prototype testing verified routes, interaction states and responsive behaviour. Automated QA supported implementation quality, not user desirability or taxonomy validity.',
    },
    {
      title: 'Reflection: A coherent prototype is not a validated service',
      narrative: 'The strongest product decision was moving from separate media channels towards one connected work ecosystem. That supports unified search and adaptation relationships while allowing Read and Watch to keep different presentation patterns. My prototype testing showed that the intended flow works technically; automated QA cannot show whether readers understand the taxonomy or trust the availability data. The next step is task-based research with participants and a lightweight card sort, not simply adding more screens.',
      insight: 'Known limits · No formal interviews or usability study; fictional catalogue data; unresolved alias governance; changing regional licences; and no evidence yet for recommendation quality.',
    },
  ];

  return chapterLabels.map((label, index) => ({
    number: index + 1,
    label,
    ...chapters[index],
    images: [prototypeCover(sample, label)],
  }));
}

export const projects = samples.map(sample => ({
  slug: sample.slug,
  title: ['slow-table', 'drift-space'].includes(sample.slug) ? 'To be unlocked' : sample.title,
  type: ['slow-table', 'drift-space'].includes(sample.slug) ? 'A new story is on its way' : sample.type,
  summary: ['slow-table', 'drift-space'].includes(sample.slug) ? 'A little mystery beneath the surface. Come back soon to discover more.' : sample.summary,
  locked: ['slow-table', 'drift-space'].includes(sample.slug),
  illustrative: sample.illustrative !== false,
  cardLabel: ['slow-table', 'drift-space'].includes(sample.slug) ? 'Coming soon' : sample.cardLabel || 'Illustrative concept',
  cardShape: sample.cardShape,
  accent: sample.accent,
  characterMedia: {
    src: {
      snuffmouth: 'assets/images/work-tide-notes-porcupinefish.png',
      exofits: 'assets/images/work-little-paths-tuna.png',
      'bl-universal-media-library': 'assets/images/work-shell-library-hermit-crab.png',
      'cover-me': 'assets/images/work-blue-hour-whale.png',
      'slow-table': 'assets/images/work-slow-table-turtle.png?v=2',
      'drift-space': 'assets/images/work-drift-space-seal.png',
    }[sample.slug],
    alt: `Watercolor ocean character for ${sample.title}`,
  },
  coverMedia: sample.slug === 'cover-me' ? { ...coverMeMedia } : sample.slug === 'exofits' ? {
    src: 'assets/images/exofits/exofits-overview-panorama.png',
    alt: 'Exo-Fits mission menu and planetary AR spacewear interfaces',
    caption: 'Interactive AR installation · final interface overview.',
  } : sample.prototypeUrl ? {
    src: null,
    alt: `${sample.title} interactive prototype cover`,
    caption: 'Interactive prototype · opens in a new tab.',
  } : sample.illustrative === false ? {
    src: 'assets/images/snuffmouth/snuffmouth-problem-cutout.png',
    alt: 'Final SnuffMouth Design Robotics prototype',
    caption: 'Completed independent Design Robotics prototype.',
  } : {
    src: null,
    alt: `Illustrative ${sample.title} project cover awaiting replacement`,
    caption: 'Illustrative placeholder · replace with your own project cover.',
  },
  chapters: sample.slug === 'cover-me' ? coverMeChapters() : sample.slug === 'snuffmouth' ? snuffMouthChapters() : sample.slug === 'exofits' ? exoFitsChapters() : sample.prototypeUrl ? caseStudyChapters(sample) : chaptersFor(sample),
}));
