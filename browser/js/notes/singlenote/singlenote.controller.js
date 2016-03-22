app.controller('SingleNoteCtrl', function($scope, $rootScope, NotesFactory) {
	$scope.savenote = {};
	
	var stroutput = "";
	var userID = $scope.user._id;
	var noteID = $rootScope.currentNote._id;
	var notebookID = $rootScope.currentNotebook._id;

    // $scope.markedbody = marked(currentNote.body);

    $scope.showmarkdown = false;

    $scope.foo = "# bar"

    $scope.togglemarkdown = function() {
    	$scope.showmarkdown = !$scope.showmarkdown;
    	console.log("toggling markdown to", $scope.showmarkdown)
    }

    $scope.toggle = function() {
    	// $( "#toggleme" ).replaceWith( "<marked># heading 1\n## heading 2\n" );
    	// $( "#somestuff" ).replaceWith( "<marked># heading 1\n## heading 2\n" );
    	// $scope.mymarkdown = "<marked># Hello\n ## world</marked>"
    	$scope.$digest();
    }

	//console.log("user ID, Note ID and NotebookID",userID, noteID);
    $scope.save = function(){ 
    	var childArray = $('article').children();
		// var childArray = $('article').children().outerHTML();
		// console.log("Here is the text:",text)
		for(var i = 0; i < childArray.length; i++) {
		    stroutput += childArray[i].outerHTML;
		 }
		$scope.savenote = {
			"subject": $rootScope.currentNote.subject,
			"body": stroutput
		}
    	console.log("update note: stroutput:",stroutput, "savenote:",$scope.savenote )
    	// console.log("NotebookID",$rootScope.currentNotebook._id);
     	NotesFactory.saveNote(userID, notebookID,noteID, $scope.savenote);
     }

     $scope.saveTextarea = function(){ 
    	var bodyText = $('#notebody').val();
    	var noteSubject = $('#notesubject').val()
		$scope.savenote = {
			"subject": noteSubject,
			"body": bodyText
		}
    	console.log("saving note body:",$scope.savenote.body)
    	$('#markdowncontent').html($scope.savenote.body)
    	// $scope.$digest();
    	// console.log("NotebookID",$rootScope.currentNotebook._id);
     	NotesFactory.saveNote(userID, notebookID,noteID, $scope.savenote);
     }
	

})