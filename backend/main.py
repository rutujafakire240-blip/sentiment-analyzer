from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

classifier = pipeline("sentiment-analysis")

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    content = await file.read()
    text = content.decode("utf-8")

    sentences = text.split(".")

    results = []

    for sentence in sentences:
        if sentence.strip():
            sentiment = classifier(sentence)[0]

            results.append({
                "sentence": sentence.strip(),
                "sentiment": sentiment["label"],
                "score": round(sentiment["score"], 2)
            })

    return {
        "results": results
    }