import { NEW_EVENT_READ_MESSAGE } from '@/constants.json';
import { getActiveUser, seenMessage } from '@/lib/lib';
import { Socket } from 'socket.io';

const SeenMessageHandler = (socket: Socket) => {
  socket.on(
    NEW_EVENT_READ_MESSAGE,
    async ({ messageId, chatId }, messageSuccessfullySeen) => {
      const user = getActiveUser({ socketId: socket.id });

      if (!user || !messageId || !chatId) {
        messageSuccessfullySeen(false);
        return;
      }

      const messageSeen = await seenMessage(chatId, messageId);

      socket.broadcast.to(chatId).emit(NEW_EVENT_READ_MESSAGE, {
        messageId,
        chatId,
      });

      messageSuccessfullySeen(messageSeen);
    }
  );
};

export default SeenMessageHandler;