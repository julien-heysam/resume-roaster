// Model constants that can be safely imported on both client and server
export const OPENAI_MODELS = {
  NANO: 'gpt-4.1-nano',
  MINI: 'gpt-4.1-mini',
  NORMAL: 'gpt-4.1',
  LARGE: 'o4-mini-high'
} as const

export const ANTHROPIC_MODELS = {
  HAIKU: 'claude-3-5-haiku-20241022',
  SONNET: 'claude-sonnet-4-20250514', 
  OPUS: 'claude-opus-4-20250514',
} as const

// Context size constants
export const CONTEXT_SIZES = {
  MINI: 1000,
  NORMAL: 4000,
  LARGE: 8000,
  XLARGE: 40000,
  MAX: 200000
} as const

// Temperature constants
export const TEMPERATURES = {
  DETERMINISTIC: 0,
  LOW: 0.1,
  NORMAL: 0.3,
  HIGH: 0.7,
  CREATIVE: 1.0
} as const 