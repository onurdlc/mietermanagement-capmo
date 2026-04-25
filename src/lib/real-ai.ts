import OpenAI from 'openai';

export type AiChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type StructuredTicketDraft = {
  title: string | null;
  description: string | null;
  category: string | null;
  trade: string | null;
  type: string | null;
  location: string | null;
  room: string | null;
  severity: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  warrantyLikely: boolean | null;
  missingFields: string[];
  followUpQuestions: string[];
  readyForTicket: boolean;
  confidence: number;
};

export function hasOpenAiKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export const requiredTicketFields = [
  'problem_description',
  'location_or_room',
  'urgency',
  'duration',
  'contact_confirmation'
];

export function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    const cleaned = value
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return fallback;
  }
}

export function mockTicketDraft(input: string): StructuredTicketDraft {
  const lower = input.toLowerCase();
  const isWater = lower.includes('wasser') || lower.includes('leak') || lower.includes('tropf') || lower.includes('feucht');
  const isMold = lower.includes('schimmel') || lower.includes('mold');
  const isElectric = lower.includes('strom') || lower.includes('elektro') || lower.includes('electric');
  const isBathroom = lower.includes('bad') || lower.includes('bathroom');
  const isKitchen = lower.includes('küche') || lower.includes('kitchen') || lower.includes('spüle');

  const missingFields = [];
  if (!isBathroom && !isKitchen) missingFields.push('location_or_room');
  if (!lower.includes('seit') && !lower.includes('today') && !lower.includes('gestern')) missingFields.push('duration');
  if (!lower.includes('dringend') && !lower.includes('urgent') && !lower.includes('notfall')) missingFields.push('urgency');

  return {
    title: isWater ? 'Water leak detected' : isMold ? 'Possible mold damage' : 'Tenant defect report',
    description: input || null,
    category: isWater ? 'Sanitary' : isMold ? 'Moisture / Mold' : isElectric ? 'Electrical' : 'General defect',
    trade: isWater ? 'Plumbing' : isMold ? 'Drywall / Painter' : isElectric ? 'Electrical' : 'Facility management',
    type: 'Warranty defect',
    location: isBathroom ? 'Bathroom' : isKitchen ? 'Kitchen' : null,
    room: isBathroom ? 'Bathroom' : isKitchen ? 'Kitchen' : null,
    severity: isWater ? 'HIGH' : isMold ? 'HIGH' : 'NORMAL',
    priority: isWater ? 'URGENT' : isMold ? 'HIGH' : 'NORMAL',
    warrantyLikely: true,
    missingFields,
    followUpQuestions: missingFields.length
      ? missingFields.map((field) => {
          if (field === 'location_or_room') return 'In welchem Raum tritt das Problem genau auf?';
          if (field === 'duration') return 'Seit wann besteht das Problem?';
          if (field === 'urgency') return 'Ist der Schaden akut/dringend oder kann er regulär geprüft werden?';
          return `Bitte ergänzen Sie: ${field}`;
        })
      : [],
    readyForTicket: missingFields.length === 0,
    confidence: isWater || isMold || isElectric ? 0.86 : 0.62
  };
}

export async function analyzeTenantConversation(messages: AiChatMessage[], language: 'de' | 'en' = 'de') {
  const latestUserText = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
  const fallback = mockTicketDraft(latestUserText);
  const openai = getOpenAI();
  if (!openai) {
    return {
      reply: fallback.readyForTicket
        ? language === 'de'
          ? 'Ich habe alle relevanten Informationen. Das Ticket kann jetzt mit Status OPEN erstellt werden.'
          : 'I have all relevant information. The ticket can now be created with status OPEN.'
        : fallback.followUpQuestions[0] ?? (language === 'de' ? 'Bitte beschreiben Sie den Schaden genauer.' : 'Please describe the issue in more detail.'),
      draft: fallback,
      mode: 'mock'
    };
  }

  const system = language === 'de'
    ? `Du bist ein KI-Assistent für Mietermanagement, Gewährleistung und Bauleitung. Frage so lange nach, bis ein vollständiges Ticket erstellt werden kann. Antworte kurz und professionell auf Deutsch. Gib zusätzlich ein JSON zurück mit den Feldern: reply, draft. draft muss enthalten: title, description, category, trade, type, location, room, severity, priority, warrantyLikely, missingFields, followUpQuestions, readyForTicket, confidence. Neue Tickets müssen später immer status OPEN bekommen.`
    : `You are an AI assistant for tenant management, warranty and construction management. Ask follow-up questions until a complete ticket can be created. Reply briefly and professionally in English. Return JSON with fields: reply, draft. draft must include: title, description, category, trade, type, location, room, severity, priority, warrantyLikely, missingFields, followUpQuestions, readyForTicket, confidence. New tickets must later always be created with status OPEN.`;

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o-mini',
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      ...messages.map((m) => ({ role: m.role, content: m.content }))
    ]
  });

  const raw = response.choices[0]?.message?.content ?? '';
  const parsed = safeJsonParse<{ reply: string; draft: StructuredTicketDraft }>(raw, {
    reply: fallback.followUpQuestions[0] ?? 'Bitte ergänzen Sie weitere Angaben.',
    draft: fallback
  });

  return { ...parsed, mode: 'openai' };
}

export async function analyzeDamageImage(file: File, prompt = '', language: 'de' | 'en' = 'de') {
  const fallback = {
    damage_type: 'possible water damage',
    trade: 'Plumbing',
    severity: 'HIGH',
    room: 'Bathroom / Kitchen unclear',
    warranty_probability: 'LIKELY',
    confidence: 0.72,
    follow_up_questions: language === 'de'
      ? ['In welchem Raum wurde das Foto aufgenommen?', 'Tritt aktuell noch Wasser aus?']
      : ['In which room was the photo taken?', 'Is water still actively leaking?']
  };

  const openai = getOpenAI();
  if (!openai) return { result: fallback, mode: 'mock' };

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString('base64');
  const mime = file.type || 'image/jpeg';

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_VISION_MODEL ?? 'gpt-4o-mini',
    temperature: 0.1,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: language === 'de'
          ? 'Du bist ein Bau- und Gewährleistungs-Experte. Analysiere Schadensbilder vorsichtig. Gib nur JSON zurück: damage_type, trade, severity, room, warranty_probability, confidence, follow_up_questions, safety_note.'
          : 'You are a construction and warranty expert. Analyze defect images carefully. Return only JSON: damage_type, trade, severity, room, warranty_probability, confidence, follow_up_questions, safety_note.'
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt || 'Analyze this tenant defect image.' },
          { type: 'image_url', image_url: { url: `data:${mime};base64,${base64}` } }
        ]
      }
    ]
  });

  const raw = response.choices[0]?.message?.content ?? '';
  return { result: safeJsonParse(raw, fallback), mode: 'openai' };
}
