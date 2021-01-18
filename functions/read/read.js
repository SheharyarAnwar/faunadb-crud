// import { APIGatewayEvent, Context } from "aws-lambda"

const faunadb = require("faunadb")
const q = faunadb.query
const handler = async (event, context) => {
  try {
    const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET })
    if (event.httpMethod !== "GET") {
      throw new Error("Invalid Request Method...")
    }
    const queryResults = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("contacts"))),
        q.Lambda(x => q.Get(x))
      )
    )
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Success`,
        results: queryResults.data,
      }),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
