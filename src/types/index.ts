export interface Node {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  distance: number;
  previousNode: Node | null;
  heuristic?: number;
  totalCost?: number;
  terrain: TerrainType;
}

export type TerrainType = 'normal' | 'sand' | 'water' | 'mountain';

export type BrushType = 'wall' | 'normal' | 'sand' | 'water' | 'mountain';

export type AlgorithmType = 'dijkstra' | 'astar' | 'bfs' | 'dfs';

export interface AlgorithmResult {
  visitedNodes: Node[];
  shortestPath: Node[];
  statistics: {
    nodesVisited: number;
    pathLength: number;
    executionTime: number;
    totalCost: number;
  };
}

export interface GridDimensions {
  rows: number;
  cols: number;
}