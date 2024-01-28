from openai import OpenAI

client = OpenAI(api_key = "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")

stream = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Say this is a test"}],
    stream=True,
)
for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")


