# Hello!

### To test:
1. git clone into a directory
2. copy the .exmaple.env file to .env
3. fill out the .env file with your own values
4. run node command `node --env-file=.env app.js --name {name to search for}`

### Example:
```bash
node --env-file=.env app.js --name product
```

There are a couple of things I want to note about how I did this:

1. I used .env file to store my environment variables instead of hard coding, this is why you need to specify the .env file in the command.
2. I wanted to make it as native as possible and not use any external libraries / build systems. I can always rework this with easier tools
3. I am not handling pagination via edges on the graphql request. This was just a timing thing and I wanted to get this working and back ASAP as a proof of concept
