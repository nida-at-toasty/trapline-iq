// Language selector (EN / ES). Text on the page is written in English; this swaps each text node
// (and a few attributes) to Spanish when ES is picked, and back again for EN. The choice is kept
// in localStorage so it carries across the three pages. Strings without an entry stay as they are
// (place names, numbers, the brand name).
(function () {
  const ES = {
    'Home': 'Inicio',
    // Nav, hero, shared
    'How It Works': 'Cómo funciona',
    'For Trappers': 'Para tramperos',
    'Download App Now': 'Descarga la app',
    'Works offline. Built for trappers.': 'Funciona sin conexión. Hecha para tramperos.',
    'Your trapline, wherever the trail goes.': 'Tu línea de trampas, donde te lleve el sendero.',
    'Map traps, track routes and log every catch, all in one app that works offline.': 'Mapea trampas, sigue rutas y registra cada captura en una sola app que funciona sin conexión.',
    'Trapline IQ helps Canadian trappers map trap locations, track routes, record catches, log visits, and manage their trapping records all from one offline-first mobile app.': 'Trapline IQ ayuda a los tramperos de Canadá a mapear sus trampas, seguir rutas, registrar capturas y visitas, y gestionar sus registros desde una sola app móvil que funciona sin conexión.',
    'Offline maps and navigation': 'Mapas y navegación sin conexión',
    'Log visits and your captures': 'Registra visitas y capturas',
    'Plan outings and share field information': 'Planifica salidas y comparte información de campo',
    'Download Trapline IQ today': 'Descarga Trapline IQ hoy',

    // Core features
    'Core Features': 'Funciones principales',
    'Everything you need.': 'Todo lo que necesitas.',
    'Nothing': 'Nada',
    "you don't.": 'que no.',
    'From planning your route to recording your latest capture, Trapline IQ keeps your entire trapping operation organized.': 'Desde planificar tu ruta hasta registrar tu última captura, Trapline IQ mantiene organizada toda tu actividad de trampeo.',
    'Trap & Marker Management': 'Gestión de trampas y marcadores',
    'Add and manage traps, boxes and points of interest.': 'Añade y gestiona trampas, cajas y puntos de interés.',
    'Offline Maps & GPS': 'Mapas sin conexión y GPS',
    'Download maps and navigate without internet access.': 'Descarga mapas y navega sin acceso a internet.',
    'Routes & Activity Tracking': 'Rutas y seguimiento de actividad',
    'Create routes, save trails and track field movements.': 'Crea rutas, guarda senderos y sigue tus movimientos en el campo.',
    'Visit & Capture Logging': 'Registro de visitas y capturas',
    'Record trap visits, animal captures and trap activities.': 'Registra visitas a trampas, capturas de animales y actividades.',
    'Journal & Field Records': 'Diario y registros de campo',
    'Log field days, observations and issues.': 'Anota jornadas de campo, observaciones e incidencias.',
    'Planning & Sharing': 'Planificación y colaboración',
    'Organize outings and share field information.': 'Organiza salidas y comparte información de campo.',

    // For trappers (home)
    'For trappers': 'Para tramperos',
    'Your': 'Tu',
    'Territory': 'territorio',
    '. Your Traditions. Your': '. Tus tradiciones. Tu',
    'People.': 'gente.',
    'The wilderness may take you off the grid, but your fieldwork stays organized. Plan your outings, manage your territory, and share important field information with the people you trap alongside — all with Trapline IQ.': 'La naturaleza puede dejarte sin señal, pero tu trabajo de campo sigue organizado. Planifica tus salidas, gestiona tu territorio y comparte información importante con quienes trampean contigo, todo con Trapline IQ.',
    'Plan Together': 'Planifiquen juntos',
    'Organize outings and get your next trip planned before you hit the trail.': 'Organiza salidas y ten tu próximo viaje planificado antes de salir al sendero.',
    'Navigate with Confidence': 'Navega con confianza',
    'Find your marked locations and follow your routes, even beyond cell coverage.': 'Encuentra tus puntos marcados y sigue tus rutas, incluso sin cobertura.',
    'Stay Connected': 'Mantente conectado',
    'Share relevant field information and keep your trapping buddies in the loop.': 'Comparte información de campo y mantén al tanto a tus compañeros de trampeo.',
    'Distance': 'Distancia',
    'Transport': 'Transporte',
    'Avg. speed': 'Vel. media',
    'Duration': 'Duración',
    'Waypoints': 'Puntos de ruta',
    'Start': 'Inicio',
    'Starting location': 'Punto de partida',
    'End': 'Fin',

    // How it works (home)
    'How it works': 'Cómo funciona',
    'From First Check to Final Record.': 'De la primera revisión al registro final.',
    'One connected workflow for every trip, every trap, and every detail worth keeping.': 'Un flujo conectado para cada salida, cada trampa y cada detalle que vale la pena guardar.',
    'Know Before You Go.': 'Infórmate antes de salir.',
    'Download maps, mark trap locations, and plan your route before heading out.': 'Descarga mapas, marca tus trampas y planifica tu ruta antes de salir.',
    'Find Your Way Out There.': 'Encuentra tu camino allá afuera.',
    'Navigate with GPS, locate your markers, and record trap visits and captures in the field.': 'Navega con GPS, localiza tus marcadores y registra visitas y capturas en el campo.',
    'Keep Every Detail.': 'Guarda cada detalle.',
    'Review your field notes, track seasonal activity, and keep your records organized.': 'Revisa tus notas de campo, sigue la actividad de la temporada y mantén tus registros en orden.',

    // Founder
    'Meet the Founder': 'Conoce al fundador',
    '“The best technology doesn\'t replace tradition. It helps us carry it forward.”': '“La mejor tecnología no reemplaza la tradición. Nos ayuda a mantenerla viva.”',
    'I built Trapline IQ to give trappers a simpler way to manage their traplines, record their experiences, and spend more time where they belong on the line': 'Creé Trapline IQ para dar a los tramperos una forma más sencilla de gestionar sus líneas, registrar sus experiencias y pasar más tiempo donde pertenecen: en la línea',
    'Founder, Trapline IQ': 'Fundador, Trapline IQ',

    // More ways
    'More ways to trap smarter': 'Más formas de trampear mejor',
    "We're building more tools to make every trapping season easier. From homemade recipes to fur management.": 'Estamos creando más herramientas para facilitar cada temporada de trampeo. Desde recetas caseras hasta la gestión de pieles.',
    'Your secret formulas': 'Tus fórmulas secretas',
    'all in one place': 'en un solo lugar',
    'Save snare and lure recipes with ingredients and instructions.': 'Guarda recetas de cebos y lazos con ingredientes e instrucciones.',
    'Stay one step ahead of the season.': 'Adelántate a la temporada.',
    'Plan trapping activities and track key dates with a seasonal calendar.': 'Planifica actividades de trampeo y sigue fechas clave con un calendario de temporada.',
    'From freezer to sale, stay organized.': 'Del congelador a la venta, todo organizado.',
    'Track fur inventory, monitor preparation, and manage pelts and pickups.': 'Controla tu inventario de pieles, su preparación, y gestiona pieles y recogidas.',

    // CTA + footer
    '5.0 Reviews': '5.0 reseñas',
    'Built for trappers. Made for the trapline': 'Hecha para tramperos. Pensada para la línea',
    'Your trapline, your routes, your records everything you need for the season ahead, all in one place.': 'Tu línea, tus rutas, tus registros: todo lo que necesitas para la temporada, en un solo lugar.',
    'The all-in-one app for trappers to plan, navigate, and keep their field records organized on and off the grid.': 'La app todo en uno para que los tramperos planifiquen, naveguen y mantengan sus registros de campo en orden, con o sin conexión.',
    'Company': 'Empresa',
    'Download App': 'Descargar la app',
    'Sign up for our newsletter and join the Transparent community.': 'Suscríbete a nuestro boletín y únete a la comunidad.',
    'Subscribe': 'Suscribirse',
    '© 2026 Trapline IQ All rights reserved.': '© 2026 Trapline IQ. Todos los derechos reservados.',
    'Privacy Policy': 'Política de privacidad',

    // How It Works page
    'From first check to final record.': 'De la primera revisión al registro final.',
    'One connected workflow for every trip, every trap, and every detail worth keeping. Plan before you head out, find your way in the field, and keep every record organized, even with no signal.': 'Un flujo conectado para cada salida, cada trampa y cada detalle. Planifica antes de salir, oriéntate en el campo y mantén cada registro en orden, incluso sin señal.',
    'The workflow': 'El flujo de trabajo',
    'A season in four moves.': 'Una temporada en cuatro pasos.',
    'Trapline IQ follows the rhythm of a real trapline: plan at the kitchen table, head out, check every set, and come home with records that are already done.': 'Trapline IQ sigue el ritmo de una línea real: planificas en la mesa de la cocina, sales, revisas cada trampa y vuelves a casa con los registros ya hechos.',
    'Plan the run': 'Planifica el recorrido',
    'Download the map packs for your territory, drop pins for every set and save the route you want to run.': 'Descarga los mapas de tu territorio, marca cada trampa y guarda la ruta que quieres recorrer.',
    'At home · 10 min': 'En casa · 10 min',
    'Head out': 'Sal al campo',
    'GPS guides you set to set with no signal needed. Distance, speed and stops are tracked automatically.': 'El GPS te guía de trampa en trampa sin necesidad de señal. Distancia, velocidad y paradas se registran solas.',
    'On the trail': 'En el sendero',
    'Check every set': 'Revisa cada trampa',
    "Log a visit in two taps: capture, bait refreshed, reset or closed. Add a photo and a note while it's fresh.": 'Registra una visita en dos toques: captura, cebo renovado, rearmada o cerrada. Añade una foto y una nota en el momento.',
    'At each trap · 20 sec': 'En cada trampa · 20 s',
    'Come home organized': 'Vuelve con todo en orden',
    "Your day syncs the moment you're back in range. Totals, catches and field notes are ready to review.": 'Tu jornada se sincroniza en cuanto recuperas señal. Totales, capturas y notas listos para revisar.',
    'Back in range': 'Con señal de nuevo',
    'Offline first': 'Primero sin conexión',
    'Built for places your phone gives up.': 'Hecha para donde tu teléfono se rinde.',
    'Everything you need on the line lives on your device. No bars, no problem: maps, pins, routes and logs all work offline and sync later.': 'Todo lo que necesitas en la línea vive en tu dispositivo. Sin barras, sin problema: mapas, marcadores, rutas y registros funcionan sin conexión y se sincronizan después.',
    'Offline map packs': 'Mapas descargables',
    'Topographic maps for your whole territory, saved by region.': 'Mapas topográficos de todo tu territorio, guardados por región.',
    'GPS without data': 'GPS sin datos',
    'Your position and route recording use satellites, not cell towers.': 'Tu posición y el registro de la ruta usan satélites, no antenas.',
    'Logs that wait for you': 'Registros que te esperan',
    "Visits and captures queue up and upload once you're back in range.": 'Las visitas y capturas quedan en cola y se suben cuando recuperas señal.',
    'Battery friendly': 'Cuida la batería',
    'Tracking is tuned to last a full day on the line.': 'El seguimiento está pensado para durar una jornada completa.',
    'Map pack saved · 180 MB · works offline': 'Mapa guardado · 180 MB · funciona sin conexión',
    'Your records': 'Tus registros',
    'Everything you log, in one place.': 'Todo lo que registras, en un solo lugar.',
    'Each visit builds a complete history of your trapline, so the end-of-season report practically writes itself.': 'Cada visita construye el historial completo de tu línea, así el informe de fin de temporada casi se escribe solo.',
    'Trap sets': 'Trampas',
    'Type, location, bait and status for every set on your line.': 'Tipo, ubicación, cebo y estado de cada trampa de tu línea.',
    'Conibear 220 · Active': 'Conibear 220 · Activa',
    'Visits': 'Visitas',
    'When you checked it and what you found, in two taps.': 'Cuándo la revisaste y qué encontraste, en dos toques.',
    'Today, 7:42 AM': 'Hoy, 7:42 AM',
    'Bait refreshed': 'Cebo renovado',
    'Captures': 'Capturas',
    'Species, sex, weight and whether it was targeted.': 'Especie, sexo, peso y si era la especie objetivo.',
    'Marten · Female': 'Marta · Hembra',
    '0.8 kg · Targeted': '0,8 kg · Objetivo',
    'Conditions': 'Condiciones',
    'Weather and snow are attached to each day automatically.': 'El clima y la nieve se añaden a cada jornada automáticamente.',
    '−5 °C · Snow': '−5 °C · Nieve',
    'Light wind': 'Viento suave',
    'Routes': 'Rutas',
    'Every trip with distance, time on trail and transport.': 'Cada salida con distancia, tiempo en el sendero y transporte.',
    'North Creek loop': 'Circuito North Creek',
    'Field notes': 'Notas de campo',
    'Observations, tracks and issues, with photos attached.': 'Observaciones, huellas e incidencias, con fotos adjuntas.',
    'Fresh tracks': 'Huellas frescas',
    'Near the creek crossing': 'Cerca del cruce del arroyo',
    'FAQ': 'Preguntas',
    'Questions trappers ask.': 'Preguntas de los tramperos.',
    "Can't find what you're looking for? Write to us at": '¿No encuentras lo que buscas? Escríbenos a',
    'and a real person will answer.': 'y te responderá una persona real.',
    'Does Trapline IQ really work with no cell signal?': '¿Trapline IQ funciona de verdad sin señal?',
    'Yes. Download the map packs for your territory before you leave, and maps, GPS, pins and logging all work fully offline. Your entries sync automatically the next time you have a connection.': 'Sí. Descarga los mapas de tu territorio antes de salir y los mapas, el GPS, los marcadores y los registros funcionan sin conexión. Todo se sincroniza solo la próxima vez que tengas señal.',
    'Which provinces and territories are covered?': '¿Qué provincias y territorios están cubiertos?',
    'Topographic maps are available across Canada, from the Yukon to Newfoundland and Labrador, including registered trapline and UGAF zones where available.': 'Hay mapas topográficos de todo Canadá, del Yukón a Terranova y Labrador, incluidas las líneas registradas y zonas UGAF donde estén disponibles.',
    'Can I share my trapline with a partner?': '¿Puedo compartir mi línea con un compañero?',
    'You can invite trapping partners to a shared territory. Everyone sees the same sets and routes, and visits are tagged with who logged them.': 'Puedes invitar a compañeros a un territorio compartido. Todos ven las mismas trampas y rutas, y cada visita indica quién la registró.',
    'How much battery does tracking use?': '¿Cuánta batería consume el seguimiento?',
    'Route recording is tuned for long days. Most trappers finish a full run with plenty to spare, and a low-power mode stretches it further in the cold.': 'El registro de rutas está pensado para jornadas largas. La mayoría termina el recorrido con batería de sobra, y el modo de bajo consumo la alarga en el frío.',
    'Can I export my records?': '¿Puedo exportar mis registros?',
    'Yes. Export a season summary or your full visit and capture history as a spreadsheet or PDF for your own records or reporting.': 'Sí. Exporta un resumen de temporada o tu historial completo de visitas y capturas como hoja de cálculo o PDF.',

    // For Trappers page
    'Built by a trapper, for the people on the line.': 'Creada por un trampero, para la gente de la línea.',
    'From first-season beginners to crews running hundreds of sets, Trapline IQ keeps your territory, your traditions and your people connected, even far beyond cell coverage.': 'Desde principiantes en su primera temporada hasta equipos con cientos de trampas, Trapline IQ mantiene conectados tu territorio, tus tradiciones y tu gente, incluso lejos de la cobertura.',
    "Who it's for": 'Para quién es',
    'Made for every kind of trapline.': 'Hecha para todo tipo de línea.',
    "Whether it's your first season or your thirtieth, a solo line or a family operation, Trapline IQ fits the way you already work.": 'Sea tu primera temporada o la número treinta, una línea en solitario o familiar, Trapline IQ se adapta a tu forma de trabajar.',
    'Seasoned line runners': 'Tramperos veteranos',
    'Long lines, dozens of sets, years of habits. Keep every trap and route in one place instead of a notebook and memory.': 'Líneas largas, decenas de trampas, años de costumbre. Guarda cada trampa y ruta en un solo lugar, no en un cuaderno ni en la memoria.',
    'Hundreds of sets, no clutter': 'Cientos de trampas, sin desorden',
    'Season-over-season history': 'Historial de temporada en temporada',
    'Fast two-tap visit logging': 'Registro rápido de visitas en dos toques',
    'Crews and partners': 'Equipos y compañeros',
    'Share a territory with the people you trap alongside, split up the line and see who checked what, and when.': 'Comparte un territorio con quienes trampean contigo, repartan la línea y vean quién revisó qué y cuándo.',
    'Shared sets and routes': 'Trampas y rutas compartidas',
    'Visits tagged by person': 'Visitas marcadas por persona',
    'Plan outings together': 'Planifiquen salidas juntos',
    'New and family trappers': 'Tramperos nuevos y familias',
    "Learning the land with the next generation? Mark what works, note what doesn't, and build knowledge you can hand down.": '¿Aprendiendo el terreno con la próxima generación? Marca lo que funciona, anota lo que no y construye un saber para transmitir.',
    'Simple, guided setup': 'Configuración sencilla y guiada',
    'Notes and photos on every set': 'Notas y fotos en cada trampa',
    'Offline maps from day one': 'Mapas sin conexión desde el primer día',
    'Trusted on traplines across Canada.': 'La confianza de tramperos de todo Canadá.',
    'trap sets mapped': 'trampas mapeadas',
    'visits logged': 'visitas registradas',
    'trapping regions covered': 'regiones de trampeo cubiertas',
    'works offline': 'funciona sin conexión',
    'Voices from the line': 'Voces de la línea',
    'Verified trapper': 'Trampero verificado',
    'In the field': 'En el campo',
    'Life on the line.': 'La vida en la línea.',
    'Snowmobile runs, fur sheds and frozen lakes: a season through the eyes of the trappers who use Trapline IQ.': 'Recorridos en moto de nieve, cobertizos de pieles y lagos helados: una temporada vista por los tramperos que usan Trapline IQ.',
    "“The offline maps sold me. I ran forty kilometres of line last week without a single bar and every visit was waiting to sync when I got home.”": '“Los mapas sin conexión me convencieron. La semana pasada recorrí cuarenta kilómetros de línea sin señal y cada visita estaba lista para sincronizar al llegar a casa.”',
    "“Two taps at each set and I'm moving again. At the end of the season my report was basically done before I sat down.”": '“Dos toques en cada trampa y sigo adelante. Al final de la temporada, mi informe estaba prácticamente hecho antes de sentarme.”',
    'Northwest Territories · 9 seasons': 'Territorios del Noroeste · 9 temporadas',
    'Abitibi, QC · 17 seasons': 'Abitibi, QC · 17 temporadas',
    'What trappers are saying.': 'Lo que dicen los tramperos.',
    'Sample stories from trappers using Trapline IQ through the season.': 'Historias de ejemplo de tramperos que usan Trapline IQ durante la temporada.',
    "“I used to keep my sets in three notebooks and my head. Now my whole line is on my phone, even out past Lac Contact where there's no signal at all.”": '“Antes llevaba mis trampas en tres cuadernos y en la cabeza. Ahora toda mi línea está en el teléfono, incluso pasado el Lac Contact, donde no hay nada de señal.”',
    '“My brother and I split our line on weekends. Seeing which sets he checked and what he found saves us a ton of back and forth.”': '“Mi hermano y yo nos repartimos la línea los fines de semana. Ver qué trampas revisó y qué encontró nos ahorra muchas idas y vueltas.”',
    "“Teaching my daughter the line, we photograph every set and write down what worked. That's a record she'll have long after I'm done.”": '“Enseñándole la línea a mi hija, fotografiamos cada trampa y anotamos lo que funcionó. Es un registro que tendrá mucho después de que yo lo deje.”',
    'Côte-Nord, QC · 22 seasons': 'Côte-Nord, QC · 22 temporadas',
    'Northern Ontario · 6 seasons': 'Norte de Ontario · 6 temporadas',
    'Churchill River, MB · 14 seasons': 'Churchill River, MB · 14 temporadas',
    'Season planner': 'Planificador de temporada',
    'Your season, at a glance.': 'Tu temporada, de un vistazo.',
    'Mark openings, plan your outings and get reminders before key dates, all on one seasonal calendar. Dates below are examples; always check your provincial regulations.': 'Marca aperturas, planifica salidas y recibe recordatorios antes de las fechas clave, en un solo calendario. Las fechas son ejemplos; consulta siempre la normativa de tu provincia.',
    'Oct': 'Oct', 'Nov': 'Nov', 'Dec': 'Dic', 'Jan': 'Ene', 'Feb': 'Feb', 'Mar': 'Mar',
    'Scouting': 'Exploración',
    'Walk the line, mark new sets': 'Recorre la línea, marca trampas nuevas',
    'Season opens': 'Abre la temporada',
    'Marten, fisher, mink': 'Marta, pekán, visón',
    'Peak running': 'Plena temporada',
    'Beaver, otter, lynx': 'Castor, nutria, lince',
    'Deep winter': 'Pleno invierno',
    'Snowmobile routes': 'Rutas en motonieve',
    'Late season': 'Final de temporada',
    'Fox, coyote, wolf': 'Zorro, coyote, lobo',
    'Wrap up': 'Cierre',
    'Pull sets, sell fur': 'Retira trampas, vende pieles',
    'North Creek crew': 'Equipo North Creek',
    '3 trappers · 64 shared sets': '3 tramperos · 64 trampas compartidas',
    'Crews': 'Equipos',
    'Bring your crew along.': 'Suma a tu equipo.',
    'Invite the people you trap with to a shared territory. Everyone works from the same map, and nothing gets lost between trips.': 'Invita a quienes trampean contigo a un territorio compartido. Todos trabajan sobre el mismo mapa y nada se pierde entre salidas.',
    'Shared territory': 'Territorio compartido',
    'One map of sets and routes for the whole crew.': 'Un mapa de trampas y rutas para todo el equipo.',
    'Who checked what': 'Quién revisó qué',
    'Every visit shows who logged it and when.': 'Cada visita muestra quién la registró y cuándo.',
    'Split the line and set dates in the shared calendar.': 'Repartan la línea y fijen fechas en el calendario compartido.',
    'Start your crew': 'Crea tu equipo',

    // Attributes
    'Input Email Address': 'Tu correo electrónico',
    'Download on the App Store': 'Descárgala en el App Store',
    'Get it on Google Play': 'Disponible en Google Play',
  };

  const KEY = 'trapline-lang';
  const nodes = [];
  const attrs = [];
  const collect = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement && !n.parentElement.closest('script, style, .lang-switch') && n.textContent.trim()
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
    });
    let n;
    while ((n = walker.nextNode())) {
      const key = n.textContent.replace(/\s+/g, ' ').trim();
      if (ES[key]) nodes.push({ n, en: n.textContent, key });
    }
    document.querySelectorAll('[placeholder], img[alt]').forEach((el) => {
      ['placeholder', 'alt'].forEach((a) => {
        const v = el.getAttribute(a);
        if (v && ES[v]) attrs.push({ el, a, en: v });
      });
    });
  };

  const apply = (lang) => {
    nodes.forEach(({ n, en, key }) => {
      // Keep the original leading/trailing whitespace so inline spacing doesn't shift
      const lead = en.match(/^\s*/)[0];
      const trail = en.match(/\s*$/)[0];
      n.textContent = lang === 'es' ? lead + ES[key] + trail : en;
    });
    attrs.forEach(({ el, a, en }) => el.setAttribute(a, lang === 'es' ? ES[en] : en));
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-switch button').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    try { localStorage.setItem(KEY, lang); } catch (e) { /* storage blocked: choice lasts this page only */ }
  };

  collect();
  document.querySelectorAll('.lang-switch button').forEach((b) => {
    b.addEventListener('click', () => apply(b.dataset.lang));
  });
  let saved = 'en';
  try { saved = localStorage.getItem(KEY) || 'en'; } catch (e) { /* ignore */ }
  apply(saved);
})();
