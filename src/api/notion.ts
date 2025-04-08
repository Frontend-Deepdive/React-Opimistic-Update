import axios from "axios";

interface NotionProperty {
  title?: { plain_text: string }[];
  rich_text?: { plain_text: string }[];
  number?: number;
}

interface NotionPage {
  id: string;
  properties: {
    [key: string]: NotionProperty;
  };
}

interface RefinedNotionData {
  id: string;
  text: string;
  Number: number | null;
}

export const fetchNotionData = async (): Promise<RefinedNotionData[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/notion`
  );
  const results: NotionPage[] = response.data.query.results;

  return results.map((page) => {
    const properties = page.properties;
    return {
      id: properties["글id"]?.title?.[0]?.plain_text || "",
      text: properties["텍스트"]?.rich_text?.[0]?.plain_text || "",
      Number: properties["Number"]?.number ?? null,
    };
  });
};
