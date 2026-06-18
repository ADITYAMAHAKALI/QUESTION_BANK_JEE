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

(Note: verified via rotational mechanics standard test cases).