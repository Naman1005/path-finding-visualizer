import React, { useState, useEffect } from 'react';
import { Grid } from './components/Grid';
import { AlgorithmPanel } from './components/AlgorithmPanel';
import { BrushPanel } from './components/BrushPanel';
import { usePathfindingGrid } from './hooks/usePathfindingGrid';
import { AlgorithmType, BrushType } from './types';

const GRID_DIMENSIONS = { rows: 21, cols: 41 };

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('dijkstra');
  const [selectedBrush, setSelectedBrush] = useState<BrushType>('wall');
  const [speed, setSpeed] = useState(25); // Faster default speed

  const {
    grid,
    isAnimating,
    statistics,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    visualizeAlgorithm,
    resetGrid,
    clearPath,
  } = usePathfindingGrid(GRID_DIMENSIONS);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center p-6">
      <div className="w-full max-w-[95vw] h-full max-h-[95vh]">
        <div className="flex flex-col xl:flex-row gap-8 h-full">
          {/* Left Panel - Algorithm Selection & Instructions */}
          <div className="xl:w-96 w-full order-2 xl:order-1">
            <AlgorithmPanel
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={setSelectedAlgorithm}
              isAnimating={isAnimating}
              statistics={statistics}
            />
          </div>

          {/* Main Content - Grid & Bottom Controls */}
          <div className="flex-1 order-1 xl:order-2 space-y-8 flex flex-col">
            {/* Grid */}
            <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-8 flex justify-center flex-1">
              <div className="overflow-auto flex items-center justify-center">
                <div 
                  onContextMenu={(e) => e.preventDefault()}
                  className="inline-block"
                >
                  <Grid
                    grid={grid}
                    onMouseDown={(row, col) => handleMouseDown(row, col, selectedBrush)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col, selectedBrush)}
                    onMouseUp={handleMouseUp}
                    isAnimating={isAnimating}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Panel - Brush Controls & Run Controls */}
            <BrushPanel
              selectedBrush={selectedBrush}
              onBrushChange={setSelectedBrush}
              speed={speed}
              onSpeedChange={setSpeed}
              onVisualize={() => visualizeAlgorithm(selectedAlgorithm, speed)}
              onClearPath={clearPath}
              onClearGrid={resetGrid}
              isAnimating={isAnimating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;