export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Food Safe Bot is running");
  }

  const token = process.env.BOT_TOKEN;

  if (!token) {
    return res.status(500).send("Bot token is not configured");
  }

  try {
    const update = req.body;
    const message = update?.message;

    if (!message?.chat?.id) {
      return res.status(200).send("OK");
    }

    const chatId = message.chat.id;
    const document = message.document;

    let reply;

    if (
      document &&
      document.file_name?.toLowerCase().endsWith(".apk")
    ) {
      reply =
        "APK received successfully!\n\n" +
        "File: " + document.file_name + "\n" +
        "Size: " + document.file_size + " bytes\n\n" +
        "The APK has not been modified or repaired. " +
        "A proper security scan is required.";
    } else {
      reply = "Welcome to Food Safe Bot! Please upload an APK file.";
    }

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply
      })
    });

    return res.status(200).send("OK");
  } catch (error) {
    return res.status(500).send("Bot error");
  }
}
