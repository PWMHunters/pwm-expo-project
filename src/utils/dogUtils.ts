export const translateTemperament = (text?: string) => {
  if (!text) return 'Desconhecido';
  const dictionary: Record<string, string> = {
    "Stubborn": "Teimoso", "Curious": "Curioso", "Playful": "Brincalhão",
    "Adventurous": "Aventureiro", "Active": "Ativo", "Fun-loving": "Divertido",
    "Friendly": "Amigável", "Intelligent": "Inteligente", "Loyal": "Leal",
    "Brave": "Corajoso", "Calm": "Calmo", "Gentle": "Gentil",
    "Confident": "Confiante", "Loving": "Amoroso", "Protective": "Protetor",
    "Trainable": "Treinável", "Independent": "Independente", "Alert": "Alerta",
    "Affectionate": "Afetuoso", "Energetic": "Energético", "Watchful": "Vigilante",
    "Hardworking": "Trabalhador", "Feisty": "Corajoso", "Docile": "Dócil",
    "Responsive": "Responsivo", "Composed": "Composto", "Receptive": "Receptivo",
    "Faithful": "Fiel"
  };
  return text.split(', ').map(word => dictionary[word] || word).join(', ');
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
    "Mixed": "Misto"
  };
  return groups[group] || group;
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
    "Small rodent hunting": "Caça de pequenos roedores",
    "lapdog": "cão de colo", "Lapdog": "Cão de colo",
    "hunting": "caça", "Hunting": "Caça",
    "guard dog": "cão de guarda", "Guarding": "Guarda",
    "companion": "companhia", "Companion": "Companhia",
    "herding": "pastoreio", "Herding": "Pastoreio",
    "retrieving": "buscar caça", "water dog": "cão d'água",
    "coursing": "corrida", "racing": "corrida", "fighting": "luta"
  };
  Object.keys(terms).forEach(key => {
    translated = translated.replace(new RegExp(key, 'g'), terms[key]);
  });
  return translated;
};