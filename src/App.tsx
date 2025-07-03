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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 p-2 sm:p-4 lg:p-6">
      <div className="w-full min-h-screen flex flex-col">
        {/* Mobile Layout: Stack vertically */}
        <div className="flex flex-col lg:hidden gap-3 sm:gap-4">
          {/* Algorithm Panel - Compact on mobile */}
          <div className="flex-shrink-0">
            <AlgorithmPanel
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={setSelectedAlgorithm}
              isAnimating={isAnimating}
              statistics={statistics}
            />
          </div>

          {/* Grid - Takes remaining space but with minimum height */}
          <div className="bg-gray-950 rounded-lg sm:rounded-xl shadow-2xl border border-gray-800 flex-shrink-0" 
               style={{ minHeight: '300px', height: 'min(60vh, 400px)' }}>
            <div 
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-full"
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

          {/* Controls Panel - Fixed at bottom */}
          <div className="flex-shrink-0">
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

        {/* Desktop Layout: Side by side */}
        <div className="hidden lg:flex lg:flex-row gap-6 h-screen max-h-screen">
          {/* Left Panel - Algorithm Selection & Instructions */}
          <div className="lg:w-80 xl:w-96 w-full lg:max-h-full lg:overflow-y-auto flex-shrink-0">
            <AlgorithmPanel
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={setSelectedAlgorithm}
              isAnimating={isAnimating}
              statistics={statistics}
            />
          </div>

          {/* Main Content - Grid & Bottom Controls */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0 gap-6">
            {/* Grid Container - Takes most of the available space */}
            <div className="bg-gray-950 rounded-xl shadow-2xl border border-gray-800 flex-1 min-h-0 overflow-hidden">
              <div 
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full"
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

            {/* Bottom Panel - Brush Controls & Run Controls - Fixed height */}
            <div className="flex-shrink-0">
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
    </div>
  );
}

export default App;