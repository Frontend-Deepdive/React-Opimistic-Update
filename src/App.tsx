import "./App.css";
import { Client } from "@notionhq/client";

function App() {
  const notionToken = process.env.REACT_APP_NOTION_TOKEN;
  const notion = new Client({
    auth: notionToken,
  });
  const databaseId = process.env.REACT_APP_NOTION_DATABASE_ID;

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
