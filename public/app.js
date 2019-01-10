//functions for each endpoint there's a million of them holy shit

function handleLogin() {

}

function renderAccountCreationForm() {
    let accountCreationForm = `
    <form action="/api/user/" class="js-account-creation-form">
            <fieldset>
            <label for="username">username
            <input placeholder="Your Username" type="text" class="js-username" required>
            </label>
            <label for="password">username
            <input placeholder="Your Password" type="hidden" class="js-password" required>
            </label>
            <button type="submit" id="creationbutton">
                Login
            </button>
            </fieldset>
            <p>Already have an account?</p>
            <button type="submit" id="displayloginformbutton">
                Login
            </button>
            </form>
    `
    $("#accountformbutton").click(event => {
        $('main').html(accountCreationForm)
    })
}

function renderLoginForm() {
    let loginForm = `
    <form action="/api/auth/login" class="js-login-form">
            <fieldset>
            <label for="username">username
            <input placeholder="Your Username" type="text" class="js-username" required>
            </label>
            <label for="password">username
            <input placeholder="Your Password" type="hidden" class="js-password" required>
            </label>
            <button type="submit" id="loginbutton">
                Login
            </button>
            </fieldset>
            <p>No account?</p>
            <button type="submit" id="accountformbutton">
                Create an Account
            </button>
        </form>
    `
    $('#displayloginformbutton').click(event => {
        $('main').html(loginForm)
    })
}

function handleAccountCreation() {
    $(".js-account-creation-form").ajaxForm({url: 'api/user', type: 'post'})
    $(renderLoginForm())
}

function handleBucketCreation() {

}

function getAllBuckets() {
    return 
}

function displayAllBuckets() {

}

function getRelevantIterations() {

}

function displayRelevantIterations() {

}