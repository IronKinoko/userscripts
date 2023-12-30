import { SpeechOptions } from '../speech'

export const adapter: Record<string, SpeechOptions> = {
  bilixs: {
    container: 'body',
    lang: 'zh-CN',
    getParagraph: () => {
      const content = document.querySelector('.article-content')
      if (!content) throw new Error('content not found')

      return Array.from(content.querySelectorAll('p'))
    },
  },
}
