import { MongoClient, ObjectId } from "mongodb";

let client;
let cachedDb;

async function getDb(env) {
  if (!client) {
    client = new MongoClient(env.MONGODB_URI);
    await client.connect();
    cachedDb = client.db(env.MONGODB_DB);
    console.log("Connected to MongoDB from Worker");
  }
  return cachedDb;
}

const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": origin || "*",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
});

function serializeMeal(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = env.CORS_ORIGIN || "*";

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    // Only handle /api/* routes
    if (!url.pathname.startsWith("/api/")) {
      return new Response("Not found", { status: 404 });
    }

    const db = await getDb(env);
    const mealsCollection = db.collection("meals");

    // ---------- GET /api/meals ----------
    if (url.pathname === "/api/meals" && request.method === "GET") {
      const docs = await mealsCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      const meals = docs.map(serializeMeal);

      return new Response(JSON.stringify(meals), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders(origin),
        },
      });
    }

    // ---------- POST /api/meals ----------
    if (url.pathname === "/api/meals" && request.method === "POST") {
      const body = await request.json();
      const now = new Date();

      const docToInsert = {
        title: body.title || "Untitled Meal",
        description: body.description || "",
        chef: body.chef || "Anonymous Chef",
        chefBio: body.chefBio || "",
        dorm: body.dorm || "",
        price: body.price ?? 0,
        servings: body.servings ?? 1,
        servingsLeft: body.servingsLeft ?? body.servings ?? 1,
        image: body.image || "",
        tags: Array.isArray(body.tags) ? body.tags : [],
        dishMatters: body.dishMatters || body.culturalNote || "",
        rating: body.rating ?? 5.0,
        orders: body.orders ?? 0,
        originKey: body.originKey || null,
        // only keep coords if originKey is set
        lat:
          body.originKey && typeof body.lat === "number"
            ? body.lat
            : null,
        lng:
          body.originKey && typeof body.lng === "number"
            ? body.lng
            : null,
        createdAt: now,
        updatedAt: now,
      };

      const result = await mealsCollection.insertOne(docToInsert);
      const inserted = await mealsCollection.findOne({
        _id: result.insertedId,
      });

      return new Response(JSON.stringify(serializeMeal(inserted)), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders(origin),
        },
      });
    }

    // ---------- PATCH /api/meals/:id/reserve ----------
    if (
      url.pathname.startsWith("/api/meals/") &&
      url.pathname.endsWith("/reserve") &&
      request.method === "PATCH"
    ) {
      const parts = url.pathname.split("/");
      // ["", "api", "meals", "<id>", "reserve"]
      const id = parts[3];

      let objectId;
      try {
        objectId = new ObjectId(id);
      } catch (e) {
        return new Response(
          JSON.stringify({ error: "Invalid meal id" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders(origin),
            },
          }
        );
      }

      const meal = await mealsCollection.findOne({ _id: objectId });
      if (!meal) {
        return new Response(
          JSON.stringify({ error: "Meal not found" }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders(origin),
            },
          }
        );
      }

      if (!meal.servingsLeft || meal.servingsLeft <= 0) {
        return new Response(
          JSON.stringify({ error: "Sold out" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders(origin),
            },
          }
        );
      }

      const updated = await mealsCollection.findOneAndUpdate(
        { _id: objectId },
        { $inc: { servingsLeft: -1 }, $set: { updatedAt: new Date() } },
        { returnDocument: "after" }
      );

      return new Response(
        JSON.stringify(serializeMeal(updated.value)),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders(origin),
          },
        }
      );
    }

    // Fallback
    return new Response("Not found", {
      status: 404,
      headers: corsHeaders(origin),
    });
  },
};
