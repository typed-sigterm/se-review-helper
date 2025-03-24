const ReviewTaskType = {
  'first-answers': '13',
  'first-questions': '12',
  'late-answers': '5',
} as const;

async function fetchReviewInfo(id: string, type: keyof typeof ReviewTaskType) {
  const fkey = getFkey();
  const req = await fetch(new URL(`/review/next-task/${id}`, location.origin), {
    method: 'POST',
    body: new URLSearchParams({
      taskTypeId: ReviewTaskType[type],
      fkey,
    }),
  });
  return req.json() as Promise<{
    isAudit: boolean
    isUnavailable: boolean
    postId: number
  }>;
}

type Container = HTMLDivElement;

function waitContainer() {
  return new Promise<Container>((resolve, reject) => {
    const parent = document.querySelector<HTMLDivElement>('.js-review-task > .js-actions-sidebar');
    if (!parent)
      return reject(new Error('Could not find actions container'));

    const check = () => parent.querySelector(
      '.s-sidebarwidget--content > :last-child > :last-child > :last-child',
    ) as Container | null;

    if (check())
      return resolve(check()!);

    const observer = new MutationObserver((mutations) => {
      if (!mutations.some(m => m.addedNodes.length > 0))
        return;
      if (check()) {
        observer.disconnect();
        resolve(check()!);
      }
    });
    observer.observe(parent, { childList: true, subtree: true });
  });
}

const URL_PATH_RE = /\/review\/(?<type>first-answers|first-questions|late-answers)\/(?<id>\d+)/;

function createAuditInfo() {
  const area = document.createElement('div');
  area.style.display = 'inline-block';
  area.style.marginLeft = '4px';
  area.style.fontSize = '24px';
  area.style.verticalAlign = 'sub';

  const spinner = createIcon('line-md:loading-loop'); // mdi-loading is missing animation
  area.appendChild(spinner);

  const match = URL_PATH_RE.exec(location.pathname)?.groups;
  if (!match)
    throw new Error('URL format mismatch');

  logger.debug('Fetching review:', match.type, match.id);
  fetchReviewInfo(match.id, match.type as keyof typeof ReviewTaskType)
    .then((info) => {
      if (info.isUnavailable || !info.isAudit)
        return;
      return sendMessage('isPostOkay', { site: location.hostname, id: info.postId });
    })
    .finally(() => spinner.remove())

    .then((ok) => {
      if (ok === undefined) {
        logger.debug('Not audit');
      } else {
        logger.debug('Audit answer:', ok);
        area.style.cursor = 'help';
        const icon = createIcon('mdi:text-box-check', `Known ${ok ? 'positive' : 'negative'} audit`);
        area.appendChild(icon);
        area.classList.add(ok ? 'fc-success' : 'fc-danger'); // from stackoverflow.design
      }
    })

    .catch((e) => {
      logger.error('Failed to verify post:', e);
      const icon = createIcon('mdi:question-mark-box', 'Error occured, check DevTools console for details');
      area.appendChild(icon);
    });

  return area;
}

function rerunWhenTaskChange(cb: () => void) {
  let currentId = URL_PATH_RE.exec(location.href)?.groups?.id;
  const observer = new MutationObserver(() => {
    const id = URL_PATH_RE.exec(location.href)?.groups?.id;
    if (id !== currentId) {
      currentId = id;
      cb();
    }
  });
  observer.observe(
    document.querySelector('.js-review-task')!,
    { childList: true, subtree: true },
  );
  cb();
}

export default defineContentScript({
  matches: MATCH_URLS,

  async main() {
    welcome();
    injectScript('/iconify.js');

    rerunWhenTaskChange(async () => {
      logger.debug('Waiting for actions container to be created...');
      let container: Container;
      try {
        container = await waitContainer();
      } catch (e) {
        return logger.error(e);
      }

      logger.debug('Creating DOM');
      container.appendChild(createAuditInfo());
    });
  },
});
