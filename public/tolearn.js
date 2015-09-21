var app = app || {};

app.Lessons = Backbone.Model.extend({
	url: function(){
		return '/learn/lessons'
	},
	defaults: {
		errors: [],
		errfor: {},
		lessons: []
	}
});

app.Lesson = Backbone.View.extend({
	url: function(){
		return '/learn/lessons/' + this.attributes.id
	},
	id: '',
	defaults: {
		errors: [],
		errfor: {},
		lesson: {}
	}
});

app.ListView = Backbone.View.extend({
	el: '#tolearnlist',
	template: _.template( $('#tmpl-tolearnlist').html() ),
	events: {},
	initialize: function(){
		this.model = new app.Lessons();
		
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.model, 'change', this.render);
		this.model.fetch();
	},
	render: function(){
		this.$el.html(this.template(this.model.attributes));
	}
});

app.LessonView = Backbone.View.extend({
	el: '#lessoninfo',
	template: _.template( $('#tmpl-lessonlearn').html() ),
	initialize: function(){
		this.model = new app.Lesson();
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.model, 'change', this.render);
	},
	render: function(){
		this.$el.html( this.template( this.model.attributes ));
	}
});

$(document).ready(function(){
	app.listView = new app.ListView();
	app.lessonView = new app.LessonView();
});

