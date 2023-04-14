import { Property, createAction } from '@activepieces/pieces-framework';
import { httpClient } from '@activepieces/pieces-common';
import { CommonProps, buildGraphqlHttpRequest, GraphqlRequestsHelper, MoveCardToPhaseResponse } from '../common';

export const updateCardFieldValue = createAction({
	name: 'update_card_field_value', // Must be a unique across the piece, this shouldn't be changed.
  displayName:'Update card field value in Pipefy',
  description: 'Update card field value in Pipefy',
	props: {
    authentication: CommonProps.authentication,
    card_id: Property.Number({
			displayName: 'Card ID',
			description: 'Pipefy Card ID of the card to be updated',
			required: true,
		}),
    field_id: Property.ShortText({
			displayName: 'Card field ID',
			description: 'Pipefy Card Field ID of the field to be updated.',
			required: true,
		}),
    value: Property.ShortText({
			displayName: 'Card field value',
			description: 'New value of the card field to be updated.',
			required: true,
		}),
	},
	async run(context) {
    const result = await httpClient.sendRequest<MoveCardToPhaseResponse>(
      buildGraphqlHttpRequest(
        GraphqlRequestsHelper.buildUpdateCardFieldValueRequest(context.propsValue.card_id, context.propsValue.field_id, context.propsValue.value),
        context.propsValue.authentication
      )
    )

    console.debug("Card field update result", result.body)

    return result.body.data
  }
})
