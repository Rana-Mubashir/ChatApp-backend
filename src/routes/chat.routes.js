import { Router } from "express";
import {
    accessChat,
    sendMessage,
    createGroup,
    getGroupByUserAndChatId,
    getJoinedGroupsByUser
} from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.post('/access', accessChat);

chatRouter.post('/message', sendMessage);

chatRouter.post('/group/create', createGroup);

chatRouter.get('/group/:userId/:chatId', getGroupByUserAndChatId);

chatRouter.get('/groups/:userId', getJoinedGroupsByUser);

export { chatRouter };
