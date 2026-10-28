(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const STORAGE_KEY = 'lumen-ambient-canvas-v1';
  const PALETTES = {
    default: ['#a990ff', '#68d8d4', '#f28fbb', '#79a7ff'],
    ocean: ['#6ab8ff', '#43dfd0', '#8f9bff', '#b6d7ff'],
    sunset: ['#ff8c8f', '#ffc17d', '#d69be9', '#ffb6c5'],
    emerald: ['#77e9b7', '#6accc0', '#c4f18d', '#80d9a5'],
    mono: ['#eeeeff', '#b2bbd5', '#8f97ac', '#d0d1dc']
  };
  const QUOTES = [
    ['Almost everything will work again if you unplug it for a few minutes, including you.', 'ANNE LAMOTT'],
    ['The quieter you become, the more you can hear.', 'RAM DASS'],
    ['Nothing is worth more than this day.', 'JOHANN WOLFGANG VON GOETHE'],
    ['Nature does not hurry, yet everything is accomplished.', 'LAO TZU'],
    ['How we spend our days is, of course, how we spend our lives.', 'ANNIE DILLARD'],
    ['Simplicity boils down to two steps: identify the essential. Eliminate the rest.', 'LEO BABAUTA'],
    ['The present moment is filled with joy and happiness. If you are attentive, you will see it.', 'THICH NHAT HANH'],
    ['Adopt the pace of nature: her secret is patience.', 'RALPH WALDO EMERSON'],
    ['Almost everything is easier to start than to finish.', 'SAMUEL JOHNSON'],
    ['The secret of getting ahead is getting started.', 'MARK TWAIN']
  ];

  const SCENES = [
    { id: 'aurora', name: 'Aurora Drift', category: 'calm', mood: 'A LITTLE QUIETER', description: 'Slow ribbons of light, moving like a thought you almost remembered.', colors: ['#0a1830', '#3ce0bb', '#8b62f4'], tag: 'Atmospheric' },
    { id: 'stars', name: 'Deep Space', category: 'cosmic', mood: 'A LONG WAY FROM HERE', description: 'A quiet flight through a field of distant stars.', colors: ['#030714', '#456ee8', '#a6a2ff'], tag: 'Cosmic' },
    { id: 'ocean', name: 'Blue Hour', category: 'nature', mood: 'LET THE DAY SETTLE', description: 'A soft sun and rolling water at the edge of the evening.', colors: ['#132242', '#79b7ed', '#7b89d9'], tag: 'Ocean' },
    { id: 'particles', name: 'Connected', category: 'digital', mood: 'EVERYTHING IS CONNECTED', description: 'A changing constellation of points and almost-meetings.', colors: ['#0c1023', '#ad8cff', '#60d7d7'], tag: 'Generative' },
    { id: 'matrix', name: 'Data Rain', category: 'digital', mood: 'SIGNAL IN THE NOISE', description: 'Electric glyphs falling in an endless digital downpour.', colors: ['#03130f', '#43f59b', '#9efbc2'], tag: 'Digital' },
    { id: 'nebula', name: 'Velvet Nebula', category: 'cosmic', mood: 'SOMETHING BEAUTIFUL, SOMEWHERE', description: 'Clouds of impossible color drifting through the dark.', colors: ['#140b2b', '#ff8db8', '#8963ff'], tag: 'Dreamlike' },
    { id: 'geometry', name: 'Soft Geometry', category: 'calm', mood: 'ORDER IN MOTION', description: 'Orbiting lines, slow rotations and the comfort of a pattern.', colors: ['#0b0e21', '#8e84ff', '#61d6d0'], tag: 'Minimal' },
    { id: 'rain', name: 'Neon Rain', category: 'digital', mood: 'THE CITY NEVER SLEEPS', description: 'Light streaks slide down a midnight-blue window.', colors: ['#06101f', '#72a9ff', '#9276f0'], tag: 'Nocturnal' },
    { id: 'fireflies', name: 'Firefly Meadow', category: 'nature', mood: 'A SMALL KIND OF MAGIC', description: 'Tiny lights gathering and disappearing in the deep green.', colors: ['#051711', '#8df5ae', '#3cbd9b'], tag: 'Nature' },
    { id: 'solar', name: 'Little Solar System', category: 'cosmic', mood: 'A SMALL CORNER OF INFINITY', description: 'A miniature planetary dance, always finding its orbit.', colors: ['#080a1b', '#ffaf68', '#9b76f3'], tag: 'Space' },
    { id: 'mountains', name: 'Last Light', category: 'nature', mood: 'AFTER THE SUN GOES DOWN', description: 'Layered silhouettes beneath a sky that keeps changing.', colors: ['#241934', '#ff9a9f', '#6b7ed1'], tag: 'Landscape' },
    { id: 'liquid', name: 'Liquid Glass', category: 'calm', mood: 'GO WITH THE FLOW', description: 'Weightless color pools folding into one another.', colors: ['#06091b', '#7d9dff', '#c085ed'], tag: 'Fluid' },
    { id: 'spectrum', name: 'Slow Frequency', category: 'digital', mood: 'FIND YOUR FREQUENCY', description: 'A living spectral field of soft, synthetic pulses.', colors: ['#09091e', '#e185ff', '#61d7f5'], tag: 'Spectrum' },

    // Operating-system inspired simulations. These are visual loops, never real update or recovery tools.
    { id: 'bsod', name: 'Blue Screen of Death', category: 'system', mood: 'SYSTEM HALTED', description: 'A familiar blue crash screen, frozen in a quiet loop.', colors: ['#0078d7', '#ffffff', '#d6eaff'], tag: 'System', immersive: true },
    { id: 'blackout', name: 'Black Screen of Death', category: 'system', mood: 'NO SIGNAL', description: 'Almost total darkness, with a faint blinking cursor.', colors: ['#000000', '#333333', '#b3b3b3'], tag: 'Minimal', immersive: true },
    { id: 'windows-update', name: 'Windows Update', category: 'system', mood: 'PLEASE KEEP YOUR DEVICE ON', description: 'A calm, looping update screen with a softly turning spinner.', colors: ['#071b35', '#1687f8', '#79c8ff'], tag: 'OS Simulation', immersive: true },
    { id: 'mac-update', name: 'macOS Update', category: 'system', mood: 'INSTALLING SYSTEM SOFTWARE', description: 'A minimal dark upgrade screen and a slow progress bar.', colors: ['#050507', '#d9e1f5', '#818a9a'], tag: 'OS Simulation', immersive: true },
    { id: 'linux-upgrade', name: 'Linux Upgrade', category: 'system', mood: 'UPDATING PACKAGES', description: 'A terminal-inspired package upgrade that never finishes.', colors: ['#170d26', '#b58cff', '#f3a7d7'], tag: 'Linux', immersive: true },
    { id: 'kernel-panic', name: 'Kernel Panic', category: 'system', mood: 'KERNEL EXCEPTION', description: 'An endless stream of monospace diagnostic output.', colors: ['#000000', '#ff626c', '#f5f5f5'], tag: 'Linux', immersive: true },
    { id: 'terminal', name: 'Green Terminal', category: 'system', mood: 'CONNECTED TO LOCALHOST', description: 'A cinematic green command line with a blinking prompt.', colors: ['#020906', '#72ff9a', '#b5ffd0'], tag: 'Terminal', immersive: true },
    { id: 'boot-log', name: 'Linux Boot Log', category: 'system', mood: 'STARTING SERVICES', description: 'A stream of startup messages and service indicators.', colors: ['#080b12', '#5dffac', '#e3ebf7'], tag: 'Linux', immersive: true },
    { id: 'recovery', name: 'Automatic Repair', category: 'system', mood: 'RECOVERY ENVIRONMENT', description: 'A blue recovery interface with a gently spinning progress mark.', colors: ['#06162f', '#319bff', '#dcecff'], tag: 'Recovery', immersive: true },
    { id: 'bios', name: 'Retro BIOS', category: 'retro', mood: 'POWER-ON SELF TEST', description: 'A nostalgic text-only boot screen with old-school diagnostics.', colors: ['#05082a', '#a8c7ff', '#ffffff'], tag: 'Retro Tech', immersive: true },
    { id: 'ubuntu-upgrade', name: 'Ubuntu Upgrade', category: 'system', mood: 'A NEW SYSTEM IS TAKING SHAPE', description: 'Warm aubergine tones and package installation details.', colors: ['#230d20', '#f07840', '#ffba84'], tag: 'Linux', immersive: true },
    { id: 'shutdown', name: 'Endless Shutdown', category: 'system', mood: 'PLEASE WAIT', description: 'A softly lit shutdown screen that deliberately never completes.', colors: ['#050911', '#1a86e8', '#e5eef9'], tag: 'OS Simulation', immersive: true },

    { id: 'classic-hills', name: 'Classic Green Hills', category: 'retro', mood: 'A DESKTOP MEMORY', description: 'Layered green hills under an impossibly clean blue sky.', colors: ['#73c9fa', '#7ed26b', '#287f4b'], tag: 'Retro Nature' },
    { id: 'synthwave', name: 'Synthwave Sunset', category: 'retro', mood: 'DRIVE INTO THE NEON', description: 'A striped sunset hangs over an endless neon grid.', colors: ['#170d39', '#fb58c8', '#44e8ff'], tag: 'Retrowave' },
    { id: 'crt-console', name: 'Amber CRT', category: 'retro', mood: 'DISPLAY ACTIVE', description: 'Warm phosphor text, scanlines, and a tiny flicker.', colors: ['#090d08', '#ffb34e', '#ffe3a4'], tag: 'CRT' },
    { id: 'vhs-glitch', name: 'VHS Glitch', category: 'retro', mood: 'TRACKING…', description: 'Analog noise, chromatic offsets, and wandering tape lines.', colors: ['#080a17', '#ff477e', '#55f4eb'], tag: 'Analog' },
    { id: 'arcade-grid', name: 'Arcade Grid', category: 'retro', mood: 'INSERT COIN', description: 'A glowing wire grid with a low-poly horizon.', colors: ['#08091b', '#fa50d8', '#55dfff'], tag: 'Arcade' },
    { id: 'retro-desktop', name: 'Retro Desktop', category: 'retro', mood: 'DESKTOP ENVIRONMENT', description: 'A tiny fictional vintage desktop with windows and a moving pointer.', colors: ['#162a88', '#c4c9d8', '#f7f1c6'], tag: 'Desktop' },
    { id: 'pipes', name: 'Endless Pipes', category: 'retro', mood: 'NO TWO LOOPS ALIKE', description: 'Colorful 3D-style pipe paths build a forever-changing maze.', colors: ['#080b16', '#ff7f50', '#70e2ff'], tag: 'Classic Screensaver' },

    { id: 'tunnel', name: 'Prismatic Tunnel', category: 'abstract', mood: 'FALLING THROUGH COLOR', description: 'A rotating tunnel of luminous geometric frames.', colors: ['#040816', '#8b7cff', '#3ce6d9'], tag: 'Geometry' },
    { id: 'fractal', name: 'Fractal Bloom', category: 'abstract', mood: 'INFINITE DETAIL', description: 'Recursive-looking petals orbit around a bright center.', colors: ['#0b0820', '#ff73c7', '#7f8bff'], tag: 'Fractal' },
    { id: 'dna', name: 'DNA Helix', category: 'abstract', mood: 'PATTERNS OF LIFE', description: 'Two luminous strands twist through a field of particles.', colors: ['#061421', '#5af0e1', '#b88bff'], tag: 'Science' },
    { id: 'topography', name: 'Topographic Lines', category: 'abstract', mood: 'A MAP WITHOUT A DESTINATION', description: 'Contour lines ripple across an imaginary landscape.', colors: ['#101c25', '#e7ae78', '#7ed6c7'], tag: 'Generative' },
    { id: 'ripples', name: 'Water Ripples', category: 'abstract', mood: 'EVERYTHING STARTS SOMEWHERE', description: 'Soft rings spread outward through an inky surface.', colors: ['#061426', '#4fc7ee', '#a1f3e1'], tag: 'Fluid' },
    { id: 'ink', name: 'Ink in Water', category: 'abstract', mood: 'COLOR, WITHOUT HURRY', description: 'Soft pigment clouds unfurl and overlap in slow motion.', colors: ['#08091a', '#e478d6', '#6d8aff'], tag: 'Fluid' },
    { id: 'chromatic', name: 'Chromatic Drift', category: 'abstract', mood: 'A LITTLE OUT OF PHASE', description: 'Layered light rings slide through spectral color.', colors: ['#080a18', '#ff6aab', '#58e3ff'], tag: 'Color' },
    { id: 'wireframe', name: 'Wireframe World', category: 'abstract', mood: 'A WORLD IN OUTLINE', description: 'A 3D-inspired terrain mesh moves like a digital ocean.', colors: ['#050d1c', '#4ee7d2', '#7f96ff'], tag: '3D' },
    { id: 'clockwork', name: 'Clockwork', category: 'abstract', mood: 'PRECISION IN MOTION', description: 'Interlocking gear-like wheels rotate in a slow mechanical dance.', colors: ['#11121c', '#f3b96d', '#9ba6c9'], tag: 'Mechanical' },
    { id: 'plasma', name: 'Plasma Field', category: 'abstract', mood: 'ENERGY IN FLUX', description: 'Liquid gradients and interference waves fold over one another.', colors: ['#09061b', '#ff67b8', '#6a7aff'], tag: 'Generative' },
    { id: 'orbitarium', name: 'Orbitarium', category: 'cosmic', mood: 'GRAVITY, DRAWN IN LIGHT', description: 'Glowing objects trace elliptical paths around a central star.', colors: ['#050716', '#92aaff', '#ffca86'], tag: 'Orbital' },
    { id: 'prism', name: 'Prism Light', category: 'abstract', mood: 'LIGHT TAKES A DIFFERENT SHAPE', description: 'A glass-like prism sends moving beams across darkness.', colors: ['#090b18', '#86d7ff', '#f49ed5'], tag: 'Optics' },
    { id: 'quantum', name: 'Quantum Mesh', category: 'abstract', mood: 'PROBABILITY IN MOTION', description: 'A gently waving lattice of luminous points.', colors: ['#050916', '#65c9ff', '#b78bff'], tag: 'Science' },
    { id: 'mandala', name: 'Orbiting Mandala', category: 'abstract', mood: 'RETURN TO THE CENTER', description: 'A symmetrical radial drawing turns and breathes.', colors: ['#0c091d', '#f28bc7', '#9c8aff'], tag: 'Symmetry' },

    { id: 'rainy-city', name: 'Rainy City Window', category: 'nature', mood: 'A CITY BEHIND THE GLASS', description: 'Rain streaks run over a distant skyline of colored lights.', colors: ['#07111f', '#7397ff', '#ff9bc2'], tag: 'Cityscape' },
    { id: 'underwater', name: 'Deep Underwater', category: 'nature', mood: 'BELOW THE SURFACE', description: 'Sun rays, drifting particles, and bubbles rise from the deep.', colors: ['#021a2d', '#27bbd4', '#65f0ce'], tag: 'Ocean' },
    { id: 'snow-globe', name: 'Snow Globe', category: 'nature', mood: 'A WORLD IN SLOW MOTION', description: 'Snow falls over a tiny pine forest under a moonlit sky.', colors: ['#101b37', '#bfdcff', '#7b9ed3'], tag: 'Winter' },
    { id: 'desert-dusk', name: 'Desert Dusk', category: 'nature', mood: 'THE LAST WARM LIGHT', description: 'Copper dunes and a violet sky shift with the evening.', colors: ['#29142f', '#ff9c76', '#d05d8d'], tag: 'Landscape' },
    { id: 'jellyfish', name: 'Jellyfish Drift', category: 'nature', mood: 'FLOAT, THEN FLOAT SOME MORE', description: 'Glowing jellyfish pulse and drift through dark water.', colors: ['#041226', '#6be7ff', '#c58eff'], tag: 'Underwater' },
    { id: 'forest-night', name: 'Forest at Night', category: 'nature', mood: 'THE WOODS ARE BREATHING', description: 'Layered pine silhouettes and fireflies under a quiet sky.', colors: ['#051710', '#61d890', '#b8f4a4'], tag: 'Forest' },
    { id: 'embers', name: 'Floating Embers', category: 'nature', mood: 'A FIRE FAR AWAY', description: 'Glowing embers lift slowly through a deep charcoal haze.', colors: ['#10090b', '#ff784e', '#ffd27b'], tag: 'Warmth' },
    { id: 'storm', name: 'Distant Thunderstorm', category: 'nature', mood: 'WEATHER IN THE DISTANCE', description: 'Rain falls beneath rolling clouds and occasional branching lightning.', colors: ['#081020', '#738dcb', '#dae8ff'], tag: 'Weather' }
  ];

  const DEFAULT_WIDGETS = [
    { id: 'w-clock', type: 'clock', title: 'LOCAL TIME', x: 5, y: 43, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Dhaka' },
    { id: 'w-quote', type: 'quote', title: 'A DAILY THOUGHT', x: 69, y: 17, quoteIndex: 2 },
    { id: 'w-focus', type: 'focus', title: 'FOCUS SESSION', x: 70, y: 70, createdAt: Date.now(), duration: 25 }
  ];

  function loadState() {
    const fallback = {
      scene: 'aurora', speed: 1, density: 1, glow: true, palette: 'default',
      cycleEnabled: false, cycleInterval: 3, widgets: JSON.parse(JSON.stringify(DEFAULT_WIDGETS))
    };
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return fallback;
      const scene = SCENES.some(item => item.id === saved.scene) ? saved.scene : fallback.scene;
      const widgets = Array.isArray(saved.widgets) ? saved.widgets.filter(w => w && typeof w === 'object' && typeof w.id === 'string' && ['clock','quote','focus','note','countdown','worldclock','iframe','battery'].includes(w.type)).slice(0, 18) : fallback.widgets;
      return {
        ...fallback,
        ...saved,
        scene,
        speed: clamp(Number(saved.speed) || 1, .25, 2.5),
        density: clamp(Number(saved.density) || 1, .4, 1.8),
        glow: saved.glow !== false,
        palette: Object.hasOwn(PALETTES, saved.palette) ? saved.palette : 'default',
        cycleEnabled: Boolean(saved.cycleEnabled),
        cycleInterval: [1,3,5,10,20].includes(Number(saved.cycleInterval)) ? Number(saved.cycleInterval) : 3,
        widgets
      };
    } catch (error) {
      console.warn('Lumen settings could not be read; using defaults.', error);
      return fallback;
    }
  }

  let state = loadState();
  let activeFilter = 'all';
  let paused = false;
  let cleanMode = false;
  let cycleTimer = null;
  let toastTimer = null;
  let lastQuoteChange = 0;
  let quoteIndex = 0;
  let batteryInfo = null;
  let dragState = null;
  let lastFrame = 0;
  let elapsed = 0;
  let sceneSeed = 0;
  const sceneThumbnailCache = new Map();
  let sceneThumbnailObserver = null;

  const stage = $('#stage');
  const canvas = $('#sceneCanvas');
  let ctx = canvas.getContext('2d', { alpha: false });
  const widgetLayer = $('#widgetLayer');
  let width = 1;
  let height = 1;
  let dpr = 1;
  let particles = [];
  let rainDrops = [];
  let matrixColumns = [];
  let starPoints = [];
  let starZ = [];

  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
  function random(min, max) { return min + Math.random() * (max - min); }
  function pick(array) { return array[Math.floor(Math.random() * array.length)]; }
  function escapeHTML(value) { return String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char])); }
  function activeScene() { return SCENES.find(scene => scene.id === state.scene) || SCENES[0]; }
  function palette() { return PALETTES[state.palette] || PALETTES.default; }
  function sceneColors() {
    const p = palette();
    if (state.palette === 'default') return activeScene().colors;
    return [activeScene().colors[0], p[0], p[1], p[2]];
  }
  function iconRefresh(root = document) {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons({ root }); } catch (_) { window.lucide.createIcons(); }
    }
  }
  function saveState(showFeedback = false) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        scene: state.scene, speed: state.speed, density: state.density, glow: state.glow,
        palette: state.palette, cycleEnabled: state.cycleEnabled, cycleInterval: state.cycleInterval,
        widgets: state.widgets
      }));
      if (showFeedback) showToast('Canvas setup reset');
    } catch (error) {
      console.warn('Lumen could not save to local storage.', error);
      // Storage may be unavailable in private browsing; the canvas still works.

    }
  }
  function showToast(message) {
    $('#toastText').textContent = message;
    const toast = $('#toast');
    toast.classList.add('show');
    iconRefresh(toast);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }
  function updateSceneCopy() {
    const scene = activeScene();
    const index = SCENES.findIndex(item => item.id === scene.id) + 1;
    $('#sceneTitle').textContent = scene.name;
    $('#sceneMood').textContent = scene.mood;
    $('#sceneDescription').textContent = scene.description;
    stage.classList.toggle('scene-immersive', Boolean(scene.immersive));
    $('#stageSceneCategory').textContent = `${scene.category.toUpperCase()} · ${scene.tag.toUpperCase()}`;
    $('#footerSceneName').textContent = scene.name;
    $('#sceneIndexLabel').textContent = String(index).padStart(2, '0');
    $('#footerSceneCount').textContent = `${SCENES.length} scenes`;
    $('#currentSwatch').style.background = `linear-gradient(135deg, ${sceneColors()[1]}, ${sceneColors()[2] || sceneColors()[1]})`;
    $('#sceneCopy').style.opacity = '1';
    if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.gsap.fromTo('#sceneCopy h2', { y: 8, opacity: .45 }, { y: 0, opacity: 1, duration: .42, ease: 'power2.out', overwrite: true });
    }
  }
  function setScene(id, options = {}) {
    if (!SCENES.some(scene => scene.id === id)) return;
    state.scene = id;
    sceneSeed++;
    lastFrame = 0;
    initSceneData();
    ctx.fillStyle = '#050714';
    ctx.fillRect(0, 0, width, height);
    updateSceneCopy();
    renderSceneGrid();
    saveState();
    if (!options.keepCycle) resetCycleTimer();
  }
  function nextScene(direction = 1, randomOnly = false) {
    if (randomOnly) {
      const available = SCENES.filter(scene => scene.id !== state.scene);
      setScene(pick(available).id);
      return;
    }
    const i = SCENES.findIndex(scene => scene.id === state.scene);
    setScene(SCENES[(i + direction + SCENES.length) % SCENES.length].id);
  }

  const sceneArtLabels = {
    aurora: 'Aurora ribbons', stars: 'Deep space', ocean: 'Blue hour ocean', particles: 'Network particles', matrix: 'Digital rain', nebula: 'Velvet nebula', geometry: 'Soft geometry', rain: 'Neon rain', fireflies: 'Firefly meadow', solar: 'Solar system', mountains: 'Last light', liquid: 'Liquid glass', spectrum: 'Slow frequency', bsod: 'Blue crash screen', blackout: 'Black screen', 'windows-update': 'Windows update simulation', 'mac-update': 'macOS update simulation', 'linux-upgrade': 'Linux upgrade simulation', 'kernel-panic': 'Kernel panic terminal', terminal: 'Green terminal', 'boot-log': 'Boot log', recovery: 'System recovery', bios: 'Retro BIOS', 'ubuntu-upgrade': 'Ubuntu upgrade simulation', shutdown: 'Shutdown screen'
  };
  function drawSceneThumbnail(thumb) {
    const id = thumb.dataset.sceneThumb;
    if (!id) return;
    if (thumb.width !== 320) thumb.width = 320;
    if (thumb.height !== 180) thumb.height = 180;
    const visibleContext = thumb.getContext('2d', { alpha: false });
    const cachedCanvas = sceneThumbnailCache.get(id);
    if (cachedCanvas) {
      visibleContext.drawImage(cachedCanvas, 0, 0, thumb.width, thumb.height);
      return;
    }

    // Render each preview through the very same scene drawer used by the live canvas.
    // Temporary dimensions/state are restored afterward so previews never disturb the active scene.
    const saved = {
      ctx, width, height, dpr, scene: state.scene, speed: state.speed,
      density: state.density, glow: state.glow, palette: state.palette,
      particles, rainDrops, matrixColumns, starPoints, starZ
    };
    const offscreen = document.createElement('canvas');
    offscreen.width = 320;
    offscreen.height = 180;

    try {
      ctx = offscreen.getContext('2d', { alpha: false });
      width = offscreen.width;
      height = offscreen.height;
      dpr = 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#050714';
      ctx.fillRect(0, 0, width, height);

      state.scene = id;
      state.speed = 1;
      state.density = 1;
      state.glow = true;
      state.palette = 'default';
      initSceneData();

      const drawer = DRAWERS[id] || drawAurora;
      // A stable but varied sample time makes animated scenes recognizable at a glance.
      const previewTime = 4800 + Math.max(0, SCENES.findIndex(scene => scene.id === id)) * 317;
      if (drawer === drawSystemScene || drawer === drawRetroScene || drawer === drawAbstractScene || drawer === drawNatureScene) {
        drawer(id, previewTime);
      } else {
        drawer(previewTime);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      sceneThumbnailCache.set(id, offscreen);
      visibleContext.drawImage(offscreen, 0, 0, thumb.width, thumb.height);
    } catch (error) {
      console.warn(`Lumen could not render the ${id} scene thumbnail.`, error);
      visibleContext.fillStyle = (SCENES.find(scene => scene.id === id) || SCENES[0]).colors[0];
      visibleContext.fillRect(0, 0, thumb.width, thumb.height);
    } finally {
      ctx = saved.ctx;
      width = saved.width;
      height = saved.height;
      dpr = saved.dpr;
      Object.assign(state, { scene: saved.scene, speed: saved.speed, density: saved.density, glow: saved.glow, palette: saved.palette });
      particles = saved.particles;
      rainDrops = saved.rainDrops;
      matrixColumns = saved.matrixColumns;
      starPoints = saved.starPoints;
      starZ = saved.starZ;
    }
  }

  function observeSceneThumbnails() {
    const grid = $('#sceneGrid');
    const thumbnails = $$('.scene-thumb-canvas', grid);
    if (!thumbnails.length) return;

    if ('IntersectionObserver' in window) {
      if (!sceneThumbnailObserver) {
        sceneThumbnailObserver = new IntersectionObserver(entries => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            sceneThumbnailObserver.unobserve(entry.target);
            drawSceneThumbnail(entry.target);
          }
        }, { root: grid, rootMargin: '120px 0px' });
      }
      thumbnails.forEach(thumb => {
        if (sceneThumbnailCache.has(thumb.dataset.sceneThumb)) drawSceneThumbnail(thumb);
        else sceneThumbnailObserver.observe(thumb);
      });
    } else {
      thumbnails.forEach(drawSceneThumbnail);
    }
  }

  function renderSceneGrid() {
    const grid = $('#sceneGrid');
    if (sceneThumbnailObserver) $$('.scene-thumb-canvas', grid).forEach(thumb => sceneThumbnailObserver.unobserve(thumb));
    const search = ($('#sceneSearch').value || '').trim().toLowerCase();
    const visible = SCENES.filter(scene => (activeFilter === 'all' || scene.category === activeFilter) && `${scene.name} ${scene.description} ${scene.tag} ${scene.category}`.toLowerCase().includes(search));
    $('#sceneCount').textContent = String(visible.length);
    grid.innerHTML = visible.length ? visible.map(scene => `
      <button class="scene-card ${scene.id === state.scene ? 'selected' : ''}" type="button" data-scene="${scene.id}" aria-pressed="${scene.id === state.scene}" title="${escapeHTML(scene.name)} — ${escapeHTML(scene.description)}">
        <div class="scene-art ${scene.id}" style="--scene-a:${scene.colors[0]};--scene-b:${scene.colors[1]};--scene-c:${scene.colors[2] || scene.colors[1]}" role="img" aria-label="${escapeHTML(sceneArtLabels[scene.id] || scene.name)}"><canvas class="scene-thumb-canvas" data-scene-thumb="${scene.id}" width="320" height="180" aria-hidden="true"></canvas></div>
        <div class="scene-card-copy"><span><strong>${escapeHTML(scene.name)}</strong><small>${escapeHTML(scene.tag)}</small></span><span class="scene-card-arrow"><i data-lucide="${scene.id === state.scene ? 'check' : 'arrow-up-right'}"></i></span></div>
      </button>`).join('') : '<div class="no-scenes">No scenes match that search.<br>Try another name or filter.</div>';
    observeSceneThumbnails();
    iconRefresh(grid);
  }

  function widgetDefaultTitle(type) {
    return ({ clock:'LOCAL TIME', quote:'A DAILY THOUGHT', focus:'FOCUS SESSION', note:'A LITTLE NOTE', countdown:'COUNTDOWN', worldclock:'WORLD CLOCK', iframe:'WEB PANEL', battery:'BATTERY' })[type] || 'WIDGET';
  }
  function widgetDefaultPosition(index) {
    const positions = [ [7, 15], [70, 18], [70, 68], [7, 68], [37, 70], [39, 18], [36, 42], [7, 44], [68, 42], [38, 57] ];
    return positions[index % positions.length];
  }
  function widgetIcon(type) {
    return ({ clock:'clock', quote:'quote', focus:'timer', note:'sticky-note', countdown:'calendar', worldclock:'globe', iframe:'layout-dashboard', battery:'battery-charging' })[type] || 'circle';
  }
  function getSafeHttpUrl(raw) {
    try {
      const url = new URL(String(raw || '').trim());
      if (!['http:', 'https:'].includes(url.protocol)) return null;
      return url.href;
    } catch (_) { return null; }
  }
  function getQuote(widget) {
    const index = Number.isInteger(widget.quoteIndex) ? widget.quoteIndex : quoteIndex;
    return QUOTES[(index % QUOTES.length + QUOTES.length) % QUOTES.length];
  }
  function formatClock(date, timeZone, options = {}) {
    try {
      return new Intl.DateTimeFormat(undefined, { timeZone, hour: '2-digit', minute: '2-digit', ...(options.seconds ? { second:'2-digit' } : {}), hour12: false }).format(date);
    } catch (_) {
      return new Intl.DateTimeFormat(undefined, { hour:'2-digit', minute:'2-digit', hour12:false }).format(date);
    }
  }
  function formatDate(date, timeZone) {
    try { return new Intl.DateTimeFormat(undefined, { timeZone, weekday:'long', month:'short', day:'numeric', year:'numeric' }).format(date); }
    catch (_) { return new Intl.DateTimeFormat(undefined, { weekday:'long', month:'short', day:'numeric', year:'numeric' }).format(date); }
  }
  function formatDuration(totalSeconds) {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0 ? `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
  function getTimezoneLabel(timezone) {
    const labels = { 'Asia/Dhaka':'DHAKA', 'Asia/Kolkata':'KOLKATA', 'Asia/Tokyo':'TOKYO', 'Europe/London':'LONDON', 'Europe/Paris':'PARIS', 'America/New_York':'NEW YORK', 'America/Los_Angeles':'LOS ANGELES', 'Australia/Sydney':'SYDNEY', UTC:'UTC' };
    return labels[timezone] || String(timezone || 'LOCAL').replaceAll('_',' ').split('/').pop().toUpperCase();
  }
  function widgetContentMarkup(widget) {
    switch (widget.type) {
      case 'clock':
        return `<div class="widget-content"><div class="widget-time" data-role="time">--:--</div><div class="widget-date" data-role="date"></div><div class="widget-label">${escapeHTML(widget.title || 'LOCAL TIME')}</div></div>`;
      case 'quote': {
        const [quote, author] = getQuote(widget);
        return `<div class="widget-content"><div class="quote-mark">“</div><p class="quote-text" data-role="quote">${escapeHTML(quote)}</p><div class="quote-credit" data-role="quote-author">— ${escapeHTML(author)}</div></div>`;
      }
      case 'focus':
        return `<div class="widget-content"><div class="focus-status"><span class="focus-pulse"></span><span>IN YOUR OWN TIME</span></div><div class="focus-time" data-role="focus-time">00:00</div><div class="focus-caption" data-role="focus-caption">${Number(widget.duration || 25)} minute focus · just keep going</div></div>`;
      case 'note':
        return `<div class="widget-content"><div class="note-body ${widget.text ? '' : 'note-placeholder'}" data-role="note-body">${escapeHTML(widget.text || 'Click the edit icon to write a note…')}</div></div>`;
      case 'countdown':
        return `<div class="widget-content"><div class="countdown-head" data-role="countdown-head">Counting down</div><div class="countdown-value" data-role="countdown-value">--d --h</div><div class="countdown-units" data-role="countdown-units">DAYS · HOURS · MINUTES</div></div>`;
      case 'worldclock':
        return `<div class="widget-content"><div class="world-time" data-role="world-time">--:--</div><div class="world-date" data-role="world-date"></div><div class="world-zone" data-role="world-zone">${escapeHTML(getTimezoneLabel(widget.timezone || 'Asia/Dhaka'))}</div></div>`;
      case 'iframe': {
        const url = getSafeHttpUrl(widget.url);
        return `<div class="widget-content">${url ? `<iframe src="${escapeHTML(url)}" title="${escapeHTML(widget.title || 'Embedded web panel')}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="fullscreen; clipboard-read; clipboard-write"></iframe>` : `<div class="iframe-placeholder"><i data-lucide="layout-dashboard"></i><span>Set a website URL in this widget's settings.</span></div>`}</div>`;
      }
      case 'battery':
        return `<div class="widget-content"><div class="battery-icon"><i data-lucide="battery-charging"></i></div><div class="battery-copy"><div class="battery-level" data-role="battery-level">—%</div><div class="battery-caption" data-role="battery-caption">Checking browser support…</div><div class="battery-bar"><span data-role="battery-bar"></span></div></div></div>`;
      default:
        return '<div class="widget-content"></div>';
    }
  }
  function renderWidgets() {
    widgetLayer.innerHTML = state.widgets.map((widget, index) => {
      const [defaultX, defaultY] = widgetDefaultPosition(index);
      if (!Number.isFinite(widget.x)) widget.x = defaultX;
      if (!Number.isFinite(widget.y)) widget.y = defaultY;
      widget.x = clamp(widget.x, 1, 96);
      widget.y = clamp(widget.y, 1, 94);
      return `<article class="float-widget widget-${widget.type}" data-widget-id="${escapeHTML(widget.id)}" style="left:${widget.x}%;top:${widget.y}%;z-index:${index + 3}" aria-label="${escapeHTML(widget.title || widgetDefaultTitle(widget.type))} widget">
        <div class="widget-handle" data-drag-handle title="Drag to move"><span class="widget-handle-title"><i data-lucide="${widgetIcon(widget.type)}"></i><span>${escapeHTML(widget.title || widgetDefaultTitle(widget.type))}</span></span><span class="widget-actions">${widget.type === 'iframe' ? `<button class="widget-action" type="button" data-open-widget="${escapeHTML(widget.id)}" title="Open website in a new tab" aria-label="Open website in a new tab"><i data-lucide="external-link"></i></button>` : ''}<button class="widget-action" type="button" data-edit-widget="${escapeHTML(widget.id)}" title="Widget settings" aria-label="Widget settings"><i data-lucide="settings-2"></i></button><button class="widget-action" type="button" data-remove-widget="${escapeHTML(widget.id)}" title="Remove widget" aria-label="Remove widget"><i data-lucide="x"></i></button></span></div>
        ${widgetContentMarkup(widget)}
      </article>`;
    }).join('');
    $('#widgetCount').textContent = String(state.widgets.length);
    iconRefresh(widgetLayer);
    $$('.float-widget', widgetLayer).forEach(attachWidgetInteractions);
    updateWidgetLive();
    if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.gsap.fromTo($$('.float-widget', widgetLayer), { opacity: 0, y: 7 }, { opacity: 1, y: 0, duration: .32, stagger: .045, ease: 'power2.out', clearProps: 'transform' });
    }
    clampWidgetsToStage();
  }
  function attachWidgetInteractions(article) {
    const handle = $('[data-drag-handle]', article);
    const id = article.dataset.widgetId;
    handle.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.target.closest('button, a, input, select, textarea')) return;
      const widget = state.widgets.find(item => item.id === id);
      if (!widget) return;
      const rect = article.getBoundingClientRect();
      const stageRect = widgetLayer.getBoundingClientRect();
      dragState = { id, article, startX:event.clientX, startY:event.clientY, offsetX:event.clientX - rect.left, offsetY:event.clientY - rect.top, stageRect, moved:false };
      article.classList.add('dragging');
      article.style.zIndex = '90';
      event.preventDefault();
    });
    const openButton = $('[data-open-widget]', article);
    if (openButton) openButton.addEventListener('click', () => {
      const widget = state.widgets.find(item => item.id === id);
      const safeUrl = widget && getSafeHttpUrl(widget.url);
      if (safeUrl) window.open(safeUrl, '_blank', 'noopener,noreferrer');
    });
    $('[data-edit-widget]', article).addEventListener('click', () => {
      const widget = state.widgets.find(item => item.id === id);
      if (widget) openWidgetModal(widget.type, widget);
    });
    $('[data-remove-widget]', article).addEventListener('click', () => {
      state.widgets = state.widgets.filter(item => item.id !== id);
      renderWidgets();
      saveState();
      showToast('Widget removed');
    });
  }
  function onPointerMove(event) {
    if (!dragState) return;
    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;
    if (Math.abs(dx) + Math.abs(dy) > 3) dragState.moved = true;
    const stageRect = dragState.stageRect;
    const article = dragState.article;
    const w = article.offsetWidth;
    const h = article.offsetHeight;
    const left = clamp(event.clientX - stageRect.left - dragState.offsetX, 4, stageRect.width - w - 4);
    const top = clamp(event.clientY - stageRect.top - dragState.offsetY, 4, stageRect.height - h - 4);
    article.style.left = `${(left / stageRect.width) * 100}%`;
    article.style.top = `${(top / stageRect.height) * 100}%`;
    const widget = state.widgets.find(item => item.id === dragState.id);
    if (widget) { widget.x = (left / stageRect.width) * 100; widget.y = (top / stageRect.height) * 100; }
  }
  function onPointerUp() {
    if (!dragState) return;
    dragState.article.classList.remove('dragging');
    dragState.article.style.zIndex = String(Math.max(3, state.widgets.findIndex(w => w.id === dragState.id) + 3));
    if (dragState.moved) saveState();
    dragState = null;
  }

  function updateWidgetLive() {
    const now = new Date();
    state.widgets.forEach(widget => {
      const article = $(`[data-widget-id="${CSS.escape(widget.id)}"]`, widgetLayer);
      if (!article) return;
      if (widget.type === 'clock') {
        const tz = widget.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timeEl = $('[data-role="time"]', article);
        const dateEl = $('[data-role="date"]', article);
        if (timeEl) timeEl.textContent = formatClock(now, tz);
        if (dateEl) dateEl.textContent = formatDate(now, tz);
      } else if (widget.type === 'worldclock') {
        const timeEl = $('[data-role="world-time"]', article);
        const dateEl = $('[data-role="world-date"]', article);
        if (timeEl) timeEl.textContent = formatClock(now, widget.timezone || 'Asia/Dhaka');
        if (dateEl) dateEl.textContent = formatDate(now, widget.timezone || 'Asia/Dhaka');
      } else if (widget.type === 'focus') {
        const start = Number(widget.createdAt) || Date.now();
        const seconds = Math.max(0, (Date.now() - start) / 1000);
        const timeEl = $('[data-role="focus-time"]', article);
        const caption = $('[data-role="focus-caption"]', article);
        if (timeEl) timeEl.textContent = formatDuration(seconds);
        if (caption) {
          const duration = Number(widget.duration) || 25;
          const remaining = Math.max(0, duration * 60 - seconds);
          caption.textContent = seconds >= duration * 60 ? `Goal reached · ${duration} minute session` : `${Math.ceil(remaining / 60)} min to your ${duration} min goal`;
        }
      } else if (widget.type === 'countdown') {
        const target = new Date(widget.targetDate || Date.now() + 7 * 86400000).getTime();
        const remaining = target - Date.now();
        const head = $('[data-role="countdown-head"]', article);
        const value = $('[data-role="countdown-value"]', article);
        const units = $('[data-role="countdown-units"]', article);
        if (head) head.textContent = widget.title || 'Counting down';
        if (remaining <= 0) {
          if (value) { value.textContent = 'It is time'; value.classList.add('countdown-done'); }
          if (units) units.textContent = 'THE MOMENT IS HERE';
        } else {
          const totalMinutes = Math.floor(remaining / 60000);
          const days = Math.floor(totalMinutes / 1440);
          const hours = Math.floor((totalMinutes % 1440) / 60);
          const minutes = totalMinutes % 60;
          if (value) { value.textContent = `${days}d ${String(hours).padStart(2,'0')}h ${String(minutes).padStart(2,'0')}m`; value.classList.remove('countdown-done'); }
          if (units) units.textContent = 'DAYS · HOURS · MINUTES REMAIN';
        }
      } else if (widget.type === 'quote') {
        if (lastQuoteChange && Date.now() - lastQuoteChange < 45000) return;
        const q = getQuote(widget);
        const quoteEl = $('[data-role="quote"]', article);
        const authorEl = $('[data-role="quote-author"]', article);
        if (quoteEl) quoteEl.textContent = q[0];
        if (authorEl) authorEl.textContent = `— ${q[1]}`;
      } else if (widget.type === 'battery') {
        const level = $('[data-role="battery-level"]', article);
        const caption = $('[data-role="battery-caption"]', article);
        const bar = $('[data-role="battery-bar"]', article);
        if (!batteryInfo) {
          if (level) level.textContent = 'N/A';
          if (caption) caption.textContent = 'Not supported by this browser';
          if (bar) bar.style.width = '0%';
        } else {
          const pct = Math.round(batteryInfo.level * 100);
          if (level) level.textContent = `${pct}%`;
          if (caption) caption.textContent = batteryInfo.charging ? 'Charging now' : 'Battery level';
          if (bar) bar.style.width = `${pct}%`;
        }
      }
    });
  }

  function showWidgetModal(modal) {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    iconRefresh(modal);
    const first = $('input:not([type="hidden"]), textarea, select', modal);
    if (first) setTimeout(() => first.focus(), 30);
  }
  function hideModal(modal) {
    modal.hidden = true;
    if ($('#widgetModal').hidden && $('#helpModal').hidden) document.body.style.overflow = '';
  }
  function openWidgetModal(type, existing = null) {
    const widgetModal = $('#widgetModal');
    $('#widgetForm').reset();
    $('#widgetFormError').hidden = true;
    $('#modalWidgetType').value = type;
    $('#editingWidgetId').value = existing ? existing.id : '';
    $('#modalTitle').textContent = existing ? 'Tune this widget' : `Add ${({ clock:'a clock', quote:'a daily thought', focus:'a focus timer', note:'a sticky note', countdown:'a countdown', worldclock:'a world clock', iframe:'a web panel', battery:'a battery widget' })[type] || 'a widget'}`;
    $('#modalSubmitLabel').textContent = existing ? 'Save changes' : 'Add to canvas';
    $('#widgetTitleInput').value = existing?.title || widgetDefaultTitle(type);
    $('#widgetTextField').hidden = type !== 'note';
    $('#widgetUrlField').hidden = type !== 'iframe';
    $('#widgetDateField').hidden = type !== 'countdown';
    $('#widgetTimezoneField').hidden = !['clock','worldclock'].includes(type);
    $('#widgetDurationField').hidden = type !== 'focus';
    if (type === 'clock') $('#widgetTimezoneField').querySelector('label').textContent = 'Clock timezone';
    if (type === 'worldclock') $('#widgetTimezoneField').querySelector('label').textContent = 'Timezone';
    if (type === 'clock' || type === 'worldclock') $('#widgetTimezoneInput').value = existing?.timezone || (type === 'clock' ? (Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Dhaka') : 'Asia/Dhaka');
    if (type === 'note') $('#widgetTextInput').value = existing?.text || '';
    if (type === 'iframe') $('#widgetUrlInput').value = existing?.url || '';
    if (type === 'countdown') {
      const defaultTarget = new Date(Date.now() + 7 * 86400000);
      defaultTarget.setSeconds(0, 0);
      const toLocalInput = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}T${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
      let current = existing?.targetDate ? new Date(existing.targetDate) : defaultTarget;
      if (Number.isNaN(current.getTime())) current = defaultTarget;
      $('#widgetDateInput').value = toLocalInput(current);
    }
    if (type === 'focus') $('#widgetDurationInput').value = existing?.duration || 25;
    showWidgetModal(widgetModal);
  }
  function submitWidgetForm(event) {
    event.preventDefault();
    const type = $('#modalWidgetType').value;
    const existingId = $('#editingWidgetId').value;
    const title = $('#widgetTitleInput').value.trim() || widgetDefaultTitle(type);
    const errorEl = $('#widgetFormError');
    const newData = { type, title };
    if (['clock','worldclock'].includes(type)) newData.timezone = $('#widgetTimezoneInput').value;
    if (type === 'note') newData.text = $('#widgetTextInput').value.trim();
    if (type === 'iframe') {
      const url = getSafeHttpUrl($('#widgetUrlInput').value);
      if (!url) { errorEl.textContent = 'Enter a valid http:// or https:// URL.'; errorEl.hidden = false; return; }
      newData.url = url;
    }
    if (type === 'countdown') {
      const raw = $('#widgetDateInput').value;
      const target = raw ? new Date(raw) : null;
      if (!target || Number.isNaN(target.getTime())) { errorEl.textContent = 'Choose a valid date and time for the countdown.'; errorEl.hidden = false; return; }
      newData.targetDate = target.toISOString();
    }
    if (type === 'focus') {
      newData.duration = clamp(parseInt($('#widgetDurationInput').value, 10) || 25, 1, 600);
      if (existingId) {
        const previous = state.widgets.find(widget => widget.id === existingId);
        newData.createdAt = previous?.createdAt || Date.now();
      } else newData.createdAt = Date.now();
    }
    if (type === 'quote') {
      const previous = state.widgets.find(widget => widget.id === existingId);
      newData.quoteIndex = previous?.quoteIndex ?? Math.floor(Math.random() * QUOTES.length);
    }
    if (existingId) {
      const index = state.widgets.findIndex(widget => widget.id === existingId);
      if (index >= 0) state.widgets[index] = { ...state.widgets[index], ...newData };
    } else {
      const [x,y] = widgetDefaultPosition(state.widgets.length);
      const widget = { id:`w-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`, ...newData, x, y };
      if (type === 'focus') widget.createdAt = Date.now();
      if (type === 'quote') widget.quoteIndex = Math.floor(Math.random() * QUOTES.length);
      state.widgets.push(widget);
    }
    hideModal($('#widgetModal'));
    renderWidgets();
    saveState();
    showToast(existingId ? 'Widget updated' : 'Widget added to canvas');
  }

  function resizeCanvas() {
    const rect = stage.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initSceneData();
  }
  function initSceneData() {
    const density = state.density;
    const area = width * height;
    const starCount = Math.max(55, Math.floor(area / 6500 * density));
    starPoints = Array.from({ length: starCount }, () => ({ x:Math.random()*width, y:Math.random()*height, r:random(.3,1.8), phase:random(0,Math.PI*2), alpha:random(.2,.9) }));
    const particleCount = Math.floor(clamp(area / 9200 * density, 35, 190));
    particles = Array.from({ length: particleCount }, () => ({ x:random(0,width), y:random(0,height), vx:random(-.26,.26), vy:random(-.21,.21), r:random(.8,2), phase:random(0,6.28), hue:Math.floor(random(0,4)) }));
    rainDrops = Array.from({ length:Math.floor(width / 8 * density) }, () => ({ x:random(0,width), y:random(-height,height), length:random(8,26), speed:random(2,7), alpha:random(.08,.48) }));
    const columnCount = Math.max(12, Math.ceil(width / 13));
    matrixColumns = Array.from({ length:columnCount }, () => ({ y:random(-height,0), speed:random(1.5,5), length:Math.floor(random(7,23)), chars:Array.from({ length:24 }, () => pick('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソ'.split(''))) }));
    const count = Math.max(45, Math.floor(area / 11000 * density));
    starZ = Array.from({ length:count }, () => ({ x:random(-1,1), y:random(-1,1), z:random(.05,1), pz:1 }));
  }
  function fillBackground(top, bottom, middle = null) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, top);
    if (middle) gradient.addColorStop(.55, middle);
    gradient.addColorStop(1, bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  function drawStars(time, amount = 1) {
    ctx.save();
    for (const star of starPoints) {
      const twinkle = .5 + .5 * Math.sin(time * .001 * state.speed + star.phase);
      ctx.globalAlpha = star.alpha * (.3 + twinkle * .7) * amount;
      ctx.fillStyle = '#e7efff';
      ctx.beginPath(); ctx.arc(star.x, star.y, star.r * (.65 + twinkle * .4), 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  function drawAurora(time) {
    const c = sceneColors();
    fillBackground(c[0], '#030713', '#10132b');
    const haze1 = ctx.createRadialGradient(width*.25, height*.65, 0, width*.25, height*.65, width*.5);
    haze1.addColorStop(0, c[1] + '44'); haze1.addColorStop(1, '#00000000');
    ctx.fillStyle = haze1; ctx.fillRect(0,0,width,height);
    const haze2 = ctx.createRadialGradient(width*.77, height*.45, 0, width*.77, height*.45, width*.48);
    haze2.addColorStop(0, c[2] + '38'); haze2.addColorStop(1, '#00000000');
    ctx.fillStyle = haze2; ctx.fillRect(0,0,width,height);
    drawStars(time, .9);
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    for (let band=0; band<5; band++) {
      const phase = time*.00016*state.speed + band*1.4;
      const base = height*(.48 + band*.038);
      const gradient = ctx.createLinearGradient(0, height*.2, width, height*.94);
      gradient.addColorStop(0, c[1] + '00'); gradient.addColorStop(.22, c[1] + '55'); gradient.addColorStop(.56, c[2] + '99'); gradient.addColorStop(.8, palette()[2] + '44'); gradient.addColorStop(1, '#ffffff00');
      ctx.beginPath();
      for (let x=0; x<=width+10; x+=9) {
        const y = base + Math.sin(x*.004 + phase)*height*.085 + Math.cos(x*.0027 - phase*1.6)*height*.052 + Math.sin(x*.009 + phase*.7)*height*.018;
        if (x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.strokeStyle = gradient; ctx.lineWidth = state.glow ? 15 - band*1.7 : 5 - band*.4; ctx.globalAlpha = .19 + band*.025;
      ctx.shadowBlur = state.glow ? 22 : 0; ctx.shadowColor = c[1]; ctx.stroke();
      ctx.globalAlpha = .5; ctx.lineWidth = 1.1; ctx.shadowBlur = 0; ctx.stroke();
    }
    ctx.restore();
  }
  function drawStarfield(time) {
    const c = sceneColors();
    fillBackground('#02040d', '#050817', '#0d1331');
    const glow = ctx.createRadialGradient(width*.5,height*.5,0,width*.5,height*.5,width*.6);
    glow.addColorStop(0,c[1]+'27'); glow.addColorStop(1,'#00000000'); ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
    drawStars(time,.4);
    const cx=width/2, cy=height/2;
    for (const star of starZ) {
      star.pz = star.z;
      star.z -= .0012 * state.speed;
      if (star.z <= .025) { star.x=random(-1,1); star.y=random(-1,1); star.z=1; star.pz=1; }
      const x = cx + (star.x / star.z) * width*.43;
      const y = cy + (star.y / star.z) * height*.43;
      const px = cx + (star.x / star.pz) * width*.43;
      const py = cy + (star.y / star.pz) * height*.43;
      if (x<0||x>width||y<0||y>height) continue;
      const radius = clamp((1-star.z)*2.3,.5,3.8);
      ctx.strokeStyle = c[1] + 'aa'; ctx.lineWidth = radius*.65;
      ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(x,y);ctx.stroke();
      ctx.fillStyle = '#e8f4ff';ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();
    }
  }
  function drawOcean(time) {
    const c=sceneColors();
    fillBackground('#d2a0bb', '#06142b', '#536a9d');
    const sunX=width*.72, sunY=height*.31, sunR=Math.min(width,height)*.075;
    const sunGlow=ctx.createRadialGradient(sunX,sunY,sunR*.1,sunX,sunY,sunR*3.2);sunGlow.addColorStop(0,'#ffe3bc99');sunGlow.addColorStop(1,'#ffafad00');ctx.fillStyle=sunGlow;ctx.fillRect(0,0,width,height);
    ctx.beginPath();ctx.arc(sunX,sunY,sunR,0,Math.PI*2);ctx.fillStyle='#ffddc5';ctx.fill();
    const horizon=height*.53;
    const sea=ctx.createLinearGradient(0,horizon,0,height);sea.addColorStop(0,'#3d567e');sea.addColorStop(.5,'#152b4d');sea.addColorStop(1,'#071126');ctx.fillStyle=sea;ctx.fillRect(0,horizon,width,height-horizon);
    for(let i=0;i<15;i++){
      const yy=horizon+(i/15)**1.7*height*.48;
      const offset=Math.sin(time*.00025*state.speed+i*1.7)*width*.02;
      ctx.beginPath();
      for(let x=0;x<=width;x+=8){const wave=Math.sin(x*.012+i*.63+time*.00035*state.speed)*(.7+i*.16);if(x===0)ctx.moveTo(x,yy+wave);else ctx.lineTo(x,yy+wave);}
      ctx.strokeStyle=i<4?'#f6d7de77':c[1]+(i<9?'50':'22');ctx.lineWidth=i<5?1.2:.7;ctx.stroke();
      if(i%2===0){ctx.beginPath();const len=width*(.04+((i*17)%11)/100);ctx.moveTo(sunX+offset-len/2,yy+2);ctx.lineTo(sunX+offset+len/2,yy+2);ctx.strokeStyle='#ffddb866';ctx.lineWidth=.8;ctx.stroke();}
    }
    ctx.globalAlpha=.28;ctx.fillStyle='#e8bdd2';ctx.fillRect(0,horizon,width,1);ctx.globalAlpha=1;
  }
  function drawParticles(time) {
    const c=sceneColors();fillBackground('#050817','#0b0c20','#11132d');
    const haze=ctx.createRadialGradient(width*.5,height*.48,0,width*.5,height*.48,width*.65);haze.addColorStop(0,c[1]+'20');haze.addColorStop(1,'#00000000');ctx.fillStyle=haze;ctx.fillRect(0,0,width,height);
    for(const p of particles){p.x+=p.vx*state.speed;p.y+=p.vy*state.speed;if(p.x<0)p.x=width;if(p.x>width)p.x=0;if(p.y<0)p.y=height;if(p.y>height)p.y=0;p.phase+=.01*state.speed;}
    const distance=clamp(Math.min(width,height)*.2,80,150);
    for(let i=0;i<particles.length;i++){
      const a=particles[i];
      for(let j=i+1;j<particles.length;j++){
        const b=particles[j], dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
        if(d<distance){ctx.globalAlpha=(1-d/distance)*.3;ctx.strokeStyle=c[(a.hue+b.hue)%c.length];ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
      }
      const pulse=.65+.35*Math.sin(time*.001*state.speed+a.phase);ctx.globalAlpha=.55+pulse*.45;ctx.fillStyle=c[a.hue%c.length];ctx.beginPath();ctx.arc(a.x,a.y,a.r*(.8+pulse*.45),0,Math.PI*2);ctx.fill();
      if(state.glow){ctx.globalAlpha=.12*pulse;ctx.beginPath();ctx.arc(a.x,a.y,a.r*5,0,Math.PI*2);ctx.fill();}
    }
    ctx.globalAlpha=1;
  }
  function drawMatrix(time) {
    const c=sceneColors();
    ctx.fillStyle='rgba(2,8,10,.22)';ctx.fillRect(0,0,width,height);
    const monoFont = getComputedStyle(document.documentElement).getPropertyValue('--mono-font').trim() || 'monospace';
    for(let i=0;i<matrixColumns.length;i++){
      const col=matrixColumns[i];col.y+=col.speed*state.speed;
      if(col.y>height+120){col.y=random(-height*.3,0);col.speed=random(1.5,5);col.length=Math.floor(random(7,24));}
      for(let n=0;n<col.length;n++){
        const yy=col.y-n*14;if(yy<0||yy>height)continue;
        const alpha=(1-n/col.length)*(.2+Math.random()*.38);ctx.globalAlpha=alpha;ctx.fillStyle=n===0?'#e0ffe9':c[1];ctx.font=`${n===0?'12':'10'}px ${monoFont}`;ctx.fillText(col.chars[(n+Math.floor(time*.002))%col.chars.length],i*13,yy);
      }
    }
    ctx.globalAlpha=1;
    const haze=ctx.createLinearGradient(0,0,width,height);haze.addColorStop(0,'#052e211f');haze.addColorStop(1,'#00000000');ctx.fillStyle=haze;ctx.fillRect(0,0,width,height);
  }
  function drawNebula(time) {
    const c=sceneColors();fillBackground('#08081a','#040612','#160e2e');
    drawStars(time,.65);ctx.save();ctx.globalCompositeOperation='screen';
    const blobs=[{x:.22,y:.45,r:.36,col:c[1]},{x:.53,y:.58,r:.42,col:c[2]},{x:.8,y:.29,r:.3,col:c[3]||palette()[2]},{x:.4,y:.22,r:.25,col:palette()[0]}];
    blobs.forEach((b,i)=>{
      const x=(b.x+Math.sin(time*.00012*state.speed+i*2)*.055)*width;
      const y=(b.y+Math.cos(time*.0001*state.speed+i*1.4)*.065)*height;
      const r=Math.min(width,height)*b.r;
      const g=ctx.createRadialGradient(x,y,r*.02,x,y,r);g.addColorStop(0,b.col+'88');g.addColorStop(.35,b.col+'45');g.addColorStop(1,b.col+'00');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
    });ctx.restore();
  }
  function drawGeometry(time) {
    const c=sceneColors();fillBackground('#060816','#0a0b1d','#11132d');
    const cx=width*.5+Math.sin(time*.00015*state.speed)*width*.035,cy=height*.5+Math.cos(time*.00012*state.speed)*height*.025;
    ctx.save();ctx.strokeStyle=c[1]+'18';ctx.lineWidth=.6;
    for(let x=0;x<width;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,height);ctx.stroke();}for(let y=0;y<height;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke();}
    ctx.translate(cx,cy);ctx.rotate(time*.00007*state.speed);
    for(let i=0;i<9;i++){
      const r=Math.min(width,height)*(.08+i*.045);ctx.beginPath();ctx.ellipse(0,0,r,r*.61,Math.sin(i*.31)*.2,0,Math.PI*2);ctx.strokeStyle=c[i%c.length]+(i%2?'66':'35');ctx.lineWidth=i%3===0?1.2:.7;ctx.stroke();
      const angle=time*.00012*state.speed+i*2.1;const px=Math.cos(angle)*r,py=Math.sin(angle)*r*.61;ctx.beginPath();ctx.arc(px,py,i%3===0?3:1.8,0,Math.PI*2);ctx.fillStyle=c[i%c.length];ctx.fill();
    }
    ctx.rotate(-time*.00015*state.speed);ctx.beginPath();ctx.arc(0,0,Math.min(width,height)*.03,0,Math.PI*2);ctx.fillStyle=c[1]+'25';ctx.fill();ctx.strokeStyle=c[1]+'99';ctx.stroke();ctx.restore();
  }
  function sceneNoise(n) {
    const value = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
    return value - Math.floor(value);
  }

  function drawGlassDrop(x, y, rx, ry, alpha = 1, tint = '#b9e8ff') {
    if (y + ry < -4 || y - ry > height + 4) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    const shape = new Path2D();
    shape.moveTo(x, y - ry);
    shape.bezierCurveTo(x + rx * .7, y - ry * .82, x + rx * 1.05, y - ry * .15, x + rx * .82, y + ry * .38);
    shape.bezierCurveTo(x + rx * .66, y + ry * .94, x - rx * .58, y + ry * 1.02, x - rx * .83, y + ry * .34);
    shape.bezierCurveTo(x - rx * 1.06, y - ry * .18, x - rx * .46, y - ry * .86, x, y - ry);
    const glass = ctx.createLinearGradient(x - rx, y - ry, x + rx, y + ry * .5);
    glass.addColorStop(0, 'rgba(207,239,255,.08)');
    glass.addColorStop(.26, tint + '45');
    glass.addColorStop(.56, 'rgba(9,26,48,.32)');
    glass.addColorStop(.82, tint + '52');
    glass.addColorStop(1, 'rgba(225,248,255,.12)');
    ctx.fillStyle = glass;
    ctx.fill(shape);
    ctx.strokeStyle = 'rgba(200,235,255,.28)';
    ctx.lineWidth = Math.max(.45, rx * .16);
    ctx.stroke(shape);
    // The thin off-centre specular streak is what makes the drop read as a lens.
    ctx.beginPath();
    ctx.moveTo(x - rx * .24, y - ry * .55);
    ctx.bezierCurveTo(x - rx * .62, y - ry * .12, x - rx * .43, y + ry * .24, x - rx * .18, y + ry * .42);
    ctx.strokeStyle = `rgba(231,249,255,${Math.min(.68, .22 + rx * .1)})`;
    ctx.lineWidth = Math.max(.45, rx * .2);
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  }

  function drawGlassDroplets(time, intensity = 1) {
    // A stable, seeded distribution avoids flickering and gives large drops a natural long-tail size distribution.
    const count = Math.min(140, Math.max(30, Math.floor(width / 9.5 * intensity)));
    for (let i = 0; i < count; i++) {
      const n = i + 41;
      const nx = sceneNoise(n * 1.71);
      const ny = sceneNoise(n * 3.17);
      const sizeRoll = sceneNoise(n * 4.91);
      const speedRoll = sceneNoise(n * 8.13);
      const size = .42 + Math.pow(sizeRoll, 2.65) * (2.5 + Math.min(1.2, width / 900));
      const speed = 5 + speedRoll * 16;
      const x = nx * width + Math.sin(time * .14 + n) * size * .32;
      const y = ((ny * (height + 46) + time * speed) % (height + 46)) - 23;
      const trailRoll = sceneNoise(n * 6.27);
      const trail = trailRoll > .62 ? (6 + trailRoll * 34) * size * .34 : size * 1.2;
      const a = (.18 + sceneNoise(n * 9.73) * .48) * intensity;
      if (trail > 3) {
        ctx.beginPath();
        ctx.moveTo(x - size * .12, y - trail);
        ctx.bezierCurveTo(x - size * .23, y - trail * .4, x + size * .18, y - trail * .15, x, y + size * .45);
        // Only a subset of the longest trails need a true gradient; most use a soft translucent stroke.
        if (trail > 15 && i % 3 === 0) {
          const gradient = ctx.createLinearGradient(x, y - trail, x, y + size);
          gradient.addColorStop(0, 'rgba(187,225,255,0)');
          gradient.addColorStop(.64, `rgba(164,211,244,${a * .28})`);
          gradient.addColorStop(1, `rgba(219,243,255,${a * .65})`);
          ctx.strokeStyle = gradient;
        } else {
          ctx.strokeStyle = `rgba(164,211,244,${a * .38})`;
        }
        ctx.lineWidth = Math.max(.45, size * .34);
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      // Render medium and large beads as irregular lenses; tiny drops stay economical single glints.
      if (size > 1.3) drawGlassDrop(x, y, size * .58, size * (1.02 + sceneNoise(n * 11.4) * 1.45), a, i % 4 ? '#a7ddff' : '#c1b5ff');
      else {
        ctx.globalAlpha = a * .75;
        ctx.fillStyle = '#d9f4ff';
        ctx.fillRect(x, y, .65, 1.5 + size);
        ctx.globalAlpha = 1;
      }
    }
  }

  function drawCityBokeh(time, palette = 0) {
    const colors = palette ? ['#79baff', '#e59ac6', '#ffc779'] : ['#77aaff', '#ee9dc6', '#f6c982', '#88e5e5'];
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 22; i++) {
      const x = sceneNoise(i * 7.7 + 2) * width;
      const y = height * (.18 + sceneNoise(i * 13.3 + 8) * .52);
      const r = 2 + Math.pow(sceneNoise(i * 2.9 + 4), 2) * Math.min(width, height) * .075;
      const pulse = .74 + .26 * Math.sin(time * .36 + i * 2.7);
      const color = colors[i % colors.length];
      const light = ctx.createRadialGradient(x, y, 0, x, y, r * 2.2);
      light.addColorStop(0, color + 'bb');
      light.addColorStop(.2, color + '62');
      light.addColorStop(1, color + '00');
      ctx.globalAlpha = pulse;
      ctx.fillStyle = light;
      ctx.fillRect(x - r * 2.2, y - r * 2.2, r * 4.4, r * 4.4);
      if (r > 5) {
        ctx.fillStyle = color + '8c';
        ctx.fillRect(x - r * .12, y - r * .65, Math.max(.7, r * .18), r * 1.3);
      }
    }
    ctx.restore();
  }

  function drawRain(time) {
    const t = time * .001 * state.speed;
    const c = sceneColors();
    fillBackground('#030813', '#030710', '#0b1830');
    // Defocused architecture and lights sit behind the glass rather than floating on a flat gradient.
    const skyline = ctx.createLinearGradient(0, height * .2, 0, height);
    skyline.addColorStop(0, '#08132600');
    skyline.addColorStop(.5, '#152440a8');
    skyline.addColorStop(1, '#050913');
    ctx.fillStyle = skyline;
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 34; i++) {
      const x = i / 34 * width;
      const bw = width * (.008 + sceneNoise(i * 4.5) * .027);
      const bh = height * (.15 + sceneNoise(i * 2.1 + 5) * .38);
      ctx.fillStyle = i % 3 ? '#111c31' : '#18213a';
      ctx.fillRect(x, height * .84 - bh, bw, bh);
      for (let row = 0; row < 5; row++) {
        if (sceneNoise(i * 17 + row * 5) > .61) {
          ctx.fillStyle = (row + i) % 2 ? 'rgba(255,195,132,.25)' : 'rgba(117,177,255,.24)';
          ctx.fillRect(x + bw * .24, height * .84 - bh + row * bh * .16, Math.max(.7, bw * .22), Math.max(1, height * .012));
        }
      }
    }
    drawCityBokeh(t, 0);
    // Slow vertical beads and their tiny refractions create the close-up rain-on-glass effect.
    drawGlassDroplets(t * .72, 1.0);
    const vignette = ctx.createRadialGradient(width * .5, height * .44, Math.min(width, height) * .12, width * .5, height * .5, Math.max(width, height) * .72);
    vignette.addColorStop(0, '#02071200');
    vignette.addColorStop(1, '#01040bdc');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }
  function drawFireflies(time) {
    const c=sceneColors();fillBackground('#061614','#020a08','#0b231b');
    const fog=ctx.createRadialGradient(width*.5,height*.95,0,width*.5,height*.95,width*.8);fog.addColorStop(0,'#2c80504c');fog.addColorStop(1,'#00000000');ctx.fillStyle=fog;ctx.fillRect(0,0,width,height);
    particles.forEach((p,i)=>{p.x+=p.vx*.65*state.speed;p.y+=p.vy*.55*state.speed;if(p.x<0)p.x=width;if(p.x>width)p.x=0;if(p.y<0)p.y=height;if(p.y>height)p.y=0;p.phase+=.018*state.speed;const glow=.15+.85*(.5+.5*Math.sin(p.phase));const r=(2+3*glow)*(p.hue===0?1.2:1);ctx.globalAlpha=.3+glow*.7;ctx.fillStyle=c[i%c.length];ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();if(state.glow){ctx.globalAlpha=.08+glow*.13;const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*7);g.addColorStop(0,c[i%c.length]+'aa');g.addColorStop(1,'#00000000');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r*7,0,Math.PI*2);ctx.fill();}});ctx.globalAlpha=1;
  }
  function drawSolar(time) {
    const c=sceneColors();fillBackground('#030510','#06091a','#12142c');drawStars(time,.8);
    const cx=width*.52,cy=height*.53,base=Math.min(width,height)*.1;
    const sun=ctx.createRadialGradient(cx,cy,base*.08,cx,cy,base*1.8);sun.addColorStop(0,'#fff3c7');sun.addColorStop(.18,'#ffc06d');sun.addColorStop(.42,'#e66d69aa');sun.addColorStop(1,'#d56b7300');ctx.fillStyle=sun;ctx.beginPath();ctx.arc(cx,cy,base*1.8,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ffe2a3';ctx.beginPath();ctx.arc(cx,cy,base*.48,0,Math.PI*2);ctx.fill();
    const planets=[{r:base*1.8,size:3,c:'#9cbbf7',speed:.0006},{r:base*2.7,size:5,c:'#c78dff',speed:-.00038},{r:base*3.8,size:7,c:'#65d8ca',speed:.00023},{r:base*5,size:4,c:'#f2ae8a',speed:-.00017}];
    planets.forEach((p,i)=>{ctx.beginPath();ctx.ellipse(cx,cy,p.r,p.r*.43,.24,0,Math.PI*2);ctx.strokeStyle='#b3c6ff24';ctx.lineWidth=.7;ctx.stroke();const a=time*p.speed*state.speed+i*2;const x=cx+Math.cos(a)*p.r,y=cy+Math.sin(a)*p.r*.43;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(x,y,p.size,0,Math.PI*2);ctx.fill();if(i===1){ctx.strokeStyle=p.c+'99';ctx.beginPath();ctx.ellipse(x,y,p.size*1.8,p.size*.7,a,0,Math.PI*2);ctx.stroke();}});
  }
  function drawMountains(time) {
    const c=sceneColors();
    const sky=ctx.createLinearGradient(0,0,0,height);sky.addColorStop(0,'#211936');sky.addColorStop(.4,c[2]);sky.addColorStop(.67,'#e990a7');sky.addColorStop(1,'#101329');ctx.fillStyle=sky;ctx.fillRect(0,0,width,height);
    const sunX=width*(.72+Math.sin(time*.00009*state.speed)*.02),sunY=height*.39,sunR=Math.min(width,height)*.07;
    const halo=ctx.createRadialGradient(sunX,sunY,sunR*.3,sunX,sunY,sunR*3.4);halo.addColorStop(0,'#ffbdbe75');halo.addColorStop(1,'#ffb4c000');ctx.fillStyle=halo;ctx.fillRect(0,0,width,height);ctx.fillStyle='#ffcdbe';ctx.beginPath();ctx.arc(sunX,sunY,sunR,0,Math.PI*2);ctx.fill();
    const mountain=(base,peaks,color,offset)=>{ctx.beginPath();ctx.moveTo(0,height);ctx.lineTo(0,base);peaks.forEach(([x,y])=>ctx.lineTo(x*width,y*height+Math.sin(time*.00008*state.speed+offset)*height*.012));ctx.lineTo(width,base);ctx.lineTo(width,height);ctx.closePath();ctx.fillStyle=color;ctx.fill();};
    mountain(.67,[[0,.62],[.12,.48],[.2,.57],[.31,.43],[.42,.62],[.52,.49],[.63,.6],[.74,.45],[.88,.61],[1,.51]],'#383358',1);
    mountain(.75,[[0,.72],[.14,.63],[.25,.68],[.4,.58],[.54,.7],[.68,.59],[.81,.7],[.93,.61],[1,.68]],'#242a4b',2);
    mountain(.84,[[0,.81],[.2,.73],[.38,.79],[.55,.69],[.72,.8],[.87,.72],[1,.79]],'#131c38',3);
    ctx.fillStyle='#09152c';ctx.fillRect(0,height*.84,width,height*.16);
    for(let i=0;i<100;i++){const x=(i*97.3)%width,y=(i*43.7)%height*.38;ctx.globalAlpha=.1+.7*(.5+.5*Math.sin(time*.001+i));ctx.fillStyle='#fff0e8';ctx.fillRect(x,y,1.1,1.1);}ctx.globalAlpha=1;
  }
  function drawLiquid(time) {
    const c=sceneColors();fillBackground('#050716','#06071b','#11112c');ctx.save();ctx.globalCompositeOperation='screen';
    const blobs=[{x:.18,y:.34,r:.36,col:c[1]},{x:.57,y:.66,r:.42,col:c[2]},{x:.84,y:.27,r:.28,col:c[3]||palette()[2]},{x:.38,y:.8,r:.3,col:palette()[0]}];
    blobs.forEach((b,i)=>{const x=(b.x+Math.sin(time*.00018*state.speed+i*1.8)*.14)*width;const y=(b.y+Math.cos(time*.00015*state.speed+i*2.2)*.13)*height;const r=Math.min(width,height)*b.r;const g=ctx.createRadialGradient(x-r*.12,y-r*.1,r*.02,x,y,r);g.addColorStop(0,b.col+'bb');g.addColorStop(.27,b.col+'72');g.addColorStop(.63,b.col+'23');g.addColorStop(1,'#00000000');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);});ctx.restore();
    ctx.save();ctx.globalAlpha=.16;ctx.strokeStyle='#dbe6ff';ctx.lineWidth=.8;for(let i=0;i<7;i++){const y=height*(.2+i*.1)+Math.sin(time*.0002*state.speed+i)*height*.025;ctx.beginPath();for(let x=0;x<=width;x+=8){const yy=y+Math.sin(x*.004+i+time*.00022*state.speed)*height*.014;if(x===0)ctx.moveTo(x,yy);else ctx.lineTo(x,yy);}ctx.stroke();}ctx.restore();
  }
  function drawSpectrum(time) {
    const c=sceneColors();fillBackground('#070817','#09091c','#111027');
    const glow=ctx.createRadialGradient(width*.5,height*.68,0,width*.5,height*.68,width*.65);glow.addColorStop(0,c[1]+'27');glow.addColorStop(1,'#00000000');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
    const baseline=height*.56;const bars=Math.floor(width/8);const barW=Math.max(1,width/bars*.42);
    for(let i=0;i<bars;i++){
      const x=(i+.5)*width/bars;const wave=Math.abs(Math.sin(i*.11+time*.00052*state.speed)*Math.cos(i*.036-time*.00022*state.speed));const ripple=Math.abs(Math.sin(i*.026+time*.00013*state.speed));const h=(.025+wave*.19+ripple*.12)*height;
      const gradient=ctx.createLinearGradient(0,baseline-h,0,baseline+h);gradient.addColorStop(0,c[2]+'00');gradient.addColorStop(.45,c[1]+'cc');gradient.addColorStop(.5,'#ffffffdd');gradient.addColorStop(.55,c[2]+'cc');gradient.addColorStop(1,c[2]+'00');ctx.fillStyle=gradient;ctx.fillRect(x-barW/2,baseline-h,barW,h*2);
    }
    ctx.beginPath();for(let x=0;x<=width;x+=4){const y=baseline+Math.sin(x*.017+time*.00042*state.speed)*height*.025+Math.sin(x*.005-time*.00033*state.speed)*height*.035;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.strokeStyle=c[1]+'99';ctx.lineWidth=1;ctx.stroke();
  }
  function drawText(text, x, y, size, color = '#fff', font = 'sans-serif', align = 'left') {
    ctx.fillStyle = color; ctx.font = `${size}px ${font}`; ctx.textAlign = align; ctx.fillText(text, x, y);
  }
  function roundRect(x, y, w, h, r, fill, stroke = null, lineWidth = 1) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath(); ctx.moveTo(x + radius, y); ctx.arcTo(x + w, y, x + w, y + h, radius); ctx.arcTo(x + w, y + h, x, y + h, radius); ctx.arcTo(x, y + h, x, y, radius); ctx.arcTo(x, y, x + w, y, radius); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
  }
  function drawSpinner(cx, cy, radius, time, color, count = 12) {
    for (let i = 0; i < count; i++) {
      const a = i * Math.PI * 2 / count + time * .001 * state.speed;
      const alpha = .15 + .85 * ((i / count + time * .00016 * state.speed) % 1);
      ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, Math.max(1.5, radius * .095), 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function drawProgress(x, y, w, h, pct, color, track = 'rgba(255,255,255,.17)') {
    roundRect(x, y, w, h, h / 2, track); roundRect(x, y, w * clamp(pct, 0, 100) / 100, h, h / 2, color);
  }
  function drawSystemScene(id, time) {
    const mono = '"DM Mono", ui-monospace, monospace';
    const ui = '"DM Sans", system-ui, sans-serif';
    const pct = 24 + ((time * .005 * state.speed) % 72);
    if (id === 'blackout') {
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, width, height);
      if (Math.sin(time * .002) > .2) { ctx.fillStyle = '#777'; ctx.fillRect(width * .075, height * .12, 7, 2); }
      if (Math.sin(time * .00013) > .96) { ctx.fillStyle = '#030303'; ctx.fillRect(0, 0, width, height); }
      return;
    }
    if (id === 'bsod') {
      ctx.fillStyle = '#0878d1'; ctx.fillRect(0, 0, width, height);
      const x = width * .135, y = height * .16;
      drawText(':(', x, y + Math.min(width, height) * .18, Math.min(width * .18, height * .24), '#fff', ui);
      drawText('Your device ran into a problem and needs to restart.', x, y + height * .28, Math.max(12, Math.min(19, width * .021)), '#fff', ui);
      drawText("We're just collecting some error info, and then we'll restart for you.", x, y + height * .33, Math.max(10, Math.min(15, width * .016)), '#fff', ui);
      drawText('0% complete', x, y + height * .39, Math.max(10, Math.min(15, width * .016)), '#fff', ui);
      const qr = Math.min(width, height) * .09, qx = x, qy = y + height * .47;
      ctx.fillStyle = '#fff'; ctx.fillRect(qx, qy, qr, qr);
      for (let ry = 0; ry < 13; ry++) for (let rx = 0; rx < 13; rx++) {
        const finder = (rx < 4 && ry < 4) || (rx > 8 && ry < 4) || (rx < 4 && ry > 8);
        if (finder ? (rx % 3 !== 1 && ry % 3 !== 1) : ((rx * 7 + ry * 11 + rx * ry) % 5 < 2)) { ctx.fillStyle = '#0878d1'; ctx.fillRect(qx + qr * rx / 13, qy + qr * ry / 13, qr / 13 + .3, qr / 13 + .3); }
      }
      drawText('For more information about this issue and possible fixes, visit', qx + qr + 17, qy + qr * .38, Math.max(8, Math.min(12, width * .012)), '#fff', ui);
      drawText('https://www.windows.com/stopcode', qx + qr + 17, qy + qr * .58, Math.max(8, Math.min(12, width * .012)), '#fff', ui);
      return;
    }
    if (id === 'windows-update' || id === 'recovery' || id === 'shutdown') {
      const grad = ctx.createLinearGradient(0, 0, width, height); grad.addColorStop(0, id === 'recovery' ? '#04172e' : '#06152a'); grad.addColorStop(.55, id === 'shutdown' ? '#0c1c31' : '#0a3d74'); grad.addColorStop(1, '#070d1a'); ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);
      const cx = width / 2, cy = height * .38, s = Math.min(width, height) * .046;
      if (id !== 'shutdown') {
        ctx.fillStyle = '#f4f9ff';
        ctx.fillRect(cx - s * 1.06, cy - s * 1.06, s, s); ctx.fillRect(cx + s * .08, cy - s * 1.06, s, s); ctx.fillRect(cx - s * 1.06, cy + s * .08, s, s); ctx.fillRect(cx + s * .08, cy + s * .08, s, s);
      }
      drawSpinner(cx, cy + s * 3.3, s * .72, time, '#edf7ff', 10);
      drawText(id === 'recovery' ? 'Preparing Automatic Repair' : id === 'shutdown' ? 'Shutting things down' : 'Working on updates', cx, cy + s * 5.35, Math.max(14, Math.min(24, width * .026)), '#f4f7ff', ui, 'center');
      drawText(id === 'recovery' ? 'Diagnosing your PC' : id === 'shutdown' ? 'Please wait while your system shuts down' : `${Math.floor(pct)}% complete`, cx, cy + s * 6.35, Math.max(10, Math.min(15, width * .015)), '#d2e5fa', ui, 'center');
      if (id === 'windows-update') drawText("Don't turn off your PC. This will take a while.", cx, cy + s * 7.3, Math.max(9, Math.min(13, width * .013)), '#bcd7f3', ui, 'center');
      return;
    }
    if (id === 'mac-update') {
      fillBackground('#050506', '#080a0e', '#101116');
      const cx = width / 2, cy = height * .28, s = Math.min(width, height) * .05;
      // A simple custom fruit silhouette avoids relying on external assets.
      ctx.save(); ctx.translate(cx, cy);
      ctx.fillStyle = '#e8ebf2'; ctx.beginPath(); ctx.moveTo(-s*.08,-s*.42); ctx.bezierCurveTo(-s*.62,-s*.62,-s*.9,-s*.15,-s*.66,s*.42); ctx.bezierCurveTo(-s*.48,s*.9,-s*.12,s*.93,0,s*.7); ctx.bezierCurveTo(s*.15,s*.95,s*.52,s*.83,s*.7,s*.35); ctx.bezierCurveTo(s*.9,-s*.1,s*.55,-s*.48,s*.12,-s*.42); ctx.bezierCurveTo(s*.03,-s*.64,s*.3,-s*.76,s*.35,-s*.96); ctx.bezierCurveTo(s*.07,-s*.96,-s*.09,-s*.74,-s*.08,-s*.42); ctx.fill(); ctx.fillStyle='#08090c'; ctx.beginPath(); ctx.arc(s*.59,-s*.15,s*.18,0,Math.PI*2); ctx.fill(); ctx.restore();
      drawText('Installing macOS', width / 2, height * .54, Math.max(16, Math.min(25, width * .028)), '#f2f3f7', ui, 'center');
      drawProgress(width*.36, height*.59, width*.28, 5, pct, '#d8dce7', '#343741');
      drawText('About 18 minutes remaining', width / 2, height * .65, Math.max(10, Math.min(14, width * .014)), '#a5a9b5', ui, 'center');
      return;
    }
    if (id === 'linux-upgrade' || id === 'ubuntu-upgrade') {
      const ubuntu = id === 'ubuntu-upgrade';
      fillBackground(ubuntu ? '#481b37' : '#160f24', ubuntu ? '#1b0b19' : '#080b15', ubuntu ? '#702342' : '#22143b');
      const left = width * .12, top = height * .15;
      if (ubuntu) {
        const cx = left + Math.min(width, height)*.055, cy = top + Math.min(width,height)*.055, r = Math.min(width,height)*.04;
        ctx.strokeStyle='#ff8b58'; ctx.lineWidth=Math.max(2,r*.18); ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.stroke();
        for(let i=0;i<3;i++){const a=i*Math.PI*2/3-.3;ctx.fillStyle='#ff8b58';ctx.beginPath();ctx.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r, r*.24,0,Math.PI*2);ctx.fill();}
        drawText('Ubuntu system upgrade', left + r*2.3, top+r*.3, Math.max(15,Math.min(24,width*.026)), '#fff0e8', ui);
      } else {
        drawText('SYSTEM UPGRADE', left, top + 10, Math.max(14,Math.min(23,width*.024)), '#f2dcff', mono);
        drawText('Preparing package database…', left, top + 42, Math.max(10,Math.min(14,width*.014)), '#c6b1df', mono);
      }
      const lineTop = top + height * .2;
      const logs = ubuntu ? ['Reading package lists… Done','Building dependency tree… Done','Calculating changes… Done','Preparing unpack of system components','Configuring packages','Updating initramfs','Refreshing application indexes'] : ['Synchronizing package databases…','Resolving dependencies…','Downloading packages…','Verifying package signatures…','Unpacking system libraries…','Configuring services…','Regenerating boot image…'];
      for(let i=0;i<logs.length;i++){const y=lineTop+i*24;drawText((i%2?'  ':'✓ ')+logs[i],left,y,Math.max(9,Math.min(13,width*.012)),i<Math.floor(pct/15)?'#f6b98c':'#c7d0dc',mono);}
      drawProgress(left, height*.79, width*.76, 5, pct, ubuntu ? '#ff8b58' : '#bc8cff', 'rgba(255,255,255,.13)');
      drawText(`${Math.floor(pct)}% · Applying changes`, left, height*.84, Math.max(10,Math.min(13,width*.013)), '#e7dfee', mono);
      return;
    }
    if (id === 'kernel-panic' || id === 'terminal' || id === 'boot-log') {
      ctx.fillStyle = id === 'kernel-panic' ? '#020203' : '#030806'; ctx.fillRect(0,0,width,height);
      const isPanic = id === 'kernel-panic', isBoot = id === 'boot-log';
      const color = isPanic ? '#f3f3f3' : isBoot ? '#d6e2ef' : '#78f79b';
      const green = '#58e98a', red = '#ff696d';
      const left = width * .045, line = Math.max(14, Math.min(21, height * .035));
      if (isPanic) drawText('Kernel panic - not syncing: Fatal exception in interrupt', left, height*.09, Math.max(11,Math.min(16,width*.016)), red, mono);
      else if (isBoot) drawText('LUMEN Linux 6.x · systemd boot sequence', left, height*.09, Math.max(11,Math.min(16,width*.016)), '#eef2ff', mono);
      else { drawText('lumen@localhost:~$', left, height*.09, Math.max(11,Math.min(16,width*.016)), green, mono); drawText(' ./watch-the-lights.sh --loop', left + width*.17, height*.09, Math.max(11,Math.min(16,width*.016)), '#e4f5e8', mono); }
      const messages = isPanic ? ['CPU: 2 PID: 1 Comm: swapper/0 Not tainted 6.8.0','Hardware name: Generic Virtual Machine','RIP: 0010:panic+0x2e/0x2f','Call Trace:',' dump_stack_lvl+0x48/0x60',' panic+0x11c/0x2f0',' do_exit+0x3a2/0xa10','Kernel Offset: disabled','---[ end Kernel panic ]---'] : isBoot ? ['[  OK  ] Reached target Local File Systems.','[  OK  ] Started Network Manager.','[  OK  ] Started User Login Management.','[  OK  ] Reached target Graphical Interface.','[  OK  ] Started Ambient Display Service.','[  OK  ] Started Session Manager.','[  OK  ] Started Background Renderer.','[  OK  ] Started Clock and Widget Service.'] : ['$ initializing ambient core…','[ok] canvas renderer ready','[ok] visual modules loaded','[ok] no external assets required','[ok] time dilation calibrated','[ok] infinite loop enabled','[ok] listening for user input','> _'];
      const scroll = Math.floor(time*.012*state.speed) % messages.length;
      for(let i=0;i<Math.floor(height/line)-4;i++){const idx=(i+scroll)%messages.length, y=height*.15+i*line;let c=color;if(isBoot&&messages[idx].includes('[  OK  ]'))c=green; if(isPanic&&messages[idx].includes('panic'))c=red; drawText(messages[idx],left,y,Math.max(9,Math.min(14,width*.013)),c,mono);}
      if (!isPanic && Math.sin(time*.005)>0) roundRect(left, height*.88, 9, line*.7, 1, color);
      // Gentle CRT glow around the text.
      if (!isBoot) { ctx.fillStyle = isPanic ? 'rgba(255,40,60,.018)' : 'rgba(50,255,120,.025)'; ctx.fillRect(0,0,width,height); }
      return;
    }
    if (id === 'bios') {
      ctx.fillStyle = '#030b43';ctx.fillRect(0,0,width,height);const left=width*.07,top=height*.1;const fs=Math.max(10,Math.min(16,width*.015)),line=fs*1.8;
      drawText('LUMEN BIOS SETUP UTILITY',left,top,fs,'#ffffff',mono);drawText('Copyright (C) 1997-2026  Lumen Systems',left,top+line,'#b9d5ff',mono);drawText('------------------------------------------------------------',left,top+line*2,'#93b8ff',mono);
      ['CPU Type .............. Virtual x86_64','System Memory .......... 16384 MB','Primary Display ........ Canvas Adapter','Boot Device ............ Local Atmosphere','Power-On Self Test ..... PASSED','Memory Test ............ PASSED','Storage Controller ..... READY','Loading visual kernel .. '+'.'.repeat(1+Math.floor((time*.003)%8))].forEach((msg,i)=>drawText(msg,left,top+line*(3+i),fs,i===7&&Math.sin(time*.006)>0?'#fff27b':'#d7e7ff',mono));
      drawText('Press DEL to enter setup',left,height*.86,fs,'#fff27b',mono);return;
    }
  }
  function drawRetroScene(id, time) {
    const t=time*.001*state.speed, c=sceneColors();
    if (id === 'classic-hills') {
      const sky=ctx.createLinearGradient(0,0,0,height);sky.addColorStop(0,'#49a9ef');sky.addColorStop(.62,'#b5e5ff');sky.addColorStop(1,'#e8f7ff');ctx.fillStyle=sky;ctx.fillRect(0,0,width,height);
      const sun=ctx.createRadialGradient(width*.72,height*.25,0,width*.72,height*.25,Math.min(width,height)*.23);sun.addColorStop(0,'#fff9dc66');sun.addColorStop(1,'#fff9dc00');ctx.fillStyle=sun;ctx.fillRect(0,0,width,height);
      const hill=(color,base,points,amp,phase)=>{ctx.beginPath();ctx.moveTo(0,height);ctx.lineTo(0,base);for(let x=0;x<=width;x+=5){let yy=base+Math.sin(x/width*6.2+phase)*height*amp+Math.sin(x/width*15+phase*.7)*height*amp*.22;ctx.lineTo(x,yy);}ctx.lineTo(width,height);ctx.closePath();ctx.fillStyle=color;ctx.fill();};
      hill('#4dbd55',height*.65,null,.045,t*.08);hill('#269e49',height*.78,null,.035,t*.07+1.3);hill('#126c3b',height*.91,null,.02,t*.05+2);return;
    }
    if (id === 'synthwave' || id === 'arcade-grid') {
      fillBackground('#090820','#120b2f','#2a0d48');
      const cx=width*.5, horizon=height*.51, sunR=Math.min(width,height)*.19;
      if(id==='synthwave'){const g=ctx.createLinearGradient(0,horizon-sunR,0,horizon+sunR);g.addColorStop(0,'#ffb6d9');g.addColorStop(.6,'#fa4eaa');g.addColorStop(1,'#6f35c8');ctx.beginPath();ctx.arc(cx,horizon,sunR,Math.PI,0);ctx.lineTo(cx+sunR,horizon+sunR*.68);ctx.lineTo(cx-sunR,horizon+sunR*.68);ctx.closePath();ctx.fillStyle=g;ctx.fill();for(let i=0;i<7;i++){const yy=horizon+sunR*.16+i*sunR*.13;ctx.fillStyle='#100b2b';ctx.fillRect(cx-sunR,yy,sunR*2,Math.max(2,sunR*.055));}}
      for(let i=0;i<18;i++){const z=(i/18+((t*.11)%1))%1;const y=horizon+z*z*height*.54;ctx.strokeStyle=`rgba(90,225,255,${.18+z*.48})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke();}
      for(let i=-14;i<=14;i++){const x=width*.5+i*width*.042;ctx.strokeStyle='rgba(100,180,255,.4)';ctx.beginPath();ctx.moveTo(cx+(x-cx)*.03,horizon);ctx.lineTo(cx+(x-cx)*4,height);ctx.stroke();}return;
    }
    if (id === 'crt-console') {
      fillBackground('#030702','#091106','#0b1209');const left=width*.07,top=height*.13,fs=Math.max(10,Math.min(17,width*.016)),line=fs*1.8;const rows=['LUMEN SYSTEMS MONITOR  v2.6','MEMORY CHECK ............ OK','DISPLAY BUFFER .......... READY','SIGNAL INTEGRITY ........ 100%','BACKGROUND TASKS ........ RUNNING','FRAME SYNCHRONIZATION ... LOCKED','AMBIENT LOOP ............ ACTIVE','> waiting for next frame'];
      rows.forEach((txt,i)=>drawText(txt,left,top+i*line,fs,'#ffc76f','"DM Mono", monospace'));ctx.fillStyle='rgba(255,174,71,.045)';ctx.fillRect(0,0,width,height);for(let y=0;y<height;y+=4)ctx.fillStyle='rgba(0,0,0,.22)',ctx.fillRect(0,y,width,1);if(Math.sin(time*.006)>0)ctx.fillRect(left,top+line*8,fs*.7,2);return;
    }
    if (id === 'vhs-glitch') {
      fillBackground('#050817','#0b1024','#11152e');ctx.save();ctx.globalCompositeOperation='screen';
      for(let i=0;i<10;i++){const y=((i/10+time*.00005*state.speed)%1)*height;ctx.fillStyle=i%2?'rgba(255,60,135,.22)':'rgba(58,234,239,.2)';ctx.fillRect(Math.sin(i*4+time*.003)*width*.04,y,width*(.22+((i*13)%7)/10),Math.max(2,height*.006));}
      ctx.globalAlpha=.26;for(let i=0;i<24;i++){ctx.fillStyle=i%2?'#ff5eb4':'#4ef7ef';ctx.fillRect(random(0,width),random(0,height),random(8,width*.2),random(1,3));}ctx.restore();drawText('PLAY  ▷  TRACKING',width*.06,height*.13,Math.max(10,width*.015),'#e5fff9','"DM Mono", monospace');return;
    }
    if (id === 'retro-desktop') {
      fillBackground('#2451a4','#17357c','#4b6fb0');ctx.fillStyle='#f4f1c8';ctx.fillRect(width*.08,height*.1,width*.84,height*.8);ctx.fillStyle='#091b68';ctx.fillRect(width*.08,height*.1,width*.84,height*.065);drawText('LUMEN DESKTOP',width*.105,height*.145,Math.max(9,width*.012),'#fff','"DM Mono", monospace');
      roundRect(width*.17,height*.23,width*.66,height*.48,3,'#dddccf','#ffffff',1);ctx.fillStyle='#24449a';ctx.fillRect(width*.17,height*.23,width*.66,height*.055);drawText('File  Edit  View  Help',width*.19,height*.266,Math.max(8,width*.009),'#fff','"DM Mono", monospace');ctx.fillStyle='#f7f4df';ctx.fillRect(width*.19,height*.31,width*.62,height*.36);ctx.fillStyle='#3b4d95';ctx.fillRect(width*.22,height*.35,width*.14,height*.25);ctx.fillStyle='#ded9c2';ctx.fillRect(width*.39,height*.35,width*.37,height*.035);ctx.fillRect(width*.39,height*.42,width*.29,height*.025);ctx.fillRect(width*.39,height*.49,width*.34,height*.025);ctx.fillRect(width*.39,height*.56,width*.22,height*.025);roundRect(width*.42,height*.78,width*.16,height*.07,3,'#d8d7cc','#ffffff');drawText('OK',width*.5,height*.825,Math.max(8,width*.01),'#151515','"DM Mono", monospace','center');const mx=width*(.6+Math.sin(t*.4)*.12),my=height*(.6+Math.cos(t*.3)*.08);ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(mx,my);ctx.lineTo(mx,my+24);ctx.lineTo(mx+7,my+18);ctx.lineTo(mx+13,my+29);ctx.lineTo(mx+18,my+26);ctx.lineTo(mx+12,my+15);ctx.lineTo(mx+22,my+15);ctx.closePath();ctx.fill();ctx.strokeStyle='#080808';ctx.stroke();return;
    }
    if (id === 'pipes') {
      fillBackground('#050812','#090e1e','#16152c');for(let i=0;i<10;i++){const phase=t*.34+i*2.4;let x=width*(.08+((i*37)%85)/100),y=height*(.12+((i*19)%74)/100);ctx.beginPath();ctx.moveTo(x,y);for(let j=0;j<9;j++){const a=Math.floor((j+Math.sin(phase+j)*.45)%4),step=Math.min(width,height)*.043;x+=Math.cos(a*Math.PI/2)*step;y+=Math.sin(a*Math.PI/2)*step;x=(x+width)%width;y=(y+height)%height;ctx.lineTo(x,y);}ctx.strokeStyle=[ '#ff8c52','#68e4ff','#ff75d5','#9b88ff','#a4f4a6'][i%5];ctx.lineWidth=Math.max(2,Math.min(width,height)*.008);ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=state.glow?10:0;ctx.stroke();ctx.shadowBlur=0;}return;
    }
  }
  function drawAbstractScene(id, time) {
    const t=time*.001*state.speed,c=sceneColors(),cx=width/2,cy=height/2,min=Math.min(width,height);
    if(id==='tunnel') {fillBackground('#030713','#090a1b','#17103b');ctx.save();ctx.translate(cx,cy);for(let i=0;i<23;i++){const z=(i/23+(t*.12)%1)%1,r=min*(.035+z*.68),rot=t*.2+i*.12;ctx.beginPath();for(let k=0;k<6;k++){const a=k*Math.PI/3+rot;const x=Math.cos(a)*r,y=Math.sin(a)*r; k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.strokeStyle=`hsla(${(t*27+i*17)%360},90%,${55+z*20}%,${.18+z*.5})`;ctx.lineWidth=1+z*2;ctx.stroke();}ctx.restore();return;}
    if(id==='fractal'||id==='mandala') {fillBackground('#070619','#0a0a22','#1a0c2e');ctx.save();ctx.translate(cx,cy);ctx.rotate(t*.07);const arms=id==='mandala'?16:12;for(let j=0;j<arms;j++){const base=j*Math.PI*2/arms;ctx.beginPath();for(let i=0;i<120;i++){const q=i/119,r=min*(id==='mandala'?.08:.02)+q*min*(id==='mandala'?.32:.34);const a=base+q*(id==='mandala'?1.4:4.2)+Math.sin(q*19+t*.5+j)*.09;const x=Math.cos(a)*r,y=Math.sin(a)*r; i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=`hsla(${(t*18+j*360/arms)%360},85%,68%,.7)`;ctx.lineWidth=id==='mandala'?1.2:1.5;ctx.stroke();}for(let i=0;i<arms;i++){const a=i*Math.PI*2/arms;ctx.beginPath();ctx.arc(Math.cos(a)*min*.14,Math.sin(a)*min*.14,min*.045,0,Math.PI*2);ctx.strokeStyle=c[1]+'aa';ctx.stroke();}ctx.restore();return;}
    if(id==='dna') {fillBackground('#03101d','#04091a','#07243a');const turns=2.7,rows=Math.floor(height/7);for(let i=0;i<rows;i++){const y=i*height/rows, a=i*.13+t*.8, x1=cx+Math.sin(a)*width*.19,x2=cx+Math.sin(a+Math.PI)*width*.19;ctx.strokeStyle='rgba(108,220,232,.22)';ctx.beginPath();ctx.moveTo(x1,y);ctx.lineTo(x2,y);ctx.stroke();ctx.fillStyle=c[1];ctx.beginPath();ctx.arc(x1,y,2.5+((Math.sin(a)+1)*1.2),0,Math.PI*2);ctx.fill();ctx.fillStyle=c[2];ctx.beginPath();ctx.arc(x2,y,2.5+((Math.sin(a+Math.PI)+1)*1.2),0,Math.PI*2);ctx.fill();}return;}
    if(id==='topography'||id==='quantum'||id==='wireframe') {fillBackground('#050a16','#07141d','#0a102a');const quantum=id==='quantum',wire=id==='wireframe';const rows=quantum?22:36,cols=quantum?40:62;for(let j=0;j<rows;j++){ctx.beginPath();for(let i=0;i<=cols;i++){const x=i/cols*width;const z=j/(rows-1)*2-1;const wave=Math.sin(i*.2+t*.8+j*.24)*Math.cos(i*.075-t*.23+j*.5);const y=height*.5+z*height*.44+wave*(quantum?height*.06:height*.025);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=wire?`rgba(67,224,217,${.12+j/rows*.38})`:quantum?`rgba(130,150,255,${.15+j/rows*.35})`:`hsla(${25+j*2},75%,68%,.4)`;ctx.lineWidth=quantum?1.6:.85;ctx.stroke();}if(quantum){for(let j=0;j<rows;j+=2)for(let i=0;i<cols;i+=2){const x=i/cols*width,z=j/(rows-1)*2-1,y=height*.5+z*height*.44+Math.sin(i*.2+t*.8+j*.24)*Math.cos(i*.075-t*.23+j*.5)*height*.06;ctx.fillStyle='#b8d7ff';ctx.fillRect(x,y,2,2);}}return;}
    if(id==='ripples') {
      fillBackground('#020a13', '#031521', '#062b38');
      const horizon = height * .2;
      const waterGlow = ctx.createLinearGradient(0, horizon, 0, height);
      waterGlow.addColorStop(0, 'rgba(72,176,202,.06)');
      waterGlow.addColorStop(.45, 'rgba(34,125,158,.08)');
      waterGlow.addColorStop(1, 'rgba(1,7,15,.24)');
      ctx.fillStyle = waterGlow;
      ctx.fillRect(0, horizon, width, height - horizon);

      // Thin, broken reflection bands move sideways like light on a gently undulating surface.
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let row = 0; row < 39; row++) {
        const depth = row / 38;
        const yBase = horizon + depth * depth * (height - horizon) * .96;
        ctx.beginPath();
        for (let x = -8; x <= width + 8; x += Math.max(7, width / 90)) {
          const wave = Math.sin(x * (.011 + depth * .018) + t * (.8 + depth) + row) * (1 + depth * 3.4)
            + Math.sin(x * .027 - t * 1.4 + row * .8) * depth * 1.3;
          const y = yBase + wave;
          if (x < 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        const sheen = .025 + Math.max(0, Math.sin(row * 1.73 + t * .7)) * (.045 + depth * .045);
        ctx.strokeStyle = `rgba(${row % 3 ? '117,207,221' : '188,236,239'},${sheen})`;
        ctx.lineWidth = .45 + depth * 1.05;
        ctx.stroke();
      }

      // A handful of separate impacts make irregular, perspective-flattened rings instead of perfect circles.
      const impacts = [
        [.24, .42, 1.00], [.67, .35, .72], [.48, .66, .88], [.84, .54, .58]
      ];
      impacts.forEach(([px, py, scale], index) => {
        const x0 = width * (px + Math.sin(t * .11 + index * 1.7) * .012);
        const y0 = height * py;
        const age = ((t * (.13 + index * .009) + index * .237) % 1 + 1) % 1;
        for (let ring = 0; ring < 5; ring++) {
          const phase = (age + ring * .19) % 1;
          const radius = (9 + phase * Math.min(width, height) * (.24 + .08 * scale));
          if (radius < 2) continue;
          const alpha = Math.pow(1 - phase, 1.25) * (.20 + scale * .18);
          ctx.beginPath();
          for (let k = 0; k <= 88; k++) {
            const a = k / 88 * Math.PI * 2;
            const waviness = 1 + Math.sin(a * 5 + t * 1.7 + ring) * .018 + Math.sin(a * 9 - t * .8 + index) * .011;
            const rx = radius * waviness;
            const ry = rx * (.17 + (y0 / height) * .14);
            const x = x0 + Math.cos(a) * rx;
            const y = y0 + Math.sin(a) * ry + Math.sin(a * 2 + t + ring) * radius * .003;
            if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(91,202,225,${alpha})`;
          ctx.lineWidth = .65 + phase * .65;
          ctx.stroke();
          // A darker lower edge paired with the bright edge adds a shallow, wet meniscus.
          ctx.save();
          ctx.translate(0, Math.max(.7, radius * .008));
          ctx.strokeStyle = `rgba(1,8,17,${alpha * .7})`;
          ctx.lineWidth = .7;
          ctx.stroke();
          ctx.restore();
        }
        const beadPulse = .5 + .5 * Math.sin(t * 2.7 + index * 2);
        const bead = ctx.createRadialGradient(x0 - 2, y0 - 2, 0, x0, y0, 7 + beadPulse * 3);
        bead.addColorStop(0, 'rgba(212,251,255,.22)');
        bead.addColorStop(1, 'rgba(91,202,225,0)');
        ctx.fillStyle = bead;
        ctx.fillRect(x0 - 12, y0 - 12, 24, 24);
      });
      ctx.restore();
      const edge = ctx.createLinearGradient(0, 0, 0, height);
      edge.addColorStop(0, 'rgba(0,3,10,.28)');
      edge.addColorStop(.48, 'rgba(0,0,0,0)');
      edge.addColorStop(1, 'rgba(0,2,8,.42)');
      ctx.fillStyle = edge;
      ctx.fillRect(0, 0, width, height);
      return;
    }
    if(id==='ink'||id==='plasma') {fillBackground('#050617','#0c0920','#1a0a2a');ctx.save();ctx.globalCompositeOperation='screen';const blobs= id==='plasma'?7:5;for(let i=0;i<blobs;i++){const x=(.12+.76*(i/(blobs-1))+Math.sin(t*.27+i*2)*.12)*width,y=(.5+Math.sin(t*.21+i*2.1)*.28)*height,r=min*(.18+(i%3)*.055);const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,(i%2?c[1]:c[2])+'99');g.addColorStop(.5,(i%2?c[2]:c[1])+'44');g.addColorStop(1,'#00000000');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}if(id==='plasma'){for(let k=0;k<6;k++){ctx.beginPath();for(let x=0;x<=width;x+=8){const y=height*(.2+k*.12)+Math.sin(x*.009+t*.6+k)*height*.06+Math.cos(x*.003-t*.33+k)*height*.04;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle=`hsla(${(t*15+k*45)%360},90%,70%,.35)`;ctx.stroke();}}ctx.restore();return;}
    if(id==='chromatic'||id==='prism') {fillBackground('#050714','#0a0b1d','#10162c');ctx.save();ctx.globalCompositeOperation='screen';if(id==='chromatic'){for(let i=0;i<10;i++){const r=min*(.06+i*.045),x=cx+Math.sin(t*.18+i)*width*.12,y=cy+Math.cos(t*.14+i*1.7)*height*.1;ctx.strokeStyle=['#ff4f9b','#54e4ff','#a98bff'][i%3]+'99';ctx.lineWidth=5;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();}}else{for(let i=0;i<18;i++){const x=((i/18+t*.04)%1)*width;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(width*.47+Math.sin(t*.1+i)*width*.1,height);ctx.strokeStyle=`hsla(${180+i*9},95%,70%,.28)`;ctx.lineWidth=1+i%4;ctx.stroke();}ctx.beginPath();ctx.moveTo(cx-min*.14,cy-min*.16);ctx.lineTo(cx+min*.18,cy);ctx.lineTo(cx-min*.14,cy+min*.16);ctx.closePath();ctx.strokeStyle='#f9f4ff';ctx.lineWidth=2;ctx.stroke();}ctx.restore();return;}
    if(id==='clockwork') {fillBackground('#090b12','#15151b','#28232a');ctx.save();ctx.translate(cx,cy);const gears=[{x:-min*.18,y:0,r:min*.18,n:12},{x:min*.18,y:-min*.03,r:min*.13,n:10},{x:min*.05,y:min*.25,r:min*.09,n:8}];gears.forEach((g,j)=>{ctx.save();ctx.translate(g.x,g.y);ctx.rotate(t*(j%2?-.16:.16));ctx.beginPath();for(let i=0;i<g.n*2;i++){const a=i*Math.PI/g.n,r=g.r*(i%2?.83:1);const x=Math.cos(a)*r,y=Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fillStyle=j===0?'#493b38':j===1?'#2b3b4a':'#554333';ctx.fill();ctx.strokeStyle=['#f1b977','#90d7e2','#d8c6a1'][j];ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.arc(0,0,g.r*.29,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(0,0,g.r*.08,0,Math.PI*2);ctx.fillStyle='#f1d2a2';ctx.fill();for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(-g.r*.7,0);ctx.lineTo(g.r*.7,0);ctx.stroke();ctx.rotate(Math.PI/2);}ctx.restore();});ctx.restore();return;}
    if(id==='orbitarium') {fillBackground('#020612','#050a1d','#0c1031');drawStars(time,.9);ctx.save();ctx.translate(cx,cy);for(let i=0;i<5;i++){const r=min*(.08+i*.11);ctx.save();ctx.rotate(t*(i%2?-.13:.1)+i*.4);ctx.beginPath();ctx.ellipse(0,0,r,r*.36,0,0,Math.PI*2);ctx.strokeStyle=`rgba(135,173,255,${.25+i*.1})`;ctx.stroke();ctx.fillStyle=i%2?'#a995ff':'#ffd28f';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=state.glow?12:0;ctx.beginPath();ctx.arc(r*Math.cos(t*(.3+i*.08)),r*.36*Math.sin(t*(.3+i*.08)),min*(.012+i*.002),0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.restore();}ctx.fillStyle='#fff0c6';ctx.shadowColor='#ffa955';ctx.shadowBlur=state.glow?24:0;ctx.beginPath();ctx.arc(0,0,min*.035,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.restore();return;}
    // Common soft geometric drift for extra palette-friendly ambient loops.
    fillBackground('#050812','#0b0d1e','#11172b');ctx.save();ctx.translate(cx,cy);ctx.rotate(t*.08);for(let i=0;i<26;i++){const r=min*(.025+i*.019), sides=6+(i%5);ctx.beginPath();for(let j=0;j<sides;j++){const a=j*Math.PI*2/sides+t*(i%2?-.05:.06),x=Math.cos(a)*r,y=Math.sin(a)*r;j?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.strokeStyle=`hsla(${(i*19+t*12)%360},80%,${55+(i%4)*6}%,${.2+(i/26)*.6})`;ctx.lineWidth=i%4===0?1.8:.8;ctx.stroke();}ctx.restore();
  }
  function drawNatureScene(id, time) {
    const t=time*.001*state.speed,c=sceneColors(),min=Math.min(width,height);
    if(id==='rainy-city'||id==='storm') {
      if (id === 'rainy-city') {
        const sky = ctx.createLinearGradient(0, 0, 0, height);
        sky.addColorStop(0, '#080f20');
        sky.addColorStop(.48, '#26344f');
        sky.addColorStop(.76, '#303954');
        sky.addColorStop(1, '#090f1e');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, width, height);
        // A layered skyline softened by haze; building heights and window patterns are deliberately irregular.
        for (let layer = 0; layer < 3; layer++) {
          const baseline = height * (.73 + layer * .075);
          for (let i = 0; i < 42; i++) {
            const seed = i * 9.17 + layer * 117;
            const x = (i / 42) * width - width * .015;
            const bw = width * (.009 + sceneNoise(seed) * .025);
            const bh = height * (.12 + sceneNoise(seed + 4) * (.28 + layer * .025));
            const top = baseline - bh;
            ctx.fillStyle = ['#121d31', '#101a2b', '#0b1425'][layer];
            ctx.fillRect(x, top, bw, height - top);
            if (layer < 2) {
              for (let row = 0; row < Math.floor(bh / Math.max(7, height * .045)); row++) {
                for (let col = 0; col < 3; col++) {
                  if (sceneNoise(seed + row * 13 + col * 5) > .58) {
                    ctx.fillStyle = (i + row + col) % 3 === 0 ? 'rgba(255,191,128,.62)' : 'rgba(133,182,255,.42)';
                    ctx.fillRect(x + bw * (.16 + col * .28), top + row * height * .045 + height * .022, Math.max(.7, bw * .11), Math.max(1, height * .014));
                  }
                }
              }
            }
          }
        }
        // Soft light streaks behind the glass create believable depth and rainy-city bokeh.
        drawCityBokeh(t, 1);
        const haze = ctx.createLinearGradient(0, height * .35, 0, height);
        haze.addColorStop(0, 'rgba(121,157,213,.02)');
        haze.addColorStop(.55, 'rgba(102,139,194,.14)');
        haze.addColorStop(1, 'rgba(2,7,16,.68)');
        ctx.fillStyle = haze;
        ctx.fillRect(0, 0, width, height);
        drawGlassDroplets(t * .58, 1.05);
        const vignette = ctx.createRadialGradient(width * .5, height * .48, min * .12, width * .5, height * .5, Math.max(width, height) * .72);
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(1,4,12,.55)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);
        return;
      }

      // Storm: volumetric-looking cloud masses, distant rain curtains, near rain streaks and occasional lightning.
      const stormSky = ctx.createLinearGradient(0, 0, 0, height);
      stormSky.addColorStop(0, '#101728');
      stormSky.addColorStop(.4, '#1d2a42');
      stormSky.addColorStop(.74, '#263b50');
      stormSky.addColorStop(1, '#070d19');
      ctx.fillStyle = stormSky;
      ctx.fillRect(0, 0, width, height);
      for (let layer = 0; layer < 3; layer++) {
        ctx.save();
        ctx.globalAlpha = .30 - layer * .065;
        for (let i = 0; i < 12; i++) {
          const x = ((i / 11) * 1.12 - .06) * width + Math.sin(t * (.025 + layer * .01) + i) * width * .018;
          const y = height * (.08 + layer * .105 + sceneNoise(i + layer * 42) * .09);
          const rx = width * (.085 + sceneNoise(i * 3.7 + layer) * .09);
          const ry = height * (.08 + sceneNoise(i * 4.9 + layer * 7) * .055);
          const cloud = ctx.createRadialGradient(x, y, ry * .1, x, y, rx);
          cloud.addColorStop(0, layer === 0 ? '#6a7890' : '#46556e');
          cloud.addColorStop(.58, '#27364c');
          cloud.addColorStop(1, '#1a2538' + '00');
          ctx.fillStyle = cloud;
          ctx.fillRect(x - rx, y - ry * 1.8, rx * 2, ry * 3.6);
        }
        ctx.restore();
      }
      // A distant rain curtain gives scale; near diagonal strokes provide motion and depth.
      for (let curtain = 0; curtain < 18; curtain++) {
        const cx = curtain / 18 * width;
        ctx.beginPath();
        ctx.moveTo(cx, height * .29);
        ctx.lineTo(cx - width * .025, height * .78);
        ctx.strokeStyle = `rgba(135,177,218,${.035 + sceneNoise(curtain * 5) * .05})`;
        ctx.lineWidth = width * .012;
        ctx.stroke();
      }
      ctx.save();
      ctx.lineCap = 'round';
      for (let i = 0; i < rainDrops.length; i++) {
        const drop = rainDrops[i];
        drop.y += drop.speed * (1.25 + drop.length * .015) * state.speed;
        drop.x -= (drop.speed * .22 + 1.1) * state.speed;
        if (drop.y > height + 28) { drop.y = -random(8, height * .28); drop.x = random(0, width + 20); }
        if (drop.x < -12) drop.x = width + 8;
        const len = drop.length * (1.15 + drop.speed * .09);
        const grad = ctx.createLinearGradient(drop.x, drop.y - len, drop.x - 3, drop.y);
        grad.addColorStop(0, 'rgba(169,207,244,0)');
        grad.addColorStop(1, `rgba(178,215,248,${.08 + drop.alpha * .30})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = drop.length > 19 ? 1.05 : .65;
        ctx.beginPath();
        ctx.moveTo(drop.x + 3, drop.y - len);
        ctx.lineTo(drop.x, drop.y);
        ctx.stroke();
      }
      ctx.restore();
      // Occasional impact rings and splashes on the very bottom edge suggest wet ground.
      for (let i = 0; i < 12; i++) {
        const x = sceneNoise(i * 3.1 + 19) * width;
        const phase = (t * (.35 + sceneNoise(i * 4.7) * .4) + i * .27) % 1;
        const rx = 1 + phase * min * .028;
        const y = height * (.91 + sceneNoise(i * 6.9) * .06);
        ctx.beginPath();
        ctx.ellipse(x, y, rx, rx * .19, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(142,195,232,${(1 - phase) * .20})`;
        ctx.lineWidth = .7;
        ctx.stroke();
      }
      const stormPhase = (t % 13.7);
      const flash = stormPhase > 5.46 && stormPhase < 5.62 ? (1 - (stormPhase - 5.46) / .16) : (stormPhase > 5.86 && stormPhase < 5.94 ? (1 - (stormPhase - 5.86) / .08) * .6 : 0);
      if (flash > .02) {
        ctx.fillStyle = `rgba(208,228,255,${flash * .11})`;
        ctx.fillRect(0, 0, width, height);
        const seed = Math.floor(t / 13.7);
        let bx = width * (.28 + sceneNoise(seed + 3) * .46);
        let by = height * .02;
        ctx.save();
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(bx, by);
        const points = [];
        for (let k = 0; k < 9; k++) {
          bx += (sceneNoise(seed * 11 + k * 5) - .47) * width * .09;
          by += height * (.055 + sceneNoise(k * 7 + seed) * .035);
          points.push([bx, by]);
          ctx.lineTo(bx, by);
        }
        ctx.shadowColor = '#cbe8ff';
        ctx.shadowBlur = 12 * flash;
        ctx.strokeStyle = `rgba(224,241,255,${.5 + flash * .5})`;
        ctx.lineWidth = 1.1 + flash * 1.7;
        ctx.stroke();
        // A short fork off one of the central branches.
        if (points.length > 4) {
          const [fx, fy] = points[4];
          ctx.beginPath();
          ctx.moveTo(fx, fy);
          ctx.lineTo(fx + width * .035, fy + height * .055);
          ctx.lineTo(fx + width * .07, fy + height * .07);
          ctx.stroke();
        }
        ctx.restore();
      }
      return;
    }
    if(id==='underwater'||id==='jellyfish') {
      fillBackground('#010d1d', '#02283c', '#064b5a');
      // Soft, broken shafts of sunlight fade into the water column.
      for (let i = 0; i < 7; i++) {
        const x = width * (.04 + i * .16 + Math.sin(t * .12 + i * 1.3) * .016);
        const beamW = width * (.035 + (i % 3) * .018);
        const beam = ctx.createLinearGradient(x, 0, x + beamW * 1.3, height);
        beam.addColorStop(0, `rgba(87,230,230,${.035 + Math.sin(t * .25 + i) * .012})`);
        beam.addColorStop(1, 'rgba(44,180,211,0)');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + beamW, 0);
        ctx.lineTo(x + beamW * 2.8, height);
        ctx.lineTo(x + beamW * .8, height);
        ctx.closePath();
        ctx.fill();
      }
      // Fine suspended particles add scale; the few larger ones are shaded bubbles, not flat circles.
      const particleCount = id === 'underwater' ? 58 : 38;
      for (let i = 0; i < particleCount; i++) {
        const nx = sceneNoise(i * 7.31 + 8);
        const ny = sceneNoise(i * 3.93 + 14);
        const x = nx * width + Math.sin(t * (.14 + i % 4 * .02) + i) * 9;
        const y = height - ((ny * height + t * (5 + i % 8 * 1.7)) % (height + 4));
        const r = .45 + sceneNoise(i * 4.7) * (id === 'underwater' ? 1.7 : 1.1);
        ctx.globalAlpha = .12 + sceneNoise(i * 5.1) * .3;
        ctx.fillStyle = i % 5 ? '#a5efff' : '#d2fff6';
        if (r > 1.1 && i % 3 === 0) {
          const bubble = ctx.createRadialGradient(x - r * .38, y - r * .4, .1, x, y, r * 1.6);
          bubble.addColorStop(0, 'rgba(232,255,255,.85)');
          bubble.addColorStop(.35, 'rgba(113,218,237,.22)');
          bubble.addColorStop(.72, 'rgba(89,211,231,.06)');
          bubble.addColorStop(1, 'rgba(146,241,255,0)');
          ctx.fillStyle = bubble;
          ctx.beginPath();
          ctx.ellipse(x, y, r, r * 1.28, .14, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(x - r * .25, y - r * .45, r * .24, r * .12, -.55, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(228,255,255,.68)';
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, r * .55, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      if (id === 'jellyfish') {
        const drawJellyfish = (index) => {
          const depth = .48 + sceneNoise(index * 4.27) * .52;
          const r = min * (.045 + Math.pow(sceneNoise(index * 2.71), .7) * .045) * (.68 + depth * .65);
          const x = width * (.08 + index * .137) + Math.sin(t * (.12 + depth * .08) + index * 1.8) * width * (.018 + depth * .018);
          const y = height * (.23 + sceneNoise(index * 5.8) * .52) + Math.sin(t * (.31 + index * .017) + index * 2.1) * height * (.026 + depth * .03);
          const w = r * 2.15;
          const h = r * 1.42;
          const bellTop = y - h * .48;
          const rimY = y + h * .12;
          const hue = index % 4 === 0 ? '#bca6ff' : index % 3 === 0 ? '#79f4ef' : '#8fddff';
          const secondary = index % 3 === 0 ? '#79baff' : '#d3a6ff';
          const pulse = .5 + .5 * Math.sin(t * (.76 + depth * .24) + index * 2.2);
          const alpha = .43 + depth * .38;

          ctx.save();
          ctx.globalAlpha = alpha;
          // A very restrained halo gives light emission without turning the animal into a blob.
          const halo = ctx.createRadialGradient(x, y, r * .08, x, y, r * 2.05);
          halo.addColorStop(0, hue + '2b');
          halo.addColorStop(.48, hue + '12');
          halo.addColorStop(1, hue + '00');
          ctx.fillStyle = halo;
          ctx.fillRect(x - r * 2.1, y - r * 1.9, r * 4.2, r * 3.8);

          // The bell has a domed crown and a softly scalloped rim, not a circle or capsule.
          const bell = new Path2D();
          bell.moveTo(x - w * .5, rimY);
          bell.bezierCurveTo(x - w * .62, y - h * .24, x - w * .34, bellTop, x, bellTop - h * .045);
          bell.bezierCurveTo(x + w * .34, bellTop, x + w * .62, y - h * .24, x + w * .5, rimY);
          const lobes = 10;
          for (let k = 0; k < lobes; k++) {
            const right = x + w * (.5 - k / lobes);
            const left = x + w * (.5 - (k + 1) / lobes);
            const mid = (right + left) * .5;
            const dip = h * (.065 + .018 * Math.sin(k * 2.1 + index));
            bell.bezierCurveTo(right - (right - left) * .14, rimY + dip * .2, mid + (right - left) * .1, rimY + dip, mid, rimY + dip * .48);
            bell.bezierCurveTo(mid - (right - left) * .1, rimY + dip, left + (right - left) * .14, rimY + dip * .2, left, rimY + h * .008);
          }
          bell.closePath();
          const bellFill = ctx.createLinearGradient(x, bellTop, x, rimY + h * .1);
          bellFill.addColorStop(0, 'rgba(229,252,255,.76)');
          bellFill.addColorStop(.12, hue + 'bb');
          bellFill.addColorStop(.42, secondary + '82');
          bellFill.addColorStop(.78, hue + '55');
          bellFill.addColorStop(1, hue + '22');
          ctx.fillStyle = bellFill;
          ctx.fill(bell);
          ctx.strokeStyle = hue + 'b5';
          ctx.lineWidth = Math.max(.75, r * .025);
          ctx.stroke(bell);

          // Subumbrellar shadow and radial canals give the bell structure and translucent volume.
          ctx.beginPath();
          ctx.ellipse(x, rimY - h * .015, w * (.39 + pulse * .025), h * .19, 0, 0, Math.PI);
          ctx.fillStyle = 'rgba(4,27,54,.22)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(219,251,255,.36)';
          ctx.lineWidth = Math.max(.45, r * .012);
          ctx.beginPath();
          ctx.ellipse(x, rimY - h * .06, w * .38, h * .13, 0, Math.PI * .04, Math.PI * .96);
          ctx.stroke();
          for (let k = 0; k < 9; k++) {
            const a = Math.PI * (.12 + k * .095);
            const sx = x + Math.cos(a) * w * .39;
            const sy = rimY - h * .07 - Math.sin(a) * h * .25;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(a) * w * .035, bellTop + h * .42);
            ctx.quadraticCurveTo(x + Math.cos(a) * w * .18, y - h * .02, sx, sy);
            ctx.strokeStyle = (k % 3 ? hue : '#e7ffff') + (k % 3 ? '54' : '75');
            ctx.lineWidth = Math.max(.4, r * .012);
            ctx.stroke();
          }
          // Highlight arcs are offset, so the dome looks wet and translucent.
          ctx.beginPath();
          ctx.moveTo(x - w * .31, y - h * .23);
          ctx.bezierCurveTo(x - w * .26, bellTop + h * .12, x - w * .08, bellTop + h * .035, x + w * .035, bellTop + h * .04);
          ctx.strokeStyle = 'rgba(246,255,255,.72)';
          ctx.lineWidth = Math.max(.65, r * .026);
          ctx.lineCap = 'round';
          ctx.stroke();

          // Fine tentacles have separate lengths, waves, widths and faint trailing highlights.
          const tentacleCount = 5 + index % 4;
          for (let k = 0; k < tentacleCount; k++) {
            const anchor = x + w * (-.38 + (k / Math.max(1, tentacleCount - 1)) * .76);
            const length = h * (1.05 + sceneNoise(index * 19 + k * 3) * 2.35);
            const phase = t * (1.1 + sceneNoise(index * 7 + k) * .65) + index * 1.7 + k * .92;
            const sway = r * (.18 + sceneNoise(k * 9 + index) * .43);
            ctx.beginPath();
            ctx.moveTo(anchor, rimY + h * .06);
            ctx.bezierCurveTo(anchor + Math.sin(phase) * sway, rimY + length * .29,
              anchor + Math.sin(phase + 1.7) * sway * 1.8, rimY + length * .72,
              anchor + Math.sin(phase + 2.5) * sway * 1.25, rimY + length);
            ctx.strokeStyle = k % 3 === 0 ? secondary + '88' : hue + 'a0';
            ctx.lineWidth = Math.max(.55, r * (.012 + (k % 3) * .004));
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(anchor - .3, rimY + h * .08);
            ctx.quadraticCurveTo(anchor + Math.sin(phase + .4) * sway * 1.2, rimY + length * .46,
              anchor + Math.sin(phase + 2.7) * sway * 1.1 - r * .05, rimY + length * .84);
            ctx.strokeStyle = 'rgba(222,251,255,.36)';
            ctx.lineWidth = Math.max(.3, r * .006);
            ctx.stroke();
          }
          // Four thicker oral arms hang beneath the bell and curl independently.
          for (let k = 0; k < 4; k++) {
            const anchor = x + w * (-.16 + k * .105);
            const len = h * (.58 + sceneNoise(index * 31 + k) * .68);
            const phase = t * 1.25 + k * 1.5 + index;
            ctx.beginPath();
            ctx.moveTo(anchor, rimY + h * .02);
            ctx.bezierCurveTo(anchor + Math.sin(phase) * r * .12, rimY + len * .24,
              anchor + Math.sin(phase + 1.3) * r * .22, rimY + len * .64,
              anchor + Math.sin(phase + 2.4) * r * .17, rimY + len);
            ctx.strokeStyle = secondary + 'b0';
            ctx.lineWidth = Math.max(.7, r * .022);
            ctx.stroke();
          }
          ctx.restore();
        };
        for (let i = 0; i < 7; i++) drawJellyfish(i);
      }
      return;
    }
    if(id==='snow-globe') {fillBackground('#0b1630','#1b3151','#536d95');drawStars(time,.25);const moonX=width*.75,moonY=height*.2,moonR=min*.045;ctx.fillStyle='#e3efff';ctx.beginPath();ctx.arc(moonX,moonY,moonR,0,Math.PI*2);ctx.fill();for(let i=0;i<5;i++){const x=width*(.13+i*.18),base=height*(.82+(i%2)*.09),h=height*(.22+(i%3)*.08);ctx.fillStyle=i%2?'#142b45':'#0d2039';ctx.beginPath();ctx.moveTo(x,base-h);ctx.lineTo(x-h*.38,base-h*.38);ctx.lineTo(x-h*.22,base-h*.38);ctx.lineTo(x-h*.5,base);ctx.lineTo(x+h*.5,base);ctx.lineTo(x+h*.22,base-h*.38);ctx.lineTo(x+h*.38,base-h*.38);ctx.closePath();ctx.fill();}for(let i=0;i<120;i++){const x=(i*127.7+Math.sin(t*.6+i)*11)%width,y=(i*91+t*(12+i%15))%height;ctx.globalAlpha=.25+(i%5)*.13;ctx.fillStyle='#f4f8ff';ctx.beginPath();ctx.arc(x,y,i%4===0?1.6:.8,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;return;}
    if(id==='desert-dusk') {const sky=ctx.createLinearGradient(0,0,0,height);sky.addColorStop(0,'#171536');sky.addColorStop(.35,'#7e376e');sky.addColorStop(.66,'#f39a78');sky.addColorStop(1,'#21182e');ctx.fillStyle=sky;ctx.fillRect(0,0,width,height);const sx=width*(.72+Math.sin(t*.06)*.015),sy=height*.43,sr=min*.075;ctx.fillStyle='#ffcf9a';ctx.beginPath();ctx.arc(sx,sy,sr,0,Math.PI*2);ctx.fill();for(let j=0;j<4;j++){ctx.beginPath();ctx.moveTo(0,height*(.65+j*.09));for(let x=0;x<=width;x+=5){const y=height*(.65+j*.09)+Math.sin(x/width*5+t*.12+j*1.5)*height*(.055+j*.01)+Math.sin(x/width*9-j)*height*.018;ctx.lineTo(x,y);}ctx.lineTo(width,height);ctx.lineTo(0,height);ctx.closePath();ctx.fillStyle=['#6c355d','#4e2a4a','#302040','#17172b'][j];ctx.fill();}return;}
    if(id==='forest-night') {fillBackground('#020d12','#041b15','#063326');for(let i=0;i<35;i++){const x=(i/35)*width+(i%2)*14,h=height*(.16+((i*13)%30)/100),y=height*.83;ctx.fillStyle=i%2?'#051d19':'#06271d';ctx.beginPath();ctx.moveTo(x,y-h);ctx.lineTo(x-h*.38,y-h*.42);ctx.lineTo(x-h*.2,y-h*.43);ctx.lineTo(x-h*.48,y);ctx.lineTo(x+h*.48,y);ctx.lineTo(x+h*.2,y-h*.43);ctx.lineTo(x+h*.38,y-h*.42);ctx.closePath();ctx.fill();}for(let i=0;i<48;i++){const x=(i*149+Math.sin(t*.45+i)*20)%width,y=(i*73+Math.cos(t*.4+i*2)*12)%height*.85;const a=.18+.72*(.5+.5*Math.sin(t*1.5+i));ctx.globalAlpha=a;ctx.fillStyle=i%4?'#a2f5a7':'#fff1a3';ctx.beginPath();ctx.arc(x,y,1+(i%3)*.5,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;return;}
    if(id==='embers') {fillBackground('#070709','#170b0a','#29110b');for(let i=0;i<86;i++){const x=(i*131+Math.sin(t*.4+i)*20)%width,y=(height-((i*77+t*(12+i%29))%height)),r=.8+(i%5)*.6;ctx.globalAlpha=.12;ctx.fillStyle=i%4?'#ffcf77':'#ff6947';ctx.beginPath();ctx.arc(x,y,r*2.8,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.45+(i%4)*.12;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;return;}
  }

  const DRAWERS = { aurora:drawAurora, stars:drawStarfield, ocean:drawOcean, particles:drawParticles, matrix:drawMatrix, nebula:drawNebula, geometry:drawGeometry, rain:drawRain, fireflies:drawFireflies, solar:drawSolar, mountains:drawMountains, liquid:drawLiquid, spectrum:drawSpectrum, bsod:drawSystemScene, blackout:drawSystemScene, 'windows-update':drawSystemScene, 'mac-update':drawSystemScene, 'linux-upgrade':drawSystemScene, 'kernel-panic':drawSystemScene, terminal:drawSystemScene, 'boot-log':drawSystemScene, recovery:drawSystemScene, bios:drawSystemScene, 'ubuntu-upgrade':drawSystemScene, shutdown:drawSystemScene, 'classic-hills':drawRetroScene, synthwave:drawRetroScene, 'crt-console':drawRetroScene, 'vhs-glitch':drawRetroScene, 'arcade-grid':drawRetroScene, 'retro-desktop':drawRetroScene, pipes:drawRetroScene, tunnel:drawAbstractScene, fractal:drawAbstractScene, dna:drawAbstractScene, topography:drawAbstractScene, ripples:drawAbstractScene, ink:drawAbstractScene, chromatic:drawAbstractScene, wireframe:drawAbstractScene, clockwork:drawAbstractScene, plasma:drawAbstractScene, orbitarium:drawAbstractScene, prism:drawAbstractScene, quantum:drawAbstractScene, mandala:drawAbstractScene, 'rainy-city':drawNatureScene, underwater:drawNatureScene, 'snow-globe':drawNatureScene, 'desert-dusk':drawNatureScene, jellyfish:drawNatureScene, 'forest-night':drawNatureScene, embers:drawNatureScene, storm:drawNatureScene };
  function animate(timestamp) {
    requestAnimationFrame(animate);
    if (document.hidden || paused || !width || !height) { lastFrame = timestamp; return; }
    if (timestamp - lastFrame < 1000 / 60) return;
    lastFrame = timestamp;
    elapsed += 1;
    const drawer = DRAWERS[state.scene] || drawAurora;
    if (drawer === drawSystemScene || drawer === drawRetroScene || drawer === drawAbstractScene || drawer === drawNatureScene) drawer(state.scene, timestamp);
    else drawer(timestamp);
  }

  function resetCycleTimer() {
    clearTimeout(cycleTimer);
    cycleTimer = null;
    $('#cycleOptions').hidden = !state.cycleEnabled;
    if (!state.cycleEnabled) return;
    cycleTimer = setTimeout(function tick() {
      const current = SCENES.findIndex(scene => scene.id === state.scene);
      setScene(SCENES[(current + 1) % SCENES.length].id, { keepCycle: true });
      cycleTimer = setTimeout(tick, state.cycleInterval * 60 * 1000);
    }, state.cycleInterval * 60 * 1000);
  }
  function updatePauseButton() {
    const button = $('#pauseButton');
    button.innerHTML = `<i data-lucide="${paused ? 'play' : 'pause'}"></i>`;
    button.title = paused ? 'Resume animation (Space)' : 'Pause animation (Space)';
    button.setAttribute('aria-label', paused ? 'Resume animation' : 'Pause animation');
    iconRefresh(button);
  }
  function togglePause() { paused = !paused; updatePauseButton(); showToast(paused ? 'Animation paused' : 'Animation resumed'); }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await stage.requestFullscreen({ navigationUI: 'hide' });
    } catch (error) {
      showToast('Fullscreen was blocked by the browser');
      console.warn('Fullscreen request failed.', error);
    }
  }
  function toggleCleanMode() {
    cleanMode = !cleanMode;
    document.body.classList.toggle('clean-ui', cleanMode);
    $('#cleanModeButton').innerHTML = `<i data-lucide="${cleanMode ? 'layout-dashboard' : 'scan'}"></i> ${cleanMode ? 'Show interface' : 'Clean view'}`;
    iconRefresh($('#cleanModeButton'));
    if (cleanMode) showToast('Clean view · press H to restore controls');
  }
  function setPalette(value) {
    if (!Object.hasOwn(PALETTES, value)) return;
    state.palette = value;
    $$('.palette-option').forEach(button => button.classList.toggle('selected', button.dataset.palette === value));
    updateSceneCopy();
    saveState();
  }
  function resetSetup() {
    if (!confirm('Reset scenes, widgets, and appearance to the default setup?')) return;
    localStorage.removeItem(STORAGE_KEY);
    state = { scene:'aurora', speed:1, density:1, glow:true, palette:'default', cycleEnabled:false, cycleInterval:3, widgets:JSON.parse(JSON.stringify(DEFAULT_WIDGETS)) };
    // A refreshed focus session should start now, not at the time the script was first loaded.
    const focus = state.widgets.find(widget => widget.type === 'focus'); if (focus) focus.createdAt = Date.now();
    $('#speedRange').value = state.speed; $('#densityRange').value = state.density;
    $('#speedValue').textContent = `${state.speed.toFixed(1)}×`; $('#densityValue').textContent = `${state.density.toFixed(1)}×`;
    $('#glowToggle').checked = state.glow; $('#cycleToggle').checked = false; $('#cycleInterval').value = String(state.cycleInterval);
    setPalette(state.palette); setScene(state.scene); renderWidgets(); resetCycleTimer(); saveState(true);
  }

  function initBattery() {
    if (navigator.getBattery) {
      navigator.getBattery().then(battery => {
        batteryInfo = battery;
        const update = () => { batteryInfo = battery; updateWidgetLive(); };
        battery.addEventListener('levelchange', update);
        battery.addEventListener('chargingchange', update);
        update();
      }).catch(() => { batteryInfo = null; updateWidgetLive(); });
    } else { batteryInfo = null; }
  }

  function init() {
    $('#yearNow').textContent = String(new Date().getFullYear());
    $('#speedRange').value = state.speed;
    $('#densityRange').value = state.density;
    $('#speedValue').textContent = `${state.speed.toFixed(1)}×`;
    $('#densityValue').textContent = `${state.density.toFixed(1)}×`;
    $('#glowToggle').checked = state.glow;
    $('#cycleToggle').checked = state.cycleEnabled;
    $('#cycleInterval').value = String(state.cycleInterval);
    $$('.palette-option').forEach(button => button.classList.toggle('selected', button.dataset.palette === state.palette));
    renderSceneGrid();
    updateSceneCopy();
    resizeCanvas();
    renderWidgets();
    resetCycleTimer();
    iconRefresh();
    initBattery();

    $('#sceneGrid').addEventListener('click', event => {
      const button = event.target.closest('[data-scene]');
      if (button) setScene(button.dataset.scene);
    });
    $('#sceneSearch').addEventListener('input', renderSceneGrid);
    $$('.filter-chip').forEach(button => button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      $$('.filter-chip').forEach(chip => chip.classList.toggle('active', chip === button));
      renderSceneGrid();
    }));
    $$('.widget-add-button').forEach(button => button.addEventListener('click', () => {
      if (state.widgets.length >= 18) { showToast('Canvas limit reached — remove a widget first'); return; }
      openWidgetModal(button.dataset.addWidget);
    }));
    $('#speedRange').addEventListener('input', event => {
      state.speed = Number(event.target.value); $('#speedValue').textContent = `${state.speed.toFixed(2).replace(/0$/,'')}×`; saveState();
    });
    $('#densityRange').addEventListener('input', event => {
      state.density = Number(event.target.value); $('#densityValue').textContent = `${state.density.toFixed(1)}×`; initSceneData(); saveState();
    });
    $('#glowToggle').addEventListener('change', event => { state.glow = event.target.checked; saveState(); });
    $('#cycleToggle').addEventListener('change', event => { state.cycleEnabled = event.target.checked; resetCycleTimer(); saveState(); showToast(state.cycleEnabled ? 'Scene autopilot enabled' : 'Scene autopilot disabled'); });
    $('#cycleInterval').addEventListener('change', event => { state.cycleInterval = Number(event.target.value); resetCycleTimer(); saveState(); });
    $$('.palette-option').forEach(button => button.addEventListener('click', () => setPalette(button.dataset.palette)));
    $('#randomSceneButton').addEventListener('click', () => nextScene(1, true));
    $('#nextSceneButton').addEventListener('click', () => nextScene(1));
    $('#stageFullscreenButton').addEventListener('click', toggleFullscreen);
    $('#fullscreenButton').addEventListener('click', toggleFullscreen);
    $('#cleanModeButton').addEventListener('click', toggleCleanMode);
    $('#pauseButton').addEventListener('click', togglePause);
    $('#resetButton').addEventListener('click', resetSetup);
    $('#widgetForm').addEventListener('submit', submitWidgetForm);
    $('#modalClose').addEventListener('click', () => hideModal($('#widgetModal')));
    $('#modalCancel').addEventListener('click', () => hideModal($('#widgetModal')));
    $('#widgetModal').addEventListener('click', event => { if (event.target === $('#widgetModal')) hideModal($('#widgetModal')); });
    $('#helpButton').addEventListener('click', () => showWidgetModal($('#helpModal')));
    $('#helpClose').addEventListener('click', () => hideModal($('#helpModal')));
    $('#helpModal').addEventListener('click', event => { if (event.target === $('#helpModal')) hideModal($('#helpModal')); });
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('resize', () => { resizeCanvas(); clampWidgetsToStage(); });
    window.addEventListener('orientationchange', () => setTimeout(() => { resizeCanvas(); clampWidgetsToStage(); }, 150));
    document.addEventListener('fullscreenchange', () => { setTimeout(() => { resizeCanvas(); clampWidgetsToStage(); }, 80); });
    document.addEventListener('visibilitychange', () => { lastFrame = 0; });
    window.addEventListener('keydown', event => {
      const target = event.target;
      const typing = target && (target.matches('input, textarea, select') || target.isContentEditable);
      if (event.key === 'Escape') {
        if (!$('#widgetModal').hidden) hideModal($('#widgetModal'));
        else if (!$('#helpModal').hidden) hideModal($('#helpModal'));
        return;
      }
      if (typing || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.toLowerCase() === 'f') { event.preventDefault(); toggleFullscreen(); }
      else if (event.key.toLowerCase() === 'h') toggleCleanMode();
      else if (event.code === 'Space') { event.preventDefault(); togglePause(); }
      else if (event.key === 'ArrowRight') { event.preventDefault(); nextScene(1); }
      else if (event.key === 'ArrowLeft') { event.preventDefault(); nextScene(-1); }
      else if (event.key === '/' && $('#helpModal').hidden && $('#widgetModal').hidden) { event.preventDefault(); $('#sceneSearch').focus(); }
    });

    requestAnimationFrame(animate);
    setInterval(updateWidgetLive, 1000);
    // Keep the quote ticker independent of the seconds ticker.
    setInterval(() => {
      quoteIndex = (quoteIndex + 1) % QUOTES.length;
      lastQuoteChange = Date.now();
      state.widgets.forEach(widget => {
        if (widget.type === 'quote') widget.quoteIndex = (Number(widget.quoteIndex || 0) + 1) % QUOTES.length;
      });
      state.widgets.filter(widget => widget.type === 'quote').forEach(widget => {
        const article = $(`[data-widget-id="${CSS.escape(widget.id)}"]`, widgetLayer);
        if (!article) return;
        const q = getQuote(widget);
        const quoteEl = $('[data-role="quote"]', article), authorEl = $('[data-role="quote-author"]', article);
        if (window.gsap && quoteEl) window.gsap.fromTo(quoteEl, { opacity:.2, y:3 }, { opacity:1, y:0, duration:.35, overwrite:true });
        if (quoteEl) quoteEl.textContent = q[0];
        if (authorEl) authorEl.textContent = `— ${q[1]}`;
      });
      saveState();
    }, 60000);
    // A brief entrance motion improves hierarchy, but the page still works if GSAP is blocked.
    if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.gsap.fromTo('.intro-row > div:first-child', { opacity:0, y:8 }, { opacity:1, y:0, duration:.55, ease:'power2.out' });
      window.gsap.fromTo('.stage', { opacity:0, scale:.992 }, { opacity:1, scale:1, duration:.6, delay:.08, ease:'power2.out' });
    }
  }
  function clampWidgetsToStage() {
    const rect = widgetLayer.getBoundingClientRect();
    $$('.float-widget', widgetLayer).forEach(article => {
      const widget = state.widgets.find(item => item.id === article.dataset.widgetId);
      if (!widget) return;
      const maxX = Math.max(1, (rect.width - article.offsetWidth - 4) / rect.width * 100);
      const maxY = Math.max(1, (rect.height - article.offsetHeight - 4) / rect.height * 100);
      widget.x = clamp(widget.x, 1, maxX); widget.y = clamp(widget.y, 1, maxY);
      article.style.left = `${widget.x}%`; article.style.top = `${widget.y}%`;
    });
    saveState();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
