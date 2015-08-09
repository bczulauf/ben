$(function() {
	var url = "https://radiant-inferno-6013.firebaseio.com/";
	var db = new Firebase(url);
	
	// The view model.
	var viewModel = {
		isAdmin: ko.observable(false),
		ideas: ko.observableArray([]),
		sortOptions: [{title: "recent"}, {title: "popular"}],
		selectedSort: ko.observable("recent"),
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
		},
		toggleSort: function(sortOption) {
			var option = sortOption.title;
			
			if (option === viewModel.selectedSort()) {
				return;
			}
			
			viewModel.selectedSort(option); 
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
	
	var updateIdea = function(data, key) {
		var val = data.val();
		var match = ko.utils.arrayFirst(viewModel.ideas(), function(item) {
		    if ( data.key() === item.id ) {
				item.votes(val.votes);
			}
		});
	}
	
	// This gets fired once per child on load and when a new child is added.
	db.on("child_added", getIdea);
	
	// This gets fired when a child is updated.
	db.on("child_changed", updateIdea);

	ko.applyBindings(viewModel);
});