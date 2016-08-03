// When enter is pressed in the form field, the comment is sent to the server
$(document).on("keypress", "#comment", function(e) {
    if(e.which == 13) {
        var comment = $(this).val().trim()
        var thisId = $(this).parent().parent().parent().attr('data-id')
        // console.log(thisId)
        // Remove the comment from the form
        $(this).val("")
        // Ajax call to post the comment to the server
        $.ajax({
        	url: '/comment',
        	method: 'POST',
        	contentType: 'application/json', 
			data: JSON.stringify({_id: thisId, comment: comment})
        }).done(function(data) {
            // console.log(data)
        	//data has the comments so loop thru to display it
        	data.forEach(function(value,i) {
        			// console.log(value)
        			// Empty comments before adding to avoid duplicates
        			$('.' + value._id).html("")
        			// Loop thru comments array to append it to the unique id class
	        		value.comment.forEach(function(comment,i) {
	        			$('.' + value._id).append('<li class="list-group-item">'+ comment +'</li>')
	        		var deleteButton = $('<button class="btn btn-block btn-primary deleteComment">Remove Comment\
	        			</button>')
	        		$('.' + value._id).append(deleteButton)
	        		})
        	} )
        })
        // Retrieving the updated comments
        $.ajax({
        	url: '/comment/' + thisId,
        	method: 'GET',
        	contentType: 'application/json', 
        })
    }
})

// Function for deleting comments when the button is clicked
$(document).on("click", ".deleteComment", function() {
	var wantid = $(this).parent().parent().attr("data-id")
	var commentRemove = $(this).prev().text()
	// console.log(commentRemove)
        // Ajax call to post which comment to delete
    	$.ajax({
	        	url: '/comment_delete',
	        	method: 'POST',
	        	contentType: 'application/json', 
				data: JSON.stringify({_id: wantid, comment: commentRemove})
	        }).done(function(data) {
	        	// console.log(data)
	        	data.forEach(function(value,i) {
        			// Empty comments before adding to avoid duplicates
        			$('.' + value._id).html("")
        			// Loop thru comments array to append it to the unique id class
	        		value.comment.forEach(function(comment,i) {
	        			$('.' + value._id).append('<li class="list-group-item">'+ comment +'</li>')
	        		var deleteButton = $('<button class="btn btn-block btn-primary deleteComment">Remove Comment\
	        			</button>')
	        		$('.' + value._id).append(deleteButton)
	        		})
	        	})

	        })
})