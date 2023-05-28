let Person = Backbone.Model.extend({
    defaults : {
        name: "",
        age:100
    },

    initialize: function(){
        this.set("id", this.generateId());
    },

    generateId: function(){
        //for generating a random unique ID
        const randomID = new Date().getTime().toString();
        return randomID;
    },


    save: function(){
        localStorage.setItem(this.get("id"), JSON.stringify(this));
    }

});

let PersonCollection = Backbone.Collection.extend({
    model : Person,

    // localStorage: new Backbone.LocalStorage('myCollection')

});

let InputView = Backbone.View.extend({
    el: $("#my-view"),

    events: {
        "click #save-btn": "onclickSaveBtn"
    },

    initialize: function(){
        this.personList = new PersonCollection;
    },

    onclickSaveBtn: function(e){
        e.preventDefault();
        // e.stopPropagation();
        let name = this.$("#input-name").val();
        
        if(name){
            alert(`nam is ${name}`);
            let person = new Person({name: name});
            this.personList.add(person);

            this.personList.each(function(person){
                person.save();
            })

            this.$("#input-name").val("");
        }
        

        // else alert("no name found");
        
        
    },



});

// let personCollection = new PersonCollection;

let inputView = new InputView;
// let inputView = new InputView({el: "#my-view"});
