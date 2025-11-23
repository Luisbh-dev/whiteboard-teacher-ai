# 🎓 Whiteboard Teacher AI

**Whiteboard Teacher AI** es una plataforma educativa interactiva diseñada para transformar la enseñanza y el aprendizaje de las matemáticas y la física. Combina la flexibilidad de una pizarra digital infinita con la potencia de un asistente de Inteligencia Artificial avanzado (Google Gemini).

## 🚀 Misión: Apoyar la Educación

Nuestro objetivo principal es **democratizar el acceso a la tutoría personalizada** y **mejorar la comprensión de conceptos complejos** a través de la visualización. Creemos que la educación debe ser:

*   **Visual:** Los conceptos abstractos se entienden mejor cuando se ven. Por eso, nuestra IA no solo explica, sino que *grafica* y *dibuja*.
*   **Interactiva:** No es solo leer una respuesta; es interactuar con los datos, mover las gráficas y tomar notas sobre ellas.
*   **Accesible:** Una herramienta potente al alcance de cualquier estudiante o profesor con conexión a internet.

---

## ✨ Características Principales

### 🤖 Asistente IA Especializado (Gemini)
*   **Resolución Paso a Paso:** Explica problemas de matemáticas y física detalladamente.
*   **Fórmulas Matemáticas:** Renderizado profesional de ecuaciones usando LaTeX ($E=mc^2$).
*   **Generación Automática de Gráficas:** Si preguntas por una función o un movimiento físico, la IA generará automáticamente un widget interactivo con la gráfica correspondiente en la pizarra.

### 🎨 Pizarra Digital Interactiva
*   **Dibujo Libre:** Herramientas de lápiz y borrador con selección de colores y grosores para tomar notas a mano alzada.
*   **Espacio Infinito:** Mueve y organiza tus ideas sin límites.
*   **Gestión de Widgets:** Las gráficas generadas por la IA son widgets flotantes que puedes arrastrar y reorganizar.

### 📊 Visualización y Exportación
*   **Gráficas Dinámicas:** Visualiza funciones, datos estadísticos y simulaciones físicas.
*   **Exportación:** Descarga tus gráficas individuales o una captura completa de la pizarra para tus apuntes o presentaciones.

---

## 🛠️ Tecnologías

Este proyecto está construido con un stack moderno y robusto:

*   **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
*   **IA:** [Google Generative AI SDK](https://ai.google.dev/) (Gemini Flash)
*   **Gráficas:** [Recharts](https://recharts.org/)
*   **Renderizado de Texto:** React Markdown + KaTeX (para matemáticas)
*   **Iconos:** Lucide React

---

## 📦 Instalación y Uso

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/Luisbh-dev/whiteboard-teacher-ai.git
    cd whiteboard-teacher-ai
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configurar API Key**
    *   Necesitas una API Key de [Google AI Studio](https://aistudio.google.com/).
    *   Puedes configurarla creando un archivo `.env` (ver `.env.example` si existiera) o ingresándola directamente en la interfaz de la aplicación (se guarda en `localStorage`).

4.  **Ejecutar en desarrollo**
    ```bash
    npm run dev
    ```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar esta herramienta educativa, por favor abre un *issue* o envía un *pull request*. Juntos podemos hacer que el aprendizaje de las ciencias sea más intuitivo y divertido.

---

Hecho con ❤️ para estudiantes y profesores del mundo.
