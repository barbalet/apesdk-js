/*
 * render.js
 * JavaScript logical renderer
 * Replaces all C/OpenGL render paths
 */

export class RenderGraph {
  constructor() {
    this.nodes = [];
    this.edges = [];
  }
  clear() {
    this.nodes.length = 0;
    this.edges.length = 0;
  }
  addNode(id, x, y, data = null) {
    this.nodes.push({ id, x, y, data });
  }
  addEdge(a, b, data = null) {
    this.edges.push({ a, b, data });
  }
}

export class RenderFrame {
  constructor() {
    this.graph = new RenderGraph();
    this.time = 0;
  }
  reset(time = 0) {
    this.time = time;
    this.graph.clear();
  }
}

export class NullRenderer {
  constructor() {
    this.frame = new RenderFrame();
  }
  beginFrame(time = 0) {
    this.frame.reset(time);
  }
  drawEntity(id, x, y, state = null) {
    this.frame.graph.addNode(id, x, y, state);
  }
  drawLink(a, b, state = null) {
    this.frame.graph.addEdge(a, b, state);
  }
  endFrame() {}
}

export class ConsoleRenderer extends NullRenderer {
  constructor({ maxEntities = 32 } = {}) {
    super();
    this.maxEntities = maxEntities | 0;
  }
  endFrame() {
    console.log("FRAME", this.frame.time);
    const nodes = this.frame.graph.nodes;
    const limit = Math.min(nodes.length, this.maxEntities);
    for (let i = 0; i < limit; i++) {
      const n = nodes[i];
      console.log(`ENTITY ${n.id} @ (${n.x.toFixed(2)}, ${n.y.toFixed(2)})`);
    }
    if (nodes.length > limit) {
      console.log(`... ${nodes.length - limit} more`);
    }
  }
}
