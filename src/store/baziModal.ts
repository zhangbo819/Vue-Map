import { defineStore } from 'pinia';
import { textJSON } from 'astro-bazi-utils';

export const useBaziModalStore = defineStore('baziModal', {
  state: () => ({
    visible: false,
    title: '' as string,
    text: '' as string,
    // payload: null as any, // 可以放八字数据
  }),

  actions: {
    open(options?: { title?: string; text?: string }) {
      const { text, title } = options || {};
      this.visible = true;
      this.title = title || text || '';

      if (typeof text !== 'undefined' && textJSON[text]) {
        this.text = textJSON[text];
      } else {
        this.text = text || '';
      }
      // this.payload = options?.payload || null;
    },

    close() {
      this.visible = false;
      this.title = '';
      this.text = '';
      // this.payload = null;
    },
  },
});
