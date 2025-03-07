import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb"; // ✅ Ensure correct import

export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("collegejunction"); // ✅ Use your actual database name
    const college = await db.collection("colleges").findOne({
      _id: new ObjectId(params.id),
    });

    if (!college) {
      return NextResponse.json({ error: "❌ College not found" }, { status: 404 });
    }

    console.log("Fetched College Data:", college); // ✅ Debugging fetched data

    return NextResponse.json(college);
  } catch (error) {
    console.error("Error fetching college:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
