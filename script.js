// Metadestylacja: Interfejs Systemu - Główny Skrypt
document.addEventListener('DOMContentLoaded', function() {
    // Zarządzanie Stanem
    const state = {
        projectName: '',
        subjectDescription: '',
        selectedModules: [],
        selectedParameters: [],
        selectedTemplate: 'problem',
        customTemplate: '',
        sequence: [],
        currentTab: 'configuration',
        isMobile: window.innerWidth <= 576,
        sidebarVisible: false
    };

    // Dodatkowe elementy mobilne
    const mobileSidebarElements = {
        menuToggle: document.getElementById('menu-toggle'),
        closeSidebar: document.getElementById('close-sidebar'),
        sidebar: document.getElementById('sidebar'),
        sidebarOverlay: null
    };

    // Inicjalizacja mobilnych elementów
    if (state.isMobile) {
        // Tworzymy overlay dla tła, kiedy sidebar jest otwarty
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        mobileSidebarElements.sidebarOverlay = overlay;

        // Przypisujemy zdarzenia dla sidebar mobilnego
        mobileSidebarElements.menuToggle.addEventListener('click', toggleSidebar);
        mobileSidebarElements.closeSidebar.addEventListener('click', toggleSidebar);
        mobileSidebarElements.sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // Funkcja przełączająca widoczność sidebara na mobile
    function toggleSidebar() {
        state.sidebarVisible = !state.sidebarVisible;
        mobileSidebarElements.sidebar.classList.toggle('active', state.sidebarVisible);
        if (mobileSidebarElements.sidebarOverlay) {
            mobileSidebarElements.sidebarOverlay.classList.toggle('active', state.sidebarVisible);
        }
        
        // Blokujemy przewijanie body gdy sidebar jest otwarty
        document.body.style.overflow = state.sidebarVisible ? 'hidden' : '';
    }

    // Funkcja do zamykania sidebar po wykonaniu akcji (na mobile)
    function closeSidebarIfMobile() {
        if (state.isMobile && state.sidebarVisible) {
            toggleSidebar();
        }
    }

    // Aktualizacja stanu isMobile przy zmianie rozmiaru okna
    window.addEventListener('resize', function() {
        const wasMobile = state.isMobile;
        state.isMobile = window.innerWidth <= 576;
        
        // Jeśli zmienia się z desktop na mobile lub odwrotnie
        if (wasMobile !== state.isMobile) {
            // Resetuj stan sidebar jeśli przejście z mobile -> desktop
            if (!state.isMobile && state.sidebarVisible) {
                state.sidebarVisible = false;
                mobileSidebarElements.sidebar.classList.remove('active');
                if (mobileSidebarElements.sidebarOverlay) {
                    mobileSidebarElements.sidebarOverlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
            
            // Dostosuj wizualizację
            if (state.currentTab === 'visualization') {
                setTimeout(renderVisualization, 100); // Mały delay dla lepszego dostosowania
            }
        }
    });

    // Stałe dla zawartości szablonów
    const TEMPLATES = {
        problem: `## Wieloparametrowa destylacja problemu [PROBLEM_NAME]

### Identyfikacja parametrów destylacyjnych
Dla pogłębionego zrozumienia tego problemu, zastosuję następujące filtry destylacyjne:

[PARAMETERS_LIST]

### Proces destylacji wieloparametrowej

[DESTILLATION_FILTERS]

### Porównawcza analiza destylacji
[Zestawienie uzyskanych esencji i ich wzajemnych relacji]`,

        concept: `## Wieloparametrowa destylacja koncepcji [CONCEPT_NAME]

### Identyfikacja parametrów destylacyjnych
Dla pogłębionego zrozumienia istoty tej koncepcji, zastosuję następujące filtry:

[PARAMETERS_LIST]

### Proces destylacji wieloparametrowej

[DESTILLATION_FILTERS]

### Porównawcza analiza destylacji
[Zestawienie uzyskanych esencji i ich wzajemnych relacji]`,

        multi: `## Wielowymiarowa destylacja zjawiska [PHENOMENON_NAME]

### Identyfikacja wymiarów destylacyjnych
Dla holistycznego zrozumienia tego zjawiska, zastosuję następujące filtry:

[PARAMETERS_LIST]

### Proces destylacji wielowymiarowej

[DESTILLATION_FILTERS]

### Integracyjna analiza wymiarów
[Holistyczna integracja wglądów z różnych wymiarów]`,

        meta: `## Metadestylacja

### Wzorce konwergencji
Analizując powyższe destylacje, możemy zaobserwować następujące punkty zbieżności:

[CONVERGENCE_PATTERNS]

### Napięcia dialektyczne
Między destylacjami możemy zidentyfikować następujące produktywne napięcia:

[DIALECTICAL_TENSIONS]

### Meta-esencja
Integrując powyższe wglądy, możemy zaproponować następującą meta-esencję:

[META_ESSENCE]

### Metarefleksja epistemologiczna
Przeprowadzony proces destylacyjny podlega następującym ograniczeniom:

[LIMITATIONS]

Potencjalne kierunki dalszej eksploracji:
[FUTURE_DIRECTIONS]`
    };

    // Opisy parametrów
    const PARAMETER_DESCRIPTIONS = {
        pragmatic: {
            name: "Parametr pragmatyczny",
            description: "Analiza użyteczności, efektywności i transferowalności"
        },
        epistemic: {
            name: "Parametr epistemiczny",
            description: "Badanie pewności, falsyfikowalności i intersubiektywności"
        },
        ontological: {
            name: "Parametr ontologiczny",
            description: "Analiza fundamentalności, niezmienności i emergencji"
        },
        axiological: {
            name: "Parametr aksjologiczny",
            description: "Badanie etyczności, estetyczności i harmonijności"
        },
        relational: {
            name: "Parametr relacyjny",
            description: "Analiza kontekstualności, systemowości i współzależności"
        },
        'somatic-resonance': {
            name: "Parametr rezonansu somatycznego",
            description: "Badanie cielesnych wymiarów doświadczenia"
        },
        kinesthetic: {
            name: "Parametr inteligencji kinestetycznej",
            description: "Analiza poprzez ruch i fizyczne zaangażowanie"
        },
        sensory: {
            name: "Parametr dostrojenia sensorycznego",
            description: "Badanie bezpośredniego percepcyjnego zaangażowania"
        },
        meditative: {
            name: "Parametr świadomości meditatywnej",
            description: "Analiza z perspektywy wyciszonej świadomości"
        },
        'non-conceptual': {
            name: "Parametr świadomości nie-konceptualnej",
            description: "Badanie bezpośredniego doświadczenia przed konceptualizacją"
        },
        presence: {
            name: "Parametr obecności",
            description: "Analiza jakości zaangażowania uwagi"
        },
        dialogical: {
            name: "Parametr dialogiczny",
            description: "Badanie rezonansu w przestrzeni dialogicznej"
        },
        collective: {
            name: "Parametr inteligencji kolektywnej",
            description: "Analiza z perspektywy procesów grupowych"
        },
        field: {
            name: "Parametr pola współświadomości",
            description: "Badanie współdzielonej przestrzeni uwagi"
        }
    };

    // Informacje o modułach
    const MODULE_INFO = {
        "I.1": {
            name: "Fundament Epistemologiczny",
            description: "Określa filozoficzne podstawy i kluczowe założenia procesu destylacji.",
            related: ["I.2", "I.3"]
        },
        "I.2": {
            name: "Ontologia Parametrów Destylacyjnych",
            description: "Definiuje naturę i strukturę parametrów używanych w procesie destylacyjnym.",
            related: ["I.1", "II.1"]
        },
        "I.3": {
            name: "Architektura Procesu Metadestylacyjnego",
            description: "Określa strukturę i relacje między komponentami systemu metadestylacyjnego.",
            related: ["I.1", "II.1", "II.2"]
        },
        "II.1": {
            name: "Protokół Destylacji Pierwszego Rzędu",
            description: "Procedura systematycznej analizy zjawiska przez pryzmat wybranych parametrów.",
            related: ["I.2", "II.2", "II.3"]
        },
        "II.2": {
            name: "Protokół Metadestylacji",
            description: "Procedura integracji wglądów z destylacji pierwszego rzędu.",
            related: ["II.1", "II.3", "II.4"]
        },
        "II.3": {
            name: "Protokół Wypalarki Metadestylacyjnej",
            description: "Procedura analizy tego, co zostało odfiltrowane w procesie destylacji.",
            related: ["II.1", "II.2"]
        },
        "II.4": {
            name: "Protokół Aplikacji Praktycznej",
            description: "Procedura przekładu wglądów destylacyjnych na konkretne działania.",
            related: ["II.2"]
        },
        "VI.1": {
            name: "Destylacja Wielowymiarowa",
            description: "Integracja różnych sposobów poznania (konceptualnego, ucieleśnionego, kontemplacyjnego i intersubiektywnego).",
            related: ["I.1", "II.1"]
        },
        "VI.2": {
            name: "Meta-Ramowanie",
            description: "Świadomość i rekonfiguracja założeń epistemologicznych procesu destylacyjnego.",
            related: ["I.1", "VI.1", "VI.3"]
        },
        "VI.3": {
            name: "Integracja Transkonceptualna",
            description: "Przekraczanie dualizmu konceptualnego i łączenie różnych wymiarów poznania.",
            related: ["VI.1", "VI.2", "II.2"]
        }
    };

    // Elementy
    const elements = {
        // Zakładki
        tabs: document.querySelectorAll('.tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        
        // Przyciski modułów
        moduleButtons: document.querySelectorAll('.module-btn'),
        
        // Sekwencja
        sequenceContainer: document.getElementById('sequence-container'),
        clearSequenceBtn: document.getElementById('clear-sequence-btn'),
        visualizeBtn: document.getElementById('visualize-btn'),
        
        // Konfiguracja
        projectNameInput: document.getElementById('project-name'),
        subjectDescriptionInput: document.getElementById('subject-description'),
        parameterCheckboxes: document.querySelectorAll('.param-checkbox'),
        templateSelector: document.getElementById('template-selector'),
        customTemplateContainer: document.getElementById('custom-template-container'),
        customTemplateInput: document.getElementById('custom-template'),
        generateBtn: document.getElementById('generate-btn'),
        resetBtn: document.getElementById('reset-btn'),
        
        // Podgląd
        promptContent: document.getElementById('prompt-content'),
        copyPromptBtn: document.getElementById('copy-prompt-btn'),
        downloadPromptBtn: document.getElementById('download-prompt-btn'),
        formatSelector: document.getElementById('format-selector'),
        
        // Wizualizacja
        flowDiagram: document.getElementById('flow-diagram'),
        diagramGroup: document.getElementById('diagram-group'),
        zoomInBtn: document.getElementById('zoom-in-btn'),
        zoomOutBtn: document.getElementById('zoom-out-btn'),
        resetViewBtn: document.getElementById('reset-view-btn'),
        
        // Modal
        modalContainer: document.getElementById('modal-container'),
        modalTitle: document.getElementById('modal-title'),
        modalContent: document.getElementById('modal-content'),
        closeModalBtn: document.getElementById('close-modal-btn'),
        modalCancelBtn: document.getElementById('modal-cancel-btn'),
        modalConfirmBtn: document.getElementById('modal-confirm-btn'),
        
        // Przyciski nagłówka
        saveBtn: document.getElementById('save-btn'),
        loadBtn: document.getElementById('load-btn'),
        helpBtn: document.getElementById('help-btn')
    };

    // Inicjalizacja aplikacji
    function initialize() {
        bindEvents();
        applyStoredSettings();
        
        // Dostosuj UI na podstawie rozmiaru ekranu podczas inicjalizacji
        if (state.isMobile) {
            mobileSidebarElements.sidebar.classList.add('sidebar-mobile');
        }
    }

    // Wiązanie zdarzeń
    function bindEvents() {
        // Przełączanie zakładek
        elements.tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                switchTab(this.dataset.tab);
            });
        });
        
        // Przyciski modułów
        elements.moduleButtons.forEach(button => {
            button.addEventListener('click', function() {
                toggleModuleInfo(this.dataset.module);
            });
        });
        
        // Zarządzanie sekwencją
        elements.clearSequenceBtn.addEventListener('click', clearSequence);
        elements.visualizeBtn.addEventListener('click', () => {
            switchTab('visualization');
            closeSidebarIfMobile();
        });
        
        // Zdarzenia konfiguracji
        elements.projectNameInput.addEventListener('input', e => state.projectName = e.target.value);
        elements.subjectDescriptionInput.addEventListener('input', e => state.subjectDescription = e.target.value);
        
        elements.parameterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectedParameters);
        });
        
        elements.templateSelector.addEventListener('change', function() {
            state.selectedTemplate = this.value;
            if (this.value === 'custom') {
                elements.customTemplateContainer.classList.remove('hidden');
            } else {
                elements.customTemplateContainer.classList.add('hidden');
            }
        });
        
        elements.customTemplateInput.addEventListener('input', e => state.customTemplate = e.target.value);
        elements.generateBtn.addEventListener('click', generatePrompt);
        elements.resetBtn.addEventListener('click', resetForm);
        
        // Zdarzenia podglądu
        elements.copyPromptBtn.addEventListener('click', copyPromptToClipboard);
        elements.downloadPromptBtn.addEventListener('click', downloadPrompt);
        elements.formatSelector.addEventListener('change', reformatPrompt);
        
        // Zdarzenia wizualizacji
        let scale = 1;
        let panX = 0;
        let panY = 0;
        let isDragging = false;
        let lastX, lastY;
        
        elements.zoomInBtn.addEventListener('click', () => {
            scale = Math.min(3, scale * 1.2); // Limit zoom
            updateTransform();
        });
        
        elements.zoomOutBtn.addEventListener('click', () => {
            scale = Math.max(0.3, scale / 1.2); // Limit zoom
            updateTransform();
        });
        
        elements.resetViewBtn.addEventListener('click', () => {
            scale = 1;
            panX = 0;
            panY = 0;
            updateTransform();
        });
        
        function updateTransform() {
            elements.diagramGroup.setAttribute('transform', `translate(${panX + 40}, ${panY + 40}) scale(${scale})`);
        }
        
        // Dodanie obsługi przesuwania wizualizacji (pan)
        const canvas = document.getElementById('visualization-canvas');
        
        // Obsługa myszy
        canvas.addEventListener('mousedown', function(e) {
            if (e.target.tagName === 'svg' || e.target.id === 'diagram-group') {
                isDragging = true;
                lastX = e.clientX;
                lastY = e.clientY;
                canvas.style.cursor = 'grabbing';
            }
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const dx = e.clientX - lastX;
                const dy = e.clientY - lastY;
                panX += dx;
                panY += dy;
                updateTransform();
                lastX = e.clientX;
                lastY = e.clientY;
            }
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
            canvas.style.cursor = 'default';
        });
        
        // Obsługa dotyku dla urządzeń mobilnych
        canvas.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'svg' || e.target.id === 'diagram-group') {
                isDragging = true;
                lastX = e.touches[0].clientX;
                lastY = e.touches[0].clientY;
            }
        }, { passive: true });
        
        canvas.addEventListener('touchmove', function(e) {
            if (isDragging) {
                const dx = e.touches[0].clientX - lastX;
                const dy = e.touches[0].clientY - lastY;
                panX += dx;
                panY += dy;
                updateTransform();
                lastX = e.touches[0].clientX;
                lastY = e.touches[0].clientY;
            }
        }, { passive: true });
        
        canvas.addEventListener('touchend', function() {
            isDragging = false;
        }, { passive: true });
        
        // Obsługa pinch-to-zoom dla mobilnych urządzeń
        let initialDistance = 0;
        let initialScale = 1;
        
        canvas.addEventListener('touchstart', function(e) {
            if (e.touches.length === 2) {
                initialDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                initialScale = scale;
                isDragging = false;
            }
        }, { passive: true });
        
        canvas.addEventListener('touchmove', function(e) {
            if (e.touches.length === 2) {
                const currentDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                
                const ratio = currentDistance / initialDistance;
                scale = Math.min(3, Math.max(0.3, initialScale * ratio));
                updateTransform();
            }
        }, { passive: true });
        
        // Zdarzenia modalu
        elements.closeModalBtn.addEventListener('click', closeModal);
        elements.modalCancelBtn.addEventListener('click', closeModal);
        
        // Zdarzenia przycisków nagłówka
        elements.saveBtn.addEventListener('click', saveConfiguration);
        elements.loadBtn.addEventListener('click', loadConfiguration);
        elements.helpBtn.addEventListener('click', showHelp);
    }

    // Przełączanie zakładek
    function switchTab(tabId) {
        state.currentTab = tabId;
        
        elements.tabs.forEach(tab => {
            if (tab.dataset.tab === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        elements.tabContents.forEach(content => {
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        if (tabId === 'visualization') {
            renderVisualization();
        }
    }

    // Pokazywanie informacji o module i dodawanie do sekwencji
    function toggleModuleInfo(moduleId) {
        const module = MODULE_INFO[moduleId];
        if (!module) return;
        
        elements.moduleButtons.forEach(btn => {
            if (btn.dataset.module === moduleId) {
                btn.classList.toggle('active');
                
                // Jeśli aktywowano, dodaj do sekwencji; jeśli deaktywowano, usuń z sekwencji
                if (btn.classList.contains('active')) {
                    addToSequence(moduleId);
                } else {
                    removeFromSequence(moduleId);
                }
            }
        });
        
        showModal(
            `Moduł ${moduleId}: ${module.name}`,
            `<p>${module.description}</p>
            <h3>Powiązane moduły:</h3>
            <ul>${module.related.map(id => `<li>${id}: ${MODULE_INFO[id]?.name || ''}</li>`).join('')}</ul>
            <div class="form-group">
                <label>Dodać do sekwencji?</label>
                <button id="add-to-sequence-btn" class="primary-btn" data-module="${moduleId}">Dodaj do Sekwencji</button>
            </div>`
        );
        
        document.getElementById('add-to-sequence-btn').addEventListener('click', function() {
            addToSequence(this.dataset.module);
            closeModal();
        });
    }

    // Dodawanie modułu do sekwencji
    function addToSequence(moduleId) {
        if (state.sequence.includes(moduleId)) return;
        
        state.sequence.push(moduleId);
        renderSequence();
    }

    // Usuwanie modułu z sekwencji
    function removeFromSequence(moduleId) {
        state.sequence = state.sequence.filter(id => id !== moduleId);
        renderSequence();
    }

    // Czyszczenie sekwencji
    function clearSequence() {
        state.sequence = [];
        elements.moduleButtons.forEach(btn => btn.classList.remove('active'));
        renderSequence();
    }

    // Renderowanie sekwencji w interfejsie
    function renderSequence() {
        elements.sequenceContainer.innerHTML = '';
        
        state.sequence.forEach((moduleId, index) => {
            const module = MODULE_INFO[moduleId];
            
            const item = document.createElement('div');
            item.className = 'sequence-item';
            
            const isMobile = window.innerWidth <= 576;
            if (isMobile) {
                // Na urządzeniach mobilnych etykieta i przyciski są w osobnych wierszach
                item.innerHTML = `
                    <span class="module-label">${moduleId}: ${module.name}</span>
                    <div class="item-controls">
                        <button class="move-up-btn" title="Przesuń w górę" ${index === 0 ? 'disabled' : ''}><i class="fas fa-arrow-up"></i></button>
                        <button class="move-down-btn" title="Przesuń w dół" ${index === state.sequence.length - 1 ? 'disabled' : ''}><i class="fas fa-arrow-down"></i></button>
                        <button class="remove-btn" title="Usuń"><i class="fas fa-times"></i></button>
                    </div>
                `;
            } else {
                // Na desktopie standardowy układ
                item.innerHTML = `
                    <span class="module-label">${moduleId}: ${module.name}</span>
                    <div class="item-controls">
                        <button class="move-up-btn" title="Przesuń w górę" ${index === 0 ? 'disabled' : ''}><i class="fas fa-arrow-up"></i></button>
                        <button class="move-down-btn" title="Przesuń w dół" ${index === state.sequence.length - 1 ? 'disabled' : ''}><i class="fas fa-arrow-down"></i></button>
                        <button class="remove-btn" title="Usuń"><i class="fas fa-times"></i></button>
                    </div>
                `;
            }
            
            elements.sequenceContainer.appendChild(item);
            
            // Dodaj łącznik, jeśli to nie ostatni element
            if (index < state.sequence.length - 1) {
                const connector = document.createElement('div');
                connector.className = 'sequence-connector';
                elements.sequenceContainer.appendChild(connector);
            }
            
            // Wiązanie zdarzeń dla przycisków kontrolnych elementu sekwencji
            item.querySelector('.move-up-btn').addEventListener('click', () => moveSequenceItem(index, -1));
            item.querySelector('.move-down-btn').addEventListener('click', () => moveSequenceItem(index, 1));
            item.querySelector('.remove-btn').addEventListener('click', () => {
                removeFromSequence(moduleId);
                
                // Również deaktywuj przycisk modułu
                elements.moduleButtons.forEach(btn => {
                    if (btn.dataset.module === moduleId) {
                        btn.classList.remove('active');
                    }
                });
            });
        });
    }

    // Przesuwanie elementu w sekwencji w górę lub w dół
    function moveSequenceItem(index, direction) {
        const newIndex = index + direction;
        
        if (newIndex < 0 || newIndex >= state.sequence.length) return;
        
        const temp = state.sequence[index];
        state.sequence[index] = state.sequence[newIndex];
        state.sequence[newIndex] = temp;
        
        renderSequence();
    }

    // Aktualizacja wybranych parametrów na podstawie stanu checkboxów
    function updateSelectedParameters() {
        state.selectedParameters = [];
        
        elements.parameterCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                state.selectedParameters.push(checkbox.dataset.param);
            }
        });
    }

    // Generowanie promptu na podstawie aktualnej konfiguracji
    function generatePrompt() {
        if (!validateForm()) return;
        
        let promptTemplate = '';
        
        if (state.selectedTemplate === 'custom' && state.customTemplate) {
            promptTemplate = state.customTemplate;
        } else {
            promptTemplate = TEMPLATES[state.selectedTemplate] || TEMPLATES.problem;
        }
        
        // Zastąp placeholdery
        let prompt = promptTemplate
            .replace('[PROBLEM_NAME]', state.projectName)
            .replace('[CONCEPT_NAME]', state.projectName)
            .replace('[PHENOMENON_NAME]', state.projectName);
        
        // Wygeneruj listę parametrów
        const parametersList = state.selectedParameters.map((param, index) => {
            const paramInfo = PARAMETER_DESCRIPTIONS[param];
            return `${index + 1}. **${paramInfo.name}**: ${paramInfo.description}`;
        }).join('\n');
        
        prompt = prompt.replace('[PARAMETERS_LIST]', parametersList);
        
        // Wygeneruj filtry destylacyjne
        const filters = state.selectedParameters.map(param => {
            const paramInfo = PARAMETER_DESCRIPTIONS[param];
            const filterKey = getParameterType(param);
            
            return `[FILTR${filterKey === 'standard' ? '' : ` ${filterKey.toUpperCase()}`}: ${paramInfo.name}]
**Założenia perspektywy**:
- [Explicytne przedrozumienia]
- [Przyjęta definicja operacyjna]
- [Specyficzne punkty orientacyjne]

**Proces destylacji**:
[Systematyczna analiza zjawiska przez pryzmat parametru ${paramInfo.name}]

**Zdestylowana esencja**:
[Skoncentrowany ekstrakt istotności z perspektywy parametru ${paramInfo.name}]

**Granice destylacji**:
- [Potencjalne punkty ślepe]
- [Aspekty wymykające się tej perspektywie]
- [Pytania otwarte]`;
        }).join('\n\n');
        
        prompt = prompt.replace('[DESTILLATION_FILTERS]', filters);
        
        // Dla szablonu metadestylacji
        if (state.selectedTemplate === 'meta') {
            prompt = prompt
                .replace('[CONVERGENCE_PATTERNS]', `1. **[Wzorzec konwergencji A]**:
   - Pojawia się w perspektywach: [lista parametrów]
   - Manifestuje się jako: [opis manifestacji]
   - Implikuje: [implikacje]

2. **[Wzorzec konwergencji B]**:
   - Pojawia się w perspektywach: [lista parametrów]
   - Manifestuje się jako: [opis manifestacji]
   - Implikuje: [implikacje]`)
                .replace('[DIALECTICAL_TENSIONS]', `1. **[Napięcie dialektyczne A]**:
   - Między perspektywami: [parametr X] i [parametr Y]
   - Natura napięcia: [opis]
   - Potencjał integracyjny: [opis]

2. **[Napięcie dialektyczne B]**:
   - Między perspektywami: [parametr X] i [parametr Y]
   - Natura napięcia: [opis]
   - Potencjał integracyjny: [opis]`)
                .replace('[META_ESSENCE]', `[Synteza integrująca wglądy z różnych perspektyw]`)
                .replace('[LIMITATIONS]', `1. **[Ograniczenie A]**: [opis]
2. **[Ograniczenie B]**: [opis]
3. **[Ograniczenie C]**: [opis]`)
                .replace('[FUTURE_DIRECTIONS]', `- [Kierunek A]
- [Kierunek B]
- [Kierunek C]`);
        }
        
        // Dodaj informacje o sekwencji, jeśli dostępne
        if (state.sequence.length > 0) {
            const sequenceInfo = `## Sekwencja modułów procesu destylacyjnego

Dla tego procesu destylacyjnego zastosowano następującą sekwencję modułów:

${state.sequence.map((moduleId, index) => {
    const module = MODULE_INFO[moduleId];
    return `${index + 1}. **${moduleId}: ${module.name}** - ${module.description}`;
}).join('\n')}

`;
            prompt = sequenceInfo + prompt;
        }
        
        // Dodaj nagłówek z informacjami o projekcie
        const header = `# Projekt Destylacyjny: ${state.projectName}

## Opis przedmiotu destylacji

${state.subjectDescription}

---

`;
        
        prompt = header + prompt;
        
        // Wyświetl prompt
        elements.promptContent.textContent = prompt;
        
        // Przełącz na zakładkę podglądu
        switchTab('preview');
        
        // Zamknij sidebar na mobile po wygenerowaniu promptu
        closeSidebarIfMobile();
    }

    // Określ typ parametru (standard, ucieleśniony, kontemplacyjny, kolektywny)
    function getParameterType(param) {
        if (['somatic-resonance', 'kinesthetic', 'sensory'].includes(param)) {
            return 'UCIELEŚNIONY';
        } else if (['meditative', 'non-conceptual', 'presence'].includes(param)) {
            return 'KONTEMPLACYJNY';
        } else if (['dialogical', 'collective', 'field'].includes(param)) {
            return 'KOLEKTYWNY';
        }
        return 'standard';
    }

    // Sprawdź poprawność formularza przed wygenerowaniem promptu
    function validateForm() {
        if (!state.projectName) {
            showAlert('Proszę podać nazwę projektu.');
            return false;
        }
        
        if (!state.subjectDescription) {
            showAlert('Proszę podać opis przedmiotu destylacji.');
            return false;
        }
        
        if (state.selectedParameters.length === 0) {
            showAlert('Proszę wybrać co najmniej jeden parametr destylacyjny.');
            return false;
        }
        
        if (state.selectedTemplate === 'custom' && !state.customTemplate) {
            showAlert('Proszę podać własny szablon lub wybrać jeden z predefiniowanych.');
            return false;
        }
        
        return true;
    }

    // Resetuj formularz do wartości domyślnych
    function resetForm() {
        state.projectName = '';
        state.subjectDescription = '';
        state.selectedParameters = [];
        state.selectedTemplate = 'problem';
        state.customTemplate = '';
        
        elements.projectNameInput.value = '';
        elements.subjectDescriptionInput.value = '';
        elements.parameterCheckboxes.forEach(checkbox => checkbox.checked = false);
        elements.templateSelector.value = 'problem';
        elements.customTemplateContainer.classList.add('hidden');
        elements.customTemplateInput.value = '';
        
        clearSequence();
    }

    // Kopiuj prompt do schowka
    function copyPromptToClipboard() {
        const promptText = elements.promptContent.textContent;
        
        navigator.clipboard.writeText(promptText)
            .then(() => {
                showAlert('Prompt skopiowany do schowka!', 'success');
            })
            .catch(err => {
                console.error('Nie udało się skopiować: ', err);
                showAlert('Nie udało się skopiować do schowka. Proszę spróbować ręcznie zaznaczyć i skopiować tekst.');
            });
    }

    // Pobierz prompt jako plik tekstowy
    function downloadPrompt() {
        const promptText = elements.promptContent.textContent;
        const filename = `${state.projectName.replace(/[^a-z0-9ąćęłńóśźż]/gi, '_').toLowerCase()}_prompt.txt`;
        
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(promptText));
        element.setAttribute('download', filename);
        
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
        
        document.body.removeChild(element);
    }

    // Zreformatuj prompt na podstawie wybranego formatu
    function reformatPrompt() {
        const format = elements.formatSelector.value;
        const originalPrompt = elements.promptContent.textContent;
        
        let formattedPrompt = originalPrompt;
        
        switch (format) {
            case 'compact':
                // Usuń puste linie i zredukuj poziomy nagłówków
                formattedPrompt = originalPrompt
                    .replace(/\n\n+/g, '\n\n')
                    .replace(/^# /gm, '## ')
                    .replace(/^## /gm, '### ')
                    .replace(/^### /gm, '#### ');
                break;
                
            case 'modular':
                // Dodaj dzielniki sekcji
                formattedPrompt = originalPrompt
                    .replace(/^## /gm, '\n\n---\n\n## ')
                    .replace(/\[FILTR/g, '\n\n[FILTR');
                break;
                
            default: // 'full'
                // Nie rób nic, zachowaj oryginalny format
                break;
        }
        
        elements.promptContent.textContent = formattedPrompt;
    }

    // Renderuj wizualizację procesu
    function renderVisualization() {
        const svg = elements.flowDiagram;
        const group = elements.diagramGroup;
        
        // Wyczyść poprzednią zawartość
        group.innerHTML = '';
        
        // Ustaw wymiary SVG - responsywne w oparciu o container
        const container = document.getElementById('visualization-canvas');
        const containerWidth = container.clientWidth;
        const containerHeight = Math.max(300, container.clientHeight);
        
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', containerHeight);
        
        // Dostosuj układ wizualizacji w zależności od rozmiaru ekranu
        const isMobile = window.innerWidth <= 576;
        
        // Oblicz pozycje węzłów na podstawie sekwencji
        const nodeRadius = isMobile ? 30 : 40;
        const horizontalSpacing = isMobile ? 100 : 150;
        const verticalSpacing = isMobile ? 100 : 120;
        
        // Utwórz węzły dla modułów w sekwencji
        if (state.sequence.length === 0) {
            // Jeśli sekwencja nie jest zdefiniowana, pokaż komunikat
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.textContent = 'Brak modułów w sekwencji. Dodaj moduły, aby wizualizować przepływ procesu.';
            text.setAttribute('x', containerWidth / 2 - 150);
            text.setAttribute('y', containerHeight / 2);
            text.setAttribute('fill', '#999');
            text.setAttribute('text-anchor', 'middle');
            if (isMobile) {
                text.setAttribute('font-size', '12px');
            }
            group.appendChild(text);
            return;
        }
        
        // Utwórz węzły i połączenia
        const nodes = [];
        
        // Określ układ węzłów - liniowy dla mobile, gridowy dla desktop
        state.sequence.forEach((moduleId, index) => {
            let x, y;
            
            if (isMobile) {
                // Na mobile układ liniowy pionowy
                x = containerWidth / 2;
                y = (index + 1) * verticalSpacing;
            } else {
                // Na desktop układ gridowy
                const row = Math.floor(index / 4);
                const col = index % 4;
                
                x = col * horizontalSpacing + nodeRadius * 2;
                y = row * verticalSpacing + nodeRadius * 2;
            }
            
            // Utwórz koło dla modułu
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', nodeRadius);
            circle.setAttribute('class', 'module-node');
            group.appendChild(circle);
            
            // Utwórz tekst dla ID modułu
            const text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text1.textContent = moduleId;
            text1.setAttribute('x', x);
            text1.setAttribute('y', y - 5);
            text1.setAttribute('class', 'module-text');
            text1.setAttribute('font-weight', 'bold');
            if (isMobile) {
                text1.setAttribute('font-size', '10px');
            }
            group.appendChild(text1);
            
            // Utwórz tekst dla nazwy modułu (skróconej, jeśli potrzeba)
            const moduleName = MODULE_INFO[moduleId].name;
            const shortName = isMobile 
                ? moduleName.length > 12 ? moduleName.substr(0, 9) + '...' : moduleName
                : moduleName.length > 15 ? moduleName.substr(0, 12) + '...' : moduleName;
            
            const text2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text2.textContent = shortName;
            text2.setAttribute('x', x);
            text2.setAttribute('y', y + 15);
            text2.setAttribute('class', 'module-text');
            text2.setAttribute('font-size', isMobile ? '8px' : '10px');
            group.appendChild(text2);
            
            // Zapisz informacje o węźle dla połączeń
            nodes.push({ id: moduleId, x, y });
        });
        
        // Utwórz połączenia między węzłami
        for (let i = 0; i < nodes.length - 1; i++) {
            const start = nodes[i];
            const end = nodes[i + 1];
            
            // Oblicz punkty ścieżki
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Znormalizuj wektor kierunku
            const nx = dx / distance;
            const ny = dy / distance;
            
            // Oblicz punkty początkowe i końcowe (na krawędziach kół)
            const startX = start.x + nodeRadius * nx;
            const startY = start.y + nodeRadius * ny;
            const endX = end.x - nodeRadius * nx;
            const endY = end.y - nodeRadius * ny;
            
            // Utwórz ścieżkę
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M${startX},${startY} L${endX},${endY}`);
            path.setAttribute('class', 'flow-path');
            group.appendChild(path);
            
            // Dodaj strzałkę na końcu ścieżki
            const arrowSize = isMobile ? 4 : 6;
            const arrowX = endX - arrowSize * nx;
            const arrowY = endY - arrowSize * ny;
            
            const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            arrow.setAttribute('points', `${endX},${endY} ${arrowX + arrowSize * ny},${arrowY - arrowSize * nx} ${arrowX - arrowSize * ny},${arrowY + arrowSize * nx}`);
            arrow.setAttribute('class', 'flow-arrow');
            group.appendChild(arrow);
        }
    }

    // Pokaż dialog modalny
    function showModal(title, content) {
        elements.modalTitle.textContent = title;
        elements.modalContent.innerHTML = content;
        elements.modalContainer.classList.remove('hidden');
    }

    // Zamknij dialog modalny
    function closeModal() {
        elements.modalContainer.classList.add('hidden');
    }

    // Pokaż komunikat alertu
    function showAlert(message, type = 'error') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        // Stylizuj alert
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.left = '50%';
        alertDiv.style.transform = 'translateX(-50%)';
        alertDiv.style.padding = '10px 20px';
        alertDiv.style.borderRadius = '4px';
        alertDiv.style.zIndex = '2000';
        alertDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        alertDiv.style.maxWidth = '90%';
        alertDiv.style.textAlign = 'center';
        
        if (type === 'error') {
            alertDiv.style.backgroundColor = '#f8d7da';
            alertDiv.style.color = '#721c24';
            alertDiv.style.border = '1px solid #f5c6cb';
        } else {
            alertDiv.style.backgroundColor = '#d4edda';
            alertDiv.style.color = '#155724';
            alertDiv.style.border = '1px solid #c3e6cb';
        }
        
        document.body.appendChild(alertDiv);
        
        // Usuń po 3 sekundach
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            alertDiv.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.removeChild(alertDiv);
            }, 500);
        }, 3000);
    }

    // Zapisz aktualną konfigurację do localStorage
    function saveConfiguration() {
        // Utwórz obiekt konfiguracji
        const config = {
            projectName: state.projectName,
            subjectDescription: state.subjectDescription,
            selectedParameters: state.selectedParameters,
            selectedTemplate: state.selectedTemplate,
            customTemplate: state.customTemplate,
            sequence: state.sequence,
            timestamp: new Date().toISOString()
        };
        
        // Pobierz istniejące konfiguracje
        let savedConfigs = localStorage.getItem('metadestylacjaConfigs');
        savedConfigs = savedConfigs ? JSON.parse(savedConfigs) : [];
        
        // Dodaj aktualną konfigurację
        savedConfigs.push(config);
        
        // Zapisz do localStorage
        localStorage.setItem('metadestylacjaConfigs', JSON.stringify(savedConfigs));
        
        showAlert('Konfiguracja zapisana pomyślnie!', 'success');
    }

    // Wczytaj konfigurację z localStorage
    function loadConfiguration() {
        let savedConfigs = localStorage.getItem('metadestylacjaConfigs');
        
        if (!savedConfigs) {
            showAlert('Nie znaleziono zapisanych konfiguracji.');
            return;
        }
        
        savedConfigs = JSON.parse(savedConfigs);
        
        if (savedConfigs.length === 0) {
            showAlert('Nie znaleziono zapisanych konfiguracji.');
            return;
        }
        
        // Utwórz listę zapisanych konfiguracji
        const configListHtml = savedConfigs.map((config, index) => {
            const date = new Date(config.timestamp).toLocaleString();
            const isMobile = window.innerWidth <= 576;
            
            if (isMobile) {
                return `
                    <div class="saved-config-item" data-index="${index}">
                        <div class="config-info">
                            <h3>${config.projectName || 'Projekt bez nazwy'}</h3>
                            <p><small>Zapisano: ${date}</small></p>
                            <p><small>Parametry: ${config.selectedParameters.length}, Moduły: ${config.sequence.length}</small></p>
                        </div>
                        <button class="load-config-btn primary-btn" data-index="${index}">Wczytaj</button>
                    </div>
                `;
            } else {
                return `
                    <div class="saved-config-item" data-index="${index}">
                        <div class="config-info">
                            <h3>${config.projectName || 'Projekt bez nazwy'}</h3>
                            <p><small>Zapisano: ${date}</small></p>
                            <p><small>Parametry: ${config.selectedParameters.length}, Moduły: ${config.sequence.length}</small></p>
                        </div>
                        <button class="load-config-btn primary-btn" data-index="${index}">Wczytaj</button>
                    </div>
                `;
            }
        }).join('');
        
        showModal(
            'Wczytaj Konfigurację',
            `<div class="saved-configs-list">
                ${configListHtml}
            </div>
            <p><small>Uwaga: Wczytanie konfiguracji zastąpi Twoją bieżącą pracę.</small></p>`
        );
        
        // Przypisz zdarzenia do przycisków wczytywania
        document.querySelectorAll('.load-config-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                applyConfiguration(savedConfigs[index]);
                closeModal();
                
                // Zamknij sidebar na mobile po wczytaniu konfiguracji
                closeSidebarIfMobile();
            });
        });
    }

    // Zastosuj wczytaną konfigurację
    function applyConfiguration(config) {
        // Zresetuj aktualny stan
        resetForm();
        
        // Zastosuj wczytaną konfigurację
        state.projectName = config.projectName || '';
        state.subjectDescription = config.subjectDescription || '';
        state.selectedParameters = config.selectedParameters || [];
        state.selectedTemplate = config.selectedTemplate || 'problem';
        state.customTemplate = config.customTemplate || '';
        state.sequence = config.sequence || [];
        
        // Zaktualizuj interfejs
        elements.projectNameInput.value = state.projectName;
        elements.subjectDescriptionInput.value = state.subjectDescription;
        
        elements.parameterCheckboxes.forEach(checkbox => {
            checkbox.checked = state.selectedParameters.includes(checkbox.dataset.param);
        });
        
        elements.templateSelector.value = state.selectedTemplate;
        
        if (state.selectedTemplate === 'custom') {
            elements.customTemplateContainer.classList.remove('hidden');
            elements.customTemplateInput.value = state.customTemplate;
        }
        
        // Zaktualizuj przyciski modułów
        elements.moduleButtons.forEach(btn => {
            btn.classList.remove('active');
            if (state.sequence.includes(btn.dataset.module)) {
                btn.classList.add('active');
            }
        });
        
        renderSequence();
        
        showAlert('Konfiguracja wczytana pomyślnie!', 'success');
    }

    // Zastosuj zapisane ustawienia z localStorage
    function applyStoredSettings() {
        // Tutaj można zaimplementować automatyczne wczytywanie ostatnio używanej konfiguracji
    }

    // Pokaż informacje pomocy
    function showHelp() {
        // Dostosuj treść pomocy w zależności od tego, czy jesteśmy na urządzeniu mobilnym
        const isMobile = window.innerWidth <= 576;
        let mobileTips = '';
        
        if (isMobile) {
            mobileTips = `
                <h3>Wskazówki dla urządzeń mobilnych</h3>
                <ul>
                    <li>Dotknij ikony menu w prawym górnym rogu, aby otworzyć panel nawigacyjny z modułami</li>
                    <li>W trybie wizualizacji możesz używać gestów dotykowych do przesuwania (przeciągnij) i powiększania (zsunięcie/rozsunięcie dwóch palców)</li>
                    <li>Obracaj urządzenie do pozycji poziomej dla wygodniejszej pracy z większymi elementami</li>
                </ul>
            `;
        }
        
        showModal(
            'Pomoc Metadestylacja',
            `<div class="help-content">
                <h3>Pierwsze kroki</h3>
                <p>Witaj w interfejsie Systemu Metadestylacyjnego! To narzędzie pomaga tworzyć ustrukturyzowane prompty bazujące na metodologii Systemu Metadestylacyjnego.</p>
                
                <h3>Podstawowy przepływ pracy</h3>
                <ol>
                    <li>Wprowadź nazwę projektu i opis przedmiotu destylacji</li>
                    <li>Wybierz moduły z panelu bocznego, aby zbudować swoją sekwencję destylacyjną</li>
                    <li>Wybierz parametry destylacyjne, które są istotne dla Twojego tematu</li>
                    <li>Wybierz szablon dla swojego promptu</li>
                    <li>Wygeneruj prompt i przejrzyj go w zakładce Podgląd</li>
                    <li>Skopiuj lub pobierz prompt do wykorzystania z modelami językowymi</li>
                </ol>
                
                <h3>Kluczowe funkcje</h3>
                <ul>
                    <li><strong>Nawigator Modułów:</strong> Przeglądaj i wybieraj moduły do włączenia w proces destylacyjny</li>
                    <li><strong>Sekwencja Procesu:</strong> Buduj i wizualizuj sekwencję modułów, których będziesz używać</li>
                    <li><strong>Wybór Parametrów:</strong> Wybieraj odpowiednie parametry dla swojej destylacji</li>
                    <li><strong>Wybór Szablonu:</strong> Wybieraj z predefiniowanych szablonów lub twórz własne</li>
                    <li><strong>Wizualizacja:</strong> Zobacz wizualną reprezentację przepływu procesu</li>
                    <li><strong>Zapisz/Wczytaj:</strong> Zapisuj swoje konfiguracje do przyszłego użytku</li>
                </ul>
                
                ${mobileTips}
                
                <h3>O Systemie Metadestylacyjnym</h3>
                <p>System Metadestylacyjny to modularna struktura do głębokiej analizy i zrozumienia złożonych zjawisk przez wiele perspektyw. Łączy on rygor analityczny z ucieleśnionymi, kontemplacyjnymi i intersubiektywnymi wymiarami wiedzy.</p>
            </div>`
        );
        
        // Dostosuj przyciski modalu dla pomocy
        elements.modalCancelBtn.textContent = 'Zamknij';
        elements.modalConfirmBtn.style.display = 'none';
        
        // Dodaj zdarzenie do zamknięcia przy przycisku anuluj
        elements.modalCancelBtn.addEventListener('click', closeModal);
    }

    // Inicjalizuj aplikację
    initialize();
});
