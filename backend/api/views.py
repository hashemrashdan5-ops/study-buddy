import os
import json
from openai import OpenAI
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Note, BugReport
from .serializers import (
    RegisterSerializer, UserSerializer,
    NoteSerializer, BugReportSerializer,
)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1"),
)
AI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)


class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)


class BugReportListCreateView(generics.ListCreateAPIView):
    serializer_class = BugReportSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return BugReport.objects.all().order_by("-created_at")

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def summarize(request):
    text = request.data.get("text", "").strip()
    if not text:
        return Response({"error": "text is required"}, status=400)
    if len(text) > 5000:
        return Response({"error": "text too long (max 5000 chars)"}, status=400)

    try:
        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a helpful study assistant. "
                        "Summarize the provided text in clear bullet points. "
                        "Be concise. Do not add information not in the text."
                    ),
                },
                {"role": "user", "content": f"Summarize this:\n\n{text}"},
            ],
            max_tokens=500,
            temperature=0.3,
        )
        return Response({"summary": response.choices[0].message.content})
    except Exception as e:
        return Response({"error": "AI service error", "detail": str(e)}, status=500)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_quiz(request):
    text = request.data.get("text", "").strip()
    count = int(request.data.get("count", 5))

    if not text:
        return Response({"error": "text is required"}, status=400)
    if len(text) > 5000:
        return Response({"error": "text too long (max 5000 chars)"}, status=400)
    if not (1 <= count <= 10):
        return Response({"error": "count must be 1-10"}, status=400)

    try:
        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        f"Generate {count} multiple-choice questions from the text. "
                        "Return a JSON array: "
                        '[{"question":"...","options":["A)...","B)...","C)...","D)..."],"answer":"A"}]'
                        " Return ONLY the JSON array."
                    ),
                },
                {"role": "user", "content": f"Generate quiz from:\n\n{text}"},
            ],
            max_tokens=1000,
            temperature=0.4,
        )
        raw = response.choices[0].message.content.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()
        questions = json.loads(raw)
        return Response({"questions": questions})
    except Exception as e:
        return Response({"error": "AI service error", "detail": str(e)}, status=500)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def chat(request):
    messages = request.data.get("messages", [])
    if not isinstance(messages, list) or not messages:
        return Response({"error": "messages array is required"}, status=400)
    if len(messages) > 50:
        return Response({"error": "Too many messages (max 50)"}, status=400)

    for msg in messages:
        if not isinstance(msg, dict) or "role" not in msg or "content" not in msg:
            return Response({"error": "Invalid message format"}, status=400)
        if msg["role"] not in ("user", "assistant", "system"):
            return Response({"error": "Invalid role"}, status=400)
        if len(msg["content"]) > 5000:
            return Response({"error": "Message too long (max 5000 chars)"}, status=400)

    system_prompt = {
        "role": "system",
        "content": (
            "You are Study Buddy, a friendly and helpful AI study assistant. "
            "You help students learn, understand concepts, do their homework, "
            "and answer questions. Respond in the same language the user writes in "
            "(Arabic or English). Be concise, accurate, and encouraging."
        ),
    }
    full_messages = [system_prompt] + messages

    try:
        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=full_messages,
            max_tokens=800,
            temperature=0.7,
        )
        reply = response.choices[0].message.content
        return Response({"reply": reply})
    except Exception as e:
        return Response({"error": "AI service error", "detail": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response({"status": "ok", "project": "Study Buddy"})
