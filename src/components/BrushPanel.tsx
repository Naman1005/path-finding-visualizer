import React from 'react';
import { BrushType } from '../types';
import { Play, Square, RotateCcw, Palette, Gauge } from 'lucide-react';

interface BrushPanelProps {
  selectedBrush: BrushType;
  onBrushChange: (brush: BrushType) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onVisualize: () => void;
  onClearPath: () => void;
  onClearGrid: () => void;
  isAnimating: boolean;
}

const BRUSHES = [
  { 
    id: 'wall' as BrushType, 
    name: 'Wall', 
    cost: '∞', 
    color: 'bg-black border-2 border-gray-600', 
    textColor: 'text-white',
    selectedStyle: 'ring-2 ring-green-500 bg-black border-green-500',
    hoverStyle: 'hover:bg-gray-900'
  },
  { 
    id: 'normal' as BrushType, 
    name: 'Normal', 
    cost: 1, 
    color: 'bg-gray-100 border-2 border-gray-300', 
    textColor: 'text-gray-900',
    selectedStyle: 'ring-2 ring-green-500 bg-gray-200 border-green-500',
    hoverStyle: 'hover:bg-gray-200'
  },
  { 
    id: 'sand' as BrushType, 
    name: 'Sand', 
    cost: 2, 
    color: 'bg-yellow-200 border-2 border-yellow-300', 
    textColor: 'text-yellow-900',
    selectedStyle: 'ring-2 ring-green-500 bg-yellow-300 border-green-500',
    hoverStyle: 'hover:bg-yellow-300'
  },
  { 
    id: 'water' as BrushType, 
    name: 'Water', 
    cost: 3, 
    color: 'bg-cyan-200 border-2 border-cyan-300', 
    textColor: 'text-cyan-900',
    selectedStyle: 'ring-2 ring-green-500 bg-cyan-300 border-green-500',
    hoverStyle: 'hover:bg-cyan-300'
  },
  { 
    id: 'mountain' as BrushType, 
    name: 'Mountain', 
    cost: 4, 
    color: 'bg-gray-400 border-2 border-gray-500', 
    textColor: 'text-gray-900',
    selectedStyle: 'ring-2 ring-green-500 bg-gray-500 border-green-500',
    hoverStyle: 'hover:bg-gray-500'
  },
];

const getSpeedLabel = (speed: number): string => {
  if (speed <= 20) return 'very slow';
  if (speed <= 40) return 'slow';
  if (speed <= 60) return 'medium';
  if (speed <= 80) return 'fast';
  return 'very fast';
};

export const BrushPanel: React.FC<BrushPanelProps> = ({
  selectedBrush,
  onBrushChange,
  speed,
  onSpeedChange,
  onVisualize,
  onClearPath,
  onClearGrid,
  isAnimating,
}) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-6">
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Brush Selection */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-green-500" />
            Terrain Brush
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {BRUSHES.map((brush) => (
              <button
                key={brush.id}
                onClick={() => onBrushChange(brush.id)}
                disabled={isAnimating}
                className={`p-4 rounded-lg transition-all duration-200 ${
                  selectedBrush === brush.id
                    ? brush.selectedStyle
                    : `${brush.color} ${brush.hoverStyle}`
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className={`font-medium text-sm ${brush.textColor}`}>{brush.name}</div>
                <div className={`text-sm ${brush.textColor} opacity-75 mt-1`}>
                  Cost: {brush.cost}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Speed Control */}
        <div className="xl:w-48">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-green-500" />
            Speed
          </h3>
          <div className="bg-gray-700 rounded-lg p-4">
            <input
              type="range"
              min="5"
              max="100"
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              disabled={isAnimating}
              className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-dark"
            />
            <div className="text-sm text-gray-300 mt-3 text-center">
              {getSpeedLabel(speed)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="xl:w-56">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Controls</h3>
          <div className="space-y-3">
            <button
              onClick={onVisualize}
              disabled={isAnimating}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-lg hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-medium transition-all duration-200 shadow-lg text-lg"
            >
              <Play className="w-5 h-5" />
              {isAnimating ? 'Running...' : 'Start'}
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClearPath}
                disabled={isAnimating}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm transition-all duration-200"
              >
                <Square className="w-4 h-4" />
                Reset Path
              </button>
              <button
                onClick={onClearGrid}
                disabled={isAnimating}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Grid
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};