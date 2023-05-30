


let Person = Backbone.Model.extend({
    defaults : function(){
        return {
            name: "",
            order: personList.nextOrder()
        };
    },

    // initialize: function(){
    //     this.set("id", this.generateId());
    // },

    // generateId: function(){
    //     //for generating a random unique ID
    //     const randomID = new Date().getTime().toString();
    //     return randomID;
    // },


 

});

let PersonCollection = Backbone.Collection.extend({
    model : Person,

    localStorage: new Backbone.LocalStorage("employees-backbone"),

    nextOrder: function(){
        if(!this.length) return 1;
        return this.last().get("order")+1;
    },

    comparator: 'order'

});

// let personList = new PersonCollection;

let EmpView = Backbone.View.extend({
    tagName: "li",

    template: _.template($("#employee-template").html()),

    events: {
        "dblclick .view" : "edit",
        "click a.destroy" : "clear",
        "keypress .edit" : "updateOnEnter",
        "blur .edit" : "close",
        
    },

    initialize: function(){
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },


    render: function(){
        let html = this.template(this.model.toJSON());
        this.$el.html(html);
        this.input = this.$(".edit");
        return this;
    },

    edit: function(){
        this.$el.addClass("editing");
        this.input.focus();
    },

    close: function(){
        let value = this.input.val();
        if(!value){
            this.clear();
        }
        else{
            this.model.save({name:value});
            this.$el.removeClass("editing");
        }
    },

    updateOnEnter: function(e){
        if(e.keyCode==13)this.close();
    },
    
    clear: function(){
        let name = this.model.get("name");
        this.model.destroy();
        alert(`Employee named ${name} has been removed!`);
    },

});

let personList = new PersonCollection;


let InputView = Backbone.View.extend({
    el: $("#emp-view"),

    template1: _.template("There are <%= noOfEmployees %> employees in this office"),

    events: {
        "click #save-btn": "onclickSaveBtn",
        "click #add-emp-btn": "onclickAddNewEmployee",
        "click #show-emp-btn": "onclickShowAllEmployee",
        "keypress #input-name": "goToSaveBtn",
        "keyup #search-bar" : "performSearch"
    },

    initialize: function(){
        personList.fetch();
        this.hideElement("#input-view");
        this.hideElement("#input-search-view");
        this.hideElement("#output-view");

    },
    hideInputArea: function(){
        this.hideElement("#input-view");
        this.hideElement("#input-search-view");
    },

    hideOutputArea: function(){
        this.hideElement("#output-view");
    },
    

    goToSaveBtn: function(e){
        if(e.keyCode==13){
            this.$("#save-btn").focus();
        }
    },

    onclickAddNewEmployee: function (){
        this.showElement("#input-view");
        this.hideOutputArea();
    },

    showAlert: function(txt){
        alert(txt);
    },

    onclickSaveBtn: function(e){
        e.preventDefault();
        // e.stopPropagation();
        let name = this.$("#input-name").val();        
        if(name){
            let txt = `Employee information saved!\nName: ${name}`;
            let person = new Person({name: name});

            personList.create(person);

            this.showAlert(txt);
            this.clearInputBox("#input-name");
            this.$("#input-name").focus();
        }
        else{
            let txt = "Please enter valid input";
            this.showAlert(txt);
            this.$("#input-name").focus();
        }
    },

    onclickShowAllEmployee: function(){
        this.$("#total-employee").html(this.template1({noOfEmployees: personList.length}))
        this.showElement("#output-view");
        this.hideInputArea();
        // personList.fetch();
        this.$("#employee-list").empty();
        
        personList.each(function(person){
            let empView = new EmpView({model: person});
            this.$("#employee-list").append(empView.render().el);
        })
    },


    clearInputBox: function(selector){
        this.$(selector).val("");
    },

    hideElement: function(selector){
        // this.$(selector).hide();
        this.$(selector).addClass("hidden");
        
    },

    showElement: function(selector){
        // this.$(selector).show();
        this.$(selector).removeClass("hidden");
    },

    performSearch: function(){
        let views = document.querySelectorAll(".view");
        let searchQuery = this.$("#search-bar").val();

        // console.log(searchQuery.toLowerCase());

        for(let i=0; i<views.length; i++){
            if($(views[i]).text().toLowerCase().
            includes(searchQuery.toLowerCase())){
                views[i].classList.remove("hidden");
            }
            else{
                views[i].classList.add("hidden");
            }
        }

    }



});

// let personCollection = new PersonCollection;

let inputView = new InputView;
// let inputView = new InputView({el: "#my-view"});

