const { useState } = React;

const ItemCreator = () => {
    const [activeTab, setActiveTab] = useState('objects');
    const [item, setItem] = useState({ 
        name: '', 
        rarity: 'Raro', 
        properties: [], 
        requirements: [], 
        curses: [] 
    });
    const [consumable, setConsumable] = useState({ 
        name: '', 
        type: 'Poción', 
        properties: [], 
        requirements: [],
        curses: [],
        quantity: 1 
    });
    const [selectedCategory, setSelectedCategory] = useState('');

    const calculatePPP = (data) => {
        const propsCost = data.properties.reduce((sum, p) => sum + p.cost, 0);
        const reqsCost = data.requirements.reduce((sum, r) => sum + r.cost, 0);
        const cursesCost = data.curses.reduce((sum, c) => sum + c.cost, 0);
        return propsCost + reqsCost + cursesCost;
    };

    const itemPPP = calculatePPP(item);
    const consumablePPP = calculatePPP(consumable);

    const addProperty = (prop, isConsumable = false) => {
        const setter = isConsumable ? setConsumable : setItem;
        setter(prev => ({
            ...prev,
            properties: [...prev.properties, { ...prop, id: Date.now() }]
        }));
    };

    const removeProperty = (id, isConsumable = false) => {
        const setter = isConsumable ? setConsumable : setItem;
        setter(prev => ({
            ...prev,
            properties: prev.properties.filter(p => p.id !== id)
        }));
    };

    const addRequirement = (req, isConsumable = false) => {
        const data = isConsumable ? consumable : item;
        const setter = isConsumable ? setConsumable : setItem;
        
        if (data.requirements.length >= 3) {
            alert('Máximo 3 requisitos permitidos');
            return;
        }
        
        setter(prev => ({
            ...prev,
            requirements: [...prev.requirements, { ...req, id: Date.now() }]
        }));
    };

    const removeRequirement = (id, isConsumable = false) => {
        const setter = isConsumable ? setConsumable : setItem;
        setter(prev => ({
            ...prev,
            requirements: prev.requirements.filter(r => r.id !== id)
        }));
    };

    const addCurse = (curse, isConsumable = false) => {
        const data = isConsumable ? consumable : item;
        const setter = isConsumable ? setConsumable : setItem;
        
        if (data.curses.length >= 2) {
            alert('Máximo 2 maldiciones permitidas');
            return;
        }
        
        setter(prev => ({
            ...prev,
            curses: [...prev.curses, { ...curse, id: Date.now(), details: '' }]
        }));
    };

    const removeCurse = (id, isConsumable = false) => {
        const setter = isConsumable ? setConsumable : setItem;
        setter(prev => ({
            ...prev,
            curses: prev.curses.filter(c => c.id !== id)
        }));
    };

    const updateCurseDetails = (id, details, isConsumable = false) => {
        const setter = isConsumable ? setConsumable : setItem;
        setter(prev => ({
            ...prev,
            curses: prev.curses.map(c => c.id === id ? { ...c, details } : c)
        }));
    };

    const getRarityFromPPP = (ppp) => {
        for (const [rarity, range] of Object.entries(RARITIES)) {
            if (ppp >= range.min && ppp <= range.max) return rarity;
        }
        return 'Fuera de rango';
    };

    const exportData = (isConsumable = false) => {
        if (isConsumable) {
            const typeData = CONSUMABLE_TYPES[consumable.type];
            const unitPrice = typeData.formula(consumablePPP);
            const text = `${consumable.type}: ${consumable.name}
Rareza Equivalente: ${getRarityFromPPP(consumablePPP)} (${consumablePPP} PPP)

EFECTOS:
${consumable.properties.map(p => `• ${p.name} - ${p.note}`).join('\n')}

${consumable.requirements.length > 0 ? `REQUISITOS:\n${consumable.requirements.map(r => `• ${r.name} (${r.cost} PPP) - ${r.desc}`).join('\n')}\n` : ''}
${consumable.curses.length > 0 ? `MALDICIONES:\n${consumable.curses.map(c => `• Maldición ${c.name} (+${c.cost} PPP) - ${c.details || c.desc}`).join('\n')}\n` : ''}

Uso: ${typeData.action}

COSTE:
PPP Base: ${consumablePPP}
Precio Unitario: ${unitPrice} L
Cantidad: ${consumable.quantity}
Precio Total: ${unitPrice * consumable.quantity} L`;
            
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${consumable.name || 'consumible'}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            const text = `${item.name}
Rareza: ${item.rarity} (${itemPPP} PPP)
Presupuesto: ${RARITIES[item.rarity].min}-${RARITIES[item.rarity].max} PPP
Precio Aproximado: ${RARITIES[item.rarity].price}

PROPIEDADES:
${item.properties.map(p => `• ${p.name} (${p.cost} PPP) - ${p.note}`).join('\n')}

${item.requirements.length > 0 ? `REQUISITOS:\n${item.requirements.map(r => `• ${r.name} (${r.cost} PPP) - ${r.desc}`).join('\n')}\n` : ''}
${item.curses.length > 0 ? `MALDICIONES:\n${item.curses.map(c => `• Maldición ${c.name} (+${c.cost} PPP) - ${c.details || c.desc}`).join('\n')}\n` : ''}

Coste Total: ${itemPPP} PPP`;
            
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${item.name || 'objeto'}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
            <div className="max-w-6xl mx-auto">
                <header className="bg-gradient-to-r from-amber-800 to-orange-700 text-white p-6 rounded-lg shadow-xl mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <BookIcon />
                        <div>
                            <h1 className="text-3xl font-bold">Creador de Objetos PAPA</h1>
                            <p className="text-amber-100">Sistema de PPP con Requisitos y Maldiciones</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('objects')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'objects' ? 'bg-white text-amber-800' : 'bg-amber-700 text-white hover:bg-amber-600'}`}
                        >
                            📿 Permanentes
                        </button>
                        <button
                            onClick={() => setActiveTab('consumables')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'consumables' ? 'bg-white text-amber-800' : 'bg-amber-700 text-white hover:bg-amber-600'}`}
                        >
                            🧪 Consumibles
                        </button>
                    </div>
                </header>

                {activeTab === 'consumables' ? (
                    <ConsumablesTab
                        consumable={consumable}
                        setConsumable={setConsumable}
                        consumablePPP={consumablePPP}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        addProperty={addProperty}
                        removeProperty={removeProperty}
                        addRequirement={addRequirement}
                        removeRequirement={removeRequirement}
                        addCurse={addCurse}
                        removeCurse={removeCurse}
                        updateCurseDetails={updateCurseDetails}
                        getRarityFromPPP={getRarityFromPPP}
                        exportData={exportData}
                    />
                ) : (
                    <ObjectsTab
                        item={item}
                        setItem={setItem}
                        itemPPP={itemPPP}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        addProperty={addProperty}
                        removeProperty={removeProperty}
                        addRequirement={addRequirement}
                        removeRequirement={removeRequirement}
                        addCurse={addCurse}
                        removeCurse={removeCurse}
                        updateCurseDetails={updateCurseDetails}
                        exportData={exportData}
                    />
                )}
            </div>
        </div>
    );
};

// Componente de Consumibles
const ConsumablesTab = ({ 
    consumable, setConsumable, consumablePPP, selectedCategory, setSelectedCategory,
    addProperty, removeProperty, addRequirement, removeRequirement,
    addCurse, removeCurse, updateCurseDetails, getRarityFromPPP, exportData
}) => {
    const typeData = CONSUMABLE_TYPES[consumable.type];
    const unitPrice = typeData.formula(consumablePPP);
    const totalPrice = unitPrice * consumable.quantity;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                {/* Info Básica */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-amber-900 mb-4">Información</h2>
                    <input
                        type="text"
                        value={consumable.name}
                        onChange={(e) => setConsumable(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-md mb-3"
                        placeholder="Nombre"
                    />
                    <select
                        value={consumable.type}
                        onChange={(e) => setConsumable(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        {Object.entries(CONSUMABLE_TYPES).map(([type, data]) => (
                            <option key={type} value={type}>{data.icon} {type}</option>
                        ))}
                    </select>
                </div>

                {/* Propiedades */}
                <PropertySection
                    title="Efectos"
                    items={consumable.properties}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    onAdd={(prop) => addProperty(prop, true)}
                    onRemove={(id) => removeProperty(id, true)}
                    colorClass="purple"
                />

                {/* Requisitos */}
                <RequirementSection
                    items={consumable.requirements}
                    onAdd={(req) => addRequirement(req, true)}
                    onRemove={(id) => removeRequirement(id, true)}
                />

                {/* Maldiciones */}
                <CurseSection
                    items={consumable.curses}
                    onAdd={(curse) => addCurse(curse, true)}
                    onRemove={(id) => removeCurse(id, true)}
                    onUpdateDetails={(id, details) => updateCurseDetails(id, details, true)}
                />

                {/* Cantidad */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-amber-900 mb-4">Cantidad</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setConsumable(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-bold"
                        >-</button>
                        <input
                            type="number"
                            value={consumable.quantity}
                            onChange={(e) => setConsumable(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                            className="w-20 text-center text-2xl font-bold border rounded"
                        />
                        <button
                            onClick={() => setConsumable(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-bold"
                        >+</button>
                    </div>
                </div>
            </div>

            {/* Resumen */}
            <div>
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                    <h2 className="text-xl font-bold text-amber-900 mb-4">Resumen</h2>
                    <div className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600">Tipo</div>
                            <div className="text-xl font-bold">{typeData.icon} {consumable.type}</div>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600">Rareza</div>
                            <div className="text-lg font-bold">{getRarityFromPPP(consumablePPP)}</div>
                            <div className="text-xs text-gray-600">{consumablePPP} PPP</div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Propiedades:</span>
                                <span className="font-bold">
                                    {consumable.properties.reduce((s, p) => s + p.cost, 0)} PPP
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Requisitos:</span>
                                <span className="font-bold text-green-600">
                                    {consumable.requirements.reduce((s, r) => s + r.cost, 0)} PPP
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Maldiciones:</span>
                                <span className="font-bold text-purple-600">
                                    +{consumable.curses.reduce((s, c) => s + c.cost, 0)} PPP
                                </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                                <span>Precio Unit:</span>
                                <span className="font-bold">{unitPrice} L</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Cantidad:</span>
                                <span className="font-bold">×{consumable.quantity}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t-2">
                                <span className="font-bold">TOTAL:</span>
                                <span className="text-2xl font-bold text-amber-900">{totalPrice} L</span>
                            </div>
                        </div>
                        <button
                            onClick={() => exportData(true)}
                            disabled={!consumable.name}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <DownloadIcon />Exportar
                        </button>
                        <div className="bg-blue-50 p-3 rounded text-xs">
                            <div className="font-bold mb-1">📋 Fórmulas</div>
                            <div>Poción: PPP × 50 L</div>
                            <div>Pergamino: PPP × 75 L</div>
                            <div>Talismán: PPP × 60 L</div>
                            <div>Aceite: PPP × 40 L</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente de Objetos Permanentes
const ObjectsTab = ({ 
    item, setItem, itemPPP, selectedCategory, setSelectedCategory,
    addProperty, removeProperty, addRequirement, removeRequirement,
    addCurse, removeCurse, updateCurseDetails, exportData
}) => {
    const isValid = itemPPP >= RARITIES[item.rarity].min && itemPPP <= RARITIES[item.rarity].max;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                {/* Info Básica */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-amber-900 mb-4">Información</h2>
                    <input
                        type="text"
                        value={item.name}
                        onChange={(e) => setItem(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-md mb-3"
                        placeholder="Nombre"
                    />
                    <select
                        value={item.rarity}
                        onChange={(e) => setItem(prev => ({ ...prev, rarity: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        {Object.keys(RARITIES).map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                {/* Propiedades */}
                <PropertySection
                    title="Propiedades"
                    items={item.properties}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    onAdd={(prop) => addProperty(prop, false)}
                    onRemove={(id) => removeProperty(id, false)}
                    colorClass="amber"
                />

                {/* Requisitos */}
                <RequirementSection
                    items={item.requirements}
                    onAdd={(req) => addRequirement(req, false)}
                    onRemove={(id) => removeRequirement(id, false)}
                />

                {/* Maldiciones */}
                <CurseSection
                    items={item.curses}
                    onAdd={(curse) => addCurse(curse, false)}
                    onRemove={(id) => removeCurse(id, false)}
                    onUpdateDetails={(id, details) => updateCurseDetails(id, details, false)}
                />
            </div>

            {/* Resumen */}
            <div>
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                    <h2 className="text-xl font-bold text-amber-900 mb-4">Resumen</h2>
                    <div className="space-y-4">
                        <div className="bg-amber-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600">Presupuesto {item.rarity}</div>
                            <div className="text-2xl font-bold">
                                {RARITIES[item.rarity].min}-{RARITIES[item.rarity].max} PPP
                            </div>
                        </div>
                        <div className={`p-4 rounded-lg ${isValid ? 'bg-green-100' : 'bg-red-100'}`}>
                            <div className="text-sm text-gray-600">Coste Total</div>
                            <div className={`text-3xl font-bold ${isValid ? 'text-green-700' : 'text-red-700'}`}>
                                {itemPPP} PPP
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Propiedades:</span>
                                <span className="font-bold">{item.properties.reduce((s, p) => s + p.cost, 0)} PPP</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Requisitos:</span>
                                <span className="font-bold text-green-600">
                                    {item.requirements.reduce((s, r) => s + r.cost, 0)} PPP
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Maldiciones:</span>
                                <span className="font-bold text-purple-600">
                                    +{item.curses.reduce((s, c) => s + c.cost, 0)} PPP
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => exportData(false)}
                            disabled={!item.name}
                            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <DownloadIcon />Exportar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componentes reutilizables
const PropertySection = ({ title, items, selectedCategory, setSelectedCategory, onAdd, onRemove, colorClass }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-amber-900 mb-4">{title}</h2>
        <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-3"
        >
            <option value="">Seleccionar categoría</option>
            {Object.keys(PROPERTIES).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
            ))}
        </select>

        {selectedCategory && (
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto border rounded p-3">
                {PROPERTIES[selectedCategory].map((prop, idx) => (
                    <button
                        key={idx}
                        onClick={() => onAdd(prop)}
                        className="w-full text-left p-2 border rounded hover:bg-amber-50"
                    >
                        <div className="flex justify-between">
                            <div className="flex-1">
                                <div className="font-medium">{prop.name}</div>
                                <div className="text-xs text-gray-600">{prop.note}</div>
                            </div>
                            <span className={`bg-${colorClass}-600 text-white px-2 py-1 rounded text-sm font-bold ml-2`}>
                                {prop.cost} PPP
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        )}

        <div className="space-y-2">
            {items.map(prop => (
                <div key={prop.id} className={`flex justify-between items-center bg-${colorClass}-50 p-3 rounded`}>
                    <div className="flex-1">
                        <div className="font-medium">{prop.name}</div>
                        <div className="text-xs text-gray-600">{prop.note}</div>
                    </div>
                    <div className="flex gap-2">
                        <span className={`bg-${colorClass}-600 text-white px-2 py-1 rounded text-sm font-bold`}>
                            {prop.cost} PPP
                        </span>
                        <button onClick={() => onRemove(prop.id)} className="text-red-600">
                            <Trash2Icon />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const RequirementSection = ({ items, onAdd, onRemove }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-amber-900 mb-4">Requisitos (Reducen Coste)</h2>
        <p className="text-sm text-gray-600 mb-3">Máximo 3 requisitos</p>
        
        <div className="space-y-2 mb-4">
            {REQUIREMENTS.map((req, idx) => (
                <button
                    key={idx}
                    onClick={() => onAdd(req)}
                    className="w-full text-left p-2 border rounded hover:bg-green-50"
                >
                    <div className="flex justify-between">
                        <div className="flex-1">
                            <div className="font-medium">{req.name}</div>
                            <div className="text-xs text-gray-600">{req.desc}</div>
                        </div>
                        <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-bold ml-2">
                            {req.cost} PPP
                        </span>
                    </div>
                </button>
            ))}
        </div>

        <div className="space-y-2">
            {items.map(req => (
                <div key={req.id} className="flex justify-between items-center bg-green-50 p-3 rounded">
                    <div className="flex-1">
                        <div className="font-medium">{req.name}</div>
                        <div className="text-xs text-gray-600">{req.desc}</div>
                    </div>
                    <div className="flex gap-2">
                        <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
                            {req.cost} PPP
                        </span>
                        <button onClick={() => onRemove(req.id)} className="text-red-600">
                            <Trash2Icon />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const CurseSection = ({ items, onAdd, onRemove, onUpdateDetails }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-amber-900 mb-4">Maldiciones (Aumentan Poder)</h2>
        <p className="text-sm text-gray-600 mb-3">Máximo 2 maldiciones</p>
        
        <div className="space-y-2 mb-4">
            {CURSES.map((curse, idx) => (
                <button
                    key={idx}
                    onClick={() => onAdd(curse)}
                    className="w-full text-left p-2 border rounded hover:bg-purple-50"
                >
                    <div className="flex justify-between">
                        <div className="flex-1">
                            <div className="font-medium">Maldición {curse.name}</div>
                            <div className="text-xs text-gray-600">{curse.desc}</div>
                        </div>
                        <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm font-bold ml-2">
                            +{curse.cost} PPP
                        </span>
                    </div>
                </button>
            ))}
        </div>

        <div className="space-y-2">
            {items.map(curse => (
                <div key={curse.id} className="bg-purple-50 p-3 rounded">
                    <div className="flex justify-between mb-2">
                        <div className="font-medium">Maldición {curse.name}</div>
                        <div className="flex gap-2">
                            <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm font-bold">
                                +{curse.cost} PPP
                            </span>
                            <button onClick={() => onRemove(curse.id)} className="text-red-600">
                                <Trash2Icon />
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={curse.details}
                        onChange={(e) => onUpdateDetails(curse.id, e.target.value)}
                        placeholder="Describe los detalles específicos..."
                        className="w-full px-3 py-2 border rounded text-sm"
                        rows="2"
                    />
                </div>
            ))}
        </div>
    </div>
);

// Renderizar la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ItemCreator />);
```

---

## 📁 Estructura final:
```
tu-repositorio/
├── index.html    (estructura HTML básica)
├── data.js       (datos: propiedades, requisitos, maldiciones)
└── app.js        (lógica completa de la aplicación)
