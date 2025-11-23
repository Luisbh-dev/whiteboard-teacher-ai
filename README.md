# 🎓 Whiteboard Teacher AI

**Whiteboard Teacher AI** is an interactive educational platform designed to transform the teaching and learning of mathematics and physics. It combines the flexibility of an infinite digital whiteboard with the power of an advanced AI assistant (Google Gemini).

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
    *   You need an API Key from [Google AI Studio](https://aistudio.google.com/).
    *   You can configure it by creating an `.env` file (see `.env.example` if it exists) or by entering it directly in the application interface (stored in `localStorage`).

4.  **Run in development**
    ```bash
    npm run dev
    ```

---

## 🤝 Contribution

Contributions are welcome! If you have ideas to improve this educational tool, please open an *issue* or send a *pull request*. Together we can make learning sciences more intuitive and fun.

---

Made with ❤️ for students and teachers of the world.
