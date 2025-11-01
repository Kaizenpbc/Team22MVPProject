/**
 * Enhanced Workflow Flowchart
 * Interactive ReactFlow visualization with AI analysis overlays
 * Shows efficiency, risk, and gaps directly on nodes
 */

import React, { useMemo, useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Handle,
  Position,
  Connection,
  addEdge,
  ConnectionMode,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { WorkflowStep } from '../../../utils/workflow/workflowEditor';
import { ComprehensiveAnalysis } from '../../../utils/workflow/comprehensiveWorkflowAnalysis';

interface EnhancedWorkflowFlowchartProps {
  steps: WorkflowStep[];
  analysis?: ComprehensiveAnalysis | null;
}

// Custom node component with 4 connection handles and hover tooltip
const CustomNode = ({ data }: any) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [hoverTimeout, setHoverTimeout] = React.useState<NodeJS.Timeout | null>(null);
  
  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setShowTooltip(true);
  };
  
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowTooltip(false);
    }, 100); // Small delay to prevent flickering
    setHoverTimeout(timeout);
  };
  
  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative' }}
    >
      {/* 4 Connection Handles - Top, Right, Bottom, Left */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ background: '#555', width: 10, height: 10 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: '#555', width: 10, height: 10 }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        style={{ background: '#555', width: 10, height: 10 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={{ background: '#555', width: 10, height: 10 }}
      />
      
      {/* Node content */}
      {data.label}
      
      {/* Hover Tooltip */}
      {showTooltip && data.hoverDetails && (
        <div 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: '-10px',
            left: '100%',
            marginLeft: '10px',
            backgroundColor: 'white',
            border: '2px solid #2196F3',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            minWidth: '200px',
            maxWidth: '300px',
            fontSize: '12px',
            lineHeight: '1.4'
          }}
        >
          {/* Tooltip Arrow */}
          <div 
            style={{
              position: 'absolute',
              left: '-8px',
              top: '20px',
              width: 0,
              height: 0,
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderRight: '8px solid #2196F3'
            }}
          />
          
          {/* Tooltip Content */}
          <div style={{ fontWeight: 'bold', color: '#2196F3', marginBottom: '8px' }}>
            {data.hoverDetails.title}
          </div>
          
          {data.hoverDetails.category && (
            <div style={{ 
              fontSize: '10px', 
              color: '#666', 
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {data.hoverDetails.category}
            </div>
          )}
          
          <ul style={{ margin: 0, paddingLeft: '16px' }}>
            {data.hoverDetails.items.map((item: string, index: number) => (
              <li key={index} style={{ marginBottom: '4px', color: '#333' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Node types
const nodeTypes = {
  custom: CustomNode,
};

const EnhancedWorkflowFlowchart: React.FC<EnhancedWorkflowFlowchartProps> = ({ 
  steps, 
  analysis 
}) => {
  console.log('🚀 EnhancedWorkflowFlowchart RENDERED with steps:', steps.length);
  const [snapToGrid, setSnapToGrid] = useState(true);
  
  // Get node color based on risk
  const getNodeColor = (stepIndex: number): string => {
    if (!analysis?.risks) return '#e3f2fd';
    
    const allRiskSteps = [
      ...analysis.risks.highRiskSteps,
      ...analysis.risks.mediumRiskSteps,
      ...analysis.risks.lowRiskSteps
    ];
    
    const stepRisk = allRiskSteps.find(r => r.index === stepIndex);
    if (!stepRisk) return '#e3f2fd';
    
    const colors: Record<string, string> = {
      high: '#ffebee',
      medium: '#fff3e0',
      low: '#f1f8e9'
    };
    return colors[stepRisk.category] || '#e3f2fd';
  };

  const getBorderColor = (stepIndex: number): string => {
    if (!analysis?.risks) return '#2196F3';
    
    const allRiskSteps = [
      ...analysis.risks.highRiskSteps,
      ...analysis.risks.mediumRiskSteps,
      ...analysis.risks.lowRiskSteps
    ];
    
    const stepRisk = allRiskSteps.find(r => r.index === stepIndex);
    if (!stepRisk) return '#2196F3';
    
    const colors: Record<string, string> = {
      high: '#f57c00',
      medium: '#fbc02d',
      low: '#689f38'
    };
    return colors[stepRisk.category] || '#2196F3';
  };

  const getRiskIcon = (stepIndex: number): string => {
    if (!analysis?.risks) return '';
    
    const allRiskSteps = [
      ...analysis.risks.highRiskSteps,
      ...analysis.risks.mediumRiskSteps,
      ...analysis.risks.lowRiskSteps
    ];
    
    const stepRisk = allRiskSteps.find(r => r.index === stepIndex);
    if (!stepRisk) return '';
    
    const icons: Record<string, string> = {
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    };
    return icons[stepRisk.category] || '';
  };

  const getEfficiencyScore = (stepIndex: number): number | null => {
    if (!analysis?.efficiency?.breakdown?.[stepIndex]) return null;
    return Math.round(analysis.efficiency.breakdown[stepIndex].stepEfficiency * 100);
  };

  const getStepTime = (stepIndex: number): number | null => {
    if (!analysis?.efficiency?.breakdown?.[stepIndex]) return null;
    return Math.round(analysis.efficiency.breakdown[stepIndex].estimatedTime);
  };

  // Build nodes - HORIZONTAL LAYOUT WITH WRAPPING
  const buildNodes = useMemo((): Node[] => {
    const nodes: Node[] = [];
    
    // Layout configuration
    const nodeWidth = 320;
    const nodeGap = 100;
    const rowHeight = 220;
    const maxNodesPerRow = 3; // Wrap after 3 nodes
    const startX = 50;
    const startY = 50;
    
    let currentX = startX;
    let currentY = startY;
    let nodesInCurrentRow = 0;

    // Start node
    nodes.push({
      id: 'start',
      type: 'custom',
      data: {
        label: (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', marginBottom: '5px' }}>🚀</div>
            <div style={{ fontWeight: 'bold' }}>START</div>
            <div style={{ fontSize: '11px', color: '#666' }}>Begin Process</div>
          </div>
        )
      },
      position: { x: currentX, y: currentY },
      style: {
        backgroundColor: '#e8f5e9',
        border: '2px solid #4caf50',
        borderRadius: '12px',
        padding: '15px',
        width: 200
      }
    });

    currentX += 200 + nodeGap; // Move right
    nodesInCurrentRow++;

    // Workflow step nodes
    steps.forEach((step, index) => {
      const stepText = step.text || step.name || `Step ${index + 1}`;
      const nodeColor = getNodeColor(index);
      const borderColor = getBorderColor(index);
      const riskIcon = getRiskIcon(index);
      const effScore = getEfficiencyScore(index);
      const stepTime = getStepTime(index);
      const isDecision = step.type === 'decision' ||
                         stepText.toLowerCase().includes('if ') ||
                         stepText.toLowerCase().includes('?') ||
                         stepText.toLowerCase().includes('kiss') ||
                         stepText.toLowerCase().includes('insert') ||
                         stepText.toLowerCase().includes('play') ||
                         stepText.toLowerCase().includes('have');

      nodes.push({
        id: `step-${index}`,
        type: 'custom',
        data: {
          label: (
            <div style={{ 
              padding: isDecision ? '5px 10px' : '10px',
              textAlign: isDecision ? 'center' : 'left',
              maxWidth: isDecision ? '200px' : 'none'
            }}>
              {!isDecision && (
                <div style={{ 
                  fontSize: '12px',
                  color: '#999',
                  marginBottom: '5px',
                  fontWeight: 'bold'
                }}>
                  STEP {index + 1}
                </div>
              )}

              <div style={{
                fontSize: isDecision ? '12px' : '14px',
                fontWeight: 'bold',
                marginBottom: isDecision ? '0px' : '10px',
                color: '#333',
                lineHeight: isDecision ? '1.2' : '1.4'
              }}>
                {isDecision ? '🤔 ' : '📝 '}{stepText}
              </div>
              
              {isDecision && (
                <div style={{
                  fontSize: '9px',
                  color: '#666',
                  fontStyle: 'italic',
                  marginTop: '3px'
                }}>
                  Decision Point
                </div>
              )}

              {(effScore !== null || riskIcon || stepTime !== null) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  fontSize: '11px',
                  borderTop: '1px solid #e0e0e0',
                  paddingTop: '8px'
                }}>
                  {effScore !== null && (
                    <div>
                      <span style={{ color: '#999' }}>Efficiency:</span>{' '}
                      <span style={{
                        fontWeight: 'bold',
                        color: effScore >= 80 ? '#4caf50' : effScore >= 60 ? '#ff9800' : '#f44336'
                      }}>
                        {effScore}%
                      </span>
                    </div>
                  )}

                  {riskIcon && (
                    <div>
                      <span style={{ color: '#999' }}>Risk:</span>{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {riskIcon}
                      </span>
                    </div>
                  )}

                  {stepTime !== null && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <span style={{ color: '#999' }}>⏱️ Time:</span>{' '}
                      <span style={{ fontWeight: 'bold' }}>{stepTime} min</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ),
          // Pass hover details to the CustomNode
          hoverDetails: step.hoverDetails
        },
        position: { x: currentX, y: currentY },
        style: {
          backgroundColor: nodeColor,
          border: `3px solid ${borderColor}`,
          borderRadius: isDecision ? '0px' : '12px',
          width: isDecision ? 0 : 300,
          height: isDecision ? 0 : 120,
          minHeight: isDecision ? 0 : 120,
          clipPath: isDecision ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
          display: isDecision ? 'flex' : 'block',
          alignItems: isDecision ? 'flex-start' : 'stretch',
          justifyContent: isDecision ? 'center' : 'stretch',
          padding: isDecision ? '20px 40px 0 40px' : '15px'
        }
      });

      // Move to next position (horizontal with wrapping)
      currentX += nodeWidth + nodeGap;
      nodesInCurrentRow++;
      
      // Wrap to next row if needed
      if (nodesInCurrentRow >= maxNodesPerRow) {
        currentX = startX;
        currentY += rowHeight;
        nodesInCurrentRow = 0;
      }
    });

    // End node (continue on same row or next row)
    // If we just wrapped, end stays on current row, otherwise wrap to next
    if (nodesInCurrentRow > 0) {
      // There are nodes in current row, move to next row for end
      currentX = startX;
      currentY += rowHeight;
    }
    
    nodes.push({
      id: 'end',
      type: 'custom',
      data: {
        label: (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', marginBottom: '5px' }}>✅</div>
            <div style={{ fontWeight: 'bold' }}>END</div>
            <div style={{ fontSize: '11px', color: '#666' }}>Process Complete</div>
          </div>
        )
      },
      position: { x: currentX, y: currentY },
      style: {
        backgroundColor: '#e8f5e9',
        border: '2px solid #4caf50',
        borderRadius: '12px',
        padding: '15px',
        width: 200
      }
    });
    
    return nodes;
  }, [steps, analysis]);

  // Build edges
  const buildEdges = useMemo((): Edge[] => {
    console.log('🔨 buildEdges called with steps.length:', steps.length);
    const edges: Edge[] = [];

    if (steps.length === 0) {
      console.log('⚠️ No steps, returning empty edges');
      return edges;
    }

    // Start to first step
    edges.push({
      id: 'start-to-step-0',
      source: 'start',
      target: 'step-0',
      animated: true,
      style: { 
        stroke: '#4caf50', 
        strokeWidth: 3
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#4caf50'
      }
    });

    // Connect steps
    for (let i = 0; i < steps.length - 1; i++) {
      edges.push({
        id: `step-${i}-to-step-${i + 1}`,
        source: `step-${i}`,
        target: `step-${i + 1}`,
        animated: true,
        style: { 
          stroke: '#2196F3', 
          strokeWidth: 3
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#2196F3'
        }
      });
    }

    // Last step to end
    edges.push({
      id: `step-${steps.length - 1}-to-end`,
      source: `step-${steps.length - 1}`,
      target: 'end',
      animated: true,
      style: { 
        stroke: '#4caf50', 
        strokeWidth: 3
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#4caf50'
      }
    });

    console.log('✅ buildEdges returning edges:', edges.length, edges);
    return edges;
  }, [steps]);

  const [nodes, setNodes, onNodesChange] = useNodesState(buildNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildEdges);

  // Handle new connections with smart routing
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep', // Smart routing like Visio!
      animated: true,
      style: { stroke: '#2196F3', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#2196F3' }
    }, eds));
  }, [setEdges]);

  // Handle edge updates (reconnecting existing connections)
  const onEdgeUpdate = useCallback((oldEdge: Edge, newConnection: Connection) => {
    if (!newConnection.source || !newConnection.target) return;
    
    setEdges((els) => 
      els.map((e) => {
        if (e.id === oldEdge.id) {
          return {
            ...e,
            source: newConnection.source as string,
            target: newConnection.target as string,
            sourceHandle: newConnection.sourceHandle,
            targetHandle: newConnection.targetHandle,
          };
        }
        return e;
      })
    );
  }, [setEdges]);

  // Auto-layout function (like Visio's "Arrange All")
  const autoLayout = useCallback(() => {
    const nodeWidth = 320;
    const nodeGap = 100;
    const rowHeight = 220;
    const maxNodesPerRow = 3;
    const startX = 50;
    const startY = 50;
    
    let currentX = startX;
    let currentY = startY;
    let nodesInCurrentRow = 0;

    const layoutedNodes = nodes.map((node) => {
      const newNode = {
        ...node,
        position: { x: currentX, y: currentY }
      };

      // Move to next position
      currentX += nodeWidth + nodeGap;
      nodesInCurrentRow++;
      
      // Wrap to next row
      if (nodesInCurrentRow >= maxNodesPerRow) {
        currentX = startX;
        currentY += rowHeight;
        nodesInCurrentRow = 0;
      }

      return newNode;
    });

    setNodes(layoutedNodes);
  }, [nodes, setNodes]);

  // Debug: Only log on mount/unmount
  React.useEffect(() => {
    console.log('🔍 Flowchart mounted with', nodes.length, 'nodes and', edges.length, 'edges');
  }, []);

  return (
    <div style={{ width: '100%', height: '800px', backgroundColor: '#fafafa', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
      {/* Legend - Outside ReactFlow */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 5,
        fontSize: 11
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: 10 }}>LEGEND</div>
        <div style={{ marginBottom: 5 }}>🟢 Low Risk</div>
        <div style={{ marginBottom: 5 }}>🟡 Medium Risk</div>
        <div style={{ marginBottom: 5 }}>🔴 High Risk</div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        nodesDraggable={true}
        nodesConnectable={true}
        edgesUpdatable={true}
        edgesFocusable={true}
        elementsSelectable={true}
        connectionMode={ConnectionMode.Loose}
        snapToGrid={snapToGrid}
        snapGrid={[25, 25]}
        reconnectRadius={20}
        defaultEdgeOptions={{
          type: 'smoothstep', // Smart routing
          style: { strokeWidth: 3, stroke: '#2196F3' },
          markerEnd: { type: MarkerType.ArrowClosed }
        }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={2}
        attributionPosition="bottom-left"
      >
        {/* Smart Controls Panel (Visio-style) - INSIDE ReactFlow */}
        <Panel position="top-left">
          <div style={{
            backgroundColor: 'white',
            padding: '10px 15px',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            fontSize: 12,
            margin: 10
          }}>
            <button
              onClick={autoLayout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
              title="Auto-arrange nodes like Visio"
            >
              🎯 Auto-Layout
            </button>
            
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              cursor: 'pointer',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={snapToGrid}
                onChange={(e) => setSnapToGrid(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>📏 Snap to Grid</span>
            </label>
          </div>
        </Panel>
        
        <Background color="#e0e0e0" gap={16} />
        <Controls showInteractive={true} />
      </ReactFlow>
    </div>
  );
};

export default EnhancedWorkflowFlowchart;

