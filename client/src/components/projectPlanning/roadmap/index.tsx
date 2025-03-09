import React, { useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';

const FAKETASKS = [
  { id: 'task-1', name: 'Design UI', dependsOn: [], priority: 1 },
  { id: 'task-2', name: 'Set up Backend', dependsOn: ['task-1'], priority: 2 },
  { id: 'task-3', name: 'API Integration', dependsOn: ['task-1', 'task-2'], priority: 3 },
  { id: 'task-4', name: 'Unit Testing', dependsOn: ['task-3'], priority: 4 },
  {
    id: 'task-5',
    name: 'Deployment',
    dependsOn: ['task-1', 'task-2', 'task-3', 'task-4'],
    priority: 5,
  },
];

// Get color based on priority
const getPriorityColor = (priority: number) => {
  const colors: { [key: number]: string } = {
    1: '#ff4d4d', // High priority (red)
    2: '#ffcc00', // Medium-high (yellow)
    3: '#3399ff', // Normal (blue)
    4: '#33cc33', // Low (green)
    5: '#999999', // Lowest (gray)
  };
  return colors[priority] || '#007bff'; // Default blue
};

// Component to render the roadmap graph
const RoadmapGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  // Initialize the Vis.js network
  useEffect(() => {
    if (!containerRef.current) return;

    // Convert tasks to nodes with priority colors
    const nodes = new DataSet(
      FAKETASKS.map(task => ({
        id: task.id,
        label: `${task.name}\n(Priority ${task.priority})`,
        shape: 'box',
        color: { background: getPriorityColor(task.priority), border: '#000' }, // Node color == priority color
        font: { color: '#fff' },
        title: `Task: ${task.name}\nPriority: ${task.priority}`, // Tooltip on hover
      })),
    );

    // Convert dependencies to edges between nodes --
    // If task A depends on task B, there will be an edge from B->A
    const edges = new DataSet(
      FAKETASKS.flatMap(task =>
        task.dependsOn.map(dep => ({
          id: `${task.id}-${dep}`, // Unique edge ID
          from: dep,
          to: task.id,
          arrows: 'to',
          width: 2,
          smooth: { enabled: true, type: 'curvedCW', roundness: 0.2 },
        })),
      ),
    );

    // Create the Vis.js network
    networkRef.current = new Network(
      containerRef.current,
      { nodes, edges },
      {
        layout: {
          hierarchical: false, // Allows free movement instead of fixed top-down layout
        },
        nodes: {
          shape: 'box',
          size: 20,
        },
        edges: {
          arrows: { to: { enabled: true, scaleFactor: 1.2 } }, // Bigger arrowheads
          color: '#000000',
        },
        interaction: {
          dragNodes: true, // Enable node dragging
          tooltipDelay: 200, // Show tooltip on hover
        },
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
