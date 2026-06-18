# 🏆 Q-Vault: GitOps-Powered JEE Question Bank & Issue Resolver

Welcome to the **Q-Vault** demonstrative repository. This project showcases a modern, version-controlled architecture for managing a question bank (specifically for JEE Physics, Chemistry, and Mathematics) using standard Git branching and a GitOps-based issue resolution system.

---

## 💡 Concept & Core Pillars

1. **Markdown-Based Question Files**:
   Questions are stored as `.md` files containing LaTeX formulas. This keeps the database human-readable, easily diffable by Git, and renders natively on code hosting platforms (like GitHub or GitLab).
2. **Version Control by Year**:
   Questions are committed across different stable branches corresponding to academic years (`year-2023`, `year-2024`, `year-2025`), showing how revisions are isolated and rolled out.
3. **GitOps Issue Resolution**:
   Corrections to questions are managed through Git branches and pull requests. When a wrong question is reported, an issue is created and a fix branch (e.g. `fix/rotational-friction-option`) is checked out to edit the markdown file and merge it back.

---

## 📂 Directory Layout

```
QUESTION_BANK_JEE/
├── questions/                  # The Question Bank (segregated by year)
│   ├── 2023/
│   │   ├── physics/
│   │   │   └── mechanics/
│   │   │       └── hard_JEE-2023-PHY-MEC-001.md
│   │   │       ...
│   ├── 2024/
│   │   └── ...
│   └── 2025/
│       └── ...
├── scripts/                    # Automation and compilation scripts
│   ├── generate_questions.py   # Seeds standard question bank MD files
│   ├── setup_git.py            # Automates local Git branching setup
│   └── compile_db.py           # Compiles MD questions into the dashboard DB
└── dashboard/                  # "Q-Vault" Presentation Dashboard (HTML/JS/CSS)
    ├── index.html              # Main dashboard structure (renders LaTeX)
    ├── style.css               # Premium dark glassmorphism styling
    └── app.js                  # Frontend interactive merge and exam engine
```

---

## 🌿 Git Branch Hierarchy

To inspect the branch graph locally, run:
```bash
git log --graph --oneline --all
```

* **`main`**: The primary branch representing the active question bank (includes all verified questions).
* **`year-2023`**: Focuses on 2023-specific questions.
* **`year-2024`**: Accumulates 2023 & 2024 questions.
* **`year-2025`**: Accumulates all questions up to 2025.
* **`fix/rotational-friction-option`**: An active bugfix branch containing a correction to a rotational mechanics question from 2023.

---

## 🖥️ Getting Started & Running the Dashboard

The project includes an interactive web dashboard to explore the database, generate sample question papers, and merge pull requests visually.

### 1. Compile Database (Optional)
If you add or edit markdown questions, compile them into the web database by running:
```bash
python3 scripts/compile_db.py
```

### 2. Run the Web Server
Launch a local web server to run the application:
```bash
python3 -m http.server -d dashboard/ 8000
```
Open your browser and go to **[http://localhost:8000](http://localhost:8000)**.

---

## 🎥 Demonstration Workflow (for Video Showcase)

1. **Question Explorer**: Switch between active git branches (e.g. `main` vs `year-2023`) in the sidebar dropdown to see how the available database adapts. Inspect the LaTeX rendering.
2. **Paper Generator**: Set weights for Physics, Chemistry, and Mathematics questions, and hit **Compile**. Use **Print / Save PDF** to view the clean printable exam sheet.
3. **Resolve a Git Issue**: Go to the **GitOps & Issues** tab. Click **Issue #101**, review the file diff highlighting the fix, and click **Merge Pull Request**. Watch the branch graph update in real-time as the fix is applied.
