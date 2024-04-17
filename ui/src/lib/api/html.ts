import { handleReturnFetch, getToken } from ".";

type MarkdownResponse =  {
    status: string;
    data: {
        title: string;
        content: string
    }
}

export async function fetchConvertHtmlToMarkdown(
    htmlText: string
): Promise<MarkdownResponse> {
  return handleReturnFetch(
    await fetch("/api/convert/html", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify({
        html_text: htmlText,
      }),
    })
  );
}
