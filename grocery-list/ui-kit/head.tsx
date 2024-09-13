interface Props {}
export function Head(props: Props) {
  return (
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Grocery List</title>
      <link rel="stylesheet" href="/static/css/global.css" />
      <script type="module" src="/static/single-page-appify.js" defer async />
    </head>
  )
}
