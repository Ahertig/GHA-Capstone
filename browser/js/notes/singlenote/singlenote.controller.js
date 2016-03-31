app.controller('SingleNoteCtrl', function($scope, NotesFactory, TonicFactory, GithubFactory, AuthService,$window) {
    $scope.savenote = {};
    $scope.tagform = {};

    $scope.showTagEditWindow = false

    var stroutput = "";
   
    $scope.currentNote = NotesFactory.getCurrentNote;

    $scope.getCurrentNootbook = function(){
      var theNotebookID = NotesFactory.findParentNotebook($scope.currentNote()._id);
      return NotesFactory.findNotebookById(theNotebookID);
    }
    
    $scope.getCurrentNootbook();
    //$scope.currentNotebook = NotesFactory.getCurrentNotebook;
    $scope.showmarkdown = false;
    $scope.successmessage = null;

    // Hide notification upon click anywhere in the single note
    $scope.hideNotification = function() {
          $scope.successmessage = null;
          $scope.errormessage = null;
    }
   
  
    $scope.removeTag = function(note, tag) {
      console.log("remove tag");
      if(note.tags.indexOf(tag) === -1){
        console.log("this note doesn't have this tag!");
      }
      else {
        NotesFactory.removeTag(note._id, tag);
        $scope.currentNote().tags.splice($scope.currentNote().tags.indexOf(tag),1);
       }
    }

    $scope.addTag = function(note, tag) {
      console.log("scope.tags:", $scope.tags);
      if(!tag) { 
        $scope.tagsavefailure = "Cannot save an empty tag!"; 
        return;
      }
      if(note.tags.indexOf(tag) === -1){
        $scope.currentNote().tags.push(tag);
        NotesFactory.addTag(note._id, tag);
        $scope.tagToAdd = "";
      }
      else {
        $scope.tagsavefailure = "this tag is in tags! add a new tag?";
      }
    } 
    // $scope.addTag = function(note, tag) {
    //    console.log("tag list", $scope.tags);
    //   if(!tag) { 
    //     $scope.tagsavefailure = "Cannot save an empty tag!"; 
    //     return;
    //   }
    //   if(note.tags.indexOf(tag) === -1){
    //       $scope.tags.push(tag);
    //       console.log("adding tag", tag);
    //       var currentNotebookID = NotesFactory.findParentNotebook(note._id);
    //       note.tags.push(tag);
    //       NotesFactory.updateNoteInNotebookCache(currentNotebookID, note, 'update');
    //       $scope.tagsavesuccess = "Tag saved successfully!";
    //       $scope.tagToAdd = "";
    //     }
    //   else {
    //     $scope.tagsavefailure = "this tag is in tags! add a new tag?";
    //   }

    // } 


    $scope.openTagWindow = function() {
      $scope.showTagEditWindow = !$scope.showTagEditWindow;
    }

    $scope.save = function(){ 
      var currentNotebook;
      var tags = $scope.currentNote().tags;
      var lastUpdateDate = Date.now();
      var subjectToSave = $('#notesubject').val();
      var bodyToSave = $('#notebody').val();
      $scope.savenote = {
        "subject": subjectToSave,
        "body": bodyToSave,
        "lastUpdate": lastUpdateDate,
        "tags": tags
      }  
      // if(!$scope.getCurrentNootbook())  {
        currentNotebook = NotesFactory.findParentNotebook($scope.currentNote()._id);
      // }
      // else {
      //   currentNotebook = $scope.getCurrentNootbook();
      // }
      NotesFactory.saveNote(currentNotebook,$scope.currentNote()._id, $scope.savenote)
      .then(function(note) {
          $scope.successmessage="Note saved successfully!";
        }, function(err) {
          $scope.errormessage = "Error saving note" + err;
        })    
    }

    $scope.trashNote = function(noteId) {
      NotesFactory.trashNote(noteId)
      .then(function(){
        $('#edit-tab').removeClass('active');
        $('#preview-tab').addClass('active');
        $('#edit').removeClass('in active');
        $('#preview').addClass('in active');
      })
      
    }

    $scope.deleteNote = function(note) {
      NotesFactory.deleteNote(note)
        .then(function (data) {
          console.log("this note has been deleted", data);
        });
    }
    $scope.restoreNote = function(noteId){
      NotesFactory.restoreNote(noteId);
    }

    $scope.highlightPre = function() {
      hljs.initHighlighting();
    }

    $scope.addPre = function() {
      var domElement = $('#testdiv')[0];
      var codeValue = domElement.innerHTML;
      var preElement = $('<pre><code>' + codeValue + '</code></pre>');
      $(domElement).replaceWith(preElement);
      hljs.initHighlighting();
    }

    // Tonic Setup
    $scope.tonic = true;
    $scope.closeTonic = function() {
      document.getElementById("my-element").innerHTML = "";
      $scope.tonic = true;
    }

    $scope.runTonic = function() {
      $scope.tonic = true;
      document.getElementById("my-element").innerHTML = "";
      var notebook = Tonic.createNotebook({
        element: document.getElementById("my-element"),
        source: TonicFactory.getSelectionText()
      })       
      $scope.tonic = false;
    }

    // Creating Gists 
    $scope.createGist = function(note) {
      AuthService.getLoggedInUser()
      .then( function(user) {
        // var headers = { "Authorization": "token " + user.github.token };
        GithubFactory.createGist(note)
        .then(function(gist) {
          $scope.successmessage="Gist created successfully!";
        })
      })
    }

    $scope.isSideNavOpen = NotesFactory.isSideNavOpen;

    $scope.singleNoteColumnWidth = function() {
      if($scope.isSideNavOpen()) {
        if (!$scope.tonic) return 'col-lg-5 col-md-5'; // if tonic is SHOWING
        return 'col-lg-8 col-md-8'
      }
      else {
        if(!$scope.tonic) return 'col-lg-6 col-md-6'; // if tonic is SHOWING
        return 'col-lg-11 col-md-11';
      }
   }

})


