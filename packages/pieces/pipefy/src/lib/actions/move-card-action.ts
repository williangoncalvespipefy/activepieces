import { Property, createAction } from '@activepieces/pieces-framework';
import { httpClient } from '@activepieces/pieces-common';
import { CommonProps, buildGraphqlHttpRequest, GraphqlRequestsHelper, MoveCardToPhaseResponse } from '../common';

export const moveCard = createAction({
	name: 'move_card', // Must be a unique across the piece, this shouldn't be changed.
  displayName:'Move card in Pipefy',
  description: 'Move card in Pipefy',
	props: {
    authentication: CommonProps.authentication,
		organization_id: CommonProps.orgsList,
    pipe_id: CommonProps.pipesList,
    phase_id: CommonProps.phasesList,
    card_id: Property.Number({
			displayName: 'Card ID',
			description: 'Pipefy Card ID of the card to be moved.',
			required: true,
		}),
	},
	async run(context) {
    const result = await httpClient.sendRequest<MoveCardToPhaseResponse>(
      buildGraphqlHttpRequest(
        GraphqlRequestsHelper.buildMoveCardRequest(context.propsValue.card_id as number, context.propsValue.phase_id as number),
        context.propsValue.authentication
      )
    )

    console.debug("Card move result", result.body)

    return result.body.data
  },
  sampleData:
  {
    "clientMutationId": null,
    "card": {
      "id": "643717615",
      "title": "Unstable internet connection",
      "createdAt": "2023-02-08T18:56:23-03:00",
      "updated_at": "2023-04-12T09:56:21-03:00",
      "started_current_phase_at": "2023-04-12T09:56:21-03:00",
      "url": "http://app.pipefy.com/pipes/302982029#cards/643717615",
      "labels": [
        {
          "id": "308264978",
          "name": "Issue"
        }
      ],
      "assignees": [],
      "fields": [
        {
          "field": {
            "id": "category",
            "label": "Category"
          },
          "report_value": "Issue"
        },
      ],
      "uuid": "e43c77d4-c6f7-4466-9a88-4a64593be60d",
      "comments_count": 0,
      "attachments_count": 0
    }
  }
})
