import { createTrigger, TriggerStrategy } from "@activepieces/pieces-framework"
import { httpClient } from "@activepieces/pieces-common"
import { CommonProps, buildGraphqlHttpRequest, GraphqlRequestsHelper, CreatePipeWebhookResponse, WebhookInformation } from "../common";

export const cardCreated = createTrigger({
  name: 'card_created',
  displayName: 'New card',
  description: 'Triggers immediately when a card is created for the selected Pipe.',
  props: {
    authentication: CommonProps.authentication,
		organization_id: CommonProps.orgsList,
    pipe_id: CommonProps.pipesList,
  },
  type: TriggerStrategy.WEBHOOK,
  async onEnable(context) {
    const webhookActions = ["card.create"]

    const { body: webhookData } = await httpClient.sendRequest<CreatePipeWebhookResponse>(
      buildGraphqlHttpRequest(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

      await context.store?.put('_new_card_create_trigger', undefined);
    }
  },
  async run(context) {
    return [context.payload.body.data];
  },
  sampleData:
  {
    "action": "card.create",
    "card": { "id": 12345, "pipe_id": "CxeXHeOR" }
  }
})
