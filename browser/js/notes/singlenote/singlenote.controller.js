app.controller('SingleNoteCtrl', function($scope, NotesFactory, TonicFactory) {
    $scope.savenote = {};
    $scope.tagform = {};

    $scope.showTagEditWindow = false

    var stroutput = "";
    $scope.currentNote = NotesFactory.getCurrentNote;
    //$scope.currentNotebook = NotesFactory.getCurrentNotebook;
    $scope.showmarkdown = false;
    $scope.successmessage = null;
    $scope.currentNotebook;

    $scope.removeTag = function(noteId, tag) {
      NotesFactory.removeTag(noteId, tag);
    }

    $scope.addTag = function(noteId, tag) {
      if(!tag) { 
        $scope.tagsavefailure = "Cannot save an empty tag!"; 
        return;
      }
      console.log("running addTag", noteId, tag)
      NotesFactory.addTag(noteId, tag)
      .then(function(newNote) {
        console.log("saved note with new tag tag",newNote.data);

        // update tags cache
        NotesFactory.updateTagsCache(newNote.data.tags[newNote.data.tags.length - 1])

        var currentNotebook = NotesFactory.findParentNotebook(noteId)

 

        // update Notes cache
        NotesFactory.updateNoteInNotebookCache(currentNotebook, newNote, 'update');

        // generate success message
        $scope.tagsavesuccess = "Tag saved successfully!";
        $scope.tagToAdd = "";

        }, function(err) {
          console.error("error saving tag",err)

        })
    }

    $scope.openTagWindow = function() {
      $scope.showTagEditWindow = !$scope.showTagEditWindow;
    }

    $scope.save = function(){ 
      var subjectToSave = $('#notesubject').val();
      var bodyToSave = $('#notebody').val();
      var currentNotebook;

      $scope.savenote = {
        "subject": subjectToSave,
        "body": bodyToSave
      }  

      NotesFactory.getCurrentNotebook()
      .then(function(_currentNotebook){
        currentNotebook = _currentNotebook;
        })
      .then(function(){
        return NotesFactory.saveNote(currentNotebook._id,$scope.currentNote()._id, $scope.savenote)
      })
      .then(function(note) {
          $scope.successmessage="Note saved successfully!" + note;
        }, function(err) {
          $scope.errormessage = "Error saving note" + err;
        })    
    }


    $scope.deleteNote = function(note) {
      NotesFactory.trashNote(note, 'delete');
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

    // Trashing and Restoring note


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

})

// Tonic Keypress Directive
app.directive('enterKey', function(TonicFactory) {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            var keyCode = event.which || event.keyCode;
            if (keyCode === 13 && event.ctrlKey) {    
                scope.$apply(function() {
                    scope.$eval(attrs.enterKey);
                });
                event.preventDefault();
            }
        });
    };
})

