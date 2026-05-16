"""
Test script to verify Groq API key directly without Django.
Run with: python test_groq.py
"""
import os
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("OPENAI_API_KEY")
base_url = os.getenv("OPENAI_BASE_URL")
model = os.getenv("OPENAI_MODEL")

print("=" * 60)
print("Groq API Test")
print("=" * 60)
print(f"API Key length:    {len(key) if key else 'NONE'}")
print(f"API Key starts:    {key[:15] if key else 'NONE'}...")
print(f"API Key ends:      ...{key[-10:] if key else 'NONE'}")
print(f"Base URL:          {base_url}")
print(f"Model:             {model}")
print("=" * 60)

# Test the API directly with requests
try:
    import requests
    print("\nSending test request to Groq...")
    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        },
        json={
            "model": "llama-3.1-8b-instant",
            "messages": [{"role": "user", "content": "Say 'hello' in one word"}],
            "max_tokens": 10,
        },
        timeout=30,
    )
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response Body: {response.text[:500]}")

    if response.status_code == 200:
        print("\n[SUCCESS] API key works correctly!")
    elif response.status_code == 401:
        print("\n[FAIL] The API key is invalid or revoked.")
        print("[FIX] Get a new key from: https://console.groq.com/keys")
    else:
        print(f"\n[FAIL] Unexpected error: {response.status_code}")
except Exception as e:
    print(f"\n[ERROR] {type(e).__name__}: {e}")
