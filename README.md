# 🎓 Whiteboard Teacher AI

![Status Beta](https://img.shields.io/badge/Status-Beta-orange?style=for-the-badge&logo=fire)
![Gemini AI](https://img.shields.io/badge/AI-Powered_by_Gemini-blue?style=for-the-badge&logo=google-gemini&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Whiteboard Teacher AI** is an interactive educational platform designed to transform the teaching and learning of mathematics and physics. It combines the flexibility of an infinite digital whiteboard with the power of an advanced AI assistant (Google Gemini).

This system is deployed and available at: **[https://whiteboard.glot.school/](https://whiteboard.glot.school/)**

## 🌍 Glot Poly Use Case

**Glot Poly** utilizes this whiteboard system to provide a seamless, AI-powered tutoring experience. The goal is to create an environment where students can:
*   **Visualize** complex mathematical and physical concepts instantly.
*   **Interact** with an AI tutor that understands context and provides step-by-step guidance.
*   **Bridge the gap** between abstract theory and concrete understanding through dynamic graphing and infinite canvas capabilities.

This integration ensures that students using Glot Poly have access to cutting-edge educational tools without needing to manage technical configurations like API keys.

## 🚀 Mission: Supporting Education

Our main goal is to **democratize access to personalized tutoring** and **improve the understanding of complex concepts** through visualization. We believe education should be:

*   **Visual:** Abstract concepts are better understood when seen. That's why our AI doesn't just explain; it *graphs* and *draws*.
*   **Interactive:** It's not just about reading an answer; it's about interacting with data, moving graphs, and taking notes on them.
*   **Accessible:** A powerful tool within reach of any student or teacher with an internet connection.

---

## ✨ Key Features

### 🤖 Specialized AI Assistant (Gemini)
*   **Step-by-Step Solving:** Explains math and physics problems in detail.
*   **Mathematical Formulas:** Professional rendering of equations using LaTeX ($E=mc^2$).
*   **Automatic Graph Generation:** If you ask for a function or physical movement, the AI will automatically generate an interactive widget with the corresponding graph on the whiteboard.

### 🎨 Interactive Digital Whiteboard
*   **Freehand Drawing:** Pen and eraser tools with color and thickness selection for freehand note-taking.
*   **Infinite Canvas:** Move and organize your ideas without limits.
*   **Widget Management:** AI-generated graphs are floating widgets that you can drag and rearrange.

### 📊 Visualization & Export
*   **Dynamic Graphs:** Visualize functions, statistical data, and physics simulations.
*   **Export:** Download individual graphs or a full capture of the whiteboard for your notes or presentations.

---

## 🛠️ Tech Stack

This project is built with a modern and robust stack:

*   **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **AI:** [Google Generative AI SDK](https://ai.google.dev/) (Gemini Flash)
*   **Charting:** [Recharts](https://recharts.org/)
*   **Text Rendering:** React Markdown + KaTeX (for math)
*   **Icons:** Lucide React

---

## 📦 Installation & Usage

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Luisbh-dev/whiteboard-teacher-ai.git
    cd whiteboard-teacher-ai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    *   **Crucial Step:** You need an API Key from [Google AI Studio](https://aistudio.google.com/).
    *   Create a `.env` file in the root directory based on `.env.example`:
        ```bash
        cp .env.example .env
        ```
    *   Add your Google Gemini API Key to the `.env` file:
        ```
        VITE_GEMINI_API_KEY=your_api_key_here
        ```
    *   *Note: The end-user does not need to provide a key if the environment variable is correctly set up during deployment.*

4.  **Run in development**
    ```bash
    npm run dev
    ```

---

## 🤝 Contribution

Contributions are welcome! If you have ideas to improve this educational tool, please open an *issue* or send a *pull request*. Together we can make learning sciences more intuitive and fun.

---

Made with ❤️ for students and teachers of the world.
