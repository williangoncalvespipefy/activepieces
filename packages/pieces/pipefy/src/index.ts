import { createPiece } from '@activepieces/pieces-framework';
import packageJson from '../package.json';
import { createCard } from './lib/actions/create-card-action';
import { moveCard } from './lib/actions/move-card-action';
import { cardCreated } from './lib/triggers/card-created-trigger';
import { cardMoved } from './lib/triggers/card-moved-trigger';
import { getCardById } from './lib/actions/get-card-by-id-action';
import { cardFieldValueUpdated } from './lib/triggers/card-field-value-updated-trigger';
import { updateCardFieldValue } from './lib/actions/update-card-field-value-action';

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
    updateCardFieldValue,
  ],
  triggers: [
    cardCreated,
    cardMoved,
    cardFieldValueUpdated,
  ],
});
