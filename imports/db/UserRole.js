import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const UserRoleCollections = new Mongo.Collection('user_role');

export const userRoleSchema = new SimpleSchema({
	roleid: { type : String},
	roledesc: { type : String},
    createdAt: {
		type: Date,
		defaultValue: Date.now,
	},
});

UserRoleCollections.schema = userRoleSchema;
