# 📊 Workflow Creator - User Guide

**Last Updated:** October 18, 2025  
**Version:** 2.0

---

## 🎯 What is the Workflow Creator?

The Workflow Creator turns your written procedures (SOPs) into beautiful, interactive flowcharts! Think of it like drawing a map of your process, but the computer does most of the work for you!

---

## 🚀 Getting Started

### Step 1: Upload or Type Your SOP

**Option A: Upload a File**
- Click the **📁 file upload bar** at the top of the left panel
- Or drag and drop your file onto it
- Supports: **PDF, Word (.docx), Text (.txt), Markdown (.md)**

**Option B: Type Directly**
- Just start typing in the big text box
- Number your steps like:
  ```
  1. Review customer request
  2. Check inventory
  3. Process order
  ```

### Step 2: Create Your Workflow

You have **TWO options**:

#### 🪄 **Create Workflow (Basic)** - FREE & FAST
- Uses simple pattern matching
- Looks for numbered steps
- Perfect for clean, numbered text
- **No credits needed!**

**When to use:** Your SOP is already nicely numbered and organized

#### ✨ **Parse with AI** - SMART & POWERFUL
- Uses OpenAI artificial intelligence
- Understands messy text and paragraphs
- Detects hidden decision points
- Finds implicit steps
- **Costs 10 credits** per parse

**When to use:** Your SOP is in paragraph form or needs smart analysis

---

## 🎨 Working with Your Flowchart

### Resizable Panels

**See that thin gray line between the left and right sides?**
- **Hover over it** → It turns blue
- **Click and drag** → Resize the panels!
- **Left side:** Input and controls
- **Right side:** Flowchart and analysis

**Why?** Give yourself more room for the flowchart when you need it!

### Independent Scrolling

Each side scrolls on its own:
- Scroll down on the **left** → See more controls and buttons
- Scroll down on the **right** → See more of your flowchart
- They don't affect each other!

---

## 🔄 Flowchart Layout - Horizontal Flow

Your flowchart flows **left-to-right** like reading a book:

```
START → Step 1 → Step 2 → Step 3
          ↓
        Step 4 → Step 5 → Step 6
          ↓
        Step 7 → END
```

**Automatic wrapping:** After 3 nodes in a row, it wraps to the next row automatically!

---

## 🎯 Visio-Style Smart Features

Look for the **control panel in the top-left** of your flowchart:

### 🎯 Auto-Layout Button
- **Click it** → Instantly reorganizes all nodes in a clean grid
- Like magic! Everything aligns perfectly
- Use this if you've moved nodes around and want to reset

### 📏 Snap to Grid Checkbox
- **ON** (checked) → Nodes snap to invisible grid when you move them (perfect alignment!)
- **OFF** (unchecked) → Free positioning (place nodes anywhere)

**Pro tip:** Keep it ON for professional-looking diagrams!

---

## 🔌 Connection Points & Connectors

### 4 Connection Points on Every Node

Each node has **4 dark circles** (handles):
```
        🔴 Top
         ↑
    ← 🔴 NODE 🔴 →
      Left    Right
         ↓
       🔴 Bottom
```

### How to Create New Connections

1. **Hover over a handle** (the dark circles)
2. **Click and hold**
3. **Drag to another node's handle**
4. **Release** → New connection created!

### How to Move Existing Connectors

1. **Hover over a connection line** → It highlights
2. **Click the endpoint** (where the arrow meets the node)
3. **Drag it to a different handle**
4. **Release** → Connection moved!

### Smart Routing

Connections automatically:
- Route around corners (not straight through!)
- Use smooth curves
- Look professional and clean

---

## 🎨 Moving Nodes Around

### Drag Nodes
- **Click any node** and drag it around
- **Snap to Grid ON** → Snaps to grid (aligned)
- **Snap to Grid OFF** → Free positioning

### Zoom & Pan
- **Mouse wheel** → Zoom in/out
- **Click background and drag** → Pan around the canvas
- **Controls** (bottom-left) → Zoom buttons

---

## 🎭 Node Types & Colors

### Types
- 🚀 **START** (green) - Beginning of workflow
- 📝 **Process** (blue) - Regular action step
- 🤔 **Decision** (rounded, colored) - Yes/No choice
- ✅ **END** (green) - Process complete

### Risk Colors
After analysis runs:
- 🟢 **Green border** → Low risk
- 🟡 **Yellow border** → Medium risk
- 🔴 **Orange/Red border** → High risk

### Information on Nodes
Each node shows:
- Step number
- Step description
- **Efficiency score** (if analyzed)
- **Risk level** (if analyzed)
- **Estimated time** (if analyzed)

---

## 🛠️ Quick Action Buttons

After creating a workflow, you'll see these buttons at the top:

### 📚 **Templates**
- Browse pre-made workflow templates
- Click one to load it instantly
- Great for getting started!

### 🖥️ **Full Screen**
- Opens an immersive full-screen editor
- More space for complex workflows
- Includes step editing tools

### 🔄 **Reorder**
- Drag-and-drop interface to reorder steps
- Visual step management
- Easy reorganization

### 📊 **Analytics**
- Opens detailed analytics dashboard
- Charts and graphs
- Performance insights
- **Costs credits**

### 💬 **AI Chat**
- Talk to AI about your workflow
- Ask questions like "How can I improve this?"
- AI can suggest edits
- **Costs credits**

### ⚡ **Optimize**
- Finds complex steps that do too many things
- Suggests splitting them into smaller steps
- Preview before applying
- **Free!**

---

## 🟧 Automatic Analysis Features

After creating a workflow, the AI automatically checks for issues:

### Gap Detection (Orange Box)
**What it finds:**
- Missing steps in your process
- Things you forgot to include
- Prerequisites that are skipped

**What to do:**
- Click **"Add Step"** to insert the missing step
- Or ignore if it's not needed

### Duplicate Detection (Orange Box)
**What it finds:**
- Steps that appear more than once
- Identical or very similar actions

**What to do:**
- Click **"Merge"** → Combines duplicates into one step
- Click **"Keep Both"** → Keep them separate (sometimes duplicates are intentional!)

### Domain-Agnostic Gap Detection (Orange Box)
**What it finds:**
- Common workflow gaps that apply to ANY industry
- Error handling missing
- Documentation gaps
- Approval steps missing

**What to do:**
- Click **"Add"** next to suggested steps to insert them

### AI Ordering Analysis (Orange Box)
**What it finds:**
- Steps that are in the wrong order
- Dependencies that are backwards
- Logical flow issues

**What to do:**
- Click **"Apply Suggested Order"** → Reorders automatically
- Click **"Keep Original"** → Keep your order

---

## 📤 Export Options

Export your workflow in multiple formats:

- **📄 JSON** - Machine-readable format
- **📊 CSV** - Spreadsheet format
- **📝 Markdown** - Documentation format
- **📋 Text** - Simple text file

---

## 💡 Pro Tips

### Getting the Best Results

1. **Number your steps** → Parser works better
2. **Use action verbs** → "Review document" not "Document review"
3. **One action per line** → Easier for AI to understand
4. **Be specific** → "Email customer confirmation" not "Email them"

### Loading Multiple Documents

**Scenario:** Your workflow is split across 3 files

**Solution:**
1. Upload Doc 1 → Parse → See steps in text box
2. Upload Doc 2 → Copy the text
3. **Paste at the end** of existing text in the text box
4. Upload Doc 3 → Copy and paste again
5. Click "Parse with AI" → Combined workflow!

### Saving Your Work

**Important:** The workflow is NOT saved automatically!

**To save:**
- Use **Export** buttons to download your work
- Save the exported file somewhere safe
- Re-upload later to continue working

---

## 🎮 Keyboard Shortcuts & Controls

### Navigation
- **Mouse wheel** → Zoom
- **Click + drag background** → Pan
- **Click node** → Select
- **Delete key** → Delete selected edge

### Precision Work
- **Snap to Grid** → Hold Shift while dragging (if snap is OFF)
- **Multi-select** → Click + drag to select multiple nodes
- **Undo** → Ctrl+Z (browser back)

---

## 🆘 Troubleshooting

### "Old information showing when I load a new document"
**Fixed!** When you upload a new document, everything now clears automatically.

### "AI removed my duplicate steps"
**Fixed!** AI now preserves ALL steps, including duplicates. YOU decide what to do with them using the Duplicate Detection panel.

### "Nodes are vertical instead of horizontal"
Click the **🎯 Auto-Layout** button in the top-left of the flowchart!

### "Can't move connectors"
1. Make sure `edgesUpdatable` is enabled (it should be)
2. Click directly on the **endpoint** of the edge (where arrow meets node)
3. Drag to a different handle

### "White screen after parsing"
Refresh the page (Ctrl+R) and try again. The issue has been fixed in the latest update!

---

## 💳 Credits System

### What Costs Credits?

- **AI Parse**: 10 credits
- **AI Analysis**: 20 credits
- **AI Chat**: 5 credits per message
- **Basic Parse**: FREE!
- **Optimize**: FREE!

### How to Get Credits?

1. Click **Credits** in the navigation
2. Purchase a credits package
3. Credits never expire!

### Check Your Balance

Look at your user profile or credits page to see remaining balance.

---

## 🎓 Example Walkthrough

### Creating Your First Workflow

**1. Start with sample text:**
```
1. Receive customer order
2. Verify payment information
3. Check inventory availability
4. If available, process order
5. If not available, notify customer
6. Ship product
7. Send confirmation email
```

**2. Click "Create Workflow (Basic)"**
- Flowchart appears instantly!
- No credits used

**3. Review the flowchart**
- Nodes flow horizontally
- Automatic connections
- Step 4 is marked as a decision (because "If available")

**4. Customize**
- Drag nodes to rearrange
- Click "🎯 Auto-Layout" to organize
- Drag connectors to change flow

**5. Export**
- Choose your format (JSON, CSV, Markdown, Text)
- Download the file
- Share with your team!

---

## 🌟 Advanced Features

### Full Screen Mode
- Click **🖥️ Full Screen**
- Edit steps inline
- Add/remove/reorder steps
- Save changes back to main view

### AI Chat Assistant
- Click **💬 AI Chat**
- Ask questions about your workflow
- AI can suggest improvements
- Can make edits for you

### Step Optimization
- Click **⚡ Optimize**
- Finds complex steps
- Suggests breaking them into smaller ones
- Preview before applying

---

## 📞 Need Help?

- Check this guide first
- Review the **Legend** (top-right of flowchart)
- Look for **tooltip hints** (hover over buttons)
- Contact support if you're stuck

---

## 🎉 Summary

**You can now:**
- ✅ Upload documents and create workflows
- ✅ Resize panels to your preference
- ✅ See nodes flow horizontally with wrapping
- ✅ Auto-layout with one click
- ✅ Snap nodes to grid for alignment
- ✅ Drag connectors between 4 connection points
- ✅ Create and reconnect edges freely
- ✅ Choose between basic and AI parsing
- ✅ Control duplicate detection yourself
- ✅ Export in multiple formats

**Your workflow creator is now as powerful as Visio, but specialized for SOPs!** 🚀

Happy workflow creating! 🎨

