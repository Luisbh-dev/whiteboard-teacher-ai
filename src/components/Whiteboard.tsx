import React, { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Trash2, Move, X, Download, Eraser, Pen, Minus, Plus } from 'lucide-react';
import clsx from 'clsx';
import html2canvas from 'html2canvas';

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  points: Point[];
  color: string;
  width: number;
  isEraser?: boolean;
}

export interface GraphWidget {
  id: string;
  type: 'line' | 'bar';
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  data: any[];
  position: { x: number; y: number };
  width: number;
  height: number;
}

interface WhiteboardProps {
  strokes: Stroke[];
  setStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>;
  widgets: GraphWidget[];
  setWidgets: React.Dispatch<React.SetStateAction<GraphWidget[]>>;
}

const COLORS = ['#000000', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#f97316'];

const Whiteboard: React.FC<WhiteboardProps> = ({ strokes, setStrokes, widgets, setWidgets }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  
  // Tools state
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState(COLORS[0]);
  const [strokeWidth, setStrokeWidth] = useState(3);

  // Widget Dragging State
  const [draggingWidgetId, setDraggingWidgetId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      redraw(ctx);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    redraw(ctx);
  }, [strokes, currentStroke]);

  const redraw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw saved strokes
    [...strokes, currentStroke].forEach(stroke => {
      if (!stroke || stroke.points.length < 2) return;
      
      ctx.beginPath();
      ctx.lineWidth = stroke.width;
      
      if (stroke.isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)'; // Color doesn't matter for destination-out
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
      }

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
    
    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  };

  const getPoint = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // --- Drawing Handlers ---
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent drawing if touching a widget (handled by z-index but good to be safe)
    if ((e.target as HTMLElement).closest('.widget-container')) return;

    setIsDrawing(true);
    const point = getPoint(e);
    setCurrentStroke({
      points: [point],
      color,
      width: strokeWidth,
      isEraser: tool === 'eraser'
    });
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentStroke) return;
    e.preventDefault(); // Prevent scrolling on touch
    const point = getPoint(e);
    setCurrentStroke(prev => prev ? {
      ...prev,
      points: [...prev.points, point]
    } : null);
  };

  const stopDrawing = () => {
    if (!isDrawing || !currentStroke) return;
    setIsDrawing(false);
    setStrokes(prev => [...prev, currentStroke]);
    setCurrentStroke(null);
  };

  // --- Widget Dragging Handlers ---
  const startDragWidget = (e: React.MouseEvent, widgetId: string, currentPos: {x: number, y: number}) => {
    e.stopPropagation();
    setDraggingWidgetId(widgetId);
    setDragOffset({
      x: e.clientX - currentPos.x,
      y: e.clientY - currentPos.y
    });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (draggingWidgetId) {
      e.preventDefault();
      setWidgets(prev => prev.map(w => {
        if (w.id === draggingWidgetId) {
          return {
            ...w,
            position: {
              x: e.clientX - dragOffset.x,
              y: e.clientY - dragOffset.y
            }
          };
        }
        return w;
      }));
    } else if (isDrawing) {
      draw(e);
    }
  };

  const onMouseUp = () => {
    setDraggingWidgetId(null);
    stopDrawing();
  };

  // --- Actions ---
  const deleteWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  const downloadWidget = async (widgetId: string, title: string) => {
    const element = document.getElementById(`widget-${widgetId}`);
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2 // Better resolution
      });
      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Error downloading widget:", error);
    }
  };

  const downloadBoard = async () => {
    const container = document.getElementById('whiteboard-container');
    if (!container) return;
    
    try {
      const canvas = await html2canvas(container, {
        backgroundColor: '#f8fafc', // slate-50
        scale: 2,
        ignoreElements: (element) => element.classList.contains('exclude-from-capture')
      });
      
      const link = document.createElement('a');
      link.download = `whiteboard-full-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Error downloading board:", error);
    }
  };

  return (
    <div 
      id="whiteboard-container"
      className="relative w-full h-full bg-slate-50 overflow-hidden touch-none"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <canvas
        ref={canvasRef}
        className={clsx(
          "absolute top-0 left-0 z-10",
          tool === 'eraser' ? "cursor-cell" : "cursor-crosshair"
        )}
        onMouseDown={startDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      
      {/* Widget Layer */}
      <div className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none">
        {widgets.map(widget => (
          <div
            id={`widget-${widget.id}`}
            key={widget.id}
            className="widget-container absolute bg-white rounded-lg shadow-2xl border border-indigo-100 pointer-events-auto flex flex-col overflow-hidden"
            style={{
              left: widget.position.x,
              top: widget.position.y,
              width: widget.width,
              height: widget.height,
              cursor: draggingWidgetId === widget.id ? 'grabbing' : 'default'
            }}
          >
            {/* Widget Header */}
            <div 
              className="bg-indigo-50 p-2 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-indigo-100"
              onMouseDown={(e) => startDragWidget(e, widget.id, widget.position)}
            >
              <div className="flex items-center gap-2 text-indigo-700">
                <Move className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wide">{widget.title}</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => downloadWidget(widget.id, widget.title)}
                  className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                  title="Descargar Gráfica"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteWidget(widget.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Cerrar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Widget Content */}
            <div className="flex-1 p-2 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                {widget.type === 'line' ? (
                  <LineChart data={widget.data} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={12} 
                      tick={{fill: '#64748b'}}
                      label={{ value: widget.xAxisLabel, position: 'bottom', offset: 0, fill: '#475569', fontSize: 12 }} 
                    />
                    <YAxis 
                      fontSize={12} 
                      tick={{fill: '#64748b'}}
                      label={{ value: widget.yAxisLabel, angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="top" height={36}/>
                    {Object.keys(widget.data[0] || {}).filter(k => k !== 'name').map((key, idx) => (
                      <Line 
                        key={key} 
                        type="monotone" 
                        dataKey={key} 
                        stroke={`hsl(${idx * 137.5 % 360}, 70%, 50%)`}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                        name={key} // This is used for the legend
                      />
                    ))}
                  </LineChart>
                ) : (
                  <BarChart data={widget.data} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={12} 
                      tick={{fill: '#64748b'}}
                      label={{ value: widget.xAxisLabel, position: 'bottom', offset: 0, fill: '#475569', fontSize: 12 }} 
                    />
                    <YAxis 
                      fontSize={12} 
                      tick={{fill: '#64748b'}}
                      label={{ value: widget.yAxisLabel, angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="top" height={36}/>
                    {Object.keys(widget.data[0] || {}).filter(k => k !== 'name').map((key, idx) => (
                      <Bar 
                        key={key} 
                        dataKey={key} 
                        fill={`hsl(${idx * 137.5 % 360}, 70%, 50%)`} 
                        radius={[4, 4, 0, 0]}
                        name={key}
                      />
                    ))}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="exclude-from-capture absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur p-2 rounded-2xl shadow-xl border border-gray-200 z-30 flex items-center gap-4">
        {/* Tool Switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setTool('pen')}
            className={clsx("p-2 rounded-lg transition-all", tool === 'pen' ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700")}
            title="Lápiz"
          >
            <Pen className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={clsx("p-2 rounded-lg transition-all", tool === 'eraser' ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700")}
            title="Borrador"
          >
            <Eraser className="w-5 h-5" />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-200" />

        {/* Color Picker */}
        <div className="flex items-center gap-2">
           {COLORS.map(c => (
             <button
              key={c}
              onClick={() => { setColor(c); setTool('pen'); }}
              className={clsx(
                "w-6 h-6 rounded-full border-2 transition-all transform hover:scale-110",
                color === c && tool === 'pen' ? "border-indigo-600 scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
              title={c}
             />
           ))}
        </div>

        <div className="w-px h-8 bg-gray-200" />

        {/* Stroke Width */}
        <div className="flex items-center gap-2">
          <button onClick={() => setStrokeWidth(Math.max(1, strokeWidth - 1))} className="p-1 hover:bg-gray-100 rounded">
            <Minus className="w-4 h-4 text-gray-500" />
          </button>
          <div className="w-8 text-center font-medium text-sm text-gray-600">{strokeWidth}</div>
          <button onClick={() => setStrokeWidth(Math.min(20, strokeWidth + 1))} className="p-1 hover:bg-gray-100 rounded">
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-200" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setStrokes([])} 
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Borrar Todo"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button 
            onClick={downloadBoard}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Descargar Imagen"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
