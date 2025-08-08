import { Router } from "express";
import {
    accessChat,
    sendMessage,
    createGroup,
    accessGroupChat,
    getJoinedGroups
} from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.post('/access', accessChat);

chatRouter.post('/message', sendMessage);

chatRouter.post('/group/create', createGroup);

chatRouter.get('/group/:userId/:chatId', accessGroupChat);

chatRouter.get('/groups/:userId', getJoinedGroups);

export { chatRouter };
