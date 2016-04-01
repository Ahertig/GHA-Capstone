app.controller('SidenavCtrl', function($scope, SideNavFactory, NotesFactory, $filter, ShareFactory, NotebookFactory) {

	$scope.getCachedNotebooks = NotebookFactory.getCachedNotebooks;
	$scope.getTagsCache = NotesFactory.getTagsCache;
	$scope.getnotes = NotesFactory.getAllCacheNotes;

	$scope.createNote = function(notebook) {
    console.log("creating note in sidenavctrl")
    SideNavFactory.createNote(notebook);
	}

	$scope.createNotebook = SideNavFactory.createNotebook.bind(SideNavFactory);

	// console.log("all notes: ", $scope.getnotes());
  // console.log("all notebook: ", NotebookFactory.getCachedNotebooks());

	$scope.setCurrentNotebook = function(notebook){
		NotebookFactory.setCurrentNotebook(notebook);
	}

	$scope.setCurrentNote = function(note, notebook){
		NotesFactory.setCurrentNote(note);
		if (notebook){
			NotebookFactory.setCurrentNotebook(notebook);
		}
	}

  $scope.toggleSideNav = NotesFactory.toggleSideNav;
  $scope.isSideNavOpen = NotesFactory.isSideNavOpen;

  
  $scope.trashNotebook = function(notebook){
  	NotebookFactory.removeNotebook(notebook);
  }

  $scope.deleteNotebook = function(notebook){
  	console.log("deleteNotebook is undefined now!!");
  }
  
  $scope.restoreNotebook = NotebookFactory.restoreNotebook.bind(NotebookFactory)
  
  $scope.setCurrentNote = NotesFactory.setCurrentNote;

  $scope.getNotes = function(){
    $scope.notes = NotesFactory.getAllCacheNotes();
  }

  $scope.getNotebooks = function() {
     NotebookFactory.fetchMyNotebooks()
     .then(function(_notebooks){
          $scope.notebooks = _notebooks;
     })
     .then(null, function(err){
        console.error("Error retrieving notebooks!", err);
     });
  }

  // Manage Notebook Share
    $scope.shareNotebook = function(notebook, email) {
      ShareFactory.shareNotebook(notebook, email)
    }
    
    $scope.removeNotebookShare = function(notebook, email) {
      console.log('in the controller: ', notebook, email)
      ShareFactory.removeNotebookShare(notebook, email)
    }
  
  $scope.filters = {};
  $scope.setTag = function(tag){
    $scope.currentTag = tag.tag;
    $scope.filters[tag.tag] = tag.tag;
  } 

})


app.filter('filterByTag', function(){
	return function (notes, tag) { 
		return notes.filter(
			function(note){
				return (note.tags.indexOf(tag) > -1) && (note.trash === false);
		});
    }
});