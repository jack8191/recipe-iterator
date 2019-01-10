const chai = require("chai");
const chaiHttp = require("chai-http");
//const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const { app, runServer, closeServer } = require("../server");
const { Bucket, Iteration } = require('../models')
const {JWT_SECRET} = require('../config');


const expect = chai.expect;

chai.use(chaiHttp);

function tearDownDb() {
    return new Promise((resolve, reject) => {
      console.warn('Deleting database')
      mongoose.connection.dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

function seedBucketData() {
    console.info('seeding bucket data')
    const seedData = {_id: "5c2ed0479814ac43a5f26f62", title: "krangus", description: "wingus"}
    return Bucket.create(seedData)
}

function seedIterationData() {
    console.info('seeding iteration data')
    const seedData = [{iteraionOf: "5c2ed0479814ac43a5f26f62", ingredients: "Mumbus, bumbus", procedure: "slumbo, bumbo", notes: "not so good"}, {iteraionOf: "1111", ingredients: "Mumbus", procedure: "slumbo", notes: "better with less stuff"}]
    return Iteration.insertMany(seedData)
}

const token = jwt.sign(
    {
      user: {
        username: 'blumpo'
      }
    },
    JWT_SECRET,
    {
      algorithm: 'HS256',
      subject: 'blumpo',
      expiresIn: '7d'
    }
)

describe("/", function() {

    before(function(){
        return runServer()
    })

    after(function() {
        return closeServer()
    })

    it('should return 404 when called', function() {
        return chai
            .request(app)
            .get("/")
            .then(function(res){
                expect(res).to.have.status(404);
            })
    })
})

describe("/bucket", function() {
    before(function() {
        return runServer()
    })
    beforeEach(function() {
        return seedBucketData() 
    })
    beforeEach(function() {
        return seedIterationData()
    })
    afterEach(function() {
        return tearDownDb()
    })
    after(function() {
        return closeServer()
    })

    describe('GET all buckets', function() {
        it('should return all buckets', function() {
        return chai.request(app)
            .get('/bucket')
            .set('authorization', `Bearer ${token}`)
            .then(res => {
                expect(res).to.have.status(200)
                expect(res.body).to.have.lengthOf.at.least(1)
                //return Bucket.count()
            })
        })
        it('should return correct fields', function() {
            return chai.request(app)
                .get('/bucket')
                .set('authorization', `Bearer ${token}`)
                .then(res => {
                    expect(res.body[0]).to.contain.all.keys(['id', 'title', 'description'])
                })
        })
    })

    describe('GET bucket by id', function() {
        it('should return a single correct bucket', function() {
            return chai.request(app)
                .get('/bucket/5c2ed0479814ac43a5f26f62')
                .set('authorization', `Bearer ${token}`)
                .then(res => {
                    //  console.log(bucket)
                    expect(res.body.title).to.equal('krangus')
                    expect(res.body.description).to.equal('wingus')
                })
        })
    })

    describe('bucket POST', function() {
        it('should create a new bucket based on the response body', function() {
            let newBucket = {"title": "oingo", "description": "boingo"}
            return chai.request(app)
                .post('/bucket')
                .set('authorization', `Bearer ${token}`)
                //.set('content-type', 'application/json')
                .send(newBucket)
                .then(res => {
                    expect(res.body).to.include(newBucket)
                })
        })
    })

    describe('bucket PATCH', function() {
        it('should update a bucket based on an id and the response body', function() {
            let updatedBucket = {"title": "oingo", "description": "boingo"}
            return chai.request(app)
            .patch('/bucket/5c2ed0479814ac43a5f26f62')
            .set('authorization', `Bearer ${token}`)
            .send(updatedBucket)
            .then(res => {
                //console.log(res.body)
                expect(res.body.title).to.equal('oingo')
                expect(res.body.description).to.equal('boingo')

            })
        })
    })

    describe('bucket DELETE', function() {
        it('should delete a bucket selected with an id as well as all contained iterations', function() {
            return chai.request(app)
            .delete('/bucket/5c2ed0479814ac43a5f26f62')
            .set('authorization', `Bearer ${token}`)
            .then(res => {
                expect(res).to.have.status(204)
            })
        })
    })
})