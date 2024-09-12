interface Props {
  scripts?: string[]
}
export function Head(props: Props) {
  return (
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Grocery List</title>
      <link rel="stylesheet" href="/static/css/global.css" />
    </head>
  )
}
