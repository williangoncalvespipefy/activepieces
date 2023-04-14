import { createTrigger, TriggerStrategy } from "@activepieces/pieces-framework"
import { httpClient } from "@activepieces/pieces-common"
import { CommonProps, buildGraphqlHttpRequest, GraphqlRequestsHelper, CreatePipeWebhookResponse, WebhookInformation } from "../common";

export const cardFieldValueUpdated = createTrigger({
  name: 'field_updated',
  displayName: 'Card Field Updated',
  description: 'Triggers immediately when a card field has been updated in the selected Pipe.',
  props: {
    authentication: CommonProps.authentication,
		organization_id: CommonProps.orgsList,
    pipe_id: CommonProps.pipesList,
  },
  type: TriggerStrategy.WEBHOOK,
  async onEnable(context) {
    const webhookActions = ["card.field_update"]

    const { body: webhookData } = await httpClient.sendRequest<CreatePipeWebhookResponse>(
      buildGraphqlHttpRequest(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        GraphqlRequestsHelper.buildCreatePipeWebhookRequest(webhookActions, context.webhookUrl!, context.propsValue["pipe_id"]),
        context.propsValue.authentication
      )
    )

    await context.store?.put<WebhookInformation>('_card_field_updated_trigger', {
      webhookId: webhookData.data.createWebhook.webhook.id,
      clientMutationId: webhookData.data.createWebhook.clientMutationId
    });
  },
  async onDisable(context) {
    const response = await context.store?.get<WebhookInformation>('_card_field_updated_trigger');

    if (response) {
      await httpClient.sendRequest<CreatePipeWebhookResponse>(
        buildGraphqlHttpRequest(
          GraphqlRequestsHelper.buildDeleteWebhookRequest(response.webhookId, response.clientMutationId),
          context.propsValue.authentication
        )
      )

      await context.store?.put('_card_field_updated_trigger', undefined);
    }
  },
  async run(context) {
    return [context.payload.body.data];
  },
  sampleData:
  {
    "action": "card.field_update",
    "field": { "id": "text", "label": "text", "internal_id": 123454321 },
    "new_value": "t",
    "card": { "id": 123456, "pipe_id": "CxeXHeOR" }
  }
})
