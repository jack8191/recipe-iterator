
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

function handleCreateNewIterationButton() {
    $('#bucket-zone').on('click', '.new-iteration-button', event => {
        //console.log('this is working')
        $(event.target).append(
            `
            <div class="iteration-creator-form">
                <form class="iteration-maker">
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

function handleBucketEditButton() {
    $('#bucket-zone').on('click', '.bucket-edit-button', event => {
        //console.log('this is working')
        event.stopPropagation()
        const dataId= $(event.target).attr('data-id')
        console.log(dataId)
        $(event.target).append(
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

function handleCreateNewIterationCreation(iterationOf) {
    $('.new-iteration-button')
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
    const iterations = data.map((iteration, index) => renderBucketResult(iteration))
    $('#iteration-zone').html(iterations)
}

function renderIterationResult(result) {
    return `
    <div class="iteration>
        <h2>Iteration</h2>
        <p>Prepared: ${result.date}</p>
        <p>Ingredients: ${result.ingredients}</p>
        <p>Procedure: ${result.procedure}</p>
        <p>Notes: ${result.notes}</p>
        <button class="iteration-edit-button" data-id="${result.id}">Edit Iteration</button>
        <button class="iteration-delete-button" data-id="${result.id}">Edit Iteration</button>
    `
}

function handleCancelButton() {
    $('#bucket-zone').on('click', '.cancel-button', event => {
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
}

$(onLoad)