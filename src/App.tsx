import { useState } from 'react';
import Whiteboard, { Stroke, GraphWidget } from './components/Whiteboard';
import Chat, { Message } from './components/Chat';
import { sendToGemini } from './lib/gemini';
import { Menu, X, Key } from 'lucide-react';

function App() {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [widgets, setWidgets] = useState<GraphWidget[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY || '');
  const [showApiKeyModal, setShowApiKeyModal] = useState(!apiKey);

  // Save API key to localStorage if user enters it
  const handleApiKeySave = (key: string) => {
    localStorage.setItem('GEMINI_API_KEY', key);
    setApiKey(key);
    setShowApiKeyModal(false);
    // Reload to pick up the new env var logic effectively? 
    // Actually we need to pass it to gemini.ts or update how gemini.ts works.
    // Since gemini.ts reads from import.meta.env at top level, we might need to refactor it to accept a key.
    // For now, I'll just force a reload if they enter it, or better, update gemini.ts to export a setup function.
    window.location.reload(); 
  };

  const findFreePosition = (width: number, height: number) => {
    const GAP = 20;
    const START_X = 50;
    const START_Y = 50;
    
    // Try to find a spot in a grid layout
    // We scan rows and columns
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const x = START_X + col * (width + GAP);
        const y = START_Y + row * (height + GAP);
        
        // Check if out of bounds (right side)
        // We allow vertical scroll, so we don't check bottom bound strictly, but we check right bound
        if (col > 0 && x + width > window.innerWidth - 350) { // -350 to account for chat sidebar
          break; // Go to next row
        }
        
        // Check collision with ALL existing widgets
        const hasCollision = widgets.some(w => {
          return (
            x < w.position.x + w.width + GAP &&
            x + width > w.position.x - GAP &&
            y < w.position.y + w.height + GAP &&
            y + height > w.position.y - GAP
          );
        });
        
        if (!hasCollision) {
          return { x, y };
        }
      }
    }
    
    // Fallback: Cascade with random offset if screen is totally full
    return { x: START_X + Math.random() * 50, y: START_Y + Math.random() * 50 };
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const systemPrompt = `
        Eres un asistente matemático y físico experto que utiliza una pizarra digital.
        Tu objetivo es ayudar al usuario con problemas matemáticos/físicos complejos y visualizar los resultados SIEMPRE que sea posible.
        
        INSTRUCCIONES DE FORMATO:
        1. Primero, explica el problema y resuélvelo paso a paso.
        2. Usa LaTeX para fórmulas: $E=mc^2$ o $$ x(t) = ... $$
        3. AL FINAL del todo, genera el JSON para la gráfica si aplica.

        SOBRE LAS GRÁFICAS (OBLIGATORIO SI HAY DATOS/FUNCIONES):
        - Si el problema implica una función, movimiento o comparación, DEBES generar una gráfica.
        - Genera el JSON al final de tu respuesta.
        - No hables sobre el JSON, solo genéralo.
        
        FORMATO JSON:
        \`\`\`json
        {
          "type": "widget",
          "widgetType": "line", 
          "title": "Velocidad vs Tiempo",
          "xAxisLabel": "Tiempo (s)", // OBLIGATORIO: Etiqueta eje X con unidad
          "yAxisLabel": "Velocidad (m/s)", // OBLIGATORIO: Etiqueta eje Y con unidad
          "data": [
            { "name": "0.0", "Velocidad": 0, "Velocidad Ideal": 0.1 }, // Claves descriptivas para la leyenda
            { "name": "0.5", "Velocidad": 10, "Velocidad Ideal": 12 },
            ...
          ],
          "x": 50,
          "y": 50,
          "width": 500,
          "height": 400
        }
        \`\`\`
        
        IMPORTANTE:
        - Usa nombres de claves en 'data' que sirvan de leyenda (ej: "Posición", "Energía").
        - SIEMPRE incluye las unidades en xAxisLabel y yAxisLabel.
        - Responde en español.
      `;

      // We need to pass the history properly
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const rawResponse = await sendToGemini(history, text, systemPrompt);

      // Parse response for JSON
      // Try to match JSON block, handling potential markdown code block variations
      const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/) || rawResponse.match(/```\s*([\s\S]*?)\s*```/);
      let cleanText = rawResponse;
      let widgetCreated = false;
      
      if (jsonMatch) {
        try {
          let jsonString = jsonMatch[1].trim();
          // Attempt to repair truncated JSON if necessary (basic check)
          if (jsonString.startsWith('{') && !jsonString.endsWith('}')) {
            jsonString += ']} }'; // Best guess closing for our specific widget structure
          }
          
          const jsonContent = JSON.parse(jsonString);
          
          // Remove the JSON block from the text displayed to user
          // We use the full match to remove it completely
          cleanText = rawResponse.replace(jsonMatch[0], '').trim();
          
          if (jsonContent.type === 'widget') {
            const width = jsonContent.width || 400;
            const height = jsonContent.height || 300;
            
            // Calculate best position ignoring AI's suggested x/y to prevent overlap
            const position = findFreePosition(width, height);

            const newWidget: GraphWidget = {
              id: Date.now().toString(),
              type: jsonContent.widgetType || 'line',
              title: jsonContent.title || 'Gráfica',
              xAxisLabel: jsonContent.xAxisLabel,
              yAxisLabel: jsonContent.yAxisLabel,
              data: jsonContent.data || [],
              position: position,
              width: width,
              height: height
            };
            setWidgets(prev => [...prev, newWidget]);
            widgetCreated = true;
          }
        } catch (e) {
          console.error("Error parsing JSON from Gemini", e);
          // Don't remove text if we failed to parse the widget, so user can at least see the raw data
        }
      } else {
        // Fallback: Look for raw JSON object at the end of the string if no code blocks used
        const lastBraceIndex = rawResponse.lastIndexOf('}');
        const firstBraceIndex = rawResponse.indexOf('{');
        
        if (lastBraceIndex > firstBraceIndex && firstBraceIndex !== -1) {
           // This is risky but might catch cases where model forgets code blocks
           // Implementation skipped for safety to avoid parsing normal text as JSON
        }
      }

      // Fallback if text is empty but widget exists
      if (!cleanText && widgetCreated) {
        cleanText = "He generado una gráfica con los resultados en la pizarra.";
      } else if (!cleanText) {
        cleanText = "Aquí tienes la respuesta (revisa la pizarra).";
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: cleanText }]);
    } catch (error: any) {
      let errorMessage = "Lo siento, hubo un error al conectar con Gemini.";
      
      if (error.message) {
        if (error.message.includes('API key')) {
          errorMessage += " La API Key parece ser inválida.";
          setShowApiKeyModal(true); // Reopen modal if key is invalid
        } else {
          errorMessage += ` Detalle: ${error.message}`;
        }
      }
      
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: errorMessage }]);
      console.error("Gemini Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearBoard = () => {
    setStrokes([]);
    setWidgets([]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Key className="w-5 h-5" /> Configurar API Key
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Para usar Gemini Flash, necesitas una API Key de Google AI Studio.
            </p>
            <input
              type="password"
              placeholder="Pegar API Key aquí..."
              className="w-full p-2 border rounded mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleApiKeySave((e.target as HTMLInputElement).value);
              }}
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowApiKeyModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancelar
              </button>
              <button 
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement;
                  handleApiKeySave(input.value);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative flex-1 h-full">
        <Whiteboard 
          strokes={strokes} 
          setStrokes={setStrokes} 
          widgets={widgets}
          setWidgets={setWidgets}
        />
        
        {/* Floating Action Button for Chat */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="absolute top-4 right-4 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 z-30"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        
        {/* Settings Button */}
        <button
            onClick={() => setShowApiKeyModal(true)}
            className="absolute bottom-4 left-4 p-2 bg-white/80 backdrop-blur text-gray-600 rounded-full shadow hover:bg-white transition-colors z-30"
            title="Configurar API Key"
          >
            <Key className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-full z-40 transition-transform duration-300 ease-in-out shadow-2xl ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full relative">
          <button
            onClick={() => setIsChatOpen(false)}
            className="absolute top-2 -left-10 p-2 bg-white text-gray-600 rounded-l-lg shadow-md hover:bg-gray-50"
          >
            <X className="w-5 h-5" />
          </button>
          <Chat 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
            onClearBoard={clearBoard}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
