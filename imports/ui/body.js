import { Template } from 'meteor/templating';

import './body.html';

Template.body.helpers({
  tasks: [
    { text: 'foo' },
    { text: 'bar' }
  ]
});
