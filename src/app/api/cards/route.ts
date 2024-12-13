// app/api/cards/route.ts
import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);
const database = client.db("pokemon-tcg");

async function getSets() {
  let sets = await database
    .collection("cards")
    .aggregate([
      { $match: { release_date: { $ne: null } } },
      {
        $addFields: {
          extractedId: { $arrayElemAt: [{ $split: ["$id", "-"] }, 0] },
        },
      },
      {
        $group: {
          _id: "$extractedId",
          set: { $first: "$set" },
          date: { $max: "$release_date" },
        },
      },
      { $sort: { date: -1, set: 1 } },
      {
        $project: {
          _id: 0,
          id: "$_id",
          set: 1,
        },
      },
    ])
    .toArray();
  return sets;
}

async function getSetIdFromCard(cardId: string) {
  let setId = cardId.split("-")[0];
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
    ])
    .toArray();
  return cards;
}

async function getCardDetails(idCard: string) {
  let details = await database.collection("cards").findOne({ id: idCard });
  return details;
}

async function getCardsWithName(name: string) {
  let cards = await database.collection("cards").find({ name }).toArray();
  return cards;
}

async function getCardsWithFilter(filter: object) {
  if (typeof filter !== 'object' || filter === null) {
    throw new Error("Invalid filter: filter must be a non-null object");
  }

  // Pass the filter object directly to the query
  let cards = await database.collection("cards").find(filter).toArray();
  console.log(cards);
  return cards;
}


async function getCardImage(idCard: string, cardSetNum: string, large: boolean) {
  let setId = await getSetIdFromCard(idCard);
  let url = `https://images.pokemontcg.io/${setId}/${cardSetNum}${large ? "_hires" : ""}.png`;
  return url;
}

async function addCard(card: any) {
  card.release_date = new Date(card.release_date);
  let result = await database.collection("cards").insertOne(card);
  return result;
}

async function deleteCard(id: string) {
  let result = await database.collection("cards").deleteOne({ id });
  return result;
}

export async function POST(request: Request) {
  const body = await request.json();
  await client.connect();

  try {
    switch (body.action) {
      case "addCard":
        return new Response(JSON.stringify(await addCard(body.card)), {
          status: 200,
        });
      default:
        return new Response("Invalid action", { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return new Response("Error handling POST request", { status: 500 });
  } finally {
    await client.close();
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const setName = searchParams.get("setName");
  const idCard = searchParams.get("idCard");
  const setId = searchParams.get("setId");
  const cardSetNum = searchParams.get("cardSetNum");
  const large = searchParams.get("large") === "true";
  const name = searchParams.get("name");

  try {
    switch (action) {
      case "getSets":
        return new Response(JSON.stringify(await getSets()), { status: 200 });
      case "getCardsInSet":
        if (!setName) return new Response("Missing setName", { status: 400 });
        return new Response(JSON.stringify(await getCardsInSet(setName)), {
          status: 200,
        });
      case "getCardDetails":
        if (!idCard) return new Response("Missing idCard", { status: 400 });
        return new Response(JSON.stringify(await getCardDetails(idCard)), {
          status: 200,
        });
      case "getCardsWithName":
        if (!name) return new Response("Missing name", { status: 400 });
        return new Response(JSON.stringify(await getCardsWithName(name)), {
          status: 200,}
        );
      case "getCardsWithFilter":
        return new Response(
          JSON.stringify(await getCardsWithFilter(searchParams)),
          { status: 200 }
        );
      case "getCardImage":
        if (!idCard || !cardSetNum)
          return new Response("Missing idCard or cardSetNum", { status: 400 });
        return new Response(
          JSON.stringify(await getCardImage(idCard, cardSetNum, large)),
          { status: 200 }
        );
      case "getSetImage":
        if (!setId) return new Response("Missing setId", { status: 400 });
        return new Response(JSON.stringify(await getSetImage(setId)), {
          status: 200 });
      default:
        return new Response("Invalid action", { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return new Response("Error handling GET request", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  try {
    const result = await deleteCard(id);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error handling DELETE request", { status: 500 });
  }
}