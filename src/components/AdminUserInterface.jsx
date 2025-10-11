import React from 'react';

// Admin User Interface - Full-featured UI for admin users
const AdminUserInterface = ({ user, userProfile, ...props }) => {
  console.log('🔴 Rendering Admin User Interface for:', userProfile?.full_name || user?.email);

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      {/* Admin Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>
            🔧 SOP Workflow Creator - Admin Panel
          </h1>
          <p style={{ color: '#7f8c8d', marginBottom: '15px' }}>
            Advanced workflow management with full administrative controls
          </p>
          <div style={{ fontSize: '14px', color: '#666', backgroundColor: '#fff3cd', padding: '10px', borderRadius: '5px', border: '1px solid #ffeaa7' }}>
            👑 Welcome, {userProfile?.full_name || user?.email}! 
            <span style={{ color: '#856404', fontWeight: 'bold' }}> (Administrator)</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Language Selector */}
          <button
            onClick={() => props.setShowLanguageSelector && props.setShowLanguageSelector(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            🌍 Language
          </button>
          
          {/* Admin Panel Toggle */}
          <button
            onClick={() => props.setShowAdminPanel && props.setShowAdminPanel(!props.showAdminPanel)}
            style={{
              padding: "10px 20px",
              backgroundColor: props.showAdminPanel ? "#6f42c1" : "#6f42c1",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
            title="Manage AI prompt templates"
          >
            ⚙️ {props.showAdminPanel ? 'Hide' : 'Manage'} Templates
          </button>

          {/* Logout */}
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

          {/* Supabase Test */}
          <button
            onClick={() => props.setShowSupabaseTest && props.setShowSupabaseTest(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            🧪 Test Supabase
          </button>
        </div>
      </div>

      {/* Main content area - Full layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        
        {/* Left column - Full Controls */}
        <div>
          {/* File Upload - Advanced */}
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
              multiple={props.isMultiDocumentMode}
              onChange={(e) => {
                if (props.isMultiDocumentMode) {
                  Array.from(e.target.files).forEach(props.handleFileUpload);
                } else {
                  props.handleFileUpload && props.handleFileUpload(e.target.files[0]);
                }
              }}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '2em', marginBottom: '10px' }}>📁</div>
            <div>Choose file or drag and drop</div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              Multiple files supported • {props.isMultiDocumentMode ? 'Multi-document mode ON' : 'Single document mode'}
            </div>
            {props.uploadedFileName && (
              <div style={{ marginTop: '10px', color: '#666' }}>
                Loaded: {props.uploadedFileName}
              </div>
            )}
          </div>

          {/* SOP Text Input - Advanced */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              SOP Text:
            </label>
            <textarea
              value={props.sop}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue && props.containsBinaryData && props.containsBinaryData(newValue)) {
                  alert('⚠️ Binary or corrupted data detected! Please paste plain text only.');
                  return;
                }
                props.setSop && props.setSop(newValue);
              }}
              onPaste={(e) => {
                const pastedText = e.clipboardData.getData('text');
                if (pastedText && props.containsBinaryData && props.containsBinaryData(pastedText)) {
                  e.preventDefault();
                  alert('⚠️ The pasted content contains binary or corrupted data. Please paste plain text only.');
                }
              }}
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

          {/* AI Parsing Controls - Advanced */}
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #dee2e6'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#495057', fontSize: '16px' }}>
              🤖 AI Parsing Controls
            </h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={props.parseWithAI}
                disabled={!props.sop.trim()}
                style={{
                  padding: '8px 12px',
                  backgroundColor: props.sop.trim() ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: props.sop.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '11px'
                }}
              >
                🧠 Parse with AI
              </button>
              <button
                onClick={() => props.setIsMultiDocumentMode && props.setIsMultiDocumentMode(!props.isMultiDocumentMode)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: props.isMultiDocumentMode ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                📚 {props.isMultiDocumentMode ? 'Multi' : 'Single'} Doc
              </button>
            </div>
          </div>

          {/* Advanced Export Buttons - Organized in left sidebar */}
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

          {/* Advanced Analytics - Full featured */}
          <div style={{ 
            backgroundColor: '#e3f2fd', 
            padding: '15px', 
            borderRadius: '8px',
            border: '1px solid #bbdefb'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#1976d2', fontSize: '16px' }}>
              📊 Advanced Analytics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', fontSize: '14px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#1976d2' }}>
                  {props.realtimeAnalytics?.length || 0}
                </div>
                <div style={{ color: '#666' }}>Processes</div>
              </div>
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
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#1976d2' }}>
                  {props.edges?.length || 0}
                </div>
                <div style={{ color: '#666' }}>Connections</div>
              </div>
            </div>
            
            {/* Advanced Analytics Toggle */}
            <div style={{ marginTop: '15px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => props.setShowAdvancedAnalytics && props.setShowAdvancedAnalytics(!props.showAdvancedAnalytics)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: props.showAdvancedAnalytics ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                🚀 Advanced Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Right column - Advanced Flowchart */}
        <div>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '15px',
            backgroundColor: '#fafafa',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#495057' }}>
              🔄 Advanced Interactive Flowchart
            </h3>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
              💡 Drag nodes to reposition • Click and drag from node edges to create connections
            </p>
            
            {/* Advanced Flowchart Controls */}
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
                🗑️ Clear All Links
              </button>
              <button
                onClick={() => props.setShowFunctionTest && props.setShowFunctionTest(!props.showFunctionTest)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: props.showFunctionTest ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                🧪 Test Functions
              </button>
              <button
                onClick={() => props.setShowAuthDebug && props.setShowAuthDebug(!props.showAuthDebug)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: props.showAuthDebug ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                🐛 Auth Debug
              </button>
            </div>

            {/* Flowchart Container */}
            <div style={{ 
              height: '500px', 
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

      {/* Advanced Footer */}
      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        borderTop: '1px solid #eee',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>SOP Platform - Administrator Interface • Full workflow management with advanced controls</p>
      </div>
    </div>
  );
};

export default AdminUserInterface;