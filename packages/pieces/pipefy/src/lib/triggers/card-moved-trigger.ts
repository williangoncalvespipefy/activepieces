import { createTrigger, Property, TriggerStrategy } from "@activepieces/pieces-framework"
import { httpClient } from "@activepieces/pieces-common"
import { CommonProps, buildGraphqlHttpRequest, GraphqlRequestsHelper, CreatePipeWebhookResponse, WebhookInformation } from "../common";

export const cardMoved = createTrigger({
  name: 'card_moved',
  displayName: 'Card moved',
  description: 'Triggers immediately when a card has been moved in the selected Pipe.',
  props: {
    authentication: CommonProps.authentication,
		organization_id: CommonProps.orgsList,
    pipe_id: CommonProps.pipesList,
  },
  type: TriggerStrategy.WEBHOOK,
  async onEnable(context) {
    const webhookActions = ["card.move"]

    const { body: webhookData } = await httpClient.sendRequest<CreatePipeWebhookResponse>(
      buildGraphqlHttpRequest(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        GraphqlRequestsHelper.buildCreatePipeWebhookRequest(webhookActions, context.webhookUrl!, context.propsValue["pipe_id"]),
        context.propsValue.authentication
      )
    )

    await context.store?.put<WebhookInformation>('_card_move_trigger', {
      webhookId: webhookData.data.createWebhook.webhook.id,
      clientMutationId: webhookData.data.createWebhook.clientMutationId
    });
  },
  async onDisable(context) {
    const response = await context.store?.get<WebhookInformation>('_card_move_trigger');

    if (response) {
      await httpClient.sendRequest<CreatePipeWebhookResponse>(
        buildGraphqlHttpRequest(
          GraphqlRequestsHelper.buildDeleteWebhookRequest(response.webhookId, response.clientMutationId),
          context.propsValue.authentication
        )
      )

      await context.store?.put('_card_move_trigger', undefined);
    }
  },
  async run(context) {
    return [context.payload.body.data];
  },
  sampleData:
  {
    "action": "card.move",
    "from": { "id": 312483018, "name": "Inbox" },
    "to": { "id": 312483019, "name": "Doing" },
    "moved_by": {
      "id": 12345,
      "name": "John Doe",
      "username": "john-doe",
      "email": "john.doe@email.com",
      "avatar_url": "https://gravatar.com/avatar/0000x0x0x000000x0x00000xx0000xx0.png?s=144\u0026d=https://pipestyle.staticpipefy.com/v2-temp/illustrations/avatar.png"
    },
    "card": { "id": 123456, "title": "Prospect 1", "pipe_id": "CxeXHeOR" }
  }
})
