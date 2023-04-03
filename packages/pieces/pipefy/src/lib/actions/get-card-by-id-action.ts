import { createAction, httpClient } from '@activepieces/framework';
import { Property } from '@activepieces/framework';

import { buildGraphqlHttpRequest, CommonProps, GraphqlRequestsHelper } from '../common';

export const getCardById = createAction({
	name: 'get_card_by_id',
  displayName: 'Get a card by ID',
  description: 'Get a card by ID in Pipefy',
	props: {
    authentication: CommonProps.authentication,
		organization_id: Property.Number({
			displayName: 'Organization',
			description: 'Select a Pipefy Organization where you want to setup the card action.',
			required: true,
		}),
    pipe_id: CommonProps.pipesList,
    card_id: Property.Number({
			displayName: 'Card ID',
			description: 'Card ID',
			required: true,
		}),
	},
	async run(context) {
    const result = await httpClient.sendRequest<BaseResponse>(
      buildGraphqlHttpRequest(
        GraphqlRequestsHelper.buildGetCardWithFieldsByIdRequest(context.propsValue.card_id as number),
        context.propsValue.authentication
      )
    )

    console.debug("Card create result", {})
    return {}
  }
})