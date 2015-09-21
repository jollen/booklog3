/**
* SETUP
**/
var app = app || {};


/**
* MODELS
**/
app.Message = Backbone.Model.extend({
    url: function() {
//         return 'http://alwaysladylove.com/1/post' 
         return 'http://localhost:3000/1/post' 
                    + ( this.id === null ? '' : '/' + this.id );
    },
    id: null,
    idAttribute: '_id',
    defaults: {
        success: false,
        errfor: {},
        posts: [],
        subject: '',
        content: ''
    }
});

/**
* VIEWS
**/
app.ContentView = Backbone.View.extend({
    el: '#content',
    events: {
        'click #subject': 'read',
        'click #delete': 'delete'
    },
    // constructor
    initialize: function() {
        this.model = new app.Message();
        this.model.bind('sync', this.render, this);
        this.model.bind('change', this.render, this);
        this.template = _.template($('#post-list').html());

        this.model.fetch();
    },
    render: function() {
        var html = this.template(this.model.attributes);
        this.$el.html(html);
    },
    read: function(e) {
        var id = $(e.target).data('id');
        var self = this;
        this.model.id = id;
        this.template = _.template($('#post-single').html());
        this.model.fetch();
    },
    delete: function(evt){
        var self = this

        this.model.destroy({
            success: function(model, res){
                console.log('its deleted!');
                self.model.fetch();
            },
            error: function(model, res){
                console.log('delete error');
            }
    });
    }
});

app.FormView = Backbone.View.extend({
    el: '#form',
    events: {
        'click #save-post': 'save'
    },
    // constructor
    initialize: function() {
        this.model = new app.Message();        
    },
    save: function(e) {
        e.preventDefault();

        var title = this.$el.find('input[name="subject"]').val();
        var content = this.$el.find('textarea[name="content"]').val();
        
        this.model.save({
            title: title,
            content: content
        }, { 
            success: function(model, response, options) {
                app.contentView.model.fetch();
            }
        });
    }
});

app.LoginView = Backbone.View.extend({
    el: 'body',
    events: {
        'click #op-modal': 'modal'
    },
    render: function(){
        this.$('#myModal').modal();
    },
    modal: function(e){
        this.render();
    }
});


$(document).ready(function(){
    app.contentView = new app.ContentView();
    app.formView = new app.FormView();
    app.loginView = new app.LoginView();
});