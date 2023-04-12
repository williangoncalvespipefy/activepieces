import { createPiece } from '@activepieces/framework';
import packageJson from '../package.json';
import { createCard } from './lib/actions/create-card-action';
import { moveCard } from './lib/actions/move-card-action';
import { cardCreated } from './lib/triggers/card-created-trigger';
import { getCardById } from './lib/actions/get-card-by-id-action';

export const pipefy = createPiece({
  name: 'pipefy',
  displayName: 'Pipefy',
  logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Pipefy-logo-black.png',
  version: packageJson.version,
  authors: [
  ],
  actions: [
    createCard,
    getCardById,
    moveCard,
  ],
  triggers: [
    cardCreated,
  ],
});
