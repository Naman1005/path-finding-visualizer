import { Node, AlgorithmResult, TerrainType } from '../types';

const TERRAIN_COSTS: Record<TerrainType, number> = {
  normal: 1,
  sand: 2,
  water: 3,
  mountain: 4,
};

export function dijkstra(grid: Node[][], startNode: Node, endNode: Node): AlgorithmResult {
  const startTime = performance.now();
  const visitedNodes: Node[] = [];
  const unvisitedNodes = getAllNodes(grid);
  
  startNode.distance = 0;
  
  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift()!;
    
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) break;
    
    closestNode.isVisited = true;
    visitedNodes.push(closestNode);
    
    if (closestNode === endNode) break;
    
    updateUnvisitedNeighbors(closestNode, grid);
  }
  
  const shortestPath = getShortestPath(endNode);
  const executionTime = performance.now() - startTime;
  
  return {
    visitedNodes,
    shortestPath,
    statistics: {
      nodesVisited: visitedNodes.length,
      pathLength: shortestPath.length,
      executionTime: Math.round(executionTime * 100) / 100,
      totalCost: endNode.distance,
    },
  };
}

export function aStar(grid: Node[][], startNode: Node, endNode: Node): AlgorithmResult {
  const startTime = performance.now();
  const visitedNodes: Node[] = [];
  const openSet: Node[] = [startNode];
  const closedSet: Set<Node> = new Set();
  
  startNode.distance = 0;
  startNode.heuristic = calculateHeuristic(startNode, endNode);
  startNode.totalCost = startNode.distance + startNode.heuristic;
  
  while (openSet.length > 0) {
    openSet.sort((a, b) => (a.totalCost || 0) - (b.totalCost || 0));
    const currentNode = openSet.shift()!;
    
    if (currentNode === endNode) break;
    if (currentNode.isWall) continue;
    
    closedSet.add(currentNode);
    currentNode.isVisited = true;
    visitedNodes.push(currentNode);
    
    const neighbors = getNeighbors(currentNode, grid);
    
    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor) || neighbor.isWall) continue;
      
      const tentativeDistance = currentNode.distance + TERRAIN_COSTS[neighbor.terrain];
      
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeDistance >= neighbor.distance) {
        continue;
      }
      
      neighbor.previousNode = currentNode;
      neighbor.distance = tentativeDistance;
      neighbor.heuristic = calculateHeuristic(neighbor, endNode);
      neighbor.totalCost = neighbor.distance + neighbor.heuristic;
    }
  }
  
  const shortestPath = getShortestPath(endNode);
  const executionTime = performance.now() - startTime;
  
  return {
    visitedNodes,
    shortestPath,
    statistics: {
      nodesVisited: visitedNodes.length,
      pathLength: shortestPath.length,
      executionTime: Math.round(executionTime * 100) / 100,
      totalCost: endNode.distance,
    },
  };
}

export function bfs(grid: Node[][], startNode: Node, endNode: Node): AlgorithmResult {
  const startTime = performance.now();
  const visitedNodes: Node[] = [];
  const queue: Node[] = [startNode];
  
  startNode.distance = 0;
  startNode.isVisited = true;
  
  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    visitedNodes.push(currentNode);
    
    if (currentNode === endNode) break;
    
    const neighbors = getNeighbors(currentNode, grid);
    
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.isVisited = true;
        neighbor.distance = currentNode.distance + 1;
        neighbor.previousNode = currentNode;
        queue.push(neighbor);
      }
    }
  }
  
  const shortestPath = getShortestPath(endNode);
  const executionTime = performance.now() - startTime;
  
  return {
    visitedNodes,
    shortestPath,
    statistics: {
      nodesVisited: visitedNodes.length,
      pathLength: shortestPath.length,
      executionTime: Math.round(executionTime * 100) / 100,
      totalCost: shortestPath.length - 1,
    },
  };
}

export function dfs(grid: Node[][], startNode: Node, endNode: Node): AlgorithmResult {
  const startTime = performance.now();
  const visitedNodes: Node[] = [];
  const stack: Node[] = [startNode];
  
  startNode.distance = 0;
  
  while (stack.length > 0) {
    const currentNode = stack.pop()!;
    
    if (currentNode.isVisited || currentNode.isWall) continue;
    
    currentNode.isVisited = true;
    visitedNodes.push(currentNode);
    
    if (currentNode === endNode) break;
    
    const neighbors = getNeighbors(currentNode, grid);
    
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.distance = currentNode.distance + 1;
        neighbor.previousNode = currentNode;
        stack.push(neighbor);
      }
    }
  }
  
  const shortestPath = getShortestPath(endNode);
  const executionTime = performance.now() - startTime;
  
  return {
    visitedNodes,
    shortestPath,
    statistics: {
      nodesVisited: visitedNodes.length,
      pathLength: shortestPath.length,
      executionTime: Math.round(executionTime * 100) / 100,
      totalCost: shortestPath.length - 1,
    },
  };
}

// Helper functions
function getAllNodes(grid: Node[][]): Node[] {
  const nodes: Node[] = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function sortNodesByDistance(unvisitedNodes: Node[]): void {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node: Node, grid: Node[][]): void {
  const unvisitedNeighbors = getNeighbors(node, grid).filter(
    neighbor => !neighbor.isVisited
  );
  
  for (const neighbor of unvisitedNeighbors) {
    const newDistance = node.distance + TERRAIN_COSTS[neighbor.terrain];
    if (newDistance < neighbor.distance) {
      neighbor.distance = newDistance;
      neighbor.previousNode = node;
    }
  }
}

function getNeighbors(node: Node, grid: Node[][]): Node[] {
  const neighbors: Node[] = [];
  const { row, col } = node;
  
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
  return neighbors;
}

function getShortestPath(endNode: Node): Node[] {
  const shortestPath: Node[] = [];
  let currentNode: Node | null = endNode;
  
  while (currentNode !== null) {
    shortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  
  return shortestPath;
}

function calculateHeuristic(nodeA: Node, nodeB: Node): number {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}