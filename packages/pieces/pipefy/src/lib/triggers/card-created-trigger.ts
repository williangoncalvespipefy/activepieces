import { createTrigger, httpClient, Property } from "@activepieces/framework"
import { TriggerStrategy } from "../../../../../shared/src";
import { CommonProps, buildGraphqlHttpRequest, GraphqlRequestsHelper, CreatePipeWebhookResponse, WebhookInformation } from "../common";

export const cardCreated = createTrigger({
  name: 'card_created',
  displayName: 'New card',
  description: 'Triggers immediately when a card is created for the selected Pipe.',
  props: {
    authentication: CommonProps.authentication,
		organization_id: Property.Number({
			displayName: 'Organization',
			description: 'Select a Pipefy Organization where you want to setup the card action.',
			required: true,
		}),
    pipe_id: CommonProps.pipesList,
  },
  type: TriggerStrategy.WEBHOOK,
  async onEnable(context) {
    const webhookActions = ["card.create"]

    const { body: webhookData } = await httpClient.sendRequest<CreatePipeWebhookResponse>(
      buildGraphqlHttpRequest(
        GraphqlRequestsHelper.buildCreatePipeWebhookRequest(webhookActions, context.webhookUrl!, context.propsValue["pipe_id"]),
        context.propsValue.authentication
      )
    )

    await context.store?.put<WebhookInformation>('_new_card_create_trigger', {
      webhookId: webhookData.data.createWebhook.webhook.id,
      clientMutationId: webhookData.data.createWebhook.clientMutationId
    });
  },
  async onDisable(context) {
    const response = await context.store?.get<WebhookInformation>('_new_card_create_trigger');
    if (response) {
      await httpClient.sendRequest<CreatePipeWebhookResponse>(
        buildGraphqlHttpRequest(
          GraphqlRequestsHelper.buildDeleteWebhookRequest(response.webhookId, response.clientMutationId),
          context.propsValue.authentication
        )
      )
    }
  },
  async run(context) {
    return [context.payload.body.data];
  },
  sampleData:
  {
    "action": 8,
    "card": {
      "id": 12345, 
      "pipe_id": "CxeXHeOR",
    }
  }
})