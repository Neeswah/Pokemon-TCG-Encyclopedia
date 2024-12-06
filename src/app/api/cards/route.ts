// app/api/cards/route.ts (or pages/api/cards.js for the pages directory)
import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);
const database = client.db("pokemon-tcg");
const https = require("https");

async function getSets() {
  let sets = await database.collection("cards")
  .aggregate([
    { $match: { release_date: { $ne: null } } },
    { 
      $addFields: { 
        extractedId: { $arrayElemAt: [{$split: ["$id", "-"]}, 0] }
      }
    },
    { 
      $group: { 
        _id: "$extractedId", 
        set: { $first: "$set" },
        date: { $max: "$release_date" },
      }
    },
    { $sort: { date: -1, set: 1 } },
    { 
      $project: { 
        _id: 0, 
        id: "$_id", 
        set: 1
      }
    }
  ])
  .toArray();  
  return sets;
}

async function getSetIdFromCard(cardId: string) {
  let setId = cardId.split('-')[0];
  return setId;
}

async function getSetImage(setId: string) {
  let url = `https://images.pokemontcg.io/${setId}/logo.png`;
  return url;
}

async function getCardsInSet(setName: string) {
  let cards = await database
    .collection("cards")
    .aggregate([
      { $match: { set: setName } },
      { $project: { _id: 0, id: 1, name: 1, set_num: 1 } },
      { $sort: { _set_num : 1 } },
    ])
    .toArray();
  return cards;
}

async function getCardDetails(idCard: string) {
  let details = await database.collection("cards").findOne({ id: idCard });
  return details;
}

async function getCardImage(idCard: string, cardSetNum: string, large: boolean) {
  let setId = await getSetIdFromCard(idCard);
  let url = `https://images.pokemontcg.io/${setId}/${cardSetNum}${large ? "_hires" : ""}.png`;
  return url;
}

async function addCard(card: any) {
  let result = await database.collection("cards").insertOne(card);
  return result;
}

async function deleteCard(id: string) {
  let result = await database.collection("cards").deleteOne({ id });
  return result;
}

// This function handles API requests
export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams } = url;
  let setName = searchParams.get("set");
  let card = searchParams.get("card");

  try {
    if (card) {
      const details = await getCardDetails(card);
      return new Response(JSON.stringify(details), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (setName) {
      const cards = await getCardsInSet(setName);
      return new Response(JSON.stringify(cards), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      const sets = await getSets();
      return new Response(JSON.stringify(sets), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error(error);
    return new Response("Error fetching data", { status: 500 });
  } finally {
    await client.close();
  }
}

export { getSets, getCardsInSet, getCardDetails, getCardImage, getSetImage, addCard, deleteCard };