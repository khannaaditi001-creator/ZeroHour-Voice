import VoiceCallButton from './VoiceCallButton';
import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Volume2,
  RotateCcw,
  HelpCircle,
  Pill,
  School,
  AlertTriangle,
  Mic,
  MicOff,
} from 'lucide-react';
import { OutbreakData } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
  time: string;
}

interface ChatAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: OutbreakData;
}

const nowTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const ChatAssistantModal: React.FC<ChatAssistantModalProps> = ({
  isOpen,
  onClose,
  currentData,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: `Hello! I am your ZEROHOUR Outbreak Response Assistant. I can help verify health facts, clarify hospital triage recommendations, or debunk false rumors about the current ${currentData.title} in plain, everyday English. Tap the microphone and ask me out loud, or type your question.`,
      time: nowTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const messagesRef = useRef<Message[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const quickQuestions = [
    { label: 'Are schools safe to stay open?', icon: School },
    { label: 'Should people rush to buy antibiotics?', icon: Pill },
    { label: 'What if a child gets a sudden fever?', icon: HelpCircle },
    { label: 'How long are infected people contagious?', icon: AlertTriangle },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Stop the mic and any speech when the box closes
  useEffect(() => {
    if (!isOpen) {
      try {
        recognitionRef.current?.stop();
      } catch {
        /* ignore */
      }
      window.speechSynthesis?.cancel();
      setListening(false);
      setSpeakingIdx(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const speakText = (text: string, idx: number) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.lang = 'en-IN';
    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (messageText: string, viaVoice = false) => {
    const textToSend = messageText.trim();
    if (!textToSend || loading) return;

    const history = messagesRef.current.map((m) => ({ role: m.role, text: m.text }));
    const modelIdx = messagesRef.current.length + 1;

    const userMessage: Message = {
      role: 'user',
      text: textToSend,
      time: nowTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setVoiceNote('');
    setLoading(true);

    let replyText = '';
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history,
          currentScenario: {
            title: currentData.title,
            location: currentData.location,
            summary: currentData.summary,
          },
        }),
      });

      const result = await response.json();
      replyText =
        result.reply ||
        'Our healthcare advisors recommend staying hydrated, resting at home, and consulting local clinics if fever persists over 48 hours.';
    } catch (err) {
      console.error(err);
      replyText =
        'Healthcare guidance: Rest at home if you have a mild fever. Avoid antibiotics for viral infections, and call your local clinic if breathing becomes difficult.';
    }

    setMessages((prev) => [...prev, { role: 'model', text: replyText, time: nowTime() }]);
    setLoading(false);

    // If the question was asked by voice, answer by voice
    if (viaVoice) {
      speakText(replyText, modelIdx);
    }
  };

  const handleSpeak = (text: string, idx: number) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }
    speakText(text, idx);
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    setListening(false);
  };

  const startListening = () => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setVoiceNote('Voice input needs Google Chrome or Microsoft Edge.');
      return;
    }
    if (listening) {
      stopListening();
      return;
    }

    window.speechSynthesis?.cancel();
    setSpeakingIdx(null);
    setVoiceNote('Listening... ask your question.');

    const rec = new SR();
    rec.lang = 'en-IN';
    rec.interimResults = true;
    rec.continuous = false;

    let sent = false;
    let latest = '';

    rec.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      latest = transcript;
      setInput(transcript);
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal && !sent) {
        sent = true;
        handleSend(transcript, true);
      }
    };

    rec.onerror = (event: any) => {
      setListening(false);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setVoiceNote('Microphone is blocked. Allow it from the lock icon next to the address bar.');
      } else if (event.error === 'no-speech') {
        setVoiceNote('I did not hear anything. Tap the microphone and try again.');
      } else {
        setVoiceNote('Voice input stopped. Tap the microphone to try again.');
      }
    };

    rec.onend = () => {
      setListening(false);
      if (!sent && latest.trim()) {
        sent = true;
        handleSend(latest, true);
      }
    };

    recognitionRef.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  };

  const handleResetChat = () => {
    window.speechSynthesis?.cancel();
    stopListening();
    setSpeakingIdx(null);
    setVoiceNote('');
    setMessages([
      {
        role: 'model',
        text: `Conversation reset. I am ready to answer any questions about the ${currentData.title} in plain, everyday English.`,
        time: nowTime(),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl flex flex-col h-[620px] max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">

        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  ZEROHOUR Voice Officer
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Voice + Gemini
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Ask out loud. Get a spoken answer in plain English.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleResetChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Reset Chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-teal-50/50 border-b border-teal-100 shrink-0 flex items-center space-x-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 shrink-0 ml-1">
            Ask:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q.label, true)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-teal-100/70 border border-teal-200 text-teal-900 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/40">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            const isSpeaking = speakingIdx === idx;

            return (
              <div
                key={idx}
                className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isUser ? 'bg-slate-800 text-white' : 'bg-teal-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[82%] space-y-1`}>
                  <div
                    className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-800 shadow-2xs rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  <div className={`flex items-center space-x-2 text-[10px] text-slate-400 ${isUser ? 'justify-end' : ''}`}>
                    <span>{msg.time}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleSpeak(msg.text, idx)}
                        className={`hover:text-slate-700 font-semibold cursor-pointer flex items-center space-x-0.5 ${isSpeaking ? 'text-amber-700' : ''}`}
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{isSpeaking ? 'Playing' : 'Listen'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-2 text-slate-500 text-xs p-2">
              <Bot className="w-4 h-4 text-teal-600 animate-spin" />
              <span>Verifying medical guidance with Gemini...</span>
            </div>
          )}
        </div>

                <div className="px-3 pb-2 shrink-0">
          <VoiceCallButton />
        </div>
{/* Chat Input Bar */}
        <div className="p-3 border-t border-slate-100 bg-white shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center space-x-2"
          >
            <button
              type="button"
              onClick={startListening}
              className={`p-2.5 rounded-xl text-white transition-colors cursor-pointer ${
                listening ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-slate-800 hover:bg-slate-900'
              }`}
              title={listening ? 'Stop listening' : 'Ask by voice'}
              aria-label={listening ? 'Stop listening' : 'Ask by voice'}
            >
              {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tap the mic and speak, or type a question..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors cursor-pointer disabled:opacity-40"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-1">
            <span className={voiceNote ? 'text-teal-700 font-semibold' : ''}>
              {voiceNote || 'AI-generated guidance. Confirm with your local health authority.'}
            </span>
            <span>Emergency distress: call 112 / local ER</span>
          </div>
        </div>

      </div>
    </div>
  );
};
