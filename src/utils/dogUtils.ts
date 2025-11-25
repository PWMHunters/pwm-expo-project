export const translateLifeSpan = (text?: string) => {
  if (!text) return 'N/A';
  return text
    .replace(/years?/gi, 'anos')
    .replace(/year/gi, 'ano')
    .replace(/range/gi, 'faixa');
};

export const translateBreedGroup = (group?: string) => {
  if (!group) return 'Não classificado';
  const groups: Record<string, string> = {
    "Toy": "Toy (Companhia)",
    "Working": "Trabalho",
    "Hound": "Hound (Caça/Sabujo)",
    "Terrier": "Terrier",
    "Non-Sporting": "Não Esportivo",
    "Sporting": "Esportivo",
    "Herding": "Pastoreio",
    "Mixed": "Misto",
    "Foundation Stock Service": "Serviço de Estoque (FSS)"
  };
  return groups[group] || group;
};

export const translateTemperament = (text?: string) => {
  if (!text) return 'Comportamento desconhecido';

  const dictionary: Record<string, string> = {
    "Stubborn": "Teimoso", "Curious": "Curioso", "Playful": "Brincalhão",
    "Adventurous": "Aventureiro", "Active": "Ativo", "Fun-loving": "Divertido",
    "Friendly": "Amigável", "Intelligent": "Inteligente", "Loyal": "Leal",
    "Brave": "Corajoso", "Calm": "Calmo", "Gentle": "Gentil",
    "Confident": "Confiante", "Loving": "Amoroso", "Protective": "Protetor",
    "Trainable": "Treinável", "Independent": "Independente", "Alert": "Alerta",
    "Affectionate": "Afetuoso", "Energetic": "Energético", "Watchful": "Vigilante",
    "Hardworking": "Trabalhador", "Feisty": "Animado/Corajoso", "Docile": "Dócil",
    "Responsive": "Responsivo", "Composed": "Composto", "Receptive": "Receptivo",
    "Faithful": "Fiel", "Outgoing": "Extrovertido", "Assertive": "Assertivo",
    "Courageous": "Corajoso", "Social": "Sociável", "Dignified": "Digno",
    "Aggressive": "Agressivo", "Dominant": "Dominante", "Strong": "Forte",
    "Willed": "Determinado", "Obedient": "Obediente", "Tenacious": "Tenaz",
    "Steady": "Estável", "Bold": "Audacioso", "Proud": "Orgulhoso",
    "Spirited": "Espirituoso", "Reliable": "Confiável", "Fearless": "Destemido",
    "Lively": "Vivo/Animado", "Self-assured": "Autoconfiante", "Cautious": "Cauteloso",
    "Eager": "Ansioso", "Good-natured": "Boa índole", "Even Tempered": "Temperamento Equilibrado",
    "Happy": "Feliz", "Wild": "Selvagem", "Devoted": "Devotado",
    "Athletic": "Atlético", "Clever": "Esperto", "Quiet": "Quieto",
    "Attentive": "Atento", "Gay": "Alegre", "Sensory": "Sensorial",
    "Clownish": "Engraçado", "Opinionated": "Teimoso/Opinioso", "Agile": "Ágil",
    "Quick": "Rápido", "Familial": "Familiar", "Rational": "Racional",
    "Benevolent": "Benevolente", "Strong Willed": "Determinado", "Kind": "Gentil",
    "Suspicious": "Desconfiado", "Territorial": "Territorial", "Keen": "Entusiasmado",
    "Bright": "Brilhante", "Cooperative": "Cooperativo", "Vocal": "Vocal",
    "Bossy": "Mandão", "Cunning": "Astuto", "Boisterous": "Barulhento",
    "Fast": "Rápido", "Rugged": "Robusto", "Fierce": "Feroz",
    "Refined": "Refinado", "Sensitive": "Sensível", "Possessive": "Possessivo",
    "Cheerful": "Alegre", "Unflappable": "Imperturbável", "Patient": "Paciente",
    "Vigilant": "Vigilante", "Tolerant": "Tolerante", "Adaptable": "Adaptável",
    "Trusting": "Confiante", "Mischievous": "Travesso", "People-Oriented": "Orientado a Pessoas"
  };

  return text.split(', ').map(word => dictionary[word] || word).join(', ');
};

export const translateGeneric = (text?: string) => {
  if (!text) return 'Desconhecido';
  
  let translated = text;

  const terms: Record<string, string> = {
    "Germany": "Alemanha", "France": "França", "UK": "Reino Unido", "United Kingdom": "Reino Unido",
    "Scotland": "Escócia", "England": "Inglaterra", "Ireland": "Irlanda", "China": "China",
    "Japan": "Japão", "Australia": "Austrália", "USA": "EUA", "United States": "Estados Unidos",
    "Canada": "Canadá", "Russia": "Rússia", "Belgium": "Bélgica", "Spain": "Espanha",
    "Italy": "Itália", "Switzerland": "Suíça", "Turkey": "Turquia", "Mexico": "México",
    "Netherlands": "Holanda", "Hungary": "Hungria", "Finland": "Finlândia", "Sweden": "Suécia",
    "Norway": "Noruega", "Denmark": "Dinamarca", "Poland": "Polônia", "Portugal": "Portugal",
    "Argentina": "Argentina", "Brazil": "Brasil", "Wales": "País de Gales", "Central Africa": "África Central",
    "Middle East": "Oriente Médio", "Tibet": "Tibete", "Mediterranean": "Mediterrâneo", "Madagascar": "Madagascar",
    "Siberia": "Sibéria", "Malta": "Malta", "Greece": "Grécia", "Thailand": "Tailândia", "Peru": "Peru", "Afghanistan": "Afeganistão", "Pakistan": "Paquistão",
    
    "Small rodent hunting": "Caça de pequenos roedores",
    "lapdog": "cão de colo", "Lapdog": "Cão de colo",
    "hunting": "caça", "Hunting": "Caça",
    "guard dog": "cão de guarda", "Guarding": "Guarda",
    "companion": "companhia", "Companion": "Companhia",
    "herding": "pastoreio", "Herding": "Pastoreio",
    "retrieving": "buscar caça", "Retrieving": "Buscar caça",
    "water dog": "cão d'água", "Water retrieval": "Resgate na água",
    "coursing": "corrida", "racing": "corrida", "fighting": "luta",
    "bull baiting": "luta com touros", "badger hunting": "caça de texugos",
    "fox hunting": "caça de raposas", "bird flushing": "espantar pássaros",
    "retrieving water fowl": "buscar aves aquáticas", "sled pulling": "puxar trenó",
    "sheep herding": "pastoreio de ovelhas", "cattle herding": "pastoreio de gado",
    "draft": "tração", "cart pulling": "puxar carroça",
    "ratting": "caça de ratos", "watchdog": "cão de vigia", "agility": "agilidade",
    "big game hunting": "caça de animais grandes", "flushing": "levantar caça",
    "pointing": "apontar caça", "family companion": "companhia familiar"
  };

  Object.keys(terms).forEach(key => {
    translated = translated.replace(new RegExp(key, 'gi'), terms[key]);
  });

  return translated;
};