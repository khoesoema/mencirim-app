import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const DataUsersCollections = Meteor.users;

export const datausersSchema = new SimpleSchema({
	createdAt: {
		type: Date,
		defaultValue: Date.now,
	},
	username: { type: String },
	name: { type : String },
	role: { type : String},
});

//DataUsersCollections.schema = datausersSchema;
