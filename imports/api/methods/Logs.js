import moment from 'moment-timezone';
import 'moment/locale/id';
import {
	ErrorLogsCollections,
	LogsCollections,
	logsSchema,
} from '../../db/Logs';
import { UsersCollections } from '../../db/Users';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');
// const token = '5102929348:AAFAFcA-5WQJbDAnazSPIB8YGbn6rQrA8kE';
// const myTeleID = '5006234772';

// const bot = Promise.await(
// 	new TelegramBot(token, {
// 		polling: true,
// 	})
// );
// bot.sendMessage(myTeleID, 'Bot Started');
export function addLog(caller, data) {
	// // console.log(caller);

	// let clientIP = caller.connection.httpHeaders['x-forwarded-for'];
	let ipAddresses =
		caller.connection.httpHeaders['x-forwarded-for'].split(',');
	// console.log(ipAddresses);

	let clientIP = ipAddresses[0];
	let user = UsersCollections.findOne({ _id: caller.userId });

	if (user) {
		LogsCollections.insert({
			ipAddress: clientIP,
			userID: caller.userId,
			username: user.username,
			type: data.type,
			module: data.module,
			title: data.title,
			description: data.description,
			loggedAt: new Date(),
			accountType: user.accountType,
			modifiedAt: new Date(),
			createdAt: new Date(),
		});
	}
}

export function addLoginLog(userID, clientIP, data) {
	// // console.log(caller);

	let user = UsersCollections.findOne({ _id: userID });

	if (user) {
		logsSchema.validate({
			ipAddress: clientIP,
			userID: userID,
			username: user.profile.username,
			type: data.type,
			module: data.module,
			title: data.title,
			description: data.description,
			loggedAt: new Date(),
			accountType: user.accountType,
		});

		LogsCollections.insert({
			ipAddress: clientIP,
			userID: userID,
			username: user.profile.username,
			type: data.type,
			module: data.module,
			title: data.title,
			description: data.description,
			loggedAt: new Date(),
			accountType: user.accountType,
			modifiedAt: new Date(),
			createdAt: new Date(),
		});
	}
}

export function addErrorLog(
	callerLine,
	fileName,
	caller,
	apps,
	module,
	description,
	session = undefined,
	ipAddress = undefined
) {
	let clientIP = '127.0.0.1';
	if (ipAddress !== undefined) {
		let ipAddresses =
			caller.connection.httpHeaders['x-forwarded-for'].split(',');
		clientIP = ipAddresses[0];
	}
	let todayDateFormatString = moment().format('YYYYMMDD');
	let pastErrorCode = 'E-A-' + todayDateFormatString + '-0000001';
	let lastErrorLog = {};

	if (session) {
		lastErrorLog = ErrorLogsCollections.findOne(
			{
				loggedAt: {
					$gte: moment().startOf('day').toDate(),
					$lte: moment().endOf('day').toDate(),
				},
			},
			{ sort: { loggedAt: -1 } }
		);
	} else {
		lastErrorLog = ErrorLogsCollections.findOne(
			{
				loggedAt: {
					$gte: moment().startOf('day').toDate(),
					$lte: moment().endOf('day').toDate(),
				},
			},
			{ sort: { loggedAt: -1 } }
		);
	}
	if (lastErrorLog) {
		pastErrorCode = lastErrorLog.errorCode;
	}

	let pastErrorCodeArr = pastErrorCode.split('-');
	let pastErrorCodeNum = Number(pastErrorCodeArr[3]);
	let errorCodeNum = pastErrorCodeNum + 1;

	let errorCode =
		'E-A-' +
		todayDateFormatString +
		'-' +
		('' + errorCodeNum).padStart(6, '0');

	if (session) {
		ErrorLogsCollections.insert({
			callerLine,
			fileName,
			apps,
			errorCodeNum,
			errorCode,
			ipAddress: clientIP,
			module,
			description,
			loggedAt: new Date(),
		});
	} else {
		ErrorLogsCollections.insert({
			callerLine,
			fileName,
			apps,
			errorCodeNum,
			errorCode,
			ipAddress: clientIP,
			module,
			description,
			loggedAt: new Date(),
		});
	}
	// bot.sendMessage(
	// 	myTeleID,
	// 	'Caller line : ' +
	// 		callerLine +
	// 		'\n' +
	// 		'Filename : ' +
	// 		fileName +
	// 		'\n' +
	// 		'Apps : ' +
	// 		apps +
	// 		'\n' +
	// 		'Error Code : ' +
	// 		errorCode +
	// 		'\n' +
	// 		'IP Address : ' +
	// 		clientIP +
	// 		'\n' +
	// 		'Module : ' +
	// 		module +
	// 		'\n' +
	// 		'Record At : ' +
	// 		moment().format('YYYY-MM-DD HH:mm:ss.SSS') +
	// 		'\n' +
	// 		'Description : ' +
	// 		description
	// );

	return errorCode;
}
