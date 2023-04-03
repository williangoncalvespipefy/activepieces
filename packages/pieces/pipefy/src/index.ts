
import { createPiece } from '@activepieces/framework';
import packageJson from '../package.json';
import { createCard } from './lib/actions/create-card-action';
import { moveCard } from './lib/actions/move-card-action';
import { cardCreated } from './lib/triggers/card-created-trigger';

export const pipefy = createPiece({
  name: 'pipefy',
  displayName: 'Pipefy',
  logoUrl: 'https://cdn.activepieces.com/pieces/pipefy.png',
  version: packageJson.version,
  authors: [
  ],
  actions: [
    createCard,
    moveCard,
  ],
  triggers: [
    cardCreated,
  ],
});
  