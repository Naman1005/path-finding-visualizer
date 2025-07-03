import React from 'react';
import { Node } from '../types';
import { GridNode } from './GridNode';

interface GridProps {
  grid: Node[][];
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
  isAnimating: boolean;
}

export const Grid: React.FC<GridProps> = ({
  grid,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  isAnimating,
}) => {
  const gridRows = grid.length;
  const gridCols = grid[0]?.length || 41;
  
  return (
    <div className="w-full h-full flex justify-center items-center p-2 sm:p-4">
      <div 
        className="border border-gray-700 sm:border-2 bg-black rounded-lg sm:rounded-xl shadow-2xl"
        style={{
          // For mobile: use viewport width primarily, for desktop: balance width and height
          width: 'min(95vw, 100vh * 0.7 * 1.95)', // 1.95 is aspect ratio (41/21)
          height: 'min(95vw * 0.7 / 1.95, 100vh * 0.7)',
          aspectRatio: `${gridCols} / ${gridRows}`,
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        <div 
          className="grid gap-0 w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            gridTemplateRows: `repeat(${gridRows}, 1fr)`,
          }}
        >
          {grid.flat().map((node) => (
            <GridNode
              key={`${node.row}-${node.col}`}
              node={node}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
              onMouseUp={onMouseUp}
              isAnimating={isAnimating}
            />
          ))}
        </div>
      </div>
    </div>
  );
};