
function handleLoginForm() {
    $('.js-login-form').submit(event => {
        event.preventDefault();
        let userData = {
            username: $('.js-username').val(),
            password: $('.js-password').val()
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
            }
        })
    })

}

function handleBucketGetterButton() {
    $('#bucket-getter-button').click(event => {
        getAllBuckets(displayAllBuckets)
    })
}

function handleBucketCreationFormViewButton() {
    $('#bucket-creator-button').click(event => {
        $('#bucket-creator-form').removeClass('hidden')
    })

}


function handleAccountCreation() {
    
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
            }
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
        success: callback
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

function getRelevantIterations(iterationOf, callback) {
    $.ajax({
        type: 'GET',
        url: `/iteration/${iterationOf}`,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.authToken)
        },
        success: callback
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

function onLoad() {
    handleLoginForm()
    handleBucketGetterButton()
    handleBucketCreationFormViewButton()
    handleBucketCreation()
}

$(onLoad)