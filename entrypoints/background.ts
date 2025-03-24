export default defineBackground({
  persistent: false,

  main() {
    // to bypass CORS restrictions
    onMessage('isPostOkay', async ({ data }) => {
      logger.debug('Checking post:', data);
      const req = await fetch(`https://api.stackexchange.com/2.3/posts/${data.id}/?site=${data.site}&key=${SE_API_KEY}`, {
        cache: 'force-cache',
      });

      if (req.status.toString()[0] === '4')
        return false;
      const res = await req.json() as { items?: unknown[] };
      return !(!!res.items && res.items.length > 0);
    });
  },
});
