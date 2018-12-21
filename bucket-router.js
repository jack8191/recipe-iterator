//create bucket POST

function createNewBucket(callbackFn) {
    setTimeout(function(){callbackFn(NEW_BUCKET)}, 100)
}

function displayNewBucket(data) {
    
        $('body').append(
            '</p>' +data.bucket.text + '<p>')
}


function createAndDisplayNewBucket() {
    createNewBucket(displayNewBucket);
}

$(function() {
    getAndDisplayNewBucket();
})




//view all buckets GET
function getAllBuckets(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_BUCKET_LIST)}, 100);
}

// this function stays the same when we connect
// to real API later
function displayAllBuckets(data) {
    for (index in data.buckets) {
       $('body').append(
        '<p>' + data.buckets[index].text + '</p>');
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayBuckets() {
    getAllBuckets(displayAllBuckets);
}

$(function() {
    getAndDisplayBuckets();
})

//edit buckets PATCH 

function updateBucket(callbackFn) {
    setTimeout(function(){ callbackFn(UPDATED_BUCKET)}, 100)
}

function displayUpdatedBucket(data) {
    
        $('body').append(
            '<p>' + data.updatedBucket.text + '</p>'
        )
    }


function updateAndDisplayBucket() {
    displayUpdatedBucket(updateBucket)
}

$(function() {
    updateAndDisplayBucket()
})

//delete buckets and all related iterations DELETE
function deleteBucket(callbackFn) {
    setTimeout(function(){ callbackFn(BUCKET_ID)}, 100)
}

function displayBucketDeletion(data) {
    $('body').prepend(
        `<p>${data.title} deleted.</p>`
    )
}

function deleteAndReportBucket() {
    displayBucketDeletion(deleteBucket)
}

$(function(){
    deleteAndReportBucket()
})


//mock data
const MOCK_BUCKET_LIST = {
    "buckets": [
        {
            "id":"11111",
            "title":"Beans with Greens",
            "description":"Legumes cooked with a fat, additive, and leafy green vegetable",
            "iterations": "5" 
        },
        {
            "id":"22222",
            "title":"Chickpea Flour Pancackes",
            "description":"Chickpea flower and liquid/spices panfried",
            "iterations": "7"
        },
        {
            "id":"33333",
            "title":"Apple Quick Bread",
            "description":"Baking soda and apple sweet flour loaf",
            "iterations": "2"
        },
        {
            "id":"44444",
            "title":"Meal Shake",
            "description":"Frozen produce and protein powder-based one-jug food solution",
            "iterations": "33"
        }
    ]
}

const NEW_BUCKET = {
    "id": "55555",
    "title": "Oatmeal",
    "description": "The classic breakfast staple",
    "iterations": "45"
}

const UPDATED_BUCKET = {
    "id": "11111",
    "title": "Beans and Greens",
    "descrption": "Legume, leafy vegetable, fat, and flavoring"
}

let BUCKET_ID = {
    "id": "11111"
}
