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
    color: 'bg-gray-900 border-2 border-gray-700', 
    textColor: 'text-white',
    selectedStyle: 'ring-2 ring-green-500 bg-gray-900 border-green-500',
    hoverStyle: 'hover:bg-gray-800'
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
    <div className="bg-gray-950 rounded-lg sm:rounded-xl shadow-2xl border border-gray-800 p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col space-y-4 sm:space-y-6 lg:space-y-0 lg:flex-row lg:gap-6 xl:gap-8">
        {/* Brush Selection */}
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
            <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            Terrain Brush
          </h3>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 lg:gap-3">
            {BRUSHES.map((brush) => (
              <button
                key={brush.id}
                onClick={() => onBrushChange(brush.id)}
                disabled={isAnimating}
                className={`p-2 sm:p-3 lg:p-4 rounded-lg transition-all duration-200 ${
                  selectedBrush === brush.id
                    ? brush.selectedStyle
                    : `${brush.color} ${brush.hoverStyle}`
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className={`font-medium text-[10px] sm:text-xs lg:text-sm ${brush.textColor}`}>{brush.name}</div>
                <div className={`text-[9px] sm:text-xs lg:text-sm ${brush.textColor} opacity-75 mt-0.5 sm:mt-1`}>
                  Cost: {brush.cost}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Speed Control */}
        <div className="lg:w-40 xl:w-48">
          <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
            <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            Speed
          </h3>
          <div className="bg-gray-900 rounded-lg p-3 sm:p-4">
            <input
              type="range"
              min="5"
              max="100"
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              disabled={isAnimating}
              className="w-full h-2 sm:h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-dark"
            />
            <div className="text-xs sm:text-sm text-gray-300 mt-2 sm:mt-3 text-center">
              {getSpeedLabel(speed)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="lg:w-48 xl:w-56">
          <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-3 sm:mb-4">Controls</h3>
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={onVisualize}
              disabled={isAnimating}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:from-green-700 hover:to-green-800 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 font-medium transition-all duration-200 shadow-lg text-sm sm:text-base lg:text-lg"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              {isAnimating ? 'Running...' : 'Start'}
            </button>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={onClearPath}
                disabled={isAnimating}
                className="flex-1 bg-gray-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm transition-all duration-200"
              >
                <Square className="w-3 h-3 sm:w-4 sm:h-4" />
                Reset Path
              </button>
              <button
                onClick={onClearGrid}
                disabled={isAnimating}
                className="flex-1 bg-gray-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm transition-all duration-200"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                Reset Grid
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};