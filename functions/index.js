const VALID_IMAGES = {
  'x1abc': { filename: 'bmw.jpg', description: 'Can you avoid all the BMWs in the Loud Bicycle game?', width: 500, height: 339 },
  'y2def': { filename: 'suv.jpg', description: 'Can you stay safe with all the SUVs in the Loud Bicycle game?', width: 500, height: 339 },
  'z3ghi': { filename: 'taxi.jpg', description: 'Can you avoid getting run over by a taxi in the Loud Bicycle game?', width: 500, height: 339 },
  'a4jkl': { filename: 'truck.jpg', description: 'Can you stay safe with all the trucks in the Loud Bicycle game?', width: 500, height: 339 },
  'b5mno': { filename: 'unknown.jpg', description: 'Can you get home safely in the Loud Bicycle game?', width: 500, height: 339 },
  '91sna': { filename: 'raygun.jpg', description: 'How many cars can you turn into bicycles in the Loud Bicycle game?', width: 500, height: 339 },
  'f2s6s': { filename: 'loudmini.jpg', description: 'How powerful is Loud Mini in the Loud Bicycle game?', width: 500, height: 339 },
};

const DEFAULT_IMAGE = { filename: 'bicycle-collision-with-truck.jpg', description: 'Can you get the kids to school safely? Try the Loud Bicycle game!', width: 1306, height: 1023 };

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const v = url.searchParams.get('v');

  const res = await context.next();
  let html = await res.text();

  if (!html) {
    return res;
  }

  const img = (v && VALID_IMAGES[v]) || DEFAULT_IMAGE;
  const imageUrl = `${url.origin}/screenshots/${img.filename}`;

  const ogTags = `<meta property="og:title" content="LOUD BICYCLE | THE GAME">` +
    `<meta property="og:description" content="${img.description}">` +
    `<meta name="image" property="og:image" content="${imageUrl}">` +
    `<meta property="og:image:width" content="${img.width}">` +
    `<meta property="og:image:height" content="${img.height}">` +
    `<meta property="og:type" content="website">` +
    `<meta property="og:url" content="${url.origin}">` +
    `<meta name="twitter:card" content="summary_large_image">` +
    `<meta name="twitter:title" content="LOUD BICYCLE | THE GAME">` +
    `<meta name="twitter:description" content="${img.description}">` +
    `<meta name="twitter:image" content="${imageUrl}">`;

  html = html.replace('<!-- OG_TAGS -->', ogTags);

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
