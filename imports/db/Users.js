import SimpleSchema from 'simpl-schema';

export const UsersCollections = Meteor.users;

export const usersSchema = new SimpleSchema({
	createdAt: {
		type: Date,
		defaultValue: Date.now,
	},
	username: { type: String },
	profile: {
		type: Object,
	},

	'profile.username': {
		type: String,
		defaultValue: '',
	},
	'profile.logonCount': {
		type: Number,
		defaultValue: 0,
	},
	'profile.lockedUntil': {
		type: Date,
		defaultValue: Date.now,
	},
	'profile.isLocked': {
		type: Number,
		defaultValue: 0,
	},
	'profile.isEnabled': {
		type: Number,
		defaultValue: 1,
	},
	'profile.email': {
		type: String,
		optional: true,
	},
	'profile.phoneNumber': {
		type: String,
		optional: true,
	},

	accountType: {
		type: Number,
		defaultValue: 0,
	},
	status: {
		type: Object,
		optional: true,
	},
	'status.lastlogin': {
		type: Object,
		optional: true,
	},
	'status.lastlogin.date': {
		type: Date,
		optional: true,
	},
	'status.lastlogin.ipAddr': {
		type: String,
		optional: true,
	},
	'status.userAgent': {
		type: String,
		optional: true,
	},
	'status.idle': {
		type: Boolean,
		optional: true,
	},
	'status.lastActivity': {
		type: Date,
		optional: true,
	},
	'status.online': {
		type: Boolean,
		optional: true,
	},
});
// UsersCollections.schema = usersSchema;
