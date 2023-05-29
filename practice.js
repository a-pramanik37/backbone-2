


let Person = Backbone.Model.extend({
    defaults : function(){
        return {
            name: "",
            designation: "",
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


    // save: function(){
    //     localStorage.setItem("personlist", JSON.stringify(this));
    // },

    // localStorage: new Backbone.localStorage("personlist"),

    comparator: 'order'

});

// let personList = new PersonCollection;

let EmpView = Backbone.View.extend({
    tagName: "label",

    template: _.template($("#employee-template").html()),

    render: function(){
        let html = this.template(this.model.toJSON());
        this.$el.html(html);
        return this;
    }

});

let personList = new PersonCollection;


let InputView = Backbone.View.extend({
    el: $("#emp-view"),

    events: {
        "click #save-btn": "onclickSaveBtn",
        "click #add-emp-btn": "onclickAddNewEmployee",
        "click #show-emp-btn": "onclickShowAllEmployee",
        "keypress #input-name": "goToDesignation",
        "keypress #input-designation": "goToSaveBtn",
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
    
    goToDesignation: function(e){
        if(e.keyCode==13){
            this.$("#input-designation").focus();
        }
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
        let designation = this.$("#input-designation").val();
        
        if(name && designation){
            let txt = `Employee information saved!\nName: ${name} and Designation: ${designation}`;
            let person = new Person({name: name, designation: designation});
            // this.personList = JSON.parse(localStorage.getItem("personlist"));

            // this.personList.add(person);
            
            // this.personList.fetch();
            // personList.create({name: name, designation: designation});
            personList.create(person);
            // this.personList.each(function(person){
            //     person.save();
                
            // })


            this.showAlert(txt);
            this.clearInputBox("#input-name");
            this.clearInputBox("#input-designation");
            this.$("#input-name").focus();
        }
        else{
            let txt = "Please enter valid input";
            this.showAlert(txt);
            this.$("#input-name").focus();
        }
    },

    onclickShowAllEmployee: function(){
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
    }




});

// let personCollection = new PersonCollection;

let inputView = new InputView;
// let inputView = new InputView({el: "#my-view"});

