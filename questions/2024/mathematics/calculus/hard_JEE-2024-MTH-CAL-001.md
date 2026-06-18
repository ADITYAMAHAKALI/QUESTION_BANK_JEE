---
id: JEE-2024-MTH-CAL-001
subject: Mathematics
topic: Calculus
subtopic: Definite Integration
difficulty: Hard
year: 2024
correct_answer: A
marks: 4
---

# Question
The value of the integral $\int_0^{\pi/2} \frac{\sin^{100} x}{\sin^{100} x + \cos^{100} x} dx$ is:

# Options
- **A**: $\frac{\pi}{4}$
- **B**: $\frac{\pi}{2}$
- **C**: $\pi$
- **D**: $0$

# Explanation
Let $I = \int_0^{\pi/2} \frac{\sin^{100} x}{\sin^{100} x + \cos^{100} x} dx$. Using property $\int_a^b f(x) dx = \int_a^b f(a+b-x) dx$: $I = \int_0^{\pi/2} \frac{\cos^{100} x}{\cos^{100} x + \sin^{100} x} dx$. Adding the two equations: $2I = \int_0^{\pi/2} 1 dx = \frac{\pi}{2} \implies I = \frac{\pi}{4}$.
