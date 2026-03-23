const interpreters = [
  {
    id: 'freud',
    name: 'PixelFreud',
    shortName: 'Freud',
    unlocked: true,
    price: 'Gratis',
    tagline: 'Deseo, conflicto, censura y restos diurnos.',
    palette: {
      skin: '#e2c08f',
      coat: '#70543e',
      hair: '#e9e1d1',
      beard: '#efe6d6',
      glasses: '#3a261a',
    },
  },
  {
    id: 'jung',
    name: 'PixelJung',
    shortName: 'Jung',
    unlocked: false,
    price: '4.99',
    tagline: 'Símbolos, arquetipos y viaje interior.',
    palette: {
      skin: '#d6b489',
      coat: '#6d5d49',
      hair: '#d8c6a1',
      beard: 'transparent',
      glasses: '#34271e',
    },
  },
  {
    id: 'lacan',
    name: 'PixelLacan',
    shortName: 'Lacan',
    unlocked: false,
    price: '4.99',
    tagline: 'Falta, lenguaje y deseo en deslizamiento.',
    palette: {
      skin: '#d4af88',
      coat: '#51434f',
      hair: '#2b1c18',
      beard: 'transparent',
      glasses: '#1d1410',
    },
  },
  {
    id: 'neuro',
    name: 'PixelNeuro',
    shortName: 'Neuro',
    unlocked: false,
    price: '4.99',
    tagline: 'Memoria, emoción y consolidación REM.',
    palette: {
      skin: '#dfbf95',
      coat: '#506066',
      hair: '#d9d4cc',
      beard: 'transparent',
      glasses: '#314046',
    },
  },
];

const dreams = [
  {
    id: crypto.randomUUID(),
    createdAt: new Date('2024-04-23T08:00:00Z').toISOString(),
    title: 'Perdido en un laberinto',
    text: 'Estaba perdido en un laberinto oscuro y no podía encontrar la salida. Me sentía muy angustiado.',
    analyses: [
      {
        interpreterId: 'freud',
        mode: 'puntual',
        text: 'La escena del laberinto reúne extravío y urgencia. Más que describir un lugar, el sueño dramatiza una búsqueda trabada: algo quiere encontrar salida y al mismo tiempo queda retenido por una forma de censura interna.',
      },
      {
        interpreterId: 'jung',
        mode: 'puntual',
        text: 'El laberinto aparece como figura de un viaje interior. No indica una respuesta cerrada, sino un descenso a una zona psíquica donde todavía no hay centro visible, pero sí una invitación a orientarse de otro modo.',
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    createdAt: new Date('2024-04-21T08:00:00Z').toISOString(),
    title: 'El gato parlante',
    text: 'Un gato me hablaba desde el borde de una ventana. Decía mi nombre, pero yo no conseguía entender qué quería pedirme.',
    analyses: [
      {
        interpreterId: 'freud',
        mode: 'historial',
        text: 'Leído junto a los sueños recientes, vuelve la escena de una llamada enigmática. La voz aparece, pero no termina de traducirse: eso sugiere una insistencia psíquica que se presenta desplazada, sin declararse del todo.',
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    createdAt: new Date('2024-04-18T08:00:00Z').toISOString(),
    title: 'Vuelo sobre la ciudad',
    text: 'Sobrevolaba la ciudad al anochecer. Todo se veía ordenado desde arriba, pero tenía miedo de caer justo cuando empezaba a disfrutarlo.',
    analyses: [],
  },
];

const state = {
  activeInterpreterIndex: 0,
  currentScreen: 'main',
  selectedDreamId: dreams[0].id,
  draftDreamId: null,
};

const mainView = document.getElementById('mainView');
const detailView = document.getElementById('detailView');
const historyList = document.getElementById('historyList');
const newDreamButton = document.getElementById('newDreamButton');
const closeDetailButton = document.getElementById('closeDetailButton');
const dreamEditor = document.getElementById('dreamEditor');
const analysisStack = document.getElementById('analysisStack');
const singleReadButton = document.getElementById('singleReadButton');
const historyReadButton = document.getElementById('historyReadButton');
const detailInterpreterName = document.getElementById('detailInterpreterName');
const activeInterpreterName = document.getElementById('activeInterpreterName');
const activeInterpreterTagline = document.getElementById('activeInterpreterTagline');
const mainInterpreterPortrait = document.getElementById('mainInterpreterPortrait');
const leftInterpreterCard = document.getElementById('leftInterpreterCard');
const rightInterpreterCard = document.getElementById('rightInterpreterCard');
const prevInterpreterButton = document.getElementById('prevInterpreterButton');
const nextInterpreterButton = document.getElementById('nextInterpreterButton');
const detailInterpreterButton = document.getElementById('detailInterpreterButton');
const detailNextInterpreterButton = document.getElementById('detailNextInterpreterButton');
const lockedOffer = document.getElementById('lockedOffer');
const lockedOfferText = document.getElementById('lockedOfferText');
const unlockInterpreterButton = document.getElementById('unlockInterpreterButton');
const unlockBundleButton = document.getElementById('unlockBundleButton');
const bundleOfferButton = document.getElementById('bundleOfferButton');
const historyItemTemplate = document.getElementById('historyItemTemplate');
const analysisTemplate = document.getElementById('analysisTemplate');

function getActiveInterpreter() {
  return interpreters[state.activeInterpreterIndex];
}

function getSelectedDream() {
  return dreams.find((dream) => dream.id === state.selectedDreamId) ?? null;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

function getRelativeInterpreter(offset) {
  const total = interpreters.length;
  const index = (state.activeInterpreterIndex + offset + total) % total;
  return interpreters[index];
}

function applyPortraitPalette(element, interpreter) {
  element.style.setProperty('--skin', interpreter.palette.skin);
  element.style.setProperty('--coat', interpreter.palette.coat);
  element.style.setProperty('--hair', interpreter.palette.hair);
  element.style.setProperty('--beard', interpreter.palette.beard);
  element.style.setProperty('--glasses', interpreter.palette.glasses);
}

function buildSideInterpreterMarkup(interpreter) {
  return `
    <div class="side-portrait"></div>
    <div class="side-label">${interpreter.unlocked ? interpreter.shortName : `Bloqueado<br />${interpreter.price}`}</div>
    <div class="side-meta">${interpreter.unlocked ? interpreter.price : interpreter.name}</div>
  `;
}

function renderCabinet() {
  const activeInterpreter = getActiveInterpreter();
  const leftInterpreter = getRelativeInterpreter(-1);
  const rightInterpreter = getRelativeInterpreter(1);

  activeInterpreterName.textContent = activeInterpreter.name;
  activeInterpreterTagline.textContent = activeInterpreter.tagline;
  detailInterpreterName.textContent = activeInterpreter.name;
  applyPortraitPalette(mainInterpreterPortrait, activeInterpreter);

  [
    [leftInterpreterCard, leftInterpreter],
    [rightInterpreterCard, rightInterpreter],
  ].forEach(([container, interpreter]) => {
    container.className = `side-interpreter ${interpreter.unlocked ? '' : 'locked'}`.trim();
    container.innerHTML = buildSideInterpreterMarkup(interpreter);
    container.setAttribute('aria-label', `${interpreter.name} ${interpreter.unlocked ? 'disponible' : `bloqueado por ${interpreter.price}`}`);
    container.onclick = () => {
      state.activeInterpreterIndex = interpreters.findIndex(({ id }) => id === interpreter.id);
      render();
    };
    applyPortraitPalette(container.querySelector('.side-portrait'), interpreter);
  });
}

function renderHistory() {
  historyList.innerHTML = '';

  dreams.forEach((dream) => {
    const fragment = historyItemTemplate.content.cloneNode(true);
    const button = fragment.querySelector('.history-item');
    fragment.querySelector('.history-item-title').textContent = dream.title;
    fragment.querySelector('.history-item-date').textContent = formatDate(dream.createdAt);
    button.addEventListener('click', () => openDream(dream.id));
    historyList.appendChild(fragment);
  });
}

function renderLockedOffer() {
  const activeInterpreter = getActiveInterpreter();

  if (activeInterpreter.unlocked) {
    lockedOffer.hidden = true;
    return;
  }

  lockedOffer.hidden = false;
  lockedOfferText.textContent = `${activeInterpreter.name} está bloqueado. Puedes comprar este intérprete por ${activeInterpreter.price} o desbloquear los tres extras por 9.99.`;
}

function renderAnalyses() {
  const dream = getSelectedDream();
  analysisStack.innerHTML = '';

  if (!dream || dream.analyses.length === 0) {
    analysisStack.innerHTML = `
      <article class="analysis-card">
        <div class="analysis-avatar"></div>
        <div class="analysis-content">
          <div class="analysis-heading-row">
            <h3 class="analysis-title">Sin lecturas todavía</h3>
            <span class="analysis-mode">Nota nueva</span>
          </div>
          <p class="analysis-body">Este sueño todavía no tiene interpretación. Elige una lectura para empezar a poblar la nota desde la voz del intérprete activo.</p>
        </div>
      </article>
    `;
    applyPortraitPalette(analysisStack.querySelector('.analysis-avatar'), getActiveInterpreter());
    return;
  }

  dream.analyses.forEach((analysis) => {
    const interpreter = interpreters.find(({ id }) => id === analysis.interpreterId) ?? getActiveInterpreter();
    const fragment = analysisTemplate.content.cloneNode(true);
    fragment.querySelector('.analysis-title').textContent = `${interpreter.shortName}:`;
    fragment.querySelector('.analysis-mode').textContent = analysis.mode === 'historial' ? 'Con historial' : 'Puntual';
    fragment.querySelector('.analysis-body').textContent = analysis.text;
    const avatar = fragment.querySelector('.analysis-avatar');
    applyPortraitPalette(avatar, interpreter);
    analysisStack.appendChild(fragment);
  });
}

function renderDetailView() {
  const dream = getSelectedDream();
  const isDraft = state.draftDreamId === state.selectedDreamId;
  dreamEditor.value = dream?.text ?? '';
  dreamEditor.placeholder = isDraft ? 'Escribe aquí lo que soñaste…' : 'Texto del sueño';
  renderLockedOffer();
  renderAnalyses();
}

function renderScreen() {
  const isMain = state.currentScreen === 'main';
  mainView.hidden = !isMain;
  detailView.hidden = isMain;
  mainView.classList.toggle('screen-active', isMain);
  detailView.classList.toggle('screen-active', !isMain);
}

function render() {
  renderCabinet();
  renderHistory();
  renderDetailView();
  renderScreen();
}

function cycleInterpreter(direction) {
  const total = interpreters.length;
  state.activeInterpreterIndex = (state.activeInterpreterIndex + direction + total) % total;
  render();
}

function createDraftDream() {
  const draft = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    title: 'Nuevo sueño',
    text: '',
    analyses: [],
  };

  dreams.unshift(draft);
  state.selectedDreamId = draft.id;
  state.draftDreamId = draft.id;
  state.currentScreen = 'detail';
  render();
  dreamEditor.focus();
}

function openDream(dreamId) {
  state.selectedDreamId = dreamId;
  state.draftDreamId = null;
  state.currentScreen = 'detail';
  render();
}

function closeDream() {
  const dream = getSelectedDream();
  if (dream) {
    dream.text = dreamEditor.value.trim();
    dream.title = dream.text ? buildDreamTitle(dream.text) : dream.title;
  }

  if (dream && state.draftDreamId === dream.id && !dream.text.trim() && dream.analyses.length === 0) {
    const index = dreams.findIndex(({ id }) => id === dream.id);
    if (index >= 0) {
      dreams.splice(index, 1);
    }
    state.selectedDreamId = dreams[0]?.id ?? null;
  }

  state.draftDreamId = null;
  state.currentScreen = 'main';
  render();
}

function buildDreamTitle(text) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) {
    return 'Nuevo sueño';
  }

  const short = clean.slice(0, 34);
  return short.length < clean.length ? `${short}…` : short;
}

function saveDreamText() {
  const dream = getSelectedDream();
  if (!dream) {
    return null;
  }

  dream.text = dreamEditor.value.trim();
  dream.title = buildDreamTitle(dream.text);
  return dream;
}

function addAnalysis(mode) {
  const dream = saveDreamText();
  if (!dream || !dream.text) {
    dreamEditor.focus();
    return;
  }

  const activeInterpreter = getActiveInterpreter();
  const modeLabel = mode === 'historial' ? 'Con historial' : 'Puntual';
  const text = activeInterpreter.unlocked
    ? buildInterpretationText(activeInterpreter.id, mode)
    : `${activeInterpreter.name} todavía está bloqueado. Esta nota ya deja ver cómo convivirían varias voces en el mismo sueño, pero para generar la lectura de ${activeInterpreter.shortName} tendrías que desbloquear el módulo individual o el pack completo de los tres extras por 9.99.`;

  dream.analyses.unshift({
    interpreterId: activeInterpreter.id,
    mode,
    text,
  });

  state.draftDreamId = null;
  renderAnalyses();
  renderHistory();
  renderLockedOffer();
  console.info(`Lectura ${modeLabel} añadida para ${activeInterpreter.name}.`);
}

function buildInterpretationText(interpreterId, mode) {
  const texts = {
    freud: {
      puntual:
        'Tomado por sí solo, el sueño organiza una escena donde la angustia no es solo emoción sino señal de un conflicto. El extravío, la búsqueda de salida y la oscuridad condensan algo que insiste, pero no aparece todavía en forma directa.',
      historial:
        'Leído junto a los sueños recientes, el motivo de perderse ya no funciona como accidente aislado. Empieza a parecer una serie: situaciones donde algo te llama, te orienta a medias y al mismo tiempo te desvía, como si el sueño trabajara una dificultad para encontrar lugar.',
    },
    jung: {
      puntual:
        'Aquí el laberinto puede leerse como símbolo de una travesía interior. No anuncia una verdad cerrada; sugiere que hay una parte de la psique que pide ser recorrida con otra disposición, menos orientada a la salida inmediata.',
      historial:
        'Con historial, el sueño gana espesor simbólico: reaparecen figuras de orientación incompleta, voces parciales y espacios de tránsito. La serie sugiere un proceso de individuación aún tenso, donde lo desconocido no es sólo amenaza, sino materia de transformación.',
    },
    lacan: {
      puntual:
        'El laberinto no sería aquí un simple lugar, sino una forma de mostrar cómo el sujeto se pierde en la cadena de sus propios significantes. La angustia aparece justo allí donde la salida esperada deja de responder.',
      historial:
        'Tomado con los sueños del mes, emerge una repetición: se te promete un punto de orientación y luego se desplaza. Esa oscilación hace pensar menos en un obstáculo externo que en la lógica misma del deseo y su falta.',
    },
    neuro: {
      puntual:
        'En una lectura neurocognitiva sobria, el sueño parece ensamblar ansiedad, memoria espacial y sensación corporal de amenaza. El laberinto funciona como simulación de navegación incierta bajo una carga afectiva elevada.',
      historial:
        'Con historial, la recurrencia de escenarios de búsqueda y desorientación podría reflejar la consolidación de temas emocionales repetidos. El cerebro no estaría revelando un secreto, sino recombinando patrones recientes para ensayar respuestas posibles.',
    },
  };

  return texts[interpreterId][mode];
}

prevInterpreterButton.addEventListener('click', () => cycleInterpreter(-1));
nextInterpreterButton.addEventListener('click', () => cycleInterpreter(1));
detailInterpreterButton.addEventListener('click', () => cycleInterpreter(-1));
detailNextInterpreterButton.addEventListener('click', () => cycleInterpreter(1));
newDreamButton.addEventListener('click', createDraftDream);
closeDetailButton.addEventListener('click', closeDream);
singleReadButton.addEventListener('click', () => addAnalysis('puntual'));
historyReadButton.addEventListener('click', () => addAnalysis('historial'));
bundleOfferButton.addEventListener('click', () => {
  alert('Aquí iría la compra del pack de PixelJung, PixelLacan y PixelNeuro por 9.99.');
});
unlockInterpreterButton.addEventListener('click', () => {
  const activeInterpreter = getActiveInterpreter();
  alert(`Aquí iría la compra individual de ${activeInterpreter.name} por ${activeInterpreter.price}.`);
});
unlockBundleButton.addEventListener('click', () => {
  alert('Aquí iría la compra del pack completo de los tres intérpretes extra por 9.99.');
});
dreamEditor.addEventListener('input', () => {
  const dream = getSelectedDream();
  if (!dream) {
    return;
  }

  dream.text = dreamEditor.value;
  dream.title = buildDreamTitle(dreamEditor.value || 'Nuevo sueño');
  renderHistory();
});

render();
