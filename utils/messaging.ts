import { defineExtensionMessaging } from '@webext-core/messaging';

interface ProtocolMap {
  isPostOkay: (data: { site: string, id: number }) => boolean
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
