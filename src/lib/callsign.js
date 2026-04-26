const adjectives = [
  'King', 'Dark', 'Neon', 'Ghost', 'Iron', 'Rust', 'Void', 'Hex',
  'Pale', 'Slim', 'Loud', 'Dead', 'Fast', 'Cold', 'Raw', 'Grim',
  'Soft', 'Rogue', 'Bare', 'Null', 'Ash', 'Fog', 'Storm', 'Drift',
  'Pixel', 'Root', 'Core', 'Node', 'Stack', 'Byte', 'Sync', 'Fork',
]

const nouns = [
  'Bird', 'Wolf', 'Hawk', 'Bear', 'Fox', 'Crow', 'Seal', 'Lynx',
  'Crane', 'Moth', 'Wasp', 'Viper', 'Raven', 'Shark', 'Drake',
  'Comet', 'Pulse', 'Drift', 'Surge', 'Forge', 'Flame', 'Cipher',
  'Loop', 'Thread', 'Shard', 'Relay', 'Patch', 'Merge', 'Build',
]

export function generateCallsign() {
  const adj  = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num  = String(Math.floor(Math.random() * 90) + 10)
  return `${adj}${noun}${num}`
}
