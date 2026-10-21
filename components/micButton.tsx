"use client";

import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type SpeechResult = ArrayLike<{ transcript: string }> & { isFinal: boolean };

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult:
    | ((event: {
        resultIndex: number;
        results: ArrayLike<SpeechResult>;
      }) => void)
    | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

export function MicButton({
  value,
  onTranscript,
  disabled = false,
}: {
  value: string;
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const promptBeforeListeningRef = useRef("");

  useEffect(
    () => () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    },
    [],
  );

  const toggleListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const speechWindow = window as SpeechRecognitionWindow;
    const SpeechRecognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice input is not supported by this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    promptBeforeListeningRef.current = value;
    recognition.lang = navigator.language;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(
        { length: event.results.length },
        (_, index) => event.results[index],
      )
        .map((result) => result[0]?.transcript.trim() ?? "")
        .filter(Boolean)
        .join(" ");
      if (transcript) {
        const initialPrompt = promptBeforeListeningRef.current;
        onTranscript(
          `${initialPrompt}${initialPrompt && !/\s$/.test(initialPrompt) ? " " : ""}${transcript}`,
        );
      }
    };
    recognition.onerror = ({ error }) => {
      toast.error(
        error === "not-allowed" || error === "service-not-allowed"
          ? "Allow microphone access and speech recognition in your browser settings."
          : error === "network"
            ? "Check your connection or try Chrome or Edge."
            : error === "audio-capture"
              ? "No microphone is available. Check your system's selected audio input."
              : `Voice input failed: ${error}.`,
      );
    };
    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
        setListening(false);
      }
    };

    try {
      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
    } catch {
      recognitionRef.current = null;
      toast.error("Could not start voice input. Please try again.");
    }
  };

  return (
    <>
      <Button
        type="button"
        size="icon"
        variant={listening ? "destructive" : "ghost"}
        onClick={toggleListening}
        disabled={disabled}
        aria-label={listening ? "Stop voice input" : "Start voice input"}
        aria-pressed={listening}
        title={listening ? "Stop voice input" : "Start voice input"}
        className="rounded-full"
      >
        {listening ? <Square className="size-4" /> : <Mic className="size-4" />}
      </Button>
      <span className="sr-only" aria-live="polite">
        {listening ? "Listening for voice input" : ""}
      </span>
    </>
  );
}
