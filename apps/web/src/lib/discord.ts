"use server";

async function alertDiscord(hooksURL: string, message: string): Promise<void> {
  await fetch(hooksURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: message }),
  });
}

export { alertDiscord };
