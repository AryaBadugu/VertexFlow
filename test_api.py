"""Quick test: wait 60s for quota reset, then test API."""
import time
import os
from dotenv import load_dotenv

load_dotenv()

print("Waiting 60 seconds for per-minute quota to reset...")
time.sleep(60)

from google import genai
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

try:
    r = client.models.generate_content(model="gemini-2.0-flash", contents="Say hello in one word")
    print(f"SUCCESS: {r.text}")
except Exception as e:
    print(f"FAILED: {e}")
