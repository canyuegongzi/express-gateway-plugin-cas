import { Application } from 'express-serve-static-core';
import User from '../models/user-model';
import { jsonMiddleware } from './../config/middlewares';
import { asyncifyHandler } from './../utils/async-handler';
import { ResponseUtil } from './../utils/response-util';

export default (gatewayExpressApp: Application) => {
	gatewayExpressApp.post(
		'/auth/user',
		jsonMiddleware,
		asyncifyHandler(async (req, res, next) => {
			try {
				const user = await User.create({
					...req.body
				});
				return res.json(user);
			} catch (error) {
				next(error);
			}
		})
	);

	gatewayExpressApp.delete(
		'/auth/user/:id',
		asyncifyHandler(async (req, res, next) => {
			const row = await User.destroy({ where: { username: req.params.id } });
			if (row > 0) {
				return res.send('Success');
			}
			return ResponseUtil.sendInvalidId(res);
		})
	);
};