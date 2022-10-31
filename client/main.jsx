import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import { EntryPoint } from '/imports/ui/Entry';
Meteor.startup(() => {
	render(<EntryPoint />, document.getElementById('react-target'));
});
