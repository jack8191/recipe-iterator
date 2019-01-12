//create iteration POST
function createNewIteration(callbackFn) {
    setTimeout(function(){callbackFn(MOCK_ITERATION)}, 100)
}

function displayNewIteration(data) {
    
        $('body').append(
            '</p>' +data.text + '<p>')
}


function createAndDisplayNewIteration() {
    createNewBucket(displayNewIteration);
}

//$(function() {
//    createAndDisplayNewIteration();
//})

//list all iterations GET

function getAllIterations(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_ITERATION_LIST)}, 100);
}


function displayAllIterations(data) {
    for (index in data.iterations) {
       $('body').append(
        '<p>' + data.iterations[index].text + '</p>');
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayIterations() {
    getAllIterations(displayAllIterations);
}

//$(function() {
//    getAndDisplayIterations();
//})

//edit iteration PATCH
function updateIteration(callbackFn) {
    setTimeout(function(){ callbackFn(UPDATED_ITERATION)}, 100)
}

function displayUpdatedIteration(data) {
    
        $('body').append(
            '<p>' + data.text + '</p>'
        )
    }


function updateAndDisplayIteration() {
    displayUpdatedIteration(updateIteration)
}

//$(function() {
//    updateAndDisplayIteration()
//})

//delete iteration DELETE
function deleteIteration(callbackFn) {
    setTimeout(function(){ callbackFn(ITERATION_PARAMS)}, 100)
}

function displayIterationDeletion(data) {
    $('body').prepend(
        `<p>${data.title} deleted.</p>`
    )
}

function deleteAndReportIteration() {
    displayIterationDeletion(deleteIteration)
}

//$(function(){
//    deleteAndReportIteration()
//})








const MOCK_ITERATION = {
    "id": "666666",
    "iteration of": "beans and greens",
    "date": "date",
    "ingredients":"black beans, spinach, olive oil, coarse mustard",
    "procedure": "overnight soak, 2:1 water to bean ratio, 2 hour simmer, oil and mustard added 1/2 hour before end",
    "notes": "beans overcooked-reduce cooking time for next iteration"
}

const MOCK_ITERATION_LIST = {
    "iterations": [
        {
            "id": "777777",
            "iteration of": "Beans with Greens",
            "date": "date",
            "ingredients":"black-eyed peas, corn oil, liquid smoke, collards",
            "procedure": "no soak, 3 hour simmer",
            "notes": "beans bad texture. soak not optional"
        },
        {
            "id": "888888",
            "iteration of": "Beans with Greens",
            "date": "date",
            "ingredients":"kidney beans, endive, hot pepper",
            "procedure": "overnight soak, 2:1 water to bean ratio, 2 hour simmer, oil and mustard added 1/2 hour before end",
            "notes": "beans overcooked-reduce cooking time for next iteration"
        }
    ]
}

const UPDATED_ITERATION = {
    "id": "777777",
    "iteration of": "beans and greens",
    "date": "date",
    "ingredients":"black-eyed peas, grapeseed oil, liquid smoke, collards",
    "procedure": "no soak, 3 hour simmer",
    "notes": "beans bad texture. soak not optional"
}

const ITERATION_PARAMS = {
    "id": "777777"
}

//module.exports = router