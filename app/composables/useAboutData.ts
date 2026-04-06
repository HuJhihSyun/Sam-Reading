export interface AboutData {
  message: string
  messageEn: string
  infoCards: { label: string; value: string }[]
  interests: string[]
  name: string
  updatedAt: string
}

const STORAGE_KEY = 'sam_about'

const defaultAbout: AboutData = {
  name: 'Samantha Cho',
  message: '假日總在看書的女子\n嚴重的文字偏食症\n有點挑惕有點刁鑽\n偏好小說，偶爾上進的攝取一點學術書（真的是偶爾）',
  messageEn: 'A girl who spends her weekends buried in books.\nSeverely picky when it comes to what she reads.\nA little particular, a little sharp.\nMostly into novels, with the occasional (and I mean occasional) attempt at something more academic.',
  infoCards: [
    { label: 'Location', value: '在島嶼的核心盆地，與環抱的群山一起守候這座多雨的城' },
    { label: 'Occupation', value: '在文獻的字裡行間打撈過往，為每段碎裂的歷史尋回座標。' },
    { label: 'Reading', value: '小說裡流浪、電影裡觀察；用他人敘事讀懂自身內心起伏。' },
    { label: 'Favorite', value: '著迷於揉搓兔毛時純粹靜謐，耽溺於舌尖冰涼茶香的微小確幸。' }
  ],
  interests: ['閱讀', '手寫日記', '輕音樂', '散步', '咖啡館', '電影', '文具', '植物', '燭光', '老歌'],
  updatedAt: '2026-04-01T00:00:00.000Z'
}

export function useAboutData() {
  function get(): AboutData {
    if (import.meta.client) {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try { return JSON.parse(raw) } catch {}
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAbout))
    }
    return defaultAbout
  }

  function save(data: AboutData): void {
    const updated = { ...data, updatedAt: new Date().toISOString() }
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return { get, save }
}
