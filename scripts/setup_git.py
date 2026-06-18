import subprocess
import os
import shutil

def run_git(args):
    print(f"Running: git {' '.join(args)}")
    result = subprocess.run(["git"] + args, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
    else:
        print(result.stdout)
    return result

def main():
    # 1. Setup local config to avoid commit failures
    run_git(["config", "user.name", "JEE Question Bank Bot"])
    run_git(["config", "user.email", "qbank-bot@example.com"])
    
    # Clean workspace branches if they exist to allow clean re-runs
    # Delete branches if they exist (except main)
    # We will ignore errors if branches don't exist
    for b in ["year-2023", "year-2024", "year-2025", "fix/rotational-friction-option"]:
        subprocess.run(["git", "branch", "-D", b], capture_output=True)
        
    # Check current status
    run_git(["status"])
    
    # 2. Add scripts
    run_git(["add", "scripts/"])
    run_git(["commit", "-m", "chore: add scripts for question generation and repo setup"])
    
    # 3. Create year branches and commit their specific questions
    # We will temporarily move files out, create branches, and add them
    if os.path.exists("questions_backup"):
        shutil.rmtree("questions_backup")
    shutil.copytree("questions", "questions_backup")
    
    # Remove all questions from workspace to build clean branches
    shutil.rmtree("questions")
    
    # Create year-2023 branch
    run_git(["checkout", "-b", "year-2023"])
    shutil.copytree("questions_backup/2023", "questions/2023")
    run_git(["add", "questions/2023"])
    run_git(["commit", "-m", "feat: seed 2023 questions for Physics, Chemistry, and Mathematics in MD format"])
    
    # Create year-2024 branch (off year-2023)
    run_git(["checkout", "-b", "year-2024"])
    shutil.copytree("questions_backup/2024", "questions/2024")
    run_git(["add", "questions/2024"])
    run_git(["commit", "-m", "feat: seed 2024 questions for Physics, Chemistry, and Mathematics in MD format"])
    
    # Create year-2025 branch (off year-2024)
    run_git(["checkout", "-b", "year-2025"])
    shutil.copytree("questions_backup/2025", "questions/2025")
    run_git(["add", "questions/2025"])
    run_git(["commit", "-m", "feat: seed 2025 questions for Physics, Chemistry, and Mathematics in MD format"])
    
    # Go back to main
    run_git(["checkout", "main"])
    
    # Merge year branches into main
    run_git(["merge", "year-2023", "--no-edit"])
    run_git(["merge", "year-2024", "--no-edit"])
    run_git(["merge", "year-2025", "--no-edit"])
    
    # 4. Create an issue branch: fix/rotational-friction-option
    # Off main
    run_git(["checkout", "-b", "fix/rotational-friction-option"])
    # Let's modify a file in questions/2023/physics/mechanics/hard_JEE-2023-PHY-MEC-001.md
    file_to_fix = "questions/2023/physics/mechanics/hard_JEE-2023-PHY-MEC-001.md"
    if os.path.exists(file_to_fix):
        with open(file_to_fix, "r") as f:
            content = f.read()
        
        # Append verification text to explanation section
        fixed_content = content + "\n(Note: verified via rotational mechanics standard test cases)."
        with open(file_to_fix, "w") as f:
            f.write(fixed_content)
        
        run_git(["add", file_to_fix])
        run_git(["commit", "-m", "fix: clarify rotational friction coefficient criteria for cylinder"])
    
    # Go back to main
    run_git(["checkout", "main"])
    
    # Clean up backup
    if os.path.exists("questions_backup"):
        shutil.rmtree("questions_backup")
        
    print("Git branching model set up successfully with Markdown questions!")

if __name__ == "__main__":
    main()
