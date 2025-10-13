/**
 * Advanced Export Utilities
 * Export workflows to various formats: Mermaid, Draw.io, Notion
 */

import { WorkflowStep } from './workflowEditor';

/**
 * Export to Mermaid diagram format
 */
export const exportToMermaid = (steps: WorkflowStep[], workflowName: string = 'Workflow'): string => {
  const lines: string[] = [];
  
  lines.push('```mermaid');
  lines.push('graph TD');
  
  steps.forEach((step, index) => {
    const nodeId = `step${index + 1}`;
    const text = (step.text || '').replace(/"/g, '\\"');
    
    // Different shapes based on type
    if (step.type === 'start') {
      lines.push(`  ${nodeId}([${text}])`);
    } else if (step.type === 'end') {
      lines.push(`  ${nodeId}([${text}])`);
    } else if (step.type === 'decision') {
      lines.push(`  ${nodeId}{${text}}`);
    } else {
      lines.push(`  ${nodeId}[${text}]`);
    }
    
    // Connect to next step
    if (index < steps.length - 1) {
      lines.push(`  ${nodeId} --> step${index + 2}`);
    }
  });
  
  lines.push('```');
  
  return lines.join('\n');
};

/**
 * Export to Draw.io XML format
 */
export const exportToDrawIO = (steps: WorkflowStep[], workflowName: string = 'Workflow'): string => {
  const verticalSpacing = 120;
  const startX = 200;
  const startY = 50;
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" version="21.0.0">
  <diagram name="${workflowName}" id="workflow-diagram">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
`;

  steps.forEach((step, index) => {
    const cellId = `step-${index}`;
    const nextCellId = `step-${index + 1}`;
    const y = startY + (index * verticalSpacing);
    const text = (step.text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Cell based on type
    let style = '';
    if (step.type === 'decision') {
      style = 'rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;';
    } else if (step.type === 'start') {
      style = 'ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;';
    } else if (step.type === 'end') {
      style = 'ellipse;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;';
    } else {
      style = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;';
    }
    
    xml += `        <mxCell id="${cellId}" value="${text}" style="${style}" vertex="1" parent="1">
          <mxGeometry x="${startX}" y="${y}" width="200" height="80" as="geometry" />
        </mxCell>
`;
    
    // Arrow to next step
    if (index < steps.length - 1) {
      xml += `        <mxCell id="arrow-${index}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1" parent="1" source="${cellId}" target="${nextCellId}">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
`;
    }
  });
  
  xml += `      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
  
  return xml;
};

/**
 * Export to Notion blocks format
 */
export const exportToNotion = (steps: WorkflowStep[], workflowName: string = 'Workflow'): string => {
  const lines: string[] = [];
  
  lines.push(`# ${workflowName}`);
  lines.push('');
  lines.push('## Workflow Steps');
  lines.push('');
  
  steps.forEach((step, index) => {
    const emoji = step.type === 'start' ? '🟢' : 
                  step.type === 'end' ? '🔴' : 
                  step.type === 'decision' ? '🔶' : '🔵';
    
    lines.push(`${index + 1}. ${emoji} **${step.text}**`);
    if (step.type) {
      lines.push(`   - Type: \`${step.type}\``);
    }
    lines.push('');
  });
  
  lines.push('---');
  lines.push('');
  lines.push(`**Generated:** ${new Date().toLocaleString()}`);
  lines.push(`**Total Steps:** ${steps.length}`);
  
  return lines.join('\n');
};

/**
 * Export to Print-friendly HTML
 */
export const exportToPrintView = (steps: WorkflowStep[], workflowName: string = 'Workflow'): string => {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${workflowName} - Print View</title>
  <style>
    @media print {
      .no-print { display: none; }
    }
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
    }
    h1 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
    }
    .step {
      margin: 20px 0;
      padding: 15px;
      border-left: 4px solid #3498db;
      background: #f8f9fa;
    }
    .step-number {
      font-weight: bold;
      color: #3498db;
      font-size: 1.2em;
    }
    .step-type {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.8em;
      margin-left: 10px;
    }
    .type-start { background: #d5e8d4; color: #2d662d; }
    .type-end { background: #f8cecc; color: #b85450; }
    .type-decision { background: #fff2cc; color: #d6b656; }
    .type-process { background: #dae8fc; color: #6c8ebf; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      text-align: center;
      color: #666;
    }
    @media print {
      .step { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>${workflowName}</h1>
  <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
  <p><strong>Total Steps:</strong> ${steps.length}</p>
  <hr>
`;

  steps.forEach((step, index) => {
    const typeClass = `type-${step.type || 'process'}`;
    html += `
  <div class="step">
    <span class="step-number">${index + 1}.</span>
    <span class="step-type ${typeClass}">${step.type || 'process'}</span>
    <div style="margin-top: 10px; font-size: 1.1em;">${step.text}</div>
  </div>
`;
  });
  
  html += `
  <div class="footer">
    <p>Workflow created with Kovari Platform</p>
    <p class="no-print"><button onclick="window.print()">🖨️ Print this workflow</button></p>
  </div>
</body>
</html>`;
  
  return html;
};

/**
 * Download file helper
 */
export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain'): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

