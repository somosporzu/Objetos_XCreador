// Iconos SVG
const BookIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const Trash2Icon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const DownloadIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

// Datos del sistema
const RARITIES = {
    'Poco Común': { min: 3, max: 5, price: '200-500 L' },
    'Raro': { min: 6, max: 10, price: '500-2,000 L' },
    'Muy Raro': { min: 11, max: 15, price: '2,000-10,000 L' },
    'Legendario': { min: 16, max: 25, price: 'Sin precio' }
};

const PROPERTIES = {
    'Bonificadores a Atributos': [
        { name: '+1 a un Atributo', cost: 3, note: 'Máximo +3 en un objeto' },
        { name: '+1 a dos Atributos', cost: 5, note: 'Muy raro' },
        { name: '+1 a los tres Atributos', cost: 8, note: 'Solo Legendario+' }
    ],
    'Bonificadores a Combate': [
        { name: '+1 a tiradas de ataque', cost: 2, note: 'Solo armas' },
        { name: '+1 al daño', cost: 2, note: 'Solo armas' },
        { name: '+1 a Defensa', cost: 2, note: 'Armaduras, escudos' },
        { name: '+1 a Iniciativa', cost: 2, note: 'Accesorios, armas ligeras' }
    ],
    'Bonificadores a Recursos': [
        { name: '+5 Resistencia máxima', cost: 1, note: 'Acumulable hasta +15' },
        { name: '+3 metros de movimiento', cost: 1, note: 'Acumulable hasta +9' },
        { name: '+1 Potenciación Naturaleza', cost: 2, note: 'Especificar cuál' },
        { name: '+1 Potenciación Concepto', cost: 2, note: 'Especificar cuál' }
    ],
    'Curación y Restauración': [
        { name: 'Curación Menor (1d6+2)', cost: 1, note: 'Restaura Resistencia' },
        { name: 'Curación (2d6+2)', cost: 2, note: 'Restaura Resistencia' },
        { name: 'Curación Mayor (3d6+4)', cost: 3, note: 'Restaura Resistencia' },
        { name: 'Curación Completa', cost: 5, note: 'Restaura toda Resistencia' }
    ],
    'Propiedades de Arma': [
        { name: 'Alcance Extendido', cost: 2, note: '+3m alcance' },
        { name: 'Retorno Automático', cost: 2, note: 'Arma vuelve' },
        { name: 'Vampírica', cost: 4, note: 'Recupera Resistencia' },
        { name: 'Penetración de Armadura', cost: 3, note: 'Ignora 3 pts armadura' }
    ],
    'Propiedades de Armadura': [
        { name: 'Sin Penalización Sigilo', cost: 2, note: 'Elimina penalización' },
        { name: 'Resistencia a Tipo Daño', cost: 4, note: 'Mitad de daño' },
        { name: 'Inmunidad a Estado', cost: 3, note: 'Envenenado, Asustado, etc' },
        { name: 'Absorción', cost: 2, note: 'Ignora 1 pto daño' }
    ],
    'Movimiento y Sentidos': [
        { name: 'Pies Ligeros', cost: 2, note: 'Ignora terreno difícil' },
        { name: 'Vuelo Limitado', cost: 5, note: '18m, 1/día, 3 rondas' },
        { name: 'Visión en Oscuridad', cost: 2, note: 'Ver en oscuridad 15m' },
        { name: 'Sentidos Agudos', cost: 3, note: 'Ventaja en Percepción' }
    ],
    'Utilidad Social': [
        { name: 'Traductor Universal', cost: 3, note: 'Comprender idiomas' },
        { name: 'Presencia Intimidante', cost: 2, note: 'Ventaja intimidación' },
        { name: 'Encanto Sutil', cost: 2, note: 'Ventaja persuasión' },
        { name: 'Detección de Mentiras', cost: 3, note: 'Ventaja detectar engaños' }
    ]
};

const REQUIREMENTS = [
    { name: 'Sintonía', cost: -1, desc: 'Descanso largo para activar' },
    { name: 'Herencia Específica', cost: -2, desc: 'Solo una Herencia definida' },
    { name: 'Concepto Específico', cost: -2, desc: 'Requiere Concepto' },
    { name: 'Atributo Mínimo', cost: -1, desc: 'Valor mínimo requerido' },
    { name: 'Senda Específica', cost: -2, desc: 'Solo una Senda definida' },
    { name: 'Personalidad', cost: -2, desc: 'Solo una Naturaleza definida' }
];

const CURSES = [
    { name: 'Menor', cost: 2, desc: 'Desventaja situacional, -1 Atributo, vulnerabilidad menor' },
    { name: 'Mayor', cost: 4, desc: 'Penalización -2 Atributo, vulnerabilidad mayor, adicción' },
    { name: 'Severa', cost: 6, desc: 'Transformación gradual, precio de sangre, parasitismo' },
    { name: 'Legendaria', cost: 8, desc: 'Pérdida de humanidad, posesión, condena divina' }
];

const CONSUMABLE_TYPES = {
    'Poción': { formula: (ppp) => ppp * 50, action: 'Acción Rápida (beber)', icon: '🧪' },
    'Pergamino': { formula: (ppp) => ppp * 75, action: 'Acción Principal + Salvación', icon: '📜' },
    'Talismán': { formula: (ppp) => ppp * 60, action: 'Activación automática', icon: '✨' },
    'Aceite': { formula: (ppp) => ppp * 40, action: '1 minuto aplicar', icon: '🫙' }
};
