import * as React from 'react';

import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import Loader from 'rsuite/Loader';
import Title from './Title';

import Stack from 'react-bootstrap/Stack';
import Badge from 'react-bootstrap/Badge';

import { ProductsCollections } from '../../../db/Products';

export default function TodayCustomers() {

  return (
    <React.Fragment>
      <Title>Today Customers</Title>
      <Stack direction="horizontal" gap={3} className="centered">
        <h1 className="strong">226</h1>
      </Stack>
      <div className="centered text-danger">
        <Badge bg="danger" > ▼ 5.50 % </Badge>
      </div>
      <div className="centered">
        <h6>vs Yesterday</h6>
      </div>
    </React.Fragment>
  );
}