import { use, expect } from "chai";
import chaiHttp from "chai-http";
import app from "../src/app.js";

// Mocha is the test runner. It discovers test files, groups them with describe(),
// and executes each test case with it().
// Chai provides readable assertions such as expect(...).to.have.status(200).
// chai-http extends Chai so we can send HTTP requests to the Express app.
const chai = use(chaiHttp); // chai-http is a plugin for chai, we are configuring it here so that chai can use its own plugin ;

/* describe('statement that describes the test suite', (cb) = {
    it('statement for individual test' , (cb) => {
      // body of the test 
      });
     it('statement of 2nd test', (cb) => {
      }); 
      it('statement of 3nd test', (cb) => {
      }); 
});

*/

describe("Express App Tests", () => {
  // A mock object is a dependency for real data during testing.
  // It allows us to simulate authentication without depending on a real token service.
  const mockAuth = {
    type: "Bearer",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJyb2xlIjoiYWRtaW4ifQ.signature",
  };

  const authHeader = `${mockAuth.type} ${mockAuth.token}`;

  // describe() groups related tests together so the suite stays organized.
  describe("GET /users", () => {
    // it() defines one individual test case with a clear expected behavior.
    it("should return a list of users", (done) => {
      chai.request
        .execute(app)
        .get("/users")
        .end((err, res) => {
          // assertions
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.greaterThan(0);
          done();
        });
    });
  });

  // Best practice: test both success and failure cases for the same endpoint.
  describe("POST /users", () => {
    it("should return 401 if no auth token is provided", (done) => {
      chai.request
        .execute(app)
        .post("/users")
        .send({ name: "Alice", email: "alice@example.com" })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property("error", "Unauthorized");
          done();
        });
    });

    it("should create a user if authorized", (done) => {
      chai.request
        .execute(app)
        .post("/users")
        .set("Authorization", authHeader)
        .send({ name: "Alice", email: "alice@example.com" })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("id");
          expect(res.body.name).to.equal("Alice");
          done();
        });
    });

    it("should return 400 if missing name or email", (done) => {
      chai.request
        .execute(app)
        .post("/users")
        .set("Authorization", authHeader)
        .send({ name: "" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property(
            "error",
            "Name and email are required",
          );
          done();
        });
    });
  });

  describe("PUT /users/:id", () => {
    // Best practice: keep each test focused on one behavior and one outcome.
    it("should return 401 if unauthorized", (done) => {
      chai.request
        .execute(app)
        .put("/users/1")
        .send({ name: "Updated Name" })
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it("should update a user if authorized", (done) => {
      chai.request
        .execute(app)
        .put("/users/1")
        .set("Authorization", authHeader)
        .send({ name: "Updated Name" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.name).to.equal("Updated Name");
          done();
        });
    });

    it("should return 404 if user not found", (done) => {
      chai.request
        .execute(app)
        .put("/users/999")
        .set("Authorization", authHeader)
        .send({ name: "Non-existent" })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  describe("DELETE /users/:id", () => {
    it("should return 401 if unauthorized", (done) => {
      chai.request
        .execute(app)
        .delete("/users/1")
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it("should delete a user if authorized", (done) => {
      chai.request
        .execute(app)
        .delete("/users/1")
        .set("Authorization", authHeader)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message", "User deleted");
          done();
        });
    });

    it("should return 404 if user not found", (done) => {
      chai.request
        .execute(app)
        .delete("/users/999")
        .set("Authorization", authHeader)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  // Error handling is an important part of API testing because it verifies that the app
  // responds correctly when something goes wrong.
  describe("Error Handling", () => {
    it("should return 500 for internal errors", (done) => {
      chai.request
        .execute(app)
        .get("/cause-error")
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property("error", "Server Errors"); 
          done();
        });
    });
  });
});
