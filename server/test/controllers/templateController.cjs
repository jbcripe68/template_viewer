/* eslint-disable node/no-unpublished-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
/* eslint-disable global-require */
const { describe, before, after, it } = require("mocha");
const { expect } = require("chai");
const AppError = require("../../utils/appError.cjs");

let templateController; // later will be initialized for different tests
let currentNodeEnv;

// test class to test setting of res parameter in routing functions
class Results {
  constructor(jsonValidationFunction) {
    this.jsonValidationFunction = jsonValidationFunction;
    this.statusCode = -1;
  }

  // store statusCode for testing
  status(code) {
    this.statusCode = code;
    return this;
  }

  // call validation function with given data if present
  json(data) {
    this.jsonValidationFunction && this.jsonValidationFunction(data);
    return this;
  }
}

describe("templateController", () => {
  before(() => {
    currentNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "test";
    process.env.testData = "[1, 2, 3, 4, 5]";
    templateController = require("../../controllers/templateController.cjs");
  });

  after(() => {
    process.env.NODE_ENV = currentNodeEnv;
    process.env.testData = "";
  });

  describe("successful call to getTemplatePage", () => {
    it(
      "should set res parameter correctly if getTemplatePage " +
        "called where objsPerPage and page are valid query parameters",
      () => {
        const req = { query: { page: 0, objsPerPage: 2 } };
        function checkJSON(data) {
          expect(data).to.deep.equal({
            status: "success",
            results: 2,
            numTotalPages: 3,
            data: [1, 2],
          });
        }
        const res = new Results(checkJSON);
        const next = () => {
          throw new Error("next() should not be called");
        };
        res.status(200);
        templateController.getTemplatePage(req, res, next);
      }
    );

    it("check res parameter set with 1 element on second page", () => {
      // here with 5 elements and objectsPerPage=3 there should
      // be 2 elements on the second page
      const req = { query: { page: 1, objsPerPage: 3 } };
      function checkJSON(data) {
        expect(data).to.deep.equal({
          status: "success",
          results: 2,
          numTotalPages: 2,
          data: [4, 5],
        });
      }
      const res = new Results(checkJSON);
      const next = () => {
        throw new Error("next() should not be called");
      };
      res.status(200);
      templateController.getTemplatePage(req, res, next);
    });
  });

  describe("objsPerPage validation", () => {
    it(
      "should call given next() with an AppError if getTemplatePage " +
        "called where objsPerPage is not a query parameter",
      () => {
        const req = { query: { page: 0 } };
        const res = {};
        const next = (err) => {
          expect(err).to.be.an.instanceof(AppError);
          expect(err.statusCode).to.equal(400);
          expect(err.message).to.equal(
            "Query parameter 'objsPerPage' is missing or invalid"
          );
        };
        templateController.getTemplatePage(req, res, next);
      }
    );

    it(
      "should call given next() with an AppError if getTemplatePage " +
        "called where objsPerPage is not an integer",
      () => {
        const req = { query: { objsPerPage: "", page: 0 } };
        const res = {};
        const next = (err) => {
          expect(err).to.be.an.instanceof(AppError);
          expect(err.statusCode).to.equal(400);
          expect(err.message).to.equal(
            "Query parameter 'objsPerPage' is missing or invalid"
          );
        };
        templateController.getTemplatePage(req, res, next);

        const req2 = { query: { objsPerPage: "a", page: 0 } };
        templateController.getTemplatePage(req2, res, next);

        const req3 = { query: { objsPerPage: -1, page: 0 } };
        templateController.getTemplatePage(req3, res, next);
      }
    );
  });

  describe("page validation", () => {
    it(
      "should set res parameter correctly if getTemplatePage " +
        "called where objsPerPage and page are valid query parameters",
      () => {
        const req = { query: { objsPerPage: 2 } };
        function checkJSON(data) {
          expect(data).to.deep.equal({
            status: "success",
            results: 2,
            numTotalPages: 3,
            data: [1, 2],
          });
        }
        const res = new Results(checkJSON);
        const next = () => {
          throw new Error("next() should not be called");
        };
        templateController.getTemplatePage(req, res, next);

        const req2 = { query: { objsPerPage: 2, page: "" } };
        templateController.getTemplatePage(req2, res, next);
      }
    );

    it(
      "should call given next() with an AppError if getTemplatePage " +
        "called where page is not an integer",
      () => {
        const req = { query: { objsPerPage: 2, page: "z" } };
        const res = {};
        const next = (err) => {
          expect(err).to.be.an.instanceof(AppError);
          expect(err.statusCode).to.equal(400);
          expect(err.message).to.equal("Query parameter 'page' is invalid");
        };
        templateController.getTemplatePage(req, res, next);

        const req2 = { query: { objsPerPage: 2, page: -1 } };
        templateController.getTemplatePage(req2, res, next);
      }
    );

    it(
      "should call given next() with an AppError if getTemplatePage " +
        "called where page >= to number of pages as it is 0-based",
      () => {
        const req = { query: { objsPerPage: 2, page: 3 } };
        const res = {};
        const next = (err) => {
          expect(err).to.be.an.instanceof(AppError);
          expect(err.statusCode).to.equal(400);
          expect(err.message).to.equal(
            "Query parameter 'page' is out of range. Valid range is from 0 - 2"
          );
        };
        templateController.getTemplatePage(req, res, next);

        const req2 = { query: { objsPerPage: 2, page: 5 } };
        templateController.getTemplatePage(req2, res, next);
      }
    );
  });
});
