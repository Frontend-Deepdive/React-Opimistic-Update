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
  likes: number | null;
}

export const fetchNotionData = async (): Promise<RefinedNotionData[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/notion`
  );
  const results: NotionPage[] = response.data.query.results;

  return results.map((page) => {
    const properties = page.properties;
    return {
      id: page.id, //uuid
      text: properties["text"]?.rich_text?.[0]?.plain_text || "",
      likes: properties["likes"]?.number ?? null,
    };
  });
};

export const increaseLike = async (pageId: string): Promise<void> => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_API_BASE_URL}/notion/like/${pageId}`
    );
  } catch (error) {
    console.error("Failed to increase like:", error);
    throw error;
  }
};
