$(function() {
	var url = "https://radiant-inferno-6013.firebaseio.com/";
	var db = new Firebase(url);
	
	// The view model.
	var viewModel = {
		isAdmin: ko.observable(false),
		ideas: ko.observableArray([]),
		form: {
			title: ko.observable(""),
			content: ko.observable("")
		},
		addIdea: function() {
			db.push({
				title: this.form.title(),
				content: this.form.content(),
				votes: 0
			});
			
			// Clears the form.
			this.form.title("");
			this.form.content("");
		},
		deleteIdea: function(idea) {
			var deleteRef = new Firebase(url + idea.id);

			deleteRef.remove(function() {
				viewModel.ideas.remove(idea);
			});
		},
		likeIdea: function(idea) {
			var updateRef = new Firebase(url + idea.id);
			var count = idea.votes() + 1;
			
			updateRef.update({ votes: count }, function() {
				idea.votes(count);
			});
		},
		toggleAdmin: function() {
			var that = this;
			
			if (this.isAdmin()) {
				this.isAdmin(false);
			} else {
				window.setTimeout(function () {
					that.isAdmin(true);
				}, 2000);	
			}
		}
	};
	
	var getIdea = function(data) {
		var val = data.val();
	
		viewModel.ideas.push({ 
			title: val.title,
			content: val.content,
			votes: ko.observable(val.votes),
			id: data.key()
		});
	};
	
	// This gets fired once per child on load and when a new child is added.
	db.on("child_added", getIdea);

	ko.applyBindings(viewModel);
});