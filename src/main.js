import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    name: 'Flag game',
  },
});

export default app;
