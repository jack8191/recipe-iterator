const chai = require("chai");
const chaiHttp = require("chai-http");
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
    const seedData = [{_id: "5c2bbef4fc8c0a27a0a20a91", iteraionOf: "5c2ed0479814ac43a5f26f62", ingredients: "Mumbus, bumbus", procedure: "slumbo, bumbo", notes: "not so good"}, {iteraionOf: "5c2ed0479814ac43a5f26f62", ingredients: "Mumbus", procedure: "slumbo", notes: "better with less stuff"}]
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

describe("/iteration", function() {
    before(function() {
        return runServer()
    })
    beforeEach(function() {
        return seedIterationData()
    })
    beforeEach(function() {
        return seedBucketData()
    })
    afterEach(function() {
        return tearDownDb()
    })
    after(function() {
        return closeServer()
    })



    describe('GET iteration by iterationOf', function() {
        it('should return all iterations sharing the same iterationOf', function() {
            return chai.request(app)
                .get('/iteration/5c2ed0479814ac43a5f26f62')
                .set('authorization', `Bearer ${token}`)
                .then(res => {
                    console.log(res.body)
                    expect(res.body[0].ingredients).to.equal("Mumbus, bumbus")
                    expect(res.body[0].procedure).to.equal("slumbo, bumbo")
                    expect(res.body[0].notes).to.equal("not so good")
                    // expect(res.body[1].ingredients).to.equal("Mumbus")
                    // expect(res.body[1].procedure).to.equal("slumbo")
                    // expect(res.body[1].notes).to.equal("better with less stuff")
                })
        })
    })

    describe('iteration POST', function() {
        it('should create a new iteration based on the response body', function() {
            let newIteration = {"iterationOf": "5c2ed0479814ac43a5f26f62", "date": "2016-05-07T07:00:00.000Z", "ingredients": "oingo", "procedure": "boingo", "notes": "lumbo"}
            return chai.request(app)
                .post('/iteration')
                .set('authorization', `Bearer ${token}`)
                //.set('content-type', 'application/json')
                .send(newIteration)
                .then(res => {
                    expect(res.body).to.include(newIteration)
                })
        })
    })

    describe('iteration PATCH', function() {
        it('should update an based on an id and the response body', function() {
            let updatedIteration = {"ingredients": "Mumbus, lumbo", "procedure": "slumbo, hoombus", notes: "not as good"}
            return chai.request(app)
            .patch('/iteration/5c2bbef4fc8c0a27a0a20a91')
            .set('authorization', `Bearer ${token}`)
            .send(updatedIteration)
            .then(res => {
                //console.log(res.body)
                expect(res.body.ingredients).to.equal('Mumbus, lumbo')
                expect(res.body.procedure).to.equal('slumbo, hoombus')
                expect(res.body.notes).to.equal('not as good')

            })
        })
    })

    

    describe('iteration DELETE', function() {
        it('should delete an iteration selected with an id', function() {
            return chai.request(app)
            .delete('/iteration/5c2bbef4fc8c0a27a0a20a91')
            .set('authorization', `Bearer ${token}`)
            .then(res => {
                expect(res).to.have.status(204)
            })
        })
    })
})