import { createAction } from '@activepieces/pieces-framework';
import { CommonProps } from '../common';

export const createCard = createAction({
	name: 'create_card', // Must be a unique across the piece, this shouldn't be changed.
  displayName: 'Create card',
  description: 'Create Card in Pipefy',
	props: {
    authentication: CommonProps.authentication,
		organization_id: CommonProps.orgsList,
    pipe_id: CommonProps.pipesList,
    start_form_fields: CommonProps.startFormFields,
	},
	async run() {
    // const result = await httpClient.sendRequest<BaseResponse>(
    //   buildGraphqlHttpRequest(
    //     GraphqlRequestsHelper.buildCreateCardRequest(context.propsValue.card_id as number, context.propsValue.phase_id as number),
    //     context.propsValue.authentication
    //   )
    // )

    console.debug("Card create result", {})
    return {}
  }
})
