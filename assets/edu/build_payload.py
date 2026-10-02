import json

urls = [
 "https://d2ol7oe51mr4n9.cloudfront.net/user_3JW4QM1psD0GWVYNvh2oNpKZfBG/496b90c1-28c9-43aa-a540-b9c77e5ccd12.png",
 "https://d2ol7oe51mr4n9.cloudfront.net/user_3JW4QM1psD0GWVYNvh2oNpKZfBG/dfe0e341-61d1-4f1c-b56f-cd3233dc4da8.png",
 "https://d2ol7oe51mr4n9.cloudfront.net/user_3JW4QM1psD0GWVYNvh2oNpKZfBG/1cde57dd-aca2-4cec-8542-908c99ce9bde.png",
 "https://d2ol7oe51mr4n9.cloudfront.net/user_3JW4QM1psD0GWVYNvh2oNpKZfBG/eadbd2e5-28de-4783-999d-233e574aeca8.png",
 "https://d2ol7oe51mr4n9.cloudfront.net/user_3JW4QM1psD0GWVYNvh2oNpKZfBG/30f2ef39-749c-4ae5-88f6-a3cd85716377.png",
 "https://d2ol7oe51mr4n9.cloudfront.net/user_3JW4QM1psD0GWVYNvh2oNpKZfBG/c15085ce-162e-4f0a-a510-cd1804ad7bd3.png",
 "https://d2ol7oe51mr4n9.cloudfront.net/user_3JW4QM1psD0GWVYNvh2oNpKZfBG/355938da-4a09-48f3-8f86-13fbd2798651.png",
 "https://d2ol7oe51mr4n9.cloudfront.net/user_3JW4QM1psD0GWVYNvh2oNpKZfBG/d699ae56-473f-46b1-b3ac-1ffd58165762.png",
]

caption = ("a brand offered you $200 for a post. is that even a good deal? "
           "count your time, count your real reach, add what they get to use, "
           "and the one-line math answers it. no more pricing by gut. "
           "talby keeps the deal and the money in one place, free to start. www.talby.io")

assets = "".join([f'{{image:{{url:"{u}"}}}}, ' for u in urls]).rstrip(", ")
mutation = f"""mutation {{
  createPost(input: {{
    channelId: "6aac26deea19ca0bde6bacbc"
    text: {json.dumps(caption)}
    schedulingType: automatic
    mode: addToQueue
    saveToDraft: true
    needsApproval: false
    assets: [{assets}]
    metadata: {{ instagram: {{ type: post, shouldShareToFeed: true }} }}
  }}) {{
    __typename
    ... on PostActionSuccess {{ post {{ id status }} }}
    ... on InvalidInputError {{ message }}
  }}
}}"""
query = json.dumps({"query": mutation})
out = {"caption": caption, "n_assets": len(urls), "graphql": query}
with open("/tmp/buf_ratedeal_payload.json", "w") as f:
    json.dump(out, f, indent=2)
print("payload bytes:", len(query))
print("assets:", len(urls))
print("caption:", caption)