var UiToolBox = IgeEventingClass.extend({
	classId: 'UiToolBox',
	
	init: function () {
		var self = this;
		
		this.tools = {};
		
		// Load tool scripts
		ige.requireScript(igeRoot + 'components/editor/ui/toolbox/tools/UiToolBox_ToolSelect.js');
		ige.requireScript(igeRoot + 'components/editor/ui/toolbox/tools/UiToolBox_ToolPan.js');
		
		// Load the toolbox html into the editor DOM
		ige.editor.loadHtml(igeRoot + 'components/editor/ui/toolbox/toolbox.html', function (html) {
			var toolbox = $(html);
			
			// Attach logic handlers to icons
			toolbox.find('.tool').click(function () {
				var elem = $(this);
				
				// Clear existing tool selection
				self.deselect(self._currentTool);
				
				// Add selected to this tool
				self.select(elem.attr('id'));
			});
			
			// Add the html
			$('#leftBar').append(toolbox);
			
			// Select the default tool
			//self.select('toolSelect');
		});
	},
	
	select: function (id) {
		var elem = $('#' + id),
			toolClassId = elem.attr('data-tool');
		
		if (!elem.hasClass('selected')) {
			elem.addClass('selected');
			this._currentTool = id;
		}
		
		// Handle tool init logic
		if (toolClassId) {
			if (!this.tools[toolClassId]) {
				if (ige.classDefined(toolClassId)) {
					this.tools[toolClassId] = this._currentToolInstance = ige.newClassInstance(toolClassId);
					this._currentToolInstance.enabled(true);
				} else {
					this.log('No class for tool or class not defined: ' + toolClassId, 'warning');
				}
			} else {
				this._currentToolInstance = this.tools[toolClassId];
				this._currentToolInstance.enabled(true);
			}
		}
	},
	
	deselect: function (id) {
		if (this._currentToolInstance) {
			this._currentToolInstance.enabled(false);
			delete this._currentToolInstance;
		}
		
		$('#' + id).removeClass('selected');
		this._currentTool = null;
	}
});

// Init
ige.editor.ui.toolbox = new UiToolBox();