# Q-Vault: GitOps JEE Question Bank Walkthrough

This repository is a demonstrative setup showcasing a version-controlled question bank for JEE (Physics, Chemistry, Mathematics). It demonstrates how questions can be stored in human-readable Markdown formats, organized by year, topic, and difficulty, and managed using standard Git branching and issue resolution workflows.

---

## 📂 Repository Structure

The project is structured to make both the raw files and the presentation platform easy to navigate:

```
QUESTION_BANK_JEE/
├── questions/                  # The Question Bank (versioned by year)
│   ├── 2023/
│   │   ├── physics/
│   │   │   └── mechanics/
│   │   │       └── hard_JEE-2023-PHY-MEC-001.md
│   │   │       ...
│   ├── 2024/
│   │   └── ...
│   └── 2025/
│       └── ...
├── scripts/                    # Automation and GitOps scripts
│   ├── generate_questions.py   # Seeds standard question bank MD files
│   ├── setup_git.py            # Automates local Git branching setup
│   └── compile_db.py           # Compiles MD questions into a dashboard JS database
├── dashboard/                  # "Q-Vault" Presentation Dashboard (HTML/JS/CSS)
│   ├── index.html              # Main layout structure with KaTeX rendering
│   ├── style.css               # Glassmorphic dark theme and print stylesheet
│   ├── app.js                  # Interactive state engine for merges and papers
│   └── data/
│       └── questions_db.js     # Auto-compiled question database
└── walkthrough.md              # This guide
```

---

## 📄 Question File Format (Markdown + YAML Frontmatter)

Each question is stored in its own `.md` file, which is highly readable natively on platforms like GitHub or GitLab:

```markdown
---
id: JEE-2023-PHY-MEC-001
subject: Physics
topic: Mechanics
subtopic: Rotational Dynamics
difficulty: Hard
year: 2023
correct_answer: A
marks: 4
---

# Question
A solid cylinder of mass $M$ and radius $R$ is rolling without slipping down an inclined plane of angle $\theta$. If the coefficient of static friction is $\mu_s$, what is the minimum value of $\mu_s$ required to prevent slipping?

# Options
- **A**: $\frac{1}{3} \tan \theta$
- **B**: $\frac{2}{3} \tan \theta$
- **C**: $\frac{1}{2} \tan \theta$
- **D**: $\frac{2}{5} \tan \theta$

# Explanation
For rolling without slipping: $a = \frac{g \sin \theta}{1 + I/(MR^2)}$. For a solid cylinder, $I = \frac{1}{2} MR^2$, so $a = \frac{2}{3} g \sin \theta$. The friction force is $f = M g \sin \theta - M a = \frac{1}{3} M g \sin \theta$. Since $f \le \mu_s N = \mu_s M g \cos \theta$, we have $\mu_s \ge \frac{1}{3} \tan \theta$.
```

---

## 🌿 Git Branching Model

To demonstrate version control by year, the repository features several branches:

| Branch Name | Description | Included Questions |
| :--- | :--- | :--- |
| `main` | Production-ready verified question bank | All questions (2023, 2024, 2025) |
| `year-2023` | Stable branch for year 2023 | 2023 Questions only |
| `year-2024` | Cumulative branch for year 2024 | 2023 & 2024 Questions |
| `year-2025` | Release-candidate branch for year 2025 | All questions (2023, 2024, 2025) |
| `fix/rotational-friction-option` | Hotfix branch addressing Issue #101 | Modifications on 2023 Mechanics Q1 |

To show the commit history or branches in your video, you can run:
```bash
git log --graph --oneline --all
```

---

## 🖥️ How to Run the Q-Vault Dashboard

You can demonstrate the "public serving platform" locally. Because it is built using Vanilla HTML5, CSS3, and Javascript, it requires no build steps or package installations.

### Method 1: Python HTTP Server (Recommended)
To prevent browser CORS policy restrictions when loading local assets, run a simple local web server:
1. Open your terminal in the project directory.
2. Run:
   ```bash
   python3 -m http.server -d dashboard/ 8000
   ```
3. Open your browser and navigate to: [http://localhost:8000](http://localhost:8000)

### Method 2: Double-click index.html
1. Navigate to the `dashboard/` folder in your file explorer (Finder).
2. Double-click `index.html` to open it in your browser. (Note: The pre-compiled database ensures it loads questions successfully even without a server!).

---

## 🎥 Key Features to Showcase in the Video

1. **Active Branch Switching**:
   * Use the **Active Branch** selector in the sidebar.
   * Notice how switching to `year-2023` filters the question list immediately to 2023 questions.
   * Switching back to `main` displays all verified questions.
2. **LaTeX Equation Rendering**:
   * Click on any question card (e.g. `JEE-2023-PHY-MEC-001`).
   * Show the beautifully rendered equations. Click **Reveal Answer & Explanation** to show detailed step-by-step solutions using math typography.
3. **Paper Generator**:
   * Go to the **Paper Generator** tab.
   * Configure the number of questions and mix of difficulties.
   * Click **Compile Question Paper** to draft a ready-to-print paper layout.
   * Toggle **Answer Key** or press **Print / Save PDF** (which hides the dashboard chrome and formats only the exam paper for printing).
4. **GitOps & Issue Tracker**:
   * Go to the **GitOps & Issues** tab.
   * Click on **Issue #101**. Review the description and the colored git-style code diff.
   * Click the green **Merge Pull Request & Resolve Issue** button.
   * The system will animate, merge the hotfix branch into `main` in memory, update the question's explanation, close the issue, and display a new merge commit node on the branch graph!
