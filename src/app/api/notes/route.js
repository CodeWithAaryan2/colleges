export const dynamic = "force-dynamic"; // Ensure API runs dynamically

import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const publicPath = path.join(process.cwd(), "public");
    let years = new Set();
    let branches = new Set();
    let semesters = new Set();
    let notesList = [];

    function scanNotes(directory, relativePath = "") {
      if (!fs.existsSync(directory)) return;

      const items = fs.readdirSync(directory);

      items.forEach((item) => {
        const itemPath = path.join(directory, item);
        const itemRelativePath = path.join(relativePath, item);

        if (fs.statSync(itemPath).isDirectory()) {
          scanNotes(itemPath, itemRelativePath);
        } else if (item.endsWith(".pdf")) {
          const pathParts = itemRelativePath.split(path.sep);
          if (pathParts.length >= 3) {
            const [year, branch, semester] = pathParts;
            years.add(year);
            branches.add(branch);
            semesters.add(semester);

            notesList.push({
              name: item,
              path: `/${itemRelativePath.replace(/\\/g, "/")}`,
              year,
              branch,
              semester,
            });
          }
        }
      });
    }

    scanNotes(publicPath);

    return NextResponse.json({
      years: [...years],
      branches: [...branches],
      semesters: [...semesters],
      notes: notesList,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}
