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

export default function TodaySales() {

  return (
    <React.Fragment>
      <Title>Today Sales</Title>
      <Stack direction="horizontal" gap={3} className="centered">
        <h1 className="strong">12,631</h1> <h3>K</h3>
        <h5>IDR</h5>
      </Stack>
      <div className="centered text-success">
        <Badge bg="success" > ▲ 10.00 % </Badge>
      </div>
      <div className="centered">
        <h6>vs Yesterday</h6>
      </div>
    </React.Fragment>
  );
}