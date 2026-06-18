// ==========================================
// Q-VAULT APPLICATION LOGIC
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // Check if questions database loaded
    if (typeof QUESTIONS_DATABASE === 'undefined') {
        console.error("QUESTIONS_DATABASE not loaded! Make sure data/questions_db.js exists.");
        return;
    }

    // --- State Variables ---
    let activeBranch = "main";
    let selectedQuestionId = null;
    let currentTab = "explorer";
    let showAnswerKey = false;
    let currentQuestions = [...QUESTIONS_DATABASE]; // Working database in memory

    // Mock Issues database
    let issues = [
        {
            id: 101,
            title: "Clarify rotational friction coefficient explanation",
            questionId: "JEE-2023-PHY-MEC-001",
            year: 2023,
            state: "open",
            branch: "fix/rotational-friction-option",
            desc: "The explanation for the friction coefficient minimum constraint requires clarification to note that it has been verified via rotational mechanics standard test cases. Currently it lacks this citation in standard build outputs.",
            diffFile: "questions/2023/physics/mechanics/hard_JEE-2023-PHY-MEC-001.json",
            diff: [
                { type: "normal", text: '  "correct_answer": "A",' },
                { type: "deletion", text: '  "explanation": "For rolling without slipping: $a = \\\\frac{g \\\\sin \\\\theta}{1 + I/(MR^2)}$. For a solid cylinder, $I = \\\\frac{1}{2} MR^2$, so $a = \\\\frac{2}{3} g \\\\sin \\\\theta$. The friction force is $f = M g \\\\sin \\\\theta - M a = \\\\frac{1}{3} M g \\\\sin \\\\theta$. Since $f \\\\le \\\\mu_s N = \\\\mu_s M g \\\\cos \\\\theta$, we have \\\\mu_s \\\\ge \\\\frac{1}{3} \\\\tan \\\\theta$.",' },
                { type: "addition", text: '  "explanation": "For rolling without slipping: $a = \\\\frac{g \\\\sin \\\\theta}{1 + I/(MR^2)}$. For a solid cylinder, $I = \\\\frac{1}{2} MR^2$, so $a = \\\\frac{2}{3} g \\\\sin \\\\theta$. The friction force is $f = M g \\\\sin \\\\theta - M a = \\\\frac{1}{3} M g \\\\sin \\\\theta$. Since $f \\\\le \\\\mu_s N = \\\\mu_s M g \\\\cos \\\\theta$, we have \\\\mu_s \\\\ge \\\\frac{1}{3} \\\\tan \\\\theta$. (Note: verified via rotational mechanics standard test cases).",' },
                { type: "normal", text: '  "marks": 4' }
            ],
            onMerge: () => {
                // Apply the fix in memory
                const q = currentQuestions.find(x => x.id === "JEE-2023-PHY-MEC-001");
                if (q) {
                    q.explanation = "For rolling without slipping: $a = \\frac{g \\sin \\theta}{1 + I/(MR^2)}$. For a solid cylinder, $I = \\frac{1}{2} MR^2$, so $a = \\frac{2}{3} g \\sin \\theta$. The friction force is $f = M g \\sin \\theta - M a = \\frac{1}{3} M g \\sin \\theta$. Since $f \\le \\mu_s N = \\mu_s M g \\cos \\theta$, we have $\\mu_s \\ge \\frac{1}{3} \\tan \\theta$. (Note: verified via rotational mechanics standard test cases).";
                }
            }
        },
        {
            id: 102,
            title: "Correction in Gravitation height-depth relation explanation",
            questionId: "JEE-2024-PHY-MEC-001",
            year: 2024,
            state: "open",
            branch: "fix/gravitation-depth-relation",
            desc: "In the explanation, the equating line has a minor typo writing 'h/R = d/R' instead of '2h/R = d/R' leading to the derivation. The conclusion is correct (d = 2h), but the intermediate step should show '2h/R'.",
            diffFile: "questions/2024/physics/mechanics/medium_JEE-2024-PHY-MEC-001.json",
            diff: [
                { type: "normal", text: '  "correct_answer": "A",' },
                { type: "deletion", text: '  "explanation": "At height $h \\\\ll R$, $g_h \\\\approx g(1 - \\\\frac{2h}{R})$. At depth $d$, $g_d = g(1 - \\\\frac{d}{R})$. Equating the two gives \\\\frac{h}{R} = \\\\frac{d}{R} \\\\implies d = 2h.",' },
                { type: "addition", text: '  "explanation": "At height $h \\\\ll R$, $g_h \\\\approx g(1 - \\\\frac{2h}{R})$. At depth $d$, $g_d = g(1 - \\\\frac{d}{R})$. Equating the two gives \\\\frac{2h}{R} = \\\\frac{d}{R} \\\\implies d = 2h.",' },
                { type: "normal", text: '  "marks": 4' }
            ],
            onMerge: () => {
                const q = currentQuestions.find(x => x.id === "JEE-2024-PHY-MEC-001");
                if (q) {
                    q.explanation = "At height $h \\ll R$, $g_h \\approx g(1 - \\frac{2h}{R})$. At depth $d$, $g_d = g(1 - \\frac{d}{R})$. Equating the two gives $\\frac{2h}{R} = \\frac{d}{R} \\implies d = 2h$.";
                }
            }
        },
        {
            id: 100,
            title: "Append weak-field clarification to coordination compounds topic",
            questionId: "JEE-2024-CHM-INO-001",
            year: 2024,
            state: "closed",
            branch: "feat/weak-field-coordination",
            desc: "The coordination compound description should explicitly specify the subtopic as Coordination Chemistry.",
            diffFile: "questions/2024/chemistry/inorganic_chemistry/medium_JEE-2024-CHM-INO-001.json",
            diff: [
                { type: "deletion", text: '  "subtopic": "Coordination Compounds",' },
                { type: "addition", text: '  "subtopic": "Coordination Chemistry (Weak-Field Complexes)",' }
            ],
            onMerge: () => {}
        }
    ];

    // --- DOM Elements ---
    const activeBranchText = document.getElementById("activeBranchText");
    const currentCommitHash = document.getElementById("currentCommitHash");
    const branchSelectorBtn = document.getElementById("branchSelectorBtn");
    const branchDropdown = document.getElementById("branchDropdown");
    
    const navExplorer = document.getElementById("navExplorer");
    const navGenerator = document.getElementById("navGenerator");
    const navGitOps = document.getElementById("navGitOps");
    
    const explorerSection = document.getElementById("explorerSection");
    const generatorSection = document.getElementById("generatorSection");
    const gitopsSection = document.getElementById("gitopsSection");
    
    const issuesBadge = document.getElementById("issuesBadge");

    // Explorer Elements
    const totalQuestionsCount = document.getElementById("totalQuestionsCount");
    const resultsCountText = document.getElementById("resultsCountText");
    const filterSubject = document.getElementById("filterSubject");
    const filterTopic = document.getElementById("filterTopic");
    const filterDifficulty = document.getElementById("filterDifficulty");
    const filterYear = document.getElementById("filterYear");
    const globalSearch = document.getElementById("globalSearch");
    const sortQuestions = document.getElementById("sortQuestions");
    const questionsList = document.getElementById("questionsList");
    
    const questionDetailPanel = document.getElementById("questionDetailPanel");
    const emptyDetailState = document.getElementById("emptyDetailState");
    const detailContent = document.getElementById("detailContent");
    
    const detailId = document.getElementById("detailId");
    const detailDifficulty = document.getElementById("detailDifficulty");
    const detailSubject = document.getElementById("detailSubject");
    const detailYear = document.getElementById("detailYear");
    const detailTopicPath = document.getElementById("detailTopicPath");
    const detailQuestionText = document.getElementById("detailQuestionText");
    const detailOptionsGrid = document.getElementById("detailOptionsGrid");
    
    const solutionBox = document.getElementById("solutionBox");
    const toggleSolutionBtn = document.getElementById("toggleSolutionBtn");
    const detailCorrectAnswer = document.getElementById("detailCorrectAnswer");
    const detailExplanation = document.getElementById("detailExplanation");
    const detailFilePath = document.getElementById("detailFilePath");
    const reportQuestionIssueBtn = document.getElementById("reportQuestionIssueBtn");

    // Generator Elements
    const paperConfigForm = document.getElementById("paperConfigForm");
    const paperTitle = document.getElementById("paperTitle");
    const numPhysics = document.getElementById("numPhysics");
    const numChemistry = document.getElementById("numChemistry");
    const numMaths = document.getElementById("numMaths");
    const pctEasy = document.getElementById("pctEasy");
    const pctMedium = document.getElementById("pctMedium");
    const pctHard = document.getElementById("pctHard");
    const valEasy = document.getElementById("valEasy");
    const valMedium = document.getElementById("valMedium");
    const valHard = document.getElementById("valHard");
    const difficultySumError = document.getElementById("difficultySumError");
    const currentSliderSum = document.getElementById("currentSliderSum");
    
    const emptyPaperState = document.getElementById("emptyPaperState");
    const paperSheet = document.getElementById("paperSheet");
    const previewPaperTitle = document.getElementById("previewPaperTitle");
    const paperMaxMarks = document.getElementById("paperMaxMarks");
    const paperBranchTag = document.getElementById("paperBranchTag");
    const paperTotalQs = document.getElementById("paperTotalQs");
    const paperQuestionsList = document.getElementById("paperQuestionsList");
    const paperAnswerKey = document.getElementById("paperAnswerKey");
    const paperAnswerKeyList = document.getElementById("paperAnswerKeyList");
    const togglePreviewAnswers = document.getElementById("togglePreviewAnswers");
    const printPaperBtn = document.getElementById("printPaperBtn");

    // GitOps Elements
    const gitGraphDiagram = document.getElementById("gitGraphDiagram");
    const gitCommitTooltip = document.getElementById("gitCommitTooltip");
    const btnActiveIssues = document.getElementById("btnActiveIssues");
    const btnClosedIssues = document.getElementById("btnClosedIssues");
    const openIssuesCount = document.getElementById("openIssuesCount");
    const closedIssuesCount = document.getElementById("closedIssuesCount");
    const gitIssuesList = document.getElementById("issuesList");
    const mergeNodeRotational = document.getElementById("mergeNodeRotational");
    
    const emptyIssueState = document.getElementById("emptyIssueState");
    const issueDetailedContent = document.getElementById("issueDetailedContent");
    const issueDetailedTitle = document.getElementById("issueDetailedTitle");
    const issueDetailedNum = document.getElementById("issueDetailedNum");
    const issueDetailedState = document.getElementById("issueDetailedState");
    const issueQuestionLink = document.getElementById("issueQuestionLink");
    const issueTargetYear = document.getElementById("issueTargetYear");
    const issueFixBranch = document.getElementById("issueFixBranch");
    const issueDetailedDesc = document.getElementById("issueDetailedDesc");
    const diffFileName = document.getElementById("diffFileName");
    const diffBody = document.getElementById("diffBody");
    const mergePrBtn = document.getElementById("mergePrBtn");
    const issueActions = document.getElementById("issueActions");

    // New Issue Modal Elements
    const openIssueBtn = document.getElementById("openIssueBtn");
    const syncGitBtn = document.getElementById("syncGitBtn");
    const issueModalBackdrop = document.getElementById("issueModalBackdrop");
    const closeIssueModalBtn = document.getElementById("closeIssueModalBtn");
    const cancelIssueModalBtn = document.getElementById("cancelIssueModalBtn");
    const newIssueForm = document.getElementById("newIssueForm");
    const issueTitleInput = document.getElementById("issueTitleInput");
    const issueQuestionSelect = document.getElementById("issueQuestionSelect");
    const issueDescInput = document.getElementById("issueDescInput");

    // --- Helper Functions ---

    // Trigger LaTeX rendering using KaTeX
    function triggerKaTeX(element) {
        if (window.renderMathInElement) {
            window.renderMathInElement(element, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });
        }
    }

    // Show/Hide Tab Sections
    function switchTab(tabId) {
        currentTab = tabId;
        
        // Update navigation UI
        [navExplorer, navGenerator, navGitOps].forEach(el => el.classList.remove("active"));
        [explorerSection, generatorSection, gitopsSection].forEach(el => el.classList.remove("active"));
        
        if (tabId === "explorer") {
            navExplorer.classList.add("active");
            explorerSection.classList.add("active");
        } else if (tabId === "generator") {
            navGenerator.classList.add("active");
            generatorSection.classList.add("active");
        } else if (tabId === "gitops") {
            navGitOps.classList.add("active");
            gitopsSection.classList.add("active");
            renderGitIssues();
        }
    }

    // Get branch filtered questions
    function getBranchQuestions() {
        if (activeBranch === "year-2023") {
            return currentQuestions.filter(q => q.year === 2023);
        } else if (activeBranch === "year-2024") {
            return currentQuestions.filter(q => q.year === 2023 || q.year === 2024);
        } else if (activeBranch === "year-2025") {
            return currentQuestions;
        } else if (activeBranch === "fix/rotational-friction-option") {
            // Include 2023, but the question JEE-2023-PHY-MEC-001 has the *unmerged* hotfix explanation
            // Let's copy and modify just for this branch representation
            return currentQuestions.map(q => {
                if (q.id === "JEE-2023-PHY-MEC-001") {
                    return {
                        ...q,
                        explanation: "For rolling without slipping: $a = \\frac{g \\sin \\theta}{1 + I/(MR^2)}$. For a solid cylinder, $I = \\frac{1}{2} MR^2$, so $a = \\frac{2}{3} g \\sin \\theta$. The friction force is $f = M g \\sin \\theta - M a = \\frac{1}{3} M g \\sin \\theta$. Since $f \\le \\mu_s N = \\mu_s M g \\cos \\theta$, we have $\\mu_s \\ge \\frac{1}{3} \\tan \\theta$. (Note: verified via rotational mechanics standard test cases)."
                    };
                }
                return q;
            }).filter(q => q.year === 2023); // off 2023 branch
        }
        // main has all verified questions
        return currentQuestions;
    }

    // Populate Topic Dropdown based on Subject
    const topicsMap = {
        "Physics": ["Mechanics", "Electrostatics", "Thermodynamics"],
        "Chemistry": ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],
        "Mathematics": ["Calculus", "Algebra", "Coordinate Geometry"]
    };

    function updateTopicDropdown(selectedSubject) {
        filterTopic.innerHTML = '<option value="all">All Topics</option>';
        if (selectedSubject === "all") {
            // Combine all
            const allTopics = [...new Set(Object.values(topicsMap).flat())];
            allTopics.forEach(t => {
                filterTopic.innerHTML += `<option value="${t}">${t}</option>`;
            });
        } else {
            const topics = topicsMap[selectedSubject] || [];
            topics.forEach(t => {
                filterTopic.innerHTML += `<option value="${t}">${t}</option>`;
            });
        }
    }

    // Render Question List
    function renderQuestionList() {
        const branchQs = getBranchQuestions();
        
        // Update stats card
        totalQuestionsCount.innerText = branchQs.length;

        // Apply filters
        const subject = filterSubject.value;
        const topic = filterTopic.value;
        const difficulty = filterDifficulty.value;
        const year = filterYear.value;
        const searchVal = globalSearch.value.toLowerCase().trim();

        let filtered = branchQs.filter(q => {
            if (subject !== "all" && q.subject !== subject) return false;
            if (topic !== "all" && q.topic !== topic) return false;
            if (difficulty !== "all" && q.difficulty !== difficulty) return false;
            if (year !== "all" && q.year !== parseInt(year)) return false;
            
            if (searchVal) {
                const searchStr = `${q.id} ${q.subject} ${q.topic} ${q.subtopic} ${q.question_text} ${q.explanation}`.toLowerCase();
                if (!searchStr.includes(searchVal)) return false;
            }
            return true;
        });

        // Apply sorting
        const sortBy = sortQuestions.value;
        filtered.sort((a, b) => {
            if (sortBy === "id") {
                return a.id.localeCompare(b.id);
            } else if (sortBy === "difficulty") {
                const diffWeight = { "Easy": 1, "Medium": 2, "Hard": 3 };
                return diffWeight[b.difficulty] - diffWeight[a.difficulty]; // Hardest first
            } else if (sortBy === "year") {
                return b.year - a.year; // Newest first
            }
            return 0;
        });

        resultsCountText.innerText = `Showing ${filtered.length} questions`;

        // Clear and render list
        questionsList.innerHTML = "";
        
        if (filtered.length === 0) {
            questionsList.innerHTML = `
                <div class="empty-list-state" style="padding: 40px 20px; text-align: center; color: var(--text-dim);">
                    <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 12px; display: block;"></i>
                    <span>No questions found matching criteria.</span>
                </div>
            `;
            return;
        }

        filtered.forEach(q => {
            const isSelected = q.id === selectedQuestionId;
            const diffClass = q.difficulty.toLowerCase();
            
            const card = document.createElement("div");
            card.className = `q-card ${isSelected ? 'selected' : ''}`;
            card.dataset.id = q.id;
            
            card.innerHTML = `
                <div class="q-card-header">
                    <span class="q-id">${q.id}</span>
                    <div class="q-tags">
                        <span class="badge badge-difficulty ${diffClass}">${q.difficulty}</span>
                        <span class="badge badge-year">${q.year}</span>
                    </div>
                </div>
                <div class="q-snippet">${stripLaTeX(q.question_text)}</div>
                <div class="q-meta-row">
                    <span class="q-topic"><i class="fa-solid fa-tag"></i> ${q.subject} / ${q.topic}</span>
                    <span class="q-marks">+4 / -1</span>
                </div>
            `;
            
            card.addEventListener("click", () => {
                selectQuestion(q.id);
            });
            
            questionsList.appendChild(card);
        });

        // If current selected question is not in the list, hide detail or keep it?
        // Let's update details if selected exists
        if (selectedQuestionId) {
            const selectedExists = filtered.find(x => x.id === selectedQuestionId);
            if (!selectedExists) {
                hideQuestionDetail();
            } else {
                displayQuestionDetail(selectedExists);
            }
        }
    }

    function stripLaTeX(text) {
        // Simple helper to remove LaTeX markers for the search card snippet
        return text.replace(/\$/g, '').replace(/\\text\{([^}]+)\}/g, '$1');
    }

    // Select a Question
    function selectQuestion(id) {
        selectedQuestionId = id;
        
        // Highlight active card
        const cards = questionsList.querySelectorAll(".q-card");
        cards.forEach(card => {
            if (card.dataset.id === id) {
                card.classList.add("selected");
            } else {
                card.classList.remove("selected");
            }
        });

        const q = getBranchQuestions().find(x => x.id === id);
        if (q) {
            displayQuestionDetail(q);
        }
    }

    function hideQuestionDetail() {
        selectedQuestionId = null;
        emptyDetailState.classList.remove("hidden");
        detailContent.classList.add("hidden");
    }

    // Render specific detailed question
    function displayQuestionDetail(q) {
        emptyDetailState.classList.add("hidden");
        detailContent.classList.remove("hidden");
        
        // Reset explanation box
        solutionBox.classList.remove("expanded");
        
        // Populating
        detailId.innerText = q.id;
        
        // Set difficulty badge classes
        detailDifficulty.className = `badge badge-difficulty ${q.difficulty.toLowerCase()}`;
        detailDifficulty.innerText = q.difficulty;
        detailYear.innerText = q.year;
        detailSubject.innerText = q.subject;
        
        detailTopicPath.innerHTML = `<i class="fa-solid fa-folder-open"></i> questions / ${q.year} / ${q.subject.toLowerCase()} / ${q.topic.toLowerCase().replace(" ", "_")}`;
        
        detailQuestionText.innerHTML = q.question_text;
        
        // Render Options
        detailOptionsGrid.innerHTML = "";
        Object.entries(q.options).forEach(([optLabel, optText]) => {
            const optCard = document.createElement("div");
            optCard.className = "opt-card";
            optCard.innerHTML = `
                <span class="opt-prefix">${optLabel}</span>
                <span class="opt-text">${optText}</span>
            `;
            detailOptionsGrid.appendChild(optCard);
        });

        // Set solution content
        detailCorrectAnswer.innerText = q.correct_answer;
        detailExplanation.innerHTML = q.explanation;
        
        // Set file path
        const fileTopicSegment = q.topic.toLowerCase().replace(" ", "_");
        detailFilePath.innerText = `questions/${q.year}/${q.subject.toLowerCase()}/${fileTopicSegment}/${q.difficulty.toLowerCase()}_${q.id}.json`;

        // Render KaTeX for formulas
        triggerKaTeX(detailContent);
    }

    // --- Branch selector dropdown logic ---
    branchSelectorBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        branchDropdown.classList.toggle("open");
    });

    document.addEventListener("click", () => {
        branchDropdown.classList.remove("open");
    });

    const branchOptions = branchDropdown.querySelectorAll(".branch-option");
    branchOptions.forEach(opt => {
        opt.addEventListener("click", () => {
            const branch = opt.dataset.branch;
            
            // Update UI
            branchOptions.forEach(x => x.classList.remove("active"));
            opt.classList.add("active");
            activeBranchText.innerText = branch;
            activeBranch = branch;
            
            // Set mock commit hash for visual flair
            const branchCommits = {
                "main": "commit: bd8d34d",
                "year-2023": "commit: 935ee93",
                "year-2024": "commit: 2382520",
                "year-2025": "commit: bd8d34d",
                "fix/rotational-friction-option": "commit: 14f3ded"
            };
            currentCommitHash.innerText = branchCommits[branch] || "commit: bd8d34d";

            // Recalculate Explorer list
            selectedQuestionId = null;
            renderQuestionList();
            hideQuestionDetail();
            
            // Also notify paper generator active branch
            paperBranchTag.innerText = branch;
        });
    });

    // Toggle Solution Box
    toggleSolutionBtn.addEventListener("click", () => {
        solutionBox.classList.toggle("expanded");
    });

    // Raise Issue button inside detailed view
    reportQuestionIssueBtn.addEventListener("click", () => {
        if (selectedQuestionId) {
            openNewIssueModal(selectedQuestionId);
        }
    });

    // --- Paper Generator Logic ---

    // Sliders Sync
    function syncSliders() {
        valEasy.innerText = `${pctEasy.value}%`;
        valMedium.innerText = `${pctMedium.value}%`;
        valHard.innerText = `${pctHard.value}%`;

        const sum = parseInt(pctEasy.value) + parseInt(pctMedium.value) + parseInt(pctHard.value);
        currentSliderSum.innerText = sum;

        if (sum !== 100) {
            difficultySumError.classList.remove("hidden");
            return false;
        } else {
            difficultySumError.classList.add("hidden");
            return true;
        }
    }

    [pctEasy, pctMedium, pctHard].forEach(slider => {
        slider.addEventListener("input", syncSliders);
    });

    // Form submission
    paperConfigForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        if (!syncSliders()) {
            alert("Difficulty mix percentages must sum to exactly 100%!");
            return;
        }

        // Get parameters
        const title = paperTitle.value;
        const years = Array.from(document.querySelectorAll('input[name="paperYears"]:checked')).map(el => parseInt(el.value));
        const numPhy = parseInt(numPhysics.value);
        const numChm = parseInt(numChemistry.value);
        const numMth = parseInt(numMaths.value);
        
        const difficultyMix = {
            "Easy": parseInt(pctEasy.value) / 100,
            "Medium": parseInt(pctMedium.value) / 100,
            "Hard": parseInt(pctHard.value) / 100
        };

        if (years.length === 0) {
            alert("Please select at least one year to pull questions from.");
            return;
        }

        // Get questions from active branch
        const availableQs = getBranchQuestions().filter(q => years.includes(q.year));

        // Group by subject
        const physicsQs = availableQs.filter(q => q.subject === "Physics");
        const chemistryQs = availableQs.filter(q => q.subject === "Chemistry");
        const mathsQs = availableQs.filter(q => q.subject === "Mathematics");

        // Select questions function
        function pickQuestions(pool, count) {
            if (pool.length === 0 || count <= 0) return [];
            
            // Attempt to select based on difficulty weights
            let selected = [];
            let poolCopy = [...pool];
            
            // Randomly shuffle pool first
            poolCopy.sort(() => 0.5 - Math.random());

            // Target counts
            let easyTarget = Math.round(count * difficultyMix["Easy"]);
            let mediumTarget = Math.round(count * difficultyMix["Medium"]);
            let hardTarget = count - easyTarget - mediumTarget;

            // Pick easy
            let easySelected = poolCopy.filter(q => q.difficulty === "Easy").slice(0, easyTarget);
            selected.push(...easySelected);
            poolCopy = poolCopy.filter(q => !easySelected.includes(q));

            // Pick medium
            let mediumSelected = poolCopy.filter(q => q.difficulty === "Medium").slice(0, mediumTarget);
            selected.push(...mediumSelected);
            poolCopy = poolCopy.filter(q => !mediumSelected.includes(q));

            // Pick hard
            let hardSelected = poolCopy.filter(q => q.difficulty === "Hard").slice(0, hardTarget);
            selected.push(...hardSelected);
            poolCopy = poolCopy.filter(q => !hardSelected.includes(q));

            // Fill remaining if we fell short
            while (selected.length < count && poolCopy.length > 0) {
                selected.push(poolCopy.shift());
            }

            return selected.slice(0, count);
        }

        const chosenPhy = pickQuestions(physicsQs, numPhy);
        const chosenChm = pickQuestions(chemistryQs, numChm);
        const chosenMth = pickQuestions(mathsQs, numMth);

        const allChosen = [...chosenPhy, ...chosenChm, ...chosenMth];

        if (allChosen.length === 0) {
            alert("No questions could be matched for paper criteria. Try changing year filters or branching scope.");
            return;
        }

        // Render the generated paper
        renderPaperSheet(title, allChosen);
    });

    function renderPaperSheet(title, qList) {
        emptyPaperState.classList.add("hidden");
        paperSheet.classList.remove("hidden");

        // Header
        previewPaperTitle.innerText = title;
        paperTotalQs.innerText = qList.length;
        paperMaxMarks.innerText = qList.length * 4;
        paperBranchTag.innerText = activeBranch;

        // Populate paper questions list
        paperQuestionsList.innerHTML = "";
        paperAnswerKeyList.innerHTML = "";

        qList.forEach((q, idx) => {
            // Document question
            const qItem = document.createElement("div");
            qItem.className = "paper-q-item";
            
            let optionsHTML = "";
            Object.entries(q.options).forEach(([lbl, txt]) => {
                optionsHTML += `<div class="paper-opt"><strong>(${lbl})</strong> ${txt}</div>`;
            });

            qItem.innerHTML = `
                <div class="paper-q-text">
                    <strong>Q${idx + 1}.</strong> ${q.question_text} <span style="font-size: 0.75rem; color: #4b5563; margin-left:8px; font-family: monospace;">[${q.id} | ${q.difficulty}]</span>
                </div>
                <div class="paper-q-options">
                    ${optionsHTML}
                </div>
            `;
            paperQuestionsList.appendChild(qItem);

            // Document answer
            const ansItem = document.createElement("div");
            ansItem.className = "paper-ans-item";
            ansItem.innerHTML = `
                <div><strong>Q${idx + 1}. [Correct Answer: ${q.correct_answer}]</strong></div>
                <div style="font-size:0.8rem; margin-top:4px; color:#4b5563;">Explanation: ${q.explanation}</div>
            `;
            paperAnswerKeyList.appendChild(ansItem);
        });

        // Trigger KaTeX rendering on the print sheet
        triggerKaTeX(paperPreviewContainer);
    }

    // Toggle Answer Key display
    togglePreviewAnswers.addEventListener("click", () => {
        showAnswerKey = !showAnswerKey;
        if (showAnswerKey) {
            paperAnswerKey.classList.remove("hidden");
            togglePreviewAnswers.innerHTML = '<i class="fa-solid fa-eye"></i> Hide Answer Key';
        } else {
            paperAnswerKey.classList.add("hidden");
            togglePreviewAnswers.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Toggle Answer Key';
        }
    });

    // Print paper trigger
    printPaperBtn.addEventListener("click", () => {
        window.print();
    });

    // --- GitOps & Issues Board Logic ---
    let issueTab = "open";

    function renderGitIssues() {
        const activeIssues = issues.filter(x => x.state === issueTab);
        
        // Count totals
        const openCount = issues.filter(x => x.state === "open").length;
        const closedCount = issues.filter(x => x.state === "closed").length;
        
        openIssuesCount.innerText = openCount;
        closedIssuesCount.innerText = closedCount;
        issuesBadge.innerText = openCount;
        if (openCount === 0) {
            issuesBadge.style.display = "none";
        } else {
            issuesBadge.style.display = "inline-block";
        }

        gitIssuesList.innerHTML = "";
        
        if (activeIssues.length === 0) {
            gitIssuesList.innerHTML = `
                <div style="padding: 40px; text-align: center; color: var(--text-dim);">
                    <i class="fa-solid fa-square-check" style="font-size: 2.5rem; margin-bottom: 12px; display: block; color: var(--success);"></i>
                    <span>No ${issueTab} issues! The question bank is clean.</span>
                </div>
            `;
            return;
        }

        activeIssues.forEach(issue => {
            const card = document.createElement("div");
            card.className = `issue-card ${issue.state === 'closed' ? 'closed' : ''}`;
            card.innerHTML = `
                <div class="issue-card-title-row">
                    <span class="issue-card-title">${issue.title}</span>
                    <span class="issue-num">#${issue.id}</span>
                </div>
                <div class="issue-card-meta">
                    <span class="issue-state-dot">
                        <span class="state-indicator ${issue.state}"></span>
                        <span style="text-transform: capitalize;">${issue.state}</span>
                    </span>
                    <span>Q: ${issue.questionId}</span>
                    <span>Year: ${issue.year}</span>
                </div>
            `;
            
            card.addEventListener("click", () => {
                selectIssue(issue.id);
            });
            gitIssuesList.appendChild(card);
        });
    }

    btnActiveIssues.addEventListener("click", () => {
        issueTab = "open";
        btnActiveIssues.classList.add("active");
        btnClosedIssues.classList.remove("active");
        renderGitIssues();
        hideIssueDetail();
    });

    btnClosedIssues.addEventListener("click", () => {
        issueTab = "closed";
        btnClosedIssues.classList.add("active");
        btnActiveIssues.classList.remove("active");
        renderGitIssues();
        hideIssueDetail();
    });

    function hideIssueDetail() {
        emptyIssueState.classList.remove("hidden");
        issueDetailedContent.classList.add("hidden");
    }

    function selectIssue(id) {
        // Highlight active card
        const cards = gitIssuesList.querySelectorAll(".issue-card");
        cards.forEach(card => {
            // Find card with that title / ID structure
            if (card.querySelector(".issue-num").innerText === `#${id}`) {
                card.classList.add("selected");
            } else {
                card.classList.remove("selected");
            }
        });

        const issue = issues.find(x => x.id === id);
        if (issue) {
            displayIssueDetail(issue);
        }
    }

    function displayIssueDetail(issue) {
        emptyIssueState.classList.add("hidden");
        issueDetailedContent.classList.remove("hidden");

        issueDetailedTitle.innerText = issue.title;
        issueDetailedNum.innerText = `#${issue.id}`;
        
        issueDetailedState.innerText = issue.state;
        issueDetailedState.className = `issue-state-badge ${issue.state}`;

        issueQuestionLink.innerText = issue.questionId;
        issueQuestionLink.onclick = (e) => {
            e.preventDefault();
            switchTab("explorer");
            // Highlight and view this question
            setTimeout(() => {
                // Switch dropdown year and subject filters to match this question if necessary
                const q = currentQuestions.find(x => x.id === issue.questionId);
                if (q) {
                    filterSubject.value = "all";
                    filterTopic.value = "all";
                    filterDifficulty.value = "all";
                    filterYear.value = "all";
                    updateTopicDropdown("all");
                    selectedQuestionId = q.id;
                    renderQuestionList();
                    selectQuestion(q.id);
                }
            }, 100);
        };

        issueTargetYear.innerText = issue.year;
        issueFixBranch.innerText = issue.branch;
        issueDetailedDesc.innerText = issue.desc;

        // Render file diff
        diffFileName.innerText = issue.diffFile;
        diffBody.innerHTML = "";

        issue.diff.forEach(line => {
            const el = document.createElement("div");
            el.className = `diff-line ${line.type}`;
            if (line.type === "addition") {
                el.innerText = `+ ${line.text}`;
            } else if (line.type === "deletion") {
                el.innerText = `- ${line.text}`;
            } else {
                el.innerText = `  ${line.text}`;
            }
            diffBody.appendChild(el);
        });

        // Toggle Actions panel
        if (issue.state === "open") {
            issueActions.classList.remove("hidden");
        } else {
            issueActions.classList.add("hidden");
        }

        // Action Merge
        mergePrBtn.onclick = () => {
            mergePullRequest(issue);
        };
    }

    function mergePullRequest(issue) {
        // Run Simulated Merge Animation
        mergePrBtn.disabled = true;
        mergePrBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Merging Pull Request...';

        setTimeout(() => {
            // Apply memory change
            issue.onMerge();
            
            // Change issue state
            issue.state = "closed";
            
            // Show merge node in graph
            if (issue.id === 101) {
                mergeNodeRotational.classList.remove("hidden");
            }

            // Update UI
            mergePrBtn.disabled = false;
            mergePrBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Merged!';
            
            alert(`Pull Request for Branch ${issue.branch} has been successfully merged into main! Issue #${issue.id} closed.`);

            renderGitIssues();
            displayIssueDetail(issue);
            renderQuestionList(); // Update explorer in case user views the fixed question
        }, 1500);
    }

    // --- New Issue Modal Logic ---
    openIssueBtn.addEventListener("click", () => {
        openNewIssueModal();
    });

    function openNewIssueModal(preselectedQId = null) {
        // Clear inputs
        issueTitleInput.value = "";
        issueDescInput.value = "";
        
        // Populate question options
        issueQuestionSelect.innerHTML = '<option value="" disabled selected>Select question...</option>';
        currentQuestions.forEach(q => {
            issueQuestionSelect.innerHTML += `<option value="${q.id}">${q.id} - ${q.subject} (${q.topic})</option>`;
        });

        if (preselectedQId) {
            issueQuestionSelect.value = preselectedQId;
        }

        issueModalBackdrop.classList.add("open");
    }

    function closeIssueModal() {
        issueModalBackdrop.classList.remove("open");
    }

    closeIssueModalBtn.addEventListener("click", closeIssueModal);
    cancelIssueModalBtn.addEventListener("click", closeIssueModal);
    
    newIssueForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const title = issueTitleInput.value;
        const qId = issueQuestionSelect.value;
        const desc = issueDescInput.value;

        const q = currentQuestions.find(x => x.id === qId);
        if (!q) return;

        // Create new issue object
        const newId = issues.length > 0 ? Math.max(...issues.map(x => x.id)) + 1 : 101;
        const branchName = `fix/issue-${newId}-${qId.toLowerCase()}`;

        const newIssue = {
            id: newId,
            title: title,
            questionId: qId,
            year: q.year,
            state: "open",
            branch: branchName,
            desc: desc,
            diffFile: `questions/${q.year}/${q.subject.toLowerCase()}/${q.topic.toLowerCase().replace(" ", "_")}/${q.difficulty.toLowerCase()}_${q.id}.json`,
            diff: [
                { type: "deletion", text: `  "explanation": "${q.explanation.substring(0, 80)}..."` },
                { type: "addition", text: `  "explanation": "[CORRECTED] ${desc.substring(0, 80)}..."` }
            ],
            onMerge: () => {
                // Simulate an correction write back
                const targetQ = currentQuestions.find(x => x.id === qId);
                if (targetQ) {
                    targetQ.explanation = `[CORRECTED DETAILS]: ${desc}\n\nOriginal explanation:\n${targetQ.explanation}`;
                }
            }
        };

        // Add to list
        issues.push(newIssue);
        
        closeIssueModal();
        alert(`New issue #${newId} opened successfully under tracking branch: ${branchName}`);
        
        // Go to GitOps tab and render
        switchTab("gitops");
        selectIssue(newId);
    });

    // Sync Git Button
    syncGitBtn.addEventListener("click", () => {
        syncGitBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin"></i> Syncing...';
        setTimeout(() => {
            syncGitBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Sync Git Status';
            alert("Local repository state synced with Git! Head hash is matching main branch.");
        }, 800);
    });

    // --- Tab menu click handlers ---
    navExplorer.addEventListener("click", (e) => {
        e.preventDefault();
        switchTab("explorer");
    });
    
    navGenerator.addEventListener("click", (e) => {
        e.preventDefault();
        switchTab("generator");
    });
    
    navGitOps.addEventListener("click", (e) => {
        e.preventDefault();
        switchTab("gitops");
    });

    // --- Filter Handlers ---
    filterSubject.addEventListener("change", () => {
        updateTopicDropdown(filterSubject.value);
        renderQuestionList();
    });
    
    [filterTopic, filterDifficulty, filterYear, sortQuestions].forEach(el => {
        el.addEventListener("change", renderQuestionList);
    });

    globalSearch.addEventListener("input", renderQuestionList);

    // --- Interactive Graph Tooltip ---
    const commitNodes = gitGraphDiagram.querySelectorAll(".commit-node");
    commitNodes.forEach(node => {
        node.addEventListener("mouseenter", (e) => {
            const hash = node.dataset.hash;
            const tooltipText = node.dataset.tooltip;
            gitCommitTooltip.innerHTML = `<strong>commit: ${hash}</strong> &mdash; ${tooltipText}`;
        });
        
        node.addEventListener("mouseleave", () => {
            gitCommitTooltip.innerHTML = "Hover over a commit node to see info";
        });
    });

    // --- Initialization ---
    updateTopicDropdown("all");
    renderQuestionList();
    syncSliders();
});
