const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe("/", function() {

    before(function(){
        return runServer()
    })

    after(function() {
        return closeServer()
    })

    it('should return 200 when called', function() {
        return chai
            .request(app)
            .get("/")
            .then(function(res){
                expect(res).to.have.status(200);
            })
    })
})