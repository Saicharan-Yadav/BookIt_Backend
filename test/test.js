let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");

chai.should();
chai.use(chaiHttp);

describe("Admin Api's", () => {
  describe("GET /admin/fetch_busses", () => {
    it("it should get all the tasks", async () => {
      const response = await chai.request(server).get("/admin/fetch_busses");
      response.should.have.status(200);
      response.body.should.be.a("array");
    });
  }).timeout(5000);

  describe("GET /admin/fetch_users_count", () => {
    it("it should get all the tasks", async () => {
      const response = await chai
        .request(server)
        .get("/admin/fetch_users_count");

      response.should.have.status(200);
      response.body.should.be.a("object");
    });
  }).timeout(5000);

  describe("POST /admin/delete_user", () => {
    it("should Delete User", async () => {
      const user = {
        email: "ashrith.k20@iiits.in",
        msg: "User deleted successfully",
      };
      const res = await chai
        .request(server)
        .post(`/admin/delete_user`)
        .field("email", user.email);

      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.should.have.property("msg");
    });
  }).timeout(5000);

  //
});

// describe("Login/Signup Api's", () => {
//   describe("POST /user/login", () => {
//     it("it should validate login", (done) => {
//       const obj = {
//         email: "ashrith.k20@iiits.in",
//         password: "test1234",
//       };
//       chai
//         .request(server)
//         .post("/user/login")
//         .send(obj)
//         .end((err, response) => {
//           response.should.have.status(200);
//           response.body.should.be.a("object");
//           response.body.should.have.property("msg");
//           response.body.should.have.property("token");
//           done();
//         });
//     });
//   });
// });
