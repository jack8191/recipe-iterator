
function handleLoginForm() {
    $('.js-login-form').submit(event => {
        event.preventDefault();
        let userData = {
            username: $('.js-login-username').val(),
            password: $('.js-login-password').val()
        }
        $.ajax({
            type: 'POST',
            url: '/auth/login',
            data: JSON.stringify(userData),
            contentType: "application/json; charset=utf-8",
            //dataType: JSON,
            success: function(res) {
                console.log(res)
                localStorage.setItem('authToken', res.authToken)
                localStorage.setItem('userId', res.userId)
                $('#login').addClass('hidden')
                $('#bucket-actions').removeClass('hidden')
            },
            error: errorHandle
        })
    })

}

function handleDisplayAccountFormButton() {
    $('#accountformbutton').click(event => {
        $('#login').addClass('hidden')
        $('#signup').removeClass('hidden')
    })
}

function handleDisplayLoginFormButton() {
    $('#displayloginformbutton').click(event => {
        $('#login').removeClass('hidden')
        $('#signup').addClass('hidden')
    })
}

function handleBucketGetterButton() {
    $('#bucket-getter-button').click(event => {
        $('#iteration-zone').html('')
        getAllBuckets(displayAllBuckets)
    })
}

function handleBucketCreationFormViewButton() {
    $('#bucket-creator-button').click(event => {
        $('#bucket-creator-form').toggleClass('hidden')
        if (!$('#bucket-creator-form').hasClass('hidden')){$('#bucket-creator-button').text('Hide New Bucket Form')}
        else{$('#bucket-creator-button').text('Create a New Bucket')}
    })

}


function handleAccountCreation() {
    $('.js-account-creation-form').submit(event => {
        event.preventDefault()
        let newAccountData = {
            username: $('.js-new-username').val(),
            password: $('.js-new-password').val()
        }
        $.ajax({
            type: 'POST',
            url: '/users',
            data: JSON.stringify(newAccountData),
            contentType: "application/json; charset=utf-8",
            success: function(res) {
                $('#login').removeClass('hidden')
                $('#signup').addClass('hidden')
                $('#message-zone').html('<p>Account Created. You may now log in.')
            },
            error: errorHandle
        })
    })
}

function handleBucketCreation() {
    $('#bucket-submit-button').click(event => {
        event.preventDefault()
        let newBucketData = {
            title: $('.js-bucket-title').val(),
            description: $('.js-bucket-description').val(),
            user: localStorage.userId
        }
        $.ajax({
            type: 'POST',
            url: '/bucket',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken)
            },
            data: JSON.stringify(newBucketData),
            contentType: "application/json; charset=utf-8",
            success: function(res) {
                getAllBuckets(displayAllBuckets)
            },
            error: errorHandle
        })
    })
}

function getOneBucket(id, callback) {
    $.ajax({
        type: 'GET',
        url: `/bucket/${id}`,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken)
        },
        success: callback,
        error: errorHandle 
    })
}

function getAllBuckets(callback) {
    $.ajax({
        type: 'GET',
        url: `/bucket/${localStorage.userId}`,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken)
        },
        success: callback,
        error: errorHandle
        }
    )
     
}

function displayOneBucket(data) {
    const bucket = renderBucketResult(data)
    $('#bucket-zone').html(bucket)
}

function displayAllBuckets(data) {
    console.log(data)
    const buckets = data.map((bucket, index) => renderBucketResult(bucket))
    $('#bucket-zone').html(buckets)
}

function renderBucketResult(result) {
    return `
    <div class="bucket">
        <h2>Bucket</h2>
        <p>Title: ${result.title}</p>
        <p>Description: ${result.description}</p>
        <button class="iteration-view-button" data-iterationOf="${result.id}">View Iterations</button>
        <button class="new-iteration-button" data-iterationOf="${result.id}">Create New Iteration</button>
        <button class="bucket-edit-button" data-id="${result.id}">Edit Bucket</button>
        <button class="bucket-delete-button" data-id="${result.id}">Delete Bucket</button>
    </div>
    `
    //$('.bucket button').data('iteration-id')
}

function handleBucketDeletion() {
    $('#bucket-zone').on('click', '.bucket-delete-button', event =>{
        event.stopPropagation()
        const dataId= $(event.target).attr('data-id') 
        if(confirm('Are you sure? This will permently delete the bucket as well as any iterations thereof.')){
        $.ajax({
                type: 'DELETE',
                url: `/bucket/${dataId}`,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken)
                },
                success: function(res) {
                    getAllBuckets(displayAllBuckets)
                    $('#message-zone').html('<p>Bucket deleted.</p>')
                },
                error: errorHandle
            })
        }
    })
}

function handleBucketEditButton() {
    $('#bucket-zone').on('click', '.bucket-edit-button', event => {
        //console.log('this is working')
        event.stopPropagation()
        $('.bucket-edit-form').remove()
        const dataId= $(event.target).attr('data-id')
        console.log(dataId)
        $(event.target).closest('div').append(
            `
            <div class="bucket-edit-form">
                <form class="bucket-editor" data-id=${dataId}>
                    <fieldset>
                    <label for="title">
                        <input placeholder="Title" type="text" class="js-bucket-editor-title-${dataId}">
                    </label>
                    <label for="Description">
                        <input placeholder="Description" type="text" class="js-bucket-editor-description-${dataId}">
                    </label>
                    <button type="submit" class="bucket-edit-submit" >
                        Edit Bucket
                    </button>
                    </fieldset>
                </form>
                <button class="cancel-button">
                    Hide Form
                </button>
            </div>
            `
        )
    })
}

function handleBucketEdit() {
    $('#bucket-zone').on('submit', '.bucket-editor', event => {
        event.preventDefault()
        event.stopPropagation()
        const dataId = $(event.target).attr('data-id')
        let editedData = {}
        if ($(`.js-bucket-editor-title-${dataId}`).val()) {editedData.title = $(`.js-bucket-editor-title-${dataId}`).val()};
        if ($(`.js-bucket-editor-description-${dataId}`).val()) {editedData.description = $(`.js-bucket-editor-description-${dataId}`).val()};
        console.log(editedData)
        $.ajax({
            method: 'PATCH',
            url: `/bucket/${dataId}`,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken)
            },
            data: JSON.stringify(editedData),
            contentType: "application/json; charset=utf-8",
            success: function(res) {
                getAllBuckets(displayAllBuckets)
                $('#message-zone').html('<p>Bucket edited.</p>')
            },
            error: errorHandle
        })
    })
}

function handleCreateNewIterationButton() {
    $('main').on('click', '.new-iteration-button', event => {
        //console.log('this is working')
        event.stopPropagation()
        event.preventDefault()
        const dataIterationOf= $(event.target).attr('data-iterationOf')
        $('.iteration-creator-form').remove()
        $(event.target).closest('div').append(
            `
            <div class="iteration-creator-form">
                <form class="iteration-maker" data-iterationOf=${dataIterationOf}>
                    <fieldset>
                        <label for="date">
                            <input placeholder="Date" type="text" class="js-iteration-date">
                        </label>
                        <label for="Ingredients">
                            <input placeholder="Ingredients" type="text" class="js-iteration-ingredients">
                        </label>
                        <label for="Procedure">
                            <input placeholder="Procedure" type="text" class="js-iteration-procedure">
                        </label>
                        <label for="Notes">
                            <input placeholder="Notes" type="text" class="js-iteration-notes">
                        </label>
                        <button type="submit" class="new-iteration-submit-button">
                            Create Iteration
                        </button>
                    </fieldset>
                    </form>
                <button class="cancel-button">
                    Hide Form
                </button>
            </div>
            `
        )
    })
}


function handleNewIterationCreation() {
    $('main').on('click', '.new-iteration-submit-button', event =>{
        event.preventDefault()
        event.stopPropagation()
        const dataIterationOf = $(event.target).closest('form').attr('data-iterationOf')
        let newIterationData = {
            iterationOf: dataIterationOf,
            date: $('.js-iteration-date').val(),
            ingredients: $('.js-iteration-ingredients').val(),
            procedure: $('.js-iteration-procedure').val(),
            notes: $('.js-iteration-notes').val()
        }
        $.ajax({
            type: 'POST',
            url: `/iteration`,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken)
            },
            data: JSON.stringify(newIterationData),
            contentType: "application/json; charset=utf-8",
            success: function(res) {
                $('#message-zone').html('<p>Iteration created. View it by clicking View Iterations under the relevant bucket.</p>')
                $('.iteration-creator-form').remove()
            },
            error: errorHandle
        })
    })
}

function handleIterationViewButton() {
    $('#bucket-zone').on('click', '.iteration-view-button', event => {
        const iterationOf = $(event.target).attr('data-iterationOf')
        const singleBucket = $(event.target).closest('.bucket').html()
        $('#bucket-zone').html(singleBucket)
        getRelevantIterations(iterationOf, displayRelevantIterations)
        //getOneBucket(iterationOf, displayOneBucket)
    })
    
}

function getRelevantIterations(iterationOf, callback) {
    $.ajax({
        type: 'GET',
        url: `/iteration/${iterationOf}`,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken)
        },
        success: callback,
        error: errorHandle
        }
    )
}

function displayRelevantIterations(data) {
    const iterations = data.map((iteration, index) => renderIterationResult(iteration))
    $('#iteration-zone').html(iterations)
}

function renderIterationResult(result) {
    return `
    <div class="iteration">
        <h2>Iteration</h2>
        <p>Prepared: ${result.date}</p>
        <p>Ingredients: ${result.ingredients}</p>
        <p>Procedure: ${result.procedure}</p>
        <p>Notes: ${result.notes}</p>
        <button class="iteration-edit-button" data-id="${result.id}">Edit Iteration</button>
        <button class="iteration-delete-button" data-id="${result.id}">Delete Iteration</button>
    </div>
    `
}

function handleIterationDeletion() {
    $('#iteration-zone').on('click', '.iteration-delete-button', event =>{
        event.stopPropagation()
        const dataId = $(event.target).attr('data-id')
        const iterationOf = $('#bucket-zone').children('.iteration-view-button').attr('data-iterationof')
        if(confirm('Are you sure? This will permently delete the iteration.')){
        $.ajax({
                type: 'DELETE',
                url: `/iteration/${dataId}`,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken)
                },
                success: function(res) {
                    $('#message-zone').html('<p>Iteration deleted.</p>')
                    getRelevantIterations(iterationOf, displayRelevantIterations)
                },
                error: errorHandle
            })
        }
    })
}

function handleIterationEditButton() {
    $('#iteration-zone').on('click', '.iteration-edit-button', event => {
        //console.log('this is working')
        event.stopPropagation()
        $('.iteration-edit-form').remove()
        const dataId= $(event.target).attr('data-id')
        console.log(dataId)
        $(event.target).closest('div').append(
            `
            <div class="iteration-edit-form">
                <form class="iteration-editor" data-id=${dataId}>
                    <fieldset>
                    <label for="date">
                        <input placeholder="Date" type="text" class="js-iterator-editor-date-${dataId}">
                    </label>
                    <label for="ingredients">
                        <input placeholder="Ingredients" type="text" class="js-iterator-editor-ingredients-${dataId}">
                    </label>
                    <label for="procedure">
                        <input placeholder="Procedure" type="text" class="js-iterator-editor-procedure-${dataId}">
                    </label>
                    <label for="notes">
                        <input placeholder="Notes" type="text" class="js-iterator-editor-notes-${dataId}">
                    </label>
                    <button type="submit" class="iteration-edit-submit" >
                        Edit Iteration
                    </button>
                    </fieldset>
                </form>
                <button class="cancel-button">
                    Hide Form
                </button>
            </div>
            `
        )
    })
}

function handleIterationEdit() {
    $('#iteration-zone').on('submit', '.iteration-editor', event => {
        event.preventDefault()
        event.stopPropagation()
        const dataId = $(event.target).attr('data-id')
        const iterationOf = $('#bucket-zone').children('.iteration-view-button').attr('data-iterationof')
        let editedData = {}
        if ($(`.js-iterator-editor-date-${dataId}`).val()) {editedData.date = $(`.js-iterator-editor-date-${dataId}`).val()};
        if ($(`.js-iterator-editor-ingredients-${dataId}`).val()) {editedData.ingredients = $(`.js-iterator-editor-ingredients-${dataId}`).val()};
        if ($(`.js-iterator-editor-procedure-${dataId}`).val()) {editedData.procedure = $(`.js-iterator-editor-procedure-${dataId}`).val()};
        if ($(`.js-iterator-editor-notes-${dataId}`).val()) {editedData.notes = $(`.js-iterator-editor-notes-${dataId}`).val()};
        console.log(editedData)
        $.ajax({
            method: 'PATCH',
            url: `/iteration/${dataId}`,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken)
            },
            data: JSON.stringify(editedData),
            contentType: "application/json; charset=utf-8",
            success: function(res) {
                 $('#message-zone').html('<p>Iteration updated.</p>')
                getRelevantIterations(iterationOf, displayRelevantIterations)
            },
            error: errorHandle
        })
    })
}

function handleCancelButton() {
    $('main').on('click', '.cancel-button', event => {
        $(event.target).closest('div').addClass('hidden')
    })
}

function errorHandle() {
    $('#message-zone').html('<p>Something went wrong, please try again.</p>')
}

$( document ).ajaxSend(function() {
    $( "#message-zone" ).html( "" );
  });

function onLoad() {
    handleLoginForm()
    handleBucketGetterButton()
    handleBucketCreationFormViewButton()
    handleBucketCreation()
    handleDisplayAccountFormButton()
    handleDisplayLoginFormButton()
    handleAccountCreation()
    handleCreateNewIterationButton()
    handleCancelButton()
    handleBucketEditButton()
    handleBucketEdit()
    handleBucketDeletion()
    handleNewIterationCreation()
    handleIterationViewButton()
    handleIterationDeletion()
    handleIterationEditButton()
    handleIterationEdit()
}

$(onLoad)