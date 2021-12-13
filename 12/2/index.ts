import * as fs from "fs";

type node = { small: boolean; connected: node[]; name: string };

function isSmall(name: string): boolean {
  return name == name.toLowerCase();
}

function generatePaths(start: node, end: node): node[][] {
  return start.connected.flatMap((node) => genratePathsTo([start, node], end));
}

function validNextNode(currentPath: node[], nextMove: node): boolean {
  // is start
  if (nextMove.name === currentPath[0].name) {
    return false;
  }

  if (nextMove.small) {
    const visitedBefore = currentPath.find((o) => o.name == nextMove.name);
    if (!visitedBefore) {
      return true;
    }

    const visitedTwoSmall = currentPath.some(
      (node) =>
        node.small && currentPath.filter((n) => n.name == node.name).length == 2
    );
    if (visitedTwoSmall) {
      return false;
    }
  }

  return true;
}

function genratePathsTo(currentPath: node[], end: node): node[][] {
  // current position
  const head = currentPath[currentPath.length - 1];

  // valid moves where node isn't small and visited before
  const potentialMoves = head.connected.filter((node) =>
    validNextNode(currentPath, node)
  );

  return potentialMoves.flatMap(
    (node) =>
      node == end
        ? [[...currentPath, node]] // if end, finish route
        : genratePathsTo([...currentPath, node], end) // if not, generate paths from
  );
}

const nodes = fs
  .readFileSync("input", "utf8")
  .split("\n")
  .reduce((nodes, nodePair) => {
    const currentNodes: node[] = [];
    nodePair.split("-").forEach((nodeName) => {
      let newNode = false;
      let currentNode: node | undefined = nodes.find((n) => n.name == nodeName);
      if (!currentNode) {
        newNode = true;
        currentNode = {
          small: isSmall(nodeName),
          connected: [],
          name: nodeName,
        };
      }

      // create connections
      currentNodes.forEach((n) => {
        n.connected.push(currentNode!);
        currentNode!.connected.push(n);
      });
      currentNodes.push(currentNode);
      if (newNode) {
        nodes.push(currentNode);
      }
    });
    return nodes;
  }, new Array<node>());

console.log(
  generatePaths(
    nodes.find((o) => o.name == "start")!,
    nodes.find((o) => o.name == "end")!
  ).length
);
