import React, { useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';

const FAKETASKS = [
  { id: 'task-1', name: 'Design UI', dependsOn: [], priority: 1 },
  { id: 'task-2', name: 'Set up Backend', dependsOn: ['task-1'], priority: 2 },
  { id: 'task-3', name: 'API Integration', dependsOn: ['task-1', 'task-2'], priority: 3 },
  { id: 'task-4', name: 'Unit Testing', dependsOn: ['task-3'], priority: 4 },
  { id: 'task-5', name: 'Deployment', dependsOn: ['task-3', 'task-4'], priority: 5 },
];

/**
 * Get the color based on the priority
 * @param priority  The priority of the task
 * @returns  The color code based on the priority, default is blue
 */
const getPriorityColor = (priority: number) => {
  const colors: { [key: number]: string } = {
    1: '#ff4d4d',
    2: '#ffcc00',
    3: '#3399ff',
    4: '#33cc33',
    5: '#999999',
  };
  // Return blue color if priority is not in the list
  return colors[priority] || '#007bff';
};

/**
 * Represents the RoadmapGraph component.
 * It displays the project roadmap in a graph view.
 *   - Each task is represented as a node
 *   - Each dependency is represented as an edge
 *     - Edges are directed from the dependent task to the task it depends on
 *   - The color of the node is based on the priority of the task
 *   - The higher the priority, the darker the color
 * @returns The RoadmapGraph component
 */
const RoadmapGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  // Initialize the network graph
  useEffect(() => {
    if (!containerRef.current) return;

    // Create a new DataSet for nodes
    const nodes = new DataSet(
      FAKETASKS.map(task => ({
        id: task.id,
        label: `${task.name}\n(Priority ${task.priority})`,
        shape: 'box',
        color: { background: getPriorityColor(task.priority), border: '#000' },
        font: { color: '#fff' },
        title: `Task: ${task.name}\nPriority: ${task.priority}`,
      })),
    );

    // Create a new DataSet for edges
    // If Task B depends on Task A, then there is an edge from A->B
    const edges = new DataSet(
      FAKETASKS.flatMap((task, index) =>
        task.dependsOn.map(dep => ({
          id: `edge-${index}-${dep}-${task.id}`,
          from: dep,
          to: task.id,
          arrows: 'to',
          width: 2,
          smooth: { enabled: true, type: 'curvedCW', roundness: 0.2 },
        })),
      ),
    );

    // Create a new Network instance
    networkRef.current = new Network(
      containerRef.current,
      { nodes, edges },
      {
        layout: { hierarchical: false },
        nodes: { shape: 'box', size: 20 },
        edges: { arrows: { to: { enabled: true, scaleFactor: 1.2 } }, color: '#000000' },
        interaction: { dragNodes: true, dragView: true, zoomView: true },
        physics: { enabled: true, solver: 'barnesHut', stabilization: false },
      },
    );
  }, []);

  return (
    <div className='p-4 bg-white rounded-lg shadow'>
      <h2 className='text-xl fw-bold'>Project Roadmap (Graph View)</h2>
      <div ref={containerRef} style={{ height: '500px', border: '1px solid #ddd' }} />
    </div>
  );
};

export default RoadmapGraph;
