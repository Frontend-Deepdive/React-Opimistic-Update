import "./App.css";
import { Client } from "@notionhq/client";

function App() {
  const notionToken = "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";
  const notion = new Client({
    auth: notionToken,
  });
  const databaseId = "1ce888e3b219805db30bda19ad72e632";

  const fetchData = async () => {
    const dbObjects = await notion.databases.retrieve({
      database_id: databaseId,
    });
    const dbQueryData = await notion.databases.query({
      database_id: databaseId,
    });

    console.log(dbObjects);
    console.log(dbQueryData);
  };

  fetchData();
  return <div>this is me</div>;
}

export default App;
