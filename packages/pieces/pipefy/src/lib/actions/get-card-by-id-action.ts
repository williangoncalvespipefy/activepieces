import { createAction, httpClient } from '@activepieces/framework';
import { Property } from '@activepieces/framework';

import { buildGraphqlHttpRequest, CommonProps, GetCardByIdWithFieldsResponse, GraphqlRequestsHelper } from '../common';

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
    const result = await httpClient.sendRequest<GetCardByIdWithFieldsResponse>(
      buildGraphqlHttpRequest(
        GraphqlRequestsHelper.buildGetCardWithFieldsByIdRequest(context.propsValue.card_id as number),
        context.propsValue.authentication
      )
    )
    console.debug("Card by id result", result.body)

    return result.body.errors || result.body.data
  },
  sampleData: {
    "id": "example_id",
    "uuid": "hash",
    "age": 5408812,
    "title": "Computer is not working properly",
    "comments_count": 0,
    "createdAt": "2023-02-08T18:56:23-03:00",
    "current_phase_age": 5408812,
    "done": false,
    "due_date": null,
    "emailMessagingAddress": "example_id@mail.pipefy.com",
    "expired": false,
    "late": false,
    "started_current_phase_at": "2023-02-08T18:56:23-03:00",
    "updated_at": "2023-03-02T19:29:16-03:00",
    "url": "link_to_your_card",
    "creatorEmail": "example_email@pipefy.com",
    "fields": [
        {
          "field": {
            "label": "What is your request?",
            "id": "what_is_your_request",
            "type": "short_text"
          },
          "name": "What is your request?",
          "value": "Computer is not working properly",
          "array_value": null,
          "report_value": "Computer is not working properly",
          "date_value": null,
          "datetime_value": null,
          "float_value": null,
          "filled_at": "2023-02-08T18:56:24-03:00",
          "updated_at": "2023-02-08T18:56:24-03:00",
          "phase_field": {
              "id": "what_is_your_request",
              "label": "What is your request?"
          },
          "label_values": null,
          "assignee_values": null
        },
    ],
    "current_phase": {
        "id": "example_id",
        "name": "Escalate the issue",
        "sequentialId": "1",
        "done": false,
        "cards_count": 1
    },
    "pipe": {
        "cards_count": 10,
        "emailAddress": "example_email@mail.pipefy.com",
        "id": "example_id",
        "name": "IT Service Desk"
    }
  }
})
