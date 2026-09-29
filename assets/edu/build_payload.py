import json

urls = [
 "https://d2ol7oe51mr4n9.cloudfront.net/user_3JW4QM1psD0GWVYNvh2oNpKZfBG/769bc988-5b4a-400f-8df8-e54c58956aa6.png",
 "https://d2ol7oe51mr4n9.cloudfront.net/user_3JW4QM1psD0GWVYNvh2oNpKZfBG/0f318d77-95ba-442f-b0f8-36c04bbe133b.png",
 "https://d2ol7oe51mr4n9.cloudfront.net/user_3JW4QM1psD0GWVYNvh2oNpKZfBG/803507c8-78c1-4870-b157-bd8b91f61643.png",
 "https://d2ol7oe51mr4n9.cloudfront.net/user_3JW4QM1psD0GWVYNvh2oNpKZfBG/788a9e0b-217b-4011-b1da-e2bf391fd734.png",
 "https://d2ol7oe51mr4n9.cloudfront.net/user_3JW4QM1psD0GWVYNvh2oNpKZfBG/02121313-eaf1-49ad-aaa4-e25a2a43f494.png",
 "https://d2ol7oe51mr4n9.cloudfront.net/user_3JW4QM1psD0GWVYNvh2oNpKZfBG/2c7ae3c1-ff88-459f-8825-1343b48ab652.png",
 "https://d2ol7oe51mr4n9.cloudfront.net/user_3JW4QM1psD0GWVYNvh2oNpKZfBG/c85f6e85-e064-40b1-be57-7e6a7c73f2c7.png",
 "https://d2ol7oe51mr4n9.cloudfront.net/user_3JW4QM1psD0GWVYNvh2oNpKZfBG/56b1fc47-d48b-4966-a097-3cc45afbd861.png",
]

caption = ("if you're running brand deals out of a spreadsheet this is your sign. "
           "one record per deal. three numbers for money: booked, paid, outstanding. "
           "check them once a week. that is the whole system. "
           "talby does it in one screen, free to start. www.talby.io")

mutation = """
mutation {
  createPost(input: {
    channelId: "6aac26deea19ca0bde6bacbc"
    text: %s
    schedulingType: automatic
    mode: addToQueue
    saveToDraft: true
    needsApproval: false
    assets: [
      {image:{url:"URL0"}},
      {image:{url:"URL1"}},
      {image:{url:"URL2"}},
      {image:{url:"URL3"}},
      {image:{url:"URL4"}},
      {image:{url:"URL5"}},
      {image:{url:"URL6"}},
      {image:{url:"URL7"}}
    ]
    metadata: { instagram: { type: carousel, shouldShareToFeed: true } }
  }) {
    __typename
    ... on PostActionSuccess { post { id status } }
    ... on InvalidInputError { message }
  }
}
"""

for i, u in enumerate(urls):
    mutation = mutation.replace(f"URL{i}", u)
mutation = mutation.replace("%s", json.dumps(caption))

query = json.dumps({"query": mutation})
out = {"caption": caption, "n_assets": len(urls), "graphql": query}
with open("/tmp/buf_payload.json", "w") as f:
    json.dump(out, f, indent=2)
print("payload bytes:", len(query))
print("assets:", len(urls))
print("caption:", caption)