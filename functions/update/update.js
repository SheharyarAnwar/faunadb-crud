// import { APIGatewayEvent, Context } from "aws-lambda"

const faunadb = require("faunadb")
const q = faunadb.query
const handler = async (event, context) => {
  try {
    const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET })
    if (event.httpMethod !== "PUT") {
      throw new Error("Invalid Request Method...")
    }
    const requestBody = JSON.parse(event.body)
    const queryResults = await client.query(
      q.Update(q.Ref(q.Collection("contacts"), requestBody.docId), {
        data: {
          phoneNumber: requestBody.phoneNumber,
          name: requestBody.name,
        },
      })
    )
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Contact created Successfully with id : ${queryResults.ref.id}`,
      }),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
