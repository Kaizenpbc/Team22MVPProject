import React from 'react';

// Regular User Interface - Simplified UI for Team22 users
const RegularUserInterface = ({ user, userProfile, ...props }) => {
  console.log('🔵 Rendering Regular User Interface for:', userProfile?.full_name || user?.email);

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      {/* Welcome Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>
            📋 SOP Workflow Creator
          </h1>
          <p style={{ color: '#7f8c8d', marginBottom: '15px' }}>
            Create and visualize your standard operating procedures
          </p>
          <div style={{ fontSize: '14px', color: '#666', backgroundColor: '#e8f5e8', padding: '10px', borderRadius: '5px' }}>
            👋 Welcome, {userProfile?.full_name || user?.email}! 
            <span style={{ color: '#27ae60', fontWeight: 'bold' }}> (Standard User)</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => props.onLogout && props.onLogout()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
            title="Logout from SOP Platform"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main content area - Simplified layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        
        {/* Left column - Basic Controls */}
        <div>
          {/* File Upload - Simplified */}
          <div 
            style={{ 
              border: "2px dashed #ccc", 
              borderRadius: 8, 
              padding: 20, 
              marginBottom: 20, 
              textAlign: "center",
              backgroundColor: "#f9f9f9",
              cursor: "pointer"
            }}
            onDrop={props.handleDrop}
            onDragOver={props.handleDragOver}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <input
              id="fileInput"
              type="file"
              accept=".txt,.md,.pdf"
              onChange={(e) => props.handleFileUpload && props.handleFileUpload(e.target.files[0])}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '2em', marginBottom: '10px' }}>📁</div>
            <div>Upload your SOP document</div>
            {props.uploadedFileName && (
              <div style={{ marginTop: '10px', color: '#666' }}>
                Loaded: {props.uploadedFileName}
              </div>
            )}
          </div>

          {/* SOP Text Input - Simplified */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              SOP Text:
            </label>
            <textarea
              value={props.sop}
              onChange={(e) => props.setSop && props.setSop(e.target.value)}
              style={{
                width: '100%',
                height: '200px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              placeholder="Enter your SOP text here..."
            />
          </div>

          {/* Basic Export Buttons - Organized in left sidebar */}
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #dee2e6'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#495057', fontSize: '16px' }}>
              📤 Export Options
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={props.exportToPrintView}
                style={{
                  padding: '10px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                🖨️ Print View
              </button>
              <button
                onClick={props.exportToMermaid}
                style={{
                  padding: '10px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                📊 Mermaid
              </button>
              <button
                onClick={props.exportToDrawIO}
                style={{
                  padding: '10px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                🎨 Draw.io
              </button>
              <button
                onClick={props.exportToNotion}
                style={{
                  padding: '10px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                📝 Notion
              </button>
            </div>
          </div>

          {/* Basic Analytics - Simplified */}
          <div style={{ 
            backgroundColor: '#e3f2fd', 
            padding: '15px', 
            borderRadius: '8px',
            border: '1px solid #bbdefb'
          }}>
            <h3 style={{ marginBottom: '10px', color: '#1976d2', fontSize: '16px' }}>
              📊 Basic Analytics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#1976d2' }}>
                  {props.steps?.length || 0}
                </div>
                <div style={{ color: '#666' }}>Steps</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#1976d2' }}>
                  {props.nodes?.length || 0}
                </div>
                <div style={{ color: '#666' }}>Nodes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Simplified Flowchart */}
        <div>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '15px',
            backgroundColor: '#fafafa',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#495057' }}>
              🔄 Interactive Flowchart
            </h3>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
              💡 Drag nodes to reposition • Click and drag from node edges to create connections
            </p>
            
            {/* Basic Flowchart Controls */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
              <button
                onClick={props.resetLayout}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                🔄 Reset Layout
              </button>
              <button
                onClick={props.clearAllLinks}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                🗑️ Clear Links
              </button>
            </div>

            {/* Flowchart Container */}
            <div style={{ 
              height: '400px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              backgroundColor: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {props.children}
            </div>
          </div>
        </div>
      </div>

      {/* Basic Footer */}
      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        borderTop: '1px solid #eee',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>SOP Platform - Standard User Interface • Create, visualize, and export your workflows</p>
      </div>
    </div>
  );
};

export default RegularUserInterface;