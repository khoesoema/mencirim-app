import { Mongo } from 'meteor/mongo';
import moment from 'moment-timezone';
import 'moment/locale/id';
import SimpleSchema from 'simpl-schema';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export const LogsCollections = new Mongo.Collection('sys_logs');

export const logsSchema = new SimpleSchema({
	ipAddress: { type: String, regEx: SimpleSchema.RegEx.IPv4 },
	userID: { type: String, regEx: SimpleSchema.RegEx.Id },
	username: { type: String, defaultValue: '' },
	type: { type: String, defaultValue: '' },
	module: { type: String, defaultValue: '' },
	title: { type: String, defaultValue: '' },
	description: { type: String, defaultValue: '' },
	loggedAt: {
		type: Date,
		defaultValue: Date.now,
	},
	accountType: { type: Number, defaultValue: 0 },
});
LogsCollections.schema = logsSchema;

export const ErrorLogsCollections = new Mongo.Collection('sys_error_logs');

export const errorLogsSchema = new SimpleSchema({
	fileName: { type: String },
	callerLine: { type: String },
	errorCodeNum: { type: Number, defaultValue: 0 },
	errorCode: {
		type: String,
		defaultValue: 'E-A-' + moment().format('YYYYMMDD') + '-0000001',
	},
	ipAddress: { type: String, regEx: SimpleSchema.RegEx.IPv4 },
	module: { type: String, defaultValue: '' },
	description: { type: String, defaultValue: '' },
	loggedAt: {
		type: Date,
		defaultValue: Date.now,
	},
	apps: {
		type: String,
		defaultValue: 'AGENT',
	},
});
ErrorLogsCollections.schema = errorLogsSchema;
