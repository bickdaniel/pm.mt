const express = require('express');
const { chromium } = require('playwright');
const app = express();

app.get('/render', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing URL");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    const html = await page.content();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send("Failed to render: " + err.message);
  } finally {
    await browser.close();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server ready on port ${port}`));
