Koala.views.add('event_tr', Backbone.View.extend({
	
	tagName: 'tr',

	template: Koala.templates.get('event_tr'),

	events: {
		"click .delete" : function() {
			Koala.views.new('confirm_delete_modal', {
				model: this.model,
				modal: {
					action: "Confirm Event Deletion.",
					message: "Are you sure you want to permanently delete this event?",
					snippet: this.model.attributes.title,
				}
			});
		}
	},

	initialize: function() {
		this.listenTo(this.model, "change", this.render);
		this.listenTo(this.model, "destroy", this.destroy);

		this.data = {};
		for(var i in this.model.attributes) {
			if(this.model.attributes.hasOwnProperty(i)) this.data[i] = this.model.attributes[i];
		}
		this.data.starts_at = moment(this.model.attributes.starts_at).calendar();
		this.data.franchise = this.model.attributes.groups[0] && this.model.attributes.groups[0].name;
		this.data.status = this.status(this.model.attributes.starts_at, this.model.attributes.ends_at);
	},

	render: function() {
		this.$el.html(this.template(this.data));
		return this;
	},

	destroy: function() {
		this.remove();
	},

	status: function(start, end) {
		var now = new Date().getTime();
		var ends_at = Date.parse(end);
		var starts_at = Date.parse(start);

		if(now > ends_at) return "Complete";
		if(now > starts_at) return "Underway";
		if((now + 1000*60*30) > starts_at) return "Starting Soon";
		return "Pending";
	}

}));