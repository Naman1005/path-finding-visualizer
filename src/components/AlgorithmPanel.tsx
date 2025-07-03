import React from 'react';
import { AlgorithmType } from '../types';
import { Zap, BarChart3 } from 'lucide-react';

interface AlgorithmPanelProps {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  isAnimating: boolean;
  statistics?: {
    nodesVisited: number;
    pathLength: number;
    executionTime: number;
    totalCost: number;
  };
}

const ALGORITHMS = [
  { id: 'dijkstra' as AlgorithmType, name: "Dijkstra's", description: 'Weighted shortest path' },
  { id: 'astar' as AlgorithmType, name: 'A* Search', description: 'Heuristic pathfinding' },
  { id: 'bfs' as AlgorithmType, name: 'BFS', description: 'Unweighted shortest' },
  { id: 'dfs' as AlgorithmType, name: 'DFS', description: 'Explores deeply first' },
];

export const AlgorithmPanel: React.FC<AlgorithmPanelProps> = ({
  selectedAlgorithm,
  onAlgorithmChange,
  isAnimating,
  statistics,
}) => {
  return (
    <div className="bg-gray-950 rounded-lg sm:rounded-xl shadow-2xl border border-gray-800 p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6 lg:h-full">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-green-400 mb-1 sm:mb-2">Pathfinding Visualizer</h2>
        <p className="text-xs sm:text-sm text-gray-500">Interactive algorithm visualization</p>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          Algorithm
        </h3>
        <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
          {ALGORITHMS.map((algorithm) => (
            <label key={algorithm.id} className="flex items-start space-x-2 sm:space-x-3 cursor-pointer group">
              <input
                type="radio"
                name="algorithm"
                value={algorithm.id}
                checked={selectedAlgorithm === algorithm.id}
                onChange={() => onAlgorithmChange(algorithm.id)}
                disabled={isAnimating}
                className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-green-500 bg-gray-800 border-gray-700 focus:ring-green-500 focus:ring-2"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-100 text-sm sm:text-base group-hover:text-green-400 transition-colors">
                  {algorithm.name}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {algorithm.description}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {statistics && (
        <div className="border-t border-gray-800 pt-3 sm:pt-4 lg:pt-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            Statistics
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
            <div className="bg-gray-900 rounded-lg p-2 sm:p-3">
              <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">Visited</div>
              <div className="font-semibold text-green-400 text-sm sm:text-lg">{statistics.nodesVisited}</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-2 sm:p-3">
              <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">Length</div>
              <div className="font-semibold text-green-400 text-sm sm:text-lg">{statistics.pathLength}</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-2 sm:p-3">
              <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">Cost</div>
              <div className="font-semibold text-green-400 text-sm sm:text-lg">{statistics.totalCost.toFixed(1)}</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-2 sm:p-3">
              <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">Time</div>
              <div className="font-semibold text-green-400 text-sm sm:text-lg">{statistics.executionTime}ms</div>
            </div>
          </div>
        </div>
      )}

      {/* Hide guide on mobile to save space */}
      <div className="hidden sm:block border-t border-gray-800 pt-3 sm:pt-4 lg:pt-6 text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-2">
        <div className="font-medium text-gray-300 mb-2 sm:mb-3">Quick Guide:</div>
        <div>• Select brush and click/drag to paint</div>
        <div>• Drag start (S) and end (E) to move them</div>
        <div>• Different terrains have movement costs</div>
        <div>• Walls completely block paths</div>
      </div>
    </div>
  );
};