import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Clock, 
  TrendingUp,
  X,
  ChevronRight,
  Star
} from 'lucide-react';
import { 
  WORKFLOW_TEMPLATES, 
  TEMPLATE_CATEGORIES,
  WorkflowTemplate,
  getTemplatesByCategory,
  searchTemplates,
  getPopularTemplates
} from '../../../utils/workflow/workflowTemplates';

interface WorkflowTemplateSelectorProps {
  onSelectTemplate: (template: WorkflowTemplate) => void;
  onClose?: () => void;
}

/**
 * Template Selector Component
 * Allows users to browse and select pre-built workflow templates
 */
const WorkflowTemplateSelector: React.FC<WorkflowTemplateSelectorProps> = ({ 
  onSelectTemplate, 
  onClose 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);

  // Filter templates based on search and category
  const getFilteredTemplates = (): WorkflowTemplate[] => {
    let templates = WORKFLOW_TEMPLATES;

    // Filter by category
    if (selectedCategory !== 'All') {
      templates = getTemplatesByCategory(selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      templates = searchTemplates(searchQuery);
    }

    return templates;
  };

  const filteredTemplates = getFilteredTemplates();
  const popularTemplates = getPopularTemplates(3);

  const handleTemplateClick = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      if (onClose) onClose();
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
      case 'moderate': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900';
      case 'complex': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Workflow Templates</h2>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
          <p className="text-white text-opacity-90">
            Choose from {WORKFLOW_TEMPLATES.length} pre-built templates to get started quickly
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {TEMPLATE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Popular Templates */}
          {!searchQuery && selectedCategory === 'All' && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Popular Templates</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateClick(template)}
                    className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-sm hover:bg-primary-50 dark:hover:bg-primary-900 hover:border-primary-500 transition-colors"
                  >
                    {template.icon} {template.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">
          
          {/* Template List */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No templates found</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Try a different search or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateClick(template)}
                    className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                      selectedTemplate?.id === template.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 dark:border-primary-400'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">{template.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {template.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                            {template.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${getComplexityColor(template.complexity)}`}>
                            {template.complexity}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            {template.estimatedTime} min
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <TrendingUp className="w-3 h-3" />
                            {template.steps.length} steps
                          </div>
                        </div>
                      </div>
                      {selectedTemplate?.id === template.id && (
                        <ChevronRight className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Template Preview (Right Panel) */}
          {selectedTemplate && (
            <div className="w-80 border-l border-gray-200 dark:border-gray-700 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
              <div className="mb-4">
                <div className="text-5xl mb-3">{selectedTemplate.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedTemplate.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {selectedTemplate.description}
                </p>

                {/* Template Meta Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {selectedTemplate.steps.length}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Steps</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                      {selectedTemplate.estimatedTime}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Minutes</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.tags.map(tag => (
                      <span 
                        key={tag}
                        className="text-xs px-2 py-1 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Steps Preview */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Workflow Steps</h4>
                <div className="space-y-2">
                  {selectedTemplate.steps.map((step, index) => (
                    <div 
                      key={step.id}
                      className="flex items-start gap-2 text-sm bg-white dark:bg-gray-800 p-2 rounded"
                    >
                      <span className="font-bold text-primary-600 dark:text-primary-400 min-w-[24px]">
                        {index + 1}.
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 flex-1">
                        {step.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Template Button */}
              <button
                onClick={handleUseTemplate}
                className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                Use This Template
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select a template to view details, or use the search to find specific workflows
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkflowTemplateSelector;

