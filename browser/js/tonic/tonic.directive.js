app.directive('tonicDirective', function() {
	return {
		restict: 'E', 
		scope: {
			code: '='
		}, 
		templateUrl: 'js/tonic/tonic.html',
		controller: 'tonicCtrl'
	}
})

app.factory('TonicFactory', function() {
	var TonicFactory = {};

	// Use this function to get selected text in window
	// TonicFactory.getSelectionText = function() {
	//     var text = "";
	//     if (window.getSelection) {
	//         text = window.getSelection().toString();
	//     } else if (document.selection && document.selection.type != "Control") {
	//         text = document.selection.createRange().text;
	//     }
	//     return text;
	// }

	// Use this function to get selected text in textarea
	TonicFactory.getSelectionText = function() {
		// obtain the object reference for the <textarea>
	    var txtarea = document.getElementById("notebody");
	    // obtain the index of the first selected character
	    var start = txtarea.selectionStart;
	    // obtain the index of the last selected character
	    var finish = txtarea.selectionEnd;
	    // obtain the selected text
	    var sel = txtarea.value.substring(start, finish);
	    // do something with the selected content
	    return sel;
	}





	return TonicFactory;
})

app.controller('tonicCtrl', function($scope, TonicFactory) {
	$scope.run = false;
	$scope.tonicMsg = 'Run Tonic'

	$scope.runTonic = function() {
		if($scope.run)  {
			$scope.run = false;
			$scope.tonicMsg = 'Run in Tonic'
		}
		else {
			$scope.run = true;
			$scope.tonicMsg = 'Hide Tonic'
		}
		console.log('selectionText: ', TonicFactory.getSelectionText())
		document.getElementById("my-element").innerHTML = "";
		var notebook = Tonic.createNotebook({
		    element: document.getElementById("my-element"),
		    source: TonicFactory.getSelectionText()
		})

	}
})






