export function generateHTML(payload: {
  html: string;
  css: string;
  js: string;
}) {
  return `<html>
            <head>
                <style>${payload.css}</style>
                <script type="module">
                    ${payload.js}
                </script>
            </head>
            <body>
                ${payload.html}
            </body>
        </html`;
}
