export async function handleRequest(request: Request): Promise<Response> {
  const { method, headers, url } = request;
  const urlObj = new URL(url);
  urlObj.hostname = 'spaces.technik.fhnw.ch'

  const response = await fetch(urlObj.href);

  const contentType = response.headers.get('content-type');

  if (contentType !== 'application/javascript') {
    return new Response(`File type ${contentType} not allowed.`, {
      status: 400
    })
  }

  if (response.body) {
    let script = await response.text();

    switch (urlObj.pathname) {
      case '/js/app.js':
        script = script.replace([
          'function blurFixedJumbotron(scrollPos) {',
          '  if (fixedJumbotron != null) {',
          `    fixedJumbotron.style.filter = 'blur(' + Math.min(scrollPos / 2.5, 40) + 'px)';`,
          `    fixedJumbotron.style.opacity = Math.max(1 - scrollPos / 150, 0.333); //jumbotron.style.transform = 'scale(' + (1 - (scrollPos / 1000)) + ')';`,
          '  }',
          '}'
        ].join('\n'), 'function blurFixedJumbotron(scrollPos) { console.log(scrollPos); }');
    }

    return new Response(script, response)
  }

  return response
}
